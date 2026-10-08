/**
 * Search-agent tools over the scored property library.
 *
 * The library is small (hundreds of rows), so each request loads it once from
 * D1 and every tool runs in memory over the scored array. That keeps the tools
 * pure, deterministic, and testable without a database.
 */
import type Anthropic from "@anthropic-ai/sdk";
import {
  CATEGORIES,
  TIMING_STAGES,
  type PropertyCategory,
  type PropertyScore,
  type TimingStage,
} from "../../src/lib/scoring";

export type ToolName = "search_library" | "get_properties" | "compare_properties" | "library_overview" | "find_similar";

export type ToolOutcome = {
  /** JSON-serializable payload returned to the model. */
  result: unknown;
  /** Property ids the result surfaced, for citation chips in the UI. */
  ids: string[];
  /** One-line human summary for the visible trace. */
  summary: string;
  isError?: boolean;
};

const SORT_KEYS = ["readiness", "risk", "year", "buzz", "relevance", "impact", "match"] as const;
type SortKey = (typeof SORT_KEYS)[number];

export const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_library",
    description:
      "Search the scored 1993-1998 property library. Combine a free-text query with structured filters. " +
      "Free text matches name, genre, description, tags, audience, and current signal; every query word that " +
      "appears counts as a hit, so use a few distinctive words rather than a sentence. Returns compact rows " +
      "plus total_matches. Call it several times with different filters when one search is not enough.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Distinctive words, e.g. 'horror teen' or 'handheld pet'. Omit to filter only." },
        categories: { type: "array", items: { type: "string", enum: CATEGORIES }, description: "Restrict to these categories." },
        year_min: { type: "integer", minimum: 1993, maximum: 1998 },
        year_max: { type: "integer", minimum: 1993, maximum: 1998 },
        timing_stage: { type: "string", enum: TIMING_STAGES, description: "Audience-age stage relative to the 35-45 sweet spot." },
        min_readiness: { type: "integer", minimum: 0, maximum: 100 },
        max_risk: { type: "integer", minimum: 0, maximum: 100 },
        sort_by: { type: "string", enum: [...SORT_KEYS], description: "Default: match when a query is given, else readiness." },
        limit: { type: "integer", minimum: 1, maximum: 25, description: "Default 10." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_properties",
    description:
      "Fetch full records (description, audience, signal, preserve/update guidance, all score inputs) for 1-5 property ids.",
    input_schema: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 } },
      required: ["ids"],
      additionalProperties: false,
    },
  },
  {
    name: "compare_properties",
    description: "Side-by-side metrics for 2-6 property ids, with the leader on each metric.",
    input_schema: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 } },
      required: ["ids"],
      additionalProperties: false,
    },
  },
  {
    name: "library_overview",
    description: "Aggregate statistics grouped by category, year, or timing stage: count, average readiness and risk, and the top property in each group.",
    input_schema: {
      type: "object",
      properties: { group_by: { type: "string", enum: ["category", "year", "timing_stage"] } },
      required: ["group_by"],
      additionalProperties: false,
    },
  },
  {
    name: "find_similar",
    description:
      "Find properties similar to one id by shared tags, genre words, and audience overlap. Set different_category " +
      "to true to find cross-category remix partners.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        different_category: { type: "boolean" },
        limit: { type: "integer", minimum: 1, maximum: 10, description: "Default 5." },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
];

const STOPWORDS = new Set(
  "a an and are as at be best by for from has have in into is it its me most of on or show tell than that the their them these this to what which who with".split(" "),
);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9/]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function haystack(p: PropertyScore): string {
  return [p.name, p.genre, p.category, p.briefDescription, p.coreAudience, p.currentSignal, p.revivalFormat, ...p.tags]
    .join(" ")
    .toLowerCase();
}

function compact(p: PropertyScore) {
  return {
    id: p.id,
    name: p.name,
    year: p.year,
    category: p.category,
    genre: p.genre,
    readiness: p.revivalReadinessScore,
    risk: p.riskScore,
    timing: p.timingStage,
    signal: p.currentSignal.length > 160 ? `${p.currentSignal.slice(0, 157)}...` : p.currentSignal,
    tags: p.tags.slice(0, 5),
  };
}

function full(p: PropertyScore) {
  return {
    ...compact(p),
    signal: p.currentSignal,
    rank: p.rank,
    description: p.briefDescription,
    coreAudience: p.coreAudience,
    revivalFormat: p.revivalFormat,
    tags: p.tags,
    preserve: p.preserve,
    update: p.update,
    inputs: {
      socialBuzz: p.socialBuzz,
      modernRelevance: p.modernRelevance,
      nostalgiaAlignment: p.nostalgiaAlignment,
      originalImpact: p.originalImpact,
      rightsComplexity: p.rightsComplexity,
      creatorAvailability: p.creatorAvailability,
    },
    targetAudienceAge: p.targetAudienceAge,
    launchWindow: p.launchWindow,
    recommendation: p.recommendation,
    rubricVersion: p.rubricVersion,
  };
}

