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

## Open forks

- Fork A (after Phase 1): go, pivot, or kill. Status: presented in `deliverables/01-gap-memo.html` with the D-009 thresholds. Waits on owner.
- Fork B (after Phase 1): primary distribution path. Status: presented in `deliverables/01-gap-memo.html` with a per-option mechanics survival table. Waits on owner.
- Fork C (after Phase 3): production format for v0 content. Not open yet.
- Fork D (end of Phase 2): final brand name. Not open yet.
- Fork E (end of Phase 4): lead show and slate order. Not open yet.
- Fork F (end of Phase 6): first two franchise lines. Not open yet.

## Counsel gate register

| ID | Item | Phase | Status |
|---|---|---|---|
| CG-01 `COUNSEL_GATE` | Final brand name and trademark filing | 2 | Open. Not started. |
| CG-02 `COUNSEL_GATE` | Privacy policy, terms, and COPPA compliance design | 5 | Open. Not started. |
| CG-03 `COUNSEL_GATE` | AI-generated performance, voice, or image in released content | 3 (Fork C) and 5 | Open. Not started. |
| CG-04 `COUNSEL_GATE` | Talent, writer, or guild-related agreement | 4 | Open. Not started. |
| CG-05 `COUNSEL_GATE` | Sponsor or licensing contract | 7 | Open. Not started. |

The `compliance-gate` agent keeps the detailed register in `projects/08-compliance/out/gate-register.md`.
