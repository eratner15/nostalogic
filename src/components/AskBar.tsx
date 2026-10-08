"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** The "ask the archive" entry point: routes a question to the Prophet agent. */
export function AskBar({ placeholder = "Ask the archive anything: which 1996 toy is ready for a comeback?", size = "md", autoFocus = false }: { placeholder?: string; size?: "md" | "lg"; autoFocus?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const q = value.trim();
        router.push(q ? `/prophet-chat/?q=${encodeURIComponent(q)}` : "/prophet-chat/");
      }}
      className={cn("group flex items-center gap-2 rounded-md border border-input bg-background/70 pl-4 pr-1.5 transition focus-within:border-primary/70", size === "lg" ? "h-16" : "h-12")}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground group-focus-within:text-primary" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={1000}
        aria-label="Ask the Prophet a question about the library"
        className={cn("min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/70", size === "lg" ? "text-base md:text-lg" : "text-sm")}
      />
      <button
        type="submit"
        className={cn("inline-flex shrink-0 items-center gap-2 rounded bg-primary px-4 font-medium text-primary-foreground transition hover:bg-primary/90", size === "lg" ? "h-12 text-sm" : "h-9 text-xs")}
      >
        Ask <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
