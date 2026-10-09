/**
 * Remix Studio pipeline: source properties -> an original property's
 * development pack. A fixed workflow, not an open-ended agent: five Claude
 * calls in order, each building on the last, each saved as it lands so a
 * failure part-way keeps everything made before it.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { PropertyScore } from "../../src/lib/scoring";
import { sizzleRuntime, type Art, type Concept, type Sizzle, type StudioEvent, type StudioStep, type Verdict } from "../../src/lib/studio";
import { sanitizeSvg } from "./svg";

export type StudioOptions = {
  apiKey: string;
  model: string;
  fetch?: typeof fetch;
};

export type StudioInput = {
  sources: PropertyScore[];
  format: string;
};

/** Renders the poster and keyframes from the sizzle; injected so the pipeline stays testable. */
export type RenderArt = (sizzle: Sizzle) => Promise<Omit<Art, "posterSvg">>;

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

const sizzleSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "tagline", "style_bible", "poster_prompt", "shots"],
  properties: {
    title: { type: "string" },
    tagline: { type: "string", description: "The one-line hook printed on the poster." },
    style_bible: { type: "string", description: "One paragraph prepended to every keyframe prompt: film stock or render style, palette, lighting, lens, era detail, and a fixed visual description of each recurring character so they look the same in every frame. No real people, no brands." },
    poster_prompt: { type: "string", description: "A full image prompt for the theatrical one-sheet, portrait 2:3. Include the exact title and tagline as text to render, a small credit block at the bottom, the key art composition, and the style." },
    shots: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["seconds", "image_prompt", "camera", "on_screen_text", "speaker", "line", "music"],
        properties: {
          seconds: { type: "integer", description: "4 to 8." },
          image_prompt: { type: "string", description: "The keyframe for this shot as a cinematic film still: subject, action, setting, framing, light. No text, captions, logos, or watermarks in the image." },
          camera: { type: "string", enum: ["push_in", "pull_out", "pan_left", "pan_right", "tilt_up", "tilt_down", "static"] },
          on_screen_text: { type: "string", description: "Title card text drawn over the frame, or empty." },
          speaker: { type: "string", description: "NARRATOR or a character name, or empty." },
          line: { type: "string", description: "Voice-over or dialogue, or empty." },
          music: { type: "string", description: "Music or sound cue, or empty." },
        },
      },
    },
  },
};

const VERDICT_DIMENSIONS = ["Originality", "Audience fit", "Story engine", "Production feasibility", "Rights distance", "Franchise potential"];

