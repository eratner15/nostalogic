# Names: shortlist of 5 with screens

Project Porchlight, Phase 2. Brand strategist output. Internal. Screens run on 2026-09-19.

## How the screens ran

Three signals per name. Each result is CLEAR-SIGNAL, CONFLICT-SIGNAL, or UNKNOWN, with the search that produced it.

1. Trademark. The research proxy blocked `tmsearch.uspto.gov` (HTTP 403 on the search API), `trademarks.justia.com`, and `uspto.report`. So every trademark result rests on web search results that index those databases, not on a direct database query. Counsel must run the direct USPTO search before filing. That is gate CG-01.
2. Domain. Two checks per domain: a DNS lookup from the shell (`getent hosts`) and a web search for the domain string. WebFetch and RDAP were blocked by the proxy for every domain. A blocked fetch, a failed fetch, or a missing DNS record is not proof that a domain is available. Only a registrar lookup proves it.
3. Handles. Web search for the exact YouTube handle and Instagram handle. A search that finds no exact handle is a weak clear signal. It does not prove the handle is free.

Signal key:
- CLEAR-SIGNAL: no conflicting use found in the field of entertainment, video, or family content.
- CONFLICT-SIGNAL: a live use found in or near that field, or the exact domain or handle is in use.
- UNKNOWN: the check could not run or returned nothing usable.

## 1. Streetlights

| Check | Result | Evidence | Search run |
|---|---|---|---|
| USPTO trademark | CLEAR-SIGNAL (weak) | Registered marks found: STREETLIGHTS RESIDENTIAL (SLR Holdings, Reg. 5010901, real estate) and STREETLIGHT.VISION (Itron, Reg. 5508833, municipal lighting control). No class 41 or video mark found. | WebSearch `"Streetlights" trademark USPTO entertainment` and `justia trademarks "STREETLIGHTS" OR "STREET LIGHTS" class 41 entertainment`. Sources: https://trademarks.justia.com/866/61/streetlights-86661059.html and https://trademarks.justia.com/864/51/streetlight-86451215.html |
| streetlights.com | CONFLICT-SIGNAL | DNS resolves (216.150.1.1). Web search attributes the domain to StreetLights Residential, a Texas real estate developer. | `getent hosts streetlights.com`; WebSearch `"lightsup.com" OR "streetlights.com"`. Source: https://www.zoominfo.com/c/streetlights-residential/348086112 |
| streetlights.tv | CLEAR-SIGNAL (weak) | No DNS record. WebFetch returned ENOTFOUND. Not proof of availability. | `getent hosts streetlights.tv`; WebFetch https://streetlights.tv |
| YouTube handle | CONFLICT-SIGNAL (variants) | Channels named STREETLIGHTS (a Chicago gospel ministry), "Streetlights, People!" (a small production company), and a music channel. No exact `@streetlights` handle confirmed. | WebSearch `youtube.com/@streetlights OR instagram.com/streetlights "streetlights" channel`. Sources: https://www.youtube.com/channel/UCCHRlahR6yaGbanFSsUg_Ew and https://www.youtube.com/channel/UC0JTGd9fhUq1nPv2Vw4aXSA/featured |
| Instagram handle | CONFLICT-SIGNAL (variants) | `@streetlightsyoutubechannel`, `@streetlights.crew`, `@street_.lights` exist. Exact `@streetlights` not confirmed either way. | Same search. Source: https://www.instagram.com/streetlightsyoutubechannel/ |

Notes: the trademark field is the cleanest of the five. The domain and handle field is crowded with small unrelated users. A usable set is `streetlights.tv` plus a modified handle such as `@streetlightsnight` or `@watchstreetlights`, both unchecked.

## 2. Rumpus

