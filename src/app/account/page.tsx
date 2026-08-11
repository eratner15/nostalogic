import Link from "next/link";
import { Bell, FileText, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const planned = [
  {
    icon: ListChecks,
    title: "Watchlists",
    text: "Track specific properties and receive readiness changes when social or rights signals move.",
  },
  {
    icon: FileText,
    title: "Board Reports",
    text: "Generate exportable IP memos with model inputs, launch windows, and modernization guidance.",
  },
  {
    icon: Bell,
    title: "Signal Alerts",
    text: "Notify strategy teams when a dormant property crosses a readiness or risk threshold.",
  },
];

export default function Account() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="mb-8">
        <Badge className="border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/10">Workspace Roadmap</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Account features are staged for phase two.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          The Cloudflare MVP is intentionally static: fast to deploy, easy to share, and safe to review. Workspace
          features come after the demo validates the scoring and pitch workflows.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {planned.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="scan-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </section>
      <Button asChild className="mt-6">
        <Link href="/remix-lab">Open Remix Lab</Link>
      </Button>
    </main>
  );
}
