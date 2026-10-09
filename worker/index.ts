/**
 * NostalDamus API worker. Serves the static Next export as assets and the
 * product API under /api/*.
 *
 * Two-layer design, per the original spec's standing rule: the deterministic
 * Revival Readiness Score always works with no API key, and the Claude
 * features (the Prophet search agent, Remix Lab deep pitches) fail closed to a
 * clear "not configured" response when ANTHROPIC_API_KEY is absent rather than
 * breaking the page.
 */
import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { scoreAll, type Property, type PropertyScore } from "../src/lib/scoring";
import { DEFAULT_AGENT_MODEL, runAgent, type AgentEvent, type HistoryTurn } from "./agent/run";
import { agentApi, type AgentEnv } from "./agent-api";
import { loadTrackRecord, scoreHistory, weeklyLedger } from "./ledger";
import { mondayOf } from "./scoring";
import { runSignals, yesterday } from "./signals";
import { runStudio } from "./studio/pipeline";
import { STUDIO_FORMATS, type Sizzle, type StudioEvent, type StudioPackage, type StudioStep } from "../src/lib/studio";
import { renderToMedia, type ImageEnv } from "./studio/images";
import { shareCard, shareTags } from "./studio/share";

type Env = AgentEnv & ImageEnv & {
  DB: D1Database;
  ASSETS: Fetcher;
  ANTHROPIC_API_KEY?: string;
  /** Optional overrides; defaults live in worker/agent/run.ts. */
  AGENT_MODEL?: string;
  AGENT_EFFORT?: "low" | "medium" | "high" | "xhigh" | "max";
  /** Questions per visitor IP per day (default 40) and across all visitors (default 400). */
  AGENT_DAILY_PER_IP?: string;
  AGENT_DAILY_TOTAL?: string;
  /** Studio packs per visitor IP per day (default 5) and across all visitors (default 40). */
  STUDIO_DAILY_PER_IP?: string;
  STUDIO_DAILY_TOTAL?: string;
  REPORT_CHECKOUT_URL?: string;
};

const app = new Hono<{ Bindings: Env }>().basePath("/api");

const NOT_CONFIGURED = "AI features are not configured yet. The library and deterministic scores work without them.";

function rowToProperty(r: Record<string, unknown>): Property {
  return {
    id: String(r.id),
    name: String(r.name),
    year: Number(r.year),
    category: r.category as Property["category"],
    genre: String(r.genre),
    originalImpact: Number(r.original_impact),
    modernRelevance: Number(r.modern_relevance),
    socialBuzz: Number(r.social_buzz),
    rightsComplexity: Number(r.rights_complexity),
    creatorAvailability: Number(r.creator_availability),
    briefDescription: String(r.brief_description),
    coreAudience: String(r.core_audience),
    currentSignal: String(r.current_signal),
    revivalFormat: String(r.revival_format),
    tags: JSON.parse(String(r.tags ?? "[]")),
    preserve: JSON.parse(String(r.preserve ?? "[]")),
    update: JSON.parse(String(r.update_recs ?? "[]")),
    rubricVersion: String(r.rubric_version),
  };
}

/** The whole scored, ranked library. Small enough to load per request. */
async function loadLibrary(env: Env): Promise<PropertyScore[]> {
  const { results } = await env.DB.prepare("SELECT * FROM properties").all();
  return scoreAll(results.map((r) => rowToProperty(r as Record<string, unknown>)));
}

app.get("/properties", async (c) => {
  const cat = c.req.query("category");
  const year = c.req.query("year");
  const q = c.req.query("q")?.toLowerCase();
  // Rank across the full library first, so a filtered row keeps its global rank.
  const items = (await loadLibrary(c.env)).filter((p) =>
    (!cat || cat === "All" || p.category === cat) &&
    (!year || year === "All" || p.year === Number(year)) &&
    (!q || `${p.name} ${p.briefDescription} ${p.tags.join(" ")}`.toLowerCase().includes(q)));
  return c.json({ count: items.length, properties: items });
});

