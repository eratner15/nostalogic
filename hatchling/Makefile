# Run from the repo root: make -C hatchling all
ROOT := ..
PY := python3

all: data train engine test eval

data:
	cd $(ROOT) && $(PY) hatchling/data/generate.py --n 200000

train:
	cd $(ROOT) && $(PY) hatchling/train/train.py --steps 3000

engine:
	cd $(ROOT) && $(PY) hatchling/data/export_rules.py
	cd $(ROOT) && cc -O2 -std=c99 -Wall -Wextra -o hatchling/build/hatch hatchling/engine/hatch.c -lm

test:
	cd $(ROOT) && $(PY) hatchling/eval/test_rules.py

eval:
	cd $(ROOT) && $(PY) hatchling/eval/redteam.py --n 100000

play:
	cd $(ROOT) && ./hatchling/build/hatch play first-egg

.PHONY: all data train engine test eval play
