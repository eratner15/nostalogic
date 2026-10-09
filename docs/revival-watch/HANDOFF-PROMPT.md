# Handoff: finish and ship Revival Watch in NostalDamus

> **Status update, 2026-10-08 (after this prompt was written):** Phase 1 is done.
> PR #4 merged into `main` (commit `aa84c4e`) and carries all of PR #5. Skip
> Phase 1 and start at Phase 2 on a branch from `origin/main`. What changed
> versus the text below:
>
> - The Prophet search agent lives at `POST /api/prophet`. Revival Watch keeps
>   `/api/agent/*` and `/api/admin/*` unchanged, so `agents/revival-watch.md`
>   needs no path edit.
> - `worker/schema.sql` is gone. The schema is three migrations in
>   `worker/migrations/`: `0001_initial` (no-op on prod), `0002_ledger_signals`,
>   `0003_briefs_agent_runs` (`brief_requests`, `agent_runs`). Phase 3 step 1
>   applies all three.
> - Checks: `npm test` (all suites), `npm run typecheck` (app and worker),
>   `npm run build`. Local DB: `npm run db:local`.
> - The year is read at call time through `currentYear()` in
>   `src/lib/scoring.ts`; `worker/scoring.ts` delegates to it.
> - The 13 Codex findings on PR #5 and 8 on PR #4 are fixed except one product
>   decision: checkout redirects before the scope review.
> - `/market-intelligence` now reads live data and says 1993-1998.
> - Production activation is also summarized in `docs/AGENT-HANDOFF.md`.

Paste everything below the line into a new Claude Code session started in `~/nostalogic`.

---

## Context

NostalDamus (`~/nostalogic`, GitHub `eratner15/nostalogic`, Worker `nostaldamus`) is live at https://nostalogic.cafecito-ai.com. It is a Hono Worker over D1 `nostaldamus-db` (`1c94c92c-5013-413a-83d3-97207f122309`), serving a static Next export through ASSETS. It scores 120 dormant 1993-1998 properties for revival potential. It uses the real property names on purpose: if the engine works in public, that proves its value to the IP holders.

Revival Watch is built, tested locally, and open as **PR #5** (branch `feat/revival-watch`, commit `9313f7d`). It is **not deployed**, and the prod D1 migration is not applied. The plan is `docs/plans/revival-watch.html`; Evan accepted all five defaults. It adds:

