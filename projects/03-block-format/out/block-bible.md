# Block Bible

Project Porchlight, Phase 3. Agent: format-architect. Prepared 2026-09-19.

Scope. This bible designs the block as a product that works at trailer stage (v1, decision D-013) and scales to full episodes without a redesign. It uses only mechanics the scorecard allows (`projects/01-market/out/mechanics-scorecard.md`, revision 2). Every mechanic below names its scorecard row. Every set, character, sound, and line is original expression. The brand name is not set (Fork D). This file writes `[BRAND]` where the name goes. Old blocks appear only as analysis, cited by item number in `projects/01-market/out/evidence-h2-h4-history.md` (E2), `evidence-h1-h3-h5.md` (E1), and `landscape.md` (L).

Traceability key. Each mechanic carries a tag: [SC-1] fixed night, [SC-2] home base set, [SC-3] four slots, [SC-4] interstitials and bumpers, [SC-5] seasonal stunts, [SC-6] sonic ID, [SC-7] fixed time, [SC-8] shared hosts (Test), [SC-9] crossover events (Test). [SC-10] stay-up-late feeling and [SC-11] viewer participation are dropped for v1 and appear only where this file says what replaces them.

---

## 1. The block in one paragraph

On the fixed night a family opens `[BRAND]` and sees a printed listings grid, the kind that came folded inside a newspaper. One channel. One night filled in. They press the night. A front porch appears at dusk. A pull chain clicks, a brass lamp comes on, and four notes play. The host steps onto the porch, pulls a hand-lettered card from the mailbox, and reads tonight's four shows in order. The host opens the screen door and the first show begins. Between shows the family comes back to the porch for a short bit, a game with no equipment, or a look at what is next. The fourth show starts with the lamp going off and the host lighting a hand-crank lantern. When it ends, the lamp comes back on, the host asks the household one question to talk about, says goodnight, and puts next week's card in the mailbox. At trailer stage the same porch, lamp, card, and host wrap four trailers instead of four episodes. Nothing on the porch ever asks a child to do anything.

Source for the shape: E2 section 4 mechanics table rows for fixed night, four slots, shared hosts, interstitials, home base set, and sonic ID. The scorecard ranks them 1, 3, 8, 4, 2, and 6.

---

## 2. The fixed night [SC-1, Reproduce] with a fixed time [SC-7, Adapt]

### Choice: Friday

The block premieres every Friday. The premiere goes live at one clock time that the owner sets once and never moves. The clock time is a single config constant in the site (`PREMIERE_TIME`). This bible does not pick the hour. The guide prints it.

### The case

1. Friday is the night the parent persona remembers. The 1990s Friday family block ran four half-hour sitcoms with a hosted wrap, and retrospectives name the night as a defining feature (E2 section 2.1 items 3 and 4; scorecard row 1 reasons). The Porch Parent was born 1981 to 1990 and was age 3 to 17 across the window (`canon/AUDIENCE.md` section 2). The memory the block sells is a Friday memory.
2. A public broadcaster already programs a family night on Friday, with encores on Saturday and Sunday evenings, and has done so since 2017 (L section 5, source S87; E1 section 2 revision note). That is proof a family audience accepts Friday as "family night." It is not a competitor for this block: it has no hosts, no original comedy, and no 6 to 14 target. Its encore pattern is copied here as a mechanic, not as expression.
3. Friday's "death slot" reputation concerns the wrong audience. The evidence says young adults went out on Fridays, and only 25.9 percent of adults 18 to 49 watched TV on one 2016 Friday night (E2 section 3.1 items 11 and 12). Families with children age 6 to 14 are a different unit. Broadcast networks retreating from Friday leaves less competition for the household screen on that night. This is an inference from the cited items, not a measured fact.
4. School-week rhythm. Assumption, not sourced: Friday is the last school day for most US households, so the household can sit for a full block without a school morning next. No file in `projects/01-market/out/` measures this. The demand smoke test (D-009) and the week 4 return rate (D-013) are where this assumption gets tested.
5. Lead-in effects survive only inside one sitting (Webster 2006, E2 section 2.10 item 3; scorecard row 7). A single night with all four slots in one sitting keeps that effect. Spreading slots across nights would lose it.

### Risk on Friday

The late 1990s decline of the Friday family block is attributed in part to Friday social outings among tweens and teens (E2 section 2.1 item 19, secondary source). The block answers this with an on-demand encore all weekend, so a 13-year-old who is out on Friday can still watch with the household on Saturday. The household return rate counts any play inside the encore window as a return.

### Runner-up: Saturday

