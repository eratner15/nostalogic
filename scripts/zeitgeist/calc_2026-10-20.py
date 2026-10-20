"""Zeitgeist run 2026-10-20: trend scores and craft-night kit economics.

Every input price below was read on 2026-10-20 from the source named beside it.
Inputs marked ASSUMPTION were not published by any source read; they must be
measured (stitch or make one sample) before a price goes live.
"""
from decimal import Decimal, ROUND_HALF_UP
import json

W = dict(mom=.25, stg=.15, aud=.20, spd=.15, mar=.15, dfn=.10)

def score(f):
    s = sum(Decimal(str(W[k])) * Decimal(f[k]) for k in W)
    return int(s.quantize(Decimal('1'), rounding=ROUND_HALF_UP))

def band(s):
    return 'GO' if s >= 70 else 'WATCH' if s >= 50 else 'PASS'

# Two-signal-type rule (scoring.md): a trend with fewer than two independent
# signal types is WATCH at most, whatever its score.
CAP = {  # this run
    "Game-night journals and score pads": "one signal type (Amazon best sellers)",
}
LAST_CAP = {  # run 1 as corrected on 2026-10-20
    "Canasta": "one signal type (event demand)",
    "Supper clubs and home hosting": "one signal type (press)",
    "Game-night journals and score pads": "no cited signal",
}

def capped(b, why):
    return 'WATCH' if why and b == 'GO' else b

# name, lane, stage, factors, last score (None = new)
T = [
 ("Needlepoint and stitch clubs", "A", "rising", dict(mom=85, stg=70, aud=85, spd=95, mar=80, dfn=55), 75),
 ("Canasta", "A", "early-rising", dict(mom=55, stg=80, aud=95, spd=95, mar=70, dfn=70), 76),
 ("Hand and Foot", "A", "early-rising", dict(mom=65, stg=80, aud=90, spd=85, mar=70, dfn=60), None),
 ("Mahjong (the base)", "A", "peak", dict(mom=85, stg=35, aud=100, spd=95, mar=65, dfn=50), 76),
 ("Craft nights and girls' night hosting", "A", "rising", dict(mom=75, stg=70, aud=90, spd=75, mar=55, dfn=45), 75),
 ("Game-night journals and score pads", "A", "rising", dict(mom=70, stg=70, aud=70, spd=95, mar=75, dfn=30), 70),
 ("Supper clubs and home hosting", "A", "rising", dict(mom=62, stg=70, aud=80, spd=85, mar=65, dfn=45), 71),
 ("Phone-free social events", "B", "rising", dict(mom=85, stg=70, aud=65, spd=80, mar=60, dfn=35), 69),
 ("Speed puzzling and puzzle swaps", "A", "early-rising", dict(mom=55, stg=80, aud=70, spd=90, mar=70, dfn=55), 69),
 ("Backgammon clubs", "B", "early-rising", dict(mom=68, stg=80, aud=55, spd=85, mar=65, dfn=60), 69),
 ("Tile-bead bracelet and charm bars", "A", "rising", dict(mom=70, stg=70, aud=70, spd=80, mar=55, dfn=45), None),
 ("Silent book clubs", "A", "maturing", dict(mom=60, stg=50, aud=85, spd=90, mar=60, dfn=30), 65),
 ("Chess social nights", "B", "rising", dict(mom=65, stg=70, aud=70, spd=80, mar=55, dfn=30), 67),
 ("Adult Pokemon TCG", "B", "peak", dict(mom=85, stg=35, aud=75, spd=75, mar=55, dfn=25), 64),
 ("Rummikub and Mexican Train", "A", "steady", dict(mom=45, stg=50, aud=80, spd=95, mar=65, dfn=40), 63),
 ("Bunco nights", "A", "steady", dict(mom=40, stg=50, aud=75, spd=90, mar=70, dfn=50), None),
 ("90s toy nostalgia (Tamagotchi at 30)", "B", "rising", dict(mom=60, stg=70, aud=75, spd=60, mar=50, dfn=50), 65),
 ("Run clubs", "B", "peak", dict(mom=70, stg=35, aud=80, spd=70, mar=45, dfn=25), 59),
 ("Bridge", "A", "early", dict(mom=30, stg=90, aud=80, spd=60, mar=70, dfn=40), 64),
 ("Punch needle nights", "A", "steady", dict(mom=50, stg=50, aud=65, spd=70, mar=45, dfn=30), None),
 ("Candle-making nights", "A", "peak", dict(mom=35, stg=35, aud=70, spd=85, mar=55, dfn=25), None),
 ("Line dancing", "B", "rising", dict(mom=45, stg=70, aud=50, spd=55, mar=45, dfn=15), None),
 ("Flower bars and bouquet nights", "A", "steady", dict(mom=40, stg=50, aud=65, spd=50, mar=35, dfn=20), None),
 ("Paint-and-sip kits at home", "A", "fading", dict(mom=20, stg=10, aud=65, spd=80, mar=50, dfn=20), None),
 ("Pickleball socials", "B", "peak", dict(mom=25, stg=35, aud=55, spd=60, mar=45, dfn=15), None),
]

