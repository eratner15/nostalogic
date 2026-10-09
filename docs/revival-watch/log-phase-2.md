# Phase 2 log: source mapping review

Date: 2026-10-09. Input: `docs/revival-watch/sources-proposed.csv` (120 rows). Output: `docs/revival-watch/sources-reviewed.csv` (same columns, same row order, same quoting).

## Method

- **Wikipedia, every row.** A script under `/tmp` (not in the repo) queried the action API (`action=query&titles=...&redirects=1&prop=extracts|pageprops&exintro=1`) for each `wiki_title` and its `wiki_alternates`, with the User-Agent `NostalDamus/1.0 (team@cafecito-ai.com)`. I read each intro extract and kept a title only if it is about that exact property: right medium, right year, and not a remake, album, franchise page or person. No primary title was a redirect or a missing page. Replacements were checked the same way. The action API began answering HTTP 429 partway through, so the last few replacement checks used the REST summary endpoint (`/api/rest_v1/page/summary/<title>`), which follows redirects and returns the canonical title. Every non-empty title is now `verified`. The one empty title is `none`.
- **Rule for era properties.** Rows like "No Doubt (Tragic Kingdom era)" or "TLC (CrazySexyCool era)" now map to the band article, matching the known Ace of Base fix (album page bad, band page right). Jagged Little Pill keeps the album page because the property is the album itself.
- **Subreddits, every non-empty cell, plus searches for empty ones.** Arctic Shift `/api/subreddits/search?subreddit_prefix=<name>` (exact match for subscribers, title and description) and `/api/posts/search?subreddit=<name>&limit=10` (recent post titles). Requests ran one at a time with a 1 second pause. On HTTP 422 the script waited 3 seconds and retried once; cells that still failed were rerun later. I cleared generic or unrelated subreddits. Where a clearly dedicated community existed, I replaced or added it. A tiny subreddit that is still dedicated to the property (for example r/legendsofhiddentemple, 1 subscriber) was kept, because an empty cell is only better than a wrong one. `subscribers` is refreshed from Arctic Shift wherever it returned a number.

## Coverage

| | count |
|---|---|
| Properties | 120 |
| Verified Wikipedia title | 119 |
| Verified subreddit | 90 |
| Both | 90 |
| Neither | 1 (gak-1993) |

Before review: 120 titles (99 high, 15 medium, 6 low) and 104 subreddits.

Changes: 43 cell edits across 39 rows. 17 `wiki_title` edits (16 fixed, 1 cleared). 26 `subreddit` edits (8 replaced, 2 added, 16 cleared).

## Changed or cleared cells

