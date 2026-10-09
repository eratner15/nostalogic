# Agents: handoff and activation

NostalDamus runs two Claude agents. They share the database but nothing else.

| Agent | Runs where | Trigger | Writes |
|---|---|---|---|
| **Prophet** (this doc, first half) | In the worker, Messages API tool loop | A visitor asks a question | `agent_runs` log only |
| **Revival Watch** (PR #5) | Claude Managed Agents, via `ant` | Weekly deployment, or `ant beta:deployments run` | Digests and proposals; a person approves every change at `/admin` |

The Prophet answers questions on demand. Revival Watch is the `ant` agent you
call when needed: it scans trade press weekly and proposes outcomes for the
track record.

# Prophet search agent

Updated 2026-10-08.

The Prophet is a Claude research agent that searches the D1 property library
with tools. All code is in place and tested. It needs one secret and one
schema update in production to turn on.

## What the agent does

1. A user asks a question on `/prophet-chat` (or from the homepage ask bar).
2. The worker loads the scored library from D1 and starts a Claude tool-use loop
   (`worker/agent/run.ts`, at most 8 turns).
3. Claude calls tools that run in memory over the scored library
   (`worker/agent/tools.ts`):

   | Tool | Purpose |
   |---|---|
   | `search_library` | Free text plus filters: category, year range, timing stage, min readiness, max risk, sort |
   | `get_properties` | Full records for 1-5 ids, with preserve/update guidance and all score inputs |
   | `compare_properties` | Side-by-side metrics for 2-6 ids, with the leader per metric |
   | `library_overview` | Counts and averages by category, year, or timing stage |
   | `find_similar` | Neighbors by tags, genre, and audience; cross-category mode for remix partners |

4. The worker streams each tool call to the browser as a "research trail" step
   (Server-Sent Events), then the answer.
5. The answer cites properties as `[[property-id]]`. The worker keeps only ids
   that exist in the library. The page turns them into links to the analysis page.
6. Each answered question is logged to the `agent_runs` table with its steps,
   citations, model, and token counts.

The system prompt forbids facts the tools did not return and forbids accuracy
or ROI claims (see `docs/DECK-RECONCILIATION.md`).

## Activate in production

Run these from the repository root, logged in to the Cloudflare account that
owns the `nostaldamus` worker.

1. Apply the D1 migrations (`worker/migrations/`). This adds the Revival Watch
   tables, `brief_requests`, and `agent_runs`:

   ```bash
   npm run db:migrate
   ```

2. Set the Anthropic API key as a worker secret. Paste the key at the prompt:

   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

3. Deploy the new UI and worker:

   ```bash
   npm run deploy
   ```

4. Check that AI is on:

   ```bash
   curl -s https://nostalogic.cafecito-ai.com/api/health
   ```

   Expect `"ai": true` and `"agentModel": "claude-opus-5-5"`.

## Configuration

| Setting | Where | Default | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | worker secret | none | Without it, `/api/prophet` and `/api/remix` return a clear 503. The library still works. |
| `AGENT_MODEL` | worker var or secret | `claude-opus-5-5` | Set `claude-sonnet-5-5` or `claude-haiku-5-5` to lower cost per question. |
| `AGENT_EFFORT` | worker var or secret | `medium` | `low` is faster and cheaper; `high` researches harder. |

Requests use the server-side refusal fallback (`fallbacks: "default"`) and cache
the system prompt and tool definitions.

## Limits and cost controls

- 40 agent questions per browser session per day, 20 remix pitches.
- At most 8 model turns per question; the last turn must answer.
- Check spend from the log:

  ```bash
  npx wrangler d1 execute nostaldamus-db --remote --command \
    "SELECT date(created_at) d, COUNT(*) n, SUM(input_tokens) input, SUM(output_tokens) output FROM agent_runs GROUP BY d ORDER BY d DESC LIMIT 14"
  ```

## Billing errors

If the Anthropic account has no usable API credit, the agent shows: "The
Anthropic account has no usable API credit." API usage bills the Claude
Console organization and workspace that own the key. Credit on a different
organization, or on a claude.ai subscription, does not pay for API calls.

## Test locally

```bash
npm test             # tools against the corpus + agent loop against a fake model
npm run typecheck    # Next app and worker
npm run db:local     # local D1 with schema and the committed corpus
npm run dev:worker   # build and serve the full app at http://localhost:8787
```

For live answers locally, put `ANTHROPIC_API_KEY=...` in `.dev.vars`
(git-ignored) before `npm run dev:worker`.

## Extending the agent

- Add a tool: append its definition to `TOOLS` and a case to `runTool` in
  `worker/agent/tools.ts`, then add a test in `worker/agent/agent.test.ts`.
- Keep tools deterministic and read-only. The library is the only source of
  truth; new data sources (social listening, box office) belong in D1 first.
- The corpus snapshot `data/corpus.json` must match D1. After a re-score, load
  the new JSON with `node scripts/load-seed.mjs <file> <rubric> ` and commit it.

## Full production activation (both agents)

Run in order from the repository root:

1. Apply the migrations: `npm run db:migrate`.
2. Set the worker secrets, one at a time: `npx wrangler secret put ANTHROPIC_API_KEY`,
   then `ADMIN_TOKEN`. (`scripts/agent-setup.sh` creates `AGENT_TOKEN` for you.)
3. Deploy: `npm run deploy`. The hourly signal cron starts with this deploy.
4. Review `docs/revival-watch/sources-proposed.csv` by hand (it has known wrong
   rows, for example All That mapped to All-American Girl) and save the result
   as `docs/revival-watch/sources-reviewed.csv`. Then load only the reviewed file:
   `node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --remote`.
   Never load the proposed file.
5. Create the Revival Watch managed agent: `scripts/agent-setup.sh`. It needs
   `ant` logged in, and it asks before each change.
6. Run it on demand at any time: `ant beta:deployments run --deployment-id <id>`.

## Remix Studio (development packs)

`/studio` turns 2-4 library properties into an ORIGINAL property and a pack for
deciding whether to make it. One request runs five steps (`worker/studio/`),
each saved to `studio_packages` as it lands:

| Step | Output | Made by |
|---|---|---|
| Concept | Title, logline, characters, story engine, borrowed mechanics, risks | Claude, structured JSON |
| Opening pages | About 3 minutes of Fountain screenplay (folded away on the page) | Claude |
| Sizzle shot list | 7-9 shots, 45-60 seconds: keyframe prompt, camera move, title card, voice line, music cue; a style bible; a poster prompt | Claude, structured JSON |
| Poster and keyframes | A 1024x1536 movie poster (high quality) and one 1536x1024 keyframe per shot (medium), stored in R2 | OpenAI gpt-image (`OPENAI_API_KEY`) |
| Greenlight verdict | Develop / revise / pass, six scored dimensions, rights flags, next steps, test questions | Claude, structured JSON |

The page plays the sizzle on a canvas: camera moves on each keyframe,
crossfades, 2.39:1 letterbox, serif title cards, captions, a generated score,
and optional browser voice. **Export video** records it to MP4 or WebM with the
score. **Claude Motion prompt** copies a ready `/motion` prompt with the shots
and keyframe links, for a polished MP4 in claude.ai (Claude Motion is a
claude.ai feature in beta for Team and Enterprise, not an API).

Without `OPENAI_API_KEY` the poster falls back to a Claude-drawn SVG and the
sizzle plays with text cards.

Rights rule in every prompt: borrow mechanics, never expression. No source
names, characters, catchphrases, logos, songs, real people, or brands.

Setup, once:

```bash
npx wrangler r2 bucket create nostaldamus-media
npx wrangler secret put OPENAI_API_KEY
npm run db:migrate          # applies 0004_studio.sql
npm run deploy
```

- Optional: `IMAGE_MODEL` (default `gpt-image-1`), `IMAGE_QUALITY` (forces one quality for all images).
- Limits: 5 packs per visitor IP per day (`STUDIO_DAILY_PER_IP`), 40 in total
  (`STUDIO_DAILY_TOTAL`). Each pack = 4-5 Claude calls plus up to 10 images.
- Cost check:
  `SELECT date(created_at), COUNT(*), SUM(input_tokens), SUM(output_tokens), SUM(images) FROM studio_packages GROUP BY 1`.
