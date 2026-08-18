import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, MessageCircle, Wheat, Bean, Droplet, Cookie, Coffee, Candy,
  Sparkles, SprayCan, Nut, Salad, Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PHONE_RAW } from "@/lib/store-info";

type Category = {
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
};

const CATEGORIES: Category[] = [
  { name: "Rice", description: "Sona Masoori, Basmati, Kolam and daily-use rice varieties.", icon: Wheat, gradient: "from-amber-100 to-amber-200" },
  { name: "Dal", description: "Toor, moong, urad, chana and mixed dals — cleaned & sorted.", icon: Bean, gradient: "from-yellow-100 to-orange-200" },
  { name: "Oil", description: "Sunflower, groundnut, coconut and cold-pressed cooking oils.", icon: Droplet, gradient: "from-yellow-100 to-amber-200" },
  { name: "Atta", description: "Fresh chakki atta, multigrain, ragi and wheat flours.", icon: Wheat, gradient: "from-orange-100 to-amber-200" },
  { name: "Sugar", description: "White sugar, brown sugar, jaggery and sweeteners.", icon: Candy, gradient: "from-pink-100 to-rose-200" },
  { name: "Salt", description: "Iodized salt, rock salt, sea salt and kala namak.", icon: Sparkles, gradient: "from-blue-100 to-slate-200" },
  { name: "Tea", description: "Premium tea blends and household tea powders.", icon: Coffee, gradient: "from-amber-100 to-orange-200" },
  { name: "Coffee", description: "Filter coffee, instant coffee and South Indian blends.", icon: Coffee, gradient: "from-orange-100 to-amber-300" },
  { name: "Spices", description: "Whole spices — cumin, coriander, cardamom, cloves.", icon: Salad, gradient: "from-red-100 to-orange-200" },
  { name: "Masala", description: "Ready masalas, garam masala, sambar and rasam powders.", icon: Salad, gradient: "from-red-100 to-rose-200" },
  { name: "Snacks", description: "Namkeen, chips, mixture and evening munchies.", icon: Cookie, gradient: "from-yellow-100 to-amber-200" },
  { name: "Biscuits", description: "Cream, cracker and family-pack biscuits.", icon: Cookie, gradient: "from-amber-100 to-yellow-200" },
  { name: "Home Care", description: "Everyday household essentials for a clean home.", icon: SprayCan, gradient: "from-blue-100 to-cyan-200" },
  { name: "Cleaning Products", description: "Detergents, floor cleaners, dish wash and more.", icon: SprayCan, gradient: "from-cyan-100 to-blue-200" },
  { name: "Dry Fruits", description: "Almonds, cashews, raisins, dates and premium mixes.", icon: Nut, gradient: "from-amber-100 to-orange-300" },
  { name: "Pulses", description: "Chickpeas, rajma, kabuli, green gram and beans.", icon: Bean, gradient: "from-emerald-100 to-green-200" },
];

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Rice, Dal, Oil, Atta, Masala | Shirur Kirani Stores" },
      { name: "description", content: "Browse our full range of groceries: rice, dal, oil, atta, masala, dairy, personal care and household products at Shirur Kirani Stores, Navanagar, Hubballi." },
      { property: "og:title", content: "Products — Shirur Kirani Stores" },
      { property: "og:description", content: "Rice, dal, oil, atta, masala and daily essentials with home delivery." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

function Products() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return CATEGORIES;
    return CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Shelves</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Shop by Category</h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          Explore our wide range of grocery categories. Availability and pricing are confirmed live
          on WhatsApp before your order is dispatched.
        </p>
      </div>

      <div className="mt-10">
        <div className="relative max-w-lg">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rice, dal, oil, spices…"
            className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none ring-primary/40 transition focus:ring-2"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border bg-card p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No categories match your search.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <CategoryCard key={c.name} category={c} />
          ))}
        </div>
      )}

      <div className="mt-16 rounded-3xl border bg-gradient-to-br from-primary/5 via-emerald/5 to-gold/10 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Don't see what you're looking for?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          We stock thousands of items — just message us on WhatsApp with your list and we'll confirm availability.
        </p>
        <a
          href={`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent("Hi Shirur Kirani Stores, I'm looking for:")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  const orderUrl = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
    `Hi Shirur Kirani Stores, I'd like to confirm availability and order from the ${category.name} category. Please share what's available today.`,
  )}`;

  return (
    <div className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${category.gradient}`}>
        <div className="absolute inset-0 grid place-items-center transition-transform duration-500 group-hover:scale-110">
          <Icon className="h-20 w-20 text-primary/70" strokeWidth={1.4} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/60 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
        <a
          href={orderUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-95"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Confirm Availability & Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