const verdictSchema = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "summary", "scores", "strengths", "concerns", "rights_flags", "next_steps", "audience_test_questions"],
  properties: {
    verdict: { type: "string", enum: ["develop", "revise", "pass"] },
    summary: { type: "string", description: "Two or three sentences: the call and the main reason." },
    scores: {
      type: "array",
      description: `Exactly these six dimensions, in order: ${VERDICT_DIMENSIONS.join(", ")}.`,
      items: { type: "object", additionalProperties: false, required: ["dimension", "score", "note"], properties: { dimension: { type: "string" }, score: { type: "integer", description: "1 (weak) to 5 (strong)." }, note: { type: "string" } } },
    },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    rights_flags: { type: "array", description: "Anything in the pack that echoes a source too closely. Empty if none.", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
    audience_test_questions: { type: "array", description: "Questions to put to a test audience shown the poster and sizzle.", items: { type: "string" } },
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
  renderArt?: RenderArt,
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
    // Provenance must name every selected source exactly once, and nothing else.
    // One-to-one: an entry serves one source, and a label naming two sources is ambiguous.
    const names = input.sources.map((p) => p.name.toLowerCase());
    const matchesName = (label: string, name: string) => label === name || label.includes(name);
    const entries = (concept.borrowed_mechanics ?? []).map((m) => ({ label: String(m?.source ?? "").trim().toLowerCase(), mechanic: String(m?.mechanic ?? ""), used: false }));
    const mechanics = input.sources.map((p, i) => {
      const hit = entries.find((e) => !e.used && e.label && e.mechanic && matchesName(e.label, names[i]) && names.filter((n) => matchesName(e.label, n)).length === 1);
      if (!hit) return null;
      hit.used = true;
      return { source: p.name, mechanic: hit.mechanic };
    });
    if (mechanics.some((m) => !m)) throw new StepError("The concept did not say what it borrows from every source.");
    concept.borrowed_mechanics = mechanics as Concept["borrowed_mechanics"];
    concept.format = input.format;   // the format the user picked, everywhere
    await save(step, concept);
    await emit({ type: "result", step, data: concept });
    const conceptJson = JSON.stringify(concept);

    // 2. Opening pages (kept for development; the sizzle is what people watch)
    step = "screenplay";
    await emit({ type: "step", step });
    const screenplay = await call(
      `Write the opening pages of this ${input.format}: about three minutes of screen time, roughly three pages.\nConcept: ${conceptJson}\n\nRequirements:\n- Fountain screenplay format, plain text only: scene headings like INT. PLACE - DAY, action lines, CHARACTER names in capitals on their own line before dialogue, parentheticals in brackets on their own line, transitions like CUT TO: on their own line.\n- Start with a title line "Title: <title>" then a blank line.\n- Open with a hook that sells the premise in the first 30 seconds and end on a button that makes the viewer want the next scene.\n- Only the new property's own characters and world.\n${input.format === "Video Game" ? "- For a video game, write the opening cinematic and the first playable moment, with gameplay described in action lines." : ""}`,
      { effort: "medium" },
    );
    if (screenplay.length < 400) throw new StepError("The opening pages came back too short.");
    await save(step, screenplay);
    await emit({ type: "result", step, data: screenplay });

    // 3. Sizzle shot list, style bible, and poster prompt
    step = "sizzle";
    await emit({ type: "step", step });
    const sizzle = json<Sizzle>(await call(
      `Cut a 45-60 second sizzle reel that sells this ${input.format} to a buyer who will not read a script.\nConcept: ${conceptJson}\nOpening pages, for tone and lines you may reuse:\n${screenplay}\n\nRules:\n- 7 to 9 shots, 4 to 8 seconds each, 45 to 60 seconds in total.\n- Arc: a cold-open image that hooks, the world, the lead, the conflict, escalation, a title card shot, one final button.\n- Every image_prompt is a single cinematic keyframe a generator can render; it must stand on its own (repeat who and where) and match the style_bible. No text in the images; titles go in on_screen_text.\n- Vary the camera moves. Give the title card shot on_screen_text equal to the title.\n- Voice lines are short and punchy; a NARRATOR may carry the pitch.\n- No real people, actors, brands, or anything from the source properties.`,
      { effort: "medium", schema: sizzleSchema },
    ));
    // The schema describes the limits; enforce them so the player and export stay 30-75 seconds.
    // One name across the page, player, export, title card, and poster prompt.
    if (sizzle.title && sizzle.title !== concept.title) {
      const old = new RegExp(sizzle.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      sizzle.poster_prompt = sizzle.poster_prompt.replace(old, concept.title);
      sizzle.shots = sizzle.shots.map((s) => ({ ...s, on_screen_text: s.on_screen_text.replace(old, concept.title) }));
    }
    sizzle.title = concept.title;
    if (sizzle.shots.length < 5 || sizzle.shots.length > 12) throw new StepError(`The sizzle came back with ${sizzle.shots.length} shots; it needs 7 to 9.`);
    sizzle.shots = sizzle.shots.map((s) => ({ ...s, seconds: Math.min(8, Math.max(3, Math.round(Number(s.seconds) || 5))) }));
    const runtime = sizzleRuntime(sizzle);
    if (runtime < 30 || runtime > 75) throw new StepError(`The sizzle came back at ${runtime} seconds; it needs 45 to 60.`);
    await save(step, sizzle);
    await emit({ type: "result", step, data: sizzle });

    // 4. Art: generated poster and keyframes; SVG poster if images are unavailable
    step = "art";
    await emit({ type: "step", step });
    let art: Art = { posterImage: null, posterSvg: null, shotImages: sizzle.shots.map(() => null), note: "No image model configured." };
    if (renderArt) {
      const rendered = await renderArt(sizzle);
      art = { ...rendered, posterSvg: null };
    }
    // Malformed or oversized SVG sanitizes to null: ask once more, then fail the step.
    for (let attempt = 0; !art.posterImage && !art.posterSvg && attempt < 2; attempt++) {
      const posterText = await call(
        `Design the one-sheet poster for this property as a single SVG.\nConcept: ${conceptJson}\nTagline: ${sizzle.tagline}\n\nRequirements:\n- Output ONLY the SVG markup, starting with <svg and ending with </svg>. No prose, no code fence.\n- viewBox="0 0 600 900" with width="600" height="900", xmlns set.\n- Built from shapes, paths, gradients (linearGradient, radialGradient in <defs>), and text only. No <image>, <style>, <script>, <foreignObject>, <use>, external links, or web fonts. Use font-family serif, sans-serif, or monospace, with presentation attributes.\n- Show the title large, the tagline, and a credit block at the bottom in small condensed text. A strong single key image built from geometry, following: ${sizzle.style_bible}\n- Every text element must fit inside the 600 px width.\n- Do not use any source property's name, logo, or characters.`,
        { effort: "medium" },
      );
      art.posterSvg = sanitizeSvg(posterText);
    }
    if (!art.posterImage && !art.posterSvg) throw new StepError("The poster could not be drawn.");
    await save(step, art);
    await emit({ type: "result", step, data: art });

    // 5. Greenlight verdict
    step = "verdict";
    await emit({ type: "step", step });
    const verdict = json<Verdict>(await call(
      `Act as a skeptical development executive. Decide whether this pack deserves development money.\nSource properties: ${brief}\nConcept: ${conceptJson}\nOpening pages:\n${screenplay}\nSizzle shots: ${JSON.stringify(sizzle.shots)}\n\nJudge the work itself: originality, audience fit, story engine, production feasibility, rights distance from the sources, and franchise potential. Flag anything that echoes a source too closely. This is a creative judgment, not a market forecast; never predict revenue or ratings.`,
      { effort: "medium", schema: verdictSchema },
    ));
    // Exactly the six dimensions, by name, in order; duplicates and extras are dropped.
    const given = new Map<string, Verdict["scores"][number]>();
    for (const s of verdict.scores ?? []) {
      const key = String(s?.dimension ?? "").trim().toLowerCase();
      if (key && !given.has(key)) given.set(key, s);
    }
    const scores = VERDICT_DIMENSIONS.map((dimension) => {
      const s = given.get(dimension.toLowerCase());
      return s ? { dimension, score: Math.min(5, Math.max(1, Math.round(Number(s.score) || 1))), note: String(s.note ?? "") } : null;
    });
    if (scores.some((s) => !s)) throw new StepError("The verdict came back without all six scores.");
    verdict.scores = scores as Verdict["scores"];
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