Saturday was the night of the 1990s kids' network block, built on the bet that kids age 6 to 14 were "too young to be out on the town and too old to be in bed by eight" (E2 section 2.2 items 1 and 3, secondary source). That premise fits the Stay-Up Kid. It loses to Friday for three reasons. First, the premise rests on the stay-up-late feeling, which the scorecard drops for v1 (row 10). Second, the parent persona's family sitcom memory is a Friday memory, and the family sitcom is the Anchor slot. Third, the public broadcaster's pattern already trains families to expect Friday premieres and weekend encores. Saturday stays in the design as the first encore night.

Sunday is noted and rejected. A kids' network used Sunday night as a tween "destination" (E2 section 2.2 item 10). Sunday leads into a school morning for both generations, and the encore window would collapse to one day.

### What the fixed time means on an owned site

On demand dilutes the fixed time (E2 section 4 row 2; scorecard row 7 reproducibility 70). So the fixed time does three narrow jobs. The premiere unlocks at that clock time and not before. The parent email lands the morning of the fixed night, with the clock time in the subject. The listings grid prints the clock time in the fixed night row. Nothing else depends on the hour.

---

## 3. Slot architecture [SC-3, Adapt]

Four slots, in a fixed order, in one sitting. The labels are glossary terms and do not change. The starting hypothesis in `canon/CANON.md` section 2 is confirmed with the run times, trailer lengths, and rules below.

Total full-episode block: about 74 minutes of shows plus up to 8 minutes of connective tissue. Total trailer-stage block: about 6 minutes of trailers plus about 2 minutes of wrap. Both fit one sitting for a 6-year-old.

### Slot 1. Anchor

| Field | Value |
|---|---|
| Format | Multi-generation family sitcom. |
| Full-episode run time | 22 minutes. |
| v1 trailer length | 90 seconds. |
| Tone band | Warm and fast. The whole house is in on the joke. Nobody on screen is the fool for a full episode. |
| Age lean | Both generations. Tilts to the parent. |
| Must give the parent | One laugh per scene at the parent's own life: the house, the job, the group chat, the school form, written without contempt. A parent character who is competent and still funny. |
| Must give the child | A kid character who is right at least once per episode and wins on their own logic. A running bit the child can repeat at school. |
| Must-not list that bites hardest | Soft 2 (child sarcasm to a parent lands as affection). Soft 5 (screen time inside the story is neutral, never a "kids these days" punchline). Soft 6 (no family shape is a joke). Soft 7 (ordinary food, no diet talk). Hard 8 (no real-world hate, politics, or religion as a target). |

### Slot 2. Hangout

| Field | Value |
|---|---|
| Format | Tween and teen ensemble comedy. |
| Full-episode run time | 22 minutes. |
| v1 trailer length | 90 seconds. |
| Tone band | Quick, loud, loyal. Friends against the afternoon. Competence humor: these kids are good at something odd. |
| Age lean | 10 to 14. Watchable by 6 to 9. |
| Must give the parent | Recognition of their own tween years through situation, never through a reference to any 1990s show. One adult character who is neither clueless nor the enemy. |
| Must give the child | Characters to talk about at school. A group the child would want to join. One running bit per episode. |
| Must-not list that bites hardest | Hard 1 (romance stops at a first crush or a hand hold). Hard 5 (no bullying that the story rewards or leaves unanswered). Soft 3 (body jokes stay at gross, never shame). Soft 2 (sarcasm to adults lands as affection). |

### Slot 3. Wildcard

| Field | Value |
|---|---|
| Format | Sketch, variety, or odd animated comedy. Two or three segments per episode. |
| Full-episode run time | 12 minutes. |
| v1 trailer length | 60 to 75 seconds. |
| Tone band | Silly, absurd, structure-breaking. The one slot allowed to break its own frame. |
| Age lean | 6 to 9 for the first laugh. The parent for the absurd logic underneath. |
| Must give the parent | One bit that is clever on a second viewing. A premise that escalates by rule. |
| Must give the child | Physical and visual comedy. Repetition with variation. Something to imitate in the living room. |
| Must-not list that bites hardest | Hard 12 (sketch parody of an existing show is copied expression; parody targets must be generic types, never a named show). Hard 3 (no substitute words that read as profanity). Hard 8. Soft 8 (no sudden loud effect above the dialogue peak). Soft 9 (no strobe faster than 3 flashes per second). |

### Slot 4. Lights Out

| Field | Value |
|---|---|
| Format | Mild spooky anthology. One story per episode. A different corner of the block's town each week. |
| Full-episode run time | 18 minutes. |
| v1 trailer length | 90 to 120 seconds. |
| Tone band | Hush, then relief. A little scared, then a laugh. The scare is always a misunderstanding, a prank, a creature that turns out to be shy, or a rule the characters got wrong. |
| Age lean | 10 to 14. Safe for 6 to 9 by design, because the landing is always visible before the end. |
| Must give the parent | The campfire-story pleasure: a twist the parent sees coming and enjoys anyway. A last line worth repeating. |
| Must give the child | The reward slot. Permission to be scared with a parent in the room. The safe landing every time. |
| Must-not list that bites hardest | Hard 7 (no gore, no jump scares with real threat, no possession, no self-harm). Hard 6 (no children in unsupervised danger played for laughs; an adult or an older sibling is always reachable in the story). Hard 2. Soft 1 (the scare resolves with safety and humor before the end). Soft 8 and Soft 9. |

