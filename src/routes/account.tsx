import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — NEEVA BAGS" }] }),
  component: AccountPage,
});

function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-10">
            <GoldDivider label="Member Access" />
            <h1 className="text-display text-4xl mt-6">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
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

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <input required placeholder="Full Name" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
            )}
            <input required placeholder="Email or Phone" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
            <input required type="password" placeholder="Password" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
            {mode === "register" && (
              <input required type="password" placeholder="Confirm Password" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
            )}

            {mode === "login" && (
              <div className="text-right">
                <a href="#" className="text-xs text-muted-foreground hover:text-champagne-deep underline">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-noir w-full mt-4">
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-8 font-light">
            By continuing you agree to our Terms of Service and Privacy Policy.
            <br />Backend authentication coming soon.
          </p>

          <div className="text-center mt-6">
            <Link to="/" className="tracking-luxe text-muted-foreground hover:text-champagne-deep">← Back home</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
