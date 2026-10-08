import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center px-4 py-12 md:px-6">
      <section className="scan-card grid w-full gap-8 p-6 md:grid-cols-[0.95fr_1.05fr] md:p-8">
        <div>
          <p className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Private Beta</p>
          <h1 className="mt-5 display text-4xl leading-[1.05] md:text-5xl">Workspace access is curated.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            NostalDamus is open to explore without an account: the library, the analysis pages, and the Prophet research agent.
            Login arrives with saved workspaces.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:team@cafecito-ai.com?subject=NostalDamus%20Beta%20Access">
                <Mail className="h-4 w-4" />
                Request Access
              </a>
            </Button>
            <Button asChild variant="outline" className="border-border bg-muted/40">
              <Link href="/property-library">
                Explore Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-5">
          <LockKeyhole className="h-6 w-6 text-secondary" />
          <h2 className="mt-4 text-xl font-semibold">Production auth plan</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Phase 1: open library, research agent, and the $199 human-reviewed brief.</p>
            <p>Phase 2: add gated workspaces, saved watchlists, report exports, and seat-based access.</p>
            <p>Phase 3: connect enterprise SSO and per-client IP portfolio permissions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
