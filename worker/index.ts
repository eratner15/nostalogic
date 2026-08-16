/**
 * NostalDamus API worker. Serves the static Next export as assets and the
 * product API under /nostaldamus/api/*.
 *
 * Two-layer scoring, per the original spec's standing rule: the deterministic
 * Revival Readiness Score always works with no API key, and Claude features
 * (Remix Lab generation, Prophet Chat) fail closed to a clear "not
 * configured" response when ANTHROPIC_API_KEY is absent rather than breaking
 * the page.
 */
import { Hono } from "hono";

type Env = {
  DB: D1Database;
  ASSETS: Fetcher;
  ANTHROPIC_API_KEY?: string;
};

const app = new Hono<{ Bindings: Env }>().basePath("/api");

const CURRENT_YEAR = 2026;
const PEAK_CHILDHOOD_AGE = 12;
const SWEET_SPOT_CENTER = 40;

/** Deterministic score from the original spec: buzz .30, window .40, relevance .30. */
function readiness(p: { social_buzz: number; modern_relevance: number; year: number }) {
  const fanAgeNow = CURRENT_YEAR - p.year + PEAK_CHILDHOOD_AGE;
  const windowAlignment = Math.max(0, 100 - Math.abs(fanAgeNow - SWEET_SPOT_CENTER) * 8);
  return Math.round(p.social_buzz * 0.3 + windowAlignment * 0.4 + p.modern_relevance * 0.3);
}

function rowToProperty(r: Record<string, unknown>) {
  const base = {
    id: r.id,
    name: r.name,
    year: r.year,
    category: r.category,
    genre: r.genre,
    originalImpact: r.original_impact,
    modernRelevance: r.modern_relevance,
    socialBuzz: r.social_buzz,
    rightsComplexity: r.rights_complexity,
    creatorAvailability: r.creator_availability,
    briefDescription: r.brief_description,
    coreAudience: r.core_audience,
    currentSignal: r.current_signal,
    revivalFormat: r.revival_format,
    tags: JSON.parse(String(r.tags ?? "[]")),
    preserve: JSON.parse(String(r.preserve ?? "[]")),
    update: JSON.parse(String(r.update_recs ?? "[]")),
    rubricVersion: r.rubric_version,
    scoredAt: r.scored_at,
  };
  return {
    ...base,
    revivalReadinessScore: readiness({
      social_buzz: Number(r.social_buzz),
      modern_relevance: Number(r.modern_relevance),
      year: Number(r.year),
    }),
  };
}

app.get("/properties", async (c) => {
  const cat = c.req.query("category");
  const year = c.req.query("year");
  const q = c.req.query("q");
  let sql = "SELECT * FROM properties WHERE 1=1";
  const binds: unknown[] = [];
  if (cat && cat !== "All") { sql += " AND category = ?"; binds.push(cat); }
  if (year && year !== "All") { sql += " AND year = ?"; binds.push(Number(year)); }
  if (q) { sql += " AND (name LIKE ? OR brief_description LIKE ? OR tags LIKE ?)"; const like = `%${q}%`; binds.push(like, like, like); }
  sql += " ORDER BY name";
  const { results } = await c.env.DB.prepare(sql).bind(...binds).all();
  const items = results.map(rowToProperty).sort(
    (a, b) => (b.revivalReadinessScore as number) - (a.revivalReadinessScore as number),
  ).map((p, i) => ({ ...p, rank: i + 1 }));
  return c.json({ count: items.length, properties: items });
});

app.get("/properties/:id", async (c) => {
  const row = await c.env.DB.prepare("SELECT * FROM properties WHERE id = ?")
    .bind(c.req.param("id")).first();
  if (!row) return c.json({ error: "not found" }, 404);
  return c.json(rowToProperty(row as Record<string, unknown>));
});

/** Shared Claude caller. Fails closed with a helpful 503 when unconfigured. */
async function claude(env: Env, system: string, user: string): Promise<{ ok: true; text: string } | { ok: false; status: number; error: string }> {
  if (!env.ANTHROPIC_API_KEY) {
    return { ok: false, status: 503, error: "AI features are not configured yet. The library and deterministic scores work without them." };
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) return { ok: false, status: 502, error: `model call failed (${res.status})` };
  const j = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (j.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
  return { ok: true, text };
}

/** Daily counter; limits enforced loosely until Phase 3 defines tiers. */
async function bumpUsage(env: Env, bucket: string, actor: string, limit: number): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  await env.DB.prepare(
    `INSERT INTO usage_counters (bucket, actor_key, day, n) VALUES (?, ?, ?, 1)
     ON CONFLICT(bucket, actor_key, day) DO UPDATE SET n = n + 1`,
  ).bind(bucket, actor, day).run();
  const row = await env.DB.prepare(
    "SELECT n FROM usage_counters WHERE bucket = ? AND actor_key = ? AND day = ?",
  ).bind(bucket, actor, day).first<{ n: number }>();
  return (row?.n ?? 0) <= limit;
}

