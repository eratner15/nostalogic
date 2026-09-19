# CLAUDE.md

Operating rules for this repo. Read `MASTER_PROMPT.md` for the full plan.

## Two projects live here

1. **NostalDamus**: the existing predictive analytics app (Next.js UI, Hono worker, D1). Source in `src/`, `worker/`, `docs/`. Its status lives in `docs/NOSTALDAMUS-STATUS.md`.
2. **Porchlight** (codename): the family comedy block program. Structure in `canon/`, `projects/`, `deliverables/`, `.claude/agents/`.

Do not break the NostalDamus app while you work on Porchlight. The `nostalgia-scorer` agent reuses NostalDamus scoring logic from `src/services/property-data.ts` and `worker/index.ts`.

## Session ritual

1. Read `STATUS.md` at repo root.
2. Read `DECISIONS.md` for open forks and counsel gates.
3. Read `canon/` before any agent work.
4. Build. Check in only at a Decision Fork or a failed Gate.
5. Update `STATUS.md` before the session ends.

## Binding constraints (from MASTER_PROMPT.md Section 3)

### Intellectual property
- "TGIF" and "SNICK" are trademarks of other companies. Never use them in any name, tagline, domain, handle, metadata, or ad copy.
- Do not copy characters, sets, theme songs, logos, catchphrases, couch props, or episode plots from any existing show.
- Do not imitate the voice or likeness of any real actor.
- Reference old blocks only in internal research files, and only as analysis.
- Borrow mechanics. Never borrow expression.

### Children and privacy
- Assume the Children's Online Privacy Protection Act (COPPA) applies.
- The account holder is always the parent. Collect no personal data from children.
- Assume video platforms mark this content as "made for kids." Plan for no comments, no personalized ads, and limited notifications.

### Counsel gates
Mark each of these `COUNSEL_GATE` in `DECISIONS.md`. None ships without attorney sign-off.
- Final brand name and trademark filing.
- Privacy policy, terms, and COPPA compliance design.
- Any AI-generated performance, voice, or image in released content.
- Any talent, writer, or guild-related agreement.
- Any sponsor or licensing contract.

### Content standards
- All content is safe for age 6 and up and interesting for age 35 and up.
- The `standards` agent reviews every script and every public asset. No content ships without a Standards pass.

### Deliverable rules
- Human-readable outputs are HTML in `deliverables/`. Machine-readable outputs are Markdown, JSON, or code.
- No em dashes in any deliverable. Restructure the sentence instead.
- No time or day estimates in any plan. Sequence by phase only.
- Every market claim cites a source. No source means no claim.

## Operating cadence (from MASTER_PROMPT.md Section 4)

- Default is autonomous. Build further before you check in.
- Stop only at a Decision Fork (Section 9) or a failed Gate (Section 8).
- At a fork, present 2 to 3 options, the tradeoff of each, and a recommendation. Then wait.
- Log every decision in `DECISIONS.md` with date, options, choice, and reason.
- If two agents disagree, the Orchestrator decides and logs the reason.

## Repo rules

- Each project folder in `projects/` has `README.md`, `STATUS.md`, and `out/`.
- Root `STATUS.md` summarizes each project in 3 lines or less.
- Only the Orchestrator writes to `canon/`. Agents write canon proposals to their `out/` folder.
- `red-team` and `standards` never write creative content. They only review.
- Parallel work: one git worktree and one Claude Code session per project. Merge through pull requests to `main`.

## Writing style

- Short sentences. Active voice. One fact per sentence.
- Spell out acronyms on first use.
- Numbered steps for any procedure. Condition before action.
