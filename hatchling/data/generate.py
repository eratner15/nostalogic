"""Write the seed training corpus from a reviewed grammar.

Each output line is: <state tokens> | <thought tokens>
Example: <sp_pebbit> <mood_happy> <ev_fed> <age_kid> | yum . that cracker was crunchy .

Run: python3 hatchling/data/generate.py --n 200000 --out hatchling/build/corpus.txt
"""

import argparse
import os
import random
import sys

sys.path.insert(0, os.path.dirname(__file__))
from rules import check_line  # noqa: E402

SPECIES = {
    "pebbit": {"fav": ["pebble", "pebbles"], "sound": "clack", "home": "a warm rock"},
    "mothkin": {"fav": ["lantern", "lanterns"], "sound": "flutter", "home": "a lamp"},
    "glub": {"fav": ["puddle", "puddles"], "sound": "blub", "home": "a cozy puddle"},
    "sprout": {"fav": ["leaf", "leaves"], "sound": "rustle", "home": "a flower pot"},
    "zib": {"fav": ["star", "stars"], "sound": "zip", "home": "a small comet"},
}
MOODS = ["happy", "bored", "sleepy", "hungry", "curious", "grumpy"]
EVENTS = ["fed", "played", "petted", "cleaned", "woke", "night", "idle", "back", "evolved"]
AGES = ["baby", "kid", "grown"]

OBJ = ["moon", "cracker", "cloud", "teacup", "button", "sock", "snail", "comet", "pancake",
       "kite", "marble", "feather", "pickle", "noodle", "acorn", "bubble", "map", "boat",
       "drum", "umbrella", "mitten", "spoon", "carrot", "pillow", "rainbow", "seashell",
       "pinecone", "blanket", "cookie", "balloon", "tuba", "hat", "jellybean", "muffin",
       "bucket", "ladder", "whistle", "crayon", "berry", "biscuit"]
PLURAL = {o: o + "s" for o in OBJ}
PLURAL.update({"berry": "berries", "pickle": "pickles", "leaf": "leaves"})
ADJ = ["tiny", "round", "sleepy", "shiny", "wobbly", "quiet", "warm", "soft", "silly", "brave",
       "small", "golden", "blue", "fuzzy", "crunchy", "bouncy", "sparkly", "polite", "humble",
       "fancy", "speedy", "gentle", "curious", "jolly", "sticky", "striped", "dizzy", "proud"]
VERB_PAST = ["counted", "found", "named", "painted", "hummed to", "waved at", "chased",
             "balanced", "whispered to", "followed", "folded", "built", "tickled", "hugged",
             "measured", "invited", "spotted", "drew", "sang to", "befriended"]
VERB = ["dance", "sing", "fly", "whistle", "juggle", "giggle", "sneeze", "float", "spin",
        "nap", "wink", "skate", "bounce", "hum"]
FOOD = ["cracker", "noodle", "pancake", "berry", "carrot", "cookie", "muffin", "biscuit",
        "jellybean", "pickle"]
TASTE = ["crunchy", "yummy", "tasty", "sweet", "zesty", "fancy", "perfect", "squishy"]
GAME = ["hide and seek", "tag", "catch", "peekaboo", "the button game", "a race"]
NUM = ["two", "three", "four", "five", "seven", "nine", "ten", "eleven", "twelve", "many"]
PLACE = ["under the ring", "behind the screen", "on the moon", "near the window",
         "in a puddle", "on top of a hill", "inside a cloud", "under my blanket",
         "in the sky", "by the river", "in a teacup", "on a boat"]
COLOR = ["blue", "green", "pink", "gold", "orange", "purple", "silver", "yellow"]


def a(word: str) -> str:
    return ("an " if word[0] in "aeiou" else "a ") + word


class G:
    def __init__(self, rng: random.Random, species: str):
        self.r = rng
        self.sp = SPECIES[species]

    def pick(self, xs):
        return self.r.choice(xs)

    def obj(self):
        if self.r.random() < 0.15:
            return self.sp["fav"][0]
        return self.pick(OBJ)

    def objs(self):
        if self.r.random() < 0.15:
            return self.sp["fav"][1]
        return PLURAL[self.pick(OBJ)]

    def fill(self, t: str) -> str:
        out = t
        while "{" in out:
            i = out.index("{")
            j = out.index("}", i)
            k = out[i + 1:j]
            v = {
                "obj": self.obj, "obj2": self.obj, "objs": self.objs, "objs2": self.objs,
                "a_obj": lambda: a(self.obj()),
                "a_adj_obj": lambda: a(self.pick(ADJ) + " " + self.obj()),
                "adj": lambda: self.pick(ADJ), "adj2": lambda: self.pick(ADJ),
                "vpast": lambda: self.pick(VERB_PAST), "verb": lambda: self.pick(VERB),
                "food": lambda: self.pick(FOOD), "a_food": lambda: a(self.pick(FOOD)), "taste": lambda: self.pick(TASTE),
                "game": lambda: self.pick(GAME), "num": lambda: self.pick(NUM),
                "place": lambda: self.pick(PLACE), "color": lambda: self.pick(COLOR),
                "sound": lambda: self.sp["sound"], "home": lambda: self.sp["home"],
                "fav": lambda: self.sp["fav"][1],
            }[k]()
            out = out[:i] + v + out[j + 1:]
        return out


