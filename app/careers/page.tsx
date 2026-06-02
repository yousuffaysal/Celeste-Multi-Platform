"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";

/* ── hooks ── */
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis] as const;
}

/* ── word-by-word clip reveal ── */
function WordReveal({ text, vis, delay = 0, style }: { text: string; vis: boolean; delay?: number; style?: React.CSSProperties }) {
  return (
    <span style={style}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit", marginRight: "0.26em" }}>
          <span style={{
            display: "inline-block",
            transform: vis ? "translateY(0)" : "translateY(115%)",
            transition: `transform .72s cubic-bezier(.22,.61,.36,1) ${delay + i * 55}ms`,
          }}>{w}</span>
        </span>
      ))}
    </span>
  );
}

/* ── eyebrow chip ── */
function Eyebrow({ label, yellow }: { label: string; yellow?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: yellow ? "rgba(251,226,73,.09)" : "rgba(1,97,78,.18)",
      border: `1px solid ${yellow ? "rgba(251,226,73,.22)" : "rgba(1,97,78,.4)"}`,
      borderRadius: 99, padding: "5px 16px 5px 10px", marginBottom: 22,
    }}>
      <Spark size={12} style={{ color: yellow ? "var(--yellow)" : "#52e8b8" }} />
      <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: yellow ? "var(--yellow)" : "#52e8b8", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ── value card ── */
