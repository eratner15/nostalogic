import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Gauge,
  Layers3,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProperties, scoredProperties } from "@/services/property-data";

const featured = getFeaturedProperties(4);
const sweetSpotCount = scoredProperties.filter((property) => property.timingStage === "Sweet Spot").length;

const deliverables = [
  "Revival Readiness Score with every input shown",
  "Audience and nostalgia-window assessment",
  "Rights and execution-risk flags",
  "What to preserve and what to modernize",
  "Recommended format, positioning, and launch angle",
  "A concise go / investigate / pass recommendation",
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
        <div>
          <Badge className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">
            Decision intelligence for dormant IP
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.035em] text-white md:text-7xl">
            Know which forgotten franchise is worth reviving.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            NostalDamus helps producers, studios, rights holders, and investors pressure-test a property before
            development spend. Start with the live 120-property model or order a manually reviewed opportunity brief.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/order-report">
                Order a $199 IP Brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/15 bg-white/5">
              <Link href="/property-library">Explore the Live Model</Link>
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-5 text-sm text-muted-foreground">
            <span><strong className="text-white">120</strong> scored properties</span>
            <span><strong className="text-white">{sweetSpotCount}</strong> in the current window</span>
            <span><strong className="text-white">1993-1998</strong> launch cohort</span>
            <span><strong className="text-white">No subscription</strong> required</span>
          </div>
        </div>

        <div className="scan-card overflow-hidden">
          <div className="border-b border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Sample deliverable</p>
                <h2 className="mt-1 text-2xl font-semibold">Revival Opportunity Brief</h2>
              </div>
              <FileText className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm text-muted-foreground">Revival Readiness</p>
                <p className="mt-1 text-5xl font-semibold text-white">81<span className="text-xl text-muted-foreground">/100</span></p>
              </div>
              <Badge variant="outline" className="border-accent/40 text-accent">Investigate now</Badge>
            </div>
            <div className="grid gap-4 py-6 sm:grid-cols-3">
              <div><p className="text-xs text-muted-foreground">Timing</p><p className="mt-1 font-medium text-white">Sweet spot</p></div>
              <div><p className="text-xs text-muted-foreground">Audience</p><p className="mt-1 font-medium text-white">High fit</p></div>
              <div><p className="text-xs text-muted-foreground">Rights risk</p><p className="mt-1 font-medium text-white">Needs diligence</p></div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-secondary">Decision question</p>
              <p className="mt-2 leading-7 text-muted-foreground">
                Is the audience window strong enough to justify rights diligence and concept development now?
              </p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Illustrative layout. Every paid brief uses the named property, visible scoring inputs, and a human review.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">The $199 product</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">One property. One decision-ready brief.</h2>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Tell us the IP and the decision in front of you. We run the property through the model, review the output,
              and return a focused opportunity memo within two business days.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-card/70 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm leading-6 text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">A transparent screen, not a black-box promise.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              The score is a reproducible decision heuristic. It is not presented as validated prediction accuracy.
              The brief makes the assumptions visible so your team can challenge them.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Database, n: "01", title: "Select", text: "Name the dormant property and the commercial question you need answered." },
              { icon: BarChart3, n: "02", title: "Score", text: "Assess audience timing, cultural relevance, current signals, and execution risk." },
              { icon: Target, n: "03", title: "Decide", text: "Receive the recommendation, modernization map, and next diligence steps." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.n} className="scan-card p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">{item.n}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Explore before you buy</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Live candidates from the scored corpus</h2>
          </div>
          <Link href="/property-library" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-white">
            View all 120 properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((property) => (
            <Link key={property.id} href={"/analysis-tools?propertyId=" + property.id} className="scan-card group grid gap-5 p-5 transition hover:border-primary/35 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white group-hover:text-primary">{property.name}</h3>
                  <Badge variant="outline" className="border-white/15 text-muted-foreground">{property.category}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{property.briefDescription}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-4xl font-semibold text-white">{property.revivalReadinessScore}</p>
                <p className="text-xs text-accent">{property.timingStage}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-primary/10 via-card to-secondary/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="border-accent/40 bg-accent/10 text-accent hover:bg-accent/10">Available now</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">Start with one property for $199.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              No contract and no subscription. Send the property and your decision question today. We confirm scope and payment before work begins.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-secondary" /> Two-business-day delivery</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" /> Human-reviewed</span>
              <span className="flex items-center gap-2"><Scale className="h-4 w-4 text-secondary" /> Rights diligence flagged</span>
            </div>
          </div>
          <Button asChild size="lg" className="w-full lg:w-auto">
            <Link href="/order-report">Order the $199 Brief <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 md:grid-cols-3 md:px-6">
        {[
          { icon: Gauge, title: "For producers", text: "Prioritize which properties deserve development time and rights outreach." },
          { icon: Layers3, title: "For rights holders", text: "Frame the modernization path without discarding the original audience contract." },
          { icon: Sparkles, title: "For investors", text: "Pressure-test timing, audience fit, and execution risk before committing capital." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-5">
              <Icon className="h-5 w-5 text-secondary" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs leading-5 text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <span>NostalDamus · A Cafecito AI project</span>
          <span>Decision support only. Scores are model outputs, not guarantees of commercial performance or legal clearance.</span>
        </div>
      </footer>
    </main>
  );
}
