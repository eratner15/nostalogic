/**
 * Agent and admin routes for Revival Watch.
 *
 * /api/agent/*  - AGENT_TOKEN. The Revival Watch agent reads what changed and
 *                 posts one digest a week. It cannot write a property: no
 *                 route here updates the properties table.
 * /api/admin/*  - ADMIN_TOKEN. A person approves or rejects each proposal.
 *                 Approval is the only path from agent output to the library.
 *
 * Both tokens are Worker secrets. If a token is not set, its routes return 503.
 */
import { Hono, type Context } from "hono";
import { loadTrackRecord, snapshotScores, weeklyLedger, recomputeBuzz } from "./ledger";
import { runSignals } from "./signals";
import { FLAG_LINE, mondayOf } from "./scoring";

export type AgentEnv = {
  DB: D1Database;
  AGENT_TOKEN?: string;
  ADMIN_TOKEN?: string;
  RESEND_API_KEY?: string;
  DIGEST_EMAIL_TO?: string;
  SIGNAL_BATCH?: string;
};

type C = Context<{ Bindings: AgentEnv }>;

/** Fields an approved proposal can change. social_buzz is not here: rubric r3 owns it. */
export const PROPOSABLE_FIELDS = {
  modern_relevance: "int",
  rights_complexity: "int",
  creator_availability: "int",
  current_signal: "text",
} as const;
type Field = keyof typeof PROPOSABLE_FIELDS;
const OUTCOME_KINDS = ["announced", "released", "denied"] as const;
const MAX_ITEMS = 60;

