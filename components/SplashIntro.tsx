"use client";
import React, { useEffect, useState } from "react";

export default function SplashIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("hold"), 80);
    const t1 = setTimeout(() => setPhase("exit"), 1800);
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 2900);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;

  const visible = phase === "hold";

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
        gap: 22,
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit"
          ? "transform 1.15s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
      }}
    >
      {/* Bear logo */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.78) translateY(16px)",
        transition: "opacity 0.95s cubic-bezier(0.4,0,0.2,1), transform 0.95s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width: 110, height: 110, borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }}>
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
        fontSize: 34,
        letterSpacing: "-1px",
        color: "#fff",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 1s 0.2s cubic-bezier(0.4,0,0.2,1), transform 1s 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}>
        Celeste
      </div>

      {/* AI-native line — yellow */}
      <div style={{
        fontFamily: "var(--font-ui)",
        fontWeight: 600,
        fontSize: 14,
        color: "#FBE249",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 1s 0.34s cubic-bezier(0.4,0,0.2,1), transform 1s 0.34s cubic-bezier(0.4,0,0.2,1)",
        marginTop: -10,
      }}>
        AI-native marketplace
      </div>

      {/* Foxmen Studio credit */}
      <div style={{
        fontFamily: "var(--font-ui)",
        fontSize: 12.5,
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.04em",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.1s 0.52s cubic-bezier(0.4,0,0.2,1)",
        marginTop: 8,
      }}>
        by <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>@Foxmen Studio</span>
      </div>
    </div>
  );
}
