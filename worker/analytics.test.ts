/** Analytics: signal series math and the per-property signals shape. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { compareRows, evidencePoints, median, monthlyTotals, parseCompareIds, summarize } from "../src/lib/signals.ts";
import { scoreAll, type Property } from "../src/lib/scoring.ts";
import { shapeSignals } from "./analytics.ts";

const day = (i: number) => new Date(Date.UTC(2026, 5, 1 + i)).toISOString().slice(0, 10);
const series = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => ({ day: day(i), value: f(i) }));

test("summarize needs 25 of 30 recent days and 45 of 60 prior days, or returns null", () => {
  const short = summarize(series(20, () => 10));
  assert.equal(short.n, 20);
  assert.equal(short.mean30, null);
  assert.equal(short.growth, null);
  assert.equal(short.median, 10);
  const full = summarize(series(90, (i) => (i >= 60 ? 200 : 100)));
  assert.equal(full.mean30, 200);
  assert.equal(full.prior60, 100);
  assert.equal(full.growth, 0.99);
  assert.equal(full.peak?.value, 200);
  assert.equal(full.from, day(0));
  assert.equal(full.to, day(89));
});

test("summarize sorts unsorted input and median handles even counts", () => {
  const s = summarize([{ day: "2026-01-03", value: 3 }, { day: "2026-01-01", value: 1 }, { day: "2026-01-02", value: 2 }, { day: "2026-01-04", value: 10 }]);
  assert.equal(s.from, "2026-01-01");
  assert.equal(s.median, 2.5);
  assert.equal(median([]), null);
});

test("monthlyTotals and evidencePoints keep month order", () => {
  const m = monthlyTotals([{ day: "2026-02-01", value: 5 }, { day: "2026-01-31", value: 1 }, { day: "2026-01-01", value: 2 }]);
  assert.deepEqual(m, [{ month: "2026-01", value: 3 }, { month: "2026-02", value: 5 }]);
  assert.deepEqual(evidencePoints({ pv_monthly: { "2026-02": 7, "2025-12": 4 } }), [{ day: "2025-12-01", value: 4 }, { day: "2026-02-01", value: 7 }]);
  assert.deepEqual(evidencePoints(undefined), []);
});

const base: Property = {
  id: "a", name: "A", year: 1995, category: "Movie", genre: "g", originalImpact: 50, modernRelevance: 60, socialBuzz: 70,
  rightsComplexity: 20, creatorAvailability: 50, briefDescription: "", coreAudience: "", currentSignal: "", revivalFormat: "film",
  tags: [], preserve: [], update: [],
};

test("compareRows marks a single leader per numeric row, lower-is-better for risk, and no leader on ties", () => {
  const list = scoreAll([base, { ...base, id: "b", name: "B", socialBuzz: 90, rightsComplexity: 60 }]);
  const rows = compareRows(list.sort((x, y) => x.id.localeCompare(y.id)));
  const row = (k: string) => rows.find((r) => r.key === k)!;
  assert.equal(row("buzz").leader, 1);
  assert.equal(row("rights").leader, 0);
  assert.equal(row("relevance").leader, null);   // tie
  assert.equal(row("format").leader, null);      // text
  assert.equal(rows.length, 12);
});

test("parseCompareIds drops unknown and repeated ids and caps at four", () => {
  const known = new Set(["a", "b", "c", "d", "e"]);
  assert.deepEqual(parseCompareIds("a, zz ,b,a,c,d,e", known), ["a", "b", "c", "d"]);
  assert.deepEqual(parseCompareIds(null, known), []);
});

test("shapeSignals groups readings by source and keeps bookmarked sources with no readings", () => {
  const out = shapeSignals(
    "a", "2026-06-01", "2026-06-03",
    [{ source: "wikipedia", day: "2026-06-02", value: 5 }, { source: "wikipedia", day: "2026-06-01", value: 4 }],
    [{ source: "wikipedia", query: "A", read_to: "2026-06-02", last_error: null }, { source: "arcticshift", query: "r_a", read_to: null, last_error: "HTTP 429" }],
    [{ week: "2026-06-08", score: 80, social_buzz: 70, modern_relevance: 60, window_alignment: 100, rubric_version: "r2" }, { week: "2026-06-01", score: 79, social_buzz: 70, modern_relevance: 60, window_alignment: 100, rubric_version: "r2" }],
  );
  assert.deepEqual(out.sources.wikipedia.days, [{ day: "2026-06-01", value: 4 }, { day: "2026-06-02", value: 5 }]);
  assert.deepEqual(out.sources.arcticshift.days, []);
  assert.equal(out.sources.arcticshift.last_error, "HTTP 429");
  assert.deepEqual(out.snapshots.map((s) => s.week), ["2026-06-01", "2026-06-08"]);
});
