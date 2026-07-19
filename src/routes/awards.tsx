import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Trophy, Medal, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AwardRow = {
  id: string; title: string; description: string | null; year: number | null; image_url: string | null;
};

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — Shirur Kirani Stores, Hubballi" },
      { name: "description", content: "Awards received by Shirur Kirani Stores, Navanagar, Hubballi — including the Gold Winner Oil Highest Seller Award." },
      { property: "og:title", content: "Awards — Shirur Kirani Stores" },
      { property: "og:description", content: "Recognized quality and service at Shirur Kirani Stores." },
      { property: "og:url", content: "/awards" },
    ],
    links: [{ rel: "canonical", href: "/awards" }],
  }),
  component: Awards,
});

function Awards() {
  const { data: awards = [], isLoading } = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("awards").select("*").order("sort_order");
      if (error) throw error;
      return data as AwardRow[];
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Recognition</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Awards & Honors</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Recognition earned through decades of dedication, quality, and neighborhood trust.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl border bg-muted/40" />
          ))}
        </div>
      ) : awards.length === 0 ? (
        <div className="mt-14 rounded-2xl border bg-card p-10 text-center">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Awards will appear here.</p>
        </div>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((a, i) => (
            <div key={a.id} className="card-lift group relative overflow-hidden rounded-3xl border bg-card p-8 text-center">
              <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top,var(--color-gold),transparent_60%)]" />
              <div className="relative">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-gold to-primary text-gold-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  {i === 0 ? <Trophy className="h-9 w-9" /> : <Medal className="h-9 w-9" />}
                </div>
                {a.year && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" /> {a.year}
                  </div>
                )}
                <h3 className="mt-3 font-display text-xl font-bold gold-text">{a.title}</h3>
                {a.description && <p className="mt-2 text-sm text-muted-foreground text-pretty">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 rounded-3xl border bg-card/60 p-8 text-center sm:p-12">
        <Award className="mx-auto h-8 w-8 text-primary" />
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
          More awards are on the way — as we continue to earn the trust of families across Hubballi.
        </p>
      </div>
    </div>
  );
}
