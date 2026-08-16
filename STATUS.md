# STATUS - NostalDamus

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
