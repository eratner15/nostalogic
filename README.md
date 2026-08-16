# NostalDamus

Predictive analytics for dormant 1994-1996 IP revival.

NostalDamus scores movies, TV, music, games, toys, tech, and pop-culture properties against a nostalgia-readiness model, then turns the strongest candidates into timing forecasts, modernization recommendations, and revival pitches.

## What Works Now

- Next.js app with a polished modern retro-futurist UI.
- 106-property seed library covering 1994-1996 movies, TV, music, games, toys/fads, tech, and sports/media.
- Deterministic Revival Readiness Score:
  `Social Buzz * 0.30 + Nostalgia Window Alignment * 0.40 + Modern Cultural Relevance * 0.30`.
- Searchable/filterable/sortable discovery engine.
- Deep-dive analysis page with score breakdowns, nostalgia curve, risk score, and preserve/update strategy.
- Remix Lab that generates a development pitch locally without requiring an AI key.
- Market Intelligence page with category heatmap, watchlist, and build prompt.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run build
```

`npm run lint` currently opens Next.js' interactive ESLint setup because this starter repo did not include an ESLint config.

## Cloudflare Worker Deployment

The Next.js static export and Hono API deploy together as one Cloudflare Worker. The Worker serves `out` through Assets, mounts the API at `/api/*`, and binds the production D1 database.

```bash
npm run deploy
```

The canonical domain is `https://nostalogic.cafecito-ai.com`. The legacy `cafecito-ai.com/nostaldamus` routes redirect there. `public/_headers` adds baseline security headers and immutable caching for Next static chunks; `public/_redirects` normalizes static-export routes.
