/**
 * Remix Studio: types shared by the worker pipeline and the Studio page.
 *
 * A package turns 2-4 source properties into an ORIGINAL property and a
 * development pack: concept, poster, opening pages, a playable preview, and a
 * greenlight verdict that helps decide whether to make it.
 */

export const STUDIO_STEPS = ["concept", "poster", "screenplay", "preview", "verdict"] as const;
export type StudioStep = (typeof STUDIO_STEPS)[number];

export const STUDIO_FORMATS = ["Streaming Series", "Feature Film", "Animated Series", "Video Game", "Limited Series"] as const;
export type StudioFormat = (typeof STUDIO_FORMATS)[number];

/** "trailer" = a 60-90 second trailer; "scene" = the screenplay's opening, staged as a playable scene. */
export type PreviewKind = "trailer" | "scene";

export const STEP_LABELS: Record<StudioStep, string> = {
  concept: "Concept",
  poster: "Poster",
  screenplay: "Opening pages",
  preview: "Preview",
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

export type Beat = {
  seconds: number;
  visual: string;
  on_screen_text: string;
  audio: string;
  speaker: string;
  line: string;
};

export type Preview = {
  kind: PreviewKind;
  title: string;
  beats: Beat[];
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
  previewKind: PreviewKind;
  status: "running" | "done" | "error";
  concept: Concept | null;
  posterSvg: string | null;
  screenplay: string | null;
  preview: Preview | null;
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

/** Total runtime of a preview, in seconds. */
export function previewRuntime(preview: Preview): number {
  return preview.beats.reduce((sum, beat) => sum + Math.max(1, beat.seconds), 0);
}
