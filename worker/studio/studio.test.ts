/**
 * Remix Studio tests: the five-step pipeline against a scripted fake model
 * (no API key or network), and the poster SVG sanitizer.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import corpus from "../../data/corpus.json";
import { scoreAll, type Property } from "../../src/lib/scoring";
import type { StudioEvent, StudioStep } from "../../src/lib/studio";
import { runStudio } from "./pipeline";
import { sanitizeSvg } from "./svg";

const library = scoreAll(corpus as Property[]);
const sources = library.filter((p) => ["tamagotchi-1996", "daria-1997"].includes(p.id));

const concept = {
  title: "Pocket Static", logline: "A deadpan teen raises a digital creature that grades her town.", format: "Animated Series",
  tone: "dry", audience: "Millennials and teens", premise: "p", world: "w", story_engine: "e",
  characters: [{ name: "Vera Kell", role: "lead", description: "d" }],
  borrowed_mechanics: [{ source: "Tamagotchi", mechanic: "care loop" }, { source: "Daria", mechanic: "deadpan narrator" }],
  new_elements: ["grading creature"], visual_style: "acid green on charcoal", risks: ["r"],
};
const preview = { title: "Pocket Static teaser", beats: [{ seconds: 4, visual: "A cracked screen glows.", on_screen_text: "", audio: "hum", speaker: "VERA", line: "It judges everyone." }] };
const verdict = {
  verdict: "develop", summary: "s", scores: [{ dimension: "Originality", score: 4, note: "n" }],
  strengths: ["a"], concerns: ["b"], rights_flags: [], next_steps: ["c"], audience_test_questions: ["q"],
};
const poster = `Here you go:\n<svg viewBox="0 0 600 900" width="600" height="900" onload="alert(1)"><script>alert(2)</script><defs><linearGradient id="g"/></defs><rect fill="url(#g)" width="600" height="900"/><image href="https://evil.example/x.png"/><a href="https://evil.example"><text>Click</text></a><text x="20" y="80">POCKET STATIC</text></svg>`;
const screenplay = `Title: Pocket Static\n\nINT. VERA'S BEDROOM - NIGHT\n\n${"A cracked handheld glows on the nightstand. ".repeat(12)}\n\nVERA\nIt judges everyone.\n\nCUT TO:`;

const usage = { input_tokens: 50, output_tokens: 10, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
const message = (text: string, stop_reason = "end_turn") => ({
  id: "msg", type: "message", role: "assistant", model: "claude-opus-5-5", content: [{ type: "text", text }], stop_reason, stop_sequence: null, usage,
});

function fakeModel(texts: { text: string; stop?: string }[]) {
  const bodies: Record<string, unknown>[] = [];
  const fetchImpl = (async (_url: unknown, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    const next = texts[bodies.length - 1];
    if (!next) throw new Error("fake model ran out of responses");
    return new Response(JSON.stringify(message(next.text, next.stop)), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { fetchImpl, bodies };
}

test("studio runs five steps in order, saves each, and sanitizes the poster", async () => {
  const { fetchImpl, bodies } = fakeModel([
    { text: JSON.stringify(concept) }, { text: poster }, { text: screenplay }, { text: JSON.stringify(preview) }, { text: JSON.stringify(verdict) },
  ]);
  const events: StudioEvent[] = [];
  const saved = new Map<StudioStep, unknown>();
  const result = await runStudio(
    { sources, format: "Animated Series", previewKind: "trailer" },
    { apiKey: "test", model: "claude-opus-5-5", fetch: fetchImpl },
    (e) => { events.push(e); },
    async (step, value) => { saved.set(step, value); },
  );

  assert.equal(result.ok, true);
  assert.equal(result.usage.input, 250);
  assert.deepEqual([...saved.keys()], ["concept", "poster", "screenplay", "preview", "verdict"]);
  assert.deepEqual(events.filter((e) => e.type === "step").map((e) => (e as { step: string }).step), ["concept", "poster", "screenplay", "preview", "verdict"]);

  const svg = String(saved.get("poster"));
  assert.ok(svg.startsWith("<svg"));
  assert.ok(!/script|onload|evil\.example|<image|<a\b/i.test(svg), svg);
  assert.match(svg, /url\(#g\)/);                       // local gradient references survive
  assert.match(svg, /POCKET STATIC/);

  assert.equal((saved.get("preview") as { kind: string }).kind, "trailer");

  // Concept, preview, and verdict ask for structured JSON; poster and screenplay are free text.
  const formats = bodies.map((b) => Boolean((b.output_config as { format?: unknown }).format));
  assert.deepEqual(formats, [true, false, false, true, true]);
  assert.equal(bodies[0].fallbacks, "default");
});

test("a failed step stops the run, reports the step, and keeps earlier work", async () => {
  const { fetchImpl } = fakeModel([{ text: JSON.stringify(concept) }, { text: "Sorry, no SVG today." }]);
  const events: StudioEvent[] = [];
  const saved = new Map<StudioStep, unknown>();
  const result = await runStudio(
    { sources, format: "Feature Film", previewKind: "scene" },
    { apiKey: "test", model: "claude-opus-5-5", fetch: fetchImpl },
    (e) => { events.push(e); },
    async (step, value) => { saved.set(step, value); },
  );
  assert.equal(result.ok, false);
  assert.deepEqual([...saved.keys()], ["concept"]);
  const error = events.at(-1) as { type: string; step?: string };
  assert.equal(error.type, "error");
  assert.equal(error.step, "poster");
});

test("a refusal is reported as an error, not thrown", async () => {
  const { fetchImpl } = fakeModel([{ text: "", stop: "refusal" }]);
  const events: StudioEvent[] = [];
  const result = await runStudio(
    { sources, format: "Video Game", previewKind: "trailer" },
    { apiKey: "test", model: "claude-opus-5-5", fetch: fetchImpl },
    (e) => { events.push(e); },
    async () => {},
  );
  assert.equal(result.ok, false);
  assert.equal(events.at(-1)?.type, "error");
});

test("sanitizeSvg rejects text with no svg and adds a namespace", () => {
  assert.equal(sanitizeSvg("no drawing here"), null);
  assert.match(sanitizeSvg("<svg viewBox='0 0 10 10'><rect/></svg>") ?? "", /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});
