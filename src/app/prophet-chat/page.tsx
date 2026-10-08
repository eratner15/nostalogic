"use client";

import { Fragment, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BarChart3, BookOpen, GitCompareArrows, Loader2, Network, Search, Send, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader, scoreBand } from "@/components/brand";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/hooks/use-library";
import type { PropertyScore } from "@/services/property-data";

type Lookup = Map<string, PropertyScore>;

type Step = { tool: string; summary: string; ids: string[]; isError: boolean };
type Turn =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; steps: Step[]; cited: string[]; status: "working" | "done" | "error"; error?: string };

const starters = [
  "Which Sweet Spot properties have the lowest risk right now?",
  "What toy or fad from 1996-1998 is most ready for a comeback?",
  "Compare Daria, Furby, and Tamagotchi as revival bets.",
  "Find cross-category remix partners for Tamagotchi.",
  "Which category is hottest overall, and what leads it?",
  "What horror properties should a streamer look at first?",
];

const toolMeta: Record<string, { icon: LucideIcon; label: string }> = {
  search_library: { icon: Search, label: "Search" },
  get_properties: { icon: BookOpen, label: "Open" },
  compare_properties: { icon: GitCompareArrows, label: "Compare" },
  library_overview: { icon: BarChart3, label: "Overview" },
  find_similar: { icon: Network, label: "Similar" },
};

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

/** Reads a text/event-stream body and yields each parsed `data:` JSON payload. */
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
      const data = chunk.split("\n").filter((line) => line.startsWith("data: ")).map((line) => line.slice(6)).join("");
      if (data) {
        try {
          yield JSON.parse(data);
        } catch {
          // Ignore a malformed frame rather than abandoning the answer.
        }
      }
    }
  }
}

