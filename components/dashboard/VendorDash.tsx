"use client";
import React, { useState } from "react";
import { Spark, I } from "@/components/icons";
import { TONE, Pill, Kpi, Panel, Table, Td, Avatar, AICallout, DashHead, StatGrid, DashGrid } from "./DashComponents";
import { RangeToggle, AreaChart, Gauge } from "./DashViz";
import { PayCard, QuickActions } from "./DashPay";
import { ORDERS, ORDER_STATUS, CAMPAIGNS, PAYOUTS, VENDOR_SERIES, spark, money, byShop, REVIEWS } from "@/lib/dash-data";
import Ph from "@/components/Ph";
import Stars from "@/components/Stars";

const myProducts = () => [...byShop("mori"), ...byShop("lumen").slice(0, 2)];
const myOrders = () => ORDERS.filter(o => o.vendor === "mori" || o.vendor === "lumen");

export default function VendorDash({ section }: { section: string }) {
  switch (section) {
    case "orders":   return <VendorOrders />;
    case "products": return <VendorProducts />;
    case "growth":   return <VendorGrowth />;
    case "reviews":  return <VendorReviews />;
    case "payouts":  return <VendorPayouts />;
    default:         return <VendorOverview />;
  }
}

function VendorOverview() {
  const [range, setRange] = useState("7d");
  const vs = VENDOR_SERIES[range];
  return (
    <div>
      <DashHead title="Welcome back, Mori Ceramics" subtitle="Here's how your shop is doing this week"
        actions={<><button className="btn btn-secondary btn-sm"><I.eye size={15} /> View storefront</button><button className="btn btn-accent btn-sm"><I.camera size={15} /> Snap & list</button></>} />

      <StatGrid style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Revenue" value="$4,820" delta="+18%" icon={I.wallet} spark={spark(0.3)} />
        <Kpi label="Orders" value="142" delta="+9%" icon={I.inbox} spark={spark(0.7)} />
        <Kpi label="Conversion" value="3.4%" delta="+0.6" icon={I.trendup} spark={spark(1.2)} />
        <Kpi label="Payout balance" value="$4,180" icon={I.wallet} accent />
      </StatGrid>

      <AICallout action={<button className="btn btn-primary btn-sm" style={{ flex: "0 0 auto" }}>Restock</button>}>
        <b style={{ fontFamily: "var(--font-ui)" }}>AI tip:</b> Your <b>Ceramic Pour-Over Set</b> is projected to sell out in <b>4 days</b>. Restocking now avoids ~$320 in missed sales.
      </AICallout>

      <div className="dash-bento" style={{ marginTop: 16 }}>
        <Panel title="Revenue" action={<div className="row gap-8"><Pill tone="success"><span className="row gap-4"><I.trendup size={12} /> +18%</span></Pill><RangeToggle value={range} onChange={setRange} /></div>}>
          <div className="row gap-24" style={{ marginBottom: 14, flexWrap: "wrap" }}>
            <div><div className="t-detail">This period</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.5px" }}>$4,820</div></div>
            <div><div className="t-detail">Avg order</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.5px" }}>$34</div></div>
          </div>
          <AreaChart series={vs.rev} labels={vs.labels} prefix="$" />
        </Panel>
        <Panel title="Orders to fulfill" action={<Pill tone="warning">{myOrders().filter(o => o.status === "new").length} new</Pill>}>
          <div className="col gap-12">
            {myOrders().slice(0,4).map((o, i) => (
              <div key={o.id} className="row" style={{ justifyContent: "space-between", padding: "8px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13 }}>{o.id}</div>
                  <div className="t-detail" style={{ fontSize: 11.5 }}>{o.customer} · {o.items} items</div>
                </div>
                <Pill tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Pill>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="dash-3col" style={{ marginTop: 16 }}>
        <Panel title="Best sellers">
          <div className="col gap-12">
            {myProducts().slice(0,4).map((p, i) => (
              <div key={p.id} className="row gap-12" style={{ padding: "8px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <span style={{ width: 18, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--text-muted)" }}>{i+1}</span>
                <Ph label="" style={{ width: 38, height: 38, borderRadius: 8, flex: "0 0 auto" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="t-detail" style={{ fontSize: 11 }}>{Math.round(40 - i*7)} sold</div>
                </div>
                <b style={{ fontFamily: "var(--font-ui)", color: "var(--green)", fontSize: 13 }}>{money(p.price)}</b>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Store health" ai>
          <div className="col gap-12">
            {([["On-time shipping",96,"success"],["Response rate",92,"success"],["Positive reviews",94,"success"],["Listing quality",81,"warning"]] as [string,number,string][]).map(([k,v,t]) => (
              <div key={k}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--font-ui)" }}>{k}</span>
                  <b style={{ fontFamily: "var(--font-ui)", color: TONE[t].fg }}>{v}%</b>
                </div>
                <div style={{ height: 7, background: "var(--surface-2)", borderRadius: 99 }}>
                  <div style={{ width: v+"%", height: "100%", background: TONE[t].fg, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Seller score" ai>
          <Gauge value={91} label="excellent" size={170} sub="Top 8% of Celeste sellers. Lift listing quality to reach Elite tier." />
        </Panel>
      </div>
    </div>
  );
}

function VendorOrders() {
  const [f, setF] = useState("all");
  const rows = f === "all" ? myOrders() : myOrders().filter(o => o.status === f);
  return (
    <div>
      <DashHead title="Orders" subtitle="Manage and fulfill your orders" />
      <StatGrid>
        <Kpi label="New" value={myOrders().filter(o=>o.status==="new").length} icon={I.inbox} accent />
        <Kpi label="To ship" value={myOrders().filter(o=>o.status==="packed").length} icon={I.box} />
        <Kpi label="In transit" value={myOrders().filter(o=>o.status==="shipped").length} icon={I.truck} />
        <Kpi label="Completed" value={myOrders().filter(o=>o.status==="delivered").length} icon={I.check} />
      </StatGrid>
      <div style={{ marginTop: 18 }}>
        <Panel title="All orders" pad={0} action={
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            {["all","new","packed","shipped","delivered"].map(s => (
              <button key={s} onClick={() => setF(s)} className={"chip"+(f===s?" active":"")} style={{ height: 30, textTransform: "capitalize" }}>{s}</button>
            ))}
          </div>}>
          <Table cols={[{ label: "Order" }, { label: "Customer" }, { label: "Items" }, { label: "Status" }, { label: "Date" }, { label: "Total", right: true }, { label: "", right: true }]}>
            {rows.map(o => (
              <tr key={o.id}>
                <Td><b style={{ fontFamily: "var(--font-ui)" }}>{o.id}</b></Td>
                <Td><span className="row gap-8"><Avatar name={o.customer} size={26} /> {o.customer}</span></Td>
                <Td><span className="dim">{o.items}</span></Td>
                <Td><Pill tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Pill></Td>
                <Td><span className="dim">{o.date}</span></Td>
                <Td right>{money(o.total)}</Td>
                <Td right>
                  {o.status === "new" ? <button className="btn btn-primary btn-sm">Fulfill</button>
                    : o.status === "packed" ? <button className="btn btn-secondary btn-sm">Ship</button>
                    : <button style={{ color: "var(--text-muted)" }}><I.more size={18} /></button>}
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function VendorProducts() {
  const products = myProducts();
  return (
    <div>
      <DashHead title="Products" subtitle={products.length + " listings · 2 low stock"}
        actions={<button className="btn btn-accent btn-sm"><I.camera size={15} /> Snap & list with AI</button>} />
      <AICallout action={<button className="btn btn-primary btn-sm" style={{ flex: "0 0 auto" }}>Apply all</button>}>
        <b style={{ fontFamily: "var(--font-ui)" }}>AI pricing:</b> 3 products are priced below the market sweet spot. Applying suggestions could lift revenue ~<b>$240/mo</b> without hurting conversion.
      </AICallout>
      <div style={{ marginTop: 18 }}>
        <Panel title="Inventory" pad={0}>
          <Table cols={[{ label: "Product" }, { label: "Status" }, { label: "Stock" }, { label: "Price" }, { label: "AI price" }, { label: "Sold", right: true }, { label: "", right: true }]}>
            {products.map((p, i) => {
              const stock = [3, 48, 12, 0, 21, 34][i % 6];
              const aiPrice = p.price + (i % 3 === 0 ? 6 : i % 3 === 1 ? -3 : 0);
              return (
                <tr key={p.id}>
                  <Td>
                    <span className="row gap-8">
                      <Ph label="" style={{ width: 34, height: 34, borderRadius: 7, flex: "0 0 auto" }} />
                      <b style={{ fontFamily: "var(--font-ui)" }}>{p.name}</b>
                    </span>
                  </Td>
                  <Td>{stock === 0 ? <Pill tone="error" dot>Out of stock</Pill> : stock <= 5 ? <Pill tone="warning" dot>Low stock</Pill> : <Pill tone="success" dot>Active</Pill>}</Td>
                  <Td><b style={{ fontFamily: "var(--font-ui)", color: stock <= 5 ? "var(--error)" : "var(--text-primary)" }}>{stock}</b></Td>
                  <Td>{money(p.price)}</Td>
                  <Td>
                    {aiPrice !== p.price ? (
                      <span className="row gap-4"><Spark size={12} style={{ color: "var(--green)" }} /><b style={{ fontFamily: "var(--font-ui)", color: "var(--green)" }}>{money(aiPrice)}</b></span>
                    ) : <span className="dim">—</span>}
                  </Td>
                  <Td right>{[120,88,64,40,32,28][i%6]}</Td>
                  <Td right>
                    <span className="row gap-4" style={{ justifyContent: "flex-end" }}>
                      <button style={{ color: "var(--text-muted)" }}><I.edit size={16} /></button>
                      <button style={{ color: "var(--text-muted)" }}><I.more size={18} /></button>
                    </span>
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function VendorGrowth() {
  return (
    <div>
      <DashHead title="AI Growth Engine" subtitle="Tools that grow your sales automatically" />
      <StatGrid>
        <Kpi label="Ad spend (mo)" value="$200" icon={I.bolt} />
        <Kpi label="Return on ad spend" value="3.9x" delta="+0.4" icon={I.trendup} />
        <Kpi label="Impressions" value="79K" delta="+22%" icon={I.eye} />
        <Kpi label="Attributed sales" value="$780" delta="+16%" icon={I.wallet} accent />
      </StatGrid>
      <div style={{ marginTop: 18 }}>
        <DashGrid cols="1.3fr 1fr">
          <Panel title="Ad campaigns" ai pad={0} action={<button className="btn btn-primary btn-sm"><I.plus size={14} /> New campaign</button>}>
            <Table cols={[{ label: "Campaign" }, { label: "Status" }, { label: "Spend", right: true }, { label: "ROAS", right: true }, { label: "Impr.", right: true }]}>
              {CAMPAIGNS.map((c, i) => (
                <tr key={i}>
                  <Td>
                    <span className="row gap-8">
                      {c.aiManaged && <Spark size={13} style={{ color: "var(--green)" }} />}
                      <b style={{ fontFamily: "var(--font-ui)" }}>{c.name}</b>
                    </span>
                  </Td>
                  <Td><Pill tone={c.status === "active" ? "success" : "neutral"} dot>{c.status}</Pill></Td>
                  <Td right>{money(c.spend)}</Td>
                  <Td right><b style={{ fontFamily: "var(--font-ui)", color: c.roas >= 3 ? "var(--success)" : "var(--text-primary)" }}>{c.roas}x</b></Td>
                  <Td right>{c.impr}</Td>
                </tr>
              ))}
            </Table>
          </Panel>
          <Panel title="Recommended actions" ai>
            <div className="col gap-12">
              {([
                { i: I.rocket, t: "Boost 'Pour-Over Set'", d: "High demand, low ad coverage", cta: "Boost" },
                { i: I.tag,    t: "Lower price on 2 rugs", d: "Win the buy box vs competitors", cta: "Apply" },
                { i: I.bell,   t: "Restock 3 bestsellers", d: "Avoid ~$320 missed sales",       cta: "Restock" },
              ]).map((x, i) => (
                <div key={i} className="row gap-12" style={{ padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--green-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                    <x.i size={17} style={{ color: "var(--green)" }} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5 }}>{x.t}</div>
                    <div className="t-detail" style={{ fontSize: 12 }}>{x.d}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm">{x.cta}</button>
                </div>
              ))}
            </div>
          </Panel>
        </DashGrid>
      </div>
      <div style={{ marginTop: 18 }}>
        <Panel title="Demand insights" ai>
          <p className="t-detail" style={{ marginBottom: 14 }}>What buyers near your categories are searching for — stock ahead of demand.</p>
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            {([["stoneware mug set","+88%"],["matte dinner plates","+62%"],["pour-over kit","+54%"],["handmade gift","+47%"],["ceramic vase","+33%"]]).map(([t,d]) => (
              <span key={t} className="chip" style={{ height: 36 }}>
                <Spark size={13} style={{ color: "var(--green)" }} /> {t} <Pill tone="success">{d}</Pill>
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function VendorReviews() {
  return (
    <div>
      <DashHead title="Reviews" subtitle="4.9 average · 218 reviews" />
      <DashGrid cols="320px 1fr">
        <div className="col gap-16">
          <Panel pad={20}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 48, color: "var(--green)" }}>4.9</div>
              <Stars value={4.9} size={18} />
              <div className="t-detail" style={{ marginTop: 6 }}>218 verified reviews</div>
            </div>
            <div className="col gap-6" style={{ marginTop: 16 }}>
              {([[5,86],[4,10],[3,3],[2,1],[1,0]] as [number,number][]).map(([s,pct]) => (
                <div key={s} className="row gap-8" style={{ fontSize: 12 }}>
                  <span style={{ width: 10 }}>{s}</span>
                  <I.star size={11} style={{ color: "var(--yellow)" }} />
                  <div style={{ flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 99 }}>
                    <div style={{ width: pct+"%", height: "100%", background: "var(--green)", borderRadius: 99 }} />
                  </div>
                  <span className="dim" style={{ width: 28, textAlign: "right" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="AI summary" ai pad={18}>
            <p style={{ fontSize: 13.5, color: "var(--green-deep)", lineHeight: 1.6 }}>
              Buyers consistently praise <b>packaging</b> and <b>glaze quality</b>. A few note items run slightly small. Sentiment is <b>highly positive</b>.
            </p>
          </Panel>
        </div>
        <Panel title="Recent reviews" action={<button className="btn btn-secondary btn-sm">Respond to all</button>}>
          <div className="col gap-16">
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ paddingTop: i ? 16 : 0, borderTop: i ? "1px solid var(--border)" : "none" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="row gap-10">
                    <Avatar name={r.name} size={34} />
                    <div>
                      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
                      <Stars value={r.rating} size={12} />
                    </div>
                  </div>
                  <span className="t-detail">{r.date}</span>
                </div>
                <p className="t-body" style={{ marginTop: 10, fontSize: 14 }}>{r.text}</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, paddingLeft: 0 }}>
                  <I.chat size={14} /> Reply with AI draft
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </DashGrid>
    </div>
  );
}

function VendorPayouts() {
  return (
    <div>
      <DashHead title="Payouts" subtitle="Your earnings and transfers"
        actions={<button className="btn btn-secondary btn-sm"><I.download size={15} /> Statements</button>} />
      <div className="dash-bento">
        <div className="col gap-16">
          <Panel pad={18}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div className="t-detail">Linked payout card</div>
              <button className="btn btn-ghost btn-sm" style={{ height: 28 }}><I.plus size={13} /> Add</button>
            </div>
            <PayCard brand="mastercard" variant="green" label="Payout · debit" name="Mori Ceramics" number="4180" exp="08/28" />
            <div style={{ marginTop: 16 }}>
              <QuickActions actions={[
                { icon: I.coins, label: "Withdraw" }, { icon: I.send, label: "Transfer" },
                { icon: I.repeat, label: "Auto-pay" }, { icon: I.history, label: "History" }, { icon: I.more, label: "More" },
              ]} />
            </div>
          </Panel>
          <Panel pad={20} style={{ background: "var(--green)", color: "#fff", border: "none" }}>
            <div className="t-detail" style={{ color: "var(--green-tint)" }}>Available balance</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 38, margin: "6px 0" }}>$4,180</div>
            <div className="row gap-8" style={{ color: "var(--green-tint)", fontSize: 13 }}><I.cal size={15} /> Next payout · Jun 3</div>
            <button className="btn btn-accent btn-block" style={{ marginTop: 16 }}>Withdraw now</button>
          </Panel>
        </div>
        <div className="col gap-16">
          <DashGrid cols="1fr 1fr" style={{ gap: 16 }}>
            <Panel pad={18}>
              <div className="t-detail">Lifetime earnings</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, marginTop: 6 }}>$64,500</div>
              <div className="row gap-4" style={{ marginTop: 6, fontSize: 12.5, color: "var(--success)", fontFamily: "var(--font-ui)", fontWeight: 600 }}>
                <I.trendup size={13} /> +18% YoY
              </div>
            </Panel>
            <Panel pad={18}>
              <div className="t-detail">Avg per cycle</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, marginTop: 6 }}>$4,663</div>
              <div className="row gap-4" style={{ marginTop: 6, fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>over 14 cycles</div>
            </Panel>
          </DashGrid>
          <Panel title="Earnings · last 7 days">
            <AreaChart series={VENDOR_SERIES["7d"].rev} labels={VENDOR_SERIES["7d"].labels} prefix="$" h={150} />
          </Panel>
          <Panel title="Payout history" pad={0}>
            <Table cols={[{ label: "Payout" }, { label: "Date" }, { label: "Status" }, { label: "Amount", right: true }]}>
              {PAYOUTS.map(p => (
                <tr key={p.id}>
                  <Td><b style={{ fontFamily: "var(--font-ui)" }}>{p.id}</b></Td>
                  <Td><span className="dim">{p.date}</span></Td>
                  <Td><Pill tone={p.status === "paid" ? "success" : "warning"} dot>{p.status}</Pill></Td>
                  <Td right>{money(p.amount)}</Td>
                </tr>
              ))}
            </Table>
          </Panel>
        </div>
      </div>
    </div>
  );
}
