/**
 * Prediction ledger: weekly score snapshots, rubric r3 buzz, track record.
 * Math lives in scoring.ts; this file only reads and writes D1.
 */
import {
  FLAG_LINE, FLAG_WINDOW_MONTHS, MIN_BUZZ_COVERAGE, RUBRIC_SIGNALS,
  flagStates, mondayOf, readiness, signalBuzzAll, trackSummary, windowAlignment,
  type Outcome, type Snapshot,
} from "./scoring";
import { signalSummaries, type SignalEnv } from "./signals";

type PropRow = { id: string; name: string; year: number; social_buzz: number; modern_relevance: number; rubric_version: string };

/**
 * Rubric r3: replace social_buzz with the signal formula where the signals
 * cover the window. Properties without coverage keep their last buzz and
 * their old rubric_version, so the library shows which rubric scored each row.
 */
export async function recomputeBuzz(env: SignalEnv, now: Date) {
  const rows = await signalSummaries(env, now);
  const hand = (await env.DB.prepare("SELECT social_buzz_hand AS b FROM properties WHERE social_buzz_hand IS NOT NULL").all<{ b: number }>())
    .results.map((r) => r.b);
  const buzz = signalBuzzAll(rows, hand);
  if (buzz.size < MIN_BUZZ_COVERAGE) {
    // Too few properties have signals: a percentile among them means little. Change nothing.
    return { scored: 0, kept: rows.length, waiting: `${buzz.size} of ${MIN_BUZZ_COVERAGE} properties have signal coverage` };
  }
  // Few statements, not one per property: D1 counts every statement against
  // the per-invocation query limit, and caps bound parameters at 100.
  const entries = [...buzz];
  const stmts: D1PreparedStatement[] = [];
  for (let i = 0; i < entries.length; i += 30) {
    const chunk = entries.slice(i, i + 30);
    stmts.push(
      env.DB.prepare(
        `UPDATE properties SET social_buzz = CASE id ${chunk.map(() => "WHEN ? THEN ?").join(" ")} END,
           rubric_version = ?, scored_at = datetime('now')
         WHERE id IN (${chunk.map(() => "?").join(", ")})`,
      ).bind(...chunk.flat(), RUBRIC_SIGNALS, ...chunk.map(([id]) => id)),
    );
  }
  if (stmts.length) await env.DB.batch(stmts);
  return { scored: buzz.size, kept: rows.length - buzz.size };
}

/** One row per property per week. INSERT OR IGNORE: a snapshot never changes. */
export async function snapshotScores(env: SignalEnv, now: Date) {
  const week = mondayOf(now);
  const { results } = await env.DB.prepare(
    "SELECT id, name, year, social_buzz, modern_relevance, rubric_version FROM properties",
  ).all<PropRow>();
  const stmts: D1PreparedStatement[] = [];
  for (let i = 0; i < results.length; i += 14) {   // 7 params a row, 100 max
    const chunk = results.slice(i, i + 14);
    stmts.push(
      env.DB.prepare(
        `INSERT OR IGNORE INTO score_snapshots
           (property_id, week, score, social_buzz, modern_relevance, window_alignment, rubric_version)
         VALUES ${chunk.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ")}`,
      ).bind(...chunk.flatMap((p) => [p.id, week, readiness(p, now), p.social_buzz, p.modern_relevance,
        windowAlignment(p.year, now.getUTCFullYear()), p.rubric_version])),
    );
  }
  if (!stmts.length) return { week, written: 0, properties: 0 };
  const out = await env.DB.batch(stmts);
  return { week, written: out.reduce((n, r) => n + (r.meta.changes ?? 0), 0), properties: results.length };
}

/** The Monday job: buzz first, so the snapshot records the new buzz. */
export async function weeklyLedger(env: SignalEnv, now: Date) {
  const buzz = await recomputeBuzz(env, now);
  const snap = await snapshotScores(env, now);
  return { buzz, snap };
}

export async function loadTrackRecord(env: SignalEnv, now: Date) {
  const [snaps, outs, props] = await Promise.all([
    env.DB.prepare("SELECT property_id, week, score FROM score_snapshots").all<Snapshot>(),
    env.DB.prepare("SELECT property_id, kind, event_date, source_url FROM outcomes").all<Outcome>(),
    env.DB.prepare("SELECT id, name, year FROM properties").all<{ id: string; name: string; year: number }>(),
  ]);
  const names = new Map(props.results.map((p) => [p.id, `${p.name} (${p.year})`]));
  const today = now.toISOString().slice(0, 10);
  const { calls, surprises, denials } = flagStates(snaps.results, outs.results, today);
  const weeks = [...new Set(snaps.results.map((s) => s.week))].sort();
  return {
    rule: { flagLine: FLAG_LINE, windowMonths: FLAG_WINDOW_MONTHS },
    trackingSince: weeks[0] ?? null,
    snapshotWeeks: weeks.length,
    summary: trackSummary(calls),
    calls: calls
      .map((c) => ({ ...c, name: names.get(c.property_id) ?? c.property_id }))
      .sort((a, b) => b.opened.localeCompare(a.opened) || a.name.localeCompare(b.name)),
    surprises: surprises.map((s) => ({ ...s, name: names.get(s.property_id) ?? s.property_id })),
    denials: denials.map((o) => ({ property_id: o.property_id, name: names.get(o.property_id) ?? o.property_id, outcome: o })),
  };
}

/** Last n weekly scores per property, oldest first, for the library sparkline. */
export async function scoreHistory(env: SignalEnv, n = 8) {
  const { results } = await env.DB.prepare(
    `SELECT property_id, week, score FROM score_snapshots
     WHERE week IN (SELECT DISTINCT week FROM score_snapshots ORDER BY week DESC LIMIT ?)
     ORDER BY week`,
  ).bind(n).all<Snapshot>();
  const out: Record<string, number[]> = {};
  for (const r of results) (out[r.property_id] ??= []).push(r.score);
  return out;
}
