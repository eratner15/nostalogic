"""Product ideas 2026-10-21: five things to build off the trend board.

For each idea: how it is sourced, what it takes to build, and its unit
economics. Every money figure is computed here from a named input, so nothing
on the page is typed in by hand.

Inputs come from three places:
  - calc_2026-10-20.py, run as a subprocess: Etsy fees, kit costs and chart
    nets as that run computed them (no figure is restated here);
  - sourced constants below, each with the source it was read from;
  - ASSUMPTION constants, which no source published. Each must be checked
    (a proof copy, a sample, a first week of sales) before money is spent.

ROI here is a scenario, not a forecast: "if N sell at the unit net, what does
the upfront cash return". The page shows N and labels it.
"""
from decimal import Decimal, ROUND_HALF_UP
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def c(x):
    return Decimal(x).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


run2 = json.loads(subprocess.run([sys.executable, "-I", str(HERE / "calc_2026-10-20.py")],
                                 check=True, capture_output=True, text=True).stdout)
KITS = {k["name"]: k for k in run2["kits"]}
CHARTS = {int(p): Decimal(net) for p, _fee, net in run2["charts"]}
SAMPLE_COST = Decimal(run2["sample_cost"])   # 7 DMC skeins + 1 ft of 13-mesh canvas

# ---------------- Sourced (read on or before 2026-10-21) -------------------------
# KDP paperback, black ink, amazon.com: $0.012 per page from 110 pages
# (kdpbuilder.com KDP print pricing, revised 2026-09-09). The fixed part is
# derived from our own KDP quote for Canasta: $3.87 at 252 pages
# (gamemaster-revisions CLAUDE.md), so 3.87 - 0.012 x 252 = 0.846.
KDP_PER_PAGE = Decimal('0.012')
CANASTA_PRINT, CANASTA_PAGES = Decimal('3.87'), 252
KDP_FIXED = CANASTA_PRINT - KDP_PER_PAGE * CANASTA_PAGES
KDP_ROYALTY_HIGH = Decimal('0.60')   # list price at or above $9.99 (same source)
KDP_ROYALTY_LOW = Decimal('0.50')    # below $9.99
KDP_HIGH_FROM = Decimal('9.99')
CANASTA_PRICE = Decimal('14.99')     # live price, KDP, 2026-10-20

STRIPE_PCT, STRIPE_FIXED = Decimal('0.029'), Decimal('0.30')  # nerdwallet.com, updated 2026-07-17
# Printful placemat set, variant 17484, landed cost incl. shipping, and the
# Etsy net at $89.95 (mahj-society ETSY-MARKETING.md economics table).
MAT_LANDED = Decimal('41.92')
MAT_PRICE = Decimal('89.95')
MAT_ETSY_NET = Decimal('39.04')

# ---------------- ASSUMPTIONS (no source published these) -----------------------
A_HF_PAGES = 252          # Hand and Foot laid out like Canasta; check at typeset
A_PAD_PAGES = 120         # score-pad journal; 110+ pages to use the per-page rate
A_PAD_PRICE = Decimal('9.99')   # lowest price that earns the 60% rate; not checked against the shelf
A_PHOTO_PROPS = Decimal('15.00')  # props for listing photos of a physical kit
A_SCENARIO_UNITS = 25     # the ROI scenario: 25 sales of each idea
# A choice, not a forecast: every idea gets the same capped launch test of
# $5 a day of ads for 14 days, so upfront cash includes the cost of finding buyers.
TEST_ADS = Decimal('5.00') * 14


def kdp_print(pages):
    return c(KDP_FIXED + KDP_PER_PAGE * pages)


def kdp_royalty(price, pages):
    rate = KDP_ROYALTY_HIGH if price >= KDP_HIGH_FROM else KDP_ROYALTY_LOW
    return c(price * rate - kdp_print(pages))


def stripe_net(price, cost):
    return c(price - cost - (price * STRIPE_PCT + STRIPE_FIXED))


def econ(unit_net, build_cash, price):
    upfront = c(build_cash + TEST_ADS)
    units_be = int((upfront / unit_net).to_integral_value(rounding="ROUND_CEILING")) if unit_net > 0 else None
    profit = c(unit_net * A_SCENARIO_UNITS - upfront)
    return dict(price=str(c(price)), unit_net=str(c(unit_net)),
                net_pct=int((unit_net / price * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP)),
                build_cash=str(c(build_cash)), test_ads=str(c(TEST_ADS)),
                upfront=str(upfront), breakeven_units=units_be,
                scenario_units=A_SCENARIO_UNITS, scenario_profit=str(profit),
                scenario_roi_pct=int((profit / upfront * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP)),
                max_ad_per_sale=str(c(unit_net)))


hf_print = kdp_print(A_HF_PAGES)
hf = econ(kdp_royalty(CANASTA_PRICE, A_HF_PAGES), hf_print, CANASTA_PRICE)
pad_print = kdp_print(A_PAD_PAGES)
pad = econ(kdp_royalty(A_PAD_PRICE, A_PAD_PAGES), pad_print, A_PAD_PRICE)
chart = econ(CHARTS[22], SAMPLE_COST, Decimal(22))
box_k = KITS["Mahj Night Needlepoint Box (6 stitchers)"]
box_cogs_no_ship = sum(Decimal(v) for k, v in box_k["lines"] if not k.startswith("Ship"))
box = econ(Decimal(box_k["margin"]), c(box_cogs_no_ship + A_PHOTO_PROPS), Decimal(box_k["price"]))
mat = econ(stripe_net(MAT_PRICE, MAT_LANDED), c(MAT_LANDED + A_PHOTO_PROPS), MAT_PRICE)

