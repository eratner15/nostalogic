/**
 * The Prophet: a tool-using search agent over the scored library.
 *
 * Manual agentic loop (rather than the SDK tool runner) so every tool call can
 * be streamed to the browser as a visible research step. The conversation is
 * append-only: assistant content is pushed back unchanged on every turn.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { PropertyScore } from "../../src/lib/scoring";
import { runTool, TOOLS } from "./tools";

export const DEFAULT_AGENT_MODEL = "claude-opus-5-5";
const MAX_TURNS = 8;

export type AgentEvent =
  | { type: "step"; tool: string; input: unknown; summary: string; ids: string[]; isError: boolean }
  | { type: "answer"; text: string; cited: string[] }
  | { type: "error"; message: string }
  | { type: "done"; turns: number; usage: Usage; model: string };

export type Usage = { input: number; output: number; cacheRead: number; cacheWrite: number };

export type HistoryTurn = { role: "user" | "assistant"; content: string };

export type AgentOptions = {
  apiKey: string;
  model?: string;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  /** Injected for tests; defaults to the platform fetch. */
  fetch?: typeof fetch;
};

const SYSTEM_PROMPT = `You are the Prophet, the research agent inside NostalDamus. NostalDamus scores dormant entertainment and pop-culture IP from 1993-1998 (movies, TV, music, video games, toys and fads, tech, sports media) for revival readiness.

You answer by searching the library with your tools. The library is the only source of truth: never state a score, year, category, or fact about a property that a tool did not return. If the library cannot answer, say so and name the closest properties it does hold.

How the numbers work, so you can explain them:
- Revival Readiness (0-100) = Social Buzz x 0.30 + Nostalgia Window Alignment x 0.40 + Modern Relevance x 0.30.
- Nostalgia Window Alignment peaks when the original 12-year-old audience is 40 today; the 35-45 band is the "Sweet Spot" timing stage, younger is "Pre-Peak", older is "Mature".
- Risk (0-100) blends rights complexity, cultural-sensitivity drag, and creator availability. Lower is better.
- Score inputs are hand-authored judgments under a versioned rubric. The score is a transparent ranking heuristic, not a validated predictor. Never claim prediction accuracy, ROI, or guaranteed outcomes.

Research approach:
- Translate the question into filters (category, years, timing stage, readiness and risk thresholds) plus a few distinctive query words. Run several searches when the question has parts, and use library_overview for market-level questions.
- Open full records with get_properties before recommending something specific, so preserve/update guidance and audience details come from the data.
- For remix or pairing questions, use find_similar with different_category set to true.

Answer format:
- Lead with the direct answer in one or two sentences, then the supporting evidence.
- Cite every property you mention as [[property-id]] using the exact id from the tools, immediately after its name, for example: Daria [[daria-1997]]. The interface turns these into links.
- Quote readiness and risk numbers exactly as returned. Keep it under 250 words unless the user asks for depth. Use short paragraphs or a compact list; no tables.`;

function extractCitations(text: string, library: PropertyScore[]): string[] {
  const known = new Set(library.map((p) => p.id));
  const seen = new Set<string>();
  for (const match of text.matchAll(/\[\[([a-z0-9-]+)\]\]/g)) {
    if (known.has(match[1])) seen.add(match[1]);
  }
  return [...seen];
}

export async function runAgent(
  question: string,
  history: HistoryTurn[],
  library: PropertyScore[],
  options: AgentOptions,
  emit: (event: AgentEvent) => void | Promise<void>,
): Promise<{ answer: string; cited: string[]; steps: { tool: string; input: unknown; summary: string }[]; usage: Usage; model: string } | null> {
  const model = options.model || DEFAULT_AGENT_MODEL;
  const client = new Anthropic({ apiKey: options.apiKey, fetch: options.fetch, maxRetries: 1 });
  const usage: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  const steps: { tool: string; input: unknown; summary: string }[] = [];

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: "user", content: question },
  ];

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const finalTurn = turn === MAX_TURNS;
    let response: Anthropic.Beta.BetaMessage;
    try {
      response = await client.beta.messages.create({
        model,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: options.effort ?? "medium" },
        // Tools render before system, so this breakpoint caches both.
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: TOOLS,
        tool_choice: finalTurn ? { type: "none" } : { type: "auto" },
        messages,
      });
    } catch (error) {
      await emit({ type: "error", message: describeError(error) });
      return null;
    }

    usage.input += response.usage.input_tokens;
    usage.output += response.usage.output_tokens;
    usage.cacheRead += response.usage.cache_read_input_tokens ?? 0;
    usage.cacheWrite += response.usage.cache_creation_input_tokens ?? 0;

    if (response.stop_reason === "refusal") {
      await emit({ type: "error", message: "The model declined this question. Try rephrasing it as a question about the library." });
      return null;
    }

    messages.push({ role: "assistant", content: response.content });
    const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      const answer = response.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      const cited = extractCitations(answer, library);
      await emit({ type: "answer", text: answer || "I could not produce an answer from the library.", cited });
      await emit({ type: "done", turns: turn, usage, model: response.model });
      return { answer, cited, steps, usage, model: response.model };
    }

    // Run every tool call from this turn, then return all results in one user message.
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const call of toolUses) {
      const outcome = runTool(library, call.name, call.input);
      steps.push({ tool: call.name, input: call.input, summary: outcome.summary });
      await emit({ type: "step", tool: call.name, input: call.input, summary: outcome.summary, ids: outcome.ids, isError: Boolean(outcome.isError) });
      results.push({ type: "tool_result", tool_use_id: call.id, content: JSON.stringify(outcome.result), is_error: outcome.isError });
    }
    messages.push({ role: "user", content: results });
  }

  await emit({ type: "error", message: "The research ran out of steps before answering. Try a narrower question." });
  return null;
}

function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "The Anthropic API key was rejected. Check the ANTHROPIC_API_KEY secret.";
  if (error instanceof Anthropic.PermissionDeniedError) return "The API key does not have access to this model. Set AGENT_MODEL or check the key's workspace.";
  if (error instanceof Anthropic.RateLimitError) return "The model is rate limited right now. Try again in a minute.";
  if (error instanceof Anthropic.BadRequestError) {
    // Billing problems arrive as 400s; surface the API's own message so they are not mistaken for a code bug.
    return /credit|billing|balance/i.test(error.message)
      ? "The Anthropic account has no usable API credit. Check Plans & Billing in the Claude Console for the workspace that owns this key."
      : `The model rejected the request: ${error.message}`;
  }
  if (error instanceof Anthropic.APIError) return `Model call failed (${error.status ?? "network"}).`;
  return "Model call failed.";
}
