# LONG ROUTE. Trailer production package.

Hangout slot (Slot 2). AI-assisted production package for the 90-second trailer. Trailer production lead output, Phase 4.

Inputs: `canon/STANDARDS.md` sections 2 and 3; `DECISIONS.md` D-013 and D-014; `projects/02-brand/out/identity-brief.md` sections 4 to 6; `projects/03-block-format/out/block-bible.md` sections 4.2 to 4.4 and 8; `projects/04-writers-room/out/scripts/H2-long-route-trailer.md`, `H2-long-route-character-sheet.md`, `H2-long-route-cold-open.md`; `projects/04-writers-room/out/bibles/H2-long-route.md` section 11.

Who this is for: the owner, working an image generator and an image-to-video generator, plus one editor. Every prompt in this file is meant to be pasted as written, with the style anchor and the character tokens in front of it.

Gates that bind this package: CG-03 (AI-generated performance, voice, or image) is TRIGGERED by D-014. Nothing produced from this package goes public until counsel signs off and the disclosure in section 8 is live. CG-04 applies the moment a voice actor is hired (section 4).

Hard rules for every prompt: no real person, no real actor, no brand, no existing show, no lettering. Every person and place described here is original.

---

## 0. Working order

1. Read the character sheet once, end to end.
2. Generate the character reference sheets (section 2). Do not generate a single shot until every face has an approved master portrait and turnaround.
3. Generate the road plates and the empty bus interior frames (section 3, shots marked PLATE). These have no faces and can run in parallel with step 2.
4. Generate the shot stills in order (section 3). Attach the reference sheet for every face in the shot.
5. Run the motion pass, one still at a time. Reject any clip with face drift, extra fingers, or fast motion. Regenerate.
6. Record dialogue (section 4). Cut picture to the recorded lines, not the other way around.
7. Mix (section 5). Edit (section 6). Run the quality gate (section 7). Only then update `projects/05-product/site/content/shows.json`.

File naming. Keep everything under `projects/04-writers-room/out/production/long-route/` with these subfolders: `refs/` (character sheets), `plates/` (exteriors and empty interiors), `stills/` (one file per shot, `S01.png` to `S44.png`), `motion/` (`S01.mp4` to `S44.mp4`), `audio/` (dialogue takes, stems), `cut/` (project file and exports). Log every generation in `log.md`: shot, prompt version, seed if the tool exposes one, reference files attached, accept or reject, reason.

---

## 1. Look bible

### Visual intent

Long Route looks like a quiet, well-made live-action comedy shot inside one real school bus at the two hours of the day when the light is low. The frame is calm. The camera does not move unless the bus moves. Faces are lit by whatever comes through the windows, and the window behind every face tells you where on the route we are. The palette is the bus itself: yellow paint, green vinyl, chrome, black rubber, and one red handle, with the kids as the only other color. Warmth comes from the light, never from a filter. Nothing in the image says "generated": no glow, no haze, no grain, no impossible depth of field, no perfect skin. It should look like someone rented a bus and a good lens and waited for the sun.

### Style anchor

Prepend this sentence to every image prompt, before the character tokens and the shot description:

> STYLE ANCHOR: A single frame from a quiet, warm, live-action family comedy, photographed on a full-frame digital cinema camera with a sharp prime lens, natural low sidelight from one side only, clean highlights the color of warm cream and soft shadows the color of dark ink, a muted palette of school-bus yellow, worn green vinyl seats with cracked cream piping, brushed chrome grab rails and black ribbed rubber floor, with a single small brick-red accent allowed, photoreal, natural skin with pores and stray hairs, ordinary faces of original people who resemble no one famous, no film grain, no texture overlay, no vignette, no lens flare, no haze or fog inside the bus, no color filter, no lettering or numbers or signage anywhere in the frame, no logos, no watermarks.

Palette source and adaptation. The identity brief gives one paper, one ink, one accent, one glow. Translate them to the bus this way:

| Brief role | Hex | On the bus |
|---|---|---|
| Paper (light) | #F3ECDD | The tone of sunlit cream piping, a white shirt, the dairy house, morning sky at the horizon. Highlights lean this way, never pure white. |
| Ink (light) | #1C1A16 | Shadow tone. Shadows are warm dark brown, never blue, never crushed black. |
| Accent | #C9391E | Brick red. Appears once per frame at most: the rear emergency handle, the mailbox flag, Beck's sneakers, Ines's raincoat is yellow so it does not compete. |
| On-air glow | #FFC46B | Warm amber. This is the dawn and late-afternoon light itself: on the ridge, on the chrome, on the side of a face. It is never a lamp inside the bus. |
| Paper (dark) | #15130F | The tone of the pre-dawn sky and the shadow side of the bus barn. |
| Glow (dark) | #FFD08A | The one sodium light at the barn, the school's lit windows in the afternoon. |

