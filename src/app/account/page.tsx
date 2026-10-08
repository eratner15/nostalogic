import Link from "next/link";
import { Bell, FileText, ListChecks } from "lucide-react";
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
        <p className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Workspace Roadmap</p>
        <h1 className="mt-4 display text-4xl leading-[1.05] md:text-5xl">Account features are staged for phase two.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          The library, the Prophet research agent, and the $199 brief work today without an account. Workspace features
          come after the one-time brief shows repeat demand.
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
