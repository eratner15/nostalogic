# KITCHEN COURT: Trailer production package

Anchor slot. Project Porchlight, Phase 4. AI-assisted production under D-014, gated by CG-03.

Sources: `projects/04-writers-room/out/scripts/A2-kitchen-court-trailer.md` (the shooting script, every line covered below), `A2-kitchen-court-character-sheet.md` (faces, costume, set), `A2-kitchen-court-cold-open.md` (voice and rhythm reference), `projects/04-writers-room/out/bibles/A2-kitchen-court.md` section 11 (fixed frames), `projects/02-brand/out/identity-brief.md` sections 4 to 6 (palette, motion, sonic logo), `projects/03-block-format/out/block-bible.md` sections 4.2 to 4.4 and 8 (bumpers, sonic ID, trailer spec), `canon/STANDARDS.md` sections 2 and 3, `DECISIONS.md` D-013, D-014, D-023.

Who uses this: the owner, working the image model and the video model the owner named, plus one editor and one voice director. Read section 0 first.

## Rules that bind every page of this package

1. No text is ever generated inside a frame. Every readable word (DOCKET, the case slips, the Rota names, the van lettering) is composited by the editor over a blank surface. The models render blank tape, blank slips, blank magnets, a blank van panel.
2. No brand, logo, or product appears in any frame. The rental company name is fictional and is composited, never generated.
3. No real person. No prompt names an actor, a public figure, or a show. If a generated face resembles a real person on review, it is discarded and regenerated from the master portrait.
4. No courtroom object or word in any prompt: no gavel, robe, bench with a rail, flag, or witness box. The show's objects are a masher, a step stool, a toaster, a freezer door, a wobbly stool, a binder, a whistle, a tea towel.
5. The two block trademarks named in `CLAUDE.md` never appear anywhere.
6. Nothing in this package is released until CG-03 is signed and the disclosure (section 8) is live on the About page.

**Supersession note for counsel.** Character sheet rule 2 says no AI child likeness is requested. The Orchestrator has instructed this package to solve six consistent faces for the trailer, which includes three fictional children (13, 10, 6). The CG-03 packet must therefore state plainly: three of the six synthetic likenesses depict fictional children; no real child was referenced, photographed, or used as a seed; no child's voice is synthesized (section 4). If counsel declines synthetic child likenesses, the fallback is in section 4, path C, and the shot list already keeps every child line off camera or in profile, so the cut survives with the children rendered from behind, by hand, or by object.

---

## 0. Workflow in one page

1. **References first.** Build the six master portraits and turnarounds (section 2). Approve them on a contact sheet. Nothing else is generated until all six are approved. Save approved references to `projects/04-writers-room/out/production/refs/A2/` with the filenames given in section 2.
2. **Plates second.** Build the empty set plates F1 (two states), F2, F2b, F2-Pip, F3, F4, F5, the aerial, and the van (section 1.4). Same light in all. Approve on a contact sheet.
3. **Stills third.** For each shot in section 3, generate the still from the plate plus the character references plus the prompt. Every still passes the drift rule (section 2.6) before it moves on.
4. **Contact sheet review.** All 35 stills on one grid at 1920 by 1080 thumbnails. Check faces, hands, costume tokens, light, and the three never-appear items. Fix stills. Never fix a face in the video model.
5. **Motion fourth.** Image-to-video from each approved still with the motion prompt. 3 to 6 seconds per clip. Subtle motion only. Reject any clip where a face changes identity mid-clip.
6. **Voice.** Record all 32 lines with the reads in section 4, under the path counsel clears. Record a scratch track first for the animatic if the editor needs timing before the session.
7. **Edit.** Stitch per section 6. Composite the lettering. Mix per section 5. Check running time.
8. **Gate.** Run the 12-point checklist (section 7). Only then does `trailerUrl` in `projects/05-product/site/content/shows.json` get a value.

---

## 1. Look bible

### 1.1 Visual intent

One kitchen at dinner hour, lit the way a real kitchen is lit at dusk: cool blue fading in the window over the sink and one warm yellow pendant doing the rest. The frame is calm and fixed, because the camera in this show behaves like a sixth chair that never moves. Faces are ordinary and specific, never glossy. Color comes from the objects and the walls, not from a filter: cream-tan walls, green tile, the brick red of the Stool, the masher handle, and the lanyard, the chrome of the toaster, the amber of the pendant. Everything is clean and sharp. No grain, no texture, no haze, no vignette, no lens flare, no bokeh balls, no fog, no dust in the air, no drama in the lighting. The comedy is in the timing and the faces, so the picture stays out of the way. If a frame could be a film still from a well-shot single-camera family comedy with a good production designer, it is right. If it looks like a render, an advertisement, or a music video, it is wrong.

### 1.2 Style anchor sentence

Paste this sentence, verbatim, at the start of every image prompt in this package. It is referred to below as `{STYLE}`.

> Photographic still from a single-camera family comedy, full-frame cinema camera look, clean and sharp, natural skin, dusk light through a kitchen window over the sink keyed against one warm yellow glass ceiling pendant, warm cream-tan walls, green four-inch ceramic tile, brick red accents, soft shadows, true-to-life color, no film grain, no texture, no haze, no fog, no lens flare, no vignette, no bloom, no text, no lettering, no logos, no watermark, 16:9, 1920 by 1080.

Lens per frame (state it in the plate, section 1.4): F1 35 mm at eye level; F2, F2b, F2-Pip, and F3 50 mm; F4 and F5 85 mm; the aerial 50 mm from above; the van 35 mm.

Palette, adapted from the identity brief to a kitchen at dinner hour:

| Brief role | Brief hex | In the kitchen |
|---|---|---|
| Paper | #F3ECDD | The wall color, shifted warmer to paper-bag tan by the pendant. The bench paint worn to pine. |
| Ink | #1C1A16 | Shadow floor. Nothing in frame is pure black except the Docket tape. |
| Accent | #C9391E | One accent per frame rule holds: the Stool, the masher handle, the lanyard, the Rota arrow. Only one of them should be sharp in any given frame. |
| On-air glow | #FFC46B | The pendant and its pool on the table. This is the only warm light source. |
| Night blue (porch palette) | The window at dusk, the aerial sky, the van scene. The only cool tone. |

Negative list, paste at the end of every image prompt: `no text, no lettering, no logos, no watermarks, no film grain, no vignette, no haze, no lens flare, no extra fingers, no extra hands, no extra people, no duplicate objects, no gavel, no robe, no courtroom, no flag`.

### 1.3 The three things that never appear

1. **Text in frame.** No generated letters, numbers, or symbols anywhere: not on the tape, the slips, the magnets, the van, the binder spine, the polo patch, the calendar, the school calendar magnet. All lettering is composited in the edit (section 6.4). A frame with any generated glyph is rejected even if the glyph is unreadable.
2. **Brand logos.** No logo on the toaster, the range, the sneakers, the van, the cap, the folder tabs, the cardigan, the boots. Prompts say "plain" or "unmarked" for every manufactured object.
3. **Real people.** No prompt names or describes a real person. Every approved master portrait gets a resemblance review (section 7, item 8). Any hit is discarded.

Format: 16:9, 1920 by 1080, every still and every clip. Generate at that size or larger with the same ratio. Never crop a 4:3 or 1:1 output to fit.

### 1.4 Plate prompts (empty set, generate once, reuse for every shot)

Referred to below by token. Each plate prompt is `{STYLE}` plus `{SET}` plus the plate line plus the negative list.

`{SET}` (paste verbatim):

> a split-level family kitchen at dusk, larger than a living room, paper-bag tan walls, green four-inch ceramic tile backsplash with a few crazed tiles, one yellow glass ceiling pendant on an unused pull chain, an off-white refrigerator older than the children with its freezer door covered in plain magnets and blank torn paper slips held by wooden clothespins glued to round magnets, three blank white name magnets on a ring with a red arrow magnet on the fridge body left of the freezer door, five blank index cards under a plastic pineapple magnet right of the freezer door, a back door with a glass top half and a short curtain on a rod showing a backyard at dusk, a door to the garage standing open a hand's width with folding chairs stacked to the ceiling beyond, split-level stairs on the right wall with a wooden half-wall and rail, a white four-burner range and a laminate counter on the left wall with open shelves of mismatched mugs, a fat plain white three-ring binder and a pothos in a terracotta pot, a heavy wire potato masher with a chipped red wooden handle hanging head down on a nail beside the range, a long oval laminate table with a wood-grain top and chrome legs, a plain pine bench once painted white worn back to wood along the far side, three mismatched wooden chairs on the near side, one wooden chair with arms at the left end, a wooden cutting board and a fruit bowl at the right end, a plain wooden stool with one short leg under the counter, all objects unmarked

Plates:

