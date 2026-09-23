# The Returns Desk. AI-assisted trailer production package.

Slot 4, Lights Out. Running time 120 seconds. Co-lead for production (D-020).

Trailer production lead output against `projects/04-writers-room/out/scripts/L1-the-returns-desk-trailer.md`, `L1-the-returns-desk-character-sheet.md`, `L1-the-returns-desk-cold-open.md`, the bible's production note (`projects/04-writers-room/out/bibles/L1-the-returns-desk.md` section 11), the block bible (`projects/03-block-format/out/block-bible.md` sections 4.2 to 4.4 and 8), the identity brief (`projects/02-brand/out/identity-brief.md` sections 4 to 6), `canon/STANDARDS.md`, and `DECISIONS.md` D-013 and D-014.

Who uses this file. The owner, who runs the image and video generation tool (Codex, per D-014). An editor, who cuts the file. Six voice performers, who get section 4 only. The `standards` and `compliance-gate` agents, who get sections 7 and 8.

Gate status. CG-03 is triggered (D-014). Every generated frame in this package is logged under CG-03. The finished file runs privately for the owner and testers. It does not go public until an attorney signs CG-03 and the section 8 disclosure is on the About page.

## 0. How to work this package

Do the steps in this order. Condition before action.

1. Read section 1. Copy the style anchor and the set tokens into the tool's saved prompt library. They prefix every image prompt.
2. Build the plates (section 2, workflow steps 1 and 2). No people. Approve one gold plate per setup.
3. Build the character references (section 2, workflow steps 3 and 4). Approve one gold portrait per character.
4. Generate the stills for section 3, one shot at a time, with the gold plate and the gold portraits attached as reference images. Approve each still before any motion.
5. Generate a motion clip for each approved still. Clips are 3 to 6 seconds. On-screen duration can be shorter. The editor trims. Nobody speed-ramps.
6. Record the voices (section 4). Owner scratch first, performers second.
7. Cut (section 6). Mix (section 5).
8. Run the gate (section 7). Only a file that passes all 12 points goes to `projects/05-product/site/content/shows.json`.

Naming. `L1_S07_still_v03.png`, `L1_S07_clip_v03.mp4`. Every version stays in the CG-03 log with its prompt, references, seed, and tool version.

Brackets. Prompts in section 3 use bracket tokens such as `[ANCHOR]` and `[MARGUERITE]`. Expand every bracket before pasting. The tool never sees a bracket.

## 1. Look bible

### 1.1 Visual intent

The Returns Desk looks like a quiet single-camera comedy shot on a real set with real lamps, not like a generated mood board. One room, three locked frames, one warm lamp. The dark in the frame is ordinary dark: the kind a viewer has in their own hallway, with detail in the shadows and nothing hidden in them. Warm amber at the desk meets cool green-white fluorescent in the front of the store and blue-black at the far end of the paint aisle. Nothing glows that is not a lamp. Nothing flickers. The camera does not move unless the shot says "slow push," and then it barely moves. The comedy is stillness, so the picture is still. A parent on a phone at night must be able to read the shelf, the tags, and every face. If a frame is too dark to read on a phone, it is too dark.

### 1.2 Style anchor

Paste this sentence at the start of every image prompt. It is `[ANCHOR]`.

`[ANCHOR]` = "Cinematic still from a quiet single-camera family comedy, photographed on a full-frame digital cinema camera with a 40mm prime lens at T2.8, eye level, tripod-locked, natural perspective. Low-key practical lighting that stays readable: one warm gooseneck desk lamp as the key light, cool green-white fluorescent tubes in the front half of the store as soft fill, deep clean shadows with visible detail, no crushed blacks. Naturalistic color: warm amber against cool fluorescent, Rec.709, accurate skin. No film grain, no noise, no texture overlay, no vignette, no haze, no fog, no lens flare, no bloom, no strobe, no flicker, no motion blur, no stylization. Widescreen 16:9, 1920 by 1080."

Lens overrides. Setup B (item close-ups) replaces "40mm prime lens at T2.8, eye level" with "60mm macro lens at T4, from directly above the counter, slightly angled." The peephole insert replaces it with "circular fisheye lens, the dark rim of a door peephole visible at the edges." Everything else in the anchor stays.

### 1.3 The dark identity set

Paste after the anchor in every store shot. It is `[SET]`. Trim to the part of the room the shot sees.

`[SET]` = "Interior of a small neighborhood hardware store at night. An L-shaped returns counter of yellowed laminate with a chipped front edge and a brass edge strip worn silver where elbows rest, waist high. On the counter: a domed brass service bell on the short leg, a spindle spike of receipts, a tape dispenser on a chain, a tray with two wooden-handled rubber stamps, a cardboard box of manila tags on string, a cup of mismatched pens. One warm gooseneck lamp clamped to the long leg. Behind the counter, floor-to-ceiling industrial metal shelving on a pegboard wall holding ordinary hardware, each item with a handwritten manila paper tag tied on with string: a wind-up kitchen timer, a rain gauge, a push broom, a bath plug, a rake, a coil of rope, a plunger, a set of house numbers, a rolled doormat. At the top left corner of the shelving, one older tag, yellowed and brown at the edges, string gone gray, blank. A round shop clock above the shelf. Far left of the room: a glass front door with a spring bell on a bracket, and beside it a plate-glass window with soft-focus reversed gold-leaf shapes, one streetlight and a rail spur outside, faint sodium orange far off. Between the counter and the front door: a dented cream-enamel chest-style commercial ice machine with a hand-lettered cardboard sign taped to the lid, a glass jar of coins beside it, a metal scoop on a hook. Beyond the desk's far end: a gray swinging door with a round porthole window and a small gray intercom box with a red indicator lamp on the wall beside it. Upstage: aisles of paint cans running away into darkness, fluorescent tubes lit in the front half of the store only. No faces at the window. No people unless named."

