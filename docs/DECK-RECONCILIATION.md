# Deck vs live site: what the pitch promises, what nostalogic.cafecito-ai.com delivers

Source deck: "NostalDamus: Predictive Analytics for IP Revival", 26 slides,
marked Executive Presentation 2025. Evan sent it to Nick Mazzucco by text.
Reconciled 2026-08-16 against the live site.

## The one that matters: 87% prediction accuracy

The deck states **87% prediction accuracy** as a present-tense fact on slide 10
("87% Prediction Accuracy") and repeats it on the closing slide 26. Slide 23
then lists, as the Phase 1 MVP goal, "87%+ prediction accuracy validation".

Those two statements cannot both be true. The number is a target that the
roadmap says still needs validating, printed elsewhere as an achieved result.

**There is nothing behind it on the live site.** No backtest, no holdout set,
no validation harness, no scored prediction that later resolved. The Revival
Readiness Score is a deterministic weighted formula (buzz 30%, window
alignment 40%, relevance 30%) applied to 120 hand-authored properties. It is a
reasonable ranking heuristic. It is not a validated predictor, and nothing has
been measured against an outcome.

The same slide-10 problem applies to **30-40% ROI improvement** and slide 24's
**50%+ risk reduction**, **$10-15M revenue uplift**, and **12:1 LTV:CAC**.
These are modelled claims presented in the visual language of measured results.

House rule: never invent track records. Recommended fix before this deck goes
anywhere again: relabel every one of those as a target or a modelled scenario,
or drop them. "The engine is live and scoring 120 properties, and here is the
methodology" is a stronger position with a serious buyer than an accuracy
number that cannot survive one follow-up question.

## Six engines: roughly three exist

| Deck engine (slides 10, 12) | Live reality |
|---|---|
| 1. IP Discovery | REAL. 120-property library, filterable, ranked by score, API-served. Deck's "1,000+ titles" is a Phase 2 goal, not today. |
| 2. Timing Prediction | REAL and it is the strongest piece. Window alignment is computed from cohort age against a 40-year-old sweet spot, matching the deck's 35-45 framing. |
| 3. Audience Analysis | PARTIAL. Properties carry coreAudience and currentSignal text. No demographic data source, no segmentation, no "children of original fans" modelling. |
| 4. Cultural Mapping | NOT BUILT. No theme relevance scoring, no representation analysis, no sensitivity flagging. modernRelevance is a single hand-assigned integer. |
| 5. Modernization Engine | PARTIAL. Every property carries preserve[] and update[] arrays, hand-authored, not derived from fan discussion NLP as the deck describes. |
| 6. Risk Assessment | WEAKEST. rightsComplexity is one hand-assigned integer. No financial risk modelling, no success probability, no scenario planning. |

## Other gaps a buyer would find

- **Technical stack.** Deck slide 17 promises React, Node/Express, Python/
  FastAPI, GraphQL, TensorFlow/PyTorch, scikit-learn, spaCy, AWS/GCP/Azure,
  Docker/Kubernetes. Live is Next.js static export plus Hono on Cloudflare
  Workers with D1. The live stack is cheaper, faster, and entirely defensible,
  but it is not what the deck describes, and no ML model exists at all.
- **Strategy Assistant.** Slide 18's conversational what-if planner is built
  (Prophet Chat at /prophet-chat) but returns "AI features are not configured
  yet" because ANTHROPIC_API_KEY is not set. One command away from working.
  The same applies to Remix Lab's deep-pitch generation.
- **Accounts, subscriptions, paywall.** Slide 21's $499 / $2,499 / Enterprise
  tiers and slide 23's Phase 2 auth and billing do not exist. /sign-in and
  /account render as shells. Nothing is gated and nothing can be charged.
- **Data pipeline.** Slide 17 promises real-time social listening across
  Twitter/X, TikTok, Instagram, Reddit and YouTube plus demographic providers
  and cultural trend databases. No external data source is connected. Every
  score input is hand-authored, with the rubric version stored per row.
- **SOC 2, 99.9% uptime SLA, <100ms API.** Slide 17. No compliance work exists.
  The API is genuinely fast, but an SLA is a commitment, not a measurement.
- **Era.** Deck says 20-25 years is the optimal revival gap. The live corpus is
  1993-1998, which is 28-33 years back. Slide 14's own case studies (Top Gun at
  36 years, Dune at 40) support the wider range, so this is defensible, but the
  deck's headline number and the product's actual window disagree.

## What the live site does that the deck undersells

- The deterministic score works with no API key and no external dependency,
  which is a real architectural virtue for an enterprise buyer worried about
  vendor lock-in and reproducibility. The deck never mentions it.
- Every property carries its rubric_version and scored_at, so a score can be
  reproduced and audited. That is exactly the "transparent confidence scores"
  answer to slide 25's Creativity vs Data risk, and it is already built.
- Active-blockbuster franchises were deliberately excluded from the corpus, so
  the library is genuinely about dormant IP rather than restating what everyone
  already knows is in production.

## Cheapest moves to close the gap between deck and product

1. Set ANTHROPIC_API_KEY on the worker. Turns on Prophet Chat and Remix Lab
   deep pitches, which is two of the deck's most demo-able features.
2. Reframe or source the 87% / 30-40% / 50%+ numbers. This is the credibility
   risk, and it is free to fix.
3. Build a validation harness worth showing: score a set of properties that
   have since been revived, and report how the score ranked them before the
   fact. That is what turns "87%" from a claim into a number.
