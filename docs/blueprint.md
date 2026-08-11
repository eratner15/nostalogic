# NostalDamus Blueprint

NostalDamus is a predictive nostalgia analytics platform for identifying which dormant 1994-1996 intellectual properties are ready for revival, when to relaunch them, and how to modernize them.

## MVP Shape

- Static Next.js export hosted on Cloudflare Pages.
- Deterministic local scoring engine.
- 100+ property seed library.
- Searchable discovery engine.
- Deep-dive analysis surface.
- Remix/pitch generator.
- Market intelligence dashboard.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `out`
- Custom domain: `nostaldamus.cafecito-ai.com`
- Headers: `public/_headers`
- Redirects: `public/_redirects`

Cloudflare Pages serves matching HTML routes directly and redirects extension HTML paths to extensionless counterparts. Known app routes are explicitly normalized to the static-export trailing slash paths.

## Data Model

Each property includes:

- Name, year, category, genre.
- Original impact, modern relevance, social buzz.
- Rights complexity and creator availability.
- Core audience and current market signal.
- Preserve/update strategy.
- Revival format and tags.

## Scoring

```text
Revival Readiness =
  Social Buzz * 0.30 +
  Nostalgia Window Alignment * 0.40 +
  Modern Cultural Relevance * 0.30
```

The nostalgia window assumes the original core childhood audience was age 12 at release. Ages 35-45 are the sweet spot, with age 40 as peak.

## Future Phases

- Real social listening and search trend ingestion.
- Rights and talent availability data.
- Authenticated workspaces and watchlists.
- Exportable board reports.
- LLM strategy assistant.
- Enterprise API access.
