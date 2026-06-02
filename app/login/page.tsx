"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Celeste, Spark, I } from "@/components/icons";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [agreed, setAgreed]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    if (mode === "register") {
      if (!name.trim()) { setError("Full name is required"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      if (!agreed) { setError("Please accept the Terms & Privacy Policy"); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email, password }
        : { email, password, name, role: "customer" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong");
        return;
      }

      // Redirect based on role
      const user = json.data;
      if (user?.role === "admin" || user?.role === "vendor") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="auth-grid">

      {/* Brand panel */}
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

      {/* Form panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "var(--surface)" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <button onClick={() => router.push("/")} className="show-mobile" style={{ marginBottom: 24 }}>
            <Celeste size={22} />
          </button>

          {/* Toggle */}
          <div style={{ display: "flex", gap: 2, background: "var(--surface-2)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {([["login", "Sign in"], ["register", "Create account"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => { setMode(k); setError(""); }}
                style={{ flex: 1, height: 40, borderRadius: 9, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
                  color: mode === k ? "var(--green)" : "var(--text-secondary)",
                  background: mode === k ? "var(--surface)" : "transparent",
                  boxShadow: mode === k ? "var(--shadow-card)" : "none" }}>
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

          <form className="col gap-14" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="field-label">Full name</label>
                <input className="input" placeholder="Alex Morgan" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="field-label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <label className="field-label">Password</label>
                {mode === "login" && <a className="t-detail" style={{ color: "var(--green)", fontSize: 12.5, cursor: "pointer" }}>Forgot?</a>}
              </div>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPass(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </div>
            {mode === "register" && (
              <label className="row gap-8" style={{ fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: "var(--green)", width: 15, height: 15, marginTop: 2, flex: "0 0 auto" }} />
                I agree to Celeste&apos;s Terms and Privacy Policy
              </label>
            )}

            {/* Error message */}
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                <I.close size={15} style={{ color: "var(--error)", flex: "0 0 auto" }} />
                <span style={{ fontSize: 13.5, color: "var(--error)", fontFamily: "var(--font-ui)" }}>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading
                ? <span className="row gap-8" style={{ justifyContent: "center" }}>
                    <span className="skeleton" style={{ width: 16, height: 16, borderRadius: 99, background: "rgba(255,255,255,.4)" }} /> Signing in…
                  </span>
                : mode === "login" ? "Sign in →" : "Create account →"
              }
            </button>
          </form>

          <p className="t-detail" style={{ textAlign: "center", marginTop: 22, fontSize: 12.5 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <a onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              style={{ color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
