"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clapperboard, Download, Loader2, Music2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { sizzleRuntime, type CameraMove, type Sizzle } from "@/lib/studio";

type Aspect = "wide" | "vertical";
/** wide: 16:9 with a 2.39:1 letterbox. vertical: 9:16 full-bleed for TikTok, Reels, and Shorts. */
const FRAME: Record<Aspect, { w: number; h: number; bar: number }> = {
  wide: { w: 1280, h: 720, bar: Math.round((720 - 1280 / 2.39) / 2) },
  vertical: { w: 720, h: 1280, bar: 0 },
};
const WATERMARK = "NOSTALDAMUS STUDIO";
const FADE = 0.6; // seconds of crossfade into the next shot

type Timed = { start: number; end: number };

function cameraTransform(move: CameraMove, p: number) {
  const e = p * p * (3 - 2 * p); // smoothstep
  switch (move) {
    case "push_in": return { s: 1.02 + 0.12 * e, x: 0, y: 0 };
    case "pull_out": return { s: 1.14 - 0.12 * e, x: 0, y: 0 };
    case "pan_left": return { s: 1.12, x: 50 - 100 * e, y: 0 };
    case "pan_right": return { s: 1.12, x: -50 + 100 * e, y: 0 };
    case "tilt_up": return { s: 1.12, x: 0, y: 34 - 68 * e };
    case "tilt_down": return { s: 1.12, x: 0, y: -34 + 68 * e };
    default: return { s: 1.04 + 0.02 * e, x: 0, y: 0 };
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** A small generative score: a low pad plus a hit on every cut. Runs on Web Audio. */
class Score {
  ctx: AudioContext;
  out: GainNode;
  dest: MediaStreamAudioDestinationNode;
  private pad: OscillatorNode[] = [];
  constructor() {
    this.ctx = new AudioContext();
    this.out = this.ctx.createGain();
    this.out.gain.value = 0.9;
    this.dest = this.ctx.createMediaStreamDestination();
    this.out.connect(this.ctx.destination);
    this.out.connect(this.dest);
  }
  start() {
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 2.5);
    filter.connect(g).connect(this.out);
    for (const [f, type] of [[55, "sawtooth"], [55.6, "sawtooth"], [82.4, "triangle"]] as const) {
      const o = this.ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.connect(filter);
      o.start();
      this.pad.push(o);
    }
  }
  hit(big = false) {
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(big ? 120 : 90, t);
    o.frequency.exponentialRampToValueAtTime(38, t + (big ? 0.9 : 0.4));
    g.gain.setValueAtTime(big ? 0.55 : 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (big ? 1.4 : 0.5));
    o.connect(g).connect(this.out);
    o.start(t);
    o.stop(t + 1.5);
  }
  stop() {
    this.pad.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
    this.pad = [];
    this.ctx.close().catch(() => {});
  }
}

export function SizzlePlayer({ sizzle, images }: { sizzle: Sizzle; images: (string | null)[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const loaded = useRef<(HTMLImageElement | null)[]>([]);
  const raf = useRef<number | null>(null);
  const clock = useRef({ startedAt: 0, offset: 0 });
  const lastShot = useRef(-1);
  const score = useRef<Score | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [music, setMusic] = useState(true);
  const [voice, setVoice] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(0);
  const [aspect, setAspect] = useState<Aspect>("wide");
  const { w: W, h: H, bar: BAR } = FRAME[aspect];
  const vertical = aspect === "vertical";

  const total = sizzleRuntime(sizzle);
  const timeline: Timed[] = useMemo(() => {
    let t = 0;
    return sizzle.shots.map((s) => { const start = t; t += Math.max(1, s.seconds); return { start, end: t }; });
  }, [sizzle]);

  // Load keyframes (same-origin, so the canvas stays exportable).
  useEffect(() => {
    loaded.current = images.map(() => null);
    images.forEach((src, i) => {
      if (!src) return;
      const img = new Image();
      img.onload = () => { loaded.current[i] = img; setReady((n) => n + 1); };
      img.src = src;
    });
  }, [images]);

  const displayFont = useMemo(() => {
    if (typeof window === "undefined") return "Georgia, serif";
    return getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "Georgia, serif";
  }, []);

  const drawShot = useCallback((ctx: CanvasRenderingContext2D, i: number, p: number, alpha: number) => {
    const shot = sizzle.shots[i];
    const img = loaded.current[i];
    ctx.save();
    ctx.globalAlpha = alpha;
    if (img) {
      const { s, x, y } = cameraTransform(shot.camera, p);
      const cover = Math.max(W / img.width, H / img.height) * s;
      const dw = img.width * cover;
      const dh = img.height * cover;
      ctx.drawImage(img, (W - dw) / 2 + x, (H - dh) / 2 + y, dw, dh);
    } else {
      // No keyframe: a styled card with the shot description.
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#15130f");
      g.addColorStop(1, "#2a2418");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(237,230,214,0.6)";
      ctx.font = "italic 26px Georgia, serif";
      ctx.textAlign = "center";
      wrap(ctx, shot.image_prompt, Math.min(860, W - 120)).slice(0, 5).forEach((l, n, arr) => ctx.fillText(l, W / 2, H / 2 - (arr.length - 1) * 18 + n * 36));
    }
    if (shot.on_screen_text) {
      ctx.fillStyle = `rgba(0,0,0,${0.5 * Math.min(1, p * 3)})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }, [sizzle, W, H]);

  const draw = useCallback((t: number) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const i = Math.max(0, timeline.findIndex((s) => t < s.end));
    const idx = t >= total ? sizzle.shots.length - 1 : i;
    const shot = sizzle.shots[idx];
    const span = timeline[idx];
    const p = Math.min(1, (t - span.start) / (span.end - span.start));
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    drawShot(ctx, idx, p, 1);
    const left = span.end - t;
    if (left < FADE && idx + 1 < sizzle.shots.length) drawShot(ctx, idx + 1, 0, 1 - left / FADE);

    // Letterbox.
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, BAR);
    ctx.fillRect(0, H - BAR, W, BAR);

    // Title card: fade in, slow tracking.
    if (shot.on_screen_text) {
      const a = Math.min(1, p * 2.5) * Math.min(1, (1 - p) * 6);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = "#f2ede0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const size = vertical ? (shot.on_screen_text.length > 14 ? 54 : 76) : shot.on_screen_text.length > 22 ? 64 : 92;
      ctx.font = `500 ${size}px ${displayFont}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${(2 + 6 * p).toFixed(1)}px`;
      wrap(ctx, shot.on_screen_text.toUpperCase(), W - (vertical ? 100 : 200)).slice(0, vertical ? 3 : 2).forEach((l, n, arr) => ctx.fillText(l, W / 2, H / 2 + (n - (arr.length - 1) / 2) * size * 1.1));
      ctx.restore();
    }

    // Subtitles in the lower letterbox.
    if (shot.line) {
      const a = Math.min(1, p * 6) * Math.min(1, (1 - p) * 8);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${vertical ? 34 : 26}px Inter, system-ui, sans-serif`;
      const text = shot.speaker && shot.speaker !== "NARRATOR" ? `${shot.speaker}: ${shot.line}` : shot.line;
      const lineHeight = vertical ? 44 : 30;
      const lines = wrap(ctx, text, W - (vertical ? 100 : 240)).slice(0, vertical ? 3 : 2);
      // Vertical has no letterbox: captions sit in the lower third on a dark band.
      const centerY = vertical ? H * 0.74 : H - BAR / 2;
      if (vertical) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, centerY - (lines.length * lineHeight) / 2 - 18, W, lines.length * lineHeight + 36);
      }
      ctx.fillStyle = "#ffffff";
      lines.forEach((l, n) => ctx.fillText(l, W / 2, centerY + (n - (lines.length - 1) / 2) * lineHeight));
      ctx.restore();
    }

    // Watermark, so a reposted clip still points back to the studio.
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#f2ede0";
    ctx.font = `500 ${vertical ? 20 : 14}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "3px";
    ctx.textAlign = vertical ? "center" : "right";
    ctx.fillText(WATERMARK, vertical ? W / 2 : W - 28, vertical ? 64 : BAR / 2);
    ctx.restore();
  }, [timeline, total, sizzle, drawShot, displayFont, W, H, BAR, vertical]);

  // First frame, and redraw when images arrive.
  useEffect(() => { if (!playing) draw(time); }, [draw, ready, playing, time]);

  const speak = useCallback((text: string) => {
    if (!voice || !text) return;
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } catch { /* no speech */ }
  }, [voice]);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    score.current?.stop();
    score.current = null;
    try { window.speechSynthesis.cancel(); } catch { /* no speech */ }
    setPlaying(false);
  }, []);

  const play = useCallback((from: number, withMusic: boolean, onEnd?: () => void) => {
    stop();
    if (withMusic) { score.current = new Score(); score.current.start(); }
    clock.current = { startedAt: performance.now(), offset: from };
    lastShot.current = -1;
    setPlaying(true);
    const tick = () => {
      const t = clock.current.offset + (performance.now() - clock.current.startedAt) / 1000;
      if (t >= total) {
        draw(total - 0.001);
        setTime(total);
        stop();
        onEnd?.();
        return;
      }
      const idx = timeline.findIndex((s) => t < s.end);
      if (idx !== lastShot.current) {
        lastShot.current = idx;
        score.current?.hit(Boolean(sizzle.shots[idx]?.on_screen_text));
        speak(sizzle.shots[idx]?.line ?? "");
      }
      draw(t);
      setTime(t);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [stop, total, draw, timeline, sizzle, speak]);

  useEffect(() => () => stop(), [stop]);

  const exportVideo = () => {
    const el = canvas.current;
    if (!el || exporting || typeof MediaRecorder === "undefined") return;
    setExporting(true);
    const stream = el.captureStream(30);
    // Music is recorded; browser speech is not capturable, so the export carries subtitles instead.
    play(0, true, () => recorder.current?.stop());
    const audio = score.current?.dest.stream.getAudioTracks() ?? [];
    audio.forEach((track) => stream.addTrack(track));
    const type = ["video/mp4;codecs=avc1,mp4a", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
    const rec = new MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 6_000_000 } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: rec.mimeType || "video/webm" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${sizzle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-sizzle${vertical ? "-vertical" : ""}.${blob.type.includes("mp4") ? "mp4" : "webm"}`;
      a.click();
      setExporting(false);
    };
    recorder.current = rec;
    rec.start(250);
  };

  const motionPrompt = () => {
    const origin = window.location.origin;
    const lines = sizzle.shots.map((s, i) => {
      const parts = [`${i + 1}. ${s.seconds}s, camera ${s.camera.replace("_", " ")}.`];
      if (images[i]) parts.push(`Keyframe image: ${origin}${images[i]}`);
      else parts.push(`Visual: ${s.image_prompt}`);
      if (s.on_screen_text) parts.push(`Title card: "${s.on_screen_text}".`);
      if (s.line) parts.push(`${s.speaker || "Voice"}: "${s.line}" (show as a caption).`);
      if (s.music) parts.push(`Sound: ${s.music}.`);
      return parts.join(" ");
    });
    return `/motion Make a ${total}-second cinematic sizzle reel for "${sizzle.title}", tagline "${sizzle.tagline}". 16:9 with 2.39:1 letterbox bars, slow camera moves on each still, 0.6-second crossfades, bold serif title cards, captions in the lower bar. Look: ${sizzle.style_bible}\n\nShots:\n${lines.join("\n")}\n\nEnd on the title card, then the tagline.`;
  };

  const shotIndex = Math.max(0, timeline.findIndex((s) => time < s.end));
  const imageCount = images.filter(Boolean).length;

  return (
    <section className="scan-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="eyebrow">Sizzle reel · {total}s · {sizzle.shots.length} shots</p>
          <h2 className="display mt-1 text-2xl">{sizzle.title}</h2>
        </div>
        <span className="chip">{imageCount ? `${imageCount} generated keyframes` : "Text cards (no image model)"}</span>
      </div>
      <div className="p-5">
        <canvas ref={canvas} width={W} height={H} className={cn("mx-auto block w-full rounded-md bg-black", vertical ? "aspect-[9/16] max-w-xs" : "aspect-video max-w-4xl")} />
        <div className="mx-auto mt-2 flex h-1 max-w-4xl gap-px">
          {timeline.map((s, i) => (
            <button
              key={i}
              onClick={() => { const t = s.start + 0.01; setTime(t); if (playing) play(t, music); else draw(t); }}
              style={{ flexGrow: s.end - s.start }}
              aria-label={`Jump to shot ${i + 1}`}
              className={cn("h-full rounded-full", time >= s.end ? "bg-primary" : i === shotIndex ? "bg-primary/60" : "bg-muted")}
            />
          ))}
        </div>
        <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => (playing ? stop() : play(time >= total ? 0 : time, music))}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Pause" : "Play sizzle"}
            </button>
            <button onClick={() => { stop(); setTime(0); draw(0); }} className="rounded border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Restart"><RotateCcw className="h-4 w-4" /></button>
            <button onClick={() => setMusic((m) => !m)} className={cn("inline-flex items-center gap-1.5 rounded border px-2.5 py-2 text-xs", music ? "border-primary/50 text-primary" : "border-border text-muted-foreground")}><Music2 className="h-3.5 w-3.5" /> Score</button>
            <div className="inline-flex overflow-hidden rounded border border-border text-xs" role="group" aria-label="Frame">
              {(["wide", "vertical"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => { if (a !== aspect) { stop(); setAspect(a); } }}
                  disabled={exporting}
                  aria-pressed={aspect === a}
                  className={cn("px-2.5 py-2", aspect === a ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                  {a === "wide" ? "16:9" : "9:16"}
                </button>
              ))}
            </div>
            <button onClick={() => setVoice((v) => !v)} className={cn("inline-flex items-center gap-1.5 rounded border px-2.5 py-2 text-xs", voice ? "border-primary/50 text-primary" : "border-border text-muted-foreground")}>{voice ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />} Voice</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{Math.floor(time)}s / {total}s</span>
            <button onClick={exportVideo} disabled={exporting} className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60">
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} {exporting ? "Recording…" : "Export video"}
            </button>
            <button
              onClick={async () => { try { await navigator.clipboard.writeText(motionPrompt()); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ } }}
              className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
              title="A /motion prompt for Claude Motion in claude.ai, with these shots and keyframes"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />} {copied ? "Copied" : "Claude Motion prompt"}
            </button>
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-4xl text-xs leading-5 text-muted-foreground">
          Export records the sizzle in real time with the score and burned-in captions (browser voice cannot be recorded). Pick 9:16 for TikTok, Reels, and Shorts. For a polished MP4, paste the Claude Motion prompt into claude.ai with /motion.
        </p>
        <details className="mx-auto mt-4 max-w-4xl text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Shot list</summary>
          <ol className="mt-3 divide-y divide-border rounded-md border border-border">
            {sizzle.shots.map((s, i) => (
              <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3 px-3 py-2">
                <span className="font-mono text-xs text-muted-foreground">{s.seconds}s · {s.camera.replace("_", " ")}</span>
                <span className="leading-6 text-muted-foreground">
                  {s.image_prompt}
                  {s.on_screen_text && <> <span className="chip">{s.on_screen_text}</span></>}
                  {s.line && <><br /><span className="text-foreground">{s.speaker ? `${s.speaker}: ` : ""}{s.line}</span></>}
                </span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}

