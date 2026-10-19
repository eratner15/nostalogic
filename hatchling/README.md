# Hatchling prototype

A virtual pet with its own tiny language model. It runs fully offline. It has guardrails at every layer.
This folder is the working prototype: data, training, the device engine, and the safety eval.

## Run it

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
make -C hatchling all     # data -> train (about 6 min on 4 CPUs) -> engine -> tests -> eval
make -C hatchling play    # play with a pet in the terminal
./hatchling/build/hatch play "any hatch code"
```

## How it works

```
 Gemma 4 (teacher, Apache 2.0)        reviewed grammar
        \                                /
         candidate lines --> rules.py filter --> corpus (state | thought)
                                               |
                                    train.py (word-level GPT, about 0.84M params)
                                               |
                          model.bin + vocab.txt + rules.h (generated from rules.py)
                                               |
                         hatch.c: pet state -> model -> output filter -> screen
```

- **The device model is small.** About 843K parameters. About 0.84 MB at int8.
  It fits an ESP32-S3 with 8 MB PSRAM with room to spare.
- **Gemma 4 is the teacher, not the device model.** The smallest Gemma 4 (E2B) is
  billions of parameters, so it cannot run on a $20 chip. It writes and checks the
  training lines. The tiny model learns from them. This is distillation.
- **The pet is conditioned on state**: species, mood, event, and age. The owner
  never types to it. See `SAFETY.md` for the six guardrail layers.

## Files

| Path | Job |
|---|---|
| `SAFETY.md` | The six guardrail layers and the ship gate |
| `data/rules.py` | Banned words and phrases. One source for data, device, and eval |
| `data/generate.py` | Reviewed grammar that writes the seed corpus |
| `data/export_rules.py` | Writes `engine/rules.h` from `rules.py` |
| `teacher/gemma_teacher.py` | Gemma 4 writes more lines; only approved words pass |
| `train/train.py` | Trains the model; fails the build if a banned word is in the vocabulary |
| `engine/hatch.c` | Pet, model, guardrail, and fallback in plain C99 |
| `eval/test_rules.py` | Rule unit tests |
| `eval/redteam.py` | Release eval over the shipped engine; prints PASS or FAIL |

## Model choices (US open models)

| Model | License | Use here |
|---|---|---|
| Google Gemma 4 (E2B, E4B, 12B) | Apache 2.0 | Teacher (default `google/gemma-4-E4B-it`) |
| Google ShieldGemma | Gemma Terms of Use (gated) | Optional second safety judge on teacher output |
| Microsoft Phi (mini) | MIT | Teacher option |
| AI2 OLMo | Apache 2.0, open data | Teacher option with fully open training data |
| Meta Llama | Llama license | Avoid: extra terms complicate a sale |

Apache 2.0 and MIT keep the IP clean for a future buyer.

## Building on other AI pets

Claude Code shipped a terminal pet, `/buddy`, in April 2026: species, rarity
tiers, and stats, seeded from the account. Hatchling uses the same ideas
(a hatch code, 5 species, 4 rarity tiers) with its own names and art. Do not use
another company's pet names or characters.

Next step for that audience: a small open-source MCP server, so the same
hatch code shows your pet in a coding terminal. The physical pet stays offline.

## Next steps to reach the device

1. Port `engine/hatch.c` to ESP-IDF on the chosen board. Draw the pet with LVGL.
2. Quantize weights to int8 (the PSRAM bandwidth sets the speed).
3. Run the teacher for about 50k lines, review new words, retrain, re-run the eval.
4. Compile the same engine to WebAssembly for the browser pet (Hugging Face Space).
