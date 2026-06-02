"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Celeste, Spark, I } from "./icons";
import { useCart } from "@/lib/cart-context";
import { CATEGORIES } from "@/lib/data";

const ANNOUNCE = [
  "Free shipping on orders over $75 — across every vendor",
  "New: describe what you need and let Celeste AI find it",
  "Verified shops, buyer protection on every order",
];

interface HeaderProps {
  compact?: boolean;
  query?: string;
  setQuery?: (q: string) => void;
}

export default function Header({ compact, query: extQuery, setQuery: extSetQuery }: HeaderProps) {
  const [ann, setAnn] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [annOn, setAnnOn] = useState(true);
  const [localQuery, setLocalQuery] = useState("");
  const { cartCount } = useCart();
  const router = useRouter();

  const query = extSetQuery ? (extQuery || "") : localQuery;
  const setQuery = extSetQuery ? extSetQuery : setLocalQuery;

  useEffect(() => {
    const t = setInterval(() => setAnn(a => (a + 1) % ANNOUNCE.length), 4200);
    return () => clearInterval(t);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
    setMenuOpen(false);
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40 }}>
      {annOn && (
        <div style={{ background: "var(--green)", color: "#fff", fontFamily: "var(--font-ui)",
          fontSize: 12.5, fontWeight: 500, letterSpacing: ".2px", textAlign: "center", padding: "7px 40px",
          position: "relative" }}>
          <span key={ann} className="fade-in">{ANNOUNCE[ann]}</span>
          <button onClick={() => setAnnOn(false)} style={{ position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)", color: "rgba(255,255,255,.7)" }}>
            <I.close size={15} />
          </button>
        </div>
      )}

      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 18, height: 68 }}>
          <Link href="/" style={{ flex: "0 0 auto" }}><Celeste size={22} /></Link>

          {!compact && (
            <form onSubmit={onSearch}
              style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", maxWidth: 620, margin: "0 auto" }}>
              <span style={{ position: "absolute", left: 16, color: "var(--green)", display: "flex" }}>
                <Spark size={18} className="spark-anim" />
              </span>
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                placeholder="Describe what you're looking for…"
                style={{ height: 48, paddingLeft: 44, paddingRight: 84, borderRadius: 999, fontSize: 14.5 }}
              />
              <div style={{ position: "absolute", right: 8, display: "flex", gap: 4, alignItems: "center" }}>
                <button type="button" title="Search by photo" style={{ width: 34, height: 34, borderRadius: 999,
                  display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
                  <I.camera size={19} />
                </button>
                <button type="submit" className="btn btn-primary" style={{ height: 36, width: 36, padding: 0, borderRadius: 999 }}>
                  <I.search size={17} />
                </button>
              </div>
            </form>
          )}

          <div className="row gap-4" style={{ flex: "0 0 auto" }}>
            <button className="hide-mobile" style={{ width: 42, height: 42, display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
              <I.globe size={21} />
            </button>
            <button className="hide-mobile" style={{ width: 42, height: 42, display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
              <I.heart size={21} />
            </button>
            <Link href="/login" className="hide-mobile" style={{ width: 42, height: 42, display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
              <I.user size={21} />
            </Link>
            <Link href="/cart" style={{ position: "relative", width: 42, height: 42, display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
              <I.cart size={21} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 2, background: "var(--green)",
                  color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 17, height: 17, borderRadius: 99,
                  display: "grid", placeItems: "center", padding: "0 4px", fontFamily: "var(--font-ui)" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/sell" className="btn btn-accent hide-mobile" style={{ marginLeft: 6 }}>Become a Seller</Link>
            <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)}
              style={{ width: 42, height: 42, display: "grid", placeItems: "center" }}>
              {menuOpen ? <I.close size={24} /> : <I.menu size={24} />}
            </button>
          </div>
        </div>

        {!compact && (
          <div className="container hide-mobile" style={{ display: "flex", gap: 24, height: 46, alignItems: "center",
            overflowX: "auto", borderTop: "1px solid var(--border)" }}>
            {CATEGORIES.map((c, i) => (
              <Link key={c} href="/search" style={{ fontFamily: "var(--font-ui)", fontWeight: 500,
                fontSize: 13.5, color: i === 0 ? "var(--green)" : "var(--text-secondary)", whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 5 }}>
                {i === 0 && <Spark size={13} />}{i === 0 ? "For You" : c}
              </Link>
            ))}
            <span style={{ flex: 1 }} />
            <Link href="/pricing" style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Pricing</Link>
            <Link href="/about" style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>About</Link>
            <Link href="/contact" style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Contact</Link>
          </div>
        )}
      </div>

      {menuOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(17,32,27,0.15)", backdropFilter: "blur(4px)" }} onClick={() => setMenuOpen(false)} className="fade-in" />
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div className="fade-in show-mobile" style={{ pointerEvents: "auto", width: 340, maxWidth: "calc(100vw - 24px)", background: "rgba(240, 243, 241, 0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 28, boxShadow: "0 24px 48px rgba(0,0,0,0.1)", padding: 8, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              
              <div style={{ gridColumn: "span 2", background: "#fff", borderRadius: 20, padding: "4px" }}>
              <form onSubmit={onSearch} style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: 13, color: "var(--text-secondary)" }}><I.search size={18} /></span>
                <input className="input" value={query} onChange={(e) => setQuery?.(e.target.value)}
                  placeholder="Search anything…" style={{ height: 46, paddingLeft: 42, borderRadius: 16, background: "transparent", border: "none", fontSize: 16 }} />
              </form>
            </div>

            <Link href="/search" onClick={() => setMenuOpen(false)} style={{ gridColumn: "span 1", gridRow: "span 2", background: "var(--green-deep)", color: "var(--yellow)", borderRadius: 20, padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
              <Spark size={28} />
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, lineHeight: 1.1, marginTop: 24 }}>For You</div>
            </Link>

            {CATEGORIES.slice(0, 4).map((c, i) => (
              <Link key={c} href="/search" onClick={() => setMenuOpen(false)}
                style={{ gridColumn: "span 1", background: "#fff", borderRadius: 20, padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 14 }}>
                {c}
                <I.arrowright size={14} style={{ opacity: 0.2 }} />
              </Link>
            ))}

            <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ gridColumn: "span 1", background: "#fff", borderRadius: 20, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 14 }}>
              <div style={{ position: "relative" }}>
                <I.cart size={24} />
                {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: "var(--green)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center" }}>{cartCount}</span>}
              </div>
              Cart
            </Link>
            
            <Link href="/sell" onClick={() => setMenuOpen(false)} style={{ gridColumn: "span 1", background: "var(--yellow)", color: "var(--green-deep)", borderRadius: 20, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>
              <I.user size={24} />
              Sell
            </Link>

            </div>
          </div>
        </>
      )}
    </header>
  );
}
