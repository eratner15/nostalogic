# DECISIONS

Decision log and counsel gate register for Project Porchlight.
Format: date, decision, options, choice, reason. Counsel gates carry the tag `COUNSEL_GATE`.

## Decision log

### D-001. 2026-09-19. Porchlight shares the repo with NostalDamus
- Options: (1) build Porchlight in this repo beside NostalDamus; (2) ask the owner for an empty repo.
- Choice: option 1.
- Reason: the master prompt asks the scorer to reuse NostalDamus logic, and that logic is in this repo. The owner pasted the master prompt here. The NostalDamus app stays untouched. Its status moves to `docs/NOSTALDAMUS-STATUS.md`.

### D-002. 2026-09-19. Root STATUS.md becomes the multi-project roll-up
- Options: (1) keep the NostalDamus status at root and add a Porchlight file; (2) make root STATUS.md the roll-up and archive the NostalDamus detail.
- Choice: option 2.
- Reason: the master prompt requires root STATUS.md to summarize each project in 3 lines or less.

### D-003. 2026-09-19. Nostalgia window is 1993 to 1998
- Options: (1) 1994 to 1996 (original NostalDamus thesis); (2) 1993 to 1998 (owner's later choice, now in the master prompt H3).
- Choice: option 2.
- Reason: the master prompt states the window. NostalDamus already widened to it.

### D-004. 2026-09-19. Scorer formula for format mechanics
- Options: (1) reuse the NostalDamus Revival Readiness formula as is; (2) adapt its weights and window logic to score mechanics instead of properties.
- Choice: option 2.
- Reason: mechanics have no release year. The adapted model keeps the window alignment logic (audience age 12 at exposure, peak at age 40) and swaps property inputs for mechanic inputs. See `projects/01-market/out/mechanics-scorecard.md`.

### D-005. 2026-09-19. Phase 1 verdicts recorded
- Options: accept the analysts' verdicts as filed, or override any of them.
- Choice: accepted as filed. H1 confirmed (medium), H2 weakened (medium), H3 confirmed (medium), H4 confirmed with a split (medium), H5 confirmed (high).
- Reason: neither kill hypothesis (H1, H5) failed. The red team memo in `projects/08-compliance/out/red-team/phase-1-risk-memo.md` was answered item by item in `deliverables/01-gap-memo.html` section 7.

### D-006. 2026-09-19. Parent birth window narrows to 1981 to 1990
- Options: keep 1981 to 1992, or narrow to 1981 to 1990.
- Choice: narrow.
- Reason: a person born 1992 was age 1 to 6 during 1993 to 1998. The window fits births 1981 to about 1990 (`evidence-h1-h3-h5.md`, H3 item 15).

### D-007. 2026-09-19. Orchestrator recommendation at Fork A and Fork B
- Fork A: Go, with two conditions (the slate is the ceiling; the kill line is set before Phase 5 launch).
- Fork B: Option 1 for proof, Option 2 for scale, Option 3 as a revenue layer, Option 4 as the Phase 7 pitch.
- Status: recommendation only. Waits on the owner.

### D-008. 2026-09-19. Scoring model revision 2
- Options: (1) keep the per-mechanic window term; (2) remove it and apply window alignment once at block level.
- Choice: option 2. Weights salience 0.50 and reproducibility 0.50. Bands 85, 75, 60.
- Reason: red team R1-06 showed the term rewarded the scorer's peak-year choice, not the mechanic. Inputs re-scored per R1-07 and R1-20. Result: Reproduce fixed night; Adapt home base set, four slots, interstitials, seasonal stunts, sonic ID, fixed time; Test shared hosts, crossovers; Drop for v1 stay-up-late feeling, viewer participation. Sensitivity: only the top and bottom rows are stable under a 10-point shift.

### D-009. 2026-09-19. H1 and H5 restated with proposed kill thresholds
- H1 restated: the supply gap is confirmed in narrow form (no hosted, original, scripted comedy block for families with children 6 to 14 on a fixed night). Demand for a scheduled ritual is untested. Verdict PARTIAL.
- H5 restated: audience can precede capital in creator media (nine cases). No case is a scripted family comedy block. Confidence Medium.
- Proposed kill thresholds for the owner to ratify at Fork A. Demand smoke test before v0 production: a parent landing page with the promise and a fixed night, and a sign-up floor of 500 parent households from organic and low-cost traffic. Proof of audience at Phase 8: at least 1,000 parent households watch block 1, and at least 35 percent of them watch block 4. Cost ceiling for v0 content plus product: set by the owner at Fork A. If any line is missed, stop or pivot at the Phase 8 memo.
- Reason: the master prompt says stop if H1 or H5 fails. Neither has failed. Neither can be called confirmed without a demand number. The thresholds make the next test falsifiable.

### D-010. 2026-09-19. Ruling on constraint finding C-5 (block trademark inside a cited title in a public deliverable)
- Options: (1) treat cited article titles as analysis and allow them; (2) shorten cited titles in human-facing deliverables so the mark does not appear.
- Choice: option 2.
- Reason: Section 3.1 allows the marks only in internal research files. `deliverables/` is not an internal research file. The evidence files keep full titles.

### D-011. 2026-09-19. Fork A decided by the owner: Go, through a trailer demand test
- Options: go to a demand test, pivot to one show, kill.
- Choice: go. The owner's words: build a site that looks like an old TV guide, click into a show, watch a trailer or teaser. Develop a show further only if demand proves out.
- Reason: owner decision. It matches the Phase 1 recommendation with a sharper test object: trailers instead of a bare landing page.

### D-012. 2026-09-19. Fork B decided by the owner: owned site
- Options: owned site plus video platform channel, FAST partnership, single sponsor, sell to a streamer.
- Choice: option 1, owned site. The trailer site is the product. A video platform channel can mirror trailers for discovery later.
- Reason: owner decision. Matches the Phase 1 recommendation.

### D-013. 2026-09-19. Phase 5 v1 scope replaced by the trailer site
- Options: keep the master prompt v1 scope (landing page, premiere page, ritual kit, parent accounts), or replace it with the owner's trailer site.
- Choice: replace. v1 is a retro TV guide listing for the block. Each of the four shows opens to a watchable trailer. Metrics per trailer: plays, completion rate, "I would watch this" votes, parent email sign-ups. No child data. No comments. Parent-facing only.
- Reason: the owner set the definition of done: the site plus watchable videos that have good dialogue, plot, and make a viewer want more. The D-009 thresholds carry over: 500 parent sign-ups is the floor for developing any show further. Per-show develop-further line, proposed: at least 40 percent trailer completion and a vote ratio at or above 3 to 1 in favor.
- Stack stays fixed: Cloudflare Workers, Hono, TypeScript, D1, Drizzle, wrangler. The site lives in `projects/05-product/site/` so the NostalDamus app is untouched.

### D-014. 2026-09-19. Fork C decided in substance: AI-assisted production for trailers. `COUNSEL_GATE` CG-03 is now TRIGGERED
- Options: audio with animatics, micro-budget live action, 2D animation, AI-assisted production.
- Choice: option 4. The owner names Codex for images and video and Opus for multi-style builds. The style reference the owner gave (kengoworks.com) could not be fetched through the research proxy.
- Consequence: no trailer ships publicly until an attorney signs off on AI-generated performance, voice, or image, and a disclosure policy is written. The site can run privately for the owner and testers before that. The compliance-gate agent holds the register.
- Reason: owner decision. The gate is binding under Section 3.3.

### D-015. 2026-09-19. Slate selection by tournament
- Method: the showrunner writes 20 concepts, 5 per slot. Three judge agents score every concept on a fixed rubric (engine, two-generation hook, originality and IP distance, trailer strength, standards fit). Scores aggregate by a script. The top 2 per slot go to a head-to-head. One winner per slot. Only the Orchestrator can override, with a logged reason.
- Reason: the owner asked for a tournament. A fixed rubric and a script keep it reproducible.

### D-016. 2026-09-19. Census gap closed by the owner
- The owner supplied ACS 2021 5-year table B11003. Families with own children 6 to 17 only: 19,840,568. Families with children under 6 and 6 to 17: 6,714,759. Families with any own child 6 to 17: 26,555,327. Families with own children under 18: 33,700,465. Share with a child 6 to 17: 78.8 percent.
- Effect: the households range for a child age 6 to 14 tightens to 18.5 to 26.6 million. The upper bound is now sourced.

### Fork D note. Brand name
- The brand-strategist shortlist is produced in this session. The site build uses a provisional name as a single config constant. The owner picks at Fork D. CG-01 stays open until counsel clears the pick.

### D-017. 2026-09-19. Trailer release cadence: all four live from launch
- Options: (A) all four trailers live from launch; (B) one premieres per fixed night in slot order.
- Choice: A.
- Reason: the demand test compares four shows against each other. Week 1 visitors must be able to compare. The format-architect's option B becomes the full-episode premiere stunt (Lamp On) instead. The fixed night still carries the wrap and the Listing email.

### D-018. 2026-09-19. Format canon merged
- The canon proposal in `projects/03-block-format/out/canon-proposal.md` is merged into `canon/CANON.md` sections 2, 2a, and 5, and `canon/GLOSSARY.md`. Item 27 is decided by D-017. Item 15 adds a note: host casting triggers CG-04 (human) or CG-03 (AI-assisted).

### D-019. 2026-09-19. Review deployment path
- Facts: the build container cannot reach api.cloudflare.com, workers.cloudflare.com, api.netlify.com, or ratlinks.com (egress policy). No Cloudflare or Netlify credentials exist here. The Netlify connector lists the owner's team but has no ratlinks project and cannot upload local files.
- Options: (1) wait for the owner to deploy; (2) publish a static export as a private review page now and hand the owner a five-command deploy for ratlinks.com/tv; (3) create a new Netlify project through the connector.
- Choice: option 2. Option 3 cannot upload files from this container, and it would create a site the owner did not ask for.
- Consequence: the site supports `BASE_PATH=/tv`, a preview config without D1, and a static export. Runbook section 8 holds the ratlinks.com/tv steps for both Cloudflare and non-Cloudflare hosts.

## Open forks

- Fork A: decided, Go (D-011).
- Fork B: decided, owned site (D-012).
- Fork C: decided in substance, AI-assisted (D-014). CG-03 triggered.
- Fork D (end of Phase 2): final brand name from the shortlist of 5. Open. Site uses a provisional name.
- Fork E (end of Phase 4): lead show and slate order. Not open yet.
- Fork F (end of Phase 6): first two franchise lines. Not open yet.

## Counsel gate register

| ID | Item | Phase | Status |
|---|---|---|---|
| CG-01 `COUNSEL_GATE` | Final brand name and trademark filing | 2 | Open. Shortlist of 5 screened in `projects/02-brand/out/names-5.md`. Recommendation: Streetlights. Counsel runs the direct USPTO search; the proxy blocked it. |
| CG-02 `COUNSEL_GATE` | Privacy policy, terms, and COPPA compliance design | 5 | Open. Not started. |
| CG-03 `COUNSEL_GATE` | AI-generated performance, voice, or image in released content | 3 (Fork C) and 5 | TRIGGERED by D-014. Blocks public release of any trailer. Disclosure policy required. |
| CG-04 `COUNSEL_GATE` | Talent, writer, or guild-related agreement | 4 | Open. Triggers on host casting or any voice talent for trailers. |
| CG-05 `COUNSEL_GATE` | Sponsor or licensing contract | 7 | Open. Not started. |

The `compliance-gate` agent keeps the detailed register in `projects/08-compliance/out/gate-register.md`.
