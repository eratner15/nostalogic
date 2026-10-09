/**
 * Signal pipeline tests for Arctic Shift rate limits: one retry after a 429,
 * and no more Arctic Shift requests in a run once the retry also fails.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchArcticShift, runSignals } from "./signals";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

test("fetchArcticShift waits for x-ratelimit-reset after a 429 and retries once", async () => {
  const calls: string[] = [];
  const fetcher = (async (url: unknown) => {
    calls.push(String(url));
    return calls.length === 1 ? json({ error: "rate limited" }, 429, { "x-ratelimit-reset": "0" }) : json({ data: [] });
  }) as typeof fetch;
  const res = await fetchArcticShift(fetcher, "Animorphs", "2026-10-01", "2026-10-02");
  assert.equal(res.ok, true);
  assert.equal(calls.length, 2);
});

test("runSignals stops Arctic Shift for the run after a 429 that survives the retry", async () => {
  const pairs = [
    { property_id: "a", source: "arcticshift", query: "A", read_to: "2026-09-30" },
    { property_id: "b", source: "arcticshift", query: "B", read_to: "2026-09-30" },
    { property_id: "c", source: "wikipedia", query: "C", read_to: "2026-09-30" },
  ];
  const stmt = (sql: string) => ({ sql, bind: () => ({ sql, all: async () => ({ results: pairs }) }) });
  const DB = { prepare: stmt, batch: async () => [] } as unknown as D1Database;
  const urls: string[] = [];
  const fetcher = (async (url: unknown) => {
    urls.push(String(url));
    if (String(url).includes("arctic-shift")) return json({ error: "rate limited" }, 429, { "x-ratelimit-reset": "0" });
    return json({ items: [{ timestamp: "2026100100", views: 5 }] });
  }) as typeof fetch;
  const log = await runSignals({ DB }, new Date("2026-10-02T12:00:00Z"), fetcher);
  assert.deepEqual(log, { pairs: 3, ok: 1, gap: 1, skipped: 1 });
  assert.equal(urls.filter((u) => u.includes("arctic-shift")).length, 2);   // pair a and its retry; pair b skipped
});
