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
  characters: [{ name: "Vera Kell", role: "lead", description: "d" }, { name: "Odo Pratt", role: "rival", description: "d" }, { name: "Mims", role: "creature", description: "d" }],
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
  assert.deepEqual(await renderToMedia(env, "studio/a/poster.png", "p", "1024x1536", "high", ok), { url: "/api/media/studio/a/poster.png", error: null, generated: true });
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

test("the concept must name a mechanic for every selected source", async () => {
  const missing = run([{ text: JSON.stringify({ ...concept, borrowed_mechanics: [{ source: "Tamagotchi", mechanic: "care loop" }, { source: "Invented Show", mechanic: "x" }] }) }]);
  assert.equal((await missing.result).ok, false);
  assert.equal((missing.events.at(-1) as { step?: string }).step, "concept");
  const ok = run([{ text: JSON.stringify(concept) }, { text: "too short" }]);
  await ok.result;
  const saved = ok.saved.get("concept") as { borrowed_mechanics: { source: string }[] };
  assert.deepEqual(saved.borrowed_mechanics.map((m) => m.source), sources.map((p) => p.name));
});

test("sameOriginJson admits same-origin JSON and rejects cross-site or simple requests", async () => {
  const { sameOriginJson } = await import("../http");
  const req = (headers: Record<string, string>) => new Request("https://nostalogic.cafecito-ai.com/api/studio", { method: "POST", headers });
  assert.equal(sameOriginJson(req({ "content-type": "application/json", origin: "https://nostalogic.cafecito-ai.com", "sec-fetch-site": "same-origin" })), true);
  assert.equal(sameOriginJson(req({ "content-type": "application/json" })), true);   // curl, server-to-server
  assert.equal(sameOriginJson(req({ "content-type": "text/plain", origin: "https://nostalogic.cafecito-ai.com" })), false);
  assert.equal(sameOriginJson(req({ "content-type": "application/json", origin: "https://evil.example" })), false);
  assert.equal(sameOriginJson(req({ "content-type": "application/json", "sec-fetch-site": "cross-site" })), false);
});

test("mechanics are one-to-one, verdict dimensions are exact, and the sizzle takes the concept title", async () => {
  const combined = run([{ text: JSON.stringify({ ...concept, borrowed_mechanics: [{ source: "Tamagotchi / Daria", mechanic: "both" }, { source: "Tamagotchi / Daria", mechanic: "again" }] }) }]);
  assert.equal((await combined.result).ok, false);
  const art = async (s: Sizzle) => ({ posterImage: "/p.png", shotImages: s.shots.map(() => null), note: null });
  const texts = [{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify({ ...sizzle, title: "Something Else" }) }];
  const dup = run([...texts, { text: JSON.stringify({ ...verdict, scores: DIMENSIONS.map(() => ({ dimension: "Originality", score: 4, note: "n" })) }) }], art);
  assert.equal((await dup.result).ok, false);
  assert.equal((dup.saved.get("sizzle") as Sizzle).title, concept.title);
  const shuffled = run([...texts, { text: JSON.stringify({ ...verdict, scores: [...verdict.scores].reverse().map((s) => ({ ...s, dimension: s.dimension.toUpperCase() })) }) }], art);
  assert.equal((await shuffled.result).ok, true);
  assert.deepEqual((shuffled.saved.get("verdict") as { scores: { dimension: string }[] }).scores.map((s) => s.dimension), DIMENSIONS);
});

test("a billed image counts as generated even when storage fails", async () => {
  const MEDIA = { put: async () => { throw new Error("r2 down"); } } as unknown as R2Bucket;
  const ok = (async () => new Response(JSON.stringify({ data: [{ b64_json: btoa("x") }] }), { status: 200 })) as unknown as typeof fetch;
  const r = await renderToMedia({ OPENAI_API_KEY: "sk", MEDIA }, "studio/a/poster.png", "p", "1024x1536", "high", ok);
  assert.deepEqual([r.url, r.generated], [null, true]);
});

test("the concept takes the requested format, and a renamed sizzle is rewritten to the concept title", async () => {
  const renamed = { ...sizzle, title: "Static Pocket", poster_prompt: "Key art for STATIC POCKET.", shots: sizzle.shots.map((s, i) => (i === 1 ? { ...s, on_screen_text: "STATIC POCKET" } : s)) };
  const r = run([{ text: JSON.stringify({ ...concept, format: "Feature Film" }) }, { text: screenplay }, { text: JSON.stringify(renamed) }]);
  await r.result;
  assert.equal((r.saved.get("concept") as { format: string }).format, "Animated Series");
  const saved = r.saved.get("sizzle") as Sizzle;
  assert.equal(saved.title, concept.title);
  assert.equal(saved.poster_prompt, `Key art for ${concept.title}.`);
  assert.equal(saved.shots[1].on_screen_text, concept.title);
});

test("a concept needs three to five characters", async () => {
  const thin = run([{ text: JSON.stringify({ ...concept, characters: [] }) }]);
  assert.equal((await thin.result).ok, false);
  const many = run([{ text: JSON.stringify({ ...concept, characters: Array.from({ length: 8 }, (_, i) => ({ name: `C${i}`, role: "r", description: "d" })) }) }, { text: "too short" }]);
  await many.result;
  assert.equal((many.saved.get("concept") as { characters: unknown[] }).characters.length, 5);
});

