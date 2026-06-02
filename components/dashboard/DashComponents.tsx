"use client";
import React from "react";
import { Spark } from "@/components/icons";
import { I } from "@/components/icons";

export const TONE: Record<string, { bg: string; fg: string }> = {
  success: { bg: "var(--green-tint)", fg: "var(--green)" },
  info:    { bg: "#E7EEF6",           fg: "#2A5C8A" },
  warning: { bg: "var(--yellow-tint)",fg: "#9A7B00" },
  error:   { bg: "#FBE9E7",           fg: "#C0392B" },
  neutral: { bg: "var(--surface-2)",  fg: "var(--text-secondary)" },
};

export const Pill = ({ tone = "neutral", children, dot }: { tone?: string; children: React.ReactNode; dot?: boolean }) => {
  const t = TONE[tone] || TONE.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 10px",
      borderRadius: 999, background: t.bg, color: t.fg, fontFamily: "var(--font-ui)", fontWeight: 600,
      fontSize: 11.5, letterSpacing: ".2px", whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: t.fg }} />}{children}
    </span>
  );
};

interface SparklineProps { data: number[]; w?: number; h?: number; color?: string; }
export const Sparkline = ({ data, w = 76, h = 30, color = "var(--green)" }: SparklineProps) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i): [number, number] => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * h]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = d + ` L${w} ${h} L0 ${h} Z`;
  const id = "sg" + Math.round(data[0] * 100);
  return (
    <svg width={w} height={h} style={{ flex: "0 0 auto", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.18} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface KpiProps {
  label: string; value: string | number; delta?: string; up?: boolean;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  spark?: number[]; accent?: boolean;
}
export const Kpi = ({ label, value, delta, up = true, icon: Ic, spark: data, accent }: KpiProps) => (
  <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
    <div className="row" style={{ justifyContent: "space-between" }}>
      <span className="t-detail" style={{ fontSize: 12.5 }}>{label}</span>
      {Ic && <span style={{ width: 32, height: 32, borderRadius: 9, background: accent ? "var(--yellow-tint)" : "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
        <Ic size={17} style={{ color: accent ? "#9A7B00" : "var(--green)" }} />
      </span>}
    </div>
    <div className="row" style={{ alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.5px", lineHeight: 1 }}>{value}</span>
      {data && <Sparkline data={data} />}
    </div>
    {delta != null && (
      <div className="row gap-4" style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: up ? "var(--success)" : "var(--error)" }}>
        {up ? <I.trendup size={14} /> : <I.trenddn size={14} />}{delta}<span className="dim" style={{ fontWeight: 400 }}>vs last week</span>
      </div>
    )}
  </div>
);

interface BarChartProps { data: { k: string; v: number }[]; h?: number; highlightLast?: boolean; }
export const BarChart = ({ data, h = 150, highlightLast }: BarChartProps) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div>
      <div className="row" style={{ alignItems: "flex-end", gap: 10, height: h }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
            <div style={{ width: "100%", maxWidth: 38, height: (d.v / max * 100) + "%", borderRadius: "6px 6px 0 0",
              background: (highlightLast && i === data.length - 1) ? "var(--green)" : "var(--green-tint)",
              transition: "height .4s" }} title={String(d.v)} />
          </div>
        ))}
      </div>
      <div className="row" style={{ gap: 10, marginTop: 8 }}>
        {data.map((d, i) => <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>{d.k}</span>)}
      </div>
    </div>
  );
};

