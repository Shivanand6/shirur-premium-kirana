import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shirur Kirani Stores — Trusted Grocery Store in Navanagar, Hubballi (Since 1996)" },
      {
        name: "description",
        content:
          "Shirur Kirani Stores at Karnataka Circle, Navanagar, Hubballi. Family-run grocery & general store since 1996. Rice, dal, oil, atta, masala & daily essentials with home delivery via WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "Shirur Kirani Stores, Kirana Store Hubli, Grocery Store Navanagar, Best Grocery Store Hubli, General Store Karnataka Circle, Home Delivery Grocery Hubli, Kirana Shop Navanagar, Wholesale Grocery Hubli, Daily Essentials Hubli, Rice, Dal, Oil, Atta, Masala, Family Grocery Store, Kirana Since 1996",
      },
      { name: "author", content: "Shirur Kirani Stores" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Shirur Kirani Stores" },
      { property: "og:title", content: "Shirur Kirani Stores — Trusted Grocery Store in Navanagar, Hubballi" },
      { property: "og:description", content: "Quality groceries, genuine prices, home delivery. Family-run since 1996." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shirur Kirani Stores — Hubballi" },
      { name: "twitter:description", content: "Trusted family kirana in Navanagar, Hubballi since 1996." },
      { name: "theme-color", content: "#f2b56a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "GroceryStore",
          name: "Shirur Kirani Stores",
          description:
            "Trusted family-run grocery and general store in Navanagar, Hubballi. Rice, dal, oil, atta, masala, and daily essentials with home delivery.",
          image: "https://cdn.gpteng.co/blank-app-v1.svg",
          telephone: "+91-96110-94379",
          priceRange: "₹",
          foundingDate: "1996",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Karnataka Circle, Navanagar",
            addressLocality: "Hubballi",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            opens: "08:00",
            closes: "22:00",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <FloatingButtons />
          <Toaster position="top-center" richColors />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
