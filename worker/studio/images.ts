/**
 * Image generation for Remix Studio: OpenAI gpt-image renders the movie
 * poster and the sizzle keyframes; R2 stores them; /api/media serves them
 * from our own origin (so the browser can draw them on a canvas and export).
 */

export type ImageEnv = {
  OPENAI_API_KEY?: string;
  /** Defaults to gpt-image-1. Set to a newer gpt-image model when available. */
  IMAGE_MODEL?: string;
  /** low | medium | high. Defaults: poster high, keyframes medium. */
  IMAGE_QUALITY?: string;
  MEDIA?: R2Bucket;
};

export type ImageSize = "1024x1536" | "1536x1024";

export class ImageError extends Error {}

export async function generateImage(
  env: ImageEnv,
  prompt: string,
  size: ImageSize,
  quality: "low" | "medium" | "high",
  fetchImpl: typeof fetch = fetch,
): Promise<Uint8Array> {
  if (!env.OPENAI_API_KEY) throw new ImageError("no image key");
  const res = await fetchImpl("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: env.IMAGE_MODEL || "gpt-image-1",
      prompt: prompt.slice(0, 30000),
      size,
      quality: (env.IMAGE_QUALITY as typeof quality) || quality,
      n: 1,
    }),
  });
  const body = (await res.json().catch(() => null)) as { data?: { b64_json?: string }[]; error?: { message?: string } } | null;
  if (!res.ok) throw new ImageError(`image model ${res.status}: ${body?.error?.message ?? "request failed"}`.slice(0, 300));
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) throw new ImageError("image model returned no image");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Renders one image and stores it; returns its same-origin URL, or null on any failure. */
export async function renderToMedia(
  env: ImageEnv,
  key: string,
  prompt: string,
  size: ImageSize,
  quality: "low" | "medium" | "high",
  fetchImpl: typeof fetch = fetch,
): Promise<{ url: string | null; error: string | null; generated: boolean }> {
  if (!env.MEDIA) return { url: null, error: "no media bucket", generated: false };
  // generated is true once the image API returns an image (a billed call), even if storage fails.
  let generated = false;
  try {
    const bytes = await generateImage(env, prompt, size, quality, fetchImpl);
    generated = true;
    await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: "image/png" } });
    return { url: `/api/media/${key}`, error: null, generated };
  } catch (error) {
    return { url: null, error: error instanceof Error ? error.message : "image failed", generated };
  }
}