function sameToken(given: string | undefined, want: string): boolean {
  if (!given || given.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= given.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}

function guard(kind: "agent" | "admin") {
  return async (c: C, next: () => Promise<void>) => {
    const want = kind === "agent" ? c.env.AGENT_TOKEN : c.env.ADMIN_TOKEN;
    if (!want) return c.json({ error: `${kind} access is not configured` }, 503);
    if (!sameToken(c.req.header(`x-${kind}-token`), want)) return c.json({ error: "unauthorized" }, 401);
    await next();
  };
}

const isDay = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isHttpUrl = (s: unknown): s is string => {
  if (typeof s !== "string" || s.length > 600) return false;
  try { return ["http:", "https:"].includes(new URL(s).protocol); } catch { return false; }
};
const str = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export const agentApi = new Hono<{ Bindings: AgentEnv }>();

// ───────────────────────── agent ─────────────────────────
agentApi.use("/agent/*", guard("agent"));

/**
 * Everything the agent needs for one run, summarised. Raw daily readings are
 * not returned (thousands of rows); the agent gets crossings, buzz moves,
 * gaps since its cursor, and the open calls.
 */
agentApi.get("/agent/changes", async (c) => {
  const db = c.env.DB;
  const stored = await db.prepare("SELECT cursor FROM agent_cursor WHERE agent = 'revival-watch'").first<{ cursor: number }>();
  const since = Number(c.req.query("since") ?? stored?.cursor ?? 0);
  const maxRow = await db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM signal_readings").first<{ m: number }>();
  const weeks = (await db.prepare("SELECT DISTINCT week FROM score_snapshots ORDER BY week DESC LIMIT 2").all<{ week: string }>()).results.map((r) => r.week);
  const [cur, prev] = weeks;

  const moves = cur && prev
    ? (await db.prepare(
        `SELECT p.id, p.name, p.year, p.category, a.score AS score, b.score AS prev_score,
                a.social_buzz AS buzz, b.social_buzz AS prev_buzz
         FROM score_snapshots a JOIN score_snapshots b ON b.property_id = a.property_id AND b.week = ?2
         JOIN properties p ON p.id = a.property_id
         WHERE a.week = ?1 AND (ABS(a.score - b.score) >= 3 OR ABS(a.social_buzz - b.social_buzz) >= 10
                OR (a.score >= ?3) != (b.score >= ?3))
         ORDER BY ABS(a.score - b.score) DESC`,
      ).bind(cur, prev, FLAG_LINE).all()).results
    : [];

  const gaps = (await db.prepare(
    `SELECT r.property_id, p.name, r.source, MAX(r.read_at) AS last_seen, COUNT(*) AS n,
            b.last_error IS NOT NULL AND b.last_error NOT LIKE 'partial:%' AS still_failing,
            COALESCE(b.last_error, MAX(r.detail)) AS detail
     FROM signal_readings r JOIN properties p ON p.id = r.property_id
     LEFT JOIN signal_bookmarks b ON b.property_id = r.property_id AND b.source = r.source
     WHERE r.status = 'gap' AND r.id > ? GROUP BY r.property_id, r.source
     ORDER BY still_failing DESC, n DESC LIMIT 60`,
  ).bind(since).all()).results;

  const track = await loadTrackRecord(c.env, new Date());
  const openCalls = track.calls.filter((x) => x.state === "open").map((x) => ({
    property_id: x.property_id, name: x.name, opened: x.opened, open_score: x.open_score, closes: x.closes,
  }));
  const top = (await db.prepare(
    "SELECT id, name, year, category FROM properties ORDER BY (social_buzz * 0.3 + modern_relevance * 0.3) DESC LIMIT 15",
  ).all()).results;
  const openProposals = (await db.prepare(
    "SELECT item_key, property_id, kind, title FROM proposals WHERE status = 'open'",
  ).all()).results;

  return c.json({
    cursor_from: stored?.cursor ?? 0,
    since,
    cursor_to: maxRow?.m ?? 0,
    week: mondayOf(new Date()),
    snapshot_weeks: { current: cur ?? null, previous: prev ?? null },
    flag_line: FLAG_LINE,
    moves,
    open_calls: openCalls,
    watch_list: top,
    gaps,
    open_proposals: openProposals,
    proposable_fields: Object.keys(PROPOSABLE_FIELDS),
  });
});

agentApi.get("/agent/property/:id", async (c) => {
  const id = c.req.param("id");
  const p = await c.env.DB.prepare(
    "SELECT id, name, year, category, genre, modern_relevance, social_buzz, social_buzz_hand, rights_complexity, creator_availability, current_signal, rubric_version, scored_at FROM properties WHERE id = ?",
  ).bind(id).first();
  if (!p) return c.json({ error: "not found" }, 404);
  const [snaps, outs, props, marks] = await Promise.all([
    c.env.DB.prepare("SELECT week, score, social_buzz FROM score_snapshots WHERE property_id = ? ORDER BY week DESC LIMIT 12").bind(id).all(),
    c.env.DB.prepare("SELECT kind, event_date, source_url FROM outcomes WHERE property_id = ? ORDER BY event_date").bind(id).all(),
    c.env.DB.prepare("SELECT item_key, kind, title, status FROM proposals WHERE property_id = ? ORDER BY created_at DESC LIMIT 20").bind(id).all(),
    c.env.DB.prepare("SELECT source, query, read_to, last_error FROM signal_bookmarks WHERE property_id = ?").bind(id).all(),
  ]);
  return c.json({ property: p, snapshots: snaps.results, outcomes: outs.results, proposals: props.results, sources: marks.results });
});

type DigestItem = {
  item_key: string; property_id: string; kind: "outcome" | "field" | "note";
  title: string; source_url?: string; payload?: Record<string, unknown>;
};

/** Validate one item. Returns an error string, or null when it is good. */
export function checkItem(i: DigestItem, knownIds: Set<string>): string | null {
  if (!i || typeof i !== "object") return "item is not an object";
  if (!/^[a-z0-9:._-]{3,160}$/i.test(String(i.item_key ?? ""))) return "item_key: 3-160 chars of [a-z0-9:._-]";
  if (!knownIds.has(i.property_id)) return `unknown property_id ${i.property_id}`;
  if (!str(i.title, 200)) return "title is required";
  if (i.kind === "note") return null;
  if (!isHttpUrl(i.source_url)) return "source_url must be an http(s) URL";
  const p = i.payload ?? {};
  if (i.kind === "outcome") {
    if (!OUTCOME_KINDS.includes(p.kind as never)) return "payload.kind must be announced|released|denied";
    if (!isDay(p.event_date)) return "payload.event_date must be YYYY-MM-DD";
    if (!str(p.quote, 500)) return "payload.quote is required: the exact sentence from the source";
    return null;
  }
  if (i.kind === "field") {
    const f = p.field as Field;
    if (!(f in PROPOSABLE_FIELDS)) return `payload.field must be one of ${Object.keys(PROPOSABLE_FIELDS).join(", ")}`;
    if (PROPOSABLE_FIELDS[f] === "int") {
      if (!Number.isInteger(p.to) || (p.to as number) < 0 || (p.to as number) > 100) return "payload.to must be an integer 0-100";
    } else if (!str(p.to, 300)) return "payload.to must be text";
    if (!str(p.reason, 600)) return "payload.reason is required";
    return null;
  }
  return "kind must be outcome|field|note";
}

/**
 * The confirmation step of the article. The digest, its proposals and the
 * new cursor commit in one D1 batch, or nothing commits. If cursor_from does
 * not match the stored cursor, the post is refused, so two runs cannot both
 * claim the same span. The agent must treat anything but ok:true as failure.
 */
agentApi.post("/agent/digest", async (c) => {
  const b = await c.req.json<{
    cursor_from?: number; cursor_to?: number; summary_md?: string;
    unread_sources?: string[]; items?: DigestItem[];
  }>().catch(() => null);
  if (!b) return c.json({ ok: false, error: "body must be JSON" }, 400);
  const db = c.env.DB;
  const stored = await db.prepare("SELECT cursor FROM agent_cursor WHERE agent = 'revival-watch'").first<{ cursor: number }>();
  const maxRow = await db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM signal_readings").first<{ m: number }>();
  if (!Number.isInteger(b.cursor_from) || b.cursor_from !== (stored?.cursor ?? 0)) {
    return c.json({ ok: false, error: "stale cursor", stored_cursor: stored?.cursor ?? 0 }, 409);
  }
  if (!Number.isInteger(b.cursor_to) || (b.cursor_to as number) < (b.cursor_from as number) || (b.cursor_to as number) > (maxRow?.m ?? 0)) {
    return c.json({ ok: false, error: "cursor_to must be between cursor_from and the newest reading id" }, 400);
  }
  const summary = str(b.summary_md, 20000);
  if (!summary) return c.json({ ok: false, error: "summary_md is required" }, 400);
  const unread = (Array.isArray(b.unread_sources) ? b.unread_sources : []).map((s) => str(s, 200)).filter(Boolean).slice(0, 50);
  const items = Array.isArray(b.items) ? b.items : [];
  // Reject rather than truncate: the agent is told not to retry a successful digest.
  if (items.length > MAX_ITEMS) return c.json({ ok: false, error: `at most ${MAX_ITEMS} items per digest; merge or drop the weakest` }, 400);

  const ids = new Set((await db.prepare("SELECT id FROM properties").all<{ id: string }>()).results.map((r) => r.id));
  const errors = items.map((i, n) => ({ n, error: checkItem(i, ids) })).filter((e) => e.error);
  if (errors.length) return c.json({ ok: false, error: "invalid items", items: errors }, 400);

  const id = crypto.randomUUID();
  const week = mondayOf(new Date());
  const proposals = items.filter((i) => i.kind !== "note");
  // Notes have no proposal row; keep them with the digest so the reviewer sees them.
  const notes = items.filter((i) => i.kind === "note").map((i) => `- ${str(i.title, 200)} (${i.property_id})`);
  const summaryStored = notes.length ? `${summary}\n\n## Notes for review\n${notes.join("\n")}` : summary;
  // One transaction. Every write is conditioned on the cursor still being
  // cursor_from, so a concurrent post makes this batch write nothing at all.
  const res = await db.batch([
    db.prepare(
      `INSERT INTO digests (id, week, summary_md, unread_sources, cursor_from, cursor_to)
       SELECT ?, ?, ?, ?, ?, ? WHERE (SELECT cursor FROM agent_cursor WHERE agent = 'revival-watch') = ?`,
    ).bind(id, week, summaryStored, JSON.stringify(unread), b.cursor_from, b.cursor_to, b.cursor_from),
    ...proposals.map((i) =>
      db.prepare(
        `INSERT OR IGNORE INTO proposals (id, digest_id, item_key, property_id, kind, title, payload, source_url)
         SELECT ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM digests WHERE id = ?)`,
      ).bind(crypto.randomUUID(), id, i.item_key, i.property_id, i.kind, str(i.title, 200),
        JSON.stringify(i.payload ?? {}), i.source_url, id),
    ),
    db.prepare(
      "UPDATE agent_cursor SET cursor = ? WHERE agent = 'revival-watch' AND EXISTS (SELECT 1 FROM digests WHERE id = ?)",
    ).bind(b.cursor_to, id),
  ]);
  if (!res[0].meta.changes) return c.json({ ok: false, error: "stale cursor" }, 409);
  const inserted = res.slice(1, 1 + proposals.length).reduce((n, r) => n + (r.meta.changes ?? 0), 0);
  c.executionCtx.waitUntil(emailDigest(c.env, id, week, summaryStored, unread, inserted).catch(() => {}));
  return c.json({ ok: true, digest_id: id, proposals_new: inserted, proposals_repeat: proposals.length - inserted });
});

/** Optional email to Evan. A failed email never undoes the digest. */
async function emailDigest(env: AgentEnv, id: string, week: string, summary: string, unread: string[], n: number) {
  if (!env.RESEND_API_KEY || !env.DIGEST_EMAIL_TO) return;
  const text = `${summary}\n\n${n} new proposal(s) to review: https://nostalogic.cafecito-ai.com/admin\n` +
    (unread.length ? `\nNot read: ${unread.join("; ")}\n` : "") + `\nDigest ${id}`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "NostalDamus Revival Watch <reports@cafecito-ai.com>",
      to: [env.DIGEST_EMAIL_TO],
      subject: `Revival Watch: week of ${week}`,
      text,
    }),
  });
}

