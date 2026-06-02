"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Celeste, Spark, I } from "@/components/icons";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="auth-grid">
      {/* brand panel */}
      <div style={{ background: "linear-gradient(165deg, var(--green) 0%, var(--green-deep) 100%)", color: "#fff", position: "relative", overflow: "hidden", padding: "56px 56px" }} className="auth-brand">
        <div style={{ position: "absolute", right: -90, top: -90, width: 320, height: 320, borderRadius: "50%", background: "var(--yellow)", opacity: .12 }} />
        <div style={{ position: "absolute", left: -60, bottom: -60, width: 200, height: 200, borderRadius: "50%", background: "var(--yellow)", opacity: .08 }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
          <button onClick={() => router.push("/")}><Celeste size={26} color="#fff" /></button>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 420 }}>
            <span className="t-eyebrow" style={{ color: "var(--yellow)", display: "inline-flex", gap: 6, alignItems: "center" }}>
              <Spark size={14} /> AI-native marketplace
            </span>
            <h1 className="t-display" style={{ color: "#fff", marginTop: 14, fontSize: 44 }}>Shopping, intelligently calm.</h1>
            <p className="t-body-lg" style={{ color: "var(--green-tint)", marginTop: 16 }}>
              Describe what you need and let Celeste find it across thousands of verified shops. Your saved sets, orders and AI picks — all in one place.
            </p>
            <div className="col gap-12" style={{ marginTop: 28 }}>
              {["Personalized AI recommendations", "One cart across every vendor", "Buyer protection on all orders"].map(t => (
                <div key={t} className="row gap-12">
                  <span style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(255,255,255,.16)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                    <I.check size={15} style={{ color: "var(--yellow)" }} />
                  </span>
                  <span style={{ color: "#fff" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="t-detail" style={{ color: "rgba(255,255,255,.6)" }}>Trusted by 120k+ shoppers and 8k+ sellers</div>
        </div>
      </div>

      {/* form panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "var(--surface)" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <button onClick={() => router.push("/")} className="show-mobile" style={{ marginBottom: 24 }}>
            <Celeste size={22} />
          </button>

          {/* toggle */}
          <div style={{ display: "flex", gap: 2, background: "var(--surface-2)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {([["login", "Sign in"], ["register", "Create account"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setMode(k)} style={{ flex: 1, height: 40, borderRadius: 9, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: mode === k ? "var(--green)" : "var(--text-secondary)", background: mode === k ? "var(--surface)" : "transparent", boxShadow: mode === k ? "var(--shadow-card)" : "none" }}>
                {l}
              </button>
            ))}
          </div>

          <h2 className="t-h3" style={{ marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="t-detail" style={{ marginBottom: 22 }}>
            {mode === "login" ? "Sign in to pick up where you left off." : "Join free and start shopping smarter in minutes."}
          </p>

          <div className="col gap-10">
            <button className="btn btn-secondary btn-block" style={{ height: 48, color: "var(--text-primary)", borderColor: "var(--border)" }}
              onClick={() => { setLoading(true); setTimeout(() => router.push("/dashboard"), 700); }}>
              <I.google size={18} /> Continue with Google
            </button>
          </div>
          <div className="row gap-12" style={{ margin: "20px 0" }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span className="t-detail" style={{ fontSize: 12 }}>or with email</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          <form className="col gap-14" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="field-label">Full name</label>
                <input className="input" placeholder="Alex Morgan" />
              </div>
            )}
            <div>
              <label className="field-label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" />
            </div>
            <div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <label className="field-label">Password</label>
                {mode === "login" && <a className="t-detail" style={{ color: "var(--green)", fontSize: 12.5, cursor: "pointer" }}>Forgot?</a>}
              </div>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            {mode === "register" && (
              <label className="row gap-8" style={{ fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "var(--green)", width: 15, height: 15, marginTop: 2, flex: "0 0 auto" }} /> I agree to Celeste&apos;s Terms and Privacy Policy
              </label>
            )}
            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading
                ? <span className="row gap-8" style={{ justifyContent: "center" }}><span className="skeleton" style={{ width: 16, height: 16, borderRadius: 99, background: "rgba(255,255,255,.4)" }} /> Signing in…</span>
                : mode === "login" ? "Sign in →" : "Create account →"
              }
            </button>
          </form>

          {mode === "login" && (
            <div style={{ background: "var(--green-tint)", borderRadius: 12, padding: "12px 14px", marginTop: 20, display: "flex", gap: 9, alignItems: "flex-start" }}>
              <Spark size={16} style={{ color: "var(--green)", flex: "0 0 auto", marginTop: 1 }} />
              <span style={{ fontSize: 12.5, color: "var(--green-deep)", lineHeight: 1.5 }}>
                <b style={{ fontFamily: "var(--font-ui)" }}>Demo:</b> use any email & password to explore the dashboard, or{" "}
                <a onClick={() => router.push("/dashboard")} style={{ color: "var(--green)", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}>
                  skip to dashboard →
                </a>
              </span>
            </div>
          )}

          <p className="t-detail" style={{ textAlign: "center", marginTop: 22, fontSize: 12.5 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <a onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
