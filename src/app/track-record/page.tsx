"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, ExternalLink, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Outcome = { kind: string; event_date: string; source_url: string };
type Call = {
  property_id: string; name: string; opened: string; open_score: number; closes: string;
  state: "open" | "hit" | "miss"; outcome?: Outcome;
};
type TrackRecord = {
  rule: { flagLine: number; windowMonths: number };
  trackingSince: string | null;
  snapshotWeeks: number;
  summary: { open: number; hits: number; misses: number; resolved: number; hitRate: number | null; minResolvedForRate: number };
  calls: Call[];
  surprises: { property_id: string; name: string; outcome: Outcome }[];
};

const stateStyle = {
  open: { label: "Open", icon: CircleDashed, className: "text-amber-300" },
  hit: { label: "Hit", icon: CheckCircle2, className: "text-emerald-300" },
  miss: { label: "Miss", icon: XCircle, className: "text-rose-300" },
} as const;

export default function TrackRecordPage() {
  const [data, setData] = useState<TrackRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/track-record", { headers: { accept: "application/json" } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`request failed (${res.status})`);
        setData(await res.json());
      })
      .catch((e) => setError(String(e.message ?? e)));
  }, []);

  const s = data?.summary;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <section className="mb-8">
        <Badge className="border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/10">Track record</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Every call, and what happened next.</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          {data
            ? <>A property is flagged when its Revival Readiness Score reaches {data.rule.flagLine}. The call is a hit if revival news
              arrives within {data.rule.windowMonths} months, and a miss if the window closes without it. A call stays open even if
              the score falls later. Every outcome links to its source.</>
            : "Loading the ledger."}
        </p>
      </section>

      {error && <p className="rounded-md border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">The ledger could not load: {error}</p>}

      {s && data && (
        <>
          <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Open calls", s.open],
              ["Hits", s.hits],
              ["Misses", s.misses],
              ["Hit rate", s.hitRate === null ? `after ${s.minResolvedForRate} resolve` : `${s.hitRate}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                <div className={`mt-2 font-semibold text-white ${typeof value === "number" ? "text-3xl" : "text-base"}`}>{value}</div>
              </div>
            ))}
          </section>
          <p className="mb-6 text-sm text-muted-foreground">
            {data.trackingSince
              ? <>Tracking since {data.trackingSince} · {data.snapshotWeeks} weekly snapshot{data.snapshotWeeks === 1 ? "" : "s"} · {s.resolved} of {s.minResolvedForRate} calls resolved before a hit rate is shown.</>
              : "The first weekly snapshot has not run yet."}
          </p>

          <section className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr><th className="px-4 py-3">Property</th><th className="px-4 py-3">Flagged</th><th className="px-4 py-3">State</th><th className="px-4 py-3">Outcome</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.calls.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No property has reached the flag line yet.</td></tr>
                )}
                {data.calls.map((c) => {
                  const st = stateStyle[c.state];
                  const Icon = st.icon;
                  return (
                    <tr key={`${c.property_id}-${c.opened}`}>
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.opened} at {c.open_score}</td>
                      <td className={`px-4 py-3 ${st.className}`}><span className="inline-flex items-center gap-1.5"><Icon className="h-4 w-4" />{st.label}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.outcome
                          ? <a className="inline-flex items-center gap-1 hover:text-white" href={c.outcome.source_url} target="_blank" rel="noreferrer">{c.outcome.kind} {c.outcome.event_date}<ExternalLink className="h-3.5 w-3.5" /></a>
                          : c.state === "open" ? `window closes ${c.closes}` : "no revival news in the window"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {data.surprises.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-white">Surprises</h2>
              <p className="mt-1 text-sm text-muted-foreground">Revival news for a property the engine had not flagged. These count against the model.</p>
              <ul className="mt-3 space-y-2 text-sm">
                {data.surprises.map((x) => (
                  <li key={`${x.property_id}-${x.outcome.event_date}`} className="text-muted-foreground">
                    <span className="text-white">{x.name}</span> · {x.outcome.kind} {x.outcome.event_date} ·{" "}
                    <a className="underline hover:text-white" href={x.outcome.source_url} target="_blank" rel="noreferrer">source</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
