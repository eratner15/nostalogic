# Prompt packet for Gemini: Long Route trailer clips

For the second show in the Streetlights block: Long Route (Hangout slot, 90 second trailer). This packet turns the full production package (`projects/04-writers-room/out/production/H2-long-route-package.md`) into a set of clip requests sized for a video generation tool such as Gemini's video generation surface. Most such tools generate one continuous single-camera clip per request, typically a few seconds up to about 8 seconds, not a multi-cut sequence with several different shots in one call. So this packet is organized as reference stills first, then one generation request per shot, grouped into six batches that match the trailer's six beats. Hand the batches to Gemini one at a time. Save every accepted clip with the file name given. Bring the finished files back here and I will stitch them in order with ffmpeg and load the result into the site.

## 0. Before you generate anything

Read `projects/04-writers-room/out/production/H2-long-route-package.md` once. This packet condenses it, but that file is the source of truth if anything here is unclear, especially the character consistency kit (section 2) and the full per-shot notes (section 3).

Compliance rule that overrides the package where they conflict: per project decision D-025, no photoreal AI-generated child face may be fully resolved toward the camera in any finished clip. Six of Long Route's regulars are minors (Hollis, Mateo, Dele, Tola, Cal, Priya). The shot descriptions below already frame most of them in profile, three-quarter, from behind, low or high angle, or partly behind an object, which satisfies this. Where a shot prompt would put a child's face frontally toward the camera, reframe it to one of those angles before generating, even if the package's shot list describes it more directly. When in doubt, angle it away rather than toward the lens. Adult characters (Frances, Mr. Tull, Ms. Odum) may be shown frontally.

Three things that must never appear in any generated frame, per the package: text or lettering of any kind (no signs, numbers, labels, badges, book titles, pins with words), brand logos or maker's names, and any resemblance to a real person. If a generation drifts into any of these, reject it and regenerate.

## 1. Generate references first, once

Do this before any clip. These reference stills anchor every later generation so faces and the bus interior stay consistent from clip to clip. Use the exact prompts below (they are copied from the package). Save each as a labeled still.

**Style anchor.** Prepend this sentence to literally every prompt you send, reference stills and clips alike:

> A single frame from a quiet, warm, live-action family comedy, photographed on a full-frame digital cinema camera with a sharp prime lens, natural low sidelight from one side only, clean highlights the color of warm cream and soft shadows the color of dark ink, a muted palette of school-bus yellow, worn green vinyl seats with cracked cream piping, brushed chrome grab rails and black ribbed rubber floor, with a single small brick-red accent allowed, photoreal, natural skin with pores and stray hairs, ordinary faces of original people who resemble no one famous, no film grain, no texture overlay, no vignette, no lens flare, no haze or fog inside the bus, no color filter, no lettering or numbers or signage anywhere in the frame, no logos, no watermarks.

**Set references** (generate both once):

- Bus interior: "inside a full-size yellow school bus, twelve rows of green vinyl seats with cracked cream piping, chrome grab rails on every seat back, black rubber floor with a raised ribbed strip down the center aisle, a green painted heater box under the third row on the door side, a red emergency handle on the rear door, a wide chrome-rimmed convex mirror above the windshield, a sun visor above the driver with the corner of a plain envelope tucked behind its elastic, a steel thermos with a dented lid and a clipboard seat-belted into the first row driver side, no lettering anywhere."
- Bus exterior: "a full-size yellow county school bus with a single black stripe along the side, plain unlettered panels, no maker's name, no numbers, no signs, black bumpers, red stop-arm folded flat and dark."

**Character references.** For each of the eight named characters below, generate a front, three-quarter, and profile still on a plain gray background, then the specific "seat frame" or working still the package describes. Full portrait paragraphs and turnaround notes are in the package, section 2 ("Master portraits, turnarounds, and constant tokens"); copy each character's paragraph directly into Gemini as written there. The eight are: Frances Keel (the driver, adult, may face camera), Hollis Keel, Mateo Arriaga, Dele Oyelaran, Tola Oyelaran, Cal Whitlock, Priya Coker, and Mr. Tull (adult, may face camera). Ms. Odum, Ines, and Abuela appear only at a distance and need only the single reference each described in the package; do not generate close-ups of Ines or Abuela (both are children or elderly background figures shown only small and far away).

For every child character's reference, keep the framing the package already specifies (profile, three-quarter, low or high angle, partly turned to a window or a book) rather than a straight frontal close-up, per the compliance rule above.

Label every reference file clearly, for example `ref_frances_front.png`, `ref_hollis_seatframe.png`, `ref_bus_interior.png`. You will attach or reference these in every clip prompt that follows.

## 2. Clip batches

Six batches, one per trailer beat. Each batch lists its shots from the package (by ID, so you can look up full detail if a prompt needs more context), the timecode range, and a ready-to-send Gemini prompt per shot. Generate every shot as its own clip unless a batch note says two shots can be one continuous take. Name each output file exactly as given so the stitch order is unambiguous.

