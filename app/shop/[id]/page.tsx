"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";
import Ph from "@/components/Ph";
import { SHOPS, REVIEWS, byShop, PRODUCTS } from "@/lib/data";

export default function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const shop = SHOPS[id] || SHOPS.lumen;
  const products = byShop(shop.id).length ? byShop(shop.id) : PRODUCTS.slice(0, 8);
  const [tab, setTab] = useState("all");
  const [follow, setFollow] = useState(false);

  return (
    <div>
      {/* banner */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img src={`/images/products/${products[0]?.id || 'p1'}.png`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(12px) brightness(0.8) saturate(1.2)", transform: "scale(1.1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(1,97,78,.1), rgba(1,59,47,.6))" }} />
      </div>

      <div className="container">
        {/* shop header */}
        <div className="card" style={{ marginTop: -60, position: "relative", padding: 24, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          {shop.logo ? (
            <img src={shop.logo} alt={shop.name} style={{ width: 96, height: 96, borderRadius: 20, flex: "0 0 auto", border: "3px solid #fff", boxShadow: "var(--shadow-card)", objectFit: "contain", background: "#fff", padding: 8 }} />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: 20, flex: "0 0 auto", border: "3px solid #fff", boxShadow: "var(--shadow-card)", background: "var(--green-deep)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--yellow)", fontFamily: "Georgia, serif", fontSize: 44, fontWeight: "normal" }}>
              {shop.name.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="row gap-8">
              <h1 className="t-h2" style={{ fontSize: 28 }}>{shop.name}</h1>
              {shop.verified && <span className="badge badge-verified"><I.check size={12} /> Verified</span>}
            </div>
            <p className="t-body muted" style={{ marginTop: 6, maxWidth: 520 }}>
              Thoughtfully made {shop.cat.toLowerCase()} for calm, considered spaces. Every piece designed to last — and to feel good to live with.
            </p>
            <div className="row gap-24" style={{ marginTop: 12, flexWrap: "wrap" }}>
              <span className="pcard-rating" style={{ fontSize: 14 }}>
                <Stars value={shop.rating} size={15} /> <b style={{ fontFamily: "var(--font-ui)" }}>{shop.rating}</b>
              </span>
              <span className="t-detail"><b style={{ color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>{shop.sales}</b> sales</span>
              <span className="t-detail">Since {shop.since}</span>
              <span className="t-detail row gap-4"><I.truck size={14} /> Ships in 2 days</span>
            </div>
          </div>
          <div className="row gap-8">
            <button className={"btn " + (follow ? "btn-secondary" : "btn-primary")} onClick={() => setFollow(!follow)}>
              {follow ? <><I.check size={16} /> Following</> : <><I.plus size={16} /> Follow</>}
            </button>
            <button className="btn btn-secondary btn-icon"><I.send size={18} /></button>
          </div>
        </div>

        {/* AI shop summary */}
        <div style={{ background: "var(--green-tint)", borderRadius: 14, padding: "14px 18px", marginTop: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <AIChip label="AI shop summary" />
          <span style={{ fontSize: 14, color: "var(--green-deep)", flex: 1, minWidth: 240 }}>
            Buyers describe this shop as <b>reliable</b>, <b>beautifully packaged</b>, and <b>quick to respond</b>. Strongest in {shop.cat.toLowerCase()}.
          </span>
        </div>

        {/* tabs */}
        <div className="row gap-24" style={{ borderBottom: "1px solid var(--border)", marginTop: 24 }}>
          {([["all", "All products"], ["new", "New"], ["best", "Bestsellers"], ["about", "About"], ["reviews", "Reviews"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ paddingBottom: 14, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, color: tab === k ? "var(--green)" : "var(--text-secondary)", borderBottom: tab === k ? "2px solid var(--green)" : "2px solid transparent", marginBottom: -1 }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ paddingBlock: 28 }}>
          {tab === "about" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, maxWidth: 900 }} className="pdp-grid">
              <div>
                <h3 className="t-h3" style={{ marginBottom: 12 }}>Our story</h3>
                <p className="t-body-lg muted">
                  {shop.name} began in {shop.since} with a simple belief: the things we use every day should be made with care. We work in small batches, with natural materials, and stand behind everything we ship. Thanks for supporting independent makers.
                </p>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <b style={{ fontFamily: "var(--font-ui)", fontSize: 14 }}>Shop policies</b>
                {[["Processing", "1–2 days"], ["Shipping", "Free over $75"], ["Returns", "30 days"], ["Response time", "Within hours"]].map(([k, v]) => (
                  <div key={k} className="row" style={{ justifyContent: "space-between", padding: "9px 0", borderTop: "1px solid var(--border)", fontSize: 14 }}>
                    <span className="dim">{k}</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : tab === "reviews" ? (
            <div className="col gap-16" style={{ maxWidth: 720 }}>
              {REVIEWS.map((r, i) => (
                <div key={i} className="card" style={{ padding: 18 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="row gap-12">
                      <Ph label="" style={{ width: 40, height: 40, borderRadius: 99, flex: "0 0 auto" }} />
                      <div>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                        <Stars value={r.rating} size={13} />
                      </div>
                    </div>
                    <span className="t-detail">{r.date}</span>
                  </div>
                  <p className="t-body" style={{ marginTop: 12 }}>{r.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="pgrid">
              {(tab === "new" ? products.filter(p => p.tag === "new").concat(products) : products).slice(0, 8).map(p => (
                <ProductCard key={p.id} p={p} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
