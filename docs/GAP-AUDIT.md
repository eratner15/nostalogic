# NostalDamus Gap Audit

Audited 2026-08-15 against the four core features in docs/FINALIZE-PLAN.md.
Repo: ~/nostalogic (git: eratner15/nostalogic). Deployed reality checked live.

## Deployment state

| Target | Status |
|---|---|
| nostaldamus.pages.dev | 200, serving the Next.js static export |
| cafecito-ai.com/nostaldamus | 404. Route does not exist on the umbrella worker |
| nostaldamus.cafecito-ai.com | No DNS record at all |

The finalize plan names cafecito-ai.com/nostaldamus as the production URL. Nothing
serves it today. Decision recorded below as backlog item 1.

## Stack conflict, called out before any feature work

The finalize plan specifies Workers + Hono + TypeScript + D1 + Drizzle with Claude
API scoring. The repo is a Next.js STATIC EXPORT on Cloudflare Pages
(wrangler.toml is two lines: name + pages_build_output_dir). There is no server,
no D1 binding, no API layer, and the prior spec (docs/MASTER_PROMPT.md) explicitly
required the app to work deterministically without API keys.

Every PARTIAL below is downstream of this: Remix Lab, Prophet Chat, subscriptions,
and Claude-scored properties all need a server. The honest framing is that
"finalize" is a re-platform plus a seed job, not a punch list.

Also note the window conflict: prior spec says 1994-1996, finalize plan says
1993-1998. Backlog item 2.

## Feature audit

### 1. Scored property library (100+ properties) - PARTIAL, badly
- Schema exists and is rich (src/services/property-data.ts: impact, relevance,
  buzz, rightsComplexity, creatorAvailability, preserve/update recs, tags).
- THREE properties are seeded. Target is 100+.
- Scoring is the deterministic client-side formula (buzz .30 / window .40 /
  relevance .30) from the original spec. No Claude scoring, no rubric version,
  no last-scored date, no D1.
- Library UI exists (property-library route, sortable/filterable shadcn UI).

Missing pieces: 97+ properties, persistence (D1), scoring pipeline with rubric
versioning, rescore endpoint or cron.

### 2. Remix Lab - PARTIAL (shell)
- Route and 288-line UI exist. Generation is client-side template text over the
  3 seeded properties. No Claude call, no persistence, remixes vanish on reload.

Missing pieces: Claude generation, D1 persistence, revisit UI.

### 3. Prophet Chat - MISSING
- No route, no component, zero mentions in src. The analysis-tools route is a
  static scoring-explainer page, not a chat.

### 4. Tiered subscriptions - MISSING (UI shells only)
- sign-in (44 lines) and account (52 lines) render forms with no auth behind
  them: no session, no token, no storage, no gating anywhere.
- No Stripe, no tiers, no rate limiting.

## Finalize backlog (ordered)

1. DECISION (routing): serve at cafecito-ai.com/nostaldamus per the plan. The
   umbrella worker owns that zone; add the route there or mount a dedicated
   worker on the path. Static assets move from Pages to Workers Assets in the
   process, which also unlocks a server for items 3-6.
2. DECISION (window): 1993-1998 per the finalize plan, or keep 1994-1996 per the
   original thesis. Affects the seed job directly.
3. Re-platform: Worker + Hono + D1 + Drizzle serving the exported UI as assets,
   API under /nostaldamus/api/*. Keep the deterministic score as the fallback so
   the app still works without API keys (prior spec rule worth keeping).
4. Seed job: 100+ properties across film, TV, games, music, toys, books via
   Claude with the stable rubric prompt; store rubric_version + scored_at.
5. Remix Lab to real: Claude generation + D1 persistence + revisit.
6. Prophet Chat: new route, retrieval from D1, citations to properties/scores,
   per-tier rate limits.
7. FORK (Evan): tier pricing + payment provider before any payment wiring.
8. Finalize pass: states, mobile, analytics, legal, LAUNCH-CHECK.md.

Zero MISSING is the definition of done. Today: 1 PARTIAL-badly, 1 PARTIAL-shell,
2 MISSING.
