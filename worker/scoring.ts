/**
 * Pure scoring and ledger math. No D1, no fetch, so node:test can import it.
 *
 * The readiness formula is unchanged from the original spec (buzz .30,
 * window .40, relevance .30). What changed: the year comes from the date of
 * the score, not a constant, and buzz can come from live signals (rubric r3).
 */

import { getNostalgiaAlignment, getRevivalReadinessScore } from "../src/lib/scoring.ts";

export { PEAK_CHILDHOOD_AGE, SWEET_SPOT_CENTER } from "../src/lib/scoring.ts";
export const RUBRIC_SIGNALS = "r3-signals-2026-10";
/** r3 does not start until this many properties have signal coverage. */
export const MIN_BUZZ_COVERAGE = 30;

/** Flag rule chosen in the plan: score >= 80, revival news within 24 months. */
export const FLAG_LINE = 80;
export const FLAG_WINDOW_MONTHS = 24;
/** The track record hides the hit rate until this many calls resolve. */
export const MIN_RESOLVED_FOR_RATE = 20;

/** Delegates to the shared model in src/lib/scoring.ts, so the ledger, the API and the UI agree. */
export function windowAlignment(year: number, asOfYear: number): number {
  return getNostalgiaAlignment({ year }, asOfYear);
}

export function readiness(
  p: { social_buzz: number; modern_relevance: number; year: number },
  asOf: Date = new Date(),
): number {
  return getRevivalReadinessScore(
    { year: p.year, socialBuzz: p.social_buzz, modernRelevance: p.modern_relevance },
    asOf.getUTCFullYear(),
  );
}

/** YYYY-MM-DD of the Monday (UTC) on or before d. */
export function mondayOf(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const back = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - back);
  return t.toISOString().slice(0, 10);
}

