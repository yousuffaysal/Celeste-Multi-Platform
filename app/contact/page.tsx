"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";

/* ─── useInView ─── */
function useInView(threshold = 0.12) {
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

/* ─── animation wrappers ─── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .58s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .58s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function SlideIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, vis] = useInView(0.06);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateX(0)" : "translateX(40px)",
      transition: `opacity .65s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .65s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* Word-by-word cinematic reveal */
function WordReveal({ text, className = "", style = {} }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [ref, vis] = useInView(0.06);
  return (
    <div ref={ref} className={className} style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0 .28em" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit" }}>
          <span style={{
            display: "inline-block",
            transform: vis ? "translateY(0)" : "translateY(115%)",
            transition: `transform .7s cubic-bezier(.22,.61,.36,1) ${i * 50}ms`,
          }}>{w}</span>
        </span>
      ))}
    </div>
  );
}

/* ─── Floating-label field ─── */
interface FieldProps {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  type?: string; required?: boolean;
}
function Field({ id, label, value, onChange, type = "text", required }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={["cf-wrap", active ? (focused ? "cf-active" : "cf-filled") : ""].filter(Boolean).join(" ")}>
      <input
        id={id} type={type} value={value} required={required}
        placeholder=" "
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label className="cf-label" htmlFor={id}>{label}</label>
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value !== "";
  return (
    <div className={["cf-wrap cf-select-wrap", active ? (focused ? "cf-active" : "cf-filled") : ""].filter(Boolean).join(" ")}>
      <select
        id={id} value={value} required
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="" disabled hidden />
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <label className="cf-label" htmlFor={id}>{label}</label>
      <span className="cf-chevron"><I.chevdown size={16} /></span>
    </div>
  );
}

function TextareaField({ id, label, value, onChange, maxLen = 500 }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; maxLen?: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={["cf-wrap cf-textarea", active ? (focused ? "cf-active" : "cf-filled") : ""].filter(Boolean).join(" ")}>
      <textarea
        id={id} value={value} maxLength={maxLen}
        placeholder=" "
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
      />
      <label className="cf-label" htmlFor={id}>{label}</label>
      <div style={{ position: "absolute", bottom: 10, right: 14, fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-muted)", pointerEvents: "none" }}>
        {value.length}/{maxLen}
      </div>
    </div>
  );
}

