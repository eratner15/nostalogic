# Companion Egg: Build, Contacts, Agents, Exit

Companion to `companion-egg-christmas-2026.md`. Written 2026-10-19.
Working name: **Hatchling** (placeholder).

## 1. Main point

1. **The exit has a recent comparable.** Spin Master agreed to buy Hapiko, the Stickerbox maker, in August 2026. Reports put the price near US$35 to 50 million (not disclosed officially). Stickerbox launched in late 2025 and sold out 13 times. A screen-free AI object with sell-outs got bought in about 10 months.
2. **The build is open, the brand is closed.** Publish the firmware, the shell files, and the pet model on Hugging Face and GitHub. Keep the name, the characters, and the species packs. Community makes the moat. The brand is the asset a buyer pays for.
3. **Agents run the operation. People sign, pay, solder, and send.** Claude agents draft, track, build software, and report. Evan approves every spend, contract, and outbound message.
4. **Sell-outs are the metric.** Every batch is small and numbered. Each sell-out is a data point for the buyer.

## 2. How to build it

### 2.1 System

```
 [Pet model]         [Firmware]            [Device]             [Web]
 3-5M params   --->  ESP32-S3, C/C++  ---> board + battery ---> landing page
 trained on HF       open source           + 3D shell           + browser twin
 open weights        GitHub                 numbered batch       (HF Space)
```

### 2.2 Workstreams