### Slot order rule

The order never changes: Anchor, Hangout, Wildcard, Lights Out. The order is the lead-in (scorecard row 7 reasons). The broadest show carries the household in. The scare comes last so the lamp-off ritual has meaning and so a 6-year-old who is done can leave before it. The label "Lights Out" stays. The stay-up-late framing is dropped from all v1 copy [SC-10 dropped]. No page, bumper, email, or host line says "stay up," "bedtime," or "past your bedtime."

### The single lead show case

The gap memo (section 10, Phase 3) requires a wrapper that works with one lead show and scales to four. It does. If only the Anchor has full episodes, the block runs Anchor full episode, Hangout trailer, Wildcard short, Lights Out trailer, with the same porch wrap. The grid marks the three others "coming to this slot." The slot order and the lamp ritual do not change.

---

## 4. Connective tissue for v1 (trailer stage)

### 4.1 The host [SC-8, Test]

Concept. One adult host who keeps the porch. The host is an original character with a light persona, not a broad one. Working title for the role: the Porch Host. The character's name and casting come in Phase 4 with the slate. The host is not a cast member of any show. The host lives on the porch and treats each show as a house on the street.

Rules that make the host work with no child on camera and no child data.

1. The host addresses the household in the second person plural. "All of you." Never "kids." Never a child by name.
2. No child appears on the porch. No viewer video, mail, drawing, or name is ever read or shown. [SC-11 dropped.]
3. Every host line is a recorded wrap. No live segment. No chat. No poll. No "tell us." The host never asks a question that needs an answer online (STANDARDS hard 10).
4. The host may ask a question the household answers out loud in the room. That is a ritual, not participation. It generates no data.
5. The host never enters a show's story. The host does not appear inside any episode or trailer.
6. Performance. If a human performs the host, a talent agreement is counsel gate CG-04. If the host is AI-assisted under D-014, counsel gate CG-03 blocks public release until disclosure is signed off. The host design does not depend on which path the owner picks.
7. Test status. Hosts are a Test mechanic (scorecard row 8, mixed evidence: E2 section 2.1 item 5 and section 2.7 item 3). At trailer stage the site records sign-on plays against trailer plays. If households skip the sign-on at a high rate, the full-episode stage cuts the host to bumpers only. The measurement is in section 9.

What the host does at trailer stage.

- The Sign-On. One recorded wrap of about 30 seconds on the fixed night row of the grid. The lamp clicks on. The host pulls the card from the mailbox and reads the four shows, one line each, in slot order. The host opens the screen door.
- The Porch Intro. One 8-second bumper per show (section 4.3). The host says the show's name and one line.
- The Host's Note. A mid-week page and parent email, text with an optional 20-second clip. It carries the week's conversation prompt and next fixed night's card. It is parent-facing and lives outside any made-for-kids surface (L section 9).

### 4.2 The home base [SC-2, Adapt]

Concept. A front porch at dusk. The porch is a threshold, the place a family gathers before going in. It is not a couch, a bed, a stage, a desk, or any seating object. The scorecard flags expression risk 60 on this row because the mechanic is known through one old block's prop. The porch shares nothing with it.

Description for an artist.

- Camera. Seen from the front walk, slightly low, so the porch floor is at chest height. Blue hour. The sky is deep blue with one streak of orange at the bottom.
- Structure. A wooden porch, three steps up. A railing with turned spindles runs along the left side only. The right side is open. The porch ceiling is painted pale blue.
- Door. A screen door, center right, on a visible spring. Behind it a solid door stands open, so the screen door is the only thing between the porch and the inside. The screen door is painted one saturated color. Default: deep green. The brand agent may change it.
- Window. Left of the door. A curtain is drawn. Warm light glows through it. The shows live "inside." The audience never sees inside from the porch.
- Lamp. A brass lamp with a frosted glass shade hangs from the ceiling on a short chain, above and left of the door. A pull chain with a wooden bead hangs from it. This lamp is the block's visual identity. On means the block is live.
- Mailbox. A tin mailbox on the post at the top of the steps, with a red flag. The flag is up when a new card is inside. The host pulls the week's card from it.
- Card. A hand-lettered index card with the four shows in order. It is the same card that appears printed in the ritual kit.
- Crate. A wooden milk crate on the top step, on its side, holding a small radio, a jar of pencils, and a stack of cards. The host sets things on it. Nobody sits on it.
- Doormat. Coir. The brand word woven in. Placeholder until Fork D.
- Moths. Small moths drift toward the lamp. One is drawn rounder and fuzzier than the rest and always lands on the shade. This is the Moth, the block's animated ident figure. The Moth has no lines at v1. It reacts. It is not a co-host.
- Beyond. The dark street, one streetlamp, and the low silhouette of the block's town, where all four shows are set. A few windows are lit. During Lights Out, one window that was dark is now lit.
- Lights Out state. The lamp is off. The host holds a hand-crank lantern with a green glass. The curtain glow drops to a faint line. The Moth sleeps on the shade. The streetlamp hums.

