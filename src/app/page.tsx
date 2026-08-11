import Link from "next/link";
import { ArrowRight, Database, Gauge, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryStats, getFeaturedProperties, scoredProperties } from "@/services/property-data";

const featured = getFeaturedProperties(5);
const stats = getCategoryStats();
const sweetSpotCount = scoredProperties.filter((property) => property.timingStage === "Sweet Spot").length;
const averageScore = Math.round(
  scoredProperties.reduce((sum, property) => sum + property.revivalReadinessScore, 0) / scoredProperties.length
);

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <section className="grid min-h-[calc(100vh-78px)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <div className="space-y-8">
          <Badge className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">
            1994-1996 revival intelligence
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-normal text-white md:text-7xl">
              The predictive nostalgia algorithm for dormant IP.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              NostalDamus scores movies, TV, music, games, toys, tech, and pop culture signals from the 1994-1996
              sweet spot, then turns the highest-conviction properties into launch timing, risk, and remix strategy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/property-library">
                Explore IP Library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/15 bg-white/5">
              <Link href="/remix-lab">Generate Revival Pitch</Link>
            </Button>
          </div>
          <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="metric-tile">
              <div className="text-3xl font-semibold text-white">{scoredProperties.length}</div>
              <div className="text-sm text-muted-foreground">Seed properties</div>
            </div>
            <div className="metric-tile">
              <div className="text-3xl font-semibold text-white">{sweetSpotCount}</div>
              <div className="text-sm text-muted-foreground">In nostalgia window</div>
            </div>
            <div className="metric-tile">
              <div className="text-3xl font-semibold text-white">{averageScore}</div>
              <div className="text-sm text-muted-foreground">Avg readiness</div>
            </div>
          </div>
        </div>

        <div className="scan-card overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live Model Output</p>
                <h2 className="mt-1 text-2xl font-semibold">Top revival candidates</h2>
              </div>
              <Gauge className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {featured.map((property) => (
              <Link
                key={property.id}
                href={`/analysis-tools?propertyId=${property.id}`}
                className="grid gap-4 p-5 hover:bg-white/[0.035] sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">{property.name}</span>
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {property.category}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {property.briefDescription}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-3xl font-semibold text-white">{property.revivalReadinessScore}</div>
                  <div className="text-xs text-muted-foreground">{property.timingStage}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: Database, title: "Deep IP Library", text: "100+ seeded properties across theatrical, streaming, music, games, toys, internet, and sports-media culture." },
          { icon: LineChart, title: "Nostalgia Curve", text: "Cohort age modeling shows when the original childhood audience reaches the 35-45 monetization window." },
          { icon: ShieldCheck, title: "Modernization Map", text: "Each property gets preserve/update recommendations, rights risk, cultural alignment, and launch packaging." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="scan-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat) => (
          <div key={stat.category} className="scan-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.category}</p>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-4 text-4xl font-semibold">{stat.average}</div>
            <p className="mt-2 text-xs text-muted-foreground">{stat.count} tracked signals, led by {stat.top.name}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
