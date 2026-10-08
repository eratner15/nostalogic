# STATUS - NostalDamus

Updated 2026-10-08 (agent search + design overhaul, branch claude/agent-search-overhaul)

## Agent search + design overhaul (2026-10-08)
- Merged the Codex revenue branch ($199 brief funnel); fixed "$199" strings that had lost the "$1".
- Prophet Chat is now a tool-using Claude agent over D1 (worker/agent/): search, open,
  compare, overview, find-similar. Streams its research trail, cites [[property-id]],
  logs to agent_runs. /api/chat replaced by /api/prophet. Default model claude-opus-5-5.
- Scoring unified in src/lib/scoring.ts (worker and browser had drifted on rounding).
- Browser bundles the real 120-property corpus (data/corpus.json) instead of the old
  hand-coded 106-property list, so every page matches the API.
- Full design overhaul: "broadcast archive" system (Fraunces / Inter / IBM Plex Mono,
  amber signal color, go/watch/hold score bands), new home, library, Prophet, nav, footer.
- Tests: npm test (12 passing). NEEDS EVAN to activate: docs/AGENT-HANDOFF.md
  (db:migrate, wrangler secret put ANTHROPIC_API_KEY, deploy).
- Finding: every 1993-1998 property is in the "Sweet Spot" stage in 2026 (audience
  ages 40-45), so the timing-stage filter does not separate anything yet.

## Earlier: Yosemite batch, session 2 (re-platform LIVE, 2026-08-15)


## Revival Watch (2026-10-08, PR #5, merged into PR #4)
Plan: docs/plans/revival-watch.html (all five defaults accepted). Built and
tested locally; NOT deployed. Prod D1 migration not applied.

Built:
- Weekly score snapshots + public /track-record (flag at 80, hit = news within
  24 months, hit rate hidden until 20 calls resolve). A call stays open even
  if the score falls (withdrawing would hide misses).
- Hourly signal cron (worker/signals.ts): Wikipedia pageviews + posts in the
  property's own subreddit via Arctic Shift (global title search is blocked).
  Per-pair bookmarks; a failed read writes a gap row, never a zero.
- Rubric r3 buzz: percentile of signals, quantile-mapped onto the r2 hand
  scale (22-80), only once 30+ properties have coverage. Hand scores kept in
  properties.social_buzz_hand.
- Agent API (/api/agent/*, AGENT_TOKEN) + admin review (/admin, ADMIN_TOKEN).
  Digest, proposals and cursor commit in one transaction or not at all.
- Managed Agents files: agents/ environments/ memory_stores/ vaults/
  deployments/ + scripts/agent-setup.sh. `ant apply --dry-run` validated.
- Fixed the fixed-2026 year in worker and client scoring.
- Tests: npm run test:worker (11 pass); npm run typecheck:worker; next build OK.

Next (in order, each needs Evan where marked):
1. Review docs/revival-watch/sources-proposed.csv (wrong rows exist, e.g. All
   That -> All-American Girl). Save as sources-reviewed.csv.
2. EVAN: apply migration to prod: `npx wrangler d1 migrations apply nostaldamus-db --remote`.
3. EVAN: set secrets ADMIN_TOKEN (and optional RESEND_API_KEY, DIGEST_EMAIL_TO); deploy.
4. node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --remote;
   then POST /api/admin/run/signals until backfill settles; POST /api/admin/run/weekly.
5. EVAN: scripts/agent-setup.sh (ant apply, memory seed, AGENT_TOKEN, manual run).
   Uses the $200 promo credit (expires 2026-10-22; auto-reload off).


Updated 2026-08-15 (Yosemite batch, session 2: re-platform LIVE)

## Live surface (session 2)
- LIVE at https://nostalogic.cafecito-ai.com (canonical). The old
  cafecito-ai.com/nostaldamus path 301s there so shared links keep working.
- Worker: Hono API at /api/* over D1 nostaldamus-db
  (1c94c92c-5013-413a-83d3-97207f122309), static Next export via ASSETS.
- Era window widened to 1993-1998 per Evan (types, filters, D1 CHECK).
- Library page hydrates from GET /api/properties with the bundled 3-property
  corpus as offline fallback; deterministic Revival Readiness Score computed
  in the worker and in the client identically.
- Remix Lab: deterministic composite pitch always works; new "Prophet deep
  pitch" button POSTs /api/remix (persists to remixes table, 20/day limit).
- Prophet Chat page NEW at /prophet-chat: grounded answers over the scored
  library via POST /api/chat (40/day), citations Name (year, score N).
- Both AI features fail closed 503 with a clear message until
  ANTHROPIC_API_KEY is set: no key exists on this machine, so
  `wrangler secret put ANTHROPIC_API_KEY` NEEDS EVAN (one command, then AI
  turns on with no redeploy).
- SEEDED: 120-property corpus loaded via scripts/load-seed.mjs, rubric
  r2-claude-2026-08-15. Verified live: /api/health properties=120, ranked
  list (Starship Troopers 82, Banjo-Kazooie 81, Daria 81...), year and
  category filters correct. Corpus shape: Movie 35, TV 25, Video Game 20,
  Music 15, Toy/Fad 15, Tech 5, Sports/Media 5; active-blockbuster
  franchises excluded by design. Scoring notes in the seed agent's
  nostaldamus-seed-notes.md (scratchpad, not committed - scores live in D1).

## Done session 1
- Batch docs installed: docs/FINALIZE-PLAN.md, docs/MASTER-PROMPT.md.
- Phase 0 gap audit complete: docs/GAP-AUDIT.md.

## Where things stand
- Live at nostaldamus.pages.dev only. cafecito-ai.com/nostaldamus 404s and the
  subdomain has no DNS.
- Stack conflict identified: repo is a Next.js static export on Pages; the plan
  requires a server (Hono + D1 + Drizzle). "Finalize" = re-platform + seed.
- Features: library PARTIAL (3 of 100+ properties, deterministic scoring only),
  Remix Lab PARTIAL (client-side shell, no persistence), Prophet Chat MISSING,
  subscriptions MISSING (form shells, no auth).

## Next
- Phase 1: re-platform to Worker + Hono + D1 behind the existing UI, then the
  100+ seed job with rubric versioning.

## Open decisions (Evan)
- Routing: cafecito-ai.com/nostaldamus (plan) vs pages.dev vs subdomain.
- Era window: 1993-1998 (finalize plan) vs 1994-1996 (original thesis).
- Phase 3 fork, later: tier pricing + payment provider.

## Blockers
- None technical. The two routing/window decisions shape Phase 1 but Phase 1 can
  start with the API mounted under /nostaldamus/api regardless.


## Revenue-ready funnel (2026-08-16)
- Homepage repositioned for producers, rights holders, studios, and investors around a concrete decision: which dormant IP deserves development and rights diligence.
- Added the deck-approved $199 one-time Revival Opportunity Brief with transparent deliverables and no unsupported accuracy claims.
- Added /order-report intake, D1 brief_requests persistence, honeypot and per-email daily limit.
- Optional REPORT_CHECKOUT_URL sends successful intake to hosted checkout; without it, the team confirms scope and emails payment manually.
- Full self-serve subscriptions remain later-stage. Immediate launch SOP is docs/REVENUE-TODAY.md.
