"use client";
import React, { useState } from "react";
import { Spark, I } from "@/components/icons";
import { TONE, Pill, Kpi, Donut, Panel, Table, Td, Avatar, AICallout, DashHead, StatGrid, DashGrid } from "./DashComponents";
import { RangeToggle, ChartTypeToggle, AreaChart, StackedBars, Legend, Gauge, Heatmap } from "./DashViz";
import { PayCard, QuickActions, TxnList } from "./DashPay";
import {
  ORDERS, ORDER_STATUS, VENDOR_ROWS, VENDOR_APPROVALS, CUSTOMER_ROWS, MODERATION, PAYOUTS,
  SERIES, REV_SPLIT, GMV_CATS, ORDER_HEAT, TXN_ADMIN, VIZ, spark, SHOPS, money,
} from "@/lib/dash-data";

export default function AdminDash({ section }: { section: string }) {
  switch (section) {
    case "vendors":    return <AdminVendors />;
    case "customers":  return <AdminCustomers />;
    case "orders":     return <AdminOrders />;
    case "moderation": return <AdminModeration />;
    case "payouts":    return <AdminPayouts />;
    case "insights":   return <AdminInsights />;
    default:           return <AdminOverview />;
  }
}

function AdminOverview() {
  const [range, setRange] = useState("7d");
  const [ctype, setCtype] = useState("area");
  const s = SERIES[range];
  return (
    <div>
      <DashHead title="Platform overview" subtitle="Tuesday, May 30 · Real-time"
        actions={<><button className="btn btn-secondary btn-sm"><I.cal size={15} /> This week</button><button className="btn btn-primary btn-sm"><I.download size={15} /> Export</button></>} />

      <StatGrid>
        <Kpi label="Gross merchandise value" value="$2.41M" delta="+18%" icon={I.chart} spark={spark(0.2)} />
        <Kpi label="Platform revenue" value="$214K" delta="+12%" icon={I.wallet} spark={spark(0.6)} accent />
        <Kpi label="Orders" value="18,402" delta="+9%" icon={I.inbox} spark={spark(1.1)} />
        <Kpi label="Active vendors" value="842" delta="+4%" icon={I.store} spark={spark(0.9)} />
        <Kpi label="Active buyers" value="124K" delta="+6%" icon={I.users} spark={spark(1.5)} />
      </StatGrid>

      <AICallout action={<button className="btn btn-primary btn-sm" style={{ flex: "0 0 auto" }}>Review</button>}>
        <b style={{ fontFamily: "var(--font-ui)" }}>AI watchtower:</b> GMV is pacing 18% above last week, driven by Lighting &amp; Audio. The fraud model flagged <b>3 orders</b> and <b>2 vendors</b> need verification.
      </AICallout>

      <div className="dash-bento" style={{ marginTop: 16 }}>
        <Panel title="GMV trend" action={<div className="row gap-8"><ChartTypeToggle value={ctype} onChange={setCtype} /><RangeToggle value={range} onChange={setRange} /></div>}>
          <div className="row gap-24" style={{ marginBottom: 14, flexWrap: "wrap" }}>
            <div><div className="t-detail">Total GMV</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.5px" }}>$2.41M</div></div>
            <div><div className="t-detail">Take rate</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.5px" }}>8.9%</div></div>
            <div><div className="t-detail">Avg order</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.5px" }}>$131</div></div>
            <Pill tone="success" dot>Live</Pill>
          </div>
          <AreaChart series={s.gmv} labels={s.labels} mode={ctype === "area" ? "area" : "line"} prefix="$" suffix="K" />
        </Panel>
        <Panel title="GMV by category">
          <Donut segments={GMV_CATS} />
        </Panel>
      </div>

      <div className="dash-bento" style={{ marginTop: 16 }}>
        <Panel title="Revenue mix" action={<Legend items={[{label:"Lighting",color:VIZ.gold},{label:"Audio",color:VIZ.emerald},{label:"Home",color:VIZ.coral}]} />}>
          <StackedBars data={REV_SPLIT} keys={["Lighting","Audio","Home"]} colors={[VIZ.gold,VIZ.emerald,VIZ.coral]} labels={SERIES["7d"].labels} prefix="$" />
        </Panel>
        <Panel title="Platform settlements" action={<a className="seeall" style={{ fontSize: 13 }}>All <I.arrowright size={14} /></a>}>
          <TxnList rows={TXN_ADMIN} />
        </Panel>
      </div>

      <div style={{ marginTop: 16 }}>
        <Panel title="Order volume by category" ai action={<RangeToggle options={["Day","Week"]} />}>
          <p className="t-detail" style={{ marginBottom: 16 }}>Where demand concentrates across the week — darker means more orders.</p>
          <Heatmap rows={ORDER_HEAT.rows} cols={ORDER_HEAT.cols} matrix={ORDER_HEAT.matrix} color="6,163,107" />
        </Panel>
      </div>

      <div style={{ marginTop: 16 }}>
        <DashGrid cols="1.4fr 1fr">
          <Panel title="Top vendors" action={<a className="seeall" style={{ fontSize: 13 }}>View all <I.arrowright size={14} /></a>}>
            <Table cols={[{ label: "Vendor" }, { label: "GMV", right: true }, { label: "Orders", right: true }, { label: "Rating", right: true }]}>
              {[...VENDOR_ROWS].sort((a,b) => b.gmv - a.gmv).slice(0,5).map(v => (
                <tr key={v.id}>
                  <Td><span className="row gap-8"><Avatar name={SHOPS[v.id]?.name || v.id} size={28} /> {SHOPS[v.id]?.name || v.id}</span></Td>
                  <Td right>{money(v.gmv)}</Td>
                  <Td right>{v.orders.toLocaleString()}</Td>
                  <Td right><span className="row gap-4" style={{ justifyContent: "flex-end" }}><I.star size={13} style={{ color: "var(--yellow)" }} /> {v.rating}</span></Td>
                </tr>
              ))}
            </Table>
          </Panel>
          <Panel title="Needs attention">
            <div className="col gap-12">
              {[
                { icon: I.flag,        tone: "warning", t: "2 vendors awaiting verification",   d: "Hearth & Hand, Tidal Skincare" },
                { icon: I.alert,       tone: "error",   t: "3 orders flagged by fraud model",   d: "$1,240 held pending review" },
                { icon: I.shieldcheck, tone: "info",    t: "4 listings in moderation queue",    d: "2 high severity" },
                { icon: I.refresh,     tone: "neutral", t: "11 open refund requests",           d: "SLA: respond within 24h" },
              ].map((x, i) => (
                <div key={i} className="row gap-12" style={{ padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: TONE[x.tone].bg, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                    <x.icon size={17} style={{ color: TONE[x.tone].fg }} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5 }}>{x.t}</div>
                    <div className="t-detail" style={{ fontSize: 12 }}>{x.d}</div>
                  </div>
                  <I.chevright size={16} style={{ color: "var(--text-muted)" }} />
                </div>
              ))}
            </div>
          </Panel>
        </DashGrid>
      </div>
    </div>
  );
}