// ───────────────────────── admin ─────────────────────────
agentApi.use("/admin/*", guard("admin"));

agentApi.get("/admin/proposals", async (c) => {
  const status = ["open", "approved", "rejected"].includes(c.req.query("status") ?? "") ? c.req.query("status") : "open";
  const { results } = await c.env.DB.prepare(
    `SELECT pr.*, p.name, p.year FROM proposals pr JOIN properties p ON p.id = pr.property_id
     WHERE pr.status = ? ORDER BY pr.created_at DESC LIMIT 200`,
  ).bind(status).all<Record<string, unknown>>();
  return c.json({ proposals: results.map((r) => ({ ...r, payload: JSON.parse(String(r.payload)) })) });
});

agentApi.post("/admin/proposals/:id/approve", async (c) => {
  const db = c.env.DB;
  const pr = await db.prepare("SELECT * FROM proposals WHERE id = ? AND status = 'open'").bind(c.req.param("id")).first<{
    id: string; property_id: string; kind: string; payload: string; source_url: string; title: string;
  }>();
  if (!pr) return c.json({ error: "no open proposal with that id" }, 404);
  const p = JSON.parse(pr.payload) as Record<string, unknown>;
  const close = db.prepare("UPDATE proposals SET status = 'approved', decided_at = datetime('now') WHERE id = ? AND status = 'open'").bind(pr.id);

  if (pr.kind === "outcome") {
    if (!OUTCOME_KINDS.includes(p.kind as never) || !isDay(p.event_date)) return c.json({ error: "bad outcome payload" }, 422);
    // Insert only if this request won the open -> approved transition: a second
    // concurrent approval finds an outcome for the proposal and writes nothing.
    const res = await db.batch([
      close,
      db.prepare(
        `INSERT INTO outcomes (id, property_id, kind, event_date, source_url, note, proposal_id)
         SELECT ?, ?, ?, ?, ?, ?, ? WHERE changes() = 1
           AND NOT EXISTS (SELECT 1 FROM outcomes WHERE proposal_id = ?)`,
      ).bind(crypto.randomUUID(), pr.property_id, p.kind, p.event_date, pr.source_url, pr.title, pr.id, pr.id),
    ]);
    if (!res[0].meta.changes) return c.json({ error: "already decided" }, 409);
    return c.json({ ok: true });
  }

  const field = p.field as Field;
  if (!(field in PROPOSABLE_FIELDS)) return c.json({ error: "field is not proposable" }, 422);
  // Column name comes from the allowlist above, never from the request.
  // Close first, then update only if this request won the open -> approved
  // transition, so a concurrent reject can never be followed by the change.
  const res = await db.batch([
    close,
    db.prepare(`UPDATE properties SET ${field} = ?, scored_at = datetime('now') WHERE id = ? AND changes() = 1`).bind(p.to, pr.property_id),
  ]);
  if (!res[0].meta.changes) return c.json({ error: "already decided" }, 409);
  return c.json({ ok: true, changed: res[1].meta.changes });
});

