// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { isTrendsPath, trendsRoute, type TrendsEnv } from "./trends.ts";

const served: string[] = [];
const env: TrendsEnv = {
  ASSETS: {
    fetch: async (req: Request) => {
      const path = new URL(req.url).pathname;
      served.push(path);
      return new Response(`asset ${path}`, { status: 200 });
    },
  } as unknown as Fetcher,
};
const get = (path: string) => new Request(`https://cafecito-ai.com${path}`);

test("only /trends paths are claimed", () => {
  assert.equal(isTrendsPath("/trends"), true);
  assert.equal(isTrendsPath("/trends/data.json"), true);
  assert.equal(isTrendsPath("/trendsetter"), false);
  assert.equal(isTrendsPath("/nostaldamus"), false);
});

test("the page is public and not indexed", async () => {
  const res = await trendsRoute(get("/trends/"), env);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.equal(res.headers.get("Cache-Control"), "public, max-age=300");
});

test("bare /trends redirects to the trailing slash", async () => {
  const res = await trendsRoute(get("/trends"), env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("Location"), "https://cafecito-ai.com/trends/");
});

test("data and reports are public with no cookie", async () => {
  const data = await trendsRoute(get("/trends/data.json"), env);
  assert.equal(data.status, 200);
  assert.equal(await data.text(), "asset /trends/data.json");
  assert.equal((await trendsRoute(get("/trends/reports/2026-10-20.html"), env)).status, 200);
});

test("other /trends paths are not served from assets", async () => {
  served.length = 0;
  assert.equal((await trendsRoute(get("/trends/../secret"), env)).status, 404);
  assert.equal((await trendsRoute(get("/trends/other.json"), env)).status, 404);
  assert.equal((await trendsRoute(get("/trends/reports/x.json"), env)).status, 404);
  assert.equal((await trendsRoute(get("/trends/login"), env)).status, 404);
  assert.deepEqual(served, []);
});