Palette. Night blue, warm amber, the door color, and the red of the mailbox flag. Nothing orange except the sky streak.

Dependency on the brand. The porch concept was designed under the codename. It works under any name because the object is the lamp and the threshold, not the word "porch." If Fork D produces a name that fights the image, the fallback is the same threshold logic with a different object: a garage with the door half up and a work light on a hook. The lamp, the card, the mailbox, and the Moth transfer unchanged.

### 4.3 Bumpers [SC-4, Adapt]

Two lengths. Both original. Both silent about any child.

The 3-second bumper (the Click).
1. Black. The pull-chain click.
2. The lamp comes on, framed tight on the shade. Four notes.
3. The `[BRAND]` word appears on the doormat below the frame. Cut.
Used out of every slot, on the sign-off, and as the pre-roll on any mirrored video platform clip.

The 8-second bumper (the Porch Intro).
1. The porch at blue hour, wide. The Moth drifts in.
2. The pull-chain click. The lamp comes on in the slot's color. Four notes.
3. The mailbox flag drops. The slot label appears on the mailbox in hand lettering.
4. The host, in frame from the shoulders up, says the show's name and one line.
5. The screen door swings open toward camera. Cut to the show.
Used into every slot.

Lamp color by slot. Anchor: warm amber. Hangout: a string of small multicolor bulbs lights up along the railing beside the lamp. Wildcard: the lamp flickers through three colors and settles on one at random each week. Lights Out: the lamp does not come on. The lantern does. The four notes play slow and low.

### 4.4 Sonic ID [SC-6, Adapt]

Concept. A click, then four notes. The click is a real pull-chain sound, recorded, not synthesized. The four notes are played on a plucked instrument with a soft attack (nylon-string guitar or kalimba). The figure rises and ends unresolved on the way in. It resolves on the way out. No lyric at v1. The scorecard flags expression risk 55 on this row because the known example is a jingle with a lyric. A wordless figure shares nothing with it. Compose once. Total length under 2 seconds. Owner effort 5.

Variants.
- In (unresolved): rising four notes.
- Out (resolved): same four notes, last note resolved down.
- Lights Out (in): same notes, slowed, an octave lower, ending on the click of the lamp going off.
- Sign-off: the out variant, then the lamp click, then silence.

Cue points.
1. The Sign-On, when the lamp comes on.
2. Into each slot, inside the 8-second bumper.
3. Out of each slot, inside the 3-second bumper.
4. The sign-off, after the host's goodnight.
5. Printed: the ritual kit card carries a drawing of the lamp with four dots under it. A parent who hums it is the whole point.

Sound rule. The click and the four notes never exceed the dialogue peak (STANDARDS soft 8).

### 4.5 How these appear on the trailer site

- The grid is the home page. The fixed night row is highlighted. Its four cells are the four slots in order. A fifth thin cell at the start of the row is the Sign-On.
- Pressing the Sign-On plays the host's 30-second wrap, then lands on the first slot cell.
- Pressing a slot cell plays, in one continuous player: the 8-second Porch Intro, the trailer, the 3-second Click. The parent-only vote appears after the Click, never over the trailer.
- The porch is the player's background frame. The video sits inside the "window" of the porch art when the page is wide, and full-bleed when narrow.
- The Host's Note has its own row in the grid on a mid-week day and is also sent as the parent email.
- The ritual kit is a printable single page linked from the day before the fixed night.
- No page carries comments, chat, a child login, or personalized ads (STANDARDS section 4). Every page states that the account holder is a parent.

---

## 5. Connective tissue for full-episode stage

### 5.1 Interstitials [SC-4, Adapt]

Six recurring formats. Each is short, cheap, and produced from a template. Each runs at the porch unless noted. None involves a child on camera or any viewer submission.

