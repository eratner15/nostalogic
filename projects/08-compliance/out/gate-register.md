# Gate Register

Agent: `compliance-gate`. Updated 2026-09-19 (Phase 4, slate script expression check added; re-check after D-024 added). Mirror of the counsel gate table in `DECISIONS.md`, with detail.

## Counsel gates

| ID | Item | Phase it blocks | Artifact it blocks | Status | Owner action |
|---|---|---|---|---|---|
| CG-01 | Final brand name and trademark filing | 2 | `deliverables/02-brand-book.html`, any public use of the name | Open. Shortlist screened (`projects/02-brand/out/names-5.md`). Recommendation: Streetlights. All screens rest on web search; the proxy blocked USPTO, WHOIS, and RDAP. | Attorney runs the direct USPTO search on the pick and the runner-up (Rumpus) before filing. The site uses the name as a provisional constant only, behind `noindex`. The same USPTO pass should cover the four show titles in `ip-checks/04-slate-titles.md`, the store name "Hardison's Hardware," and the real-person name matches in `ip-checks/04-slate-scripts.md`, including the five REVIEW names in its "Re-check after D-024" section. |
| CG-02 | Privacy policy, terms, and COPPA compliance design | 5 | Any deployed page that stores a parent account | Open. Data map: household cookie (random id), parent email, plays, votes. Standards note: the site loads Google Fonts, a third-party request; decide self-hosting before public launch. | Attorney reviews the data map and consent flow before launch. The 2025 COPPA amendments apply (compliance date April 22, 2026, `landscape.md` section 9). |
| CG-03 | AI-generated performance, voice, or image in released content | 3 (Fork C option 4) and 5 | Every trailer, the host wrap, the Moth | TRIGGERED (D-014). Blocks public release. | Attorney reviews the production method per trailer. A disclosure policy is written and placed on the About page before `noindex` comes off. |
| CG-04 | Talent, writer, or guild-related agreement | 4 | Any script or performance under contract, host casting, voice talent | Open. Triggers on the first hire or casting. | Attorney reviews before any hire. |
| CG-05 | Sponsor or licensing contract | 7 | Any sponsor integration or channel deal | Open. Not started. | Attorney reviews before signature. |

## IP checks

| Asset | Result | Notes |
|---|---|---|
| Phase 1 research files | CLEAR for internal use | Files name old blocks and shows as analysis only, as Section 3.1 allows. No public asset uses them. |
| `deliverables/01-gap-memo.html` | See `ip-checks/01-gap-memo.md` | Public-facing HTML. Checked for trademark use outside analysis. |
| Slate titles and premises (A2, H2, W5, L1) | See `ip-checks/04-slate-titles.md`. Titles: Kitchen Court CLEAR, Long Route CLEAR, Recent History Society CLEAR, The Night Desk REVIEW. Premises: Kitchen Court CLEAR, Long Route REVIEW, Recent History Society CLEAR, The Night Desk CLEAR. No BLOCK. | The Night Desk title collided with an active YouTube horror-fiction channel; retitled The Returns Desk (D-022). The Long Route premise sits next to three bus-only kids' comedies; mandatory distance rules are listed. Trademark databases were blocked; counsel runs USPTO on all four titles before public use. |
| Slate scripts, expression level: four trailers, four character sheets, four cold opens, bible section 10s | See `ip-checks/04-slate-scripts.md`. First pass: Kitchen Court CLEAR (one condition), Long Route REVIEW, The Returns Desk CLEAR (guardrails), Recent History Society CLEAR (guardrails). Re-check after D-024: the six replacement names (Frances Keel, Hollis Keel, Mateo Arriaga, Priya Coker, Dele Oyelaran, Tola Oyelaran) and the label "The Judge" are all CLEAR; the Long Route REVIEW is lifted. The full-name sweep of the remaining regulars found 5 REVIEW names: Wendell Huang (A2), Ines Ruiz (L1), Harlan Voss, Piper Voss, and Dale Pruitt (W5; Pruitt also drives Route 4 in H2). 21 items checked: 16 CLEAR, 5 REVIEW, 0 BLOCK. | No costume, prop, set detail, catchphrase, joke, or plot beat copies an existing show. All mandatory distance rules from the title check are met, two refined. The five REVIEW names match, in order, a covered corporate executive, a Spanish actress with an IMDb credit, an active entertainment and author persona, a recording artist with an album released in 2026, and a covered football coach with an IMDb entry. Each name is barred from public assets, image prompts, and casting notices until counsel clears it or the room takes the pre-searched replacement (Wendell Liang, Nieves Ruiz, Harlan Mabry, Piper Mabry, Dale Renfro). "The Judge" stays a role label only, never a title or mark. Cal Whitlock carries a watch note (a Twitch handle). Four hits rest on search excerpts because the proxy blocked IMDb, Apple Music, and YouTube; counsel confirms from primary pages. |

## Phase 1 compliance notes

1. The gap memo names other companies' blocks only as historical analysis. It uses no such name in any title, tagline, or heading.
2. No creative expression exists yet. No similarity check is due.
3. Made-for-kids platform limits (no comments, no notifications, no personalized ads) are recorded in `landscape.md` section 9 and shape Phase 5.

## Phase 4 compliance notes

1. The four winning concepts now carry expression (titles, characters, devices, seeds). `ip-checks/04-slate-titles.md` is the first similarity check on creative work.
2. Two items needed a decision before any public asset: the Night Desk title question (decided, D-022, retitled The Returns Desk) and the Long Route bible re-check (done in `ip-checks/04-slate-scripts.md`; all six distance rules met on the page).
3. Every bible must carry the distance rules from its section of `ip-checks/04-slate-titles.md`. The `standards` agent can cite them under STANDARDS 2.12.
4. D-024 applied the four Long Route name changes and the "The Judge" label. The re-check in `ip-checks/04-slate-scripts.md` clears all of them and lifts the Long Route REVIEW.
5. Five names now hold REVIEW after the full-name sweep: Wendell Huang, Ines Ruiz, Harlan Voss, Piper Voss, Dale Pruitt. The image model and casting must not use these names. The room takes the pre-searched replacement or sends the name to counsel; any other pick comes back to this agent for a re-check.
6. Internal naming collisions across the shared town (two characters named Ines, two named Dale, Pip beside Piper, Tull beside Tulliver, Lorna beside Lorraine) are listed in that file for the Orchestrator. They are continuity notes, not IP findings. Renaming Ines Ruiz to Nieves Ruiz would close the Ines collision.
