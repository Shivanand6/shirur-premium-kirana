import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBasket, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/how-to-order", label: "How to Order" },
  { to: "/awards", label: "Awards" },
  { to: "/gallery", label: "Gallery" },
  { to: "/location", label: "Location" },
  { to: "/contact", label: "Contact" },
  { to: "/ai-assistant", label: "AI Assistant" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-card border-b" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:rotate-12">
            <ShoppingBasket className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-lg font-bold tracking-tight">Shirur Kirani</div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Stores · Since 1996</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-primary bg-accent/60" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-xl border bg-card transition hover:bg-accent"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl border bg-card xl:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden glass-card border-t animate-fade-in">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:grid-cols-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                activeProps={{ className: "text-primary bg-accent/60" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
