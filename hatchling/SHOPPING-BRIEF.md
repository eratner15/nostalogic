# Shopping brief: Hatchling prototype hardware

Date: 2026-10-20. Prices and stock come from earlier checks; confirm them live.

## The job

Find the best device to prototype a talking pocket pet (like a Tamagotchi). Then
buy 2 to 3 units. The pet shows a cartoon face, listens through a microphone,
and talks back through a speaker. All software runs on the device (no cloud).

## Must have (reject a device that fails any of these)

1. ESP32-S3 chip with **8 MB PSRAM** (look for "N8R8", "R8", or "8MB PSRAM").
2. A **color screen** (round is best).
3. A **microphone** and a **speaker** (or a speaker amplifier with a speaker included).
4. A **rechargeable battery**: built in, or a battery connector with a charge circuit.
5. Charges and flashes over **USB-C**.
6. **No camera.**
7. **No extra radios** beyond Wi-Fi and Bluetooth: no Sub-GHz (CC1101), no LoRa.
8. In stock, and delivered within 7 days to the US.

## Nice to have (rank by these)

1. Small: keychain or palm size (under about 50 mm).
2. Battery already installed.
3. A finished case or shell.
4. Touch screen, buttons, or a knob.
5. Motion sensor (shake, tilt).
6. Under $40 a unit, tariff included.

## Candidates found so far

| Rank | Device | Where | Price seen | Screen | Mic + speaker | Battery | Size | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | **LilyGO T-Circle-S3 (V1.1)** | Amazon, LilyGO store, AliExpress | about $28 | 0.75" round touch, 160 x 160 | Yes, speaker on board (MAX98357A amp) | **Unclear on the base board.** LilyGO's "Infrared Expansion" board adds a battery and motion sensor; store link not found | 32 mm round, 17 mm tall | Cutest, smallest. 8 MB PSRAM, 16 MB flash. No user buttons (touch only). |
| 2 | **M5Stack StickS3 (K150)** | Mouser, part 170-K150 (912 in stock on 2026-10-19) | $21.50 + 30% US tariff | 1.14" rectangle, 135 x 240 | Yes, mic + 1 W speaker | **250 mAh, installed** | 48 x 24 x 15 mm, 20 g | Works on day 1. 8 MB PSRAM. 2 buttons + motion sensor. Has a case. |
| 3 | **Espressif EchoEar** | Amazon (about $55), AliExpress (about $40) | $40-55 | 1.85" round touch, 360 x 360 | Yes, 2 mics + 3 W speaker | Charge circuit; capacity not listed | Palm size | Made by the chip maker. 8 MB PSRAM. Check that a battery is in the box and that there is no camera. |
| 4 | **Waveshare ESP32-S3-Touch-AMOLED-1.75** (case version) | Waveshare, The Pi Hut | about £33 with case | 1.75" round AMOLED, 466 x 466 | Yes, 2 mics + 2 W speaker | Connector only; buy a battery | About 50 mm round | Best-looking screen. |
| 5 | **Waveshare ESP32-S3-Touch-LCD-1.85C (BOX)** | Waveshare | check | 1.85" round, 360 x 360 | Yes, 2 mics + speaker box | Optional battery | Puck | Good base for a silicone or plush cover. |

## Rejected (do not buy)

| Device | Reason |
|---|---|
| M5Stack Dial | No microphone, no speaker (buzzer only), no PSRAM |
| LilyGO T-Embed CC1101 | Sub-GHz radio hacking tool; mic/speaker not listed; sold out |
| Waveshare DualEye 1.28 | Two eye screens make it too wide for a keychain (keep for a later plush) |
| M5StickC PLUS2 | Older ESP32 chip; may be discontinued |
| M5Stack CoreS3 / StackChan | Has a camera; large; expensive |

## Questions to answer before you buy

1. **T-Circle-S3:** does the V1.1 base board charge a LiPo battery? Is a bundle with the Infrared Expansion board (battery) for sale? Is the speaker included in the box?
2. **EchoEar:** is a battery in the box? Is there a camera? What is the battery capacity?
3. **Any device:** the price with the US tariff and shipping, and the delivery date.

## What to buy (default if no better device turns up)

| Item | Qty |
|---|---|
| LilyGO T-Circle-S3 V1.1 (with the battery expansion, if sold) | 2 |
| M5Stack StickS3 (K150), Mouser | 2 |
| USB-C data cable (not charge-only) | 1 |

Budget: about $150 total. Ask before you spend more than $250.

## What to send back

For each device you checked: name, link, price with tariff and shipping, stock,
delivery date, and a yes / no / unknown for each "must have". Then your top pick
and why.
