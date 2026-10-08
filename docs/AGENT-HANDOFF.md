# Prophet search agent: handoff and activation

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

1. Apply the schema. It is idempotent and adds the `agent_runs` table:

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
| `ANTHROPIC_API_KEY` | worker secret | none | Without it, `/api/agent` and `/api/remix` return a clear 503. The library still works. |
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