agentApi.post("/admin/proposals/:id/reject", async (c) => {
  const r = await c.env.DB.prepare(
    "UPDATE proposals SET status = 'rejected', decided_at = datetime('now') WHERE id = ? AND status = 'open'",
  ).bind(c.req.param("id")).run();
  if (!r.meta.changes) return c.json({ error: "no open proposal with that id" }, 404);
  return c.json({ ok: true });
});

agentApi.get("/admin/digests", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, week, summary_md, unread_sources, created_at FROM digests ORDER BY created_at DESC LIMIT 26",
  ).all<Record<string, unknown>>();
  return c.json({ digests: results.map((r) => ({ ...r, unread_sources: JSON.parse(String(r.unread_sources)) })) });
});

agentApi.get("/admin/sources", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT b.property_id, p.name, b.source, b.query, b.read_to, b.last_error
     FROM signal_bookmarks b JOIN properties p ON p.id = b.property_id ORDER BY b.last_error IS NULL, b.read_to`,
  ).all();
  return c.json({ sources: results });
});

/** Manual triggers, for the first backfill and for tests. Same code as the cron. */
agentApi.post("/admin/run/:job", async (c) => {
  const now = new Date();
  switch (c.req.param("job")) {
    case "signals": return c.json(await runSignals(c.env, now));
    case "buzz": return c.json(await recomputeBuzz(c.env, now));
    case "snapshot": return c.json(await snapshotScores(c.env, now));
    case "weekly": return c.json(await weeklyLedger(c.env, now));
    default: return c.json({ error: "job must be signals|buzz|snapshot|weekly" }, 400);
  }
});
