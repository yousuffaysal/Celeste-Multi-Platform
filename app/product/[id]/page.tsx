"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";
import Ph from "@/components/Ph";
import { PRODUCTS, SHOPS, REVIEWS, byId, byShop, shopOf, money } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function PDPPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const product = byId(id) || PRODUCTS[0];
  const shop = shopOf(product);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("details");
  const [imgError, setImgError] = useState(false);

  const thumbs = ["main", "angle", "detail", "in use", "scale"];
  const transforms = [
    { scale: 1, origin: "center" },
    { scale: 1.3, origin: "top left" },
    { scale: 2.2, origin: "center" },
    { scale: 1.4, origin: "bottom right" },
    { scale: 1.6, origin: "bottom left" },
  ];
  const related = Array.from(new Set(
    byShop(product.shop).filter(p => p.id !== product.id)
      .concat(PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id))
  )).slice(0, 4);

  const offers = [
    { shop: shop, price: product.price, ship: "Free · 2 days", best: true },
    { shop: SHOPS.fenwick, price: product.price + 12, ship: "Free · 3 days" },
    { shop: SHOPS.arbor, price: product.price - 4, ship: "$5 · 5 days", lowest: true },
  ];

  const doAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="container" style={{ paddingBlock: 24 }}>
      {/* breadcrumb */}
      <div className="row gap-8 t-detail" style={{ marginBottom: 18, flexWrap: "wrap" }}>
        <a onClick={() => router.push("/")} style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Home</a>
        <I.chevright size={13} style={{ color: "var(--text-muted)" }} />
        <a onClick={() => router.push("/search")} style={{ color: "var(--text-secondary)", cursor: "pointer" }}>{product.cat}</a>
        <I.chevright size={13} style={{ color: "var(--text-muted)" }} />
        <span className="dim">{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 40 }} className="pdp-grid">
        {/* Gallery */}
        <div>
          <div className="card" style={{ overflow: "hidden", position: "relative", aspectRatio: "1/1" }}>
            {!imgError ? (
              <img
                src={`/images/products/${product.id}.png`}
                alt={product.name}
                onError={() => setImgError(true)}
                style={{ 
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: `scale(${transforms[active].scale})`,
                  transformOrigin: transforms[active].origin,
                  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
            ) : (
              <Ph label={product.name.toLowerCase() + " · " + thumbs[active]} style={{ width: "100%", height: "100%" }} />
            )}
            <div className="pcard-tags">
              {product.tag === "deal" && <span className="badge badge-deal"><I.tag size={11}/> Deal</span>}
              {product.tag === "new" && <span className="badge badge-new">New</span>}
            </div>
            <button style={{ position: "absolute", bottom: 14, right: 14 }} className="btn btn-secondary btn-sm">
              <I.image size={15}/> View AR
            </button>
          </div>
          <div className="row gap-12" style={{ marginTop: 12 }}>
            {thumbs.map((t, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: active === i ? "2px solid var(--green)" : "2px solid transparent", position: "relative", aspectRatio: "1/1", padding: 0 }}>
                {!imgError ? (
                  <img
                    src={`/images/products/${product.id}.png`}
                    alt=""
                    style={{ 
                      width: "100%", height: "100%", objectFit: "cover",
                      transform: `scale(${transforms[i].scale})`,
                      transformOrigin: transforms[i].origin
                    }}
                  />
                ) : (
                  <Ph label="" style={{ width: "100%", height: "100%" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <div className="row gap-8" style={{ marginBottom: 10 }}>
            <a onClick={() => router.push(`/shop/${shop.id}`)} className="row gap-4" style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
              {shop.name} {shop.verified && <span className="badge badge-verified" style={{ padding: "2px 6px" }}><I.check size={11}/> Verified</span>}
            </a>
          </div>
          <h1 className="t-h2" style={{ fontSize: 30 }}>{product.name}</h1>
          <div className="row gap-12" style={{ marginTop: 12 }}>
            <span className="pcard-rating" style={{ fontSize: 14 }}>
              <Stars value={product.rating} size={16} /> <b style={{ fontFamily: "var(--font-ui)" }}>{product.rating}</b> <span className="dim">({product.reviews} reviews)</span>
            </span>
            <span className="t-detail">·</span>
            <span className="t-detail">{shop.sales} sold</span>
          </div>

          <div className="row gap-12" style={{ marginTop: 18, alignItems: "baseline" }}>
            <span className="t-h2" style={{ color: "var(--green)", fontSize: 34 }}>{money(product.price)}</span>
            {product.old && (
              <>
                <span className="pcard-old" style={{ fontSize: 18 }}>{money(product.old)}</span>
                <span className="badge badge-deal">Save {money(product.old - product.price)}</span>
              </>
            )}
          </div>

          {/* AI highlights */}
          <div style={{ background: "var(--green-tint)", borderRadius: 14, padding: 16, marginTop: 20 }}>
            <div className="row gap-8" style={{ marginBottom: 10 }}>
              <AIChip label="AI highlights" />
              <span className="t-detail" style={{ color: "var(--green)" }}>summarized from specs & 400+ reviews</span>
            </div>
            <div className="col gap-8">
              {["Reviewers love the warm, even light and solid brass finish", "Sturdier than similar lamps at this price point", "Tip: pair with a 2700K bulb for the coziest result"].map((t, i) => (
                <div key={i} className="row gap-8" style={{ alignItems: "flex-start" }}>
                  <Spark size={14} style={{ color: "var(--green)", marginTop: 3, flex: "0 0 auto" }} />
                  <span style={{ fontSize: 14, color: "var(--green-deep)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* variant chips */}
          <div style={{ marginTop: 20 }}>
            <div className="field-label">Finish</div>
            <div className="row gap-8" style={{ flexWrap: "wrap" }}>
              {["Matte Brass", "Black", "Nickel"].map((v, i) => (
                <button key={v} className={"chip" + (i === 0 ? " active" : "")}>{v}</button>
              ))}
            </div>
          </div>

          {/* qty + add */}
          <div className="row gap-12" style={{ marginTop: 22 }}>
            <div className="row" style={{ border: "1px solid var(--border)", borderRadius: 12, height: 52 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 52, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}><I.minus size={16}/></button>
              <span style={{ width: 32, textAlign: "center", fontFamily: "var(--font-ui)", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 52, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}><I.plus size={16}/></button>
            </div>
            <button className={"btn btn-lg " + (added ? "btn-secondary" : "btn-primary")} style={{ flex: 1 }} onClick={doAdd}>
              {added ? <><I.check size={18}/> Added to cart</> : <><I.cart size={18}/> Add to cart</>}
            </button>
            <button className="btn btn-secondary btn-lg btn-icon"><I.heart size={20}/></button>
          </div>
          <button className="btn btn-accent btn-lg btn-block" style={{ marginTop: 12 }}
            onClick={() => { addToCart(product.id, qty); router.push("/cart"); }}>
            Buy now
          </button>

          {/* delivery row */}
          <div className="card" style={{ marginTop: 18, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {([
              [I.truck, "Free delivery", "Arrives Jun 3–5"],
              [I.refresh, "30-day returns", "Free & easy"],
              [I.shield, "Buyer protection", "Covered by Celeste"],
              [I.store, "Sold by " + shop.name, shop.rating + " ★ rating"],
            ] as const).map(([Ic, t, d], i) => (
              <div key={i} className="row gap-8">
                <Ic size={18} style={{ color: "var(--green)", flex: "0 0 auto" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13 }}>{t}</div>
                  <div className="t-detail" style={{ fontSize: 12 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-vendor compare */}
      <section style={{ marginTop: 48 }}>
        <div className="row gap-8" style={{ marginBottom: 16 }}>
          <Spark size={18} style={{ color: "var(--green)" }} />
          <h2 className="t-h3">Also available from other shops</h2>
          <AIChip label="AI compare" />
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          {offers.map((o, i) => (
            <div key={i} className="row" style={{ justifyContent: "space-between", padding: "16px 20px", borderTop: i ? "1px solid var(--border)" : "none", gap: 14, flexWrap: "wrap" }}>
              <div className="row gap-12">
                <Ph label="" style={{ width: 44, height: 44, borderRadius: 10, flex: "0 0 auto" }} />
                <div>
                  <div className="row gap-4" style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14.5 }}>
                    {o.shop.name}{o.shop.verified && <I.check size={13} style={{ color: "var(--green)" }} />}
                  </div>
                  <div className="t-detail">{o.ship}</div>
                </div>
              </div>
              <div className="row gap-16">
                {"best" in o && o.best && <span className="badge badge-verified"><Spark size={11}/> AI top pick</span>}
                {"lowest" in o && o.lowest && <span className="badge badge-deal">Lowest price</span>}
                <span className="pcard-price" style={{ fontSize: 18 }}>{money(o.price)}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => addToCart(product.id, 1)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section style={{ marginTop: 48 }}>
        <div className="row gap-24" style={{ borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
          {([["details", "Details & specs"], ["reviews", "Reviews (" + product.reviews + ")"], ["shipping", "Shipping & returns"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ paddingBottom: 14, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, color: tab === k ? "var(--green)" : "var(--text-secondary)", borderBottom: tab === k ? "2px solid var(--green)" : "2px solid transparent", marginBottom: -1 }}>{l}</button>
          ))}
        </div>

        {tab === "details" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }} className="pdp-grid">
            <div>
              <p className="t-body-lg muted">A considered, well-made piece designed to last. {product.name} brings warmth and quiet function to any space, finished by hand and built from durable materials. Ships flat-packed with everything you need.</p>
              <ul style={{ marginTop: 16, paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                <li>Premium materials, hand-finished</li>
                <li>Tool-free assembly in minutes</li>
                <li>Backed by a 2-year vendor warranty</li>
              </ul>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <b style={{ fontFamily: "var(--font-ui)", fontSize: 14 }}>Specifications</b>
              <div style={{ marginTop: 12 }}>
                {[["Material", "Solid brass, steel"], ["Dimensions", "Adjustable, 140cm max"], ["Weight", "3.2 kg"], ["Warranty", "2 years"], ["Ships from", "Local warehouse"]].map(([k, v]) => (
                  <div key={k} className="row" style={{ justifyContent: "space-between", padding: "9px 0", borderTop: "1px solid var(--border)", fontSize: 14 }}>
                    <span className="dim">{k}</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 40 }} className="pdp-grid">
            <div>
              <div style={{ background: "var(--green-tint)", borderRadius: 14, padding: 18 }}>
                <div className="row gap-8" style={{ marginBottom: 10 }}><AIChip label="AI review summary" /></div>
                <p style={{ fontSize: 14, color: "var(--green-deep)", lineHeight: 1.6 }}>
                  Across {product.reviews} reviews, buyers consistently praise the <b>build quality</b> and <b>warm finish</b>. A few mention it runs slightly smaller than expected. Overall sentiment is <b>highly positive</b>.
                </p>
                <div className="col gap-8" style={{ marginTop: 14 }}>
                  {[["Quality", 96], ["Value", 88], ["As described", 92]].map(([k, v]) => (
                    <div key={k}>
                      <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                        <span className="dim">{k}</span>
                        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--green)" }}>{v}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(1,97,78,.12)", borderRadius: 99 }}>
                        <div style={{ width: v + "%", height: "100%", background: "var(--green)", borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 18, marginTop: 16, textAlign: "center" }}>
                <div className="t-display" style={{ fontSize: 44, color: "var(--green)" }}>{product.rating}</div>
                <Stars value={product.rating} size={18} />
                <div className="t-detail" style={{ marginTop: 6 }}>{product.reviews} verified reviews</div>
              </div>
            </div>
            <div className="col gap-16">
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
                  <span className="badge badge-verified" style={{ marginTop: 12 }}><I.check size={11}/> Verified purchase</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "shipping" && (
          <div className="col gap-16" style={{ maxWidth: 640 }}>
            {([
              [I.truck, "Free standard delivery", "Arrives in 2–5 business days. Tracked end to end across the Celeste network."],
              [I.refresh, "30-day free returns", "Changed your mind? Return any item in original condition within 30 days."],
              [I.shield, "Buyer protection", "Every order is covered. If it doesn't arrive as described, you're refunded."],
            ] as const).map(([Ic, t, d], i) => (
              <div key={i} className="card row gap-16" style={{ padding: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                  <Ic size={20} style={{ color: "var(--green)" }} />
                </div>
                <div>
                  <div className="t-h4">{t}</div>
                  <p className="t-detail" style={{ marginTop: 4 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      <section style={{ marginTop: 48 }}>
        <SectionHeader ai eyebrow="You might also like" title="Completes the look" />
        <div className="pgrid">
          {related.map(p => (
            <ProductCard key={p.id} p={{ ...p, ai: true }} onOpen={(pr) => router.push(`/product/${pr.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
}
