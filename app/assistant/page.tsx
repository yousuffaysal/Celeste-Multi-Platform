"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import { byId, shopOf, money, PRODUCTS } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const SUGGESTED = [
  "Set up a calm home office under $400",
  "Build a coffee corner for a small kitchen",
  "Warm up my living room with lighting and textiles",
  "I need housewarming gifts under $200",
];

interface Message {
  who: "user" | "ai";
  text?: string;
  thinking?: boolean;
  productIds?: string[];
}

/* ── Inline product card shown inside chat ── */
function InlineProductCard({ id, onAdd }: { id: string; onAdd: (id: string) => void }) {
  const router = useRouter();
  const p = byId(id);
  if (!p) return null;
  const shop = shopOf(p);
  return (
    <div className="card fade-in" style={{ display: "flex", gap: 12, padding: 12, cursor: "pointer", transition: "box-shadow .2s", border: "1px solid var(--border)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
    >
      {/* Thumbnail */}
      <div
        onClick={() => router.push(`/product/${p.id}`)}
        style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flex: "0 0 auto", background: "var(--surface-2)" }}
      >
        <img
          src={`/images/products/${p.id}.png`}
          alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={() => router.push(`/product/${p.id}`)}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{shop.name}{shop.verified && " ✓"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--green)" }}>{money(p.price)}</span>
          {p.old && <span style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "line-through" }}>{money(p.old)}</span>}
          {p.tag && <span style={{ fontSize: 10.5, fontFamily: "var(--font-ui)", fontWeight: 700, background: p.tag === "deal" ? "var(--yellow)" : "var(--green-tint)", color: p.tag === "deal" ? "var(--green-deep)" : "var(--green)", padding: "2px 7px", borderRadius: 99 }}>{p.tag}</span>}
        </div>
      </div>
      {/* Add button */}
      <button
        onClick={e => { e.stopPropagation(); onAdd(p.id); }}
        className="btn btn-primary btn-sm"
        style={{ flex: "0 0 auto", alignSelf: "center", height: 34, padding: "0 14px" }}
      >
        <I.plus size={14} /> Add
      </button>
    </div>
  );
}

