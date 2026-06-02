"use client";
import React, { useState } from "react";
import { Spark, I } from "@/components/icons";
import { Pill, Panel, Kpi, Avatar, AICallout, DashHead, StatGrid, DashGrid } from "./DashComponents";
import { AreaChart, MiniRing, SegBar, CatList } from "./DashViz";
import { PayCard, QuickActions, TxnList, BrandMark, CardBrand } from "./DashPay";
import {
  SAVED_SETS, MY_ORDERS, TRACK_STEPS, ORDER_STATUS, TXN_CUSTOMER, SPEND_CATS, GOALS, PRODUCTS, money, byId, shopOf,
} from "@/lib/dash-data";
import Ph from "@/components/Ph";
import Stars from "@/components/Stars";
import ProductCard from "@/components/ProductCard";

export default function CustomerDash({ section, openAssistant, goSection, onNameChange }: { section: string; openAssistant: () => void; goSection: (s: string) => void; onNameChange?: (name: string) => void }) {
  switch (section) {
    case "orders":    return <CustOrders />;
    case "sets":      return <CustSets openAssistant={openAssistant} />;
    case "wishlist":  return <CustWishlist />;
    case "assistant": return <CustAssistant openAssistant={openAssistant} />;
    case "account":   return <CustAccount onNameChange={onNameChange} />;
    default:          return <CustOverview openAssistant={openAssistant} goSection={goSection} />;
  }
}

