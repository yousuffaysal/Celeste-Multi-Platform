"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CelesteMark, Spark, I } from "@/components/icons";

/* ─── hooks ─── */
function useInView(threshold = 0.14) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis] as const;
}

function useCounter(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ─── animation primitives ─── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(30px)",
      transition: `opacity .6s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .6s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const [ref, vis] = useInView(0.08);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "scale(1)" : "scale(.9)",
      transition: `opacity .52s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .52s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function SlideFrom({ children, from = "right", delay = 0 }: {
  children: React.ReactNode; from?: "left" | "right"; delay?: number;
}) {
  const [ref, vis] = useInView(0.06);
  const tx = from === "left" ? "-52px" : "52px";
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateX(0)" : `translateX(${tx})`,
      transition: `opacity .7s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .7s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* Cinematic clip-up word reveal — each word slides from below its overflow container */
function WordReveal({ text, className = "", style = {} }: {
  text: string; className?: string; style?: React.CSSProperties;
}) {
  const [ref, vis] = useInView(0.06);
  return (
    <div ref={ref} className={className} style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0 .28em" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit" }}>
          <span style={{
            display: "inline-block",
            transform: vis ? "translateY(0)" : "translateY(110%)",
            transition: `transform .72s cubic-bezier(.22,.61,.36,1) ${i * 52}ms`,
          }}>{w}</span>
        </span>
      ))}
    </div>
  );
}

/* Animated number stat */
function StatCard({ value, suffix = "", label, delay = 0 }: {
  value: number; suffix?: string; label: string; delay?: number;
}) {
  const [ref, vis] = useInView(0.12);
  const count = useCounter(value, 2100, vis);
  return (
    <div ref={ref} style={{
      textAlign: "center", padding: "0 28px",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .6s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .6s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(40px,5.5vw,66px)", lineHeight: 1, letterSpacing: "-3px",
        background: "linear-gradient(130deg, var(--yellow) 0%, #fffacd 55%, var(--yellow) 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        width: 28, height: 2, background: "rgba(251,226,73,.4)", borderRadius: 1,
        margin: "12px auto",
        transformOrigin: "center",
        transform: vis ? "scaleX(1)" : "scaleX(0)",
        transition: `transform .7s cubic-bezier(.4,0,.2,1) ${delay + 250}ms`,
      }} />
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "rgba(255,255,255,.45)", letterSpacing: ".01em" }}>{label}</div>
    </div>
  );
}

/* Clip-path reveal for block elements */
function ClipReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, vis] = useInView(0.08);
  return (
    <div ref={ref} style={{
      clipPath: vis ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      transition: `clip-path .88s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Hero right-side UI preview ─── */
function HeroVisual({ mounted }: { mounted: boolean }) {
  const results = [
    { name: "Earth Mug Co.", price: "$34", match: "98%", bg: "hsla(140,55%,18%,.55)" },
    { name: "Studio Mori",   price: "$28", match: "94%", bg: "hsla(25,50%,28%,.55)" },
    { name: "Clay & Co.",    price: "$38", match: "91%", bg: "hsla(200,40%,22%,.55)" },
  ];
  return (
    <div style={{ position: "relative" }}>
      {/* Glow behind card */}
      <div style={{ position: "absolute", inset: -80, background: "radial-gradient(ellipse, rgba(251,226,73,.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Main card */}
      <div style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.09)",
        borderRadius: 24, padding: 14,
        backdropFilter: "blur(20px)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(28px) scale(.97)",
        transition: "opacity .9s .3s cubic-bezier(.4,0,.2,1), transform .9s .3s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Search row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 13, padding: "11px 15px", marginBottom: 10,
        }}>
          <Spark size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.38)", fontFamily: "var(--font-ui)", fontStyle: "italic", lineHeight: 1.4 }}>
            "handmade ceramic mug, earthy tones under $40"
          </span>
        </div>

        {/* Label row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 4px 8px" }}>
          <span style={{ fontSize: 10.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "rgba(255,255,255,.28)", letterSpacing: ".1em", textTransform: "uppercase" }}>AI Results</span>
          <span style={{ fontSize: 10.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: "rgba(251,226,73,.6)" }}>2.4M+ searched</span>
        </div>

        {/* Result grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)",
              borderRadius: 13, padding: 11,
              gridColumn: i === 2 ? "span 2" : "auto",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: `opacity .5s ${.65 + i * .11}s, transform .5s ${.65 + i * .11}s`,
            }}>
              <div style={{ height: 68, borderRadius: 9, background: r.bg, border: "1px solid rgba(255,255,255,.06)", marginBottom: 9 }} />
              <div style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: "rgba(255,255,255,.75)", marginBottom: 7 }}>{r.name}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--yellow)" }}>{r.price}</span>
                <span style={{ fontSize: 10, background: "rgba(1,97,78,.55)", color: "#6ee7b7", padding: "2px 7px", borderRadius: 99, fontFamily: "var(--font-ui)", fontWeight: 700 }}>{r.match}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "AI-powered" badge */}
      <div style={{
        position: "absolute", top: -16, right: -16,
        background: "var(--yellow)", color: "var(--green-deep)",
        borderRadius: 99, padding: "7px 15px",
        fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 800,
        display: "flex", alignItems: "center", gap: 5,
        boxShadow: "0 8px 28px rgba(251,226,73,.38), 0 0 0 1px rgba(251,226,73,.2)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1) rotate(-3deg)" : "scale(.75) rotate(-3deg)",
        transition: "opacity .45s 1.05s, transform .45s 1.05s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <Spark size={11} /> AI-powered
      </div>

      {/* "Matched in" live dot badge */}
      <div style={{
        position: "absolute", bottom: -14, left: 18,
        background: "rgba(4,12,9,.85)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,.09)",
        borderRadius: 99, padding: "5px 13px",
        fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: "rgba(255,255,255,.55)",
        display: "flex", alignItems: "center", gap: 7,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .45s 1.25s, transform .45s 1.25s",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
        Matched in 0.3s
      </div>
    </div>
  );
}

/* ─── Steps section ─── */
type Step = { num: string; icon: (p?: { size?: number; style?: React.CSSProperties }) => React.ReactElement; title: string; body: string };

function StepsSection({ steps }: { steps: Step[] }) {
  const [lineRef, lineVis] = useInView(0.1);
  return (
    <div className="about-steps-row" ref={lineRef}>
      {/* Animated connector line behind circles */}
      <div className="about-step-connector" style={{
        position: "absolute", top: 30, left: "calc(16.67% + 30px)", right: "calc(16.67% + 30px)", height: 1,
        background: "var(--border)", zIndex: 0,
        transformOrigin: "left",
        transform: lineVis ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 1.1s cubic-bezier(.4,0,.2,1) .25s",
      }} />
      {steps.map((s, i) => (
        <FadeUp key={s.num} delay={i * 100}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              width: 62, height: 62, borderRadius: "50%",
              background: i === 1 ? "var(--green)" : "var(--surface)",
              border: `1.5px solid ${i === 1 ? "var(--green)" : "var(--border)"}`,
              display: "grid", placeItems: "center", marginBottom: 22,
              boxShadow: i === 1 ? "0 0 0 7px rgba(1,97,78,.09), 0 8px 28px rgba(1,97,78,.22)" : "none",
            }}>
              <s.icon size={22} style={{ color: i === 1 ? "#fff" : "var(--green)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 800, color: "var(--green)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>{s.num}</div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 9 }}>{s.title}</div>
            <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.68, maxWidth: 230, margin: "0 auto" }}>{s.body}</div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}

/* ─── Timeline section ─── */
type TLItem = { year: string; title: string; body: string };

function TimelineSection({ items }: { items: TLItem[] }) {
  const [ref, vis] = useInView(0.04);
  return (
    <div ref={ref} style={{ position: "relative", paddingLeft: 44 }}>
      {/* Vertical line — draws top-to-bottom */}
      <div style={{
        position: "absolute", left: 6, top: 8, bottom: 8, width: 2,
        background: "linear-gradient(to bottom, var(--green) 0%, var(--yellow) 100%)",
        borderRadius: 1, transformOrigin: "top",
        transform: vis ? "scaleY(1)" : "scaleY(0)",
        transition: "transform 1.5s cubic-bezier(.4,0,.2,1) .1s",
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {items.map((item, i) => (
          <SlideFrom key={item.year} from="right" delay={i * 90}>
            <div style={{ position: "relative" }}>
              {/* Dot on line */}
              <div style={{
                position: "absolute", left: -40, top: 20,
                width: 16, height: 16, borderRadius: "50%",
                background: i < 2 ? "var(--green)" : "var(--yellow)",
                border: "3px solid var(--surface-2)",
                boxShadow: "0 0 0 5px " + (i < 2 ? "rgba(1,97,78,.12)" : "rgba(251,226,73,.18)"),
              }} />
              <div className="card" style={{ padding: "20px 24px" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 11.5, color: i < 2 ? "var(--green)" : "#b28800", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>{item.year}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", marginBottom: 7 }}>{item.title}</div>
                <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.66 }}>{item.body}</div>
              </div>
            </div>
          </SlideFrom>
        ))}
      </div>
    </div>
  );
}

/* ─── Eyebrow chip ─── */
function Eyebrow({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 18,
      background: dark ? "rgba(251,226,73,.09)" : "var(--green-tint)",
      border: `1px solid ${dark ? "rgba(251,226,73,.18)" : "rgba(1,97,78,.12)"}`,
      borderRadius: 99, padding: "5px 14px 5px 10px",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dark ? "var(--yellow)" : "var(--green)", flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: dark ? "var(--yellow)" : "var(--green)", letterSpacing: ".07em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ─── Page ─── */
export default function AboutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const tickers = [
    "AI-native shopping", "Calm commerce", "8,400+ sellers", "124K+ shoppers",
    "2.4M+ listings", "Buyer protection", "Smart sets", "Verified vendors",
    "Instant checkout", "Live AI search", "Zero confusion", "Trusted platform",
  ];

  const steps: Step[] = [
    { num: "01", icon: I.chat,  title: "Describe it naturally",  body: "Type a sentence. Celeste reads intent, context, and nuance — not just keywords." },
    { num: "02", icon: I.wand,  title: "AI finds the perfect fit", body: "2.4M+ verified listings scanned and ranked by relevance, quality, and seller trust." },
    { num: "03", icon: I.truck, title: "One cart, one checkout",  body: "Mix items across any vendor. Single payment. Full buyer protection on every order." },
  ];

  const values = [
    { icon: I.shieldcheck, title: "Trust by default",    body: "Every seller is verified. Every order protected. No grey zones, ever." },
    { icon: I.wand,        title: "AI that earns it",    body: "Recommendations are grounded in real inventory — not bids, not sponsors." },
    { icon: I.heart,       title: "Calm UX",             body: "No dark patterns, no fake urgency. Shopping that respects your time." },
    { icon: I.users,       title: "Sellers first",       body: "AI pricing, demand signals, and real analytics — for shops of every size." },
    { icon: I.activity,    title: "Transparent data",    body: "You own your data. We never sell it. Full export available anytime." },
    { icon: I.gift,        title: "Built to last",       body: "Ethical sourcing signals and carbon-neutral shipping options, built in." },
  ];

  const timeline: TLItem[] = [
    { year: "2024", title: "Concept born at Foxmen Studio", body: "Foxmen Studio set out to reimagine e-commerce — what if shopping started with a sentence, not a search bar?" },
    { year: "2025", title: "Design & prototype",            body: "The Celeste concept took shape: AI-native, multivendor, one cart. Built as a flagship studio product." },
    { year: "2025", title: "Full platform build",           body: "From design system to AI assistant, visual search, vendor dashboard, and real-time checkout — all crafted in-house." },
    { year: "2026", title: "Celeste concept launch",        body: "Launched publicly as a Foxmen Studio concept product — a vision of what calm, intelligent commerce should feel like." },
  ];

  const avatars = ["#2d6a4f", "#52b788", "#74c69d", "#b7e4c7"];

  /* Reusable dark CTA button */
  const DarkBtn = ({ label, icon, onClick, primary }: { label: string; icon?: React.ReactNode; onClick: () => void; primary?: boolean }) => (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      height: 52, padding: "0 28px", borderRadius: 99,
      background: primary ? "var(--yellow)" : "transparent",
      color: primary ? "var(--green-deep)" : "rgba(255,255,255,.7)",
      border: primary ? "none" : "1px solid rgba(255,255,255,.15)",
      fontFamily: "var(--font-ui)", fontWeight: primary ? 800 : 600, fontSize: 15,
      cursor: "pointer", flexShrink: 0,
      boxShadow: primary ? "0 8px 28px rgba(251,226,73,.32)" : "none",
      transition: "transform .14s, box-shadow .14s, border-color .14s, color .14s",
    }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement;
        if (primary) { b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 12px 38px rgba(251,226,73,.44)"; }
        else { b.style.borderColor = "rgba(255,255,255,.32)"; b.style.color = "#fff"; }
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement;
        if (primary) { b.style.transform = ""; b.style.boxShadow = "0 8px 28px rgba(251,226,73,.32)"; }
        else { b.style.borderColor = "rgba(255,255,255,.15)"; b.style.color = "rgba(255,255,255,.7)"; }
      }}
    >
      {icon}{label}
    </button>
  );

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", background: "#070d0a",
        position: "relative", overflow: "hidden", display: "flex", alignItems: "center",
      }}>
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.045) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

        {/* Ambient glows */}
        <div className="about-glow-a" style={{ position: "absolute", right: "-8%", top: "15%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.11) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-4%", bottom: "-5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.28) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "45%", top: "-8%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Subtle horizontal grid lines */}
        <div style={{ position: "absolute", top: "32%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,.035)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "68%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,.035)", pointerEvents: "none" }} />

        <div className="about-container" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 80, paddingBottom: 100 }}>
          <div className="about-hero-grid">

            {/* Left content */}
            <div>
              {/* Eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)",
                borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 28,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(14px)",
                transition: "opacity .5s .06s, transform .5s .06s",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>AI-native marketplace</span>
              </div>

              {/* Headline — line 1 white, line 2 gradient */}
              <WordReveal
                text="Where calm"
                className="t-display"
                style={{ color: "#fff", fontSize: "clamp(44px,6.2vw,90px)", lineHeight: 1.02, letterSpacing: "-3px" }}
              />
              <WordReveal
                text="meets commerce."
                className="t-display"
                style={{
                  fontSize: "clamp(44px,6.2vw,90px)", lineHeight: 1.02, letterSpacing: "-3px", marginBottom: 30,
                  background: "linear-gradient(110deg, var(--yellow) 0%, #fffde0 55%, var(--yellow) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              />

              {/* Subtitle */}
              <div style={{
                maxWidth: 460, color: "rgba(255,255,255,.46)", fontSize: 16.5, lineHeight: 1.75, marginBottom: 38,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(14px)",
                transition: "opacity .6s .48s, transform .6s .48s",
              }}>
                Built on a single belief: finding the right product should be effortless, honest, and a little magical. So we built AI that actually earns your trust.
              </div>

              {/* CTA buttons */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36,
                opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
                transition: "opacity .5s .68s, transform .5s .68s",
              }}>
                <DarkBtn label="Try Celeste AI" icon={<Spark size={15} />} onClick={() => router.push("/assistant")} primary />
                <DarkBtn label="Become a seller →" onClick={() => router.push("/sell")} />
              </div>

              {/* Trust row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 13,
                opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
                transition: "opacity .5s .88s, transform .5s .88s",
              }}>
                <div style={{ display: "flex" }}>
                  {avatars.map((bg, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: "50%", background: bg,
                      border: "2px solid #070d0a", marginLeft: i ? -9 : 0,
                      display: "grid", placeItems: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "var(--font-ui)",
                      zIndex: avatars.length - i, position: "relative",
                    }}>
                      {["A","M","J","K"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontFamily: "var(--font-ui)", fontWeight: 600, color: "rgba(255,255,255,.65)", lineHeight: 1.3 }}>124,000+ shoppers</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.28)", marginTop: 2 }}>already shopping smarter</div>
                </div>
              </div>
            </div>

            {/* Right: UI preview */}
            <div className="about-hero-visual">
              <HeroVisual mounted={mounted} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          opacity: mounted ? .35 : 0, transition: "opacity 1s 1.6s",
        }}>
          <span style={{ fontSize: 10, fontFamily: "var(--font-ui)", color: "rgba(255,255,255,.5)", letterSpacing: ".15em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,.22)", borderRadius: 1 }} />
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────── */}
      <section style={{ background: "var(--yellow)", padding: "15px 0", overflow: "hidden" }}>
        <div className="about-marquee-track">
          {[...tickers, ...tickers].map((t, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 16, padding: "0 24px",
              fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12.5,
              color: "var(--green-deep)", letterSpacing: ".05em", textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              {t}
              <svg width="4" height="4" viewBox="0 0 4 4"><circle cx="2" cy="2" r="2" fill="currentColor" opacity=".3" /></svg>
            </span>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--surface)" }}>
        <div className="about-container">
          <div className="about-manifesto-grid">
            <div>
              <FadeUp><Eyebrow label="Manifesto" /></FadeUp>
              <WordReveal
                text="We built the marketplace we always wanted to shop at."
                className="t-h2"
                style={{ fontSize: "clamp(26px,3.4vw,44px)", color: "var(--text-primary)", lineHeight: 1.16, marginBottom: 20 }}
              />
              <FadeUp delay={160}>
                <p style={{ color: "var(--text-secondary)", fontSize: 15.5, lineHeight: 1.8 }}>
                  Celeste is a concept product by <strong>Foxmen Studio</strong> — born from a simple frustration: marketplaces bury good products under ads and dark patterns. We reimagined it from scratch with one rule: the intelligence works for the buyer, not the algorithm.
                </p>
              </FadeUp>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: I.wand,   title: "Semantic search",   body: "Understands intent, not just keywords" },
                { icon: I.star,   title: "Curated sellers",   body: "Every shop reviewed before listing" },
                { icon: I.inbox,  title: "Unified cart",      body: "One checkout across all stores" },
                { icon: I.target, title: "No dark patterns",  body: "No fake urgency, no hidden fees" },
              ].map((c, i) => (
                <ScaleIn key={c.title} delay={i * 65}>
                  <div className="card" style={{ padding: "20px 18px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-tint)", display: "grid", placeItems: "center", marginBottom: 11 }}>
                      <c.icon size={17} style={{ color: "var(--green)" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 5 }}>{c.title}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>{c.body}</div>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="about-section" style={{ background: "#070d0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div className="about-glow-b" style={{ position: "absolute", left: "-3%", bottom: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.32) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div className="about-container" style={{ position: "relative", zIndex: 1 }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 68 }}>
              <Eyebrow label="By the numbers" dark />
              <h2 className="t-h2" style={{ color: "#fff", fontSize: "clamp(28px,4vw,50px)" }}>Real scale, real people.</h2>
            </div>
          </FadeUp>
          <div className="about-stats-grid">
            <StatCard value={124000}  suffix="+"  label="Active shoppers"    delay={0} />
            <StatCard value={8400}    suffix="+"  label="Verified sellers"   delay={110} />
            <StatCard value={2400000} suffix="+"  label="Live listings"      delay={220} />
            <StatCard value={98}      suffix="%"  label="Satisfaction score" delay={330} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--surface-2)" }}>
        <div className="about-container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Eyebrow label="How it works" />
              <h2 className="t-h2" style={{ fontSize: "clamp(26px,3.4vw,46px)", color: "var(--text-primary)" }}>Three steps to anything.</h2>
            </div>
          </FadeUp>
          <StepsSection steps={steps} />
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--surface)" }}>
        <div className="about-container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Eyebrow label="What we stand for" />
              <h2 className="t-h2" style={{ fontSize: "clamp(26px,3.4vw,46px)", color: "var(--text-primary)" }}>Values without exceptions.</h2>
            </div>
          </FadeUp>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 65}>
                <div className="card" style={{ padding: "24px 20px", height: "100%", cursor: "default", transition: "transform .22s, box-shadow .22s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "var(--shadow-hover)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--green-tint)", display: "grid", placeItems: "center", marginBottom: 13 }}>
                    <v.icon size={18} style={{ color: "var(--green)" }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 7 }}>{v.title}</div>
                  <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>{v.body}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--surface-2)" }}>
        <div className="about-container">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Eyebrow label="Our journey" />
              <h2 className="t-h2" style={{ fontSize: "clamp(26px,3.4vw,46px)", color: "var(--text-primary)" }}>From idea to impact.</h2>
            </div>
          </FadeUp>
          <TimelineSection items={timeline} />
        </div>
      </section>

      {/* ── QUOTE ─────────────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--surface)" }}>
        <div className="about-container">
          <ClipReveal>
            <div style={{
              background: "linear-gradient(135deg, var(--green-tint) 0%, rgba(251,226,73,.06) 100%)",
              borderRadius: 28, padding: "60px 64px", border: "1px solid var(--border)",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "var(--yellow)", opacity: .07, pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: -20, bottom: -20, width: 130, height: 130, borderRadius: "50%", background: "var(--green)", opacity: .08, pointerEvents: "none" }} />
              <div className="about-spark-spin" style={{ display: "inline-grid", marginBottom: 22 }}>
                <Spark size={30} style={{ color: "var(--green)" }} />
              </div>
              <WordReveal
                text='"Good technology should disappear. Only the joy of finding the right thing should remain."'
                className="t-h3"
                style={{ fontSize: "clamp(17px,2.3vw,27px)", color: "var(--text-primary)", lineHeight: 1.48, maxWidth: 660, margin: "0 auto 18px", fontStyle: "italic" }}
              />
              <FadeUp delay={320}>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--text-muted)" }}>— Yousuf H Faysal, Foxmen Studio</div>
              </FadeUp>
            </div>
          </ClipReveal>
        </div>
      </section>

      {/* ── FOXMEN STUDIO CREDIT ─────────────────────── */}
      <section className="about-section" style={{ background: "#070d0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div className="about-container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
            <FadeUp>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)", borderRadius: 99, padding: "5px 16px 5px 10px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)" }} />
                <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>A Foxmen Studio Concept</span>
              </div>
            </FadeUp>

            <FadeUp delay={80}>
              {/* Foxmen Studio logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <img
                    src="https://icon.horse/icon/foxmenstudio.com"
                    alt="Foxmen Studio"
                    style={{ width: 40, height: 40, objectFit: "contain" }}
                    onError={e => {
                      const img = e.currentTarget;
                      img.src = "https://www.google.com/s2/favicons?sz=128&domain=foxmenstudio.com";
                      img.onerror = () => { img.style.display = "none"; };
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#fff", letterSpacing: "-.4px" }}>Foxmen Studio</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-ui)", marginTop: 2 }}>Design & Technology Studio</div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={160}>
              <p style={{ color: "rgba(255,255,255,.52)", fontSize: 16, lineHeight: 1.8, maxWidth: 560 }}>
                Celeste is a concept product created by <span style={{ color: "rgba(255,255,255,.85)", fontWeight: 500 }}>Foxmen Studio</span> — a design and technology studio focused on building thoughtful, human-centred digital products. Celeste explores a vision of what calm, intelligent commerce could feel like.
              </p>
            </FadeUp>

            <FadeUp delay={220}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,.35)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>Designed & built by</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--yellow)" }}>Yousuf H Faysal</div>
                </div>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.12)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,.35)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>Studio</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "#fff" }}>Foxmen Studio</div>
                </div>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.12)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,.35)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>Year</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "#fff" }}>2026</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="about-section" style={{ background: "#070d0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div className="about-glow-a" style={{ position: "absolute", right: "-4%", bottom: "-12%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="about-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <FadeUp>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)", borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 26 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)" }} />
              <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>Ready to shop smarter?</span>
            </div>
          </FadeUp>
          <WordReveal
            text="Start your Celeste journey."
            className="t-display"
            style={{ color: "#fff", fontSize: "clamp(32px,5vw,74px)", lineHeight: 1.04, letterSpacing: "-2.5px", marginBottom: 16 }}
          />
          <FadeUp delay={260}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16.5, maxWidth: 420, margin: "0 auto 42px", lineHeight: 1.72 }}>
              Join 124,000+ shoppers who found better buying through AI.
            </p>
          </FadeUp>
          <FadeUp delay={400}>
            <div style={{ display: "flex", justifyContent: "center", gap: 13, flexWrap: "wrap" }}>
              <DarkBtn label="Try Celeste AI" icon={<Spark size={15} />} onClick={() => router.push("/assistant")} primary />
              <DarkBtn label="Sell on Celeste →" onClick={() => router.push("/sell")} />
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );

}
