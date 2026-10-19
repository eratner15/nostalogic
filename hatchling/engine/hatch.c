/*
 * Hatchling terminal program. Uses the same core as the device firmware.
 *
 *   ./hatch play  [hatch-code]     play with a pet in the terminal
 *   ./hatch sample N [seed]        print N thoughts for random states (for the eval)
 *   ./hatch voice OUT.wav [code]   write a WAV of the pet talking in its babble voice
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "babble.h"
#include "pet_core.h"

#define MODEL_PATH "hatchling/build/model_q8.bin"

static const char *FACES[N_MOODS] = {"(^.^)", "(-_-)", "(-.-)", "(o.o)", "(?.?)", "(>.<)"};
static const char *HELP = "Commands: feed play pet clean sleep wait away grow quit\n";

static void load_model(PetModel *m) {
    FILE *f = fopen(MODEL_PATH, "rb");
    if (!f) { fprintf(stderr, "missing %s; run make -C hatchling quantize\n", MODEL_PATH); exit(1); }
    fseek(f, 0, SEEK_END);
    long n = ftell(f);
    fseek(f, 0, SEEK_SET);
    uint8_t *blob = malloc(n);
    if (fread(blob, 1, n, f) != (size_t)n) { fprintf(stderr, "short model file\n"); exit(1); }
    fclose(f);
    int err = pm_load(m, blob, (size_t)n);
    if (err) { fprintf(stderr, "bad model file (error %d)\n", err); exit(1); }
}

static void say(PetModel *m, Pet *p, const char *event) {
    char buf[4][24], raw[512], out[512];
    const char *state[4];
    pet_state(p, event, buf, state);
    pm_think(m, state, raw, sizeof raw, out, sizeof out);
    int mood = pet_mood(p);
    printf("\n   %s   %s the %s %s\n   \"%s\"\n", FACES[mood], p->name, PET_RARITY[p->rarity], PET_SPECIES[p->species], out);
    printf("   food %3.0f  rest %3.0f  fun %3.0f  clean %3.0f  age %.0fh\n", p->hunger, p->energy, p->fun, p->clean, p->hours);
}

static void play(PetModel *m, const char *code) {
    Pet p;
    pet_hatch(&p, code);
    printf("Hatch code \"%s\" hatched %s, a %s %s.\n%s", code, p.name, PET_RARITY[p.rarity], PET_SPECIES[p.species], HELP);
    say(m, &p, "woke");
    char cmd[64];
    while (printf("> "), fflush(stdout), fgets(cmd, sizeof cmd, stdin)) {
        cmd[strcspn(cmd, "\n")] = 0;
        int act = -1;
        for (int i = 0; i < N_ACTS; i++) if (!strcmp(cmd, PET_ACTIONS[i])) act = i;
        if (!strcmp(cmd, "quit")) break;
        else if (act == ACT_SLEEP) { say(m, &p, pet_act(&p, act)); pet_pass_time(&p, 8); say(m, &p, "woke"); }
        else if (act >= 0) say(m, &p, pet_act(&p, act));
        else if (!strcmp(cmd, "wait")) { pet_pass_time(&p, 2); say(m, &p, "idle"); }
        else if (!strcmp(cmd, "away")) { pet_pass_time(&p, 10); say(m, &p, "back"); }
        else if (!strcmp(cmd, "grow")) { p.hours += 24 * 7; say(m, &p, "evolved"); }
        else if (cmd[0]) printf("%s", HELP);
    }
}

static void sample_mode(PetModel *m, int n) {
    static const char *EV[] = {"fed", "played", "petted", "cleaned", "woke", "night", "idle", "back", "evolved"};
    static const char *AGE[] = {"age_baby", "age_kid", "age_grown"};
    for (int i = 0; i < n; i++) {
        char sp[24], mood[24], ev[24], age[24], raw[512], out[512];
        snprintf(sp, sizeof sp, "<sp_%s>", PET_SPECIES[(int)(pm_rand() * 5) % 5]);
        snprintf(mood, sizeof mood, "<mood_%s>", PET_MOODS[(int)(pm_rand() * N_MOODS) % N_MOODS]);
        snprintf(ev, sizeof ev, "<ev_%s>", EV[(int)(pm_rand() * 9) % 9]);
        snprintf(age, sizeof age, "<%s>", AGE[(int)(pm_rand() * 3) % 3]);
        const char *state[4] = {sp, mood, ev, age};
        PmReport r = pm_think(m, state, raw, sizeof raw, out, sizeof out);
        printf("%s %s %s %s\t%s\t%s\t%d\t%d\n", sp, mood, ev, age, raw, out, r.tries_failed, r.used_fallback);
    }
}

static void put32(FILE *f, uint32_t v) { fwrite(&v, 4, 1, f); }
static void put16(FILE *f, uint16_t v) { fwrite(&v, 2, 1, f); }

/* Write a WAV of one pet saying a thought for each event, so people can hear the voice. */
static void voice_mode(PetModel *m, const char *path, const char *code) {
    static const char *EV[] = {"woke", "fed", "played", "petted", "back", "night"};
    Pet p;
    pet_hatch(&p, code);
    p.hours = 30;  /* a kid-age pet talks in full sentences */
    size_t cap = BABBLE_RATE * 60, n = 0;
    int16_t *pcm = calloc(cap, 2);
    printf("%s the %s %s:\n", p.name, PET_RARITY[p.rarity], PET_SPECIES[p.species]);
    for (size_t e = 0; e < sizeof EV / sizeof EV[0]; e++) {
        char buf[4][24], raw[512], out[512];
        const char *state[4];
        pet_state(&p, EV[e], buf, state);
        pm_think(m, state, raw, sizeof raw, out, sizeof out);
        printf("  [%s] %s\n", EV[e], out);
        n += babble_render(out, p.species, pcm + n, cap - n);
        for (int i = 0; i < BABBLE_RATE / 2 && n < cap; i++) pcm[n++] = 0;
    }
    FILE *f = fopen(path, "wb");
    if (!f) { perror(path); exit(1); }
    fwrite("RIFF", 1, 4, f); put32(f, 36 + n * 2); fwrite("WAVEfmt ", 1, 8, f);
    put32(f, 16); put16(f, 1); put16(f, 1); put32(f, BABBLE_RATE); put32(f, BABBLE_RATE * 2);
    put16(f, 2); put16(f, 16); fwrite("data", 1, 4, f); put32(f, n * 2);
    fwrite(pcm, 2, n, f);
    fclose(f);
    printf("wrote %s (%.1f s)\n", path, (double)n / BABBLE_RATE);
}

int main(int argc, char **argv) {
    PetModel m;
    load_model(&m);
    if (argc >= 3 && !strcmp(argv[1], "voice")) {
        pm_seed(7);
        voice_mode(&m, argv[2], argc >= 4 ? argv[3] : "first-egg");
        return 0;
    }
    if (argc >= 3 && !strcmp(argv[1], "sample")) {
        pm_seed(argc >= 4 ? strtoull(argv[3], 0, 10) : 88172645463325252ull);
        sample_mode(&m, atoi(argv[2]));
        return 0;
    }
    pm_seed((uint64_t)time(NULL));
    play(&m, argc >= 3 ? argv[2] : "first-egg");
    return 0;
}