| # | Workstream | Output | Who does it |
|---|---|---|---|
| 1 | Pet model | Dataset, trained model, eval set, HF model card | Claude agent + HF compute |
| 2 | Firmware | Pet loop, sprites, model runtime, sleep, USB pack loader | Claude Code + 1 human embedded contractor |
| 3 | Hardware | Board choice, battery, BOM, assembly guide | Human contractor; agent tracks quotes |
| 4 | Shell | CAD, STL files, print farm orders | Human or agent-drafted CAD; print farm |
| 5 | Browser twin | Same pet in the browser (WebAssembly), on a Hugging Face Space | Claude Code |
| 6 | Store | Landing page, Stripe, waitlist, order export | Claude Code (this repo's Cloudflare stack) |
| 7 | Ops | Fulfillment, support inbox, returns | Agent drafts; human ships |
| 8 | Growth | Daily clip scripts, press list, community posts | Agent drafts; Evan posts |

### 2.3 The browser twin (the cheapest sales tool)

1. Compile the same pet engine and model to WebAssembly.
2. Host it as a Hugging Face Space and on the landing page.
3. Let people "adopt" a pet in the browser for free. Ask for an email to save it.
4. Offer: "Move your pet into a real egg." That is the sale.

This gives demand data before any hardware ships. It also makes the Hugging Face page a top-of-funnel channel.

### 2.4 Board candidates

| Board | Why | Check before you buy |
|---|---|---|
| Waveshare ESP32-S3-Touch-LCD-1.46 (ESP32-S3R8) | 8 MB PSRAM, 16 MB flash, round touch, IMU, battery charging | It has a microphone and a speaker on board. Stock for 310. |
| Waveshare ESP32-S3-Touch-LCD-1.85C V2 (ESP32-S3R8) | 8 MB PSRAM, 16 MB flash, round screen, battery charging | V2 (V1 was replaced) has **two** microphones; touch is an option; no IMU listed. Stock for 310. |
| Ruled out: Waveshare ESP32-S3-LCD-1.28 | Cheap, IMU, battery charging | 2 MB PSRAM (ESP32-S3R2): only the 260K model fits |
| Ruled out: M5Stack Dial | Finished shell, rotary ring | ESP32-S3FN8, 8 MB flash, no PSRAM listed |
| Seeed XIAO ESP32-S3 + round display | Small; Seeed offers agile manufacturing later | Battery fit inside your shell |
| LilyGO T-Watch S3 class | Finished wearable with battery | It has a microphone; firmware must keep it off. This weakens the "no mic" claim. |

Recommendation: buy 5 Waveshare 1.46" and 5 Waveshare 1.85C on 2026-10-21 (10 boards, matching the $400 prototype line in the Christmas plan; the Week 2 gate tests 5 of whichever is chosen). Both are ESP32-S3R8 boards with 8 MB PSRAM, which the model runtime needs. Both carry microphones (the 1.85C V2 has two): ask Waveshare whether every microphone can be left off the board for 310 units (Christmas plan, decision 6). On arrival, test each sample: no microphone may return audio. Shell work goes ahead for all units; the 50 Developer Edition units get a clear shell, quoted with the shell farms below. If none is quoted by Nov 2, the Developer Edition offer drops "clear shell" before preorders open.

## 3. Who to contact

Evan sends every first message. An agent drafts it in Gmail, and Evan reviews and sends.

### 3.1 Hardware and manufacturing

| Contact | Why | First ask |
|---|---|---|
| M5Stack (Espressif majority-owned since 2024) sales / OEM | Finished ESP32-S3 devices; custom print on shell; volume price | Not for 2026 (the Dial lists no PSRAM). Ask whether a round-screen device with 8 MB PSRAM is planned, for the 2027 run |
| Waveshare sales | Bare round-screen boards | Price and stock for 310 of one SKU; can every microphone (two on the 1.85C V2) be left off the board |
| Seeed Studio (Fusion, agile manufacturing) | Path to a custom board in 2027 | Process and minimums for a custom ESP32-S3 board |
| Espressif | Chip maker; partner programs and press | Partner listing; co-marketing on "LLM on ESP32-S3" |
| Slant 3D | US print farm with an order API | 310 shells (including 50 clear), 5-day turn, price per part |
| Craftcloud or JLC3DP | Second quote for shells | Same as above |
| Battery supplier with UN38.3 papers | Legal battery shipping | 310 cells with test summary |

### 3.2 Software, model, and community

| Contact | Why | First ask |
|---|---|---|
| Hugging Face (community and hardware team; they own Pollen Robotics and sell Reachy Mini) | Distribution, compute, and a possible buyer | Feature the open model and Space; community grant |
| Authors of the open ESP32 LLM projects (esp32-llm, esp32-ai) | Fastest path to a tuned runtime | Paid contract to port and tune; credit in the repo |
| r/esp32, r/LocalLLaMA, r/tamagotchi moderators | Permission to post the build log | Read rules; ask if a launch post is allowed |

### 3.3 Selling and shipping

| Contact | Why | First ask |
|---|---|---|
| Stripe | Deposits and preorders | Account (the Stripe connector in this session needs authorization in claude.ai settings) |
| ShipBob or ShipMonk | Fulfillment if volume passes about 500 | Quote for 1,000 units, Q1 2027 |
| Crowd Supply | Hardware crowdfunding with Mouser fulfillment; maker audience | Q1 2027 campaign for the Developer Edition |
| Kickstarter | Consumer campaign for batch 3 | Q2 2027 launch slot (Q1 is the Crowd Supply Developer Edition) |

### 3.4 Legal, safety, and money

| Contact | Why | First ask |
|---|---|---|
| Trademark attorney | Name clearance and filing | Clear 3 names; file the winner |
| Accredited FCC/EMC test lab | The finished device needs its own test and authorization; a pre-certified module is not enough | Price, lead time, and which authorization applies; a slot by Oct 27 |
| Product liability insurer | Required by most retailers and fulfillment firms | Quote for $1M cover, consumer electronics |
| Product-safety counsel or a CPSC-accepted lab | Classification: adults-only marketing does not settle whether this is a children's product | A written classification by Nov 2; if it is a children's product, ASTM F963 and CPSIA testing scope, cost and lead time |

### 3.5 Buyers (for later, not now)

| Buyer | Why it fits |
|---|---|
| Spin Master | Bought Hapiko (Stickerbox) in 2026; building an AI toy line |
| Mattel | Partnership with OpenAI since June 2025 |
| Bandai Namco | Owns Tamagotchi; an offline AI pet extends the brand |
| Hasbro, Jazwares, Basic Fun, Moose Toys | Toy majors and nostalgia specialists |
| Hugging Face | Bought Pollen Robotics in 2025; sells open AI hardware |
| Espressif / M5Stack | A flagship consumer device for the chip |

Do not contact buyers before 2 sell-outs. Contact them through a toy-industry M&A adviser, not cold.

## 4. The agent team

### 4.1 Which agent drives

This repo already uses **Claude Managed Agents** (`agents/`, `environments/`, `memory_stores/`, `deployments/`). Use the same pattern. One stack is cheaper to run and audit. Using a second vendor's agent (for example Grok) is possible, but it adds a second set of keys, logs, and rules. Do that only for a job one stack cannot do.

### 4.2 Roster

| Agent | Cadence | Job | Can do alone | Needs Evan |
|---|---|---|---|---|
| **Chief of Staff** (the driver) | Daily 08:00 | Reads all agent reports and the metrics. Writes a one-page brief: yesterday, today, blocked, decisions. | Assign tasks to other agents | Every decision on the list |
| **Builder** (Claude Code on GitHub) | On issue | Firmware, browser twin, landing page, tests. Opens PRs. | Write code, open PRs, run CI | Merge to main, deploy |
| **Model Trainer** | On demand | Builds the dataset, trains, evals, writes the HF model card | Train and eval | Publish weights |
| **Procurement** | Daily | Tracks quotes, stock, lead times, and part orders in one ledger | Draft supplier emails, compare quotes | Send emails, pay, sign |
| **Growth** | Daily | Writes 3 clip scripts, 1 community post, and press pitches. Tracks views and signups. | Draft | Post, send |
| **Support** | Hourly once orders ship | Sorts the inbox. Drafts replies. Flags refunds. | Draft replies | Send, refund |
| **Finance** | Weekly | Reads Stripe exports. Reports cash, unit cost, and margin. | Report | Any payment |
| **Zeitgeist Scout** (exists on this branch) | Weekly | Tracks the "AI companion egg" trend and competitors | Report | n/a |

### 4.3 Rules for every agent

1. A person approves every spend, contract, publish, and outbound message. This is the rule already in `docs/ZEITGEIST-MASTER-PROMPT.md`.
2. Agents never pose as a person. Drafts go out under Evan's name only after Evan reads them.
3. Each agent reads its rules from a read-only memory store at the start of each run. If it cannot read them, it stops.
4. Each agent has a cost cap per run.
5. All agent output goes to one place: the daily brief and a decision log in this repo.

### 4.4 What agents cannot do

- Solder, flash, pack, or ship a unit.
- Sign a supplier contract or a purchase order.
- Pass a lab test.

Plan for one human embedded contractor (part-time, 6 weeks) and one person for packing and shipping in December. The contractor is outside the $2,000 two-week cap: get a quote first, and hire only after Evan approves it or names the funding (Christmas plan, section 4.4).

## 5. Open-source plan ("Hugging Face style")

| Asset | Where | License | Why |
|---|---|---|---|
| Pet model weights + model card | Hugging Face model repo | Apache-2.0 | Press, trust, community fine-tunes |
| Dialogue dataset (filtered) | Hugging Face dataset repo | CC-BY-4.0 | Others build on it and cite you |
| Browser twin | Hugging Face Space | Apache-2.0 | Free top-of-funnel |
| Firmware | GitHub | Apache-2.0 | Developer Edition buyers hack it |
| Shell STL files | GitHub / Printables | CC-BY-NC | Makers print their own; you keep commercial rights |
| **Name, characters, art, species packs** | Closed | All rights reserved | **This is what a buyer buys** |

Community loop: makers make new species. The best ones become paid packs. The maker gets a revenue share. This gives a content pipeline with no staff.

## 6. Road to a sale

| Stage | When | Units | Proof a buyer wants |
|---|---|---|---|
| First batch (Founders, Developer, gift-box eggs) | Dec 2026 | 300 | Sells out; review quotes; open-source traction |
| Developer Edition on Crowd Supply | Q1 2027 | 1,000 to 3,000 | Maker community; HF downloads |
| Kickstarter, custom board, true egg shell | Q2 2027 | 5,000 to 15,000 | Consumer demand at scale; unit cost under $25 |
| Amazon + one retail test | Q3 2027 | 10,000+ | Sell-through at a real retailer |
| Holiday 2027 | Q4 2027 | 25,000+ | Second Christmas; repeat buyers of species packs |
| Sale process | Q4 2027 to Q1 2028 | n/a | Revenue, sell-outs, community, brand, clean IP |

What a buyer checks, so keep it clean from day one:

1. Clean IP. Every contractor signs an IP assignment. No Bandai trade dress.
2. Clean data. No child data. No voice data. (The no-mic design helps here.)
3. Clean numbers. Stripe as the single source. Monthly close by the Finance agent.
4. A brand with fans. Sell-outs, waitlists, and community species.

## 7. Next 72 hours

1. Evan: approve the roster and the human-approval rule.
2. Evan: authorize the Stripe connector in claude.ai settings.
3. Claude: write the 7 agent definitions in `agents/` with memory stores and schedules, as for the Zeitgeist Scout.
4. Claude: draft supplier emails to M5Stack, Waveshare, Slant 3D, and one battery supplier as Gmail drafts.
5. Evan: order the 10 sample boards (5 of each).
6. Claude: start the Hugging Face model repo and the browser twin.
7. Evan: post the contractor brief that Claude drafts and get quotes. Hire only after approving a quote; it is outside the $2,000 cap.

## Sources

- Spin Master and Hapiko: [CTV News](https://www.ctvnews.ca/business/article/spin-master-snaps-up-viral-sticker-maker-toy-hapiko/), [Infor Capital](https://inforcapital.com/news/spin-master-to-acquire-hapiko-after-ai-powered-stickerbox-sells-out-13-times/)
- Mattel and OpenAI: [RTE](https://rte.ie/news/business/2025/0612/1518159-barbie-maker-mattel-teams-up-with-openai/)
- Hugging Face, Pollen, Reachy Mini: [Hugging Face blog](https://huggingface.co/blog/reachy-mini), [TechCrunch](https://techcrunch.com/podcast/hugging-face-bets-on-cute-robots-to-bring-open-source-ai-to-life)
- Espressif and M5Stack: [Espressif](https://www.espressif.com/en/news/Espressif_Acquires_M5Stack), [Hackster on M5Dial](https://hackster.io/news/m5stack-launches-the-m5dial-a-swish-iot-rotary-encoder-with-a-built-in-color-touchscreen-display-438513c4e52c), [Adafruit](https://www.adafruit.com/product/5966)
- Slant 3D API: [Fabbaloo](https://www.fabbaloo.com/news/slant-3d-launches-api-for-direct-access-to-print-farms)
