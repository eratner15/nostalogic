// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { isTrendsPath, sameKey, trendsRoute, type TrendsEnv } from "./trends.ts";

const served: string[] = [];
const env = (key?: string): TrendsEnv => ({
  TRENDS_KEY: key,
  ASSETS: {
    fetch: async (req: Request) => {
      const path = new URL(req.url).pathname;
      served.push(path);
      return new Response(`asset ${path}`, { status: 200 });
    },
  } as unknown as Fetcher,
});
const get = (path: string, cookie?: string) =>
  new Request(`https://cafecito-ai.com${path}`, { headers: cookie ? { Cookie: cookie } : {} });

test("only /trends paths are claimed", () => {
  assert.equal(isTrendsPath("/trends"), true);
  assert.equal(isTrendsPath("/trends/data.json"), true);
  assert.equal(isTrendsPath("/trendsetter"), false);
  assert.equal(isTrendsPath("/nostaldamus"), false);
});

test("keys compare by value, including length", () => {
  assert.equal(sameKey("abc", "abc"), true);
  assert.equal(sameKey("abc", "abd"), false);
  assert.equal(sameKey("abc", "abcd"), false);
  assert.equal(sameKey("", "abc"), false);
});

test("the shell is public and not indexed", async () => {
  const res = await trendsRoute(get("/trends/"), env("k1"));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("X-Robots-Tag"), "noindex, nofollow");
});

test("bare /trends redirects to the trailing slash", async () => {
  const res = await trendsRoute(get("/trends"), env("k1"));
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("Location"), "https://cafecito-ai.com/trends/");
});

test("data and reports need the key cookie", async () => {
  assert.equal((await trendsRoute(get("/trends/data.json"), env("k1"))).status, 401);
  assert.equal((await trendsRoute(get("/trends/data.json", "trends_key=wrong"), env("k1"))).status, 401);
  assert.equal((await trendsRoute(get("/trends/reports/2026-10-20.html"), env("k1"))).status, 401);
  const ok = await trendsRoute(get("/trends/data.json", "other=1; trends_key=k1"), env("k1"));
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), "asset /trends/data.json");
  assert.equal(ok.headers.get("Cache-Control"), "private, no-store");
});

test("without a configured key the data fails closed", async () => {
  assert.equal((await trendsRoute(get("/trends/data.json", "trends_key="), env(undefined))).status, 503);
});

test("login sets the cookie only for the right key", async () => {
  const post = (key: string) => new Request("https://cafecito-ai.com/trends/login", {
    method: "POST", body: new URLSearchParams({ key }),
  });
  const good = await trendsRoute(post("k1"), env("k1"));
  assert.equal(good.status, 303);
  assert.match(good.headers.get("Set-Cookie") ?? "", /^trends_key=k1; Path=\/trends; .*HttpOnly; Secure/);
  const bad = await trendsRoute(post("nope"), env("k1"));
  assert.equal(bad.headers.get("Set-Cookie"), null);
  assert.equal(bad.headers.get("Location"), "/trends/?denied=1");
});

test("other /trends paths are not served from assets", async () => {
  served.length = 0;
  assert.equal((await trendsRoute(get("/trends/../secret"), env("k1"))).status, 404);
  assert.equal((await trendsRoute(get("/trends/other.json"), env("k1"))).status, 404);
  assert.deepEqual(served, []);
});
