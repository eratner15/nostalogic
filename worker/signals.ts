/**
 * Signal pipeline. Deterministic: fetch, parse, store. No LLM call here.
 *
 * Each (property, source) pair has a bookmark (signal_bookmarks.read_to, the
 * last day fully read). Each cron run takes the stalest pairs, reads from the
 * day after the bookmark through yesterday (UTC), and advances the bookmark
 * in the same D1 batch as the readings. A failed read writes one 'gap' row
 * and leaves the bookmark where it was, so the next run covers the same span.
 */
import { addDays } from "./scoring";

export type SignalEnv = { DB: D1Database; SIGNAL_BATCH?: string };

/** First read of a pair backfills this many days: 30-day window + 90-day prior. */
export const BACKFILL_DAYS = 120;
const UA = "NostalDamus/1.0 (https://nostalogic.cafecito-ai.com; team@cafecito-ai.com)";
const ARCTIC_MAX_PAGES = 3;

type Pair = { property_id: string; source: "wikipedia" | "arcticshift"; query: string; read_to: string | null };
type DayCount = { day: string; value: number };
type Fetched = { ok: true; days: DayCount[]; readTo: string; note?: string } | { ok: false; error: string };

export function yesterday(now: Date): string {
  return addDays(now.toISOString().slice(0, 10), -1);
}

export async function runSignals(env: SignalEnv, now: Date, fetcher: typeof fetch = fetch) {
  // About 240 pairs go stale every midnight; 20 an hour reads them all in ~12 hours.
  const limit = Math.max(1, Math.min(25, Number(env.SIGNAL_BATCH ?? 20)));
  const y = yesterday(now);
  const { results } = await env.DB.prepare(
    `SELECT property_id, source, query, read_to FROM signal_bookmarks
     WHERE read_to IS NULL OR read_to < ?
     -- Pairs that failed last time go to the back, so a few dead sources
     -- cannot fill every batch and starve the rest of the corpus.
     ORDER BY last_error IS NOT NULL AND last_error NOT LIKE 'partial:%', read_to IS NOT NULL, read_to, property_id
     LIMIT ?`,
  ).bind(y, limit).all<Pair>();

  const log = { pairs: results.length, ok: 0, gap: 0 };
  let lastArctic = false;
  for (const pair of results) {
    if (pair.source === "arcticshift" && lastArctic) await pause(1000);
    lastArctic = pair.source === "arcticshift";
    const from = pair.read_to ? addDays(pair.read_to, 1) : addDays(y, -(BACKFILL_DAYS - 1));
    let res: Fetched;
    try {
      res = pair.source === "wikipedia"
        ? await fetchWikipedia(fetcher, pair.query, from, y)
        : await fetchArcticShift(fetcher, pair.query, from, y, pair.read_to === null);
    } catch (e) {
      res = { ok: false, error: String(e).slice(0, 300) };
    }
    if (!res.ok) {
      log.gap++;
      await env.DB.batch([
        env.DB.prepare(
          "INSERT INTO signal_readings (property_id, source, status, detail) VALUES (?, ?, 'gap', ?)",
        ).bind(pair.property_id, pair.source, res.error),
        env.DB.prepare(
          "UPDATE signal_bookmarks SET last_error = ? WHERE property_id = ? AND source = ?",
        ).bind(res.error, pair.property_id, pair.source),
      ]);
      continue;   // bookmark unchanged
    }
    log.ok++;
    // D1 caps bound parameters at 100 per statement: write 20 days per INSERT.
    const writes: D1PreparedStatement[] = [];
    for (let i = 0; i < res.days.length; i += 20) {
      const chunk = res.days.slice(i, i + 20);
      writes.push(
        env.DB.prepare(
          `INSERT INTO signal_readings (property_id, source, status, day, value) VALUES ${chunk.map(() => "(?, ?, 'ok', ?, ?)").join(", ")}
           ON CONFLICT (property_id, source, day) WHERE status = 'ok' DO UPDATE SET value = excluded.value, read_at = datetime('now')`,
        ).bind(...chunk.flatMap((d) => [pair.property_id, pair.source, d.day, d.value])),
      );
    }
    writes.push(
      env.DB.prepare(
        "UPDATE signal_bookmarks SET read_to = ?, last_error = ? WHERE property_id = ? AND source = ?",
      ).bind(res.readTo, res.note ?? null, pair.property_id, pair.source),
    );
    await env.DB.batch(writes);
  }
  return log;
}