| property_id | field | before | after | reason |
|---|---|---|---|---|
| a-goofy-movie-1995 | subreddit | (empty) | goofymovie | added: r/goofymovie is dedicated to the film |
| ace-of-base-1993 | wiki_title | The Sign (Ace of Base album) | Ace of Base | was the album The Sign; property is the band |
| all-that-1994 | wiki_title | All-American Girl (TV series) | All That | was All-American Girl (TV series), a different 1994 sitcom |
| angels-in-the-outfield-1994 | subreddit | ANGELS | (cleared) | r/ANGELS is about the Los Angeles Angels baseball team, not the film; no film subreddit found |
| aqua-barbie-girl-1997 | wiki_title | Barbie World | Aqua (band) | was Barbie World, a 2023 Nicki Minaj song |
| aqua-barbie-girl-1997 | subreddit | aqua | (cleared) | r/aqua not found in Arctic Shift; generic word with no fan content |
| bubsy-1993 | wiki_title | Bubsy | Bubsy in Claws Encounters of the Furred Kind | was the Bubsy series page; this is the 1993 game |
| casper-1995 | subreddit | casper | (cleared) | r/casper is the subreddit for Casper, Wyoming |
| command-and-conquer-1995 | subreddit | Command | commandandconquer | r/Command is a dead generic sub (PDF/Linux tips); r/commandandconquer is the C&C fan community |
| duke-nukem-3d-1996 | subreddit | dukenukem3d | dukenukem | r/dukenukem3d has 9 subscribers and says 'this subreddit is dead'; r/dukenukem covers Duke Nukem and Build engine games |
| gak-1993 | wiki_title | Nickelodeon Studios | (cleared) | was Nickelodeon Studios; Gak has no article (GAK is a disambiguation page) |
| gak-1993 | subreddit | nickelodeon | (cleared) | r/nickelodeon is about the whole network, not Gak |
| hackers-1995 | subreddit | hackers | HackersMovie | r/hackers is about real-world hacking; r/HackersMovie is about the 1995 film |
| james-and-the-giant-peach-1996 | subreddit | James | (cleared) | r/James is for people named James |
| jingle-all-the-way-1996 | subreddit | jingle | (cleared) | r/jingle is a dead generic sub |
| kenan-and-kel-1996 | subreddit | (empty) | KenanAndKel | added: r/KenanAndKel is dedicated to the show |
| lilith-fair-1997 | wiki_title | Sarah McLachlan | Lilith Fair | was Sarah McLachlan (person) |
| lisa-frank-1996 | wiki_title | Mona Lisa | Lisa Frank | was Mona Lisa; Lisa Frank article covers the artist and her brand |
| macarena-1996 | wiki_title | Los del Río | Macarena | was Los del Rio (band); property is the song (Macarena (song) redirects to Macarena) |
| macarena-1996 | subreddit | macarena | (cleared) | r/macarena has 1 subscriber and unrelated posts |
| mighty-max-1993 | wiki_title | Mighty Max (TV series) | Mighty Max (toyline) | was the TV series; property is the 1992-93 toy line |
| mighty-morphin-power-rangers-1993 | subreddit | mightymorphin | powerrangers | r/mightymorphin has 4 subscribers and 3 posts; r/powerrangers is the franchise fan community |
| no-doubt-1995 | wiki_title | Tragic Kingdom | No Doubt | was the album Tragic Kingdom; band-era properties map to the band article, as for Ace of Base |
| now-and-then-1995 | subreddit | nowandthen | (cleared) | r/nowandthen is for then-and-now comparison photos, not the film |
| nsync-1998 | wiki_title | NSYNC (album) | NSYNC | was the debut album; band-era properties map to the band article |
| palmpilot-1996 | wiki_title | Palm (PDA) | PalmPilot | was Palm (PDA), the whole product line; PalmPilot has its own article |
| pleasantville-1998 | subreddit | pleasantville | (cleared) | r/pleasantville is a 7-subscriber local/trivia sub, not the film |
| spice-girls-1996 | wiki_title | Spice (album) | Spice Girls | was the album Spice; band-era properties map to the band article |
| starter-jackets-1993 | wiki_title | Sourdough | Starter (clothing line) | was Sourdough |
| surge-1996 | subreddit | surge | (cleared) | r/surge not found in Arctic Shift; generic word with mixed gaming posts |
| swing-revival-1998 | subreddit | swing | (cleared) | r/swing posts are swinger/spam content |
| the-adventures-of-pete-and-pete-1993 | subreddit | adventures | peteandpete | r/adventures is about outdoor adventures; r/peteandpete is dedicated to the show |
| the-craft-1996 | subreddit | craft | (cleared) | r/craft is about arts and crafts; no film subreddit found |
| the-cranberries-1994 | wiki_title | Zombie (The Cranberries song) | The Cranberries | was the song Zombie; band-era properties map to the band article |
| the-cranberries-1994 | subreddit | cranberries | TheCranberries | r/cranberries is about the fruit; r/TheCranberries is the band's fan community |
| the-faculty-1998 | subreddit | faculty | (cleared) | r/faculty is for university faculty |
| the-mask-1994 | subreddit | MASK | TheMask | r/MASK is about the M.A.S.K. toy line; r/TheMask is about the 1994 film |
| the-mighty-ducks-1994 | wiki_title | Emilio Estevez | D2: The Mighty Ducks | was Emilio Estevez (person); D2 is the 1994 film |
| the-sandlot-1993 | subreddit | Sandlot | (cleared) | r/Sandlot is an amateur baseball community; r/TheSandlot is a fantasy league |
| the-tick-1994 | subreddit | tick | TheTick | r/tick is about insects (0 subscribers); r/TheTick covers The Tick comics and series |
| tlc-1994 | wiki_title | CrazySexyCool | TLC (group) | was the album CrazySexyCool; band-era properties map to the band article |
| tommy-boy-1995 | subreddit | Tommy | (cleared) | r/Tommy is for people named Tommy; no film subreddit found |
| total-request-live-1998 | subreddit | TotalRequestLive | (cleared) | r/TotalRequestLive (4 subscribers) only reposts music videos, not about the show |

