/**
 * Remix Studio tests: the five-step pipeline against a scripted fake model
 * (no API key or network), image generation against a fake OpenAI endpoint,
 * and the SVG poster sanitizer.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import corpus from "../../data/corpus.json";
import { scoreAll, type Property } from "../../src/lib/scoring";
import type { Art, Sizzle, StudioEvent, StudioStep } from "../../src/lib/studio";
import { generateImage, renderToMedia } from "./images";
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
const screenplay = `Title: Pocket Static\n\nINT. VERA'S BEDROOM - NIGHT\n\n${"A cracked handheld glows on the nightstand. ".repeat(12)}\n\nVERA\nIt judges everyone.\n\nCUT TO:`;
const sizzle: Sizzle = {
  title: "Pocket Static", tagline: "It rates everyone.", style_bible: "Flat 2D animation, acid green on charcoal.", poster_prompt: "Key art of a glowing handheld creature.",
  shots: [
    { seconds: 5, image_prompt: "A cracked handheld glowing in a dark drawer.", camera: "push_in", on_screen_text: "", speaker: "", line: "", music: "hum" },
    { seconds: 4, image_prompt: "A food court where every phone lights up.", camera: "pan_left", on_screen_text: "POCKET STATIC", speaker: "NARRATOR", line: "It rates everyone.", music: "" },
    ...Array.from({ length: 5 }, (_, i) => ({ seconds: 7, image_prompt: `Beat ${i + 3}.`, camera: "static" as const, on_screen_text: "", speaker: "", line: "", music: "" })),
  ],
};
const DIMENSIONS = ["Originality", "Audience fit", "Story engine", "Production feasibility", "Rights distance", "Franchise potential"];
const verdict = {
  verdict: "develop", summary: "s", scores: DIMENSIONS.map((dimension) => ({ dimension, score: 4, note: "n" })),
  strengths: ["a"], concerns: ["b"], rights_flags: [], next_steps: ["c"], audience_test_questions: ["q"],
};
const posterSvg = `<svg viewBox="0 0 600 900" onload="alert(1)"><script>alert(2)</script><defs><linearGradient id="g"/></defs><rect fill="url(#g)" width="600" height="900"/><image href="https://evil.example/x.png"/><a href="https://evil.example"><text>Click</text></a><text x="20" y="80">POCKET STATIC</text></svg>`;

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

const run = (texts: { text: string; stop?: string }[], renderArt?: Parameters<typeof runStudio>[4]) => {
  const { fetchImpl, bodies } = fakeModel(texts);
  const events: StudioEvent[] = [];
  const saved = new Map<StudioStep, unknown>();
  const result = runStudio(
    { sources, format: "Animated Series" },
    { apiKey: "test", model: "claude-opus-5-5", fetch: fetchImpl },
    (e) => { events.push(e); },
    async (step, value) => { saved.set(step, value); },
    renderArt,
  );
  return { result, events, saved, bodies };
};

test("with images: five steps in order, generated art saved, no SVG call", async () => {
  const { result, events, saved, bodies } = run(
    [{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: JSON.stringify(verdict) }],
    async (s) => ({ posterImage: "/api/media/studio/x/poster.png", shotImages: s.shots.map((_, i) => `/api/media/studio/x/shot-${i + 1}.png`), note: null }),
  );
  const r = await result;
  assert.equal(r.ok, true);
  assert.deepEqual([...saved.keys()], ["concept", "screenplay", "sizzle", "art", "verdict"]);
  assert.deepEqual(events.filter((e) => e.type === "step").map((e) => (e as { step: string }).step), ["concept", "screenplay", "sizzle", "art", "verdict"]);
  const art = saved.get("art") as Art;
  assert.equal(art.posterImage, "/api/media/studio/x/poster.png");
  assert.equal(art.posterSvg, null);
  assert.equal(art.shotImages.length, 7);
  // Concept, sizzle, and verdict ask for structured JSON; the script is free text.
  assert.deepEqual(bodies.map((b) => Boolean((b.output_config as { format?: unknown }).format)), [true, false, true, true]);
  assert.equal(bodies[0].fallbacks, "default");
});

test("without images: the poster falls back to a sanitized SVG", async () => {
  const { result, saved } = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: posterSvg }, { text: JSON.stringify(verdict) }]);
  assert.equal((await result).ok, true);
  const art = saved.get("art") as Art;
  assert.equal(art.posterImage, null);
  assert.ok(art.posterSvg?.startsWith("<svg"));
  assert.ok(!/script|onload|evil\.example|<image|<a\b/i.test(art.posterSvg ?? ""), art.posterSvg ?? "");
  assert.match(art.posterSvg ?? "", /url\(#g\)/);
  assert.deepEqual(art.shotImages, sizzle.shots.map(() => null));
});

test("an SVG poster that sanitizes to nothing is retried once, then fails the art step", async () => {
  const retried = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: "no drawing" }, { text: posterSvg }, { text: JSON.stringify(verdict) }]);
  assert.equal((await retried.result).ok, true);
  assert.ok((retried.saved.get("art") as Art).posterSvg);
  const failed = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: "no drawing" }, { text: "still none" }]);
  assert.equal((await failed.result).ok, false);
  assert.equal((failed.events.at(-1) as { step?: string }).step, "art");
});

test("a sizzle outside 5-12 shots or 30-75 seconds fails; shot lengths are clamped to 3-8 seconds", async () => {
  const tooFew = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify({ ...sizzle, shots: sizzle.shots.slice(0, 2) }) }]);
  assert.equal((await tooFew.result).ok, false);
  assert.equal((tooFew.events.at(-1) as { step?: string }).step, "sizzle");
  const long = { ...sizzle, shots: sizzle.shots.map((s) => ({ ...s, seconds: 60 })) };
  const clamped = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(long) }], async (s) => ({ posterImage: "/p.png", shotImages: s.shots.map(() => null), note: null }));
  assert.equal((await clamped.result).ok, false);   // 7 shots x 8s = 56s passes the runtime check, but the fake model has no verdict reply
  assert.ok((clamped.saved.get("sizzle") as Sizzle).shots.every((s) => s.seconds === 8));
});

test("verdict scores are clamped to 1-5, and a verdict missing dimensions fails", async () => {
  const texts = [{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }];
  const art = async (s: Sizzle) => ({ posterImage: "/p.png", shotImages: s.shots.map(() => null), note: null });
  const high = run([...texts, { text: JSON.stringify({ ...verdict, scores: verdict.scores.map((x) => ({ ...x, score: 9 })) }) }], art);
  assert.equal((await high.result).ok, true);
  assert.ok((high.saved.get("verdict") as { scores: { score: number }[] }).scores.every((x) => x.score === 5));
  const short = run([...texts, { text: JSON.stringify({ ...verdict, scores: verdict.scores.slice(0, 2) }) }], art);
  assert.equal((await short.result).ok, false);
});

test("a failed step stops the run, reports the step, and keeps earlier work", async () => {
  const { result, events, saved } = run([{ text: JSON.stringify(concept) }, { text: "too short" }]);
  assert.equal((await result).ok, false);
  assert.deepEqual([...saved.keys()], ["concept"]);
  const error = events.at(-1) as { type: string; step?: string };
  assert.equal(error.type, "error");
  assert.equal(error.step, "screenplay");
});

test("a refusal is reported as an error, not thrown", async () => {
  const { result, events } = run([{ text: "", stop: "refusal" }]);
  assert.equal((await result).ok, false);
  assert.equal(events.at(-1)?.type, "error");
});

test("generateImage posts to gpt-image and decodes the PNG", async () => {
  let sent: Record<string, unknown> = {};
  const fetchImpl = (async (url: unknown, init?: RequestInit) => {
    assert.equal(String(url), "https://api.openai.com/v1/images/generations");
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer sk-test");
    sent = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ data: [{ b64_json: btoa("PNGDATA") }] }), { status: 200 });
  }) as typeof fetch;
  const bytes = await generateImage({ OPENAI_API_KEY: "sk-test" }, "a poster", "1024x1536", "high", fetchImpl);
  assert.equal(new TextDecoder().decode(bytes), "PNGDATA");
  assert.deepEqual([sent.model, sent.size, sent.quality], ["gpt-image-1", "1024x1536", "high"]);
});

test("renderToMedia stores the image, and reports failures instead of throwing", async () => {
  const puts: string[] = [];
  const MEDIA = { put: async (key: string) => { puts.push(key); } } as unknown as R2Bucket;
  const ok = (async () => new Response(JSON.stringify({ data: [{ b64_json: btoa("x") }] }), { status: 200 })) as unknown as typeof fetch;
  const bad = (async () => new Response(JSON.stringify({ error: { message: "content policy" } }), { status: 400 })) as unknown as typeof fetch;
  const env = { OPENAI_API_KEY: "sk", MEDIA };
  assert.deepEqual(await renderToMedia(env, "studio/a/poster.png", "p", "1024x1536", "high", ok), { url: "/api/media/studio/a/poster.png", error: null });
  const failed = await renderToMedia(env, "studio/a/shot-1.png", "p", "1536x1024", "medium", bad);
  assert.equal(failed.url, null);
  assert.match(failed.error ?? "", /400: content policy/);
  assert.deepEqual(puts, ["studio/a/poster.png"]);
});

test("sanitizeSvg rejects text with no svg and adds a namespace", () => {
  assert.equal(sanitizeSvg("no drawing here"), null);
  assert.match(sanitizeSvg("<svg viewBox='0 0 10 10'><rect/></svg>") ?? "", /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  const quoted = sanitizeSvg(`<svg><rect fill='url("#a")'/><rect fill="url('#b')"/><rect fill="url(https://evil.example/x)"/><rect fill='url("https://evil.example/y")'/></svg>`) ?? "";
  assert.match(quoted, /url\("#a"\)/);
  assert.match(quoted, /url\('#b'\)/);
  assert.ok(!quoted.includes("evil.example"), quoted);
});

test("shareCard builds an absolute poster URL, and shareTags escapes model text", async () => {
  const { shareCard, shareTags } = await import("./share");
  const row = {
    concept: JSON.stringify({ ...concept, title: `Pocket "Static" <b>` }),
    sizzle: JSON.stringify(sizzle),
    art: JSON.stringify({ posterImage: "/api/media/studio/x/poster.png", posterSvg: null, shotImages: [], note: null }),
  };
  const card = shareCard(row, "https://nostalogic.cafecito-ai.com", "abc");
  assert.equal(card?.image, "https://nostalogic.cafecito-ai.com/api/media/studio/x/poster.png");
  assert.equal(card?.url, "https://nostalogic.cafecito-ai.com/studio/?id=abc");
  const tags = shareTags(card!);
  assert.match(tags, /og:title" content="Pocket &quot;Static&quot; &lt;b&gt; · NostalDamus Studio"/);
  assert.match(tags, /twitter:card" content="summary_large_image"/);
  assert.equal(shareCard({ concept: "not json" }, "https://x", "abc"), null);
});
