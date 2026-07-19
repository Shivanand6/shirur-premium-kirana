import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Sparkles, MessageCircle } from "lucide-react";
import { askAssistant } from "@/lib/assistant.functions";
import { WHATSAPP_URL } from "@/lib/store-info";

type Message = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Ask Anything | Shirur Kirani Stores" },
      { name: "description", content: "Chat with our AI assistant about products, home delivery, business hours, payment methods and more at Shirur Kirani Stores." },
      { property: "og:title", content: "AI Assistant — Shirur Kirani Stores" },
      { property: "og:description", content: "Ask questions about our store, products and delivery." },
      { property: "og:url", content: "/ai-assistant" },
    ],
    links: [{ rel: "canonical", href: "/ai-assistant" }],
  }),
  component: Assistant,
});

const SUGGESTIONS = [
  "What are your business hours?",
  "Do you offer home delivery?",
  "What payment methods do you accept?",
  "How do I place an order?",
  "Where is the store located?",
];

function Assistant() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I'm the Shirur Kirani Stores assistant. Ask me about our products, delivery, payment methods, business hours, or how to place an order.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const next: Message[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // Only send last 12 turns to keep payload sensible
      const trimmed = next.slice(-12);
      const res = await ask({ data: { messages: trimmed } });
      if (res.error || !res.reply) {
        setMessages((m) => [...m, { role: "assistant", content: res.error ?? "Sorry, I couldn't answer that. Please try WhatsApp." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.reply! }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try WhatsApp." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Assistant
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Ask me anything.</h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          I can help with store info, delivery, payments and ordering. For live product pricing,
          please confirm on WhatsApp.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="max-h-[520px] min-h-[380px] space-y-4 overflow-y-auto p-5 sm:p-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              }`}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="border-t bg-muted/30 px-5 py-3 sm:px-6">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs transition hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t bg-background/50 p-3 sm:p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, delivery, hours…"
            className="h-11 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card/60 p-4 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          For product prices and live availability, please confirm with the store on WhatsApp.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ backgroundColor: "var(--color-whatsapp)" }}
        >
          <MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