- weekly score snapshots;
- a public `/track-record` page (a property is flagged at score 80; a hit means revival news within 24 months; the hit rate stays hidden until 20 calls resolve);
- an hourly signal cron (Wikipedia pageviews, plus posts in each property's own subreddit through Arctic Shift), with a bookmark for each source; a failed read writes a gap, never a zero;
- rubric r3 buzz from those signals, mapped onto the hand-score scale (22-80), starting only once 30 or more properties have coverage;
- `/api/agent/*` and a private `/admin` review page;
- Managed Agents files for a weekly Revival Watch agent.

Read these first, in this order: `STATUS.md`, `docs/plans/revival-watch.html` (open `docs/plans/revival-watch.packed.html` in a browser), `worker/scoring.ts`, `worker/signals.ts`, `worker/ledger.ts`, `worker/agent-api.ts`, `agents/revival-watch.md`, `scripts/agent-setup.sh`.

**PR #4** (`claude/agent-search-overhaul`, a Prophet search agent plus a design overhaul) is also open. It conflicts with PR #5 in:

- `worker/index.ts`, `worker/tsconfig.json`, `worker/schema.sql`;
- `wrangler.toml`, `package.json`, `STATUS.md`;
- `src/app/property-library/page.tsx`, `src/components/Navbar.tsx`, `src/services/property-data.ts`.

Evan merges the PRs himself. This session adapts to whatever state `main` is in.

## Fill-ins

- `ADMIN_TOKEN`: Evan generates it, or you generate one with `openssl rand -hex 32` and pipe it straight to `wrangler secret put`. Never print it or write it to a file.
- `DIGEST_EMAIL_TO` and `RESEND_API_KEY`: optional. If Evan gives no address, skip the email; the private `/admin` page still shows each digest.

## CLAUDE.md block

If `~/nostalogic/CLAUDE.md` does not exist, create it with this block. If it exists, append the block under a "Revival Watch" heading.

```
- Prod is live with real users. Do not deploy, apply a remote D1 migration, or run `ant apply` without Evan's explicit go in this session.
- Deploy only with `npm run deploy` from a branch that contains origin/main. Run `git fetch && git diff origin/main --stat` first.
- WSL2: prefix every wrangler call with NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt.
- Secrets: wrangler secret put, or the Managed Agents vault. Never in a file, a commit, a log, or a chat message. Pre-push: grep -rE 'cfut_|sk-|sk_live|whsec_|_aWVT' .
- Cloudflare cron day-of-week 1 is Sunday. Keep day checks in JS (worker/index.ts scheduled()). Managed Agents cron is POSIX (1 is Monday).
- A missing signal is never a zero. A failed read keeps its bookmark and writes a gap row.
- The agent never writes a property. Only an approved proposal in /admin changes the library.
- No accuracy or hit-rate claim anywhere until the track record shows 20 resolved calls.
- No em dashes in any human-read output (pages, digests, copy). No timeline estimates.
- Never name a model in a prompt or skill. The model lives only in agents/revival-watch.md frontmatter.
- Before the session ends, update STATUS.md.
```

## Operating rules

- Make reasonable decisions and keep building. Stop only at the two gates below.
- Commit at the end of each phase with a message that names the phase.
- Write a short log for each phase to `docs/revival-watch/log-phase-N.md`: what ran, its output, and what failed.
- Do not use `--dangerously-skip-permissions` for Phases 3 and 4. They touch prod.
- Arctic Shift answers HTTP 422 "Timeout. Maybe slow down a bit" at random. The fetcher retries once, then records a gap. Do not add tight loops against it.

## Phase 1: Reconcile with main

1. Run `git fetch origin` and `gh pr list --state all --limit 10`.
2. If PR #4 merged: rebase `feat/revival-watch` onto `origin/main` and resolve each conflict. The rules:
   - Keep PR #4's design and copy in the UI files. Re-add the Revival Watch parts on top: the Track record nav link, the score history sparkline in the library, and the client year fix (`CURRENT_YEAR` from the date). PR #4 adds `src/lib/scoring.ts`; move the year fix there if the old function moved.
   - In `worker/index.ts`, keep both: PR #4's agent routes and PR #5's `app.route("/", agentApi)`, `/track-record`, `/score-history`, the health `digest` block, and the `scheduled()` handler.
   - The two agents need different paths. If both use `/api/agent/*`, move PR #5's routes to `/api/watch/*` and update `agents/revival-watch.md` to match.
   - Merge `worker/tsconfig.json`, `package.json` scripts and `wrangler.toml`. Keep the `[triggers]` cron and `migrations_dir`.
   - If PR #4 changed `worker/schema.sql`, check that it does not clash with `worker/migrations/0002_ledger_signals.sql`.
3. If PR #4 is still open: leave it alone, and continue on `feat/revival-watch`.
4. Run `npm run test:worker`, `npm run typecheck:worker`, `npx tsc --noEmit` and `npm run build`. All must pass.
5. Force-push with lease only after a rebase. Commit.

## Phase 2: Review the source mapping

`docs/revival-watch/sources-proposed.csv` maps each property to a Wikipedia title and a subreddit. The search found titles for all 120 properties (99 high, 15 medium and 6 low confidence) and subreddits for 104. Some rows are wrong. Known examples:

- "All That" matched *All-American Girl*;
- "Ace of Base" matched an album page;
- some subreddits are generic words, not fan communities.

1. Check every medium and low row, and every subreddit, against the real page. Use the Wikipedia API (`action=query&titles=...`) and Arctic Shift `/api/subreddits/search`.
2. Fix wrong cells. Clear a cell if nothing correct exists: an empty cell means no source, which beats a wrong one.
3. Make sure a subreddit is about the property, not a generic word. Check its subscriber count and recent post titles.
4. Save the result as `docs/revival-watch/sources-reviewed.csv`.
5. Test it locally. Run `node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --local` on a local D1 that has the schema, the prod properties and the migration. Then run `npx wrangler dev --local --test-scheduled` with a `.dev.vars` file (gitignored) holding throwaway `AGENT_TOKEN` and `ADMIN_TOKEN` values. Call `POST /api/admin/run/signals` until no stale pairs remain.
6. Write the coverage numbers to the phase log. Commit.

## Gate 1: Evan approves the prod rollout

Show Evan:

- the diff stat against `origin/main`;
- the migration SQL;
- the review summary for the source mapping.

Ask for an explicit go. Without it, stop after Phase 2.

## Phase 3: Prod rollout (only after Gate 1)

Run each step and check its result before the next:

1. Apply the migration: `npx wrangler d1 migrations apply nostaldamus-db --remote`. It is additive: one new column (`social_buzz_hand`, copied from `social_buzz`) and seven new tables.
2. Set the secret: `openssl rand -hex 32 | npx wrangler secret put ADMIN_TOKEN`. Give Evan the token once, through a channel he chooses; do not write it to a file. Set `RESEND_API_KEY` and `DIGEST_EMAIL_TO` only if Evan gave them.
3. Deploy with `npm run deploy` from the branch that holds the merged work.
4. After the deploy, check the Cloudflare dashboard (or `wrangler deployments list`) to confirm that the cron trigger `17 * * * *` is present. A route-sync error can abort the deploy before triggers apply.
5. Run `node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --remote`.
6. Backfill: call `POST /api/admin/run/signals` with the `x-admin-token` header until `pairs` returns 0. The hourly cron also catches up.
7. Run `POST /api/admin/run/weekly` once. It writes the first snapshot week. It also starts rubric r3 if 30 or more properties have coverage; if not, its output says how many do.
8. Smoke test, and record the results in the log:
   - `curl /api/health` returns a `digest` block;
   - `/track-record`, `/admin` and `/property-library` return 200;
   - `/api/track-record` shows `trackingSince` set to this week.

## Gate 2: Evan approves the agent setup and spend

Run `ant apply --dry-run -v` on the five base files and show Evan the plan. Confirm all of the following:

- The org is "Evan's Individual Organization" and holds the $200 promotional credit. The credit expires 2026-10-22 and auto-reload is off.
- The budget cap is $5 a run (`deployments/revival-watch-weekly.md`).
- The schedule is Monday 13:32 America/New_York (after the weekly snapshot).

Ask for an explicit go.

## Phase 4: Agent setup (only after Gate 2)

1. Run `scripts/agent-setup.sh` in a terminal; it asks at each step. In order, it:
   - applies the agent, environment, memory stores and vault;
   - writes the real vault ID into the deployment file (`ant` does not resolve a path in `vault_ids`);
   - seeds memory from `agent-seed/`;
   - creates one `AGENT_TOKEN`, stored as both the Worker secret and the vault credential `NOSTAL_AGENT_TOKEN`;
   - applies the deployment;
   - offers one manual run.
2. Start the manual run. Watch it with `ant beta:deployment-runs list --deployment-id <id>`, then follow the session.
3. Check the results:
   - `/admin` shows the digest;
   - its last line names any unread source, or says "All sources read";
   - each proposal links to a trade source and carries an exact quote;
   - `/api/health` reports `digest.age_days` 0.
4. Record the list cost of the run from the session usage. If it is far under $5, propose a lower cap to Evan.
5. Commit `claude-lock.json` and the deployment file with the real vault ID. Commit.

## Verification

Each item needs evidence in the phase logs:

- Test, typecheck and build output after Phase 1.
- Coverage numbers after Phase 2: the count of properties with each source.
- Playwright screenshots of `/track-record`, `/admin` (with the token entered) and `/property-library`, at desktop (1280 px) and mobile (390 px) widths. Take them before the prod deploy against local dev, and again after it against prod. Puppeteer and Playwright on WSL2 need `--user-data-dir=/tmp/...`.
- The smoke-test curl output after Phase 3.
- After Phase 4: the deployment run ID, the session ID, the digest ID and the list cost.
- Run `/code-review` on the final branch before Evan merges.

## Out of scope

- Remix Lab and Prophet Chat. Their `ANTHROPIC_API_KEY` is a separate Worker secret that Evan sets.
- The deck's accuracy claims (87%, ROI, LTV:CAC). Evan edits the deck.
- `/market-intelligence`, which still reads bundled data and says 1994-1996.
- Accounts, paywall and pricing.
- `NAITHAN_SYSTEM_HANDOFF.md` and `happy-vensday-v2-share.mp4` in the repo root. They belong to the ratlinks work. Do not commit them.

## End of session

Before the session ends, update repo-root `STATUS.md` with: the current state, which phases finished, both gate decisions, the spend so far, open decisions, and the next actions.
