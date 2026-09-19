# Mechanics Scoring Model

Agent: `nostalgia-scorer`. Decisions D-004 and D-008 in `DECISIONS.md`.
This model adapts the NostalDamus Revival Readiness formula to score block format mechanics instead of properties.

## 0. Revision 2 (after red team item R1-06)

The red team showed that the per-mechanic window term rewards the scorer's choice of peak year, not any property of the mechanic. Every mechanic sits inside the same 1993 to 1998 window by construction. Revision 2 therefore:

1. Removes the window term from the mechanic score.
2. Applies window alignment once at block level as a constant. Midpoint 1995: audience age 2026 - 1995 + 12 = 43. Alignment = 100 - |43 - 40| * 8 = 76. Sweet Spot. This states that the block as a whole is in its window. It does not rank mechanics.
3. Re-weights salience and reproducibility at 0.50 each. Reason: both terms carried 0.30 in the source model. With the window term gone, neither has a sourced claim to more weight than the other.
4. Recalibrates the bands so the bottom quartile can drop (red team item R1-09).
5. Adds a sensitivity table to the scorecard. Most recommendations flip under a 10-point salience shift. Treat the ranking as directional. Only the top and bottom rows are stable.

Section 2 below shows revision 1 for the record and revision 2 as the live formula.

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

### 2a. Revision 2 (live)

```
memorySalience     = 0..100  (replaces socialBuzz)
reproducibility    = 0..100  (replaces modernRelevance)
mechanicScore      = memorySalience * 0.50 + reproducibility * 0.50

blockWindow        = max(0, 100 - |(2026 - 1995 + 12) - 40| * 8) = 76   (block-level constant, reported, not summed)

expressionRisk     = 0..100  (replaces rightsComplexity)
ownerEffort        = 0..100  (replaces 100 - creatorAvailability)
riskScore          = expressionRisk * 0.45
                   + max(0, 80 - reproducibility) * 0.25
                   + max(0, ownerEffort - 30) * 0.30
```

Bands (revision 2): Reproduce if score >= 85 and risk < 45. Adapt if score >= 75. Test if score >= 60. Drop for v1 below 60.

### 2b. Revision 1 (superseded, kept for the record)

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

## 4. Recommendation bands

Revision 2 (live):

| Condition | Recommendation |
|---|---|
| score >= 85 and risk < 45 | Reproduce. Core of the block. |
| score >= 75 | Adapt. Keep the mechanic, redesign the expression. |
| score >= 60 | Test. Try in one stunt before you commit. |
| below 60 | Drop for v1. |

Revision 1 used 88, 78, 68 (the NostalDamus property bands). Those bands dropped nothing. Revision 2 lowers each cut by 3 to 8 points because the 0.50 and 0.50 weights remove the window term that added 27 to 40 points to every revision 1 score.

## 5. Reproducibility

`score.mjs` in this folder computes the scorecard from `mechanics-input.json`. Run:

```
node projects/01-market/out/score.mjs
```

The output is `mechanics-scorecard.md`. The arithmetic matches Section 2. Another agent can rerun it and get the same result.
