import { describe, it, expect } from "vitest";
import { createApp } from "../src/app";
import { MemoryStore, computeStats, isoWeekKey, type Show } from "../src/store";

const shows: Show[] = [
  { id: "a", slot: 1, title: "Show A", logline: "Log A.", blurb: "Blurb A.", genreLabel: "Comedy", ratingLabel: "Family", runtimeLabel: "30 min", trailerUrl: "https://example.com/a.mp4", trailerSeconds: 90, posterHue: 30, status: "trailer", sortOrder: 1 },
  { id: "b", slot: 2, title: "Show B", logline: "Log B.", blurb: "Blurb B.", genreLabel: "Comedy", ratingLabel: "Family", runtimeLabel: "30 min", trailerUrl: null, trailerSeconds: null, posterHue: 200, status: "trailer", sortOrder: 2 },
];
const mk = (t = 1_700_000_000_000) => {
  let now = t;
  const store = new MemoryStore(shows);
  const app = createApp({ store, adminToken: "secret", now: () => now });
  return { app, store, tick: (ms: number) => (now += ms) };
};
const cookieOf = (res: Response) => (res.headers.get("set-cookie") ?? "").split(";")[0];
const post = (app: any, path: string, body: unknown, cookie = "") =>
  app.request(path, { method: "POST", headers: { "content-type": "application/json", cookie }, body: JSON.stringify(body) });

describe("guide", () => {
  it("renders listings with every show and sets a household cookie", async () => {
    const { app } = mk();
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Show A");
    expect(html).toContain("Show B");
    expect(html).toContain("Trailer in production");
    expect(html).not.toContain("—");
    expect(res.headers.get("set-cookie")).toMatch(/^hh=[a-f0-9-]{36}; Max-Age=/);
  });
  it("renders a show page and 404s for unknown", async () => {
    const { app } = mk();
    expect((await app.request("/show/a")).status).toBe(200);
    expect(await (await app.request("/show/a")).text()).toContain("<video");
    expect((await app.request("/show/nope")).status).toBe(404);
  });
});

describe("events and votes", () => {
  it("records play, progress, complete for the same household", async () => {
    const { app, store } = mk();
    const first = await post(app, "/api/events", { showId: "a", kind: "play" });
    expect(first.status).toBe(200);
    const cookie = cookieOf(first);
    await post(app, "/api/events", { showId: "a", kind: "progress", pct: 50 }, cookie);
    await post(app, "/api/events", { showId: "a", kind: "complete" }, cookie);
    expect(store.events).toHaveLength(3);
    expect(new Set(store.events.map((e) => e.household)).size).toBe(1);
    expect(store.events[2].pct).toBe(100);
  });
  it("rejects bad events", async () => {
    const { app } = mk();
    expect((await post(app, "/api/events", { showId: "a", kind: "dance" })).status).toBe(400);
    expect((await post(app, "/api/events", { showId: "zz", kind: "play" })).status).toBe(404);
  });
  it("keeps one vote per household and allows a change", async () => {
    const { app, store } = mk();
    const r = await post(app, "/api/vote", { showId: "a", value: "up" });
    const cookie = cookieOf(r);
    await post(app, "/api/vote", { showId: "a", value: "down" }, cookie);
    expect(store.votes.size).toBe(1);
    expect([...store.votes.values()][0].value).toBe(-1);
  });
});

describe("signup", () => {
  it("requires the parent confirmation and a valid email, and dedupes", async () => {
    const { app } = mk();
    expect((await post(app, "/api/signup", { email: "p@example.com" })).status).toBe(400);
    expect((await post(app, "/api/signup", { email: "nope", parent: true })).status).toBe(400);
    const ok = await post(app, "/api/signup", { email: "P@Example.com", parent: true });
    expect(ok.status).toBe(200);
    expect((await ok.json()).status).toBe("created");
    const again = await post(app, "/api/signup", { email: "p@example.com", parent: true });
    expect((await again.json()).status).toBe("exists");
  });
});

describe("stats", () => {
  it("requires the admin token", async () => {
    const { app } = mk();
    expect((await app.request("/api/stats")).status).toBe(401);
    expect((await app.request("/api/stats", { headers: { authorization: "Bearer secret" } })).status).toBe(200);
    expect((await app.request("/admin?token=secret")).status).toBe(200);
  });
  it("computes completion, votes, develop-further, and weekly return", async () => {
    const store = new MemoryStore(shows);
    const w1 = Date.UTC(2026, 8, 18); // a Friday
    const w2 = w1 + 7 * 86400000;
    // household h1 completes A in week 1 and returns in week 2. h2 plays A and stops at 50. h3 completes A.
    for (const [hh, pct, ts] of [["h1", 100, w1], ["h2", 50, w1], ["h3", 100, w1], ["h1", 25, w2]] as const) {
      await store.recordEvent({ household: hh, showId: "a", kind: "play", pct: 0, ts });
      await store.recordEvent({ household: hh, showId: "a", kind: pct === 100 ? "complete" : "progress", pct, ts });
    }
    for (const hh of ["h1", "h3", "h4"]) await store.vote({ household: hh, showId: "a", value: 1, ts: w1 });
    await store.vote({ household: "h2", showId: "a", value: -1, ts: w1 });
    const s = await computeStats(store);
    const a = s.shows.find((x) => x.showId === "a")!;
    expect(a.households).toBe(3);
    expect(a.completed).toBe(2);
    expect(a.completionRate).toBeCloseTo(2 / 3);
    expect(a.votesUp).toBe(3);
    expect(a.votesDown).toBe(1);
    expect(a.developFurther).toBe(true);
    expect(s.householdsTotal).toBe(3);
    expect(s.householdsReturning).toBe(1);
    expect(isoWeekKey(w1)).not.toBe(isoWeekKey(w2));
  });
});

describe("base path", () => {
  it("serves routes and links under a prefix", async () => {
    const store = new MemoryStore(shows);
    const assets = { fetch: async (req: Request) => new Response(`asset:${new URL(req.url).pathname}`) };
    const app = createApp({ store, basePath: "/tv", assets });
    const home = await app.request("/tv/");
    expect(home.status).toBe(200);
    const html = await home.text();
    expect(html).toContain('href="/tv/show/a"');
    expect(html).toContain('href="/tv/guide.css"');
    expect(html).toContain('data-base="/tv"');
    expect((await app.request("/tv/show/a")).status).toBe(200);
    expect(await (await app.request("/tv/guide.css")).text()).toBe("asset:/guide.css");
    expect(await (await app.request("/tv/posters/a.svg")).text()).toBe("asset:/posters/a.svg");
    expect((await app.request("/show/a")).status).toBe(404);
  });
});
