# RECENT HISTORY SOCIETY

## v1 trailer, AI-assisted production package

| Field | Value |
|---|---|
| Concept ID | W5 |
| Slot | Wildcard (Slot 3). Lead show by tournament score. |
| Length | 73 seconds exact. Floor 60, ceiling 75. |
| Script | `projects/04-writers-room/out/scripts/W5-recent-history-society-trailer.md` (binding) |
| Faces and sets | `projects/04-writers-room/out/scripts/W5-recent-history-society-character-sheet.md` (binding) |
| Look source | `projects/02-brand/out/identity-brief.md` sections 4, 5, 6, 8 |
| Format source | `projects/03-block-format/out/block-bible.md` sections 4.2 to 4.4 and 8 |
| Gates | CG-03 (generated image, generated narrator voice) is TRIGGERED by D-014. CG-04 triggers on any hired voice. Nothing in this package ships publicly before attorney sign-off on both gates that apply. |
| Tools | The owner named an image and video generation tool for pictures. An editor stitches, letters, and mixes. This file is written so either can work from it without the other. |

How to read this file.

1. Section 1 gives the look. Section 2 gives the faces. Every prompt in Section 3 refers to both by token name in braces, such as `{ANCHOR}` or `{PIPER}`.
2. Paste the full text of each token in place of its braces before sending a prompt to the tool. A text expander or a find-and-replace pass does this in one step.
3. Generate stills first. Approve stills. Only then animate. Never send a text-to-video request; every clip is image-to-video from an approved still.
4. The editor owns every letter that appears on screen. No generated frame contains readable text. Signs, banner, tabs, tent cards, plaque, and the title card are lettered by hand on paper, photographed, and composited in the edit.

---

## 1. Look bible

### 1.1 Visual intent

The show is a small play staged by serious people in a room too big for them, and the camera is one more member of the Society, seated in the third row, never leaning, never hurrying. Every frame is a held tableau: straight on, eye height of a seated adult, flat warm front light with one cool side from tall arched windows, and enough depth of field that the cardboard reads as cardboard. Late afternoon gold pours across a worn wood floor and brick walls, and the only things that glow are the windows and the sound booth lamp. Nothing is glamorous. Nothing is distressed. The comedy comes from dignity: people hold their poses, faces stay dead serious, the soup falls slowly and gets up. A frame that looks expensive is wrong. A frame that looks like a filter is wrong. The reference is a well-lit stage photograph of an amateur production taken by a professional, with the props visibly cut by hand.

### 1.2 Palette, adapted from the identity brief

The site palette is paper, ink, one accent, and one on-air glow. The trailer maps those roles onto the hall and the aisle so the trailer and the page feel like one publication.

