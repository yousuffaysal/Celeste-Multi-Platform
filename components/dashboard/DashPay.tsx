"use client";
import React from "react";
import { I } from "@/components/icons";

const VisaMark = ({ color = "#fff" }: { color?: string }) => (
  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: 22, letterSpacing: ".5px", color }}>VISA</span>
);

const MasterMark = () => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    <span style={{ width: 22, height: 22, borderRadius: 99, background: "#EB001B" }} />
    <span style={{ width: 22, height: 22, borderRadius: 99, background: "#F79E1B", marginLeft: -9, mixBlendMode: "multiply" }} />
  </span>
);

const BrandLogo = ({ name, bg, fg = "#fff" }: { name: string; bg: string; fg?: string }) => (
  <span style={{ width: 36, height: 36, borderRadius: 10, background: bg, color: fg, display: "grid", placeItems: "center",
    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, flex: "0 0 auto" }}>{name.slice(0, 2).toUpperCase()}</span>
);

interface PayCardProps {
  brand?: "visa" | "mastercard"; variant?: "green" | "dark" | "yellow";
  label?: string; name?: string; number?: string; exp?: string; style?: React.CSSProperties;
}
export const PayCard = ({ brand = "visa", variant = "green", label = "Debit card", name = "Alex Morgan", number = "7890", exp = "03/30", style }: PayCardProps) => {
  const themes = {
    green:  { bg: "linear-gradient(135deg, #01614E 0%, #014A3B 60%, #003B2F 100%)", fg: "#fff", chip: "var(--yellow)", sub: "rgba(255,255,255,.7)" },
    dark:   { bg: "linear-gradient(135deg, #1b2622 0%, #11201B 100%)", fg: "#fff", chip: "var(--yellow)", sub: "rgba(255,255,255,.6)" },
    yellow: { bg: "linear-gradient(135deg, #FBE249 0%, #F2D21F 100%)", fg: "var(--green-deep)", chip: "var(--green)", sub: "rgba(0,59,47,.6)" },
  };
  const t = themes[variant] || themes.green;
  return (
    <div style={{ position: "relative", borderRadius: 18, padding: "20px 22px", background: t.bg, color: t.fg, overflow: "hidden",
      boxShadow: "0 14px 34px rgba(1,97,78,.28)", aspectRatio: "1.586/1", display: "flex", flexDirection: "column", justifyContent: "space-between", ...style }}>
      <div style={{ position: "absolute", right: -50, top: -50, width: 170, height: 170, borderRadius: 99, border: "26px solid rgba(255,255,255,.07)" }} />
      <div style={{ position: "absolute", right: 30, bottom: -70, width: 150, height: 150, borderRadius: 99, background: "rgba(255,255,255,.05)" }} />
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 500, color: t.sub }}>{label}</span>
        {brand === "visa" ? <VisaMark color={t.fg} /> : <MasterMark />}
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ display: "block", width: 40, height: 30, borderRadius: 6, background: t.chip, marginBottom: 16, opacity: 0.95,
          backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.12) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.12) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 17, letterSpacing: "2px", fontWeight: 500 }}>•••• •••• •••• {number}</div>
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