/** Every day in [from, to], so a day with no views or posts is a real 0, not a gap. */
export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export async function fetchWikipedia(fetcher: typeof fetch, title: string, from: string, to: string): Promise<Fetched> {
  if (from > to) return { ok: true, days: [], readTo: to };
  const compact = (d: string) => d.replaceAll("-", "");
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/${encodeURIComponent(title.replaceAll(" ", "_"))}/daily/${compact(from)}/${compact(to)}`;
  const res = await fetcher(url, { headers: { "user-agent": UA, accept: "application/json" } });
  if (res.status === 404) {
    // The API answers 404 both for a wrong title and for a span with no data yet.
    // A one-day span is most likely "not published yet": no change, no gap.
    // A longer span is a wrong title: a gap, so it shows up instead of reading as zero views.
    if (from >= addDays(to, -1)) return { ok: true, days: [], readTo: addDays(from, -1) };
    return { ok: false, error: `wikipedia 404 for "${title}"` };
  }
  if (!res.ok) return { ok: false, error: `wikipedia HTTP ${res.status}` };
  const j = (await res.json()) as { items?: { timestamp: string; views: number }[] };
  const views = new Map<string, number>();
  for (const it of j.items ?? []) {
    const t = it.timestamp;
    views.set(`${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}`, it.views);
  }
  // Wikimedia can lag a day. Only advance the bookmark through the last day it returned.
  const last = [...views.keys()].sort().pop();
  if (!last) return { ok: false, error: "wikipedia returned no days" };
  return { ok: true, days: daysBetween(from, last).map((day) => ({ day, value: views.get(day) ?? 0 })), readTo: last };
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Arctic Shift answers 422 "Timeout. Maybe slow down a bit" at random. Retry once. */
async function arcticGet(fetcher: typeof fetch, url: string): Promise<Response> {
  const init = { headers: { "user-agent": UA, accept: "application/json" } };
  const res = await fetcher(url, init);
  if (res.status !== 422) return res;
  await pause(3000);
  return fetcher(url, init);
}

/** Arctic Shift returns an empty list for a subreddit that does not exist. Check once. */
async function subredditExists(fetcher: typeof fetch, subreddit: string): Promise<boolean | string> {
  const res = await arcticGet(
    fetcher,
    `https://arctic-shift.photon-reddit.com/api/subreddits/search?subreddit=${encodeURIComponent(subreddit)}&fields=display_name`,
  );
  if (!res.ok) return `arcticshift subreddit lookup HTTP ${res.status}`;
  const j = (await res.json()) as { data?: { display_name: string }[] | null };
  return (j.data ?? []).some((d) => d.display_name.toLowerCase() === subreddit.toLowerCase());
}

export async function fetchArcticShift(
  fetcher: typeof fetch, subreddit: string, from: string, to: string, firstRead = false,
): Promise<Fetched> {
  if (from > to) return { ok: true, days: [], readTo: to };
  if (firstRead) {
    // Without this, a wrong subreddit name reads as zero posts forever.
    const exists = await subredditExists(fetcher, subreddit);
    if (exists !== true) return { ok: false, error: exists === false ? `arcticshift: r/${subreddit} not found` : exists };
    await pause(1000);
  }
  const counts = new Map<string, number>();
  let after = `${from}T00:00:00Z`;
  const before = `${addDays(to, 1)}T00:00:00Z`;
  for (let page = 0; page < ARCTIC_MAX_PAGES; page++) {
    if (page > 0) await pause(1000);   // Arctic Shift answers 422 "slow down" to bursts
    const url = `https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=${encodeURIComponent(subreddit)}&after=${encodeURIComponent(after)}&before=${encodeURIComponent(before)}&sort=asc&limit=100&fields=id,created_utc`;
    const res = await arcticGet(fetcher, url);
    if (!res.ok) return { ok: false, error: `arcticshift HTTP ${res.status}: ${(await res.text()).slice(0, 120)}` };
    const j = (await res.json()) as { data?: { created_utc: number }[] | null; error?: string | null };
    if (j.error) return { ok: false, error: `arcticshift: ${j.error}`.slice(0, 300) };
    const posts = j.data ?? [];
    for (const p of posts) {
      const day = new Date(p.created_utc * 1000).toISOString().slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    if (posts.length < 100) {
      return { ok: true, days: daysBetween(from, to).map((day) => ({ day, value: counts.get(day) ?? 0 })), readTo: to };
    }
    after = new Date((posts[posts.length - 1].created_utc + 1) * 1000).toISOString();
  }
  // Busy subreddit: more than the page budget. Store the complete days only and
  // move the bookmark to the last complete day; the next run continues from there.
  const lastDay = new Date(after).toISOString().slice(0, 10);
  const complete = addDays(lastDay, -1);
  if (complete < from) return { ok: false, error: `arcticshift: r/${subreddit} over ${ARCTIC_MAX_PAGES * 100} posts in one day` };
  return {
    ok: true,
    days: daysBetween(from, complete).map((day) => ({ day, value: counts.get(day) ?? 0 })),
    readTo: complete,
    note: `partial: read through ${complete}`,
  };
}

/** Trailing-window means for the buzz formula. Needs most of the window, or null. */
export async function signalSummaries(env: SignalEnv, now: Date) {
  const y = yesterday(now);
  const d30 = addDays(y, -29);
  const d120 = addDays(y, -119);
  const { results } = await env.DB.prepare(
    `SELECT p.id AS id,
       (SELECT AVG(value) FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'wikipedia' AND r.status = 'ok' AND r.day BETWEEN ?1 AND ?2) AS wiki30,
       (SELECT COUNT(*)   FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'wikipedia' AND r.status = 'ok' AND r.day BETWEEN ?1 AND ?2) AS wiki30n,
       (SELECT AVG(value) FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'wikipedia' AND r.status = 'ok' AND r.day BETWEEN ?3 AND ?4) AS wikiPrior90,
       (SELECT COUNT(*)   FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'wikipedia' AND r.status = 'ok' AND r.day BETWEEN ?3 AND ?4) AS wikiPrior90n,
       (SELECT SUM(value) FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'arcticshift' AND r.status = 'ok' AND r.day BETWEEN ?1 AND ?2) AS reddit30,
       (SELECT COUNT(*)   FROM signal_readings r WHERE r.property_id = p.id AND r.source = 'arcticshift' AND r.status = 'ok' AND r.day BETWEEN ?1 AND ?2) AS reddit30n
     FROM properties p`,
  ).bind(d30, y, d120, addDays(d30, -1)).all<Record<string, number | null> & { id: string }>();
  // Coverage rule: at least 25 of 30 days, and 75 of 90 prior days, or the window is null.
  return results.map((r) => ({
    id: r.id,
    wiki30: Number(r.wiki30n) >= 25 ? Number(r.wiki30) : null,
    wikiPrior90: Number(r.wikiPrior90n) >= 75 ? Number(r.wikiPrior90) : null,
    reddit30: Number(r.reddit30n) >= 25 ? Number(r.reddit30) : null,
  }));
}
