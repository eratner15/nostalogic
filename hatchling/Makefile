# Run from the repo root: make -C hatchling all
ROOT := ..
PY := python3

all: data train quantize engine test eval

data:
	cd $(ROOT) && $(PY) hatchling/data/generate.py --n 200000

train:
	cd $(ROOT) && $(PY) hatchling/train/train.py --steps 3000

quantize:
	cd $(ROOT) && $(PY) hatchling/train/quantize.py --header

engine:
	cd $(ROOT) && $(PY) hatchling/data/export_rules.py
	cd $(ROOT) && cc -O2 -std=c99 -Wall -Wextra -Ihatchling/engine -o hatchling/build/hatch hatchling/engine/hatch.c hatchling/engine/pet_core.c hatchling/engine/babble.c -lm

firmware: quantize
	cd firmware/m5dial && pio run

test:
	cd $(ROOT) && $(PY) hatchling/eval/test_rules.py

eval:
	cd $(ROOT) && $(PY) hatchling/eval/redteam.py --n 100000

play:
	cd $(ROOT) && ./hatchling/build/hatch play first-egg

.PHONY: all data train quantize engine firmware test eval play
