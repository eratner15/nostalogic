/**
 * Browser-side property data. The bundled library is the committed snapshot of
 * the D1 corpus (data/corpus.json), so static pages render the same 120
 * properties the API serves. Scoring lives in src/lib/scoring.ts and is shared
 * with the Worker and the search agent.
 */
import corpus from "../../data/corpus.json";
import {
  CURRENT_YEAR,
  getNostalgiaCurve as curve,
  scoreAll,
  type Property,
  type PropertyCategory,
  type PropertyScore,
  type TimingStage,
} from "@/lib/scoring";

export { scoreAll, scoreProperty } from "@/lib/scoring";
export type { Property, PropertyCategory, PropertyScore, TimingStage } from "@/lib/scoring";

export type RebootType = "Movie" | "TV Show" | "Video Game" | "Toys" | "Streaming Series" | "Live Event";

export interface PropertyFilters {
  category?: PropertyCategory | "All";
  year?: string;
  query?: string;
  timing?: TimingStage | "All";
}

export const properties: Property[] = corpus as Property[];

export const categories: (PropertyCategory | "All")[] = ["All", "Movie", "TV", "Music", "Video Game", "Toy/Fad", "Tech", "Sports/Media"];
export const years = ["All", "1993", "1994", "1995", "1996", "1997", "1998"];

/**
 * Live library from the API, with the bundled list as the offline fallback.
 * The API returns camelCase Property fields; anything extra is ignored.
 */
