# Identity brief

Project Porchlight, Phase 2. Brand strategist output. Internal.
`[NAME]` stands for the brand name until Fork D closes. The recommendation in `names-5.md` is Streetlights.

## 1. The idea

The site is a printed TV guide that came to life. A family opens it, finds the night, reads the four listings, and clicks one to watch the trailer. It must feel like a real publication with a real art director, not a costume. The 1990s reference stays in the bones (grid, type, numbers, paper) and never in the surface (no scan lines, no VHS noise, no fake static, no "retro" badge).

Premium means: tight typography, generous margins, real hierarchy, one accent, and motion that stays out of the way. Kitsch means: glow filters, neon, distressed textures, and jokes about the format. The brief bans the second list.

## 2. The printed-guide reference, translated to screen

| Printed element | What it was | On screen |
|---|---|---|
| Newsprint grid | Narrow columns, thin rules, dense listings | A 12-column grid on desktop that collapses to 4 on mobile. Hairline rules (1 pixel, ink at 20 percent) separate listings. No cards, no drop shadows. |
| Condensed headlines | Tall, tight sans headlines that fit a column | One condensed display face for show titles and the masthead. Tracking tight. Never stretched by CSS. |
| Listing typography | Small text, bold show name, plain blurb, run-in style | Show name in bold small caps. Blurb in regular text following on the same line. 45 to 65 characters per line. |
| Channel numbers | A big numeral at the left of each row | Each slot gets a number: 1, 2, 3, 4. Set large in the display face, tabular figures, left of the listing. Not a real channel number. |
| Time bands | Rows keyed to half-hour marks | The four slots sit in four horizontal bands in order. Bands read "First," "Second," "Third," "Last." No clock times on the page. The fixed night is named. The time is not. |
| Small-caps show blurbs | One or two lines that sold the episode | One line per show, 12 to 18 words, written by the showrunner, passed by standards. Small caps for the show name only. |
| Masthead | The publication name across the top | [NAME] set in the display face, full width, with the fixed night and the words "Listings inside" set small under it. |
| Highlight box | A boxed pick of the night | One boxed listing per page: the premiere. It gets the accent color as a 2 pixel rule, not a fill. |
| Paper | Cream, slightly warm, visible fiber | A flat paper color with no texture image. Warmth comes from the hex value, not from a grain overlay. |

What is not translated: no fake ads in the margins, no fake crossword, no fake horoscope. Filler reads as a joke about the format and breaks the "never wink" voice rule.

## 3. Typography: two pairings, Google Fonts only

### Pairing A (recommended): Archivo + Newsreader

- Display and listings: Archivo. A variable grotesque with a width axis from 62 to 125 and weights 100 to 900. Use the condensed end (width 70 to 80) at weight 700 to 800 for the masthead, show titles, and slot numerals. Use width 100, weight 500, for small-caps show names. Enable tabular numerals (`font-feature-settings: "tnum"`) for the slot numbers.
- Body and blurbs: Newsreader. A variable serif built for on-screen reading with an optical size axis. Use optical size 14 to 16 for blurbs and body, weight 400. Use italic for the one-line premiere note.
- Why: Archivo condensed reads as a real listings headline face without imitating any one publication. Newsreader gives the blurb the density of print and the readability of a screen. The pair is calm. Nothing in it says costume.

### Pairing B: Bricolage Grotesque + Source Serif 4

- Display: Bricolage Grotesque. Variable, with optical size and width axes. Use the condensed width at weight 800 for the masthead and titles. It carries more personality in the letterforms (a slightly rounded, slightly odd grotesque), which suits the Wildcard slot and the host voice.
- Body: Source Serif 4. Variable serif with an optical size axis. Weight 400 for body, 600 for small-caps show names.
- Why: warmer and more characterful than Pairing A. The tradeoff is that Bricolage has a strong flavor and may read as designed rather than printed. Choose B if the logo direction is "the signal" (section 7) and the brand needs more play.

