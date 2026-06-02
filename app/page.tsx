"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import SellerBand from "@/components/SellerBand";
import TrustBand from "@/components/TrustBand";
import Ph from "@/components/Ph";
import Stars from "@/components/Stars";
import HeroWave from "@/components/HeroWave";
import SplashIntro from "@/components/SplashIntro";
import { PRODUCTS, INTENTS, SHOPS, byShop, money, Product } from "@/lib/data";

const EXAMPLE_QUERIES = [
  "a calm reading corner under $250",
  "minimalist desk setup",
  "gift for a coffee lover",
  "warm lighting for a small living room",
];

function AISearchDemo() {
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "thinking" | "results">("idle");
  const [qi, setQi] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const RESULT_SETS = useMemo(() => ([
    PRODUCTS.filter(p => ["lumen","fenwick","mori"].includes(p.shop)).slice(0, 4),
    PRODUCTS.filter(p => p.cat === "Office" || p.cat === "Lighting").slice(0, 4),
    PRODUCTS.filter(p => p.shop === "mori" || p.cat === "Audio").slice(0, 4),
    PRODUCTS.filter(p => p.cat === "Lighting" || p.cat === "Textiles").slice(0, 4),
  ]), []);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const run = (i: number) => {
    clearTimers();
    const q = EXAMPLE_QUERIES[i];
    setPhase("typing"); setTyped(""); setResults([]);
    Array.from(q).forEach((_, k) => {
      timers.current.push(setTimeout(() => setTyped(q.slice(0, k + 1)), 40 * k + 80));
    });
    const afterType = 40 * q.length + 260;
    timers.current.push(setTimeout(() => setPhase("thinking"), afterType));
    timers.current.push(setTimeout(() => { setPhase("results"); setResults(RESULT_SETS[i]); }, afterType + 1300));
  };

  useEffect(() => { run(0); return clearTimers; }, []); // eslint-disable-line

  const cycle = () => { const n = (qi + 1) % EXAMPLE_QUERIES.length; setQi(n); run(n); };

  const interp = [
    "lightweight seating, soft lighting, and a side table — under $250",
    "a warm-wood desk, brass task lamp, and tidy organizers",
    "pour-over sets, stoneware mugs, and a quiet grinder",
    "smoked-glass pendants, a brass lamp, and a sage throw",
  ][qi];

  return (
    <div className="card" style={{ overflow: "hidden", boxShadow: "var(--shadow-hover)" }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex",
        alignItems: "center", gap: 12, background: "linear-gradient(180deg,#fff, #fcfdfc)" }}>
        <Spark size={22} className="spark-anim" style={{ color: "var(--green)", flex: "0 0 auto" }} />
        <div style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 500, minHeight: 22 }}>
          {typed}
          {phase === "typing" && <span className="cursor-blink">|</span>}
          {phase === "idle" && <span className="dim">Describe what you&apos;re looking for…</span>}
        </div>
        <button className="btn btn-primary btn-sm" onClick={cycle} style={{ flex: "0 0 auto" }}>
          <I.refresh size={15} /> Try another
        </button>
      </div>

      <div style={{ padding: 20, minHeight: 280 }}>
        {phase === "thinking" && (
          <div className="fade-in col gap-16">
            <div className="row gap-8"><AIChip label="Celeste AI" /><span className="t-detail">interpreting your request…</span></div>
            <div className="pgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {[0,1,2,3].map(i => (
                <div key={i} className="col gap-8">
                  <div className="skeleton" style={{ aspectRatio: "1/1", borderRadius: 14 }} />
                  <div className="skeleton" style={{ height: 12, width: "85%" }} />
                  <div className="skeleton" style={{ height: 12, width: "50%" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "results" && (
          <div className="fade-in col gap-16">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "var(--green-tint)",
              borderRadius: 12, padding: "12px 14px" }}>
              <Spark size={17} style={{ color: "var(--green)", marginTop: 2, flex: "0 0 auto" }} />
              <div style={{ fontSize: 14.5, color: "var(--green)" }}>
                <b style={{ fontFamily: "var(--font-ui)", fontWeight: 600 }}>Here&apos;s what I found</b> — {interp}.
                Pulled from <b style={{ fontFamily: "var(--font-ui)", fontWeight: 600 }}>4 verified shops</b>.
              </div>
            </div>
            <div className="pgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {results.map(p => (
                <ProductCard key={p.id} p={{ ...p, ai: true }} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
              ))}
            </div>
            <button className="btn btn-secondary" style={{ alignSelf: "center" }}
              onClick={() => router.push("/search")}>
              See all results <I.arrowright size={16} />
            </button>
          </div>
        )}

        {phase === "typing" && (
          <div className="col" style={{ height: 240, placeItems: "center", justifyContent: "center", display: "grid" }}>
            <div className="dim t-detail" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Spark size={16} className="spark-anim" /> Celeste is listening…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashTimer() {
  const [t, setT] = useState(4 * 3600 + 22 * 60 + 18);
  useEffect(() => {
    const id = setInterval(() => setT(x => Math.max(0, x - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(t / 3600)).padStart(2, "0");
  const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return (
    <div className="row gap-8">
      {[hh, mm, ss].map((v, i) => (
        <React.Fragment key={i}>
          <span style={{ background: "var(--yellow)", color: "var(--green-deep)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 18, padding: "6px 10px", borderRadius: 8, minWidth: 40, textAlign: "center" }}>{v}</span>
          {i < 2 && <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [heroReady, setHeroReady] = useState(false);

  return (
    <div>
      {/* SPLASH — white screen slides up like a window opening */}
      <SplashIntro onDone={() => setHeroReady(true)} />

      {/* HERO */}
      <section style={{ position: "relative" }}>
        <HeroWave />
        {/* Bottom fade blending into next section */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, var(--bg))", zIndex: 2, pointerEvents: "none" }} />
        <div className="container" style={{ paddingTop: 56, paddingBottom: 56, position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 36 }}>
            <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
              {/* Each hero element staggers in after splash exits */}
              <div style={{
                opacity: heroReady ? 1 : 0,
                transform: heroReady ? "translateY(0)" : "translateY(22px)",
                transition: "opacity 0.55s 0s cubic-bezier(.4,0,.2,1), transform 0.55s 0s cubic-bezier(.4,0,.2,1)",
              }}>
                <AIChip label="AI-native marketplace" style={{ height: 28, fontSize: 12 }} />
              </div>
              <div style={{
                opacity: heroReady ? 1 : 0,
                transform: heroReady ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 0.6s 0.08s cubic-bezier(.4,0,.2,1), transform 0.6s 0.08s cubic-bezier(.4,0,.2,1)",
              }}>
                <h1 className="t-display" style={{ marginTop: 18 }}>Tell us what you need.<br/>We&apos;ll find it.</h1>
              </div>
              <div style={{
                opacity: heroReady ? 1 : 0,
                transform: heroReady ? "translateY(0)" : "translateY(22px)",
                transition: "opacity 0.6s 0.18s cubic-bezier(.4,0,.2,1), transform 0.6s 0.18s cubic-bezier(.4,0,.2,1)",
              }}>
                <p className="t-body-lg muted" style={{ marginTop: 16, maxWidth: 560, marginInline: "auto" }}>
                  Describe it in your words. Celeste searches thousands of verified shops and builds the perfect set — across every vendor.
                </p>
              </div>
              <div style={{
                opacity: heroReady ? 1 : 0,
                transform: heroReady ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.55s 0.28s cubic-bezier(.4,0,.2,1), transform 0.55s 0.28s cubic-bezier(.4,0,.2,1)",
              }}>
                <div className="row gap-8" style={{ justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
                  {EXAMPLE_QUERIES.map(q => (
                    <button key={q} className="chip" onClick={() => router.push("/search")}>
                      <Spark size={13} style={{ color: "var(--green)" }} /> {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              maxWidth: 980, margin: "0 auto", width: "100%",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
              transition: "opacity 0.7s 0.38s cubic-bezier(.4,0,.2,1), transform 0.7s 0.38s cubic-bezier(.4,0,.2,1)",
            }}>
              <AISearchDemo />
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL SEARCH */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="vsearch-grid">
            <div>
              <span className="t-eyebrow" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Spark size={13}/> Visual search</span>
              <h2 className="t-h2" style={{ marginTop: 12 }}>See it somewhere? Search by photo.</h2>
              <p className="t-body-lg muted" style={{ marginTop: 14 }}>
                Snap or upload an image and Celeste finds the closest matches — and cheaper alternatives — across vendors instantly.
              </p>
              <div className="col gap-12" style={{ marginTop: 22 }}>
                {["Upload any photo or screenshot", "AI matches shape, color & material", "Compare options across shops"].map(t => (
                  <div key={t} className="row gap-12">
                    <span style={{ width: 26, height: 26, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                      <I.check size={15} style={{ color: "var(--green)" }}/>
                    </span>
                    <span className="t-body">{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/assistant" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>
                <I.camera size={18}/> Try visual search
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <div className="card" style={{ padding: 16, boxShadow: "var(--shadow-hover)" }}>
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
                  <img src="/images/products/p1.png" alt="uploaded photo" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center right" }} />
                  <div style={{ position: "absolute", inset: 0, border: "2px solid var(--yellow)", borderRadius: 12, margin: "22% 30% 30% 18%", boxShadow: "0 0 0 9999px rgba(17,32,27,.18)" }} />
                  <span style={{ position: "absolute", left: "18%", top: "20%", transform: "translateY(-100%)", background: "var(--yellow)", color: "var(--green-deep)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>matched</span>
                </div>
                <div className="row gap-12" style={{ marginTop: 14 }}>
                  {byShop("lumen").slice(0,3).map(p => (
                    <div key={p.id} style={{ flex: 1 }} onClick={() => router.push(`/product/${p.id}`)}>
                      <img src={`/images/products/${p.id}.png`} alt="match" style={{ width: "100%", aspectRatio: "1/1", borderRadius: 10, objectFit: "cover", cursor: "pointer" }} />
                      <div className="pcard-price" style={{ fontSize: 14, marginTop: 6 }}>{money(p.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR YOU FEED */}
      <section className="section-tight">
        <div className="container">
          <SectionHeader ai eyebrow="Personalized for you" title="Picked by Celeste AI" seeAll="See all" onSeeAll={() => router.push("/search")} />
          <div className="pgrid">
            {PRODUCTS.slice(0, 8).map(p => (
              <ProductCard key={p.id} p={{ ...p, ai: true }} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY INTENT */}
      <section className="section">
        <div className="container">
          <SectionHeader ai eyebrow="Shop by intent" title="Not a category. A moment." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="intent-grid">
            {INTENTS.map((c, i) => (
              <div key={i} onClick={() => router.push("/search")} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", cursor: "pointer" }}>
                <img src={`/images/products/p${[4,6,9,14][i]}.png`} alt={c.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(1,97,78,0) 30%, rgba(1,59,47,.86))" }} />
                <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, color: "#fff" }}>
                  <AIChip label="AI curated" style={{ background: "rgba(255,255,255,.2)", color: "#fff" }} />
                  <div className="t-h3" style={{ color: "#fff", marginTop: 8 }}>{c.title}</div>
                  <div className="t-detail" style={{ color: "rgba(255,255,255,.8)" }}>{c.count} items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING CAROUSEL */}
      <section className="section-tight">
        <div className="container">
          <SectionHeader ai eyebrow="AI-predicted" title="Trending this week" seeAll="See all" onSeeAll={() => router.push("/search")} />
          <div className="hscroll">
            {PRODUCTS.slice(8, 18).map(p => (
              <div key={p.id} style={{ width: 230 }}>
                <ProductCard p={{ ...p, tag: undefined }} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED SHOPS */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Trusted vendors" title="Verified shops" seeAll="Browse shops" onSeeAll={() => router.push("/shop/lumen")} />
          <div className="hscroll">
            {Object.values(SHOPS).filter(s => s.verified).map(s => (
              <div key={s.id} className="card" style={{ width: 260, padding: 18, cursor: "pointer" }} onClick={() => router.push(`/shop/${s.id}`)}>
                <div className="row gap-12">
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} style={{ width: 52, height: 52, borderRadius: 12, flex: "0 0 auto", objectFit: "contain", background: "#fff", border: "1px solid var(--border)" }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: 12, flex: "0 0 auto", background: "var(--green-deep)", color: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 24 }}>
                      {s.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="row gap-4" style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15 }}>
                      {s.name} <span className="badge badge-verified" style={{ padding: "2px 6px" }}><I.check size={11}/></span>
                    </div>
                    <div className="t-detail">{s.cat}</div>
                  </div>
                </div>
                <div className="row gap-16" style={{ marginTop: 14 }}>
                  <span className="pcard-rating"><Stars value={s.rating} size={13}/> {s.rating}</span>
                  <span className="t-detail">{s.sales} sales</span>
                </div>
                <div className="row gap-8" style={{ marginTop: 14 }}>
                  {byShop(s.id).slice(0,3).map(p => <img key={p.id} src={`/images/products/${p.id}.png`} alt="" style={{ flex: 1, width: "30%", aspectRatio: "1/1", borderRadius: 8, objectFit: "cover" }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH DEALS */}
      <section style={{ background: "var(--surface-2)" }} className="section">
        <div className="container">
          <div className="sec-head">
            <div className="col gap-8">
              <span className="t-eyebrow" style={{ color: "var(--warning)", display: "inline-flex", gap: 6, alignItems: "center" }}>
                <I.flame size={13}/> Flash deals
              </span>
              <h2 className="t-h2">Ends soon</h2>
            </div>
            <FlashTimer />
          </div>
          <div className="pgrid">
            {PRODUCTS.filter(p => p.old).slice(0, 4).map(p => (
              <ProductCard key={p.id} p={{ ...p, tag: "deal" }} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY SHOP VALUE BAND */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="t-eyebrow" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Spark size={13}/> Why Celeste</span>
            <h2 className="t-h2" style={{ marginTop: 10 }}>A smarter way to shop</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }} className="why-grid">
            {[
              { i: I.wand,    t: "Smart assistant",        d: "Describe a need; get a curated answer across vendors." },
              { i: I.compare, t: "Cross-vendor compare",   d: "One view of price, shipping and ratings everywhere." },
              { i: I.bell,    t: "Price & restock alerts", d: "We watch it so you don't have to." },
              { i: I.shield,  t: "Buyer protection",       d: "Every order, every shop — covered." },
            ].map((x, k) => (
              <div key={k} className="col gap-12" style={{ textAlign: "center", alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--green-tint)", display: "grid", placeItems: "center" }}>
                  <x.i size={26} style={{ color: "var(--green)" }} />
                </div>
                <div className="t-h4">{x.t}</div>
                <p className="t-detail" style={{ maxWidth: 220 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELLER CTA */}
      <section className="section-tight"><SellerBand /></section>

      {/* NEW ARRIVALS */}
      <section className="section-tight">
        <div className="container">
          <SectionHeader eyebrow="Fresh in" title="New arrivals" seeAll="See all" onSeeAll={() => router.push("/search")} />
          <div className="pgrid">
            {PRODUCTS.filter(p => p.tag === "new").concat(PRODUCTS.slice(18)).slice(0, 4).map(p => (
              <ProductCard key={p.id} p={p} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-tight"><TrustBand /></section>
    </div>
  );
}
