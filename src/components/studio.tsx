"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Concept, Verdict } from "@/lib/studio";

/** Saves text as a file in the browser. */
export function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "studio";

function Section({ eyebrow, title, action, children }: { eyebrow: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="scan-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-1 text-2xl">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DownloadButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
      <Download className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

export function ConceptView({ concept }: { concept: Concept }) {
  return (
    <Section eyebrow="Concept" title={concept.title}>
      <p className="font-display text-xl leading-8 text-foreground">{concept.logline}</p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        {[["Format", concept.format], ["Tone", concept.tone], ["Audience", concept.audience]].map(([k, v]) => (
          <div key={k} className="metric-tile"><dt className="eyebrow">{k}</dt><dd className="mt-1 text-foreground">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 text-sm leading-6 text-muted-foreground">
          <div><h3 className="eyebrow mb-1">Premise</h3><p>{concept.premise}</p></div>
          <div><h3 className="eyebrow mb-1">World</h3><p>{concept.world}</p></div>
          <div><h3 className="eyebrow mb-1">Story engine</h3><p>{concept.story_engine}</p></div>
        </div>
        <div>
          <h3 className="eyebrow mb-2">Characters</h3>
          <ul className="space-y-2">
            {concept.characters.map((c) => (
              <li key={c.name} className="rounded-md border border-border p-3 text-sm">
                <span className="font-medium text-foreground">{c.name}</span> <span className="chip ml-1">{c.role}</span>
                <p className="mt-1 leading-6 text-muted-foreground">{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="eyebrow mb-2">Borrowed mechanics, not expression</h3>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              {concept.borrowed_mechanics.map((m) => (
                <tr key={m.source + m.mechanic}><td className="py-2 pr-4 align-top font-medium text-foreground">{m.source}</td><td className="py-2 text-muted-foreground">{m.mechanic}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><h3 className="eyebrow mb-2">New</h3><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-accent">{concept.new_elements.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h3 className="eyebrow mb-2">Risks</h3><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-destructive">{concept.risks.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      </div>
    </Section>
  );
}

export function PosterView({ image, svg, title }: { image: string | null; svg: string | null; title: string }) {
  // An <img> never runs scripts inside an SVG; the worker also sanitizes it.
  const src = useMemo(() => image ?? (svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : null), [image, svg]);
  if (!src) return null;
  const save = async () => {
    if (svg && !image) return download(`${slugify(title)}-poster.svg`, svg, "image/svg+xml");
    const blob = await (await fetch(src)).blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slugify(title)}-poster.png`;
    a.click();
  };
  return (
    <Section eyebrow="Poster" title="One-sheet" action={<DownloadButton label={image ? "PNG" : "SVG"} onClick={save} />}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`Poster for ${title}`} className="mx-auto aspect-[2/3] w-full max-w-sm rounded-md border border-border bg-black object-cover shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]" />
      {!image && <p className="mt-3 text-center text-xs text-muted-foreground">Vector poster. Set OPENAI_API_KEY for generated key art.</p>}
    </Section>
  );
}

type Line = { kind: "title" | "scene" | "action" | "character" | "paren" | "dialogue" | "transition"; text: string };

/** Minimal Fountain parser: enough for headings, action, dialogue, and transitions. */
export function parseFountain(text: string): Line[] {
  const raw = text.replace(/\r/g, "").split("\n");
  const out: Line[] = [];
  let inDialogue = false;
  raw.forEach((line, i) => {
    const t = line.trim();
    if (!t) { inDialogue = false; return; }
    // Only the opening line is a title page; a later "Title:" is ordinary text.
    if (/^title:/i.test(t) && raw.slice(0, i).every((l) => !l.trim())) { out.push({ kind: "title", text: t.replace(/^title:\s*/i, "") }); return; }
    if (/^(\.|int\.|ext\.|int\/ext|i\/e)/i.test(t)) { out.push({ kind: "scene", text: t.replace(/^\./, "").toUpperCase() }); inDialogue = false; return; }
    if (/^>/.test(t) || /^[A-Z .]+TO:$/.test(t) || /^(FADE (IN|OUT)|CUT TO BLACK)/.test(t)) { out.push({ kind: "transition", text: t.replace(/^>\s*/, "") }); return; }
    if (inDialogue) { out.push({ kind: /^\(.*\)$/.test(t) ? "paren" : "dialogue", text: t }); return; }
    const next = raw[i + 1]?.trim() ?? "";
    const prevBlank = !raw[i - 1]?.trim();
    if (prevBlank && next && /^[A-Z0-9 .'\-#]+(\s*\((V\.O\.|O\.S\.|O\.C\.|CONT'D)\))?$/.test(t) && /[A-Z]/.test(t) && t.length < 40) {
      out.push({ kind: "character", text: t }); inDialogue = true; return;
    }
    out.push({ kind: "action", text: t });
  });
  return out;
}

export function ScreenplayView({ text, title }: { text: string; title: string }) {
  const lines = useMemo(() => parseFountain(text), [text]);
  return (
    <Section eyebrow="Opening pages" title="Screenplay" action={<DownloadButton label="Fountain" onClick={() => download(`${slugify(title)}.fountain`, text, "text/plain")} />}>
      <div className="mx-auto max-w-2xl rounded-sm bg-[hsl(40_33%_94%)] px-6 py-10 font-mono text-[13px] leading-6 text-[hsl(30_10%_12%)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:px-14">
        {lines.map((l, i) => {
          if (l.kind === "title") return <p key={i} className="mb-10 text-center text-base font-semibold uppercase tracking-wide">{l.text}</p>;
          if (l.kind === "scene") return <p key={i} className="mt-6 font-semibold">{l.text}</p>;
          if (l.kind === "transition") return <p key={i} className="mt-4 text-right">{l.text}</p>;
          if (l.kind === "character") return <p key={i} className="mt-4 text-center">{l.text}</p>;
          if (l.kind === "paren") return <p key={i} className="mx-auto max-w-[16rem] text-center italic">{l.text}</p>;
          if (l.kind === "dialogue") return <p key={i} className="mx-auto max-w-[22rem]">{l.text}</p>;
          return <p key={i} className="mt-3">{l.text}</p>;
        })}
      </div>
    </Section>
  );
}

const verdictTone: Record<Verdict["verdict"], { label: string; cls: string }> = {
  develop: { label: "Develop", cls: "border-accent/50 bg-accent/10 text-accent" },
  revise: { label: "Revise", cls: "border-primary/50 bg-primary/10 text-primary" },
  pass: { label: "Pass", cls: "border-destructive/50 bg-destructive/10 text-destructive" },
};

export function VerdictView({ verdict }: { verdict: Verdict }) {
  const tone = verdictTone[verdict.verdict] ?? verdictTone.revise;
  const lists: [string, string[], string][] = [
    ["Strengths", verdict.strengths, "marker:text-accent"],
    ["Concerns", verdict.concerns, "marker:text-destructive"],
    ["Rights flags", verdict.rights_flags.length ? verdict.rights_flags : ["None raised."], "marker:text-primary"],
    ["Next steps", verdict.next_steps, "marker:text-primary"],
  ];
  return (
    <Section eyebrow="Greenlight" title="Should we make it?">
      <div className="flex flex-wrap items-start gap-4">
        <span className={cn("rounded border px-4 py-2 font-mono text-lg font-semibold uppercase tracking-[0.16em]", tone.cls)}>{tone.label}</span>
        <p className="min-w-0 flex-1 leading-7 text-muted-foreground">{verdict.summary}</p>
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {verdict.scores.map((s) => (
          <div key={s.dimension}>
            <div className="flex items-baseline justify-between text-sm"><span className="text-foreground">{s.dimension}</span><span className="font-mono text-muted-foreground">{s.score}/5</span></div>
            <div className="mt-1.5 flex gap-1">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={cn("h-1.5 flex-1 rounded-full", n <= s.score ? "bg-primary" : "bg-muted")} />)}</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {lists.map(([name, items, marker]) => (
          <div key={name}><h3 className="eyebrow mb-2">{name}</h3><ul className={cn("list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground", marker)}>{items.map((x) => <li key={x}>{x}</li>)}</ul></div>
        ))}
      </div>
      {verdict.audience_test_questions.length > 0 && (
        <div className="mt-6 rounded-md border border-border bg-muted/30 p-4">
          <h3 className="eyebrow mb-2">Test with an audience</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm leading-6 text-muted-foreground">{verdict.audience_test_questions.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      )}
      <p className="mt-5 text-xs leading-5 text-muted-foreground">A creative judgment by the model, not a market forecast. Clear rights before using any element in production.</p>
    </Section>
  );
}

