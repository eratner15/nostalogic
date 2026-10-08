// Propose a Wikipedia title and a subreddit for each property. Writes a CSV
// for a person to review. No database write here: load the reviewed file
// with scripts/load-sources.mjs.
//
// Usage: node scripts/map-sources.mjs [api-base] > sources.csv
//   api-base defaults to https://nostalogic.cafecito-ai.com
const base = process.argv[2] ?? "https://nostalogic.cafecito-ai.com";
const UA = "NostalDamus/1.0 (https://nostalogic.cafecito-ai.com; team@cafecito-ai.com)";
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
      if (res.ok) return await res.json();
      if (res.status !== 422 && res.status !== 429) return null;
    } catch { /* retry */ }
    await pause(3000 * (i + 1));
  }
  return null;
}

const CAT_HINT = { Movie: "film", TV: "TV series", "Video Game": "video game", Music: "album", "Toy/Fad": "", Tech: "", "Sports/Media": "" };

async function wikiTitle(p) {
  const q = `${p.name} ${p.year} ${CAT_HINT[p.category] ?? ""}`.trim();
  const j = await getJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=3&format=json`);
  const hits = j?.query?.search ?? [];
  if (!hits.length) return { title: "", confidence: "none" };
  const top = hits[0].title;
  const words = p.name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  const matched = words.filter((w) => top.toLowerCase().includes(w)).length;
  const confidence = words.length && matched === words.length ? "high" : matched > 0 ? "medium" : "low";
  return { title: top, confidence, alternates: hits.slice(1).map((h) => h.title).join(" | ") };
}

function subredditCandidates(name) {
  const clean = name.replace(/\(.*?\)/g, "").replace(/\b(the|tv|movie|books?|toys?)\b/gi, "").replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const joined = words.join("");
  return [...new Set([joined, words.slice(0, 2).join(""), words[0]].filter((s) => s && s.length >= 4))];
}

async function subreddit(p) {
  for (const cand of subredditCandidates(p.name)) {
    const j = await getJson(`https://arctic-shift.photon-reddit.com/api/subreddits/search?subreddit=${encodeURIComponent(cand)}&fields=display_name,subscribers`);
    await pause(1200);
    const hit = (j?.data ?? []).find((d) => d.display_name.toLowerCase() === cand.toLowerCase());
    if (hit) return { sub: hit.display_name, subscribers: hit.subscribers ?? "" };
  }
  return { sub: "", subscribers: "" };
}

const csv = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
const { properties } = await (await fetch(`${base}/api/properties`)).json();
console.log(["property_id", "name", "year", "category", "wiki_title", "wiki_confidence", "wiki_alternates", "subreddit", "subscribers"].join(","));
let n = 0;
for (const p of properties.sort((a, b) => a.id.localeCompare(b.id))) {
  const w = await wikiTitle(p);
  const r = await subreddit(p);
  console.log([p.id, p.name, p.year, p.category, w.title, w.confidence, w.alternates, r.sub, r.subscribers].map(csv).join(","));
  if (++n % 10 === 0) console.error(`${n}/${properties.length}`);
}