1. The Sign-On. About 45 seconds. Lamp on. The host reads the card. One line per show. The screen door opens into the Anchor.
2. The Screen Door. About 20 seconds. Between slots. The host opens the screen door and we hear the first line of the next show through it before we cut. A pure handoff.
3. Porch Games. About 60 seconds. Between Hangout and Wildcard. A game the household plays in the room with no equipment and no prize. Examples: freeze when the lamp flickers; say the next show's name in a whisper, then a shout; guess which lamp color Wildcard will land on. Nothing is sent anywhere. This is a ritual, not participation [SC-11 dropped].
4. The Moth Short. 30 to 45 seconds. Silent comedy with the Moth and the lamp. Wildcard-adjacent. Runs before Wildcard or as filler on the encore. Can be mirrored on a video platform as a standalone clip.
5. The Lantern. About 20 seconds. The host turns the lamp off, lights the lantern, and says one line about tonight's Lights Out. The 6 to 9 household gets a clear exit cue here.
6. The After Porch. About 60 seconds. Lamp back on. The host asks the household the week's one question (STANDARDS soft 4), says goodnight, and puts next week's card in the mailbox with the flag up. The Next Week's Light tease, 15 seconds, is inside this segment.

### 5.2 Crossover rules [SC-9, Test]

Crossovers are a Test mechanic (scorecard row 9). They need multiple shows with shared talent and carry high effort in crossover weeks. These rules keep them rare and safe.

When a crossover is allowed.
1. Only after each show involved has played a full season of its own episodes on the block.
2. Only inside a stunt week (section 5.3). Never in an ordinary week.
3. At most two crossovers per season across the whole block.
4. Both showrunners sign the crossover page. The character keeps the rules of its home show in the visiting show.
5. All four shows are set in the same town. Setting may cross freely at any time: a street, a shop, a school, a weather event. A character crossing is what the rules above govern.

What never crosses.
1. Lights Out characters and creatures never enter Anchor, Hangout, or Wildcard. The scare stays in slot 4 so the first three slots stay fear-free for a 6-year-old. Anchor, Hangout, and Wildcard characters may appear in a Lights Out story, because the safe landing rule applies there.
2. The host never enters any show's story. The Moth may appear as a silent background gag in any show's bumper, never inside an episode.
3. Wildcard sketch performers never play their sketch characters inside Anchor or Hangout plots.
4. No sponsor, product, or label crosses into any story (STANDARDS hard 9).
5. No character from any existing show, ever (STANDARDS hard 12).

Measurement. A crossover week is compared with the ordinary week before it on household return and slot completion. If two crossovers show no lift, the mechanic drops to setting-only.

### 5.3 Seasonal stunts [SC-5, Adapt]

Four per season. Each changes the block for one night. Each is a structure with a new theme every year, so expression risk stays low (scorecard row 5).

1. Lamp On. The season premiere night. All four shows premiere. The Sign-On runs long, about 3 minutes, and the host walks the street and points at each show's house. The ritual kit ships a "welcome mat" edition with a four-week card the family fills in.
2. The Long Dusk. The autumn spooky night. Lights Out runs a double, two stories. Each of the other three shows plays an episode set at night in the town. The lamp is off for the whole block and the lantern carries every interstitial. Every scare still lands safe (STANDARDS soft 1).
3. Snow Night. The midwinter night. One snow day hits the whole town. All four shows play a snow-day episode. This is a setting crossover, not a character crossover, so it is allowed for every show at any age of the slate. The porch is snowed in. The Moth wears a scarf.
4. Whole Street Night. The season finale. This is the one sanctioned character crossover window if the slate qualifies under 5.2. The card has one long line instead of four. The host's After Porch turns the lamp off for the season and says the encore window is open.

Summer. The Rerun Window. The fixed night carries a rerun of the season in an order the host picks. No new production. The Moth Short can mirror on a video platform to keep the discovery feed warm (L section 9 and gap memo section 9).

### 5.4 Event calendar by phase

No dates. No durations. Each phase begins when the one before it closes.

| Phase | Block state | Events |
|---|---|---|
| T1. Trailer launch | Four trailers, porch wrap, listings grid | Lamp On at trailer scale: the Sign-On plus the first premiere. See section 9 for release cadence. |
| T2. Trailer run | Weekly fixed night with a new premiere or encore each week | The Host's Note weekly. Ritual kit weekly. Votes and sign-ups counted against D-013 lines. |
| T3. Develop-further call | Metrics against the D-013 line | Shows that pass go to full episodes. Shows that fail stay as trailers or leave the grid. |
| F1. Lead show block | One full show plus three trailers or shorts | Lamp On for the lead show. Interstitials 1, 2, 5, 6 live. Host test measured. |
| F2. Two to four shows | Full block | Interstitials 3 and 4 added. First Long Dusk. First Snow Night. |
| F3. First full season | Full block plus stunts | Whole Street Night without a character crossover. Rerun Window. |
| F4. Second season | Full block plus stunts plus crossovers if qualified | First character crossover on Whole Street Night, if the 5.2 rules are met. |