function ProphetContent() {
  const params = useSearchParams();
  const library = useLibrary();
  const lookup: Lookup = useMemo(() => new Map(library.map((p) => [p.id, p])), [library]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const askedFromUrl = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  const patchLast = (patch: (turn: Extract<Turn, { role: "assistant" }>) => Partial<Extract<Turn, { role: "assistant" }>>) =>
    setTurns((current) => {
      const last = current[current.length - 1];
      if (!last || last.role !== "assistant") return current;
      return [...current.slice(0, -1), { ...last, ...patch(last) }];
    });

  const send = useCallback(async (text: string, prior: Turn[]) => {
    const message = text.trim();
    if (!message) return;
    setInput("");
    setBusy(true);
    const history = prior
      .filter((t) => t.role === "user" || t.status === "done")
      .map((t) => ({ role: t.role, content: t.content }));
    setTurns([...prior, { role: "user", content: message }, { role: "assistant", content: "", steps: [], cited: [], status: "working" }]);

    try {
      const res = await fetch("/api/prophet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, sessionKey: getSessionKey(), history }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        patchLast(() => ({ status: "error", error: data.error ?? `Request failed (${res.status}).` }));
        return;
      }
      let finished = false;
      for await (const event of readEvents(res.body)) {
        if (event.type === "step") {
          const step = event as unknown as Step;
          patchLast((t) => ({ steps: [...t.steps, { tool: step.tool, summary: step.summary, ids: step.ids, isError: step.isError }] }));
        } else if (event.type === "answer") {
          finished = true;
          patchLast(() => ({ content: String(event.text ?? ""), cited: (event.cited as string[]) ?? [], status: "done" }));
        } else if (event.type === "error") {
          finished = true;
          patchLast(() => ({ status: "error", error: String(event.message ?? "Something went wrong.") }));
        }
      }
      if (!finished) patchLast(() => ({ status: "error", error: "The connection closed before an answer arrived." }));
    } catch {
      patchLast(() => ({ status: "error", error: "Network error. Try again." }));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const q = params.get("q");
    if (q && !askedFromUrl.current) {
      askedFromUrl.current = true;
      void send(q, []);
    }
  }, [params, send]);

  const submit = (text: string) => {
    if (!busy) void send(text, turns);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="The Prophet · research agent"
        title="Ask the archive."
        lede="The Prophet is a research agent. It plans searches over the 120 scored properties, opens the records it needs, compares candidates, and answers with every claim linked to its source property."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="min-w-0">
          {turns.length === 0 && (
            <div className="mb-6 grid gap-2 sm:grid-cols-2">
              {starters.map((starter) => (
                <button
                  key={starter}
                  onClick={() => submit(starter)}
                  className="group flex items-start justify-between gap-3 rounded-md border border-border bg-card p-4 text-left text-sm leading-6 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                >
                  {starter}
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100 group-hover:text-primary" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {turns.map((turn, index) =>
              turn.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <p className="max-w-[85%] rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-6 text-foreground">{turn.content}</p>
                </div>
              ) : (
                <AssistantTurn key={index} turn={turn} lookup={lookup} />
              ),
            )}
            <div ref={endRef} />
          </div>

          <form
            className="sticky bottom-4 mt-6 flex items-center gap-2 rounded-md border border-input bg-card/95 p-1.5 pl-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur focus-within:border-primary/70"
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={turns.length ? "Ask a follow-up..." : "Ask about readiness, timing, risk, pairings..."}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              maxLength={1000}
              aria-label="Question for the Prophet"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-10 items-center gap-2 rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="hidden sm:inline">{busy ? "Researching" : "Ask"}</span>
            </button>
          </form>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="scan-card p-5">
            <p className="eyebrow">How it researches</p>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.entries(toolMeta).map(([name, meta]) => {
                const Icon = meta.icon;
                return (
                  <li key={name} className="flex items-start gap-3 text-muted-foreground">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="text-foreground">{meta.label}</span>
                      {" "}
                      {{
                        search_library: "filters by category, year, timing, score, and risk",
                        get_properties: "reads full records and guidance",
                        compare_properties: "puts candidates side by side",
                        library_overview: "aggregates by category, year, or stage",
                        find_similar: "finds neighbors and remix partners",
                      }[name]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-md border border-border p-5 text-xs leading-5 text-muted-foreground">
            Grounded answers only. The Prophet sees the scored library and nothing else, and says so when the library cannot answer.
            Scores are a transparent heuristic, not a validated prediction.
          </div>
        </aside>
      </div>
    </main>
  );
}

function AssistantTurn({ turn, lookup }: { turn: Extract<Turn, { role: "assistant" }>; lookup: Lookup }) {
  return (
    <div className="scan-card overflow-hidden">
      {(turn.steps.length > 0 || turn.status === "working") && (
        <div className="border-b border-border bg-muted/30 px-5 py-4">
          <p className="eyebrow mb-3">Research trail</p>
          <ol className="space-y-2">
            {turn.steps.map((step, index) => {
              const meta = toolMeta[step.tool] ?? { icon: Search, label: step.tool };
              const Icon = meta.icon;
              return (
                <li key={index} className={cn("flex items-start gap-3 text-sm", step.isError ? "text-destructive" : "text-muted-foreground")}>
                  <span className="mt-0.5 font-mono text-[11px] text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span>
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0">{step.summary}</span>
                </li>
              );
            })}
            {turn.status === "working" && (
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {turn.steps.length ? "Reading results..." : "Planning the search..."}
              </li>
            )}
          </ol>
        </div>
      )}

      {turn.status === "done" && (
        <div className="px-5 py-5">
          <Answer text={turn.content} lookup={lookup} />
          {turn.cited.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              <span className="eyebrow mr-1 self-center">Sources</span>
              {turn.cited.map((id) => <Citation key={id} id={id} lookup={lookup} />)}
            </div>
          )}
        </div>
      )}

      {turn.status === "error" && (
        <div className="flex items-start gap-3 px-5 py-5 text-sm leading-6 text-muted-foreground">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-foreground">{turn.error}</p>
            <p className="mt-1">
              The <Link href="/property-library/" className="text-primary hover:underline">library</Link> and deterministic scores work without the agent.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Citation({ id, lookup }: { id: string; lookup: Lookup }) {
  const property = lookup.get(id);
  if (!property) return <span className="chip">{id}</span>;
  const band = scoreBand(property.revivalReadinessScore);
  return (
    <Link href={`/analysis-tools/?propertyId=${id}`} className="chip transition hover:border-primary/50 hover:text-foreground">
      {property.name}
      <span className={cn("font-semibold", band.text)}>{property.revivalReadinessScore}</span>
    </Link>
  );
}

/** Inline renderer: **bold** and [[property-id]] citations. */
function inline(text: string, lookup: Lookup): ReactNode[] {
  return text.split(/(\*\*.+?\*\*|\[\[[a-z0-9-]+\]\])/g).map((part, index) => {
    const cite = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
    if (cite) {
      const property = lookup.get(cite[1]);
      return property ? (
        <Link key={index} href={`/analysis-tools/?propertyId=${cite[1]}`} className="mx-0.5 align-baseline font-mono text-[11px] text-primary hover:underline">
          [{property.revivalReadinessScore}]
        </Link>
      ) : null;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-semibold text-foreground">{inline(part.slice(2, -2), lookup)}</strong>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

/** Minimal markdown: headings, bullet and numbered lists, paragraphs. */
function Answer({ text, lookup }: { text: string; lookup: Lookup }) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-[15px] leading-7 text-muted-foreground">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        if (lines.every((line) => /^\s*([-*]|\d+\.)\s+/.test(line))) {
          const ordered = /^\s*\d+\./.test(lines[0]);
          const List = ordered ? "ol" : "ul";
          return (
            <List key={index} className={cn("space-y-2 pl-5", ordered ? "list-decimal" : "list-disc marker:text-primary")}>
              {lines.map((line, i) => <li key={i}>{inline(line.replace(/^\s*([-*]|\d+\.)\s+/, ""), lookup)}</li>)}
            </List>
          );
        }
        const heading = block.match(/^#{1,4}\s+(.*)$/);
        if (heading && lines.length === 1) return <h3 key={index} className="font-display text-lg text-foreground">{inline(heading[1], lookup)}</h3>;
        return <p key={index}>{lines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{inline(line, lookup)}</Fragment>)}</p>;
      })}
    </div>
  );
}

export default function ProphetChat() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-10 md:px-6 text-muted-foreground">Loading the Prophet...</main>}>
      <ProphetContent />
    </Suspense>
  );
}
