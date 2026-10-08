import { Activity, AlertCircle, ArrowUpRight, Brain, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { getCategoryStats, scoredProperties } from "@/services/property-data";

const stats = getCategoryStats();
const topRisks = [...scoredProperties].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
const watchlist = scoredProperties.filter((property) => property.revivalReadinessScore >= 82 && property.riskScore < 50).slice(0, 8);
const metrics: { label: string; value: number; icon: LucideIcon }[] = [
  { label: "Tracked properties", value: scoredProperties.length, icon: Brain },
  {
    label: "Avg readiness",
    value: Math.round(scoredProperties.reduce((sum, p) => sum + p.revivalReadinessScore, 0) / scoredProperties.length),
    icon: Activity,
  },
  { label: "Greenlight pool", value: watchlist.length, icon: ArrowUpRight },
  { label: "Risk flags", value: topRisks.length, icon: AlertCircle },
];

export default function MarketIntelligence() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="mb-8">
        <p className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Market Intelligence</p>
        <h1 className="mt-4 display text-4xl leading-[1.05] md:text-5xl">Nostalgia market command center.</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Category-level readiness, high-conviction watchlists, and known risk clusters for the 1993-1998 revival window.
        </p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="scan-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 font-mono text-4xl font-semibold">{value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="scan-card p-5">
          <p className="eyebrow">Category heatmap</p>
          <h2 className="display mt-1 text-2xl">Where the model is hottest</h2>
          <div className="mt-5 space-y-4">
            {stats.map((stat) => (
              <div key={stat.category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{stat.category}</span>
                  <span className="text-muted-foreground">{stat.average} avg / {stat.count} signals</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${stat.average}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scan-card p-5">
          <p className="eyebrow">Watchlist</p>
          <h2 className="display mt-1 text-2xl">High readiness, manageable risk</h2>
          <div className="mt-5 divide-y divide-border">
            {watchlist.map((property) => (
              <div key={property.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{property.recommendation}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-foreground">{property.revivalReadinessScore}</div>
                  <div className="text-xs text-muted-foreground">risk {property.riskScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="scan-card p-5">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold">Signal interpretation</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Games, family animation, and horror are strongest because they combine high recognition with adaptable formats and active fan communities.</p>
            <p>Music properties are powerful but need rights, estate, and exploitation-risk reviews before monetization strategy.</p>
            <p>Toys and tech work best when revived as physical-digital systems, collector drops, or founder-era business stories rather than straight nostalgia replicas.</p>
          </div>
        </div>
        <div className="scan-card p-5">
          <p className="eyebrow">Ask the market</p>
          <h2 className="display mt-1 text-2xl">Go deeper with the Prophet</h2>
          <div className="mt-4 grid gap-2">
            {[
              "Which category has the best readiness-to-risk balance?",
              "Which 1993 and 1994 properties are aging out of the window?",
              "What Pre-Peak properties should we option now for 2028?",
            ].map((q) => (
              <Link key={q} href={`/prophet-chat/?q=${encodeURIComponent(q)}`} className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-6 text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