---

## 6. The guide as a format

### 6.1 What the site is

The site is a listings grid in the style of a folded paper guide from the window years. Paper stock texture, a tight serif for the listings, a boxed "close-up" for the featured item, and a channel column on the left. That look is generic to printed listings and is not the expression of any one publication or show. The site never uses the name of any listings magazine.

### 6.2 The channel, honestly

There is one channel: `[BRAND]`. The grid does not fake other networks, other channels, or other listings. The left column has one channel row. The top row has the seven weekdays. Under the fixed night, the cell is full: four time bands in slot order, each a cell, plus the thin Sign-On cell. Under the other six days, the cells carry three kinds of item and nothing else.

| Day | Cell | Content | Stage |
|---|---|---|---|
| Fixed night (Friday) | Sign-On, Anchor, Hangout, Wildcard, Lights Out | The premiere. Trailer at v1. Full episode later. | Both |
| Saturday | Encore | The same block again, on demand. Counts as a return. | Both |
| Sunday | Encore | Same. Last encore cell. | Both |
| Monday | Rerun | Any past block or trailer, on demand. At v1 the four trailers. | Both |
| Tuesday | Rerun and the Moth Short | Rerun cell, plus one Moth Short at full-episode stage. | Full |
| Wednesday | The Host's Note | Text and optional clip. Conversation prompt. Next week's card. | Both |
| Thursday | Ritual kit | Printable one page for tomorrow night. | Both |

Copy in the grid header: "One channel. One night. The rest of the week is the porch light left on." The header is a placeholder until the brand agent writes it.

### 6.3 Guide conventions that become navigation

- Premiere marker. A small filled circle before a show name means "premieres tonight." The retro guide used symbols for new episodes. This is a generic convention.
- Close-up box. One boxed cell per week carries a still, a two-line description, and the show's slot. At v1 it rotates through the four shows. It is the only editorial voice on the grid besides the host.
- The card. The four-line hand-lettered card is the same object on the porch, in the kit, and in the email. Pressing it on the site expands the fixed night row.
- Off-air honesty. Empty cells stay empty. They print a light dotted rule and nothing else. No fake late-night movies, no fake infomercials.
- Clock. The fixed night row prints `PREMIERE_TIME` once, at the Sign-On cell. Other cells print "any time."

### 6.4 What the guide never does

No comments. No child login. No personalized ads. No autoplay across days. No infinite scroll. The grid ends at Thursday. The only call to action on any page is aimed at the parent: sign up for the note, print the kit, vote (at v1). Every page states that the account holder is a parent.

---

## 7. Family ritual

One household, invented for this file. The Amadi-Kowalczyk household: one parent, Rosa, and two children, Tomasz, age 7, and Ify, age 12. Any resemblance to a real family is accidental. The full standalone version is `family-ritual.md` in this folder.

### Trailer stage

Before. Thursday, Rosa gets no email and no notification. The Thursday cell on the grid is the ritual kit. She prints it from the Wednesday note she got last week, or she opens it on her phone. It is one page: the four-line card with a box to tick per show, one snack card (popcorn in a mixing bowl, the plainest thing), and one question. Friday morning, the parent email lands with `PREMIERE_TIME` in the subject and the card in the body.

During. Friday after dinner, Rosa opens the grid on the living room TV browser. Tomasz presses the Sign-On. The lamp clicks on. The host reads the card. The family watches the four trailers in order, each inside its Porch Intro and Click. After each trailer, the vote appears. Rosa holds the remote and taps. Tomasz and Ify argue. Rosa taps what the house decides. The whole thing is under ten minutes.

After. The After Porch line at the end of the Sign-Off gives the question: "Which house on that street would you knock on first?" They answer out loud. Ify wants Lights Out. Tomasz wants the Wildcard. Rosa signs up for the note with her email. Wednesday, the note arrives with next Friday's card. The card says which show premieres next.

### Full-episode stage

Before. Wednesday, the note lands with the card and the question. Thursday, Rosa prints the kit. Ify tapes the card to the fridge and ticks the show she is waiting for. Friday morning, the email. Friday dinner is whatever it is. The snack from the kit gets made during the Anchor credits.

During. The Sign-On. The Anchor, and Rosa laughs first. The Screen Door into the Hangout, and Ify sits up. Porch Games: freeze when the lamp flickers. Tomasz cheats. The Moth Short. Wildcard, and Tomasz repeats the bit. The Lantern: the lamp goes off. Rosa asks Tomasz if he is in or out. He is in, on her lap. Lights Out. The scare lands. The landing lands. The lamp comes back on.

After. The After Porch question. They talk about it for two minutes and then everybody moves. Rosa taps "we watched" on the grid, which is the only signal the site gets. Saturday, Ify's friend was out Friday, so the friend's house watches the encore. Wednesday, the note.

