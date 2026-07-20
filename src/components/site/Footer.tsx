import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock, ShoppingBasket } from "lucide-react";
import { WHATSAPP_URL, PHONE_TEL, PHONE_DISPLAY, ADDRESS_LINES } from "@/lib/store-info";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
              <ShoppingBasket className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Shirur Kirani Stores</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Since 1996</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground text-pretty">
            A trusted family kirana and general store in Navanagar, Hubballi. Quality groceries,
            genuine prices, home delivery.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/about", "About Us"],
              ["/products", "Products"],
              ["/how-to-order", "How to Order"],
              ["/awards", "Awards"],
              ["/gallery", "Gallery"],
              ["/ai-assistant", "AI Assistant"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-foreground/80 hover:text-primary transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">Visit</h4>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-foreground/80">
              {ADDRESS_LINES.map((line) => <div key={line}>{line}</div>)}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-foreground/80">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>Mon – Sun · 7 AM – 2 PM & 5 PM – 10 PM</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">Contact</h4>
          <a href={PHONE_TEL} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition">
            <Phone className="h-4 w-4 text-primary" />
            {PHONE_DISPLAY}
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition">
            <MessageCircle className="h-4 w-4 text-primary" />
            WhatsApp Order
          </a>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Shirur Kirani Stores. All rights reserved.</p>
          <p>Hubballi, Karnataka · Family owned since 1996</p>
        </div>
      </div>
    </footer>
  );
}
