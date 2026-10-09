"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader, ScoreBadge } from "@/components/brand";
import { SignalChart } from "@/components/SignalChart";
import { useLibrary } from "@/hooks/use-library";
import { evidencePoints, summarize, type DayPoint, type EvidenceRecord } from "@/lib/signals";
import evidenceData from "../../../data/evidence.json";

const evidence = evidenceData as Record<string, EvidenceRecord>;

type SourceSeries = { query: string | null; read_to: string | null; last_error: string | null; days: DayPoint[] };
type Signals = {
  property_id: string; from: string; to: string;
  sources: Record<string, SourceSeries>;
  snapshots: { week: string; score: number; social_buzz: number; modern_relevance: number; window_alignment: number; rubric_version: string }[];
};

const pct = (g: number | null) => (g === null ? null : `${g > 0 ? "+" : ""}${Math.round(g * 100)}%`);
const num = (n: number | null | undefined) => (n === null || n === undefined ? "–" : n.toLocaleString("en-US"));

function AnalyticsContent() {
  const params = useSearchParams();
  const library = useLibrary();
  const [selectedId, setSelectedId] = useState(params.get("propertyId") || library[0].id);
  const property = useMemo(() => library.find((p) => p.id === selectedId) || library[0], [library, selectedId]);
  const [signals, setSignals] = useState<Signals | null>(null);
  const [apiState, setApiState] = useState<"loading" | "ok" | "unavailable">("loading");

  useEffect(() => {
    let alive = true;
    setApiState("loading");
    setSignals(null);
    fetch(`/api/properties/${property.id}/signals`, { headers: { accept: "application/json" } })
      .then(async (res) => { if (!res.ok) throw new Error(String(res.status)); return res.json() as Promise<Signals>; })
      .then((s) => { if (alive) { setSignals(s); setApiState("ok"); } })
      .catch(() => { if (alive) setApiState("unavailable"); });
    return () => { alive = false; };
  }, [property.id]);

  const ev = evidence[property.id];
  const wiki = signals?.sources.wikipedia;
  const reddit = signals?.sources.arcticshift;
  const liveWiki = (wiki?.days.length ?? 0) >= 14;
  const wikiPoints = liveWiki ? wiki!.days : evidencePoints(ev);
  const wikiSummary = summarize(wikiPoints);
  const redditSummary = reddit ? summarize(reddit.days) : null;
  const snapshots = signals?.snapshots ?? [];
  const orderHref = `/order-report/?property=${encodeURIComponent(property.name)}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow={`Signals · #${property.rank} · ${property.year} · ${property.category}`}
        title={property.name}
        lede="What people are doing right now about this property: daily Wikipedia reads, posts in its own subreddit, and how the weekly score has moved. Every number links to where it came from."
        aside={
          <div className="scan-card w-full p-4 lg:w-[360px]">
            <label className="eyebrow mb-2 block" htmlFor="property-select">Select property</label>
            <select id="property-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="field">
              {[...library].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                <option key={item.id} value={item.id}>{item.name} ({item.year})</option>
              ))}
            </select>
            <div className="mt-4 flex items-end justify-between gap-4">
              <ScoreBadge score={property.revivalReadinessScore} size="md" showBand />
              <Link href={`/analysis-tools/?propertyId=${property.id}`} className="text-sm font-medium text-primary hover:text-foreground">Full analysis</Link>
            </div>
          </div>
        }
      />

      <section className="scan-card p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Wikipedia pageviews</p>
            <h2 className="display mt-1 text-2xl">
              {wikiPoints.length === 0
                ? "No pageview data yet"
                : liveWiki
                  ? `Daily reads, ${wikiSummary.from} to ${wikiSummary.to}`
                  : `Monthly reads, ${wikiSummary.from?.slice(0, 7)} to ${wikiSummary.to?.slice(0, 7)}`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {liveWiki
                ? <>From the hourly signal cron, read through {wiki?.read_to ?? "–"}{wiki?.last_error ? ` (last error: ${wiki.last_error})` : ""}.</>
                : ev?.pv_monthly
                  ? <>From the evidence file collected {ev.collected_at}. The hourly cron has not read this property yet.</>
                  : apiState === "loading" ? "Loading." : "No source is mapped for this property. The score uses the hand-authored buzz."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-right">
            <div>
              <div className="font-mono text-2xl font-semibold text-foreground">{num(wikiSummary.mean30)}</div>
              <div className="mt-1 text-xs text-muted-foreground">{liveWiki ? "a day, last 30 days" : "last point"}</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold text-foreground">{num(wikiSummary.prior60)}</div>
              <div className="mt-1 text-xs text-muted-foreground">{liveWiki ? "a day, 60 days before" : "prior"}</div>
            </div>
            <div>
              <div className={`font-mono text-2xl font-semibold ${(wikiSummary.growth ?? 0) > 0 ? "text-accent" : (wikiSummary.growth ?? 0) < 0 ? "text-destructive" : "text-foreground"}`}>{pct(wikiSummary.growth) ?? "–"}</div>
              <div className="mt-1 text-xs text-muted-foreground">momentum</div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-foreground">
          {wikiPoints.length >= 2
            ? <SignalChart points={wikiPoints} accentLast={liveWiki ? 30 : 1} height={220} unit=" views" />
            : <div className="flex h-40 items-center justify-center rounded border border-dashed border-border text-sm text-muted-foreground">Nothing to draw yet. Map a Wikipedia title in sources-reviewed.csv and the cron fills this in within a day.</div>}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="scan-card p-5">
          <p className="eyebrow">Reddit</p>
          <h3 className="display mt-1 text-2xl">{reddit?.query ? `r/${reddit.query}` : ev?.subreddit ? `r/${ev.subreddit}` : "No dedicated subreddit"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {reddit && reddit.days.length >= 14
              ? <>Posts a day in the property&apos;s own subreddit, read through {reddit.read_to ?? "–"}.</>
              : ev?.subreddit
                ? <>{num(ev.subreddit_subscribers)} members when collected on {ev.collected_at}. Daily post counts arrive once the cron reads this pair.</>
                : "Generic subreddits are left unmapped on purpose: a wrong community would record false interest."}
          </p>
          {reddit && reddit.days.length >= 14 ? (
            <>
              <div className="mt-4 flex gap-6">
                <div><div className="font-mono text-2xl font-semibold">{num(redditSummary?.mean30 !== null && redditSummary?.mean30 !== undefined ? Math.round(redditSummary.mean30 * 30) : null)}</div><div className="mt-1 text-xs text-muted-foreground">posts, last 30 days</div></div>
                <div><div className="font-mono text-2xl font-semibold">{pct(redditSummary?.growth ?? null) ?? "–"}</div><div className="mt-1 text-xs text-muted-foreground">vs the 60 days before</div></div>
              </div>
              <div className="mt-4 text-foreground"><SignalChart points={reddit.days} height={150} unit=" posts" /></div>
            </>
          ) : null}
        </div>
        <div className="scan-card p-5">
          <p className="eyebrow">Weekly score</p>
          <h3 className="display mt-1 text-2xl">{snapshots.length ? `${snapshots.length} snapshot${snapshots.length === 1 ? "" : "s"}` : "No snapshot yet"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {snapshots.length
              ? <>Written every Monday by the ledger. A snapshot never changes, so a call can be checked later on <Link href="/track-record/" className="text-primary hover:text-foreground">the track record</Link>.</>
              : apiState === "unavailable" ? "The API is not reachable from this page. Scores shown here come from the bundled corpus." : "The Monday ledger writes the first row after the weekly job runs."}
          </p>
          {snapshots.length > 0 && (
            <table className="mt-4 w-full text-sm">
              <thead className="text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="py-2 font-normal">Week</th><th className="py-2 font-normal">Score</th><th className="py-2 font-normal">Buzz</th><th className="py-2 font-normal">Rubric</th></tr></thead>
              <tbody className="divide-y divide-border">
                {snapshots.slice(-8).reverse().map((s) => (
                  <tr key={s.week}><td className="py-2 font-mono text-muted-foreground">{s.week}</td><td className="py-2 font-mono font-semibold">{s.score}</td><td className="py-2 font-mono">{s.social_buzz}</td><td className="py-2 text-xs text-muted-foreground">{s.rubric_version}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-6 scan-card overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="eyebrow">Evidence on file</p>
          <h3 className="display mt-1 text-2xl">Where each input comes from</h3>
        </div>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-border">
            <Row label="Wikipedia article" value={ev?.wiki_title ?? wiki?.query ?? "not mapped"} href={ev?.wiki_url} />
            <Row label="Pageviews, 90-day median" value={ev?.pv_median_90 !== undefined && ev?.pv_median_90 !== null ? `${num(ev.pv_median_90)} a day` : liveWiki ? `${num(wikiSummary.median)} a day (live)` : "unknown"} href={ev?.pv_url} />
            <Row label="Subreddit" value={ev?.subreddit ? `r/${ev.subreddit}, ${num(ev.subreddit_subscribers)} members` : reddit?.query ? `r/${reddit.query}` : "none mapped"} href={ev?.subreddit_url} />
            <Row label="Latest revival or rights news" value={ev?.news_url ? `${ev.news_date ?? "date unknown"}: ${ev.news_note ?? ""}` : `none found${ev?.collected_at ? ` as of ${ev.collected_at}` : ""}`} href={ev?.news_url ?? undefined} />
            <Row label="Rubric" value={`${property.rubricVersion ?? "unknown"} · buzz ${property.socialBuzz}, relevance ${property.modernRelevance}, window ${property.nostalgiaAlignment}`} />
          </tbody>
        </table>
      </section>

      <section className="mt-6 grid gap-4 rounded border border-primary/30 bg-primary/10 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h3 className="display text-2xl">Need this verified before you spend on it?</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">The $199 Revival Opportunity Brief on {property.name}: rights holder of record, audience, comparables, risks, and what we could not verify. Human-reviewed, two business days.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={orderHref} className="inline-flex h-11 items-center rounded bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90">Order the $199 brief</Link>
          <Link href={`/compare/?ids=${property.id}`} className="inline-flex h-11 items-center rounded border border-border px-5 text-sm hover:text-foreground">Compare with others</Link>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <tr>
      <td className="w-56 px-5 py-3 text-muted-foreground">{label}</td>
      <td className="px-5 py-3 text-foreground">
        {href
          ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">{value}<ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>
          : value}
      </td>
    </tr>
  );
}

export default function PropertyAnalytics() {
  return (
    <Suspense fallback={<main className="p-8">Loading signals...</main>}>
      <AnalyticsContent />
    </Suspense>
  );
}
