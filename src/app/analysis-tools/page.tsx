"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Activity, AlertTriangle, CalendarClock, Gauge, Layers3, MessageSquareText, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { useLibrary } from "@/hooks/use-library";
import { currentYear } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import {
  getModernizationRecommendations,
  getNostalgiaCurve,
  type PropertyScore,
} from "@/services/property-data";

function CurveChart({ property }: { property: PropertyScore }) {
  const curve = getNostalgiaCurve(property);
  const max = 100;
  const coordinates = curve.map((point, index) => ({
    ...point,
    x: (index / (curve.length - 1)) * 300,
    y: 100 - (point.readiness / max) * 86,
  }));
  const points = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `0,100 ${points} 300,100`;
  const peak = coordinates.reduce((best, point) => (point.readiness > best.readiness ? point : best), coordinates[0]);

  return (
    <div className="scan-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Nostalgia curve</p>
          <h3 className="display mt-1 text-2xl">Readiness forecast</h3>
        </div>
        <CalendarClock className="h-5 w-5 text-secondary" />
      </div>
      <svg viewBox="0 0 300 108" className="h-56 w-full overflow-visible">
        <defs>
          <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75, 100].map((line) => (
          <line key={line} x1="0" x2="300" y1={100 - line * 0.86} y2={100 - line * 0.86} stroke="hsl(var(--border))" strokeWidth="0.5" />
        ))}
        <polygon points={area} fill="url(#curveFill)" />
        <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {coordinates.map((point) => (
          <circle key={point.year} cx={point.x} cy={point.y} r="1.6" fill={point.year === currentYear() ? "hsl(var(--secondary))" : "hsl(var(--primary))"} />
        ))}
        <circle cx={peak.x} cy={peak.y} r="3.2" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="0.9" />
      </svg>
      <div className="mb-4 rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        Peak model year: <span className="text-foreground">{peak.year}</span> at readiness{" "}
        <span className="text-foreground">{peak.readiness}</span>.
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
        {curve.filter((_, index) => index % 4 === 0).map((point) => (
          <div key={point.year}>
            <div className="text-foreground">{point.year}</div>
            <div>Age {point.age}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="metric-tile">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 font-mono text-3xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function AnalysisContent() {
  const params = useSearchParams();
  const library = useLibrary();
  const initialId = params.get("propertyId") || library[0].id;
  const [selectedId, setSelectedId] = useState(initialId);

  const property = useMemo(() => library.find((p) => p.id === selectedId) || library[0], [library, selectedId]);
  const recommendations = getModernizationRecommendations(property);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow={`Deep dive · #${property.rank} · ${property.year} · ${property.category}`}
        title={property.name}
        lede={property.briefDescription}
        aside={
          <div className="scan-card w-full p-4 lg:w-[360px]">
            <label className="eyebrow mb-2 block" htmlFor="property-select">Select property</label>
            <select id="property-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="field">
              {[...library].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                <option key={item.id} value={item.id}>{item.name} ({item.year})</option>
              ))}
            </select>
            <Link
              href={`/prophet-chat/?q=${encodeURIComponent(`Make the case for and against reviving ${property.name} now, and name better alternatives.`)}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground"
            >
              <MessageSquareText className="h-4 w-4" /> Ask the Prophet about {property.name}
            </Link>
            <Link href={`/property-analytics/?propertyId=${property.id}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground">
              <Activity className="h-4 w-4" /> Signals and evidence
            </Link>
          </div>
        }
      />

      <section className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Readiness Score" value={property.revivalReadinessScore} icon={Gauge} />
        <Metric label="Nostalgia Alignment" value={property.nostalgiaAlignment} icon={Sparkles} />
        <Metric label="Risk Score" value={property.riskScore} icon={AlertTriangle} />
        <Metric label="Target Age" value={property.targetAudienceAge} icon={Layers3} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <CurveChart property={property} />
        <div className="scan-card p-5">
          <p className="eyebrow">Model Breakdown</p>
          <h2 className="display mt-1 text-2xl">Why now</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Social Buzz", property.socialBuzz],
              ["Modern Relevance", property.modernRelevance],
              ["Original Impact", property.originalImpact],
              ["Creator Availability", property.creatorAvailability],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-primary/20 bg-primary/10 p-4">
            <div className="text-sm text-primary">Recommendation</div>
            <div className="mt-1 text-lg font-semibold">{property.recommendation}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Launch window: {property.launchWindow}. Timing stage: {property.timingStage}. Current signal:
              {" "}{property.currentSignal}.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="scan-card p-5">
          <p className="eyebrow">Preserve vs update</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-accent">Preserve</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {property.preserve.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-secondary">Update</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {property.update.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="scan-card p-5">
          <p className="eyebrow">Modification engine</p>
          <h3 className="display mt-1 text-2xl">Remix recommendations</h3>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <div key={item} className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
          <Button asChild className="mt-5">
            <Link href={`/remix-lab/?propertyId=${property.id}`}>Build a Pitch</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 rounded border border-primary/30 bg-primary/10 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h3 className="display text-2xl">Need this verified before you spend on it?</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">The $199 Revival Opportunity Brief on {property.name}: rights holder of record, audience, comparables, risks, and what we could not verify. Human-reviewed, two business days.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/order-report/?property=${encodeURIComponent(property.name)}`} className="inline-flex h-11 items-center rounded bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90">Order the $199 brief</Link>
          <Link href={`/compare/?ids=${property.id}`} className="inline-flex h-11 items-center rounded border border-border px-5 text-sm hover:text-foreground">Compare with others</Link>
        </div>
      </section>
    </main>
  );
}

export default function AnalysisTools() {
  return (
    <Suspense fallback={<main className="p-8">Loading analysis...</main>}>
      <AnalysisContent />
    </Suspense>
  );
}