const TrackBar = ({ step }: { step: number }) => (
  <div className="row" style={{ gap: 0 }}>
    {TRACK_STEPS.map((s, i) => (
      <React.Fragment key={s}>
        <div className="col" style={{ alignItems: "center", gap: 5, flex: "0 0 auto" }}>
          <span style={{ width: 22, height: 22, borderRadius: 99,
            background: i <= step ? "var(--green)" : "var(--surface-2)",
            color: i <= step ? "#fff" : "var(--text-muted)", display: "grid", placeItems: "center", fontSize: 11 }}>
            {i < step ? <I.check size={12} /> : i === step ? <span style={{ width: 7, height: 7, borderRadius: 99, background: "#fff" }} /> : i + 1}
          </span>
          <span style={{ fontSize: 10.5, fontFamily: "var(--font-ui)", fontWeight: 500, color: i <= step ? "var(--text-primary)" : "var(--text-muted)" }}>{s}</span>
        </div>
        {i < TRACK_STEPS.length - 1 && (
          <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "var(--border)", marginTop: -16 }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const SetCard = ({ s }: { s: typeof SAVED_SETS[number] }) => (
  <div className="card" style={{ padding: 14, cursor: "pointer" }}>
    <div className="row gap-8" style={{ marginBottom: 10 }}>
      <Spark size={15} style={{ color: "var(--green)" }} />
      <b style={{ fontFamily: "var(--font-ui)", fontSize: 14, flex: 1 }}>{s.name}</b>
    </div>
    <div className="row gap-6" style={{ marginBottom: 12 }}>
      {s.items.slice(0,4).map(id => <Ph key={id} label="" style={{ flex: 1, aspectRatio: "1/1", borderRadius: 8 }} />)}
    </div>
    <div className="row" style={{ justifyContent: "space-between" }}>
      <span className="t-detail" style={{ fontSize: 12 }}>{s.items.length} items · {s.shops} shops</span>
      <b style={{ fontFamily: "var(--font-ui)", color: "var(--green)" }}>{money(s.total)}</b>
    </div>
    <button className="btn btn-secondary btn-sm btn-block" style={{ marginTop: 12 }}><I.cart size={14} /> Add set to cart</button>
  </div>
);

function CustOverview({ openAssistant, goSection }: { openAssistant: () => void; goSection: (s: string) => void }) {
  return (
    <div>
      <DashHead title="Hello, Alex" subtitle="Here's what's happening with your orders and picks"
        actions={<button className="btn btn-primary btn-sm" onClick={openAssistant}><Spark size={15} /> Ask the assistant</button>} />

      <div className="dash-bento">
        <div>
          <StatGrid style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Kpi label="Active orders" value="2" icon={I.truck} />
            <Kpi label="Saved AI sets" value={SAVED_SETS.length} icon={I.heartset} accent />
            <Kpi label="Wishlist items" value="9" icon={I.heart} />
            <Kpi label="Celeste credit" value="$24" icon={I.wallet} />
          </StatGrid>

          <Panel title="Track your orders" style={{ marginTop: 16 }} action={<a className="seeall" style={{ fontSize: 13 }}>All orders <I.arrowright size={14} /></a>}>
            <div className="col gap-18">
              {MY_ORDERS.filter(o => o.status !== "delivered").map(o => (
                <div key={o.id} style={{ paddingBottom: 4 }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                    <div className="row gap-10">
                      <div className="row" style={{ marginLeft: -4 }}>
                        {o.items.slice(0,2).map((id, k) => <Ph key={id} label="" style={{ width: 40, height: 40, borderRadius: 8, marginLeft: k ? -10 : 0, border: "2px solid #fff" }} />)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap" }}>{o.id}</div>
                        <div className="t-detail" style={{ fontSize: 12 }}>{o.vendor} · {money(o.total)}</div>
                      </div>
                    </div>
                    <Pill tone={o.status === "shipped" ? "info" : "warning"} dot>{ORDER_STATUS[o.status].label} · {o.eta}</Pill>
                  </div>
                  <TrackBar step={o.step} />
                </div>
              ))}
            </div>
          </Panel>

          <DashGrid cols="1fr 1fr" style={{ marginTop: 16, gap: 16 }}>
            <Panel title="Spend by category" action={<div className="rng-toggle"><button className="rng-btn active">30d</button><button className="rng-btn">90d</button></div>}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, letterSpacing: "-.5px", marginBottom: 12 }}>$1,284</div>
              <SegBar segments={SPEND_CATS} />
              <CatList segments={SPEND_CATS} />
            </Panel>
            <Panel title="Saving goals" ai action={<button className="btn btn-ghost btn-sm" style={{ height: 28 }}><I.plus size={13} /> Add</button>}>
              <div className="col gap-16">
                {GOALS.map((g, i) => (
                  <div key={i} className="row gap-12" style={{ alignItems: "center" }}>
                    <MiniRing value={Math.round(g.saved / g.target * 100)} size={52} sw={6} color={g.color}>
                      {Math.round(g.saved / g.target * 100)}
                    </MiniRing>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5 }}>{g.name}</div>
                      <div className="t-detail" style={{ fontSize: 12 }}>${g.saved} <span className="dim">of ${g.target}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </DashGrid>
        </div>

        <div className="col gap-16">
          <Panel pad={18}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div className="t-detail">Celeste wallet</div>
              <button className="btn btn-ghost btn-sm" style={{ height: 28 }} onClick={() => goSection("account")}><I.plus size={13} /> Add card</button>
            </div>
            <PayCard brand="visa" variant="green" label="Celeste balance" name="Alex Morgan" number="7890" exp="03/30" />
            <div style={{ marginTop: 16 }}>
              <QuickActions actions={[
                { icon: I.topup, label: "Top up" }, { icon: I.send, label: "Send" },
                { icon: I.gift, label: "Gift" }, { icon: I.history, label: "History" }, { icon: I.more, label: "More" },
              ]} />
            </div>
          </Panel>
          <Panel title="Recent transactions" action={<a className="seeall" style={{ fontSize: 13 }}>All <I.arrowright size={14} /></a>}>
            <TxnList rows={TXN_CUSTOMER} />
          </Panel>
          <Panel title="Picked for you" ai action={<a className="seeall" style={{ fontSize: 13 }}>More <I.arrowright size={14} /></a>}>
            <div className="col gap-12">
              {PRODUCTS.slice(0,3).map((p, i) => (
                <div key={p.id} className="row gap-12" style={{ padding: "8px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <Ph label="" style={{ width: 44, height: 44, borderRadius: 8, flex: "0 0 auto" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div className="pcard-price" style={{ fontSize: 13 }}>{money(p.price)}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm btn-icon"><I.plus size={14} /></button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Panel title="Your saved AI sets" ai action={<a className="seeall" style={{ fontSize: 13 }}>Manage sets <I.arrowright size={14} /></a>}>
          <div className="set-grid">
            {SAVED_SETS.map((s, i) => <SetCard key={i} s={s} />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CustOrders() {
  return (
    <div>
      <DashHead title="Your orders" subtitle="Track, return, or reorder" />
      <div className="row gap-8" style={{ marginBottom: 18, flexWrap: "wrap" }}>
        {["All","In progress","Delivered","Returns"].map((s,i) => (
          <button key={s} className={"chip"+(i===0?" active":"")}>{s}</button>
        ))}
      </div>
      <div className="col gap-16">
        {MY_ORDERS.map(o => (
          <Panel key={o.id} pad={20}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div className="row gap-8">
                  <b style={{ fontFamily: "var(--font-ui)", fontSize: 15, whiteSpace: "nowrap" }}>{o.id}</b>
                  <Pill tone={o.status === "delivered" ? "success" : o.status === "shipped" ? "info" : "warning"} dot>{ORDER_STATUS[o.status].label}</Pill>
                </div>
                <div className="t-detail" style={{ marginTop: 3 }}>{o.vendor} · {o.eta}</div>
              </div>
              <div className="row gap-8">
                <button className="btn btn-secondary btn-sm">Track</button>
                <button className="btn btn-secondary btn-sm">Reorder</button>
              </div>
            </div>
            <div className="row gap-12" style={{ flexWrap: "wrap" }}>
              {o.items.map(id => {
                const p = byId(id);
                return p ? (
                  <div key={id} className="row gap-10" style={{ flex: "1 1 240px", minWidth: 0 }}>
                    <Ph label="" style={{ width: 56, height: 56, borderRadius: 10, flex: "0 0 auto" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div className="t-detail">{shopOf(p).name}</div>
                      <div className="pcard-price" style={{ fontSize: 13 }}>{money(p.price)}</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <TrackBar step={o.step} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function CustSets({ openAssistant }: { openAssistant: () => void }) {
  return (
    <div>
      <DashHead title="Saved AI sets" subtitle="Curated collections built by your assistant"
        actions={<button className="btn btn-primary btn-sm" onClick={openAssistant}><Spark size={15} /> Build a new set</button>} />
      <AICallout>
        Your assistant builds <b>cross-vendor sets</b> from a single request — save them here, tweak anytime, and add the whole set to your cart in one tap.
      </AICallout>
      <div className="set-grid" style={{ marginTop: 18 }}>
        {[...SAVED_SETS, SAVED_SETS[0]].map((s, i) => <SetCard key={i} s={s} />)}
      </div>
    </div>
  );
}

function CustWishlist() {
  const items = PRODUCTS.slice(2, 11);
  return (
    <div>
      <DashHead title="Wishlist" subtitle={items.length + " saved items · 2 dropped in price"} />
      <AICallout action={<button className="btn btn-primary btn-sm" style={{ flex: "0 0 auto" }}>View</button>}>
        <b style={{ fontFamily: "var(--font-ui)" }}>Good news:</b> 2 items on your wishlist just dropped in price, and 1 is low in stock.
      </AICallout>
      <div className="pgrid" style={{ marginTop: 18 }}>
        {items.map((p, i) => <ProductCard key={p.id} p={i % 4 === 0 ? { ...p, tag: "deal" } : p} />)}
      </div>
    </div>
  );
}

function CustAssistant({ openAssistant }: { openAssistant: () => void }) {
  return (
    <div>
      <DashHead title="AI Assistant" subtitle="Your shopping conversations & recommendations" />
      <DashGrid cols="1.3fr 1fr">
        <Panel title="Recent conversations" ai action={<button className="btn btn-primary btn-sm" onClick={openAssistant}><Spark size={14} /> New chat</button>}>
          <div className="col gap-12">
            {[
              { t: "Set up a calm home office under $400", d: "Built a 4-item set · 3 shops", date: "May 24" },
              { t: "Gift ideas for a coffee lover",         d: "Suggested 6 items",             date: "May 18" },
              { t: "Warm lighting for a small living room", d: "Built a 3-item set · 2 shops", date: "May 10" },
            ].map((c, i) => (
              <div key={i} className="row gap-12" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none", cursor: "pointer" }} onClick={openAssistant}>
                <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                  <I.chat size={17} style={{ color: "var(--green)" }} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5 }}>{c.t}</div>
                  <div className="t-detail" style={{ fontSize: 12 }}>{c.d}</div>
                </div>
                <span className="t-detail" style={{ fontSize: 11.5 }}>{c.date}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Your shopping profile" ai>
          <p className="t-detail" style={{ marginBottom: 14 }}>What the assistant has learned about your taste.</p>
          <div className="row gap-8" style={{ flexWrap: "wrap", marginBottom: 16 }}>
            {["calm & minimal","warm wood tones","under $250 avg","verified shops","fast shipping"].map(t => (
              <span key={t} className="chip" style={{ height: 30 }}><Spark size={12} style={{ color: "var(--green)" }} /> {t}</span>
            ))}
          </div>
          <AICallout action={undefined}>Based on your sets, you might love the new <b>Mori Ceramics</b> spring drop.</AICallout>
        </Panel>
      </DashGrid>
    </div>
  );
}

/* ── Types ── */
interface SavedCard {
  id: string;
  brand: CardBrand;
  variant: "green" | "dark" | "yellow";
  number: string;
  name: string;
  exp: string;
  isDefault: boolean;
}

const CARD_VARIANTS: Array<"green" | "dark" | "yellow"> = ["green", "dark", "yellow"];

const CARD_BRANDS: Array<{ id: CardBrand; label: string }> = [
  { id: "visa",       label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex",       label: "Amex" },
  { id: "discover",   label: "Discover" },
  { id: "maestro",    label: "Maestro" },
];

function detectBrand(num: string): CardBrand {
  const first = num.replace(/\s/g, "")[0];
  if (first === "3") return "amex";
  if (first === "4") return "visa";
  if (first === "5") return "mastercard";
  if (first === "6") return "discover";
  return "visa";
}

/* ── Stacked card wallet ── */
function CardStack({
  cards, activeId, onSelect, onSetDefault, onRemove,
}: {
  cards: SavedCard[];
  activeId: string;
  onSelect: (id: string) => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const active = cards.find(c => c.id === activeId) ?? cards[0];
  const others = cards.filter(c => c.id !== activeId);

  return (
    <div className="col" style={{ gap: 0 }}>
      {/* ── Active card — fully expanded ── */}
      <div style={{ transition: "all .3s cubic-bezier(.4,0,.2,1)" }}>
        <PayCard
          brand={active.brand}
          variant={active.variant}
          label={active.isDefault ? "Default · debit" : "Credit card"}
          name={active.name}
          number={active.number}
          exp={active.exp}
        />
        {/* Active card actions */}
        <div className="row gap-8" style={{ marginTop: 10, marginBottom: others.length ? 4 : 0 }}>
          {!active.isDefault && (
            <button onClick={() => onSetDefault(active.id)}
              style={{ height: 28, padding: "0 12px", borderRadius: 99, fontSize: 12,
                fontFamily: "var(--font-ui)", fontWeight: 600, cursor: "pointer",
                background: "var(--green-tint)", color: "var(--green)", border: "1px solid rgba(1,97,78,.15)" }}>
              Set as default
            </button>
          )}
          {active.isDefault && (
            <span style={{ height: 28, padding: "0 12px", borderRadius: 99, fontSize: 12,
              fontFamily: "var(--font-ui)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5,
              background: "var(--green-tint)", color: "var(--green)" }}>
              <I.check size={12} /> Default card
            </span>
          )}
          {cards.length > 1 && (
            <button onClick={() => onRemove(active.id)}
              style={{ height: 28, padding: "0 12px", borderRadius: 99, fontSize: 12,
                fontFamily: "var(--font-ui)", fontWeight: 600, cursor: "pointer",
                background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)",
                display: "inline-flex", alignItems: "center", gap: 5 }}>
              <I.trash size={12} /> Remove
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsed cards — strip only ── */}
      {others.map((c) => {
        const gradients: Record<string, string> = {
          green:  "linear-gradient(135deg, #01614E 0%, #014A3B 60%, #003B2F 100%)",
          dark:   "linear-gradient(135deg, #1b2622 0%, #11201B 100%)",
          yellow: "linear-gradient(135deg, #FBE249 0%, #F2D21F 100%)",
        };
        const bg  = gradients[c.variant] ?? gradients.dark;
        const fg  = c.variant === "yellow" ? "rgba(0,59,47,.8)"  : "rgba(255,255,255,.85)";
        const sub = c.variant === "yellow" ? "rgba(0,59,47,.5)"  : "rgba(255,255,255,.5)";
        const masked = c.brand === "amex"
          ? `•••• •••••• ${c.number}`
          : `•••• •••• •••• ${c.number}`;
        return (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              background: bg, borderRadius: 14, padding: "11px 18px", marginTop: 6,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              transition: "transform .15s, box-shadow .15s",
              boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,.12)"; }}
          >
            <span style={{ display: "inline-flex", minWidth: 38, transform: "scale(.8)", transformOrigin: "left center" }}>
              <BrandMark brand={c.brand} color={fg} />
            </span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, letterSpacing: "1.5px", color: fg, flex: 1 }}>
              {masked}
            </span>
            <span style={{ fontSize: 12, color: sub, fontFamily: "var(--font-ui)" }}>{c.exp}</span>
            <I.chevdown size={14} style={{ color: sub, flexShrink: 0 }} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Add card form ── */
function AddCardForm({ onAdd, onCancel }: { onAdd: (c: Omit<SavedCard, "id" | "isDefault">) => void; onCancel: () => void }) {
  const [brand,   setBrand]   = useState<CardBrand>("visa");
  const [num,     setNum]     = useState("");
  const [name,    setName]    = useState("");
  const [exp,     setExp]     = useState("");
  const [cvv,     setCvv]     = useState("");
  const [variant, setVariant] = useState<"green" | "dark" | "yellow">("dark");
  const [formErr, setFormErr] = useState("");

  const isAmex  = brand === "amex";
  const maxLen  = isAmex ? 17 : 19; // "3782 822463 10005" vs "4111 1111 1111 1111"
  const cvvLen  = isAmex ? 4 : 3;
  const numPh   = isAmex ? "3782 822463 10005" : "1234 5678 9012 3456";

  const fmt4 = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (isAmex) {
      // Amex: 4-6-5
      const p1 = d.slice(0, 4);
      const p2 = d.slice(4, 10);
      const p3 = d.slice(10, 15);
      return [p1, p2, p3].filter(Boolean).join(" ");
    }
    return d.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  /* Auto-detect brand from number prefix when user types */
  function handleNumChange(raw: string) {
    const formatted = fmt4(raw);
    setNum(formatted);
    const first = raw.replace(/\D/g, "")[0];
    if (first === "3") setBrand("amex");
    else if (first === "4") setBrand("visa");
    else if (first === "5") setBrand("mastercard");
    else if (first === "6") setBrand("discover");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = num.replace(/\s/g, "");
    const minLen = isAmex ? 15 : 16;
    if (clean.length < minLen) { setFormErr(`Enter a valid ${brand} card number`); return; }
    if (!name.trim())          { setFormErr("Enter the cardholder name"); return; }
    if (exp.length < 5)        { setFormErr("Enter a valid expiry MM/YY"); return; }
    if (cvv.length < cvvLen)   { setFormErr(`Enter a valid ${isAmex ? "4-digit" : "3-digit"} CVV`); return; }
    setFormErr("");
    onAdd({ brand, variant, number: clean.slice(-4), name: name.trim(), exp });
  }

  return (
    <div style={{ background: "var(--surface-2)", borderRadius: 14, padding: "18px 18px 16px", border: "1px solid var(--border)" }}>
      <form className="col gap-12" onSubmit={submit}>

        {/* ── Brand picker ── */}
        <div>
          <label className="field-label">Card network</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {CARD_BRANDS.map(b => (
              <button key={b.id} type="button" onClick={() => { setBrand(b.id); setNum(""); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  height: 36, padding: "0 12px", borderRadius: 10, cursor: "pointer",
                  background: brand === b.id ? "var(--green)" : "var(--surface)",
                  border: `1.5px solid ${brand === b.id ? "var(--green)" : "var(--border)"}`,
                  transition: "all .14s",
                }}>
                <span style={{ display: "inline-flex", transform: "scale(.75)", transformOrigin: "left center" }}>
                  <BrandMark brand={b.id} color={brand === b.id ? "#fff" : "var(--text-secondary)"} />
                </span>
                <span style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", fontWeight: 600,
                  color: brand === b.id ? "#fff" : "var(--text-secondary)" }}>
                  {b.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Card fields ── */}
        <div><label className="field-label">Card number</label>
          <input className="input" placeholder={numPh} value={num} autoFocus
            onChange={e => handleNumChange(e.target.value)} maxLength={maxLen} inputMode="numeric" /></div>
        <div><label className="field-label">Cardholder name</label>
          <input className="input" placeholder="Alex Morgan" value={name}
            onChange={e => setName(e.target.value)} /></div>
        <div className="row gap-12">
          <div style={{ flex: 1 }}><label className="field-label">Expiry</label>
            <input className="input" placeholder="MM/YY" value={exp}
              onChange={e => setExp(fmtExp(e.target.value))} maxLength={5} inputMode="numeric" /></div>
          <div style={{ flex: 1 }}>
            <label className="field-label">CVV {isAmex && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(4 digits)</span>}</label>
            <input className="input" type="password" placeholder={isAmex ? "••••" : "•••"} value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, isAmex ? 4 : 3))} maxLength={isAmex ? 4 : 3} inputMode="numeric" /></div>
        </div>

        {/* ── Live card preview ── */}
        <PayCard brand={brand} variant={variant}
          label="Preview"
          name={name || "Cardholder Name"}
          number={num.replace(/\s/g, "").slice(-4) || "0000"}
          exp={exp || "MM/YY"} />

        {/* ── Card style picker ── */}
        <div className="row gap-8" style={{ alignItems: "center" }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>Card style:</span>
          {CARD_VARIANTS.map(v => (
            <button key={v} type="button" onClick={() => setVariant(v)} style={{
              height: 26, padding: "0 12px", borderRadius: 99, fontSize: 12,
              fontFamily: "var(--font-ui)", fontWeight: 600, cursor: "pointer",
              background: variant === v ? "var(--green)" : "var(--surface)",
              color: variant === v ? "#fff" : "var(--text-secondary)",
              border: `1.5px solid ${variant === v ? "var(--green)" : "var(--border)"}`,
            }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {formErr && <div style={{ fontSize: 12.5, color: "var(--error)", fontFamily: "var(--font-ui)" }}>{formErr}</div>}
        <div className="row gap-10">
          <button type="submit" className="btn btn-primary btn-sm">Add card</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── localStorage helpers (SSR-safe) ── */
function lsGet(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}
function lsGetJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

const DEFAULT_CARDS: SavedCard[] = [
  { id: "c1", brand: "visa",       variant: "green", number: "4242", name: "Alex Morgan", exp: "03/30", isDefault: true  },
  { id: "c2", brand: "mastercard", variant: "dark",  number: "8819", name: "Alex Morgan", exp: "07/27", isDefault: false },
];


/* ── Account section ── */
function CustAccount({ onNameChange }: { onNameChange?: (name: string) => void }) {
  /* Saved (displayed) values — only update after Save */
  const [dispName,  setDispName]  = useState(() => lsGet("cel_profile_name",  "Alex Morgan"));
  const [dispEmail, setDispEmail] = useState(() => lsGet("cel_profile_email", "alex@email.com"));

  /* Editing (form) values — update on every keystroke */
  const [pName,  setPName]  = useState(() => lsGet("cel_profile_name",  "Alex Morgan"));
  const [pEmail, setPEmail] = useState(() => lsGet("cel_profile_email", "alex@email.com"));
  const [pPhone, setPPhone] = useState(() => lsGet("cel_profile_phone", "(555) 012-3456"));
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const name  = pName.trim()  || "Alex Morgan";
    const email = pEmail.trim() || "alex@email.com";
    localStorage.setItem("cel_profile_name",  name);
    localStorage.setItem("cel_profile_email", email);
    localStorage.setItem("cel_profile_phone", pPhone.trim());
    setDispName(name);
    setDispEmail(email);
    onNameChange?.(name);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 400);
  }

  /* Cards — hydrate from localStorage */
  const [cards, setCards] = useState<SavedCard[]>(() =>
    lsGetJSON<SavedCard[]>("cel_cards", DEFAULT_CARDS)
  );
  const [activeCardId, setActiveCardId] = useState<string>(() => {
    const saved = lsGetJSON<SavedCard[]>("cel_cards", DEFAULT_CARDS);
    return saved.find(c => c.isDefault)?.id ?? saved[0]?.id ?? "c1";
  });
  const [showForm, setShowForm] = useState(false);

  /* Persist cards whenever they change */
  function persistCards(next: SavedCard[]) {
    setCards(next);
    localStorage.setItem("cel_cards", JSON.stringify(next));
  }

  function addCard(data: Omit<SavedCard, "id" | "isDefault">) {
    const id = "c" + Date.now();
    const next = [...cards, { ...data, id, isDefault: false }];
    persistCards(next);
    setActiveCardId(id);
    setShowForm(false);
  }

  function removeCard(id: string) {
    const next = cards.filter(c => c.id !== id);
    if (cards.find(c => c.id === id)?.isDefault && next.length) next[0].isDefault = true;
    persistCards(next);
    setActiveCardId(prev => prev === id ? (next[0]?.id ?? "") : prev);
  }

  function setDefault(id: string) {
    persistCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
  }

  return (
    <div>
      <DashHead title="Account" subtitle="Profile, cards, addresses & payment" />
      <div className="dash-bento">

        {/* Left column */}
        <div className="col gap-16">
          <Panel title="Profile">
            <div className="row gap-14" style={{ marginBottom: 18 }}>
              <Avatar name={dispName} size={56} />
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16 }}>{dispName}</div>
                <div className="t-detail">{dispEmail} · Member since 2022</div>
              </div>
            </div>
            <form className="col gap-14" onSubmit={handleSave}>
              <div><label className="field-label">Full name</label>
                <input className="input" value={pName} onChange={e => setPName(e.target.value)} /></div>
              <div><label className="field-label">Email</label>
                <input className="input" type="email" value={pEmail} onChange={e => setPEmail(e.target.value)} /></div>
              <div><label className="field-label">Phone</label>
                <input className="input" value={pPhone} onChange={e => setPPhone(e.target.value)} /></div>
              {saved && (
                <div style={{ background: "var(--green-tint)", border: "1px solid rgba(1,97,78,.18)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <I.check size={15} style={{ color: "var(--green)", flex: "0 0 auto" }} />
                  <span style={{ fontSize: 13.5, color: "var(--green-deep)", fontFamily: "var(--font-ui)", fontWeight: 500 }}>Profile saved — changes are now showing.</span>
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>
          </Panel>

          <Panel title="Addresses" action={<button className="btn btn-ghost btn-sm"><I.plus size={14} /> Add</button>}>
            {([["Home","123 Linden Ave, Portland, OR 97201",true],["Work","500 Market St, Portland, OR 97204",false]] as [string,string,boolean][]).map(([t,a,def],i) => (
              <div key={i} className="row gap-12" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <I.pin size={18} style={{ color: "var(--green)", flex: "0 0 auto", marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div className="row gap-8"><b style={{ fontFamily: "var(--font-ui)", fontSize: 13.5 }}>{t}</b>{def && <Pill tone="success">Default</Pill>}</div>
                  <div className="t-detail" style={{ fontSize: 12.5 }}>{a}</div>
                </div>
                <button style={{ color: "var(--text-muted)" }}><I.edit size={16} /></button>
              </div>
            ))}
          </Panel>
        </div>

        {/* Right column */}
        <div className="col gap-16">
          <Panel
            title={`Payment methods (${cards.length})`}
            action={!showForm
              ? <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(true)}><I.plus size={14} /> Add card</button>
              : null}
          >
            {cards.length > 0 && !showForm && (
              <CardStack
                cards={cards}
                activeId={activeCardId}
                onSelect={id => setActiveCardId(id)}
                onSetDefault={setDefault}
                onRemove={removeCard}
              />
            )}

            {showForm && (
              <AddCardForm onAdd={addCard} onCancel={() => setShowForm(false)} />
            )}

            {cards.length === 0 && !showForm && (
              <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)" }}>
                <I.card size={32} style={{ opacity: .3, marginBottom: 10 }} />
                <div style={{ fontSize: 13.5, fontFamily: "var(--font-ui)" }}>No cards saved yet</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>
                  <I.plus size={14} /> Add your first card
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Celeste credit" ai pad={18}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32, color: "var(--green)" }}>$24.00</div>
                <div className="t-detail">Earned from reviews &amp; referrals</div>
              </div>
              <MiniRing value={62} size={72} color="var(--green)">62%</MiniRing>
            </div>
            <AICallout action={undefined}><b style={{ fontFamily: "var(--font-ui)" }}>$16 more</b> in credit unlocks free express shipping for a month.</AICallout>
          </Panel>
        </div>
      </div>
    </div>
  );
}
