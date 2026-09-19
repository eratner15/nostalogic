# STATUS: 05 Product

Updated 2026-09-19.

## State
- `site/`: trailer site scaffold on Cloudflare Workers, Hono, TypeScript, D1, Drizzle. Guide page, show page with trailer player, vote, parent sign-up, About page, admin dashboard. 8 tests pass. Typecheck clean. Runbook in `site/runbook.md`.
- Design applied from `projects/02-brand/out/identity-brief.md`: Archivo plus Newsreader, paper and ink sets, hairline rules, no textures, slot numerals, breathing glow, dark trailer pages.
- Content: four placeholder listings until the tournament names the shows. `content/shows.json` drives the seed.

## Next
- Load the four winning shows and trailer files into `content/shows.json` after the tournament.
- Owner: `wrangler login`, create the D1 database, set `ADMIN_TOKEN`, deploy (runbook section 3).
- Seven-day grid and the Host's Note page at full-episode stage.

## Blockers
- No Cloudflare credentials in this environment. Deploy is an owner step.
- Public launch waits on CG-02 (privacy, terms) and CG-03 (AI-assisted trailers, disclosure). `noindex` stays on until both clear.
