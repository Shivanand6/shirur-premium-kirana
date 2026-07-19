import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroStore from "@/assets/hero-store.jpg";
import essentials from "@/assets/essentials.jpg";

type Item = { id: string; title: string | null; image_url: string; media_type: string };

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Store Photos | Shirur Kirani Stores, Hubballi" },
      { name: "description", content: "Photos of Shirur Kirani Stores in Navanagar, Hubballi. Explore our store, shelves and products." },
      { property: "og:title", content: "Gallery — Shirur Kirani Stores" },
      { property: "og:description", content: "Take a look inside our store." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const { data: items = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data as Item[];
    },
  });

  // Fallback demo images if none uploaded yet
  const displayItems: Item[] = items.length > 0 ? items : [
    { id: "d1", title: "Inside the store", image_url: heroStore, media_type: "photo" },
    { id: "d2", title: "Daily essentials", image_url: essentials, media_type: "photo" },
    { id: "d3", title: "Inside the store", image_url: heroStore, media_type: "photo" },
    { id: "d4", title: "Fresh spices", image_url: essentials, media_type: "photo" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Gallery</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Inside our store</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          A glimpse of the shelves, the shopkeepers, and the community we serve every day.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((it, i) => (
          <figure key={it.id} className={`card-lift group relative overflow-hidden rounded-2xl border bg-card ${i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
            <div className={`${i % 5 === 0 ? "aspect-[4/3]" : "aspect-square"} overflow-hidden`}>
              <img
                src={it.image_url}
                alt={it.title ?? "Shirur Kirani Stores"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-sm font-medium text-white">
              <span>{it.title}</span>
              {it.media_type === "video" ? <Camera className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
