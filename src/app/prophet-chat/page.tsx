"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string };

const starters = [
  "What should get revived first from 1995?",
  "Which toy property has the strongest window right now?",
  "Compare the readiness of the movie properties.",
  "What pairs well with Tamagotchi for a remix?",
];

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

export default function ProphetChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setError(null);
    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, sessionKey: getSessionKey() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `request failed (${res.status})`);
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch {
      setError("network error, try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <section className="mb-8">
        <Badge className="border-accent/40 bg-accent/10 text-accent hover:bg-accent/10">Prophet Chat</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Ask the Prophet about the 1993-1998 library.</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Answers come only from the scored property library. Every claim cites the property, its year, and its Revival Readiness Score.
        </p>
      </section>

      {messages.length === 0 && (
        <section className="mb-6 grid gap-3 md:grid-cols-2">
          {starters.map((starter) => (
            <button
              key={starter}
              onClick={() => send(starter)}
              className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-left text-sm leading-6 text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10"
            >
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-primary">
                <MessageCircle className="h-3.5 w-3.5" /> Ask
              </span>
              {starter}
            </button>
          ))}
        </section>
      )}

      <section className="scan-card flex min-h-[320px] flex-col p-5">
        <div className="flex-1 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[85%] rounded-md border border-primary/25 bg-primary/10 p-3 text-sm leading-6"
                  : "max-w-[85%] rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted-foreground"
              }
            >
              <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
          ))}
          {busy && <div className="max-w-[85%] rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-muted-foreground">The Prophet is consulting the library...</div>}
          {error && <div className="rounded-md border border-accent/25 bg-accent/[0.06] p-3 text-sm text-muted-foreground">{error}</div>}
          <div ref={endRef} />
        </div>
        <form
          className="mt-5 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about revival readiness, windows, pairings..."
            className="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-card px-3 text-sm"
            maxLength={1000}
          />
          <Button type="submit" disabled={busy || !input.trim()} className="h-11 px-4">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Grounded answers only: the Prophet cannot see outside the library and will say so when it cannot answer.
      </p>
    </main>
  );
}