| Check | Result | Evidence | Search run |
|---|---|---|---|
| USPTO trademark | UNKNOWN, leaning conflict | Registered: RUMPUS (Font Bureau, Reg. 4350203, fonts) and RUMPUS (West Paw, Reg. 5910391, pet toys). Both outside class 41. Rumpus Ventures LLC holds marks of unknown scope. A prior kids entertainment company named Rumpus (founded by Larry Schwarz, 1996) ran rumpus.com and produced interactive kids programming. Its current status is unknown. | WebSearch `"Rumpus" trademark USPTO entertainment` and `justia trademarks "RUMPUS" entertainment class 41 animation children` and `"Rumpus" Larry Schwarz kids media company apps`. Sources: https://trademarks.justia.com/857/60/rumpus-85760253.html, https://trademarks.justia.com/882/96/rumpus-88296233.html, https://uspto.report/company/Rumpus-Ventures-L-L-C, https://kidscreen.com/2001/02/01/30711-20010201/, https://variety.com/2000/film/news/rumpus-toys-with-net-pix-1117779102/ |
| rumpus.com | CONFLICT-SIGNAL | DNS resolves (54.243.206.87). Web search finds no active site at the domain. Registered, not in visible use. | `getent hosts rumpus.com`; WebSearch `"rumpus.com"`. Source: https://en.wikipedia.org/wiki/Rumpus |
| rumpus.tv | CONFLICT-SIGNAL | DNS resolves to 76.223.54.146 and 13.248.169.48. The pattern matches registrar parking. Registered. | `getent hosts rumpus.tv` |
| YouTube handle | CONFLICT-SIGNAL (variant) | `@rumpusmusic` belongs to a house music DJ named RUMPUS. Exact `@rumpus` not confirmed. | WebSearch `youtube.com/@rumpus OR instagram.com/rumpus "rumpus" channel`. Source: https://itsrumpus.com/press/ |
| Instagram handle | CONFLICT-SIGNAL (variant) | `@itsrumpus` belongs to the same DJ. The Rumpus literary magazine also holds social presence. | Same search. Source: https://en.wikipedia.org/wiki/The_Rumpus |

Notes: the strongest kid-chant of the five. The prior kids entertainment company is the risk. If counsel finds that mark dead, Rumpus moves to first.

## 3. Pilot Light

| Check | Result | Evidence | Search run |
|---|---|---|---|
| USPTO trademark | CONFLICT-SIGNAL | PILOT LIGHT registered by Epiphany ELearning LLC for a mobile app (sleep and stress software, class 9). Pilotlight Films, a production company, uses the name for video production in commerce. | WebSearch `"Pilot Light" trademark USPTO entertainment television`. Sources: https://uspto.report/TM/99894780 and https://pilotlight.tv/ |
| pilotlight.com | CONFLICT-SIGNAL (for sale) | Search result title reads "This website is for sale." Registered and offered, price unknown. | WebSearch `"pilotlight.tv" OR "pilotlight.com"`. Source: https://www.pilotlight.com/ |
| pilotlight.tv | CONFLICT-SIGNAL | Live site for Pilotlight Films, a commercial and corporate video production company. | Same search; `getent hosts pilotlight.tv` resolves. Source: https://pilotlight.tv/ |
| YouTube handle | CONFLICT-SIGNAL | `@PilotLightFilms` and a channel named "Pilot Light TV" with a conversation series called "Unpacked." | WebSearch `youtube.com/@pilotlight OR instagram.com/pilotlight "pilot light" channel`. Sources: https://www.youtube.com/@PilotLightFilms and https://www.youtube.com/channel/UCzw7eJX08UpsZGeT_3JumJw/videos |
| Instagram handle | CONFLICT-SIGNAL (variants) | `@pilotlightknox` (music venue), `@_pilotlightband_`, `@pilotlight___`, `@pilotlightchefs`. | Same search. Source: https://www.instagram.com/pilotlightknox/ |

Notes: the best double meaning of the five and the worst screen. A video production company already trades under the name with a .tv domain. Counsel would need to clear against a live, same-field user.

## 4. Screen Door

| Check | Result | Evidence | Search run |
|---|---|---|---|
| USPTO trademark | CONFLICT-SIGNAL (same field) | Screen Door is a Canadian film and television production company founded in 1999 by Mary Young Leckie and Heather Haldane. Its productions aired on PBS and Hallmark in the US. No US registration was found by web search, but use in commerce in the same field is a risk. | WebSearch `"Screen Door" production company Canada Mary Young Leckie Heather Haldane` and `justia trademarks "SCREEN DOOR" class 41 entertainment production`. Sources: https://en.wikipedia.org/wiki/Screen_Door and http://screendoor.org/press/view/5 |
| screendoor.com | CONFLICT-SIGNAL | DNS resolves (3.131.150.69). Web search shows no live site at the exact domain. Registered. Related: screendoor.co is a venture capital platform, screendoors.com is a door maker. | `getent hosts screendoor.com`; WebSearch `"screendoor.com"`. Source: https://www.screendoor.co/ |
| screendoor.tv | CLEAR-SIGNAL (weak) | No DNS record. WebFetch returned ENOTFOUND. Not proof of availability. | `getent hosts screendoor.tv`; WebFetch https://screendoor.tv |
| YouTube handle | CLEAR-SIGNAL (weak) | No exact `@screendoor` found. "The Screen Door Guy" (installer) exists. | WebSearch `youtube.com/@screendoor OR instagram.com/screendoor "screen door" channel`. Source: https://www.youtube.com/channel/UCWeMbZ3ow_U-H5N1CJyBb0Q |
| Instagram handle | CONFLICT-SIGNAL (variants) | `@screendoor.ybor` (a microcinema), `@thescreendoorbrooklyn` (ice cream), `@screendoorasheville`, `@screendoorrestaurant`. Exact `@screendoor` not confirmed. | Same search. Source: https://www.instagram.com/screendoor.ybor/ |

