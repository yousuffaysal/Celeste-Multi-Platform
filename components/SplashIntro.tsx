"use client";
import React, { useEffect, useState } from "react";
import { CelesteMark } from "./icons";

export default function SplashIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"hold" | "exit" | "done">("hold");

  useEffect(() => {
    // Hold briefly, then slide the white screen up
    const t1 = setTimeout(() => setPhase("exit"), 680);
    // Tell parent hero can start animating in
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 1280);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        /* Window-slide-up exit */
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit"
          ? "transform 0.62s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
      }}
    >
      {/* Logo mark pulses in */}
      <div style={{
        opacity: phase === "hold" ? 1 : 0,
        transform: phase === "hold" ? "scale(1)" : "scale(0.85)",
        transition: "opacity 0.3s, transform 0.3s",
      }}>
        <CelesteMark size={52} color="var(--green)" />
      </div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: "-0.5px",
        color: "var(--green)",
        opacity: phase === "hold" ? 1 : 0,
        transition: "opacity 0.25s",
      }}>
        Celeste
      </div>
    </div>
  );
}
