# NostalDamus

Revival intelligence for dormant 1993-1998 IP.

NostalDamus scores movies, TV, music, games, toys, tech, and pop-culture properties against a nostalgia-readiness model, then turns the strongest candidates into timing forecasts, modernization recommendations, and revival pitches.

## What Works Now

- 120-property library (1993-1998) in Cloudflare D1, snapshot committed at `data/corpus.json`.
- Deterministic Revival Readiness Score, shared by the worker, the agent, and the browser (`src/lib/scoring.ts`):
  `Social Buzz * 0.30 + Nostalgia Window Alignment * 0.40 + Modern Cultural Relevance * 0.30`.
- The Prophet: a Claude research agent that searches the library with tools and cites every property it uses (`/prophet-chat`, `worker/agent/`). Needs `ANTHROPIC_API_KEY`; see `docs/AGENT-HANDOFF.md`.
- Library, deep-dive analysis, Remix Lab, and Market pages in the "broadcast archive" design system.
- $199 Revival Opportunity Brief intake at `/order-report` (see `docs/REVENUE-TODAY.md`).

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm test
npm run typecheck
npm run build
```

To run the full worker with a local database: `npm run db:local`, then `npm run dev:worker`.

## Cloudflare Worker Deployment

The Next.js static export and Hono API deploy together as one Cloudflare Worker. The Worker serves `out` through Assets, mounts the API at `/api/*`, and binds the production D1 database.

```bash
npm run deploy
```

The canonical domain is `https://nostalogic.cafecito-ai.com`. The legacy `cafecito-ai.com/nostaldamus` routes redirect there. `public/_headers` adds baseline security headers and immutable caching for Next static chunks; `public/_redirects` normalizes static-export routes.