app.get("/properties/:id", async (c) => {
  const property = (await loadLibrary(c.env)).find((p) => p.id === c.req.param("id"));
  if (!property) return c.json({ error: "not found" }, 404);
  return c.json(property);
});

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
  if (!c.env.ANTHROPIC_API_KEY) return c.json({ error: NOT_CONFIGURED }, 503);
  if (!(await bumpUsage(c.env, "remix", actor, 20))) return c.json({ error: "daily remix limit reached" }, 429);

  const props = (await loadLibrary(c.env)).filter((p) => ids.includes(p.id));
  if (props.length < 2) return c.json({ error: "unknown properties" }, 400);

  const model = c.env.AGENT_MODEL || DEFAULT_AGENT_MODEL;
  const client = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY, maxRetries: 1 });
  let concept: string;
  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: "You are NostalDamus, a nostalgia-IP revival strategist. Blend the given properties into ONE original revival concept. Output markdown: a title line, a two-sentence logline, format, target audience, what to preserve from each source, what to modernize, and one risk. Be specific and concise. Never invent facts about the original properties beyond what is provided.",
      messages: [{
        role: "user",
        content: JSON.stringify(props.map((p) => ({ name: p.name, year: p.year, category: p.category, genre: p.genre, readiness: p.revivalReadinessScore, description: p.briefDescription, preserve: p.preserve, update: p.update }))),
      }],
    });
    if (response.stop_reason === "refusal") return c.json({ error: "The model declined this blend. Try different sources." }, 422);
    concept = response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    return c.json({ error: `model call failed (${status ?? "network"})` }, 502);
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO remixes (id, property_ids, concept, model) VALUES (?, ?, ?, ?)",
  ).bind(id, JSON.stringify(ids), concept, model).run();
  return c.json({ id, concept, propertyIds: ids });
});

/**
 * Remix Studio: 2-4 source properties -> an original property's development
 * pack. Streams Server-Sent Events: `started` (the share id), then `step` and
 * `result` per stage, then `done` or one `error`.
 */
const STUDIO_COLUMNS: Record<StudioStep, string> = {
  concept: "concept", screenplay: "screenplay", sizzle: "sizzle", art: "art", verdict: "verdict",
};

app.post("/studio", async (c) => {
  const body = await c.req.json<{ propertyIds?: string[]; format?: string; sessionKey?: string }>().catch(() => null);
  const ids = [...new Set((body?.propertyIds ?? []).filter((x): x is string => typeof x === "string"))].slice(0, 4);
  const format = STUDIO_FORMATS.find((f) => f === body?.format) ?? "Streaming Series";
  const session = (body?.sessionKey ?? "anon").slice(0, 64);
  if (ids.length < 2) return c.json({ error: "pick two to four source properties" }, 400);
  if (!c.env.ANTHROPIC_API_KEY) return c.json({ error: NOT_CONFIGURED }, 503);

  const sources = (await loadLibrary(c.env)).filter((p) => ids.includes(p.id));
  if (sources.length !== ids.length) return c.json({ error: "unknown properties" }, 400);

  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await bumpUsage(c.env, "studio-ip", ip, Number(c.env.STUDIO_DAILY_PER_IP ?? 5)))) {
    return c.json({ error: "daily studio limit reached" }, 429);
  }
  if (!(await bumpUsage(c.env, "studio-total", "all", Number(c.env.STUDIO_DAILY_TOTAL ?? 40)))) {
    return c.json({ error: "The studio has reached today's budget. Try again tomorrow." }, 429);
  }

  const id = crypto.randomUUID();
  const model = c.env.AGENT_MODEL || DEFAULT_AGENT_MODEL;
  await c.env.DB.prepare(
    "INSERT INTO studio_packages (id, property_ids, format, model, session_key) VALUES (?, ?, ?, ?, ?)",
  ).bind(id, JSON.stringify(sources.map((p) => p.id)), format, model, session).run();

  // Poster (portrait, high quality) and one keyframe per shot (landscape), in parallel.
  let imagesMade = 0;
  const renderArt = c.env.OPENAI_API_KEY && c.env.MEDIA
    ? async (sizzle: Sizzle) => {
        const style = sizzle.style_bible;
        const still = "Cinematic film still, widescreen composition. No text, captions, letters, logos, or watermarks.";
        const [poster, ...shots] = await Promise.all([
          renderToMedia(c.env, `studio/${id}/poster.png`, `${sizzle.poster_prompt}\n\nStyle: ${style}\nA theatrical movie poster, portrait one-sheet, professional key art.`, "1024x1536", "high"),
          ...sizzle.shots.map((shot, i) => renderToMedia(c.env, `studio/${id}/shot-${i + 1}.png`, `${style}\n\n${shot.image_prompt}\n\n${still}`, "1536x1024", "medium")),
        ]);
        imagesMade = [poster, ...shots].filter((r) => r.url).length;
        const failed = [poster, ...shots].filter((r) => !r.url).map((r) => r.error);
        return {
          posterImage: poster.url,
          shotImages: shots.map((r) => r.url),
          note: failed.length ? `${failed.length} image(s) failed: ${failed[0]}` : null,
        };
      }
    : undefined;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  // A closed tab must not change the run: a failed write only means nobody is listening.
  const emit = async (event: StudioEvent) => {
    try { await writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); } catch { /* client gone */ }
  };
  const save = async (step: StudioStep, value: unknown) => {
    await c.env.DB.prepare(`UPDATE studio_packages SET ${STUDIO_COLUMNS[step]} = ? WHERE id = ?`)
      .bind(typeof value === "string" ? value : JSON.stringify(value), id).run();
  };

  const work = (async () => {
    let failure: string | null = null;
    try {
      await emit({ type: "started", id });
      const result = await runStudio({ sources, format }, { apiKey: c.env.ANTHROPIC_API_KEY!, model }, async (event) => {
        if (event.type === "error") failure = event.message;
        await emit(event);
      }, save, renderArt);
      await c.env.DB.prepare("UPDATE studio_packages SET status = ?, error = ?, input_tokens = ?, output_tokens = ?, images = ? WHERE id = ?")
        .bind(result.ok ? "done" : "error", failure, result.usage.input, result.usage.output, imagesMade, id).run();
      if (result.ok) await emit({ type: "done", id });
    } catch {
      await c.env.DB.prepare("UPDATE studio_packages SET status = 'error', error = ? WHERE id = ?").bind("unexpected failure", id).run().catch(() => {});
      await emit({ type: "error", message: "The studio failed unexpectedly. Try again." }).catch(() => {});
    } finally {
      await writer.close().catch(() => {});
    }
  })();
  c.executionCtx.waitUntil(work);

  return new Response(readable, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache, no-transform" },
  });
});

