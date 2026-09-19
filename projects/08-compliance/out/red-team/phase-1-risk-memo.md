# Phase 1 Risk Memo

Agent: `red-team`. Date: 2026-09-19. Internal review only. No creative content.

Files attacked:
- `projects/01-market/out/evidence-h1-h3-h5.md` (E1)
- `projects/01-market/out/evidence-h2-h4-history.md` (E2)
- `projects/01-market/out/landscape.md` (L)
- `projects/01-market/out/scoring-model.md` (SM)
- `projects/01-market/out/mechanics-input.json` (MI)
- `projects/01-market/out/mechanics-scorecard.md` (MS)

Method note. I spot-checked 30 claims with WebSearch. The proxy blocked every direct WebFetch, including Wikipedia. Each check therefore rests on search excerpts. The log in Section 5 marks each result.

## 1. Summary

Counts: 8 HIGH, 7 MEDIUM, 7 LOW. Constraint findings: 5, listed in Section 6.

Phase 1 cannot close yet. The literal H1 gap claim is false. PBS KIDS markets a weekly Friday "Family Night" block and repeats it on weekends. The substantive H1 claim (unmet demand for a scheduled family ritual) is untested. E1 admits no source measures that demand. Three streaming-era tests of the two-generation nostalgia bet are absent from the files. All three were canceled. H5 rests on ten winners in other formats, with survivorship bias admitted and "High" confidence assigned anyway. The scoring model gives 40 percent of each mechanic score to a window term that cannot discriminate between mechanics. One input change flips the only "Reproduce" verdict to "Adapt." The market size section produces no reachable household count and no US sponsor budget. My view: neither H1 nor H5 has failed. Neither is confirmed. Both need a restated claim and a stated kill threshold before Fork A.

## 2. HIGH items

### R1-01. The "no one programs a family night" claim is false as written
- Severity: HIGH
- File and section: L Section 1 line 9; L Section 7 line 116; L Section 8 line 120; E1 Section 1 line 11; E1 Section 2 line 19; E1 Section 7 line 322.
- Claim (quoted): "No US streamer, FAST service, kids network, creator studio or faith network markets a weekly, fixed-night family comedy block." Also quoted: "Nothing found matches 'family night' as a product."
- Attack: PBS KIDS runs "PBS KIDS Family Night" every Friday, 7 to 9 p.m. It airs on the free 24/7 channel and stream. It repeats Saturday and Sunday evenings. PBS markets it under that exact name on pbs.org/parents. It carries movies, specials, and themed marathons. It is a kids network, a weekly fixed night, and a marketed family co-viewing product. L Section 5 lists PBS Kids and misses it. L Section 7 also omits BYUtv. BYUtv streams free, ad-free family comedy with weekly new episodes and a studio audience. The nine precedent searches in L Section 7 never included the term "PBS."
- Evidence: Search results for "PBS KIDS Family Night" (pbs.org/parents/family-night, WXXI, PBS Utah, Arizona PBS). Search results for BYUtv (byutv.org, PR Newswire on Studio C season 22).
- What resolves it: Rewrite the gap as the narrow claim the evidence supports. The narrow claim: no one runs a hosted, original, scripted comedy block for ages 6 to 14. None runs one on a fixed night. Add PBS KIDS Family Night and BYUtv to L Section 5 and Section 7. State what each does and does not do. Restate the H1 one-line reason in E1 and in the gap memo.

