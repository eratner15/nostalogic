"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/prophet-chat/", label: "Ask" },
  { href: "/property-library/", label: "Library" },
  { href: "/analysis-tools/", label: "Analysis" },
  { href: "/remix-lab/", label: "Remix Lab" },
  { href: "/market-intelligence/", label: "Market" },
  { href: "/track-record/", label: "Track record" },
];

const isActive = (pathname: string, href: string) => pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

export default function Navbar() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="NostalDamus home">
          <Mark />
          <span className="leading-none">
            <span className="block font-display text-lg font-medium tracking-[-0.01em] text-foreground">NostalDamus</span>
            <span className="eyebrow mt-1 block text-[10px] tracking-[0.2em]">Revival intelligence</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
                isActive(pathname, item.href) && "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-px after:bg-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/order-report/"
          className="hidden items-center gap-1.5 rounded border border-primary/50 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground sm:inline-flex"
        >
          $199 Brief <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden" aria-label="Primary mobile">
        {[...navItems, { href: "/order-report/", label: "$199 Brief" }].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded px-3 py-1.5 text-xs text-muted-foreground",
              isActive(pathname, item.href) && "bg-muted text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/** Logo mark: a cassette window with two reels, the right one lit. */
function Mark() {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden="true">
      <rect x="1.5" y="7.5" width="33" height="21" rx="3" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="7" y="12.5" width="22" height="9" rx="4.5" className="fill-background stroke-border" strokeWidth="1" />
      <circle cx="12" cy="17" r="2.6" className="fill-none stroke-muted-foreground" strokeWidth="1.4" />
      <circle cx="24" cy="17" r="2.6" className="fill-primary" />
      <line x1="10" y1="25.5" x2="26" y2="25.5" className="stroke-primary/60" strokeWidth="1.2" />
    </svg>
  );
}
