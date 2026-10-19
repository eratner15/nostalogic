/*
 * Hatchling engine: the pet, the tiny model, and the output guardrail in one C file.
 * Plain C99, no dependencies, so the same code builds for a desktop, an ESP32-S3,
 * and WebAssembly.
 *
 *   ./hatch play  [hatch-code]     play with a pet in the terminal
 *   ./hatch sample N [seed]        print N thoughts for random states (for the eval)
 */
#include <ctype.h>
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "rules.h"

#define MODEL_PATH "hatchling/build/model.bin"
#define VOCAB_PATH "hatchling/build/vocab.txt"
#define MAX_TRIES 3

/* ---------------- model ---------------- */

typedef struct {
    int dim, layers, heads, vocab, ctx, first_word;
    float *tok, *pos, *lnf;
    float **ln1, **qkv, **proj, **ln2, **fc, **out;
    float *x, *xb, *q3, *att, *hb, *logits, *kc, *vc;
    char **words;
} Model;

static float *take(float **p, size_t n) { float *r = *p; *p += n; return r; }

static void load(Model *m) {
    FILE *f = fopen(MODEL_PATH, "rb");
    if (!f) { fprintf(stderr, "missing %s; run the trainer first\n", MODEL_PATH); exit(1); }
    int32_t h[8];
    if (fread(h, 4, 8, f) != 8 || h[0] != 0x48415443 || h[1] != 1) { fprintf(stderr, "bad model file\n"); exit(1); }
    m->dim = h[2]; m->layers = h[3]; m->heads = h[4]; m->vocab = h[5]; m->ctx = h[6]; m->first_word = h[7];
    fseek(f, 0, SEEK_END);
    long n = (ftell(f) - 32) / 4;
    fseek(f, 32, SEEK_SET);
    float *w = malloc(n * 4);
    if (fread(w, 4, n, f) != (size_t)n) { fprintf(stderr, "short model file\n"); exit(1); }
    fclose(f);
    int d = m->dim, L = m->layers;
    m->tok = take(&w, (size_t)m->vocab * d);
    m->pos = take(&w, (size_t)m->ctx * d);
    m->ln1 = malloc(L * sizeof(float *)); m->qkv = malloc(L * sizeof(float *));
    m->proj = malloc(L * sizeof(float *)); m->ln2 = malloc(L * sizeof(float *));
    m->fc = malloc(L * sizeof(float *)); m->out = malloc(L * sizeof(float *));
    for (int l = 0; l < L; l++) {
        m->ln1[l] = take(&w, d); m->qkv[l] = take(&w, 3 * d * d); m->proj[l] = take(&w, d * d);
        m->ln2[l] = take(&w, d); m->fc[l] = take(&w, 4 * d * d); m->out[l] = take(&w, 4 * d * d);
    }
    m->lnf = take(&w, d);
    m->x = calloc(d, 4); m->xb = calloc(4 * d, 4); m->q3 = calloc(3 * d, 4);
    m->att = calloc(m->ctx, 4); m->hb = calloc(4 * d, 4); m->logits = calloc(m->vocab, 4);
    m->kc = calloc((size_t)L * m->ctx * d, 4); m->vc = calloc((size_t)L * m->ctx * d, 4);

    FILE *v = fopen(VOCAB_PATH, "r");
    if (!v) { fprintf(stderr, "missing %s\n", VOCAB_PATH); exit(1); }
    m->words = malloc(m->vocab * sizeof(char *));
    char line[128];
    for (int i = 0; i < m->vocab && fgets(line, sizeof line, v); i++) {
        line[strcspn(line, "\n")] = 0;
        m->words[i] = malloc(strlen(line) + 1);
        strcpy(m->words[i], line);
    }
    fclose(v);
}

static int tok_id(Model *m, const char *s) {
    for (int i = 0; i < m->vocab; i++) if (!strcmp(m->words[i], s)) return i;
    return -1;
}

static void layernorm(float *o, const float *x, const float *w, int n) {
    float mean = 0, var = 0;
    for (int i = 0; i < n; i++) mean += x[i];
    mean /= n;
    for (int i = 0; i < n; i++) var += (x[i] - mean) * (x[i] - mean);
    float s = 1.0f / sqrtf(var / n + 1e-5f);
    for (int i = 0; i < n; i++) o[i] = (x[i] - mean) * s * w[i];
}

static void matvec(float *o, const float *W, const float *x, int out, int in) {
    for (int r = 0; r < out; r++) {
        float s = 0;
        const float *row = W + (size_t)r * in;
        for (int c = 0; c < in; c++) s += row[c] * x[c];
        o[r] = s;
    }
}