## Judgment calls worth a second look

- **tech-deck-1998:** kept `Fingerboard (skateboard)`. "Tech Deck" redirects there on Wikipedia, so it is the canonical page, but it covers fingerboards in general, not only the brand.
- **palmpilot-1996:** now `PalmPilot`. That article covers the 1997 PalmPilot Personal and Professional. The 1996 device is `Pilot 1000`, and the whole line is `Palm (PDA)`.
- **lisa-frank-1996:** `Lisa Frank` is the article about the artist, but it also covers her brand. No separate brand article exists.
- **jock-jams-1995:** kept `Jock Jams, Volume 1` (the 1995 album) rather than the series page `Jock series`.
- **Band-era rows** (Ace of Base, Aqua, No Doubt, NSYNC, Spice Girls, The Cranberries, TLC): these now point at the band article. If the scoring should track the specific album or song, switch back.
- **Franchise-wide subreddits:** r/powerrangers (for MMPR), r/dukenukem (Duke Nukem plus other Build engine games), r/commandandconquer, r/TheTick, r/starshiptroopers, r/earthbound, r/myst and r/Spyro cover more than the single 1990s title. I kept or chose them because they are the real fan communities.
- **starter-jackets-1993 r/Starter:** cleared after review. Arctic Shift subreddit search does not list it, and the runtime existence check uses that same search, so the pair could never be read.
- **Cleared after review:** r/Heavyweights (8 subscribers; recent posts are boxing spam, which the pipeline would count as interest) and r/eventhorizon (banned in April 2026; Arctic Shift has no posts after October 2025, so it would record false zero days).
- **Low-quality dedicated subs that were kept:** r/Clueless and r/rockosmodernlife (dedicated, but recent posts include stream spam), and r/IndependenceDay (141 subscribers, mixed posts, inactive since 2023).
- **palmpilot-1996 stays on `PalmPilot`.** The property is the PalmPilot brand, and 1996 is its launch year. `PalmPilot` had 9,363 views in September 2026; `Pilot 1000` returned no page-view data.
- **Searched, nothing dedicated found (left empty):** Angels in the Outfield, The Craft, Tommy Boy, The Sandlot (r/TheSandlot is a fantasy baseball league), Anastasia, Bubsy, Gattaca, Wishbone, The Pagemaster, Surge.

## Local load test

```
$ rm -rf .wrangler/state && npm run db:local
  (migrations applied; SELECT COUNT(*) FROM properties -> 120)
$ node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --local
wrote 209 bookmark upserts
🚣 ... executed successfully
$ npx wrangler d1 execute nostaldamus-db --local --command "SELECT source, COUNT(*) FROM signal_bookmarks GROUP BY source"
source       | n
arcticshift  | 90
wikipedia    | 119
```

Not run in this phase: `wrangler dev --local --test-scheduled` and `POST /api/admin/run/signals` (handoff step 5, second half).

## Production load (after this phase)

On 2026-10-09, about 02:15 UTC, after the PR #4 rollout, this file was loaded into production with `node scripts/load-sources.mjs docs/revival-watch/sources-reviewed.csv --remote`. Result: 209 bookmarks (119 Wikipedia, 90 subreddit). The hourly cron began the 120-day backfill.

The loader only inserts and updates. The three subreddits cleared above (event-horizon-1997, heavyweights-1995, starter-jackets-1993) stay in production until their bookmarks are deleted:

```sql
DELETE FROM signal_readings  WHERE source = 'arcticshift' AND property_id IN ('event-horizon-1997','heavyweights-1995','starter-jackets-1993');
DELETE FROM signal_bookmarks WHERE source = 'arcticshift' AND property_id IN ('event-horizon-1997','heavyweights-1995','starter-jackets-1993');
```
