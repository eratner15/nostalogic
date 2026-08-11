# NostalDamus Master Build Prompt

Build **NostalDamus**, a B2B predictive analytics platform for determining which dormant intellectual properties from the 1994-1996 nostalgia window are ready for revival, when they should relaunch, and how they should be modernized without alienating original fans.

## Product Thesis

NostalDamus turns IP revival from instinct into an analytics workflow. The platform targets the nostalgia sweet spot where the original childhood audience for a property is now roughly 35-45 years old, has disposable income, and wants to share childhood culture with a new generation. The product is for studios, streamers, game publishers, producers, investors, toy companies, and entertainment strategists evaluating dormant IP portfolios.

## Core Data Universe

Seed the system with at least 100 properties from 1994-1996 across:

- Movies
- TV shows
- Music and albums
- Video games
- Toys, fads, collectibles, and schoolyard culture
- Consumer tech and internet platforms
- Sports/media moments

Every property must include:

- `id`
- `name`
- `year`
- `category`
- `genre`
- `originalImpact` from 0-100
- `modernRelevance` from 0-100
- `socialBuzz` from 0-100
- `rightsComplexity` from 0-100
- `creatorAvailability` from 0-100
- `briefDescription`
- `coreAudience`
- `currentSignal`
- `revivalFormat`
- `tags`
- `preserve` recommendations
- `update` recommendations

## NostalDamus Brain

Implement the core deterministic scoring model first. AI may enhance the product later, but the app must work without API keys.

```text
Revival Readiness Score =
  Social Buzz * 0.30 +
  Nostalgia Window Alignment * 0.40 +
  Modern Cultural Relevance * 0.30
```

Nostalgia Window Alignment:

- Assume the core childhood audience was age 12 at the original release.
- In the current year, calculate current audience age as `currentYear - releaseYear + 12`.
- Peak nostalgia center is age 40.
- Ages 35-45 are the "Sweet Spot."
- Below 35 is "Pre-Peak."
- Above 45 is "Mature."

Add:

- `riskScore` based on rights complexity, cultural sensitivity, and creator availability.
- `launchWindow`.
- `recommendation`, such as "Greenlight exploration," "Acquire option and validate fan thesis," or "Watchlist with social listening."
- `nostalgiaCurve` from 2020-2032 for visualization.

## Required Product Pages

### 1. Dashboard

Create a first-screen product experience, not a marketing landing page. Show:

- Brand and one-sentence platform thesis.
- Dataset size.
- Number of properties in the nostalgia window.
- Average readiness score.
- Top revival candidates.
- Category heat cards.
- Primary CTAs to the library and pitch generator.

### 2. Discovery Engine

Create a searchable/filterable/sortable IP table with:

- Search by title, genre, signal, and tag.
- Filter by category.
- Filter by year.
- Filter by timing stage.
- Sort by rank, name, category, year, readiness, and risk.
- Link every property to a deep analysis page.

### 3. Deep Dive Analysis

For any property, show:

- Readiness score.
- Nostalgia alignment.
- Risk score.
- Target audience age.
- Nostalgia curve chart.
- Model inputs.
- Timing stage and launch window.
- Preserve vs update map.
- 3-5 modernization recommendations.

### 4. Remix Lab

Build a "Take My Money" generator that accepts:

- Selected property.
- Target reboot format.

Generate:

- Pitch title.
- Logline.
- Audience thesis.
- Launch campaign bullets.
- Development risk note.
- Copy-to-clipboard output.

This should be deterministic and local for MVP reliability. Later, wire it to an LLM as a richer strategy assistant.

### 5. Market Intelligence

Show:

- Category-level heatmap.
- High-readiness, manageable-risk watchlist.
- Risk clusters.
- Signal interpretation.
- This master prompt/build spec for future AI buildout.

## Visual Identity

Use modern retro-futurism:

- Dark B2B analytics interface.
- Neon magenta, cyan, and acid green accents.
- 90s grid motifs used subtly.
- Dense, scannable dashboard layouts.
- Clean sans-serif typography.
- Cards only for repeated metrics, property rows, modals, and framed tools.
- No decorative gradient orbs.
- Mobile must preserve navigation and avoid text overlap.

## Engineering Requirements

- Use existing Next.js app structure.
- Keep static deterministic data in a service module for MVP.
- Do not require Firebase, Genkit, or Gemini credentials for core app behavior.
- AI flows may remain as future integrations, but pages must not break if API credentials are missing.
- App must pass TypeScript typecheck and production build.
- Runtime QA must check desktop and mobile layout.

## Cloudflare Deployment Target

Deploy the MVP as a static Next.js export on Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `out`
- Custom domain: `nostaldamus.cafecito-ai.com`
- Keep the public demo static until authenticated workspaces are added.
- Use Cloudflare Pages headers and redirects through `public/_headers` and `public/_redirects`.

## Future Architecture

Once the MVP is stable:

- Move properties into Firestore or Postgres.
- Add authenticated workspaces.
- Add watchlists and alerts.
- Add real social listening, sentiment, search trend, and rights metadata pipelines.
- Add LLM strategy assistant for "what if" scenarios.
- Add reporting exports for studios/investors.
- Add API access for enterprise clients.
