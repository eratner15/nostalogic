# Gate Register

Agent: `compliance-gate`. Updated 2026-09-19 (Phase 1). Mirror of the counsel gate table in `DECISIONS.md`, with detail.

## Counsel gates

| ID | Item | Phase it blocks | Artifact it blocks | Status | Owner action |
|---|---|---|---|---|---|
| CG-01 | Final brand name and trademark filing | 2 | `deliverables/02-brand-book.html`, any public use of the name | Open. Shortlist screened (`projects/02-brand/out/names-5.md`). Recommendation: Streetlights. All screens rest on web search; the proxy blocked USPTO, WHOIS, and RDAP. | Attorney runs the direct USPTO search on the pick and the runner-up (Rumpus) before filing. The site uses the name as a provisional constant only, behind `noindex`. |
| CG-02 | Privacy policy, terms, and COPPA compliance design | 5 | Any deployed page that stores a parent account | Open. Data map: household cookie (random id), parent email, plays, votes. Standards note: the site loads Google Fonts, a third-party request; decide self-hosting before public launch. | Attorney reviews the data map and consent flow before launch. The 2025 COPPA amendments apply (compliance date April 22, 2026, `landscape.md` section 9). |
| CG-03 | AI-generated performance, voice, or image in released content | 3 (Fork C option 4) and 5 | Every trailer, the host wrap, the Moth | TRIGGERED (D-014). Blocks public release. | Attorney reviews the production method per trailer. A disclosure policy is written and placed on the About page before `noindex` comes off. |
| CG-04 | Talent, writer, or guild-related agreement | 4 | Any script or performance under contract, host casting, voice talent | Open. Triggers on the first hire or casting. | Attorney reviews before any hire. |
| CG-05 | Sponsor or licensing contract | 7 | Any sponsor integration or channel deal | Open. Not started. | Attorney reviews before signature. |

## IP checks

| Asset | Result | Notes |
|---|---|---|
| Phase 1 research files | CLEAR for internal use | Files name old blocks and shows as analysis only, as Section 3.1 allows. No public asset uses them. |
| `deliverables/01-gap-memo.html` | See `ip-checks/01-gap-memo.md` | Public-facing HTML. Checked for trademark use outside analysis. |

## Phase 1 compliance notes

1. The gap memo names other companies' blocks only as historical analysis. It uses no such name in any title, tagline, or heading.
2. No creative expression exists yet. No similarity check is due.
3. Made-for-kids platform limits (no comments, no notifications, no personalized ads) are recorded in `landscape.md` section 9 and shape Phase 5.
