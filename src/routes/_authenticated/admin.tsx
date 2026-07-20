import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, Package, Award, Image as ImageIcon, LogOut,
  Plus, Trash2, ShieldAlert, ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/lib/store-info";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Shirur Kirani Stores" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Product = { id: string; name: string; category: string; price: number | null; mrp: number | null; unit: string | null; in_stock: boolean; featured: boolean };
type AwardRow = { id: string; title: string; description: string | null; year: number | null };
type GalleryItem = { id: string; title: string | null; image_url: string; media_type: string };

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"overview" | "products" | "awards" | "gallery">("overview");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const email = (u.user.email ?? "").toLowerCase();
      setUserEmail(email);
      // Single-admin gate: only the authorized email may enter, no matter what user_roles says.
      setIsAdmin(email === ADMIN_EMAIL);
    })();
  }, []);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return <div className="mx-auto max-w-4xl p-16 text-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold">Invalid User Authentication</h1>
        <p className="mt-2 text-muted-foreground">
          The account <span className="font-medium">{userEmail}</span> is not authorized to access the admin dashboard.
        </p>
        <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-accent">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Admin · {userEmail}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Dashboard</h1>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm hover:bg-accent">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b pb-2">
        {[
          { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
          { id: "products" as const, label: "Products", icon: Package },
          { id: "awards" as const, label: "Awards", icon: Award },
          { id: "gallery" as const, label: "Gallery", icon: ImageIcon },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
              tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <Overview />}
        {tab === "products" && <ProductsPanel />}
        {tab === "awards" && <AwardsPanel />}
        {tab === "gallery" && <GalleryPanel />}
      </div>
    </div>
  );
}

function Overview() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [p, a, g] = await Promise.all([
        supabase.from("products").select("*", { head: true, count: "exact" }),
        supabase.from("awards").select("*", { head: true, count: "exact" }),
        supabase.from("gallery_items").select("*", { head: true, count: "exact" }),
      ]);
      return { products: p.count ?? 0, awards: a.count ?? 0, gallery: g.count ?? 0 };
    },
  });
  const items = [
    { label: "Products", count: counts?.products ?? 0, icon: Package },
    { label: "Awards", count: counts?.awards ?? 0, icon: Award },
    { label: "Gallery Items", count: counts?.gallery ?? 0, icon: ImageIcon },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border bg-card p-6">
          <i.icon className="h-6 w-6 text-primary" />
          <div className="mt-2 font-display text-3xl font-bold">{i.count}</div>
          <div className="text-sm text-muted-foreground">{i.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProductsPanel() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data as Product[];
    },
  });

  const [form, setForm] = useState({ name: "", category: "", price: "", mrp: "", unit: "" });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast.error("Name and category are required");
      return;
    }
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    const { error } = await supabase.from("products").insert({
      name: form.name,
      slug,
      category: form.category,
      price: form.price ? parseFloat(form.price) : null,
      mrp: form.mrp ? parseFloat(form.mrp) : null,
      unit: form.unit || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Product added");
    setForm({ name: "", category: "", price: "", mrp: "", unit: "" });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-6">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" />
        <input placeholder="Price ₹" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" />
        <input placeholder="MRP ₹" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" />
        <input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" />
        <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground sm:col-span-6"><Plus className="h-4 w-4" /> Add product</button>
      </form>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">MRP</th><th className="p-3">Unit</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3">{p.price != null ? `₹${p.price}` : "—"}</td>
                <td className="p-3">{p.mrp != null ? `₹${p.mrp}` : "—"}</td>
                <td className="p-3">{p.unit ?? "—"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AwardsPanel() {
  const qc = useQueryClient();
  const { data: awards = [] } = useQuery({
    queryKey: ["admin-awards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("awards").select("*").order("sort_order");
      if (error) throw error;
      return data as AwardRow[];
    },
  });
  const [form, setForm] = useState({ title: "", description: "", year: "" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title required");
    const { error } = await supabase.from("awards").insert({
      title: form.title,
      description: form.description || null,
      year: form.year ? parseInt(form.year) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Award added");
    setForm({ title: "", description: "", year: "" });
    qc.invalidateQueries({ queryKey: ["admin-awards"] });
    qc.invalidateQueries({ queryKey: ["awards"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-awards"] });
    qc.invalidateQueries({ queryKey: ["awards"] });
  };
  return (
    <div className="space-y-6">
      <form onSubmit={add} className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-6">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2" />
        <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" />
        <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((a) => (
          <div key={a.id} className="rounded-2xl border bg-card p-5">
            <div className="text-xs text-muted-foreground">{a.year ?? ""}</div>
            <div className="mt-1 font-display text-lg font-bold">{a.title}</div>
            {a.description && <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>}
            <button onClick={() => remove(a.id)} className="mt-3 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryPanel() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
  const [form, setForm] = useState({ title: "", image_url: "", media_type: "photo" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return toast.error("Image URL required");
    const { error } = await supabase.from("gallery_items").insert({
      title: form.title || null,
      image_url: form.image_url,
      media_type: form.media_type,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setForm({ title: "", image_url: "", media_type: "photo" });
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  };
  return (
    <div className="space-y-6">
      <form onSubmit={add} className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-6">
        <input placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2" />
        <input placeholder="Image URL (https://…)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2" />
        <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
        <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-2xl border bg-card">
            <img src={g.image_url} alt={g.title ?? ""} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="truncate text-sm font-medium">{g.title ?? "Untitled"}</div>
              <button onClick={() => remove(g.id)} className="mt-2 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