Palette, fixed. Lamp amber at the desk. Green-white fluorescent in the front. Blue-black at the far end of the aisle. Sodium orange through the window only. Maroon vests. Manila tags. The dark set from the identity brief section 4 (paper #15130F, ink #EFE6D3, glow #FFD08A) is for the title card only, never for the picture.

### 1.4 The three things that never appear

1. Text in frame, except the STORY HEARD stamp impression as a prop. Every other written thing the story needs (the poster board in the peephole insert, the ledger columns, the tags, the store window, the ICE sign, the name tag) is generated as unreadable, out of focus, or blank, and any legible text the viewer must read is composited in the edit from a real hand-lettered element the owner photographs. Generated lettering is the first thing a viewer spots as generated.
2. Brand logos, product marks, or real signage of any kind. The vest patch is a faded stitched shape. The chime is a plain white box. The raincoat has no label.
3. Real people. No frame may resemble a real actor or a real person. If a generated face resembles someone, discard the frame and regenerate from the gold reference (character sheet rule 1, STANDARDS hard rule 14). No real child's likeness is generated for any reason (bible section 11).

Negative list for the tool, every prompt: "text, letters, words, numbers, logos, watermark, signature, film grain, noise, texture overlay, vignette, lens flare, bloom, haze, smoke, fog, strobe, flicker, motion blur, extra fingers, duplicated people, faces at the window, dolls, masks, mirrors, weapons, blood."

### 1.5 Format

16:9. 1920 by 1080. Generate native 16:9 at that size or larger, then downscale. Never upscale a face. Never crop a still to change its framing after approval; regenerate instead. 24 frames per second for every clip.

## 2. Character consistency kit

### 2.1 Reference-first workflow

1. Generate the set plates with no people: Setup A view, Setup B counter-top, Setup C view, the ice machine wall, the window from inside, the dark shelf with the lamp off. Prompt: `[ANCHOR] [SET]` plus the view. Make six candidates per plate. Pick one gold plate per view. Lock it.
2. Check each gold plate against section 2.4 (fixed positions). If the swinging door, the stool, the ice machine, or the front door is in the wrong place, regenerate. Do not proceed with a plate that puts the door on the wrong wall. Every later frame inherits the error.
3. Generate each master portrait (section 2.2) on a plain mid-gray background with the store's lamp light, three views (section 2.3). Make eight candidates. Pick one gold portrait per character. Reject any candidate that resembles a real person.
4. Log the gold set: file, prompt, seed, tool version. This is the CG-03 asset log's first entry.
5. Generate every shot still with the gold plate and the gold portrait of each person in the shot attached as reference images, plus the shot prompt from section 3. Never generate a character from text alone once a gold exists.
6. Approve the still against the three-point drift check (section 2.5). Then, and only then, generate motion from it.
7. Generate motion from the approved still as the first frame. If a clip's last second drifts, use only the part that holds.

### 2.2 Master portrait prompts

Each prompt is `[ANCHOR]` plus the token block below plus "Portrait on a plain mid-gray background, lit by one warm desk lamp from the front left and a cool fluorescent fill from above. Head and shoulders, then waist up, then full figure." The token block is also the character token used in section 3.

`[MARGUERITE]` = "Marguerite, a woman of 63, medium height, solid through the shoulders, wide face with a square jaw, heavy-lidded dark brown eyes that take their time, deep lines beside the mouth, no makeup, warm olive-brown skin weathered on the hands only, short nails, a thin plain silver band on the right hand. Thick steel-gray hair with darker gray underneath, cut blunt at the jaw, one side tucked behind the ear with a yellow pencil behind that ear. Tortoiseshell reading glasses on a beaded chain, worn low on the nose and looked over. Wearing a maroon store vest with a faded stitched patch on the chest over a plain oatmeal long-sleeve shirt with the sleeves pushed to the forearm, a strip of masking tape as a name tag with unreadable handwriting. A gray cardigan hangs on the back of her stool, never worn. Seated, elbows on the brass counter edge, weight forward, hands folded or holding a pen. Calm. Never surprised."

`[DESMOND]` = "Desmond, a man of 41, medium build, average height, a soft tired face that has been awake too long, dark hair standing in several directions, clean shaven, light brown skin. Wearing a tan raincoat over a plaid flannel pajama top, jeans pulled on in a hurry, slip-on shoes. Standing at the counter holding its edge with both hands, or holding a shoebox in both hands the way a person carries a pie. Reasonable and worried. Never foolish."

`[TEDDY]` = "Teddy, a boy of 16, tall and thin, has not grown into his hands or feet, shoulders up around his ears, long pale freckled face, ears that stick out and go red, one eyebrow slightly higher than the other, reddish-brown curly hair flattened on one side. Wearing a maroon store vest too short in the body over a plain gray T-shirt, work pants with a tape measure clipped to the belt, high-top sneakers, a headlamp worn around his neck and never on his head. Holding a push broom upright in front of him like a railing, both hands on the handle. A wide easy smile that arrives late."

`[QUAYLE]` = "Mr. Quayle, a man of 74, tall, narrow, stooped from the neck so the head arrives first, long fine-boned face, a precisely trimmed white mustache, hooded pale gray eyes, thin nose, brown papery skin, thin white hair combed wet with a visible comb line. Holding a flat tweed cap in his left hand. Wearing a tweed sport coat over a buttoned cardigan over a shirt buttoned to the collar, no tie, pressed trousers, polished brown shoes. Standing perfectly straight at the counter, hands folded on the item in front of him, patient as furniture."

`[DOLORES]` = "Dolores, a woman of 41, medium height, strong through the arms and back, light brown skin, black hair pulled back hard into a bun with a pencil pushed through it, level dark eyebrows, tired quick eyes, a smear of box dust on one cheekbone. Wearing a canvas work apron with deep pockets over a rolled-sleeve flannel shirt, one work glove on and one in the apron pocket, a dock headset around her neck, steel-toe boots, a roll of packing tape on her wrist like a bracelet. Holding a swinging door open with her shoulder, never fully through it. In charge of the room from its edge."

`[NIEVES]`. Nieves is 12. Read section 2.6 before generating anything with this token. It is a reference for the art department and for back-view framing only. It is never rendered as a front-facing photoreal child portrait.

`[NIEVES]` = "A slight 12-year-old girl, clearly a child and not a small adult: a child's proportions, small for twelve, straight up and down, all elbows and knees, no makeup, no jewelry, no styling. One long black braid down the back with a yellow pencil pushed through it. Wearing a mustard yellow hooded sweatshirt two sizes too big with the sleeves pushed past the elbow and sliding down, a striped long-sleeve shirt showing at the cuffs, jeans, sneakers with one lace double-knotted and one untied, a lanyard with a laminated card. Perched on a tall wooden stool at the far end of the counter, one foot hooked on the rung, the other swinging. A green cloth ledger open in front of her with a small clip-on reading light. Seen from behind and to the side, face turned down to the ledger or away to the shelf. Her face is not visible."

### 2.3 Turnaround note

For each adult and for Desmond, generate three views from the gold portrait as reference: front, three-quarter left, profile left. Setup A sees Marguerite in three-quarter right and the customer in three-quarter left, so add three-quarter right for Marguerite and profile right for Desmond and Mr. Quayle. Setup C sees Marguerite from behind, so add a back view of Marguerite: the blunt gray hair, the tucked side, the pencil, the vest collar. Dolores needs front and three-quarter only; she is always in the door. Teddy needs front, three-quarter, and a profile facing left toward the ice machine. Nieves needs back and back three-quarter only.

Every turnaround view is checked against the front gold with the three-point test before it enters the reference set.

### 2.4 Fixed positions

Plan of the room, as the camera sees it.

- The counter's long leg runs parallel to the camera in Setup A. The gooseneck lamp is clamped at its right end. Marguerite's stool is at the lamp. Her frame is right.
- The counter's short leg turns toward the front door at the left. The customer's mark is at the corner of the two legs, on the customer side, with the domed service bell at the customer's left hand. The customer's frame is left.
- Nieves's tall stool is at the far end of the long leg, staff side, past the lamp. In Setup C (over Marguerite's left shoulder) she is frame right, and beyond her on the same wall is the swinging door with the porthole and the intercom box.
- The ice machine is on the wall between the counter's short leg and the front door. In a wide Setup C that pans toward the door, it is frame left.
- The front door and the window are the far left of the room. Aisle 12 is upstage center, behind everything, running away into the dark.
- Setup A: camera on the customer side, slightly low, so the counter top is at chest height and Marguerite's face is the calm half of the frame. Setup B: camera above the counter, straight down or slightly angled, at the lamp. Setup C: camera behind Marguerite's left shoulder, high enough to see over it, looking toward Nieves's end, with the door and window in the background at the left.

These positions never change between shots. The gold plates carry them. Any still that contradicts a gold plate is rejected on sight.

### 2.5 The drift rule

A face has drifted when any one of three points fails against the gold portrait at the same angle:

1. Face shape and eye set: jaw width, eye spacing, brow line.
2. Hair mass and part: Marguerite's blunt jaw-length cut and tucked side, Teddy's flattened curls, Mr. Quayle's comb line, Dolores's hard bun.
3. Constant costume tokens present: the pencil, the glasses chain, the silver band, the patch, the headlamp, the tape measure, the cap in hand, the glove, the packing tape.

When a face drifts, regenerate the whole still from the gold references. Never repair a drifted face by editing the drifted frame. Never blend two references. Never use a photograph of any real person as a reference or as a face source (STANDARDS hard rule 14). If two reviewers disagree on a drift, the frame is drifted.

### 2.6 Nieves: age cues and supervision framing

Rules, in order of authority.

1. The bible (section 11) says no likeness of any real child is generated for any reason. The character sheet (rule 3) says do not generate a photoreal child; draw her, or frame her stool and ledger with the seat empty.
2. The tournament ruling (D-020) says the show needs a kid at the desk to root for, and the trailer script gives Nieves fourteen lines.
3. This package reconciles the two with two modes. The Orchestrator picks the mode. Counsel confirms it under CG-03 before public release.

Mode A (recommended for v1). Nieves is present as a figure whose face is never resolved. She is seen from behind or from a back three-quarter angle, face turned to the ledger or the shelf, never front-on, never in profile closer than a full figure, never larger than one third of frame height, never in a close-up. Her hands may enter a Setup B frame with a pen when Marguerite's hand is already in the frame. Her voice is a performer's (section 4). The age cues that make her read as 12 without a face: the child's proportions, the oversized hoodie, the braid with the pencil, the swinging foot on the stool, the untied lace, the clip light on the ledger, the small hand beside Marguerite's large one.

Mode B (fallback if counsel rejects any generated child figure). The stool is empty in every frame, the ledger is open with the clip light on, and her lines play off screen from the far end of the counter. Marguerite's eyeline carries her. Shots S07, S13, S20, S21, S22, S27, and S29 change to the empty stool and the ledger, with her hand allowed in S14 and S23 only. The edit and the sound do not change.