T = {
    "fed": [
        "yum . that {food} was {taste} .", "my tummy says thank you .",
        "i will save one crumb for {a_obj} .", "{food} is my favorite food today .",
        "that was the most {taste} {food} in the world .", "more {food} please . just kidding .",
        "i ate it so fast . {sound} !", "full and happy . like {a_adj_obj} .",
        "thank you . i feel strong now .", "this {food} tastes like {color} .",
    ],
    "played": [
        "again ! that was {adj} .", "i won . or maybe you won . we both won .",
        "let us play {game} next time .", "i am the champion of {game} .",
        "that was more fun than {num} {objs} .", "{sound} ! i am out of breath .",
        "i was very {adj} at that game .", "we make a good team .",
    ],
    "petted": [
        "that tickles .", "hee . do that again .", "i feel {adj} and {adj2} .",
        "{sound} {sound} .", "i am glowing a little .",
        "that is my favorite spot .",
    ],
    "cleaned": [
        "all shiny now .", "i feel as clean as {a_obj} .", "sparkle sparkle .",
        "i am so clean i can see myself .", "fresh like {a_adj_obj} .",
    ],
    "woke": [
        "good morning . i dreamed {a_obj} was {a_obj} .",
        "good morning . i dreamed the {obj} was {adj} .",
        "i slept like {a_obj} .", "morning ! the {obj} said hello in my dream .",
        "i had a dream about {num} {adj} {objs} .", "yawn . what a {adj} dream .",
        "i dreamed i could {verb} {place} .",
    ],
    "night": [
        "the {obj} is sleepy too .", "goodnight . i will count {num} {objs} .",
        "time to dream about {objs} .", "i will sleep in {home} tonight .",
        "the moon looks {adj} tonight .", "nighty night . see you in the morning .",
        "i hope i dream about {a_adj_obj} .",
    ],
    "idle": [
        "i {vpast} {a_adj_obj} today .", "do {objs} have {objs2} ? i think yes .",
        "i am thinking about {objs} .", "what if {objs} could {verb} ?",
        "i saw {a_obj} {place} .", "i wonder if the {obj} is {adj} .",
        "i made up a song about {objs} .", "today i learned to {verb} .",
        "i {vpast} {num} {objs} .", "there is {a_adj_obj} {place} . maybe .",
        "i think the {obj} likes me .", "{objs} are very {adj} , if you ask me .",
        "i named {a_obj} after you .", "fun fact : {objs} can not {verb} . yet .",
        "why is the {obj} {color} ?", "i am collecting {objs} . i have {num} .",
    ],
    "back": [
        "hello ! i kept busy . i {vpast} {num} {objs} .",
        "welcome back . i saved you {a_adj_obj} .",
        "you are here ! i built {a_obj} while you were out .",
        "hi ! i have news . the {obj} is {adj} now .",
        "oh , hello ! i was reading about {objs} .",
        "hi again . i had a {adj} day .",
    ],
    "evolved": [
        "whoa . i feel bigger .", "look at me ! new shape !",
        "i grew . the {obj} looks small now .", "i am a new me . still {adj} .",
        "{sound} ! i leveled up .",
    ],
}

MOOD_T = {
    "happy": ["i feel {adj} today .", "everything is {adj} .", "{sound} ! good day ."],
    "bored": ["let us do something {adj} .", "i wonder what {objs} do all day .",
              "i could use a game of {game} ."],
    "sleepy": ["my eyes are {adj} . nap soon .", "yawn . i am a little sleepy .",
               "i could sleep in {home} for {num} hours ."],
    "hungry": ["my tummy is making {obj} noises .", "is it snack time ? it feels like snack time .",
               "i am thinking about {a_food} ."],
    "curious": ["why is the sky {color} ?", "what is inside {a_obj} ?",
                "how many {objs} fit in {a_obj} ?"],
    "grumpy": ["hmph . the {obj} is being {adj} .", "i am a little grumpy . it will pass .",
               "not now . i am thinking ."],
}

BABY_T = {
    "fed": ["yum !", "{food} !", "{food} ? {food} !", "more ?", "nom nom ."],
    "played": ["again !", "hee hee .", "fun !", "{sound} ! again !"],
    "petted": ["hee hee .", "{sound} .", "soft .", "again !"],
    "cleaned": ["shiny !", "clean !", "sparkle ."],
    "woke": ["hi hi .", "morning !", "yawn .", "big {obj} ."],
    "night": ["sleepy .", "night night .", "yawn .", "moon ."],
    "idle": ["{obj} !", "ooh . {obj} .", "{color} !", "big {obj} .", "{sound} ."],
    "back": ["hi hi !", "hello !", "{sound} ! hi !", "ooh . hi ."],
    "evolved": ["big now !", "whoa .", "new me !"],
}


def make_line(rng: random.Random) -> str:
    sp = rng.choice(list(SPECIES))
    mood = rng.choice(MOODS)
    ev = rng.choice(EVENTS)
    age = rng.choices(AGES, weights=[2, 4, 4])[0]
    g = G(rng, sp)
    if age == "baby":
        t = rng.choice(BABY_T[ev])
    elif ev == "idle" and rng.random() < 0.4:
        t = rng.choice(MOOD_T[mood])
    else:
        t = rng.choice(T[ev])
    text = g.fill(t)
    if age == "grown" and rng.random() < 0.25 and ev != "night":
        text += " " + g.fill(rng.choice(MOOD_T[mood]))
    return f"<sp_{sp}> <mood_{mood}> <ev_{ev}> <age_{age}> | {text}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=200000)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--out", default="hatchling/build/corpus.txt")
    args = ap.parse_args()
    rng = random.Random(args.seed)
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    kept = dropped = 0
    with open(args.out, "w") as f:
        while kept < args.n:
            line = make_line(rng)
            if check_line(line.split("|", 1)[1]):
                dropped += 1
                continue
            f.write(line + "\n")
            kept += 1
    print(f"wrote {kept} lines to {args.out}; dropped {dropped} by rules")


if __name__ == "__main__":
    main()