Rules for both:
- Two families per page. No third.
- No faux bold, no faux small caps. Use the real small-caps feature (`font-variant-caps: small-caps` only where the face supports it; otherwise set capitals at 80 percent size with 5 percent tracking).
- Minimum body size 16 pixels. Minimum listing blurb 15 pixels. Parents read on phones at night.
- Line length 45 to 75 characters.

## 4. Color system

One paper, one ink, one accent, one on-air glow. Grays derive from ink at fixed opacities. No gradients except the glow halo.

### Light (default, "daytime edition")

| Role | Hex | Use |
|---|---|---|
| Paper | #F3ECDD | Page background. Warm cream, no texture. |
| Ink | #1C1A16 | All text, rules, numerals. |
| Ink 60 | rgba(28,26,22,0.60) | Blurbs, secondary text. |
| Ink 20 | rgba(28,26,22,0.20) | Hairline rules, dividers. |
| Accent | #C9391E | One per page: the premiere box rule, the primary button, the active link. A brick red that prints. |
| On-air glow | #FFC46B | The "now playing" indicator, the play button halo, the sonic logo visual. Warm amber. Used at 100 percent as a dot and at 30 percent as a soft halo. |

### Dark ("late edition")

| Role | Hex | Use |
|---|---|---|
| Paper | #15130F | Page background. Ink-black with warmth. |
| Ink | #EFE6D3 | All text, rules, numerals. |
| Ink 60 | rgba(239,230,211,0.60) | Secondary text. |
| Ink 20 | rgba(239,230,211,0.20) | Rules. |
| Accent | #E8583A | Same roles. Lifted for contrast. |
| On-air glow | #FFD08A | Same roles. Brighter on dark. |

Rules:
- Contrast: ink on paper passes WCAG AA at every size in both modes. Accent on paper passes AA at 18 pixels and up. Never set body text in accent.
- The glow is the only thing on the page that looks lit. It appears only where something is playing or about to play.
- The trailer pages use the dark set by default, so the video is the brightest object.
- Slot 4, Lights Out, may use the dark set on its listing row in the light edition. That is the one exception to a single paper per page.

## 5. Motion rules

What moves:
1. The on-air glow breathes. Opacity 30 to 60 percent over a slow cycle. It is the only ambient motion on the site.
2. Listings reveal on load in slot order, first to last, each with a 40 millisecond stagger and a 6 pixel rise. One pass. Never on scroll.
3. The trailer player fades from paper to dark when play starts. The listing behind it stays put.
4. The vote button confirms with a single ink fill from left to right and a checkmark. No confetti, no bounce.
5. Hover on a listing raises the hairline rule to ink 60. Nothing else.

What never moves:
1. The masthead. It is print. It does not scroll away, shrink, or animate.
2. Type. No kinetic type, no letter-by-letter reveals, no marquee.
3. The grid. Columns do not shift on hover or reflow on interaction.
4. The paper. No parallax, no grain, no flicker, no scan lines, no static.
5. Anything for longer than 300 milliseconds, except the glow breath.

Accessibility: honor `prefers-reduced-motion`. When set, the glow holds at 45 percent and the load stagger is removed. No strobe of any kind (`canon/STANDARDS.md` section 3, item 9).

## 6. Sonic logo brief

- Length: 2.5 seconds for the full ident. A 1 second short cut for bumpers.
- Instrumentation: one real instrument, recorded, not synthesized. First choice: a single upright piano playing a three-note rising figure, close-miked, with room tone. Second choice: a vibraphone with the same figure. Optional: one soft doorbell-like chime on the last note, played on the same instrument, not a sample of a real doorbell.
- Structure: three notes up, a held fourth note, then silence. The silence is part of the logo. The block starts in the silence.
- Mood: the feeling of a light turning on in a window. Confident, warm, unhurried. A parent should be able to hum it. A kid should be able to sing it.
- Tempo and key: mid tempo, major key, no swing. It must sit under a host's voice without fighting it.
- Loudness: peaks no louder than dialogue peak (`canon/STANDARDS.md` section 3, item 8). Mastered to the same loudness target as the trailers.
- Variants: a full ident (2.5 seconds), a bumper cut (1 second), and a Lights Out variant that plays the same figure one octave lower with a longer hold. Same notes, darker room.
- What it must not sound like: no orchestral swell, no synth pad, no whoosh or riser, no sampled crowd or kids' cheer, no vocal tag, no jingle with lyrics, no sound that recalls any network ident or block jingle from any era, no melody that resolves like a commercial. Any resemblance to a known ident fails standards item 12 (copied expression).
- Deliverable: a stem session, three mixed variants, and a written note on the notes and intervals so the format architect and the showrunner can reference it in scripts.

