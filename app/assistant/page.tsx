"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import Ph from "@/components/Ph";
import { byId, shopOf, money, Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const SUGGESTED = [
  "Help me set up a calm home office under $400",
  "Build a coffee corner for a small kitchen",
  "I need gifts for a housewarming",
];

interface ScriptStep {
  type: "thinking" | "say" | "add" | "summary";
  text?: string;
  id?: string;
}

const SCRIPT: { user: string; steps: ScriptStep[] } = {
  user: "Help me set up a calm home office under $400",
  steps: [
    { type: "thinking", text: "Understanding your space and budget…" },
    { type: "say", text: "Love this. For a calm, focused office I'd anchor on warm lighting, a tidy desk surface, and a little softness. Here's a set I pulled from 3 verified shops — all within $400 together:" },
    { type: "add", id: "p12" },
    { type: "add", id: "p4" },
    { type: "add", id: "p2" },
    { type: "add", id: "p9" },
    { type: "summary" },
  ],
};

interface Message {
  who: "user" | "ai";
  text?: string;
  thinking?: boolean;
  summary?: boolean;
}

interface BubbleProps {
  m: Message;
  total: number;
  shopsCount: number;
  count: number;
  onGoCart: () => void;
}

function Bubble({ m, total, shopsCount, count, onGoCart }: BubbleProps) {
  if (m.who === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "78%", background: "var(--green)", color: "#fff", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: 15 }} className="fade-in">
        {m.text}
      </div>
    );
  }
  if (m.summary) {
    return (
      <div className="fade-in" style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Spark size={17} style={{ color: "var(--green)" }} />
        </div>
        <div style={{ flex: 1, background: "var(--green)", color: "#fff", borderRadius: "4px 16px 16px 16px", padding: 18 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <b style={{ fontFamily: "var(--font-ui)", fontSize: 15 }}>Your set is ready</b>
            <span className="badge" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>{count} items · {shopsCount} shops</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--green-tint)", marginBottom: 14 }}>
            Everything coordinates and lands at <b style={{ color: "#fff" }}>{money(total)}</b> — comfortably under your $400 budget. One checkout, multiple vendors, one delivery promise.
          </p>
          <div className="row gap-8">
            <button className="btn btn-accent" onClick={onGoCart}>Review &amp; checkout</button>
            <button className="btn btn-ghost-white">Swap an item</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fade-in" style={{ display: "flex", gap: 12, maxWidth: "82%" }}>
      <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
        <Spark size={17} style={{ color: "var(--green)" }} className={m.thinking ? "spark-anim" : ""} />
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", fontSize: 15, color: m.thinking ? "var(--text-muted)" : "var(--text-primary)" }}>
        {m.thinking ? (
          <span className="row gap-8"><span className="dots-typing"><i></i><i></i><i></i></span> {m.text}</span>
        ) : m.text}
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [msgs, setMsgs] = useState<Message[]>([
    { who: "ai", text: "Hi, I'm Celeste. Tell me what you're trying to do — a room to furnish, a gift to find, a problem to solve — and I'll build the perfect set across our shops." },
  ]);
  const [picked, setPicked] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, picked]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const runScript = (userText: string) => {
    if (running) return;
    setRunning(true);
    setMsgs(m => [...m, { who: "user", text: userText }]);
    let t = 500;
    const push = (fn: () => void, dt: number) => { timers.current.push(setTimeout(fn, t)); t += dt; };

    SCRIPT.steps.forEach((step) => {
      if (step.type === "thinking") {
        push(() => setMsgs(m => [...m, { who: "ai", thinking: true, text: step.text }]), 1300);
      } else if (step.type === "say") {
        push(() => setMsgs(m => [...m.filter(x => !x.thinking), { who: "ai", text: step.text }]), 900);
      } else if (step.type === "add") {
        push(() => setPicked(p => [...p, step.id!]), 700);
      } else if (step.type === "summary") {
        push(() => { setMsgs(m => [...m, { who: "ai", summary: true }]); setRunning(false); }, 400);
      }
    });
  };

  const total = picked.reduce((s, id) => { const p = byId(id); return s + (p?.price || 0); }, 0);
  const shopsCount = new Set(picked.map(id => byId(id)?.shop).filter(Boolean)).size;

  const send = (text?: string) => {
    const t = text || input;
    if (!t.trim() || running) return;
    setInput("");
    runScript(t);
  };

  const goCart = () => {
    picked.forEach(id => addToCart(id, 1));
    router.push("/cart");
  };

  return (
    <div style={{ height: "calc(100vh - 68px)", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* top bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", flex: "0 0 auto" }}>
        <div className="container row" style={{ height: 60, justifyContent: "space-between" }}>
          <div className="row gap-12">
            <button onClick={() => router.push("/")} style={{ color: "var(--text-secondary)" }}><I.chevleft size={22} /></button>
            <div className="row gap-8">
              <Spark size={20} style={{ color: "var(--green)" }} className="spark-anim" />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, lineHeight: 1.1 }}>Celeste Assistant</div>
                <div className="t-detail" style={{ fontSize: 11.5 }}>Shops across every vendor for you</div>
              </div>
            </div>
          </div>
          <span className="badge badge-verified">
            <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--success)", display: "inline-block" }}></span> Online
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", minHeight: 0 }} className="assistant-grid">
        {/* chat column */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, borderRight: "1px solid var(--border)" }}>
          <div ref={scrollRef} className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "28px 0" }}>
            <div className="container" style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 18 }}>
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} total={total} shopsCount={shopsCount} count={picked.length} onGoCart={goCart} />
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

          {/* input */}
          <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "16px 0" }}>
            <div className="container" style={{ maxWidth: 720 }}>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 16, color: "var(--green)" }}><Spark size={18} /></span>
                <input className="input" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Message Celeste…"
                  style={{ height: 52, paddingLeft: 44, paddingRight: 96, borderRadius: 999 }} />
                <div style={{ position: "absolute", right: 8, display: "flex", gap: 4 }}>
                  <button type="button" style={{ width: 38, height: 38, borderRadius: 999, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
                    <I.camera size={19} />
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ width: 40, height: 40, padding: 0, borderRadius: 999 }}>
                    <I.send size={17} />
                  </button>
                </div>
              </form>
              <div className="t-detail" style={{ textAlign: "center", marginTop: 8, fontSize: 11.5 }}>
                Celeste can make mistakes. Check important details before buying.
              </div>
            </div>
          </div>
        </div>

        {/* working cart panel */}
        <aside style={{ background: "var(--surface)", display: "flex", flexDirection: "column", minHeight: 0 }} className="assistant-cart hide-mobile">
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
            <div className="row gap-8">
              <I.cart size={18} style={{ color: "var(--green)" }} />
              <b style={{ fontFamily: "var(--font-ui)", fontSize: 15 }}>Assistant cart</b>
              {picked.length > 0 && <AIChip label="building" style={{ marginLeft: "auto" }} />}
            </div>
          </div>
          <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {picked.length === 0 ? (
              <div className="col" style={{ alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", color: "var(--text-muted)", gap: 10, padding: 20 }}>
                <Spark size={28} className="spark-anim" style={{ color: "var(--green)" }} />
                <span className="t-detail">Items the assistant picks will appear here — across every vendor.</span>
              </div>
            ) : (
              <div className="col gap-12">
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {picked.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border)", padding: 18 }} className="fade-in">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <span className="t-detail">{picked.length} items · {shopsCount} shops</span>
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
