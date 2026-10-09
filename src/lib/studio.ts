/**
 * Remix Studio: types shared by the worker pipeline and the Studio page.
 *
 * A package turns 2-4 source properties into an ORIGINAL property and a
 * development pack: concept, opening pages, a sizzle reel (shot list plus
 * generated keyframes), a movie poster, and a greenlight verdict that helps
 * decide whether to make it.
 */

export const STUDIO_STEPS = ["concept", "screenplay", "sizzle", "art", "verdict"] as const;
export type StudioStep = (typeof STUDIO_STEPS)[number];

export const STUDIO_FORMATS = ["Streaming Series", "Feature Film", "Animated Series", "Video Game", "Limited Series"] as const;
export type StudioFormat = (typeof STUDIO_FORMATS)[number];

export const STEP_LABELS: Record<StudioStep, string> = {
  concept: "Concept",
  screenplay: "Opening pages",
  sizzle: "Sizzle shot list",
  art: "Poster and keyframes",
  verdict: "Greenlight verdict",
};

export type Concept = {
  title: string;
  logline: string;
  format: string;
  tone: string;
  audience: string;
  premise: string;
  world: string;
  story_engine: string;
  characters: { name: string; role: string; description: string }[];
  borrowed_mechanics: { source: string; mechanic: string }[];
  new_elements: string[];
  visual_style: string;
  risks: string[];
};

export const CAMERA_MOVES = ["push_in", "pull_out", "pan_left", "pan_right", "tilt_up", "tilt_down", "static"] as const;
export type CameraMove = (typeof CAMERA_MOVES)[number];

export type SizzleShot = {
  seconds: number;
  image_prompt: string;
  camera: CameraMove;
  on_screen_text: string;
  speaker: string;
  line: string;
  music: string;
};

export type Sizzle = {
  title: string;
  tagline: string;
  /** Prepended to every image prompt so the keyframes share one look and cast. */
  style_bible: string;
  poster_prompt: string;
  shots: SizzleShot[];
};

/** What the art step produced. Image URLs are same-origin (/api/media/...). */
export type Art = {
  posterImage: string | null;
  /** The SVG one-sheet, used when no image model is configured or the image failed. */
  posterSvg: string | null;
  shotImages: (string | null)[];
  /** Why images are missing, if they are. */
  note: string | null;
};

export type Verdict = {
  verdict: "develop" | "revise" | "pass";
  summary: string;
  scores: { dimension: string; score: number; note: string }[];
  strengths: string[];
  concerns: string[];
  rights_flags: string[];
  next_steps: string[];
  audience_test_questions: string[];
};

export type StudioPackage = {
  id: string;
  propertyIds: string[];
  format: string;
  status: "running" | "done" | "error";
  concept: Concept | null;
  screenplay: string | null;
  sizzle: Sizzle | null;
  art: Art | null;
  verdict: Verdict | null;
  error: string | null;
  createdAt: string;
};

export type StudioEvent =
  | { type: "started"; id: string }
  | { type: "step"; step: StudioStep }
  | { type: "result"; step: StudioStep; data: unknown }
  | { type: "error"; step?: StudioStep; message: string }
  | { type: "done"; id: string };

/** Total runtime of a sizzle, in seconds. */
export function sizzleRuntime(sizzle: Sizzle): number {
  return sizzle.shots.reduce((sum, shot) => sum + Math.max(1, shot.seconds), 0);
}
