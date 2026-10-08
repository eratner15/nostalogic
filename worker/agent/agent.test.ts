/**
 * Agent tests: tools against the committed corpus snapshot, and the agentic
 * loop against a scripted fake model (no API key or network needed).
 * Run with: npm run test:agent
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import corpus from "../../data/corpus.json";
import { scoreAll, type Property } from "../../src/lib/scoring";
import { runAgent, type AgentEvent } from "./run";
import { runTool } from "./tools";

const library = scoreAll(corpus as Property[]);

test("corpus snapshot has the full seeded library", () => {
  assert.equal(library.length, 120);
  assert.equal(new Set(library.map((p) => p.id)).size, 120);
});

test("search_library filters by category, years, and thresholds", () => {
  const out = runTool(library, "search_library", { categories: ["Toy/Fad"], year_min: 1996, min_readiness: 60, limit: 25 });
  const { results, total_matches } = out.result as { results: { category: string; year: number; readiness: number }[]; total_matches: number };
  assert.ok(total_matches > 0);
  for (const r of results) {
    assert.equal(r.category, "Toy/Fad");
    assert.ok(r.year >= 1996);
    assert.ok(r.readiness >= 60);
  }
  // Default sort with no query is readiness, descending.
  assert.deepEqual(results.map((r) => r.readiness), [...results.map((r) => r.readiness)].sort((a, b) => b - a));
});

test("search_library ranks a name match first", () => {
  const out = runTool(library, "search_library", { query: "tamagotchi virtual pet" });
  assert.equal(out.ids[0], "tamagotchi-1996");
});

test("search_library sorts by lowest risk", () => {
  const out = runTool(library, "search_library", { sort_by: "risk", limit: 5 });
  const risks = (out.result as { results: { risk: number }[] }).results.map((r) => r.risk);
  assert.deepEqual(risks, [...risks].sort((a, b) => a - b));
});

test("get_properties returns full records and reports unknown ids", () => {
  const out = runTool(library, "get_properties", { ids: ["daria-1997", "not-a-thing"] });
  const result = out.result as { properties: { id: string; preserve: string[] }[]; missing_ids: string[] };
  assert.equal(result.properties[0].id, "daria-1997");
  assert.ok(result.properties[0].preserve.length > 0);
  assert.deepEqual(result.missing_ids, ["not-a-thing"]);
  assert.equal(runTool(library, "get_properties", { ids: ["nope"] }).isError, true);
});

test("compare_properties names a leader per metric", () => {
  const out = runTool(library, "compare_properties", { ids: ["daria-1997", "furby-1998", "tamagotchi-1996"] });
  const { leaders, rows } = out.result as { leaders: Record<string, string>; rows: { id: string; readiness: number }[] };
  const best = [...rows].sort((a, b) => b.readiness - a.readiness)[0];
  assert.equal(leaders.readiness, best.id);
  assert.equal(runTool(library, "compare_properties", { ids: ["daria-1997"] }).isError, true);
});

test("library_overview covers every property", () => {
  const out = runTool(library, "library_overview", { group_by: "category" });
  const groups = (out.result as { groups: { count: number }[] }).groups;
  assert.equal(groups.reduce((s, g) => s + g.count, 0), 120);
  assert.equal(groups.length, 7);
});

test("find_similar respects different_category", () => {
  const out = runTool(library, "find_similar", { id: "tamagotchi-1996", different_category: true, limit: 5 });
  const results = (out.result as { results: { category: string }[] }).results;
  assert.ok(results.length > 0);
  for (const r of results) assert.notEqual(r.category, "Toy/Fad");
});

test("unknown tool returns an error outcome instead of throwing", () => {
  assert.equal(runTool(library, "drop_tables", {}).isError, true);
});

/** Scripted fake of POST /v1/messages: returns the queued responses in order. */
function fakeModel(responses: object[]) {
  const requests: { body: Record<string, unknown>; headers: Headers }[] = [];
  const fetchImpl = (async (_url: unknown, init?: RequestInit) => {
    requests.push({ body: JSON.parse(String(init?.body)), headers: new Headers(init?.headers) });
    const next = responses[requests.length - 1];
    if (!next) throw new Error("fake model ran out of responses");
    return new Response(JSON.stringify(next), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { fetchImpl, requests };
}

const usage = { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
const message = (content: object[], stop_reason: string) => ({
  id: "msg_test", type: "message", role: "assistant", model: "claude-opus-5-5", content, stop_reason, stop_sequence: null, usage,
});

test("agent loop runs tools, returns results in one message, and filters citations", async () => {
  const { fetchImpl, requests } = fakeModel([
    message([
      { type: "tool_use", id: "tu_1", name: "search_library", input: { categories: ["Toy/Fad"], limit: 3 } },
      { type: "tool_use", id: "tu_2", name: "get_properties", input: { ids: ["tamagotchi-1996"] } },
    ], "tool_use"),
    message([{ type: "text", text: "Tamagotchi [[tamagotchi-1996]] leads. Ignore [[made-up-1995]]." }], "end_turn"),
  ]);
  const events: AgentEvent[] = [];
  const result = await runAgent("Which toy should come back?", [], library, { apiKey: "test", fetch: fetchImpl }, (e) => { events.push(e); });

  assert.equal(result.status, "ok");
  assert.deepEqual(events.map((e) => e.type), ["step", "step", "answer", "done"]);
  assert.deepEqual(result.cited, ["tamagotchi-1996"]);

  // Request shape: default model, server-side fallback, cached system prompt.
  const first = requests[0];
  assert.equal(first.body.model, "claude-opus-5-5");
  assert.equal(first.body.fallbacks, "default");
  assert.match(first.headers.get("anthropic-beta") ?? "", /server-side-fallback-2026-07-01/);
  assert.deepEqual((first.body.system as { cache_control?: unknown }[])[0].cache_control, { type: "ephemeral" });

  // Append-only history: assistant content echoed unchanged, then both tool results in ONE user message.
  const second = requests[1].body.messages as { role: string; content: { type: string; tool_use_id?: string }[] }[];
  assert.equal(second.length, 3);
  assert.equal(second[1].role, "assistant");
  assert.equal(second[1].content.length, 2);
  assert.equal(second[2].role, "user");
  assert.deepEqual(second[2].content.map((b) => b.tool_use_id), ["tu_1", "tu_2"]);
});

test("agent surfaces a refusal as an error event", async () => {
  const { fetchImpl } = fakeModel([message([], "refusal")]);
  const events: AgentEvent[] = [];
  const result = await runAgent("q", [], library, { apiKey: "test", fetch: fetchImpl }, (e) => { events.push(e); });
  assert.equal(result.status, "error");
  assert.equal(result.usage.input, 100);            // the refused call still counts toward spend
  assert.equal(events[0].type, "error");
});

test("agent explains a billing failure instead of a generic error", async () => {
  const fetchImpl = (async () => new Response(JSON.stringify({
    type: "error", error: { type: "invalid_request_error", message: "Your credit balance is too low to access the Anthropic API." },
  }), { status: 400, headers: { "content-type": "application/json" } })) as typeof fetch;
  const events: AgentEvent[] = [];
  await runAgent("q", [], library, { apiKey: "test", fetch: fetchImpl }, (e) => { events.push(e); });
  assert.equal(events[0].type, "error");
  assert.match((events[0] as { message: string }).message, /credit/i);
});

test("scores use the clock at call time, not a module-load constant", () => {
  // Workers report the 1970 epoch at module load; a frozen year would zero the window.
  const daria = library.find((p) => p.id === "daria-1997")!;
  assert.ok(daria.nostalgiaAlignment > 0);
});
