/**
 * Share cards for Studio packs. A link to /studio/?id=... unfurls in social
 * apps and chat with the pack's title, logline, and poster, so each pack
 * carries its own preview instead of the generic site card.
 */
import type { Art, Concept, Sizzle } from "../../src/lib/studio";

export type ShareCard = { title: string; description: string; image: string | null; url: string };

const parse = <T>(v: unknown): T | null => {
  if (typeof v !== "string" || !v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
};

export function shareCard(row: { concept?: unknown; sizzle?: unknown; art?: unknown }, origin: string, id: string): ShareCard | null {
  const concept = parse<Concept>(row.concept);
  if (!concept?.title) return null;
  const sizzle = parse<Sizzle>(row.sizzle);
  const art = parse<Art>(row.art);
  const poster = art?.posterImage?.startsWith("/api/media/") ? `${origin}${art.posterImage}` : null;
  return {
    title: concept.title.slice(0, 120),
    description: [sizzle?.tagline, concept.logline].filter(Boolean).join(" ").slice(0, 300),
    image: poster,
    url: `${origin}/studio/?id=${id}`,
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function shareTags(card: ShareCard): string {
  const title = `${card.title} · NostalDamus Studio`;
  const tags: [string, string, string][] = [
    ["name", "description", card.description],
    ["property", "og:type", "video.other"],
    ["property", "og:title", title],
    ["property", "og:description", card.description],
    ["property", "og:url", card.url],
    ["name", "twitter:card", card.image ? "summary_large_image" : "summary"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", card.description],
  ];
  if (card.image) {
    tags.push(["property", "og:image", card.image], ["property", "og:image:width", "1024"], ["property", "og:image:height", "1536"], ["name", "twitter:image", card.image]);
  }
  return tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${esc(value)}">`).join("");
}
