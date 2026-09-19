# Mechanics Scoring Model

Agent: `nostalgia-scorer`. Decision D-004 in `DECISIONS.md`.
This model adapts the NostalDamus Revival Readiness formula to score block format mechanics instead of properties.

## 1. Source model (NostalDamus, unchanged)

From `src/services/property-data.ts` and `worker/index.ts`:

```
audienceAgeNow   = CURRENT_YEAR - year + 12          (CURRENT_YEAR = 2026)
windowAlignment  = max(0, 100 - |audienceAgeNow - 40| * 8)
readiness        = socialBuzz * 0.30 + windowAlignment * 0.40 + modernRelevance * 0.30
riskScore        = rightsComplexity * 0.45
                 + max(0, 80 - modernRelevance) * 0.25
                 + max(0, 70 - creatorAvailability) * 0.30
```

## 2. Adapted model for mechanics

A mechanic has no single release year. It has a peak year: the year inside the 1993 to 1998 window when the most blocks used it at the most weight. The window arithmetic stays the same.

```
peakYear           = year in 1993..1998 chosen from the history evidence
audienceAgeNow     = 2026 - peakYear + 12
windowAlignment    = max(0, 100 - |audienceAgeNow - 40| * 8)

memorySalience     = 0..100  (replaces socialBuzz)
reproducibility    = 0..100  (replaces modernRelevance)

mechanicScore      = memorySalience * 0.30 + windowAlignment * 0.40 + reproducibility * 0.30

expressionRisk     = 0..100  (replaces rightsComplexity)
ownerEffort        = 0..100  (replaces 100 - creatorAvailability)
riskScore          = expressionRisk * 0.45
                   + max(0, 80 - reproducibility) * 0.25
                   + max(0, ownerEffort - 30) * 0.30
```

The window alignment table for the six possible peak years:

| peakYear | audienceAgeNow | windowAlignment |
|---|---|---|
| 1993 | 45 | 60 |
| 1994 | 44 | 68 |
| 1995 | 43 | 76 |
| 1996 | 42 | 84 |
| 1997 | 41 | 92 |
| 1998 | 40 | 100 |

## 3. Input rubrics

### memorySalience (0 to 100)
How strongly adults who watched as children recall this mechanic as part of the experience.
- 90 to 100: named in most retrospective press and fan discussion of the blocks. Evidence file cites it as a defining feature.
- 70 to 89: named often. Evidence cites it for at least two blocks.
- 40 to 69: named sometimes. Evidence cites it for one block.
- 10 to 39: rarely named. Present but not recalled.
- 0 to 9: no evidence of recall.

### reproducibility (0 to 100)
Can a small studio reproduce the mechanic on a digital block, and does it fit how families watch now.
- 90 to 100: works on an owned site or video platform with no partner, and fits current viewing behavior.
- 70 to 89: works with modest production or one partner feature.
- 40 to 69: works only with a scheduled linear partner or a feature the platform does not offer to made-for-kids content.
- 10 to 39: needs a broadcast network or a live audience.
- 0 to 9: cannot be reproduced.

### expressionRisk (0 to 100)
How close reproducing the mechanic pulls the studio toward copying expression from an existing block.
- 0 to 20: pure structure. No expressive surface.
- 21 to 50: structure with an expressive surface the studio must design fresh (a set, a song, a host style).
- 51 to 80: the mechanic is known mainly through one block's specific expression.
- 81 to 100: the mechanic is inseparable from a trademark or a protected character.

### ownerEffort (0 to 100)
Recurring effort the owner or a small team spends per block to run the mechanic.
- 0 to 20: set once, runs itself.
- 21 to 50: light weekly work.
- 51 to 80: a weekly production task.
- 81 to 100: a weekly production with talent and crew.

## 4. Recommendation bands (adapted from NostalDamus)

| Condition | Recommendation |
|---|---|
| score >= 88 and risk < 45 | Reproduce. Core of the block. |
| score >= 78 | Adapt. Keep the mechanic, redesign the expression. |
| score >= 68 | Test. Try in one stunt before you commit. |
| below 68 | Drop for v1. |

## 5. Reproducibility

`score.mjs` in this folder computes the scorecard from `mechanics-input.json`. Run:

```
node projects/01-market/out/score.mjs
```

The output is `mechanics-scorecard.md`. The arithmetic matches Section 2. Another agent can rerun it and get the same result.