/* ── Chat bubble ── */
function Bubble({ m, onAddProduct, onAddAll }: {
  m: Message;
  onAddProduct: (id: string) => void;
  onAddAll: (ids: string[]) => void;
}) {
  if (m.who === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "78%", background: "var(--green)", color: "#fff", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: 15, lineHeight: 1.55 }} className="fade-in">
        {m.text}
      </div>
    );
  }

  const hasProducts = (m.productIds?.length ?? 0) > 0;

  return (
    <div className="fade-in" style={{ display: "flex", gap: 12, maxWidth: "90%", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto", marginTop: 2 }}>
          <Spark size={17} style={{ color: "var(--green)" }} className={m.thinking ? "spark-anim" : ""} />
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", fontSize: 15, color: m.thinking ? "var(--text-muted)" : "var(--text-primary)", lineHeight: 1.6 }}>
          {m.thinking ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="dots-typing"><i /><i /><i /></span>
              <span>{m.text}</span>
            </span>
          ) : m.text}
        </div>
      </div>

      {/* Inline product cards */}
      {hasProducts && (
        <div style={{ marginLeft: 44, display: "flex", flexDirection: "column", gap: 8 }}>
          {m.productIds!.map(id => (
            <InlineProductCard key={id} id={id} onAdd={onAddProduct} />
          ))}

          {/* Add all button */}
          <button
            className="btn btn-primary"
            style={{ alignSelf: "flex-start", marginTop: 4 }}
            onClick={() => onAddAll(m.productIds!)}
          >
            <I.cart size={16} /> Add all to cart
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Right panel product row ── */
function CartItem({ id, onRemove }: { id: string; onRemove: () => void }) {
  const router = useRouter();
  const p = byId(id);
  if (!p) return null;
  return (
    <div className="card fade-in row gap-12" style={{ padding: 10 }}>
      <div onClick={() => router.push(`/product/${p.id}`)} style={{ width: 54, height: 54, borderRadius: 10, overflow: "hidden", flex: "0 0 auto", background: "var(--surface-2)", cursor: "pointer" }}>
        <img src={`/images/products/${p.id}.png`} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      </div>
      <div style={{ minWidth: 0, flex: 1, cursor: "pointer" }} onClick={() => router.push(`/product/${p.id}`)}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
        <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 1 }}>{shopOf(p).name}</div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--green)", marginTop: 2 }}>{money(p.price)}</div>
      </div>
      <button onClick={onRemove} style={{ color: "var(--text-muted)", flex: "0 0 auto" }}>
        <I.close size={15} />
      </button>
    </div>
  );
}

/* ── Page ── */
export default function AssistantPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [msgs, setMsgs] = useState<Message[]>([
    { who: "ai", text: "Hi! I'm Celeste — tell me what you need. A room to furnish, a gift to find, a vibe to create — and I'll find the perfect products from our shops." },
  ]);
  const [picked, setPicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, picked]);

  const addProduct = (id: string) => {
    setPicked(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const addAll = (ids: string[]) => {
    setPicked(prev => {
      const set = new Set(prev);
      ids.forEach(id => { if (byId(id)) set.add(id); });
      return [...set];
    });
  };

  const send = async (text?: string) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput("");
    setLoading(true);

    setMsgs(m => [...m, { who: "user", text: t }]);
    historyRef.current.push({ role: "user", content: t });
    setMsgs(m => [...m, { who: "ai", thinking: true, text: "Finding the best picks for you…" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });
      const data = await res.json();

      setMsgs(m => [
        ...m.filter(x => !x.thinking),
        { who: "ai", text: data.text, productIds: data.productIds ?? [] },
      ]);

      historyRef.current.push({ role: "assistant", content: data.text });
    } catch {
      setMsgs(m => [...m.filter(x => !x.thinking), { who: "ai", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const total = picked.reduce((s, id) => s + (byId(id)?.price || 0), 0);
  const shopsCount = new Set(picked.map(id => byId(id)?.shop).filter(Boolean)).size;

  const goCart = () => {
    picked.forEach(id => addToCart(id, 1));
    router.push("/cart");
  };

  return (
    <div style={{ height: "calc(100vh - 68px)", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* Top bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", flex: "0 0 auto" }}>
        <div className="container row" style={{ height: 60, justifyContent: "space-between" }}>
          <div className="row gap-12">
            <button onClick={() => router.push("/")} style={{ color: "var(--text-secondary)" }}><I.chevleft size={22} /></button>
            <div className="row gap-8">
              <Spark size={20} style={{ color: "var(--green)" }} className="spark-anim" />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, lineHeight: 1.1 }}>Celeste Assistant</div>
                <div className="t-detail" style={{ fontSize: 11.5 }}>Your AI-powered shopping companion</div>
              </div>
            </div>
          </div>
          <div className="row gap-10">
            {picked.length > 0 && <span className="badge badge-verified">{picked.length} items ready</span>}
            <span className="badge badge-verified">
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--success)", display: "inline-block" }} /> Live
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", minHeight: 0 }} className="assistant-grid">

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, borderRight: "1px solid var(--border)" }}>
          <div ref={scrollRef} className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "28px 0" }}>
            <div className="container" style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 18 }}>
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} onAddProduct={addProduct} onAddAll={addAll} />
              ))}

              {msgs.length === 1 && (
                <div className="col gap-8" style={{ marginTop: 8 }}>
                  <span className="t-detail" style={{ marginBottom: 2 }}>Try one of these</span>
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => send(s)} className="card"
                      style={{ textAlign: "left", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <Spark size={16} style={{ color: "var(--green)", flex: "0 0 auto" }} />
                      <span style={{ fontSize: 14.5, fontFamily: "var(--font-ui)", fontWeight: 500 }}>{s}</span>
                      <I.arrowright size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "16px 0" }}>
            <div className="container" style={{ maxWidth: 720 }}>
              <form onSubmit={e => { e.preventDefault(); send(); }} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 16, color: "var(--green)" }}><Spark size={18} /></span>
                <input className="input" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Message Celeste…" disabled={loading}
                  style={{ height: 52, paddingLeft: 44, paddingRight: 60, borderRadius: 999 }} />
                <button type="submit" className="btn btn-primary"
                  disabled={loading || !input.trim()}
                  style={{ position: "absolute", right: 8, width: 40, height: 40, padding: 0, borderRadius: 999, opacity: loading ? 0.6 : 1 }}>
                  {loading ? <span className="dots-typing"><i /><i /><i /></span> : <I.send size={17} />}
                </button>
              </form>
              <div className="t-detail" style={{ textAlign: "center", marginTop: 8, fontSize: 11.5 }}>
                Celeste AI · Click any product to view details
              </div>
            </div>
          </div>
        </div>

        {/* Cart panel */}
        <aside style={{ background: "var(--surface)", display: "flex", flexDirection: "column", minHeight: 0 }} className="assistant-cart hide-mobile">
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
            <div className="row gap-8">
              <I.cart size={18} style={{ color: "var(--green)" }} />
              <b style={{ fontFamily: "var(--font-ui)", fontSize: 15 }}>Assistant cart</b>
              {picked.length > 0 && <AIChip label="AI curated" style={{ marginLeft: "auto" }} />}
            </div>
          </div>

          <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {picked.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", color: "var(--text-muted)", gap: 10, padding: 20 }}>
                <Spark size={28} className="spark-anim" style={{ color: "var(--green)" }} />
                <span className="t-detail">Click "Add" on any product<br/>the AI recommends to build your set.</span>
              </div>
            ) : (
              <div className="col gap-10">
                {picked.map(id => (
                  <CartItem key={id} id={id} onRemove={() => setPicked(p => p.filter(x => x !== id))} />
                ))}
              </div>
            )}
          </div>

          {picked.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border)", padding: 18 }} className="fade-in">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <span className="t-detail">{picked.length} items · {shopsCount} shop{shopsCount !== 1 ? "s" : ""}</span>
                <button className="t-detail" style={{ color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setPicked([])}>Clear all</button>
              </div>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
                <b style={{ fontFamily: "var(--font-ui)", fontSize: 16 }}>Total</b>
                <b style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green)" }}>{money(total)}</b>
              </div>
              <button className="btn btn-primary btn-block btn-lg" onClick={goCart}>
                Checkout <I.arrowright size={17} />
              </button>
              <button className="btn btn-secondary btn-block" style={{ marginTop: 8 }}
                onClick={() => { picked.forEach(id => addToCart(id, 1)); }}>
                Add all to cart
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
