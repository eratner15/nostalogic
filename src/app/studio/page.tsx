"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Download, Film, Loader2, Plus, Share2, Sparkles, TriangleAlert, X } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { SizzlePlayer } from "@/components/sizzle";
import { ConceptView, PosterView, ScreenplayView, VerdictView, download, slugify } from "@/components/studio";
import { useLibrary } from "@/hooks/use-library";
import { cn } from "@/lib/utils";
import {
  STEP_LABELS, STUDIO_FORMATS, STUDIO_STEPS,
  type Art, type Concept, type Sizzle, type StudioPackage, type StudioStep, type Verdict,
} from "@/lib/studio";

type Parts = {
  concept: Concept | null;
  screenplay: string | null;
  sizzle: Sizzle | null;
  art: Art | null;
  verdict: Verdict | null;
};
const emptyParts: Parts = { concept: null, screenplay: null, sizzle: null, art: null, verdict: null };

function getSessionKey(): string {
  try {
    const existing = window.localStorage.getItem("nostaldamus-session");
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.localStorage.setItem("nostaldamus-session", fresh);
    return fresh;
  } catch {
    return "anon";
  }
}

async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<Record<string, unknown>> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = chunk.split("\n").filter((l) => l.startsWith("data: ")).map((l) => l.slice(6)).join("");
      if (data) {
        try { yield JSON.parse(data); } catch { /* skip a malformed frame */ }
      }
    }
  }
}

type GalleryPack = { id: string; format: string; title: string; logline: string; tagline: string | null; poster: string | null; verdict: string | null };

