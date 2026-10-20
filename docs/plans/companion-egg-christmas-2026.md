# Companion Egg: Christmas 2026 Plan

Working name: **Hatchling** (placeholder; needs a trademark check).
Written 2026-10-19. Christmas is 67 days away. Thanksgiving is 2026-11-26.

## 1. Decision first

1. Ship a limited first batch of 300 units for Christmas: numbered **Founders Edition** eggs, up to 50 Developer Edition, and gift-box eggs, all inside the 300. Do not try for retail shelves in 2026.
2. Sell it to **adults** (the 1997 Tamagotchi kids, now 35 to 45). Do not sell to children this year.
3. Run a **tiny language model on the device**. Use no camera, no cloud, and no account. Both boards with enough memory carry a microphone; it is left off the board or switched off in firmware (decision 6 in section 8).
4. Open a waitlist and a refundable $25 deposit this week (Oct 24). Full $129 preorders open on Nov 9, after the prototype gates. Let preorder volume decide the batch size.
5. Sell a **gift box with a hatch certificate** as the hedge. If units slip, the gift still arrives by 2026-12-24.

The pitch in one line: *"The 1997 virtual pet, grown up. It thinks for itself, and it never talks to the internet."*

## 2. What the branch says about this idea

The branch `claude/zeitgeist-master-prompt` adds the Zeitgeist master prompt, the Zeitgeist Scout agent, and the first report.

- The report scores "90s toy nostalgia (Tamagotchi at 30)" at **65, WATCH** (Lane B).
- The report says a 1996 anniversary product is "a NostalDamus product, not a book-line product." This plan agrees.
- NostalDamus scores Tamagotchi (1996) at originalImpact 85, modernRelevance 70, socialBuzz 55. Its core audience note says: "adults buying re-releases and a Gen Z drawn to low-stakes digital care as a phone antidote." That is the buyer for this plan.

I re-scored the hardware version with the branch's own six factors (`agent-seed/zeitgeist/preferences/scoring.md`). These are reads, not facts.

| Factor | Weight | Score | Reason |
|---|---|---|---|
| Momentum | 25% | 70 | 30th anniversary year; Bandai events through November |
| Stage | 15% | 70 | Rising |
| Audience reach | 20% | 60 | Buyer is reachable on TikTok, Reddit, and maker channels; no overlap with the mahjong list |
| Speed to product | 15% | 30 | Hardware; 9 weeks is tight |
| Margin | 15% | 40 | Inventory and shipping; personality packs help |
| Defensibility | 10% | 55 | Own character, own trained model, NostalDamus timing data |
| **Total** | | **56** | **WATCH** |

The model says WATCH, not GO. Speed and margin pull it down. This plan raises both: preorders remove inventory risk, and off-the-shelf boards remove the custom hardware step.

### Branch review notes

1. The branch adds docs and agent config only. It changes no app code. Nothing in it blocks this plan.
2. `scripts/zeitgeist-setup.sh` is not run, and `ant apply --dry-run` is not run. The Scout is not live.
3. The report could not read the Amazon pages. The "#2" rank is from a screenshot only. Do not use it in press copy until a person confirms it on the live page.
4. The report has no "change since last run" data yet. The second run fills it.
5. The ledger keeps Tamagotchi at 65. After this plan, add a ledger row "AI companion egg" so the Scout tracks it weekly.

## 3. The product

### 3.1 What it is

