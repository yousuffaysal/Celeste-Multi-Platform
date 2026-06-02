"use client";
import React, { useEffect, useRef } from "react";

export default function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const waves = [
        { amp: 38, freq: 0.0055, speed: 0.003, y: H * 0.52, alpha: 0.07 },
        { amp: 28, freq: 0.007,  speed: 0.004, y: H * 0.58, alpha: 0.05 },
        { amp: 48, freq: 0.004,  speed: 0.002, y: H * 0.62, alpha: 0.035 },
      ];

      waves.forEach(({ amp, freq, speed, y, alpha }) => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 2) {
          const yPos = y + Math.sin(x * freq + t * speed * 60) * amp
                         + Math.sin(x * freq * 1.7 + t * speed * 40) * (amp * 0.4);
          ctx.lineTo(x, yPos);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fill();
      });

      t += 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      background: "#ffffff",
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