---

## 8. Trailer format spec

Each of the four v1 trailers is a teaser with plot, dialogue, and a hook. It is not a sizzle reel. It plays like the first three minutes of an episode cut down to 90 seconds. Below is the structure for a 90-second trailer. The Wildcard trailer compresses each beat proportionally to 60 to 75 seconds. The Lights Out trailer may extend the turn and the button to reach 120 seconds.

### Structure

| Beat | Seconds | What it does | Rule |
|---|---|---|---|
| Cold open beat | 0 to 12 | One joke or one image from the middle of the story, no context. Ends on a laugh or a gasp. | No title, no brand, no music bed. Dialogue only. The viewer must want to know what they walked into. |
| World beat | 12 to 30 | Where we are and who lives here. The show's engine in one visual. The rule of the world in one line. | The town is named. The house or the place is shown. No narration. |
| Character beat | 30 to 55 | Two or three characters talking, each with a clear want. Contains the parent-laugh line and the child-laugh line. | Every line is a character speaking to another character. No text cards. |
| Turn | 55 to 75 | The complication. The question the trailer will not answer. | Must be statable in one sentence by a viewer. |
| Button | 75 to 85 | The last joke. A callback to the cold open. | The cold open now makes sense. That is the reward for watching to the end. |
| Title card | 85 to 90 | Show title. Slot label. "Premieres Friday on `[BRAND]`." Small line: "The account holder is a parent." | No call to action aimed at a child. No "subscribe." No "comment." |

The site wraps the file with the 8-second Porch Intro before and the 3-second Click after. The trailer file itself contains neither, so it can be mirrored on a video platform with the Click as pre-roll.

### What makes a trailer feel like you want more

1. An unanswered question. The turn asks it. Nothing answers it.
2. A character with a clear want, stated in dialogue, that the viewer can root for in 20 seconds.
3. Rhythm. Setup, setup, payoff. The button pays off the cold open. A viewer feels the shape close and wants another one.
4. Dialogue, not narration. People talking to each other is the show. Narration is a sales pitch.
5. One specific world detail that could belong to no other show: an object, a rule, a place. Specificity reads as depth.
6. Restraint. The trailer shows one story, not the whole season. Montage kills want.

### Five tests every trailer must pass

1. The Question test. Three people who have never seen the show each write the unanswered question in one sentence. All three write the same question.
2. The Two-Laugh test. Name the line a 35-year-old laughs at that a 6-year-old does not need. Name the moment a 6-year-old laughs at on sight. Both exist. Neither depends on the other.
3. The Cold test. Play the first 12 seconds to someone with no title, no brand, and no context. They ask "what is this?" in a good way. If they ask it in a bored way, cut a new cold open.
4. The Dialogue test. At least 60 percent of running time is a character speaking to another character on screen. Count it with a stopwatch.
5. The Standards test. The `standards` agent returns PASS with zero FAIL and zero WARN. The title card carries no child call to action. Nothing in the trailer copies the expression of any existing show.

A trailer that fails any test is recut. It does not go on the grid.

---

## 9. Measurement hooks

Every metric is per household or per anonymous session. No child data. The parent is the only account holder. The site records events server-side in D1 through the Hono worker. Counsel gate CG-02 reviews the event list before public launch.

### Per trailer

| Event | Definition |
|---|---|
| play | The player reaches 10 seconds of the trailer file (past the cold open). Presses that stop before 10 seconds are counted separately as "bounce." |
| q25, q50, q75 | The player reaches 25, 50, and 75 percent of the trailer file. |
| complete | The player reaches the last frame of the title card, 100 percent. |
| completion rate | complete divided by play. This is the D-013 completion number. |
| vote_watch, vote_skip | A single tap after the Click. Parent-facing copy: "Parents: would your house watch this?" Two buttons: "We would watch" and "Not for us." One vote per session per trailer. The vote stores no personal data. |
| vote ratio | vote_watch divided by vote_skip. This is the D-013 ratio. |
| signup | A parent enters an email on the note sign-up. Stored with a consent timestamp and the statement that the account holder is a parent. |
| signup source | Which cell the parent was on when they signed up: Sign-On, a slot, the note, or the kit. |

### Per block night

| Event | Definition |
|---|---|
| signon_play | The Sign-On plays past 10 seconds. Compared with slot plays to measure the host (scorecard row 8, Test). |
| order adherence | Share of sessions that play the four slots in slot order. Tests the four-slot lead-in claim (scorecard row 3). |
| encore_play | Any play inside the Saturday or Sunday encore cells. |
| household return | A signed-up household that plays any slot on the fixed night or an encore cell in week N and again in week N plus 1. The week 4 return rate is the Phase 5 primary metric (`canon/CANON.md` 1a). |
| we_watched | An optional parent tap on the After Porch at full-episode stage. A stronger return signal than a play. |

