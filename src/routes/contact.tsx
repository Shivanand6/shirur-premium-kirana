import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, MessageCircle, MapPin, Clock, Mail, Send } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL, ADDRESS_LINES } from "@/lib/store-info";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shirur Kirani Stores, Navanagar, Hubballi" },
      { name: "description", content: "Contact Shirur Kirani Stores in Navanagar, Hubballi by phone, WhatsApp or in person. Open daily 7 AM – 2 PM and 5 PM – 10 PM." },
      { property: "og:title", content: "Contact — Shirur Kirani Stores" },
      { property: "og:description", content: "Phone, WhatsApp and store address." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.toString().trim();
    const message = fd.get("message")?.toString().trim();
    if (!name || !message) {
      toast.error("Please fill in your name and message");
      setSending(false);
      return;
    }
    // Send via WhatsApp — no backend for form yet.
    const url = `https://wa.me/919611094379?text=${encodeURIComponent(
      `Hello Shirur Kirani Stores!\n\nName: ${name}\n${fd.get("phone") ? "Phone: " + fd.get("phone") + "\n" : ""}\nMessage: ${message}`,
    )}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp to send your message");
    setSending(false);
    e.currentTarget.reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get in Touch</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Call, WhatsApp, or drop by — we're always happy to help.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Quick contacts */}
        <div className="grid gap-4">
          <a href={PHONE_TEL} className="glass-card card-lift group flex items-center gap-4 rounded-2xl p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:rotate-12">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Phone</div>
              <div className="font-semibold">{PHONE_DISPLAY}</div>
            </div>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="glass-card card-lift group flex items-center gap-4 rounded-2xl p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl text-white transition-transform group-hover:rotate-12" style={{ backgroundColor: "var(--color-whatsapp)" }}>
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
              <div className="font-semibold">Chat & Order</div>
            </div>
          </a>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Address</div>
                <div className="font-medium">{ADDRESS_LINES.map((l) => <div key={l}>{l}</div>)}</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald text-emerald-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Business Hours</div>
                <div className="font-medium">Mon – Sun</div>
                <div className="text-sm text-muted-foreground">7:00 AM – 2:00 PM · 5:00 PM – 10:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-3xl border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">We'll receive your message on WhatsApp and respond quickly.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Name</span>
              <input name="name" required className="h-11 rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/40" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Phone (optional)</span>
              <input name="phone" type="tel" className="h-11 rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/40" />
            </label>
          </div>
          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="font-medium">Message</span>
            <textarea name="message" required rows={5} className="rounded-lg border bg-background p-3 outline-none focus:ring-2 focus:ring-primary/40" />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {sending ? "Opening…" : "Send via WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
