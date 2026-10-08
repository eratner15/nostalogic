// Load a reviewed sources CSV into signal_bookmarks.
// Usage: node scripts/load-sources.mjs <sources.csv> --local|--remote
// Rules: an empty wiki_title or subreddit cell is skipped. A row whose
// query changed resets that pair's bookmark, so it backfills again.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [file, where] = process.argv.slice(2);
if (!file || !["--local", "--remote"].includes(where)) {
  console.error("usage: load-sources.mjs <sources.csv> --local|--remote");
  process.exit(2);
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const [head, ...body] = parseCsv(readFileSync(file, "utf8")).filter((r) => r.length > 1);
const col = (name) => head.indexOf(name);
const esc = (s) => String(s).replace(/'/g, "''");
const stmts = [];
for (const r of body) {
  const id = r[col("property_id")];
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`bad property_id: ${id}`);
  for (const [source, value] of [["wikipedia", r[col("wiki_title")]], ["arcticshift", r[col("subreddit")]]]) {
    const v = (value ?? "").trim();
    if (!v) continue;
    stmts.push(
      `INSERT INTO signal_bookmarks (property_id, source, query) VALUES ('${esc(id)}', '${source}', '${esc(v)}')
       ON CONFLICT (property_id, source) DO UPDATE SET
         read_to = CASE WHEN signal_bookmarks.query = excluded.query THEN signal_bookmarks.read_to ELSE NULL END,
         last_error = CASE WHEN signal_bookmarks.query = excluded.query THEN signal_bookmarks.last_error ELSE NULL END,
         query = excluded.query;`,
    );
  }
}
writeFileSync("/tmp/nostaldamus-sources.sql", stmts.join("\n") + "\n");
console.log(`wrote ${stmts.length} bookmark upserts`);
execFileSync("npx", ["wrangler", "d1", "execute", "nostaldamus-db", where, "--file", "/tmp/nostaldamus-sources.sql"], {
  stdio: "inherit",
  env: { ...process.env, NODE_EXTRA_CA_CERTS: "/etc/ssl/certs/ca-certificates.crt" },
});