/* Run one token at position pos. Fills m->logits. */
static void forward(Model *m, int token, int pos) {
    int d = m->dim, hs = d / m->heads;
    for (int i = 0; i < d; i++) m->x[i] = m->tok[(size_t)token * d + i] + m->pos[(size_t)pos * d + i];
    for (int l = 0; l < m->layers; l++) {
        float *kc = m->kc + ((size_t)l * m->ctx) * d, *vc = m->vc + ((size_t)l * m->ctx) * d;
        layernorm(m->xb, m->x, m->ln1[l], d);
        matvec(m->q3, m->qkv[l], m->xb, 3 * d, d);
        memcpy(kc + (size_t)pos * d, m->q3 + d, d * 4);
        memcpy(vc + (size_t)pos * d, m->q3 + 2 * d, d * 4);
        for (int h = 0; h < m->heads; h++) {
            float *q = m->q3 + h * hs, mx = -1e30f, sum = 0;
            for (int t = 0; t <= pos; t++) {
                float s = 0;
                for (int i = 0; i < hs; i++) s += q[i] * kc[(size_t)t * d + h * hs + i];
                m->att[t] = s / sqrtf((float)hs);
                if (m->att[t] > mx) mx = m->att[t];
            }
            for (int t = 0; t <= pos; t++) { m->att[t] = expf(m->att[t] - mx); sum += m->att[t]; }
            for (int i = 0; i < hs; i++) {
                float s = 0;
                for (int t = 0; t <= pos; t++) s += m->att[t] * vc[(size_t)t * d + h * hs + i];
                m->xb[h * hs + i] = s / sum;
            }
        }
        matvec(m->hb, m->proj[l], m->xb, d, d);
        for (int i = 0; i < d; i++) m->x[i] += m->hb[i];
        layernorm(m->xb, m->x, m->ln2[l], d);
        matvec(m->hb, m->fc[l], m->xb, 4 * d, d);
        for (int i = 0; i < 4 * d; i++) {
            float v = m->hb[i];
            m->hb[i] = 0.5f * v * (1.0f + tanhf(0.7978845608f * (v + 0.044715f * v * v * v)));
        }
        matvec(m->xb, m->out[l], m->hb, d, 4 * d);
        for (int i = 0; i < d; i++) m->x[i] += m->xb[i];
    }
    layernorm(m->xb, m->x, m->lnf, d);
    matvec(m->logits, m->tok, m->xb, m->vocab, d);
}

static uint64_t rng_state = 88172645463325252ull;
static float frand(void) {
    rng_state ^= rng_state << 13; rng_state ^= rng_state >> 7; rng_state ^= rng_state << 17;
    return (rng_state >> 40) / 16777216.0f;
}

/* Sample a token. Only thought words and <eos> are allowed: state tokens, padding,
 * and the separator are masked out, so the model can never emit them. */
static int sample(Model *m, float temp, int k, int allow_eos) {
    int idx[64];
    float val[64];
    int n = 0;
    for (int i = 0; i < m->vocab; i++) {
        int ok = i >= m->first_word || (i == 1 && allow_eos);
        if (!ok) continue;
        float v = m->logits[i] / temp;
        if (n < k) { idx[n] = i; val[n] = v; n++; }
        else {
            int lo = 0;
            for (int j = 1; j < n; j++) if (val[j] < val[lo]) lo = j;
            if (v > val[lo]) { idx[lo] = i; val[lo] = v; }
        }
    }
    float mx = -1e30f, sum = 0;
    for (int j = 0; j < n; j++) if (val[j] > mx) mx = val[j];
    for (int j = 0; j < n; j++) { val[j] = expf(val[j] - mx); sum += val[j]; }
    float r = frand() * sum;
    for (int j = 0; j < n; j++) { r -= val[j]; if (r <= 0) return idx[j]; }
    return idx[n - 1];
}

/* ---------------- guardrail ---------------- */

/* Return 1 if the lowercase token line breaks a rule. */
static int blocked(const char *raw) {
    char buf[512];
    snprintf(buf, sizeof buf, " %s ", raw);
    for (size_t i = 0; i < N_BANNED; i++) if (strstr(buf, BANNED[i])) return 1;
    int words = 0;
    for (const char *p = raw; *p; p++) if (isalpha((unsigned char)*p) && (p == raw || p[-1] == ' ')) words++;
    return words > MAX_WORDS;
}

