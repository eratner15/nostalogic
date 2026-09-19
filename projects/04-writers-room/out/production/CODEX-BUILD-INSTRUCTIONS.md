# Instructions for Codex: build the four Streetlights trailers

Paste this whole file into Codex at the root of this repo (`nostalogic`), or point Codex at this path and ask it to follow it. It has everything needed to generate images, generate video, record or synthesize voice, edit, and drop finished files into the live site.

## 0. What you are building

Four trailers for a weekly family comedy block called Streetlights (provisional name, not final). Each trailer is 60 to 120 seconds. Each has a full shot-by-shot production package already written. Your job is to execute those packages, not to invent new creative direction. If a package is unclear, ask before improvising.

The four shows and their package files:

| Show | Slot | Length | Trailer script | Character sheet | Production package |
|---|---|---|---|---|---|
| Kitchen Court | Anchor | 90 s | `projects/04-writers-room/out/scripts/A2-kitchen-court-trailer-v2.md` | `projects/04-writers-room/out/scripts/A2-kitchen-court-character-sheet.md` | `projects/04-writers-room/out/production/A2-kitchen-court-package.md` |
| Long Route | Hangout | 90 s | `projects/04-writers-room/out/scripts/H2-long-route-trailer-v2.md` | `projects/04-writers-room/out/scripts/H2-long-route-character-sheet.md` | `projects/04-writers-room/out/production/H2-long-route-package.md` |
| Recent History Society | Wildcard | 73 s | `projects/04-writers-room/out/scripts/W5-recent-history-society-trailer-v3.md` (use v3, not v2 — v2 is superseded) | `projects/04-writers-room/out/scripts/W5-recent-history-society-character-sheet.md` | `projects/04-writers-room/out/production/W5-recent-history-society-package.md` (already patched to match v3) |
| The Returns Desk | Lights Out | 120 s | `projects/04-writers-room/out/scripts/L1-the-returns-desk-trailer-v2.md` | `projects/04-writers-room/out/scripts/L1-the-returns-desk-character-sheet.md` | `projects/04-writers-room/out/production/L1-the-returns-desk-package.md` |

Each production package already contains, in order:
1. A look bible (visual intent, style anchor sentence, forbidden elements, resolution target).
2. A character consistency kit (master portrait prompt per character, turnaround notes, costume tokens, the reference-first workflow).
3. A full numbered shot list (timecode in/out, frame, camera, who, action, dialogue, sound cue, an image prompt, and a motion prompt for every single shot).
4. A voice and dialogue plan (which lines need a performed voice, synthesized vs. hired, and which counsel gate applies).
5. A sound plan (sonic ID, foley, music brief, loudness limits).
6. An edit plan (stitch order, cut rhythm, title card, end card, export settings).
7. A 12-point quality gate checklist.
8. A disclosure draft for the About page.

Read the whole package for a show before generating anything for it. Do not skip section 2 (character consistency) — it is the difference between a trailer that looks like one show and one that looks like four different AI demos stitched together.

## 1. Hard constraints — do not violate these

These come from the project's binding rules (`canon/STANDARDS.md`, `DECISIONS.md`). Breaking any of these means redo the shot, not ship it.

1. **No resolved child faces.** Per decision D-025, no photoreal generated child face may be resolved on screen in any v1 trailer. Children appear as figures shot from behind, in profile, above the frame edge, with faces obscured by an object (soup cans, a horse head, cans settling around the face), or off-screen entirely, exactly as each shot list specifies. If a generation accidentally resolves a clear child face, discard it and regenerate with tighter framing — do not use it even if it looks good.
2. **No synthesized child voice.** Every child character's dialogue is voiced by an adult performer using a young timbre (a real human vocal performance, pitched/cast for youth), never a text-to-speech child voice. This is a hard rule under D-025, not a preference.
3. **No borrowed expression.** Nothing generated may visually or verbally resemble any real TV show, network, brand, logo, or the trademarks "TGIF" or "SNICK". No real actor's likeness. No real person's name, face, or voice. If any generation accidentally produces something that reads as a known character, logo, or real person, discard it.
4. **Character names are locked and have already been IP-screened.** Use exactly the names in the character sheets and production packages — do not substitute or shorten them, and do not introduce new named characters. If you think a name is a problem, flag it; do not silently change it.
5. **No text baked into generated frames**, except where a shot explicitly calls for a hand-lettered sign/card as a prop (e.g. the "AISLE 5" sign in Recent History Society) — those are composited in post per the package's instructions, not generated as part of the image, unless the package says otherwise.
6. **No music bed** unless a package's sound plan explicitly calls for one under specific terms (most trailers use room tone, foley, and the sonic ID only — check each package's Section 5).
7. **Loudness:** any sound effect (bell, doorbell, ice machine, etc.) must sit at or below dialogue peak. No strobe or flashing faster than 3 flashes per second in any shot.
8. **Runtime is fixed per show** — hit the second counts in the table above. Trim per the package's edit plan (it names which beats can be shortened and which — usually the button/ending — must never be cut).
9. **Every trailer needs the disclosure text** from its package's Section 8, verbatim or lightly edited, delivered back to the Orchestrator for the About page. This is required before anything goes public (counsel gate CG-03).

