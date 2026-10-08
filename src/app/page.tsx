import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, LibraryBig, MessageSquareText, Scale, ShieldCheck, FileText } from "lucide-react";
import { AskBar, ScoreBadge } from "@/components/brand";
import { currentYear } from "@/lib/scoring";
import { LiveShelf, LiveStats } from "@/components/LiveHome";
import { scoredProperties } from "@/services/property-data";


const exampleQuestions = [
  "Lowest-risk properties in the sweet spot",
  "Best toy or fad for a 2027 comeback",
  "Remix partners for Tamagotchi",
];

const deliverables = [
  "Revival Readiness Score with every input shown",
  "Audience and nostalgia-window assessment",
  "Rights and execution-risk flags",
  "What to preserve and what to modernize",
  "Recommended format, positioning, and launch angle",
  "A concise go / investigate / pass recommendation",
];

const weights = [
  { label: "Nostalgia window", weight: 40, note: "Original 12-year-olds reaching 40, the peak buying age", tone: "bg-primary" },
  { label: "Social buzz", weight: 30, note: "Live fan activity, memes, collector and streaming signals", tone: "bg-secondary" },
  { label: "Modern relevance", weight: 30, note: `How well the themes travel to a ${currentYear()} audience`, tone: "bg-accent" },
];

export default function Home() {
  return (
    <main>
      {/* Hero: the agent is the front door. */}
      <section className="scanlines border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> Decision intelligence for dormant IP
            </p>
            <h1 className="display mt-6 text-5xl leading-[0.98] md:text-7xl">
              Know which forgotten franchise is <em className="font-display italic text-primary">worth reviving.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              NostalDamus scores {scoredProperties.length} properties from 1993-1998 for audience timing, cultural relevance, and execution
              risk. Ask the research agent a question, or pressure-test one property with a human-reviewed brief.
            </p>
            <div className="mt-8 max-w-2xl">
              <AskBar size="lg" />
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleQuestions.map((q) => (
                  <Link key={q} href={`/prophet-chat/?q=${encodeURIComponent(q)}`} className="chip transition hover:border-primary/50 hover:text-foreground">
                    {q}
                  </Link>
                ))}
              </div>
            </div>
            <LiveStats />
          </div>

          {/* The shelf: today's top-ranked tapes. */}
          <LiveShelf />
        </div>
      </section>

      {/* Three ways in. */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-3 md:px-6">
        {[
          { icon: MessageSquareText, title: "Ask the Prophet", text: "A research agent that searches, compares, and cites the scored library for you.", href: "/prophet-chat/", cta: "Ask a question" },
          { icon: LibraryBig, title: "Explore the model", text: "Filter all properties by category, year, timing stage, readiness, and risk.", href: "/property-library/", cta: "Open the library" },
          { icon: FileText, title: "Order a $199 brief", text: "One property, one decision-ready memo, human-reviewed within two business days.", href: "/order-report/", cta: "Start an order" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href} className="scan-card group flex flex-col p-6 transition hover:border-primary/40">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="display mt-6 text-2xl">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                {item.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      {/* Methodology: transparent, not a black box. */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">How the score works</p>
            <h2 className="display mt-4 text-4xl leading-tight md:text-5xl">A transparent screen, not a black-box promise.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Revival Readiness is a reproducible weighted formula over hand-authored inputs. Every property carries its rubric version,
              so a score can be audited. It is a ranking heuristic. It is not presented as validated prediction accuracy.
            </p>
          </div>
          <div className="space-y-6">
            {weights.map((w) => (
              <div key={w.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-foreground">{w.label}</span>
                  <span className="font-mono text-sm text-muted-foreground">× {(w.weight / 100).toFixed(2)}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className={`h-2 rounded-full ${w.tone}`} style={{ width: `${w.weight * 2.5}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{w.note}</p>
              </div>
            ))}
            <p className="rounded-md border border-border bg-background/60 p-4 font-mono text-xs leading-6 text-muted-foreground">
              readiness = buzz × 0.30 + window × 0.40 + relevance × 0.30<br />
              risk = rights × 0.45 + sensitivity drag × 0.25 + creator gap × 0.30
            </p>
          </div>
        </div>
      </section>

      {/* The $199 product. */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">The $199 product</p>
          <h2 className="display mt-4 text-4xl leading-tight md:text-5xl">One property. One decision-ready brief.</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
            Tell us the IP and the decision in front of you. We run it through the model, review the output by hand, and return a focused
            opportunity memo within two business days. No contract and no subscription.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> Two-business-day delivery</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Human-reviewed</span>
            <span className="flex items-center gap-2"><Scale className="h-4 w-4 text-primary" /> Rights diligence flagged</span>
          </div>
          <Link href="/order-report/" className="mt-8 inline-flex h-12 items-center gap-2 rounded bg-primary px-6 font-medium text-primary-foreground transition hover:bg-primary/90">
            Order the $199 Brief <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="scan-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <p className="eyebrow">Sample deliverable</p>
            <span className="chip">Illustrative</span>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr]">
            <div className="border-border sm:border-r sm:pr-6">
              <p className="text-xs text-muted-foreground">Revival Readiness</p>
              <div className="mt-2"><ScoreBadge score={81} size="lg" showBand /></div>
            </div>
            <ul className="grid gap-2.5">
              {deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="border-t border-border px-6 py-4 text-xs leading-5 text-muted-foreground">
            Every paid brief uses the named property, visible scoring inputs, and a human review.
          </p>
        </div>
      </section>

      {/* Who it is for. */}
      <section className="mx-auto grid max-w-7xl gap-8 border-t border-border px-4 pt-14 md:grid-cols-3 md:px-6">
        {[
          { title: "For producers", text: "Prioritize which properties deserve development time and rights outreach." },
          { title: "For rights holders", text: "Frame the modernization path without breaking the original audience contract." },
          { title: "For investors", text: "Pressure-test timing, audience fit, and execution risk before committing capital." },
        ].map((item) => (
          <div key={item.title}>
            <h3 className="font-display text-xl text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
