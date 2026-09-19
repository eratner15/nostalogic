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

## Open forks

- Fork A (after Phase 1): go, pivot, or kill. Status: presented in `deliverables/01-gap-memo.html`. Waits on owner.
- Fork B (after Phase 1): primary distribution path. Status: presented in `deliverables/01-gap-memo.html`. Waits on owner.
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
