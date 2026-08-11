"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Beaker, LibraryBig, Radar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/property-library", label: "Library", icon: LibraryBig },
  { href: "/analysis-tools", label: "Analysis", icon: BarChart3 },
  { href: "/remix-lab", label: "Remix Lab", icon: Beaker },
  { href: "/market-intelligence", label: "Market", icon: Radar },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/86 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/50 bg-primary/15 text-primary shadow-[0_0_24px_rgba(236,72,153,0.28)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-white">NostalDamus</span>
              <span className="block text-[11px] text-muted-foreground">Predictive Nostalgia Engine</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white",
                    active && "bg-white/10 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-muted-foreground",
                  active && "border-primary/40 bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
