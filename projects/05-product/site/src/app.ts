import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { computeStats, type Store, type EventKind } from "./store";
import { guidePage, showPage, aboutPage, notFoundPage, statsPage } from "./views/pages";

export type Deps = { store: Store; adminToken?: string; now?: () => number };

const HH = "hh";
const isEmail = (s: string) => /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(s);

export function createApp(deps: Deps) {
  const now = deps.now ?? (() => Date.now());
  const app = new Hono();

  // Household id: a random first-party cookie. No PII. No child data. One per browser.
  app.use("*", async (c, next) => {
    let hh = getCookie(c, HH);
    if (!hh || !/^[a-f0-9-]{36}$/.test(hh)) {
      hh = crypto.randomUUID();
      setCookie(c, HH, hh, { httpOnly: true, sameSite: "Lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
    c.set("hh" as never, hh as never);
    c.header("X-Content-Type-Options", "nosniff");
    c.header("Referrer-Policy", "strict-origin-when-cross-origin");
    c.header("X-Frame-Options", "DENY");
    await next();
  });
  const household = (c: any): string => c.get("hh");

  app.get("/healthz", (c) => c.json({ ok: true }));

  app.get("/", async (c) => c.html(guidePage(await deps.store.listShows())));

  app.get("/show/:id", async (c) => {
    const show = await deps.store.getShow(c.req.param("id"));
    if (!show) return c.html(notFoundPage(), 404);
    const shows = await deps.store.listShows();
    return c.html(showPage(show, shows));
  });

  app.get("/about", (c) => c.html(aboutPage()));

  app.post("/api/events", async (c) => {
    const body = await c.req.json<{ showId?: string; kind?: string; pct?: number }>().catch(() => null);
    if (!body || typeof body.showId !== "string") return c.json({ error: "bad request" }, 400);
    const kind = body.kind as EventKind;
    if (!["play", "progress", "complete"].includes(kind)) return c.json({ error: "bad kind" }, 400);
    const show = await deps.store.getShow(body.showId);
    if (!show) return c.json({ error: "unknown show" }, 404);
    const pct = kind === "complete" ? 100 : Math.max(0, Math.min(100, Math.round(Number(body.pct ?? 0)) || 0));
    await deps.store.recordEvent({ household: household(c), showId: show.id, kind, pct, ts: now() });
    return c.json({ ok: true });
  });

  app.post("/api/vote", async (c) => {
    const body = await c.req.json<{ showId?: string; value?: string }>().catch(() => null);
    if (!body || typeof body.showId !== "string") return c.json({ error: "bad request" }, 400);
    const value = body.value === "up" ? 1 : body.value === "down" ? -1 : null;
    if (value === null) return c.json({ error: "bad value" }, 400);
    const show = await deps.store.getShow(body.showId);
    if (!show) return c.json({ error: "unknown show" }, 404);
    await deps.store.vote({ household: household(c), showId: show.id, value, ts: now() });
    return c.json({ ok: true });
  });

  app.post("/api/signup", async (c) => {
    const ct = c.req.header("content-type") ?? "";
    let email = "";
    let parent = false;
    if (ct.includes("application/json")) {
      const b = await c.req.json<{ email?: string; parent?: boolean }>().catch(() => ({}) as any);
      email = String(b.email ?? "");
      parent = b.parent === true;
    } else {
      const f = await c.req.parseBody();
      email = String(f["email"] ?? "");
      parent = f["parent"] === "on" || f["parent"] === "true";
    }
    email = email.trim().toLowerCase();
    if (!parent) return c.json({ error: "The account holder must confirm they are a parent or guardian." }, 400);
    if (!isEmail(email)) return c.json({ error: "Enter a valid email." }, 400);
    const r = await deps.store.signup({ email, household: household(c), ts: now() });
    return c.json({ ok: true, status: r });
  });

  const requireAdmin = (c: any) => {
    const token = deps.adminToken;
    const auth = c.req.header("authorization") ?? "";
    const q = c.req.query("token") ?? "";
    return !!token && (auth === `Bearer ${token}` || q === token);
  };
  app.get("/api/stats", async (c) => {
    if (!requireAdmin(c)) return c.json({ error: "unauthorized" }, 401);
    return c.json(await computeStats(deps.store));
  });
  app.get("/admin", async (c) => {
    if (!requireAdmin(c)) return c.text("unauthorized", 401);
    return c.html(statsPage(await computeStats(deps.store)));
  });

  app.notFound((c) => c.html(notFoundPage(), 404));
  return app;
}