export function addDays(day: string, n: number): string {
  const t = new Date(`${day}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

export function addMonths(day: string, n: number): string {
  const t = new Date(`${day}T00:00:00Z`);
  t.setUTCMonth(t.getUTCMonth() + n);
  return t.toISOString().slice(0, 10);
}

/** Percentile rank (0-100) of v within values. Ties share the midpoint rank. */
export function pctile(v: number, values: number[]): number {
  if (values.length === 0) return 50;
  if (values.length === 1) return 50;
  let below = 0;
  let equal = 0;
  for (const x of values) {
    if (x < v) below++;
    else if (x === v) equal++;
  }
  return Math.round(((below + Math.max(0, equal - 1) / 2) / (values.length - 1)) * 100);
}

/** One property's signal summary over the trailing windows. null = no usable data. */
export type SignalSummary = {
  id: string;
  wiki30: number | null;        // mean daily views, last 30 days
  wikiPrior90: number | null;   // mean daily views, the 90 days before that
  reddit30: number | null;      // posts in the property subreddit, last 30 days
};

export function growth(recent: number | null, prior: number | null): number | null {
  if (recent === null || prior === null) return null;
  return (recent + 1) / (prior + 1) - 1;   // +1 keeps tiny pages from exploding
}

/**
 * Rubric r3 buzz, as accepted in docs/plans/revival-watch.html: Wikipedia
 * momentum (30-day mean vs the prior 90 days) counts for 60%, the property
 * subreddit for 40%. A page with no prior window has no momentum reading. Percentiles are across the
 * corpus, so one viral week cannot push a property to 100. A property with
 * one source missing is scored on the source it has. Both missing: null, and
 * the caller keeps the last buzz. A missing reading is never a zero.
 *
 * scale: the hand-scored r2 buzz values. When given, the signal percentile is
 * mapped onto that distribution (quantile mapping), so the signals decide the
 * order but buzz keeps the range the rubric was built on (22-80 at launch).
 * Without it, buzz would span 0-100 and move every readiness score.
 */
export function quantile(sorted: number[], pct: number): number {
  if (sorted.length === 0) return pct;
  const i = Math.round((pct / 100) * (sorted.length - 1));
  return sorted[Math.min(sorted.length - 1, Math.max(0, i))];
}

export function signalBuzzAll(rows: SignalSummary[], scale?: number[]): Map<string, number> {
  const sortedScale = scale ? [...scale].sort((a, b) => a - b) : undefined;
  const growths = rows.map((r) => growth(r.wiki30, r.wikiPrior90)).filter((g): g is number => g !== null);
  const reddits = rows.filter((r) => r.reddit30 !== null).map((r) => r.reddit30 as number);
  const out = new Map<string, number>();
  for (const r of rows) {
    const parts: { w: number; v: number }[] = [];
    const g = growth(r.wiki30, r.wikiPrior90);
    if (g !== null) parts.push({ w: 0.6, v: pctile(g, growths) });
    if (r.reddit30 !== null) parts.push({ w: 0.4, v: pctile(r.reddit30, reddits) });
    if (parts.length === 0) continue;
    const wsum = parts.reduce((s, p) => s + p.w, 0);
    const pct = parts.reduce((s, p) => s + p.w * p.v, 0) / wsum;
    out.set(r.id, sortedScale ? quantile(sortedScale, pct) : Math.round(pct));
  }
  return out;
}

export type Snapshot = { property_id: string; week: string; score: number };
export type Outcome = { property_id: string; kind: string; event_date: string; source_url: string };
export type Call = {
  property_id: string;
  opened: string;           // week of the first snapshot at or over the line
  open_score: number;
  closes: string;           // opened + 24 months
  state: "open" | "hit" | "miss";
  outcome?: Outcome;
};
export type Surprise = { property_id: string; outcome: Outcome };

/**
 * Turn snapshots + approved outcomes into calls. A call, once made, stays
 * open for the full window even if the score falls later: withdrawing a
 * falling call would hide misses. After a call resolves, a new call needs a
 * fresh crossing: a snapshot below the line, then one at or above it. One
 * unbroken high-score period is one prediction. Outcomes before the first snapshot of a property are
 * ignored (the engine was not watching yet). A positive outcome with no open
 * call is a surprise, except a "released" that follows news already
 * credited to a call (the same revival moving on). "denied" outcomes never
 * count as a hit; they are returned as denials so the ledger shows them.
 */
export function flagStates(
  snapshots: Snapshot[],
  outcomes: Outcome[],
  today: string,
): { calls: Call[]; surprises: Surprise[]; denials: Outcome[] } {
  const byProp = new Map<string, Snapshot[]>();
  for (const s of snapshots) {
    const list = byProp.get(s.property_id) ?? [];
    list.push(s);
    byProp.set(s.property_id, list);
  }
  const positive = outcomes
    .filter((o) => o.kind === "announced" || o.kind === "released")
    .sort((a, b) => a.event_date.localeCompare(b.event_date));

  const calls: Call[] = [];
  const surprises: Surprise[] = [];
  for (const [pid, snaps] of byProp) {
    snaps.sort((a, b) => a.week.localeCompare(b.week));
    const first = snaps[0].week;
    const news = positive.filter((o) => o.property_id === pid && o.event_date >= first);
    const used = new Set<Outcome>();
    let open: Call | null = null;
    let resumeAfter = "";
    let armed = true;
    for (const s of snaps) {
      if (open) continue;
      if (s.week <= resumeAfter) continue;
      if (s.score < FLAG_LINE) { armed = true; continue; }
      if (!armed) continue;
      const call: Call = {
        property_id: pid,
        opened: s.week,
        open_score: s.score,
        closes: addMonths(s.week, FLAG_WINDOW_MONTHS),
        state: "open",
      };
      const hit = news.find((o) => !used.has(o) && o.event_date >= call.opened && o.event_date <= call.closes);
      if (hit) {
        used.add(hit);
        call.state = "hit";
        call.outcome = hit;
        resumeAfter = hit.event_date;
        armed = false;
      } else if (today > call.closes) {
        call.state = "miss";
        resumeAfter = call.closes;
        armed = false;
      } else {
        open = call;
      }
      calls.push(call);
    }
    const credited = [...used];
    for (const o of news) {
      if (used.has(o)) continue;
      const followUp = o.kind === "released" && credited.some((u) => u.event_date <= o.event_date);
      if (!followUp) surprises.push({ property_id: pid, outcome: o });
    }
  }
  const tracked = new Set(byProp.keys());
  const denials = outcomes
    .filter((o) => o.kind === "denied" && tracked.has(o.property_id))
    .sort((a, b) => b.event_date.localeCompare(a.event_date));
  return { calls, surprises, denials };
}

export function trackSummary(calls: Call[]) {
  const hits = calls.filter((c) => c.state === "hit").length;
  const misses = calls.filter((c) => c.state === "miss").length;
  const resolved = hits + misses;
  return {
    open: calls.filter((c) => c.state === "open").length,
    hits,
    misses,
    resolved,
    hitRate: resolved >= MIN_RESOLVED_FOR_RATE ? Math.round((hits / resolved) * 100) : null,
    minResolvedForRate: MIN_RESOLVED_FOR_RATE,
  };
}
