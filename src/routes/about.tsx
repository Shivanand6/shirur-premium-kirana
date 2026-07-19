import { createFileRoute } from "@tanstack/react-router";
import { Heart, Users, Award, Sparkles } from "lucide-react";
import ownerPlaceholder from "@/assets/owner-placeholder.png";
import { ESTABLISHED_YEAR } from "@/lib/store-info";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Shirur Kirani Stores | Family Kirana Since 1996" },
      { name: "description", content: "Family-owned since 1996. Shirur Kirani Stores has served Navanagar, Hubballi for nearly three decades with quality, genuine pricing and trust." },
      { property: "og:title", content: "About Shirur Kirani Stores" },
      { property: "og:description", content: "Three decades of trusted neighborhood service in Hubballi." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Story</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">About Shirur Kirani Stores</h1>
        <p className="mt-5 text-lg text-muted-foreground text-pretty">
          Established in {ESTABLISHED_YEAR}, Shirur Kirani Stores has served the families of
          Navanagar, Hubballi for nearly three decades. What began as a small neighborhood
          shop has grown into one of the most trusted grocery and general stores in the area —
          known for quality products, genuine pricing and customer satisfaction.
        </p>
        <p className="mt-4 text-muted-foreground text-pretty">
          We remain proudly family-owned. Every product on our shelves is chosen with the same
          care we would bring to our own kitchen. Every customer is treated the way we would
          welcome a guest into our home.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          { icon: Sparkles, kpi: `${years}+`, label: "Years serving Hubballi" },
          { icon: Users, kpi: "12,000+", label: "Families we know by name" },
          { icon: Award, kpi: "Award Winner", label: "Recognized quality" },
        ].map((s) => (
          <div key={s.label} className="glass-card card-lift rounded-2xl p-6">
            <s.icon className="h-6 w-6 text-primary" />
            <div className="mt-3 font-display text-2xl font-bold gold-text">{s.kpi}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Owners */}
      <div className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Meet the Family</div>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">The people behind the store.</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            { name: "Manjunath Shirur", role: "Founder & Proprietor" },
            { name: "Anand Shirur", role: "Co-owner" },
          ].map((o) => (
            <div key={o.name} className="card-lift group relative overflow-hidden rounded-3xl border bg-card">
              <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20">
                  <img src={ownerPlaceholder} alt={`Portrait placeholder for ${o.name}`} width={600} height={600} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{o.name}</h3>
                  <p className="text-sm text-primary">{o.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Committed to serving the Navanagar community with honesty, quality and warmth.
                  </p>
                </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary via-gold to-emerald opacity-70 transition-all group-hover:h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl border bg-card/60 p-8 text-center sm:p-12">
        <Heart className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Our promise</h3>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-pretty">
          Genuine products. Honest prices. Personal service. That's how we've earned three
          decades of trust — and that's what we'll bring you every single day.
        </p>
      </div>
    </div>
  );
}
