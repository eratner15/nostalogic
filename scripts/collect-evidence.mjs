// Collect real evidence for a list of properties: Wikipedia summary and
// pageviews, revival sentences from the article text, subreddit size.
// Usage: node scripts/collect-evidence.mjs <list.csv> <out.json> [--arctic] [--skip-wiki]
//   list.csv columns: id,name,year,category,wiki_title,subreddit
//   out.json is a cache keyed by id; rerunning fills only the missing parts.
// A signal that could not be read is null, never zero.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const [inFile, outFile] = positional;
const doArctic = args.includes("--arctic");
const skipWiki = args.includes("--skip-wiki");
if (!inFile || !outFile) { console.error("usage: collect-evidence.mjs <list.csv> <out.json> [--arctic] [--skip-wiki]"); process.exit(2); }
const UA = "NostalDamus/1.0 (https://nostalogic.cafecito-ai.com; team@cafecito-ai.com)";
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

function parseCsv(text) {
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

async function getJson(url, tries = 4) {
  for (let t = 0; t < tries; t++) {
    let res;
    try {
      res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(25000) });
    } catch { await pause(5000 * (t + 1)); continue; }
    if (res.status === 422 || res.status === 429) { await pause(res.status === 429 ? 10000 : 3000); continue; }
    if (res.status === 404) return { status: 404 };
    if (!res.ok) return { status: res.status };
    return { status: 200, json: await res.json() };
  }
  return { status: 0 };
}

const day = (d) => d.toISOString().slice(0, 10);
const compact = (s) => s.replaceAll("-", "");
const today = new Date();
const yesterday = new Date(today.getTime() - 86400000);
const from365 = new Date(yesterday.getTime() - 364 * 86400000);
const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

async function wiki(title) {
  const t = title.replaceAll(" ", "_");
  const out = { wiki_title: title, wiki_url: `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}` };
  const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}?redirect=true`);
  if (s.status !== 200) { out.wiki_status = s.status === 404 ? "missing" : `http ${s.status}`; return out; }
  const j = s.json;
  out.wiki_status = j.type === "disambiguation" ? "disambiguation" : "ok";
  out.wiki_canonical = j.titles?.normalized ?? j.title;
  out.wiki_description = j.description ?? "";
  out.wiki_extract = (j.extract ?? "").slice(0, 400);
  out.wiki_url = `https://en.wikipedia.org/wiki/${encodeURIComponent(out.wiki_canonical.replaceAll(" ", "_"))}`;
  if (out.wiki_status !== "ok") return out;
  await pause(120);
  const ct = out.wiki_canonical.replaceAll(" ", "_");
  const pv = await getJson(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/${encodeURIComponent(ct)}/daily/${compact(day(from365))}/${compact(day(yesterday))}`);
  if (pv.status === 200) {
    const items = (pv.json.items ?? []).map((i) => ({ d: `${i.timestamp.slice(0, 4)}-${i.timestamp.slice(4, 6)}-${i.timestamp.slice(6, 8)}`, v: i.views }));
    const last = items.slice(-90).map((i) => i.v);
    const recent30 = items.slice(-30).map((i) => i.v);
    const prior60 = items.slice(-90, -30).map((i) => i.v);
    out.pv_days = items.length;
    out.pv_from = items[0]?.d ?? null;
    out.pv_to = items[items.length - 1]?.d ?? null;
    out.pv_median_365 = median(items.map((i) => i.v));
    out.pv_median_90 = median(last);
    out.pv_mean_30 = mean(recent30) === null ? null : Math.round(mean(recent30));
    out.pv_mean_prior60 = mean(prior60) === null ? null : Math.round(mean(prior60));
    out.pv_growth = out.pv_mean_30 !== null && out.pv_mean_prior60 !== null ? Math.round(((out.pv_mean_30 + 1) / (out.pv_mean_prior60 + 1) - 1) * 100) / 100 : null;
    out.pv_peak_day = items.reduce((b, i) => (i.v > (b?.v ?? -1) ? i : b), null);
    out.pv_monthly = {};
    for (const i of items) { const m = i.d.slice(0, 7); out.pv_monthly[m] = (out.pv_monthly[m] ?? 0) + i.v; }
    out.pv_url = `https://pageviews.wmcloud.org/?project=en.wikipedia.org&pages=${encodeURIComponent(ct)}&range=latest-365`;
  } else {
    out.pv_status = pv.status === 404 ? "no data" : `http ${pv.status}`;
  }
  await pause(120);
  // Revival sentences from the article text, with the article as the source.
  const ex = await getJson(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&redirects=1&titles=${encodeURIComponent(out.wiki_canonical)}`);
  if (ex.status === 200) {
    const pages = ex.json.query?.pages ?? {};
    const text = Object.values(pages)[0]?.extract ?? "";
    const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);
    const kw = /\b(reboot|revival|revive|remake|remaster|sequel|reunion|reunite|relaunch|re-release|rerelease|spin-off|spinoff|adaptation|in development|announced|rights|acquired|optioned|greenlit|renewed|new series|new film|new album|anniversary)\b/i;
    const yr = /\b(20(1[89]|2[0-6]))\b/;
    out.revival_sentences = sentences.filter((s) => kw.test(s) && yr.test(s)).slice(0, 4).map((s) => s.slice(0, 320));
    out.article_chars = text.length;
  }
  return out;
}

async function arctic(name) {
  const r = await getJson(`https://arctic-shift.photon-reddit.com/api/subreddits/search?subreddit=${encodeURIComponent(name)}&fields=display_name,subscribers`);
  if (r.status !== 200) return { subreddit_status: `http ${r.status}` };
  const hit = (r.json.data ?? []).find((d) => d.display_name.toLowerCase() === name.toLowerCase());
  if (!hit) return { subreddit_status: "not found" };
  return { subreddit: hit.display_name, subreddit_subscribers: hit.subscribers ?? null, subreddit_status: "ok", subreddit_url: `https://www.reddit.com/r/${hit.display_name}/` };
}

const main = async () => {
  const [head, ...body] = parseCsv(readFileSync(inFile, "utf8")).filter((r) => r.length > 1);
  const col = (n) => head.indexOf(n);
  const cache = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
  const save = () => writeFileSync(outFile, JSON.stringify(cache, null, 1));
  let n = 0;
  for (const r of body) {
    const id = r[col("property_id")] ?? r[col("id")];
    const row = cache[id] ?? { id, name: r[col("name")], year: Number(r[col("year")]), category: r[col("category")] };
    cache[id] = row;
    const title = (r[col("wiki_title")] ?? "").trim();
    if (!skipWiki && title && !row.wiki_status) {
      Object.assign(row, await wiki(title));
      await pause(150);
    }
    const guess = (r[col("subreddit")] ?? "").trim() || row.name.replace(/\s*\(.*?\)\s*/g, "").replace(/[^A-Za-z0-9]/g, "").slice(0, 21);
    if (doArctic && guess && !row.subreddit_status) {
      Object.assign(row, { subreddit_query: guess }, await arctic(guess));
      await pause(1600);
    }
    row.collected_at = day(today);
    if (++n % 5 === 0) save();
    console.error(`${id}: ${row.wiki_status ?? "-"} pv90=${row.pv_median_90 ?? "null"} ${row.subreddit_status ?? ""} ${row.subreddit ? "r/" + row.subreddit + "=" + row.subreddit_subscribers : ""} rev=${row.revival_sentences?.length ?? "-"}`);
  }
  save();
  console.log(`done: ${n} rows -> ${outFile}`);
};
main();