Notes: a working production company in film and television is the one conflict that matters. The microcinema in Ybor City also sits in the moving-image field.

## 5. Lights Up

| Check | Result | Evidence | Search run |
|---|---|---|---|
| USPTO trademark | CONFLICT-SIGNAL | LIGHTS UP PRODUCTIONS registered in class 41 (Reg. 4742234, theater productions). LIGHT UP PRODUCTIONS registered in class 41 (Reg. 4876655, songwriting). LIGHTUP ENTERTAINMENT and LIGHT UP THE SKY also on file in entertainment. | WebSearch `"Lights Up" trademark USPTO entertainment`. Sources: https://trademarks.justia.com/862/93/lights-up-86293642.html, https://trademarks.justia.com/862/45/light-up-86245898.html, https://trademarks.justia.com/981/55/lightup-98155339.html |
| lightsup.com | CONFLICT-SIGNAL | DNS resolves (206.220.174.90). Registered. Content unknown. | `getent hosts lightsup.com`; WebSearch `"lightsup.com" OR "streetlights.com"` |
| lightsup.tv | CLEAR-SIGNAL (weak) | No DNS record. WebFetch returned ENOTFOUND. Not proof of availability. | `getent hosts lightsup.tv`; WebFetch https://lightsup.tv |
| YouTube handle | UNKNOWN | No exact `@lightsup` found. "Lightsup Online" channel exists. The phrase is also a well-known 2019 pop song title, which floods search. | WebSearch `youtube.com/@lightsup OR instagram.com/lightsup "lights up" channel`. Source: https://www.youtube.com/channel/UCgJkHhtPzcfGk_NLJaNqxeg |
| Instagram handle | CONFLICT-SIGNAL (variants) | `@lightsup.prod` (a production account), `@lightsuplighting`, `@lightsup_game`, `@lightsup.usa`. | Same search. Source: https://www.instagram.com/lightsup.prod/ |

Notes: two registered class 41 marks and a famous song title. The weakest screen of the five.

## Ranking

| Rank | Name | Trademark | .com | .tv | YouTube | Instagram | Brand strength |
|---|---|---|---|---|---|---|---|
| 1 | Streetlights | CLEAR (weak) | CONFLICT | CLEAR (weak) | CONFLICT (variants) | CONFLICT (variants) | High. Parent memory. Network-style. |
| 2 | Rumpus | UNKNOWN | CONFLICT | CONFLICT | CONFLICT (variant) | CONFLICT (variant) | Highest kid appeal. Prior kids brand is the risk. |
| 3 | Screen Door | CONFLICT (same field) | CONFLICT | CLEAR (weak) | CLEAR (weak) | CONFLICT (variants) | High image. Blocked by a working production company. |
| 4 | Pilot Light | CONFLICT | CONFLICT (for sale) | CONFLICT | CONFLICT | CONFLICT (variants) | Best double meaning. Worst screen. |
| 5 | Lights Up | CONFLICT (class 41) | CONFLICT | CLEAR (weak) | UNKNOWN | CONFLICT (variants) | Good symmetry with Lights Out. Two registered marks in class. |

## Recommendation: Streetlights

`COUNSEL_GATE CG-01`. Counsel clears the trademark before any filing, any public use, or any domain purchase beyond a defensive hold.

Streetlights is the recommendation because it is the only name of the five with no trademark hit in entertainment, video, or family content, and it carries the exact memory the parent persona holds. AUDIENCE.md section 2 says the Porch Parent was born 1981 to 1990 and recalls the night more than any plot. That parent also remembers the rule of that era: come home when the streetlights come on. The name turns the old signal to go inside into the new signal to sit down together. It is one word, two syllables, and a kid can chant it. It names a light, an evening, and a neighborhood without naming a porch. On a printed guide masthead it reads like a real publication. The domain field is the cost: streetlights.com belongs to a real estate developer, so the site would live on streetlights.tv or a phrase domain, and the handles would need a modifier. Rumpus is the runner-up and moves to first if counsel finds the prior kids entertainment mark dead and clears the pet-toy and font marks as non-confusing. Pilot Light, Screen Door, and Lights Up each collide with a working company in the same field and should not go to counsel unless the first two fail.

Provisional name for the site build: `Streetlights`, held in a single config constant per the Fork D note in `DECISIONS.md`. The owner picks at Fork D.
