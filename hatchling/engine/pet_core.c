#include "pet_core.h"

#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "rules.h"

#define MAGIC 0x48415443  /* "HATC" */
#define BLOB_VERSION 2
#define MAX_TRIES 3

/* ---------------- loading ---------------- */

typedef struct { const uint8_t *p, *end; int bad; } Cursor;

static const void *take(Cursor *c, size_t n) {
    n = (n + 3) & ~(size_t)3;  /* every section is 4-byte aligned */
    if (c->p + n > c->end) { c->bad = 1; return c->p; }
    const void *r = c->p;
    c->p += n;
    return r;
}

static QMat take_q(Cursor *c, int rows, int cols) {
    QMat q;
    q.scale = (const float *)take(c, (size_t)rows * 4);
    q.q = (const int8_t *)take(c, (size_t)rows * cols);
    return q;
}

int pm_load(PetModel *m, const uint8_t *blob, size_t len) {
    Cursor c = {blob, blob + len, 0};
    const int32_t *h = (const int32_t *)take(&c, 32);
    if (c.bad || h[0] != MAGIC || h[1] != BLOB_VERSION) return 1;
    m->dim = h[2]; m->layers = h[3]; m->heads = h[4]; m->vocab = h[5]; m->ctx = h[6]; m->first_word = h[7];
    if (m->layers > 8 || m->vocab > 1024) return 2;

    const int32_t *vbytes = (const int32_t *)take(&c, 4);
    const char *v = (const char *)take(&c, (size_t)*vbytes);
    for (int i = 0; i < m->vocab; i++) { m->words[i] = v; v += strlen(v) + 1; }

    int d = m->dim;
    m->tok = take_q(&c, m->vocab, d);
    m->pos = (const float *)take(&c, (size_t)m->ctx * d * 4);
    for (int l = 0; l < m->layers; l++) {
        m->ln1[l] = (const float *)take(&c, (size_t)d * 4);
        m->qkv[l] = take_q(&c, 3 * d, d);
        m->proj[l] = take_q(&c, d, d);
        m->ln2[l] = (const float *)take(&c, (size_t)d * 4);
        m->fc[l] = take_q(&c, 4 * d, d);
        m->out[l] = take_q(&c, d, 4 * d);
    }
    m->lnf = (const float *)take(&c, (size_t)d * 4);
    if (c.bad) return 3;

    m->x = calloc(d, 4); m->xb = calloc(4 * d, 4); m->q3 = calloc(3 * d, 4);
    m->att = calloc(m->ctx, 4); m->hb = calloc(4 * d, 4); m->logits = calloc(m->vocab, 4);
    m->kc = calloc((size_t)m->layers * m->ctx * d, 4); m->vc = calloc((size_t)m->layers * m->ctx * d, 4);
    return (m->x && m->xb && m->q3 && m->att && m->hb && m->logits && m->kc && m->vc) ? 0 : 4;
}

/* ---------------- math ---------------- */

static void layernorm(float *o, const float *x, const float *w, int n) {
    float mean = 0, var = 0;
    for (int i = 0; i < n; i++) mean += x[i];
    mean /= n;
    for (int i = 0; i < n; i++) var += (x[i] - mean) * (x[i] - mean);
    float s = 1.0f / sqrtf(var / n + 1e-5f);
    for (int i = 0; i < n; i++) o[i] = (x[i] - mean) * s * w[i];
}

static void matvec(float *o, QMat W, const float *x, int out, int in) {
    for (int r = 0; r < out; r++) {
        const int8_t *row = W.q + (size_t)r * in;
        float s = 0;
        for (int c = 0; c < in; c++) s += row[c] * x[c];
        o[r] = s * W.scale[r];
    }
}

