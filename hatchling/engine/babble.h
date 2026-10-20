/*
 * Babble voice: turns a thought into a short cartoon "creature talk" sound.
 * One blip per letter, shaped by the letter and the species. It never sounds like
 * a human voice, and it cannot say words out loud. Plain C99, no dependencies.
 */
#ifndef BABBLE_H
#define BABBLE_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#define BABBLE_RATE 16000

/* Number of samples babble_render() will write for this text. */
size_t babble_length(const char *text);

/* Render 16-bit mono PCM at BABBLE_RATE into out (cap samples). Returns samples written. */
size_t babble_render(const char *text, int species, int16_t *out, size_t cap);

#ifdef __cplusplus
}
#endif
#endif
