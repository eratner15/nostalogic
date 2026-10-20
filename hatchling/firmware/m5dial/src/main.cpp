/*
 * Hatchling on the M5Stack Dial.
 *
 * Turn the ring to pick an action. Press the screen to do it.
 * The pet thinks with the on-chip model. Nothing uses Wi-Fi or Bluetooth.
 * The model blob is a const array, so it stays in flash and is read through the cache.
 */
#include <M5Dial.h>
#include <Preferences.h>
#include <WiFi.h>
#include <esp_bt.h>

#include "model_blob.h"
#include "pet_core.h"

static PetModel model;
static Pet pet;
static Preferences prefs;

static const uint32_t SCREEN_OFF_MS = 45 * 1000;
static const uint32_t IDLE_THOUGHT_MS = 3 * 60 * 1000;
static const uint32_t SAVE_MS = 10 * 60 * 1000;
static const float AWAY_HOURS = 2.0f;

static const uint16_t SPECIES_COLOR[5] = {0x8C71 /* pebble grey */, 0xFE60 /* moth gold */,
                                          0x2D7F /* glub blue */, 0x4E2A /* sprout green */,
                                          0xC81F /* zib violet */};

static long ring_base = 0;
static int action = 0;
static char thought[160] = "";
static uint32_t last_input = 0, last_tick = 0, last_thought = 0, last_save = 0;
static bool screen_on = true, asleep = false;

/* ---------------- storage ---------------- */

static void save_pet() {
    prefs.putBytes("pet", &pet, sizeof pet);
}

static void load_or_hatch() {
    if (prefs.getBytes("pet", &pet, sizeof pet) == sizeof pet) return;
    char code[24];
    snprintf(code, sizeof code, "dial-%012llx", (unsigned long long)ESP.getEfuseMac());
    pet_hatch(&pet, code);
    save_pet();
}

/* ---------------- drawing ---------------- */

static void draw_face(int cx, int cy, int mood) {
    auto &d = M5Dial.Display;
    d.fillCircle(cx, cy, 46, SPECIES_COLOR[pet.species]);
    d.drawCircle(cx, cy, 46, TFT_BLACK);
    int ey = cy - 8;
    switch (mood) {
    case MOOD_SLEEPY:
        d.drawLine(cx - 20, ey, cx - 8, ey, TFT_BLACK);
        d.drawLine(cx + 8, ey, cx + 20, ey, TFT_BLACK);
        break;
    case MOOD_HAPPY:
        d.drawArc(cx - 14, ey + 3, 7, 5, 200, 340, TFT_BLACK);
        d.drawArc(cx + 14, ey + 3, 7, 5, 200, 340, TFT_BLACK);
        break;
    case MOOD_GRUMPY:
        d.drawLine(cx - 20, ey - 6, cx - 8, ey - 2, TFT_BLACK);
        d.drawLine(cx + 8, ey - 2, cx + 20, ey - 6, TFT_BLACK);
        d.fillCircle(cx - 14, ey + 4, 3, TFT_BLACK);
        d.fillCircle(cx + 14, ey + 4, 3, TFT_BLACK);
        break;
    default:
        d.fillCircle(cx - 14, ey, mood == MOOD_CURIOUS ? 6 : 4, TFT_BLACK);
        d.fillCircle(cx + 14, ey, 4, TFT_BLACK);
    }
    if (mood == MOOD_HUNGRY) d.fillEllipse(cx, cy + 16, 7, 5, TFT_BLACK);
    else d.drawArc(cx, cy + 8, 12, 10, 30, 150, TFT_BLACK);
}

/* Word-wrap text into a box that suits the round screen. */
static void draw_thought(const char *text, int y) {
    auto &d = M5Dial.Display;
    d.setTextDatum(top_center);
    d.setFont(&fonts::FreeSans9pt7b);
    char line[64] = "", word[32];
    const char *p = text;
    int ly = y;
    while (*p) {
        int n = 0;
        while (*p == ' ') p++;
        while (*p && *p != ' ' && n < 31) word[n++] = *p++;
        word[n] = 0;
        char trial[96];
        snprintf(trial, sizeof trial, "%s%s%s", line, line[0] ? " " : "", word);
        if (d.textWidth(trial) > 176 && line[0]) {
            d.drawString(line, 120, ly);
            ly += 18;
            snprintf(line, sizeof line, "%s", word);
        } else {
            snprintf(line, sizeof line, "%s", trial);
        }
    }
    if (line[0]) d.drawString(line, 120, ly);
}

