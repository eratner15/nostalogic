// Check every row of a sources CSV against live Wikipedia and Arctic Shift.
// Usage: node scripts/check-sources.mjs <in.csv> <out.csv> [--notes docs/revival-watch/log-phase-2.md] [--checked-by "<who>"]
// Writes the same columns plus checked_by, checked_at and note. A wiki_title
// that redirects is replaced by its canonical title (pageviews count per exact
// title). A missing page or subreddit is cleared and noted, never kept.
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const [inFile, outFile] = positional;
if (!inFile || !outFile) { console.error("usage: check-sources.mjs <in.csv> <out.csv> [--notes log.md] [--checked-by who]"); process.exit(2); }
const notesFile = flag("--notes", null);
const checkedBy = flag("--checked-by", "scripts/check-sources.mjs");
const UA = "NostalDamus/1.0 (https://nostalogic.cafecito-ai.com; team@cafecito-ai.com)";

export function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const csvCell = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 4) {
  for (let t = 0; t < tries; t++) {
    let res;
    try {
      res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(20000) });
    } catch (e) {
      await pause(5000 * (t + 1));   // network blip: wait, then try again
      continue;
    }
    if (res.status === 422 || res.status === 429) { await pause(res.status === 429 ? 8000 : 3000); continue; }
    if (res.status === 404) return { status: 404 };
    if (!res.ok) return { status: res.status };
    return { status: 200, json: await res.json() };
  }
  return { status: 0 };
}

export async function wikiSummary(title) {
  const r = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(" ", "_"))}?redirect=true`);
  if (r.status !== 200) return { ok: false, status: r.status };
  const j = r.json;
  return { ok: true, canonical: j.titles?.normalized ?? j.title, type: j.type, extract: (j.extract ?? "").slice(0, 160) };
}

export async function subredditInfo(name) {
  const r = await getJson(`https://arctic-shift.photon-reddit.com/api/subreddits/search?subreddit=${encodeURIComponent(name)}&fields=display_name,subscribers`);
  if (r.status !== 200) return { ok: false, status: r.status };
  const hit = (r.json.data ?? []).find((d) => d.display_name.toLowerCase() === name.toLowerCase());
  return { ok: true, found: !!hit, display_name: hit?.display_name, subscribers: hit?.subscribers ?? null };
}

// Prior-review notes: a markdown table "| property_id | field | before | after | reason |".
function loadNotes(file) {
  const notes = new Map();
  if (!file) return notes;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\|\s*([a-z0-9-]+)\s*\|\s*(wiki_title|subreddit)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!m) continue;
    const [, id, field, before, after, reason] = m;
    const list = notes.get(id) ?? [];
    list.push(`${field}: ${before} -> ${after} (${reason})`);
    notes.set(id, list);
  }
  return notes;
}

const main = async () => {
  const [head, ...body] = parseCsv(readFileSync(inFile, "utf8")).filter((r) => r.length > 1);
  const col = (n) => head.indexOf(n);
  const prior = loadNotes(notesFile);
  const outHead = [...head.filter((h) => !["checked_by", "checked_at", "note"].includes(h)), "checked_by", "checked_at", "note"];
  const out = [outHead.map(csvCell).join(",")];
  const today = new Date().toISOString().slice(0, 10);
  const stats = { rows: 0, wikiOk: 0, wikiRedirect: 0, wikiMissing: 0, subOk: 0, subMissing: 0, subRateLimited: 0 };
  for (const r of body) {
    stats.rows++;
    const id = r[col("property_id")];
    const notes = [...(prior.get(id) ?? [])];
    let title = (r[col("wiki_title")] ?? "").trim();
    let conf = r[col("wiki_confidence")] ?? "";
    if (title) {
      const w = await wikiSummary(title);
      if (!w.ok) { notes.push(`wiki_title "${title}" HTTP ${w.status}: cleared`); title = ""; conf = "none"; stats.wikiMissing++; }
      else if (w.type === "disambiguation") { notes.push(`wiki_title "${title}" is a disambiguation page: cleared`); title = ""; conf = "none"; stats.wikiMissing++; }
      else if (w.canonical !== title) { notes.push(`wiki_title "${title}" redirects to "${w.canonical}": replaced`); title = w.canonical; conf = "verified"; stats.wikiRedirect++; }
      else { conf = "verified"; stats.wikiOk++; }
      await pause(150);
    } else conf = "none";
    let sub = (r[col("subreddit")] ?? "").trim();
    let subs = r[col("subscribers")] ?? "";
    if (sub) {
      const s = await subredditInfo(sub);
      if (!s.ok) { notes.push(`r/${sub}: Arctic Shift HTTP ${s.status}, not re-checked today`); stats.subRateLimited++; }
      else if (!s.found) { notes.push(`r/${sub} not found in Arctic Shift: cleared`); sub = ""; subs = ""; stats.subMissing++; }
      else { if (s.display_name !== sub) notes.push(`r/${sub} case corrected to r/${s.display_name}`); sub = s.display_name; subs = s.subscribers ?? subs; stats.subOk++; }
      await pause(1500);
    }
    const row = {};
    head.forEach((h, i) => { row[h] = r[i] ?? ""; });
    row.wiki_title = title; row.wiki_confidence = conf; row.subreddit = sub; row.subscribers = subs;
    row.checked_by = checkedBy; row.checked_at = today;
    row.note = notes.length ? notes.join(" | ") : (title ? "verified: title canonical" : "no article") + (sub ? `; r/${sub} exists` : "; no subreddit");
    out.push(outHead.map((h) => csvCell(row[h])).join(","));
    console.error(`${id}: ${title || "-"} | ${sub ? "r/" + sub : "-"}${notes.length ? " | " + notes[notes.length - 1] : ""}`);
  }
  writeFileSync(outFile, out.join("\n") + "\n");
  console.log(JSON.stringify(stats));
};
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) main();