Supervision framing, both modes (STANDARDS hard rule 6, the script's own rule). Every frame that contains Nieves or her stool also contains Marguerite (her seated figure or her shoulder and pencil) or the swinging door with the porthole shadow or Dolores in it. Nieves is never framed with the mouth of Aisle 12 behind her alone. She is never in a Setup B frame alone. She never leaves the desk area; her longest walk is the staff side of the counter to the shelf, with Marguerite a pen's length away and in frame.

## 3. Shot list

Thirty-seven shots. Timecodes are running time from the first frame of picture. Every still uses `[ANCHOR]`, the relevant part of `[SET]`, and the character tokens named. Every motion prompt is image-to-video from the approved still, 24 frames per second, 1920 by 1080, generated at 3 to 6 seconds and trimmed to the on-screen duration in the edit. "Static" means the camera does not move. "Slow push" means the framing tightens by about 3 percent across the clip and no more.

Read the voice plan (section 4) before generating any shot with a speaking face. The v1 plan does not rely on lip sync. Where a speaker is on camera, the motion prompt asks for small mouth motion and the edit favors the listener.

### Beat 1. Cold open. 0:00.0 to 0:10.0

**S01.** 0:00.0 to 0:03.5 (3.5 s). Setup B, top-down. Static. Nobody on camera.
Action: on yellowed laminate in the lamp pool, a white plastic wireless doorbell chime, its button taped to a scrap of cardboard with blue painter's tape, a shoebox lid, a receipt folded into eighths.
Dialogue: MARGUERITE (O.S.) "Returns?" DESMOND (O.S.) "It rings." MARGUERITE (O.S.) "They do."
Sound: fluorescent hum, the cannery far off. No music.
Image prompt: "[ANCHOR, Setup B lens] [SET, counter top only] A plain white plastic wireless doorbell chime unit lies on the yellowed laminate under the warm gooseneck lamp. Beside it its small white button, taped to a torn scrap of brown cardboard with blue painter's tape. A shoebox lid. A paper receipt folded small into a thick square. Warm lamp pool at center, cool fluorescent falling off at the edges. No hands. No text legible on the chime."
Motion prompt: "Static camera. Nothing moves except an almost invisible drift of warmth on the laminate and the receipt's top fold settling. No hands enter. 4 seconds."

**S02.** 0:03.5 to 0:07.5 (4 s). Setup B, tighter on the chime's face and its small indicator. Static. Nobody on camera.
Action: a beat of silence. The indicator glows once. The doorbell rings.
Dialogue: DESMOND (O.S.) "When nobody's there."
Sound: at 0:06.0 the indicator glows once and the chime rings two plain notes, at or below the dialogue peak.
Image prompt: "[ANCHOR, Setup B lens] Close on the front face of a plain white plastic wireless doorbell chime lying on yellowed laminate in warm lamp light. A small round indicator lamp on its face, unlit. A speaker grille of small holes. The blue painter's tape and cardboard scrap at the edge of frame. No text."
Motion prompt: "Static camera. At the midpoint the small indicator glows once, soft green, for half a second, then goes dark. Nothing else moves. No flicker. 4 seconds."

**S03.** 0:07.5 to 0:10.0 (2.5 s). Setup B, the S01 framing (reuse the S01 still, new clip). Static.
Action: off screen, a cardboard box lands on a floor, softer than the ring.
Dialogue: TEDDY (O.S.) "That's fine. That's fine."
Sound: the box thud, below the ring. Cut on the second "fine."
Image prompt: the S01 still.
Motion prompt: "Static camera. One second in, the shoebox lid rocks once by a millimeter as if the floor shook slightly, then settles. Nothing else. 3 seconds."

### Beat 2. World. 0:10.0 to 0:26.0

**S04.** 0:10.0 to 0:14.5 (4.5 s). Setup A, wide. Slow push. Marguerite, Desmond.
Action: Marguerite writes a manila tag in a slow hand and does not look up. Desmond stands at the customer's mark, hands at his sides, the open shoebox beside the service bell. The full shelf behind her.
Dialogue: MARGUERITE "Hardison's. Ambler Street. Open all night. Everything comes back eventually."
Sound: room tone; the pen on paper.
Image prompt: "[ANCHOR] [SET, Setup A view] [MARGUERITE] seated frame right at the gooseneck lamp, writing on a manila tag, head down. [DESMOND] standing frame left at the counter's corner beside the brass service bell, an open shoebox on the counter in front of him. Behind her the full Shelf of Returned Things with its handwritten tags, warm on the low shelves, cool in the middle, the top shelf catching streetlight. Camera slightly low, from the customer side."
Motion prompt: "Very slow push in, about 3 percent over the clip. Marguerite's pen hand moves across the tag; her head stays down. Desmond breathes and shifts his weight once. The shelf does not move. 5 seconds."

**S05.** 0:14.5 to 0:17.0 (2.5 s). Setup A, one step tighter on the same axis. Static. Marguerite, Desmond.
Action: Desmond glances toward the window and back. Marguerite lifts her eyes over the glasses without lifting her head on "shelf."
Dialogue: DESMOND "Is that on the sign?" MARGUERITE "It's on the shelf."
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view, tighter] [MARGUERITE] frame right, pen paused on the tag, eyes lifting over her reading glasses. [DESMOND] frame left, head turned a few degrees toward the front window. The shelf soft behind her. Same lighting as the wide."
Motion prompt: "Static camera. Desmond's head turns slightly toward the window then back to her. Marguerite's eyes come up over the glasses without her head moving; her lips move slightly. 3 seconds."

**S06.** 0:17.0 to 0:19.5 (2.5 s). Setup C, wide. Static. Marguerite (shoulder), Nieves (Mode A, from behind), Dolores (shadow only).
Action: the intercom clicks. A shadow crosses behind the porthole. The intercom's red indicator glows steadily during the line, then off.
Dialogue: DOLORES (V.O., through the intercom) "Nieves. Desk?" NIEVES "Desk."
Sound: intercom click on, the line with a small speaker's color, click off, all at talking volume.
Image prompt: "[ANCHOR] [SET, Setup C view] Over the left shoulder of [MARGUERITE], her gray hair, tucked side, and yellow pencil soft in the lower right corner. Across the room the glass front door and the plate-glass window with soft-focus reversed gold-leaf shapes, one streetlight outside. At the far end of the counter, frame right, [NIEVES] on her tall stool from behind, ledger open, pen up, the clip light on the page. Beyond her the gray swinging door with its round porthole, a soft shadow behind the glass, and the small gray intercom box with a red indicator on the wall beside it."
Motion prompt: "Static camera. Behind the porthole a soft shadow crosses once, left to right, at walking pace. The intercom's red indicator glows steadily for two seconds then goes dark; it does not blink. Nieves's pen hand lifts a few centimeters. Nothing else moves. 4 seconds."

**S07.** 0:19.5 to 0:23.5 (4 s). Setup C, Nieves end. Static. Marguerite (shoulder), Nieves (Mode A).
Action: Nieves taps the ledger's four columns with the pen, one per word.
Dialogue: NIEVES "Item. Claim. Clue. Cause." MARGUERITE (O.S.) "She has a system." NIEVES "You have a stamp."
Sound: four soft pen taps.
Image prompt: "[ANCHOR] [SET, Setup C view, tighter on the far end of the counter] [MARGUERITE]'s left shoulder, vest collar, and pencil behind the ear soft in the lower right corner. [NIEVES] from behind at a back three-quarter angle, face turned down to the green cloth ledger, the braid with the pencil down her back, the oversized mustard hoodie sleeve slid to the elbow, the pen tip resting on the page, the clip light on the ledger. The ledger's ruled columns visible but unreadable. The swinging door and porthole beyond her."
Motion prompt: "Static camera. The pen taps the page four times, evenly spaced. The braid shifts once. The hoodie sleeve slides down her forearm. Her face stays turned away. 4 seconds."

**S08.** 0:23.5 to 0:26.0 (2.5 s). Setup B, the stamp. Static. Marguerite's hand only.
Action: the hand-cut rubber stamp comes down on a printed return form. Wet red ink. STORY HEARD.
Dialogue: none.
Sound: the stamp's dry thud, below the dialogue peak.
Image prompt: "[ANCHOR, Setup B lens] [SET, counter top only] [MARGUERITE]'s right hand with the thin silver band gripping a wooden-handled rubber stamp worn pale where the thumb sits, pressed onto a plain printed return form on the laminate. The impression under the stamp's edge in wet red ink, hand-cut letters reading STORY HEARD, slightly uneven. Warm lamp light. This is the one place lettering may be generated."
Motion prompt: "Static camera. The stamp descends, presses, and lifts, revealing the wet red impression; the ink is glossy. The hand exits upward. 3 seconds."
Note: if the generated letters misspell, composite a real impression from a real stamp the owner has made, photographed on the same laminate.

### Beat 3. Character. 0:26.0 to 1:07.0

**S09.** 0:26.0 to 0:30.5 (4.5 s). Setup A. Static. Marguerite, Desmond, Nieves (sleeve and pen at the far left edge only).
Action: Desmond leans on the counter with both hands. Marguerite has not moved. A mustard sleeve and a pen at the far left edge of frame.
Dialogue: DESMOND "It rang eleven times. I counted. Nobody on the porch. I looked through the peephole."
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view] [DESMOND] frame left leaning on the counter with both hands, weight forward. [MARGUERITE] frame right, seated, still, pen resting. At the far left edge of frame, only a mustard yellow hoodie sleeve and a pen tip entering, nothing else of the child. The shelf behind."
Motion prompt: "Static camera. Desmond's weight comes forward onto his hands; his head dips and comes back up; his lips move slightly. Marguerite does not move. The sleeve at the edge holds. 5 seconds."

