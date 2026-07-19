import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already signed in, send them to admin
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-[var(--shadow-glow)]">
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
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Need an admin account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">← Back to store</Link>
      </p>
    </div>
  );
}