/* ─── FAQ accordion item ─── */
function FaqItem({ q, a, delay = 0 }: { q: string; a: string; delay?: number }) {
  const [open, setOpen] = useState(false);
  const [ref, vis] = useInView(0.05);
  return (
    <div ref={ref} className="faq-item" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(18px)",
      transition: `opacity .52s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .52s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      <button className="faq-btn" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
          background: open ? "var(--green)" : "var(--surface-2)",
          display: "grid", placeItems: "center",
          transition: "background .18s, transform .26s cubic-bezier(.4,0,.2,1)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          color: open ? "#fff" : "var(--text-secondary)",
        }}>
          <I.chevdown size={14} />
        </span>
      </button>
      <div className="faq-body" style={{ maxHeight: open ? 300 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ paddingBottom: 18, fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.72 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── Contact channel card ─── */
function ChannelCard({ icon, title, sub, action, href, delay = 0 }: {
  icon: React.ReactNode; title: string; sub: string; action: string; href?: string; delay?: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <SlideIn delay={delay}>
      <a
        href={href ?? "#"}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          padding: "18px 18px", borderRadius: 16,
          border: `1.5px solid ${hov ? "var(--green)" : "var(--border)"}`,
          background: hov ? "var(--green-tint)" : "var(--surface)",
          textDecoration: "none",
          transition: "border-color .18s, background .18s, transform .18s",
          transform: hov ? "translateY(-2px)" : "none",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: hov ? "var(--green)" : "var(--green-tint)",
          display: "grid", placeItems: "center", flexShrink: 0,
          transition: "background .18s",
        }}>
          <span style={{ color: hov ? "#fff" : "var(--green)", display: "grid", transition: "color .18s" }}>{icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5, color: "var(--text-primary)", marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>{sub}</div>
          <div style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
            {action} <I.arrowright size={13} />
          </div>
        </div>
      </a>
    </SlideIn>
  );
}

/* ─── Page ─── */
export default function ContactPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1800);
  };

  const faqs = [
    { q: "How does the AI search actually work?", a: "Celeste uses a large language model to interpret your full query as intent — not keywords. It maps your description against semantic embeddings of every listing, considering material, style, price range, and seller trust signals." },
    { q: "Is my payment information safe?", a: "Yes. Celeste never stores raw card numbers. All payments are processed by Stripe using PCI-DSS Level 1 infrastructure. We hold purchase funds in escrow and release them to sellers only after you confirm delivery." },
    { q: "How do I become a verified seller?", a: "Go to celeste.shop/sell, complete your profile, upload a government ID, and connect a bank account. Our team reviews your application within 48 hours. AI trust scoring runs continuously after you launch." },
    { q: "What does buyer protection cover?", a: "All orders placed through Celeste are covered for 30 days. If your item arrives damaged, doesn't match the listing, or never arrives, we'll issue a full refund. No questions asked on first claim." },
    { q: "Can I use Celeste outside my country?", a: "Celeste currently ships to 42 countries. International orders support USD, EUR, GBP, and JPY at checkout. Local currency display is available in 18 markets. Expansion roadmap is updated quarterly." },
    { q: "How does the AI set management work?", a: "Sets are curated collections the AI creates based on your search history, wishlist, and style profile. They update dynamically as new matching inventory appears. You can edit, share, or purchase sets in one tap." },
  ];

  const reasons = [
    "General inquiry", "Vendor application", "Press & media", "Partnership",
    "Bug report", "Billing question", "Other",
  ];

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "52vh", background: "#070d0a",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        paddingTop: 60, paddingBottom: 70,
      }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.042) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        {/* Ambient */}
        <div style={{ position: "absolute", right: "-6%", top: "10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.09) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-4%", bottom: "-10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.25) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1, width: "100%" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)",
            borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 26,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .45s .06s, transform .45s .06s",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>Contact us</span>
          </div>

          {/* Headline */}
          <WordReveal
            text="We'd love to hear from you."
            className="t-display"
            style={{ color: "#fff", fontSize: "clamp(38px,5.5vw,78px)", lineHeight: 1.04, letterSpacing: "-2.5px", maxWidth: 720, marginBottom: 20 }}
          />

          {/* Sub */}
          <div style={{
            maxWidth: 500, color: "rgba(255,255,255,.45)", fontSize: 16.5, lineHeight: 1.72,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .55s .5s, transform .55s .5s",
          }}>
            Whether you're a shopper, seller, or just curious — send us a message and we'll get back within one business day.
          </div>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section style={{ background: "var(--surface)", padding: "88px 0 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <div className="contact-grid">

            {/* Left — form */}
            <FadeUp delay={0}>
              <div>
                <div style={{ marginBottom: 28 }}>
                  <h2 className="t-h2" style={{ fontSize: "clamp(22px,3vw,32px)", color: "var(--text-primary)", marginBottom: 8 }}>Send us a message</h2>
                  <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>Fill in the form and we'll route your message to the right team.</p>
                </div>

                {sent ? (
                  /* Success state */
                  <div style={{
                    background: "var(--green-tint)", border: "1.5px solid rgba(1,97,78,.18)",
                    borderRadius: 20, padding: "48px 36px", textAlign: "center",
                    animation: "fadeUp .5s cubic-bezier(.4,0,.2,1) both",
                  }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--green)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
                      <I.check size={26} style={{ color: "#fff" }} />
                    </div>
                    <div className="t-h3" style={{ color: "var(--text-primary)", marginBottom: 10 }}>Message sent!</div>
                    <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 340, margin: "0 auto 24px" }}>
                      Thanks for reaching out. We'll get back to {form.email || "you"} within one business day.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", reason: "", message: "" }); setAgreed(false); }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 20px", borderRadius: 99, border: "1.5px solid var(--green)", background: "transparent", color: "var(--green)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                    >
                      <I.refresh size={15} /> Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Name + Email row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Field id="name"  label="Full name"  value={form.name}  onChange={set("name")}  required />
                      <Field id="email" label="Email address" value={form.email} onChange={set("email")} type="email" required />
                    </div>

                    {/* Reason */}
                    <SelectField id="reason" label="Reason for contact" value={form.reason} onChange={set("reason")} options={reasons} />

                    {/* Message */}
                    <TextareaField id="message" label="Your message" value={form.message} onChange={set("message")} maxLen={500} />

                    {/* Agree */}
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                        style={{ accentColor: "var(--green)", width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        I agree to Celeste&apos;s{" "}
                        <a href="#" style={{ color: "var(--green)", fontWeight: 600 }}>Privacy Policy</a>
                        {" "}and consent to being contacted about my inquiry.
                      </span>
                    </label>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || !agreed}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
                        height: 52, padding: "0 28px", borderRadius: 99,
                        background: agreed ? "var(--green)" : "var(--surface-2)",
                        color: agreed ? "#fff" : "var(--text-muted)",
                        border: "none", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
                        cursor: agreed ? "pointer" : "not-allowed",
                        transition: "background .2s, color .2s, transform .14s, box-shadow .2s",
                        boxShadow: agreed ? "0 6px 22px rgba(1,97,78,.22)" : "none",
                        marginTop: 4, alignSelf: "flex-start",
                      }}
                      onMouseEnter={e => { if (agreed) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 30px rgba(1,97,78,.3)"; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = agreed ? "0 6px 22px rgba(1,97,78,.22)" : "none"; }}
                    >
                      {loading ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                            <path d="M12 2a10 10 0 0 1 0 20" strokeLinecap="round" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <><I.send size={16} /> Send message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeUp>

            {/* Right — info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FadeUp delay={80}>
                <div style={{ marginBottom: 6 }}>
                  <h3 className="t-h3" style={{ color: "var(--text-primary)", marginBottom: 6 }}>Other ways to reach us</h3>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>Prefer a direct line? We're here across multiple channels.</p>
                </div>
              </FadeUp>

              <ChannelCard
                icon={<I.chat size={19} />}
                title="Live chat"
                sub="Available Mon–Fri, 9am–6pm GMT. Average wait under 2 min."
                action="Start chat"
                href="#"
                delay={100}
              />
              <ChannelCard
                icon={<I.send size={19} />}
                title="Email support"
                sub="hello@celeste.shop — we respond within 24 hours."
                action="Send email"
                href="mailto:hello@celeste.shop"
                delay={180}
              />
              <ChannelCard
                icon={<I.globe size={19} />}
                title="Help center"
                sub="Browse 200+ guides and tutorials in our knowledge base."
                action="Browse docs"
                href="#"
                delay={260}
              />

              {/* Response time badge */}
              <SlideIn delay={340}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "var(--green-tint)", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid rgba(1,97,78,.1)",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1fba6e", flexShrink: 0, boxShadow: "0 0 0 3px rgba(31,186,110,.2)" }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--green)" }}>Avg. response time: 4h</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>Based on last 30 days</div>
                  </div>
                </div>
              </SlideIn>

              {/* Social row */}
              <SlideIn delay={420}>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>Follow us</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { label: "X / Twitter", icon: "𝕏" },
                      { label: "Instagram",   icon: "◻" },
                      { label: "LinkedIn",    icon: "in" },
                    ].map(s => (
                      <a key={s.label} href="#" title={s.label} style={{
                        width: 38, height: 38, borderRadius: 10,
                        border: "1.5px solid var(--border)", background: "var(--surface)",
                        display: "grid", placeItems: "center",
                        fontSize: 14, fontWeight: 800, fontFamily: "var(--font-ui)",
                        color: "var(--text-secondary)", textDecoration: "none",
                        transition: "border-color .15s, color .15s, background .15s",
                      }}
                        onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = "var(--green)"; a.style.color = "var(--green)"; a.style.background = "var(--green-tint)"; }}
                        onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = "var(--border)"; a.style.color = "var(--text-secondary)"; a.style.background = "var(--surface)"; }}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--surface-2)", padding: "88px 0 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--green-tint)", border: "1px solid rgba(1,97,78,.12)", borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--green)", letterSpacing: ".07em", textTransform: "uppercase" }}>FAQ</span>
              </div>
              <h2 className="t-h2" style={{ fontSize: "clamp(24px,3.4vw,42px)", color: "var(--text-primary)", marginBottom: 10 }}>Quick answers</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto" }}>Can't find what you need? Use the form above.</p>
            </div>
          </FadeUp>
          <div className="contact-faq-grid">
            <div>
              {faqs.slice(0, 3).map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 60} />
              ))}
            </div>
            <div>
              {faqs.slice(3).map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 60 + 30} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICE ── */}
      <section style={{ background: "#070d0a", padding: "88px 0 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { city: "London", role: "HQ & Engineering", addr: "12 Finsbury Sq, EC2A 1AX", flag: "🇬🇧" },
              { city: "Amsterdam", role: "Operations & Partnerships", addr: "Herengracht 182, 1016 BR", flag: "🇳🇱" },
              { city: "Singapore", role: "Asia-Pacific Growth", addr: "1 Raffles Place, #17-01", flag: "🇸🇬" },
            ].map((o, i) => (
              <FadeUp key={o.city} delay={i * 90}>
                <div style={{
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 20, padding: "28px 26px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>{o.flag}</span>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 17, color: "#fff" }}>{o.city}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <I.pin size={15} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.5)", lineHeight: 1.55 }}>{o.addr}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <I.users size={14} style={{ color: "rgba(255,255,255,.3)", flexShrink: 0 }} />
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.32)", fontFamily: "var(--font-ui)" }}>{o.role}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* spin keyframe for loading spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
