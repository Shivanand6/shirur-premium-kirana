import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, ClipboardList, CheckCircle2, PackageCheck, Truck, Wallet, IndianRupee } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/store-info";

export const Route = createFileRoute("/how-to-order")({
  head: () => ({
    meta: [
      { title: "How to Order — WhatsApp Home Delivery | Shirur Kirani Stores" },
      { name: "description", content: "Order groceries in 6 easy steps via WhatsApp. Home delivery across Navanagar, Hubballi with UPI, card, cash and net banking payment options." },
      { property: "og:title", content: "How to Order — Shirur Kirani Stores" },
      { property: "og:description", content: "Send your grocery list on WhatsApp. We pack, confirm and deliver." },
      { property: "og:url", content: "/how-to-order" },
    ],
    links: [{ rel: "canonical", href: "/how-to-order" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Order Groceries from Shirur Kirani Stores",
        step: [
          { "@type": "HowToStep", name: "Create your list" },
          { "@type": "HowToStep", name: "Send it on WhatsApp" },
          { "@type": "HowToStep", name: "Store confirms availability" },
          { "@type": "HowToStep", name: "Order is packed" },
          { "@type": "HowToStep", name: "Home delivery" },
          { "@type": "HowToStep", name: "Pay your way" },
        ],
      }),
    }],
  }),
  component: HowToOrder,
});

const steps = [
  { icon: ClipboardList, title: "Create your list", desc: "Write down every grocery item you need — brand, quantity, and any preferences." },
  { icon: MessageCircle, title: "Send it on WhatsApp", desc: "Message your list to +91 96110 94379. Type it or send a photo — both work." },
  { icon: CheckCircle2, title: "We confirm availability", desc: "Our team checks stock and confirms items, quantities, and estimated total." },
  { icon: PackageCheck, title: "Order is packed", desc: "We carefully pack fresh, sealed and quality-checked products for your family." },
  { icon: Truck, title: "Home Delivery", desc: "We deliver right to your doorstep. Free within Navanagar, nearby areas on request." },
  { icon: Wallet, title: "Pay your way", desc: "Choose from UPI, PhonePe, Google Pay, Paytm, cards, net banking or cash on delivery." },
];

const payments = [
  { label: "Cash", emoji: "💵" },
  { label: "Cash on Delivery", emoji: "📦" },
  { label: "UPI", emoji: "📱" },
  { label: "PhonePe", emoji: "🟣" },
  { label: "Google Pay", emoji: "🟢" },
  { label: "Paytm", emoji: "🔵" },
];

function HowToOrder() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ordering</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">How to Order</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Placing an order is simple — six easy steps and your groceries are on the way.
        </p>
      </div>

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="card-lift group relative overflow-hidden rounded-2xl border bg-card p-6">
            <div className="absolute right-4 top-4 font-display text-4xl font-bold text-primary/10 transition-colors group-hover:text-primary/25">
              0{i + 1}
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>

      {/* Big WhatsApp CTA */}
      <div className="mt-16 overflow-hidden rounded-3xl border p-1" style={{ background: "linear-gradient(135deg, var(--color-whatsapp), oklch(0.55 0.16 145))" }}>
        <div className="flex flex-col items-center justify-between gap-6 rounded-[calc(1.5rem-4px)] bg-card p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Ready when you are.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tap the button and start your order on WhatsApp.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-white shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-whatsapp)" }}
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Payments</div>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Pay your way.</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Every popular payment option, both online and offline.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {payments.map((p) => (
            <div key={p.label} className="card-lift flex items-center gap-3 rounded-xl border bg-card p-4">
              <span className="text-2xl" aria-hidden>{p.emoji}</span>
              <span className="text-sm font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-xs italic text-muted-foreground">
        *Terms & Conditions Apply.
      </p>
    </div>
  );
}