### R1-02. H1 "CONFIRMED" rests on absence of evidence
- Severity: HIGH
- File and section: E1 Section 2 lines 17 to 19; E1 "What weakens H1" line 93; E1 Section 7 items 1 and 3 (lines 322 and 324).
- Claim: "Appointment co-viewing for families is underserved. Verdict: CONFIRMED."
- Attack: "Underserved" needs two things: demand and a shortfall of supply. The file measures neither. Co-viewing rates (47 percent, 90 percent, 73 percent) measure behavior that already happens. They do not measure want for a schedule. The file says so itself at line 93 and line 324. The supply gap is "absence of evidence, not proof of absence" (line 322). The one direct co-viewing feature on a family streamer, Disney+ GroupWatch, was removed in September 2023. Removal of a feature is evidence of low use, not of unmet demand. The master prompt says stop if H1 fails. A hypothesis with no demand measure has not been tested. It cannot be "CONFIRMED."
- Evidence: E1 lines 93, 322, 324. Search results on GroupWatch removal (GamesRadar, What's On Disney Plus, September 2023).
- What resolves it: Restate H1 as UNTESTED. Define the test and the kill threshold before Fork A. Name the source of a demand signal. Acceptable forms: a parent survey with a stated sample, or an owned-site smoke test with a stated conversion floor. Log the threshold in `DECISIONS.md`.

### R1-03. Three streaming-era tests of the two-generation bet are missing, and all three failed
- Severity: HIGH
- File and section: L Section 7 lines 104 to 116; E1 Section 3 (H3) lines 96 to 160; E2 Section 3 (why each block ended).
- Claim: The files treat the gap as white space. The only revival tests examined are ABC 2003, ABC 2018, and CBS 1997.
- Attack: Others tested the exact thesis on streaming and cable and stopped. Fuller House (Netflix, 2016 to 2020) revived a Friday block sitcom. It aimed at nostalgic parents and their kids. It was Netflix's top show at launch. Viewership fell as the nostalgia wore off. Netflix ended it after five seasons. Girl Meets World (Disney Channel, 2014 to 2017) targeted parents who watched the original and kids 6 to 14. The premiere drew 5.16 million. Season three averaged 1.5 million. Reports say the 6 to 14 audience did not stay. That '90s Show (Netflix, 2023 to 2024) was canceled after two seasons. The pattern is the same each time. The parent shows up at launch. The child does not stay. This is the H3 two-generation bet, tested three times with more money than Porchlight has. The files never ask whether the gap is a graveyard.
- Evidence: Search results on Fuller House cancellation (Screen Rant, Bustle, iHeart), Girl Meets World cancellation (Deadline, Variety, Forbes, January 2017), That '90s Show cancellation (Variety, Deadline, October 2024).
- What resolves it: Add a "tested and stopped" table to L or E2. Use the E2 Section 3 cause split: demand, cost, strategic. Include Fuller House, Girl Meets World, That '90s Show, and any other cases the analyst finds. State the demand evidence from each. Then restate whether the gap is opportunity or graveyard, with the reason.

### R1-04. H5 "CONFIRMED, High" is not supported by its own comparables
- Severity: HIGH
- File and section: E1 Section 4 lines 164 to 166; E1 "What weakens H5" lines 244 to 246; E1 Section 6 lines 306 to 318.
- Claim: "A small studio can prove audience at low cost. Confidence: high. Ten comparable cases started with home gear, a pilot, or a Patreon."
- Attack: The file admits survivorship bias and assigns "High" anyway. That is a contradiction. Eight of ten cases are not the target format. Ms. Rachel, Blippi, Cocomelon, and Ryan's World serve preschoolers. Critical Role, Dropout, Kinda Funny, and Smosh serve adults. The Chosen is faith drama. Studio71 is a corporate creator network, not a small studio. None is a scripted comedy block for ages 6 to 14 on a fixed night. None ran a schedule. The cases prove a person can build an audience over years. Cocomelon took twelve years to its 2018 breakout. Blippi took six years to sale. Dhar Mann posted 100 videos "that nobody watched" first. The cases do not prove "low cost." The file never defines "low cost" in dollars or "prove audience" in households. Dhar Mann, the nearest comparable, now runs 200 staff on a 125,000 square foot lot. That is the cost of competing in family live action on YouTube in 2026, not a low-cost proof. Also, the file's own COPPA finding cuts against H5. Made-for-kids content earns 65 to 85 percent less per sponsored video. A cheap proof that cannot be monetized is not a proof of a business.
- Evidence: E1 lines 166, 244 to 246, 306 to 318. Search results on Dhar Mann (Forbes, June 2026; TheWrap on the Burbank campus). Search results on The Chosen pilot (15 million views, not 20 million).
- What resolves it: Define "prove audience" as a number: households and week 4 return rate. Define "low cost" as a dollar ceiling. Find at least two comparables in scripted family comedy for ages 6 to 14. Include at least one that stopped. Candidates in the files already: Dhar Mann, BYUtv Studio C, Girl Meets World. Downgrade confidence to Medium at most until then.

### R1-05. The cheap proof platform disables the mechanics the block needs (Fork B)
- Severity: HIGH
- File and section: L Section 4 lines 53 to 69; L Section 8 line 127; L Section 9 lines 131 to 139; E1 Section 5.4 line 296. Related: `deliverables/01-gap-memo.html` line 203 rates Option 1 "Best."
- Claim: The gap memo picks Fork B Option 1 as the best path. That option is an owned channel on a video platform plus an owned site. The landscape file is cited as support.
- Attack: The landscape evidence weakens Option 1 more than any other option. On made-for-kids YouTube, the platform disables notifications, comments, live chat, and playlists. It also disables end screens, memberships, and personalized ads (L lines 55 to 69). L line 127 says outright: "the rules disable the host's engagement tools." L line 133 says a weekly reminder "cannot rely on YouTube notifications." Ads are contextual only with bumpers. Sponsorship pays 65 to 85 percent less (E1 line 296). The FTC fined Disney for the "not made for kids" workaround (L line 69). So the fixed night, the host, the reminder, and the revenue all weaken on the platform the memo calls best. The owned site then has to carry the ritual alone, with parent-only accounts and no notification to the child. The file shows no owned family video site that built a weekly habit. The two exceptions have outside funnels: Angel (theatrical, faith community) and Chick-fil-A (restaurants). Option 2 (FAST) is weakened next. FAST loops all day. The platform controls the EPG slot and the promo (L line 135). Kids FAST operators are in receivership or losing money (L lines 34 to 35). Option 4 (sell to a streamer) is weakened as a block sale. "SVOD partners buy batches, not schedules" (L line 135). Option 3 (single sponsor) has one live precedent with no disclosed metrics (L line 85). E1 Section 5.2 holds no US sponsor budget figure. The H5 proof and the H1 ritual need a channel where the mechanics work. The landscape shows no such channel. This is the circularity that decides Phase 1.
- Evidence: L lines 53 to 69, 85, 127, 133, 135. E1 line 296. Gap memo line 203.
- What resolves it: For each Fork B option, list which of the eleven mechanics survive on that channel. Cite L for each. Show the ritual path (reminder, premiere, host, return) for Option 1 without any disabled feature. If no path exists, say so in the gap memo and change the recommendation or its conditions.

### R1-06. The window alignment term cannot rank mechanics, and it carries 40 percent of the score
- Severity: HIGH
- File and section: SM Section 2 lines 19 to 38 and lines 40 to 49; MI `peakYear` fields; MS table lines 8 to 20.
- Claim: "A mechanic has no single release year. It has a peak year... The window arithmetic stays the same."
- Attack: The window term exists to compare properties from different years. Every mechanic here sits inside the same 1993 to 1998 window by construction. The term therefore rewards whichever year the scorer picked, not any property of the mechanic. The peak years are judgment calls with thin support. "Viewer participation" gets peakYear 1998 and the top window score of 100. Its evidence is a 1999 contest and a 2001 countdown (MI line 97). Neither event is in the window. That 100 lifts a mechanic with salience 40 from "Drop" to "Test." Sensitivity checks, run on the MI inputs with the SM arithmetic:
  - Check A. Move "Home base set" peakYear from 1997 to 1995. The couch ran 1992 to 1999, so 1995 is as defensible as 1997. Window falls from 92 to 76. Score = 80 x 0.30 + 76 x 0.40 + 85 x 0.30 = 24.0 + 30.4 + 25.5 = 79.9, rounds to 80. Rank falls from 2 to 5. One year of judgment moves a score 6 points and three ranks.
  - Check B. Set "Fixed night" salience to 75 instead of 92. The 90 to 100 band rests on a Wikipedia-only rating (see R1-07 and R1-10). Score = 75 x 0.30 + 84 x 0.40 + 95 x 0.30 = 22.5 + 33.6 + 28.5 = 84.6, rounds to 85. The only "Reproduce" verdict becomes "Adapt." The core recommendation of the scorecard hangs on one judgment call and one unverified number.
  - Check C. Remove the window term and weight salience and reproducibility 0.50 each. Sonic ID moves from rank 4 to rank 2. Interstitials move from "Test" to "Adapt." Crossover events move from "Adapt" to "Test." Viewer participation scores 48 and drops out.
  - Check D. Move "Viewer participation" peakYear to 1999, the year of the event cited. Window falls from 100 to 92. Score falls from 69 to 65. It drops for v1.
- Evidence: SM lines 21, 40 to 49; MI lines 7, 84, 95 to 97; MS lines 10 to 20. Arithmetic above reproduces `score.mjs`.
- What resolves it: Remove the window term from the mechanic score. Or apply it once at block level as a constant. Re-weight salience and reproducibility with a stated reason. Rerun `score.mjs`. Report which recommendations changed. Log the change as a decision.

### R1-07. Scorecard inputs do not match the evidence they cite
- Severity: HIGH
- File and section: MI lines 7 to 13 (Fixed night); MI lines 29 to 32 (Four slots); MI lines 73 to 76 (Stay up late); MI lines 117 to 120 (Sonic ID); MI lines 95 to 97 (Viewer participation). SM Section 3 rubrics lines 53 to 59.
- Claim: Each input cites E2 sections and the SM rubric bands.
- Attack:
  - Fixed night, salience 92. The rubric's 90 to 100 band needs "named in most retrospective press." The reason cites the 1993 kids 6 to 11 rating "on this bet alone" (MI line 10). That rating is Wikipedia-only (E2 line 53). My search could not confirm it. "On this bet alone" is a causal claim with no source. The peakYear reason lists Fox Kids and Kids' WB as fixed-night blocks (MI line 9). Both were Saturday morning blocks. They support "fixed slot," not "fixed night."
  - Sonic ID, salience 85. The 70 to 89 band needs citation "for at least two blocks." E2 line 209 cites one jingle and calls Nick at Nite's "oldies-radio format" a sonic ID. A programming metaphor is not a sonic ident. One block puts this in the 40 to 69 band. At 60 the score falls from 84 to 77, and the verdict from "Adapt" to "Test."
  - Stay up late, salience 85. The reason says "quoted in most retrospectives" (MI line 76). E2 cites one Laybourne quote (Wikipedia, secondary) and one Looper phrase. Two secondary sources for one block is the 40 to 69 band, not 70 to 100. The reproducibility reason, "Devices remove the parental gate," has no source (MI line 77).
  - Four slots, salience 75. The reason says shows fell after leaving the block (MI line 32). E2 line 16 says Full House posted its best season after leaving the block. The input cites one half of the evidence.
  - Viewer participation, peakYear 1998. Both cited events are outside the window (1999 and 2001). See R1-06.
- Evidence: MI lines cited. E2 lines 16, 53, 205, 209. Search result for the SNICK rating returned no rating.
- What resolves it: Re-score each flagged input against the rubric band its evidence supports. Cite the E2 line for each band choice. Mark any Wikipedia-only support as such in the reason field. Rerun the script.

### R1-08. The market size section does not size the market
- Severity: HIGH
- File and section: E1 Section 5.1 lines 250 to 258; Section 5.2 lines 260 to 271; Section 5.3 lines 273 to 289; E1 Section 7 items 4, 10, 11.
- Claim: Phase 1 step 6 requires "reachable households, sponsor budgets for family content, comparable channel revenues."
- Attack:
  - Reachable households. The file divides 36.9 million children by "1.8 to 2.0 children per family (assumed, not sourced)" (line 258). The divisor is wrong in kind. Families with a child age 6 to 14 also hold children outside that range. The right divisor is children 6 to 14 per family that has one, which is lower. The result is understated by an unknown amount. The even-spread assumption at line 115 is also unsourced. No reach filter (broadband, connected TV, English, willingness) is applied. "Reachable" is never computed.
  - Sponsor budgets. Every ad figure is global, digital-only, or dated 2017 to 2021. The file admits no credible US figure for 2024 or 2025 exists (line 331). The "$17 billion" figure has unclear provenance and is included anyway (line 269). Step 6 is unmet.
  - Comparable revenues. Pluto TV is a 2021 figure. Fox Corp revenue is a parent company. Roku's $4.145 billion is platform revenue, not a channel. Studio71 is a creator network. Cocomelon's $120 million is a 2019 to 2021 WSJ estimate. Ryan's World mixes 2018 and 2025. None is a scheduled family comedy block. No bottom-up estimate (households x plays x CPM) appears anywhere.
- Evidence: E1 lines 115, 258, 269, 271, 277 to 289, 325, 331, 332.
- What resolves it: Pull the CPS age-of-child table for households with a child 6 to 14. Or cite a published figure. Apply a stated reach filter. Build one bottom-up revenue range from the file's own CPM benchmarks and a household range. Drop the parent-company and platform rows from 5.3, or label them as non-comparable. Remove the $17 billion row.

## 3. MEDIUM items

### R1-09. H2 is WEAKENED, yet the scorecard drops nothing
- Severity: MEDIUM
- File and section: E2 Section 1 lines 11 and 16; SM Section 4 lines 83 to 90; MS Summary lines 112 to 117.
- Claim: "Drop for v1: none." Seven of eleven mechanics rank Reproduce or Adapt.
- Attack: E2 concludes "the shows, not the wrapper, set the ceiling." Adams (1997) found block tactics did not lift rating, share, or rank. Search confirmed that finding. The scorer never ingests the H2 verdict. The thresholds (88, 78, 68) are inherited from a property model with no calibration for mechanics. A model that drops nothing does not discriminate.
- Evidence: E2 lines 16, 108. SM lines 85 to 90. MS lines 114 to 117.
- What resolves it: State how the H2 verdict enters the model, or state that it does not and why. Calibrate the bands so at least the bottom quartile drops, or justify why none should.

### R1-10. Wikipedia-only claims carry conclusions
- Severity: MEDIUM
- File and section: E2 lines 43, 51 to 53, 85, 91; E1 line 74.
- Claim: Several load-bearing history facts cite only Wikipedia or a fan wiki.
- Attack: (a) The 1993 kids 6 to 11 rating (E2 line 53) feeds the top scorecard input. My search returned no rating from any source. Wikipedia was blocked. (b) "That harm proved permanent" (E2 line 43) is an editorial judgment from Wikipedia. The H4 demand row uses it as evidence. (c) Disney cut One Saturday Morning hosts "for low ratings" (E2 line 91). Search found only Fandom wikis for this. It feeds the "mixed evidence" on hosts. (d) The CW's Kids' WB reason (E2 line 85) is Wikipedia-only in the file. A Variety article from 2007, "CW turns to 4Kids on Saturdays," exists and should replace it. (e) "No network has run a weekly family sitcom block since" (E1 line 74) is a universal negative. It cites two Wikipedia pages.
- Evidence: Search results as logged in Section 5.
- What resolves it: Replace (d) with the Variety citation. Mark (a), (b), (c), and (e) as unverified in the text. Reduce any score input that depends on them to the band a verified source supports.

### R1-11. H3 is CONFIRMED while its own evidence rejects the 30-year cycle
- Severity: MEDIUM
- File and section: E1 Section 3 lines 98 to 100; lines 120, 137, 151, 158 to 160.
- Claim: "H3. The audience is two generations. CONFIRMED."
- Attack: H3 in the master prompt has three parts. Parents born 1981 to 1992. Children 6 to 14. The 30-year cycle. The file confirms the demographic overlap and then says the cycle "has no controlled evidence" (line 158). Metzger's own data found 23 years, not 30 (line 137). One part of a three-part hypothesis failed. The verdict should be PARTIAL. The birth-year arithmetic uses mean age at first birth. Parents of a 6 to 14 year old often had that child second or third. Fathers are older on average. The parent cohort skews older than the window. The file admits the 1991 to 1992 tail was too young for the blocks (line 151). The real overlap is about 1979 to 1990, not 1981 to 1992. `canon/AUDIENCE.md` already narrowed to 1981 to 1990 without a logged canon decision.
- Evidence: E1 lines 120, 137, 151, 158 to 160. Pew 55 percent figure confirmed by search.
- What resolves it: Split H3 into H3a (demographics) and H3b (cycle). Mark H3b as not supported. Restate the parent birth window with the reason. Log the window change in `DECISIONS.md`.

### R1-12. The 2018 revival is counted as a format failure, but the format was never run
- Severity: MEDIUM
- File and section: E2 Section 1 line 11 ("Branding without hits failed twice"); E2 Section 3.3 lines 151 to 166; E2 line 16.
- Claim: The 2018 revival is evidence that mechanics without hits fail.
- Attack: E2's own cause table says ABC spent nothing on hosts or interstitials. The brand got "minimal on-air support" (lines 165 to 166). Three shows filled four slots, one a game show. So 2018 tested a label, not the mechanics. It cannot count as evidence for or against H2. It can count as evidence that a label alone fails. The file uses it both ways.
- Evidence: E2 lines 155, 157, 165, 166. Deadline 2018 ratings confirmed by search.
- What resolves it: Reclassify 2018 as "label only, mechanics untested" in the H2 reasoning. Remove it from the "failed twice" sentence or qualify it.

### R1-13. The co-viewing measurement change is read as a demand signal
- Severity: MEDIUM
- File and section: E1 Section 2 item 3 line 30.
- Claim: "The change signals that advertisers now price shared viewing."
- Attack: Search shows the Nielsen change came from a sports pilot (Super Bowl LX) and lifted sports figures 4.2 percent. It is a wearable methodology fix. Nothing in the excerpts says advertisers price family co-viewing. Also, the 47 percent figure is an average. Nielsen's split is 47 percent on streaming and 34 percent on linear. The file omits the split.
- Evidence: Search results (Nielsen pilot release, Sports Media Watch, Sportico, The Media Leader).
- What resolves it: Remove the inference or cite a source that states it. Add the streaming versus linear split.

### R1-14. Comparable "first audience signal" cells are not signals
- Severity: MEDIUM
- File and section: E1 Section 6 lines 306 to 318.
- Claim: "Audience signal came before capital in each case."
- Attack: Several cells describe no measurable signal. Blippi: "Nephew-age viewers on YouTube." Cocomelon: "Growth after 2018 rebrand," twelve years after start. Smosh: "Early YouTube popularity." Studio71: "Aggregated creator views." Dropout's signal (subscribers doubled in 2023) came three years after purchase. The claim "in each case" is not supported by the table.
- Evidence: E1 lines 309, 310, 314, 316, 318.
- What resolves it: Put a number and a date in every "first audience signal" cell, or remove the row.

### R1-15. Downstream files already inherit the low-confidence numbers as facts
- Severity: MEDIUM
- File and section: `canon/AUDIENCE.md` Section 1 and 2; `deliverables/01-gap-memo.html` lines 63, 71, 75, 135, 203.
- Claim: Canon and the gap memo restate E1 and L conclusions.
- Attack: Three things are now in canon and the fork memo. The 18 to 21 million household estimate. The "no one programs a family night" claim. The H1 and H5 verdicts. The gap memo says "Neither kill hypothesis failed." Every HIGH item above flows through.
- Evidence: AUDIENCE.md lines cited. Gap memo lines cited.
- What resolves it: After the HIGH items are answered, regenerate AUDIENCE.md and the gap memo from the corrected files. Do not patch them in place.

## 4. LOW items

### R1-16. The Chosen pilot view count is wrong
- Severity: LOW
- File and section: E1 line 192 and line 312.
- Claim: "A concept pilot posted in late 2017 drew 20 million views."
- Attack: Sources returned by search say 15 million.
- Evidence: Washington Times 2019, Fox News 2019, NCF story.
- What resolves it: Correct to 15 million, or cite a source for 20 million.

### R1-17. Tubi revenue understated
- Severity: LOW
- File and section: E1 line 278.
- Claim: "About $1 billion revenue in fiscal 2025."
- Attack: Fox's own filing says over $1.1 billion. Minor, but the file rounds down.
- Evidence: Fox Corp 8-K excerpt via search.
- What resolves it: Use the filed figure.

### R1-18. "Over 90 percent of US parents co-view" overstates the survey
- Severity: LOW
- File and section: E1 line 34; `canon/AUDIENCE.md` Section 1.
- Claim: "Over 90% of US parents co-view with their children."
- Attack: The survey covered 2,000 children ages 2 to 12. The 94 percent figures are for ages 2 to 5 and 6 to 9. The file does not report the 10 to 12 rate, which is the harder half of the target range.
- Evidence: MediaPost and Precise TV excerpts.
- What resolves it: Report the rate by age band, including 10 to 12. Note that ages 13 to 14 are outside the survey.

### R1-19. Studio71 is not a comparable
- Severity: LOW
- File and section: E1 lines 213 to 215, 288, 318.
- Claim: Listed among "ten comparable cases" of small studios.
- Attack: It is a creator network owned by a European broadcaster from 2015. It proves nothing about a small studio proving audience.
- Evidence: E1's own description.
- What resolves it: Remove it from Section 6 and the H5 count.

### R1-20. Reproducibility for "Shared hosts" ignores the file's own platform finding
- Severity: LOW
- File and section: MI line 44; L line 127.
- Claim: Reproducibility 85 because "creator-hosted intros are standard on video platforms."
- Attack: L line 127 says made-for-kids rules disable the host's engagement tools. The rubric's 40 to 69 band covers "a feature the platform does not offer to made-for-kids content." The input should sit lower. Or the reason should say why not.
- Evidence: SM line 65; L line 127.
- What resolves it: Reconcile the input with L, or state that hosting works without engagement tools and why.

### R1-21. Comparable revenue years are stale and mixed
- Severity: LOW
- File and section: E1 Section 5.3 lines 277, 283 to 286.
- Claim: Table presents figures from 2018, 2019 to 2021, 2021, 2022, 2023, and 2025 side by side.
- Attack: Pluto TV has no public figure after 2021. Cocomelon's figure predates the Netflix loss and the 2024 cuts. Comparing 2018 and 2025 in one row invites a false trend.
- Evidence: E1 lines cited; E1 Section 7 items 8 and 9.
- What resolves it: Add a "year" column and a "stale" flag, or drop rows older than 2023.

### R1-22. The Angel comparison mixes model and audience
- Severity: LOW
- File and section: L Section 7 line 98; L Section 1 line 9.
- Claim: Angel Studios is "the closest structural model."
- Attack: The figure is confirmed (2.61 million paying members, 2.85 million by July 31). But Angel's members came through a theatrical hit and a faith community. The file does not say which part of the model transfers to a kids comedy block with no theatrical funnel.
- Evidence: Business Wire Q2 2026 release via search.
- What resolves it: State which Angel mechanic transfers and which does not.

## 5. Spot-check log

Result key: CONFIRMED means a search excerpt from the cited or an equivalent source supports the claim. PARTIAL means the number or wording differs. NOT CONFIRMED means no source in search supported it. BLOCKED means the fetch could not run.

| # | Claim (file, line) | Source cited | Result |
|---|---|---|---|
| 1 | Americans co-view 47 percent of the time (E1 27) | Nielsen 2024 | CONFIRMED. Split is 47 percent streaming, 34 percent linear. File omits split. |
| 2 | Nielsen changed co-viewing measurement for 2026 to 2027 (E1 30) | Variety, Soap Opera Network | CONFIRMED as a methodology change effective August 31, 2026. "Advertisers now price shared viewing" is not in the sources. |
| 3 | Pluto TV passed $1 billion in 2021 (E1 277) | Deadline 2021 | CONFIRMED. |
| 4 | Made-for-kids earns 65 to 85 percent less per sponsored video (E1 296) | OutlierKit | CONFIRMED as a vendor claim. Another vendor (TrySpansa) repeats the range. No audited source. |
| 5 | Angel Guild 2.61 million paying members Q2 2026 (L 98) | Business Wire | CONFIRMED. 2.85 million by July 31, 2026. |
| 6 | Adams 1997: block tactics raised renewals, not ratings (E2 108) | JMCQ 1997 | CONFIRMED. |
| 7 | Nickelodeon led kids 6 to 11 on Saturday nights, 6.4 versus Fox 5.5 (E2 53; MI 10) | Wikipedia only | NOT CONFIRMED. Wikipedia fetch BLOCKED. Search returned no rating from any source. |
| 8 | Laybourne expected 650,000 to one million viewers (E2 52) | Wikipedia only | BLOCKED. Not found in search. |
| 9 | Family Matters averaged over 20 million viewers in its first five seasons (E1 146) | WCPO, Looper | CONFIRMED by secondary excerpts (Screen Rant, WCPO). |
| 10 | Nick at Nite prime time rose 60 percent, 1.0 to 1.6 (E2 102; MI 53) | Variety 1995 | CONFIRMED. |
| 11 | Disney+ GroupWatch removed September 2023 (L 16, 23) | TechRadar | CONFIRMED. September 18, 2023. |
| 12 | 33.3 million families with own children under 18 in 2024 (E1 104) | FRED, Census FM-1 | CONFIRMED. 33,313 thousand. |
| 13 | CW ended Kids' WB citing ad limits and cable competition (E2 85) | Wikipedia only | PARTIAL. Wording matches Wikipedia. A Variety 2007 article exists and is not cited. |
| 14 | Universal Kids averaged 20,000 prime time viewers (L 79) | Variety 2025 | CONFIRMED. |
| 15 | Tubi about $1 billion revenue FY2025 (E1 278) | Media Play News, The Desk | PARTIAL. Fox filing says over $1.1 billion. |
| 16 | 55 percent of Millennial women had given birth by 2018; Gen X 62 percent (E1 122) | Pew 2020 | CONFIRMED. |
| 17 | Disney cut One Saturday Morning hosts in 2000 for low ratings (E2 91; MI 43) | Wikipedia | PARTIAL. Only Fandom wikis surfaced. No trade source. |
| 18 | "Nothing found matches 'family night' as a product" (L 116) | Nine searches listed | NOT CONFIRMED. PBS KIDS Family Night runs every Friday 7 to 9 p.m. with weekend repeats. |
| 19 | No values network runs weekly family comedy (L 120; L Section 7) | Landscape tables | NOT CONFIRMED. BYUtv streams free weekly family sketch comedy with a studio audience. |
| 20 | Fuller House, Girl Meets World, That '90s Show absent as revival tests (L 7, E1 H3) | None | Omission CONFIRMED. All three canceled. Girl Meets World fell from 5.16 million to 1.5 million. |
| 21 | Kartoon Studios $39.35 million revenue, $24.7 million net loss (E1 281; L 34) | Form 10-K | CONFIRMED. |
| 22 | 2018 relaunch: FOTB 0.6 and 2.9 million; Speechless 0.5 and 2.5 million; Child Support 0.4 and 2.1 million (E2 156) | Deadline 2018 | CONFIRMED. |
| 23 | Lions versus Vikings averaged 27.5 million (E1 52) | NFL.com, SMW, Deadline | CONFIRMED. |
| 24 | Kids Industries: 73 percent co-view at least half the time (E1 38) | Advanced Television, Kidscreen | CONFIRMED. |
| 25 | The Chosen pilot drew 20 million views (E1 192) | PR Newswire, Faith Driven Investor | PARTIAL. Sources say 15 million. |
| 26 | Dhar Mann about $65 million revenue, about 200 staff (E1 188) | Forbes June 2026 | CONFIRMED. |
| 27 | Nick at Nite runs every night at 8p/7c (E1 67) | nickatnite.com | CONFIRMED by title excerpt. Lineup not verified. |
| 28 | Precise TV: 94 percent co-view for ages 2 to 5 and 6 to 9; daily 44 percent (E1 34) | MediaPost | CONFIRMED. Sample was 2,000 children ages 2 to 12. |
| 29 | Netflix kids programming nearly 22 percent of views in 2025 (L 15) | Netflix Tudum | CONFIRMED by excerpt. |
| 30 | Wikipedia "SNICK" page, all claims (E2 Section 2.2) | Wikipedia | BLOCKED. Proxy refused en.wikipedia.org. Every Wikipedia-only item in E2 remains unverified. |

## 6. Constraint violations found

| # | Constraint | File and line | Finding |
|---|---|---|---|
| C-1 | "Cite a source for every market claim. No source means no claim." | E1 line 258 | "1.8 to 2.0 children per family (assumed, not sourced)." The number then reaches `canon/AUDIENCE.md` Section 1. |
| C-2 | Same rule | E1 line 115 | "Assumption: even spread across single years." No source. Drives the 36.9 million figure. |
| C-3 | Same rule | E1 line 269 | "$17 billion" row kept with "provenance unclear." The rule says no claim. |
| C-4 | Same rule | MI line 10 and line 77 | "On this bet alone" and "Devices remove the parental gate" are causal claims with no source. Both drive score inputs. |
| C-5 | "Reference old blocks only in internal research files" | `deliverables/01-gap-memo.html` line 227 | A human-facing deliverable carries the block trademark inside a cited article title. The six files under attack are internal research files, so their use is analysis and passes. The deliverable is not an internal research file. Orchestrator should decide whether a citation title counts. |

Checks that passed:
- Em dashes: none found in any of the six files or the gap memo.
- Time or day estimates: none found. The effort labels in MI ("light weekly work") describe recurring load, not a schedule.
- Borrowed expression: E2 quotes a jingle lyric and names props and characters. All uses are analysis inside an internal research file. MI and MS describe them only to warn against reuse.
- Trademarks in the six files: E1, E2, and L use both trademarks as analysis. SM, MI, and MS use neither.
