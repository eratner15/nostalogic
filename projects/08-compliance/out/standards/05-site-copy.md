ASSET: projects/05-product/site (public copy: src/config.ts, src/views/layout.ts, src/views/pages.ts, content/shows.json, public/guide.js; rendered: dist/index.html, dist/about/index.html, dist/show/lights-out/index.html, dist/review.html)
RESULT: PASS
FAIL ITEMS: none.
  Section 2 checks, by file and line:
  - Item 4 (alcohol, tobacco, drugs, gambling): none. shows.json:6-7, 21-22, 36-37, 51-52 checked.
  - Item 9 (product placement without label): none. shows.json:51 "24-hour hardware store" is generic. No brand named anywhere.
  - Item 10 (call to action aimed at a child): none. Every imperative names the parent or the household as the actor. pages.ts:51 "Watch one. Then tell us one thing: would your house watch this? The shows parents pick get made." pages.ts:97 "Watch the trailer. Then tell us one thing: would your house watch this?" pages.ts:105 "Would your house watch this?" config.ts:14-16 "I'd watch this", "Not for us", "Save the night". guide.js:46, 62 replies are addressed to the voter or the parent who signed up. No "click", "subscribe", "share", or "comment" in any string.
  - Item 11 (request for a child's name, age, location, image, contact): none. The only field is a parent email. pages.ts:69-71 and 117-119: label "Parent email", placeholder "parent@example.com", required checkbox "I am a parent or guardian, age 18 or over." app.ts:99 rejects a signup without the checkbox. app.ts:34-39: household id is a random UUID cookie, no identity.
  - Item 12 (copied expression): none found. Titles, loglines, and blurbs at shows.json:5-7, 20-22, 35-37, 50-52 are original. Title cards at pages.ts:9-27 are generated: color field, one lit window, no borrowed imagery.
  - Item 13 (block trademarks): none. Repository-wide search of the site folder for both marks returned no match in any source, content, or dist file.
  - Item 14 (real actor voice or likeness): none in copy. No trailer is live (shows.json:11, 26, 41, 56 trailerUrl null).
  - Item 15 (AI performance without disclosure): not triggered. No trailer is live. pages.ts:148-149 reserves a disclosure section pending counsel.
  - Items 1, 2, 3, 5, 6, 7, 8: none. shows.json:51-52 "spooky reason", "Some of them hum. Some of them ring." stays inside mild spooky.
WARN ITEMS: none.
  Section 3 checks, by file and line:
  - 1 (Slot 4 resolves with safety): not testable in copy. shows.json:50-52 logline and blurb carry no threat.
  - 2 (child sarcasm): none. 3 (body jokes): none. 5 (screen time punchline): none. 6 (family shape as joke): none; shows.json:6-7 shows a multi-generation household without a joke at its shape. 7 (food): shows.json:7 "Verdicts end in dessert" is ordinary food, no diet talk.
  - 8 (sound), 9 (strobe): not testable in copy. No autoplay video. Animations in dist/review.html:45, 50-52, 78-80 are 4-second fades and a 0.3-second rise, and honor prefers-reduced-motion.
PUBLIC ASSET RULES (Section 4), by file and line:
  - 4.1 No em dashes: PASS. No em dash or en dash in config.ts, layout.ts, pages.ts, shows.json, guide.js, or any dist HTML. Only match is the guard in test/app.test.ts:28.
  - 4.2 Every public page states the account holder is a parent: PASS. layout.ts:40 renders on every page, including 404 (pages.ts:155) and admin (pages.ts:179): "A parent holds every account. We collect nothing from children." Confirmed rendered at dist/index.html:147, dist/about/index.html:49, dist/show/lights-out/index.html:82, dist/review.html:306, 343, 413, 483, 553, 623. pages.ts:142 repeats it on the About page.
  - 4.3 No comments, personalized ads, child login, child data: PASS. layout.ts:40 "No comments, no personalized ads, no child accounts." pages.ts:142-145 restates all four. app.ts has no comment route and no child login route.
  - 4.4 Audience claims cite a source or metric: PASS. No audience or results claim in public copy. config.ts:6 hero and pages.ts:51 dek describe the format only. The only numbers are on the admin page (pages.ts:158-180), which is token-gated at app.ts:115-118 and defines each metric in-line at pages.ts:174-176.
VOICE RULES (projects/02-brand/out/voice.md), by file and line:
  - Rule 1 (never address a child): PASS. See Item 10 above. pages.ts:86 "Your browser cannot play this video." and pages.ts:110 "One vote per household. You can change it." address the account holder.
  - Rule 4 (no cozy, snuggle, magical, wholesome): PASS. Case-insensitive search returned no match.
  - Rule 5 (no exclamation points in headings): PASS. No exclamation point in any string in any of the five source files or in dist.
  - Rule 7 (no reference to old blocks, 1990s brands, jingles, catchphrases): PASS. Search for "remember when" and "retro" returned no match. config.ts:10 channel number "36" is a design device with no brand reference.
NOTES:
1. dist/ is stale. dist/index.html:62, 83, 104, 125 render "Placeholder until the writers room names the four shows." and dist/show/lights-out/index.html:33 shows "30 min"; neither matches content/shows.json. dist/show/the-night-desk/index.html does not exist. This agent has no shell tool and could not run `npm run export:static`. dist/review.html does reflect shows.json and was reviewed as the rendered example. Do not ship dist/ until it is regenerated and re-reviewed.
2. pages.ts:147 and 149 state that the privacy policy, terms, and production disclosure are pending counsel. Those are open counsel gates (COPPA design; AI disclosure). This PASS covers copy only, not those gates.
3. config.ts:5 uses "Streetlights" as the public name before the brand-name counsel gate (CG-01, Fork D) closes. layout.ts:15 sets robots noindex, so the site is not yet public. Re-run this review when the name is final.
4. layout.ts:16-18 loads fonts from fonts.googleapis.com and fonts.gstatic.com. That is a third-party request from a family-facing page. Not a Section 2, 3, or 4 item; flag for the COPPA design review.
5. pages.ts:51 "Watch one." is an imperative whose parent address arrives in the next sentence, not the same one. Not a FAIL under Item 10 because the page and footer name the parent as the actor. Recorded for the voice owner.