function AdminVendors() {
  return (
    <div>
      <DashHead title="Vendors" subtitle="842 active · 2 pending approval"
        actions={<><button className="btn btn-secondary btn-sm"><I.filter size={15} /> Filter</button><button className="btn btn-primary btn-sm"><I.download size={15} /> Export</button></>} />

      <Panel title="Pending approval" ai action={<Pill tone="warning">{VENDOR_APPROVALS.length} new</Pill>} style={{ marginBottom: 18 }}>
        <div className="col gap-12">
          {VENDOR_APPROVALS.map((v, i) => (
            <div key={i} className="row" style={{ justifyContent: "space-between", gap: 14, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none", flexWrap: "wrap" }}>
              <div className="row gap-12">
                <Avatar name={v.name} size={40} />
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14.5 }}>{v.name}</div>
                  <div className="t-detail">{v.cat} · {v.products} products · applied {v.applied}</div>
                </div>
              </div>
              <div className="row gap-12" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <div className="t-detail" style={{ fontSize: 11, whiteSpace: "nowrap" }}>AI trust score</div>
                  <div className="row gap-4" style={{ justifyContent: "flex-end" }}>
                    <Spark size={13} style={{ color: "var(--green)" }} />
                    <b style={{ fontFamily: "var(--font-ui)", color: v.aiScore >= 85 ? "var(--success)" : "var(--warning)" }}>{v.aiScore}</b>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">Review</button>
                <button className="btn btn-primary btn-sm">Approve</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="All vendors" pad={0}>
        <Table cols={[{ label: "Vendor" }, { label: "Status" }, { label: "Joined" }, { label: "GMV", right: true }, { label: "Orders", right: true }, { label: "Rating", right: true }, { label: "Flags", right: true }, { label: "" }]}>
          {VENDOR_ROWS.map(v => (
            <tr key={v.id}>
              <Td>
                <span className="row gap-8">
                  <Avatar name={SHOPS[v.id]?.name || v.id} size={28} />
                  <span>
                    <div style={{ fontWeight: 600 }}>{SHOPS[v.id]?.name || v.id}</div>
                    <div className="dim" style={{ fontSize: 11.5 }}>{SHOPS[v.id]?.cat}</div>
                  </span>
                </span>
              </Td>
              <Td><Pill tone={v.status === "active" ? "success" : "warning"} dot>{v.status === "active" ? "Active" : "In review"}</Pill></Td>
              <Td><span className="dim">{v.joined}</span></Td>
              <Td right>{money(v.gmv)}</Td>
              <Td right>{v.orders.toLocaleString()}</Td>
              <Td right><span className="row gap-4" style={{ justifyContent: "flex-end" }}><I.star size={13} style={{ color: "var(--yellow)" }} /> {v.rating}</span></Td>
              <Td right>{v.flags ? <Pill tone="error">{v.flags}</Pill> : <span className="dim">—</span>}</Td>
              <Td right><button style={{ color: "var(--text-muted)" }}><I.more size={18} /></button></Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}

function AdminCustomers() {
  return (
    <div>
      <DashHead title="Customers" subtitle="124,208 total buyers"
        actions={<button className="btn btn-secondary btn-sm"><I.download size={15} /> Export</button>} />
      <StatGrid>
        <Kpi label="Total customers" value="124K" delta="+6%" icon={I.users} />
        <Kpi label="New this week" value="3,140" delta="+11%" icon={I.user} />
        <Kpi label="Avg lifetime value" value="$412" delta="+3%" icon={I.wallet} accent />
        <Kpi label="Repeat rate" value="48%" delta="+2%" icon={I.refresh} />
      </StatGrid>
      <div style={{ marginTop: 18 }}>
        <Panel title="All customers" pad={0} action={
          <div className="row gap-8">
            {["All","VIP","Loyal","New"].map((s,i) => (
              <button key={s} className={"chip" + (i===0?" active":"")} style={{ height: 30 }}>{s}</button>
            ))}
          </div>}>
          <Table cols={[{ label: "Customer" }, { label: "Segment" }, { label: "Joined" }, { label: "Orders", right: true }, { label: "Spent", right: true }, { label: "LTV", right: true }]}>
            {CUSTOMER_ROWS.map((c, i) => (
              <tr key={i}>
                <Td>
                  <span className="row gap-8">
                    <Avatar name={c.name} size={28} />
                    <span>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="dim" style={{ fontSize: 11.5 }}>{c.email}</div>
                    </span>
                  </span>
                </Td>
                <Td><Pill tone={c.seg === "VIP" ? "success" : c.seg === "New" ? "info" : "neutral"}>{c.seg}</Pill></Td>
                <Td><span className="dim">{c.joined}</span></Td>
                <Td right>{c.orders}</Td>
                <Td right>{money(c.spent)}</Td>
                <Td right><Pill tone={c.ltv === "High" ? "success" : c.ltv === "Medium" ? "warning" : "neutral"}>{c.ltv}</Pill></Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [filter, setFilter] = useState("all");
  const rows = filter === "all" ? ORDERS : ORDERS.filter(o => o.status === filter);
  return (
    <div>
      <DashHead title="Orders" subtitle="Platform-wide order monitor" />
      <StatGrid>
        <Kpi label="Orders today" value="1,204" delta="+8%" icon={I.inbox} />
        <Kpi label="In transit" value="3,890" icon={I.truck} />
        <Kpi label="Open disputes" value="11" delta="-4%" up={false} icon={I.alert} />
        <Kpi label="Avg fulfillment" value="1.4 days" delta="-6%" icon={I.clock} />
      </StatGrid>
      <div style={{ marginTop: 18 }}>
        <Panel title="Recent orders" pad={0} action={
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            {["all","new","shipped","delivered","refund"].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={"chip" + (filter === s ? " active" : "")} style={{ height: 30, textTransform: "capitalize" }}>{s}</button>
            ))}
          </div>}>
          <Table cols={[{ label: "Order" }, { label: "Customer" }, { label: "Vendor" }, { label: "Status" }, { label: "Date" }, { label: "Total", right: true }]}>
            {rows.map(o => (
              <tr key={o.id}>
                <Td><b style={{ fontFamily: "var(--font-ui)" }}>{o.id}</b></Td>
                <Td>{o.customer}</Td>
                <Td><span className="dim">{SHOPS[o.vendor]?.name || o.vendor}</span></Td>
                <Td><Pill tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Pill></Td>
                <Td><span className="dim">{o.date}</span></Td>
                <Td right>{money(o.total)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function AdminModeration() {
  return (
    <div>
      <DashHead title="Catalog & Moderation" subtitle="AI-assisted content review" />
      <AICallout>
        <b style={{ fontFamily: "var(--font-ui)" }}>AI moderation</b> scans every new listing for policy issues, prohibited claims, and trademark terms — surfacing only what needs a human. <b>4 items</b> in queue, 2 high severity.
      </AICallout>
      <div style={{ marginTop: 18 }}>
        <Panel title="Moderation queue" ai pad={0}>
          <Table cols={[{ label: "Product" }, { label: "Vendor" }, { label: "AI reason" }, { label: "Severity" }, { label: "Confidence", right: true }, { label: "", right: true }]}>
            {MODERATION.map((m, i) => (
              <tr key={i}>
                <Td><b style={{ fontFamily: "var(--font-ui)" }}>{m.product}</b></Td>
                <Td><span className="dim">{SHOPS[m.vendor]?.name || m.vendor}</span></Td>
                <Td><span className="row gap-6"><Spark size={13} style={{ color: "var(--green)" }} />{m.reason}</span></Td>
                <Td><Pill tone={m.severity === "high" ? "error" : m.severity === "med" ? "warning" : "neutral"} dot>{m.severity}</Pill></Td>
                <Td right><b style={{ fontFamily: "var(--font-ui)" }}>{m.conf}%</b></Td>
                <Td right>
                  <span className="row gap-6" style={{ justifyContent: "flex-end" }}>
                    <button className="btn btn-secondary btn-sm">Approve</button>
                    <button className="btn btn-sm" style={{ background: "#FBE9E7", color: "#C0392B" }}>Remove</button>
                  </span>
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function AdminPayouts() {
  return (
    <div>
      <DashHead title="Payouts" subtitle="Vendor settlement & platform fees"
        actions={<button className="btn btn-primary btn-sm"><I.wallet size={15} /> Run payout cycle</button>} />
      <div className="dash-bento">
        <div>
          <StatGrid style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Kpi label="Pending payouts" value="$182K" icon={I.clock} accent />
            <Kpi label="Paid this month" value="$1.6M" delta="+14%" icon={I.wallet} />
            <Kpi label="Platform fees" value="$214K" delta="+12%" icon={I.chart} />
            <Kpi label="Next cycle" value="Jun 3" icon={I.cal} />
          </StatGrid>
          <Panel title="Payout history" pad={0} style={{ marginTop: 16 }}>
            <Table cols={[{ label: "Payout ID" }, { label: "Date" }, { label: "Vendors" }, { label: "Status" }, { label: "Amount", right: true }]}>
              {([
                ["PO-CYC-204","May 27","842","paid",1604200],
                ["PO-CYC-203","May 20","838","paid",1488000],
                ["PO-CYC-202","May 13","835","paid",1552100],
                ["PO-CYC-205","Jun 3","844","scheduled",182400],
              ] as [string,string,string,string,number][]).map(([id,date,v,st,amt]) => (
                <tr key={id}>
                  <Td><b style={{ fontFamily: "var(--font-ui)" }}>{id}</b></Td>
                  <Td><span className="dim">{date}</span></Td>
                  <Td>{v}</Td>
                  <Td><Pill tone={st === "paid" ? "success" : "warning"} dot>{st}</Pill></Td>
                  <Td right>{money(amt)}</Td>
                </tr>
              ))}
            </Table>
          </Panel>
        </div>
        <div className="col gap-16">
          <Panel pad={18}>
            <div className="t-detail" style={{ marginBottom: 12 }}>Operating account</div>
            <PayCard brand="visa" variant="green" label="Platform settlement" name="Celeste HQ" number="0042" exp="11/29" />
            <div style={{ marginTop: 16 }}>
              <QuickActions actions={[
                { icon: I.topup, label: "Fund" }, { icon: I.send, label: "Disburse" },
                { icon: I.repeat, label: "Cycle" }, { icon: I.history, label: "History" }, { icon: I.more, label: "More" },
              ]} />
            </div>
          </Panel>
          <Panel title="Settlement health" ai pad={18}>
            <Gauge value={97} label="on-time" sub="97% of vendor payouts settled within SLA over the last 30 days." />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function AdminInsights() {
  return (
    <div>
      <DashHead title="AI Insights" subtitle="Forecasting, anomalies & demand signals" />
      <div className="dash-2col" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Panel title="Demand forecast" ai action={<RangeToggle options={["7d","14d"]} />}>
          <p className="t-detail" style={{ marginBottom: 14 }}>Projected GMV for next 7 days, by the demand model.</p>
          <AreaChart series={[62,68,65,74,82,95,88]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} prefix="$" suffix="K" h={170} />
          <AICallout action={null}><b style={{ fontFamily: "var(--font-ui)" }}>+22% projected</b> next weekend — recommend boosting Lighting inventory and ad budget.</AICallout>
        </Panel>
        <Panel title="Rising searches" ai>
          <div className="col gap-10">
            {[["warm desk lamp","+140%"],["sage throw blanket","+98%"],["pour-over set","+76%"],["dot grid notebook","+54%"],["solar path lights","+41%"]].map(([t,d],i) => (
              <div key={i} className="row" style={{ justifyContent: "space-between", padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <span className="row gap-8">
                  <span style={{ width: 22, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12 }}>{i+1}</span>{t}
                </span>
                <Pill tone="success"><span className="row gap-4"><I.trendup size={12} /> {d}</span></Pill>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div style={{ marginTop: 18 }}>
        <Panel title="Anomaly detection" ai pad={0}>
          <Table cols={[{ label: "Signal" }, { label: "Where" }, { label: "Detected" }, { label: "Severity" }, { label: "", right: true }]}>
            {([
              ["Unusual refund spike",       "Voss Audio",     "12m ago", "error"],
              ["Pricing far below market",   "Thread & Loom",  "1h ago",  "warning"],
              ["Review velocity anomaly",    "Arbor Supply",   "3h ago",  "warning"],
            ] as [string,string,string,string][]).map(([s,w,t,sev],i) => (
              <tr key={i}>
                <Td><span className="row gap-6"><Spark size={13} style={{ color: "var(--green)" }} /><b style={{ fontFamily: "var(--font-ui)" }}>{s}</b></span></Td>
                <Td><span className="dim">{w}</span></Td>
                <Td><span className="dim">{t}</span></Td>
                <Td><Pill tone={sev} dot>{sev === "error" ? "High" : "Medium"}</Pill></Td>
                <Td right><button className="btn btn-secondary btn-sm">Investigate</button></Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}