**S10.** 0:30.5 to 0:35.0 (4.5 s). Insert, peephole point of view. Lens override: fisheye. Static. Nobody on camera.
Action: one porch light. An empty porch, a coir doormat, the doorbell button beside the door frame. Across the quiet street, a house with one upstairs window lit. Propped inside that window, a white poster board (blank in generation; the marker text HOW FAR CAN MY SIGNAL GO? is composited in the edit from a real hand-lettered board the owner photographs). A coat-hanger antenna taped to the sill below it. The doorbell rings. The porch stays empty. Hold.
Dialogue: DESMOND (V.O.) "I looked through the window. I looked under the mat."
Sound: at 0:32.0 the doorbell rings two notes at dialogue level. Room tone: a far sprinkler, a fridge. No drone. No stinger.
Image prompt: "[ANCHOR, fisheye override] A residential front porch at night seen through a door peephole, strong circular fisheye distortion, the dark rim of the peephole at the edges. Lit by one porch light above the door. An empty coir doormat. A plain doorbell button beside the door frame. Across a quiet residential street, a two-story house with one upstairs window lit; propped inside that window, a plain white poster board with no writing on it, and a bent wire coat-hanger taped to the window sill below it as an antenna. Still, ordinary, slightly uneasy. No people. No faces. No shadows of people."
Motion prompt: "Static camera. Nothing on the porch moves. A single leaf on the doormat lifts a centimeter and settles. The porch light's halo holds steady. Across the street nothing moves. No figure, no shadow, nothing approaches. 5 seconds."

**S11.** 0:35.0 to 0:38.5 (3.5 s). Setup A. Static. Marguerite, Desmond.
Action: Marguerite nods once, a centimeter. Desmond's hands lift and land.
Dialogue: MARGUERITE "Good. That's thorough." DESMOND "My wife said I was being ridiculous under the mat."
Sound: room tone.
Image prompt: the S09 still without the sleeve at the edge: "[ANCHOR] [SET, Setup A view] [DESMOND] frame left, both hands on the counter, looking at her. [MARGUERITE] frame right, seated, a small nod in progress, eyes on him over the glasses."
Motion prompt: "Static camera. Marguerite nods once, barely. Desmond's hands lift off the counter and land again as he speaks; lips move slightly. 4 seconds."

**S12.** 0:38.5 to 0:41.5 (3 s). Setup A, favoring Marguerite. Static. Marguerite, Desmond's shoulder.
Action: she looks over the glasses at him on "twelve."
Dialogue: MARGUERITE "Your wife hasn't heard four hundred and twelve of these."
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view, tight] [MARGUERITE] in a medium close-up, frame right, seated, looking over her reading glasses, mouth nearly closed, the pencil behind her ear, the lamp warm on the left side of her face. [DESMOND]'s raincoat shoulder soft at the left edge of frame."
Motion prompt: "Static camera. Her eyes hold on him; her lips move slightly; a small breath. Nothing else. 3 seconds."

**S13.** 0:41.5 to 0:45.5 (4 s). Setup C, Nieves end. Static. Nieves (Mode A), Marguerite (shoulder).
Action: Nieves comes up off the stool onto both forearms and leans across the counter toward the customer, seen from behind.
Dialogue: NIEVES "Three questions. Where's the porch. Where's the street. Who lives across it." DESMOND (O.S.) "A kid. Why?"
Sound: the stool creaks.
Image prompt: "[ANCHOR] [SET, Setup C view, far end] [MARGUERITE]'s left shoulder and pencil soft in the lower right corner. [NIEVES] from behind, up off the stool on both forearms, leaning across the counter toward the customer side, the braid down her back, the hood bunched at her neck, one sneaker with an untied lace on the stool rung, the pen in her hand. Face away from camera. The swinging door beyond her."
Motion prompt: "Static camera. In the first second she rises onto her forearms and holds there. The pen turns in her fingers. The sleeve slides. Her face stays away. 4 seconds."

**S14.** 0:45.5 to 0:48.0 (2.5 s). Setup B, hands. Static. Marguerite's hand, Nieves's hand.
Action: Marguerite's hand lies flat on the counter beside the shoebox, already in frame. Nieves's smaller hand with the pen enters from the top of frame and writes three short strokes in the ledger.
Dialogue: DESMOND (O.S.) "Why did she write that down?"
Sound: pen on paper.
Image prompt: "[ANCHOR, Setup B lens] [SET, counter top only] [MARGUERITE]'s large weathered right hand with the silver band lying flat on the laminate beside the open shoebox. From the top of frame a child's smaller hand in a mustard yellow sleeve holds a pen over the open green cloth ledger. The ledger's ruled columns visible, handwriting unreadable. Warm lamp light."
Motion prompt: "Static camera. The small hand writes three short strokes and stops. The large hand does not move. 3 seconds."

**S15.** 0:48.0 to 0:52.5 (4.5 s). Setup A. Static. Marguerite, Desmond.
Action: on "I have," Desmond pats the raincoat and produces the folded receipt. Marguerite's eyes stay on the tag.
Dialogue: MARGUERITE "Store policy says receipt required. My policy says story required." DESMOND "I have the receipt." MARGUERITE "Then you're halfway."
Sound: paper.
Image prompt: "[ANCHOR] [SET, Setup A view] [MARGUERITE] frame right, seated, eyes down on the tag she is writing, speaking without looking up. [DESMOND] frame left, one hand at his raincoat pocket, a small folded paper square between finger and thumb."
Motion prompt: "Static camera. Desmond pats the pocket and lifts the folded receipt into view. Marguerite's pen keeps moving; her lips move slightly; she does not look up. 5 seconds."

**S16.** 0:52.5 to 0:55.0 (2.5 s). Setup C, wide toward the front door. Static. Mr. Quayle, Desmond's back.
Action: Mr. Quayle is one step inside the door, the door settling closed behind him, the spring bell still moving on its bracket, the streetlight behind him through the glass, cap already in his left hand, flashlight upright in his right hand like a candle. He takes one step toward the counter.
Dialogue: none.
Sound: the front door bell, at talking volume.
Image prompt: "[ANCHOR] [SET, Setup C view panned to the front door] [QUAYLE] one step inside the glass front door, the door nearly closed behind him, the spring bell on its bracket mid-swing, the streetlight and rail spur behind him through the glass, tweed cap already in his left hand, a plain metal flashlight held upright in his right hand with its beam on the ceiling. [DESMOND]'s raincoat back soft at the left edge of frame in the foreground."
Motion prompt: "Static camera. The door closes its last few degrees; the bell bracket swings and stops. Mr. Quayle takes one unhurried step toward the counter. The flashlight beam on the ceiling holds steady, no flicker. 3 seconds."

**S17.** 0:55.0 to 0:58.5 (3.5 s). Setup A, three at the counter. Static. Mr. Quayle, Desmond, Marguerite.
Action: Mr. Quayle at the customer's left, beside Desmond, the flashlight set upright on the counter, cap in hand, hands folded.
Dialogue: QUAYLE "I'd like to return this flashlight. It's showing me things." MARGUERITE "What things?"
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view, wide enough for three] [QUAYLE] frame left, standing perfectly straight, cap in his left hand, the plain flashlight standing upright on the counter in front of him with its beam on the ceiling, hands folded beside it. [DESMOND] center left, half a step back, watching him. [MARGUERITE] frame right, seated, head turned two degrees toward the newcomer."
Motion prompt: "Static camera. Mr. Quayle's chin lifts one degree as he speaks; lips move slightly. Marguerite's head turns two degrees toward him. Desmond does not move. 4 seconds."

**S18.** 0:58.5 to 1:01.0 (2.5 s). Setup A, tighter on Mr. Quayle. Static. Mr. Quayle, Desmond's shoulder.
Action: he sets a receipt on the counter and smooths it flat with both hands.
Dialogue: QUAYLE "Mostly the garage. But at night."
Sound: paper on laminate.
Image prompt: "[ANCHOR] [SET, Setup A view, tight] [QUAYLE] in a medium shot, frame left, both long careful hands smoothing a small paper receipt flat on the counter beside the upright flashlight, cap tucked under one arm, face calm. [DESMOND]'s shoulder soft at the right edge."
Motion prompt: "Static camera. The hands smooth the paper twice, slowly. The face stays steady; lips move slightly. 3 seconds."

**S19.** 1:01.0 to 1:05.0 (4 s). Setup B, Mr. Quayle's hands. Static. Hands only.
Action: his hands folded on the flashlight's base, the wrong receipt smoothed flat beside it, the tweed cuff and cardigan sleeve visible.
Dialogue: QUAYLE (O.S.) "I have the receipt. It's for a rake. I feel it's the same spirit."
Sound: room tone.
Image prompt: "[ANCHOR, Setup B lens] [SET, counter top only] An elderly man's long, careful brown hands folded on top of the base of a plain upright metal flashlight standing on yellowed laminate, a tweed coat cuff and a cardigan sleeve visible, a small paper receipt smoothed flat beside the flashlight, its print unreadable. Warm lamp light from the right."
Motion prompt: "Static camera. The fingers tighten once and relax. Nothing else. 4 seconds."