## 7. Logo direction: three directions in words

Each direction produces a wordmark. No mascot. No badge. The wordmark must work in one color, in ink on paper and in paper on ink, at masthead size and at favicon size.

### Direction 1: The Masthead

The name set in the condensed display face, full width, all capitals, tracked tight. Under it, a single hairline rule and the fixed night in small caps. The mark is typography alone. The distinguishing detail is a single amber dot (the on-air glow) placed as the tittle of one letter or as a period after the name. In the favicon, the dot alone on paper is the mark.
- Strength: reads as a real publication. Cheapest to build. Ages well.
- Risk: without the dot it could be any masthead. The dot must be consistent.

### Direction 2: The Signal

A wordmark plus a small geometric symbol: a lit window. A rectangle in ink with a smaller rectangle in amber inside it, offset to the upper right, like a lamp seen through a window from the street. Nothing else. The symbol sits to the left of the name at masthead size and stands alone as the favicon and the app tile. The symbol animates once on load: the inner rectangle goes from paper to amber.
- Strength: gives the brand an object a kid can draw. Works in motion. Ties to the glow.
- Risk: window symbols exist in other categories. Counsel checks the symbol as well as the word.

### Direction 3: The Number

The name set in the display face with the four slot numerals 1 2 3 4 set beneath it in the same face, spaced to the width of the name, with a hairline rule between. The numerals are the promise: four shows, in order, every week. The favicon is the numeral 4 in ink with the amber dot.
- Strength: says the format without a tagline. Distinct from any single-show brand.
- Risk: if the format changes slot count, the mark changes. Fits only if the format architect fixes four slots as canon.

Recommendation: Direction 1 for the site launch, with the amber dot as the constant, and Direction 2 held for the app tile and video platform channel art once the format is fixed.

## 8. The "not slop" checklist

The site must pass all ten before the standards agent reviews it.

1. Every image on the site was made for the site. No stock photography, no generic AI render of a family on a couch, no clip art. If the site has a photo, it has a credit.
2. Every word on the site was written by a person and read aloud once. No filler paragraphs, no "Welcome to our website," no placeholder text.
3. No page has more than one accent color element competing for the eye. Count them. One per view.
4. The masthead, the listing grid, and the footer are identical on every page. A returning parent knows where they are in one glance.
5. Zero texture overlays. No grain, no paper fiber image, no scan lines, no vignette. Warmth comes from the hex values and the type.
6. Type is never stretched, skewed, or faux-bolded. Font widths come from the variable axis only.
7. Every trailer page shows the same four things in the same order: the listing line, the player, the vote, the parent note. No page adds a fifth thing.
8. Load time: the guide page renders its type and grid before any video asset loads. A parent on a phone sees listings in the first paint.
9. Nothing on the site addresses a child. Read every button and heading as if a 7-year-old were the reader. If it asks them to do anything, rewrite it (`canon/STANDARDS.md` section 2, item 10).
10. The site says, on every page, that a parent holds the account and that no child data is collected (`canon/STANDARDS.md` section 4, item 2). The footer line in `voice.md` is the default.

A page that fails any one item goes back to the builder before standards review.

## 9. Hand-off

- The product builder uses Pairing A, the light and dark color sets, the motion rules, and Direction 1 unless the owner overrides at Fork D.
- The format architect receives the sonic logo brief and the ritual words in `voice.md`.
- The compliance gate receives `names-5.md` for CG-01.
- Nothing in this brief is canon until the Orchestrator writes it to `canon/`.
