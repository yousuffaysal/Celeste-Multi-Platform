"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import Ph from "@/components/Ph";
import { byId, shopOf, money } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const SUGGESTED = [
  "Help me set up a calm home office under $400",
  "Build a coffee corner for a small kitchen",
  "I need gifts for a housewarming under $200",
  "Warm up my living room with lighting and textiles",
];

interface Message {
  who: "user" | "ai";
  text?: string;
  thinking?: boolean;
}

function Bubble({ m }: { m: Message }) {
  if (m.who === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "78%", background: "var(--green)", color: "#fff", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: 15, lineHeight: 1.55 }} className="fade-in">
        {m.text}
      </div>
    );
  }
  return (
    <div className="fade-in" style={{ display: "flex", gap: 12, maxWidth: "84%" }}>
      <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
        <Spark size={17} style={{ color: "var(--green)" }} className={m.thinking ? "spark-anim" : ""} />
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", fontSize: 15, color: m.thinking ? "var(--text-muted)" : "var(--text-primary)", lineHeight: 1.6 }}>
        {m.thinking ? (
          <span className="row gap-8">
            <span className="dots-typing"><i /><i /><i /></span>
            <span>{m.text}</span>
          </span>
        ) : m.text}
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [msgs, setMsgs] = useState<Message[]>([
    { who: "ai", text: "Hi, I'm Celeste. Tell me what you're trying to do — a room to furnish, a gift to find, a vibe to create — and I'll build the perfect set across our shops." },
  ]);
  const [picked, setPicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Conversation history sent to Groq
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, picked]);

  const send = async (text?: string) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput("");
    setLoading(true);

    // Add user message to UI and history
    setMsgs(m => [...m, { who: "user", text: t }]);
    historyRef.current.push({ role: "user", content: t });

    // Show thinking indicator
    setMsgs(m => [...m, { who: "ai", thinking: true, text: "Finding the best picks for you…" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });

      const data = await res.json();

      // Remove thinking bubble, add real response
      setMsgs(m => [...m.filter(x => !x.thinking), { who: "ai", text: data.text }]);

      // Add assistant reply to history
      historyRef.current.push({ role: "assistant", content: data.text });

      // Add recommended products to cart panel
      if (data.productIds?.length) {
        setPicked(prev => {
          const existing = new Set(prev);
          const next = [...prev];
          (data.productIds as string[]).forEach((id: string) => {
            if (!existing.has(id) && byId(id)) next.push(id);
          });
          return next;
        });
      }
    } catch {
      setMsgs(m => [...m.filter(x => !x.thinking), { who: "ai", text: "Sorry, I ran into an issue. Please try again." }]);
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

  const removeItem = (id: string) => setPicked(p => p.filter(x => x !== id));

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
                <div className="t-detail" style={{ fontSize: 11.5 }}>Powered by Groq · llama-3.3-70b</div>
              </div>
            </div>
          </div>
          <div className="row gap-10">
            {picked.length > 0 && (
              <span className="badge badge-verified">{picked.length} items picked</span>
            )}
            <span className="badge badge-verified">
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--success)", display: "inline-block" }} /> Live
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", minHeight: 0 }} className="assistant-grid">

        {/* Chat column */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, borderRight: "1px solid var(--border)" }}>
          <div ref={scrollRef} className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "28px 0" }}>
            <div className="container" style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 18 }}>
              {msgs.map((m, i) => <Bubble key={i} m={m} />)}

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
              <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 16, color: "var(--green)" }}><Spark size={18} /></span>
                <input
                  className="input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Message Celeste…"
                  disabled={loading}
                  style={{ height: 52, paddingLeft: 44, paddingRight: 96, borderRadius: 999 }}
                />
                <div style={{ position: "absolute", right: 8, display: "flex", gap: 4 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !input.trim()}
                    style={{ width: 40, height: 40, padding: 0, borderRadius: 999, opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? <span className="dots-typing"><i /><i /><i /></span> : <I.send size={17} />}
                  </button>
                </div>
              </form>
              <div className="t-detail" style={{ textAlign: "center", marginTop: 8, fontSize: 11.5 }}>
                Celeste AI · Groq inference · Always double-check before buying
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

          <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {picked.length === 0 ? (
              <div className="col" style={{ alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", color: "var(--text-muted)", gap: 10, padding: 20 }}>
                <Spark size={28} className="spark-anim" style={{ color: "var(--green)" }} />
                <span className="t-detail">Items the AI picks will appear here — across every vendor.</span>
              </div>
            ) : (
              <div className="col gap-10">
                {picked.map((id) => {
                  const p = byId(id);
                  if (!p) return null;
                  return (
                    <div key={id} className="card fade-in row gap-12" style={{ padding: 10 }}>
                      <Ph label="" style={{ width: 54, height: 54, borderRadius: 10, flex: "0 0 auto" }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div className="t-detail" style={{ fontSize: 11.5 }}>{shopOf(p).name}</div>
                        <div className="pcard-price" style={{ fontSize: 14, marginTop: 2 }}>{money(p.price)}</div>
                      </div>
                      <button onClick={() => removeItem(id)} style={{ color: "var(--text-muted)", flex: "0 0 auto" }}>
                        <I.close size={15} />
                      </button>
                    </div>
                  );
                })}
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
                Add all to cart <I.arrowright size={17} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
