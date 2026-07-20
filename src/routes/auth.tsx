import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/lib/store-info";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Shirur Kirani Stores" },
      { name: "description", content: "Administrator sign in for Shirur Kirani Stores." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email?.toLowerCase() === ADMIN_EMAIL) {
        navigate({ to: "/admin", replace: true });
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const normalized = email.trim().toLowerCase();
      // Gate at the door: only the single authorized admin email may proceed.
      if (normalized !== ADMIN_EMAIL) {
        toast.error("Invalid User Authentication");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (error) {
        // If the admin has never signed in, silently create the account then sign in.
        if (error.message.toLowerCase().includes("invalid login")) {
          const { error: signUpErr } = await supabase.auth.signUp({
            email: normalized,
            password,
            options: { emailRedirectTo: window.location.origin + "/admin" },
          });
          if (signUpErr) throw signUpErr;
          const { error: retryErr } = await supabase.auth.signInWithPassword({
            email: normalized,
            password,
          });
          if (retryErr) throw retryErr;
        } else {
          throw error;
        }
      }
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid User Authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald text-primary-foreground shadow-[var(--shadow-glow)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold">Admin Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">Authorized personnel only.</p>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-3xl border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)]">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </label>
        <label className="mt-4 grid gap-1.5 text-sm">
          <span className="font-medium">Password</span>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Please wait…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">← Back to store</Link>
      </p>
    </div>
  );
}
