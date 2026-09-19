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

Paste verbatim. Do not paraphrase. Do not add adjectives.

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