- `{F1-KITCHEN}`: "F1 Table Wide, camera at the sink wall at eye level, 35 mm, the whole table and bench in frame, fridge at frame left, garage door and stairs at frame right, a red two-step steel step stool with enamel chipped to bare metal on the front edge of both steps standing beside the fridge with its back to the wall, a metal two-shelf rolling cart with a plain four-slot chrome toaster parked by the garage door, nobody in the room"
- `{F1-COURT}`: "F1 Table Wide, camera at the sink wall at eye level, 35 mm, the whole table and bench in frame, fridge at frame left, garage door and stairs at frame right, the red two-step steel step stool at the head of the table at frame right with its top step cut off by the top edge of frame, the rolling cart with the chrome toaster parked at the stool's right hand, the cutting board and fruit bowl at the head, nobody in the room"
- `{F2}`: "F2 Stool Single, low angle from the far side of the table, 50 mm, looking up at the red step stool at the head of the table so that whoever sits on its top step is a full head above the room, the wooden cutting board with the red-handled wire potato masher resting head down on it in the foreground, the refrigerator soft in the background, empty"
- `{F2b}`: "F2 Witness, the same camera position and 50 mm lens as F2, the red step stool pushed back and empty, a plain wooden stool with one short leg placed at the head of the table where a seated person would be at table height, a fat plain white three-ring binder on the table beside the cutting board, empty"
- `{F2-PIP}`: "F2 Stool Single low setting, the same camera position and 50 mm lens as F2, tilted down so the table edge crosses the bottom of frame, the red step stool at the head with its second step level with the table, a fruit bowl of apples and bananas at the near edge of the table between camera and the stool, empty"
- `{F3}`: "F3 Cross-Table Two-Shot, camera over the near chairs, 50 mm, just above table height, the pine bench and the far side of the table filling the frame, the head of the table and the step stool out of frame at right, the refrigerator soft at frame left, the green tile behind, empty"
- `{F4}`: "F4 Docket Insert, 85 mm, tight on the freezer door of the off-white refrigerator, a strip of black electrical tape across the top with no writing, a column of blank torn paper slips each held by a wooden clothespin glued to a round magnet, the three blank white name magnets on a ring with the red arrow magnet at the left edge of frame, nothing readable, no faces"
- `{F5}`: "F5 Cart Insert, 85 mm, tight on a plain four-slot chrome toaster on a metal rolling cart, the black lever at frame left, the dial set at three with no numerals readable, two slices of bread down in the slots, the red step stool soft behind at frame right, no faces"
- `{AERIAL}`: "high aerial view straight down and slightly tilted at dusk, 50 mm, a suburban ring road with six cul-de-sacs radiating off it like a pinwheel, split-level houses on every court, lawns, driveways, a white van in one driveway on the last court, porch lights unlit, deep blue dusk with one streak of orange at the horizon, no text"
- `{VAN}`: "ground level at dusk, 35 mm, the last split-level house at the dead end of a cul-de-sac, a plain white cargo van in the driveway with its side door open and folding chairs stacked inside, the van's side panel blank and unmarked, a porch light on, blue dusk sky, no text"

---

## 2. Character consistency kit

### 2.1 How consistency is kept

Six faces at one table is the whole production risk. The kit holds it three ways.

1. **Fixed seats and fixed angles.** Every regular has one seat and one speaking angle. Parties address the Stool, which sits out of frame at the right edge of F3, so every party who speaks turns to the right and is seen in right profile, nose to frame right. The judge on the Stool turns to the Cart at her right hand and is seen in three-quarter to profile. Toni sits sideways to the table with her left profile to camera, nose to frame left. Wendell enters behind a stack of chairs. A face the model must animate speaking straight into the lens never carries more than four words.
2. **Reference-first.** Each regular has one master portrait and one turnaround, approved before any shot still is made. Every shot still is generated with the master portrait attached as the image reference and the character token pasted verbatim. The token never changes. The portrait never changes. If the model offers "variations," refuse them.
3. **Costume tokens are constants.** The one prop and the constant costume per regular appear in every prompt that shows them, in the same words. They are the model's anchors when the face wanders.

### 2.2 Character tokens

Paste verbatim. Do not paraphrase. Do not add adjectives. Labels: Renata is "The Judge" (D-024), never any other nickname; Wendell is "Facilities"; Toni is "Ref"; Marisol is "Counsel"; Ansel is "The Filer"; Pip is "Bailiff". Labels are for notes only and never go into a prompt.

`{RENATA}`:
> Renata, a 44-year-old woman, tall, long-limbed, straight-backed, deep brown skin with a warm undertone, oval face, high forehead, strong brow, wide mouth resting in a half-smile, one small mole above the left eyebrow, steady dark brown eyes, dark brown tightly coiled hair pulled back into a low twist held with a plain band, reading glasses pushed up into her hair, navy work blazer over a plain black crew-neck top, a thin gold watch on the left wrist, dark trousers, flat loafers, no makeup beyond natural

`{WENDELL}`:
> Wendell, a 45-year-old man, medium height, broad shoulders, thick forearms, a soft middle, light warm tan skin, round warm face, heavy eyelids, deep smile lines, a small chip in one front tooth, dark kind slightly tired eyes, short black hair going gray at the temples and flattened on one side, a faded green work polo with a small plain stitched patch over the pocket with no letters, cargo shorts, white sneakers with one black scuff, a cap folded in his back pocket, a brown clipboard with a metal clip and a pen on a string

`{TONI}`:
> Toni, a 73-year-old woman, small and wiry, narrow shoulders, upright like a dancer with her weight on the balls of her feet, deep brown matte skin with earned lines at the eyes and neck, heart-shaped face, sharp cheekbones, deep-set bright eyes, thin lips, one eyebrow riding permanently higher than the other, silver-white hair cropped close to the head, hands with visible tendons and knuckles, a black zip track jacket with two white stripes down each sleeve zipped to the chest over a white crew-neck, gray track pants with a crease, spotless white court sneakers, a red lanyard around her neck holding a dull brass pea whistle worn bright where the thumb goes

`{MARISOL}`:
> Marisol, a 13-year-old girl, tall for her age and all elbows, mid-growth proportions, medium brown warm skin, long face with a strong brow and a round chin, metal braces on her teeth that she does not hide, a serious resting face, no makeup, dark brown loose curls to the shoulder held back with two plain black hair clips with one slipping, a maroon school cardigan with the sleeves pushed to the elbow over a white T-shirt, jeans, one striped sock and one plain sock, a pencil behind her right ear, a fat plain white file folder with colored tabs

`{ANSEL}`:
> Ansel, a 10-year-old boy, small, compact, restless, light tan skin, round face, big dark eyes, expressive eyebrows, a gap between his front teeth, thick straight black hair cut short with a cowlick standing up at the crown, a navy clip-on tie with small yellow dots worn over a plain gray T-shirt, shorts, sneakers with hook-and-loop straps

`{PIP}`:
> Pip, a 6-year-old girl, small and sturdy with square shoulders, six-year-old proportions with a head about one fifth of her standing height and a short neck, round cheeks, medium brown skin, straight thick brows, wide-set dark eyes, a chin she juts forward, a missing top front tooth on her left side, dark brown hair in two low puffs tied with blue bands, small hands, a blue-and-white striped tea towel folded lengthwise and worn as a sash from the right shoulder to the left hip pinned at the shoulder with one large safety pin, a yellow long-sleeve top, leggings, rain boots

### 2.3 Master portrait prompts

One per regular. Each is `{STYLE}` plus the portrait line plus the character token plus the negative list. Same light as the set: dusk window at the subject's left, warm pendant above. Neutral expression, mouth closed, eyes to a point just left of the lens. Shoulders up, head centered, plain tan wall behind, nothing else in frame. Generate at least eight candidates per regular and pick one. The pick becomes the only reference used from then on.

| Regular | Portrait line (add after `{STYLE}`) | Reference filename |
|---|---|---|
| Renata | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, seated straight-backed, chin level, glasses pushed up in her hair, tan kitchen wall behind, `{RENATA}`" | `renata-master.png` |
| Wendell | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, standing, a little out of breath, tan kitchen wall behind, `{WENDELL}`" | `wendell-master.png` |
| Toni | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, standing upright, the whistle on the lanyard resting on her chest, tan kitchen wall behind, `{TONI}`" | `toni-master.png` |
| Marisol | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, mouth closed over braces, one hair clip slipping, tan kitchen wall behind, `{MARISOL}`" | `marisol-master.png` |
| Ansel | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, cowlick up, tie slightly crooked, eyebrows raised a little, tan kitchen wall behind, `{ANSEL}`" | `ansel-master.png` |
| Pip | "head and shoulders portrait, 85 mm, three-quarter view turned slightly to frame right, chin jutted, not blinking, sash visible at the shoulder, tan kitchen wall behind, `{PIP}`" | `pip-master.png` |

### 2.4 Turnaround note

For each approved master, generate four more views with the master attached as reference and the same token: front, left profile, right profile, and back of head. Same lens, same light, same wall. Filenames `<name>-front.png`, `<name>-left.png`, `<name>-right.png`, `<name>-back.png`. The right profile is the most used view in this trailer (every party who speaks turns right), so it gets the most candidates and the strictest pick. A turnaround view that does not match the master on the five landmarks in 2.6 is regenerated, not approved.

Also generate one full-length standing view per regular, `<name>-full.png`, in the F1 plate, alone, at the seat below, so proportions and costume from the waist down are locked. This matters most for Pip (boots, leggings, sash pin) and Toni (creased track pants, spotless sneakers).

### 2.5 Seat, angle, and speaking rule per regular