const num = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback;
  return Math.min(hi, Math.max(lo, n));
};

const stringIds = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, max) : [];

function lookup(library: PropertyScore[], ids: string[]) {
  const byId = new Map(library.map((p) => [p.id, p]));
  const found = ids.map((id) => byId.get(id)).filter((p): p is PropertyScore => Boolean(p));
  const missing = ids.filter((id) => !byId.has(id));
  return { found, missing };
}

function searchLibrary(library: PropertyScore[], input: Record<string, unknown>): ToolOutcome {
  const queryWords = typeof input.query === "string" ? words(input.query) : [];
  const categories = stringIds(input.categories, 7).filter((c): c is PropertyCategory => CATEGORIES.includes(c as PropertyCategory));
  const yearMin = num(input.year_min, 1993, 1998, 1993);
  const yearMax = num(input.year_max, 1993, 1998, 1998);
  const stage = TIMING_STAGES.includes(input.timing_stage as TimingStage) ? (input.timing_stage as TimingStage) : null;
  const minReadiness = num(input.min_readiness, 0, 100, 0);
  const maxRisk = num(input.max_risk, 0, 100, 100);
  const limit = num(input.limit, 1, 25, 10);
  const sortBy: SortKey = SORT_KEYS.includes(input.sort_by as SortKey)
    ? (input.sort_by as SortKey)
    : queryWords.length ? "match" : "readiness";

  const scored = library
    .filter((p) =>
      (!categories.length || categories.includes(p.category)) &&
      p.year >= yearMin && p.year <= yearMax &&
      (!stage || p.timingStage === stage) &&
      p.revivalReadinessScore >= minReadiness &&
      p.riskScore <= maxRisk)
    .map((p) => {
      if (!queryWords.length) return { p, hits: 0 };
      const hay = haystack(p);
      const name = p.name.toLowerCase();
      // A word in the name counts double: "tamagotchi" should beat a passing mention.
      const hits = queryWords.reduce((n, w) => n + (hay.includes(w) ? 1 : 0) + (name.includes(w) ? 1 : 0), 0);
      return { p, hits };
    })
    .filter(({ hits }) => !queryWords.length || hits > 0);

  const metric: Record<Exclude<SortKey, "match">, (p: PropertyScore) => number> = {
    readiness: (p) => p.revivalReadinessScore,
    risk: (p) => -p.riskScore, // lowest risk first
    year: (p) => -p.year, // oldest first
    buzz: (p) => p.socialBuzz,
    relevance: (p) => p.modernRelevance,
    impact: (p) => p.originalImpact,
  };
  scored.sort((a, b) =>
    sortBy === "match"
      ? b.hits - a.hits || b.p.revivalReadinessScore - a.p.revivalReadinessScore
      : metric[sortBy](b.p) - metric[sortBy](a.p) || b.p.revivalReadinessScore - a.p.revivalReadinessScore,
  );

  const rows = scored.slice(0, limit).map(({ p }) => compact(p));
  const filters = [
    queryWords.length ? `"${queryWords.join(" ")}"` : null,
    categories.length ? categories.join("/") : null,
    yearMin > 1993 || yearMax < 1998 ? `${yearMin}-${yearMax}` : null,
    stage,
    minReadiness ? `readiness>=${minReadiness}` : null,
    maxRisk < 100 ? `risk<=${maxRisk}` : null,
  ].filter(Boolean);
  return {
    result: { total_matches: scored.length, sort_by: sortBy, results: rows },
    ids: rows.map((r) => r.id),
    summary: `Searched ${filters.length ? filters.join(", ") : "the whole library"}: ${scored.length} match${scored.length === 1 ? "" : "es"}`,
  };
}

function getProperties(library: PropertyScore[], input: Record<string, unknown>): ToolOutcome {
  const { found, missing } = lookup(library, stringIds(input.ids, 5));
  return {
    result: { properties: found.map(full), missing_ids: missing },
    ids: found.map((p) => p.id),
    summary: `Opened ${found.map((p) => p.name).join(", ") || "nothing"}${missing.length ? ` (${missing.length} unknown id)` : ""}`,
    isError: found.length === 0,
  };
}

