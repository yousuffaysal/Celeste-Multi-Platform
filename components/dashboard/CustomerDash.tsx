"use client";
import React from "react";
import { Spark, I } from "@/components/icons";
import { Pill, Panel, Kpi, Avatar, AICallout, DashHead, StatGrid, DashGrid } from "./DashComponents";
import { AreaChart, MiniRing, SegBar, CatList } from "./DashViz";
import { PayCard, QuickActions, TxnList } from "./DashPay";
import {
  SAVED_SETS, MY_ORDERS, TRACK_STEPS, ORDER_STATUS, TXN_CUSTOMER, SPEND_CATS, GOALS, PRODUCTS, money, byId, shopOf,
} from "@/lib/dash-data";
import Ph from "@/components/Ph";
import Stars from "@/components/Stars";
import ProductCard from "@/components/ProductCard";

export default function CustomerDash({ section, openAssistant }: { section: string; openAssistant: () => void }) {
  switch (section) {
    case "orders":    return <CustOrders />;
    case "sets":      return <CustSets openAssistant={openAssistant} />;
    case "wishlist":  return <CustWishlist />;
    case "assistant": return <CustAssistant openAssistant={openAssistant} />;
    case "account":   return <CustAccount />;
    default:          return <CustOverview openAssistant={openAssistant} />;
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

function CustOverview({ openAssistant }: { openAssistant: () => void }) {
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
              <button className="btn btn-ghost btn-sm" style={{ height: 28 }}><I.plus size={13} /> Add card</button>
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

function CustAccount() {
  return (
    <div>
      <DashHead title="Account" subtitle="Profile, cards, addresses & payment" />
      <div className="dash-bento">
        <div className="col gap-16">
          <Panel title="Profile">
            <div className="row gap-14" style={{ marginBottom: 18 }}>
              <Avatar name="Alex Morgan" size={56} />
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16 }}>Alex Morgan</div>
                <div className="t-detail">alex@email.com · Member since 2022</div>
              </div>
            </div>
            <div className="col gap-14">
              <div><label className="field-label">Full name</label><input className="input" defaultValue="Alex Morgan" /></div>
              <div><label className="field-label">Email</label><input className="input" defaultValue="alex@email.com" /></div>
              <div><label className="field-label">Phone</label><input className="input" defaultValue="(555) 012-3456" /></div>
              <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Save changes</button>
            </div>
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
        <div className="col gap-16">
          <Panel title="Payment methods" action={<button className="btn btn-ghost btn-sm"><I.plus size={14} /> Add card</button>}>
            <div className="col gap-16">
              <PayCard brand="visa" variant="green" label="Default · debit" name="Alex Morgan" number="4242" exp="03/30" />
              <PayCard brand="mastercard" variant="dark" label="Credit card" name="Alex Morgan" number="8819" exp="07/27" />
            </div>
            <div className="col" style={{ marginTop: 8 }}>
              {([["Visa","4242",true],["Mastercard","8819",false]] as [string,string,boolean][]).map(([brand,last,def],i) => (
                <div key={i} className="row gap-12" style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                  <I.card size={18} style={{ color: "var(--green)", flex: "0 0 auto" }} />
                  <div style={{ flex: 1 }}>
                    <span className="row gap-8">
                      <b style={{ fontFamily: "var(--font-ui)", fontSize: 13.5 }}>{brand} ···· {last}</b>
                      {def && <Pill tone="success">Default</Pill>}
                    </span>
                  </div>
                  <button style={{ color: "var(--text-muted)" }}><I.more size={16} /></button>
                </div>
              ))}
            </div>
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
