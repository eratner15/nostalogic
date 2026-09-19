// Static review export: renders every page through the Hono app with the in-memory store and writes dist/.
// Votes and sign-ups need the worker; in the static export the client script shows a review note instead.
// Usage: node --import tsx scripts/export-static.mjs   (or: npm run export:static)
import { mkdirSync, writeFileSync, cpSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { createApp } = await import("../src/app.ts");
const { MemoryStore } = await import("../src/store.ts");
const shows = JSON.parse(readFileSync(join(root, "content/shows.json"), "utf8"));
const base = process.env.BASE_PATH ?? "";
const app = createApp({ store: new MemoryStore(shows), basePath: base });
const dist = join(root, "dist");
mkdirSync(dist, { recursive: true });
cpSync(join(root, "public"), dist, { recursive: true });
const write = async (route, file) => {
  const res = await app.request(`${base}${route}`);
  if (res.status !== 200) throw new Error(`${route}: ${res.status}`);
  let html = await res.text();
  html = html.replace("<body ", '<body data-static="1" ');
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
};
await write("/", "index.html");
await write("/about", "about/index.html");
for (const s of shows) await write(`/show/${s.id}`, `show/${s.id}/index.html`);
// Static hosts serve /show/x/ (directory). Rewrite links to the directory form so they work without a router.
const { readdirSync, statSync } = await import("node:fs");
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const f of walk(dist).filter((f) => f.endsWith(".html"))) {
  let h = readFileSync(f, "utf8");
  h = h.replace(new RegExp(`href="${base}/show/([a-z0-9-]+)"`, "g"), `href="${base}/show/$1/"`).replace(new RegExp(`href="${base}/about"`, "g"), `href="${base}/about/"`);
  writeFileSync(f, h);
}
console.log(`static export: ${2 + shows.length} pages in dist/`);