**S20.** 1:05.0 to 1:07.0 (2 s). Setup C, Nieves end. Static. Nieves (Mode A), Marguerite (shoulder).
Action: Nieves finishes a stroke without looking up, hugs the ledger to her chest, and drops off the stool to the floor.
Dialogue: NIEVES "Cause pending."
Sound: the stool rung, sneakers on the floor.
Image prompt: "[ANCHOR] [SET, Setup C view, far end] [MARGUERITE]'s shoulder and pencil soft in the lower right. [NIEVES] from behind, sliding off the tall stool with the green ledger hugged against her chest, one sneaker reaching the floor, the braid swinging, face turned toward the shelf and away from camera."
Motion prompt: "Static camera. She slides off the stool onto both feet and turns toward the shelf, the ledger against her chest. Face stays away. 3 seconds."

### Beat 4. Turn. 1:07.0 to 1:29.0

**S21.** 1:07.0 to 1:11.0 (4 s). Setup C, wide on the shelf side. Static. Nieves (Mode A), Marguerite.
Action: Nieves walks the staff side of the counter to the shelf, from behind. Marguerite stays seated, a pen's length away, in frame, and turns her head to follow. Nieves stops at the shelf and tilts her head up to read the tags.
Dialogue: NIEVES "Timer. Grandmother wound it. Rain gauge. Neighbor's sprinkler. Rake."
Sound: sneakers on tile.
Image prompt: "[ANCHOR] [SET, Setup C view widened to the shelf] [MARGUERITE] seated at the lamp, frame right, head turned to watch. [NIEVES] from behind, three steps away along the staff side of the counter, stopped at the foot of the tall shelving, ledger against her chest, head tilted up to read the handwritten tags on the timer, the rain gauge, and the rake. The tags' handwriting unreadable at this distance. Lamp warm on the low shelves, streetlight on the top."
Motion prompt: "Static camera. She takes three slow steps and stops at the shelf; her head tilts up. Marguerite's head turns to follow her. 5 seconds."

**S22.** 1:11.0 to 1:14.0 (3 s). Setup C, tighter on the shelf. Static. Nieves (Mode A), Marguerite (shoulder).
Action: her finger touches the rake's tag. The tag swings once on its string.
Dialogue: NIEVES (reads) "Gate. Wind." MARGUERITE "Mr. Quayle's." QUAYLE (O.S.) "I still feel it was the gate."
Sound: the tag's string.
Image prompt: "[ANCHOR] [SET, the shelf] [NIEVES] from behind at a back three-quarter, face away, one small hand in a mustard sleeve touching the manila tag tied to a rake on the middle shelf. [MARGUERITE]'s shoulder and pencil soft in the lower corner. Other tagged items around: a bath plug, a coil of rope, house numbers. Handwriting unreadable."
Motion prompt: "Static camera. The finger touches the tag; the tag swings once on its string and settles. Nothing else. 3 seconds."

**S23.** 1:14.0 to 1:18.5 (4.5 s). Setup B, the blank tag. Lens override: macro. Static. Nieves's hand.
Action: her hand stops at the top corner of the shelf. The oldest tag: brown at the edges, string gone gray, blank. Hold one second before the first line.
Dialogue: NIEVES (O.S.) "This one doesn't say." MARGUERITE (O.S.) "No." NIEVES (O.S.) "What was it?" MARGUERITE (O.S.) "Pending."
Sound: room tone only.
Image prompt: "[ANCHOR, Setup B lens] Close on the top corner of industrial metal shelving against a pegboard wall. A child's small hand in a mustard yellow sleeve stopped beside an old manila paper tag tied on with string that has gone gray. The tag is yellowed and brown at the edges and completely blank. The tag catches a sliver of cool streetlight from the window; the lamp's warmth falls off below. Nothing written anywhere."
Motion prompt: "Static camera. The hand stops and holds. The tag turns a few degrees on its string and settles. The streetlight catches its edge. 5 seconds."

**S24.** 1:18.5 to 1:21.0 (2.5 s). Setup B, closer on the blank tag, hand withdrawn. Static. Nobody.
Action: nothing but the tag's last settle. This is the question. Nothing answers it.
Dialogue: NIEVES (O.S.) "Since when?" MARGUERITE (O.S.) "Since before the stamp."
Sound: room tone only.
Image prompt: "[ANCHOR, Setup B lens] The old blank manila tag fills a third of the frame, hanging on its gray string from the top corner of the metal shelf, brown at the edges, no writing, lit by a sliver of cool streetlight with warm lamp falloff below. Pegboard soft behind. No hands."
Motion prompt: "Static camera. The tag completes one slow settle on its string and hangs still. 3 seconds."

**S25.** 1:21.0 to 1:24.0 (3 s). Setup C, wide enough to take in the ice machine at frame left. Static. Teddy, with the desk soft behind (Marguerite seated, Nieves from behind at the shelf).
Action: Teddy stands beside the ice machine, both hands on the push broom, staring straight at it, waiting. The ice machine drops a load. Teddy jumps, all of him. The broom does not.
Dialogue: none.
Sound: at 1:22.0 the ice machine drops: a bucket of gravel on a tin roof, at or below dialogue level.
Image prompt: "[ANCHOR] [SET, Setup C view panned wide to the ice machine wall] [TEDDY] frame left beside the dented cream-enamel chest ice machine, both hands on the push broom held upright in front of him like a railing, staring straight at the machine's lid, shoulders up around his ears, the headlamp around his neck. Beyond him, soft, the desk: [MARGUERITE] seated at the lamp and [NIEVES] from behind at the foot of the shelf. Cool fluorescent on the ice machine, warm lamp at the desk."
Motion prompt: "Static camera. One second in, Teddy jumps: shoulders up, both feet leaving the floor a few centimeters, then landing. The broom does not move at all. By the end his shoulders are coming down and a wide easy smile is arriving. Nobody at the desk turns. 4 seconds."

**S26.** 1:24.0 to 1:26.5 (2.5 s). Setup C, tighter on Teddy. Static. Teddy.
Action: shoulders come down. The wide easy smile arrives. Ears red.
Dialogue: TEDDY "I saw it. I saw it coming. It doesn't help."
Sound: room tone.
Image prompt: "[ANCHOR] [SET, the ice machine wall] [TEDDY] in a medium shot, the ice machine's lid at the left edge of frame, both hands on the broom, ears red, the smile arriving late, one eyebrow higher than the other. Cool fluorescent from above, warm spill from the right."
Motion prompt: "Static camera. His shoulders come down; the smile arrives; his lips move slightly as he speaks. The broom stays still. 3 seconds."

**S27.** 1:26.5 to 1:29.0 (2.5 s). Setup C. Static. Marguerite, Nieves (Mode A).
Action: nobody at the desk has turned around. Marguerite seated, pen still. Nieves still at the top corner of the shelf, from behind.
Dialogue: NIEVES "Marguerite." MARGUERITE "Pending."
Sound: room tone. The pen resumes.
Image prompt: "[ANCHOR] [SET, Setup C view widened to the shelf] [MARGUERITE] seated at the lamp, frame right, facing her tag, back to the ice machine. [NIEVES] from behind, standing at the foot of the shelving with her face turned up to the top corner tag, ledger against her chest. Neither has turned toward the ice machine."
Motion prompt: "Static camera. Marguerite's pen resumes writing. Nieves does not move. 3 seconds."

### Beat 5. Button. 1:29.0 to 1:52.0

**S28.** 1:29.0 to 1:32.5 (3.5 s). Setup A, wide enough to take in the swinging door at frame right. Static. Desmond, Marguerite, Dolores.
Action: Desmond puts the lid back on the shoebox. The swinging door opens toward camera and Dolores fills the gap: apron, one glove, headset, pencil in the bun, shoulder on the door.
Dialogue: DOLORES "Nieves. Ledger. Coat."
Sound: the door's spring hinge, soft.
Image prompt: "[ANCHOR] [SET, Setup A view widened right to the swinging door] [DESMOND] frame left, settling the lid onto the shoebox with both hands. [MARGUERITE] center right, seated, head turned toward the door. At the far right the gray swinging door open about forty degrees toward camera, [DOLORES] filling the gap with her shoulder on the door, one gloved hand free, the dock lit cool behind her."
Motion prompt: "Static camera. The swinging door completes its swing and stops on her shoulder. Her free hand points once toward the far end of the counter. Her lips move slightly. Desmond's hands settle the lid. 4 seconds."

**S29.** 1:32.5 to 1:35.5 (3 s). Setup C, Nieves end. Static. Nieves (Mode A), Dolores, Marguerite (shoulder).
Action: Nieves, back on the stool, closes the green ledger. Dolores behind her in the open door.
Dialogue: NIEVES "Cause pending." DOLORES "Coat pending."
Sound: the ledger's cloth cover closing.
Image prompt: "[ANCHOR] [SET, Setup C view, far end] [NIEVES] in the foreground from behind on the tall stool, both hands closing the green cloth ledger, face down to it. Beyond her, in the open swinging door, [DOLORES] with her shoulder on the door, head tilted, the pencil in her bun catching the lamp. [MARGUERITE]'s shoulder and pencil soft in the lower right corner."
Motion prompt: "Static camera. The ledger closes. Dolores's head tilts; her gloved hand taps the door frame once; her lips move slightly. 3 seconds."

