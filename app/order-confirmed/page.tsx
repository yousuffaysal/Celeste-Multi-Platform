"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";

/* ── tiny confetti burst (CSS only, no lib) ── */
const CONFETTI_COLORS = ["#FBE249", "#01614E", "#52b788", "#fff", "#a7f3d0", "#fde68a"];

function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.round(-50 + (i / 36) * 100),
    delay: Math.round((i % 9) * 80),
    size: 6 + (i % 3) * 4,
    rot: Math.round(i * 47),
  }));

  if (!active) return null;
  return (
    <div style={{ position: "absolute", top: "30%", left: "50%", pointerEvents: "none", zIndex: 10 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          width: p.size, height: p.size * (p.id % 2 === 0 ? 0.5 : 1),
          borderRadius: p.id % 3 === 0 ? "50%" : 2,
          background: p.color,
          transform: `translateX(${p.x}px)`,
          animation: `confettiFall .9s cubic-bezier(.25,.46,.45,.94) ${p.delay}ms both`,
          transformOrigin: "center",
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          from { opacity:1; transform:translateX(var(--cx,0)) translateY(0) rotate(0deg) scale(1); }
          to   { opacity:0; transform:translateX(calc(var(--cx,0) * 3)) translateY(160px) rotate(360deg) scale(.5); }
        }
      `}</style>
    </div>
  );
}

/* ── timeline step ── */
function TimelineStep({ icon, label, sub, done, active, last }: {
  icon: React.ReactNode; label: string; sub: string;
  done?: boolean; active?: boolean; last?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: done ? "var(--green)" : active ? "var(--green-tint)" : "var(--surface-2)",
          border: `2px solid ${done ? "var(--green)" : active ? "var(--green)" : "var(--border)"}`,
          display: "grid", placeItems: "center",
          boxShadow: active ? "0 0 0 5px rgba(1,97,78,.1)" : "none",
          transition: "all .3s",
        }}>
          <span style={{ color: done ? "#fff" : active ? "var(--green)" : "var(--text-muted)" }}>{icon}</span>
        </div>
        {!last && (
          <div style={{ width: 2, flex: 1, minHeight: 28, background: done ? "var(--green)" : "var(--border)", borderRadius: 1, margin: "4px 0" }} />
        )}
      </div>
      <div style={{ paddingTop: 8, paddingBottom: last ? 0 : 20 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5, color: done || active ? "var(--text-primary)" : "var(--text-muted)", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── order item row ── */
function OrderItem({ name, shop, price, color }: { name: string; shop: string; price: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{shop}</div>
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5, color: "var(--green)" }}>{price}</div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const orderNum = "CLT-284-019";

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 60);
    const t2 = setTimeout(() => setConfetti(true), 400);
    const t3 = setTimeout(() => setConfetti(false), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const steps = [
    { icon: <I.check size={18} />,  label: "Order confirmed",    sub: "We've received your order and payment.", done: true },
    { icon: <I.box size={18} />,    label: "Packing",            sub: "Your items are being prepared by the sellers.", active: true },
    { icon: <I.truck size={18} />,  label: "On the way",         sub: "Estimated delivery: Fri 6 Jun – Mon 9 Jun." },
    { icon: <I.gift size={18} />,   label: "Delivered",          sub: "We'll notify you when it arrives.", last: true },
  ];

  const items = [
    { name: "Solis Pendant Light",     shop: "Lumen Studio",    price: "$148", color: "hsla(45,70%,60%,.3)" },
    { name: "Washi Paper Notebook Set",shop: "Mori Ceramics",   price: "$32",  color: "hsla(140,40%,55%,.25)" },
    { name: "Merino Throw, Oatmeal",   shop: "Bloom Atelier",   price: "$94",  color: "hsla(30,30%,70%,.35)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-2)", paddingBottom: 80 }}>

      {/* Top success bar */}
      <div style={{
        background: "var(--green)", padding: "0",
        height: mounted ? 6 : 0,
        transition: "height .6s cubic-bezier(.4,0,.2,1)",
      }} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{
          textAlign: "center", padding: "56px 0 40px",
          position: "relative",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .65s .1s, transform .65s .1s",
        }}>
          <Confetti active={confetti} />

          {/* Check circle */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--green)", display: "grid", placeItems: "center",
            margin: "0 auto 20px",
            boxShadow: "0 0 0 10px rgba(1,97,78,.1), 0 8px 32px rgba(1,97,78,.25)",
            transform: mounted ? "scale(1)" : "scale(.6)",
            transition: "transform .55s .3s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <I.check size={32} style={{ color: "#fff" }} />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "var(--green-tint)", border: "1px solid rgba(1,97,78,.15)",
            borderRadius: 99, padding: "4px 14px 4px 10px", marginBottom: 16,
          }}>
            <Spark size={13} style={{ color: "var(--green)" }} />
            <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--green)", letterSpacing: ".07em", textTransform: "uppercase" }}>Order placed</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 10 }}>
            You&apos;re all set!
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 400, margin: "0 auto" }}>
            Your order <strong style={{ fontFamily: "var(--font-ui)", color: "var(--text-primary)" }}>{orderNum}</strong> is confirmed. We&apos;ll send updates to your email as it moves.
          </p>
        </div>

        {/* Main grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity .6s .4s, transform .6s .4s",
        }}
          className="order-confirmed-grid"
        >

          {/* Left — timeline + delivery */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Tracking timeline card */}
            <div className="card" style={{ padding: "28px 28px" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <I.truck size={17} style={{ color: "var(--green)" }} /> Delivery timeline
              </div>
              <div>
                {steps.map((s, i) => (
                  <TimelineStep key={i} {...s} />
                ))}
              </div>
            </div>

            {/* Delivery details */}
            <div className="card" style={{ padding: "22px 28px" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <I.pin size={16} style={{ color: "var(--green)" }} /> Delivery address
              </div>
              <div style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Alex Morgan<br />
                42 Whitfield Street, Apt 3B<br />
                London, W1T 2RH<br />
                United Kingdom
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px", borderRadius: 99, background: "var(--green)", color: "#fff", border: "none", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(1,97,78,.22)", transition: "transform .14s, box-shadow .14s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 10px 28px rgba(1,97,78,.3)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "0 6px 20px rgba(1,97,78,.22)"; }}
              >
                <I.truck size={16} /> Track my order
              </button>
              <button
                onClick={() => router.push("/")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 22px", borderRadius: 99, background: "transparent", color: "var(--green)", border: "1.5px solid var(--green)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--green-tint)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                Continue shopping →
              </button>
            </div>
          </div>

          {/* Right — order summary */}
          <div className="card" style={{ padding: "22px 24px", position: "sticky", top: 24 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Order summary</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 18, fontFamily: "var(--font-ui)" }}>{orderNum}</div>

            {items.map((it, i) => (
              <OrderItem key={i} {...it} />
            ))}

            {/* Totals */}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { k: "Subtotal",      v: "$274.00" },
                { k: "Shipping",      v: "Free",  green: true },
                { k: "Est. tax",      v: "$19.18" },
                { k: "Buyer protection", v: "Included", green: true },
              ].map(r => (
                <div key={r.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>{r.k}</span>
                  <span style={{ fontSize: 14, fontFamily: "var(--font-ui)", fontWeight: 500, color: (r as { green?: boolean }).green ? "var(--success)" : "var(--text-primary)" }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Total paid</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--green)", letterSpacing: "-0.5px" }}>$293.18</span>
            </div>

            {/* Payment method */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--surface-2)", borderRadius: 12 }}>
              <I.card size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--text-primary)" }}>Visa ending in 4242</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Charged successfully</div>
              </div>
              <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "var(--success)", display: "grid", placeItems: "center" }}>
                <I.check size={12} style={{ color: "#fff" }} />
              </div>
            </div>

            {/* Protection badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 14, padding: "10px 13px", background: "var(--green-tint)", borderRadius: 10, border: "1px solid rgba(1,97,78,.1)" }}>
              <I.shieldcheck size={16} style={{ color: "var(--green)", flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "var(--green)", fontFamily: "var(--font-ui)", fontWeight: 500 }}>Buyer protection active for 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media(max-width:760px) {
          .order-confirmed-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}
