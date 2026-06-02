"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CelesteMark, Spark, I } from "@/components/icons";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const links = [
    { label: "Home",      icon: I.grid,    href: "/" },
    { label: "Search",    icon: I.search,  href: "/search" },
    { label: "Assistant", icon: I.chat,    href: "/assistant" },
    { label: "Contact",   icon: I.send,    href: "/contact" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#070d0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "40px 24px",
      textAlign: "center",
    }}>
      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.04) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

      {/* Ambient glows */}
      <div style={{ position: "absolute", left: "20%", top: "20%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.07) 0%, transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "15%", bottom: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.22) 0%, transparent 68%)", pointerEvents: "none" }} />

      {/* Floating watermark */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: .03, pointerEvents: "none" }}>
        <CelesteMark size={520} color="#fff" />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 560 }}>
        {/* 404 */}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 900,
          fontSize: "clamp(96px,18vw,180px)", lineHeight: 1, letterSpacing: "-8px",
          background: "linear-gradient(130deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.04) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginBottom: 4,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(.96)",
          transition: "opacity .7s .06s, transform .7s .06s cubic-bezier(.22,.61,.36,1)",
        }}>404</div>

        {/* Spark badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(251,226,73,.09)", border: "1px solid rgba(251,226,73,.18)",
          borderRadius: 99, padding: "5px 16px 5px 10px", marginBottom: 24,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
          transition: "opacity .5s .25s, transform .5s .25s",
        }}>
          <Spark size={13} style={{ color: "var(--yellow)" }} />
          <span style={{ fontSize: 12, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".07em", textTransform: "uppercase" }}>
            Page not found
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(26px,4vw,42px)", color: "#fff", lineHeight: 1.15,
          letterSpacing: "-1px", marginBottom: 16,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity .55s .38s, transform .55s .38s",
        }}>
          This page went shopping without us.
        </h1>

        {/* Body */}
        <p style={{
          fontSize: 16, color: "rgba(255,255,255,.42)", lineHeight: 1.7,
          maxWidth: 420, margin: "0 auto 36px",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
          transition: "opacity .5s .5s, transform .5s .5s",
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you somewhere good.
        </p>

        {/* Quick links */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 32,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
          transition: "opacity .5s .62s, transform .5s .62s",
        }}>
          {links.map((l, i) => (
            <button key={l.label} onClick={() => router.push(l.href)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 44, padding: "0 20px", borderRadius: 99,
              background: i === 0 ? "var(--yellow)" : "rgba(255,255,255,.06)",
              color: i === 0 ? "var(--green-deep)" : "rgba(255,255,255,.7)",
              border: i === 0 ? "none" : "1px solid rgba(255,255,255,.1)",
              fontFamily: "var(--font-ui)", fontWeight: i === 0 ? 800 : 600, fontSize: 14,
              cursor: "pointer", transition: "background .15s, color .15s, transform .14s",
            }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                if (i === 0) b.style.transform = "translateY(-1px)";
                else { b.style.background = "rgba(255,255,255,.1)"; b.style.color = "#fff"; }
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "";
                if (i !== 0) { b.style.background = "rgba(255,255,255,.06)"; b.style.color = "rgba(255,255,255,.7)"; }
              }}
            >
              <l.icon size={15} /> {l.label}
            </button>
          ))}
        </div>

        {/* Error code */}
        <div style={{
          fontSize: 12, fontFamily: "var(--font-ui)", color: "rgba(255,255,255,.18)",
          opacity: mounted ? 1 : 0, transition: "opacity .5s .8s",
        }}>
          Error 404 · celeste.shop
        </div>
      </div>
    </div>
  );
}