**S30.** 1:35.5 to 1:38.0 (2.5 s). Setup C, wide with the ice machine at frame left, no Teddy. Static. Nieves (Mode A), Marguerite, Dolores, Desmond.
Action: the ice machine drops. Nobody jumps. Not Nieves, not Marguerite, not Dolores, not Desmond.
Dialogue: TEDDY (O.S.) "See. Fine."
Sound: the ice drop, at or below dialogue level.
Image prompt: "[ANCHOR] [SET, Setup C view panned wide from the ice machine to the swinging door] The ice machine at frame left with nobody beside it. Along the counter: [DESMOND] with the closed shoebox in both hands, [MARGUERITE] seated at the lamp, [NIEVES] from behind on her stool with the closed ledger, and [DOLORES] in the open swinging door at frame right. Everyone still."
Motion prompt: "Static camera. On the ice drop, nobody moves at all. The paper tags on the shelf sway by a millimeter. That is the whole clip. 3 seconds."

**S31.** 1:38.0 to 1:41.0 (3 s). Setup A. Static. Desmond, Marguerite.
Action: Desmond, shoebox in both hands like a pie, stops at the counter's short leg beside the service bell. He looks at the box. He looks at the shelf.
Dialogue: DESMOND "So is it haunted or not?"
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view] [DESMOND] frame left, stopped at the counter's corner beside the brass service bell, the closed shoebox held in both hands at chest height, eyes lifted toward the shelf. [MARGUERITE] frame right, seated, a fresh manila tag in front of her, looking at him over the glasses."
Motion prompt: "Static camera. His eyes drop to the box, lift to the shelf, then come to her. His lips move slightly. She does not move. 3 seconds."

**S32.** 1:41.0 to 1:45.5 (4.5 s). Setup A, two-shot. Static. Marguerite, Desmond.
Action: minimal. Marguerite's eyes come up over the glasses on "receipt" and stay. Desmond's head drops a degree on "It's haunted." Marguerite is still on the last line. The last line. Do not improve it.
Dialogue: MARGUERITE "Do you have the receipt?" DESMOND "It's haunted." MARGUERITE "Then I'll need two receipts."
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view] A balanced two-shot. [DESMOND] frame left holding the shoebox, looking at her. [MARGUERITE] frame right, seated, elbows on the brass edge, hands folded, eyes on him over the reading glasses, mouth nearly closed. The lamp between them. The shelf behind."
Motion prompt: "Static camera. Marguerite's eyes come up and hold. Desmond's head drops one degree and stays. Both mouths move slightly and briefly. No other motion. 5 seconds."

**S33.** 1:45.5 to 1:47.5 (2 s). Setup A, tight single on Desmond, frame left. Static. Desmond.
Action: hold. Something in his face lets go. It is the first time tonight.
Dialogue: none.
Sound: room tone.
Image prompt: "[ANCHOR] [SET, Setup A view, tight] [DESMOND] in a medium close-up, frame left, holding the shoebox, the tired face beginning to soften, eyes on the shelf beyond the lamp, no smile. The lamp warm on the right side of his face."
Motion prompt: "Static camera. His shoulders drop a centimeter. His jaw unclenches. One breath out. No smile. 3 seconds."

**S34.** 1:47.5 to 1:49.5 (2 s). Setup A, tight single on Marguerite, frame right. Static. Marguerite.
Action: she does not explain. She pulls a fresh manila tag off the string.
Dialogue: none.
Sound: the tag tearing from its string.
Image prompt: "[ANCHOR] [SET, Setup A view, tight] [MARGUERITE] in a medium close-up, frame right, eyes down, her right hand at the cardboard box of manila tags, one tag lifted on its string. The stamp tray beside it. Lamp warm on her hands."
Motion prompt: "Static camera. The hand tears one tag free of the string and lays it flat on the counter. Eyes stay down. 3 seconds."

**S35.** 1:49.5 to 1:52.0 (2.5 s). Setup A, wide. Static. Marguerite.
Action: the customer's spot is empty. The front door beyond settles closed. The bell rings for an exit. The lamp warm on the empty counter. Marguerite writing.
Dialogue: none.
Sound: the front door bell at talking volume, then room tone.
Image prompt: "[ANCHOR] [SET, Setup A view widened left to the front door] The customer's mark at the counter corner empty, the brass service bell alone on the laminate. Across the room the glass front door in its last few degrees of closing, the spring bell mid-swing, the streetlight outside. [MARGUERITE] frame right, seated, writing the fresh tag, head down. The lamp warm on the empty counter."
Motion prompt: "Static camera. The door closes its last few degrees; the bell bracket rocks and stops. Marguerite's pen moves. Nothing else. 3 seconds."

### Beat 6. Title card. 1:52.0 to 2:00.0

**S36.** 1:52.0 to 1:54.5 (2.5 s). Setup B, the lamp switch. Static. Marguerite's hand.
Action: her hand on the gooseneck lamp's switch. Click. The lamp goes off in one frame. The shelf goes dark except the paper tags, which catch the streetlight through the window.
Dialogue: none.
Sound: a recorded rotary lamp switch, at dialogue level. Then room tone only.
Image prompt: "[ANCHOR, Setup B lens] [MARGUERITE]'s right hand with the silver band, thumb on the small rotary switch at the base of the warm gooseneck lamp's shade, the shelf with its manila tags lit warm behind and below. The frame is still lit; the switch has not yet turned."
Motion prompt: "Static camera. The thumb turns the switch. The lamp goes from warm to off in a single frame, no dimming, no flicker. The frame drops to near dark; the manila tags on the shelf read as pale rectangles in cool streetlight. 3 seconds."
Note: also generate the end state as its own still (the dark shelf plate, section 2.1 step 1) for S37.