Two lighting states, and only two:
1. Dawn and morning. Light enters from the door side (the bus's right). Sky gray-blue at the top, cream at the horizon, a streak of amber on the ridge. Mist in low fields. Long shadows on the road.
2. Late afternoon. Light enters from the driver side (the bus's left). Warm, lower, longer shadows. The school's windows lit. The interior is never dark. Overhead interior lights are on only at the rail crossing.

Lens plan. Wide exteriors and the mirror shot: 24mm. Seat frames and two-shots: 50mm at f/2.8. Inserts (stopwatch, hands, page turn): 85mm at f/2.8. Depth of field is shallow but honest: the window behind a face is soft, not smeared.

### The three things that must never appear

1. Text in frame. No lettering, numerals, signs, labels, badges, book titles, stitched names, pins with words, license plates, or chalk writing. The script needs six lettered objects (the stenciled 12 on the bus, the chalkboard at the stand, the BUS CODE cover, the BECK FOR SPEAKER button, the store name on Cal's fleece, the school marquee). The generator makes every one of them blank. The editor adds lettering in post only where the shot list says LETTERING IN POST, and only the 12 on the bus and the chalkboard line are lettered at v1. Everything else stays blank or out of focus.
2. Brand logos. No maker's name on the bus, no shoe logos, no backpack logos, no watch face brand, no drink cans. Describe objects generically.
3. Real people. No name of any actor, public figure, or influencer in any prompt. No "in the style of" any photographer, director, or show. If a generated face resembles a known person, reject it and regenerate.

### Aspect ratio and resolution targets

- Masters: 16:9, 1920 x 1080, 24 frames per second, Rec.709.
- Stills: generate at 16:9 native. Prefer 2560 x 1440 or larger and downscale, so a 5 percent reframe is free in the edit.
- Motion clips: 1920 x 1080, 24 fps, 3 to 6 seconds each, exported at the highest bitrate the tool offers.
- 1080 x 1920 vertical is not needed at v1. Do not generate it.

---

## 2. Character consistency kit

### How to keep the same face across shots

1. Generate the master portrait first. Iterate until it matches the character sheet and reads as an ordinary, specific, original person. Approve it. Save it as `refs/<name>-master.png`.
2. Generate the turnaround next, using the master as the reference image: three angles on a plain mid-gray background, same 50mm lens, same soft light, neutral expression, then a fourth frame in the character's fixed seat. Save as `refs/<name>-front.png`, `-threequarter.png`, `-profile.png`, `-seat.png`.
3. Attach the master and the seat reference to every shot prompt that contains the character. Say in the prompt: "the same person as the reference image, same face, same hair, same clothes."
4. Keep three things fixed per character across every shot: the seat, the camera angle (from the fixed frame in the character sheet), and the lens. When the seat, angle, and lens do not change, the face has the best chance of holding.
5. Repeat the constant costume tokens in every prompt, every time, word for word. Never abbreviate them.
6. Regenerate rather than accept a drifted face. A face that is 90 percent right is wrong. Check jaw, eye spacing, hairline, and ears against the master before accepting. Log the rejection reason.
7. Do not let two characters share a generation unless the shot needs both. Two-shots drift more. Where the shot list gives a two-shot, generate the empty frame first, then add faces one at a time if the tool supports region edits.
8. Hands are the second drift point after faces. Every prompt that shows a hand says "five fingers, natural hand." Reject anything else.

### Master portraits, turnarounds, and constant tokens

Every master portrait prompt below is one paragraph. Put the style anchor in front of it. The turnaround note follows. The constant tokens are the bracketed string to paste into every shot prompt that contains the character.

#### Frances Dukes, the driver

Master portrait prompt: A woman of 58, medium height and sturdy, broad in the shoulders, strong forearms, a square jaw, gray eyes with deep crow's feet, a long straight nose, a mouth set flat with the corners ready to move, short silver hair cut close at the neck and longer on top with a cowlick standing up at the crown, reading glasses on a cord pushed up into her hair and never on her face, light weathered skin with freckles on the forearms and the backs of the hands, a darker tan on the left arm only. She wears a quilted navy vest over a red and black plaid flannel shirt with the sleeves rolled to the elbow, a plain lanyard clip showing at the vest pocket, work boots. She sits upright in the driver's seat of a school bus with both hands on the wheel at nine and three, chin level, eyes lifted to the mirror above the windshield, not to the road. Warm late-afternoon light from her left. 50mm at f/2.8.

Turnaround note: generate front, three-quarter left, and right profile on gray, then the mirror frame: a tight shot of the chrome-rimmed convex mirror above the windshield with only her gray eyes, brows, and the bridge of her nose in it, the aisle bent small and soft behind her eyes. The mirror frame is her portrait. Almost every Frances shot in the trailer is this frame, so approve it with care.

Constant tokens: [FRANCES: woman of 58, sturdy, square jaw, gray eyes with deep crow's feet, long straight nose, short silver hair with a cowlick at the crown, reading glasses on a cord pushed up into her hair, quilted navy vest over red and black plaid flannel with sleeves rolled to the elbow, both hands on the wheel]

#### Hollis Dukes, row 1, door side

Master portrait prompt: A boy of 13, small for his age, slight, narrow shoulders, all elbows, a long thin face with big ears, brown eyes a little too wide, freckles across the nose, a mouth that looks about to apologize, light brown straight hair that sticks up at the back of the crown, light skin with a fading summer tan. He wears a gray hooded sweatshirt with the hood half up so the ears half show, an unzipped faded blue nylon windbreaker over it, canvas sneakers with double-knotted laces, and a yellow pencil behind his right ear. He sits low in the first row of a school bus on the door side, braced, both hands on the chrome rail of the seat back in front of him, feet flat, shoulders up around his ears. Behind him the folding bus door and the door glass. Camera low from the stairwell at his eye height looking slightly up. Morning light from the door side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray with the hood half up in all three, then the seat frame from the stairwell. Include the edge of Frances's shoulder and a steel thermos at the far left of the seat frame.

Constant tokens: [HOLLIS: boy of 13, small and slight, long thin face, big ears, wide brown eyes, freckles across the nose, light brown hair sticking up at the crown, gray hoodie with the hood half up, unzipped faded blue nylon windbreaker, yellow pencil behind the right ear, both hands gripping the chrome seat rail in front of him]

#### Mateo Villanueva, row 12, driver side

Master portrait prompt: A boy of 14, tall and lanky, the tallest on the bus, all wrists and knees, a long face with heavy dark eyebrows, dark brown eyes, a wide mouth held closed, a chin starting to lift, thick black hair a little long on top and pushed back with a hand, short at the sides, warm medium brown skin with sun on the back of the neck. He wears a faded green canvas work jacket that is too big for him, a plain white T-shirt, brown work boots with dried mud on the outer sides, and turns an empty key ring on one finger. He lies sideways across the back-row seat of a school bus on the driver side, back to the window, one knee up on the green vinyl, arms folded, head against the glass. Behind him the rear driver-side window with a gravel road falling away. Camera from the aisle at seat height, a hair below his eyeline. Late-afternoon light from the driver side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then the seat frame sideways in row 12. Generate the seat frame twice, once with the orchard road plate behind him and once with the far-end lane, since both appear in the trailer.

Constant tokens: [MATEO: boy of 14, very tall and lanky, long face, heavy dark eyebrows, dark brown eyes, thick black hair pushed back, warm medium brown skin, oversized faded green canvas work jacket over a plain white T-shirt, brown work boots with dried mud, empty key ring on one finger, sideways across the back-row seat with one knee up]

#### Beck Oyelaran, row 12, door side

Master portrait prompt: A boy of 12, medium height, compact and springy, leaning forward from the hips, a round open face with a wide grin and a lot of teeth, big expressive eyebrows raised, dark brown eyes, a short high-top fade with a straight part shaved on the left side, dark brown skin with a warm glow. He wears a bold striped long-sleeve rugby shirt in orange and navy, a navy puffer vest covered in small hand-made pins with no words on them, and red high-top sneakers. He is half-standing in the back row of a school bus on the door side, one foot in the aisle, one hand on the chrome grab rail of the seat in front like a podium. Behind him the rear door-side window. Camera from the aisle, low, so that when he stands he fills the frame to the roof. Late-afternoon light from the driver side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then two seat frames: seated fully, and half-standing. Beck is the most expressive face in the trailer and the one most likely to drift when animated. Approve a still of him with his mouth closed and one with a wide grin, and use the matching one as the reference for each shot.

Constant tokens: [BECK: boy of 12, compact and springy, round open face, wide grin, big raised eyebrows, dark brown eyes, short high-top fade with a shaved part on the left, dark brown skin, orange and navy striped rugby shirt, navy puffer vest with small blank hand-made pins, red high-top sneakers, one hand on the seat rail in front like a podium]

#### Rue Oyelaran, row 11, door side

Master portrait prompt: A girl of 12, the same height as her twin brother but thinner and completely still, a long neck, a long oval face, flat held eyebrows, deep brown eyes that look up before her head does, a small closed mouth, shoulder-length two-strand twists pulled back with a single black elastic with a few twists loose at the temples, dark brown skin. She wears an oversized olive cardigan with the sleeves pulled over her hands, a plain muted T-shirt under it, and a canvas messenger bag worn across her chest. A hardbound black sketchbook with a wide rubber band and a mechanical pencil clipped to the band sits open on her knees. She sits in row 11 of a school bus on the door side, turned toward the window, chin down, eyes up, weight over the sketchbook. Framed in three-quarter profile against her window with the road sharp behind her and a blurred shoulder in the near foreground. Camera from the aisle at seat height. Late-afternoon light from the driver side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then the seat frame. Generate Beck and Rue's masters in the same session, one after the other, and check them side by side: same skin tone, same eyebrows, clearly twins, clearly two people.

Constant tokens: [RUE: girl of 12, thin and still, long neck, long oval face, flat eyebrows, deep brown eyes looking up, small closed mouth, shoulder-length two-strand twists pulled back with one black elastic, dark brown skin, oversized olive cardigan with sleeves over her hands, canvas messenger bag across her chest, black hardbound sketchbook with a rubber band on her knees, turned toward the window with chin down]

#### Cal Whitlock, row 7, driver side

Master portrait prompt: A boy of 13, stocky and broad, strong from lifting crates, a round ruddy face, small sharp blue eyes, a gap between the front teeth, cheeks pink from the cold, sandy red-blond hair cut short and flat on top, pale freckled skin. He wears a forest-green fleece quarter-zip with a small blank white stitched mark over the heart, khaki cargo pants with every pocket full, and a cheap black digital watch with a blank face. He sits in row 7 of a school bus on the driver side with his feet up on the wheel hump, a green clothbound ledger with a pen clipped to the cover and paper tabs sticking out the side open on his knees, leaning out into the aisle so he can see both ends of the bus. Framed slightly wider than the other seats to show the hump and his feet on it. Camera from the aisle at seat height. Late-afternoon light from the driver side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then the seat frame with the ledger. Check the gap between the teeth in every accepted frame; it is the fastest way to spot drift.

Constant tokens: [CAL: boy of 13, stocky and broad, round ruddy face, small sharp blue eyes, gap between the front teeth, pink cheeks, sandy red-blond hair cut short and flat, pale freckled skin, forest-green fleece quarter-zip, khaki cargo pants, cheap black digital watch, green clothbound ledger with paper tabs on his knees, feet up on the wheel hump]

#### Priya Anand-Coker, row 2, door side

Master portrait prompt: A girl of 11, the smallest person on the bus, sitting with a straight back that adds an inch, a heart-shaped face, large dark eyes, thick straight eyebrows, a serious mouth, black hair in one thick neat braid down her back finished with a blue fabric scrunchie, warm medium brown skin. She wears a navy cardigan buttoned to the top button over a white collared shirt and a small backpack with every zipper zipped, worn on both shoulders while seated. A black-and-white marbled composition book with a blank cover and colored paper tabs down the edge lies open on her lap, held high, and she looks over the top of it. She sits forward in row 2 of a school bus on the door side, feet flat, pencil up. Framed against the front door-side window with the edge of the driver's shoulder and the chrome rim of the convex mirror visible at the top left. Camera from the aisle, slightly above her eyeline. Morning light from the door side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then the seat frame from slightly above. Also generate one back-row frame: the same girl in row 12 beside an adult's gray-trousered knee, for the cold open and the button. Priya is the only regular shot from above. Keep it that way in every shot.

Constant tokens: [PRIYA: girl of 11, very small, straight back, heart-shaped face, large dark eyes, thick straight eyebrows, serious mouth, one thick black braid with a blue scrunchie, warm medium brown skin, navy cardigan buttoned to the top over a white collared shirt, small backpack on both shoulders, marbled composition book with a blank cover and colored paper tabs held high on her lap, seen from slightly above]

#### Mr. Tull, the county's transportation man

Master portrait prompt: A man in his 50s, tall and thin, a long neutral pale clean-shaven face, thinning gray-brown hair combed flat, wire-rimmed glasses, a plain maroon tie, a white short-sleeve dress shirt, a plain gray lanyard with a blank white card, gray slacks, black shoes shined this morning, a silver stopwatch on a black cord around his neck held in one hand with five fingers. He sits folded into the back row of a school bus, knees up near his chest, elbows in, taking up as little room as a tall man can. He looks like a man who would like to be told where to sit. Never a threat. Green vinyl seat, chrome grab rail. Camera from the aisle at seat height. Late-afternoon light from the driver side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then two seat frames: folded in row 12 driver side, and standing in the aisle at row 6 with his head near the roof. Tull carries the most on-camera dialogue, so approve a neutral-mouth still and a mid-sentence still.

Constant tokens: [TULL: man in his 50s, tall and thin, long pale clean-shaven neutral face, thinning gray-brown hair combed flat, wire-rimmed glasses, plain maroon tie, white short-sleeve dress shirt, plain gray lanyard with a blank card, gray slacks, shined black shoes, silver stopwatch on a black cord around his neck, knees up and elbows in]

#### Ms. Odum, teacher on bus duty

Master portrait prompt: A woman in her 40s, medium height, brown skin, brown hair in a low ponytail, a tired kind smile, a green quilted jacket over a plain school lanyard with a blank card, a clipboard with blank paper held against her chest. She stands on the bottom step of a school bus's open folding door, looking up the aisle. Seen from inside the bus at the top of the steps, looking out and down at her. Behind her, out of focus, a two-story brick school with a flat roof and a lawn. Morning light from the door side. 50mm at f/2.8.

Turnaround note: front, three-quarter, profile on gray, then the door frame. She appears in two shots only. One approved door frame is enough.

Constant tokens: [ODUM: woman in her 40s, brown skin, brown hair in a low ponytail, tired kind smile, green quilted jacket, plain lanyard with a blank card, clipboard with blank paper, standing on the bus step]

#### Ines Villanueva and Abuela Villanueva, distance only

Ines: a girl of 6, small and solid, round face, huge dark eyes, black hair in two short pigtails, warm medium brown skin, a yellow raincoat, a purple backpack bigger than her torso, on tiptoe at a mailbox with both arms up. Abuela: a woman in her 70s, short and round, silver hair in a low bun, a cardigan over a housedress, warm brown skin, a mug in one hand, on a deep porch. Generate one reference of each at half figure on gray. In the trailer they appear only in the far-end lane wide shot and through the windshield, small in frame. Never generate a close-up of either. Under CG-03 a small figure at distance is still an AI child likeness and is named in the disclosure.

Constant tokens: [INES: girl of 6, small and solid, two short black pigtails, yellow raincoat, purple backpack bigger than her torso, on tiptoe at a mailbox with both arms up, seen small at a distance] and [ABUELA: woman in her 70s, short and round, silver hair in a low bun, cardigan over a housedress, a mug in one hand, on a farmhouse porch, seen small at a distance]

### Fixed set tokens

Paste the set token for the location of the shot.

[BUS INTERIOR: inside a full-size yellow school bus, twelve rows of green vinyl seats with cracked cream piping, chrome grab rails on every seat back, black rubber floor with a raised ribbed strip down the center aisle, a green painted heater box under the third row on the door side, a red emergency handle on the rear door, a wide chrome-rimmed convex mirror above the windshield, a sun visor above the driver with the corner of a plain envelope tucked behind its elastic, a steel thermos with a dented lid and a clipboard seat-belted into the first row driver side, no lettering anywhere]

[BUS EXTERIOR: a full-size yellow county school bus with a single black stripe along the side, plain unlettered panels, no maker's name, no numbers, no signs, black bumpers, red stop-arm folded flat and dark]

---

## 3. Shot list

45 shots. S01 to S44 are generated. S45 is the title card, built by the editor. Times are in minutes:seconds.tenths. Total 90.0 seconds.

Every dialogue shot carries a MOUTH note:
- OFF: the speaker's mouth is out of frame or hidden. No lip sync needed.
- LISTENER: the line plays over a character who is not speaking. No lip sync needed.
- SYNC: the speaker's mouth is on camera. Use the video tool's speech-driven mode with the recorded line as the driver. Each SYNC shot has a fallback framing that removes the mouth if sync is not acceptable.

Twelve shots put a speaking mouth on camera. Nine of them require sync (S05, S20, S22, S24, S26, S29, S32, S34, S36). Three are marked SYNC light and may be taken OFF with no loss (S09, S23, S25). Every other dialogue shot is OFF or LISTENER. That ratio is deliberate: it is how the trailer stays out of the uncanny zone.

Camera vocabulary: STATIC (nothing but the subject moves), PUSH (a slow push of no more than 5 percent of frame width over the clip), ROLL (the bus is moving, so the plate behind the window drifts and the frame has a faint low-frequency sway). Handheld is not used. The script's HANDHELD note for beat 3 is replaced with PUSH from the aisle at row 10; handheld motion from an image-to-video tool reads as shake, not as presence.

Every image prompt below assumes: STYLE ANCHOR + the set token + the character tokens named under Who + the reference images for those characters attached. The prompt text gives only what changes.

Every motion prompt is for a 3 to 6 second image-to-video pass. The clip is then trimmed to the shot duration in the edit. All motion prompts end with the same tail, written once here and assumed everywhere: "Slow, subtle motion only. No fast motion. No camera shake. No new people enter. No crowd. Faces, clothes, and objects stay exactly as in the still. Five fingers on every hand."

### Beat 1. Cold open. 00:00.0 to 00:12.0

No music. No title. Room tone and the bus idle only.

**S01. 00:00.0 to 00:02.5. 2.5 s.**
- Frame: extreme close, insert. Camera: STATIC. Who: Tull's hand only.
- Action: a silver stopwatch runs in a grown man's hand. A maroon tie and a plain lanyard behind it. Green vinyl and a chrome rail behind that.
- Line: none.
- Sound: bus idle, low. The stopwatch tick, close and dry. A page turning nearby.
- Mouth: none.
- Image prompt: Extreme close-up, 85mm at f/2.8, of a silver stopwatch with a blank white face and a sweeping second hand, held in the pale five-fingered hand of a tall thin man in a white short-sleeve dress shirt, a plain maroon tie and a plain gray lanyard with a blank card falling into frame behind the watch, green vinyl seat back with cracked cream piping and a chrome grab rail soft in the background. Late-afternoon light from the left. Shallow focus on the watch face.
- Motion prompt: The second hand sweeps. The hand holding the watch tightens very slightly. The tie sways a fraction with the engine. Everything else still.

**S02. 00:02.5 to 00:05.0. 2.5 s.**
- Frame: two-shot, back row, from slightly above. Camera: STATIC. Who: Tull, Priya.
- Action: pull out to Tull folded into the back row, knees near his chest. Priya beside him, composition book held high, does not look up.
- Line: PRIYA: "You're in a contested seat."
- Sound: idle, tick, her voice close and flat.
- Mouth: OFF (the composition book's top edge covers her mouth; her eyes show over it).
- Image prompt: Two-shot in the back row of a school bus, 50mm at f/2.8, camera in the aisle slightly above the eyeline of the smaller person. [TULL] on the driver side, folded, knees up, the stopwatch in his hand. [PRIYA] beside him on the aisle seat, back straight, the marbled composition book held high enough that its top edge hides her mouth and her large dark eyes look at the page. The rear driver-side window behind them with a gravel road and apple trees soft outside. Late-afternoon light from the driver side.
- Motion prompt: The girl's eyes move across the page. The man's eyes glance sideways at her and return to the watch. The road outside drifts slowly. Nothing else moves.

**S03. 00:05.0 to 00:06.5. 1.5 s.**
- Frame: close insert, chest level. Camera: STATIC. Who: Tull, no face.
- Action: the tie, the lanyard card, the watch hand. He answers without our seeing his face.
- Line: TULL: "I'm from the county."
- Sound: idle, tick.
- Mouth: OFF (framed below the chin).
- Image prompt: Close-up at chest height, 85mm at f/2.8, of a tall thin man's white short-sleeve dress shirt, plain maroon tie, plain gray lanyard with a blank white card resting on the shirt, and his pale five-fingered hand holding a silver stopwatch at his sternum. Framed from the collar down. Green vinyl seat behind. Late-afternoon light from the left.
- Motion prompt: The chest rises with one breath. The lanyard card turns a few degrees on its clip. The watch hand holds still.

**S04. 00:06.5 to 00:08.5. 2.0 s.**
- Frame: close, from above. Camera: STATIC. Who: Priya.
- Action: she turns a page. She does not look at him.
- Line: PRIYA: "Then you should know better."
- Sound: idle, tick, page turn.
- Mouth: OFF (book edge).
- Image prompt: Close-up from slightly above, 50mm at f/2.8, of [PRIYA] in the back row of a school bus, the marbled composition book held high with its top edge covering her mouth and nose, only her large dark eyes and thick straight eyebrows showing above it, her small five-fingered hand mid page-turn, colored paper tabs down the book's edge, the blue scrunchie at the end of her braid visible over her shoulder. Late-afternoon light from the driver side.
- Motion prompt: The page turns and settles. Her eyes drop to the new page. The braid does not move.

**S05. 00:08.5 to 00:10.5. 2.0 s.**
- Frame: close. Camera: STATIC. Who: Tull.
- Action: he looks at the stopwatch, then at her, then at the stopwatch. Then asks.
- Line: TULL: "Is that in the book?"
- Sound: idle, tick.
- Mouth: SYNC. Fallback: play the line over S04's framing extended by 2 seconds, with Priya's eyes lifting once.
- Image prompt: Close-up, 50mm at f/2.8, of [TULL] folded into the back row of a school bus, head turned slightly down toward the stopwatch in his hand at the bottom of frame, wire glasses catching a little window light, mouth closed and neutral, the rear window soft behind him. Late-afternoon light from the driver side.
- Motion prompt: His eyes go from the watch to the girl beside him off frame right, then back to the watch. Then he speaks the line, a short polite question, small mouth movement, no head movement.

**S06. 00:10.5 to 00:12.0. 1.5 s.**
- Frame: close. Camera: STATIC. Who: Tull.
- Action: cut on his face. He takes the answer.
- Line: PRIYA (off screen): "Section eight. It's in the book."
- Sound: idle, tick. Hard cut to the road at the end of the line.
- Mouth: LISTENER.
- Image prompt: Same framing as S05, [TULL], eyes now on the girl off frame right, mouth closed, an expression of a man who has just learned the rules exist. Late-afternoon light from the driver side.
- Motion prompt: He blinks once. His shoulders drop a quarter inch. Nothing else.

### Beat 2. World. 00:12.0 to 00:32.5

Music enters at S07, low. Road bed under everything.

**S07. 00:12.0 to 00:14.0. 2.0 s. PLATE. LETTERING IN POST (the stenciled 12).**
- Frame: wide exterior. Camera: STATIC. Who: nobody.
- Action: a yellow county bus on a gravel road between rows of apple trees at dawn. The only thing moving for miles.
- Line: none.
- Sound: music in. Road bed: tires on gravel, engine, birds at a distance.
- Mouth: none.
- Image prompt: Wide exterior, 24mm, of a [BUS EXTERIOR] driving away from camera at a slight angle on a straight gravel road between two rows of apple trees whose crowns nearly touch over the road, long shadows across the gravel, early autumn, a low amber dawn light from the right, gray-blue sky above and cream at the horizon, mist in the ditch, no people, no signs.
- Motion prompt: The bus moves slowly away down the road. Dust lifts a little behind it. Leaves stir. Camera fixed.

**S08. 00:14.0 to 00:16.0. 2.0 s. LETTERING IN POST (the 12).**
- Frame: wide exterior. Camera: STATIC. Who: Ines, Abuela, tiny in frame.
- Action: the bus sits at the top of a long gravel lane, engine running, not moving. At the lane's end a white dairy house with a deep porch. On the porch, Abuela with a mug. At the mailbox, Ines waving with her whole arm.
- Line: none.
- Sound: engine idle at a distance, a rooster far off, music low.
- Mouth: none.
- Image prompt: Wide exterior, 24mm, of a [BUS EXTERIOR] parked at the top of a long gravel lane that rises to a white dairy house with a deep porch, wood fences on both sides, four farms across a shallow valley behind, pink dawn light on the ridge and mist in the low field. At the mailbox by the road, a red flag up, [INES] small in frame. On the far porch, [ABUELA] small in frame. No lettering on the mailbox.
- Motion prompt: The small girl at the mailbox waves her whole arm. Mist drifts. The bus does not move. The woman on the porch stands still.

**S09. 00:16.0 to 00:17.5. 1.5 s.**
- Frame: medium, profile. Camera: STATIC. Who: Tull.
- Action: Tull in the back checks the stopwatch and looks out.
- Line: TULL: "Why aren't we moving?"
- Sound: idle, tick, music low.
- Mouth: SYNC, profile (a profile is the most forgiving sync). Fallback: S03's chest framing with the line off camera.
- Image prompt: Medium shot in profile, 50mm at f/2.8, of [TULL] in the back row of a school bus, turned toward the window on his left, looking out at a gravel lane and a white farmhouse soft through the glass, the stopwatch raised in his hand, dawn light from the door side behind camera. Mouth closed.
- Motion prompt: He glances down at the watch, then back out the window, and speaks the line in profile, a puzzled question, small mouth movement.

**S10. 00:17.5 to 00:19.0. 1.5 s.**
- Frame: medium, from behind. Camera: STATIC. Who: Hollis.
- Action: row 1, door side, hood half up. He does not turn around.
- Line: HOLLIS: "Waiting on the wave."
- Sound: idle, music low.
- Mouth: OFF (he faces forward, camera behind him).
- Image prompt: Medium shot from behind, 50mm at f/2.8, camera in the aisle at row 3 looking forward, of [HOLLIS] from the back and slightly to the side, the gray hood half up over big ears, both hands gripping the chrome rail of the seat in front, the windshield beyond him showing the top of a gravel lane and a white farmhouse small in the distance, the driver's silver hair and navy vest soft at the left edge, the steel thermos on the seat. Dawn light from the door side.
- Motion prompt: His shoulders rise a fraction. The hood does not move. Through the windshield nothing moves yet.

**S11. 00:19.0 to 00:21.0. 2.0 s.**
- Frame: wide, through the windshield. Camera: ROLL at the end. Who: Abuela, tiny; the driver's hands at the edge.
- Action: Abuela raises her free hand. Once. The bus moves.
- Line: none.
- Sound: engine note rises from idle to first gear. Music low.
- Mouth: none.
- Image prompt: View through a school bus windshield from just behind the driver's seat, 24mm, the chrome rim of the convex mirror at the top edge of frame, the sun visor with a plain envelope corner at the upper left, two weathered five-fingered hands on the wheel at the bottom, and beyond the glass a long gravel lane rising to a white dairy house with a deep porch where [ABUELA] stands small with a mug. Pink dawn light on the ridge.
- Motion prompt: The distant woman on the porch raises her free hand once and lowers it. A moment later the whole view through the windshield begins to move forward slowly as the bus pulls away. The hands on the wheel hold.

**S12. 00:21.0 to 00:23.0. 2.0 s. LETTERING IN POST (the chalkboard line, two lines of chalk, added by the editor with a slight blur to match focus).**
- Frame: the door shot. Camera: STATIC. Who: Beck, Rue.
- Action: from the top of the steps looking out the open door. The twins climb aboard. Beck is talking, Rue is not. Behind them the orchard stand and a blank chalkboard on an easel.
- Line: none scripted. Beck's voice is a low unheard sentence under the engine (a voice-actor ad-lib, no words distinct).
- Sound: door already open, gravel underfoot, Beck low, a dog somewhere, music low.
- Mouth: Beck mid-sentence, small in frame, seen from above. Treat as OFF: his words are not meant to be heard.
- Image prompt: From inside a school bus at the top of the steps looking down and out through the open folding door, 24mm, [BECK] on the second step mid-sentence with his eyebrows up and one five-fingered hand gesturing, [RUE] on the gravel behind him, still, sketchbook under one arm. Behind them a roadside orchard stand with a shingle roof, wooden bins of apples, a blank chalkboard on an easel facing the road, and a brown-and-white dog sitting exactly at a fence post. Long morning shadows across the gravel. No lettering on the board.
- Motion prompt: The boy on the step talks and climbs one step. The girl behind him lifts her eyes to the camera and does not smile. The dog does not move.

**S13. 00:23.0 to 00:25.0. 2.0 s.**
- Frame: Rue's seat frame. Camera: ROLL. Who: Rue, Beck's shoulder.
- Action: the bus crawls onto the one-lane bridge. Every head turns left. Through Rue's window: the creek, the gravel bar, the heron.
- Line: BECK (off screen): "Creek's low." RUE: "There's the heron."
- Sound: the change in tire sound from gravel to wood planking. Music low. Water.
- Mouth: OFF (Rue faces the window, away from camera; Beck is off screen).
- Image prompt: [RUE] in row 11 door side, 50mm at f/2.8, three-quarter from behind so her face is turned fully to the window and only the line of her cheek shows, sketchbook open on her knees, a blurred striped shoulder in the near foreground, and through her window, sharp, a steel truss bridge girder passing, willows on the far bank, a wide slow brown-green creek with a gravel bar, and a gray heron standing on the bar. Morning light on the water.
- Motion prompt: The bridge girders pass slowly outside the window. The heron holds still. The girl's head tilts a fraction toward the glass. Her pencil lifts.

**S14. 00:25.0 to 00:26.5. 1.5 s. PLATE. LETTERING IN POST (the 12).**
- Frame: wide exterior. Camera: STATIC. Who: nobody.
- Action: the bus stops at the tracks. The door folds open. Nothing on the rails. Nothing at all.
- Line: none.
- Sound: air brakes, then the door fold. A single distant bell tone from a far crossing on the wind, mixed well under dialogue peak (section 5). Music holds on one note.
- Mouth: none.
- Image prompt: Wide exterior, 24mm, of a [BUS EXTERIOR] stopped on a gravel shoulder before a rail crossing, two tracks on a raised bed, a plain crossbuck sign with no lettering, a gate arm up, scrub on both sides, the rails running straight out of frame both ways, nothing on the tracks, flat morning light, no shadows, the bus's folding door just opening.
- Motion prompt: The folding door finishes opening. Grass moves. Nothing on the tracks. No lights blink.

**S15. 00:26.5 to 00:28.0. 1.5 s. COMPOSITE.**
- Frame: the mirror shot, wide. Camera: STATIC. Who: everyone.
- Action: the whole aisle from above the driver, bent at the edges. Dead silent. Beck in the back is having a full argument with Cal four rows up, using only his face. Rue writes it down. Tull opens his mouth. Hollis holds up one finger.
- Line: none.
- Sound: nothing but the idle. Music drops out for the Quiet.
- Mouth: none.
- Image prompt: The signature frame, 16mm, from above and behind the driver's seat looking straight down the aisle of a [BUS INTERIOR], the chrome rim of the convex mirror at the very top of frame, slight barrel distortion so the aisle bends at the edges and the red-handled rear door is small at the end. Overhead interior lights on. In the seats, small in frame: [HOLLIS] nearest on the door side holding up one finger without turning; [PRIYA] in row 2 door side; [CAL] in row 7 driver side with his feet on the hump, eyebrows raised; [RUE] in row 11 door side writing; [BECK] in row 12 door side half standing with a furious silent face; [MATEO] in row 12 driver side sideways; [TULL] in row 12 driver side beside him with his mouth open. No one speaks. Flat morning light. If the tool cannot hold seven faces, generate the empty aisle first and place each seat frame into it as a composite.
- Motion prompt: The boy at the back moves his eyebrows and jaw as if arguing without sound. The stocky boy in the middle answers with his eyebrows. The girl's pencil moves. The thin man's mouth closes. The boy in front lowers his finger. Everything else holds.

**S16. 00:28.0 to 00:29.5. 1.5 s.**
- Frame: close. Camera: STATIC. Who: Beck.
- Action: the face fight, close. Silent.
- Line: none.
- Sound: idle only.
- Mouth: none (his mouth moves, but no sound: this is the joke).
- Image prompt: Close-up, 50mm at f/2.8, of [BECK] half standing in the back row of a school bus with his mouth clamped shut and his eyebrows and eyes doing the whole argument, looking up the aisle, the rear door-side window behind him with a crossbuck and gate arm soft outside. Overhead interior lights on. Flat morning light.
- Motion prompt: His eyebrows go up, down, up. His eyes widen and narrow. His mouth stays shut and works at the corners. His head does not move.

**S17. 00:29.5 to 00:30.5. 1.0 s.**
- Frame: the stairwell shot. Camera: STATIC. Who: Hollis, Tull far away.
- Action: Hollis, without turning, holds up one finger. At the far end of the aisle Tull closes his mouth.
- Line: none.
- Sound: idle only.
- Mouth: none.
- Image prompt: From the door steps looking up the aisle of a [BUS INTERIOR], 24mm, low at kid height, [HOLLIS] nearest in row 1 in sharp focus with one five-fingered hand raised beside his hood, one finger up, not turning around; the aisle beyond soft; [TULL] very small at the far end in the back row, mouth just closing. Overhead interior lights on. Flat morning light.
- Motion prompt: The near boy's finger rises a few inches and holds. The far man's mouth closes. Nothing else moves.

**S18. 00:30.5 to 00:32.5. 2.0 s.**
- Frame: Frances's mirror frame. Camera: STATIC. Who: Frances.
- Action: the door closes. Her eyes in the mirror.
- Line: FRANCES: "Rule of the crossing. That didn't count."
- Sound: the door fold shut. Engine into gear. Music returns under the line.
- Mouth: OFF (the mirror frame shows her eyes and the bridge of her nose only).
- Image prompt: Tight shot, 85mm at f/2.8, of the chrome-rimmed convex mirror above a school bus windshield, filling the frame, and in the mirror only [FRANCES]'s gray eyes with deep crow's feet, her brows, and the bridge of her long straight nose, the reading glasses pushed up into her silver hair at the top of the reflection, the aisle bent small and soft behind her eyes. Flat morning light.
- Motion prompt: Her eyes shift from the road to the aisle in the mirror and hold there. One slow blink. The reflection sways a fraction as the bus moves.

### Beat 3. Character. 00:32.5 to 00:54.5

The parliament in session. Longest takes in the trailer. Music under, warm, unhurried.

**S19. 00:32.5 to 00:37.0. 4.5 s.**
- Frame: wide from the aisle at row 10. Camera: PUSH. Who: Mateo, Beck, Rue, Cal.
- Action: Mateo sideways across the back row, driver side, one knee up. Beck across the aisle. Rue in front of Beck with the sketchbook. Cal on the hump with the ledger. The road goes by behind all of them.
- Line: MATEO: "The day my cousin gets that car I'm gone. Anyway, who's got the window Tuesday?"
- Sound: road bed, music, four kids' small sounds.
- Mouth: OFF (Mateo's head is against the glass facing across the bus, his mouth turned away from the camera at this angle; he speaks without moving his head).
- Image prompt: Wide shot from the aisle at row 10 looking back, 24mm, late-afternoon light from the driver side. [MATEO] lying sideways across the back row driver side with one knee up and his head against the rear window, face turned toward the door side so his mouth is away from camera, turning an empty key ring on one finger. [BECK] across the aisle in the back row door side, leaning forward. [RUE] in row 11 door side over her sketchbook. [CAL] nearest, row 7 driver side, feet on the hump, ledger open. Through every window an orchard road passing, soft. [BUS INTERIOR].
- Motion prompt: The camera pushes forward very slowly, five percent of the frame. The road drifts past the windows. The key ring turns on the tall boy's finger. The stocky boy's pen moves. Nobody stands.

**S20. 00:37.0 to 00:38.5. 1.5 s.**
- Frame: Beck's seat frame, low. Camera: STATIC. Who: Beck.
- Action: Beck stands. He fills the frame to the roof.
- Line: BECK: "I move that it's me."
- Sound: vinyl creak, music.
- Mouth: SYNC. Fallback: play the line over S19 extended, with Beck rising small in the wide.
- Image prompt: [BECK] in the back row door side, 50mm at f/2.8, camera low in the aisle, caught halfway to standing, one hand on the seat rail in front like a podium, eyebrows up, mouth open on a vowel, the rear door-side window behind him with the orchard road soft outside, the roof of the bus just above his head. Late-afternoon light from the driver side.
- Motion prompt: He rises the rest of the way until his head nearly touches the roof and speaks the line, a formal motion delivered with full confidence, mouth movement matched to the audio, hand staying on the rail.

**S21. 00:38.5 to 00:41.5. 3.0 s.**
- Frame: over Priya's shoulder from above, looking back down the aisle. Camera: STATIC. Who: Priya (from behind), Beck small at the end.
- Action: Priya, row 2, does not turn around. Far down the aisle, Beck sits.
- Line: PRIYA: "Section three. No standing. I wrote section three. Sit."
- Sound: her voice flat and quick, music.
- Mouth: OFF (camera behind her).
- Image prompt: From above and behind [PRIYA] in row 2 door side, 24mm, her braid with the blue scrunchie and the top of the composition book in the near foreground, sharp, the aisle of the [BUS INTERIOR] running away from her to the back row where [BECK] stands small and then, soft, the rear door with its red handle. She faces forward. Late-afternoon light from the driver side.
- Motion prompt: The girl's pencil taps the page twice. At the far end of the aisle the standing boy sits down. Nothing else moves.

**S22. 00:41.5 to 00:43.0. 1.5 s.**
- Frame: Beck's seat frame. Camera: STATIC. Who: Beck.
- Action: seated now.
- Line: BECK: "I move it sitting down."
- Sound: music.
- Mouth: SYNC. Fallback: LISTENER on Cal (S23 framing) with Cal's eyes lifting from the ledger.
- Image prompt: [BECK] fully seated in the back row door side, 50mm at f/2.8, camera low in the aisle, one hand still on the seat rail in front, chin up, mouth closed, the rear door-side window behind him. Late-afternoon light from the driver side.
- Motion prompt: He speaks the line, dignified, mouth movement matched to the audio, and lifts his chin a fraction on the last word.

**S23. 00:43.0 to 00:44.5. 1.5 s.**
- Frame: Cal's seat frame. Camera: STATIC. Who: Cal.
- Action: Cal, ledger on his knees, does not look up.
- Line: CAL: "Window's been sold. Twice."
- Sound: music.
- Mouth: SYNC, light (chin down, mouth partly hidden by the angle). Fallback: an insert of the ledger page and his pen, 85mm, with the line off camera.
- Image prompt: [CAL] in row 7 driver side, 50mm at f/2.8, slightly wide to show his feet on the wheel hump, the green clothbound ledger open on his knees with blank pages and colored tabs, his chin down toward the ledger, eyes on the page, the mid-bus window behind him with the orchard road soft outside. Late-afternoon light from the driver side.
- Motion prompt: He speaks the line without looking up, mouth movement small, and turns one page of the ledger.

**S24. 00:44.5 to 00:45.5. 1.0 s.**
- Frame: Rue's seat frame. Camera: STATIC. Who: Rue.
- Action: her eyes come up before her head does. The one line.
- Line: RUE: "To who?"
- Sound: music.
- Mouth: SYNC, two syllables. Fallback: her line off camera over S23.
- Image prompt: [RUE] in row 11 door side, 50mm at f/2.8, three-quarter profile, chin down over the sketchbook, deep brown eyes lifted toward the camera, mouth closed, the road sharp behind her window, a blurred striped shoulder in the near foreground. Late-afternoon light from the driver side.
- Motion prompt: Her eyes come up first. Then her head lifts a fraction and she speaks two short syllables, small mouth movement matched to the audio.

**S25. 00:45.5 to 00:47.5. 2.0 s.**
- Frame: Cal, close. Camera: STATIC. Who: Cal.
- Action: he closes the ledger on his finger.
- Line: CAL: "That's between me and both of them."
- Sound: music.
- Mouth: SYNC, light (chin down). Fallback: LISTENER on Rue (S24 framing).
- Image prompt: Close-up, 50mm at f/2.8, of [CAL] in row 7, chin down, small sharp blue eyes up, the ledger half closed on one five-fingered hand, the gap between his front teeth visible as his mouth opens, the mid-bus window soft behind him. Late-afternoon light from the driver side.
- Motion prompt: He speaks the line with the ledger closing on his finger, mouth movement matched to the audio, eyes on the aisle, no head movement.

**S26. 00:47.5 to 00:49.0. 1.5 s.**
- Frame: Hollis's seat frame, from the stairwell. Camera: STATIC. Who: Hollis.
- Action: Hollis grabs the seat back in front of him.
- Line: HOLLIS: "Left. Left. Big one."
- Sound: music, the road sound sharpening.
- Mouth: SYNC. Fallback: S10's from-behind framing with the line off camera.
- Image prompt: [HOLLIS] in row 1 door side, 50mm at f/2.8, camera low from the stairwell looking slightly up, both hands tightening on the chrome seat rail, shoulders up around his ears, eyes on the road through the windshield off frame, the folding door glass behind him, the driver's shoulder and the steel thermos at the left edge. Late-afternoon light from the driver side.
- Motion prompt: He speaks three short words, mouth movement matched to the audio, and braces harder on the rail. His shoulders go up.

**S27. 00:49.0 to 00:50.5. 1.5 s. COMPOSITE.**
- Frame: the mirror shot, wide. Camera: STATIC. Who: everyone.
- Action: the bus drops. Everyone lifts an inch off the vinyl and comes back down. Tull's stopwatch leaves his hand and returns.
- Line: none.
- Sound: the pothole: a thump under dialogue peak, vinyl, a shared inhale. Music holds.
- Mouth: none.
- Image prompt: The same signature frame as S15, 16mm, late-afternoon light from the driver side, overhead lights off, every rider seated as in S19 with [PRIYA] in row 2, [HOLLIS] in row 1, [CAL] in row 7, [RUE] in row 11, [BECK], [MATEO], and [TULL] in row 12, all upright and expectant, the stopwatch in the thin man's hand.
- Motion prompt: One single vertical bump: the whole frame dips and returns once, and every rider lifts an inch and settles. The thin man's stopwatch hops out of his hand and drops back into it. No other motion.

**S28. 00:50.5 to 00:54.5. 4.0 s.**
- Frame: Frances's mirror frame. Camera: STATIC. Who: Frances.
- Action: her eyes in the mirror. She has heard every word.
- Line: FRANCES: "I'm not listening. I'm driving. I just drive with my ears."
- Sound: road bed, music thinning so the line sits alone.
- Mouth: OFF (mirror frame).
- Image prompt: The same mirror frame as S18, 85mm at f/2.8, [FRANCES]'s gray eyes in the chrome-rimmed convex mirror, the crow's feet just beginning to move, the aisle bent small behind. Late-afternoon light from the driver side.
- Motion prompt: Her eyes stay on the aisle in the mirror through the whole line. On the last word the crow's feet deepen a fraction and go flat again. One blink. The reflection sways with the bus.

### Beat 4. Turn. 00:54.5 to 01:13.0

**S29. 00:54.5 to 00:57.5. 3.0 s. LETTERING IN POST is NOT used here: the marquee stays blank with one empty letter slot visible.**
- Frame: the door shot. Camera: STATIC. Who: Ms. Odum.
- Action: the bus sits in the school loop with the door open. Through the door, a brick school, a marquee sign missing a letter. Ms. Odum steps up with a clipboard.
- Line: MS. ODUM: "Frances. The office says the county called about Route 12."
- Sound: a school loop: other engines, a whistle far off, kids at a distance as a low wash, never a cheer. Music low.
- Mouth: SYNC (adult, on the step, head slightly down toward the clipboard). Fallback: cut to S30 early and play her line as off screen over Frances's eyes.
- Image prompt: From inside a school bus at the top of the steps looking down and out through the open folding door, 50mm at f/2.8, [ODUM] on the bottom step looking up, and behind her out of focus a two-story brick school with a flat roof, a blank marquee sign on the lawn with one empty slot in its letter rail, gym double doors, a playground to the right, the tail of another yellow bus ahead. Morning light from the door side.
- Motion prompt: She climbs one step and speaks the line, mouth movement matched to the audio, tired and kind, the clipboard held to her chest. Nothing behind her moves except a flag on the school's pole.

**S30. 00:57.5 to 00:59.0. 1.5 s.**
- Frame: Frances's mirror frame. Camera: STATIC. Who: Frances.
- Action: her eyes.
- Line: FRANCES: "The county's on the bus."
- Sound: loop wash, music low.
- Mouth: OFF.
- Image prompt: Mirror frame as S18, [FRANCES]'s eyes, morning light from the door side, the aisle behind her eyes with the school's brick soft through the windows.
- Motion prompt: Her eyes flick toward the door and back to the aisle. One blink.

**S31. 00:59.0 to 01:01.0. 2.0 s.**
- Frame: the stairwell shot, Ms. Odum's view. Camera: STATIC. Who: Tull far away; Hollis nearest.
- Action: she looks up the aisle. Tull, at the far end, lifts the stopwatch in greeting.
- Line: MS. ODUM (off screen): "Morning, sir."
- Sound: loop wash, music low.
- Mouth: OFF.
- Image prompt: From the door steps looking up the aisle of a [BUS INTERIOR], 24mm, low, [HOLLIS] nearest in row 1 looking straight ahead, the aisle in focus all the way back, [TULL] at the far end in the back row, the silver stopwatch raised in one hand in a small greeting. Morning light from the door side.
- Motion prompt: The far man lifts the stopwatch a few inches and lowers it. The near boy does not move.

**S32. 01:01.0 to 01:07.0. 6.0 s.**
- Frame: medium, Tull in the aisle. Camera: STATIC. Who: Tull.
- Action: he clicks the stopwatch and stands in the aisle. Nobody tells him to sit. That is how they know. He states the terms.
- Line: TULL: "Route 12 runs nine minutes over the county limit. Cut nine minutes, or the county splits the route."
- Sound: the stopwatch click, dry and clear. Music drops to nothing on "splits."
- Mouth: SYNC. This is the longest on-camera line. Fallback: split the line. First sentence SYNC on Tull; second sentence LISTENER over the mirror wide (S33 framing) so his face is small.
- Image prompt: Medium shot, 50mm at f/2.8, camera in the aisle at row 3 looking back, of [TULL] standing in the aisle at row 6 with his head close to the roof, holding the stopwatch at his chest with five fingers, wire glasses, neutral face, a man stating a fact he did not write, the seats and small figures of [CAL] and [RUE] soft beyond him, the rear door soft at the end. Morning light from the door side.
- Motion prompt: He clicks the stopwatch once and rises from off frame bottom into the standing position in the first second, then speaks the two sentences plainly, mouth movement matched to the audio, no gestures, the watch held still.

**S33. 01:07.0 to 01:08.5. 1.5 s. COMPOSITE.**
- Frame: the mirror shot, wide. Camera: STATIC. Who: everyone.
- Action: silence. Not the Quiet. Worse.
- Line: none.
- Sound: engine idle only. No music.
- Mouth: none.
- Image prompt: The signature frame as S15, 16mm, morning light from the door side, every rider seated and still, faces down or turned to the windows, [TULL] standing in the aisle at row 6 seen from above and behind, small.
- Motion prompt: Nobody moves. The tall boy at the back turns his head an inch toward his window. That is the only motion.

**S34. 01:08.5 to 01:09.5. 1.0 s.**
- Frame: Beck, close. Camera: STATIC. Who: Beck.
- Action: seated, small for the first time.
- Line: BECK (small): "Which nine?"
- Sound: idle only.
- Mouth: SYNC, two words. Fallback: LISTENER on Rue.
- Image prompt: Close-up, 50mm at f/2.8, of [BECK] seated all the way back in his seat for once, hands in his lap, eyebrows down, mouth closed, the rear door-side window behind him with the school's brick soft outside. Morning light from the door side.
- Motion prompt: He speaks two quiet words, mouth movement matched to the audio, and his eyebrows come down further. No other motion.

**S35. 01:09.5 to 01:11.5. 2.0 s.**
- Frame: Mateo's seat frame. Camera: STATIC. Who: Mateo.
- Action: Mateo looks out his window. Behind the glass, in his head and in the plate: the lane, the orchard, the bridge. Whichever nine it is.
- Line: MATEO: "I said I wanted off."
- Sound: idle, a single low note of music returns.
- Mouth: OFF (face turned to the glass, away from camera).
- Image prompt: [MATEO] in row 12 driver side, 50mm at f/2.8, camera from the aisle a hair below his eyeline, sitting forward now, not sideways, his head turned fully to his window so only the back of his jaw and his ear show, the empty key ring still on one finger, and through his window, sharp, a long gravel lane rising to a white farmhouse. Morning light from the door side.
- Motion prompt: He speaks the line to the glass, his face away from camera, and the key ring stops turning. The lane outside does not move.

**S36. 01:11.5 to 01:13.0. 1.5 s.**
- Frame: Rue's seat frame. Camera: STATIC. Who: Rue.
- Action: she does not look up from the sketchbook.
- Line: RUE: "You said it to the window."
- Sound: idle, the low note holds.
- Mouth: SYNC, light (chin down, three-quarter profile). Fallback: LISTENER on Mateo's reflection in his window.
- Image prompt: [RUE] in row 11 door side, 50mm at f/2.8, three-quarter profile, chin down over the sketchbook, eyes on the page, pencil moving, the road sharp behind her window. Morning light from the door side.
- Motion prompt: She speaks the line without lifting her head, small mouth movement matched to the audio, and the pencil keeps moving.

### Beat 5. Button. 01:13.0 to 01:20.5

**S37. 01:13.0 to 01:15.0. 2.0 s.**
- Frame: two-shot, back row, from the front, from slightly above. Camera: STATIC. Who: Tull, Priya.
- Action: Tull is still in the contested seat. Priya has come all the way back from row 2 and sits beside him with the book open. The cold open, from the front.
- Line: PRIYA: "All in favor of the county sitting somewhere else."
- Sound: idle, music returns warm.
- Mouth: OFF (book edge).
- Image prompt: Two-shot in the back row of a school bus, 50mm at f/2.8, camera in the aisle at row 10 facing back, slightly above the smaller person's eyeline. [TULL] on the driver side, folded, knees up, stopwatch in hand. [PRIYA] beside him on the aisle seat, back straight, backpack on both shoulders, the composition book held high with its top edge hiding her mouth, her eyes on the aisle ahead. Late-afternoon light from the driver side.
- Motion prompt: The girl's eyes sweep the aisle once, left to right. The man looks at her, then straight ahead. Nothing else.

**S38. 01:15.0 to 01:17.0. 2.0 s. COMPOSITE.**
- Frame: the mirror shot, wide. Camera: STATIC. Who: everyone.
- Action: six hands. Mateo's goes up last, and he does not look up.
- Line: none.
- Sound: idle, music.
- Mouth: none.
- Image prompt: The signature frame as S15, 16mm, late-afternoon light from the driver side, [HOLLIS], [PRIYA] (now in the back row beside [TULL]), [CAL], [RUE], and [BECK] each with one five-fingered hand raised, [MATEO] in the back row with his hand still in his lap and his face turned to his window, [TULL] beside him with both hands on the stopwatch.
- Motion prompt: One motion only: the tall boy at the back raises his hand slowly without turning his head. The other five hands hold still.

**S39. 01:17.0 to 01:19.0. 2.0 s.**
- Frame: Tull, close. Camera: STATIC. Who: Tull.
- Action: a beat. Tull's hand goes up too. Slowly.
- Line: none.
- Sound: idle, music holds one chord.
- Mouth: none.
- Image prompt: Close-up, 50mm at f/2.8, of [TULL] folded in the back row, looking at the raised hands off frame, mouth closed, the stopwatch in his lap, his right hand resting on his knee with five fingers. Late-afternoon light from the driver side.
- Motion prompt: After a pause his right hand rises slowly from his knee to shoulder height and stops. His face does not change. No other motion.

**S40. 01:19.0 to 01:20.5. 1.5 s.**
- Frame: Priya, close, from above. Camera: STATIC. Who: Priya.
- Action: she looks over the book at him.
- Line: PRIYA: "Motion carries. Sir."
- Sound: idle, music.
- Mouth: OFF (book edge). The kid laugh is in her eyes and the pause before "Sir."
- Image prompt: Close-up from slightly above, 50mm at f/2.8, of [PRIYA] in the back row, the composition book held high with its top edge covering her mouth, her large dark eyes turned up and sideways toward the man beside her off frame left, thick straight eyebrows level. Late-afternoon light from the driver side.
- Motion prompt: Her eyes hold on the man for the first two words, then drop back to the page on the last word. One blink. Nothing else.

### Beat 6. Last line and title. 01:20.5 to 01:30.0

**S41. 01:20.5 to 01:22.0. 1.5 s. LETTERING IN POST (the 12 on the door panel if visible).**
- Frame: exterior, close on the door. Camera: STATIC. Who: Tull, partial.
- Action: the door folds shut. The last thing through the gap is the stopwatch, still running.
- Line: none.
- Sound: the door fold. Air brake release. Music resolving.
- Mouth: none.
- Image prompt: Exterior close-up, 85mm at f/2.8, of a [BUS EXTERIOR] folding door half closed, and through the narrowing gap, inside, the silver stopwatch on its black cord at the chest of a tall thin man standing in the aisle, his maroon tie and white short-sleeve shirt, his face above frame. Late-afternoon light from the left.
- Motion prompt: The door folds the rest of the way shut over two seconds. The stopwatch's second hand sweeps in the gap until the door hides it. Nothing else.

**S42. 01:22.0 to 01:23.0. 1.0 s. COMPOSITE.**
- Frame: the mirror shot, wide. Camera: ROLL. Who: everyone.
- Action: the bus pulls out. Tull is on his feet in the aisle, looking for anywhere else.
- Line: none.
- Sound: engine into gear, road bed returns.
- Mouth: none.
- Image prompt: The signature frame as S15, 16mm, late-afternoon light from the driver side, every rider seated, [TULL] standing in the aisle at row 6 seen from above and behind, head turning, the school's brick moving past the windows.
- Motion prompt: The view outside every window begins to slide as the bus moves. The standing man's head turns from one side of the bus to the other. Riders sway a fraction together.

**S43. 01:23.0 to 01:25.0. 2.0 s.**
- Frame: Frances's mirror frame. Camera: STATIC. Who: Frances.
- Action: her eyes. The last line.
- Line: FRANCES (to the mirror): "Sit down, sir. We're not there yet."
- Sound: road bed, music down to one held note.
- Mouth: OFF.
- Image prompt: Mirror frame as S18, [FRANCES]'s gray eyes in the chrome-rimmed convex mirror, late-afternoon light from the driver side, the aisle bent small behind with a tall standing figure in it.
- Motion prompt: Her eyes hold on the standing figure in the mirror through the whole line. On "yet" they go back to the road. The reflection sways with the bus.

**S44. 01:25.0 to 01:26.0. 1.0 s.**
- Frame: two-shot, back row, from the front. Camera: STATIC. Who: Tull, Priya.
- Action: Tull sits. Same seat. Then cut to black.
- Line: none.
- Sound: vinyl. The held note ends. Silence for the black.
- Mouth: none.
- Image prompt: Same framing as S37, [PRIYA] seated with the book on her lap, and beside her the empty driver-side seat with a green vinyl cushion, the rear window behind with the school sliding past.
- Motion prompt: The tall thin man in the maroon tie lowers into the empty seat from above frame, knees coming up, until he is folded exactly as before. The girl does not look up. Cut to black.

**S45. 01:26.0 to 01:30.0. 4.0 s. TITLE CARD. Built by the editor. Not generated.**
- Black for 0.5 s. Then the card fades up over 0.3 s and holds.
- Text, exactly as the script: LONG ROUTE / Hangout / Premieres Friday on [BRAND]. / The account holder is a parent.
- Sound: silence, then room tone. The site's 3-second Click follows the file; the file itself ends clean.

Shot count summary: 45 shots. 44 are generated and S45 is built by the editor. Of the 44, five are composites of the mirror frame (S15, S27, S33, S38, S42), two are plates with no people (S07, S14) plus the empty-aisle plate that the composites are built on, nine require lip sync (S05, S20, S22, S24, S26, S29, S32, S34, S36), and three are sync-light with an OFF fallback (S09, S23, S25). Unique base stills to generate, after reuse of the mirror frame, the two back-row two-shots, and Frances's mirror frame: about 36.

---

## 4. Voice and dialogue plan

### Lines that need a performed voice

Every line in the trailer is a character speaking to a character. There is no narrator. Thirty-one lines, nine voices.

| # | Shot | Character | Line | Emotional read |
|---|---|---|---|---|
| 1 | S02 | Priya | You're in a contested seat. | Flat, factual, not looking up. A clerk reading a rule. |
| 2 | S03 | Tull | I'm from the county. | Mild. He thinks this settles it. |
| 3 | S04 | Priya | Then you should know better. | Same flatness. No triumph. |
| 4 | S05 | Tull | Is that in the book? | Honest curiosity. He wants to know. |
| 5 | S06 | Priya | Section eight. It's in the book. | Quick, sincere, done. |
| 6 | S09 | Tull | Why aren't we moving? | Puzzled, polite. |
| 7 | S10 | Hollis | Waiting on the wave. | Quiet, forward, as if everyone knows. |
| 8 | S12 | Beck | (unheard sentence, low, under the engine) | Cheerful, mid-story. No distinct words. |
| 9 | S13 | Beck | Creek's low. | Observation. Every-morning voice. |
| 10 | S13 | Rue | There's the heron. | Soft, pleased, the one line she says all morning. |
| 11 | S18 | Frances | Rule of the crossing. That didn't count. | Dry, to the mirror, no smile in the voice. |
| 12 | S19 | Mateo | The day my cousin gets that car I'm gone. Anyway, who's got the window Tuesday? | Bored on the first sentence, in charge on the second. |
| 13 | S20 | Beck | I move that it's me. | Full parliamentary confidence. |
| 14 | S21 | Priya | Section three. No standing. I wrote section three. Sit. | Fast, sincere, four flat beats. |
| 15 | S22 | Beck | I move it sitting down. | Dignity intact. |
| 16 | S23 | Cal | Window's been sold. Twice. | A shopkeeper stating inventory. |
| 17 | S24 | Rue | To who? | Small, genuinely curious. |
| 18 | S25 | Cal | That's between me and both of them. | Professional discretion. |
| 19 | S26 | Hollis | Left. Left. Big one. | Urgent but not loud. A warning he has given a thousand times. |
| 20 | S28 | Frances | I'm not listening. I'm driving. I just drive with my ears. | Dead level. This is the parent laugh. No wink. |
| 21 | S29 | Ms. Odum | Frances. The office says the county called about Route 12. | Tired, kind, a little worried. |
| 22 | S30 | Frances | The county's on the bus. | Flat. A fact. |
| 23 | S31 | Ms. Odum | Morning, sir. | Polite, taken aback. |
| 24 | S32 | Tull | Route 12 runs nine minutes over the county limit. Cut nine minutes, or the county splits the route. | Plain. Not a threat. A man reading a memo he did not write. |
| 25 | S34 | Beck | Which nine? | Small. The first time he is small. |
| 26 | S35 | Mateo | I said I wanted off. | To the glass. Not to anyone. |
| 27 | S36 | Rue | You said it to the window. | Gentle, without looking up. This is the talk-about-it-after line. |
| 28 | S37 | Priya | All in favor of the county sitting somewhere else. | Procedural. Not unkind. |
| 29 | S40 | Priya | Motion carries. Sir. | A pause before "Sir." The kid laugh lives in that pause. |
| 30 | S43 | Frances | Sit down, sir. We're not there yet. | Warm under the dry. The last line of the trailer. |

### Synthesized voice versus hired voice, by character

| Character | Synthesized (CG-03) | Hired voice actor (CG-04) | Note |
|---|---|---|---|
| Frances | Not recommended. The bible (section 11) says the dry counterpoint does not survive synthesis. Her four lines carry both the parent laugh and the last line. | Recommended. One adult actor, 50s or 60s, low and level. | Mouth is never on camera, so no sync is needed. |
| Priya | Possible in principle. Her lines are flat and fast, which synthesis can do. The risk is that a synthetic child voice is the single most "slop" element a parent can hear. | Recommended. | Mouth never on camera. Counsel decides whether the actor is a child performer or an adult with a young read. |
| Tull | Possible. Adult, neutral, plain. The most synthesis-tolerant voice in the trailer. | Recommended for consistency with the rest of the cast. | Two SYNC shots. A recorded human line drives the sync better than a synthetic one. |
| Hollis, Mateo, Beck, Rue, Cal | Not recommended. Five distinct kid voices with comic timing between them, overlapping in beat 3. | Recommended. Five actors. | Counsel decides child versus adult-with-young-read. |
| Ms. Odum | Possible. Two lines. | Recommended, can double as another adult role in a different show's trailer. | One SYNC shot. |
| Beck's unheard line (S12) | Not needed. | The Beck actor ad-libs one sentence at low level. | Words must not be distinct. |

### Recommendation for v1: hired voice actors for every line

Path: record all thirty lines with hired voice actors under CG-04. Generate all pictures under CG-03. Do not synthesize any voice at v1.

Why:
1. The bible already rules that Frances's and Priya's reads do not survive synthesis, and those two voices carry the cold open, the parent laugh, the button, and the last line. The trailer is those four moments.
2. A synthetic child voice is the element most likely to make a parent close the tab, and the element counsel is most likely to refuse at CG-03. Taking it off the table narrows CG-03 to images and motion, which makes the disclosure shorter and the sign-off simpler.
3. The lines total about 55 seconds of speech. Nine voices can be recorded remotely in one session with a director on the line. The cost is a session fee per actor, not a production.
4. Recorded human lines are the best driver for the nine lip-sync shots. Synthetic audio driving synthetic mouths compounds the error.

What counsel must answer under CG-04 before the session: whether the six kid roles are voiced by child performers (which adds permit, parent consent, and schooling rules) or by adult actors with young-reading voices; which union or non-union agreement applies; and whether the actors' agreements cover use in a trailer that is AI-assisted in picture, with the disclosure in section 8 shown to them before signing.

If the owner chooses synthesis for any voice anyway, that voice is listed in the disclosure by character name, the synthetic voice must not be cloned from or modeled on any real person, and the CG-03 log entry names the tool and the voice model.

---

## 5. Sound plan

### The sonic ID at head and tail

The trailer file itself contains no bumper (block bible section 8). The site plays the 8-second Porch Intro before it and the 3-second Click after it. The sonic ID therefore sits in the wrap, and the trailer must be built to meet it.

- Head. The Porch Intro ends with the two-part pull-chain click (the pull and the release, recorded from a real chain, never synthesized) and the four rising notes on a plucked instrument with a soft attack (nylon-string guitar or kalimba), unresolved. Then silence. The block starts in the silence. The trailer's first frame is black for 0.25 seconds with room tone only, so the fourth note's silence is not stepped on. S01's stopwatch tick is the first sound.
- Tail. The trailer ends on the title card and room tone. The Click after it plays the four notes resolved, then the chain click, then silence. The title card's last 0.5 seconds carry no music, so the Click's notes land in a clean bed.
- For review only, the editor also exports a wrapped version with the Porch Intro and the Click attached (section 6), so the owner and counsel hear the handoffs. That version does not go to the site.
- The click and the four notes never exceed the dialogue peak (block bible section 4.4, STANDARDS soft rule 8).

### Beds and effects

- Road bed. Engine at idle, first gear, and cruising. Tires on gravel, then on wood planking at the bridge (S13), then on asphalt at the loop (S29 to S32). Record or license clean, unbranded engine and tire beds; no sound library clip with a recognizable horn or jingle.
- Bus door. One real school-bus folding-door recording: open (S14), close (S18), open at the loop (already open at S29), close (S41). Same sample every time. It is a character.
- Air brakes. Once at S14 and once at S41. Under dialogue peak.
- The stopwatch. A dry mechanical tick under S01 to S06 and one clean click at S32. The tick never rises above the dialogue.
- The rail crossing (S14). No train ever. The gate arm is up and the bus flashers are not shown cycling. The sound is the door fold, wind on the rails, and a single distant crossing bell tone carried on the wind from far down the line, mixed at least 6 LU below the dialogue peak of the trailer (soft rule 8). It reads as place, not alarm.
- The pothole (S27). One thump and a shared inhale, under dialogue peak. No crash, no glass.
- The school loop (S29 to S32). A low wash of other engines, a whistle far off, distant kids as texture. No cheer, no scream, no recognizable phrase.
- The Quiet (S15 to S17) and the silence after the terms (S33). Engine idle only. Music out. These two silences are the shape of the trailer.

### No strobe

No light in the trailer flashes. The bus's red flashers are not shown cycling. The crossing lights do not blink. The school marquee does not blink. No cut faster than 1.0 second anywhere. This satisfies STANDARDS soft rule 9 with margin.

### Music brief

- Instruments. Two only: an upright bass, played pizzicato, and a nylon-string guitar. Both real, recorded, close-miked, with room tone. The upright bass is Frances's instrument in the bible, so the bed belongs to the world. No drums, no pad, no strings.
- Tempo. 84 beats per minute, the pulse of an engine at idle. Straight feel. No swing.
- Key and mood. Major, unhurried, dry, warm. The feeling of a long ride you do not want to end. It sits under dialogue and never asks for attention.
- Structure against the cut. Silent for beat 1. Enters at S07 on the bass alone. Guitar joins at S08. Drops out for the Quiet (S15 to S17). Returns under Frances at S18. Runs through beat 3, thinning under S28 so the parent laugh sits alone. Holds one note under S32 and drops to nothing on "splits." Silence through S33 and S34. One low bass note returns at S35. Warm again at S37, one held chord at S39, resolving through S41 to S43, and ending on a single held guitar note that stops on the cut to black at S44. Nothing under the title card.
- Loudness. Peaks no louder than the dialogue peak. Music sits at least 8 LU under dialogue whenever anyone speaks.
- What it must not sound like. No sitcom theme. No whistling. No ukulele-and-handclap commercial. No orchestral swell. No synth pad. No riser or whoosh. No sampled kids' cheer. No lyric. No melody that resolves like an advertisement. No resemblance to any television theme, network ident, or block jingle from any era. Any resemblance fails STANDARDS item 12.
- Relationship to the sonic ID. The music never quotes the four notes. The four notes belong to the block, not to the show.

### Mix targets

- Dialogue peaks at the top of the mix. Everything else is measured against it.
- Integrated loudness matched to the sonic ID master so the handoff at the head and tail does not jump.
- Dialogue intelligibility is checked on a phone speaker, not only on monitors, because that is where a parent will hear it first.

---

## 6. Edit plan

### Stitch order

S01 through S44 in numbered order, then the title card S45. No shot is reordered. The cold open and the button are the same setup from two sides, and the cut depends on the viewer seeing S02 before S37.

### Cut rhythm per beat

| Beat | Shots | Rhythm | Note |
|---|---|---|---|
| 1. Cold open | S01 to S06 | 1.5 to 2.5 s per cut, every cut on a line | Hard cut to S07 on the last word of "It's in the book." No dissolve anywhere in the trailer. |
| 2. World | S07 to S18 | 1.5 to 2.0 s, one plate then one face, alternating | The Quiet (S15 to S17) cuts on nothing: no line, no music. Three shots, three silences. |
| 3. Character | S19 to S28 | Loosest in the trailer: 4.5 s open, then 1.0 to 3.0 s on lines, then 4.0 s hold on Frances | Overlap the audio: each kid's line starts a few frames before the cut to their face. The parliament feels alive because the sound leads the picture. |
| 4. Turn | S29 to S36 | 3.0, 1.5, 2.0, then a 6.0 s hold on Tull, then 1.5, 1.0, 2.0, 1.5 | Do not cut away from Tull during the terms. The hold is the turn. |
| 5. Button | S37 to S40 | 2.0, 2.0, 2.0, 1.5 | Match the cold open's tempo so the callback lands as a rhyme. |
| 6. Last line | S41 to S44 | 1.5, 1.0, 2.0, 1.0, then black | The last line plays clean over her eyes. Tull sits. Cut to black on the vinyl creak. |

### Title card

- Lands at 01:26.0 after 0.5 s of black. Fades up in 0.3 s. Holds to 01:30.0.
- Composition, from the identity brief: the dark set. Background #15130F. Type in #EFE6D3. LONG ROUTE in Archivo at the condensed width (70 to 80), weight 800, all capitals, tracked tight, centered. Below it, a single hairline rule at ink 20 percent. Below the rule, "Hangout" in Archivo width 100 weight 500 small caps. Below that, "Premieres Friday on [BRAND]." in Newsreader italic at optical size 16. At the bottom, small, in Newsreader at ink 60 percent: "The account holder is a parent."
- The masthead. [BRAND] renders as the site's single config constant, provisionally STREETLIGHTS, set as the identity brief's Direction 1 masthead: condensed capitals, tracked tight, with the single amber dot (#FFD08A on the dark set) as the period after the name. The editor keeps the masthead on its own layer so Fork D can swap the word without a re-render of the picture.
- The Friday night line is the premiere line above. No other line. No call to action. No "subscribe," no "comment," no "share."
- No motion on the card except the single fade up. Type does not animate (identity brief section 5).

### Running time check

Pre-title picture runs 01:26.0. Title card runs 4.0 s. Total 90.0 s. If the recorded dialogue runs long, take time from S07, S08, S14, and S15 in half-second steps, never from a dialogue shot. If the recorded dialogue runs short, do not pad; let the master land between 88 and 90 seconds and keep the title card at 4.0 s.

The Dialogue test needs at least 60 percent of running time as a character speaking to a character on screen. This package estimates about 55 seconds of speech, close to the line. The editor measures the finished cut with a stopwatch. If it comes in under 60 percent, shorten S07, S08, S14, and S15 by 0.5 s each before touching anything else.

### Export settings

- Master: 1920 x 1080, 24 fps, Rec.709, ProRes 422 HQ, 48 kHz 24-bit stereo audio. Archived in `cut/`.
- Site delivery: MP4, H.264 High profile, two-pass VBR at 16 to 20 Mbps, keyframe every 2 seconds, faststart flag set, AAC 320 kbps 48 kHz stereo. Loudness normalized to the same integrated target as the sonic ID master, true peak no higher than minus 1 dBTP.
- Poster frame: a still from S15 (the mirror shot) at 1920 x 1080, JPEG at quality 90, for the listing card. No text on it.
- Review only: the wrapped version (Porch Intro + trailer + Click) as one MP4, same settings, not delivered to the site.
- File names: `long-route-trailer-v1.mov` (master), `long-route-trailer-v1.mp4` (site), `long-route-poster-v1.jpg`, `long-route-trailer-v1-wrapped.mp4` (review).

---

## 7. Quality gate

The finished trailer passes all twelve before `trailerUrl` in `projects/05-product/site/content/shows.json` is set for `long-route`. A single failure sends it back to the step named.

1. Faces consistent. Every character matches their master portrait in every shot. Check jaw, eye spacing, hairline, ears, and Cal's tooth gap. Fail: back to section 2 for that character and regenerate the shot.
2. No text artifacts. No lettering, numerals, or sign fragments anywhere in a generated frame. Only the editor's post lettering (the 12, the chalkboard line) and the title card carry text. Fail: regenerate the shot.
3. Hands. Five fingers on every visible hand in every frame of every clip. Fail: regenerate the clip.
4. Lip sync acceptable, or mouths off camera on dialogue. Each of the nine SYNC shots is judged on a phone screen at full size. If the sync reads as wrong, use that shot's fallback framing. No dialogue shot ships with a visibly wrong mouth.
5. Dialogue intelligible. Every one of the thirty lines is understood on a phone speaker at normal volume by someone who has not read the script.
6. Music under voice. Music at least 8 LU below dialogue whenever anyone speaks. No effect louder than the dialogue peak (soft rule 8). The crossing bell tone at least 6 LU under dialogue peak.
7. No flashing. No light cycles, no strobe, no cut under 1.0 s (soft rule 9).
8. Standards section 2. The `standards` agent returns PASS with zero FAIL. This package walks items 12 (no copied expression), 13 (neither block trademark), 14 (no real actor's likeness or voice), and 15 (CG-03 logged and the disclosure prepared) explicitly. The picture is also checked for accidental resemblance to any real person; any resemblance is a fail.
9. Standards section 3. Zero WARN. In particular: Hollis's finger at S17 reads as a shush, not contempt; no body joke; the S35 and S36 exchange is the talk-about-it-after moment; phones do not appear; apples are the only food; the crossing has no bell above dialogue and no cycling flashers.
10. The five trailer tests (block bible section 8). Question test: three cold viewers write "Will the county cut the Long Route?" or the same in their words. Two-Laugh test: the parent laugh at S28 and the kid laugh at S40 (backup at S15 to S17), each named and independent. Cold test: the first 12 seconds played with no title and no context get "what is this?" in the good way. Dialogue test: at least 60 percent by stopwatch. Standards test: item 8 and 9 above.
11. Wrap check. The head leaves 0.25 s of room tone for the Porch Intro's silence, the tail leaves 0.5 s of no music for the Click, and the wrapped review export plays through both handoffs without a level jump.
12. Disclosure prepared. The two sentences in section 8 are approved by counsel under CG-03, placed on the About page, and the CG-03 log entry lists every AI-generated element by shot number and every voice by path (hired or synthesized). The trailer is not public until this item is done. Also confirmed: no child call to action on the title card, and the parent line is present.

---

## 8. Disclosure draft for CG-03

Two sentences for the About page. Counsel edits and approves before the trailer is public. Bracketed text is filled in from the final cut.

> The Long Route trailer was made with AI-assisted production: every image and every moving picture in it, including the bus, the road, and all of the people on screen, was generated from written descriptions of original characters, and no real person, actor, or place was used as a source or a model. The voices were performed by [hired voice actors / hired voice actors, except the voice of NAME, which was synthesized] and the words were written by people; the finished trailer was edited, mixed, and reviewed by people before it was posted.

Companion log entry for the compliance register (not public): CG-03, Long Route trailer v1. AI-generated elements: all picture, shots S01 to S44, including likenesses of characters written as children (Hollis 13, Mateo 14, Beck 12, Rue 12, Cal 13, Priya 11, Ines 6). Human elements: script, voices (path per section 4), edit, mix, standards review. Tools: [image tool and version], [video tool and version]. Reference sheets and prompts archived at `projects/04-writers-room/out/production/long-route/`.

---

## Standards read of this package

Walked against `canon/STANDARDS.md` section 2. No prompt names a real person, actor, brand, or existing show (items 12, 13, 14). Every generated element is routed through CG-03 with a disclosure (item 15). The county man is folded and polite, never a threat (item 6). No weapon, no substance, no romance, no scare, no politics, no product, no call to action, no child data. Section 3: soft rules 8 and 9 are written into the sound plan and the quality gate. Section 4: no em dashes in this file; the title card states that the account holder is a parent.

Trailer production lead read: PASS.