/** Public gallery: the latest finished packs that an admin has not taken down. */
app.get("/studio", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, format, concept, sizzle, art, verdict, created_at FROM studio_packages
     WHERE status = 'done' AND hidden = 0 ORDER BY created_at DESC LIMIT 24`,
  ).all<Record<string, string | null>>();
  const parse = <T,>(v: string | null): T | null => { try { return v ? JSON.parse(v) as T : null; } catch { return null; } };
  const packs = results.flatMap((r) => {
    const concept = parse<{ title: string; logline: string }>(r.concept);
    if (!concept) return [];
    return [{
      id: r.id,
      format: r.format,
      title: concept.title,
      logline: concept.logline,
      tagline: parse<Sizzle>(r.sizzle)?.tagline ?? null,
      poster: parse<{ posterImage: string | null }>(r.art)?.posterImage ?? null,
      verdict: parse<{ verdict: string }>(r.verdict)?.verdict ?? null,
      createdAt: r.created_at,
    }];
  });
  c.header("cache-control", "public, max-age=60");
  return c.json({ packs });
});

app.get("/studio/:id", async (c) => {
  const r = await c.env.DB.prepare("SELECT * FROM studio_packages WHERE id = ? AND hidden = 0").bind(c.req.param("id")).first<Record<string, string | null>>();
  if (!r) return c.json({ error: "not found" }, 404);
  const parse = (v: string | null) => (v ? JSON.parse(v) : null);
  const pkg: StudioPackage = {
    id: String(r.id),
    propertyIds: parse(r.property_ids) ?? [],
    format: String(r.format),
    status: r.status === "done" ? "done" : r.status === "error" ? "error" : "running",
    concept: parse(r.concept),
    screenplay: r.screenplay,
    sizzle: parse(r.sizzle),
    art: parse(r.art),
    verdict: parse(r.verdict),
    error: r.error,
    createdAt: String(r.created_at),
  };
  return c.json(pkg);
});

/** Studio images from R2, served same-origin so the sizzle canvas can export them. */
app.get("/media/*", async (c) => {
  if (!c.env.MEDIA) return c.json({ error: "media not configured" }, 503);
  const key = c.req.path.replace(/^\/api\/media\//, "");
  const match = /^studio\/([0-9a-f-]{36})\/(poster|shot-\d{1,2})\.png$/.exec(key);
  if (!match) return c.json({ error: "not found" }, 404);
  // A hidden (taken-down) pack serves no images either.
  const pack = await c.env.DB.prepare("SELECT hidden FROM studio_packages WHERE id = ?").bind(match[1]).first<{ hidden: number }>();
  if (!pack || pack.hidden) return c.json({ error: "not found" }, 404);
  const object = await c.env.MEDIA.get(key);
  if (!object) return c.json({ error: "not found" }, 404);
  return new Response(object.body, {
    // One hour, not immutable, so a takedown reaches cached copies within the hour.
    headers: { "content-type": "image/png", "cache-control": "public, max-age=3600" },
  });
});

app.get("/remixes/:id", async (c) => {
  const row = await c.env.DB.prepare("SELECT * FROM remixes WHERE id = ?").bind(c.req.param("id")).first();
  if (!row) return c.json({ error: "not found" }, 404);
  return c.json({ id: row.id, propertyIds: JSON.parse(String(row.property_ids)), concept: row.concept, createdAt: row.created_at });
});

/**
 * The Prophet search agent (POST /api/prophet). Kept apart from /api/agent/*,
 * which is the token-guarded Revival Watch API. Streams Server-Sent Events: one `step` per tool
 * call, then `answer`, then `done` (or a single `error`).
 */
app.post("/prophet", async (c) => {
  const body = await c.req.json<{ message?: string; sessionKey?: string; history?: HistoryTurn[] }>().catch(() => null);
  const question = (body?.message ?? "").trim().slice(0, 1000);
  const session = (body?.sessionKey ?? "anon").slice(0, 64);
  if (!question) return c.json({ error: "empty message" }, 400);
  if (!c.env.ANTHROPIC_API_KEY) return c.json({ error: NOT_CONFIGURED }, 503);
  // Limits key on what the caller cannot choose: the connecting IP (set by
  // Cloudflare) and a global daily cap that bounds total model spend. The
  // client sessionKey is only a label for the run log.
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const perIp = Number(c.env.AGENT_DAILY_PER_IP ?? 40);
  const total = Number(c.env.AGENT_DAILY_TOTAL ?? 400);
  if (!(await bumpUsage(c.env, "agent-ip", ip, perIp))) return c.json({ error: "daily question limit reached" }, 429);
  if (!(await bumpUsage(c.env, "agent-total", "all", total))) {
    return c.json({ error: "The Prophet has reached today's question budget. Try again tomorrow." }, 429);
  }

  // Prior turns as plain text only; the agent re-searches rather than trusting old tool output.
  const history = (Array.isArray(body?.history) ? body.history : [])
    .filter((t): t is HistoryTurn => (t?.role === "user" || t?.role === "assistant") && typeof t.content === "string" && t.content.trim().length > 0)
    .slice(-8)
    .map((t) => ({ role: t.role, content: t.content.slice(0, 2000) }));
  // The API requires the first message to be from the user.
  while (history[0]?.role === "assistant") history.shift();

  const library = await loadLibrary(c.env);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const emit = (event: AgentEvent) => writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

  const work = (async () => {
    try {
      const result = await runAgent(question, history, library, {
        apiKey: c.env.ANTHROPIC_API_KEY!,
        model: c.env.AGENT_MODEL,
        effort: c.env.AGENT_EFFORT,
      }, emit);
      // Failed runs are logged too: their tokens were billed.
      await c.env.DB.prepare(
        `INSERT INTO agent_runs (id, session_key, question, answer, cited_ids, steps, model, input_tokens, output_tokens, cache_read_tokens, status, error)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        crypto.randomUUID(), session, question, result.answer, JSON.stringify(result.cited), JSON.stringify(result.steps),
        result.model, result.usage.input, result.usage.output, result.usage.cacheRead, result.status, result.error ?? null,
      ).run();
    } catch {
      await emit({ type: "error", message: "The agent failed unexpectedly. Try again." }).catch(() => {});
    } finally {
      await writer.close().catch(() => {});
    }
  })();
  c.executionCtx.waitUntil(work);

  return new Response(readable, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache, no-transform" },
  });
});