board = []
for name, lane, stage, f, last in T:
    s = score(f)
    board.append(dict(name=name, lane=lane, stage=stage, f=f, score=s,
                      band=capped(band(s), CAP.get(name)), cap=CAP.get(name),
                      last=last,
                      last_band=capped(band(last), LAST_CAP.get(name)) if last is not None else None))
board.sort(key=lambda r: -r['score'])

# ---------------- Etsy fees (checkoutpage.com, 19 Jul 2026, read 2026-10-20) --------
def c(x):
    return Decimal(x).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def etsy_fees(price):
    p = Decimal(str(price))
    return c('0.20') + c(p * Decimal('0.065')) + c(p * Decimal('0.03') + Decimal('0.25'))

# ---------------- Sourced unit prices (read 2026-10-20) --------------------------
CANVAS13_FOOT = Decimal('23.78')    # hmnabavian.com Zweigart 13ct mono deluxe, 40in wide, per foot
CUTS_PER_FOOT = 4                   # 40in / 10.00in cut (build_needlepoint.py 13-mesh cut size 10.00 x 11.08in) and 12in > 11.08in
DMC_SKEIN = Decimal('1.15')         # dmc.com six-strand floss "From $1.15"
MONKS_YARD = Decimal('21.00')       # iconfiberarts.com natural monk's cloth 60in wide, per yard
MONKS_CUTS = 8                      # 15x15in cuts: (36//15)=2 x (60//15)=4
HOOP6 = Decimal('2.49')             # iconfiberarts.com bamboo embroidery hoop 6in
OXFORD10 = Decimal('39.99')         # gatherhereonline.com Oxford punch needle #10 regular
TILA10G = Decimal('8.11')           # firemountaingems.com Tila 10g pack, level-1 price (range 6.87-8.11)
CS_STARTER = Decimal('54.99')       # candlescience.com Starter kit: 6 x 8oz tins, 2 lb wax, 2 x 1oz fragrance, free shipping
GA_3LB_Z5 = Decimal('15.70')        # USPS Notice 123 (eff. 2026-10-04) Ground Advantage retail 3 lb zone 5
GA_2LB_Z5 = Decimal('14.85')        # same, 2 lb zone 5
GA_1LB_Z4 = Decimal('11.10')        # same, 1 lb zone 4
MEDIA_1LB = Decimal('4.39')         # same, Media Mail retail 1 lb
KDP_PRINT_CANASTA = Decimal('3.87') # CLAUDE.md, gamemaster-revisions: B&W 252 pages

# ---------------- ASSUMPTIONS (not published by any source read) ----------------
A_SKEINS_PER_STITCHER = 12   # needlepoint floss per chart at 13 mesh; measure on the sample
A_PACK_PER_PERSON = Decimal('3.00')   # needle, project bag, printed chart, card
A_YARN_PER_PERSON = Decimal('8.00')   # punch needle yarn share
A_TILA_PACKS_PER_BRACELET = 1
A_BRACELET_FINDINGS = Decimal('12.00')  # stretch cord, clasps for 12 bracelets
A_BEAD_MATS = Decimal('12.00')
A_HOST_BOX = Decimal('10.00')