static void draw() {
    auto &d = M5Dial.Display;
    d.startWrite();
    d.fillScreen(asleep ? 0x0841 : 0xFFDE);
    d.setTextColor(asleep ? TFT_LIGHTGREY : TFT_BLACK);
    d.setFont(&fonts::FreeSansBold9pt7b);
    d.setTextDatum(top_center);
    char title[48];
    snprintf(title, sizeof title, "%s the %s", pet.name, PET_SPECIES[pet.species]);
    d.drawString(title, 120, 22);
    draw_face(120, 96, asleep ? MOOD_SLEEPY : pet_mood(&pet));
    draw_thought(thought, 152);
    d.setFont(&fonts::FreeSansBold9pt7b);
    d.setTextDatum(bottom_center);
    d.setTextColor(0x03EF);
    char label[24];
    snprintf(label, sizeof label, "< %s >", PET_ACTIONS[action]);
    d.drawString(label, 120, 226);
    d.endWrite();
}

/* ---------------- thinking ---------------- */

static void think(const char *event) {
    char buf[4][24], raw[256];
    const char *state[4];
    pet_state(&pet, event, buf, state);
    snprintf(thought, sizeof thought, "...");
    draw();
    uint32_t t0 = millis();
    PmReport r = pm_think(&model, state, raw, sizeof raw, thought, sizeof thought);
    Serial.printf("think %s %s %s %s -> \"%s\" in %lu ms (filter %d, fallback %d)\n", state[0], state[1],
                  state[2], state[3], thought, (unsigned long)(millis() - t0), r.tries_failed, r.used_fallback);
    last_thought = millis();
    draw();
}

static void chirp(int f) { M5Dial.Speaker.tone(f, 60); }

/* ---------------- main loop ---------------- */

void setup() {
    auto cfg = M5.config();
    M5Dial.begin(cfg, true, false);  /* encoder on, RFID off */
    Serial.begin(115200);
    WiFi.mode(WIFI_OFF);
    btStop();
    M5Dial.Display.setBrightness(120);
    M5Dial.Speaker.setVolume(60);

    int err = pm_load(&model, MODEL_BLOB, MODEL_BLOB_LEN);
    if (err) {
        M5Dial.Display.drawString("model error", 120, 120);
        Serial.printf("pm_load error %d\n", err);
        while (true) delay(1000);
    }
    pm_seed(((uint64_t)esp_random() << 32) | esp_random());
    prefs.begin("hatchling", false);
    load_or_hatch();
    ring_base = M5Dial.Encoder.read();
    last_input = last_tick = last_save = millis();
    think("woke");
}

static void wake_screen() {
    if (!screen_on) { M5Dial.Display.wakeup(); M5Dial.Display.setBrightness(120); screen_on = true; }
}

void loop() {
    M5Dial.update();
    uint32_t now = millis();

    /* Time passes for the pet in real hours. */
    float hours = (now - last_tick) / 3600000.0f;
    if (hours > 0.01f) { pet_pass_time(&pet, hours); last_tick = now; }

    long ring = M5Dial.Encoder.read();
    long steps = (ring - ring_base) / 4;  /* 4 counts per detent */
    bool input = false;
    if (steps != 0) {
        ring_base += steps * 4;
        action = ((action + (int)steps) % N_ACTS + N_ACTS) % N_ACTS;
        chirp(2400);
        input = true;
    }
    bool pressed = M5Dial.BtnA.wasPressed();

    if (input || pressed) {
        bool was_off = !screen_on;
        float away_h = (now - last_input) / 3600000.0f;
        wake_screen();
        last_input = now;
        if (asleep) { asleep = false; pet.energy = 100; think("woke"); }
        else if (was_off && away_h > AWAY_HOURS) think("back");
        else if (pressed) {
            chirp(1800);
            const char *ev = pet_act(&pet, action);
            if (action == ACT_SLEEP) asleep = true;
            think(ev);
            save_pet();
        } else draw();
    }

    if (screen_on && now - last_input > SCREEN_OFF_MS) {
        M5Dial.Display.setBrightness(0);
        M5Dial.Display.sleep();
        screen_on = false;
    }
    if (screen_on && !asleep && now - last_thought > IDLE_THOUGHT_MS) think("idle");
    if (now - last_save > SAVE_MS) { save_pet(); last_save = now; }
    delay(10);
}