| Brand role | Site value | In the hall and the aisle |
|---|---|---|
| Paper | warm cream #F3ECDD | Bonnet white, cardboard tan, the white panel cloth, the cream program pages, soup can labels |
| Ink | #1C1A16 | Navy (cap, cardigan, lectern), the dark timber rafters, the shadows on the backdrop |
| Accent | brick red #C9391E | The brick walls, the red curtain, the red card, Piper's red sneakers, the red chair |
| On-air glow | amber #FFC46B | The late gold in the arched windows, the booth lamp at the back of the hall |
| Supporting | none on the site | Filing-cabinet green (the Archive, the green chair), camel (Imani's blazer), lilac (Mrs. Tulliver) |

Nothing neon. No gradients except the fall of window light across the floor. No color gels.

### 1.3 Style anchor

Prepend this sentence, unchanged, to every image prompt. It is token `{ANCHOR}`.

> `{ANCHOR}` = "A clean cinematic still from a family comedy, shot on a 35mm digital cinema camera with a prime lens at the eye height of a seated audience, straight on, camera level, flat warm front light with one cool side light from tall arched windows, late afternoon gold, deep focus at f/4 so painted cardboard props read as cardboard, palette of brick red, navy, cardboard tan, bonnet white, filing-cabinet green, and warm amber window light, inside a long brick and timber hall with a worn wood floor, sharp and clean with no film grain, no texture, no vignette, no haze, no lens flare, no color grade, 16:9 aspect, 1920 by 1080."

Lens per frame size, named in each shot: wide 35mm, medium 50mm, close 85mm. All at f/4. The look is a small play, not a portrait session; the backdrop must stay legible behind every face.

### 1.4 The three things that never appear

1. **Text in frame.** No readable letters, numbers, or words in any generated image. Every sign is generated as blank cardboard or blank cloth and lettered by hand in the edit. Generated text is the first thing a viewer notices as machine-made, and the second is a misspelled sign.
2. **Brand logos or marks.** None on cans, shirts, shoes, carts, hats, the satchel, the fridge, the microphones, or the chairs. The soup cans carry plain red and white labels with no lettering.
3. **Real people.** No prompt names, describes, or references a real actor, public figure, or existing character. No real photograph seeds any reference. If a generated face resembles a known person, discard it and regenerate.

Append this negative block to every image prompt. It is token `{NEG}`.

> `{NEG}` = "No readable text, no lettering, no numbers, no signage with words, no logos, no brand marks, no watermark, no real person likeness, no celebrity, no extra people, no crowd, no modern screens, no phones, no film grain, no texture overlay, no vignette, no lens flare, no motion blur, no handheld tilt, no fisheye, no smiling at camera, no eye contact with camera, no extra fingers, no duplicated limbs."

### 1.5 Frame and delivery

- Every still: 1920 by 1080, 16:9, sRGB, PNG. Generate at the highest native resolution the tool allows and downscale; never upscale a small render.
- Every clip: 1920 by 1080, 24 frames per second, 3 to 6 seconds, delivered as an image sequence or a high-bitrate MP4, no audio.
- Camera is static or a slow push only. A slow push means the frame scales in by at most 3 percent across the clip. No handheld, no drift, no rack focus, no whip.

### 1.6 Set tokens

Six fixed locations. Paste in full.

> `{HALL_WIDE}` = "the long brick pattern shop of an old bell foundry, tall arched windows with wired glass down the left wall pouring late gold light across a worn wooden floor with a faded painted center line, exposed timber rafters overhead, forty mismatched gray metal folding chairs in six rows with one green chair, one red chair, and one yellow chair among them, a plywood lectern painted navy at front left with a blank white card on its face, a bucket-sized cast bronze bell hanging above the lectern from a rafter on a chain with a pull rope, a low wooden stage two steps up at front right with a red curtain on a sagging wire that has stopped halfway, a blank cream cloth banner hung above the stage with a smaller blank repainted strip beneath it, a rolling chrome costume rack at stage left, a folding table with a white cloth along the right wall, a dented green steel filing cabinet against the right wall, and at the very back up a short flight of wooden stairs a foreman's office window of wired glass with a green-shaded lamp lit inside and an empty wooden chair"

> `{STAGE_AISLE}` = "a low wooden stage two steps up with a red curtain on a sagging wire stopped halfway, a hand-painted naive backdrop of a canal, a lift bridge with its span raised, a market awning, and a flat-roofed bakery in bold black outlines and flat house paint like a woodcut, a grocery aisle built from visibly hand-cut painted cardboard: a four-tier cardboard shelf with painted boxes, a blank rectangular cardboard sign hanging from a wire on cup hooks, two cardboard shopping carts on casters with painted wire mesh, and a chest-high pyramid of painted cardboard soup cans with plain red and white labels and no lettering, brush strokes visible, edges rough, a cream cloth banner and a hanging bronze bell visible above the stage"

> `{RACK}` = "a long rolling chrome clothes rack sagging slightly in the middle, seven blank cardboard tabs clipped to the top bar, a dozen old garments under each tab with a paper dry cleaner's tag on string on every hanger, a wooden shelf above holding a row of white cloth bonnets, a straw boater, a knit cap, a hard hat, and a cardboard crown, a plastic bin below with a yarn horse mane spilling over its edge, a tall mirror leaning against the brick wall taped at one corner, a folding chair beside the mirror, a tall arched window of wired glass with late gold light just behind"

> `{PANEL}` = "a folding table with a white cloth to the floor, three folding chairs behind it, three blank folded white tent cards on the cloth, three silver microphones on desk stands with cables that run off the table and end on the floor plugged into nothing, a glass pitcher of water untouched with three glasses upside down beside it, a small stack of manila folders, a brick wall behind, the green steel filing cabinet at the edge of frame"

> `{ARCHIVE}` = "a four-drawer green steel filing cabinet against a brick wall, dented on one side, scratched paint catching window light, a small blank brass plaque screwed to the top drawer, the top drawer open showing manila folders and a single mitten and a faded instant photograph and a paper bus transfer resting on top, a small white mini fridge on the floor beside it with its door open and a glass jar inside holding a plum-sized hailstone, a small framed typed page above the cabinet too small to read"

> `{LECTERN}` = "a plywood lectern painted navy with a blank white card taped to its face, a small brass bell on a short turned wooden handle resting on its top, a thick pull rope hanging beside it from a bucket-sized cast bronze bell on a chain above, brick wall and a tall arched window of wired glass behind, late gold light"

---

## 2. Character consistency kit

### 2.1 The reference-first workflow

Consistency is the difference between a cast and a slideshow of strangers. Follow the sequence. Do not skip to shots.

1. **Master portrait.** For each face, run the master portrait prompt below. Generate 8 candidates. Pick one. Log the prompt, the seed, and the file name in a `references/` folder beside this file. This image is the character.
2. **Resemblance check.** Two people look at the chosen portrait and answer one question: does this look like anyone we know? If either says yes or maybe, discard and rerun. Standards item 14 has no tolerance.
3. **Turnaround.** Using the master portrait as the image reference, generate four more stills with the same tokens: three-quarter left, three-quarter right, full profile, full body front. Approve each against the master. These five images are the character's reference set.
4. **Fixed-frame costume stills.** Using the reference set, generate the character in each fixed frame the trailer needs (hall, stage, rack, panel). These become the base stills that shots are built from, so the costume is locked before any scene work.
5. **Shot stills.** Every shot prompt in Section 3 attaches the reference set of each character in frame, plus the character's token text. Reference image first, token second, action third.
6. **Motion.** Only an approved shot still goes to image-to-video. The motion prompt names the still. Never regenerate a face inside the video step.

When to regenerate, in order of how often it happens.

- The face drifts: jaw, eye spacing, skin tone, or age reads differently from the master. Regenerate the still. Never fix a face in the edit.
- A constant costume token is missing or changed (no cap, wrong cardigan color, sneakers not red, glasses on the nose instead of on the head when the sheet says head). Regenerate.
- Hands: wrong finger count, merged hands, a hand through a prop. Regenerate. Hands are the second slop tell after text.
- The tool lettered a sign, a label, or a banner. Regenerate with `{NEG}` reinforced at the end of the prompt.
- Eye contact with camera. Regenerate. Nobody looks at the lens in this show.
- A smile on a tableau face. Regenerate. Faces are dead serious.
- The cardboard looks like real metal or real plastic. Regenerate with "visibly hand-cut painted cardboard, brush strokes visible" moved to the front of the action text.
- Any resemblance to a real person appears in a later still even if the master passed. Discard the still and rerun from the master.

Never seed any character from a real photograph, including a photograph of a family member, a friend, or the owner. Text and approved generated references only.

### 2.2 Master portrait format

All master portraits use the same setup so lighting matches across the cast.

> `{PORTRAIT_SETUP}` = "Head and shoulders portrait, 85mm lens, straight on, camera level at eye height, subject looking slightly past the lens with a straight face, no smile, standing in front of a plain brick wall in the hall with a tall arched window out of frame to the left, flat warm front light with one cool side light, deep focus, no text, no logos."

Prompt = `{ANCHOR}` + `{PORTRAIT_SETUP}` + character token + `{NEG}`.

### 2.3 Harlan Mabry, the Commodore

> `{HARLAN}` = "Harlan, a tall broad man of sixty-one, heavy through the middle, long face with a square jaw and deep lines from nose to mouth, heavy gray eyebrows, pale blue eyes that hold a stare, a nose set slightly to the left, large ears, clean shaven, thick white hair flattened at the sides by a navy wool bridge tender's cap with a short black brim and a small brass bell pinned to its front, pale weathered skin pink across the cheeks and nose, a navy cardigan with wooden buttons over a white shirt buttoned to the collar with no tie, khaki trousers with a pressed crease, polished brown leather work boots, a folded paper program in the cardigan pocket, chin up, chest out, standing very straight, never leaning"

- Turnaround note: the cap stays on in every angle; the profile must show the cap brim and the broken nose line. Full body front must show the boots and the crease.
- Constant costume tokens: navy cap with brass bell pin, navy cardigan with wooden buttons, white shirt buttoned to collar, khaki trousers, brown boots, folded program in pocket.
- The one prop: the small brass gavel bell on a wooden handle. In his right hand or on the lectern. Never anywhere else.

### 2.4 Piper Mabry, the soup

> `{PIPER}` = "Piper, a small wiry girl of ten, straight-backed, round face with wide-set gray-green eyes and a serious mouth that stays closed, eyebrows that rise in the middle, light brown skin with freckles across the nose and cheeks, thick dark brown hair in two braids pinned up over the crown so no hair falls loose, a straight fringe cut across the forehead, a green corduroy jumper over a striped long-sleeve shirt, red canvas high-top sneakers with the laces double-knotted, a small spiral notebook on a string around her neck with a pencil stub through the spiral, feet together, arms at her sides, chin level, not blinking"

- Turnaround note: the braids pinned up must read from behind and in profile; there is no loose hair in any angle. Full body front shows the red sneakers, which are the constant that survives every costume.
- Constant costume tokens: green corduroy jumper, striped long-sleeve shirt, red high-top sneakers, notebook on a string.
- In costume: `{PIPER_SOUP}` = "`{PIPER}` standing dead center inside a chest-high pyramid of painted cardboard soup cans with plain red and white labels, her face visible through a cut hole where one can should be, her red sneakers showing beneath the bottom row, eyes open and forward, expression of a witness who knows what is coming"
- Child performer note: this is a generated child. No real child's likeness, photograph, or name touches the reference set. The disclosure in Section 8 covers her.

### 2.5 Dr. Imani Beale, the Accuracy Committee

> `{IMANI}` = "Imani, a slim upright woman of thirty-eight, medium height, exact in every movement, oval face with high cheekbones and dark brown eyes, one eyebrow set permanently higher than the other, deep brown matte skin with a clear lip and no other makeup, black shoulder-length locs tied back at the nape with a plain band, small round tortoiseshell reading glasses pushed up on top of her head, a camel blazer with the sleeves pushed to the forearm over a white collared shirt buttoned to the top, dark trousers with a crease, flat black shoes, a capped pen behind her right ear, a manila folder under her left arm, a lanyard tucked inside the shirt with nothing readable"

- Turnaround note: the glasses live on her head in every angle except the panel shots, where they come down to read. The raised eyebrow must survive the profile. Full body front shows the folder under the left arm.
- Constant costume tokens: camel blazer with pushed sleeves, white shirt buttoned to the top, dark trousers, flat black shoes, pen behind right ear, manila folder.
- The one prop: `{RED_CARD}` = "an index-card-sized laminated red card worn soft at one corner, held straight up from the elbow at full extension like a line judge"

### 2.6 Dale Renfro, all the horses

> `{DALE}` = "Dale, a kind-faced man of forty-five, medium height, long-limbed with a slight forward stoop, broad face with heavy-lidded brown eyes, a wide mouth resting in a small hopeful smile, a short dark beard with gray coming in at the chin, short straight black hair lighter at the tips from the sun, warm tan skin darker on the forearms and paler across the forehead where a hat sits, a plain light blue short-sleeve uniform shirt with no patches and no badge tucked into navy knee-length shorts, black crew socks, worn gray walking shoes, an empty canvas satchel worn across the chest, a broad-brimmed canvas sun hat hanging down his back on a cord"

- Turnaround note: the hat hangs down the back in every angle; the profile shows the stoop and the satchel strap. The hopeful smile is small and is the only smile in the cast.
- Constant costume tokens: light blue uniform shirt with no patches, navy shorts, black crew socks, gray walking shoes, canvas satchel across the chest, sun hat on a cord down the back.
- The one prop: `{HORSE_HEAD}` = "a hand-sewn brown cloth horse head with two black button eyes, a yarn mane, and one slightly crooked ear, worn fully over the head so no face shows"
- In costume: `{DALE_HORSE}` = "`{DALE}` wearing `{HORSE_HEAD}`, head lowered with dignity, both hands on the handle of a cardboard shopping cart"

### 2.7 Mrs. Lorraine Tulliver, costumes

> `{TULLIVER}` = "Mrs. Tulliver, a short round soft woman of seventy with quick precise hands, round face with small bright dark eyes behind half-moon reading glasses on a beaded chain, penciled brows, dimples, a pursed mouth, olive skin rosy at the cheeks with age spots on the backs of the hands, silver-white hair set in soft curls held with a single tortoiseshell pin with not a hair out of place, a lilac cardigan with a yellow cloth tape measure draped around her neck, a floral blouse, a pleated navy skirt below the knee, low sensible heels, a pincushion on a wrist band, a small brooch shaped like a coat hanger"

- Turnaround note: the tape measure hangs on both sides of the neck in every angle. Profile shows the set curls and the pin. Full body front shows the skirt length and the heels.
- Constant costume tokens: lilac cardigan, yellow tape measure around the neck, floral blouse, pleated navy skirt, wrist pincushion, coat-hanger brooch, half-moon glasses on a chain.

### 2.8 Wren and Oscar, the carts

Both appear with faces visible in the cold open and the button. They need master portraits and a two-angle turnaround (front and three-quarter), not a full set.

> `{WREN}` = "Wren, a tall angular girl of seventeen, bleached cropped hair with dark roots showing under a plain white cloth bonnet tied under the chin, an oversized black hoodie under the bonnet with a gray cardigan hung open over it and a paper dry cleaner's tag on the cardigan, solemn face, an athlete's focus, both hands on the handle of a cardboard shopping cart"

> `{OSCAR}` = "Oscar, a boy of sixteen a head shorter than Wren, round wire glasses, a buzz cut, a yellow raincoat worn under a plain white cloth bonnet that sits crooked, solemn face, both hands on the handle of a cardboard shopping cart"

- Constant tokens: Wren, black hoodie and white bonnet; Oscar, yellow raincoat, round glasses, crooked bonnet.

### 2.9 The background four

They appear only in the hall wide and the reverse on "We do." One row portrait each, front only, no turnaround. Keep them plain and unalike.

> `{HARMONS}` = "the Harmon twins, two women in their fifties with identical short gray hair and identical rust-colored cardigans, one buttoned to the top and one open, seated side by side holding paper programs at different heights"

> `{PETRAKIS}` = "Mr. Petrakis, a heavy man of sixty-eight, bald on top with a gray fringe, a brown suit jacket over a knit vest, seated with his chin on his chest, asleep"

> `{NAN}` = "Old Nan Ferris, a tiny woman in her eighties in a purple knit hat, a walking stick with a rubber foot leaning on her chair, a delighted face, seated front row on the right"

Together with Wren and Oscar these are the six background members. No crowd beyond them, ever. The hall wide holds eleven visible people; the twelfth member is the lit booth at the back.

### 2.10 Member Twelve

No face, no body, no silhouette, no hand. Member Twelve is never generated. In the trailer, Member Twelve exists as the lit booth window in the hall wide and as a voice. See Section 4.

---

## 3. Shot list

Conventions.

- Timecodes are mm:ss.t from the first frame of the file. The file has no head leader. Picture starts at 00:00.0.
- Duration is the cut length. Generated clips are 3 to 6 seconds and are trimmed in the edit; the clip length is named in each motion prompt.
- Image prompt = `{ANCHOR}` + set token + character tokens + action + `{NEG}`. Attach every in-frame character's reference set.
- Motion prompt = `{MOTION_BASE}` + shot motion. Where the script calls for slow motion, add `{SLOWMO}`.
- Dialogue shots: the speaker's mouth moves with the recorded line. The line is recorded first (Section 4), then the clip is generated or lip-driven to it. If the mouth motion fails review, the fallback for that shot is a held frame with the line over it and a cut to the listener, which is inside the show's grammar.
- Signs are blank in every generated frame. The `LETTERING` line on each shot names what the editor composites.

> `{MOTION_BASE}` = "Image to video from the attached approved still. 24 frames per second. Keep the still exactly: same faces, same costumes, same framing, same light. No new people or objects enter. Camera locked unless stated. No shake, no flicker, no exposure drift, no zoom unless stated. Faces stay serious. Nobody looks at the camera. Natural speed unless stated."

> `{SLOWMO}` = "Quarter-speed slow motion throughout. Soft physics: cardboard bends and bounces, empty cans tumble and roll with hollow bounces, nothing shatters, nobody is hurt, the fall is gentle and dignified."

Music for every shot: none. The trailer file carries no music bed by script note 3. The sonic ID lives in the site wrap, not in this file (Section 5).

### Beat 1 of 6: Cold open (00:00.0 to 00:09.0)

**S01** 00:00.0 to 00:03.0 (3.0 s)
- Frame: Wide, 35mm. Stage fills the lower two-thirds; blank banner and hanging bell visible above.
- Camera: Static.
- Who: Wren (left cart), Oscar (right cart), Piper in the pyramid.
- Action: Slow motion. The carts enter from each side and roll toward the pyramid. Piper's face is dead center, eyes forward.
- Dialogue: MEMBER TWELVE (V.O.): "Tuesday. Twelve minutes past four."
- Sound: Hall room tone from frame 1. Caster wheels on wood, low and slow. No music.
- LETTERING: the hanging sign reads AISLE 5 in black marker, hand-lettered. Composite onto the blank sign.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` A held tableau. `{WREN}` pushing a cardboard shopping cart in from the left edge of the stage, `{OSCAR}` pushing a cardboard shopping cart in from the right edge, both carts about four feet from the center, `{PIPER_SOUP}` dead center between them, the blank cardboard sign hanging on its wire above the shelf, wide shot from the third row, the stage filling the lower two thirds of frame, the blank cream banner and the bronze bell visible above. `{NEG}`
- Motion prompt: `{MOTION_BASE}` `{SLOWMO}` 5 seconds. Both carts roll slowly toward the center, closing about half the distance. Wren and Oscar walk behind them with solemn faces. Piper does not move and does not blink.

**S02** 00:03.0 to 00:05.0 (2.0 s)
- Frame: Close, 85mm. Piper's face inside the cans, cans filling the frame edge to edge.
- Camera: Slow push, 2 percent.
- Who: Piper.
- Action: She holds. Eyes forward. The expression of a witness who knows what is coming.
- Dialogue: MEMBER TWELVE (V.O.): "The soup never stood a chance."
- Sound: Room tone. Caster rumble continues, closer. No music.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` Close shot, 85mm, of `{PIPER_SOUP}`, her face filling the cut hole in the pyramid, painted cardboard cans surrounding her face on every side and filling the frame, eyes open and forward, serious mouth closed, the painted canal backdrop soft behind, deep focus. `{NEG}`
- Motion prompt: `{MOTION_BASE}` `{SLOWMO}` 4 seconds. Camera pushes in 2 percent across the clip. Piper holds absolutely still. A faint tremor passes through the cans around her face as the carts approach off screen.

**S03** 00:05.0 to 00:08.0 (3.0 s)
- Frame: Wide, 35mm. Same framing as S01.
- Camera: Static.
- Who: Wren, Oscar, Piper.
- Action: Slow motion. The carts meet front to front, a soft cardboard kiss. The pyramid leans. The cans go. Piper goes with them, arms out, head back, in grief, and lands in a heap of cans that bounce because they are empty.
- Dialogue: none.
- Sound: One soft cardboard thump on the kiss. Hollow empty cans tumbling and bouncing, kept under the dialogue peak. No music.
- LETTERING: AISLE 5 sign, same composite as S01, locked to the same position.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` A held tableau at the exact instant of the event. `{WREN}` and `{OSCAR}` with their cardboard carts touching front to front at center stage, the pyramid of painted cardboard soup cans mid-tip, three cans already in the air, `{PIPER_SOUP}` leaning with the pyramid with her arms opening and her head tipping back and her eyes still open, wide shot from the third row. `{NEG}`
- Motion prompt: `{MOTION_BASE}` `{SLOWMO}` 6 seconds. The carts finish meeting with a soft bump. The pyramid leans and comes apart. Piper falls backward slowly with arms open, eyes closing last, and lands gently in a spread of hollow cans that bounce and roll. Wren and Oscar hold their positions with solemn faces.

**S04** 00:08.0 to 00:09.0 (1.0 s)
- Frame: Medium wide, 50mm. Low, the stage floor at the bottom third.
- Camera: Static.
- Who: Piper, lying still in the cans.
- Action: She lies still. One can rolls to the edge of the stage and stops.
- Dialogue: none.
- Sound: The big hall bell rings once at 00:08.0, at or below the dialogue peak. Its decay carries through the black into S05. Hard cut to black for the last 6 frames of this slot.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` Medium wide shot from the third row of `{PIPER}` lying still on her back on the low wooden stage among scattered painted cardboard soup cans, eyes closed, arms open, red sneakers toward camera, one can at the front edge of the stage, the cardboard carts stopped behind her, calm and quiet. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Nothing moves except one can that rolls slowly to the front edge of the stage and stops. Piper holds perfectly still.

### Beat 2 of 6: World (00:09.0 to 00:21.0)

**S05** 00:09.0 to 00:13.0 (4.0 s)
- Frame: Wide, 35mm, from the back of the hall at seated eye height, the whole room to the stage.
- Camera: Slow push, 3 percent.
- Who: Harlan at the lectern. Seated: Piper front left in the green chair (she has changed out of the cans), Imani at the panel table, Dale fourth row on the aisle with the horse head on the chair beside him, Mrs. Tulliver by the rack, Wren, Oscar, the Harmons, Petrakis, Nan Ferris. Eleven visible. The booth light on at the back is the twelfth.
- Action: Harlan lets go of the bell rope. The bell above him swings.
- Dialogue: HARLAN: "The Recent History Society of Bell Hollow is called to order."
- Sound: Bell decay from S04 finishes under the first word. Chair creak. Room tone. No music.
- LETTERING: banner reads RECENT HISTORY SOCIETY OF BELL HOLLOW; the strip beneath reads EST. RECENTLY in a repainted hand. Lectern card reads COMMODORE. Composite all three.
- Image prompt: `{ANCHOR}` `{HALL_WIDE}` Wide shot from the back of the hall, the room set for forty and holding eleven, spread out. `{HARLAN}` at the lectern front left with his left hand just released from the bell rope and the bronze bell above him mid-swing, his right hand flat on the lectern. `{PIPER}` seated front row far left in the green chair with her notebook open on her knee. `{IMANI}` seated at the panel table on the right with a folder open, not looking up. `{DALE}` seated fourth row on the aisle with `{HORSE_HEAD}` resting on the empty chair beside him. `{TULLIVER}` standing beside the costume rack at stage left with one hand on the rack. `{WREN}` and `{OSCAR}` seated second row without bonnets. `{HARMONS}` third row center. `{PETRAKIS}` third row right. `{NAN}` front row right. The sound booth window lit at the back. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 5 seconds. Camera pushes in 3 percent. The bronze bell swings slowly on its chain and slows. Harlan speaks the line with small mouth movement, chin up, body still. Nobody else moves except Nan Ferris, who nods once.

**S06** 00:13.0 to 00:15.0 (2.0 s)
- Frame: Medium, 50mm. Harlan at the lectern, waist up, bell rope beside him.
- Camera: Static.
- Who: Harlan.
- Action: He looks out over the room. Chin up.
- Dialogue: HARLAN: "Who remembers?"
- Sound: Room tone. No music.
- LETTERING: COMMODORE card on the lectern.
- Image prompt: `{ANCHOR}` `{LECTERN}` Medium shot, 50mm, from the third row of `{HARLAN}` behind the lectern, right hand flat on the lectern top beside the small brass bell, left hand resting on the pull rope, chin up, looking out over the room past the camera, the arched window and brick behind him. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan speaks the two words with small mouth movement. His eyes move across the room from left to right. Nothing else moves.

**S07** 00:15.0 to 00:16.0 (1.0 s)
- Frame: Wide, 35mm, from the front of the room at seated eye height, facing the rows.
- Camera: Static.
- Who: The ten seated and standing members (everyone but Harlan).
- Action: All raise their paper programs a few inches and say the words. Petrakis raises his without waking.
- Dialogue: ALL: "We do."
- Sound: Ten voices, plain, in unison, no reverb added. No music.
- LETTERING: none. Programs are blank cream paper.
- Image prompt: `{ANCHOR}` `{HALL_WIDE}` Wide shot from the front of the hall at seated eye height facing the six rows of folding chairs, `{PIPER}` front left in the green chair, `{NAN}` front right, `{WREN}` and `{OSCAR}` second row, `{HARMONS}` third row center, `{PETRAKIS}` third row right asleep, `{DALE}` fourth row on the aisle with `{HORSE_HEAD}` on the chair beside him, `{IMANI}` at the panel table at the right edge with her folder, `{TULLIVER}` standing by the rack at the left edge, every person holding a blank cream paper program raised a few inches, faces serious. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Every program rises a few inches together and lowers. Mouths move briefly with two words. Petrakis raises his program without lifting his chin.

**S08** 00:16.0 to 00:19.0 (3.0 s)
- Frame: Medium, 50mm. Harlan, same as S06.
- Camera: Static.
- Who: Harlan.
- Action: He states the event with proclamation cadence.
- Dialogue: HARLAN: "Last Tuesday, two carts met in aisle five. We are here so it is not forgotten."
- Sound: Room tone. No music.
- LETTERING: COMMODORE card.
- Image prompt: Reuse the S06 approved still. No new generation.
- Motion prompt: `{MOTION_BASE}` 4 seconds. Harlan speaks the line slowly with small mouth movement. On the last word his right hand presses flat on the lectern. Nothing else moves.

**S09** 00:19.0 to 00:21.0 (2.0 s)
- Frame: Medium, 50mm. Imani at the panel table, left chair, folder open, glasses down, not looking up.
- Camera: Static.
- Who: Imani.
- Action: She does not look up. She says it to the folder.
- Dialogue: IMANI: "It was aisle six."
- Sound: Room tone. A pen cap click at the cut. No music. There is no reaction shot; the cut to the rack is the reaction.
- LETTERING: tent card reads HISTORIAN.
- Image prompt: `{ANCHOR}` `{PANEL}` Medium shot, 50mm, from the third row of `{IMANI}` seated upright in the left chair behind a blank tent card, glasses down on her nose, a manila folder open on the cloth, her eyes on the folder, the unplugged microphone in front of her ignored, the water pitcher untouched at the edge of frame. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Imani speaks the line with small mouth movement without lifting her eyes from the folder. Her pen taps the page once. Nothing else moves.

### Beat 3 of 6: Character (00:21.0 to 00:44.0)

**S10** 00:21.0 to 00:23.5 (2.5 s)
- Frame: Wide, 35mm. The rack fills the left half; Harlan and Piper in the right half.
- Camera: Static.
- Who: Harlan with a clipboard, Piper at attention, still wearing three cans.
- Action: Piper stands at attention and makes her case.
- Dialogue: PIPER: "I'd like to be considered for the cart."
- Sound: Room tone. Hangers shift on the rack. No music.
- LETTERING: seven tabs read MON, TUE, WED, THU, FRI, SAT, SUN in black marker.
- Image prompt: `{ANCHOR}` `{RACK}` Wide shot from the third row. `{HARLAN}` standing beside the rack holding a clipboard in the crook of his left arm and a pencil in his right hand, looking down. `{PIPER}` standing at attention before him, feet together, chin level, wearing three painted cardboard soup cans strapped around her torso like a vest with her arms free and her red sneakers showing, looking up at him with a serious face. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 4 seconds. Piper speaks the line with small mouth movement, standing rigid. Harlan does not look up from the clipboard. A garment on the rack sways slightly.

**S11** 00:23.5 to 00:24.5 (1.0 s)
- Frame: Medium, 50mm. Harlan, clipboard, looking down at her.
- Camera: Static.
- Who: Harlan.
- Action: He does not look up.
- Dialogue: HARLAN: "You're the soup."
- Sound: Room tone.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{RACK}` Medium shot, 50mm, of `{HARLAN}` beside the rack, clipboard in the crook of his arm, eyes on the clipboard, pencil raised, the row of white bonnets on the shelf behind his head. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan speaks the three words with small mouth movement without lifting his eyes. Nothing else moves.

**S12** 00:24.5 to 00:26.0 (1.5 s)
- Frame: Medium, 50mm. Piper, cans, looking up.
- Camera: Static.
- Who: Piper.
- Action: She states her record.
- Dialogue: PIPER: "I was the hydrant last week."
- Sound: Room tone.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{RACK}` Medium shot, 50mm, of `{PIPER}` at attention wearing three painted cardboard soup cans strapped around her torso, chin level, looking up and to the right of camera with a serious face, the yarn horse mane spilling from the bin at the bottom edge of frame. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Piper speaks the line with small mouth movement, body rigid, no blink.

**S13** 00:26.0 to 00:27.5 (1.5 s)
- Frame: Medium, 50mm. Harlan.
- Camera: Static.
- Who: Harlan.
- Action: He looks up from the clipboard for the first time. Sincere.
- Dialogue: HARLAN: "And the neighborhood wept."
- Sound: Room tone.
- LETTERING: none.
- Image prompt: Reuse the S11 approved still.
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan lifts his eyes from the clipboard to Piper and speaks the line with small mouth movement, absolute sincerity, no smile.

**S14** 00:27.5 to 00:31.0 (3.5 s)
- Frame: Medium wide, 50mm. Dale in the fourth row, hand raised straight up, horse head on the chair beside him.
- Camera: Static.
- Who: Dale.
- Action: The hand goes up. Holds. A full beat of silence. Then the question.
- Dialogue: DALE, after a full beat of silence: "Is there a horse?"
- Sound: Room tone only for the first 1.5 seconds. Then the line. Then room tone again. No music.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{HALL_WIDE}` Medium wide shot, 50mm, from the aisle at seated eye height of `{DALE}` seated in a gray folding chair in the fourth row on the aisle with his right hand raised straight up from the shoulder, patient, `{HORSE_HEAD}` resting on the empty chair beside him facing forward, empty chairs around them, the arched windows behind. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 5 seconds. Dale's raised hand holds without moving for the first half of the clip. Then he speaks the four words with small mouth movement and the hand stays up. His small hopeful smile does not change.

**S15** 00:31.0 to 00:32.5 (1.5 s)
- Frame: Medium, 50mm. Harlan at the rack.
- Camera: Static.
- Who: Harlan.
- Action: He answers without looking at Dale.
- Dialogue: HARLAN: "It's a grocery store, Dale."
- Sound: Room tone.
- LETTERING: none.
- Image prompt: Reuse the S11 approved still.
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan speaks the line with small mouth movement, eyes returning to the clipboard.

**S16** 00:32.5 to 00:35.0 (2.5 s)
- Frame: Medium wide, 50mm. Dale, same as S14.
- Camera: Static.
- Who: Dale.
- Action: The hand stays up. He offers the possibility. Then, in the sound only, Harlan's pencil writes something, and Dale watches the pen and hopes.
- Dialogue: DALE: "There could be a horse."
- Sound: The line, then a pencil scratching on the clipboard, off screen. Room tone. No music.
- LETTERING: none.
- Image prompt: Reuse the S14 approved still.
- Motion prompt: `{MOTION_BASE}` 4 seconds. Dale speaks the five words with small mouth movement, hand still raised. Then his eyes drop slightly toward something off screen to the left and his smile lifts by a hair.

**S17** 00:35.0 to 00:37.5 (2.5 s)
- Frame: Medium, 50mm. Mrs. Tulliver at the TUE section, cardigan held up to the window light.
- Camera: Slow push, 2 percent.
- Who: Mrs. Tulliver.
- Action: She lifts a gray cardigan from the rack and holds it to the light with both hands like a relic.
- Dialogue: MRS. TULLIVER: "Tuesday was a simpler time."
- Sound: A hanger lifting from the chrome bar. Room tone. No music.
- LETTERING: the TUE tab is visible at the top of frame and reads TUE.
- Image prompt: `{ANCHOR}` `{RACK}` Medium shot, 50mm, from the third row of `{TULLIVER}` standing at the rack holding a gray wool cardigan on its hanger up to the light of the arched window with both hands, a paper dry cleaner's tag hanging from the cardigan, her face turned to the garment with reverence, one blank cardboard tab visible on the bar above her. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 4 seconds. Camera pushes in 2 percent. Mrs. Tulliver speaks the line with small mouth movement while holding the cardigan to the light. The dry cleaner's tag turns slowly on its string.

**S18** 00:37.5 to 00:39.5 (2.0 s)
- Frame: Medium wide, 50mm. Imani arrives at the rack, folder closed under her arm, glasses up. Harlan in the left of frame with the clipboard.
- Camera: Static.
- Who: Imani, Harlan.
- Action: She stops beside him and states it plainly.
- Dialogue: IMANI: "Harlan. You cannot keep reenacting last week."
- Sound: Two flat footsteps on wood, then the line. Room tone.
- LETTERING: rack tabs if visible.
- Image prompt: `{ANCHOR}` `{RACK}` Medium wide shot, 50mm, from the third row. `{HARLAN}` on the left with the clipboard in the crook of his arm, eyes on it. `{IMANI}` on the right, arrived, standing straight with the manila folder closed under her left arm and her glasses pushed up on her head, facing him, the rack behind them both. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Imani speaks the line with small mouth movement, body still. Harlan does not look up.

**S19** 00:39.5 to 00:42.0 (2.5 s)
- Frame: Medium, 50mm. Harlan, now facing Imani, clipboard lowered.
- Camera: Static.
- Who: Harlan.
- Action: He turns to her and delivers the motto.
- Dialogue: HARLAN: "Those who forget last week are doomed to repeat it."
- Sound: Room tone.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{RACK}` Medium shot, 50mm, of `{HARLAN}` turned to face someone off screen to the right, chin up, clipboard lowered to his side, the row of bonnets on the shelf behind him. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 4 seconds. Harlan speaks the line with slow, small mouth movement and proclamation cadence. Nothing else moves.

**S20** 00:42.0 to 00:44.0 (2.0 s)
- Frame: Medium, 50mm. Imani. No cut-in to Harlan; his pencil is heard writing off screen at the end.
- Camera: Static.
- Who: Imani.
- Action: She answers. Off screen, Harlan considers this and writes it down.
- Dialogue: IMANI: "That's every week, Harlan. That's how weeks work."
- Sound: The line. Then the pencil on the clipboard for the last 0.4 seconds, off screen. Room tone. No music.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{RACK}` Medium shot, 50mm, of `{IMANI}` facing left toward someone off screen, folder closed under her arm, glasses on her head, one eyebrow higher than the other, mouth set, the tall taped mirror leaning on the brick wall behind her. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Imani speaks both sentences with small mouth movement and no other motion. On the last word her higher eyebrow rises a fraction more.

### Beat 4 of 6: Turn (00:44.0 to 00:57.0)

**S21** 00:44.0 to 00:48.0 (4.0 s)
- Frame: Wide, 35mm. The whole panel table. Three tent cards, three mics, the pitcher. Imani left chair, red card going up. Harlan center chair. Right chair empty.
- Camera: Static.
- Who: Imani, Harlan.
- Action: The red card goes up from the elbow, straight, like a line judge, and stays up.
- Dialogue: IMANI: "Point of History. It was aisle six. I was standing in aisle six. I was buying oats."
- Sound: Room tone. The laminated card flicks up. No music.
- LETTERING: tent cards read HISTORIAN, HISTORIAN, COMMODORE, left to right.
- Image prompt: `{ANCHOR}` `{PANEL}` Wide shot from the third row of the panel table. `{IMANI}` in the left chair, glasses down, holding `{RED_CARD}` at full extension, folder open before her. `{HARLAN}` in the center chair, hands folded on the white cloth, the small brass bell to his right, the untouched pitcher to his left, looking at the red card with patience. The right chair empty. Three blank tent cards. Three silver microphones on stands with cables trailing to the floor. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 5 seconds. Imani speaks the four sentences with small mouth movement, card held straight up and still. Harlan does not move at all.

**S22** 00:48.0 to 00:49.0 (1.0 s)
- Frame: Medium, 50mm. Harlan at the panel, center chair.
- Camera: Static.
- Who: Harlan.
- Action: Two words. No movement.
- Dialogue: HARLAN: "Aisle five."
- Sound: Room tone.
- LETTERING: COMMODORE tent card.
- Image prompt: `{ANCHOR}` `{PANEL}` Medium shot, 50mm, of `{HARLAN}` seated in the center chair behind a blank tent card, hands folded on the white cloth, the small brass bell to his right, the microphone in front of him, looking left toward the red card with patience. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan speaks two words with small mouth movement. Nothing else moves.

**S23** 00:49.0 to 00:51.0 (2.0 s)
- Frame: Medium wide, 50mm. Piper steps forward from the stage toward the panel, cans and all, seen from the panel's side of the room at seated eye height. She stands below the table, looking up.
- Camera: Static.
- Who: Piper.
- Action: She steps forward, stops, and testifies.
- Dialogue: PIPER: "It was five. I'm the soup that saw everything."
- Sound: Two sneaker steps on wood. Cans knock softly. Room tone.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{HALL_WIDE}` Medium wide shot, 50mm, at seated eye height of `{PIPER}` standing on the hall floor in front of the panel table with three painted cardboard soup cans strapped around her torso, feet together, chin level, looking up toward the table just out of frame to the left, red sneakers on the worn wood floor, the stage and the sagging red curtain behind her. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 4 seconds. Piper takes one small step forward and stops. She speaks the two sentences with small mouth movement, body rigid. The cans on her torso settle.

**S24** 00:51.0 to 00:52.0 (1.0 s)
- Frame: Medium, 50mm. Imani, red card still up, now looking at Piper.
- Camera: Static.
- Who: Imani.
- Action: She looks up. Kind, exact.
- Dialogue: IMANI: "You were at school."
- Sound: Room tone.
- LETTERING: HISTORIAN tent card.
- Image prompt: `{ANCHOR}` `{PANEL}` Medium shot, 50mm, of `{IMANI}` in the left chair holding `{RED_CARD}` straight up, glasses down, eyes lifted from the folder toward someone small off screen to the right, expression exact and kind. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Imani speaks four words with small mouth movement, card still. Nothing else moves.

**S25** 00:52.0 to 00:54.0 (2.0 s)
- Frame: Close, 85mm. Piper's face. The longest hold in the cut.
- Camera: Static. No push. Nothing.
- Who: Piper.
- Action: A beat. She does not blink. Then the line.
- Dialogue: PIPER, after the beat: "I felt it."
- Sound: Room tone only until the line. No music. This is the trailer's heart; nothing competes with it.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{HALL_WIDE}` Close shot, 85mm, of `{PIPER}` looking up and slightly left of camera, face still, eyes open and steady, mouth closed, the painted cardboard cans at her shoulders at the bottom of frame, the brick wall soft behind her in warm window light. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 4 seconds. Piper holds completely still with no blink for the first two seconds. Then she speaks three words with the smallest possible mouth movement. Her eyes do not change.

**S26** 00:54.0 to 00:55.5 (1.5 s)
- Frame: Medium wide, 50mm. Imani turns in her chair, slowly, and points with the red card at the green filing cabinet against the wall.
- Camera: Static.
- Who: Imani. The Archive.
- Action: The turn. The point. The cabinet does not look back.
- Dialogue: IMANI: "The Archive says six."
- Sound: Chair creak on the turn. Room tone.
- LETTERING: brass plaque reads THE ARCHIVE. Composite onto the blank plaque.
- Image prompt: `{ANCHOR}` `{ARCHIVE}` Medium wide shot, 50mm, from the third row. `{IMANI}` at the right edge of frame turned in her folding chair, arm extended, pointing `{RED_CARD}` at the dented green steel filing cabinet that fills the left of frame, its top drawer open, the small white mini fridge on the floor beside it with the jar inside, the brass plaque on the top drawer blank and catching the window light. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Imani's arm finishes extending toward the cabinet and holds. She speaks four words with small mouth movement. The cabinet does not move.

**S27** 00:55.5 to 00:57.0 (1.5 s)
- Frame: Medium, 50mm. Harlan at the panel, center chair. He looks toward the Archive, then lifts the small brass bell.
- Camera: Static.
- Who: Harlan.
- Action: He looks at the Archive. He lifts the gavel bell.
- Dialogue: HARLAN: "Sustained. Restage it."
- Sound: The small brass gavel bell rings once at the end of "it," higher and lighter than the hall bell, at or below the dialogue peak. Room tone.
- LETTERING: COMMODORE tent card.
- Image prompt: `{ANCHOR}` `{PANEL}` Medium shot, 50mm, of `{HARLAN}` seated in the center chair, eyes turned right toward the far wall, his right hand lifting the small brass bell on its wooden handle a few inches off the white cloth, the untouched pitcher to his left. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. Harlan looks to the right, then speaks three words with small mouth movement, and the brass bell in his hand rises and gives one small downward shake at the last word.

### Beat 5 of 6: Button (00:57.0 to 01:08.0)

**S28** 00:57.0 to 01:00.0 (3.0 s)
- Frame: Wide, 35mm. Same framing as S01. The same cardboard aisle. The sign now shows a 5 crossed out in marker and a 6 written beside it by hand.
- Camera: Static.
- Who: Wren (left cart), Dale in the full horse head behind the right cart, Piper in a rebuilt pyramid.
- Action: Slow motion. The carts roll in again. Behind the right-hand cart, pushing it with total dignity, is Dale, in a full cloth horse head.
- Dialogue: MEMBER TWELVE (V.O.): "Tuesday. Aisle six. Corrected."
- Sound: Caster wheels on wood, slow. Room tone. No music.
- LETTERING: the sign reads AISLE 5 with the 5 struck through in black marker and a 6 written beside it in the same hand. Composite onto the blank sign in the same position as S01.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` A held tableau, wide shot from the third row, the same stage and the same cardboard aisle. `{WREN}` pushing a cardboard shopping cart in from the left. `{DALE_HORSE}` pushing a cardboard shopping cart in from the right with both hands, horse head lowered with dignity. `{PIPER_SOUP}` dead center in a rebuilt pyramid of painted cardboard soup cans, eyes forward. The blank cardboard sign hanging above the shelf. `{NEG}`
- Motion prompt: `{MOTION_BASE}` `{SLOWMO}` 5 seconds. Both carts roll slowly toward the center. The horse head stays lowered and steady. Piper does not move and does not blink.

**S29** 01:00.0 to 01:03.0 (3.0 s)
- Frame: Wide, 35mm. Same as S28.
- Camera: Static.
- Who: Wren, Dale in the horse head, Piper.
- Action: Slow motion, slower than S03. The carts meet. The pyramid goes. Piper falls with more grief than before, because the Society has learned from the first one. The horse lowers its head.
- Dialogue: none.
- Sound: One soft cardboard thump. Hollow cans tumbling, kept under the dialogue peak. No music.
- LETTERING: the corrected sign, locked to the same position as S28.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` A held tableau at the exact instant of the event, wide shot from the third row. The two cardboard carts touching front to front at center stage, `{WREN}` behind the left cart, `{DALE_HORSE}` behind the right cart with the horse head bowed, the pyramid of painted cardboard soup cans mid-collapse with several cans in the air, `{PIPER_SOUP}` leaning back with the pyramid, arms opening wide, head tipping back, eyes still open, the picture of grief. `{NEG}`
- Motion prompt: `{MOTION_BASE}` `{SLOWMO}` 6 seconds at one-fifth speed, slower than the first fall. The carts finish meeting with a soft bump. The pyramid comes apart. Piper falls backward with arms open and eyes closing last and lands gently among bouncing hollow cans. The horse head bows lower. Wren holds her position.

**S30** 01:03.0 to 01:04.5 (1.5 s)
- Frame: Close, 85mm, from the stage floor level looking across Piper's face toward the ceiling rafters. Camera is still level, not tilted; she is lying on her back and the frame is her profile from the side.
- Camera: Static.
- Who: Piper, cans settled around her.
- Action: Cans settle. From the floor, to the ceiling, she says it.
- Dialogue: PIPER: "Still felt it."
- Sound: The last can rocks and stops. The line. Room tone.
- LETTERING: none.
- Image prompt: `{ANCHOR}` `{STAGE_AISLE}` Close shot, 85mm, at stage floor level, of `{PIPER}` lying on her back on the low wooden stage in profile, eyes open, looking straight up, painted cardboard soup cans settled around her head and shoulders, the timber rafters soft above, warm window light across her face. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 3 seconds. One can beside her head rocks and stops. Piper speaks three words with the smallest possible mouth movement, eyes on the ceiling. Nothing else moves.

**S31** 01:04.5 to 01:08.0 (3.5 s)
- Frame: Medium, 50mm. Harlan at the lectern, hand on the bell rope, the bell above.
- Camera: Slow push, 2 percent.
- Who: Harlan.
- Action: The bell rings. He adjourns.
- Dialogue: HARLAN: "Adjourned. Same time next week. Something will have happened by then."
- Sound: The big hall bell rings once at 01:04.5, at or below the dialogue peak, and decays under the line. Room tone under the whole line. Cut to black at 01:08.0. No music.
- LETTERING: COMMODORE card on the lectern.
- Image prompt: `{ANCHOR}` `{LECTERN}` Medium shot, 50mm, from the third row of `{HARLAN}` behind the lectern with his left hand gripping the pull rope and the bronze bell above him at the top of its swing, his right hand flat on the lectern, chin up, looking out over the room, the arched window gold behind him. `{NEG}`
- Motion prompt: `{MOTION_BASE}` 5 seconds. Camera pushes in 2 percent. The bronze bell swings once and slows on its chain. Harlan speaks the three sentences with slow, small mouth movement and proclamation cadence. Nothing else moves.

### Beat 6 of 6: Title card (01:08.0 to 01:13.0)

**S32** 01:08.0 to 01:13.0 (5.0 s)
- Frame: Black. Hand-lettered white text, the same hand as the banner. Built in the edit. Not generated.
- Camera: none.
- Who: none.
- Action: The card holds. No animation, no fade. Text appears on the cut and stays.
- Dialogue: none.
- Sound: Room tone continues from the hall. No music. The file ends on the last frame of the card with room tone; the site's Click bumper follows outside this file.
- LETTERING: see Section 6.3 for the exact card.
- Image prompt: none.
- Motion prompt: none.

### Shot count and reuse

32 shots. 31 picture shots plus 1 card. Of the 31, four reuse an approved still: S08 reuses S06, S13 and S15 reuse S11, and S16 reuses S14. That leaves 27 unique stills to generate and 31 clips to animate. Total cut: 73.0 seconds. Dialogue seconds (character to character): about 48, or 66 percent. The Member Twelve lines total about 6 seconds and count as narration.

---

## 4. Voice and dialogue plan

### 4.1 Every line, with the read

27 lines. The read direction comes from the bible's tone notes and the script. Record each line three ways: as written, one slower, one flatter. The editor picks.

| Line | Character | Shot | Read |
|---|---|---|---|
| "Tuesday. Twelve minutes past four. The soup never stood a chance." | Member Twelve (V.O.) | S01 to S02 | Calm, unhurried, the tone of a documentary about a war, applied to soup. Three full stops. No irony in the voice. |
| "The Recent History Society of Bell Hollow is called to order." | Harlan | S05 | Proclamation cadence. Warm bass. Every word given its weight. |
| "Who remembers?" | Harlan | S06 | A ritual question. He knows the answer. |
| "We do." | All (ten voices) | S07 | Plain, together, no enthusiasm, no dragging. Petrakis is in it, asleep. |
| "Last Tuesday, two carts met in aisle five. We are here so it is not forgotten." | Harlan | S08 | The rule of the world. Slower on "not forgotten." |
| "It was aisle six." | Imani | S09 | To the folder. Flat. For the record. |
| "I'd like to be considered for the cart." | Piper | S10 | A professional making a request. No pleading. |
| "You're the soup." | Harlan | S11 | Not unkind. A fact. |
| "I was the hydrant last week." | Piper | S12 | Her record, stated. |
| "And the neighborhood wept." | Harlan | S13 | Absolute sincerity. This is praise. |
| "Is there a horse?" | Dale | S14 | Gentle. Hopeful. A full beat of silence before and after. |
| "It's a grocery store, Dale." | Harlan | S15 | Patient. He has answered this before. |
| "There could be a horse." | Dale | S16 | Softer than the first line. Hope without complaint. |
| "Tuesday was a simpler time." | Mrs. Tulliver | S17 | Warm, slow, wistful for a period that ended on Sunday. Certain, never old. |
| "Harlan. You cannot keep reenacting last week." | Imani | S18 | The name first, as a full sentence. Then the point. Dry, kind underneath. |
| "Those who forget last week are doomed to repeat it." | Harlan | S19 | The motto. He believes it. |
| "That's every week, Harlan. That's how weeks work." | Imani | S20 | The parent laugh. Delivered as information, not as a joke. Flat lands harder. |
| "Point of History. It was aisle six. I was standing in aisle six. I was buying oats." | Imani | S21 | Same weight on every sentence. "Oats" gets no extra push. |
| "Aisle five." | Harlan | S22 | Two words. Unmoved. |
| "It was five. I'm the soup that saw everything." | Piper | S23 | Testimony. Eyes up. Serious. |
| "You were at school." | Imani | S24 | Kind. Exact. Not a gotcha. |
| "I felt it." | Piper | S25 | After the beat. The heart of the trailer. Quiet, certain, no smile. |
| "The Archive says six." | Imani | S26 | The authority named. Slight slowing on "Archive." |
| "Sustained. Restage it." | Harlan | S27 | A ruling. The bell lands on "it." |
| "Tuesday. Aisle six. Corrected." | Member Twelve (V.O.) | S28 | Same voice as the first narration. "Corrected" with no satisfaction. |
| "Still felt it." | Piper | S30 | From the floor. Same certainty as before, a little breathless from the fall. |
| "Adjourned. Same time next week. Something will have happened by then." | Harlan | S31 | The promise. Slowest line in the trailer. He means it as comfort. |

### 4.2 Member Twelve as narrator voice

Member Twelve is a member of the Society who reads the program, never seen, never addressing the viewer. The voice reads like a narrator of a serious historical documentary, unhurried, with no wink, applied to soup. Two lines, about six seconds total. Both sit over slow motion with no other voice under them.

Voice spec for casting or synthesis: adult, any gender, mid-to-low range, plain accent with no regional marker, dry room with no reverb, close-miked, slower than conversational speech, full stops honored as silence. The voice must not resemble any known narrator, announcer, or actor. If a synthesized voice is built from a preset that imitates a named person, it fails standards item 14. Use a stock voice with no named source or a voice designed from parameters.

### 4.3 Synthesized versus hired, per character

| Character | Lines | Lip sync on screen | Option A: synthesized | Option B: hired voice | Gate |
|---|---|---|---|---|---|
| Member Twelve | 2 | No (voice over only) | Natural fit. The character is designed as a voice with no body. | Possible, but adds a hire for six seconds. | A: CG-03. B: CG-04. |
| Harlan | 10 | Yes | Risky. Proclamation cadence and comic gravity are timing, and synthesis flattens timing. | Recommended. A warm bass with a straight face carries the show. | A: CG-03. B: CG-04. |
| Imani | 6 | Yes | Risky. "That's how weeks work" is the parent laugh and depends on flatness that reads as human, not machine. | Recommended. | A: CG-03. B: CG-04. |
| Piper | 5 | Yes | Not recommended. A synthesized child voice is the hardest thing in the trailer to make sound real, and the heart line "I felt it" cannot be flat by accident. | Recommended. A voice-only session with a parent present, under the CG-04 child protections. | A: CG-03. B: CG-04 with child protections. |
| Dale | 2 | Yes | Possible. Two short lines. | Recommended for consistency with the rest of the cast. | A: CG-03. B: CG-04. |
| Mrs. Tulliver | 1 | Yes | Possible. One line. | Recommended for consistency. | A: CG-03. B: CG-04. |
| All ("We do.") | 1 | Yes, wide | Layer the cast. | Layer the hired cast, doubled. | Follows the cast. |

CG-03 covers any generated performance, voice, or image. CG-04 covers any talent, writer, or guild-related agreement. The picture is generated in every path, so CG-03 is triggered no matter what the voices are. Hiring any voice adds CG-04. The choice is therefore between one gate (all synthesized) and two gates (hired on-screen voices plus a synthesized narrator).

### 4.4 Recommended path for v1

Hired human voices for the five on-screen speakers. A synthesized voice for Member Twelve. Generated picture throughout. Both gates: CG-03 for the picture and the narrator, CG-04 for the voice cast.

Why.

1. Voice is where "slop" is heard first. A viewer forgives a held cardboard tableau. A viewer does not forgive a machine reading "Is there a horse?" without the beat.
2. The show's grammar helps the picture and hurts the audio. Held poses and slow motion hide the limits of generated motion, but nothing hides a flat line.
3. The child's voice is the trailer's heart. It should be a child, recorded once, with a parent in the room. That is a smaller undertaking than a child performer on a set, and the CG-04 protections are written for it.
4. Member Twelve is the one place synthesis is the right creative answer, because the character was designed as a voice with no body and the script already carries the disclosure.
5. Twenty-seven short lines is one recording session per voice. The cost is small next to the cost of a trailer that reads as machine-made on the lead show.

Sequence. Phase A: a scratch pass with synthesized voices for every line, used only to time the cut and test lip motion in private. Phase B: hired voices replace every scratch line except Member Twelve. Phase C: regenerate any dialogue clip whose mouth motion no longer matches the human timing. Nothing from Phase A reaches the public site.

If the owner chooses the one-gate path (all synthesized), this package still works. Record the scratch pass with the best available voices, keep the tableau fallback (held frame, line over, cut to listener) for every shot where the mouth fails review, and change the disclosure in Section 8 to the all-synthesized variant.

---

## 5. Sound plan

### 5.1 Sonic ID head and tail

The trailer file contains no sonic ID. The site wraps the file: the 8-second Porch Intro before (click, four rising notes, unresolved) and the 3-second Click after (four notes, resolved). This keeps the file clean for mirroring on a video platform with the Click as pre-roll.

What the file does to meet the wrap.

- Head: picture and room tone begin at frame 1. No black leader, no fade up. The Porch Intro ends on a screen door swinging toward camera and cuts straight to S01.
- Tail: the title card holds through 01:13.0 with room tone. The last frame is the card. The Click follows outside the file. Room tone ends on the last frame with a 3-frame fade to avoid a click in the audio.
- The identity brief (piano, three notes up and a held fourth) and the block bible (pull-chain click and four plucked notes) describe the ident differently. The format architect and the brand strategist reconcile that. The trailer file is unaffected either way.

### 5.2 The hall bell

- The big bell: a real cast bronze bell, recorded, one strike, natural decay of 2 to 3 seconds, no added reverb. Used at 00:08.0 (S04) and 01:04.5 (S31). At 00:08.0 the decay carries across the hard cut to black and finishes under Harlan's first word in S05, which stitches the cold open to the world.
- The small brass gavel bell: a different, lighter recording, a single high ring under one second. Used once at 00:57.0 on "it" (S27).
- Both bells sit at or below the dialogue peak (STANDARDS soft rule 8). Measure the dialogue peak first, then set the bells to it, never above.
- No sampled church bell, school bell, or any bell recognizable from another program.

### 5.3 The grocery aisle bed

The aisle is cardboard on a stage in a hall. The bed is the hall, not a store.

- Room tone: a large brick room with a wood floor. Faint window rattle, an occasional chair creak, nothing electrical. Record or design one 90-second bed and run it under the entire file at a constant level.
- Casters: cardboard carts on small wheels over wood, slow and low. In the slow-motion shots the caster sound stays at natural speed and is thinned, not pitched down into a drone.
- The cardboard kiss: one soft thump, no metal.
- No supermarket ambience, no cash register, no music from a ceiling speaker, no cart rattle of a real metal cart. The reenactment is the point.

### 5.4 The soup-can pyramid fall

- Cans are empty and hollow. The sound is light, bouncy, and dry. Record real empty cans on a wood stage or design from thin metal hits with no low end.
- The falls run at 00:05.0 to 00:08.0 (S03) and 01:00.0 to 01:03.0 (S29). Both fall under the dialogue peak. The second fall is not louder than the first; it is longer.
- Soft rule 8 test: put a peak meter on the dialogue track, note the loudest syllable, and confirm no can hit, bump, or bell exceeds it.

### 5.5 No strobe

- The file has two cuts to black (00:08.75 and 01:08.0) and no other luminance jumps. That is far below three flashes per second (STANDARDS soft rule 9).
- Generated clips sometimes flicker frame to frame. Any clip with exposure flicker fails and is regenerated. The editor checks every clip at full speed and at half speed.
- The slow-motion sections have no fast cuts inside them.

### 5.6 Music brief

The trailer is scored by silence. Script note 3 binds the cut: no music bed, only room tone, the bells, and voices. The straight face of the show depends on it; a music bed would tell the viewer it is a joke.

For the composer of the block's sonic ID, which is the only music near this file: the ident must sit under a straight-faced narrator without fighting it, must not swell, and must not resolve like a commercial. See the identity brief section 6 and the block bible section 4.4.

### 5.7 Loudness

- Dialogue peak: about minus 12 decibels true peak. Nothing in the mix exceeds it.
- Integrated loudness: minus 16 Loudness Units relative to Full Scale (LUFS), true peak ceiling minus 1 decibel, which suits web playback and matches the sonic ID mastering note in the identity brief. The format architect confirms the block-wide target; all four trailers match it.
- Stereo, 48 kilohertz. Dialogue centered. Room tone slightly wide. Bells centered.

---

## 6. Edit plan

### 6.1 Stitch order

S01 through S32 in order. Two hard cuts to black: 6 frames at the end of S04, and the cut into S32. No dissolves, no fades, no speed ramps in the edit (slow motion is generated in the clip). Every cut is a straight cut.

Audio bridges: the S04 bell decays across the black into S05. Harlan's pencil is heard off screen at the ends of S16 and S20. No other overlaps.

### 6.2 Cut rhythm per beat

| Beat | Shots | Seconds | Average shot | Rhythm |
|---|---|---|---|---|
| Cold open | 4 | 9 | 2.3 | Slow. Two long slow-motion wides around one close. Let the fall breathe. |
| World | 5 | 12 | 2.4 | Steady. Wide, medium, reverse, medium, medium. Cuts on the end of each line. |
| Character | 11 | 23 | 2.1 | Fastest beat. Cut on the line, never before it. The Dale shot (S14) is the exception: it starts 1.5 seconds before he speaks and the silence is the joke. |
| Turn | 7 | 13 | 1.9 | Quick exchanges slowing into S25, which is 2.0 seconds of stillness. Nothing cuts into "I felt it." |
| Button | 4 | 11 | 2.75 | Slowest beat. The second fall is longer than the first. The last shot holds through the whole line. |
| Title | 1 | 5 | 5.0 | Holds. |

If the cut runs long, trim the World beat. Never trim the Button. If the Character beat runs long, tighten the gaps between lines before shortening any shot.

### 6.3 The title card

One card, 01:08.0 to 01:13.0, on black. Hand-lettered white text in the same hand as the banner. A person letters it on paper with a brush, it is photographed flat, keyed, and placed. It is not generated and it is not a font.

Layout, top to bottom, centered.

1. RECENT HISTORY SOCIETY (hand-lettered, largest)
2. Wildcard (hand-lettered, small)
3. Premieres Friday on (hand-lettered, small) followed by the masthead lockup
4. Small line, bottom of frame: The account holder is a parent.

The masthead lockup is Direction 1 from the identity brief: STREETLIGHTS in the condensed display face, all capitals, tracked tight, with the amber dot (#FFC46B) as the period after the name; beneath it a hairline rule in paper white at 20 percent and the words FRIDAY NIGHT in small caps. The lockup is typeset, because the brand mark is always typeset; everything else on the card is by hand. This same lockup file is reused on all four trailers.

Card text is exact. No em dashes. No call to action. Nothing addresses a child.

The brand word is provisional until Fork D and CG-01 clear. Keep the card on its own layer so the name can be swapped without touching any shot. The site config holds the current name in one place.

### 6.4 Running time check

- Total: 73.0 seconds. At 24 frames per second that is 1,752 frames. Floor 60, ceiling 75.
- Count with a stopwatch on the exported file, not on the timeline.
- Count dialogue seconds (a character speaking to another character on screen). Target 48. Floor 44 (60 percent of 73). Member Twelve's six seconds do not count.
- If the file exceeds 75.0 seconds, cut from the World beat. If dialogue drops below 44 seconds, restore the gaps in the Character beat before touching anything else.

### 6.5 Export settings

- Master: 1920 by 1080, 24 frames per second progressive, 10-bit intermediate codec (a 422 HQ mezzanine), 48 kilohertz 24-bit stereo audio, room tone from frame 1 to the last frame.
- Web delivery: MP4, H.264 High profile, two-pass, 12 to 16 megabits per second, keyframe every 48 frames, AAC audio 320 kilobits per second at 48 kilohertz, moov atom at the front for fast start. A second copy in H.265 at 8 megabits per second for mobile if the site builder wants it.
- Loudness on the delivery: minus 16 LUFS integrated, minus 1 decibel true peak.
- Caption sidecar: a plain text subtitle file with every line and the two narration lines, plus bracketed sound cues for the bells. Video platforms marking content as made for kids still serve captions.
- Poster frame: export S28 at 00:59.0 (the horse behind the cart, the corrected sign) as a 1920 by 1080 JPEG. The site's generated title card remains the default; the poster is for the video platform mirror.
- File names: `w5-recent-history-society-trailer-v1.mp4`, `-v1.srt`, `-v1-poster.jpg`. The version number increments on any re-export.

---

## 7. Quality gate

Twelve points. All twelve pass before `trailerUrl` in `projects/05-product/site/content/shows.json` is set and `trailerSeconds` is changed from 70 to 73.

1. **Stopwatch.** The exported file runs 73.0 seconds, within floor 60 and ceiling 75. Dialogue seconds are at least 44.
2. **Text.** No generated frame contains readable text. Every composited sign, tab, tent card, plaque, banner, and the title card is spelled exactly as the script writes it, checked letter by letter against the script.
3. **Faces.** A contact sheet places every shot beside the master portrait of each character in it. No face drifts. Two reviewers sign the sheet.
4. **Hands and objects.** Every held frame is checked at full resolution for finger count, merged limbs, cart wheel count (four per cart), can count continuity between S01 and S03 and between S28 and S29, and cans with no lettering.
5. **Likeness.** Two reviewers answer "does anyone here look like a real person we know?" for every face, including the background four. Any yes or maybe sends the shot back.
6. **Logos.** No mark, patch, badge, or brand on any garment, can, shoe, cart, microphone, chair, fridge, or hat. Dale's shirt is plain.
7. **Camera.** Every clip is static or a slow push of 3 percent or less. No shake, no drift, no flare, no grain, no texture, no vignette, no grade.
8. **Sound.** The dialogue peak is measured and logged. No bell, can, thump, or footstep exceeds it. No music anywhere in the file. Loudness meets the delivery target.
9. **Strobe and flicker.** Cuts to black are counted (two). Every generated clip is played at full and half speed with no exposure flicker.
10. **The falls.** Both falls read soft, slow, and dignified. Piper's eyes close last. Nobody looks hurt. S30 shows her awake and speaking, so the soup gets up.
11. **The card.** Title card text is exact, no em dashes, the parent line is present, no call to action, the brand layer state (provisional or cleared) is logged in the export note.
12. **Gates and standards.** The `standards` agent returns PASS with zero FAIL and zero WARN on the exported file. The compliance gate logs CG-03 (generated picture and narrator voice) and CG-04 (voice cast, including the child protections) with the disclosure text from Section 8 attached. Neither gate is required to be cleared for a private review cut. Both are required before the file leaves `noindex`.

---

## 8. Disclosure draft for CG-03

Two sentences for the About page, written for the recommended path (hired on-screen voices, synthesized narrator, generated picture). Counsel edits before it is posted.

> The pictures in our trailers, including every face and every set, were made with image and video generation tools from characters we invented, and the narrator's voice is computer generated; no real person's face or voice was copied. The spoken lines of the on-screen characters were performed by hired voice actors, and every trailer was reviewed by a person before it was posted.

Variant if the owner chooses the all-synthesized path:

> The pictures and voices in our trailers, including every face, every set, and every spoken line, were made with generation tools from characters we invented, and no real person's face or voice was copied. Every trailer was reviewed by a person before it was posted.

Both versions replace the placeholder line at `projects/05-product/site/src/views/pages.ts` line 149. Neither is posted until CG-03 is cleared and, for the first version, CG-04.

---

## Self-check against `canon/STANDARDS.md`

```
ASSET: projects/04-writers-room/out/production/W5-recent-history-society-package.md
RESULT: PASS (production lead self-check; formal pass by the standards agent on the exported file)
FAIL ITEMS: none
WARN ITEMS: none
NOTES: Section 2 read line by line. Item 12: every person, garment, prop, and set in every prompt is invented and taken from the character sheet. Item 13: neither block trademark appears. Item 14: every prompt carries a no-likeness negative and the workflow discards any resemblance; no real photograph seeds a reference. Item 15: CG-03 and CG-04 are named on every path and the disclosure is drafted. Soft rules 8 and 9 have measurable tests in Sections 5 and 7.
```