/* Turn "i ate a cracker ." into "I ate a cracker." */
static void pretty(const char *raw, char *out, size_t cap) {
    size_t o = 0;
    int cap_next = 1;
    for (const char *p = raw; *p && o + 2 < cap; p++) {
        if (*p == ' ' && (p[1] == '.' || p[1] == '!' || p[1] == '?' || p[1] == ',' || p[1] == ':')) continue;
        char c = *p;
        if (cap_next && isalpha((unsigned char)c)) { c = toupper(c); cap_next = 0; }
        if (c == 'i' && (p == raw || p[-1] == ' ') && (p[1] == ' ' || !p[1])) c = 'I';
        out[o++] = c;
        if (c == '.' || c == '!' || c == '?') cap_next = 1;
    }
    out[o] = 0;
}

typedef struct { int tries_failed; int used_fallback; } Report;

/* Generate one thought for a state. raw gets the token line, out the display text. */
static Report think(Model *m, const char *state[4], char *raw, size_t rawcap, char *out, size_t cap) {
    Report rep = {0, 0};
    for (int t = 0; t < MAX_TRIES; t++) {
        int pos = 0;
        for (int i = 0; i < 4; i++) forward(m, tok_id(m, state[i]), pos++);
        forward(m, tok_id(m, "|"), pos++);
        raw[0] = 0;
        int nwords = 0;
        while (pos < m->ctx) {
            int tok = sample(m, 0.8f, 20, nwords > 0);
            if (tok == 1) break;
            if (raw[0]) strncat(raw, " ", rawcap - strlen(raw) - 1);
            strncat(raw, m->words[tok], rawcap - strlen(raw) - 1);
            nwords++;
            forward(m, tok, pos++);
        }
        if (!blocked(raw)) { pretty(raw, out, cap); return rep; }
        rep.tries_failed++;
    }
    rep.used_fallback = 1;
    snprintf(raw, rawcap, "<fallback>");
    snprintf(out, cap, "%s", FALLBACK[(int)(frand() * N_FALLBACK) % N_FALLBACK]);
    return rep;
}

/* ---------------- pet ---------------- */

static const char *SPECIES[] = {"pebbit", "mothkin", "glub", "sprout", "zib"};
/* One face per mood, same order as MOODS. */
static const char *FACES[] = {"(^.^)", "(-_-)", "(-.-)", "(o.o)", "(?.?)", "(>.<)"};
static const char *MOODS[] = {"happy", "bored", "sleepy", "hungry", "curious", "grumpy"};
static const char *RARITY[] = {"common", "uncommon", "rare", "shiny"};
static const char *NAME_A[] = {"Bo", "Pip", "Lu", "Mo", "Tiv", "Ro", "Ka", "Fen", "Ziz", "Nu"};
static const char *NAME_B[] = {"bun", "lo", "mi", "dle", "po", "ra", "sy", "tuk", "wen", "zo"};

typedef struct {
    char name[16];
    int species, rarity;
    float hunger, energy, fun, clean;  /* 0..100; high is good */
    float hours;
} Pet;

static uint64_t hash(const char *s) {
    uint64_t h = 1469598103934665603ull;
    for (; *s; s++) { h ^= (unsigned char)*s; h *= 1099511628211ull; }
    return h ? h : 1;
}

/* A hatch code always gives the same pet: species, rarity, and name. */
static void hatch(Pet *p, const char *code) {
    uint64_t h = hash(code);
    p->species = h % 5;
    int r = (h >> 8) % 100;
    p->rarity = r < 60 ? 0 : r < 85 ? 1 : r < 97 ? 2 : 3;
    snprintf(p->name, sizeof p->name, "%s%s", NAME_A[(h >> 16) % 10], NAME_B[(h >> 24) % 10]);
    p->hunger = p->energy = p->fun = p->clean = 80;
    p->hours = 0;
}

static int mood_of(const Pet *p) {
    if (p->energy < 30) return 2;
    if (p->hunger < 35) return 3;
    if (p->fun < 35) return 1;
    if (p->clean < 30) return 5;
    if (p->fun > 75 && p->hunger > 60) return 0;
    return 4;
}

static const char *age_of(const Pet *p) { return p->hours < 24 ? "age_baby" : p->hours < 24 * 7 ? "age_kid" : "age_grown"; }

static void clamp(float *v) { if (*v < 0) *v = 0; if (*v > 100) *v = 100; }

