import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Package, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_URL } from "@/lib/store-info";

type Product = {
  id: string; name: string; slug: string; description: string | null;
  category: string; price: number | null; mrp: number | null;
  unit: string | null; image_url: string | null; in_stock: boolean; featured: boolean;
};

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
  const [cat, setCat] = useState<string>("All");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(s)];
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchQ = !term ||
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      return matchCat && matchQ;
    });
  }, [products, q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Shelves</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Products</h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          A curated selection of everyday essentials. Prices are indicative — final pricing is
          confirmed on WhatsApp before dispatch.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rice, dal, oil, atta…"
            className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none ring-primary/40 transition focus:ring-2"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border bg-muted/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border bg-card p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No products match your search.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const discount =
    p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

  const orderUrl = `https://wa.me/919611094379?text=${encodeURIComponent(
    `Hi Shirur Kirani Stores, I'd like to order: ${p.name}${p.unit ? ` (${p.unit})` : ""}.`,
  )}`;

  return (
    <div className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-gold/10 to-emerald/10">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Package className="h-12 w-12 text-primary/40" strokeWidth={1.5} />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald px-2.5 py-1 text-[10px] font-bold text-emerald-foreground shadow">
            {discount}% OFF
          </span>
        )}
        {p.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-gold-foreground shadow">
            FEATURED
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          <Tag className="h-3 w-3" />
          {p.category}
        </div>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug">{p.name}</h3>
        {p.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>}
        <div className="mt-3 flex items-baseline gap-2">
          {p.price != null && <span className="font-display text-lg font-bold text-primary">₹{p.price}</span>}
          {p.mrp && p.price && p.mrp > p.price && (
            <span className="text-xs text-muted-foreground line-through">₹{p.mrp}</span>
          )}
          {p.unit && <span className="ml-auto text-xs text-muted-foreground">/ {p.unit}</span>}
        </div>
        <a
          href={orderUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
