"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CalendarClock, Gauge, Layers3, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getModernizationRecommendations,
  getNostalgiaCurve,
  getProperty,
  scoredProperties,
  type PropertyScore,
} from "@/services/property-data";

function CurveChart({ property }: { property: PropertyScore }) {
  const curve = getNostalgiaCurve(property);
  const max = 100;
  const coordinates = curve.map((point, index) => ({
    ...point,
    x: (index / (curve.length - 1)) * 100,
    y: 100 - (point.readiness / max) * 86,
  }));
  const points = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `0,100 ${points} 100,100`;
  const peak = coordinates.reduce((best, point) => (point.readiness > best.readiness ? point : best), coordinates[0]);

  return (
    <div className="scan-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nostalgia curve</p>
          <h3 className="text-xl font-semibold">Readiness forecast</h3>
        </div>
        <CalendarClock className="h-5 w-5 text-secondary" />
      </div>
      <svg viewBox="0 0 100 108" className="h-56 w-full overflow-visible">
        <defs>
          <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(236,72,153)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="rgb(236,72,153)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75, 100].map((line) => (
          <line key={line} x1="0" x2="100" y1={100 - line * 0.86} y2={100 - line * 0.86} stroke="rgba(255,255,255,.08)" strokeWidth="0.5" />
        ))}
        <polygon points={area} fill="url(#curveFill)" />
        <polyline points={points} fill="none" stroke="rgb(236,72,153)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {coordinates.map((point) => (
          <circle key={point.year} cx={point.x} cy={point.y} r="1.6" fill={point.year === 2026 ? "rgb(34,211,238)" : "rgb(236,72,153)"} />
        ))}
        <circle cx={peak.x} cy={peak.y} r="3.2" fill="rgb(236,72,153)" stroke="white" strokeWidth="0.9" />
      </svg>
      <div className="mb-4 rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm text-muted-foreground">
        Peak model year: <span className="text-white">{peak.year}</span> at readiness{" "}
        <span className="text-white">{peak.readiness}</span>.
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
        {curve.filter((_, index) => index % 4 === 0).map((point) => (
          <div key={point.year}>
            <div className="text-white">{point.year}</div>
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
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function AnalysisContent() {
  const params = useSearchParams();
  const initialId = params.get("propertyId") || scoredProperties[0].id;
  const [selectedId, setSelectedId] = useState(initialId);

  const property = useMemo(() => getProperty(selectedId) || scoredProperties[0], [selectedId]);
  const recommendations = getModernizationRecommendations(property);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <Badge className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">Deep Dive Analysis</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">{property.name}</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">{property.briefDescription}</p>
        </div>
        <div className="scan-card p-4">
          <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">Select property</label>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="h-11 w-full rounded-md border border-white/10 bg-card px-3 text-sm">
            {scoredProperties.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Readiness Score" value={property.revivalReadinessScore} icon={Gauge} />
        <Metric label="Nostalgia Alignment" value={property.nostalgiaAlignment} icon={Sparkles} />
        <Metric label="Risk Score" value={property.riskScore} icon={AlertTriangle} />
        <Metric label="Target Age" value={property.targetAudienceAge} icon={Layers3} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <CurveChart property={property} />
        <div className="scan-card p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Model Breakdown</p>
          <h2 className="mt-1 text-2xl font-semibold">Why now</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Social Buzz", property.socialBuzz],
              ["Modern Relevance", property.modernRelevance],
              ["Original Impact", property.originalImpact],
              ["Creator Availability", property.creatorAvailability],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${value}%` }} />
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
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Preserve vs update</p>
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
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Modification engine</p>
          <h3 className="mt-1 text-xl font-semibold">Remix recommendations</h3>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
          <Button asChild className="mt-5">
            <a href={`/remix-lab?propertyId=${property.id}`}>Build a Pitch</a>
          </Button>
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
