"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, scoreBand } from "@/components/brand";
import { useLibrary } from "@/hooks/use-library";
import { compareRows, parseCompareIds } from "@/lib/signals";
import { getNostalgiaCurve } from "@/lib/scoring";
import { cn } from "@/lib/utils";

const SLOTS = 4;
/** Neutral strokes for the non-leaders; the leader takes the amber accent. */
const dashes = ["", "6 4", "2 3", "10 3 2 3"];

function CompareContent() {
  const params = useSearchParams();
  const library = useLibrary();
  const known = useMemo(() => new Set(library.map((p) => p.id)), [library]);
  const [ids, setIds] = useState<string[]>(() => parseCompareIds(params.get("ids"), known));
  const chosen = ids.map((id) => library.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const rows = compareRows(chosen);
  const leaderIdx = chosen.length ? chosen.reduce((b, p, i, a) => (p.revivalReadinessScore > a[b].revivalReadinessScore ? i : b), 0) : -1;
  const sortedLibrary = [...library].sort((a, b) => a.name.localeCompare(b.name));

  const setSlot = (i: number, id: string) => {
    const next = [...ids];
    if (!id) next.splice(i, 1);
    else if (ids.includes(id) && ids[i] !== id) return;
    else next[i] = id;
    const clean = next.filter(Boolean).slice(0, SLOTS);
    setIds(clean);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `?ids=${clean.join(",")}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Compare"
        title={chosen.length >= 2 ? `${chosen.map((p) => p.name).join(" vs ")}` : "Put two to four properties side by side."}
        lede="Same rubric, same year, one grid. The amber cell leads its row. Risk and rights complexity read the other way: lower leads."
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: SLOTS }, (_, i) => (
          <label key={i} className="block">
            <span className="eyebrow mb-2 block">{i < 2 ? `Property ${i + 1}` : `Property ${i + 1} (optional)`}</span>
            <select className="field" value={ids[i] ?? ""} onChange={(e) => setSlot(i, e.target.value)} aria-label={`Property ${i + 1}`}>
              <option value="">{i < ids.length ? "Remove" : "Choose a property"}</option>
              {sortedLibrary.map((p) => <option key={p.id} value={p.id} disabled={ids.includes(p.id) && ids[i] !== p.id}>{p.name} ({p.year})</option>)}
            </select>
          </label>
        ))}
      </section>

      {chosen.length < 2 ? (
        <section className="rounded border border-dashed border-border p-10 text-center text-muted-foreground">
          Choose at least two. Or start from <Link href="/property-library/" className="text-primary hover:text-foreground">the library</Link>, where each row has a compare box.
        </section>
      ) : (
        <>
          <section className="scan-card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-normal text-muted-foreground">Rubric input</th>
                  {chosen.map((p, i) => (
                    <th key={p.id} className="min-w-40 px-4 py-3 align-bottom">
                      <Link href={`/analysis-tools/?propertyId=${p.id}`} className="display text-lg leading-tight hover:text-primary">{p.name}</Link>
                      <div className="mt-1 text-xs text-muted-foreground">{p.year} · {p.category}{i === leaderIdx ? " · leads" : ""}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.label}
                      {row.note && <span className="ml-2 text-xs opacity-70">{row.note}</span>}
                    </td>
                    {row.values.map((v, i) => {
                      const lead = row.leader === i;
                      const band = row.key === "score" && typeof v === "number" ? scoreBand(v) : null;
                      return (
                        <td key={chosen[i].id} className={cn("px-4 py-3", typeof v === "number" ? "font-mono tabular-nums" : "text-xs leading-5", lead && "bg-primary/10 font-semibold text-primary", row.key === "score" && "text-xl")}>
                          {v}{band && <span className="ml-2 align-middle font-mono text-[11px] uppercase tracking-[0.16em] opacity-80">{band.label}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Next step</td>
                  {chosen.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-xs">
                      <Link href={`/property-analytics/?propertyId=${p.id}`} className="text-primary hover:text-foreground">Signals</Link>
                      <span className="mx-2 text-muted-foreground">·</span>
                      <Link href={`/order-report/?property=${encodeURIComponent(p.name)}`} className="text-primary hover:text-foreground">$199 brief</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mt-6 scan-card p-5">
            <p className="eyebrow">Nostalgia curve</p>
            <h2 className="display mt-1 text-2xl">Readiness by year, 2020 to 2032</h2>
            <Curves chosen={chosen} leaderIdx={leaderIdx} />
          </section>
        </>
      )}
    </main>
  );
}

function Curves({ chosen, leaderIdx }: { chosen: ReturnType<typeof useLibrary>; leaderIdx: number }) {
  const w = 600, h = 180, padL = 36, padR = 8, padT = 10, padB = 24;
  const years = Array.from({ length: 13 }, (_, i) => 2020 + i);
  const x = (i: number) => padL + (i / 12) * (w - padL - padR);
  const y = (v: number) => padT + (1 - v / 100) * (h - padT - padB);
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full text-foreground" role="img" aria-label="Readiness curves for the chosen properties">
        {[0, 50, 80, 100].map((t) => (
          <g key={t}>
            <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity={t === 80 ? 0.35 : 0.12} strokeDasharray={t === 80 ? "3 3" : undefined} />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="currentColor" fillOpacity="0.6" fontFamily="var(--font-mono, monospace)">{t}</text>
          </g>
        ))}
        {chosen.map((p, i) => {
          const curve = getNostalgiaCurve(p);
          const d = curve.map((pt, j) => `${j ? "L" : "M"}${x(j).toFixed(1)},${y(pt.readiness).toFixed(1)}`).join(" ");
          const lead = i === leaderIdx;
          return <path key={p.id} d={d} fill="none" stroke={lead ? "hsl(var(--primary))" : "currentColor"} strokeOpacity={lead ? 1 : 0.5} strokeWidth={lead ? 2.2 : 1.5} strokeDasharray={lead ? undefined : dashes[i % dashes.length]} strokeLinejoin="round" />;
        })}
        {years.filter((_, i) => i % 4 === 0).map((yr, i) => (
          <text key={yr} x={x(i * 4)} y={h - 6} textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"} fontSize="11" fill="currentColor" fillOpacity="0.6" fontFamily="var(--font-mono, monospace)">{yr}</text>
        ))}
      </svg>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {chosen.map((p, i) => (
          <li key={p.id} className="flex items-center gap-2">
            <svg width="28" height="8" aria-hidden="true"><line x1="0" x2="28" y1="4" y2="4" stroke={i === leaderIdx ? "hsl(var(--primary))" : "currentColor"} strokeWidth="2" strokeDasharray={i === leaderIdx ? undefined : dashes[i % dashes.length]} /></svg>
            {p.name}
          </li>
        ))}
        <li>Dashed line at 80: the flag line on the track record.</li>
      </ul>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<main className="p-8">Loading compare...</main>}>
      <CompareContent />
    </Suspense>
  );
}
