import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center px-4 py-12 md:px-6">
      <section className="scan-card grid w-full gap-8 p-6 md:grid-cols-[0.95fr_1.05fr] md:p-8">
        <div>
          <Badge className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/10">Private Beta</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-normal md:text-5xl">Workspace access is curated.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            NostalDamus is currently a static strategy demo for studios, investors, and creators. Account login is
            disabled until the Cloudflare deployment is connected to a production auth provider.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:team@cafecito-ai.com?subject=NostalDamus%20Beta%20Access">
                <Mail className="h-4 w-4" />
                Request Access
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/15 bg-white/5">
              <Link href="/property-library">
                Explore Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <LockKeyhole className="h-6 w-6 text-secondary" />
          <h2 className="mt-4 text-xl font-semibold">Production auth plan</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Phase 1: keep the public demo static and fast on Cloudflare Pages.</p>
            <p>Phase 2: add gated workspaces, saved watchlists, report exports, and seat-based access.</p>
            <p>Phase 3: connect enterprise SSO and per-client IP portfolio permissions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
