#include "babble.h"

#include <ctype.h>
#include <math.h>

#define BLIP_MS 52
#define GAP_MS 14
#define SPACE_MS 40
#define STOP_MS 180

/* Base pitch per species, in Hz: pebbit low, mothkin soft, glub bubbly, sprout mid, zib high. */
static const float SPECIES_PITCH[5] = {170.0f, 260.0f, 220.0f, 300.0f, 380.0f};

static size_t ms(int v) { return (size_t)v * BABBLE_RATE / 1000; }

static int is_vowel(char c) { return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y'; }

/* Rough formant (mouth shape) per vowel, so letters sound different. */
static float formant(char c) {
    switch (c) {
    case 'a': return 2.6f;
    case 'e': return 3.4f;
    case 'i': return 4.2f;
    case 'o': return 1.9f;
    case 'u': return 1.6f;
    default: return 2.9f;
    }
}

size_t babble_length(const char *text) {
    size_t n = 0;
    for (const char *p = text; *p; p++) {
        char c = (char)tolower((unsigned char)*p);
        if (isalpha((unsigned char)c)) n += ms(BLIP_MS) + ms(GAP_MS);
        else if (c == ' ') n += ms(SPACE_MS);
        else if (c == '.' || c == '!' || c == '?' || c == ',') n += ms(STOP_MS);
    }
    return n;
}

size_t babble_render(const char *text, int species, int16_t *out, size_t cap) {
    float base = SPECIES_PITCH[(species % 5 + 5) % 5];
    size_t n = 0;
    uint32_t noise = 22222;
    /* A question rises at the end; an exclamation is a bit higher overall. */
    int question = 0, excited = 0;
    for (const char *p = text; *p; p++) { if (*p == '?') question = 1; if (*p == '!') excited = 1; }
    size_t letters = 0, total = 0;
    for (const char *p = text; *p; p++) if (isalpha((unsigned char)*p)) total++;

    for (const char *p = text; *p && n < cap; p++) {
        char c = (char)tolower((unsigned char)*p);
        if (!isalpha((unsigned char)c)) {
            size_t pause = c == ' ' ? ms(SPACE_MS) : (c == '.' || c == '!' || c == '?' || c == ',') ? ms(STOP_MS) : 0;
            for (size_t i = 0; i < pause && n < cap; i++) out[n++] = 0;
            continue;
        }
        letters++;
        /* Each letter gets its own small pitch step, so words have a melody. */
        float pitch = base * (1.0f + 0.06f * (float)((c - 'a') % 7 - 3));
        if (excited) pitch *= 1.12f;
        if (question && letters * 4 > total * 3) pitch *= 1.0f + 0.5f * (float)(letters * 4 - total * 3) / (float)total;
        float f2 = formant(is_vowel(c) ? c : 'x');
        size_t len = ms(BLIP_MS);
        for (size_t i = 0; i < len && n < cap; i++) {
            float t = (float)i / BABBLE_RATE;
            float env = (float)i / len;
            env = env < 0.12f ? env / 0.12f : (1.0f - env) / 0.88f;  /* quick attack, soft decay */
            float s = sinf(6.2831853f * pitch * t) + 0.45f * sinf(6.2831853f * pitch * f2 * t);
            if (!is_vowel(c) && i < len / 5) {  /* consonants start with a tiny click of noise */
                noise = noise * 1664525u + 1013904223u;
                s += 0.6f * ((float)(noise >> 16) / 32768.0f - 1.0f);
            }
            out[n++] = (int16_t)(s * env * 9000.0f);
        }
        for (size_t i = 0; i < ms(GAP_MS) && n < cap; i++) out[n++] = 0;
    }
    return n;
}
