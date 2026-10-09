/**
 * Per-property signal history for the analytics page: daily readings per
 * source, the bookmark state, and the weekly score snapshots. Read-only.
 */
import type { DayPoint } from "../src/lib/signals";
import type { SignalEnv } from "./signals";
import { addDays } from "./scoring";

export type ReadingRow = { source: string; day: string; value: number };
export type BookmarkRow = { source: string; query: string; read_to: string | null; last_error: string | null };
export type SnapshotRow = { week: string; score: number; social_buzz: number; modern_relevance: number; window_alignment: number; rubric_version: string };

export type SourceSeries = { query: string | null; read_to: string | null; last_error: string | null; days: DayPoint[] };
export type PropertySignals = { property_id: string; from: string; to: string; sources: Record<string, SourceSeries>; snapshots: SnapshotRow[] };

/** Group readings by source, day-sorted. A source with a bookmark but no readings still appears, with an empty series. */
export function shapeSignals(id: string, from: string, to: string, readings: ReadingRow[], bookmarks: BookmarkRow[], snapshots: SnapshotRow[]): PropertySignals {
  const sources: Record<string, SourceSeries> = {};
  for (const b of bookmarks) sources[b.source] = { query: b.query, read_to: b.read_to, last_error: b.last_error, days: [] };
  for (const r of readings) {
    (sources[r.source] ??= { query: null, read_to: null, last_error: null, days: [] }).days.push({ day: r.day, value: r.value });
  }
  for (const s of Object.values(sources)) s.days.sort((a, b) => a.day.localeCompare(b.day));
  return { property_id: id, from, to, sources, snapshots: [...snapshots].sort((a, b) => a.week.localeCompare(b.week)) };
}

/** The last `days` days of readings for one property, or null when the property does not exist. */
export async function loadSignals(env: SignalEnv, id: string, now: Date, days = 120): Promise<PropertySignals | null> {
  const exists = await env.DB.prepare("SELECT id FROM properties WHERE id = ?").bind(id).first<{ id: string }>();
  if (!exists) return null;
  const to = addDays(now.toISOString().slice(0, 10), -1);
  const from = addDays(to, -(days - 1));
  const [readings, bookmarks, snapshots] = await Promise.all([
    env.DB.prepare(
      "SELECT source, day, value FROM signal_readings WHERE property_id = ? AND status = 'ok' AND day BETWEEN ? AND ? ORDER BY day",
    ).bind(id, from, to).all<ReadingRow>(),
    env.DB.prepare("SELECT source, query, read_to, last_error FROM signal_bookmarks WHERE property_id = ?").bind(id).all<BookmarkRow>(),
    env.DB.prepare(
      "SELECT week, score, social_buzz, modern_relevance, window_alignment, rubric_version FROM score_snapshots WHERE property_id = ? ORDER BY week",
    ).bind(id).all<SnapshotRow>(),
  ]);
  return shapeSignals(id, from, to, readings.results, bookmarks.results, snapshots.results);
}
