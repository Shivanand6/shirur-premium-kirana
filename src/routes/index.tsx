import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, Truck, Heart, Award, Sparkles, ArrowRight,
  MessageCircle, MapPin, Star, Users, Package, Timer,
} from "lucide-react";
import heroStore from "@/assets/hero-store.jpg";
import essentials from "@/assets/essentials.jpg";
import { WHATSAPP_URL, ESTABLISHED_YEAR } from "@/lib/store-info";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shirur Kirani Stores — Trusted Grocery Store in Navanagar, Hubballi" },
      { name: "description", content: "Family-run kirana in Navanagar, Hubballi since 1996. Rice, dal, oil, atta, masala & daily essentials with WhatsApp home delivery." },
      { property: "og:title", content: "Shirur Kirani Stores — Since 1996" },
      { property: "og:description", content: "Quality groceries, genuine prices, home delivery in Hubballi." },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Home,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add("is-visible");
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Counter({ to, suffix = "", duration = 1500 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString("en-IN")}{suffix}</span>;
}

function Home() {
  const yearsServing = new Date().getFullYear() - ESTABLISHED_YEAR;
  const r1 = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>();
  const r3 = useReveal<HTMLDivElement>();

  return (
    <div>
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:py-24 lg:px-8">
          <div className="flex flex-col justify-center animate-fade-up">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Trusted family kirana since {ESTABLISHED_YEAR}</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Everyday essentials, <span className="gold-text">delivered with care.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              Rice, dal, oil, atta, masala and daily household goods — chosen with the
              same care we'd bring to our own kitchen. Order on WhatsApp, we'll bring it home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-accent"
              >
                Browse Products
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t pt-8">
              {[
                { label: "Years serving", value: <><Counter to={yearsServing} />+</> },
                { label: "Happy families", value: <><Counter to={12000} suffix="+" /></> },
                { label: "Products", value: <><Counter to={2500} suffix="+" /></> },
              ].map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-2xl font-bold gold-text sm:text-3xl">{s.value}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-gold/15 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border shadow-[var(--shadow-lift)]">
              <img
                src={heroStore}
                alt="Interior of a warm, well-stocked Indian kirana store with jars of spices, sacks of rice and daily essentials"
                width={1600}
                height={1100}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border bg-card p-4 shadow-lg animate-float sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-emerald-foreground">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Home Delivery</div>
                  <div className="text-xs text-muted-foreground">Same-day in Navanagar</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 hidden rounded-2xl border bg-card p-4 shadow-lg sm:block" style={{ animation: "float-slow 7s ease-in-out infinite" }}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold text-gold-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Award Winner</div>
                  <div className="text-xs text-muted-foreground">Gold Winner Oil</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div ref={r1} className="reveal max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Choose Us</div>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Quality you can taste. Trust you can feel.</h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Three decades of neighborhood service, refined for the way you shop today.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Genuine Products", desc: "Only sourced from trusted brands & mills. No compromises." },
            { icon: Heart, title: "Fair Pricing", desc: "Honest MRP, generous wholesale rates for regular families." },
            { icon: Truck, title: "Home Delivery", desc: "Free delivery across Navanagar. Same-day for most orders." },
            { icon: Timer, title: "Fast Service", desc: "WhatsApp your list. We pack, confirm, and dispatch quickly." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="card-lift group relative overflow-hidden rounded-2xl border bg-card p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-y bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div ref={r2} className="reveal relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border shadow-[var(--shadow-lift)]">
              <img src={essentials} alt="Overhead flat lay of Indian grocery essentials — rice, dal, spices" loading="lazy" width={1200} height={900} className="h-full w-full object-cover" />
            </div>
          </div>
          <div ref={r3} className="reveal order-1 flex flex-col justify-center lg:order-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Store Highlights</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Everything for your daily kitchen.</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              From humble grains to premium ghee, we stock what real families in Hubballi cook, clean, and care with — every single day.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Rice & Grains", "Pulses & Dals", "Oils & Ghee", "Atta & Flours", "Masala & Spices", "Daily Essentials", "Household", "Personal Care"].map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary">
                    <Star className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <Link to="/products" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
              Explore all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, kpi: <><Counter to={12000} suffix="+" /></>, label: "Loyal customers" },
            { icon: Package, kpi: <><Counter to={2500} suffix="+" /></>, label: "Products in store" },
            { icon: Award, kpi: <><Counter to={1} />+</>, label: "Industry awards" },
          ].map((s) => (
            <div key={s.label} className="glass-card card-lift rounded-2xl p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mt-4 font-display text-4xl font-bold gold-text">{s.kpi}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/90 to-gold/80 p-8 text-primary-foreground sm:p-14">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_80%,white,transparent_35%)]" />
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to place an order?</h2>
              <p className="mt-2 max-w-xl opacity-90">
                Send your grocery list on WhatsApp. We'll confirm availability, pack it, and deliver
                right to your doorstep.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-md transition hover:-translate-y-0.5">
                <MessageCircle className="h-4 w-4" /> WhatsApp Order
              </a>
              <Link to="/location" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold transition hover:bg-primary-foreground/10">
                <MapPin className="h-4 w-4" /> Visit Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
