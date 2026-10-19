"""Use Gemma 4 (Apache 2.0) as a teacher to write more pet thoughts.

The teacher never talks to owners. It only writes candidate training lines.
A line is kept only if:
  1. every word is already in the approved vocabulary, and
  2. it passes every rule in data/rules.py.
Lines with new words go to a review queue. A person approves new words.

Works with any OpenAI-compatible chat endpoint:
  Hugging Face router: --base https://router.huggingface.co/v1  (env HF_TOKEN)
  Ollama:              --base http://localhost:11434/v1 --model gemma4:e4b
  llama.cpp server:    --base http://localhost:8080/v1

Run: python3 hatchling/teacher/gemma_teacher.py --per-state 3 --out hatchling/build/teacher.txt
"""

import argparse
import itertools
import json
import os
import random
import re
import sys
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "data"))
from generate import AGES, EVENTS, MOODS, SPECIES  # noqa: E402
from rules import check_line  # noqa: E402

SYSTEM = """You write thoughts for a tiny virtual pet that lives on a desk toy.
Rules:
- One or two short sentences. At most 16 words in total.
- Simple words a seven-year-old knows. Warm, odd, a little funny.
- Never mention death, injury, sickness, fear, sadness, money, buying, or personal data.
- Never make the owner feel guilty. Never say the pet was alone, left, or forgotten.
- Never ask the owner to stay, come back, or play more. Never say the pet needs the owner.
- Never say the pet is a person, real, or alive.
Return only a JSON list of strings."""

EVENT_TEXT = {
    "fed": "the owner just fed it", "played": "the owner just played a game with it",
    "petted": "the owner just petted it", "cleaned": "the owner just cleaned it",
    "woke": "it just woke up", "night": "it is going to sleep", "idle": "nothing is happening",
    "back": "the owner just picked it up after some hours", "evolved": "it just grew to a new stage",
}


def tokenize(s: str) -> str:
    s = s.lower().replace("'", "")
    s = re.sub(r"([.!?,:])", r" \1 ", s)
    return " ".join(s.split())


def ask(base, model, token, user):
    body = json.dumps({"model": model, "temperature": 0.9, "max_tokens": 300,
                       "messages": [{"role": "system", "content": SYSTEM},
                                    {"role": "user", "content": user}]}).encode()
    req = urllib.request.Request(base.rstrip("/") + "/chat/completions", data=body,
                                 headers={"Content-Type": "application/json",
                                          **({"Authorization": f"Bearer {token}"} if token else {})})
    with urllib.request.urlopen(req, timeout=120) as r:
        text = json.load(r)["choices"][0]["message"]["content"]
    m = re.search(r"\[.*\]", text, re.S)
    return json.loads(m.group(0)) if m else []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://router.huggingface.co/v1")
    ap.add_argument("--model", default="google/gemma-4-E4B-it")
    ap.add_argument("--vocab", default="hatchling/build/vocab.txt")
    ap.add_argument("--per-state", type=int, default=3, help="requests per state")
    ap.add_argument("--limit-states", type=int, default=0, help="0 = all states")
    ap.add_argument("--out", default="hatchling/build/teacher.txt")
    ap.add_argument("--review", default="hatchling/build/teacher_review.txt")
    args = ap.parse_args()
    token = os.environ.get("HF_TOKEN", "")

    vocab = {w.strip() for w in open(args.vocab)}
    states = list(itertools.product(SPECIES, MOODS, EVENTS, AGES))
    random.Random(0).shuffle(states)
    if args.limit_states:
        states = states[: args.limit_states]

    kept = review = dropped = 0
    with open(args.out, "a") as out, open(args.review, "a") as rev:
        for sp, mood, ev, age in states:
            user = (f"Pet species: {sp} (loves {SPECIES[sp]['fav'][1]}). Mood: {mood}. "
                    f"Age: {age}. Moment: {EVENT_TEXT[ev]}. Write 8 different thoughts.")
            for _ in range(args.per_state):
                try:
                    lines = ask(args.base, args.model, token, user)
                except Exception as e:  # network or parse error: skip, never guess
                    print("request failed:", e, file=sys.stderr)
                    continue
                for raw in lines:
                    t = tokenize(str(raw))
                    if check_line(t):
                        dropped += 1
                        continue
                    new = sorted({w for w in t.split() if w not in vocab})
                    state = f"<sp_{sp}> <mood_{mood}> <ev_{ev}> <age_{age}>"
                    if new:
                        rev.write(f"{state} | {t}\tNEW WORDS: {' '.join(new)}\n")
                        review += 1
                    else:
                        out.write(f"{state} | {t}\n")
                        kept += 1
    print(f"kept {kept}, sent to human review {review}, dropped by rules {dropped}")


if __name__ == "__main__":
    main()