app.get("/health", async (c) => {
  const n = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM properties").first<{ n: number }>();
  // Revival Watch freshness. Null before the migration or the first digest.
  const last = await c.env.DB.prepare("SELECT MAX(created_at) AS t FROM digests").first<{ t: string | null }>().catch(() => null);
  const ageDays = last?.t ? Math.floor((Date.now() - Date.parse(`${last.t.replace(" ", "T")}Z`)) / 86_400_000) : null;
  return c.json({
    ok: true,
    properties: n?.n ?? 0,
    ai: Boolean(c.env.ANTHROPIC_API_KEY),
    agentModel: c.env.AGENT_MODEL || DEFAULT_AGENT_MODEL,
    digest: { last: last?.t ?? null, age_days: ageDays, overdue: ageDays !== null && ageDays > 8 },
  });
});

app.get("/track-record", async (c) => c.json(await loadTrackRecord(c.env, new Date())));
app.get("/score-history", async (c) => c.json(await scoreHistory(c.env, 8)));

app.route("/", agentApi);

app.post("/brief-requests", async (c) => {
  const body = await c.req.json<{
    name?: string; email?: string; company?: string; propertyName?: string;
    objective?: string; website?: string;
  }>().catch(() => null);
  if (!body || body.website) return c.json({ error: "invalid request" }, 400);

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().toLowerCase().slice(0, 180);
  const company = (body.company ?? "").trim().slice(0, 140);
  const propertyName = (body.propertyName ?? "").trim().slice(0, 180);
  const objective = (body.objective ?? "").trim().slice(0, 1200);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !propertyName || objective.length < 10) {
    return c.json({ error: "name, valid email, property, and objective are required" }, 400);
  }
  if (!(await bumpUsage(c.env, "brief-request", email, 3))) {
    return c.json({ error: "request limit reached; email team@cafecito-ai.com" }, 429);
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO brief_requests (id, name, email, company, property_name, objective) VALUES (?, ?, ?, ?, ?, ?)",
  ).bind(id, name, email, company || null, propertyName, objective).run();
  return c.json({ ok: true, id, checkoutUrl: c.env.REPORT_CHECKOUT_URL ?? null });
});

