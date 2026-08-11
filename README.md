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

## Cloudflare Pages Deployment

This app is configured for static export and Cloudflare Pages.

Recommended Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `out`
- Node version: 20+

`public/_headers` adds baseline security headers and immutable caching for Next static chunks.
`public/_redirects` normalizes known app routes to their static-export trailing slash paths.

After Pages is connected, attach the custom domain:

```text
nostaldamus.cafecito-ai.com
```