**S37.** 1:54.5 to 2:00.0 (5.5 s). The dark shelf plate. Static. Nobody.
Action: over the dark shelf, plain type, composited in the edit, no animation. The card is both the title card and the end card. A 12-frame fade to black at the very end.
Type, in this order, centered, left-aligned to a common margin:
THE RETURNS DESK (Archivo, condensed width 75, weight 800, all capitals, ink #EFE6D3)
Lights Out (Archivo, width 100, weight 500, small capitals)
a hairline rule (ink at 20 percent)
STREETLIGHTS with the amber dot as the period (the Direction 1 masthead, identity brief section 7, on-air glow #FFD08A)
The block premieres every Friday night. (Newsreader, weight 400)
The account holder is a parent. (Newsreader, small)
Dialogue: none. Sound: none. No music. No voice. No call to action.
Image prompt: "[ANCHOR] [SET, the shelf] The Shelf of Returned Things after the lamp has gone off. Near dark. Industrial metal shelving on pegboard, the ordinary hardware items as dark shapes, the manila paper tags catching a cool sliver of streetlight from the window so that they read as pale rectangles at different heights. The top corner tag among them. No lamp. No people. No text."
Motion prompt: "Static camera. Nothing moves. One tag sways by a millimeter. 6 seconds."
Note: "Streetlights" is the provisional name from `names-5.md`, held in one config constant (`projects/05-product/site/src/config.ts`). If Fork D changes the name, the card is re-rendered from the same layout. CG-01 is open.

## 4. Voice and dialogue plan

### 4.1 Lines and reads

Every line below is performed by a human voice. Record dry, close, in one session per performer, at the same distance. Off-screen lines are recorded exactly like on-screen lines; distance is added in the mix.

**Marguerite.** Low, slow, flat, full sentences. Never in a hurry. Never surprised. Cast for stillness.
- "Returns?" Not looking up. A question with no rise.
- "They do." Agreement. Not sarcasm.
- "Hardison's. Ambler Street. Open all night. Everything comes back eventually." Four sentences, four periods. The last one warmer by a hair.
- "It's on the shelf." A fact. She is not being clever.
- "She has a system." Pride disguised as a report.
- "Good. That's thorough." She means it.
- "Your wife hasn't heard four hundred and twelve of these." The exact number, flat. No "gotcha."
- "Store policy says receipt required. My policy says story required." The two halves match in rhythm.
- "Then you're halfway." Encouragement at ten percent.
- "What things?" As if asking which aisle.
- "Mr. Quayle's." An identification, not a joke.
- "No." "Pending." "Since before the stamp." "Pending." Each one shorter and quieter than the last. Not a secret being kept. A fact she is not ready to write down.
- "Do you have the receipt?" The same tone as the first "Returns?"
- "Then I'll need two receipts." The last line. She means it. No pause for a laugh. No smile.

**Desmond.** Tired, reasonable, thorough, scared the way anyone would be. Never the fool.
- "It rings." "When nobody's there." Trying to be precise. The second line is the confession.
- "Is that on the sign?" A real question.
- "It rang eleven times. I counted. Nobody on the porch. I looked through the peephole." A list a man rehearsed in the car.
- "I looked through the window. I looked under the mat." Voice-over, quieter, to himself.
- "My wife said I was being ridiculous under the mat." He agrees with her.
- "A kid. Why?" Answer first, then suspicion.
- "Why did she write that down?" To Marguerite, not to Nieves. A little alarmed.
- "I have the receipt." The one thing he is sure of.
- "So is it haunted or not?" The real question, asked plainly.
- "It's haunted." A decision, not a fear.

**Nieves.** Fast, precise, speaks in threes. A clerk asking questions and a scientist stating answers. Never cute.
- "Desk." A check-in, a routine she likes.
- "Item. Claim. Clue. Cause." Four taps, four words, even.
- "You have a stamp." A peer to a peer.
- "Three questions. Where's the porch. Where's the street. Who lives across it." No rise on the questions. They are items.
- "Cause pending." (twice) The second is to her mother and lands as affection (STANDARDS soft rule 2).
- "Timer. Grandmother wound it. Rain gauge. Neighbor's sprinkler. Rake. Gate. Wind." Reading, not performing.
- "This one doesn't say." "What was it?" "Since when?" "Marguerite." Each a little slower than her usual. The only place in the trailer she slows down.

**Teddy.** Reassuring himself out loud, in lists. Brave in the mouth. Likable at his most scared.
- "That's fine. That's fine." Off screen. The second one less sure.
- "I saw it. I saw it coming. It doesn't help." Through the late smile.
- "See. Fine." Off screen. Proud, as if he arranged it.

**Mr. Quayle.** Formal, courteous, unhurried. Begins in the middle. Never the punchline.
- "I'd like to return this flashlight. It's showing me things." As one reports weather.
- "Mostly the garage. But at night." Helpful specificity.
- "I have the receipt. It's for a rake. I feel it's the same spirit." Sincere. "Spirit" carries no wink.
- "I still feel it was the gate." Off screen. Mild. A man who accepts the ruling and disagrees.

**Dolores.** Competent, tired, funny, in charge from the edge. A working parent's lines.
- "Nieves. Desk?" Through the intercom. A check, not a worry.
- "Nieves. Ledger. Coat." Three items, three beats, no rise.
- "Coat pending." She plays her daughter's game once, deadpan, and then means it.

### 4.2 Synthesized versus hired, per character

| Character | Synthesized voice | Hired voice | Note |
|---|---|---|---|
| Marguerite | CG-03 entry. Flattens the timing that is the comedy. | Adult performer. CG-04. | Recommended: hired. |
| Desmond | CG-03 entry. | Adult performer. CG-04. | Recommended: hired. |
| Mr. Quayle | CG-03 entry. | Adult performer aged 60 or older. CG-04. No age imitation. | Recommended: hired. |
| Teddy | CG-03 entry. | Adult performer aged 18 or older who reads 16. CG-04. No minor. | Recommended: hired. |
| Dolores | CG-03 entry. | Adult performer. CG-04. | Recommended: hired. |
| Nieves | CG-03 flag: a synthesized child voice is a generated child performance on a family block. Standards will read it as hard rule 15 territory. Not recommended. | Hired child: CG-04 plus minor labor law (work permit, hours limits, a set teacher where required, a trust account in some states, parental consent on file). Hired adult with a young timbre voicing a 12-year-old, the standard animation practice: CG-04 only. | Recommended: hired adult performer. |

### 4.3 Recommended path for v1

Hire six adult voice performers, remote sessions, one short session each, with a one-page release that names the AI-assisted picture process (counsel reviews the release under CG-04). An adult performer with a young timbre voices Nieves. Why:

1. The bible's production note says every voice is human, and the trailer is dialogue by spec (60 percent minimum). The performances are the trailer. A synthesized voice is the first thing a parent hears as generated.
2. One choice removes two flags at once: no synthesized child voice (CG-03) and no minor performer (labor law).
3. Cost is small. Six performers, fewer than sixty lines in total, one session each.

Scratch track. The owner reads every part into a phone to time the edit. The scratch never leaves the cutting room and is never exported into any file that leaves the owner's machine. No synthesized scratch, so the CG-03 log carries no audio entry under this path.

Lip sync. The v1 picture plan does not depend on lip sync. Speaking faces are held in medium shots with small mouth motion, and the edit favors the listener, the hands (Setup B), and off-screen delivery. If the tool offers audio-driven lip sync from the recorded read, test it on S32 only. Keep it only if the clip passes section 7. Otherwise keep the listener plan.

## 5. Sound plan

Mix reference. The dialogue peak is Desmond's loudest line, expected to be "It's haunted." at S32 or "So is it haunted or not?" at S31. Meter it. Nothing on the effects bus exceeds it (STANDARDS soft rule 8). No music inside the file. Room tone from the first frame.

| Sound | Source | Placement | Level | Must not |
|---|---|---|---|---|
| The Lights Out sonic ID | The block's recorded pull-chain click, then four plucked notes (nylon-string guitar or kalimba), slowed, one octave lower, a longer hold, ending on the click of the porch lamp going off. Canon, block bible 4.4. | Inside the 8-second Porch Intro the site plays before this file. Never inside this file (bible section 11). The file starts on room tone within a quarter second so the ID's final click is followed by the desk's hush. | Under the dialogue peak. | Resemble any network ident or block jingle. Use a synthesized click. Play anywhere in the trailer. |
| The doorbell chime | A real plain wireless chime, recorded. Two descending notes. | S02 (0:06.0) and S10 (0:32.0). Two rings, 26 seconds apart. | At or below the dialogue peak. Talking volume. | Share an interval with the sonic ID's four notes. Ring a third time. Carry reverb. |
| The chime's indicator | Picture only. | Glows once per ring. | Not a sound. | Blink. Glow more than once per ring. |
| The intercom | A small speaker box, a click on, a filtered voice, a click off. | S06. | Talking volume. The red indicator glows steadily, does not blink. | Buzz. Distort. |
| The stamp | A real rubber stamp on a counter, recorded dry. | S08. | Below the dialogue peak. | Thud like a drum. |
| The front door bell | A real spring bell on a bracket. | S16 (entrance), S35 (exit). | Talking volume. | Ring longer than a second. |
| The ice machine | A real ice drop, or a bucket of gravel on a tin roof, recorded. | S25 (1:22.0) and S30 (about 1:36.5). Two drops. | At or below the dialogue peak. | Rumble. Carry a low drone. Be louder the second time. |
| The box drop | A cardboard box on tile, off screen. | S03. | Below the doorbell ring. | Startle. |
| The lamp click | A real rotary lamp switch, recorded. A different object from the block's pull chain. | S36. | At dialogue level. | Sound like the sonic ID's click. |
| Room tone | Fluorescent hum, the cannery far off, a far sprinkler and a fridge in the insert. | Every frame. | Well under dialogue. | Drone. Swell. Drop out. |

Loudness. Integrated loudness minus 16 LUFS. True peak minus 1 dBTP. Dialogue sits at the same level in every shot. Stereo, with effects placed by their on-screen position and dialogue centered.

No strobe (STANDARDS soft rule 9). The only lights that change state in the file: the chime indicator (once per ring, two rings), the intercom indicator (steady on, then off), the gooseneck lamp (once, off). Nothing else blinks. Flashlight beams hold. Fluorescent tubes do not flicker.

Music brief. There is no score in this file. The only music the audience hears with this trailer is the Lights Out sonic ID in the site's wrapper. Composer's brief for that variant: the same four notes as the block's main ID, played on the same plucked instrument, slowed to about half tempo, one octave lower, the last note held longer and left unresolved, then the recorded pull-chain click, then silence. The silence is part of the logo. Darker room tone on the recording, same instrument. Under 2 seconds of sound plus the hold. No riser, no drone, no stinger, no pad, no whoosh, no vocal, no melody that resolves like a commercial. Any resemblance to a known ident fails standards item 12.

## 6. Edit plan

### 6.1 Stitch order

S01 through S37, in order. No reorders. No dissolves except the 12-frame fade to black at the end of S37. No speed changes. No zooms added in the edit: the only push is generated inside S04. No slow motion. L-cuts are allowed: audio may lead picture by up to 8 frames to keep mouths off camera at the start of a line. Cut on the last word of a line, never inside a word. Never cut to a speaker's face on the first syllable of a line; land on the listener or the hands and let the line start there.

### 6.2 Cut rhythm per beat

| Beat | Shots | Cuts | Rhythm |
|---|---|---|---|
| 1. Cold open | S01 to S03 | 2 | Long air. Silence is the joke. Hold at least one full second after the ring before the box drop. |
| 2. World | S04 to S08 | 4 | Medium. One cut per exchange. The push in S04 is the only camera movement in the file. |
| 3. Character | S09 to S20 | 11 | Brisk. Every cut on a line end. The insert (S10) is the one hold; do not shorten it. Mr. Quayle's entrance (S16) is cut on the bell. |
| 4. Turn | S21 to S27 | 6 | Slowing. S23 and S24 are the longest holds on a still object in the file. The ice drop (S25) cuts in hard from the blank tag; the return (S27) cuts back to the same stillness. |
| 5. Button | S28 to S35 | 7 | Brisk through the door and the second ice drop, then two clean holds (S33, S34) and the exit. Do not trim the holds below 2 seconds. |
| 6. Title | S36 to S37 | 1 | The click is the cut. Type appears on the first frame of S37, no animation. |

### 6.3 The mild scare and its safe landing

The scare is two objects doing one thing each at talking volume: a doorbell ringing on an empty porch (S10) and an ice machine dropping ice (S25). Rules for the cut:

1. The object that makes the sound is on screen when it sounds. S10 shows the button and the porch; S25 shows the ice machine.
2. Hold at least one second after the ring in S10. Nothing enters. Nothing approaches. The cut out of S10 lands on an adult, calm: Marguerite, "Good. That's thorough."
3. Teddy's jump in S25 is followed within 2 seconds by his smile (S26). The joke is on the jump, never on Teddy.
4. The landing is S28 to S30: the parent in the door, the ledger closing, the second ice drop with nobody jumping, "See. Fine." Then S35, the lamp warm on the empty counter. After S24 (the question), no new uneasy image enters the file (STANDARDS soft rule 1).
5. The fair clue (the poster board and the antenna in S10) is in focus before Nieves asks "Who lives across it" in S13. The trailer never names the cause.

### 6.4 Title card and end card

One card, S37, 5.5 seconds, the layout in section 3. The show title, the slot label, the hairline, the Streetlights masthead with the amber dot, the Friday night line, the parent line. Fonts from the identity brief pairing A: Archivo for the title, slot, and masthead; Newsreader for the two lines. Colors from the dark set: ink #EFE6D3, glow #FFD08A for the dot only, rule at ink 20 percent. No animation of any kind. The masthead is print; it does not move. No call to action. No "subscribe," no "comment," no "visit."

### 6.5 Running time check

| Beat | In | Out | Seconds |
|---|---|---|---|
| 1. Cold open | 0:00.0 | 0:10.0 | 10.0 |
| 2. World | 0:10.0 | 0:26.0 | 16.0 |
| 3. Character | 0:26.0 | 1:07.0 | 41.0 |
| 4. Turn | 1:07.0 | 1:29.0 | 22.0 |
| 5. Button | 1:29.0 | 1:52.0 | 23.0 |
| 6. Title | 1:52.0 | 2:00.0 | 8.0 |
| Total | | | 120.0 |

2,880 frames at 24 frames per second. First frame is picture, not black. Dialogue occupies about 81 of 120 seconds by this plan (68 percent), above the 60 percent floor. Count it with a stopwatch on the locked cut.

The plan assumes a brisk read: Marguerite's lines dry with no air before them, Nieves fast, overlaps allowed where the script implies them. A natural, unhurried read of the full script runs about 135 to 140 seconds. If the locked cut with real performances runs over 120, apply the trim ladder in order and stop when it fits:

1. Cut S05 ("Is that on the sign?" and "It's on the shelf."). Saves 2.5.
2. Cut S24 ("Since when?" and "Since before the stamp."). Saves 2.5. The question survives in S23.
3. Cut S14 ("Why did she write that down?"). Saves 2.5.
4. Cut S11's second line ("My wife said I was being ridiculous under the mat.") and S12 with it. Saves about 5.
5. Shorten S37 to 5.0 and S36 to 2.0. Saves 1.

Never cut: the cold open, the insert, "Three questions," the rake line, "Cause pending" to Dolores, "See. Fine.," the two-receipts exchange, the two holds, the parent line on the card.

### 6.6 Export settings

- Master: 1920 by 1080, 24 frames per second, ProRes 422 HQ, Rec.709, no LUT, PCM 48 kHz 24-bit stereo. Kept, not published.
- Delivery: H.264 High profile, 1920 by 1080, 24 frames per second, two-pass variable bit rate at 12 to 16 megabits per second, AAC 48 kHz 256 kilobits per second stereo, loudness minus 16 LUFS integrated, true peak minus 1 dBTP, moov atom at the front for streaming. File name `the-returns-desk-trailer-v1.mp4`.
- Captions: a sidecar `.vtt` of every line, timed to the locked cut, no sound-effect captions beyond "[doorbell rings]" and "[ice drops]."
- Poster frame: a still export of S04 at 1920 by 1080 for the site's play button.
- No bumper inside the file. The site wraps it with the Porch Intro and the Click (block bible 4.5).

## 7. Quality gate: 12 points before `content/shows.json`

A file that fails any point goes back to the step named. Two reviewers on every point.

1. Length. Exactly 120.0 seconds, 2,880 frames at 24 frames per second. First frame is picture. Last 12 frames fade to black. Fails to section 6.5.
2. Every line. Every line of the script is in the file, in order, verbatim, as performed. A second reader checks against the script with a pen. Fails to section 6.1.
3. Faces. Every frame of every adult and of Desmond passes the three-point drift check (section 2.5) against the gold portrait at that angle. No frame resembles a real person. If either reviewer names a real person, the frame is out. Fails to section 2.
4. Nieves. Her face is never resolved in any frame (Mode A) or she is off screen (Mode B). Marguerite or the swinging door with Dolores or the porthole shadow is in every frame she or her stool is in. She is never against Aisle 12 alone. The mode is logged. Fails to section 2.6.
5. Text in frame. The only generated lettering is the STORY HEARD stamp, spelled correctly. The poster board's text is a composited real element. The window lettering, the tags, the ledger, the name tag, and the ICE sign are unreadable or blank. No stray characters anywhere. Frame-step the whole file. Fails to section 1.4.
6. Marks and expression. No logo, product brand, or real signage in any frame. The compliance IP check confirms no set, prop, costume, or sound copies the expression of any existing show or ident. Fails to section 1.4 and the compliance agent.
7. Sound. Every effect (doorbell twice, ice twice, stamp, front door bell twice, box drop, intercom, lamp click) peaks at or below the metered dialogue peak. Integrated loudness minus 16 LUFS, true peak minus 1 dBTP. No music inside the file. Fails to section 5.
8. Light. No flicker and no strobe anywhere. The only state changes are the chime indicator (twice, at least 4 seconds apart), the intercom indicator (steady), and the lamp (once). Frame-step S02, S06, S10, S16, S36. Fails to section 5.
9. Mild-spooky check by a 6-year-old proxy reading. An adult reviewer watches once as a 6-year-old would, with four questions: Is anyone alone? Is anyone in danger? Does anything come toward me? Did a sound make me jump more than the people on screen did? All four must be "no." Then S10 alone, then S25 alone, same four questions. Then the whole file with a parent reviewer watching for the two laughs and the landing. Any "yes" recuts the shot. Only after the proxy passes may a real child aged 6 watch, once, the whole file, with their parent in the room and reporting; never a cut-down, never alone, and nothing about the child is recorded. Fails to section 6.3.
10. The five trailer tests (block bible section 8). Three cold viewers write the unanswered question in one sentence; all three name the blank tag. The two laughs are named (the rake line for the parent, Teddy and the ice for the child). The first 10 seconds play cold to someone new and get "what is this?" in the good way. Dialogue timed at or above 60 percent. Fails to the writers' room for a recut.
11. Standards. The `standards` agent returns PASS with zero FAIL and zero WARN on the file and on the card. Fails to the item named in the report.
12. Gates and metadata. The CG-03 log is complete for every generated still and clip (asset name, prompt, references, seed, tool and version, mode for Nieves). CG-04 releases are on file for all six voices. The section 8 disclosure is placed on the About page in place of the current placeholder. Only then update `projects/05-product/site/content/shows.json` for `the-returns-desk`: set `trailerUrl` to the hosted file and change `trailerSeconds` from 110 to 120. The site stays in private review until counsel signs CG-03 (D-014).

## 8. Disclosure draft for CG-03

For the About page, in place of the placeholder line. Two sentences. Counsel edits before it goes live.

"The pictures in our trailers were made with image and video generation tools: the store, the objects, and the people you see are computer-generated images of invented characters, and no real person's face or likeness was used. Every voice you hear is a human performer, and every word was written by a person."

If the owner departs from the section 4.3 path and uses any synthesized voice, the second sentence changes to name it, and the CG-03 log carries the audio entry.

## 9. Flags for the Orchestrator and counsel

1. Nieves mode. Section 2.6 asks the Orchestrator to pick Mode A or Mode B. Mode A stretches the character sheet's rule 3 (no photoreal child) to "no photoreal child face." Counsel confirms under CG-03 before public release.
2. CG-03 log. Every still and clip in section 3 is a generated image and goes in the log. The adult faces are generated performances under hard rule 15; the disclosure in section 8 covers them once counsel signs.
3. CG-04. Six voice releases, including the adult performer voicing Nieves.
4. CG-01. "Hardison's Hardware," "The Returns Desk," and the provisional masthead are all still under the name check. The card is built from a config constant so it re-renders without a recut.
5. `shows.json` currently lists `trailerSeconds` as 110 for this show. The script and this package run 120. Point 12 of the gate corrects it.
