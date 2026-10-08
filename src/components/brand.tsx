import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export { AskBar } from "./AskBar";

/** Score bands shared by every surface: go / watch / hold. */
export function scoreBand(score: number): { label: string; text: string; bar: string; ring: string } {
  if (score >= 78) return { label: "Go", text: "text-accent", bar: "bg-accent", ring: "border-accent/40" };
  if (score >= 65) return { label: "Watch", text: "text-primary", bar: "bg-primary", ring: "border-primary/40" };
  return { label: "Hold", text: "text-destructive", bar: "bg-destructive", ring: "border-destructive/40" };
}

/** Risk reads inverted: low risk is good. */
export function riskBand(risk: number): { text: string; bar: string } {
  if (risk < 35) return { text: "text-accent", bar: "bg-accent" };
  if (risk < 55) return { text: "text-primary", bar: "bg-primary" };
  return { text: "text-destructive", bar: "bg-destructive" };
}

export function ScoreBadge({ score, size = "md", showBand = false }: { score: number; size?: "sm" | "md" | "lg"; showBand?: boolean }) {
  const band = scoreBand(score);
  return (
    <span className="inline-flex flex-col gap-1.5">
      <span className={cn("font-mono font-semibold tabular-nums leading-none", band.text, size === "sm" && "text-base", size === "md" && "text-2xl", size === "lg" && "text-5xl")}>
        {score}
        {showBand && <span className="ml-2 align-middle font-mono text-[11px] font-medium uppercase tracking-[0.16em]">{band.label}</span>}
      </span>
      <Meter value={score} tone={band.bar} className={size === "lg" ? "w-40" : "w-16"} />
    </span>
  );
}

/** A thin 0-100 bar. `tone` colors the fill; `className` sizes the track. */
export function Meter({ value, tone = "bg-primary", className = "w-16" }: { value: number; tone?: string; className?: string }) {
  return (
    <span className={cn("block h-1 overflow-hidden rounded-full bg-muted", className)}>
      <span className={cn("block h-full rounded-full", tone)} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
    </span>
  );
}

export function PageHeader({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="mb-10 grid gap-6 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="eyebrow flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
        <h1 className="display mt-4 max-w-4xl text-4xl leading-[1.05] md:text-[3.4rem]">{title}</h1>
        {lede && <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{lede}</p>}
      </div>
      {aside}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-xs leading-5 text-muted-foreground md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <p className="font-display text-base text-foreground">NostalDamus</p>
          <p className="mt-1">Revival intelligence for dormant 1993-1998 IP. A Cafecito AI project.</p>
          <p className="mt-3 max-w-2xl">
            Decision support only. Scores are a transparent ranking heuristic built on hand-authored inputs under a versioned rubric.
            They are not validated predictions, valuations, rights clearance, or guarantees of commercial performance.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <Link href="/prophet-chat/" className="hover:text-foreground">Ask the Prophet</Link>
          <Link href="/property-library/" className="hover:text-foreground">Library</Link>
          <Link href="/market-intelligence/" className="hover:text-foreground">Market</Link>
          <Link href="/order-report/" className="hover:text-foreground">$199 Brief</Link>
          <a href="mailto:team@cafecito-ai.com" className="hover:text-foreground">team@cafecito-ai.com</a>
        </nav>
      </div>
    </footer>
  );
}
