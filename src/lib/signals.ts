/**
 * Signal series math shared by the Worker API, the analytics page and the
 * compare view. Pure functions: no fetch, no D1, so node:test can import it.
 *
 * A missing reading is never a zero. Every summary returns null when the
 * window has too little data to mean anything.
 */
import type { PropertyScore } from "./scoring";

export type DayPoint = { day: string; value: number };

export type SeriesSummary = {
  n: number;
  from: string | null;
  to: string | null;
  median: number | null;
  mean30: number | null;      // mean of the last 30 points
  prior60: number | null;     // mean of the 60 points before those
  growth: number | null;      // (mean30 + 1) / (prior60 + 1) - 1
  peak: DayPoint | null;
};

/** One property's bundled evidence (data/evidence.json), collected by scripts/collect-evidence.mjs. */
export type EvidenceRecord = {
  wiki_title?: string;
  wiki_url?: string;
  pv_median_90?: number | null;
  pv_monthly?: Record<string, number>;
  pv_url?: string;
  subreddit?: string | null;
  subreddit_subscribers?: number | null;
  subreddit_url?: string;
  news_date?: string | null;
  news_note?: string | null;
  news_url?: string | null;
  collected_at?: string;
};

export function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const mean = (xs: number[]): number | null => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** Summarize a day-sorted series. The 30-day window needs 25 points; the prior window needs 45 of 60. */
export function summarize(points: DayPoint[]): SeriesSummary {
  const sorted = [...points].sort((a, b) => a.day.localeCompare(b.day));
  const values = sorted.map((p) => p.value);
  const last30 = sorted.slice(-30);
  const prior60 = sorted.slice(-90, -30);
  const mean30 = last30.length >= 25 ? mean(last30.map((p) => p.value)) : null;
  const priorMean = prior60.length >= 45 ? mean(prior60.map((p) => p.value)) : null;
  return {
    n: sorted.length,
    from: sorted[0]?.day ?? null,
    to: sorted[sorted.length - 1]?.day ?? null,
    median: median(values),
    mean30: mean30 === null ? null : Math.round(mean30),
    prior60: priorMean === null ? null : Math.round(priorMean),
    growth: mean30 === null || priorMean === null ? null : Math.round(((mean30 + 1) / (priorMean + 1) - 1) * 100) / 100,
    peak: sorted.reduce<DayPoint | null>((best, p) => (best === null || p.value > best.value ? p : best), null),
  };
}

/** Month totals (YYYY-MM), oldest first. */
export function monthlyTotals(points: DayPoint[]): { month: string; value: number }[] {
  const out = new Map<string, number>();
  for (const p of points) {
    const m = p.day.slice(0, 7);
    out.set(m, (out.get(m) ?? 0) + p.value);
  }
  return [...out].sort(([a], [b]) => a.localeCompare(b)).map(([month, value]) => ({ month, value }));
}

/** Bundled monthly pageviews as a series (one point per month, on the first of the month). */
export function evidencePoints(ev: EvidenceRecord | undefined): DayPoint[] {
  if (!ev?.pv_monthly) return [];
  return Object.entries(ev.pv_monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ day: `${month}-01`, value }));
}

export type CompareRow = {
  key: string;
  label: string;
  values: (number | string)[];
  /** Index of the leading property, or null when the row is text or every value ties. */
  leader: number | null;
  note?: string;
};

function leaderOf(values: number[], higherIsBetter: boolean): number | null {
  if (values.length < 2) return null;
  const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
  const idx = values.map((v, i) => (v === best ? i : -1)).filter((i) => i >= 0);
  return idx.length === 1 ? idx[0] : null;
}

/** Rows for the compare grid. Numeric rows mark the leader; text rows do not. */
export function compareRows(list: PropertyScore[]): CompareRow[] {
  const num = (key: string, label: string, pick: (p: PropertyScore) => number, higherIsBetter = true, note?: string): CompareRow => {
    const values = list.map(pick);
    return { key, label, values, leader: leaderOf(values, higherIsBetter), note };
  };
  const text = (key: string, label: string, pick: (p: PropertyScore) => string): CompareRow => ({ key, label, values: list.map(pick), leader: null });
  return [
    num("score", "Revival readiness", (p) => p.revivalReadinessScore),
    num("alignment", "Nostalgia alignment", (p) => p.nostalgiaAlignment, true, "40% of the score"),
    num("buzz", "Social buzz", (p) => p.socialBuzz, true, "30% of the score"),
    num("relevance", "Modern relevance", (p) => p.modernRelevance, true, "30% of the score"),
    num("impact", "Original impact", (p) => p.originalImpact),
    num("risk", "Risk", (p) => p.riskScore, false, "lower is better"),
    num("rights", "Rights complexity", (p) => p.rightsComplexity, false, "lower is better"),
    num("creators", "Creator availability", (p) => p.creatorAvailability),
    num("age", "Core fan age today", (p) => p.targetAudienceAge, true),
    text("window", "Launch window", (p) => p.launchWindow),
    text("format", "Revival format", (p) => p.revivalFormat),
    text("recommendation", "Recommendation", (p) => p.recommendation),
  ];
}

/** Parse ?ids=a,b,c into at most four distinct ids that exist in the library. */
export function parseCompareIds(raw: string | null, known: Set<string>, max = 4): string[] {
  const out: string[] = [];
  for (const id of (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
    if (known.has(id) && !out.includes(id)) out.push(id);
    if (out.length === max) break;
  }
  return out;
}
