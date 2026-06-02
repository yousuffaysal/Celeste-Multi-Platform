"use client";
import React, { useState, useRef } from "react";
import { I } from "@/components/icons";

export const RangeToggle = ({ options = ["7d","30d","90d"], value, onChange }: {
  options?: string[]; value?: string; onChange?: (v: string) => void;
}) => {
  const [v, setV] = useState(value || options[0]);
  const set = (o: string) => { setV(o); onChange && onChange(o); };
  const active = value || v;
  return (
    <div className="rng-toggle">
      {options.map(o => (
        <button key={o} className={"rng-btn" + (active === o ? " active" : "")} onClick={() => set(o)}>{o}</button>
      ))}
    </div>
  );
};

export const ChartTypeToggle = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="rng-toggle">
    {([["bars", I.chart], ["line", I.activity]] as [string, (p?: { size?: number }) => React.ReactElement][]).map(([k, Ic]) => (
      <button key={k} className={"rng-btn icon" + (value === k ? " active" : "")} onClick={() => onChange(k)} title={k}>
        <Ic size={15} />
      </button>
    ))}
  </div>
);

interface AreaChartProps {
  series: number[]; labels: string[]; h?: number; mode?: string;
  color?: string; prefix?: string; suffix?: string;
}
export const AreaChart = ({ series, labels, h = 190, mode = "area", color = "var(--green)", prefix = "", suffix = "" }: AreaChartProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const W = 560, padT = 16, padB = 26, padX = 6;
  const max = Math.max(...series) * 1.12;
  const min = Math.min(...series, 0);
  const n = series.length;
  const xAt = (i: number) => padX + (i / (n - 1)) * (W - padX * 2);
  const yAt = (v: number) => padT + (1 - (v - min) / (max - min || 1)) * (h - padT - padB);
  const pts = series.map((v, i): [number, number] => [xAt(i), yAt(v)]);
  const line = pts.map((p, i) => {
    if (!i) return `M${p[0]},${p[1]}`;
    const prev = pts[i - 1], cx = (prev[0] + p[0]) / 2;
    return `C${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
  }).join(" ");
  const area = line + ` L${pts[n-1][0]},${h-padB} L${pts[0][0]},${h-padB} Z`;

  const onMove = (e: React.MouseEvent) => {
    if (!wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    let best = 0, bd = 1e9;
    pts.forEach((p, i) => { const d = Math.abs(p[0] - x); if (d < bd) { bd = d; best = i; } });
    setHover(best);
  };

  return (
    <div ref={wrap} style={{ position: "relative", width: "100%" }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${h}`} width="100%" height={h} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={0.22} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0,.25,.5,.75,1].map((g, i) => (
          <line key={i} x1={padX} x2={W-padX} y1={padT+g*(h-padT-padB)} y2={padT+g*(h-padT-padB)} stroke="var(--border)" strokeWidth="1" />
        ))}
        {mode === "area" && <path d={area} fill="url(#areaFill)" />}
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hover != null && (
          <g>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padT} y2={h-padB} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="5.5" fill="#fff" stroke={color} strokeWidth="2.5" />
          </g>
        )}
        {labels.map((l, i) => (
          <text key={i} x={xAt(i)} y={h-8} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="var(--font-ui)">{l}</text>
        ))}
      </svg>
      {hover != null && (
        <div className="chart-tip" style={{ left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / h) * 100}%` }}>
          <div className="ct-label">{labels[hover]}</div>
          <div className="ct-val">{prefix}{series[hover]}{suffix}</div>
        </div>
      )}
    </div>
  );
};

interface StackedBarsProps {
  data: Record<string, number>[]; keys: string[]; colors: string[];
  labels: string[]; h?: number; prefix?: string;
}
export const StackedBars = ({ data, keys, colors, labels, h = 190, prefix = "$" }: StackedBarsProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0));
  const max = Math.max(...totals) * 1.1;
  return (
    <div>
      <div className="row" style={{ alignItems: "flex-end", gap: 12, height: h, position: "relative" }}>
        {data.map((d, i) => (
          <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", position: "relative", cursor: "pointer" }}>
            <div style={{ width: "100%", maxWidth: 34, display: "flex", flexDirection: "column-reverse",
              height: (totals[i] / max * 100) + "%", borderRadius: "7px 7px 0 0", overflow: "hidden",
              opacity: hover == null || hover === i ? 1 : 0.45, transition: "opacity .15s" }}>
              {keys.map((k, ki) => (
                <div key={k} style={{ height: (d[k] / totals[i] * 100) + "%", background: colors[ki] }} />
              ))}
            </div>
            {hover === i && (
              <div className="chart-tip stk" style={{ bottom: `calc(${(totals[i] / max * 100)}% + 8px)` }}>
                <div className="ct-label">{labels[i]}</div>
                {keys.map((k, ki) => (
                  <div key={k} className="ct-row"><span className="ct-dot" style={{ background: colors[ki] }} />{k}<b>{prefix}{d[k]}</b></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="row" style={{ gap: 12, marginTop: 8 }}>
        {labels.map((l, i) => <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>{l}</span>)}
      </div>
    </div>
  );
};

export const Legend = ({ items }: { items: { label: string; color: string }[] }) => (
  <div className="row gap-16" style={{ flexWrap: "wrap" }}>
    {items.map((it, i) => (
      <span key={i} className="row gap-6" style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--text-secondary)" }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flex: "0 0 auto" }} />{it.label}
      </span>
    ))}
  </div>
);

const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1,3),16), parseInt(a.slice(3,5),16), parseInt(a.slice(5,7),16)];
  const pb = [parseInt(b.slice(1,3),16), parseInt(b.slice(3,5),16), parseInt(b.slice(5,7),16)];
  const c = pa.map((v,i) => Math.round(v+(pb[i]-v)*t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

interface GaugeProps { value: number; label?: string; sub?: string; size?: number; from?: string; to?: string; }
export const Gauge = ({ value, label, sub, size = 200, from = "#8BE0B8", to = "#01614E" }: GaugeProps) => {
  const r = size / 2 - 14, cx = size / 2, cy = size / 2;
  const seg = 10, gap = 0.06;
  const filled = Math.round((value / 100) * seg);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: size / 2 + 14, margin: "0 auto" }}>
        <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`}>
          {Array.from({ length: seg }).map((_, i) => {
            const a0 = Math.PI + (i / seg + gap / 2) * Math.PI;
            const a1 = Math.PI + ((i + 1) / seg - gap / 2) * Math.PI;
            const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
            const on = i < filled;
            return <path key={i} d={`M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`} fill="none"
              stroke={on ? lerpHex(from, to, seg <= 1 ? 1 : i / (seg - 1)) : "var(--surface-2)"} strokeWidth="13" strokeLinecap="round" />;
          })}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: size * .2, color: "var(--text-primary)", lineHeight: 1 }}>{value}%</div>
          {label && <div className="t-detail" style={{ fontSize: 12, marginTop: 2 }}>{label}</div>}
        </div>
      </div>
      {sub && <div className="t-detail" style={{ fontSize: 12, marginTop: 8, maxWidth: 260, marginInline: "auto" }}>{sub}</div>}
    </div>
  );
};