interface DonutSegment { k: string; v: number; color: string; }
export const Donut = ({ segments, size = 132 }: { segments: DonutSegment[]; size?: number }) => {
  const total = segments.reduce((s, x) => s + x.v, 0);
  let acc = 0; const r = size / 2 - 12; const c = 2 * Math.PI * r;
  return (
    <div className="row gap-24" style={{ flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flex: "0 0 auto" }}>
        {segments.map((s, i) => {
          const frac = s.v / total; const dash = frac * c;
          const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-acc * c} />;
          acc += frac; return el;
        })}
        <circle cx={size/2} cy={size/2} r={r - 14} fill="var(--surface)" />
      </svg>
      <div className="col gap-8" style={{ flex: 1, minWidth: 140 }}>
        {segments.map((s, i) => (
          <div key={i} className="row" style={{ justifyContent: "space-between", gap: 12 }}>
            <span className="row gap-8" style={{ fontSize: 13, fontFamily: "var(--font-ui)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />{s.k}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)" }}>{Math.round(s.v / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PanelProps {
  title?: string; action?: React.ReactNode; children: React.ReactNode;
  ai?: boolean; pad?: number; style?: React.CSSProperties;
}
export const Panel = ({ title, action, children, ai, pad = 20, style }: PanelProps) => (
  <div className="card" style={{ display: "flex", flexDirection: "column", ...style }}>
    {title && (
      <div className="row" style={{ justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 8 }}>
        <div className="row gap-8">
          <b style={{ fontFamily: "var(--font-ui)", fontSize: 15 }}>{title}</b>
          {ai && <span className="ai-chip"><Spark size={12} />AI</span>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding: pad }}>{children}</div>
  </div>
);

interface TableCol { label: string; right?: boolean; }
export const Table = ({ cols, children }: { cols: TableCol[]; children: React.ReactNode }) => (
  <div style={{ overflowX: "auto" }} className="no-scrollbar">
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
      <thead><tr>{cols.map((c, i) => (
        <th key={i} style={{ textAlign: c.right ? "right" : "left", padding: "10px 14px", fontFamily: "var(--font-ui)",
          fontWeight: 600, fontSize: 11.5, letterSpacing: ".4px", textTransform: "uppercase", color: "var(--text-muted)",
          borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{c.label}</th>
      ))}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Td = ({ children, right, style }: { children?: React.ReactNode; right?: boolean; style?: React.CSSProperties }) => (
  <td style={{ padding: "13px 14px", fontSize: 13.5, fontFamily: "var(--font-ui)", color: "var(--text-primary)",
    borderBottom: "1px solid var(--border)", textAlign: right ? "right" : "left", whiteSpace: "nowrap", ...style }}>{children}</td>
);

export const Avatar = ({ name, size = 32, color }: { name: string; size?: number; color?: string }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  const colors = ["#01614E", "#06A36B", "#7B6EF0", "#D9622F", "#2A7D63", "#5B52C9"];
  const c = color || colors[name.charCodeAt(0) % colors.length];
  return (
    <span style={{ width: size, height: size, borderRadius: 99, background: c, color: "#fff", display: "grid",
      placeItems: "center", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: size * .38, flex: "0 0 auto" }}>
      {initials}
    </span>
  );
};

export const AICallout = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div style={{ background: "var(--green-tint)", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 11, alignItems: "flex-start", marginTop: 14 }}>
    <Spark size={18} style={{ color: "var(--green)", flex: "0 0 auto", marginTop: 1 }} className="spark-anim" />
    <div style={{ flex: 1, fontSize: 13.5, color: "var(--green-deep)", lineHeight: 1.5 }}>{children}</div>
    {action}
  </div>
);

export const DashHead = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.6px" }}>{title}</h1>
      {subtitle && <p className="t-detail" style={{ marginTop: 4 }}>{subtitle}</p>}
    </div>
    {actions && <div className="row gap-8" style={{ flexWrap: "wrap" }}>{actions}</div>}
  </div>
);

export const StatGrid = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div className="stat-grid" style={style}>{children}</div>
);

export const DashGrid = ({ children, cols = "2fr 1fr", style }: { children: React.ReactNode; cols?: string; style?: React.CSSProperties }) => (
  <div className="dash-2col" style={{ gridTemplateColumns: cols, ...style }}>{children}</div>
);
