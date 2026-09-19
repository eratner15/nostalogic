// Tournament aggregator (decision D-015). Deterministic. Usage: node score-tournament.mjs
// Inputs: concepts.json, judge-*.json (each: { judge, lens, scores: [{ id, engine, hook, originality, trailer, standards, note }] })
// Output: results.md and results.json. Round 1: mean of judges per criterion, equal weights. Top 2 per slot advance.
// Head-to-head: higher round-1 total wins; tie broken by originality, then by trailer.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const concepts = JSON.parse(readFileSync(join(here, "concepts.json"), "utf8"));
const judgeFiles = readdirSync(here).filter((f) => /^judge-.*\.json$/.test(f)).sort();
if (judgeFiles.length < 2) throw new Error("need at least two judge files");
const judges = judgeFiles.map((f) => JSON.parse(readFileSync(join(here, f), "utf8")));
const CRIT = ["engine", "hook", "originality", "trailer", "standards"];
const SLOTS = { A: "Anchor", H: "Hangout", W: "Wildcard", L: "Lights Out" };
const rows = concepts.map((c) => {
  const per = judges.map((j) => j.scores.find((s) => s.id === c.id)).filter(Boolean);
  if (per.length !== judges.length) throw new Error(`missing scores for ${c.id}`);
  const mean = Object.fromEntries(CRIT.map((k) => [k, +(per.reduce((a, s) => a + Number(s[k]), 0) / per.length).toFixed(2)]));
  const total = +CRIT.reduce((a, k) => a + mean[k], 0).toFixed(2);
  const minStandards = Math.min(...per.map((s) => Number(s.standards)));
  const notes = per.map((s, i) => `${judges[i].judge}: ${s.note ?? ""}`);
  return { ...c, mean, total, minStandards, notes, disqualified: minStandards < 5 || c.engineYields100 === false };
});
const bySlot = {};
for (const r of rows) (bySlot[r.slot] ??= []).push(r);
const out = [];
out.push("# Tournament results", "", `Judges: ${judges.map((j) => `${j.judge} (${j.lens})`).join("; ")}. Criteria: ${CRIT.join(", ")}, each 1 to 10, equal weight. Max total 50.`, "");
out.push("A concept is disqualified if any judge scores standards below 5, or if its engine does not yield 100 episodes.", "");
const winners = [];
for (const slot of Object.keys(SLOTS)) {
  const list = (bySlot[slot] ?? []).slice().sort((a, b) => b.total - a.total || b.mean.originality - a.mean.originality || b.mean.trailer - a.mean.trailer);
  out.push(`## ${SLOTS[slot]} (slot ${slot})`, "", "| Rank | ID | Title | Engine | Hook | Originality | Trailer | Standards | Total | Status |", "|---|---|---|---|---|---|---|---|---|---|");
  list.forEach((r, i) => out.push(`| ${i + 1} | ${r.id} | ${r.title} | ${r.mean.engine} | ${r.mean.hook} | ${r.mean.originality} | ${r.mean.trailer} | ${r.mean.standards} | **${r.total}** | ${r.disqualified ? "DQ" : i < 2 ? "Advances" : ""} |`));
  const finalists = list.filter((r) => !r.disqualified).slice(0, 2);
  if (finalists.length) {
    const [a, b] = finalists;
    const winner = a; // sorted order already applies tiebreaks
    winners.push({ slot, slotName: SLOTS[slot], ...winner });
    out.push("", `Head-to-head: ${a.id} ${a.title} (${a.total}) versus ${b ? `${b.id} ${b.title} (${b.total})` : "no challenger"}. Winner: **${winner.id} ${winner.title}**.`, "");
    for (const f of finalists) out.push(`- ${f.id} judge notes: ${f.notes.join(" | ")}`);
    out.push("");
  }
}
out.push("## The block", "", "| Slot | Show | Total |", "|---|---|---|");
for (const w of winners) out.push(`| ${w.slotName} | ${w.title} (${w.id}) | ${w.total} |`);
out.push("", "Lead show (highest total across slots): " + (winners.slice().sort((a, b) => b.total - a.total)[0]?.title ?? "none"), "");
writeFileSync(join(here, "results.md"), out.join("\n"));
writeFileSync(join(here, "results.json"), JSON.stringify({ winners: winners.map((w) => ({ slot: w.slot, slotName: w.slotName, id: w.id, title: w.title, total: w.total })), rows }, null, 2));
console.log(winners.map((w) => `${w.slotName}: ${w.id} ${w.title} (${w.total})`).join("\n"));