test("source names never reach the screen or the image model; title fixes stay whole-word", async () => {
  const onScreen = { ...sizzle, shots: sizzle.shots.map((s, i) => (i === 1 ? { ...s, line: "Like Daria, but louder." } : s)) };
  const bad = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(onScreen) }]);
  assert.equal((await bad.result).ok, false);
  assert.equal((bad.events.at(-1) as { step?: string }).step, "sizzle");
  const inPrompt = { ...sizzle, title: "It", poster_prompt: "A group of kids hold It up.", shots: sizzle.shots.map((s, i) => (i === 0 ? { ...s, image_prompt: "A cracked Tamagotchi glowing in a drawer." } : s)) };
  const ok = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(inPrompt) }]);
  await ok.result;
  const saved = ok.saved.get("sizzle") as Sizzle;
  assert.equal(saved.shots[0].image_prompt, "A cracked glowing in a drawer.");
  assert.equal(saved.poster_prompt, `A group of kids hold ${concept.title} up.`);
});

test("a fallback SVG poster that names a source is retried, then fails", async () => {
  const named = `<svg viewBox="0 0 600 900"><text x="20" y="80">Tamagotchi meets Daria</text></svg>`;
  const r = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: named }, { text: named }]);
  assert.equal((await r.result).ok, false);
  assert.equal((r.events.at(-1) as { step?: string }).step, "art");
});

test("rights guard covers speakers, capitals, and entity-encoded poster text; the reel always has its title card", async () => {
  const speaker = { ...sizzle, shots: sizzle.shots.map((s, i) => (i === 1 ? { ...s, speaker: "Daria" } : s)) };
  assert.equal((await run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(speaker) }]).result).ok, false);
  const caps = { ...sizzle, tagline: "DARIA, LOUDER." };
  assert.equal((await run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(caps) }]).result).ok, false);
  const noCard = { ...sizzle, shots: sizzle.shots.map((s) => ({ ...s, on_screen_text: "" })) };
  const r = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(noCard) }]);
  await r.result;
  assert.equal((r.saved.get("sizzle") as Sizzle).shots.at(-1)?.on_screen_text, concept.title);
});

test("usage is reported after every model call", async () => {
  const seen: number[] = [];
  const { fetchImpl } = fakeModel([{ text: JSON.stringify(concept) }, { text: "too short" }]);
  await runStudio({ sources, format: "Animated Series" }, { apiKey: "t", model: "m", fetch: fetchImpl, onUsage: async (u) => { seen.push(u.input); } }, () => {}, async () => {});
  assert.deepEqual(seen, [50, 100]);
});

test("poster text with XML entities is decoded before the source-name check", async () => {
  const kk = library.find((p) => p.name.includes("&"));
  if (!kk) return;   // no ampersand names in this corpus
  const pair = [kk, sources[0]];
  const enc = kk.name.replace(/&/g, "&amp;");
  const bad = `<svg viewBox="0 0 600 900"><text x="20" y="80">${enc}</text></svg>`;
  const c = { ...concept, borrowed_mechanics: pair.map((p) => ({ source: p.name, mechanic: "m" })) };
  const { fetchImpl } = fakeModel([{ text: JSON.stringify(c) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: bad }, { text: bad }]);
  const events: StudioEvent[] = [];
  const res = await runStudio({ sources: pair, format: "Animated Series" }, { apiKey: "t", model: "m", fetch: fetchImpl }, (e) => { events.push(e); }, async () => {});
  assert.equal(res.ok, false);
  assert.equal((events.at(-1) as { step?: string }).step, "art");
});

test("opening pages that name a source fail the screenplay step", async () => {
  const r = run([{ text: JSON.stringify(concept) }, { text: `${screenplay}\n\nVERA\nIt's like a Tamagotchi, but mean.` }]);
  assert.equal((await r.result).ok, false);
  assert.equal((r.events.at(-1) as { step?: string }).step, "screenplay");
});

test("rights guard covers concept names, music cues, and CDATA or split poster text; script title follows the concept", async () => {
  const badTitle = run([{ text: JSON.stringify({ ...concept, characters: [...concept.characters.slice(0, 2), { name: "Daria", role: "r", description: "d" }] }) }]);
  assert.equal((await badTitle.result).ok, false);
  const music = { ...sizzle, shots: sizzle.shots.map((s, i) => (i === 0 ? { ...s, music: "the Daria theme, slowed" } : s)) };
  const ok = run([{ text: JSON.stringify(concept) }, { text: screenplay.replace("Title: Pocket Static", "Title: Wrong Name") }, { text: JSON.stringify(music) }]);
  await ok.result;
  assert.equal((ok.saved.get("sizzle") as Sizzle).shots[0].music, "the theme, slowed");
  assert.match(ok.saved.get("screenplay") as string, /^Title: Pocket Static$/m);
  for (const poster of [`<svg><text><![CDATA[Daria]]></text></svg>`, `<svg><text>Da<tspan>ria</tspan></text></svg>`]) {
    const r = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(sizzle) }, { text: poster }, { text: poster }]);
    assert.equal((await r.result).ok, false, poster);
  }
});

test("source names anywhere public in the concept fail; a renamed tagline follows the concept title", async () => {
  const leak = run([{ text: JSON.stringify({ ...concept, logline: "Daria meets a pocket pet." }) }]);
  assert.equal((await leak.result).ok, false);
  const risky = run([{ text: JSON.stringify({ ...concept, risks: ["Tone may read as too close to Daria."] }) }, { text: "too short" }]);
  await risky.result;
  assert.ok(risky.saved.get("concept"), "risks may name a source");
  const renamed = { ...sizzle, title: "Static Pocket", tagline: "Static Pocket rates everyone." };
  const r = run([{ text: JSON.stringify(concept) }, { text: screenplay }, { text: JSON.stringify(renamed) }]);
  await r.result;
  assert.equal((r.saved.get("sizzle") as Sizzle).tagline, `${concept.title} rates everyone.`);
});
