// Seed loader: JSON corpus -> D1 INSERT OR REPLACE statements -> wrangler.
// Usage: node scripts/load-seed.mjs <seed.json> <rubric_version>
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [file, rubric] = process.argv.slice(2);
if (!file || !rubric) { console.error("usage: load-seed.mjs <seed.json> <rubric_version>"); process.exit(2); }
const rows = JSON.parse(readFileSync(file, "utf8"));
const esc = (s) => String(s).replace(/'/g, "''");
const j = (v) => `'${esc(JSON.stringify(v ?? []))}'`;

const stmts = rows.map((p) => {
  for (const k of ["id","name","year","category","genre","originalImpact","modernRelevance","socialBuzz","rightsComplexity","creatorAvailability","briefDescription","coreAudience","currentSignal","revivalFormat"]) {
    if (p[k] === undefined || p[k] === null) throw new Error(`${p.id ?? p.name}: missing ${k}`);
  }
  if (p.year < 1993 || p.year > 1998) throw new Error(`${p.id}: year ${p.year} outside window`);
  return `INSERT OR REPLACE INTO properties (id,name,year,category,genre,original_impact,modern_relevance,social_buzz,rights_complexity,creator_availability,brief_description,core_audience,current_signal,revival_format,tags,preserve,update_recs,rubric_version)
VALUES ('${esc(p.id)}','${esc(p.name)}',${p.year},'${esc(p.category)}','${esc(p.genre)}',${p.originalImpact},${p.modernRelevance},${p.socialBuzz},${p.rightsComplexity},${p.creatorAvailability},'${esc(p.briefDescription)}','${esc(p.coreAudience)}','${esc(p.currentSignal)}','${esc(p.revivalFormat)}',${j(p.tags)},${j(p.preserve)},${j(p.update)},'${esc(rubric)}');`;
});
writeFileSync("/tmp/nostaldamus-seed.sql", stmts.join("\n") + "\n");
console.log(`wrote ${stmts.length} statements`);
execFileSync("npx", ["wrangler","d1","execute","nostaldamus-db","--remote","--file","/tmp/nostaldamus-seed.sql"], {
  stdio: "inherit",
  env: { ...process.env, NODE_EXTRA_CA_CERTS: "/etc/ssl/certs/ca-certificates.crt" },
});
