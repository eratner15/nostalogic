# STATUS - NostalDamus

Updated 2026-08-15 (Yosemite batch, session 1)

## Done this session
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
