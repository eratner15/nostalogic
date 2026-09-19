# STATUS: 05 Product

Updated 2026-09-19.

## Live
- Preview: https://streetlights-guide.evan-ratner.workers.dev/ (and https://streetlights-preview.evan-ratner.workers.dev/ from the first run). Review mode: the Cloudflare token lacks D1 Edit, so votes and sign-ups are not saved yet.
- Route: the workflow's ratlinks.com/tv deploy step succeeded on run 2, so https://ratlinks.com/tv/ should serve the same build. Not verified from this container (egress blocked).
- Private review page (single file, no backend): https://claude.ai/artifact/N6exeyWqVrj9s51JfWC5zi
- Deploys on every push through `.github/workflows/deploy-tv.yml`. Token permissions needed for full function are in `site/runbook.md` section 9.

## State
- `site/`: trailer site scaffold on Cloudflare Workers, Hono, TypeScript, D1, Drizzle. Guide page, show page with trailer player, vote, parent sign-up, About page, admin dashboard. 8 tests pass. Typecheck clean. Runbook in `site/runbook.md`.
- Design applied from `projects/02-brand/out/identity-brief.md`: Archivo plus Newsreader, paper and ink sets, hairline rules, no textures, slot numerals, breathing glow, dark trailer pages.
- Content: the four tournament winners are loaded (Kitchen Court, Long Route, Recent History Society, The Night Desk). Trailer files pending production. `content/shows.json` drives the seed.

## Next
- Owner: add Account > D1 > Edit to the Cloudflare API token and set the `ADMIN_TOKEN` repository secret, then re-run the workflow. Votes and sign-ups then persist and the dashboard unlocks.
- Load trailer MP4 URLs into `content/shows.json` when the trailers are produced.
- Seven-day grid and the Host's Note page at full-episode stage.

## Blockers
- D1 permission on the token (owner action). Until then the site runs in review mode.
- Public launch waits on CG-02 (privacy, terms) and CG-03 (AI-assisted trailers, disclosure). `noindex` stays on until both clear.