## 2. Per-show workflow

Do this once per show, in this order: Kitchen Court, Long Route, The Returns Desk, Recent History Society (the last one is the most complex, save it for when the pipeline is proven).

### Step A — Generate character reference sheets
For every named character in the show's character sheet, generate the master portrait using that character's exact prompt from the production package's Section 2. Generate the 2–3 turnaround angles it specifies. Lock these as reference images — every subsequent shot featuring that character must reference these, not a fresh unguided generation. If a face drifts across shots, regenerate from the reference, don't accept the drift.

### Step B — Generate the set/location stills
Generate the recurring sets called out in the package (the kitchen, the bus interior, the returns desk, the Foundry Hall stage) using the style anchor sentence from Section 1. These are also locked references for consistency across shots.

### Step C — Generate each shot in the shot list
Work through the numbered shots in order. For each shot:
- Build the image prompt exactly as specified: style anchor + character reference tokens + action + negative prompt, as written in the package.
- Generate the still. Compare it against the character/set references — reject and regenerate if faces, costumes, or set details drifted.
- Where the shot list marks a reused still (the package tells you which shots reuse an earlier approved still — check the "Shot count and reuse" note near the top of each shot list section), reuse it; do not regenerate.
- Once the still is approved, run the motion prompt (image-to-video) to get the 3–6 second clip. Keep it subtle motion as instructed — no fast motion, no crowd surges, camera locked unless the shot says otherwise.

### Step D — Record or synthesize dialogue
Follow the package's Section 4 exactly on which lines are hired-human vs. synthesized, and which counsel gate applies to each (CG-03 for any AI-generated performance/voice/image, CG-04 for hired human talent). Record/generate a scratch track first for timing, per the package's sequencing notes, before finalizing.

### Step E — Assemble sound
Add the sonic ID cue (from `projects/03-block-format/out/block-bible.md` section 4.4, restated in each package's Section 5), the foley/room tone described per shot, and mix so every effect sits below dialogue peak.

### Step F — Edit
Follow the package's Section 6 stitch order and cut rhythm. Add the title card and end card exactly as specified (masthead name is the config constant `SITE.name` in `projects/05-product/site/src/config.ts`, currently "Streetlights" — provisional, may change). Hit the target runtime.

### Step G — Run the 12-point quality gate
Before calling a trailer done, walk every item in the package's Section 7 checklist (face consistency, no text artifacts, no six-finger hands, lip sync acceptable or mouths off-camera, dialogue intelligible, music under voice, standards items, the five trailer tests, disclosure line ready). Fix anything that fails before moving on.

### Step H — Deliver
Export the finished trailer as an MP4, 1920x1080, under about 60 MB. Report back:
1. The file (or a link/path to it).
2. Final runtime in seconds.
3. Any shot you had to deviate from the package on, and why.
4. The disclosure text from Section 8 (for the About page).
5. Confirmation the 12-point gate passed.

## 3. Wiring the finished trailer into the live site (after Codex delivers)

This step is for whoever integrates the file, not necessarily Codex itself unless it also has repo write access:

1. Host the MP4 (Cloudflare R2 or Stream recommended — see `projects/05-product/site/runbook.md` section 5).
2. Edit `projects/05-product/site/content/shows.json`: set `trailerUrl` to the hosted MP4 URL for that show's entry, and confirm `trailerSeconds` matches the actual final runtime.
3. Run `cd projects/05-product/site && npm run seed:build && npm run seed:remote` (or `seed:local` for local testing) to push the updated listing.
4. The site's `noindex` tag and public launch stay off until counsel clears CG-02 (privacy/COPPA) and CG-03 (AI-assisted production disclosure) — see `DECISIONS.md` and `projects/08-compliance/out/gate-register.md`.

## 4. If something in a package looks wrong or impossible

Do not silently deviate from a locked constraint (Section 1 above). If a package's shot is technically infeasible with your tools, or a prompt produces unusable results after 3+ honest attempts, stop and report which shot, why, and your best alternative — the Orchestrator (or a human) decides, especially anything touching a child character, a name, or a counsel-gated element.