function compareProperties(library: PropertyScore[], input: Record<string, unknown>): ToolOutcome {
  const { found, missing } = lookup(library, stringIds(input.ids, 6));
  if (found.length < 2) {
    return { result: { error: "need at least two known ids", missing_ids: missing }, ids: [], summary: "Compare failed: unknown ids", isError: true };
  }
  const metrics: [string, (p: PropertyScore) => number, "high" | "low"][] = [
    ["readiness", (p) => p.revivalReadinessScore, "high"],
    ["risk", (p) => p.riskScore, "low"],
    ["nostalgiaAlignment", (p) => p.nostalgiaAlignment, "high"],
    ["socialBuzz", (p) => p.socialBuzz, "high"],
    ["modernRelevance", (p) => p.modernRelevance, "high"],
    ["originalImpact", (p) => p.originalImpact, "high"],
    ["rightsComplexity", (p) => p.rightsComplexity, "low"],
    ["creatorAvailability", (p) => p.creatorAvailability, "high"],
  ];
  const leaders = Object.fromEntries(
    metrics.map(([key, get, better]) => {
      const best = [...found].sort((a, b) => (better === "high" ? get(b) - get(a) : get(a) - get(b)))[0];
      return [key, best.id];
    }),
  );
  return {
    result: {
      rows: found.map((p) => ({ id: p.id, name: p.name, year: p.year, category: p.category, timing: p.timingStage, ...Object.fromEntries(metrics.map(([k, get]) => [k, get(p)])) })),
      leaders,
      missing_ids: missing,
    },
    ids: found.map((p) => p.id),
    summary: `Compared ${found.map((p) => p.name).join(" vs ")}`,
  };
}

function libraryOverview(library: PropertyScore[], input: Record<string, unknown>): ToolOutcome {
  const groupBy = ["category", "year", "timing_stage"].includes(input.group_by as string) ? (input.group_by as string) : "category";
  const key = (p: PropertyScore) => (groupBy === "year" ? String(p.year) : groupBy === "timing_stage" ? p.timingStage : p.category);
  const groups = new Map<string, PropertyScore[]>();
  for (const p of library) groups.set(key(p), [...(groups.get(key(p)) ?? []), p]);
  const avg = (xs: number[]) => Math.round(xs.reduce((s, x) => s + x, 0) / xs.length);
  const rows = [...groups.entries()]
    .map(([group, ps]) => {
      const top = [...ps].sort((a, b) => b.revivalReadinessScore - a.revivalReadinessScore)[0];
      return {
        group,
        count: ps.length,
        avgReadiness: avg(ps.map((p) => p.revivalReadinessScore)),
        avgRisk: avg(ps.map((p) => p.riskScore)),
        top: { id: top.id, name: top.name, readiness: top.revivalReadinessScore },
      };
    })
    .sort((a, b) => b.avgReadiness - a.avgReadiness);
  return {
    result: { group_by: groupBy, total: library.length, groups: rows },
    ids: rows.map((r) => r.top.id),
    summary: `Summarized ${library.length} properties by ${groupBy.replace("_", " ")}`,
  };
}

function findSimilar(library: PropertyScore[], input: Record<string, unknown>): ToolOutcome {
  const id = typeof input.id === "string" ? input.id : "";
  const anchor = library.find((p) => p.id === id);
  if (!anchor) return { result: { error: `unknown id ${id}` }, ids: [], summary: "Similarity failed: unknown id", isError: true };
  const limit = num(input.limit, 1, 10, 5);
  const crossCategory = input.different_category === true;
  const anchorTags = new Set(anchor.tags.map((t) => t.toLowerCase()));
  const anchorWords = new Set(words(`${anchor.genre} ${anchor.coreAudience}`));

  const rows = library
    .filter((p) => p.id !== anchor.id && (!crossCategory || p.category !== anchor.category))
    .map((p) => {
      const sharedTags = p.tags.filter((t) => anchorTags.has(t.toLowerCase()));
      const sharedWords = words(`${p.genre} ${p.coreAudience}`).filter((w) => anchorWords.has(w));
      const similarity = sharedTags.length * 3 + new Set(sharedWords).size + (Math.abs(p.year - anchor.year) <= 1 ? 1 : 0);
      return { p, similarity, sharedTags };
    })
    .filter((r) => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity || b.p.revivalReadinessScore - a.p.revivalReadinessScore)
    .slice(0, limit)
    .map(({ p, similarity, sharedTags }) => ({ ...compact(p), similarity, sharedTags }));

  return {
    result: { anchor: compact(anchor), different_category: crossCategory, results: rows },
    ids: [anchor.id, ...rows.map((r) => r.id)],
    summary: `Found ${rows.length} ${crossCategory ? "cross-category partners" : "neighbors"} for ${anchor.name}`,
  };
}

export function runTool(library: PropertyScore[], name: string, input: unknown): ToolOutcome {
  const args = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  switch (name as ToolName) {
    case "search_library": return searchLibrary(library, args);
    case "get_properties": return getProperties(library, args);
    case "compare_properties": return compareProperties(library, args);
    case "library_overview": return libraryOverview(library, args);
    case "find_similar": return findSimilar(library, args);
    default: return { result: { error: `unknown tool ${name}` }, ids: [], summary: `Unknown tool ${name}`, isError: true };
  }
}
