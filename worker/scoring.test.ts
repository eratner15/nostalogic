// Run: node --experimental-strip-types --test worker/scoring.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readiness, windowAlignment, mondayOf, addMonths, pctile, signalBuzzAll, quantile,
  flagStates, trackSummary, MIN_RESOLVED_FOR_RATE, type Snapshot, type Outcome,
} from "./scoring.ts";

test("readiness matches the old fixed-2026 formula in 2026", () => {
  // Old code: fanAge = 2026 - year + 12; window = max(0, 100 - |fanAge-40|*8)
  const p = { social_buzz: 70, modern_relevance: 80, year: 1997 };
  const old = Math.round(70 * 0.3 + Math.max(0, 100 - Math.abs(2026 - 1997 + 12 - 40) * 8) * 0.4 + 80 * 0.3);
  assert.equal(readiness(p, new Date("2026-10-08T00:00:00Z")), old);
});

test("readiness moves with the year instead of freezing at 2026", () => {
  assert.equal(windowAlignment(1997, 2026), 92);   // fan age 41
  assert.equal(windowAlignment(1997, 2027), 84);   // fan age 42
});

test("mondayOf returns the UTC Monday on or before the date", () => {
  assert.equal(mondayOf(new Date("2026-10-08T12:00:00Z")), "2026-10-05"); // Thursday
  assert.equal(mondayOf(new Date("2026-10-05T00:00:00Z")), "2026-10-05"); // Monday
  assert.equal(mondayOf(new Date("2026-10-11T23:59:00Z")), "2026-10-05"); // Sunday
});

test("pctile spans 0..100 and handles ties", () => {
  assert.equal(pctile(1, [1, 2, 3]), 0);
  assert.equal(pctile(3, [1, 2, 3]), 100);
  assert.equal(pctile(2, [1, 2, 2, 3]), 50);
});

test("signal buzz: missing sources are skipped, never read as zero", () => {
  const out = signalBuzzAll([
    { id: "a", wiki30: 1000, wikiPrior90: 500, reddit30: 40 },
    { id: "b", wiki30: 10, wikiPrior90: 10, reddit30: 1 },
    { id: "c", wiki30: null, wikiPrior90: null, reddit30: null },
    { id: "d", wiki30: null, wikiPrior90: null, reddit30: 20 },
  ]);
  assert.equal(out.get("a"), 100);
  assert.equal(out.get("b"), 0);
  assert.equal(out.has("c"), false);              // caller keeps last buzz
  assert.equal(out.get("d"), 50);                 // scored on reddit alone
});

const snap = (property_id: string, week: string, score: number): Snapshot => ({ property_id, week, score });
const news = (property_id: string, event_date: string, kind = "announced"): Outcome =>
  ({ property_id, kind, event_date, source_url: "https://example.com" });

test("a call opens at the first crossing and resolves as a hit", () => {
  const { calls, surprises } = flagStates(
    [snap("x", "2026-10-05", 78), snap("x", "2026-10-12", 81), snap("x", "2026-10-19", 83)],
    [news("x", "2027-05-01")],
    "2027-06-01",
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].opened, "2026-10-12");
  assert.equal(calls[0].state, "hit");
  assert.equal(surprises.length, 0);
});

test("a call stays open after the score falls: misses cannot be hidden", () => {
  const { calls } = flagStates(
    [snap("x", "2026-10-12", 81), snap("x", "2026-10-19", 60)],
    [],
    "2028-10-13",
  );
  assert.equal(calls[0].state, "miss");
  assert.equal(calls[0].closes, addMonths("2026-10-12", 24));
});

test("news with no open call is a surprise; news before tracking is ignored", () => {
  const { calls, surprises } = flagStates(
    [snap("y", "2026-10-12", 64)],
    [news("y", "2026-12-01"), news("y", "2026-01-01")],
    "2027-01-01",
  );
  assert.equal(calls.length, 0);
  assert.equal(surprises.length, 1);
  assert.equal(surprises[0].outcome.event_date, "2026-12-01");
});

test("a denied outcome never counts as a hit", () => {
  const { calls } = flagStates([snap("z", "2026-10-12", 85)], [news("z", "2026-11-01", "denied")], "2026-12-01");
  assert.equal(calls[0].state, "open");
});

test("the hit rate stays hidden until enough calls resolve", () => {
  const few = trackSummary([{ property_id: "a", opened: "", open_score: 80, closes: "", state: "hit" }]);
  assert.equal(few.hitRate, null);
  const many = trackSummary(Array.from({ length: MIN_RESOLVED_FOR_RATE }, (_, i) => ({
    property_id: String(i), opened: "", open_score: 80, closes: "", state: i % 4 === 0 ? "miss" as const : "hit" as const,
  })));
  assert.equal(many.hitRate, 75);
});

test("quantile mapping keeps buzz on the hand-scored range", () => {
  const hand = [22, 30, 42, 50, 80];
  assert.equal(quantile(hand, 0), 22);
  assert.equal(quantile(hand, 100), 80);
  assert.equal(quantile(hand, 50), 42);
  const out = signalBuzzAll([
    { id: "top", wiki30: 900, wikiPrior90: 300, reddit30: 90 },
    { id: "low", wiki30: 5, wikiPrior90: 9, reddit30: 0 },
  ], hand);
  assert.equal(out.get("top"), 80);
  assert.equal(out.get("low"), 22);
});
