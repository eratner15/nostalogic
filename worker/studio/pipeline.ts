/**
 * Remix Studio pipeline: source properties -> an original property's
 * development pack. A fixed workflow, not an open-ended agent: five Claude
 * calls in order, each building on the last, each saved as it lands so a
 * failure part-way keeps everything made before it.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { PropertyScore } from "../../src/lib/scoring";
import type { Concept, PreviewKind, Preview, StudioEvent, StudioStep, Verdict } from "../../src/lib/studio";
import { sanitizeSvg } from "./svg";

export type StudioOptions = {
  apiKey: string;
  model: string;
  fetch?: typeof fetch;
};

export type StudioInput = {
  sources: PropertyScore[];
  format: string;
  previewKind: PreviewKind;
};

export type StudioUsage = { input: number; output: number };

class StepError extends Error {}

const SYSTEM = `You are the development team inside NostalDamus, a studio tool that scores dormant 1993-1998 entertainment IP. You turn a blend of source properties into ONE original property and its development pack.

Rights rules, which override everything else:
- The result is a NEW property. Borrow mechanics, structures, tones, and audience promises from the sources. Never borrow expression.
- Never use a source's title, character names, catchphrases, logos, theme songs, lyrics, or plot events in the new property's title, characters, dialogue, poster, or trailer. Invent new names.
- Never imitate a real living person, and never name a real actor for a role.

House style:
- Concrete and specific. Short sentences. No em dashes.
- No claims of box office, ratings, accuracy, or guaranteed success.`;

const conceptSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "logline", "format", "tone", "audience", "premise", "world", "story_engine", "characters", "borrowed_mechanics", "new_elements", "visual_style", "risks"],
  properties: {
    title: { type: "string" },
    logline: { type: "string", description: "Two sentences at most." },
    format: { type: "string" },
    tone: { type: "string" },
    audience: { type: "string" },
    premise: { type: "string", description: "One paragraph." },
    world: { type: "string" },
    story_engine: { type: "string", description: "What generates episodes, levels, or sequels." },
    characters: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["name", "role", "description"], properties: { name: { type: "string" }, role: { type: "string" }, description: { type: "string" } } },
    },
    borrowed_mechanics: {
      type: "array",
      description: "One entry per source: the mechanic it contributes, never its expression.",
      items: { type: "object", additionalProperties: false, required: ["source", "mechanic"], properties: { source: { type: "string" }, mechanic: { type: "string" } } },
    },
    new_elements: { type: "array", items: { type: "string" } },
    visual_style: { type: "string", description: "Palette, typography mood, and key image, for the poster designer." },
    risks: { type: "array", items: { type: "string" } },
  },
};

const previewSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "beats"],
  properties: {
    title: { type: "string" },
    beats: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["seconds", "visual", "on_screen_text", "audio", "speaker", "line"],
        properties: {
          seconds: { type: "integer", description: "How long this beat holds on screen, 2-10." },
          visual: { type: "string", description: "What the camera sees, one or two sentences." },
          on_screen_text: { type: "string", description: "Title card or caption text, or empty." },
          audio: { type: "string", description: "Music and sound cue, or empty." },
          speaker: { type: "string", description: "Who speaks (a character name, or NARRATOR), or empty." },
          line: { type: "string", description: "The spoken line, or empty." },
        },
      },
    },
  },
};

const verdictSchema = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "summary", "scores", "strengths", "concerns", "rights_flags", "next_steps", "audience_test_questions"],
  properties: {
    verdict: { type: "string", enum: ["develop", "revise", "pass"] },
    summary: { type: "string", description: "Two or three sentences: the call and the main reason." },
    scores: {
      type: "array",
      description: "Exactly these dimensions: Originality, Audience fit, Story engine, Production feasibility, Rights distance, Franchise potential.",
      items: { type: "object", additionalProperties: false, required: ["dimension", "score", "note"], properties: { dimension: { type: "string" }, score: { type: "integer", description: "1 (weak) to 5 (strong)." }, note: { type: "string" } } },
    },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    rights_flags: { type: "array", description: "Anything in the pack that echoes a source too closely. Empty if none.", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
    audience_test_questions: { type: "array", description: "Questions to put to a test audience shown the poster and preview.", items: { type: "string" } },
  },
};

function sourceBrief(sources: PropertyScore[]) {
  return JSON.stringify(sources.map((p) => ({
    name: p.name,
    year: p.year,
    category: p.category,
    genre: p.genre,
    readiness: p.revivalReadinessScore,
    risk: p.riskScore,
    description: p.briefDescription,
    coreAudience: p.coreAudience,
    currentSignal: p.currentSignal,
    preserve: p.preserve,
    update: p.update,
  })));
}

export async function runStudio(
  input: StudioInput,
  options: StudioOptions,
  emit: (event: StudioEvent) => void | Promise<void>,
  save: (step: StudioStep, value: unknown) => Promise<void>,
): Promise<{ ok: boolean; usage: StudioUsage }> {
  const client = new Anthropic({ apiKey: options.apiKey, fetch: options.fetch, maxRetries: 1 });
  const usage: StudioUsage = { input: 0, output: 0 };

  const call = async (prompt: string, opts: { effort: "low" | "medium" | "high"; schema?: object }): Promise<string> => {
    const response = await client.beta.messages.create({
      model: options.model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: opts.effort, ...(opts.schema ? { format: { type: "json_schema" as const, schema: opts.schema as Record<string, unknown> } } : {}) },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: prompt }],
    });
    usage.input += response.usage.input_tokens;
    usage.output += response.usage.output_tokens;
    if (response.stop_reason === "refusal") throw new StepError("The model declined this step. Try different sources.");
    if (response.stop_reason === "max_tokens") throw new StepError("The step ran out of room before finishing.");
    return response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
  };

  const json = <T>(text: string): T => {
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new StepError("The step returned malformed data.");
    }
  };

  const brief = sourceBrief(input.sources);
  let step: StudioStep = "concept";
  try {
    // 1. Concept
    await emit({ type: "step", step });
    const concept = json<Concept>(await call(
      `Format: ${input.format}\nSource properties (data from the NostalDamus library):\n${brief}\n\nBlend these into ONE original ${input.format}. Give it 3-5 characters with new names. In borrowed_mechanics, give one entry per source.`,
      { effort: "medium", schema: conceptSchema },
    ));
    await save(step, concept);
    await emit({ type: "result", step, data: concept });
    const conceptJson = JSON.stringify(concept);

    // 2. Poster
    step = "poster";
    await emit({ type: "step", step });
    const posterText = await call(
      `Design the one-sheet poster for this property as a single SVG.\nConcept: ${conceptJson}\n\nRequirements:\n- Output ONLY the SVG markup, starting with <svg and ending with </svg>. No prose, no code fence.\n- viewBox="0 0 600 900" with width="600" height="900", xmlns set.\n- Built from shapes, paths, gradients (linearGradient, radialGradient in <defs>), and text only. No <image>, <style>, <script>, <foreignObject>, <use>, external links, or web fonts. Use font-family serif, sans-serif, or monospace, with presentation attributes.\n- Show the title large, the tagline, and a credit block at the bottom in small condensed text. A strong single key image built from geometry, following the visual_style.\n- Every text element must fit inside the 600 px width.\n- Do not use any source property's name, logo, or characters.`,
      { effort: "medium" },
    );
    const posterSvg = sanitizeSvg(posterText);
    if (!posterSvg) throw new StepError("The poster came back without a usable SVG.");
    await save(step, posterSvg);
    await emit({ type: "result", step, data: posterSvg });

    // 3. Screenplay: the opening pages
    step = "screenplay";
    await emit({ type: "step", step });
    const screenplay = await call(
      `Write the opening pages of this ${input.format}: about three minutes of screen time, roughly three pages.\nConcept: ${conceptJson}\n\nRequirements:\n- Fountain screenplay format, plain text only: scene headings like INT. PLACE - DAY, action lines, CHARACTER names in capitals on their own line before dialogue, parentheticals in brackets on their own line, transitions like CUT TO: on their own line.\n- Start with a title line "Title: <title>" then a blank line.\n- Open with a hook that sells the premise in the first 30 seconds and end on a button that makes the viewer want the next scene.\n- Only the new property's own characters and world.\n${input.format === "Video Game" ? "- For a video game, write the opening cinematic and the first playable moment, with gameplay described in action lines." : ""}`,
      { effort: "medium" },
    );
    if (screenplay.length < 400) throw new StepError("The opening pages came back too short.");
    await save(step, screenplay);
    await emit({ type: "result", step, data: screenplay });

    // 4. Preview: trailer or staged opening scene
    step = "preview";
    await emit({ type: "step", step });
    const previewPrompt = input.previewKind === "trailer"
      ? `Cut a 60-90 second teaser trailer for this property as timed beats.\nConcept: ${conceptJson}\nOpening pages, for tone and lines you may reuse:\n${screenplay}\n\nRules: 12-20 beats; each beat 2-8 seconds; seconds across all beats total 60-90. Build: cold hook, world, conflict, escalation, title card with the title, one final button. Use on_screen_text for title cards. Use audio for music and sound. Lines come from the characters or a NARRATOR.`
      : `Stage the opening pages as a playable scene: timed beats a viewer watches with captions.\nConcept: ${conceptJson}\nOpening pages:\n${screenplay}\n\nRules: follow the pages in order; one beat per moment of action or line of dialogue; each beat 2-10 seconds; 15-30 beats; keep the dialogue as written. Use on_screen_text only for scene headings or title cards.`;
    const preview = json<Omit<Preview, "kind">>(await call(previewPrompt, { effort: "medium", schema: previewSchema }));
    const previewWithKind: Preview = { kind: input.previewKind, title: preview.title, beats: preview.beats.slice(0, 40) };
    if (!previewWithKind.beats.length) throw new StepError("The preview came back with no beats.");
    await save(step, previewWithKind);
    await emit({ type: "result", step, data: previewWithKind });

    // 5. Greenlight verdict
    step = "verdict";
    await emit({ type: "step", step });
    const verdict = json<Verdict>(await call(
      `Act as a skeptical development executive. Decide whether this pack deserves development money.\nSource properties: ${brief}\nConcept: ${conceptJson}\nOpening pages:\n${screenplay}\nPreview beats: ${JSON.stringify(previewWithKind.beats)}\n\nJudge the work itself: originality, audience fit, story engine, production feasibility, rights distance from the sources, and franchise potential. Flag anything that echoes a source too closely. This is a creative judgment, not a market forecast; never predict revenue or ratings.`,
      { effort: "medium", schema: verdictSchema },
    ));
    await save(step, verdict);
    await emit({ type: "result", step, data: verdict });
    return { ok: true, usage };
  } catch (error) {
    const message = error instanceof StepError ? error.message
      : error instanceof Anthropic.APIError ? describeApiError(error)
      : "The studio step failed unexpectedly.";
    await emit({ type: "error", step, message });
    return { ok: false, usage };
  }
}

function describeApiError(error: InstanceType<typeof Anthropic.APIError>): string {
  if (error instanceof Anthropic.AuthenticationError) return "The Anthropic API key was rejected.";
  if (error instanceof Anthropic.RateLimitError) return "The model is rate limited right now. Try again in a minute.";
  if (error instanceof Anthropic.BadRequestError && /credit|billing|balance/i.test(error.message)) {
    return "The Anthropic account has no usable API credit for this key.";
  }
  return `Model call failed (${error.status ?? "network"}).`;
}