export async function fetchPropertiesFromApi(): Promise<Property[] | null> {
  try {
    const res = await fetch("/api/properties", { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { properties?: Property[] };
    if (!data.properties || data.properties.length === 0) return null;
    return data.properties;
  } catch {
    return null;
  }
}

export function getPropertiesFrom(list: PropertyScore[], filters: PropertyFilters = {}): PropertyScore[] {
  const query = filters.query?.trim().toLowerCase();
  return list.filter((property) => {
    const categoryMatches = !filters.category || filters.category === "All" || property.category === filters.category;
    const yearMatches = !filters.year || filters.year === "All" || String(property.year) === filters.year;
    const timingMatches = !filters.timing || filters.timing === "All" || property.timingStage === filters.timing;
    const queryMatches =
      !query ||
      [property.name, property.genre, property.briefDescription, property.tags.join(" "), property.currentSignal]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return categoryMatches && yearMatches && timingMatches && queryMatches;
  });
}

export const scoredProperties: PropertyScore[] = scoreAll(properties);

export function getProperty(id: string): PropertyScore | undefined {
  return scoredProperties.find((property) => property.id === id);
}

export function getFeaturedProperties(limit = 6): PropertyScore[] {
  return scoredProperties.slice(0, limit);
}

export function getProperties(filters: PropertyFilters = {}): PropertyScore[] {
  return getPropertiesFrom(scoredProperties, filters);
}

export function getCategoryStats() {
  return categories
    .filter((category): category is PropertyCategory => category !== "All")
    .map((category) => {
      const categoryProperties = scoredProperties.filter((property) => property.category === category);
      const average =
        categoryProperties.reduce((sum, property) => sum + property.revivalReadinessScore, 0) /
        categoryProperties.length;
      return {
        category,
        count: categoryProperties.length,
        average: Math.round(average),
        top: categoryProperties[0],
      };
    })
    .sort((a, b) => b.average - a.average);
}

export function getNostalgiaCurve(property: PropertyScore) {
  return curve(property);
}

export function getModernizationRecommendations(property: PropertyScore): string[] {
  return [
    `Preserve ${property.preserve[0]} as the emotional contract for original fans.`,
    `Update ${property.update[0]} so the revival feels native to ${CURRENT_YEAR} rather than costumed in 1995.`,
    `Package as a ${property.revivalFormat} with a launch window of ${property.launchWindow}.`,
    `Use ${property.currentSignal.toLowerCase()} as the top-of-funnel marketing signal.`,
    `De-risk rights and execution early: current model risk is ${property.riskScore}/100.`,
  ];
}

const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

const average = (items: number[]): number =>
  items.length ? Math.round(items.reduce((sum, item) => sum + item, 0) / items.length) : 0;

const conceptTitles = [
  "Signal Arcade",
  "The Neon Covenant",
  "Pocket Universe",
  "After School Protocol",
  "Prime Time Ghosts",
  "The Memory Engine",
  "Saturday Night Upload",
  "Mallworld",
  "The Rewind Society",
  "Analog Hearts",
];

export function generateCompositePitch(properties: PropertyScore[], format: RebootType = "Streaming Series") {
  const sources = properties.slice(0, 5);
  const primary = sources[0] || scoredProperties[0];
  const categories = unique(sources.map((property) => property.category));
  const tags = unique(sources.flatMap((property) => property.tags));
  const preserve = unique(sources.flatMap((property) => property.preserve)).slice(0, 6);
  const update = unique(sources.flatMap((property) => property.update)).slice(0, 6);
  const categoryBonus = Math.min(8, Math.max(0, categories.length - 1) * 3);
  const signalBonus = Math.min(6, Math.max(0, sources.length - 2) * 2);
  const compositeScore = Math.min(
    100,
    average(sources.map((property) => property.revivalReadinessScore)) + categoryBonus + signalBonus
  );
  const riskScore = Math.min(
    100,
    average(sources.map((property) => property.riskScore)) + Math.max(0, sources.length - 3) * 4
  );
  const titleSeed = sources.reduce((sum, property) => sum + property.name.length + property.year, 0);
  const title = conceptTitles[titleSeed % conceptTitles.length];
  const sourceNames = sources.map((property) => property.name);
  const spine = preserve[0] || primary.preserve[0];
  const modernFrame = update[0] || primary.update[0];
  const sourcePhrase = sourceNames.length > 1
    ? `${sourceNames.slice(0, -1).join(", ")} and ${sourceNames[sourceNames.length - 1]}`
    : sourceNames[0];

  return {
    title,
    subtitle: `A new ${format.toLowerCase()} synthesized from ${sourcePhrase}`,
    logline: `${title} is a new ${format.toLowerCase()} that fuses ${spine}, ${preserve[1] || "90s emotional familiarity"}, and ${tags.slice(0, 3).join("/")} iconography into an original franchise built around ${modernFrame}.`,
    compositeScore,
    riskScore,
    categories,
    tags: tags.slice(0, 8),
    audience: `Primary buyers are ${unique(sources.map((property) => property.coreAudience.split(",")[0])).join(", ")}, with Gen Z and Gen Alpha entry points through ${unique(sources.map((property) => property.currentSignal.toLowerCase())).slice(0, 3).join("; ")}.`,
    world: [
      `Core emotional promise: preserve ${spine} while avoiding a literal crossover that would multiply rights exposure.`,
      `World engine: combine ${categories.join(", ")} behaviors into a repeatable franchise loop instead of a one-off nostalgia sketch.`,
      `Visual language: borrow the audience memory of ${tags.slice(0, 4).join(", ")} without copying protected expression.`,
    ],
    mechanics: [
      `Hero loop: every episode or act remixes ${preserve[1] || spine} through a present-day pressure point: ${modernFrame}.`,
      `Fan entry: launch with source-coded teasers for ${sourceNames.slice(0, 3).join(", ")} communities, then reveal the original title.`,
      `Merch/product wedge: build around ${tags.includes("toy") || tags.includes("collectible") ? "collectible drops and physical-digital ownership" : tags.includes("game") ? "interactive missions and co-op challenges" : "soundtrack, wardrobe, and quote-ready scenes"}.`,
    ],
    launch: [
      `Phase 1: publish a "nostalgia DNA" teaser campaign that hints at ${preserve.slice(0, 3).join(", ")} without naming the sources.`,
      `Phase 2: test three audience cuts: original fans, genre-native younger viewers, and parents sharing 90s culture with kids.`,
      `Phase 3: release the ${format.toLowerCase()} with companion shorts that explain the new mythology, not the reference list.`,
    ],
    preserve,
    update,
    risk: riskScore >= 55
      ? "High concept strength, but rights hygiene and tonal coherence need early legal and creative guardrails."
      : "Strong synthesis opportunity. Biggest risk is making the references too visible instead of letting the new property stand alone.",
  };
}