interface MiniRingProps { value: number; size?: number; sw?: number; color?: string; children?: React.ReactNode; }
export const MiniRing = ({ value, size = 64, sw = 7, color = "var(--green)", children }: MiniRingProps) => {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: size * .26 }}>{children}</div>
    </div>
  );
};

interface SegBarSegment { k: string; v: number; color: string; }
export const SegBar = ({ segments, h = 12 }: { segments: SegBarSegment[]; h?: number }) => {
  const total = segments.reduce((s, x) => s + x.v, 0);
  return (
    <div style={{ display: "flex", gap: 3, height: h, width: "100%" }}>
      {segments.map((s, i) => (
        <div key={i} title={`${s.k} · ${Math.round(s.v / total * 100)}%`}
          style={{ width: (s.v / total * 100) + "%", background: s.color, borderRadius: 3 }} />
      ))}
    </div>
  );
};

export const CatList = ({ segments }: { segments: SegBarSegment[] }) => {
  const total = segments.reduce((s, x) => s + x.v, 0);
  return (
    <div className="col gap-9" style={{ marginTop: 14 }}>
      {segments.map((s, i) => (
        <div key={i} className="row" style={{ justifyContent: "space-between" }}>
          <span className="row gap-8" style={{ fontSize: 13, fontFamily: "var(--font-ui)", color: "var(--text-secondary)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />{s.k}
          </span>
          <b style={{ fontFamily: "var(--font-ui)", fontSize: 13 }}>{Math.round(s.v / total * 100)}%</b>
        </div>
      ))}
    </div>
  );
};

interface HeatmapProps { rows: string[]; cols: string[]; matrix: number[][]; color?: string; }
export const Heatmap = ({ rows, cols, matrix, color = "1,97,78" }: HeatmapProps) => {
  const [hover, setHover] = useState<[number, number, number] | null>(null);
  const max = Math.max(...matrix.flat());
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `64px repeat(${cols.length}, 1fr)`, gap: 5, alignItems: "center" }}>
        <div />
        {cols.map((c, i) => <div key={i} style={{ textAlign: "center", fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>{c}</div>)}
        {rows.map((rlabel, r) => (
          <React.Fragment key={r}>
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontFamily: "var(--font-ui)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rlabel}</div>
            {cols.map((_, c) => {
              const v = matrix[r][c], a = 0.08 + (v / max) * 0.92;
              return <div key={c} onMouseEnter={() => setHover([r, c, v])} onMouseLeave={() => setHover(null)}
                style={{ height: 26, borderRadius: 6, background: `rgba(${color},${a})`, cursor: "pointer",
                  outline: hover && hover[0] === r && hover[1] === c ? "2px solid var(--green)" : "none" }} />;
            })}
          </React.Fragment>
        ))}
      </div>
      {hover && (
        <div className="row gap-8" style={{ marginTop: 12, fontSize: 12.5, fontFamily: "var(--font-ui)", color: "var(--text-secondary)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: `rgba(${color},.9)` }} />
          {rows[hover[0]]} · {cols[hover[1]]}: <b style={{ color: "var(--text-primary)" }}>{hover[2]}</b>
        </div>
      )}
    </div>
  );
};