A palm-size device with a round color touch screen and simple controls: swipe on the touch screen, plus side buttons. The board is chosen on Tue Oct 27, after the samples ordered on Oct 21 are tested (Waveshare 1.46" or 1.85C, section 3.4); firmware v0 is written against an input layer that takes either, and the shell CAD waits for Oct 27. A small pet lives on it. The pet eats, sleeps, grows, and gets bored, as in 1997. The new part: the pet **writes its own short thoughts** with a language model that runs on the chip.

Examples of pet output: "I dreamed the moon was a cracker." "You were gone a long time. I counted clouds."

The pet does not hold open chats. It speaks in short lines. This keeps the model small, keeps the output safe, and keeps the "pet" feel.

### 3.2 Why "local" is the product, not a limit

- **Privacy.** No working microphone (removed at the factory, or switched off in firmware) and no network means no data to leak. This is the answer to the FTC and Senate scrutiny of AI toys in 2026.
- **It works forever.** No server to shut down. Buyers remember pets that died when an app closed.
- **Story.** "An AI that lives in an egg" is a press hook. Makers proved in 2025-2026 that small models run on a $10 chip.

### 3.3 The "Stickerbox" model

Stickerbox (an AI sticker printer for kids) shows the shape: a screen-free AI object, near $100 to $130, sold on Amazon and direct, with paid refills. Hatchling copies the business shape, not the product:

| Stickerbox | Hatchling |
|---|---|
| Device, about $130 | Founders Edition, $129 |
| Paper refills | **Personality packs**: new species, new voice models, seasonal events ($9 to $15) |
| Kids, parents buy | Adults buy for themselves and as gifts |

### 3.4 Hardware (no custom board in 2026)

Use an off-the-shelf **ESP32-S3** board with a round display, battery charging, and **8 MB PSRAM** (the model runtime needs it). Only boards built on the ESP32-S3R8 qualify. The Waveshare ESP32-S3-LCD-1.28 has 2 MB PSRAM and the M5Dial lists no PSRAM, so neither can run the model. Waveshare and similar makers sell these boards near $20 to $30 retail. Order samples after a stock check on 2026-10-21, and pick the board on 2026-10-27 after testing them.

| Part | Est. unit cost at 310 units |
|---|---|
| ESP32-S3R8 board, round touch screen (Waveshare 1.46" or 1.85C), 8 MB PSRAM, 16 MB flash | $18 to $24 |
| LiPo battery, 400 to 600 mAh | $3 to $5 |
| Shell (3D print or resin, plus lanyard) | $6 to $10 |
| Buttons, magnet, small parts | $2 |
| Gift box, insert, hatch card | $4 to $6 |
| Assembly, flash, QA (contract or in-house) | $6 to $10 |
| **Total landed cost** | **$39 to $57** |

All figures are estimates. Confirm with three quotes before 2026-10-23.

**About "the shells have been around for years":** stock egg keychain shells fit a coin cell and a 1-inch mono LCD. They do not fit an ESP32-S3 board with a battery. Use a slightly larger "pebble" shell for 2026. Commission a 3D-print shop or a resin-cast shop for 310 units. Design a true egg shell with a custom board for 2027 retail.

### 3.5 The model on the chip

Public ESP32-S3 projects report these speeds (self-reported, not controlled tests):

- 260K parameters: about 19 to 30 tokens per second.
- 3.3M parameters, INT8: about 12 tokens per second.
- 28.9M parameters: about 10 to 23 tokens per second after tuning.

Plan:

1. Train a 3M to 5M parameter model, INT8, on a pet-dialogue dataset. The esp32-llm project runs a 3.3M INT8 model at about 12 tokens per second and needs 8 MB PSRAM for it; 5M is untested and is tried on the device in Week 1. Plan no larger model for 2026. Generate the dataset with a large model, then filter it.
2. Condition each output on pet state (hunger, mood, age, time of day, species).
3. Cap each thought at 20 tokens. One thought takes about 1 to 2 seconds.
4. Add a word blocklist on the output. Add a fallback to scripted lines if the filter trips.
5. Ship the model in flash. Ship personality packs as new model weights plus sprites.

Model gate: a 200-line human review of model output runs on Sun Nov 8, before full preorders open and before the batch order. If it fails, preorders open for the scripted-lines pet, and the preorder page says so before anyone pays: the model "hatches" in a January update over USB, and any buyer can cancel for a full refund until the batch order on Nov 15. If the model passes Nov 8 but the Nov 20 freeze candidate fails its review, ship the Nov 8 model that already passed. The freeze can only improve on what buyers were sold, so no feature is lost and no refund round follows the batch order.

## 4. Business plan

### 4.1 Buyer

- **Primary:** adults 32 to 45 who owned a virtual pet in 1996 to 1999. They buy anniversary re-releases now. They buy for themselves and for siblings and partners.
- **Secondary:** makers and AI developers who want a hackable AI object. Sell them an open firmware option.
- **Not in 2026:** children under 13. The updated COPPA rule took effect 2026-04-22. The FTC studies AI companion products. A child product needs legal review, and 9 weeks is too short.

### 4.2 Offers and prices

| Offer | Price | Ships | Notes |
|---|---|---|---|
| Founders Edition (numbered within the 300-unit batch) | $129 | Dec 8 to Dec 15 | Includes 2 species packs |
| Gift box (certificate + sticker + egg ships in January) | $99 | By Dec 18 | The Christmas hedge. A gift box paid by Nov 15 reserves one egg inside the 300-unit batch (not extra hardware); its cash counts toward the batch gate, and its egg ships in January from that batch. A gift box sold after Nov 15 gets its certificate by Dec 18 and its egg from the February second hatch |
| Developer Edition (open firmware, clear shell) | $149 | Dec 8 to Dec 15 | Limit 50, counted inside the 300-unit batch (not extra hardware); the larger Developer Edition run is the Q1 2027 Crowd Supply campaign. The clear shell for these 50 is part of the shell quotes; if no clear shell is quoted by Nov 2, the offer drops "clear shell" before preorders open on Nov 9 |
| Personality pack | $12 | Digital, USB install | From January |
| Refundable deposit (Oct 24 to Oct 30) | $25 | n/a | Measures demand; stays open through the Oct 30 go/no-go. On Nov 9 each depositor gets a preorder link for the balance ($104 for Founders), with the $25 credited, never charged twice. A depositor who does not convert by Nov 15, when Christmas preorders close, gets the $25 back in full. Until then every deposit is a refund liability, not batch cash |

### 4.3 Unit economics (Founders Edition)

| Line | Amount |
|---|---|
| Price | $129 |
| Landed cost (high estimate) | -$57 |
| Fulfillment and shipping (US, flat) | -$12 |
| Payment fees (about 3%) | -$4 |
| Paid ads, if used (target cost per sale) | -$20 |
| **Contribution per unit** | **about $36 with ads, $56 without** |

Contribution depends on the mix, because all three offers share the 300 slots. At the high cost estimate, each order contributes: Founders $36 with ads or $56 without; Developer $56 or $76; gift box $7 or $27 (before the December certificate mailing). 250 Founders and 50 Developer give about $11.8k to $17.8k; 300 gift boxes give only $2.1k to $8.1k. Watch the mix as orders arrive. That is not the prize. The prize is a **buyer list of 300 people who paid** and proof for a 2027 retail run.

### 4.4 Startup cost

| Item | Estimate |
|---|---|
| 10 prototype boards and parts | $400 |
| Shell design and 10 test prints | $600 |
| Model training compute | $200 to $500 |
| Landing page, domain, Stripe | $50 |
| Embedded contractor (part-time, 6 weeks) | quote first; outside the cap below |
| FCC/EMC lab test and authorization | quote first; outside the cap below |
| Trademark knockout search | $0 to $300 |
| Product liability insurance quote | quote only |
| **Total before batch order** | **about $1,500 to $2,000, not counting the contractor or the FCC test** |

The contractor and the FCC test are each approved on their own quote. Get the quote before any hire; Evan approves it or names the funding in writing.

The batch order (at most 310 units built for 300 sold; at $39 to $57 landed, a full 310 costs about $12.1k to $17.7k) is paid from preorder cash. The 10 spare units cover the QA failures the Week 6 gate allows (under 3% of 310 is 9 units or fewer). Size the batch to paid orders, never to cash: build = paid orders / 0.97, rounded up, at most 310, even if the cash would buy more. Do not order the batch until collected preorder cash covers the whole order, plus $12 shipping and about 3% payment fees on every paid order, plus 10% for refunds. If preorders cover less than that by the order date, cut the batch to the number of units the cash covers, or name another source of funds in writing before ordering. A cut batch keeps the QA buffer: sell at most 97% of the units built, rounded down (build = sale cap / 0.97, rounded up).

### 4.5 Risks

| Risk | Control |
|---|---|
| Board out of stock | Name two boards that use the same chip; order samples of both on 2026-10-21 |
| Shell late | Use a 3D-print farm with 5-day turns; resin is a later option |
| Model output is odd or rude | Short outputs, blocklist, scripted fallback; 200-line human review on Nov 8, before preorders and the batch order, repeated on the freeze candidate |
| Bandai trademark or trade dress | Own name, own character, no egg-plus-three-buttons copy, no "Tamagotchi" in ads |
| Lithium battery shipping | Buy cells with UN38.3 papers; ship ground with the right label |
| FCC | A pre-certified module is not enough: the finished device needs its own EMC test at an accredited lab and the FCC authorization the lab advises. Book the lab by Oct 27 on the chosen board. Do not open $129 preorders until the authorization is done; until then, take only refundable deposits. Deposits and any ad for them are a conditional sale under 47 CFR 2.803(c)(2)(i), so the deposit page must prominently say: the device is subject to FCC rules and delivery depends on completing FCC authorization; FCC rules do not address consumer protection, contract or other law; and if authorization fails, every deposit is refunded in full. Keep ownership of every unit until delivery and keep records of each deposit for 60 months. If it is not done by Nov 9, preorders wait and the Christmas ship dates move |
| Children's-product classification | Adults-only marketing does not settle it: the CPSC weighs foreseeable use, appeal and play value. Ask product-safety counsel or a CPSC-accepted lab for a classification by Nov 2. If it is a children's product, preorders wait for third-party testing and a Children's Product Certificate, and the Christmas dates move |
| Radios on the board | Both boards have 2.4 GHz Wi-Fi and Bluetooth. Shipping firmware never starts either radio; QA checks each unit with a phone scan (no Wi-Fi network, no BLE advertisement) before "no network" appears in any copy |
| Too few preorders | Refund deposits; keep the gift-box list; move to a 2027 Kickstarter |
| Too many preorders | Cap at 300, Founders, Developer and gift-box eggs together; open a numbered "second hatch" for February |

## 5. Go-to-market

### 5.1 Positioning

- Category: "the first offline AI pet."
- Proof points: microphone removed or switched off (per decision 6), no cloud, no account, works forever.
- Tone: warm, odd, a little funny. The pet's lines are the ads.

### 5.2 Channels, in order of cost

1. **Short video of the pet's thoughts.** One clip a day on TikTok, Reels, and Shorts. Each clip shows one odd line. Cost: time only.
2. **Reddit and maker forums.** Post the build log in r/esp32, r/LocalLLaMA, r/tamagotchi (read each sub's rules first; no ads where rules ban them). The "LLM on a $10 chip" angle already gets press.
3. **Hacker News "Show HN"** for the Developer Edition and the open firmware.
4. **Press list of 20.** Gadget and toy writers who covered Stickerbox, Tamagotchi at 30, and "LLM on a microcontroller." Pitch the privacy angle.
5. **NostalDamus.** Put a "1996: Tamagotchi turns 30" brief on the site. Link to the preorder page. Use the scoring model as the "why now" story.
6. **Event timing.** Bandai holds a free Times Square event on 2026-11-22. The Japan anniversary is 2026-11-23. Post content that week. Do not use their brand or attend as a vendor.
7. **Paid ads (only if organic works).** Start Black Friday week with $50/day on Meta. Stop if cost per sale goes over $25.

### 5.3 Launch dates

| Date | Moment |
|---|---|
| 2026-10-24 | Waitlist and $25 deposits open |
| 2026-11-09 | Full preorders open ($129) |
| 2026-11-22 | Anniversary week content push |
| 2026-11-15 | Christmas preorders close; the batch size locks to paid orders |
| 2026-11-27 | Black Friday: gift boxes (certificate by Dec 18, egg in February) and second-hatch preorders |
| 2026-12-15 | Last ship date for Founders Edition |
| 2026-12-18 | Last ship date for gift boxes |

## 6. Work backwards from Christmas

| Week | Dates | Goal | Gate |
|---|---|---|---|
| 0 | Oct 19 to Oct 25 | Prototype v0, name, deposits page live | 50 deposits by Oct 30, or rethink |
| 1 | Oct 26 to Nov 1 | Board chosen; first trained model on device; shell v1 | Model runs above 8 tokens/s |
| 2 | Nov 2 to Nov 8 | 5 working units of the chosen board; shell v2; quotes signed; FCC/EMC test done | 5 units of the chosen board pass a 48-hour battery test; 200-line output review passes, or preorders open on the scripted fallback (section 3.5); FCC authorization in hand, or preorders wait |
| 3 | Nov 9 to Nov 15 | Preorders open; Christmas preorders close Nov 15; order parts for paid orders / 0.97, rounded up, at most 310 | Preorder cash covers the full batch cost, shipping and fees on every paid order, plus 10%, or the batch is cut to match |
| 4 | Nov 16 to Nov 22 | Firmware freeze candidate; packaging printed | 200-line output review repeated on the freeze candidate passes |
| 5 | Nov 23 to Nov 29 | Black Friday; parts arrive | All parts in hand by Nov 30 |
| 6 | Nov 30 to Dec 6 | Assembly and flash, the ordered batch (at most 310) | QA fail rate under 3%, so every paid order has a passing unit; every unit passes the no-radio and no-microphone checks |
| 7 | Dec 7 to Dec 13 | Ship Founders units | 100% shipped by Dec 15 |
| 8 | Dec 14 to Dec 20 | Ship gift boxes; support | Gift boxes out by Dec 18 |

## 7. This week (Oct 19 to Oct 25)

Each step has an owner. "Claude" means a Claude session can do the step. "Evan" means a person must do it.

### Monday Oct 19
1. Evan: approve this plan, the adult-only buyer, and the $129 price.
2. Claude: make a list of 10 candidate names. Run a USPTO knockout search for each.

### Tuesday Oct 20
3. Evan: pick a name.
4. Evan: buy the domain.
5. Claude: build the landing page in this repo (Next.js on the existing Cloudflare Worker) with a waitlist and a Stripe deposit link. The deposit page carries the three FCC conditional-sale notices from the FCC risk row before it goes live.
6. Claude: write the pet-dialogue spec (species, states, 500 seed lines, banned topics).

### Wednesday Oct 21
7. Evan: order 2 candidate ESP32-S3 round-screen boards (5 of each) with next-day shipping.
8. Claude: generate the training dataset (target 200k short lines). Filter it.
9. Claude: request quotes from three 3D-print farms for 310 shells.

### Thursday Oct 22
10. Claude: train model v0 (3.3M parameters, INT8; try 5M only if 3.3M runs above 8 tokens/s). Export it in the format the ESP32 runtime needs.
11. Claude: write firmware v0: pet loop, sprites, an input layer for the touch screen and side buttons (the board is chosen Oct 27), sleep mode, model call. Wi-Fi and Bluetooth are never started.
12. Evan: set up Stripe. Create the $25 refundable deposit product.

### Friday Oct 23
13. Evan: flash the board when it arrives. Record the first 30-second video of a real thought on the screen.
14. Claude: write the press pitch and the 20-name press list.
15. Evan: get a product liability insurance quote and a battery shipping quote.

### Saturday Oct 24
16. Evan: publish the landing page.
17. Evan: post the first video and the Reddit build log.
18. Evan: add "AI companion egg" to the Zeitgeist trend ledger.

### Sunday Oct 25
19. Evan and Claude: review deposits, waitlist count, and video views. This is a progress check, not the decision: deposits opened only the day before.
20. The go/no-go is on Friday Oct 30, as the schedule says: if deposits are 50 or more by then, continue. If they are under 50, cap Christmas sales at 100 (the build still follows paid orders / 0.97 on Nov 15) or move to a January Kickstarter.

"By end of this week" means: a working prototype on video, a live deposit page, and a demand number. A shipped product is not possible this week.

## 8. Decisions that need Evan

1. Adults only for 2026: yes or no.
2. Founders price: $129 (recommended) or $149.
3. Name, after the trademark search.
4. Spend cap for Week 0 and Week 1: $2,000 recommended, not counting the embedded contractor or the FCC/EMC test, which Evan approves each on its own quote.
5. Batch size: decided on 2026-11-15 by preorder count.
6. Microphones: ask Waveshare to leave every microphone off the board for 310 units (the 1.85C V2 has two; recommended, keeps "no microphone" true), or keep all of them off in firmware, verified on each sample, and say "microphones switched off" in all copy.

## 9. Not confirmed

- I found no source for the OpenAI DevDay Game Boy gift. The plan does not depend on it.
- Stickerbox prices come from retail listings and reviews, not the maker.
- Board prices and all costs are estimates. Get quotes.
- ESP32-S3 model speeds are self-reported by open-source projects.

## Sources

- Stickerbox price and refills: [Tom's Guide](https://www.tomsguide.com/ai/this-viral-ai-toy-that-gets-kids-off-screens-is-finally-20-percent-off-for-prime-day), [Yanko Design](https://www.yankodesign.com/2025/12/05/stickerbox-kids-say-an-idea-ai-prints-it-as-a-sticker-in-seconds/)
- LLMs on ESP32-S3: [Hackster](https://www.hackster.io/news/microcontrollers-telling-micro-stories-0ff88720278c), [InsiderLLM](https://insiderllm.com/guides/llm-on-microcontroller-esp32-s3/), [The Register](https://assets.theregister.com/2026/08/04/202614/), [doryiii/esp32-llm](https://github.com/doryiii/esp32-llm)
- Board memory: [Waveshare ESP32-S3-LCD-1.28 (2 MB PSRAM)](https://docs.waveshare.com/ESP32-S3-LCD-1.28), [M5Dial (ESP32-S3FN8, no PSRAM listed)](https://docs.m5stack.com/en/core/M5Dial), [Waveshare ESP32-S3-Touch-LCD-1.46 (ESP32-S3R8, 8 MB PSRAM, mic)](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.46), [Waveshare ESP32-S3-Touch-LCD-1.85C (ESP32-S3R8, 8 MB PSRAM, V2 has two mics)](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.85C)
- ESP32 pet with local models: [CircuitDigest](https://circuitdigest.com/news/esp32-based-ai-pet-gets-sick-if-you-doomscroll-while-android-handles-local-llms-stt-and-tts-offline)
- AI toy rules: [TechRepublic](https://www.techrepublic.com/de/article/news-ai-toys-privacy-risks/), [Sen. Duckworth release](https://www.duckworth.senate.gov/news/press-releases/duckworth-gillibrand-demand-trump-administration-protect-our-children-from-risky-age-inappropriate-ai-toys), [MediaLaws](https://www.medialaws.eu/playing-by-the-rules-governing-ai-toys-in-the-european-union-and-the-united-states/)
- Tamagotchi at 30: [License Global](https://www.licenseglobal.com/entertainment/tamagotchi-celebrates-30-years-with-launches-and-events-in-the-u-s-), [Hoodline, Times Square Nov 22](https://hoodline.com/2026/10/tamagotchi-floods-times-square-nov-22-for-free-30th-birthday-bash/), [CP24](https://www.cp24.com/news/canada/2026/01/11/why-are-people-still-playing-with-tamagotchis/)
