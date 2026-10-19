# Hatchling hardware: what to order, how to flash, what to test

Checked 2026-10-19. Prices and stock change; confirm them on the order page.

## Decision

Build the prototype on the **M5Stack Dial v1.1** (SKU K130-V11). Order the
**Waveshare ESP32-S3-Touch-LCD-1.28-B** as the backup.

The Dial is a finished product, not a bare board:

- a plastic shell, 51 x 51 x 32 mm, 46 g;
- a 1.28" round touch screen (240 x 240);
- a turning ring around the screen and a press button under it;
- a buzzer;
- an NFC/RFID reader (13.56 MHz) for future "food cards" and species cards;
- a battery socket with a charge circuit (no battery included);
- **no microphone and no camera**, so the "no mic" promise holds.

The firmware in `firmware/m5dial/` already builds for it.

## Order list (prototype)

| Item | Qty | Where | Price (each, list) | Why |
|---|---|---|---|---|
| M5Stack Dial v1.1 (K130-V11) | 3 | Mouser US (170-K130-V11), M5Stack store, Adafruit | about $35 at Mouser; $49.95 at Adafruit | Main prototype |
| Waveshare ESP32-S3-Touch-LCD-1.28-B (SKU 26959) | 2 | waveshare.com | $26.99 | Backup; has 2 MB PSRAM, metal case, motion sensor |
| 3.7 V LiPo, 1.25 mm 2-pin plug, about 300-500 mAh, flat | 4 | Adafruit, Amazon | $6-10 | The Dial and Waveshare ship with no battery |
| USB-C data cable | 2 | any | $5 | For flashing (a charge-only cable will not work) |
| NTAG215 NFC stickers | 1 pack | Amazon | $10 | To test card features later |

Prototype total: about $200.

Before you order batteries, check the plug's polarity against the Dial
"battery connector" datasheet. Plug polarity is not standard across sellers.
The space inside the Dial is not documented. Open one Dial and measure before
you order 300 batteries.

## Why not the others

| Device | Reason |
|---|---|
| LilyGO T-Display-S3 | Good chip (8 MB PSRAM), but a rectangular bar shape and a thin shell |
| LilyGO T-Watch S3 | Has a microphone |
| M5Stack Core S3 | Has a camera and a microphone; too big |
| Stock egg keychain shells | Fit a coin cell and a 1" mono LCD only |

## The Dial has no PSRAM. Why the model still fits

The Dial's ESP32-S3FN8 has 8 MB flash and 512 KB RAM, and no PSRAM.

- The model weights are int8 and total 0.88 MB. They sit in flash as a
  `const` array. The chip reads them through its flash cache. No copy to RAM.
- Working memory (mostly the attention cache) is about 170 KB of RAM.
- Firmware build today: 1.81 MB of 3.3 MB app flash (54%), 52 KB of static RAM.

Speed is the open question. Flash is slower than PSRAM. Measure it on day 1 (below).
If it is too slow, there are three fixes, in order:

1. Shorten thoughts (fewer tokens).
2. Train a smaller model (dim 96, 3 layers is about 0.35 MB).
3. Move to the Waveshare board (2 MB PSRAM).

## How to flash

### Option A: from Chrome, no install (for anyone)

1. Get `hatchling-m5dial-merged.bin` (built by `make -C hatchling firmware`, then the merge step below).
2. Plug the Dial into a computer with a USB-C data cable.
3. Open https://espressif.github.io/esptool-js/ in Chrome or Edge.
4. Click **Connect** and pick the Dial's serial port.
5. Set the flash address to `0x0`. Choose the `.bin` file. Click **Program**.
6. When it ends, press the Dial's reset button.

If the Dial does not connect: hold the button on the Stamp-S3A core
(the G0 button), plug in USB, then let go. This forces download mode.

### Option B: from a terminal (for developers)

```bash
pip install platformio
make -C hatchling firmware                      # writes the model header and builds
cd hatchling/firmware/m5dial && pio run -t upload && pio device monitor
```

### Build the merged file

```bash
cd hatchling/firmware/m5dial
B=.pio/build/m5dial
APP0=$(find ~/.platformio/packages/framework-arduinoespressif32 -name boot_app0.bin | head -1)
ESPTOOL=$(find ~/.platformio/packages/tool-esptoolpy -name esptool.py | head -1)
python3 $ESPTOOL --chip esp32s3 merge_bin -o $B/hatchling-m5dial-merged.bin \
  --flash_mode dio --flash_size 8MB 0x0 $B/bootloader.bin 0x8000 $B/partitions.bin \
  0xe000 $APP0 0x10000 $B/firmware.bin
```

## Day-1 test plan (when the Dials arrive)

| # | Test | How | Pass |
|---|---|---|---|
| 1 | It boots and hatches | Flash, power on | A named pet and a first thought appear |
| 2 | Thought speed | `pio device monitor`; read the `think ... in N ms` lines | Under 3,000 ms per thought |
| 3 | Ring | Turn one click | The action label moves by exactly one. If it moves 4 or 0.25, change the `/ 4` in `main.cpp` |
| 4 | Press | Press the screen | The action runs, the buzzer chirps, a new thought shows |
| 5 | Memory | Unplug, plug in | Same pet name, same stats |
| 6 | Battery fit | Open the shell and measure the cavity | Note the largest flat cell that fits |
| 7 | Battery life | Full charge, normal use | Record hours; target 2+ days with the screen mostly off |
| 8 | Radio off | Phone Wi-Fi and Bluetooth scan | The Dial does not appear |

Paste the monitor output into a GitHub issue. A Claude session can tune the
firmware from it.

## Path to the product

1. **Founders Edition (300 units):** stock Dials, our firmware, a custom
   sticker or printed ring, and our box. Ask M5Stack sales about logo printing
   and a 300-unit price.
2. **2027:** a custom board and shell (egg or pebble shape) through M5Stack OEM
   or Seeed. Add PSRAM, a larger battery, and remove parts we do not use (RFID
   only if cards sell).

## Sources

- M5Stack Dial docs: https://docs.m5stack.com/en/core/M5Dial and https://docs.m5stack.com/en/core/M5Dial%20V1.1
- Waveshare 1.28-B: https://www.waveshare.com/esp32-s3-touch-lcd-1.28-b.htm
- Mouser M5Stack listings: https://www.mouser.com/en/c/semiconductors/engineering-development-tools/embedded-processor-development-kits/?m=M5Stack
- Espressif web flasher: https://espressif.github.io/esptool-js/
