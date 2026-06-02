"use client";
import React, { useState, useEffect, useRef } from "react";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import SectionHeader from "@/components/SectionHeader";
import SellerBand from "@/components/SellerBand";
import Ph from "@/components/Ph";

const RESULT = {
  title: "Hand-thrown Stoneware Mug, Set of 2",
  desc: "A pair of hand-thrown stoneware mugs with a soft matte glaze. Microwave and dishwasher safe, each holds 12oz. Made to bring a little calm to your morning ritual.",
  price: "44",
  tags: ["stoneware", "handmade", "kitchen", "gift", "set of 2"],
};

function GenField({ label, value, ph, area }: { label: string; value: string; ph: string; area?: boolean }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <div className="gen-box" style={{ minHeight: area ? 64 : 40, fontSize: area ? 13.5 : 14.5, lineHeight: 1.5, color: value ? "var(--text-primary)" : "var(--text-muted)", fontFamily: area ? "var(--font-body)" : "var(--font-ui)", fontWeight: area ? 300 : 500 }}>
        {value || ph}{value && value.length > 0 && value !== ph && <span className="cursor-blink"></span>}
      </div>
    </div>
  );
}

function SnapToListing() {
  const [phase, setPhase] = useState<"ready" | "scanning" | "writing" | "done">("ready");
  const [fields, setFields] = useState({ title: "", desc: "", price: "", tags: [] as string[] });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => timers.current.forEach(clearTimeout);
  useEffect(() => () => clear(), []);

  const typeInto = (key: "title" | "desc", text: string, speed: number, done: () => void) => {
    Array.from(text).forEach((_, k) => {
      timers.current.push(setTimeout(() => setFields(f => ({ ...f, [key]: text.slice(0, k + 1) })), speed * k));
    });
    timers.current.push(setTimeout(done, speed * text.length + 150));
  };

  const run = () => {
    clear();
    setPhase("scanning"); setFields({ title: "", desc: "", price: "", tags: [] });
    timers.current.push(setTimeout(() => setPhase("writing"), 1700));
    timers.current.push(setTimeout(() => {
      typeInto("title", RESULT.title, 24, () => {
        typeInto("desc", RESULT.desc, 12, () => {
          setFields(f => ({ ...f, price: RESULT.price }));
          let ti = 0;
          const addTag = () => {
            if (ti < RESULT.tags.length) {
              setFields(f => ({ ...f, tags: RESULT.tags.slice(0, ti + 1) }));
              ti++;
              timers.current.push(setTimeout(addTag, 180));
            } else {
              setPhase("done");
            }
          };
          timers.current.push(setTimeout(addTag, 200));
        });
      });
    }, 2000));
  };

  return (
    <div className="card" style={{ overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.3)", color: "var(--text-primary)" }}>
      <div style={{ position: "relative" }}>
        <Ph label="your product photo · stoneware mugs" style={{ aspectRatio: "16/10" }} />
        {phase === "scanning" && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div className="scan-line" />
            <div style={{ position: "absolute", inset: 0, background: "rgba(1,97,78,.08)" }} />
            <span style={{ position: "absolute", left: 14, top: 14 }}><AIChip label="analyzing image…" /></span>
          </div>
        )}
        {phase === "ready" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,32,27,.34)", display: "grid", placeItems: "center" }}>
            <button className="btn btn-accent btn-lg" onClick={run}><I.camera size={18} /> Snap &amp; auto-list</button>
          </div>
        )}
        {phase !== "ready" && phase !== "scanning" && (
          <button onClick={run} style={{ position: "absolute", right: 12, top: 12, background: "rgba(255,255,255,.92)", borderRadius: 99, width: 34, height: 34, display: "grid", placeItems: "center" }} title="Run again">
            <I.refresh size={17} style={{ color: "var(--green)" }} />
          </button>
        )}
      </div>

      <div style={{ padding: 18 }}>
        <div className="row gap-8" style={{ marginBottom: 14 }}>
          <AIChip label="AI-generated listing" />
          {phase === "done" && (
            <span className="badge badge-verified fade-in" style={{ marginLeft: "auto" }}><I.check size={11} /> Ready to publish</span>
          )}
        </div>
        <div className="col gap-12">
          <GenField label="Title" value={fields.title} ph="AI will write your title…" />
          <GenField label="Description" value={fields.desc} ph="AI will write your description…" area />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <div>
              <div className="field-label">Suggested price</div>
              <div className="gen-box" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {fields.price ? (
                  <>
                    <span style={{ color: "var(--green)", fontFamily: "var(--font-ui)", fontWeight: 700 }}>${fields.price}</span>
                    <span className="ai-chip" style={{ marginLeft: "auto", height: 20 }}><Spark size={10} /> smart</span>
                  </>
                ) : <span className="dim">—</span>}
              </div>
            </div>
            <div>
              <div className="field-label">Tags</div>
              <div className="gen-box" style={{ display: "flex", gap: 5, flexWrap: "wrap", minHeight: 40, alignItems: "center" }}>
                {fields.tags.length ? fields.tags.map(t => (
                  <span key={t} className="chip fade-in" style={{ height: 24, fontSize: 11.5, padding: "0 9px" }}>{t}</span>
                )) : <span className="dim">—</span>}
              </div>
            </div>
          </div>
          {phase === "done" && (
            <button className="btn btn-primary btn-block fade-in" style={{ marginTop: 4 }}>
              Publish listing <I.arrowright size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-hover)" }}>
      <div className="row" style={{ justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div className="row gap-8">
          <Spark size={17} style={{ color: "var(--green)" }} />
          <b style={{ fontFamily: "var(--font-ui)", fontSize: 14.5 }}>Mori Ceramics · Dashboard</b>
        </div>
        <span className="t-detail">This week</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--border)" }}>
        {[["Revenue", "$4,820", "+18%"], ["Orders", "142", "+9%"], ["Conversion", "3.4%", "+0.6"]].map(([k, v, d]) => (
          <div key={k} style={{ background: "var(--surface)", padding: "16px 18px" }}>
            <div className="t-detail" style={{ fontSize: 12 }}>{k}</div>
            <div className="t-h3" style={{ fontSize: 22, marginTop: 4 }}>{v}</div>
            <div style={{ fontSize: 12, color: "var(--success)", fontFamily: "var(--font-ui)", fontWeight: 600 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 20 }}>
        <div className="row" style={{ alignItems: "flex-end", gap: 8, height: 110 }}>
          {[40, 55, 48, 70, 62, 85, 78, 96, 88, 100].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h + "%", background: i >= 8 ? "var(--green)" : "var(--green-tint)", borderRadius: "5px 5px 0 0" }} />
          ))}
        </div>
        <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "10px 12px", marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
          <Spark size={15} style={{ color: "var(--green)", flex: "0 0 auto" }} />
          <span style={{ fontSize: 12.5, color: "var(--green-deep)" }}>
            <b style={{ fontFamily: "var(--font-ui)" }}>AI tip:</b> Restock &ldquo;Pour-Over Set&rdquo; — projected to sell out in 4 days.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SellerPage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ background: "linear-gradient(165deg, var(--green) 0%, var(--green-deep) 100%)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 340, height: 340, borderRadius: "50%", background: "var(--yellow)", opacity: .12 }} />
        <div style={{ position: "absolute", right: 200, bottom: -60, width: 160, height: 160, borderRadius: "50%", background: "var(--yellow)", opacity: .08 }} />
        <div className="container" style={{ paddingBlock: 72, position: "relative" }}>
          <div style={{ display: "grid", gap: 48, alignItems: "center" }} className="seller-hero-grid">
            <div>
              <span className="t-eyebrow" style={{ color: "var(--yellow)", display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Spark size={14} /> Sell on Celeste
              </span>
              <h1 className="t-display" style={{ color: "#fff", marginTop: 14 }}>Snap a photo.<br/>AI does the rest.</h1>
              <p className="t-body-lg" style={{ color: "var(--green-tint)", marginTop: 16, maxWidth: 460 }}>
                List products in seconds. Our AI writes your titles, descriptions and tags, sets a smart price, and helps you reach the right buyers — so you can focus on what you make.
              </p>
              <div className="row gap-12" style={{ marginTop: 26, flexWrap: "wrap" }}>
                <button className="btn btn-accent btn-lg">Start selling free <I.arrowright size={18} /></button>
                <button className="btn btn-ghost-white btn-lg"><I.play size={16} /> Watch how it works</button>
              </div>
              <div className="row gap-24" style={{ marginTop: 30, flexWrap: "wrap" }}>
                {[["0%", "fees for 30 days"], ["3 min", "to your first listing"], ["120k+", "active buyers"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="t-h2" style={{ color: "var(--yellow)", fontSize: 30 }}>{n}</div>
                    <div className="t-detail" style={{ color: "var(--green-tint)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <SnapToListing />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="t-eyebrow" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Spark size={13} /> How it works</span>
            <h2 className="t-h2" style={{ marginTop: 10 }}>From photo to published in 3 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="why-grid">
            {[
              { i: I.camera, t: "1 · Snap or upload", d: "Take a photo of your product. That's the only input we need to begin." },
              { i: I.wand,   t: "2 · AI writes the listing", d: "Title, description, tags, category and a smart suggested price — drafted instantly." },
              { i: I.store,  t: "3 · Review & publish", d: "Tweak anything you like, hit publish, and you're live across the marketplace." },
            ].map((x, k) => (
              <div key={k} className="card" style={{ padding: 26 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--green-tint)", display: "grid", placeItems: "center" }}>
                  <x.i size={24} style={{ color: "var(--green)" }} />
                </div>
                <div className="t-h3" style={{ marginTop: 16, fontSize: 19 }}>{x.t}</div>
                <p className="t-detail" style={{ marginTop: 8 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI GROWTH TOOLS */}
      <section style={{ background: "var(--surface-2)" }} className="section">
        <div className="container">
          <SectionHeader ai eyebrow="AI Growth Engine" title="Tools that sell for you" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="why-grid">
            {[
              { i: I.tag,   t: "Smart pricing",    d: "AI suggests prices that win the buy box and protect your margin." },
              { i: I.chart, t: "Demand insights",  d: "See what buyers are searching for before you stock it." },
              { i: I.bolt,  t: "Auto ad campaigns",d: "AI runs and optimizes your promotions across the marketplace." },
              { i: I.bell,  t: "Restock nudges",   d: "Get told what's about to sell out so you never miss a sale." },
            ].map((x, k) => (
              <div key={k} className="col gap-12">
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center" }}>
                  <x.i size={22} style={{ color: "var(--green)" }} />
                </div>
                <div className="t-h4">{x.t}</div>
                <p className="t-detail">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gap: 44, alignItems: "center" }} className="seller-hero-grid">
            <div>
              <span className="t-eyebrow">Seller dashboard</span>
              <h2 className="t-h2" style={{ marginTop: 12 }}>Your whole shop, one calm view</h2>
              <p className="t-body-lg muted" style={{ marginTop: 14 }}>
                Orders, revenue, inventory and AI recommendations — all in a dashboard designed to keep you in flow, not in spreadsheets.
              </p>
              <div className="col gap-12" style={{ marginTop: 20 }}>
                {["Real-time order & payout tracking", "AI flags slow movers and bestsellers", "One-tap reorder and price updates"].map(t => (
                  <div key={t} className="row gap-12">
                    <span style={{ width: 24, height: 24, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                      <I.check size={14} style={{ color: "var(--green)" }} />
                    </span>
                    <span className="t-body">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section"><SellerBand /></section>
    </div>
  );
}
