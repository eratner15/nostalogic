"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type State =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "success"; id: string }
  | { phase: "error"; message: string };

export default function OrderReport() {
  const [state, setState] = useState<State>({ phase: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ phase: "submitting" });
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      propertyName: String(form.get("propertyName") || ""),
      objective: String(form.get("objective") || ""),
      website: String(form.get("website") || ""),
    };

    try {
      const response = await fetch("/api/brief-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setState({ phase: "error", message: data.error || "We could not submit the request." });
        return;
      }
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      setState({ phase: "success", id: data.id });
    } catch {
      setState({ phase: "error", message: "Network error. Email team@cafecito-ai.com to order." });
    }
  }

  if (state.phase === "success") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-78px)] max-w-3xl items-center px-4 py-14 md:px-6">
        <section className="scan-card w-full p-7 text-center md:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <Badge className="mt-5 border-accent/40 bg-accent/10 text-accent hover:bg-accent/10">Request received</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.025em]">We have your property.</h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
            We will confirm scope and send the secure $199 payment link to your email. Delivery is within two business days after payment.
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">Reference {state.id.slice(0, 8)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild><Link href="/property-library">Explore the model</Link></Button>
            <Button asChild variant="outline" className="border-white/15 bg-white/5">
              <a href="mailto:team@cafecito-ai.com?subject=NostalDamus%20brief%20request">Email the team</a>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to overview
      </Link>
      <div className="mt-7 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <section>
          <Badge className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">$199 · One-time</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Order a Revival Opportunity Brief.</h1>
          <p className="mt-5 leading-7 text-muted-foreground">
            Give us one property and the decision you need to make. We score it, review the result, and return a concise opportunity memo within two business days.
          </p>
          <div className="mt-7 space-y-4">
            {[
              "Transparent Revival Readiness Score",
              "Audience, timing, and current-signal assessment",
              "Rights and execution-risk flags",
              "Preserve / modernize recommendations",
              "A focused next-step recommendation",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /> {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-md border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-muted-foreground">
            <LockKeyhole className="mb-3 h-5 w-5 text-secondary" />
            We confirm the property is in scope before charging. The brief is decision support, not a valuation, legal opinion, rights clearance, or guarantee of performance.
          </div>
        </section>

        <section className="scan-card p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Tell us what to analyze</h2>
              <p className="text-sm text-muted-foreground">We will reply with confirmation and payment.</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block text-muted-foreground">Name *</span>
                <input required name="name" autoComplete="name" maxLength={100} className="h-11 w-full rounded-md border border-white/10 bg-background/70 px-3 outline-none focus:border-primary" />
              </label>
              <label className="text-sm">
                <span className="mb-2 block text-muted-foreground">Work email *</span>
                <input required type="email" name="email" autoComplete="email" maxLength={180} className="h-11 w-full rounded-md border border-white/10 bg-background/70 px-3 outline-none focus:border-primary" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Company</span>
              <input name="company" autoComplete="organization" maxLength={140} className="h-11 w-full rounded-md border border-white/10 bg-background/70 px-3 outline-none focus:border-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Property or franchise *</span>
              <input required name="propertyName" maxLength={180} placeholder="Example: a film, series, game, toy, or music property" className="h-11 w-full rounded-md border border-white/10 bg-background/70 px-3 outline-none placeholder:text-muted-foreground/60 focus:border-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-muted-foreground">What decision are you trying to make? *</span>
              <textarea required name="objective" minLength={10} maxLength={1200} rows={6} placeholder="Tell us what you are considering, what you already know, and what would make this brief useful." className="w-full rounded-md border border-white/10 bg-background/70 p-3 outline-none placeholder:text-muted-foreground/60 focus:border-primary" />
            </label>
            <label className="hidden" aria-hidden="true">
              Website<input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            {state.phase === "error" && (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-red-200">{state.message}</p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={state.phase === "submitting"}>
              {state.phase === "submitting" ? "Submitting..." : "Request the $199 Brief"}
            </Button>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              No charge is made on this form. We confirm scope first and send a secure payment link.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
