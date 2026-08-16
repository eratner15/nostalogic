"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Layers3, Plus, Shuffle, Sparkles, WandSparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchPropertiesFromApi,
  generateCompositePitch,
  scoreAll,
  scoredProperties,
  type PropertyScore,
  type RebootType,
} from "@/services/property-data";

const formats: RebootType[] = ["Streaming Series", "Movie", "Video Game", "Toys", "Live Event", "TV Show"];

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

const recipes = [
  ["Clueless", "Tamagotchi", "Windows 95"],
  ["Scream", "GoldenEye", "Goosebumps TV/Books"],
  ["Toy Story", "Beanie Babies", "Nintendo 64"],
  ["The Craft", "Spice Girls: Spice", "Lisa Frank School Supplies"],
  ["Chrono Trigger", "Romeo + Juliet", "Nirvana: MTV Unplugged"],
];

function RemixContent() {
  const params = useSearchParams();
  const [library, setLibrary] = useState<PropertyScore[]>(scoredProperties);

  useEffect(() => {
    let cancelled = false;
    fetchPropertiesFromApi().then((remote) => {
      if (!cancelled && remote) setLibrary(scoreAll(remote));
    });
    return () => { cancelled = true; };
  }, []);

  const findById = (id: string) => library.find((property) => property.id === id);
  const findByName = (name: string) => library.find((property) => property.name === name)?.id;

  const initialId = params.get("propertyId") || scoredProperties[0].id;
  const initialBlend = useMemo(() => {
    const anchor = library.find((p) => p.id === initialId) || library[0];
    const complements = library
      .filter((property) => property.id !== anchor.id && property.category !== anchor.category)
      .slice(0, 2);
    return [anchor.id, ...complements.map((property) => property.id)];
    // Intentionally computed once from the bundled library; hydration only widens choices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  const [selectedIds, setSelectedIds] = useState(initialBlend);
  const [propertyToAdd, setPropertyToAdd] = useState(scoredProperties[0].id);
  const [format, setFormat] = useState<RebootType>("Streaming Series");
  const [copied, setCopied] = useState(false);
  const [aiState, setAiState] = useState<
    { phase: "idle" } | { phase: "loading" } | { phase: "done"; concept: string; id: string } | { phase: "error"; message: string }
  >({ phase: "idle" });

  const selectedProperties = useMemo(
    () => selectedIds.map(findById).filter((property): property is PropertyScore => Boolean(property)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, library]
  );
  const properties = selectedProperties.length ? selectedProperties : [library[0]];
  const pitch = generateCompositePitch(properties, format);
  const isComposite = properties.length > 1;
  const availableProperties = library.filter((property) => !selectedIds.includes(property.id));

  const generateAiPitch = async () => {
    setAiState({ phase: "loading" });
    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ propertyIds: selectedIds.slice(0, 4), sessionKey: getSessionKey() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiState({ phase: "error", message: data.error ?? `request failed (${res.status})` });
        return;
      }
      setAiState({ phase: "done", concept: data.concept, id: data.id });
    } catch {
      setAiState({ phase: "error", message: "network error" });
    }
  };

  const memo = [
    pitch.title,
    pitch.subtitle,
    pitch.logline,
    `Composite Readiness: ${pitch.compositeScore}`,
    `Audience: ${pitch.audience}`,
    `World Engine: ${pitch.world.join(" ")}`,
    `Launch: ${pitch.launch.join(" ")}`,
    `Risk: ${pitch.risk}`,
  ].join("\n\n");

  const addSource = () => {
    if (selectedIds.includes(propertyToAdd) || selectedIds.length >= 5) return;
    setSelectedIds((current) => [...current, propertyToAdd]);
    const next = scoredProperties.find((property) => property.id !== propertyToAdd && !selectedIds.includes(property.id));
    if (next) setPropertyToAdd(next.id);
  };

  const removeSource = (id: string) => {
    setSelectedIds((current) => current.filter((item) => item !== id));
  };

  const applyRecipe = (names: string[]) => {
    const ids = names.map(findByName).filter((id): id is string => Boolean(id));
    if (ids.length) setSelectedIds(ids);
  };

  const copyPitch = async () => {
    try {
      await navigator.clipboard.writeText(memo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_430px] lg:items-end">
        <div>
          <Badge className="border-accent/40 bg-accent/10 text-accent hover:bg-accent/10">Composite Remix Engine</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Build a new property from multiple nostalgia signals.</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Blend two to five 1993-1998 properties into an original franchise concept. The engine synthesizes audience overlap,
            category tension, preserve/update rules, and rights risk into a development-ready pitch.
          </p>
        </div>
        <div className="scan-card grid gap-3 p-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">Add Source Property</label>
            <div className="flex gap-2">
              <select
                value={propertyToAdd}
                onChange={(event) => setPropertyToAdd(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-card px-3 text-sm"
              >
                {availableProperties.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <Button onClick={addSource} disabled={selectedIds.length >= 5 || !availableProperties.length} className="h-11 px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">Output Format</label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as RebootType)}
              className="h-11 w-full rounded-md border border-white/10 bg-card px-3 text-sm"
            >
              {formats.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {recipes.map((recipe) => (
          <button
            key={recipe.join("-")}
            onClick={() => applyRecipe(recipe)}
            className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-left text-sm leading-6 text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10"
          >
            <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-primary">
              <Shuffle className="h-3.5 w-3.5" /> Recipe
            </span>
            {recipe.join(" + ")}
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="scan-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Source stack</p>
            <h2 className="mt-2 text-2xl font-semibold">{properties.length} signal{properties.length === 1 ? "" : "s"} selected</h2>
            <div className="mt-5 grid gap-3">
              {properties.map((property) => (
                <div key={property.id} className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{property.name}</h3>
                        <Badge variant="outline" className="border-white/15 text-muted-foreground">{property.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{property.briefDescription}</p>
                    </div>
                    <Button
                      onClick={() => removeSource(property.id)}
                      disabled={selectedIds.length <= 1}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={`Remove ${property.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/15 text-muted-foreground">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="metric-tile">
              <div className="text-3xl font-semibold">{pitch.compositeScore}</div>
              <div className="text-sm text-muted-foreground">Composite Readiness</div>
            </div>
            <div className="metric-tile">
              <div className="text-3xl font-semibold">{pitch.riskScore}</div>
              <div className="text-sm text-muted-foreground">Risk</div>
            </div>
          </div>
        </div>

        <div className="scan-card overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Generated new property</p>
                <h2 className="mt-1 text-3xl font-semibold">{pitch.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{pitch.subtitle}</p>
              </div>
              <Button onClick={copyPitch} variant="outline" className="border-white/15 bg-white/5">
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-primary"><WandSparkles className="h-4 w-4" /> Logline</h3>
              <p className="leading-7 text-muted-foreground">{pitch.logline}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-secondary">Audience Thesis</h3>
              <p className="leading-7 text-muted-foreground">{pitch.audience}</p>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-accent"><Layers3 className="h-4 w-4" /> World Engine</h3>
              <div className="grid gap-3">
                {pitch.world.map((item, index) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-muted-foreground">
                    <span className="mr-2 font-mono text-white">0{index + 1}</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-primary">Franchise Mechanics</h3>
              <div className="grid gap-3">
                {pitch.mechanics.map((item, index) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-muted-foreground">
                    <span className="mr-2 font-mono text-white">0{index + 1}</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-secondary">Preserve DNA</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  {pitch.preserve.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-accent">Update Rules</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  {pitch.update.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-accent">Launch Campaign</h3>
              <div className="grid gap-3">
                {pitch.launch.map((item, index) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm leading-6 text-muted-foreground">
                    <span className="mr-2 font-mono text-white">0{index + 1}</span>{item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-primary">Development risk:</span> {pitch.risk}
            </div>
            {isComposite && (
              <div className="rounded-md border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-muted-foreground">
                Rights note: this is a new-property synthesis model, not a literal crossover recommendation. Clear rights before using names, characters, marks, music, artwork, or protected story expression.
              </div>
            )}

            <div className="rounded-md border border-accent/25 bg-accent/[0.06] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-accent">
                  <Sparkles className="h-4 w-4" /> Prophet deep pitch
                </h3>
                <Button
                  onClick={generateAiPitch}
                  disabled={aiState.phase === "loading" || selectedIds.length < 2}
                  variant="outline"
                  className="border-accent/30 bg-accent/10"
                >
                  {aiState.phase === "loading" ? "Consulting the Prophet..." : "Generate"}
                </Button>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                The deterministic pitch above always works. This one asks the AI Prophet for a written concept from your exact source stack and saves it to the library.
              </p>
              {aiState.phase === "error" && (
                <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted-foreground">{aiState.message}</p>
              )}
              {aiState.phase === "done" && (
                <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-muted-foreground">{aiState.concept}</pre>
                  <p className="mt-3 text-xs text-muted-foreground">Saved as remix {aiState.id.slice(0, 8)}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RemixLab() {
  return (
    <Suspense fallback={<main className="p-8">Loading remix lab...</main>}>
      <RemixContent />
    </Suspense>
  );
}