### The develop-further line (D-013)

A show develops further only if all three hold.
1. Overall floor: at least 500 parent sign-ups from organic and low-cost traffic (D-009 carried into D-013).
2. Per show: trailer completion rate at or above 40 percent.
3. Per show: vote ratio at or above 3 to 1 in favor.

A show that misses line 2 or 3 stays as a trailer on the grid or leaves it. A block that misses line 1 pivots or stops per D-009.

### Release cadence decision for the Orchestrator

D-013 says each of the four shows opens to a watchable trailer. Two ways to sequence that on the fixed night. This file recommends option B and asks the Orchestrator to log the choice.

- Option A. All four trailers are live from launch. Each fixed night changes only the wrap: a new Sign-On, a new card, a new note. The return rate then measures the wrapper alone. It will read low, because the wrapper raises the floor and shows set the ceiling (H2 verdict).
- Option B. All four shows are on the grid from launch, but each premieres on its own fixed night in slot order: Anchor first, then Hangout, Wildcard, Lights Out. Shows not yet premiered show the close-up box, a still, a logline, and the premiere marker on the coming Friday. After the fourth fixed night all four trailers stay live. This gives the sign-up a reason ("get the card when the next one premieres"), gives the fixed night a reason, and makes the week 4 return rate measure exactly what D-009 asks: did the household come back four times.
- Recommendation: B. Tradeoff: a visitor in week 1 sees one trailer, not four. Mitigation: the close-up boxes and the host's card make the other three feel real, and the vote for the first show starts collecting on night one.

---

## 10. Canon proposal

The full list is in `canon-proposal.md` in this folder. In short, the Orchestrator should add to `canon/CANON.md`: the fixed night (Friday) with `PREMIERE_TIME` as an owner-set constant; the encore window (Saturday and Sunday); the four slots with run times and trailer lengths as confirmed; the slot order rule; the porch as home base, described by its objects; the lamp as the visual identity; the click-and-four-notes sonic ID with its variants; the Porch Host as an adult, non-cast, recorded-wrap host with the seven rules in 4.1; the Moth as a silent ident figure; the six interstitials; the crossover rules; the four stunts by name; the event phases; the one-channel guide rule; the trailer structure and five tests; the measurement events and the develop-further line; and the open decision on release cadence.

---

## Appendix A. Mechanic to scorecard trace

| Mechanic used here | Scorecard row and call | Where it appears |
|---|---|---|
| Fixed night | 1, Reproduce | Section 2 |
| Home base set | 2, Adapt | Section 4.2 |
| Four slots | 3, Adapt | Section 3 |
| Interstitials and bumpers | 4, Adapt | Sections 4.3, 5.1 |
| Seasonal stunts | 5, Adapt | Section 5.3 |
| Sonic ID | 6, Adapt | Section 4.4 |
| Fixed time | 7, Adapt | Section 2, `PREMIERE_TIME` |
| Shared hosts | 8, Test | Section 4.1, measured in 9 |
| Crossover events | 9, Test | Section 5.2, gated to F4 |
| Stay up late feeling | 10, Drop for v1 | Not used. The label "Lights Out" stays. The framing does not. |
| Viewer participation | 11, Drop for v1 | Not used. Porch Games generate no data. The parent vote is a measurement, not participation. |

## Appendix B. Original expression checklist

Every named element below is new to this file. None is taken from any existing show, block, or publication.

- The porch, the lamp, the pull chain, the mailbox with the red flag, the hand-lettered card, the milk crate, the screen door, the lantern.
- The Porch Host (role, unnamed until Phase 4).
- The Moth.
- The Click, the Porch Intro, the Sign-On, the Screen Door, Porch Games, the Moth Short, the Lantern, the After Porch.
- Lamp On, the Long Dusk, Snow Night, Whole Street Night, the Rerun Window.
- Click and four notes.
- All copy lines in this file are placeholders for the brand agent and are original.

## Appendix C. Open items for other agents

1. Brand agent (Phase 2): confirm the porch image survives the name, or trigger the garage fallback in 4.2. Write the grid header copy.
2. Showrunner (Phase 4): name and cast the Porch Host. Set the town name shared by all four shows.
3. Compliance gate: review the event list in section 9 under CG-02. Confirm the parent vote copy is not a child call to action.
4. Product builder (Phase 5): `PREMIERE_TIME` and `[BRAND]` are config constants. The grid is one channel, seven days, as in 6.2.
5. Orchestrator: log the release cadence decision (section 9) and the deliverable `deliverables/03-block-bible.html` per the master prompt Phase 3 step 5. This file is the source for it.
