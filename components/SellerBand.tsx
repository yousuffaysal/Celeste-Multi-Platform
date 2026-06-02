import React from "react";
import Link from "next/link";
import { Spark, I } from "./icons";

export default function SellerBand() {
  return (
    <div className="container">
      <div className="seller-band" style={{ padding: "clamp(32px,5vw,56px)" }}>
        <div className="accent-shape" />
        <div className="accent-shape two" />
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 28 }}>
          <div style={{ maxWidth: 560 }}>
            <span className="t-eyebrow" style={{ color: "var(--yellow)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Spark size={13} /> AI Growth Engine
            </span>
            <h2 className="t-h2" style={{ color: "#fff", marginTop: 12 }}>Grow your sales with AI</h2>
            <p className="t-body-lg" style={{ color: "var(--green-tint)", marginTop: 12 }}>
              List in seconds, let AI write your copy and run your ads, and watch the orders come in. Free to start · No setup fees.
            </p>
          </div>
          <div className="row gap-12" style={{ flexWrap: "wrap" }}>
            <Link href="/sell" className="btn btn-accent btn-lg">Become a Seller</Link>
            <Link href="/sell" className="btn btn-ghost-white btn-lg">Learn more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