Camera vocabulary used below: STATIC (nothing but the subject moves), PUSH (a slow push in of no more than 5 percent of frame width over the clip), ROLL (the bus is moving, so the background outside a window drifts and the frame has a faint low sway). Do not ask for handheld motion; it reads as digital shake, not as presence.

### Batch 1. Cold open (00:00.0 to 00:12.0), file prefix `clip01_`

Shots S01 to S05 in the package. This beat has no music, no title, just bus idle sound and a stopwatch.

- `clip01_a.mp4`, 2.5s, STATIC, insert: a silver stopwatch with a blank white face and a sweeping second hand, held in a pale five-fingered adult hand, a maroon tie and blank gray lanyard falling into frame behind it, green vinyl seat back and chrome rail soft in the background, late-afternoon light from the left, shallow focus on the watch face. Motion: the second hand sweeps, the hand tightens slightly, the tie sways a fraction with the engine.
- `clip01_b.mp4`, 2.5s, STATIC, two-shot from slightly above: an adult man folded into the back row of a bus, knees near his chest, beside an 11-year-old girl in profile holding a marbled composition book high enough to cover her mouth, eyes visible over the top of it, not looking up. Motion: nothing moves but a slow blink.
- Continue with S03 to S05 from the package section 3, Beat 1, following the same pattern: read each shot's Frame, Who, Action, and Sound lines from the package, keep every child face in profile or partly hidden as that section already specifies, and write one Gemini prompt per shot the same way the two above are written (style anchor plus set token plus character tokens plus the action line). Save as `clip01_c.mp4`, `clip01_d.mp4`, and so on in shot order.

### Batch 2. World (00:12.0 to 00:32.5), file prefix `clip02_`

Shots in the package section 3, Beat 2. This beat establishes the route: exterior wide of the bus on a gravel road, the driver's mirror, the stop at the mailbox, kids boarding. Build each shot's prompt the same way as batch 1: style anchor, the bus exterior or interior token as appropriate, the character tokens for whoever is in the shot, and the action and light direction from the package (morning light from the door side for this beat, per the look bible's two lighting states). Keep Nieves and Abuela small and distant wherever the package places them, never close. Name files `clip02_a.mp4` onward in shot order.

### Batch 3. Character (00:32.5 to 00:54.5), file prefix `clip03_`

Shots in the package section 3, Beat 3. This is the most face-heavy beat: individual seat frames for Hollis, Mateo, Dele, Tola, Cal, and Priya, mostly reaction shots and short lines. Use each character's constant tokens from section 2 exactly, and use the seat frame angle already established for that character (Hollis low from the stairwell, Mateo sideways against the window, Dele half-standing, Tola turned to the window with chin down, Cal leaning into the aisle over his ledger, Priya from slightly above over her book). None of these seat frames puts a child's face fully frontal to the camera; keep it that way. Name files `clip03_a.mp4` onward in shot order.

### Batch 4. Turn (00:54.5 to 01:13.0), file prefix `clip04_`

Shots in the package section 3, Beat 4. Mr. Tull becomes more active here (he may face the camera; he is an adult). This is where the county timing threat becomes explicit. Use the PUSH camera note from the aisle at row 10 in place of any handheld direction. Name files `clip04_a.mp4` onward in shot order.

### Batch 5. Button (01:13.0 to 01:20.5), file prefix `clip05_`

Shots in the package section 3, Beat 5. Short and punchy, the group's answer to Tull. Name files `clip05_a.mp4` onward in shot order.

### Batch 6. Last line and title (01:20.5 to 01:30.0), file prefix `clip06_`

Shots in the package section 3, Beat 6, ending on Frances's mirror line: "Sit down, sir. We're not there yet." This line needs lip sync (see section 3 below); frame it in the mirror shot the package already establishes for Frances, since that is the frame most of her dialogue uses throughout the trailer. Name the last generated shot `clip06_last.mp4`. The title card itself (`clip06_title.mp4` equivalent) is not generated; I build it as a static end card with the Streetlights masthead once you hand back the video clips.

## 3. Dialogue and voice

Any shot marked SYNC in the package (the speaker's mouth is on camera) needs a recorded line driving the lip sync, not a silent generation with sound added after. Record or synthesize each line first per the package's section 4 (voice and dialogue plan), then feed that audio to Gemini's speech-driven video mode if it has one, using the matching reference still as the base image. If Gemini cannot do speech-driven lip sync from an audio file, generate the shot with the mouth out of frame or the character listening instead (every SYNC shot in the package has a stated OFF or LISTENER fallback framing) and I will lay the recorded dialogue over that clip in the edit instead of relying on generated lip sync.

Under project rules: no child character's dialogue is synthesized in a child's own voice. Every child line is performed by a hired adult voice actor using a young timbre, or is left as a scratch line for timing only until that recording exists.

## 4. What to send back

For each accepted clip: the video file, named exactly as given above, at 1920x1080, 24 frames per second. A short note if you had to deviate from a prompt (what changed, why). Once I have all six batches (or however many you finish), I will concatenate them in order with ffmpeg, add the sonic ID, foley, and the title and end cards from the package's sections 5 and 6, run the trailer against the 12-point quality gate in section 7, and load the result into `projects/05-product/site/content/shows.json` for the Long Route listing.
