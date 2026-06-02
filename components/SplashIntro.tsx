"use client";
import React, { useEffect, useState } from "react";

export default function SplashIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    // Logo fades in
    const t0 = setTimeout(() => setPhase("hold"), 80);
    // Hold on screen, then slide up
    const t1 = setTimeout(() => setPhase("exit"), 1600);
    // Notify hero to start
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 2700);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#01614E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit"
          ? "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
      }}
    >
      {/* Actual logo — bear icon */}
      <div style={{
        opacity: phase === "hold" ? 1 : 0,
        transform: phase === "hold" ? "scale(1) translateY(0)" : "scale(0.82) translateY(12px)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width: 88, height: 88, borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
          <img
            src="https://ik.imagekit.io/2lax2ytm2/Screenshot%202026-05-30%20at%203.58.44%E2%80%AFPM.png"
            alt="Celeste"
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.25)" }}
          />
        </div>
      </div>

      {/* Wordmark */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: "-0.8px",
        color: "#fff",
        opacity: phase === "hold" ? 1 : 0,
        transform: phase === "hold" ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 1s 0.18s cubic-bezier(0.4,0,0.2,1), transform 1s 0.18s cubic-bezier(0.4,0,0.2,1)",
      }}>
        Celeste
      </div>

      {/* Subtle tagline */}
      <div style={{
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        color: "rgba(255,255,255,0.45)",
        letterSpacing: "0.05em",
        opacity: phase === "hold" ? 1 : 0,
        transition: "opacity 1.1s 0.36s cubic-bezier(0.4,0,0.2,1)",
      }}>
        AI-native marketplace
      </div>
    </div>
  );
}
