"use client";

import Link from "next/link";
import { scoreBand } from "@/components/brand";
import { useLibrary } from "@/hooks/use-library";

/** Homepage stat row, from the live library. */
export function LiveStats() {
  const library = useLibrary();
  const goCount = library.filter((property) => property.revivalReadinessScore >= 78).length;
  return (
      <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-border pt-6">
        {[
          [String(library.length), "scored properties"],
          [String(goCount), "in the Go band"],
          ["1993-98", "launch cohort"],
        ].map(([value, label]) => (
          <div key={label}>
            <dt className="font-mono text-2xl font-semibold text-foreground">{value}</dt>
            <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
          </div>
        ))}
      </dl>
  );
}

/** "Top of the shelf": the six highest live scores. */
export function LiveShelf() {
  const shelf = useLibrary().slice(0, 6);
  return (
    <div className="scan-card self-start overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="eyebrow">Top of the shelf</p>
        <Link href="/property-library/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:text-foreground">Full library</Link>
      </div>
      <ol>
        {shelf.map((property) => {
          const band = scoreBand(property.revivalReadinessScore);
          return (
            <li key={property.id} className="border-b border-border last:border-0">
              <Link href={`/analysis-tools/?propertyId=${property.id}`} className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 px-5 py-3.5 transition hover:bg-muted/40">
                <span className="font-mono text-xs text-muted-foreground">#{property.rank}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground group-hover:text-primary">{property.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{property.year} · {property.category} · {property.timingStage}</span>
                </span>
                <span className={`font-mono text-xl font-semibold tabular-nums ${band.text}`}>{property.revivalReadinessScore}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
