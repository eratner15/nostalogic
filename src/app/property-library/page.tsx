"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, fetchPropertiesFromApi, getProperties, getPropertiesFrom, scoreAll, years, type Property, type PropertyCategory, type TimingStage } from "@/services/property-data";

type SortKey = "rank" | "name" | "year" | "category" | "score" | "risk";

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
  const [apiSource, setApiSource] = useState<Property[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPropertiesFromApi().then((list) => {
      if (alive && list) setApiSource(list);
    });
    return () => { alive = false; };
  }, []);

  const properties = useMemo(() => {
    const rows = apiSource
      ? getPropertiesFrom(scoreAll(apiSource), { query, category, year, timing })
      : getProperties({ query, category, year, timing });
    return [...rows].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * direction;
      if (sortKey === "category") return a.category.localeCompare(b.category) * direction;
      if (sortKey === "year") return (a.year - b.year) * direction;
      if (sortKey === "risk") return (a.riskScore - b.riskScore) * direction;
      if (sortKey === "rank") return (a.rank - b.rank) * direction;
      return (a.revivalReadinessScore - b.revivalReadinessScore) * direction;
    });
  }, [apiSource, category, query, sortDirection, sortKey, timing, year]);

  const totalPages = Math.max(1, Math.ceil(properties.length / pageSize));
  const visibleProperties = properties.slice((page - 1) * pageSize, page * pageSize);
  const firstVisible = properties.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastVisible = Math.min(page * pageSize, properties.length);

  useEffect(() => {
    setPage(1);
  }, [category, query, sortKey, sortDirection, timing, year]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection(key === "name" || key === "category" ? "asc" : "desc");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Badge className="border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/10">Discovery Engine</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Search the 1994-1996 IP library.</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Filter the seed universe by category, year, timing stage, and cultural signal. Scores are generated locally
            from social buzz, nostalgia alignment, and modern relevance.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
          <div className="metric-tile">
            <div className="text-3xl font-semibold">{properties.length}</div>
            <div className="text-sm text-muted-foreground">matching properties</div>
          </div>
          <div className="metric-tile">
            <div className="text-3xl font-semibold">{properties[0]?.revivalReadinessScore ?? "-"}</div>
            <div className="text-sm text-muted-foreground">top readiness score</div>
          </div>
        </div>
      </section>

      <section className="scan-card mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_160px_140px_160px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, genre, signal, or tag"
              className="border-white/10 bg-white/5 pl-9"
            />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value as PropertyCategory | "All")} className="rounded-md border border-white/10 bg-card px-3 text-sm">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-md border border-white/10 bg-card px-3 text-sm">
            {years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={timing} onChange={(event) => setTiming(event.target.value as TimingStage | "All")} className="rounded-md border border-white/10 bg-card px-3 text-sm">
            {timingOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="scan-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                {[
                  ["rank", "Rank"],
                  ["name", "Property"],
                  ["category", "Category"],
                  ["year", "Year"],
                  ["score", "Readiness"],
                  ["risk", "Risk"],
                ].map(([key, label]) => (
                  <th key={key} className="px-4 py-3">
                    <button className="inline-flex items-center gap-2 hover:text-white" onClick={() => handleSort(key as SortKey)}>
                      {label}
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3">Timing</th>
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleProperties.map((property) => (
                <tr key={property.id} className="hover:bg-white/[0.025]">
                  <td className="px-4 py-4 font-mono text-muted-foreground">#{property.rank}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{property.name}</div>
                    <div className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">{property.briefDescription}</div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-white/15">{property.category}</Badge></td>
                  <td className="px-4 py-4">{property.year}</td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-white">{property.revivalReadinessScore}</div>
                    <div className="mt-1 h-1.5 w-24 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${property.revivalReadinessScore}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{property.riskScore}</td>
                  <td className="px-4 py-4 text-secondary">{property.timingStage}</td>
                  <td className="px-4 py-4 max-w-xs text-muted-foreground">{property.currentSignal}</td>
                  <td className="px-4 py-4 text-right">
                    <Button asChild size="sm" variant="outline" className="border-white/15 bg-white/5">
                      <Link href={`/analysis-tools?propertyId=${property.id}`}>Analyze</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing <span className="text-white">{firstVisible}-{lastVisible}</span> of{" "}
            <span className="text-white">{properties.length}</span> properties
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <span className="min-w-24 text-center text-xs uppercase tracking-[0.12em]">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
