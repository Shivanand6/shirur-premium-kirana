import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, ExternalLink, Clock, Phone } from "lucide-react";
import { ADDRESS_LINES, MAP_EMBED, MAP_LINK, NAV_LINK, PHONE_DISPLAY, PHONE_TEL } from "@/lib/store-info";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Location — Karnataka Circle, Navanagar, Hubballi | Shirur Kirani Stores" },
      { name: "description", content: "Visit Shirur Kirani Stores at Karnataka Circle, Navanagar, Hubballi. Open daily 7 AM – 2 PM and 5 PM – 10 PM. Get directions on Google Maps." },
      { property: "og:title", content: "Location — Shirur Kirani Stores" },
      { property: "og:description", content: "Karnataka Circle, Navanagar, Hubballi." },
      { property: "og:url", content: "/location" },
    ],
    links: [{ rel: "canonical", href: "/location" }],
  }),
  component: Location,
});

function Location() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Find Us</div>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Visit our store</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          We're right at Karnataka Circle in Navanagar, Hubballi. Come by, we'd love to see you.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-lift relative overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-lift)]">
          <div className="aspect-[4/3] w-full">
            <iframe
              title="Shirur Kirani Stores on Google Maps"
              src={MAP_EMBED}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Address</div>
                <div className="mt-1 font-medium">
                  {ADDRESS_LINES.map((l) => <div key={l}>{l}</div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald text-emerald-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Business Hours</div>
                <div className="mt-1 font-medium">Monday – Sunday</div>
                <div className="text-sm text-muted-foreground">7:00 AM – 2:00 PM</div>
                <div className="text-sm text-muted-foreground">5:00 PM – 10:00 PM</div>
              </div>
            </div>
          </div>

          <a href={PHONE_TEL} className="glass-card card-lift flex items-center gap-3 rounded-2xl p-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Call us</div>
              <div className="mt-1 font-medium">{PHONE_DISPLAY}</div>
            </div>
          </a>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={NAV_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
            >
              <Navigation className="h-4 w-4" /> Navigate
            </a>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" /> Open in Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
