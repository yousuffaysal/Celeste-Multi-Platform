"use client";
import React from "react";
import { I } from "@/components/icons";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "maestro";

/* ── Brand mark components ── */
export const VisaMark = ({ color = "#fff" }: { color?: string }) => (
  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: 22, letterSpacing: ".5px", color }}>VISA</span>
);

export const MasterMark = () => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    <span style={{ width: 22, height: 22, borderRadius: 99, backgroundColor: "#EB001B" }} />
    <span style={{ width: 22, height: 22, borderRadius: 99, backgroundColor: "#F79E1B", marginLeft: -9, mixBlendMode: "multiply" }} />
  </span>
);

export const AmexMark = ({ color = "#fff" }: { color?: string }) => (
  <span style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 15, letterSpacing: "1.5px", color }}>AMEX</span>
);

export const DiscoverMark = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
    <span style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 11, letterSpacing: ".8px", color: "#fff" }}>DISCOVER</span>
    <span style={{ width: 20, height: 20, borderRadius: 99, backgroundColor: "#F76F20" }} />
  </span>
);

export const MaestroMark = () => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    <span style={{ width: 22, height: 22, borderRadius: 99, backgroundColor: "#0099DF" }} />
    <span style={{ width: 22, height: 22, borderRadius: 99, backgroundColor: "#ED3237", marginLeft: -9, opacity: 0.9 }} />
  </span>
);

export function BrandMark({ brand, color }: { brand: CardBrand; color?: string }) {
  switch (brand) {
    case "mastercard": return <MasterMark />;
    case "amex":       return <AmexMark color={color} />;
    case "discover":   return <DiscoverMark />;
    case "maestro":    return <MaestroMark />;
    default:           return <VisaMark color={color} />;
  }
}

const BrandLogo = ({ name, bg, fg = "#fff" }: { name: string; bg: string; fg?: string }) => (
  <span style={{ width: 36, height: 36, borderRadius: 10, background: bg, color: fg, display: "grid", placeItems: "center",
    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, flex: "0 0 auto" }}>{name.slice(0, 2).toUpperCase()}</span>
);

interface PayCardProps {
  brand?: CardBrand;
  variant?: "green" | "dark" | "yellow";
  label?: string; name?: string; number?: string; exp?: string; style?: React.CSSProperties;
}
export const PayCard = ({ brand = "visa", variant = "green", label = "Debit card", name = "Alex Morgan", number = "7890", exp = "03/30", style }: PayCardProps) => {
  const themes = {
    green:  { bg: "linear-gradient(135deg, #01614E 0%, #014A3B 60%, #003B2F 100%)", fg: "#fff", chip: "#FBE249", sub: "rgba(255,255,255,.7)" },
    dark:   { bg: "linear-gradient(145deg, #1c1c1e 0%, #0a0a0a 50%, #111111 100%)", fg: "#fff", chip: "#C9A84C", sub: "rgba(255,255,255,.45)" },
    yellow: { bg: "linear-gradient(135deg, #FBE249 0%, #F2D21F 100%)", fg: "var(--green-deep)", chip: "#01614E", sub: "rgba(0,59,47,.6)" },
  };
  const t = themes[variant] || themes.green;
  return (
    <div style={{ position: "relative", borderRadius: 18, padding: "20px 22px", background: t.bg, color: t.fg, overflow: "hidden",
      boxShadow: "0 14px 34px rgba(1,97,78,.28)", aspectRatio: "1.586/1", display: "flex", flexDirection: "column", justifyContent: "space-between", ...style }}>
      <div style={{ position: "absolute", right: -50, top: -50, width: 170, height: 170, borderRadius: 99, border: `26px solid ${variant === "dark" ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.07)"}` }} />
      <div style={{ position: "absolute", right: 30, bottom: -70, width: 150, height: 150, borderRadius: 99, backgroundColor: variant === "dark" ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.05)" }} />
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 500, color: t.sub }}>{label}</span>
        <BrandMark brand={brand} color={t.fg} />
      </div>
      <div style={{ position: "relative" }}>
        {/* Fix: use backgroundColor + backgroundImage separately (no shorthand conflict) */}
        <span style={{
          display: "block", width: 40, height: 30, borderRadius: 6,
          backgroundColor: t.chip,
          backgroundImage: "linear-gradient(90deg,rgba(0,0,0,.12) 1px,transparent 1px),linear-gradient(rgba(0,0,0,.12) 1px,transparent 1px)",
          backgroundSize: "8px 8px",
          marginBottom: 16, opacity: 0.95,
        }} />
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 17, letterSpacing: "2px", fontWeight: 500 }}>
          {brand === "amex" ? "•••• •••••• " : "•••• •••• •••• "}{number}
        </div>
      </div>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ fontSize: 10, color: t.sub, marginBottom: 2, letterSpacing: ".5px" }}>CARD HOLDER</div>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>{name}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: t.sub, marginBottom: 2, letterSpacing: ".5px" }}>EXPIRES</div>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>{exp}</div>
        </div>
      </div>
    </div>
  );
};

type IconFn = (p?: { size?: number; style?: React.CSSProperties }) => React.ReactElement;
interface QAAction { icon: IconFn; label: string; onClick?: () => void; }
export const QuickActions = ({ actions }: { actions: QAAction[] }) => (
  <div className="qa-row">
    {actions.map((a, i) => (
      <button key={i} className="qa-btn" onClick={a.onClick}>
        <span className="qa-ic"><a.icon size={19} /></span>
        <span className="qa-lbl">{a.label}</span>
      </button>
    ))}
  </div>
);

interface TxnRow { brand: string; bg: string; fg?: string; title: string; date: string; amount: number; state: string; }
export const TxnList = ({ rows }: { rows: TxnRow[] }) => (
  <div className="col">
    {rows.map((t, i) => (
      <div key={i} className="row gap-12" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
        <BrandLogo name={t.brand} bg={t.bg} fg={t.fg} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
          <div className="t-detail" style={{ fontSize: 11.5 }}>{t.date}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: t.amount > 0 ? "var(--success)" : "var(--text-primary)" }}>
            {t.amount > 0 ? "+" : "−"}${Math.abs(t.amount).toLocaleString()}
          </div>
          <div className="t-detail" style={{ fontSize: 10.5, color: t.state === "Declined" ? "var(--error)" : "var(--text-muted)" }}>{t.state}</div>
        </div>
      </div>
    ))}
  </div>
);
