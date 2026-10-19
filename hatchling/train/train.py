"""Train the tiny pet model and export it for the C engine.

Word-level GPT. No biases. Learned positions. Tied output head.
The loss covers only the thought tokens, not the state tokens.

Run: python3 hatchling/train/train.py --corpus hatchling/build/corpus.txt --out hatchling/build
"""

import argparse
import math
import os
import struct
import sys
import time

import torch
import torch.nn as nn
import torch.nn.functional as F

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "data"))
from rules import check_vocab  # noqa: E402

SPECIALS = ["<pad>", "<eos>", "|"]
MAGIC = 0x48415443  # "HATC"


def build_vocab(lines):
    state, words = set(), set()
    for ln in lines:
        s, t = ln.split("|", 1)
        state.update(s.split())
        words.update(t.split())
    return SPECIALS + sorted(state) + sorted(words), len(SPECIALS) + len(state)


class Block(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.h = h
        self.ln1 = nn.LayerNorm(d, bias=False)
        self.qkv = nn.Linear(d, 3 * d, bias=False)
        self.proj = nn.Linear(d, d, bias=False)
        self.ln2 = nn.LayerNorm(d, bias=False)
        self.fc = nn.Linear(d, 4 * d, bias=False)
        self.out = nn.Linear(4 * d, d, bias=False)

    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(self.ln1(x)).split(C, dim=2)
        q, k, v = (t.view(B, T, self.h, C // self.h).transpose(1, 2) for t in (q, k, v))
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        x = x + self.proj(y.transpose(1, 2).reshape(B, T, C))
        return x + self.out(F.gelu(self.fc(self.ln2(x)), approximate="tanh"))


class Pet(nn.Module):
    def __init__(self, vocab, ctx, d, layers, heads):
        super().__init__()
        self.tok = nn.Embedding(vocab, d)
        self.pos = nn.Embedding(ctx, d)
        self.blocks = nn.ModuleList(Block(d, heads) for _ in range(layers))
        self.lnf = nn.LayerNorm(d, bias=False)

    def forward(self, idx):
        x = self.tok(idx) + self.pos(torch.arange(idx.shape[1]))
        for b in self.blocks:
            x = b(x)
        return self.lnf(x) @ self.tok.weight.T


def export(model, cfg, path):
    with open(path, "wb") as f:
        f.write(struct.pack("<8i", MAGIC, 1, *cfg))
        sd = model.state_dict()
        order = ["tok.weight", "pos.weight"]
        for i in range(cfg[2]):
            order += [f"blocks.{i}.{n}.weight" for n in ("ln1", "qkv", "proj", "ln2", "fc", "out")]
        order += ["lnf.weight"]
        for name in order:
            f.write(sd[name].detach().float().contiguous().numpy().tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", default="hatchling/build/corpus.txt")
    ap.add_argument("--out", default="hatchling/build")
    ap.add_argument("--dim", type=int, default=128)
    ap.add_argument("--layers", type=int, default=4)
    ap.add_argument("--heads", type=int, default=4)
    ap.add_argument("--ctx", type=int, default=40)
    ap.add_argument("--steps", type=int, default=3000)
    ap.add_argument("--batch", type=int, default=128)
    ap.add_argument("--lr", type=float, default=2e-3)
    args = ap.parse_args()
    torch.manual_seed(0)

    lines = [l.strip() for l in open(args.corpus) if l.strip()]
    vocab, first_word = build_vocab(lines)
    bad = check_vocab(vocab)
    if bad:
        sys.exit("BUILD GATE FAILED: banned words in vocabulary: " + ", ".join(bad))
    stoi = {w: i for i, w in enumerate(vocab)}

    rows, masks = [], []
    for ln in lines:
        s, t = ln.split("|", 1)
        ids = [stoi[w] for w in s.split()] + [stoi["|"]] + [stoi[w] for w in t.split()] + [1]
        ids = ids[: args.ctx + 1]
        start = len(s.split()) + 1  # first predicted position is the first thought token
        m = [0] * (start - 1) + [1] * (len(ids) - start)
        pad = args.ctx + 1 - len(ids)
        rows.append(ids + [0] * pad)
        masks.append(m + [0] * pad)
    X = torch.tensor(rows)
    M = torch.tensor(masks, dtype=torch.float)
    n_val = 2000
    perm = torch.randperm(len(X))
    Xv, Mv, Xt, Mt = X[perm[:n_val]], M[perm[:n_val]], X[perm[n_val:]], M[perm[n_val:]]

    model = Pet(len(vocab), args.ctx, args.dim, args.layers, args.heads)
    n_params = sum(p.numel() for p in model.parameters())
    print(f"vocab {len(vocab)} (words {len(vocab) - first_word}), params {n_params:,}")
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=0.05)

    def loss_on(x, m):
        logits = model(x[:, :-1])
        l = F.cross_entropy(logits.reshape(-1, logits.shape[-1]), x[:, 1:].reshape(-1), reduction="none")
        return (l * m.reshape(-1)).sum() / m.sum()

    t0 = time.time()
    for step in range(args.steps + 1):
        lr = args.lr * 0.5 * (1 + math.cos(math.pi * step / args.steps))
        for g in opt.param_groups:
            g["lr"] = lr
        ix = torch.randint(len(Xt), (args.batch,))
        loss = loss_on(Xt[ix], Mt[ix])
        opt.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        if step % 500 == 0:
            with torch.no_grad():
                vl = loss_on(Xv, Mv).item()
            print(f"step {step:5d}  train {loss.item():.3f}  val {vl:.3f}  {time.time() - t0:.0f}s")

    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "vocab.txt"), "w") as f:
        f.write("\n".join(vocab) + "\n")
    cfg = (args.dim, args.layers, args.heads, len(vocab), args.ctx, first_word)
    export(model, cfg, os.path.join(args.out, "model.bin"))
    torch.save({"state": model.state_dict(), "cfg": cfg}, os.path.join(args.out, "model.pt"))
    size = os.path.getsize(os.path.join(args.out, "model.bin"))
    print(f"exported model.bin ({size / 1e6:.2f} MB fp32, about {size / 4e6:.2f} MB at int8)")


if __name__ == "__main__":
    main()
