import React from "react";
import { I } from "./icons";

const TRUST = [
  { icon: I.shield, t: "Buyer protection", d: "Every order covered" },
  { icon: I.truck,  t: "Fast, tracked shipping", d: "Across all vendors" },
  { icon: I.refresh, t: "Easy returns", d: "30-day window" },
  { icon: I.star,  t: "Trusted reviews", d: "240k+ verified" },
];

export default function TrustBand() {
  return (
    <div className="container">
      <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", padding: 8 }}>
        {TRUST.map((x, i) => (
          <div key={i} className="row gap-12" style={{ padding: "18px 20px" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--green-tint)",
              display: "grid", placeItems: "center", flex: "0 0 auto" }}>
              <x.icon size={20} style={{ color: "var(--green)" }} />
            </div>
            <div>
              <div className="t-h4">{x.t}</div>
              <div className="t-detail">{x.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