/** The public gallery: the latest finished packs, each a shareable page. */
function RecentPacks() {
  const [packs, setPacks] = useState<GalleryPack[] | null>(null);
  useEffect(() => {
    fetch("/api/studio").then((r) => (r.ok ? r.json() : { packs: [] })).then((d) => setPacks(d.packs ?? [])).catch(() => setPacks([]));
  }, []);
  if (!packs?.length) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="display mt-1 text-2xl">Recent packs</h2>
        </div>
        <p className="text-xs text-muted-foreground">Each pack has its own link, poster preview, and sizzle.</p>
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {packs.map((p) => (
          <li key={p.id}>
            <a href={`/studio/?id=${p.id}`} className="group block">
              <div className="aspect-[2/3] overflow-hidden rounded-md border border-border bg-muted">
                {p.poster
                  ? <img src={p.poster} alt={`${p.title} poster`} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                  : <div className="flex h-full items-center justify-center p-3 text-center display text-lg leading-tight text-foreground">{p.title}</div>}
              </div>
              <p className="mt-2 truncate text-sm font-medium text-foreground group-hover:text-primary">{p.title}</p>
              <p className="truncate text-xs text-muted-foreground">{p.format}{p.verdict ? ` · ${p.verdict}` : ""}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const stepKey: Record<StudioStep, keyof Parts> = {
  concept: "concept", screenplay: "screenplay", sizzle: "sizzle", art: "art", verdict: "verdict",
};

function StudioContent() {
  const params = useSearchParams();
  const library = useLibrary();
  const packageId = params.get("id");

  const initialIds = [...new Set((params.get("ids") ?? "").split(",").filter(Boolean))].slice(0, 4);
  const [sourceIds, setSourceIds] = useState<string[]>(initialIds.length ? initialIds : []);
  const [toAdd, setToAdd] = useState("");
  const [format, setFormat] = useState<string>(STUDIO_FORMATS.find((f) => f === params.get("format")) ?? "Streaming Series");

  const [parts, setParts] = useState<Parts>(emptyParts);
  const [meta, setMeta] = useState<{ format: string; propertyIds: string[] } | null>(null);
  const [active, setActive] = useState<StudioStep | null>(null);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  runningRef.current = running;
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const runningId = useRef<string | null>(null);

  const byId = useMemo(() => new Map(library.map((p) => [p.id, p])), [library]);
  // An id no longer in the library (an old link) is never shown, counted, or sent.
  const sources = sourceIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const sourceKeys = sources.map((p) => p.id);
  const available = library.filter((p) => !sourceIds.includes(p.id));

  // Load a saved package when the URL carries an id (and it is not the one streaming now).
  useEffect(() => {
    if (!packageId) {
      // Navigated back to /studio/ (for example, the Studio nav link): show the builder again.
      if (!runningRef.current) { runningId.current = null; setParts(emptyParts); setMeta(null); setError(null); }
      return;
    }
    if (packageId === runningId.current) return;
    if (!/^[0-9a-f-]{36}$/.test(packageId)) { setError("Package not found."); return; }
    let alive = true;
    setError(null);
    // Never show the previous pack under a new id, whether this load succeeds or not.
    setParts(emptyParts);
    setMeta(null);
    fetch(`/api/studio/${encodeURIComponent(packageId)}`).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!alive) return;
      if (!res.ok) { setError(data.error ?? "Package not found."); return; }
      const pkg = data as StudioPackage;
      setParts({ concept: pkg.concept, screenplay: pkg.screenplay, sizzle: pkg.sizzle, art: pkg.art, verdict: pkg.verdict });
      setMeta({ format: pkg.format, propertyIds: pkg.propertyIds });
      if (pkg.status === "error") setError(pkg.error ?? "This package stopped before it finished.");
      if (pkg.status === "running") setError("This package is still being made, or its run was interrupted. Reload in a minute.");
    }).catch(() => alive && setError("Network error."));
    return () => { alive = false; };
  }, [packageId]);

  const generate = async () => {
    if (sources.length < 2 || running) return;
    setRunning(true);
    setError(null);
    setParts(emptyParts);
    setMeta({ format, propertyIds: sourceKeys });
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ propertyIds: sourceKeys, format, sessionKey: getSessionKey() }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      let finished = false;
      for await (const event of readEvents(res.body)) {
        if (event.type === "started") {
          runningId.current = String(event.id);
          window.history.replaceState(null, "", `/studio/?id=${event.id}`);
        } else if (event.type === "step") {
          setActive(event.step as StudioStep);
        } else if (event.type === "result") {
          const key = stepKey[event.step as StudioStep];
          setParts((p) => ({ ...p, [key]: event.data }));
        } else if (event.type === "error") {
          finished = true;
          setError(String(event.message ?? "Something went wrong."));
        } else if (event.type === "done") {
          finished = true;
        }
      }
      if (!finished) setError("The connection closed early. Reload this page to see what was saved.");
    } catch {
      setError("Network error. Reload this page to see what was saved.");
    } finally {
      setActive(null);
      setRunning(false);
      // If the URL lost its id mid-run (Studio nav link), restore it so the pack can be shared.
      if (runningId.current && window.location.pathname.startsWith("/studio") && !new URLSearchParams(window.location.search).get("id")) {
        window.history.replaceState(null, "", `/studio/?id=${runningId.current}`);
      }
    }
  };

  const reset = () => {
    runningId.current = null;
    setParts(emptyParts);
    setMeta(null);
    setError(null);
    window.history.replaceState(null, "", "/studio/");
  };

  const shareUrl = typeof window !== "undefined" && packageId ? `${window.location.origin}/studio/?id=${packageId}` : "";
  const hasPackage = Boolean(meta) || Boolean(packageId);
  const title = parts.concept?.title ?? "Untitled";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Remix Studio · development pack"
        title={hasPackage && parts.concept ? parts.concept.title : "From remix to greenlight."}
        lede={hasPackage && parts.concept ? parts.concept.logline : "Blend two to four library properties into an original property, then get what you need to decide whether to make it: a movie poster, a sizzle reel you can watch in a minute, and a greenlight verdict."}
        aside={hasPackage ? (
          <div className="flex flex-wrap gap-2">
            {packageId && parts.verdict && !running && (
              <button
                onClick={async () => {
                  // Phones get the native share sheet; desktops copy the link.
                  if (navigator.share) {
                    try { await navigator.share({ title: `${title} · NostalDamus Studio`, text: parts.concept?.logline, url: shareUrl }); } catch { /* dismissed */ }
                    return;
                  }
                  try { await navigator.clipboard.writeText(shareUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { /* clipboard blocked */ }
                }}
                className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {copied ? "Link copied" : "Share"}
              </button>
            )}
            {parts.concept && (
              <button
                onClick={() => download(`${slugify(title)}-pack.json`, JSON.stringify({ ...meta, ...parts }, null, 2), "application/json")}
                className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Download className="h-4 w-4" /> Pack
              </button>
            )}
            {!running && <button onClick={reset} className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> New pack</button>}
          </div>
        ) : undefined}
      />

      {!hasPackage && (
        <section className="scan-card mb-8 grid gap-6 p-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">1 · Sources (2 to 4)</p>
            <div className="mt-3 space-y-2">
              {sources.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.year} · {p.category} · readiness {p.revivalReadinessScore}</span>
                  </span>
                  <button onClick={() => setSourceIds((ids) => ids.filter((x) => x !== p.id))} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
              ))}
              {sources.length < 4 && (
                <div className="flex gap-2">
                  <select value={toAdd} onChange={(e) => setToAdd(e.target.value)} className="field" aria-label="Add a source property">
                    <option value="">Add a property…</option>
                    {[...available].sort((a, b) => a.name.localeCompare(b.name)).map((p) => <option key={p.id} value={p.id}>{p.name} ({p.year})</option>)}
                  </select>
                  <button disabled={!toAdd} onClick={() => { setSourceIds((ids) => [...ids.filter((id) => byId.has(id)), toAdd]); setToAdd(""); }} className="rounded border border-border px-3 text-muted-foreground hover:text-foreground disabled:opacity-40" aria-label="Add"><Plus className="h-4 w-4" /></button>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">The result is a new property. It borrows mechanics and audience promises from the sources, never their names, characters, or songs.</p>
          </div>
          <div className="space-y-5">
            <div>
              <p className="eyebrow">2 · Format</p>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="field mt-3" aria-label="Format">
                {STUDIO_FORMATS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <button onClick={generate} disabled={sources.length < 2} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-primary font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40">
              <Sparkles className="h-4 w-4" /> Build the pack
            </button>
            <p className="text-xs leading-5 text-muted-foreground">Concept, script, sizzle shot list, poster and keyframes, verdict: about three to five minutes. Each step is saved as it finishes. Keep this tab open until the pack is done.</p>
          </div>
        </section>
      )}

      {!hasPackage && <RecentPacks />}

      {hasPackage && (
        <ol className="mb-8 grid gap-2 sm:grid-cols-5">
          {STUDIO_STEPS.map((step, i) => {
            const done = Boolean(parts[stepKey[step]]);
            const now = active === step;
            return (
              <li key={step} className={cn("flex items-center gap-2 rounded-md border px-3 py-2 text-sm", done ? "border-accent/40 text-foreground" : now ? "border-primary/50 text-foreground" : "border-border text-muted-foreground")}>
                {done ? <Check className="h-4 w-4 text-accent" /> : now ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <span className="w-4 text-center font-mono text-xs">{i + 1}</span>}
                {STEP_LABELS[step]}
              </li>
            );
          })}
        </ol>
      )}

      {error && (
        <div className="mb-8 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p><span className="text-foreground">{error}</span> The deterministic pitch in the <Link href="/remix-lab/" className="text-primary hover:underline">Remix Lab</Link> works without the model.</p>
        </div>
      )}

      {hasPackage && meta && meta.propertyIds.length > 0 && (
        <p className="mb-6 text-sm text-muted-foreground">
          <Film className="mr-1.5 inline h-4 w-4 text-primary" />
          {meta.format} · built from {meta.propertyIds.map((id) => byId.get(id)?.name ?? id).join(" + ")}
        </p>
      )}

      <div className="space-y-6">
        {parts.sizzle && <SizzlePlayer sizzle={parts.sizzle} images={parts.art?.shotImages ?? parts.sizzle.shots.map(() => null)} artPending={running && !parts.art} />}
        {parts.sizzle && !parts.art && running && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Generating the poster and keyframes. The sizzle plays with text cards until they land.</p>
        )}
        {parts.art?.note && <p className="text-xs text-muted-foreground">{parts.art.note}</p>}
        {(parts.art || parts.verdict) && (
          <div className={cn("grid gap-6", parts.art && parts.verdict && "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]")}>
            {parts.art && <PosterView image={parts.art.posterImage} svg={parts.art.posterSvg} title={title} />}
            {parts.verdict && <VerdictView verdict={parts.verdict} />}
          </div>
        )}
        {parts.concept && <ConceptView concept={parts.concept} />}
        {parts.screenplay && (
          <details className="scan-card group">
            <summary className="cursor-pointer list-none px-5 py-4 text-sm text-muted-foreground hover:text-foreground">
              <span className="eyebrow mr-2">Opening pages</span> Read the first three minutes of the script
            </summary>
            <div className="border-t border-border p-2"><ScreenplayView text={parts.screenplay} title={title} /></div>
          </details>
        )}
      </div>
    </main>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-10 text-muted-foreground md:px-6">Loading the studio...</main>}>
      <StudioContent />
    </Suspense>
  );
}