app.post("/remix", async (c) => {
  const body = await c.req.json<{ propertyIds?: string[]; sessionKey?: string }>().catch(() => null);
  const ids = (body?.propertyIds ?? []).slice(0, 4);
  const actor = (body?.sessionKey ?? "anon").slice(0, 64);
  if (ids.length < 2) return c.json({ error: "pick at least two properties" }, 400);
  if (!(await bumpUsage(c.env, "remix", actor, 20))) return c.json({ error: "daily remix limit reached" }, 429);

  const marks = "?,".repeat(ids.length).slice(0, -1);
  const { results } = await c.env.DB.prepare(`SELECT * FROM properties WHERE id IN (${marks})`).bind(...ids).all();
  if (results.length < 2) return c.json({ error: "unknown properties" }, 400);
  const props = results.map(rowToProperty);

  const out = await claude(
    c.env,
    "You are NostalDamus, a nostalgia-IP revival strategist. Blend the given properties into ONE revival concept. Output markdown: a title line, a two-sentence logline, format, target audience, what to preserve from each source, what to modernize, and one risk. Be specific and concise. Never invent facts about the original properties beyond what is provided.",
    JSON.stringify(props.map((p) => ({ name: p.name, year: p.year, category: p.category, genre: p.genre, description: p.briefDescription, preserve: p.preserve, update: p.update }))),
  );
  if (!out.ok) return c.json({ error: out.error }, out.status as 503);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO remixes (id, property_ids, concept, model) VALUES (?, ?, ?, ?)",
  ).bind(id, JSON.stringify(ids), out.text, "claude-sonnet-5").run();
  return c.json({ id, concept: out.text, propertyIds: ids });
});

app.get("/remixes/:id", async (c) => {
  const row = await c.env.DB.prepare("SELECT * FROM remixes WHERE id = ?").bind(c.req.param("id")).first();
  if (!row) return c.json({ error: "not found" }, 404);
  return c.json({ id: row.id, propertyIds: JSON.parse(String(row.property_ids)), concept: row.concept, createdAt: row.created_at });
});

app.post("/chat", async (c) => {
  const body = await c.req.json<{ message?: string; sessionKey?: string }>().catch(() => null);
  const msg = (body?.message ?? "").trim().slice(0, 1000);
  const session = (body?.sessionKey ?? "anon").slice(0, 64);
  if (!msg) return c.json({ error: "empty message" }, 400);
  if (!(await bumpUsage(c.env, "chat", session, 40))) return c.json({ error: "daily chat limit reached" }, 429);

  // Retrieval: cheap LIKE match over names/tags/descriptions, top 8 by score.
  const like = `%${msg.split(/\s+/).slice(0, 4).join("%")}%`;
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM properties WHERE name LIKE ?1 OR tags LIKE ?1 OR brief_description LIKE ?1 LIMIT 8`,
  ).bind(like).all();
  const pool = results.length ? results : (await c.env.DB.prepare("SELECT * FROM properties").all()).results;
  const ranked = pool.map(rowToProperty)
    .sort((a, b) => (b.revivalReadinessScore as number) - (a.revivalReadinessScore as number)).slice(0, 8);

  const out = await claude(
    c.env,
    "You are the Prophet, NostalDamus's chat analyst for 1993-1998 IP revival. Answer ONLY from the provided scored properties. Cite each property you use as Name (year, score N). If the library cannot answer, say so and suggest the closest properties it has. Two short paragraphs maximum.",
    `Library slice (top-ranked matches): ${JSON.stringify(ranked.map((p) => ({ name: p.name, year: p.year, category: p.category, score: p.revivalReadinessScore, signal: p.currentSignal })))}\n\nQuestion: ${msg}`,
  );
  if (!out.ok) return c.json({ error: out.error }, out.status as 503);

  const cited = ranked.map((p) => p.id);
  await c.env.DB.prepare(
    "INSERT INTO chat_messages (session_key, role, content, cited_ids) VALUES (?, 'user', ?, '[]'), (?, 'assistant', ?, ?)",
  ).bind(session, msg, session, out.text, JSON.stringify(cited)).run();
  return c.json({ answer: out.text, cited });
});

app.get("/health", async (c) => {
  const n = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM properties").first<{ n: number }>();
  return c.json({ ok: true, properties: n?.n ?? 0, ai: Boolean(c.env.ANTHROPIC_API_KEY) });
});

const CANONICAL = "https://nostalogic.cafecito-ai.com";

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    // The subdomain is canonical. The old cafecito-ai.com/nostaldamus path
    // stays routed here purely so shared links keep working.
    if (url.hostname === "cafecito-ai.com") {
      const rest = url.pathname.replace(/^\/nostaldamus\/?/, "/");
      return Response.redirect(`${CANONICAL}${rest}${url.search}`, 301);
    }
    if (url.pathname.startsWith("/api")) return app.fetch(req, env, ctx);
    return env.ASSETS.fetch(req);
  },
};