| Regular | Seat | Frames | Speaking angle rule |
|---|---|---|---|
| Renata | On the Stool, top step, head cut off by the top of F1. Off the Stool, the near chair nearest the head, right of center, three-quarter to camera. Under Rule Four, the gallery bench, center, between Marisol and Ansel. As witness, the Wobble at the head, table height. | F2, F2b, F3 (button), F1 | In F2 she turns to the Cart at her right hand for any line over four words, so the mouth is foreshortened. In F1 she is off screen above the frame edge: her lines there are O.S. by design. Her only straight-to-lens words are "Both." and "Alone. With the waffle." |
| Wendell | The chair with arms, left end, frame left in F1. | F1 only, and a slow pan from F1 for his single | Speaks from behind the stack of chairs. His face is not on screen during his line. |
| Toni | The stair rail, frame right in F1, waist up, whistle first. At the table, the middle near chair turned sideways, left profile to camera, nose to frame left. | F1 only | All calls in F1 wide so the full signal reads. Left profile, mouth small in frame. Never touches the table or evidence. |
| Marisol | Gallery bench, camera-left position, nearest the fridge. | F3, push-in from F3 for her single, F1 | Stands to speak, one hand on the folder, turns to the Stool: right profile, nose to frame right. Sits the moment she is done. |
| Ansel | Gallery bench, camera-right position, nearest the garage door. | F3, F1 | Stands to speak, one hand flat on the table, turns to the Stool: right profile, nose to frame right. Sits too fast. His mouth-open freeze in the cold open is a held pose, not speech. |
| Pip | At attention beside the Cart at the Stool's right hand, one hand on the toaster lever, eyes on the speaker's mouth. Presiding: standing on the second step of the Stool. Off duty: the bench between her siblings. | F5, F2-Pip, F1 | In F5 the frame top cuts her at the chin: mouth never on screen. In F2-Pip her only on-camera words are "The fruit bowl is moved." (half hidden by the bowl) and "Kitchen Court is open." (chin down to the board). "Who's hungry and who's mad?" plays O.S. over F3. |

### 2.6 The drift rule

Five landmarks per regular, listed in the token: for Renata the mole, the brow, the mouth width, the hairline, the glasses; for Wendell the eyelids, the smile lines, the tooth chip, the temples, the flattened hair; for Toni the uneven eyebrows, the cheekbones, the cropped silver hair, the thin lips, the tendons on the hands; for Marisol the brow, the round chin, the braces, the clips, the curl length; for Ansel the tooth gap, the cowlick, the eyebrows, the round face, the tie; for Pip the missing tooth, the two puffs, the wide-set eyes, the jutted chin, the head-to-body ratio.

Rule: place the shot still beside the master portrait at the same scale. If two or more of the five landmarks have drifted, or if the apparent age has moved by more than three years for an adult or one year for a child, discard the still and regenerate from the master with the token. Never repair a face by inpainting a different face onto the body. Never let the video model "fix" a face: a drifted still produces a drifted clip. Log each regeneration with the shot number so the contact sheet review can see which faces the model fights.

### 2.7 Special care: the six-year-old and the seventy-three-year-old