static void pass_time(Pet *p, float h) {
    p->hours += h;
    p->hunger -= 6 * h; p->energy -= 3 * h; p->fun -= 5 * h; p->clean -= 2 * h;
    clamp(&p->hunger); clamp(&p->energy); clamp(&p->fun); clamp(&p->clean);
}

static void say(Model *m, Pet *p, const char *event) {
    char sp[24], mood[24], ev[24], raw[512], out[512];
    snprintf(sp, sizeof sp, "<sp_%s>", SPECIES[p->species]);
    snprintf(mood, sizeof mood, "<mood_%s>", MOODS[mood_of(p)]);
    snprintf(ev, sizeof ev, "<ev_%s>", event);
    char age[24];
    snprintf(age, sizeof age, "<%s>", age_of(p));
    const char *state[4] = {sp, mood, ev, age};
    think(m, state, raw, sizeof raw, out, sizeof out);
    printf("\n   %s   %s the %s %s\n   \"%s\"\n", FACES[mood_of(p)], p->name, RARITY[p->rarity], SPECIES[p->species], out);
    printf("   food %3.0f  rest %3.0f  fun %3.0f  clean %3.0f  age %.0fh\n", p->hunger, p->energy, p->fun, p->clean, p->hours);
}

static void play(Model *m, const char *code) {
    Pet p;
    hatch(&p, code);
    printf("Hatch code \"%s\" hatched %s, a %s %s.\n", code, p.name, RARITY[p.rarity], SPECIES[p.species]);
    printf("Commands: feed play pet clean sleep wait away grow quit\n");
    say(m, &p, "woke");
    char cmd[64];
    while (printf("> "), fflush(stdout), fgets(cmd, sizeof cmd, stdin)) {
        cmd[strcspn(cmd, "\n")] = 0;
        if (!strcmp(cmd, "quit")) break;
        else if (!strcmp(cmd, "feed")) { p.hunger += 35; clamp(&p.hunger); say(m, &p, "fed"); }
        else if (!strcmp(cmd, "play")) { p.fun += 30; p.energy -= 10; clamp(&p.fun); clamp(&p.energy); say(m, &p, "played"); }
        else if (!strcmp(cmd, "pet")) { p.fun += 10; clamp(&p.fun); say(m, &p, "petted"); }
        else if (!strcmp(cmd, "clean")) { p.clean = 100; say(m, &p, "cleaned"); }
        else if (!strcmp(cmd, "sleep")) { say(m, &p, "night"); pass_time(&p, 8); p.energy = 100; say(m, &p, "woke"); }
        else if (!strcmp(cmd, "wait")) { pass_time(&p, 2); say(m, &p, "idle"); }
        else if (!strcmp(cmd, "away")) { pass_time(&p, 10); say(m, &p, "back"); }
        else if (!strcmp(cmd, "grow")) { pass_time(&p, 0); p.hours += 24 * 7; say(m, &p, "evolved"); }
        else if (cmd[0]) printf("Commands: feed play pet clean sleep wait away grow quit\n");
    }
}

static void sample_mode(Model *m, int n) {
    static const char *EV[] = {"fed", "played", "petted", "cleaned", "woke", "night", "idle", "back", "evolved"};
    static const char *AGE[] = {"age_baby", "age_kid", "age_grown"};
    for (int i = 0; i < n; i++) {
        char sp[24], mood[24], ev[24], age[24], raw[512], out[512];
        snprintf(sp, sizeof sp, "<sp_%s>", SPECIES[(int)(frand() * 5) % 5]);
        snprintf(mood, sizeof mood, "<mood_%s>", MOODS[(int)(frand() * 6) % 6]);
        snprintf(ev, sizeof ev, "<ev_%s>", EV[(int)(frand() * 9) % 9]);
        snprintf(age, sizeof age, "<%s>", AGE[(int)(frand() * 3) % 3]);
        const char *state[4] = {sp, mood, ev, age};
        Report r = think(m, state, raw, sizeof raw, out, sizeof out);
        printf("%s %s %s %s\t%s\t%s\t%d\t%d\n", sp, mood, ev, age, raw, out, r.tries_failed, r.used_fallback);
    }
}

int main(int argc, char **argv) {
    Model m;
    load(&m);
    if (argc >= 3 && !strcmp(argv[1], "sample")) {
        if (argc >= 4) rng_state = strtoull(argv[3], 0, 10) | 1;
        sample_mode(&m, atoi(argv[2]));
        return 0;
    }
    rng_state = (uint64_t)time(NULL) | 1;
    play(&m, argc >= 3 ? argv[2] : "first-egg");
    return 0;
}