def kit(name, lines, price, guests):
    cogs = sum(v for _, v in lines)
    fees = etsy_fees(price)
    margin = Decimal(str(price)) - fees - cogs
    offsite = c(Decimal(str(price)) * Decimal('0.15'))
    offsite12 = c(Decimal(str(price)) * Decimal('0.12'))
    return dict(name=name, guests=guests, lines=[(k, str(c(v))) for k, v in lines], cogs=str(c(cogs)),
                price=str(c(Decimal(str(price)))), per_guest=str(c(Decimal(str(price)) / guests)),
                fees=str(fees), margin=str(c(margin)), margin_pct=int((margin / Decimal(str(price)) * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP)),
                margin_offsite15=str(c(margin - offsite)), margin_offsite12=str(c(margin - offsite12)))

G = 6
needle = kit("Mahj Night Needlepoint Box (6 stitchers)", [
    ("13-mesh canvas, 2 ft (8 cuts, 6 used)", CANVAS13_FOOT * 2),
    (f"DMC floss, {A_SKEINS_PER_STITCHER} skeins x 6 (ASSUMPTION on skein count)", DMC_SKEIN * A_SKEINS_PER_STITCHER * G),
    ("Needle, bag, printed chart, card x 6 (ASSUMPTION)", A_PACK_PER_PERSON * G),
    ("Ship to buyer, 3 lb zone 5 retail", GA_3LB_Z5),
], 270, G)
punch = kit("Punch Needle Night Box (6, Oxford needles)", [
    ("Monk's cloth, 1 yard (8 cuts of 15 in)", MONKS_YARD),
    ("6 in hoops x 6", HOOP6 * G),
    ("Oxford #10 punch needle x 6 (retail price)", OXFORD10 * G),
    ("Yarn share x 6 (ASSUMPTION)", A_YARN_PER_PERSON * G),
    ("Bag, pattern, card x 6 (ASSUMPTION)", A_PACK_PER_PERSON * G),
    ("Ship to buyer, 3 lb zone 5 retail", GA_3LB_Z5),
], 480, G)
bead = kit("Mahj Tile Bracelet Bar (6 guests, 12 bracelets)", [
    (f"Tila beads, {A_TILA_PACKS_PER_BRACELET} x 10 g pack per bracelet x 12 (ASSUMPTION on grams)", TILA10G * 12 * A_TILA_PACKS_PER_BRACELET),
    ("Cord and findings (ASSUMPTION)", A_BRACELET_FINDINGS),
    ("Bead mats (ASSUMPTION)", A_BEAD_MATS),
    ("Box and host card (ASSUMPTION)", A_HOST_BOX),
    ("Ship to buyer, 2 lb zone 5 retail", GA_2LB_Z5),
], 240, G)
candle = kit("Candle Night Box (6 candles), for comparison", [
    ("CandleScience Starter kit contents (6 tins, 2 lb wax, 2 oz fragrance)", CS_STARTER),
    ("Box and host card (ASSUMPTION)", A_HOST_BOX),
    ("Ship to buyer, 3 lb zone 5 retail", GA_3LB_Z5),
], 150, G)
single_needle = kit("Single needlepoint kit (1 stitcher), for comparison", [
    ("13-mesh canvas, one cut", c(CANVAS13_FOOT / CUTS_PER_FOOT)),
    (f"DMC floss, {A_SKEINS_PER_STITCHER} skeins (ASSUMPTION)", DMC_SKEIN * A_SKEINS_PER_STITCHER),
    ("Needle, bag, chart, card (ASSUMPTION)", A_PACK_PER_PERSON),
    ("Ship to buyer, 1 lb zone 4 retail", GA_1LB_Z4),
], 45, 1)

charts = [(p, str(etsy_fees(p)), str(c(Decimal(str(p)) - etsy_fees(p)))) for p in (9, 22, 45)]

canasta_copy = c(KDP_PRINT_CANASTA + MEDIA_1LB)
out = dict(board=board, kits=[needle, punch, bead, candle, single_needle], charts=charts,
           canasta_copy_cost=str(canasta_copy), canasta_10=str(c(canasta_copy * 10)),
           canasta_20=str(c(canasta_copy * 20)),
           dmc7=str(c(DMC_SKEIN * 7)), sample_cost=str(c(DMC_SKEIN * 7 + CANVAS13_FOOT)))
print(json.dumps(out, indent=1, default=str))