/* Run one token at position pos. Fills m->logits. */
static void forward(PetModel *m, int token, int pos) {
    int d = m->dim, hs = d / m->heads;
    const int8_t *e = m->tok.q + (size_t)token * d;
    for (int i = 0; i < d; i++) m->x[i] = e[i] * m->tok.scale[token] + m->pos[(size_t)pos * d + i];
    for (int l = 0; l < m->layers; l++) {
        float *kc = m->kc + (size_t)l * m->ctx * d, *vc = m->vc + (size_t)l * m->ctx * d;
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
void pm_seed(uint64_t seed) { rng_state = seed | 1; }
float pm_rand(void) {
    rng_state ^= rng_state << 13; rng_state ^= rng_state >> 7; rng_state ^= rng_state << 17;
    return (rng_state >> 40) / 16777216.0f;
}

/* Sample a token. Only thought words and <eos> are allowed: state tokens, padding,
 * and the separator are masked out, so the model can never emit them. */
static int sample(PetModel *m, float temp, int k, int allow_eos) {
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
    float r = pm_rand() * sum;
    for (int j = 0; j < n; j++) { r -= val[j]; if (r <= 0) return idx[j]; }
    return idx[n - 1];
}

static int tok_id(PetModel *m, const char *s) {
    for (int i = 0; i < m->vocab; i++) if (!strcmp(m->words[i], s)) return i;
    return 0;
}

/* ---------------- guardrail ---------------- */

int pm_blocked(const char *raw) {
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
        if (cap_next && isalpha((unsigned char)c)) { c = (char)toupper((unsigned char)c); cap_next = 0; }
        if (c == 'i' && (p == raw || p[-1] == ' ') && (p[1] == ' ' || !p[1])) c = 'I';
        out[o++] = c;
        if (c == '.' || c == '!' || c == '?') cap_next = 1;
    }
    out[o] = 0;
}

PmReport pm_think(PetModel *m, const char *state[4], char *raw, size_t rawcap, char *out, size_t cap) {
    PmReport rep = {0, 0};
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
        if (!pm_blocked(raw)) { pretty(raw, out, cap); return rep; }
        rep.tries_failed++;
    }
    rep.used_fallback = 1;
    snprintf(raw, rawcap, "<fallback>");
    snprintf(out, cap, "%s", FALLBACK[(int)(pm_rand() * N_FALLBACK) % N_FALLBACK]);
    return rep;
}

/* ---------------- pet ---------------- */

const char *const PET_SPECIES[5] = {"pebbit", "mothkin", "glub", "sprout", "zib"};
const char *const PET_MOODS[N_MOODS] = {"happy", "bored", "sleepy", "hungry", "curious", "grumpy"};
const char *const PET_RARITY[4] = {"common", "uncommon", "rare", "shiny"};
const char *const PET_ACTIONS[N_ACTS] = {"feed", "play", "pet", "clean", "sleep"};
static const char *const NAME_A[] = {"Bo", "Pip", "Lu", "Mo", "Tiv", "Ro", "Ka", "Fen", "Ziz", "Nu"};
static const char *const NAME_B[] = {"bun", "lo", "mi", "dle", "po", "ra", "sy", "tuk", "wen", "zo"};

static uint64_t hash(const char *s) {
    uint64_t h = 1469598103934665603ull;
    for (; *s; s++) { h ^= (unsigned char)*s; h *= 1099511628211ull; }
    return h ? h : 1;
}

void pet_hatch(Pet *p, const char *code) {
    uint64_t h = hash(code);
    p->species = (int)(h % 5);
    int r = (int)((h >> 8) % 100);
    p->rarity = r < 60 ? 0 : r < 85 ? 1 : r < 97 ? 2 : 3;
    snprintf(p->name, sizeof p->name, "%s%s", NAME_A[(h >> 16) % 10], NAME_B[(h >> 24) % 10]);
    p->hunger = p->energy = p->fun = p->clean = 80;
    p->hours = 0;
}

int pet_mood(const Pet *p) {
    if (p->energy < 30) return MOOD_SLEEPY;
    if (p->hunger < 35) return MOOD_HUNGRY;
    if (p->fun < 35) return MOOD_BORED;
    if (p->clean < 30) return MOOD_GRUMPY;
    if (p->fun > 75 && p->hunger > 60) return MOOD_HAPPY;
    return MOOD_CURIOUS;
}

static void clamp(float *v) { if (*v < 0) *v = 0; if (*v > 100) *v = 100; }

void pet_pass_time(Pet *p, float h) {
    p->hours += h;
    p->hunger -= 6 * h; p->energy -= 3 * h; p->fun -= 5 * h; p->clean -= 2 * h;
    clamp(&p->hunger); clamp(&p->energy); clamp(&p->fun); clamp(&p->clean);
}

const char *pet_act(Pet *p, int action) {
    switch (action) {
    case ACT_FEED: p->hunger += 35; clamp(&p->hunger); return "fed";
    case ACT_PLAY: p->fun += 30; p->energy -= 10; clamp(&p->fun); clamp(&p->energy); return "played";
    case ACT_PET: p->fun += 10; clamp(&p->fun); return "petted";
    case ACT_CLEAN: p->clean = 100; return "cleaned";
    case ACT_SLEEP: p->energy = 100; return "night";
    default: return "idle";
    }
}

void pet_state(const Pet *p, const char *event, char buf[4][24], const char *state[4]) {
    snprintf(buf[0], 24, "<sp_%s>", PET_SPECIES[p->species]);
    snprintf(buf[1], 24, "<mood_%s>", PET_MOODS[pet_mood(p)]);
    snprintf(buf[2], 24, "<ev_%s>", event);
    snprintf(buf[3], 24, "<%s>", p->hours < 24 ? "age_baby" : p->hours < 24 * 7 ? "age_kid" : "age_grown");
    for (int i = 0; i < 4; i++) state[i] = buf[i];
}
