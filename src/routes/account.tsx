import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, useIsAdmin } from "@/lib/use-auth";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — NEEVA BAGS" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin(user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!user) return <AuthForm />;

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <GoldDivider label="Member" />
            <h1 className="text-display text-4xl mt-6">Welcome</h1>
            <p className="text-muted-foreground mt-3 font-light">{user.email}</p>
          </div>
          <div className="space-y-3">
            {isAdmin && (
              <button
                onClick={() => navigate({ to: "/admin" })}
                className="btn-gold w-full"
              >
                Open Admin Dashboard
              </button>
            )}
            <Link to="/wishlist" className="btn-outline-noir block text-center">Your Wishlist</Link>
            <Link to="/cart" className="btn-outline-noir block text-center">Your Cart</Link>
            <button onClick={handleSignOut} className="btn-noir w-full">Sign Out</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      toast.success("Signed in");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-10">
            <GoldDivider label="Member Access" />
            <h1 className="text-display text-4xl mt-6">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
          </div>

          <div className="flex border border-border mb-8">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 tracking-luxe transition-all ${
                  mode === m ? "bg-noir text-ivory" : "bg-transparent text-noir hover:bg-muted"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full border border-border py-3 tracking-luxe mb-6 hover:border-champagne transition-all flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.2C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.2C41 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs tracking-luxe text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none"
              />
            )}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none"
            />
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none"
            />

            <button type="submit" disabled={loading} className="btn-noir w-full mt-4 disabled:opacity-50">
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-8 font-light">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="text-center mt-6">
            <Link to="/" className="tracking-luxe text-muted-foreground hover:text-champagne-deep">← Back home</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