/**
 * The weekly ledger runs once per week, from Monday 06:00 UTC, but only after
 * the hourly signal runs have read yesterday for every healthy source. A
 * snapshot is insert-only, so taking it early would freeze stale buzz for the
 * week. If the backlog has not drained by Tuesday 06:00, it runs anyway.
 */
async function ledgerDue(env: Env, now: Date): Promise<boolean> {
  const daysSinceMonday = (now.getUTCDay() + 6) % 7;
  const hoursIntoWeek = daysSinceMonday * 24 + now.getUTCHours();
  if (hoursIntoWeek < 6) return false;
  const taken = await env.DB.prepare("SELECT 1 FROM score_snapshots WHERE week = ? LIMIT 1").bind(mondayOf(now)).first();
  if (taken) return false;
  if (hoursIntoWeek >= 30) return true;
  const pending = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM signal_bookmarks
     WHERE (read_to IS NULL OR read_to < ?) AND (last_error IS NULL OR last_error LIKE 'partial:%')`,
  ).bind(yesterday(now)).first<{ n: number }>();
  return (pending?.n ?? 0) === 0;
}

const CANONICAL = "https://nostalogic.cafecito-ai.com";

/** The Studio page with this pack's title, logline, and poster as its link preview. */
async function studioPage(req: Request, env: Env, id: string): Promise<Response> {
  const page = await env.ASSETS.fetch(req);
  if (!page.ok) return page;
  const row = await env.DB.prepare("SELECT concept, sizzle, art FROM studio_packages WHERE id = ? AND hidden = 0")
    .bind(id).first<Record<string, unknown>>().catch(() => null);
  const card = row ? shareCard(row, CANONICAL, id) : null;
  if (!card) return page;
  return new HTMLRewriter()
    .on('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]', { element(el) { el.remove(); } })
    .on("title", { element(el) { el.setInnerContent(`${card.title} · NostalDamus Studio`); } })
    .on("head", { element(el) { el.append(shareTags(card), { html: true }); } })
    .transform(page);
}

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
    const packId = url.searchParams.get("id") ?? "";
    if (url.pathname === "/studio/" && /^[0-9a-f-]{36}$/.test(packId)) return studioPage(req, env, packId);
    return env.ASSETS.fetch(req);
  },

  /**
   * Hourly cron (wrangler.toml). Signals every hour; the weekly ledger on
   * Monday in the 06:00 UTC hour. The day check is here, not in the cron
   * string: in Cloudflare cron, day-of-week 1 is Sunday.
   */
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    const now = new Date(event.scheduledTime);
    const work = async () => {
      // Signals first, so the snapshot sees the freshest readings.
      console.log("signals", JSON.stringify(await runSignals(env, now)));
      if (await ledgerDue(env, now)) {
        console.log("weekly ledger", JSON.stringify(await weeklyLedger(env, now)));
      }
    };
    ctx.waitUntil(work());
  },
};
