"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Proposal = {
  id: string; kind: "outcome" | "field"; title: string; name: string; year: number;
  source_url: string; payload: Record<string, unknown>; created_at: string; status: string;
};
type Digest = { id: string; week: string; summary_md: string; unread_sources: string[]; created_at: string };
type Source = { property_id: string; name: string; source: string; query: string; read_to: string | null; last_error: string | null };
type Health = { digest: { last: string | null; age_days: number | null; overdue: boolean } };
type Tab = "proposals" | "digests" | "sources";

const TOKEN_KEY = "nostaldamus-admin-token";

function describe(p: Proposal): string {
  const x = p.payload;
  if (p.kind === "outcome") return `Outcome: ${x.kind} on ${x.event_date}`;
  return `${x.field}: ${x.from ?? "?"} → ${x.to}. ${x.reason ?? ""}`;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<Tab>("proposals");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [digests, setDigests] = useState<Digest[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    setToken(window.sessionStorage.getItem(TOKEN_KEY));
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
  }, []);

  const api = useCallback(async (path: string, init: RequestInit = {}) => {
    const res = await fetch(path, { ...init, headers: { ...(init.headers ?? {}), "x-admin-token": token ?? "" } });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      window.sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      throw new Error("The token was refused.");
    }
    if (!res.ok) throw new Error(data.error ?? `request failed (${res.status})`);
    return data;
  }, [token]);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const [p, d, s] = await Promise.all([api("/api/admin/proposals"), api("/api/admin/digests"), api("/api/admin/sources")]);
      setProposals(p.proposals);
      setDigests(d.digests);
      setSources(s.sources);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }, [api, token]);

  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, action: "approve" | "reject") => {
    setBusy(id);
    try {
      await api(`/api/admin/proposals/${id}/${action}`, { method: "POST" });
      setProposals((list) => list.filter((p) => p.id !== id));
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(null);
    }
  };

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="display text-3xl">Revival Watch admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the admin token. It stays in this browser tab only.</p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            window.sessionStorage.setItem(TOKEN_KEY, draft.trim());
            setToken(draft.trim());
            setDraft("");
          }}
        >
          <Input type="password" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Admin token" autoComplete="off" />
          <Button type="submit">Open</Button>
        </form>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </main>
    );
  }

  const failing = sources.filter((s) => s.last_error && !s.last_error.startsWith("partial:"));
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Private</p>
          <h1 className="display mt-3 text-4xl">Revival Watch</h1>
        </div>
        <Button variant="outline" className="border-border bg-muted/40" onClick={() => { window.sessionStorage.removeItem(TOKEN_KEY); setToken(null); }}>Lock</Button>
      </div>

      {health?.digest.overdue && (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Digest overdue. The last digest arrived {health.digest.age_days} days ago ({health.digest.last} UTC). Check the deployment runs for revival-watch-weekly.</span>
        </div>
      )}
      {health && health.digest.last === null && (
        <p className="mt-6 text-sm text-muted-foreground">No digest has arrived yet.</p>
      )}
      {error && <p className="mt-6 rounded-md border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}

      <nav className="mt-8 flex gap-2 border-b border-border pb-2">
        {([["proposals", `Proposals (${proposals.length})`], ["digests", `Digests (${digests.length})`], ["sources", `Sources (${failing.length} failing)`]] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`rounded-md px-3 py-1.5 text-sm ${tab === key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>
        ))}
      </nav>

      {tab === "proposals" && (
        <section className="mt-4 space-y-3">
          {proposals.length === 0 && <p className="text-sm text-muted-foreground">No open proposals.</p>}
          {proposals.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-foreground">{p.name} ({p.year}) · {p.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{describe(p)}</div>
                  {typeof p.payload.quote === "string" && <blockquote className="mt-2 border-l-2 border-white/20 pl-3 text-sm italic text-muted-foreground">{p.payload.quote}</blockquote>}
                  <a href={p.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-secondary hover:underline">
                    {new URL(p.source_url).hostname}<ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={busy === p.id} onClick={() => decide(p.id, "approve")}><Check className="mr-1 h-4 w-4" />Approve</Button>
                  <Button size="sm" variant="outline" className="border-border bg-muted/40" disabled={busy === p.id} onClick={() => decide(p.id, "reject")}><X className="mr-1 h-4 w-4" />Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === "digests" && (
        <section className="mt-4 space-y-4">
          {digests.length === 0 && <p className="text-sm text-muted-foreground">No digests yet.</p>}
          {digests.map((d) => (
            <article key={d.id} className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Week of {d.week} · posted {d.created_at} UTC</div>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-foreground/90">{d.summary_md}</pre>
              {d.unread_sources.length > 0 && (
                <p className="mt-3 text-sm text-amber-200"><span className="font-semibold">Not read:</span> {d.unread_sources.join("; ")}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "sources" && (
        <section className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr><th className="px-4 py-2">Property</th><th className="px-4 py-2">Source</th><th className="px-4 py-2">Read to</th><th className="px-4 py-2">Last error</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.length === 0 && <tr><td colSpan={4} className="px-4 py-4 text-muted-foreground">No sources are mapped yet. Run scripts/map-sources.mjs.</td></tr>}
              {sources.map((s) => (
                <tr key={`${s.property_id}-${s.source}`}>
                  <td className="px-4 py-2 text-foreground">{s.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{s.source} · {s.query}</td>
                  <td className="px-4 py-2 text-muted-foreground">{s.read_to ?? "never"}</td>
                  <td className={`px-4 py-2 ${s.last_error && !s.last_error.startsWith("partial:") ? "text-destructive" : "text-muted-foreground"}`}>{s.last_error ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