ideas = [
 dict(id="hand-and-foot", title="Sneaky Good at Hand and Foot", trend="Hand and Foot",
      model="Print-on-demand book", channel="Amazon KDP, paperback and Kindle",
      sourcing="Amazon prints and ships each copy when it sells. No stock, no shipping on our side.",
      build=["Collect and check the public rule sources; label every rule by variant.",
             "Reuse the Canasta solver, figure tools, score sheets and cast.",
             "Write, verify every number from a committed script, typeset 6x9.",
             "Order one proof copy, then publish paperback and Kindle.",
             "Add it to the Canasta and Mah Jongg cross-sell ad campaigns."],
      upfront_note=f"One proof copy at print cost (${hf_print}); KDP adds shipping at checkout.",
      net_note=f"Paperback royalty at ${CANASTA_PRICE}, 60% less ${hf_print} print. Kindle adds royalty on top.",
      checks=[f"Page count is assumed {A_HF_PAGES}, like Canasta."],
      econ=hf, status="planned"),
 dict(id="score-pad", title="Hand and Foot and Canasta score-pad journal", trend="Game-night journals and score pads",
      model="Print-on-demand book (low content)", channel="Amazon KDP, paperback",
      sourcing="Amazon prints on demand. The sheets come from the Canasta score-sheet builder.",
      build=["Adapt the Canasta score sheet to Hand and Foot; prove a full game fits one sheet.",
             "Build a 120-page pad with a rules card and house-rules page.",
             "Order one proof, play one game on it, then publish.",
             "Sell it as the add-on to both books in the same ads."],
      upfront_note=f"One proof copy at print cost (${pad_print}).",
      net_note=f"Royalty at ${A_PAD_PRICE}, 60% less ${pad_print} print.",
      checks=[f"Price ${A_PAD_PRICE} and {A_PAD_PAGES} pages are assumptions; check the score-pad shelf first.",
              "This trend is capped at WATCH: only one signal type so far."],
      econ=pad, status="planned"),
 dict(id="needlepoint-charts", title="Mahjong-tile needlepoint charts", trend="Needlepoint and stitch clubs",
      model="Digital download", channel="Etsy",
      sourcing="A PDF the buyer downloads. Nothing to make or ship.",
      build=["Stitch one chart to confirm the thread count and get a real photo.",
             "Run the Etsy Cowork prompt: 7 charts and 2 bundles as drafts.",
             "Publish on Evan's word, then add the real photo."],
      upfront_note=f"One sample: 7 DMC skeins and 1 ft of canvas (${SAMPLE_COST}).",
      net_note="The $22 chart, after Etsy listing, transaction and payment fees.",
      checks=["Charts and listings are built and merged; only the sample and listing remain."],
      econ=chart, status="ready"),
 dict(id="needlepoint-box", title="Mahj Night Needlepoint Box (6 stitchers)", trend="Craft nights and girls' night hosting",
      model="Physical kit, made to order", channel="Etsy",
      sourcing="Buy canvas and DMC floss per order from the named suppliers; pack and ship by USPS Ground Advantage.",
      build=["Make one box from the sample to fix the floss count per stitcher.",
             "Photograph it set for six.",
             "List at $270; buy materials only when an order lands."],
      upfront_note=f"One box of materials without shipping, plus ${A_PHOTO_PROPS} of photo props (assumption).",
      net_note="After Etsy fees, materials and USPS shipping, from the run 2 kit calculator.",
      checks=["Floss per stitcher is an assumption until the sample is stitched.",
              "Under Etsy Offsite Ads the margin drops; see the run 2 report.",
              "The net excludes your time to pack each box."],
      econ=box, status="planned"),
 dict(id="canasta-table-set", title="Canasta Night Table Set (four placemats)", trend="Canasta",
      model="Print on demand, drop shipped", channel="mahj-society site (Stripe) and Etsy",
      sourcing="Printful prints and ships each set direct to the buyer, the same product as the live Mahj Table Set.",
      build=["Design four canasta patterns (no trademark card faces).",
             "Add them to the existing Printful placemat product in our own store.",
             "Order one sample set to photograph.",
             "List on the site and on Etsy, beside the Mahj Table Set. KDP A+ content cannot point buyers off Amazon, so the book does not advertise it."],
      upfront_note=f"One sample set at landed cost (${MAT_LANDED}) plus ${A_PHOTO_PROPS} of props (assumption).",
      net_note=f"Site net at ${MAT_PRICE} after Printful landed cost and Stripe fees. On Etsy the net is ${MAT_ETSY_NET}.",
      checks=["Create it only in our own Printful store, never in a shared one."],
      econ=mat, status="planned"),
]

print(json.dumps(dict(date="2026-10-21", scenario_units=A_SCENARIO_UNITS, test_ads=str(c(TEST_ADS)),
                      kdp_fixed=str(c(KDP_FIXED)), ideas=ideas), indent=1))
