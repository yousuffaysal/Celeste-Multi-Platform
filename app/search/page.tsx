"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, shopOf, money } from "@/lib/data";

const SORTS = ["AI relevance", "Price: low to high", "Price: high to low", "Top rated", "Newest"];
const PRICE_BANDS = ["Under $50", "$50–$100", "$100–$200", "$200+"];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBlock: 14, borderTop: "1px solid var(--border)" }}>
      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".3px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>{title}</div>
      <div className="col gap-4">{children}</div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [sort, setSort] = useState("AI relevance");
  const [bands, setBands] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [verifiedOnly, setVerified] = useState(false);
  const [refining, setRefining] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const q = "calm home office under $250";

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const inBand = (price: number) => bands.length === 0 || bands.some(b =>
    (b === "Under $50" && price < 50) || (b === "$50–$100" && price >= 50 && price < 100) ||
    (b === "$100–$200" && price >= 100 && price < 200) || (b === "$200+" && price >= 200));

  let list = PRODUCTS.filter(p => inBand(p.price)
    && (cats.length === 0 || cats.includes(p.cat))
    && (!verifiedOnly || shopOf(p).verified));
  if (sort === "Price: low to high") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "Price: high to low") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "Top rated") list = [...list].sort((a, b) => b.rating - a.rating);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    PRODUCTS.forEach(p => { m[p.cat] = (m[p.cat] || 0) + 1; });
    return m;
  }, []);
  const allCats = Object.keys(catCounts);

  const doRefine = () => { setRefining(true); setTimeout(() => setRefining(false), 1100); };

  return (
    <div>
      {/* AI summary strip */}
      <section style={{ background: "var(--green)", color: "#fff" }}>
        <div className="container" style={{ paddingBlock: 22 }}>
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            <AIChip label="Celeste AI" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }} />
            <span className="t-detail" style={{ color: "rgba(255,255,255,.8)" }}>understood your search as</span>
          </div>
          <h1 className="t-h3" style={{ color: "#fff", marginTop: 8, fontFamily: "var(--font-display)", fontWeight: 600 }}>&ldquo;{q}&rdquo;</h1>
          <p className="t-body" style={{ color: "var(--green-tint)", marginTop: 6, maxWidth: 720 }}>
            I prioritized soft lighting, compact desks and tidy storage from verified shops — and filtered to your budget. Refine below or tell me more.
          </p>
          <div className="row gap-8" style={{ marginTop: 14, flexWrap: "wrap" }}>
            {["lighter palette", "more storage", "under $200", "ships in 2 days"].map(s => (
              <button key={s} className="chip" onClick={doRefine}
                style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.2)", color: "#fff" }}>
                <Spark size={12} /> {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBlock: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 32 }} className="listing-grid">
          {/* Filters */}
          <aside className="hide-mobile">
            <div className="card" style={{ padding: 20, position: "sticky", top: 130 }}>
              <div className="row gap-8" style={{ marginBottom: 16 }}>
                <I.sliders size={18} style={{ color: "var(--green)" }} />
                <b style={{ fontFamily: "var(--font-ui)", fontSize: 15 }}>Filters</b>
              </div>

              <FilterGroup title="AI smart filters">
                {[["Best value", true], ["In stock & fast ship", false], ["Eco-friendly", false]].map(([t, ai]) => (
                  <label key={String(t)} className="filt-row">
                    <input type="checkbox" />
                    <span>{String(t)}</span>
                    {ai && <Spark size={12} style={{ color: "var(--green)", marginLeft: "auto" }} />}
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Price">
                {PRICE_BANDS.map(b => (
                  <label key={b} className="filt-row">
                    <input type="checkbox" checked={bands.includes(b)} onChange={() => toggle(bands, setBands, b)} />
                    <span>{b}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Category">
                {allCats.map(c => (
                  <label key={c} className="filt-row">
                    <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />
                    <span>{c}</span>
                    <span className="dim" style={{ marginLeft: "auto", fontSize: 12 }}>{catCounts[c]}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Shops">
                <label className="filt-row">
                  <input type="checkbox" checked={verifiedOnly} onChange={() => setVerified(!verifiedOnly)} />
                  <span>Verified only</span>
                  <I.check size={13} style={{ color: "var(--green)", marginLeft: "auto" }} />
                </label>
              </FilterGroup>

              <FilterGroup title="Rating">
                {[4.5, 4.0, 3.5].map(r => (
                  <label key={r} className="filt-row">
                    <input type="radio" name="rating" />
                    <span className="row gap-4">
                      {[0,1,2,3,4].map(i => (
                        <svg key={i} width={13} height={13} viewBox="0 0 24 24" fill={i < Math.round(r) ? "var(--yellow)" : "#E3E6E4"} stroke="none">
                          <path d="M12 3.5l2.4 5 5.4.7-4 3.7 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.7 5.4-.7z"/>
                        </svg>
                      ))} &amp; up
                    </span>
                  </label>
                ))}
              </FilterGroup>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
              <span className="t-detail">
                <b style={{ color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>{list.length} results</b> across {new Set(list.map(p => p.shop)).size} shops
              </span>
              <div className="row gap-8">
                <button className="chip show-mobile"><I.filter size={15} /> Filters</button>
                <div style={{ position: "relative" }}>
                  <button className="chip" onClick={() => setOpenSort(!openSort)}>
                    <I.sliders size={15} /> {sort} <I.chevdown size={14} />
                  </button>
                  {openSort && (
                    <div className="card fade-in" style={{ position: "absolute", right: 0, top: 42, width: 210, padding: 6, zIndex: 20, boxShadow: "var(--shadow-pop)" }}>
                      {SORTS.map(s => (
                        <button key={s} onClick={() => { setSort(s); setOpenSort(false); }}
                          style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, fontFamily: "var(--font-ui)", fontSize: 13.5, color: s === sort ? "var(--green)" : "var(--text-secondary)", background: s === sort ? "var(--green-tint)" : "transparent", textAlign: "left" }}>
                          {s === "AI relevance" && <Spark size={13} />}{s}{s === sort && <I.check size={14} style={{ marginLeft: "auto" }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {refining ? (
              <div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="col gap-8">
                    <div className="skeleton" style={{ aspectRatio: "1/1", borderRadius: 14 }} />
                    <div className="skeleton" style={{ height: 12, width: "80%" }} />
                    <div className="skeleton" style={{ height: 12, width: "45%" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                {list.map((p, i) => (
                  <ProductCard key={p.id} p={i % 5 === 0 ? { ...p, ai: true } : p} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
                ))}
              </div>
            )}

            <div className="seller-band" style={{ marginTop: 24, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div className="accent-shape" />
              <div style={{ position: "relative" }}>
                <div className="row gap-8" style={{ marginBottom: 6 }}>
                  <Spark size={16} style={{ color: "var(--yellow)" }} />
                  <span className="t-eyebrow" style={{ color: "var(--yellow)" }}>Let the assistant decide</span>
                </div>
                <div className="t-h3" style={{ color: "#fff" }}>Can&apos;t choose? I&apos;ll build the whole set for you.</div>
              </div>
              <button className="btn btn-accent" style={{ position: "relative" }} onClick={() => router.push("/assistant")}>
                Open AI assistant <I.arrowright size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
