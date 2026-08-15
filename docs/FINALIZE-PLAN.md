# Plan 02: NostalDamus Finalization

**Where to run:** Remote or local Claude Code. All targets are Cloudflare; no hardware dependency.

**Thesis:** The product is specced and partially built. "Finalize" means: close the gap between spec and deployed reality at `cafecito-ai.com/nostaldamus`, then gate it behind subscriptions and open it.

**Stack:** Cloudflare Workers + Hono + TypeScript + D1 + Drizzle. Claude API for all AI features. No Firebase, no Supabase.

## Phase 0: Gap audit

1. Clone/pull the repo. Read STATUS.md and any prior specs.
2. Audit deployed state vs the four core features: scored property library (100+ seeded properties, 1993-1998 window), Remix Lab, Prophet Chat, tiered subscriptions.
3. Write `docs/GAP-AUDIT.md`: per feature, mark DONE / PARTIAL / MISSING with the specific missing pieces.
4. Update STATUS.md with the finalize backlog derived from the audit.

## Phase 1: Property library to done

1. Verify D1 schema covers: property, era metadata, revival score, score components, last-scored date.
2. Seed or backfill to 100+ properties across film, TV, games, music, toys, books.
3. Scoring pipeline: a Worker cron or manual endpoint that scores/rescores via Claude API with a stable rubric prompt. Store rubric version with each score.
4. Library UI: sortable, filterable by category and score. Follows the existing site look.

## Phase 2: Remix Lab and Prophet Chat to done

1. Remix Lab: user selects 2+ properties, Claude generates a blended revival concept. Persist remixes to D1 so users can revisit them.
2. Prophet Chat: chat interface grounded in the scored library. Retrieval from D1, answers cite the properties and scores used.
3. Rate limit both features per user tier.

## Phase 3: Subscriptions and access gating

1. Define tiers (free / paid levels) and which features each unlocks. This is a decision fork: confirm tier pricing and the payment provider with Evan before wiring payments.
2. Implement auth (existing pattern from other Cafecito products if one exists).
3. Gate features by tier. Free tier should show enough to sell the upgrade.

## Phase 4: Finalize pass

1. Error states, empty states, loading states on every page.
2. Mobile pass.
3. Basic analytics: pageviews, signups, remix count, chat count.
4. Legal footer and terms page.
5. Smoke-test checklist in `docs/LAUNCH-CHECK.md`, then run it.

## Definition of done (finalized)

- All four core features deployed and working at the production URL.
- Tiered access enforced end to end, including payment if approved at the Phase 3 fork.
- Gap audit shows zero MISSING items.
- STATUS.md current.
