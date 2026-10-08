/**
 * The NostalDamus scoring model. Pure functions only, so the Worker API, the
 * search agent's tools, and the browser all compute identical numbers.
 *
 * Revival Readiness = Social Buzz * 0.30 + Nostalgia Window Alignment * 0.40
 *                     + Modern Cultural Relevance * 0.30
 */

export type PropertyCategory =
  | "Movie"
  | "TV"
  | "Music"
  | "Video Game"
  | "Toy/Fad"
  | "Tech"
  | "Sports/Media";

export type TimingStage = "Pre-Peak" | "Sweet Spot" | "Mature";

export interface Property {
  id: string;
  name: string;
  year: number; // 1993-1998, the confirmed window
  category: PropertyCategory;
  genre: string;
  originalImpact: number;
  modernRelevance: number;
  socialBuzz: number;
  rightsComplexity: number;
  creatorAvailability: number;
  briefDescription: string;
  coreAudience: string;
  currentSignal: string;
  revivalFormat: string;
  tags: string[];
  preserve: string[];
  update: string[];
  rubricVersion?: string;
}

export interface PropertyScore extends Property {
  rank: number;
  nostalgiaAlignment: number;
  revivalReadinessScore: number;
  riskScore: number;
  timingStage: TimingStage;
  targetAudienceAge: number;
  launchWindow: string;
  recommendation: string;
}

/**
 * The year of the score, so the window moves each year (PR #5 removed the
 * fixed 2026). A function, not a constant: Cloudflare Workers report the 1970
 * epoch for any Date read at module load, which would zero every window score.
 */
export function currentYear(): number {
  return new Date().getUTCFullYear();
}
export const PEAK_CHILDHOOD_AGE = 12;
export const SWEET_SPOT_CENTER = 40;

export const CATEGORIES: PropertyCategory[] = ["Movie", "TV", "Music", "Video Game", "Toy/Fad", "Tech", "Sports/Media"];
export const TIMING_STAGES: TimingStage[] = ["Pre-Peak", "Sweet Spot", "Mature"];
export const YEARS = [1993, 1994, 1995, 1996, 1997, 1998];

export function getTargetAudienceAge(property: Pick<Property, "year">, atYear = currentYear()): number {
  return atYear - property.year + PEAK_CHILDHOOD_AGE;
}

export function getNostalgiaAlignment(property: Pick<Property, "year">, atYear = currentYear()): number {
  const distance = Math.abs(getTargetAudienceAge(property, atYear) - SWEET_SPOT_CENTER);
  return Math.max(0, Math.round(100 - distance * 8));
}

export function getTimingStage(property: Pick<Property, "year">): TimingStage {
  const age = getTargetAudienceAge(property);
  if (age < 35) return "Pre-Peak";
  if (age <= 45) return "Sweet Spot";
  return "Mature";
}

export function getLaunchWindow(property: Pick<Property, "year">): string {
  const age = getTargetAudienceAge(property);
  const now = currentYear();
  if (age < 35) return `${now + (35 - age)}-${now + (38 - age)}`;
  if (age <= 45) return `${now}-${now + Math.max(1, 45 - age)}`;
  return "Now, with legacy framing";
}

export function getRevivalReadinessScore(
  property: Pick<Property, "year" | "socialBuzz" | "modernRelevance">,
  atYear = currentYear(),
): number {
  return Math.round(
    property.socialBuzz * 0.3 + getNostalgiaAlignment(property, atYear) * 0.4 + property.modernRelevance * 0.3,
  );
}

export function getRiskScore(property: Pick<Property, "rightsComplexity" | "modernRelevance" | "creatorAvailability">): number {
  const rightsRisk = property.rightsComplexity * 0.45;
  const sensitivityRisk = Math.max(0, 80 - property.modernRelevance) * 0.25;
  const executionRisk = Math.max(0, 70 - property.creatorAvailability) * 0.3;
  return Math.min(100, Math.round(rightsRisk + sensitivityRisk + executionRisk));
}

export function getRecommendation(property: Property): string {
  const score = getRevivalReadinessScore(property);
  const risk = getRiskScore(property);
  if (score >= 88 && risk < 45) return "Greenlight exploration";
  if (score >= 78) return "Acquire option and validate fan thesis";
  if (score >= 68) return "Watchlist with social listening";
  return "Archive until stronger signal emerges";
}

export function scoreProperty(property: Property, index = 0): PropertyScore {
  return {
    ...property,
    rank: index + 1,
    nostalgiaAlignment: getNostalgiaAlignment(property),
    revivalReadinessScore: getRevivalReadinessScore(property),
    riskScore: getRiskScore(property),
    timingStage: getTimingStage(property),
    targetAudienceAge: getTargetAudienceAge(property),
    launchWindow: getLaunchWindow(property),
    recommendation: getRecommendation(property),
  };
}

/** Scores every property and ranks by readiness (ties broken by name). */
export function scoreAll(list: Property[]): PropertyScore[] {
  return list
    .map((property) => scoreProperty(property))
    .sort((a, b) => b.revivalReadinessScore - a.revivalReadinessScore || a.name.localeCompare(b.name))
    .map((property, index) => ({ ...property, rank: index + 1 }));
}

/** Readiness for each year 2020-2032, used by the nostalgia curve chart. */
export function getNostalgiaCurve(property: Property) {
  return Array.from({ length: 13 }, (_, index) => {
    const year = 2020 + index;
    return {
      year,
      age: getTargetAudienceAge(property, year),
      alignment: getNostalgiaAlignment(property, year),
      readiness: getRevivalReadinessScore(property, year),
    };
  });
}
