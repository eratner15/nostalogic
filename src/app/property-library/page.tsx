"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, MessageSquareText, Search, X } from "lucide-react";
import { Meter, PageHeader, ScoreBadge, riskBand } from "@/components/brand";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/hooks/use-library";
import { categories, getPropertiesFrom, years, type PropertyCategory, type TimingStage } from "@/services/property-data";

type SortKey = "rank" | "name" | "year" | "score" | "risk";

const timingOptions: (TimingStage | "All")[] = ["All", "Pre-Peak", "Sweet Spot", "Mature"];
const pageSize = 25;

export default function PropertyLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PropertyCategory | "All">("All");
  const [year, setYear] = useState("All");
  const [timing, setTiming] = useState<TimingStage | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const library = useLibrary();
  const [history, setHistory] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let alive = true;
    fetch("/api/score-history")
      .then((res) => (res.ok ? res.json() : {}))
      .then((h) => { if (alive) setHistory(h); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const rows = useMemo(() => {
    const filtered = getPropertiesFrom(library, { query, category, year, timing });
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * direction;
      if (sortKey === "year") return (a.year - b.year) * direction;
      if (sortKey === "risk") return (a.riskScore - b.riskScore) * direction;
      if (sortKey === "rank") return (a.rank - b.rank) * direction;
      return (a.revivalReadinessScore - b.revivalReadinessScore) * direction;
    });
  }, [library, category, query, sortDirection, sortKey, timing, year]);

  useEffect(() => setPage(1), [category, query, sortKey, sortDirection, timing, year]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);
  const filtersActive = query || category !== "All" || year !== "All" || timing !== "All";

  const handleSort = (key: SortKey) => {
    if (key === sortKey) return setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setSortKey(key);
    setSortDirection(key === "name" || key === "rank" || key === "risk" ? "asc" : "desc");
  };

  // Hand the current view to the agent as a natural-language question.
  const askAboutView = [
    "Which of these should be revived first, and why:",
    category !== "All" ? category : "all categories",
    year !== "All" ? `from ${year}` : null,
    timing !== "All" ? `in the ${timing} stage` : null,
    query ? `matching "${query}"` : null,
  ].filter(Boolean).join(" ");

  const SortHeader = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <th className={cn("px-4 py-3 font-normal", className)}>
      <button className={cn("inline-flex items-center gap-1 hover:text-foreground", sortKey === k && "text-foreground")} onClick={() => handleSort(k)}>
        {label}
        {sortKey === k && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </th>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="The library"
        title="Every property, scored and ranked."
        lede="The full 1993-1998 corpus, ranked by Revival Readiness. Filter the shelf, open any title for the full analysis, or hand the current view to the Prophet."
        aside={
          <div className="grid grid-cols-2 gap-3 lg:w-80">
            <div className="metric-tile">
              <div className="font-mono text-3xl font-semibold">{rows.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">matching properties</div>
            </div>
            <div className="metric-tile">
              <div className="font-mono text-3xl font-semibold text-accent">{rows.reduce((max, p) => Math.max(max, p.revivalReadinessScore), 0) || "-"}</div>
              <div className="mt-1 text-xs text-muted-foreground">top readiness</div>
            </div>
          </div>
        }
      />

      <section className="mb-4 grid gap-3 md:grid-cols-[1fr_170px_120px_150px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, genre, signal, or tag" className="field pl-9" aria-label="Search the library" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value as PropertyCategory | "All")} className="field" aria-label="Category">
          {categories.map((item) => <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>)}
        </select>
        <select value={year} onChange={(event) => setYear(event.target.value)} className="field" aria-label="Year">
          {years.map((item) => <option key={item} value={item}>{item === "All" ? "All years" : item}</option>)}
        </select>
        <select value={timing} onChange={(event) => setTiming(event.target.value as TimingStage | "All")} className="field" aria-label="Timing stage">
          {timingOptions.map((item) => <option key={item} value={item}>{item === "All" ? "Any timing" : item}</option>)}
        </select>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filtersActive ? (
            <button
              onClick={() => { setQuery(""); setCategory("All"); setYear("All"); setTiming("All"); }}
              className="chip transition hover:text-foreground"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Showing the whole shelf.</span>
          )}
        </div>
        <Link href={`/prophet-chat/?q=${encodeURIComponent(askAboutView)}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground">
          <MessageSquareText className="h-4 w-4" /> Ask the Prophet about this view
        </Link>
      </div>

      <section className="scan-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <SortHeader k="rank" label="#" className="w-14" />
                <SortHeader k="name" label="Property" />
                <SortHeader k="year" label="Year" className="hidden sm:table-cell" />
                <SortHeader k="score" label="Readiness" />
                <SortHeader k="risk" label="Risk" className="hidden md:table-cell" />
                <th className="hidden px-4 py-3 font-normal lg:table-cell">Timing</th>
                <th className="hidden px-4 py-3 font-normal xl:table-cell">Current signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((property) => {
                const risk = riskBand(property.riskScore);
                return (
                  <tr key={property.id} className="group align-top transition hover:bg-muted/30">
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{property.rank}</td>
                    <td className="px-4 py-4">
                      <Link href={`/analysis-tools/?propertyId=${property.id}`} className="font-medium text-foreground group-hover:text-primary">
                        {property.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="chip py-0">{property.category}</span>
                        <span className="sm:hidden">{property.year}</span>
                        <span className="hidden md:inline">{property.genre}</span>
                      </div>
                      <p className="mt-2 hidden max-w-xl text-xs leading-5 text-muted-foreground md:block">{property.briefDescription}</p>
                    </td>
                    <td className="hidden px-4 py-4 font-mono text-muted-foreground sm:table-cell">{property.year}</td>
                    <td className="px-4 py-4"><ScoreBadge score={property.revivalReadinessScore} size="sm" /><Sparkline points={history[property.id]} /></td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <span className={cn("font-mono font-semibold", risk.text)}>{property.riskScore}</span>
                      <Meter value={property.riskScore} tone={risk.bar} className="mt-1.5 w-12" />
                    </td>
                    <td className="hidden px-4 py-4 text-xs text-muted-foreground lg:table-cell">{property.timingStage}</td>
                    <td className="hidden max-w-xs px-4 py-4 text-xs leading-5 text-muted-foreground xl:table-cell">{property.currentSignal}</td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    Nothing on the shelf matches. <Link href={`/prophet-chat/?q=${encodeURIComponent(query || "What is closest to what I am looking for?")}`} className="text-primary hover:underline">Ask the Prophet</Link> instead.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {rows.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, rows.length)} of <span className="text-foreground">{rows.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded border border-border px-3 py-1.5 text-xs hover:text-foreground disabled:opacity-40" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
            <span className="min-w-20 text-center font-mono text-xs">{page} / {totalPages}</span>
            <button className="rounded border border-border px-3 py-1.5 text-xs hover:text-foreground disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Weekly snapshot scores, oldest first. Hidden until there are two weeks to compare. */
function Sparkline({ points }: { points?: number[] }) {
  if (!points || points.length < 2) return null;
  const w = 64, h = 16, lo = Math.min(...points) - 2, hi = Math.max(...points) + 2;
  const xy = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - ((v - lo) / (hi - lo)) * h}`).join(" ");
  const delta = points[points.length - 1] - points[0];
  return (
    <span className="mt-2 flex items-center gap-1.5" title={`Weekly scores: ${points.join(", ")}`}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-label={`Score history ${points.join(", ")}`}>
        <polyline points={xy} fill="none" stroke="currentColor" strokeWidth="1.25" className="text-muted-foreground" />
      </svg>
      <span className={cn("font-mono text-[11px]", delta > 0 ? "text-accent" : delta < 0 ? "text-destructive" : "text-muted-foreground")}>
        {delta > 0 ? "+" : ""}{delta}
      </span>
    </span>
  );
}
