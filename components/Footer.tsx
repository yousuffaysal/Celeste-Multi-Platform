import React from "react";
import Link from "next/link";
import { Celeste, I } from "./icons";

const FOOT_LINKS: Record<string, { label: string; href: string }[]> = {
  Shop: [
    { label: "All categories",  href: "/search" },
    { label: "New arrivals",    href: "/search" },
    { label: "Flash deals",     href: "/search" },
    { label: "Verified shops",  href: "/search" },
    { label: "Gift ideas",      href: "/search" },
  ],
  Sell: [
    { label: "Become a Seller", href: "/sell" },
    { label: "AI Growth Engine",href: "/sell" },
    { label: "Pricing",         href: "/pricing" },
    { label: "Seller stories",  href: "/sell" },
    { label: "Help for sellers",href: "/contact" },
  ],
  Company: [
    { label: "About Celeste",   href: "/about" },
    { label: "Careers",         href: "/careers" },
    { label: "Press",           href: "/contact" },
    { label: "Sustainability",  href: "/about" },
  ],
  Help: [
    { label: "Track an order",  href: "/dashboard" },
    { label: "Returns",         href: "/contact" },
    { label: "Buyer protection",href: "/contact" },
    { label: "Contact us",      href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--green-deep)", color: "#fff", marginTop: 16 }}>
      <div className="container" style={{ paddingBlock: 56 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 32 }} className="foot-grid">
          <div style={{ maxWidth: 300 }}>
            <Celeste size={24} color="#fff" />
            <p className="t-detail" style={{ marginTop: 14, color: "rgba(255,255,255,0.8)" }}>
              The AI-native marketplace. Describe what you need — we&apos;ll find it across thousands of verified shops.
            </p>
            <button className="btn btn-sm" style={{ marginTop: 16, background: "var(--yellow)", color: "var(--green-deep)", border: "none" }}>
              <I.bolt size={15} /> Install the app
            </button>
          </div>
          {Object.entries(FOOT_LINKS).map(([h, items]) => (
            <div key={h}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, marginBottom: 14, color: "var(--yellow)" }}>{h}</div>
              <div className="col gap-12">
                {items.map(it => (
                  <Link key={it.label} href={it.href}
                    className="t-detail" style={{ color: "rgba(255,255,255,0.8)" }}>{it.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr style={{ margin: "36px 0 20px", border: "none", borderTop: "1px solid rgba(255,255,255,0.15)" }} />
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 14, color: "rgba(255,255,255,0.5)" }}>
          <span className="t-detail" style={{ color: "inherit" }}>© 2026 Celeste. Calm commerce, intelligently done.</span>
          <div className="row gap-16">
            <span className="t-detail" style={{ color: "inherit" }}>Privacy</span>
            <span className="t-detail" style={{ color: "inherit" }}>Terms</span>
            <span className="t-detail" style={{ color: "inherit" }}>Secure checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