function ValueCard({ icon, title, body, delay, vis }: { icon: React.ReactNode; title: string; body: string; delay: number; vis: boolean }) {
  return (
    <div style={{
      padding: "28px 26px",
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 18,
      backdropFilter: "blur(12px)",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .6s ${delay}ms, transform .6s ${delay}ms cubic-bezier(.22,.61,.36,1)`,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: "rgba(82,232,184,.1)",
        border: "1px solid rgba(82,232,184,.18)",
        display: "grid", placeItems: "center", marginBottom: 18,
      }}>
        <span style={{ color: "#52e8b4" }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15.5, color: "#fff", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>{body}</div>
    </div>
  );
}

/* ── perk badge ── */
function Perk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px",
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 14,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(251,226,73,.1)", border: "1px solid rgba(251,226,73,.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <span style={{ color: "var(--yellow)" }}>{icon}</span>
      </div>
      <span style={{ fontSize: 14, fontFamily: "var(--font-ui)", fontWeight: 500, color: "rgba(255,255,255,.75)" }}>{label}</span>
    </div>
  );
}

/* ── department tabs ── */
const DEPTS = ["All", "Engineering", "Design", "Marketing", "Operations"] as const;
type Dept = (typeof DEPTS)[number];

interface Role {
  title: string;
  dept: Exclude<Dept, "All">;
  location: string;
  type: string;
  level: string;
}

const ROLES: Role[] = [
  { title: "Senior Full-Stack Engineer",         dept: "Engineering", location: "London / Remote",    type: "Full-time", level: "Senior" },
  { title: "AI/ML Platform Engineer",            dept: "Engineering", location: "Remote",             type: "Full-time", level: "Senior" },
  { title: "Frontend Engineer — Design Systems", dept: "Engineering", location: "London / Remote",    type: "Full-time", level: "Mid" },
  { title: "Backend Engineer — Payments",        dept: "Engineering", location: "Amsterdam / Remote", type: "Full-time", level: "Mid" },
  { title: "Staff Product Designer",             dept: "Design",      location: "London",             type: "Full-time", level: "Staff" },
  { title: "Motion & Interaction Designer",      dept: "Design",      location: "Remote",             type: "Full-time", level: "Mid" },
  { title: "Brand Designer",                     dept: "Design",      location: "London / Remote",    type: "Full-time", level: "Mid" },
  { title: "Head of Growth Marketing",           dept: "Marketing",   location: "London",             type: "Full-time", level: "Lead" },
  { title: "Seller Marketing Manager",           dept: "Marketing",   location: "Remote",             type: "Full-time", level: "Mid" },
  { title: "Content Strategist",                 dept: "Marketing",   location: "Remote",             type: "Full-time", level: "Mid" },
  { title: "Head of Seller Operations",          dept: "Operations",  location: "London",             type: "Full-time", level: "Lead" },
  { title: "Trust & Safety Analyst",             dept: "Operations",  location: "London / Remote",    type: "Full-time", level: "Junior" },
];

const DEPT_COLORS: Record<Exclude<Dept, "All">, string> = {
  Engineering: "rgba(82,183,232,.15)",
  Design:      "rgba(232,82,183,.15)",
  Marketing:   "rgba(251,226,73,.12)",
  Operations:  "rgba(82,232,184,.12)",
};

const DEPT_TEXT: Record<Exclude<Dept, "All">, string> = {
  Engineering: "#52b7e8",
  Design:      "#e852b7",
  Marketing:   "var(--yellow)",
  Operations:  "#52e8b4",
};

function RoleCard({ role }: { role: Role }) {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push("/contact")}
      style={{
        display: "flex", alignItems: "center", gap: 20,
        padding: "20px 24px",
        background: hover ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.025)",
        border: `1px solid ${hover ? "rgba(255,255,255,.13)" : "rgba(255,255,255,.07)"}`,
        borderRadius: 16,
        cursor: "pointer",
        transition: "background .18s, border-color .18s, transform .18s",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{role.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, background: DEPT_COLORS[role.dept], color: DEPT_TEXT[role.dept], borderRadius: 99, padding: "3px 10px", fontFamily: "var(--font-ui)", fontWeight: 600 }}>{role.dept}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)", display: "flex", alignItems: "center", gap: 4 }}><I.pin size={11} />{role.location}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)" }}>{role.type}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.38)" }}>{role.level}</span>
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, color: hover ? "#fff" : "rgba(255,255,255,.3)", transition: "color .18s" }}>
        <span style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", fontWeight: 600 }}>Apply</span>
        <I.chevright size={15} />
      </div>
    </div>
  );
}

/* ── main page ── */
export default function CareersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dept, setDept] = useState<Dept>("All");

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const [valRef, valVis]   = useInView(0.1);
  const [perksRef, perksVis] = useInView(0.1);
  const [rolesRef, rolesVis] = useInView(0.1);
  const [ctaRef, ctaVis]   = useInView(0.15);

  const filteredRoles = dept === "All" ? ROLES : ROLES.filter(r => r.dept === dept);

  const values = [
    { icon: <I.rocket size={20} />, title: "Move fast, build carefully",   body: "We ship quickly but never sacrifice craft. Every pixel and every API endpoint is held to the same standard." },
    { icon: <I.users size={20} />,  title: "People over process",          body: "Great teams beat great processes. We hire brilliant people and trust them with real ownership from day one." },
    { icon: <I.globe size={20} />,  title: "Global by design",             body: "Celeste serves buyers and sellers across the world. That diversity shapes how we build, write, and design." },
    { icon: <I.wand size={20} />,   title: "AI as a collaborator",         body: "We build with AI, not around it. Every discipline uses intelligent tools to amplify human creativity." },
    { icon: <I.target size={20} />, title: "Default to transparency",      body: "We share what we know, including the uncomfortable parts. Clarity enables autonomy — ambiguity kills both." },
    { icon: <I.heart size={20} />,  title: "Craft is non-negotiable",      body: "We care deeply about the experience — for buyers, sellers, and the people building Celeste." },
  ];

  const perks = [
    { icon: <I.coins size={16} />,     label: "Competitive salary + equity" },
    { icon: <I.chart size={16} />,     label: "Annual performance bonus" },
    { icon: <I.cal size={16} />,       label: "Flexible remote-first working" },
    { icon: <I.gift size={16} />,      label: "£2,000/yr learning budget" },
    { icon: <I.shield size={16} />,    label: "Private health & dental" },
    { icon: <I.refresh size={16} />,   title: "refresh",  label: "Unlimited PTO (minimum 25 days)" },
    { icon: <I.bolt size={16} />,      label: "Latest hardware — your choice" },
    { icon: <I.pin size={16} />,       label: "London / Amsterdam / Singapore hubs" },
    { icon: <I.layers size={16} />,    label: "Parental leave — 26 weeks full pay" },
    { icon: <I.activity size={16} />,  label: "Wellness & fitness allowance" },
    { icon: <I.store size={16} />,     label: "£500 Celeste credits per year" },
    { icon: <I.users size={16} />,     label: "Annual team retreats" },
  ];

  return (
    <div style={{ background: "#070d0a", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: 100, paddingBottom: 96 }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.04) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        {/* Ambient glows */}
        <div style={{ position: "absolute", left: "10%", top: "10%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "5%", bottom: "0%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Horizontal hairlines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 50%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.06) 50%, transparent 100%)" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "opacity .5s .05s, transform .5s .05s",
            }}>
              <Eyebrow label="We're hiring" yellow />
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 1.06,
              letterSpacing: "-2.5px", marginBottom: 24, color: "#fff",
            }}>
              <WordReveal text="Build the future" vis={mounted} delay={80} style={{ display: "block" }} />{" "}
              <span style={{
                background: "linear-gradient(110deg, var(--yellow) 0%, #fffde0 55%, var(--yellow) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                display: "block",
              }}>
                <WordReveal text="of commerce." vis={mounted} delay={280} />
              </span>
            </h1>

            <p style={{
              fontSize: 18, color: "rgba(255,255,255,.5)", lineHeight: 1.7, maxWidth: 540, marginBottom: 36,
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
              transition: "opacity .55s .55s, transform .55s .55s",
            }}>
              Celeste is building the AI-native marketplace — a place where discovery feels effortless and selling is intelligent. Join a team that cares deeply about craft.
            </p>

            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
              transition: "opacity .5s .7s, transform .5s .7s",
            }}>
              <button
                onClick={() => { const el = document.getElementById("open-roles"); el?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ height: 50, padding: "0 28px", borderRadius: 99, background: "var(--yellow)", color: "#003B2F", border: "none", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "transform .14s, box-shadow .14s", boxShadow: "0 8px 28px rgba(251,226,73,.25)" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 12px 36px rgba(251,226,73,.35)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "0 8px 28px rgba(251,226,73,.25)"; }}
              >
                See open roles <I.arrowright size={16} />
              </button>
              <button
                onClick={() => router.push("/about")}
                style={{ height: 50, padding: "0 26px", borderRadius: 99, background: "transparent", color: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.15)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "background .15s, border-color .15s, color .15s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,.06)"; b.style.borderColor = "rgba(255,255,255,.25)"; b.style.color = "#fff"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.borderColor = "rgba(255,255,255,.15)"; b.style.color = "rgba(255,255,255,.7)"; }}
              >
                Our story <I.chevright size={15} />
              </button>
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 0, flexWrap: "wrap", marginTop: 64,
              borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 40,
              opacity: mounted ? 1 : 0, transition: "opacity .6s .9s",
            }}>
              {[
                { n: "80+",  label: "People globally" },
                { n: "3",    label: "Office hubs" },
                { n: "28",   label: "Avg. age of team" },
                { n: "100%", label: "Remote-friendly roles" },
              ].map((s, i) => (
                <div key={i} style={{ flex: "1 1 130px", paddingRight: 24, paddingBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.38)", marginTop: 5, fontFamily: "var(--font-ui)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div ref={valRef} style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 72px" }}>
        <div style={{ marginBottom: 48, opacity: valVis ? 1 : 0, transform: valVis ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s, transform .6s" }}>
          <Eyebrow label="Why Celeste" />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,4vw,42px)", color: "#fff", letterSpacing: "-1.2px", marginBottom: 12 }}>What we believe in</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.44)", lineHeight: 1.7, maxWidth: 500 }}>Six principles that shape how we hire, how we build, and how we treat each other.</p>
        </div>
        <div className="careers-values-grid">
          {values.map((v, i) => (
            <ValueCard key={i} {...v} delay={i * 80} vis={valVis} />
          ))}
        </div>
      </div>

      {/* ── Perks ── */}
      <div ref={perksRef} style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.018)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 80px" }}>
          <div style={{ marginBottom: 48, opacity: perksVis ? 1 : 0, transform: perksVis ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s, transform .6s" }}>
            <Eyebrow label="Benefits & Perks" yellow />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,4vw,42px)", color: "#fff", letterSpacing: "-1.2px", marginBottom: 12 }}>We invest in you</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.44)", lineHeight: 1.7, maxWidth: 480 }}>Beyond competitive compensation, we build an environment where you do the best work of your life.</p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
              opacity: perksVis ? 1 : 0,
              transform: perksVis ? "translateY(0)" : "translateY(18px)",
              transition: "opacity .65s .15s, transform .65s .15s",
            }}
          >
            {perks.map((p, i) => <Perk key={i} icon={p.icon} label={p.label} />)}
          </div>
        </div>
      </div>

      {/* ── Open Roles ── */}
      <div id="open-roles" ref={rolesRef} style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 72px" }}>
        <div style={{ marginBottom: 40, opacity: rolesVis ? 1 : 0, transform: rolesVis ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s, transform .6s" }}>
          <Eyebrow label="Open positions" />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,4vw,42px)", color: "#fff", letterSpacing: "-1.2px", marginBottom: 12 }}>Find your role</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.44)", lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>We're growing across every discipline. All roles are open to remote candidates unless stated otherwise.</p>

          {/* Dept filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DEPTS.map(d => (
              <button
                key={d}
                onClick={() => setDept(d)}
                style={{
                  height: 36, padding: "0 18px", borderRadius: 99, cursor: "pointer",
                  fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
                  background: dept === d ? "var(--yellow)" : "rgba(255,255,255,.06)",
                  color: dept === d ? "#003B2F" : "rgba(255,255,255,.6)",
                  border: dept === d ? "none" : "1px solid rgba(255,255,255,.1)",
                  transition: "background .15s, color .15s, border-color .15s",
                }}
              >
                {d}
                <span style={{ marginLeft: 6, opacity: .6, fontSize: 12 }}>
                  {d === "All" ? ROLES.length : ROLES.filter(r => r.dept === d).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          opacity: rolesVis ? 1 : 0, transition: "opacity .6s .2s",
        }}>
          {filteredRoles.map((r, i) => <RoleCard key={i} role={r} />)}
        </div>

        {/* Spontaneous application nudge */}
        <div style={{
          marginTop: 24,
          padding: "20px 24px",
          background: "rgba(255,255,255,.025)",
          border: "1px dashed rgba(255,255,255,.1)",
          borderRadius: 16,
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          opacity: rolesVis ? 1 : 0, transition: "opacity .6s .35s",
        }}>
          <I.wand size={18} style={{ color: "rgba(255,255,255,.35)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,.7)", marginBottom: 2 }}>Don&apos;t see the right fit?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.38)" }}>Send us a speculative application — we love hearing from exceptional people.</div>
          </div>
          <button
            onClick={() => router.push("/contact")}
            style={{ height: 38, padding: "0 20px", borderRadius: 99, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background .15s, color .15s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,.12)"; b.style.color = "#fff"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,.07)"; b.style.color = "rgba(255,255,255,.7)"; }}
          >
            Get in touch
          </button>
        </div>
      </div>

      {/* ── CTA ── */}
      <div ref={ctaRef} style={{ borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(1,97,78,.06)" }}>
        <div style={{
          maxWidth: 680, margin: "0 auto", padding: "80px 24px",
          textAlign: "center",
          opacity: ctaVis ? 1 : 0, transform: ctaVis ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .65s, transform .65s cubic-bezier(.22,.61,.36,1)",
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(1,97,78,.3)", border: "1px solid rgba(1,97,78,.5)", display: "grid", placeItems: "center", margin: "0 auto 24px" }}>
            <I.rocket size={24} style={{ color: "#52e8b4" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px,3.5vw,38px)", color: "#fff", letterSpacing: "-1px", marginBottom: 14 }}>
            Ready to shape what&apos;s next?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.44)", lineHeight: 1.7, marginBottom: 36 }}>
            We read every application. Tell us what excites you about Celeste and what you&apos;d build on day one.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => { const el = document.getElementById("open-roles"); el?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ height: 50, padding: "0 28px", borderRadius: 99, background: "var(--yellow)", color: "#003B2F", border: "none", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(251,226,73,.22)", transition: "transform .14s, box-shadow .14s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 12px 36px rgba(251,226,73,.32)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "0 8px 28px rgba(251,226,73,.22)"; }}
            >
              Browse open roles <I.arrowright size={16} />
            </button>
            <button
              onClick={() => router.push("/contact")}
              style={{ height: 50, padding: "0 26px", borderRadius: 99, background: "transparent", color: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.15)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "background .15s, color .15s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,.06)"; b.style.color = "#fff"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "rgba(255,255,255,.7)"; }}
            >
              Contact us <I.send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        .careers-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media(max-width: 860px) {
          .careers-values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media(max-width: 540px) {
          .careers-values-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