Pip, 6. Image models drift children toward two failure modes: aging up (a nine-year-old with a six-year-old's clothes) and doll faces (oversized eyes, glassy skin, a posed smile). Guards: the token states proportions in numbers (head one fifth of height, short neck) and states "small hands." Reject any still where Pip's face has adult bone structure, where her eyes are larger than a real child's, where her skin has no texture at all, or where her expression is a performed smile. Her expressions in this trailer are serious: at attention, counting, not blinking, chin out. Her body is a fence post. No bare shoulders, no bare legs, no swimwear, no adult pose, ever, in any candidate, even ones that will be discarded. Every discarded Pip candidate is deleted, not archived.

Toni, 73. Image models drift older women toward smoothing (a 55-year-old) or toward a stock grandmother (stoop, cardigan, shawl, glasses on a chain, cane). Guards: the token says "earned lines at the eyes and neck," "hands with visible tendons and knuckles," "upright like a dancer." Reject any still where the neck and hands are smooth, where she stoops, where the hair is longer than cropped, where a cardigan or shawl has replaced the track jacket, or where the whistle is missing. Her eyes are bright and her posture is the youngest thing in the room. That contrast is the character.

Marisol, 13, and Ansel, 10, get the same age-drift check with a one-year tolerance. Marisol must not read as a young woman: no makeup, mid-growth arms, a kid's hands, braces visible when the mouth opens. Ansel must not read as a toddler: a ten-year-old's proportions, the leg bouncing under the table.

---

## 3. Shot list

35 shots. Timecodes are seconds from the first frame of picture. Every line of the script appears once, in order. Prompt expansion rule: every image prompt below is `{STYLE}` plus the named plate plus the named character tokens plus the shot's action line plus the negative list, in that order. The plate still and the master portraits of every named regular are attached as image references on every generation. Motion prompts are for image-to-video from the approved still. Generate every clip at 4 seconds unless the shot says otherwise; the editor trims. "Gen" is the generated clip length.

Beat markers: Beat 1 Cold open 0.0 to 12.0. Beat 2 World 12.0 to 30.5. Beat 3 Character 30.5 to 53.5. Beat 4 Turn 53.5 to 79.0. Beat 5 Button 79.0 to 86.0. Beat 6 Title card 86.0 to 90.0.

Music and sound shorthand: RT = room tone (fridge hum, a faint clock, the toaster's coil tick when it is down). Music cues are in section 5.

### Beat 1. Cold open (0.0 to 12.0). No music. No title.

**S01** | In 0.0 | Out 3.5 | 3.5 s | Frame F1 court state | Camera static | Ansel; Renata's legs on the Stool, head above frame; Pip's hand at the Cart edge
Action: Ansel, standing at the bench, leans across and sets a plate with one waffle, one bite gone, on the exact center of the table, then straightens his tie. His head is down, eyes on the plate, at wide scale.
Dialogue: ANSEL "I'd like to enter into evidence the waffle."
Sound: RT only. The plate ticks on laminate.
Image prompt: `{STYLE}` `{F1-COURT}` `{ANSEL}` `{RENATA}` `{PIP}` "Ansel stands at the far bench leaning over the table, both hands setting a white plate with a single round waffle missing one bite onto the exact center of the table, his eyes down on the plate, a woman's navy trouser legs and flat loafers on the top step of the red step stool at frame right with her body cut off by the top edge of frame, a small child's hand and striped sash edge at the toaster cart beside the stool, the cutting board and the red-handled masher at the head"
Motion prompt: "Static camera. The boy sets the plate down, releases it, and straightens his tie with one hand while his eyes stay on the plate. His mouth moves lightly on a few words. The pendant light does not flicker. 4 seconds."

**S02** | In 3.5 | Out 6.0 | 2.5 s | Frame F5 | Camera static | Pip's hand; no face
Action: Pip's hand rests on the toaster lever. The lever is down. A finger taps once.
Dialogue: PIP (O.S.) "The waffle is entered." RENATA (O.S.) "Is that the waffle?"
Sound: RT. Coil tick. Gen 3 s.
Image prompt: `{STYLE}` `{F5}` `{PIP}` "a six-year-old's small hand resting on the black toaster lever which is pushed down, the child's chin and the striped sash edge at the very top of frame with the mouth above the frame edge, bread down in the slots, faint orange glow inside the slots"
Motion prompt: "Static camera, 85 mm insert. One small finger lifts and taps the lever once. Faint heat shimmer above the slots. Nothing else moves. 3 seconds."

**S03** | In 6.0 | Out 9.5 | 3.5 s | Frame F3 | Camera static | Ansel, Marisol
Action: Ansel stands, one hand flat on the table, turns to the Stool at frame right: right profile. Marisol sits beside him, forearms on the closed folder, watching him with her serious face. Ansel talks fast.
Dialogue: ANSEL "It's a waffle. Somebody bit it. That's my whole case, and I have more."
Sound: RT.
Image prompt: `{STYLE}` `{F3}` `{ANSEL}` `{MARISOL}` "Ansel standing at the bench with his right hand flat on the table, head turned to frame right in right profile addressing someone out of frame, mouth slightly open mid-word, eyebrows up, Marisol seated at his left with her forearms on a closed fat white folder, serious face, one hair clip slipping, the plate with the bitten waffle at the bottom center of frame"
Motion prompt: "Static camera. The boy in profile speaks quickly with small mouth movements and one short chop of his free hand toward the plate. The girl's eyes move from him to the plate and back. 4 seconds."

**S04** | In 9.5 | Out 10.3 | 0.8 s | Frame F5 | Camera static | Insert, no face
Action: The toast POPS. Two slices jump and settle.
Dialogue: none.
Sound: TOAST POP, at or below dialogue peak (section 5.3). Gen 3 s, use the 0.8 s around the pop.
Image prompt: `{STYLE}` `{F5}` "the black lever of the toaster snapped up, two slices of golden toast caught in mid-air a hand's width above the chrome slots, no hand in frame, the striped sash edge at the top of frame"
Motion prompt: "Static camera, 85 mm insert. The lever snaps up and two slices of toast pop, rise, and drop back into the slots with a small bounce. No light flash. 3 seconds."

**S05** | In 10.3 | Out 12.0 | 1.7 s | Frame F3 | Camera static | Ansel, Marisol
Action: Ansel, still in profile, mouth open on his next word. It stays open. His eyes go to the toaster (frame right), then down to the waffle. He closes his mouth. Cut to black at 12.0.
Dialogue: PIP (O.S.) "Time." at 11.0.
Sound: RT. Then hard cut to silence at 12.0. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{ANSEL}` `{MARISOL}` "Ansel standing in right profile with his mouth held open mid-word, frozen, eyes turned toward frame right, Marisol seated beside him with her eyebrows raised, the bitten waffle on its plate at bottom center"
Motion prompt: "Static camera. The boy's mouth stays open. Only his eyes move: to frame right, then down to the plate. Then his mouth closes slowly. The girl does not move. 3 seconds."

### Beat 2. World (12.0 to 30.5). Music enters at 12.0, low, plucked.

**S06** | In 12.0 | Out 14.5 | 2.5 s | Frame AERIAL | Camera slow push | No people
Action: The Pinwheel from above at dusk. Porch lights come on one by one, each once, and stay on.
Dialogue: none.
Sound: Music in at 12.0. Distant evening exterior: one dog, a screen door far away. Gen 4 s.
Image prompt: `{STYLE}` `{AERIAL}` "six porch lights lit and the rest dark, warm amber points in blue dusk"
Motion prompt: "Very slow push in from above, 2 percent over the clip. Porch lights come on one at a time, four more in sequence, each one on and staying on, no flicker, no flashing. 4 seconds."

**S07** | In 14.5 | Out 16.0 | 1.5 s | Frame VAN | Camera static | No people
Action: The last split-level on Spoke Court. The van, side door open, chairs inside. The side panel is blank; the editor composites HUANG PARTY RENTAL and CARROW BEND (D-023) in a plain sign-painter's letter.
Dialogue: none.
Sound: Music. Exterior. Gen 3 s.
Image prompt: `{STYLE}` `{VAN}`
Motion prompt: "Static camera. The porch light glows steady. A moth crosses the frame once. A curtain moves slightly in the front window. 3 seconds."

**S08** | In 16.0 | Out 17.5 | 1.5 s | Frame F4 | Camera static | A hand only
Action: A hand clips a slip under a clothespin magnet at the top of the column. Slip is blank; the editor composites ANSEL v. MARISOL. RE: THE WAFFLE. in a child's marker capitals, and DOCKET on the tape.
Dialogue: none.
Sound: Music. The clothespin's small click. Gen 3 s.
Image prompt: `{STYLE}` `{F4}` "a ten-year-old boy's hand pressing a blank torn paper slip under the top wooden clothespin magnet, one other blank slip already below it"
Motion prompt: "Static camera, 85 mm insert. The hand presses the slip flat, releases the clothespin, and withdraws downward out of frame. The slip settles. 3 seconds."

**S09** | In 17.5 | Out 21.0 | 3.5 s | Frame F1 kitchen state to court state | Camera static | Pip; Toni rising at the rail; Marisol and Ansel on the bench
Action: Pip drags the red Stool from the fridge (frame left) along the floor to the head of the table (frame right). It SCRAPES. At the stair rail frame right, a brass whistle on a red lanyard rises into view, then Toni follows it up, waist up. Toni's line begins at 19.5 and runs into S10.
Dialogue: TONI "Five dollars or five minutes. Anything bigger goes to the table. It's on the fridge." (19.5 to 24.0)
Sound: STOOL SCRAPE 17.5 to 19.0, under dialogue peak. Music holds low. Gen 5 s.
Image prompt: `{STYLE}` `{F1-KITCHEN}` `{PIP}` `{TONI}` `{MARISOL}` `{ANSEL}` "Pip walking backward toward the head of the table dragging the red step stool by its folding handle with both hands, the stool tilted on two feet, halfway along the table, Toni's head and shoulders just risen above the wooden stair rail at frame right with the brass whistle on its red lanyard visible on her chest, left profile to camera, Marisol and Ansel seated on the far bench watching Pip, the rolling cart still by the garage door"
Motion prompt: "Static camera. The small girl drags the stool the last stretch to the head of the table and sets it down. The older woman at the rail rises the final step and stops, upright, hands loose, her mouth moving a little in profile. 5 seconds."

**S10** | In 21.0 | Out 25.0 | 4.0 s | Frame F1 court state | Camera static | Renata; Pip; Toni at the rail; Marisol, Ansel
Action: Renata crosses from the range with the masher lifted off its nail, climbs the Stool one step at a time, straight-backed, until her head passes the top of frame. Pip wheels the Cart to the Stool's right hand and takes her post, hand on the lever. Two taps at 24.5. Toni finishes her line at 24.0.
Dialogue: TONI (cont'd, ends 24.0).
Sound: MASHER TWO TAPS at 24.5, under dialogue peak. Music holds. Gen 5 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{RENATA}` `{PIP}` `{TONI}` `{MARISOL}` `{ANSEL}` "Renata with one foot on the first step of the red step stool at the head of the table, rising, the red-handled wire masher in her right hand, her head near the top edge of frame, back straight, blazer on, Pip standing at attention beside the rolling cart at the stool's right hand with one hand on the toaster lever, Toni at the stair rail waist up in left profile, Marisol and Ansel on the far bench"
Motion prompt: "Static camera. The tall woman climbs to the top step and her head rises out of the top of frame. Her hand brings the masher down twice on the cutting board. The child at the cart does not move. 5 seconds."

**S11** | In 25.0 | Out 28.0 | 3.0 s | Frame F5 | Camera static | Pip's hand and chin; no mouth
Action: Pip at her post. Her hand on the lever. Her chin lifts on the announcement. The mouth stays above frame.
Dialogue: PIP "Kitchen Court is open. Feet on the floor. Hands on the table."
Sound: RT. Music low. Gen 4 s.
Image prompt: `{STYLE}` `{F5}` `{PIP}` "Pip's small hand flat on the toaster lever, her chin jutted forward and the striped sash and safety pin at the top of frame, mouth above the frame edge, bread down in the slots"
Motion prompt: "Static camera, 85 mm insert. The chin lifts a little and holds. The fingers on the lever spread and settle. Nothing else moves. 4 seconds."

**S12** | In 28.0 | Out 30.5 | 2.5 s | Frame F3 | Camera static | Ansel, Marisol
Action: Ansel says his word down at his tie as he straightens it. Marisol says hers down at the folder as she opens it.
Dialogue: RENATA (O.S.) "Who's hungry and who's mad?" ANSEL "Mad." MARISOL "Hungry."
Sound: RT. Music low. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{ANSEL}` `{MARISOL}` "Ansel seated, chin down, both hands straightening his dotted clip-on tie, Marisol seated, eyes down, opening the fat white folder with both hands, the thick folder standing open, the bitten waffle on its plate at bottom center"
Motion prompt: "Static camera. The boy tugs his tie straight and says one word to it. The girl opens the folder flat and says one word to the page. Neither looks up. 3 seconds."

### Beat 3. Character (30.5 to 53.5)

**S13** | In 30.5 | Out 34.0 | 3.5 s | Frame F3 push-in on Marisol | Camera slow push | Marisol, Ansel
Action: Marisol stands, one hand on the open folder, turns to the Stool: right profile. Ansel, seated, looks at the folder's thickness.
Dialogue: MARISOL "I didn't bite the waffle. I have a folder that says so."
Sound: RT. Music low. Gen 4 s.
Image prompt: `{STYLE}` `{F3}` `{MARISOL}` `{ANSEL}` "Marisol standing at the bench with her right hand flat on a fat open folder, head turned to frame right in right profile addressing someone out of frame, braces visible as her mouth opens on a word, Ansel seated at her right looking at the thickness of the folder with his eyebrows up"
Motion prompt: "Slow push in toward the girl, 4 percent over the clip. She speaks in profile with small mouth movements and lifts the folder an inch to show its thickness. The boy's eyebrows climb. 4 seconds."

**S14** | In 34.0 | Out 36.5 | 2.5 s | Frame F3 | Camera static | Ansel, Marisol
Action: Ansel stands fast, hand flat, right profile, one word. A pause for the O.S. reply. Four more words. He points at the folder without looking at it.
Dialogue: ANSEL "Objection." RENATA (O.S.) "To what?" ANSEL "She has a folder."
Sound: RT. Music low. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{ANSEL}` `{MARISOL}` "Ansel standing bolt upright with his right hand flat on the table, head in right profile toward frame right, left index finger pointing sideways at the open folder without looking at it, Marisol standing beside him with one hand on the folder, mouth closed, unimpressed"
Motion prompt: "Static camera. The boy speaks one word in profile, waits, then three more words with a jab of his pointing finger at the folder. The girl's eyes roll upward once and come back. 3 seconds."

**S15** | In 36.5 | Out 39.5 | 3.0 s | Frame F2 | Camera static | Renata
Action: Renata on the top step, a head above everyone. She says the first word to the board, then turns her head to her right toward the Cart and Toni's sideline, so we hold her in three-quarter to profile for the rest.
Dialogue: RENATA "Overruled. Downtown I've never been reversed."
Sound: RT. Music low. Gen 4 s.
Image prompt: `{STYLE}` `{F2}` `{RENATA}` "Renata seated on the top step of the red step stool, knees together, back straight, a full head above the room, both hands folded around the red handle of the masher with its wire head resting on the cutting board, glasses pushed up in her hair, head turning to her right so the face is in three-quarter toward profile, the half-smile"
Motion prompt: "Static low camera. The woman says one word downward, then turns her head to her right into three-quarter profile and continues with small mouth movements. Her hands stay folded on the masher. 4 seconds."

**S16** | In 39.5 | Out 43.5 | 4.0 s | Frame F5 | Camera static | Pip's hand and chin; no mouth
Action: Pip at her post. On "first-grader" one finger lifts off the lever, a small wave. The chin turns a little toward the Stool.
Dialogue: RENATA (O.S.) "In this kitchen I'm 0 and 4 this week, and one of those was a first-grader." PIP "Hi." (43.0)
Sound: RT. Music low. Gen 4 s.
Image prompt: `{STYLE}` `{F5}` `{PIP}` "Pip's small hand on the toaster lever with the index finger lifted in a tiny wave, her chin and the striped sash at the top of frame, mouth above the frame edge"
Motion prompt: "Static camera, 85 mm insert. Nothing moves for a beat, then one small finger lifts off the lever, wags once, and settles. 4 seconds."

**S17** | In 43.5 | Out 48.5 | 5.0 s | Frame F1 court state | Camera static | Wendell behind chairs; Renata's legs on the Stool; Toni; Marisol, Ansel; Pip at the Cart
Action: The garage door swings wide. Wendell backs in carrying a stack of folding chairs taller than he is. His face is behind the stack for his whole line. He sets them down at the end and we see him, a little out of breath, as the whole table answers.
Dialogue: WENDELL "Can we not split it? We could split it. It's a waffle. It comes with lines." RENATA, TONI, MARISOL, ANSEL, PIP (together, 48.0) "No."
Sound: RT. The garage door. Chair frames knock. Music low. Gen 6 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{WENDELL}` `{RENATA}` `{TONI}` `{MARISOL}` `{ANSEL}` `{PIP}` "the garage door at frame right swung wide, Wendell stepping backward into the kitchen hugging a stack of plain folding chairs taller than his head so that only his forearms, green polo, cargo shorts, and sneakers show, his face fully hidden behind the stack, the clipboard in his back pocket, Renata's legs on the top step of the stool cut off by the top of frame, Toni seated sideways in the middle near chair in left profile, Marisol and Ansel on the far bench, Pip at the cart with her hand on the lever, every visible head turned toward the chairs"
Motion prompt: "Static camera. The man backs in two steps with the stack of chairs hiding his face, stops, and lowers the stack to the floor with a small knock, revealing his face, out of breath. Every head at the table turns to him at once. 6 seconds."

**S18** | In 48.5 | Out 52.0 | 3.5 s | Frame F1 court state | Camera static | Toni; Wendell; all
Action: Toni rises from her chair, lifts the whistle, one short low blow. Her fists roll over each other in front of her chest. She points at the chair with arms. Left profile, the full signal in wide.
Dialogue: TONI "Traveling. You picked up the chairs and moved. That's traveling. Sit."
Sound: WHISTLE, one short low blow at 48.7, at least 3 dB under dialogue peak (section 5.3). Music low. Gen 5 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{TONI}` `{WENDELL}` `{RENATA}` `{MARISOL}` `{ANSEL}` `{PIP}` "Toni standing beside the middle near chair in left profile, feet shoulder-width, the brass whistle at her lips held by two fingers, her other hand already beginning to roll a fist in front of her chest, Wendell standing beside the lowered stack of chairs at frame right looking at her, the rest of the family at their places, Renata's legs on the stool at the top of frame"
Motion prompt: "Static camera. The small older woman blows the whistle once, drops it to her chest, rolls both fists over each other twice in front of her, then points one finger at the armchair at the left end of the table. Her mouth moves a little in profile. 5 seconds."

**S19** | In 52.0 | Out 53.5 | 1.5 s | Frame F1, slow pan left to Wendell's single | Camera slow pan | Wendell
Action: Wendell crosses to the chair with arms and sits, fully, properly. Nobody told him which one.
Dialogue: none.
Sound: RT. The chair takes his weight. Music low. Gen 4 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{WENDELL}` "framed as a slow pan from F1 to the left end of the table, Wendell lowering himself into the wooden chair with arms, both hands on the armrests, clipboard in his back pocket, the fridge behind him at frame left"
Motion prompt: "Slow pan left, 5 percent, settling on the armchair. The man sits down all the way and puts both hands on the armrests. He exhales. 4 seconds."

### Beat 4. Turn (53.5 to 79.0)

**S20** | In 53.5 | Out 56.0 | 2.5 s | Frame F3 push-in on Marisol | Camera slow push | Marisol, Ansel
Action: Marisol closes the folder with one hand. Stands. Right profile to the Stool.
Dialogue: MARISOL "I call one witness. I call Mom."
Sound: RT. Music holds, then thins. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{MARISOL}` `{ANSEL}` "Marisol standing with her right hand flat on the closed fat white folder, head in right profile toward frame right, mouth just opening, Ansel seated beside her looking up at her"
Motion prompt: "Slow push in, 3 percent. The girl closes the folder flat with one hand and speaks in profile with small mouth movements. The boy's head turns from her toward frame right. 3 seconds."

**S21** | In 56.0 | Out 58.5 | 2.5 s | Frame F1 court state | Camera static | Renata; all
Action: A pause at the table. Renata climbs down from the Stool one step at a time, straight-backed, and sits on the Wobble at the head. It tips. She steadies it with one hand and puts the other on the fat white binder. The Stool stands empty behind her.
Dialogue: none.
Sound: RT. The Wobble's short leg knocks the floor once. Music thin. Gen 5 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{RENATA}` `{WENDELL}` `{TONI}` `{MARISOL}` `{ANSEL}` `{PIP}` "Renata stepping down from the second step of the red step stool with one hand on its handle, the masher left on the cutting board, a plain wooden stool with one short leg now placed at the head of the table in front of the step stool, a fat plain white binder on the table beside it, Wendell in the armchair, Toni sideways in the middle chair, Marisol and Ansel on the bench, Pip at the cart, every face turned to Renata"
Motion prompt: "Static camera. The tall woman steps down to the floor, sits on the small wooden stool, which tips an inch and is steadied by her hand on the table. Her other hand comes to rest on the binder. 5 seconds."

**S22** | In 58.5 | Out 61.5 | 3.0 s | Frame F2b | Camera static | Renata
Action: Renata at table height on the Wobble, eyes down on the binder under her hand, as if reading an oath she knows.
Dialogue: RENATA "I promise to say what happened, not what it meant."
Sound: RT. Music thin. Gen 4 s.
Image prompt: `{STYLE}` `{F2b}` `{RENATA}` "Renata seated at table height on the plain wooden stool with one short leg, her right hand flat on the fat white binder, eyes down on the binder, glasses pushed up in her hair, back straight, the empty red step stool behind her, the masher resting on the cutting board in the foreground"
Motion prompt: "Static low camera. The woman keeps her eyes on the binder and speaks with small mouth movements, chin down. Her hand presses the binder slightly. 4 seconds."

**S23** | In 61.5 | Out 64.0 | 2.5 s | Frame F3 push-in on Marisol | Camera slow push | Marisol, Ansel
Action: Marisol standing, one hand on the folder, right profile, cross-examining her mother.
Dialogue: MARISOL "Where were you at seven-fifteen this morning?"
Sound: RT. Music thin. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{MARISOL}` `{ANSEL}` "Marisol standing in right profile with one hand on the closed folder and the pencil in her other hand held like a pointer, Ansel seated, leaning forward on his forearms, watching frame right"
Motion prompt: "Slow push in, 3 percent. The girl speaks in profile and taps the pencil once on the folder. The boy leans in. 3 seconds."

**S24** | In 64.0 | Out 66.0 | 2.0 s | Frame F2b | Camera static | Renata
Action: A beat. Renata lifts her eyes from the binder to Marisol (frame left), three-quarter. Four words. The half-smile holds.
Dialogue: RENATA (beat) "Alone. With the waffle."
Sound: RT. Music thin. Gen 3 s.
Image prompt: `{STYLE}` `{F2b}` `{RENATA}` "Renata seated at table height, hand on the binder, eyes lifted to frame left in three-quarter view, the half-smile, glasses in her hair, the empty step stool behind"
Motion prompt: "Static low camera. The woman holds still for a beat, lifts her eyes to frame left, and says four words with small mouth movements and no other motion. 3 seconds."

**S25** | In 66.0 | Out 67.0 | 1.0 s | Frame F3 | Camera static | Marisol, Ansel
Action: Marisol, profile, unmoved, four words.
Dialogue: MARISOL "Let the record show."
Sound: RT. Gen 3 s, use 1.0 s.
Image prompt: `{STYLE}` `{F3}` `{MARISOL}` `{ANSEL}` "Marisol standing in right profile, hand on the folder, face flat and serious, Ansel seated with both eyebrows up as high as they go"
Motion prompt: "Static camera. The girl speaks four words in profile. The boy's eyebrows stay up. 3 seconds."

**S26** | In 67.0 | Out 68.5 | 1.5 s | Frame F2b | Camera static | Renata
Action: Renata's eyes go back down to the binder. Five words to the binder.
Dialogue: RENATA "It was a quality check."
Sound: RT. Gen 3 s.
Image prompt: `{STYLE}` `{F2b}` `{RENATA}` "Renata seated at table height, eyes back down on the binder under her hand, chin down, the half-smile a little wider"
Motion prompt: "Static low camera. The woman's eyes drop to the binder and she speaks five words downward with small mouth movements. 3 seconds."

**S27** | In 68.5 | Out 73.0 | 4.5 s | Frame F3 | Camera static | Marisol, Ansel
Action: Marisol's serious face breaks, then she catches it and holds it again. Ansel stands, slowly, and straightens his tie, grave. Renata's line plays over them, off screen.
Dialogue: RENATA (O.S.) "Let the record also show that I am very proud of you, and I would like a lawyer."
Sound: RT. Music thin. Gen 5 s.
Image prompt: `{STYLE}` `{F3}` `{MARISOL}` `{ANSEL}` "Marisol standing with her hand on the folder, facing frame right, her serious mouth breaking into the start of a smile with braces showing, Ansel beginning to rise from the bench with one hand already on his tie, eyebrows level and grave, the bitten waffle on its plate at bottom center"
Motion prompt: "Static camera. The girl's face breaks into a smile, she catches it and pulls it flat again. The boy rises to standing and straightens his tie with both hands, slowly. Neither speaks. 5 seconds."

**S28** | In 73.0 | Out 75.0 | 2.0 s | Frame F3 | Camera static | Ansel, Marisol
Action: Ansel, standing, hand flat, right profile, grave. Renata's two words off screen as the shot ends.
Dialogue: ANSEL "Amended. Everyone versus Mom." RENATA (O.S.) "Rule Four."
Sound: RT. Music thin. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{ANSEL}` `{MARISOL}` "Ansel standing bolt upright with his right hand flat on the table in right profile toward frame right, grave, Marisol standing beside him looking at him sideways"
Motion prompt: "Static camera. The boy speaks four words in profile with small mouth movements, then holds perfectly still. The girl's eyes slide toward him. 3 seconds."

**S29** | In 75.0 | Out 76.5 | 1.5 s | Frame F4, Rota detail | Camera static | A hand only
Action: Tight on the three name magnets on the ring and the red arrow. A small hand turns the arrow. It stops on the third magnet. The editor composites MARISOL, ANSEL, PIP on the magnets.
Dialogue: PIP (O.S.) "Kid on the Stool."
Sound: RT. The magnet's small scrape on enamel. Music thin. Gen 3 s.
Image prompt: `{STYLE}` `{F4}` `{PIP}` "framed on the fridge body left of the freezer door, three blank white name magnets arranged on a ring and a red arrow magnet, a six-year-old's small hand with fingertips on the red arrow turning it, no face"
Motion prompt: "Static camera, 85 mm insert. The small hand rotates the red arrow a third of a turn and stops it on the lowest magnet, then withdraws. 3 seconds."

**S30** | In 76.5 | Out 79.0 | 2.5 s | Frame F1 court state | Camera static | All six
Action: Everyone turns and looks at the smallest person in the room. Pip looks at the Stool. She unpins the tea towel, folds it once, and sets it on the Cart. Nobody says anything.
Dialogue: none.
Sound: RT. Music drops out at 79.0. Gen 5 s.
Image prompt: `{STYLE}` `{F1-COURT}` `{PIP}` `{RENATA}` `{WENDELL}` `{TONI}` `{MARISOL}` `{ANSEL}` "Pip standing beside the rolling cart at the head of the table with the safety pin open in her fingers and the striped tea towel sash half off her shoulder, looking at the empty red step stool, Renata seated at table height on the wobbly stool turned to look at her, Wendell in the armchair, Toni in the middle chair, Marisol and Ansel standing at the bench, every face turned to the small girl"
Motion prompt: "Static camera. The small girl slides the sash off, folds it once against her chest, and lays it on the cart beside the toaster, squared to the edge. Nobody else moves. 5 seconds."

### Beat 5. Button (79.0 to 86.0). No music.

**S31** | In 79.0 | Out 81.5 | 2.5 s | Frame F2-Pip | Camera static | Pip
Action: Pip stands on the second step. The fruit bowl hides the lower half of her face. She says her line half hidden. She slides the bowl aside with one hand. Now we see her. She takes the masher in both hands. Two taps at 81.0.
Dialogue: PIP "The fruit bowl is moved."
Sound: MASHER TWO TAPS at 81.0, under dialogue peak. No music. Gen 5 s.
Image prompt: `{STYLE}` `{F2-PIP}` `{PIP}` "Pip standing on the second step of the red step stool, no sash, the yellow long-sleeve top, level with the table, a fruit bowl of apples and bananas in the near foreground hiding her mouth and chin so only her eyes, brows, and two hair puffs show above the fruit, her small hand reaching for the rim of the bowl"
Motion prompt: "Static low camera. The child's eyes hold on the lens above the fruit bowl for a beat while her mouth, hidden, says a few words. Her hand slides the bowl to frame right until her whole face is clear. She lifts the red-handled masher in both hands and brings it down twice on the cutting board. 5 seconds."

**S32** | In 81.5 | Out 83.0 | 1.5 s | Frame F2-Pip | Camera static | Pip
Action: Chin down to the board, both hands on the masher, four words to the board. Then she looks up.
Dialogue: PIP "Kitchen Court is open."
Sound: RT only. Gen 3 s.
Image prompt: `{STYLE}` `{F2-PIP}` `{PIP}` "Pip standing on the second step with both hands around the red masher handle, its wire head resting on the cutting board, her chin down toward the board and her eyes on it, the fruit bowl pushed to the far right edge of frame"
Motion prompt: "Static low camera. The child speaks four words downward to the board with small mouth movements, then lifts her chin and looks straight ahead, jutting the chin. 3 seconds."

**S33** | In 83.0 | Out 85.0 | 2.0 s | Frame F3 | Camera static | Renata between Ansel and Marisol
Action: Renata on the gallery bench, the kids' side, between Ansel and Marisol, glasses still up in her hair. She looks small there. The three of them look up at the Stool. Pip's question plays off screen. Renata answers with one word.
Dialogue: PIP (O.S.) "Kitchen Court is open. Who's hungry and who's mad?" (the first four words are the tail of S32, the question at 83.3). RENATA "Both." (84.3)
Sound: RT only. Gen 4 s.
Image prompt: `{STYLE}` `{F3}` `{RENATA}` `{ANSEL}` `{MARISOL}` "Renata seated on the pine bench between Ansel at her left and Marisol at her right, blazer off and hung behind her, glasses pushed up in her hair, hands folded on the table, looking small between her children, all three faces turned up toward frame right, the bitten waffle on its plate at bottom center"
Motion prompt: "Static camera. The three of them hold still, looking up toward frame right. The woman's lips part on one word and close. The boy's leg bounces under the table. 4 seconds."

**S34** | In 85.0 | Out 86.0 | 1.0 s | Frame F3, insert on the table | Camera static | A small hand
Action: A small hand slides the evidence waffle on its plate from the head to the exact center of the table, halfway between Ansel and Marisol. Not one inch closer to either. Cut to black at 86.0.
Dialogue: none.
Sound: The plate slides on laminate. Cut to silence. Gen 3 s.
Image prompt: `{STYLE}` `{F3}` `{PIP}` "tight on the wood-grain table top from just above table height, a six-year-old's small hand at frame right pushing a white plate with one bitten waffle across the laminate toward the center of the table, no faces"
Motion prompt: "Static camera. The small hand slides the plate to the exact center of frame and stops it dead, then withdraws to frame right. 3 seconds."

### Beat 6. Title card (86.0 to 90.0)

**S35** | In 86.0 | Out 90.0 | 4.0 s | Title card, built by the editor, no generation | No people
Action: Black. Then the card per section 6.3. The music resolves.
Dialogue: none.
Sound: Music resolves (section 5.5). Silence for the last 0.5 s.

### Coverage check

Every line in the script, in order: S01 (line 1), S02 (2, 3), S03 (4), S05 (5), S09 and S10 (6), S11 (7), S12 (8, 9, 10), S13 (11), S14 (12, 13, 14), S15 and S16 (15), S16 (16), S17 (17, 18), S18 (19), S20 (20), S22 (21), S23 (22), S24 (23), S25 (24), S26 and S27 (25), S28 (26, 27), S29 (28), S31 (29), S32 and S33 (30), S33 (31). 32 lines, 32 covered. Every scripted insert is covered: the toast pop (S04), the slip (S08), the scrape (S09), the taps (S10, S31), the whistle (S18), the Wobble (S21), the Rota (S29), the sash (S30), the fruit bowl (S31), the waffle slide (S34).

Lip-sync exposure check: the longest on-camera line delivered straight toward the lens is four words ("Alone. With the waffle." and "Kitchen Court is open."). Every line over four words is in profile, behind an object, chin down, above the frame edge, or off screen.

---

### Punch-up note (v2 lines)

`A2-kitchen-court-trailer-v2.md` and `change-notes.md` swap four lines and change no shot: Toni in S09 and S10 gains "Laminated."; Pip in S11 gains "Mom's feet don't count."; Marisol in S13 gains "It's tabbed."; Wendell in S17 ends "The lines are a hint." The shot list above follows the v1 file as instructed. All four swaps land in shots where the mouth is already off screen or in profile, so the picture does not change. The voice session records both versions of those four lines (section 4.4). The Orchestrator picks before the final mix.

---

## 4. Voice and dialogue plan

### 4.1 Every line needs a performed voice

There is no narration. All 32 lines are character to character. The comedy is timing across six voices at one table: the pop landing mid-word, "Time" arriving before the mouth closes, the pause before "Both." None of that comes from a text-to-speech read. Every line below is performed, then cut to picture.

Reads, by line. The read is the note the voice director gives. Pace is fast family talk: people finish each other's thoughts, and cues overlap by a syllable where marked (+).

| # | Shot | Character | Line | The read |
|---|---|---|---|---|
| 1 | S01 | Ansel | I'd like to enter into evidence the waffle. | Formal, rehearsed, a phrase he practiced in the mirror. Head down. |
| 2 | S02 | Pip (O.S.) | The waffle is entered. | Flat, official, a weather report. No pride. |
| 3 | S02 | Renata (O.S.) | Is that the waffle? | Dry. She already knows. The question is for the record. |
| 4 | S03 | Ansel | It's a waffle. Somebody bit it. That's my whole case, and I have more. | Fast, building, the last clause a boast. Cut off hard by the pop on "more." |
| 5 | S05 | Pip (O.S.) | Time. | One syllable, level, no emotion. A stopwatch that can talk. |
| 6 | S09, S10 | Toni | Five dollars or five minutes. Anything bigger goes to the table. It's on the fridge. | Scoreboard voice. Each sentence the same weight. No warmth on purpose; the warmth is that she says it every day. |
| 7 | S11 | Pip | Kitchen Court is open. Feet on the floor. Hands on the table. | Announced, chin out, each phrase a separate command. Slight emphasis on "floor." |
| 8 | S12 | Renata (O.S.) | Who's hungry and who's mad? | A ritual question, said a thousand times, tired and fond. |
| 9 | S12 | Ansel | Mad. (+) | Immediate, to his tie. |
| 10 | S12 | Marisol | Hungry. (+) | Immediate, to the folder. A work-email voice. |
| 11 | S13 | Marisol | I didn't bite the waffle. I have a folder that says so. | Calm, over-prepared, the second sentence is the closing argument. |
| 12 | S14 | Ansel | Objection. | Too fast, too loud, he stood before he thought. |
| 13 | S14 | Renata (O.S.) | To what? | Patient. Genuinely curious. |
| 14 | S14 | Ansel | She has a folder. | As if that settles it. He believes it. |
| 15 | S15, S16 | Renata | Overruled. Downtown I've never been reversed. In this kitchen I'm 0 and 4 this week, and one of those was a first-grader. | "Overruled" to the board, quick. Then the rest as a confession to Toni, level, a little rueful, the last clause slower. The parent laugh: do not push it. |
| 16 | S16 | Pip | Hi. (+) | Tiny, polite, on cue, as if answering roll call. |
| 17 | S17 | Wendell | Can we not split it? We could split it. It's a waffle. It comes with lines. | Out of breath, hopeful, from behind the chairs. Rising on "lines" like it might work this time. |
| 18 | S17 | All five | No. (+) | Together, one beat, flat. Record each voice separately and stack them; the editor aligns to one frame. |
| 19 | S18 | Toni | Traveling. You picked up the chairs and moved. That's traveling. Sit. | The call. Clipped, certain, "Sit" is the kindest word in it. |
| 20 | S20 | Marisol | I call one witness. I call Mom. | The first sentence is procedure. The second is the turn. A small drop in pitch, no drama. |
| 21 | S22 | Renata | I promise to say what happened, not what it meant. | Level, an oath she wrote herself. The half-smile audible. |
| 22 | S23 | Marisol | Where were you at seven-fifteen this morning? | Precise, courteous, deadly. |
| 23 | S24 | Renata | (beat) Alone. With the waffle. | Hold the beat a full second. Then two short admissions. Dry. |
| 24 | S25 | Marisol | Let the record show. | Not a question. Not a triumph. A clerk. |
| 25 | S26, S27 | Renata | It was a quality check. Let the record also show that I am very proud of you, and I would like a lawyer. | The first sentence is a bad defense and she knows it. "Very proud of you" is real. "And I would like a lawyer" is the same warm voice, no comic push. |
| 26 | S28 | Ansel | Amended. Everyone versus Mom. | Grave, slow, the biggest words he owns. |
| 27 | S28 | Renata (O.S.) | Rule Four. (+) | Instant. She cites it against herself without hesitation. |
| 28 | S29 | Pip (O.S.) | Kid on the Stool. | Quiet. The first time she has said it about herself. |
| 29 | S31 | Pip | The fruit bowl is moved. | Half muffled by the bowl for the first three words, clear on "moved." Official. |
| 30 | S32, S33 | Pip | Kitchen Court is open. Who's hungry and who's mad? | First sentence to the board, small. Second sentence up and out, her mother's exact ritual cadence, in a six-year-old's voice. |
| 31 | S33 | Renata | Both. | After a real pause. Soft. Not a joke. The last word of the trailer. |

### 4.2 The three paths

**Path A. Synthesized voices, all six.** Every adult voice is a CG-03 item. The three child voices are the CG-03 item most likely to be refused: a synthesized child voice in a public asset raises questions counsel has not yet answered (source of the voice model, consent, the appearance of a real child). Timing quality is also the weakest: synthesized reads do not overlap, interrupt, or land a pause. Suitable only for the private animatic scratch track, never for the released file.

**Path B. Hired child talent for the three children, hired adults for the three adults.** Best possible reads. Triggers CG-04 for every performer and adds a labor-law flag for the minors: work permits, hour limits, a guardian on set, a set-aside of earnings, and rules that vary by state. That is a full production apparatus for a 90-second demand test. It is the right path for the series, not for the trailer.

**Path C. Adult voice performers for all six voices, including the three children.** Adult performers voicing children is a standard practice in animation and radio. It triggers CG-04 once, for a short voice agreement per performer, and no minor is involved. The child voices are performed, not synthesized, so the CG-03 child-voice flag never arises. Reads can be re-recorded in the same session until the timing is right. Marisol at 13 can be a young adult performer near her own register; Ansel and Pip are character voices from performers who specialize in them.

### 4.3 Recommendation for v1: Path C

Reason: the trailer is a timing problem, and Path C is the only path that solves timing without a minor and without a synthesized child voice. Six performers, one session, one director, one CG-04 agreement template. It also makes the disclosure (section 8) short and true: pictures are synthetic, voices are human, no child took part. If counsel later clears Path B for the series, the trailer voices can be recast without recutting a single shot, because no lip is on camera for longer than four words.

Scratch track: the editor may cut the animatic to a synthesized scratch track under Path A for timing only. The scratch track is logged in the gate register as a private working file and is never exported into any file that leaves the repo.

### 4.4 Session notes

1. Record each performer alone, then the "No." from all five in one pass with everyone on their own mic.
2. Record the four v2 swap lines (Toni 6, Pip 7, Marisol 11, Wendell 17) as alternates in the same session.
3. Record Renata's line 15 both ways: as one take, and as two halves with a clean cut point after "reversed," so the editor can bridge S15 to S16.
4. Record Ansel's line 4 with the last word left hanging, since the pop cuts it.
5. Record room tone from the kitchen mix stem (section 5) and play it in the performers' headphones so the reads sit in the space.
6. Slate every take with line number and shot number. Deliver 48 kHz 24-bit WAV, one file per take, named `A2_L##_S##_take##.wav`.

---

## 5. Sound plan

### 5.1 Head and tail: where the sonic ID lives

The block bible (section 8) is explicit: the trailer file contains neither the Porch Intro nor the Click. The site wraps the file with the 8-second Porch Intro before (sonic ID, in variant, unresolved) and the 3-second Click after (sonic ID, out variant, resolved). So:

- **Head of file.** 0.5 seconds of black with room tone at the head, then picture at 0.0. No music, no ident, no logo. The block's four rising notes have just ended, unresolved, in the wrapper; the cold open plays in the silence they leave. The trailer's first sound is a plate touching laminate.
- **Tail of file.** The music resolves under the title card (5.5) and ends with 0.5 seconds of silence before the last frame, so the Click's pull-chain and resolved four notes land cleanly in the wrapper.
- **Mirror version.** For any mirrored video platform post, the editor prepends the 3-second Click as pre-roll per the block bible. Two exports (section 6.6).

### 5.2 Signature sounds

Four signature sounds, all recorded or built from recordings, none synthesized from a library of another show's effects:

1. **The Stool scrape.** Steel feet dragged on vinyl floor, S09, 1.5 seconds, low and dry.
2. **The two taps.** A heavy wire masher on a wooden board, S10 and S31. Two taps, never three. The second tap slightly softer.
3. **The toast pop.** A real four-slot toaster lever release, S04. Spring, metal, the slices landing. No comedy boing.
4. **The whistle.** A brass pea whistle, one short low blow, S18. Recorded at a distance, not close-miked, so it reads as across a room.

Also: the clothespin click (S08), the Wobble's short leg (S21), the magnet on enamel (S29), the plate slides (S01, S34), the garage door and chair frames (S17), the chair taking Wendell's weight (S19).

### 5.3 Levels (STANDARDS soft rule 8)

- Reference: the dialogue peak is the loudest sample in any dialogue line in the mix. Measure it on the final dialogue stem.
- The toast pop, the whistle, the scrape, and the taps each peak at least 3 dB below the dialogue peak. Nothing in the effects stem exceeds the dialogue peak at any point.
- Music sits under dialogue by at least 12 dB in any second where dialogue is present, and never exceeds the dialogue peak even in the title card.
- Integrated loudness for the file: -16 LUFS, true peak -1.0 dBTP. The Porch Intro, the Click, and all four trailers are mastered to this same target so the wrapper and the file match (identity brief section 6).
- The mixer logs the measured dialogue peak and the measured peak of each signature sound in the gate checklist (section 7, item 9).

### 5.4 No strobe (STANDARDS soft rule 9)

- The aerial (S06): porch lights come on once each and stay on. No light changes state more than once. At most one light change per second.
- The toast pop (S04): no light flash, no brightness change in the frame.
- The title card (S35): fades only. No flicker, no flashing amber dot.
- Any generated clip with a light that pulses or flickers is rejected at the contact sheet stage.

### 5.5 Music brief

- Enters at 12.0 under the aerial. Low, plucked, one instrument, in the same family as the block's sonic ID (nylon-string guitar or kalimba), so the trailer sounds related to the wrapper without quoting it. Mid tempo, major key, no swing, no drums, no pad, no strings, no riser.
- Holds low and simple through Beat 2 and Beat 3. Thins to a single held note or sparse plucks under Beat 4 from 53.5.
- Drops out at 79.0 as Pip steps onto the Stool. The button (79.0 to 86.0) plays in room tone only.
- Resolves under the title card: a short figure of three to five notes, 86.0 to 89.5, resolving downward, then silence. It must not quote or resolve into the block's four-note ID; that belongs to the Click in the wrapper.
- What it must not sound like: no orchestral swell, no comedy pizzicato with a tuba, no ukulele-and-whistling advertising cue, no sitcom sting, no theme from any existing show, no melody that resolves like a commercial (identity brief section 6).
- Deliverable: one stem, 48 kHz 24-bit, with a marker at 12.0, 53.5, 79.0, and 86.0.

---

## 6. Edit plan

### 6.1 Stitch order

S01 through S35 in numerical order. No reordering. The clips are trimmed to the in and out points in section 3. Where a generated clip is longer than the shot, the editor picks the window that contains the action described, and prefers the window where the face is steadiest.

### 6.2 Cut rhythm per beat

- **Beat 1, cold open.** Five cuts in 12 seconds. Long-short-long-very short-short. The pop (S04) is a 0.8 second insert that interrupts a sentence; cut in on the lever, cut out as the slices land. Hard cut to black at 12.0. No fade.
- **Beat 2, world.** Three fast exteriors and an insert (2.5, 1.5, 1.5, 1.5), then the kitchen settles into two longer wides. Toni's line bridges the cut from S09 to S10 so the audio ties the two plates together. Cut to the F5 insert exactly on the first word of Pip's announcement.
- **Beat 3, character.** Cross-table rhythm: Marisol, Ansel, Renata, Pip's hand. Cut on the first syllable of each new speaker, never before. Hold S15 to S16 across Renata's line so the parent laugh plays over Pip's small wave: the joke lands on a hand, not a face. Wendell's entrance is the longest shot in the trailer (5.0). Let it breathe. Toni's call is one unbroken wide.
- **Beat 4, turn.** Ping-pong: F3, F2b, F3, F2b, F3, F2b, F3. Cuts tighten from 2.5 to 1.0 through the cross-examination (S23 to S26), then S27 opens back out to 4.5 as the joke turns to feeling. The Rota insert (S29) is a 1.5 second stab. S30 is silent and is not to be shortened.
- **Beat 5, button.** Three shots and an insert. S31 holds for the reveal. S32 is short. S33 is the last look. S34 is one second of a hand and a plate, then a hard cut to black at 86.0.
- **Beat 6, title.** Fades only.

### 6.3 Title card and end card (one card, two states, 86.0 to 90.0)

Built by the editor at 1920 by 1080 from the identity brief, dark set ("late edition"): paper #15130F, ink #EFE6D3, accent #E8583A unused on this card, amber #FFD08A for the dot only.

- 86.0 to 86.3: black.
- 86.3: fade up (12 frames) line 1 and 2, centered. Line 1: KITCHEN COURT in Archivo, width 75, weight 800, all capitals, tracked tight. Line 2: ANCHOR in Archivo width 100 weight 500 small capitals with tabular numerals off.
- 88.0: fade up (12 frames) below them: "Premieres Friday on" in Newsreader, then the masthead block: STREETLIGHTS in Archivo condensed all capitals with a single amber dot as the period after the name, a hairline rule in ink 20 under it, and FRIDAY NIGHT in small capitals under the rule. Below, in Newsreader at small size: "The account holder is a parent."
- 89.5 to 90.0: hold, then cut to black on the last frame.
- Nothing on the card moves except the two fades. No kinetic type. The amber dot does not breathe on video.
- The brand is provisional (Fork D, CG-01). STREETLIGHTS is a single text constant in the editor's card template so it can be swapped without a recut.
- No other text, no URL, no call to action, no social handle.

### 6.4 Compositing the lettering

All readable text is added in the edit over blank generated surfaces, tracked to the plate, with a slight shadow so it sits on the surface:

- S07: HUANG PARTY RENTAL, CARROW BEND on the van's blank side panel, sign-painter block capitals, two lines.
- S08: DOCKET on the black tape in silver marker capitals, a child's hand; the new slip reads ANSEL v. MARISOL. RE: THE WAFFLE. in black marker capitals.
- S29: MARISOL, ANSEL, PIP on the three name magnets, printed capitals.
- Nowhere else. The binder spine, the polo patch, the fridge cards, and the school calendar stay blank at this scale.

### 6.5 Running time check

Picture 0.0 to 90.0 exactly. Head black 0.5 and tail silence are inside the 90.0, so the file is 90.0 seconds and `trailerSeconds` in `content/shows.json` stays 90. The check is done twice: once on the animatic with the scratch track, once on the final mix. If the animatic runs long, the trim ladder, in order, each step taken only if the previous one was not enough, and each step logged with the writers: (1) S06 to 2.0 and S07 to 1.2; (2) S21 to 2.0; (3) S17 to 4.5 by starting the line before the door is fully open; (4) S27 to 4.0. Never trim: the pop and the held mouth (S04, S05), Renata's line 15, the sash (S30), the button (S31 to S34), the title card below 4.0. If the ladder is exhausted and the cut is still long, the writers cut a line; the editor does not.

### 6.6 Export settings

- Master: 1920 by 1080, 16:9, 24 frames per second constant, ProRes 422 HQ, 48 kHz 24-bit stereo, archived to the owner's storage, not the repo.
- Site file: `kitchen-court-trailer.mp4`, H.264 High profile, 8-bit 4:2:0, two-pass, target 10 Mbps, max 14 Mbps, keyframe every 48 frames, AAC-LC 48 kHz stereo 192 kbps, -16 LUFS integrated, -1.0 dBTP, moov atom at the head (fast start). Same settings for the poster frame source.
- Poster frame: `kitchen-court-poster.jpg`, 1920 by 1080, quality 85, taken from S30 (the sash on the cart, all six in frame, nobody's mouth open).
- Captions: `kitchen-court-trailer.vtt`, every line, speaker labels in capitals, sound cues in brackets (for example [toast pops], [whistle]).
- Mirror file: `kitchen-court-trailer-mirror.mp4`, the site file with the 3-second Click prepended, same encode.
- Filenames and paths are for the product builder; the URL that goes into `trailerUrl` is set by the site's asset host, not by this package.

---

## 7. Quality gate: 12 points before `content/shows.json`

The file does not get a `trailerUrl` until every item is checked and initialed by the person who checked it. Items 1 to 3 are the standards and counsel gates; a fail on any of them stops everything else.

1. **CG-03 signed.** Counsel sign-off on synthetic likenesses (six, three of them fictional children) and on the voice path is logged in `projects/08-compliance/out/gate-register.md` with a date and the attorney's name.
2. **Disclosure live.** The two-sentence disclosure (section 8), in the form counsel approved, is on the About page and the page is deployed before the trailer URL is set.
3. **Standards PASS.** The `standards` agent's report on the final file reads PASS with zero FAIL and zero WARN, using the report format in `canon/STANDARDS.md` section 5.
4. **Five tests logged.** Question, Two-Laugh, Cold, Dialogue (stopwatch percentage recorded), and Standards, per block bible section 8, with the names of the three cold readers and the sentence each wrote.
5. **Running time.** 90.0 seconds by the container's duration field, plus or minus 0.1. Title card holds at least 4.0 seconds.
6. **No generated text.** Every frame stepped through at the cut points: no generated glyph anywhere. All lettering is on the composite list in 6.4 and nowhere else.
7. **Face consistency.** Contact sheet of all face shots beside the six master portraits, reviewed by two people. Every face passes the five-landmark drift rule (2.6). Ages read: 44, 45, 73, 13, 10, 6. Log the shots that were regenerated.
8. **No real-person resemblance.** Each master portrait was checked by two reviewers and by a reverse image search. No match, no "reminds me of" note left unresolved.
9. **Sound levels measured.** Dialogue peak, toast pop peak, whistle peak, scrape peak, tap peak, and music maximum recorded in dB. Each effect at least 3 dB under dialogue peak. -16 LUFS integrated, -1.0 dBTP.
10. **No strobe.** The aerial, the pop, and the title card checked frame by frame: no light changes state more than once per second. No flicker in any generated clip.
11. **Never-appear list and IP.** No brand, no logo, no courtroom object, no block trademark, no existing show's expression, no real person, no readable text beyond 6.4. Hands checked: five fingers on every visible hand. The compliance IP re-check on the final cut is filed.
12. **Text and metadata exact.** Title card reads KITCHEN COURT, ANCHOR, Premieres Friday on STREETLIGHTS (or the Fork D name), FRIDAY NIGHT, "The account holder is a parent." The brand constant matches the site config. `trailerSeconds` is 90. The captions file matches the script word for word. The file has no metadata tags naming a tool, a person, or a location.

---

## 8. Disclosure draft for CG-03 (About page, two sentences)

Under the recommended voice path (section 4.3, Path C):

> The trailers on [BRAND] were made with AI image and video tools, directed shot by shot by our writers and editor, and every person on screen is an invented character: no real person's face was used, copied, or imitated. Every voice is a performance by an adult actor we hired, no child took part in or was recorded for any trailer, and no voice was synthesized.

If counsel clears a different voice path, the second sentence changes: for Path B, "The voices are performed by actors we hired, including child actors working under their state's rules, and no voice was synthesized." For Path A, "The voices were synthesized under our direction, no real person's voice was cloned, and no child's voice was used as a source." Counsel picks the final wording. `[BRAND]` resolves at Fork D.

---

## Standards read

Walked against `canon/STANDARDS.md` section 2, items 1 to 15, as a production document: no item triggered. Item 15 (AI performance without a gate and a disclosure) is the subject of this package and is addressed by sections 4, 7, and 8. Section 3: soft rule 8 in 5.3, soft rule 9 in 5.4. Section 4: no em dash in this file, and the title card carries the parent line. The `standards` agent's pass is still required on the finished file.
