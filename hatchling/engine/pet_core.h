/*
 * Hatchling core: the pet, the int8 model, and the output guardrail.
 * Plain C99 with no dependencies. The CLI and the device firmware both use it.
 *
 * The model comes as one read-only blob (see train/quantize.py). On a desktop the
 * blob is a file read into memory. On an ESP32 it is a const array in flash.
 */
#ifndef PET_CORE_H
#define PET_CORE_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    const int8_t *q;     /* rows x cols, row-major */
    const float *scale;  /* one scale per row */
} QMat;

typedef struct {
    int dim, layers, heads, vocab, ctx, first_word;
    QMat tok;                  /* embedding and output head (tied) */
    const float *pos, *lnf;
    const float *ln1[8], *ln2[8];
    QMat qkv[8], proj[8], fc[8], out[8];
    const char *words[1024];
    float *x, *xb, *q3, *att, *hb, *logits, *kc, *vc;  /* working memory */
} PetModel;

/* Returns 0 on success. Allocates working memory (about 170 KB for the default model). */
int pm_load(PetModel *m, const uint8_t *blob, size_t len);

/* Random numbers for sampling. Seed once at start. */
void pm_seed(uint64_t seed);
float pm_rand(void);

typedef struct { int tries_failed; int used_fallback; } PmReport;

/* Write one thought for a state. state[] holds 4 tokens such as "<sp_glub>".
 * raw gets the token line; out gets display text, or a scripted line if every try fails. */
PmReport pm_think(PetModel *m, const char *state[4], char *raw, size_t rawcap, char *out, size_t cap);

/* 1 if a lowercase token line breaks a rule. */
int pm_blocked(const char *raw);

/* ---------- pet ---------- */

enum { MOOD_HAPPY, MOOD_BORED, MOOD_SLEEPY, MOOD_HUNGRY, MOOD_CURIOUS, MOOD_GRUMPY, N_MOODS };
enum { ACT_FEED, ACT_PLAY, ACT_PET, ACT_CLEAN, ACT_SLEEP, N_ACTS };

extern const char *const PET_SPECIES[5];
extern const char *const PET_MOODS[N_MOODS];
extern const char *const PET_RARITY[4];
extern const char *const PET_ACTIONS[N_ACTS];

typedef struct {
    char name[16];
    int species, rarity;
    float hunger, energy, fun, clean;  /* 0..100; high is good */
    float hours;
} Pet;

/* A hatch code always gives the same pet: species, rarity, and name. */
void pet_hatch(Pet *p, const char *code);
int pet_mood(const Pet *p);
void pet_pass_time(Pet *p, float hours);
/* Apply an action. Returns the event name for the model, such as "fed". */
const char *pet_act(Pet *p, int action);
/* Fill state tokens for the model. buf needs 4 x 24 bytes. */
void pet_state(const Pet *p, const char *event, char buf[4][24], const char *state[4]);

#ifdef __cplusplus
}
#endif
#endif
