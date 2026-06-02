"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";

/* ─── useInView ─── */
function useInView(threshold = 0.1) {
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

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(26px)",
      transition: `opacity .58s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .58s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

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

/* ─── Check icon for feature list ─── */
function Tick({ ok, na }: { ok?: boolean; na?: boolean }) {
  if (na) return <span style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1 }}>—</span>;
  if (!ok) return <I.close size={16} style={{ color: "#d4d4d4" }} />;
  return (
    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--green-tint)", display: "grid", placeItems: "center" }}>
      <I.check size={13} style={{ color: "var(--green)" }} />
    </div>
  );
}

/* ─── Plan card ─── */
interface Plan {
  id: string; name: string; badge?: string;
  desc: string; monthlyPrice: number | null; annualPrice: number | null;
  fee: string; cta: string; featured?: boolean;
  perks: string[];
}

function PlanCard({ plan, annual, delay = 0, onSelect }: { plan: Plan; annual: boolean; delay?: number; onSelect: (id: string) => void }) {
  const [ref, vis] = useInView(0.06);
  const price = annual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(30px)",
      transition: `opacity .6s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .6s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      <div style={{
        background: plan.featured ? "var(--green-deep)" : "var(--surface)",
        border: plan.featured ? "2px solid var(--green)" : "1.5px solid var(--border)",
        borderRadius: 22, padding: "32px 28px",
        position: "relative", overflow: "hidden",
        boxShadow: plan.featured ? "0 16px 48px rgba(1,97,78,.22)" : "var(--shadow-card)",
      }}>
        {/* Popular badge */}
        {plan.badge && (
          <div style={{
            position: "absolute", top: 20, right: 20,
            background: "var(--yellow)", color: "var(--green-deep)",
            borderRadius: 99, padding: "4px 12px",
            fontSize: 11, fontFamily: "var(--font-ui)", fontWeight: 800, letterSpacing: ".05em",
          }}>
            {plan.badge}
          </div>
        )}

        {/* Decorative circle for featured */}
        {plan.featured && (
          <div style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(251,226,73,.05)", pointerEvents: "none" }} />
        )}

        {/* Plan name */}
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: plan.featured ? "var(--yellow)" : "var(--green)", marginBottom: 8 }}>{plan.name}</div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
          {price === null ? (
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: "-2px", color: plan.featured ? "#fff" : "var(--text-primary)" }}>Custom</div>
          ) : price === 0 ? (
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: "-2px", color: plan.featured ? "#fff" : "var(--text-primary)" }}>Free</div>
          ) : (
            <>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: "-2px", color: plan.featured ? "#fff" : "var(--text-primary)" }}>
                ${price}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: plan.featured ? "rgba(255,255,255,.5)" : "var(--text-muted)", marginBottom: 6 }}>/mo</div>
            </>
          )}
        </div>

        {/* Fee */}
        <div style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", color: plan.featured ? "rgba(255,255,255,.55)" : "var(--text-secondary)", marginBottom: 6 }}>{plan.fee}</div>

        {/* Description */}
        <div style={{ fontSize: 14, color: plan.featured ? "rgba(255,255,255,.6)" : "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>{plan.desc}</div>

        {/* Divider */}
        <div style={{ height: 1, background: plan.featured ? "rgba(255,255,255,.1)" : "var(--border)", marginBottom: 20 }} />

        {/* Perks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {plan.perks.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: plan.featured ? "rgba(251,226,73,.15)" : "var(--green-tint)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                <I.check size={12} style={{ color: plan.featured ? "var(--yellow)" : "var(--green)" }} />
              </div>
              <span style={{ fontSize: 13.5, color: plan.featured ? "rgba(255,255,255,.8)" : "var(--text-secondary)", lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onSelect(plan.id)}
          style={{
            width: "100%", height: 48, borderRadius: 99,
            background: plan.featured ? "var(--yellow)" : "transparent",
            color: plan.featured ? "var(--green-deep)" : "var(--green)",
            border: plan.featured ? "none" : "1.5px solid var(--green)",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
            cursor: "pointer",
            boxShadow: plan.featured ? "0 6px 20px rgba(251,226,73,.35)" : "none",
            transition: "transform .14s, box-shadow .14s, background .16s",
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement;
            if (plan.featured) { b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 10px 28px rgba(251,226,73,.45)"; }
            else { b.style.background = "var(--green-tint)"; }
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.transform = ""; b.style.boxShadow = plan.featured ? "0 6px 20px rgba(251,226,73,.35)" : "none";
            if (!plan.featured) b.style.background = "transparent";
          }}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );
}

/* ─── Compare table row ─── */
function CompareRow({ feature, vals, dark }: { feature: string; vals: (boolean | "na")[]; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="pricing-compare-grid"
      style={{ background: hov ? "var(--surface-2)" : (dark ? "var(--surface-2)" : "var(--surface)"), transition: "background .15s" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="pricing-compare-feature" style={{ padding: "14px 16px", fontSize: 14, color: "var(--text-secondary)", borderRight: "1px solid var(--border)" }}>{feature}</div>
      {vals.map((v, i) => (
        <div key={i} style={{ padding: "14px 16px", display: "flex", justifyContent: "center", alignItems: "center", borderRight: i < vals.length - 1 ? "1px solid var(--border)" : "none" }}>
          {v === "na" ? <Tick na /> : <Tick ok={v} />}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ─── */
export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      desc: "For new sellers getting their first sales. No monthly fee, just a small transaction cut.",
      monthlyPrice: 0,
      annualPrice: 0,
      fee: "5% per transaction",
      cta: "Start for free",
      perks: [
        "Up to 25 active listings",
        "Basic AI search visibility",
        "Celeste buyer protection",
        "Standard payouts (5 days)",
        "Community support",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      badge: "Most popular",
      desc: "For shops ready to scale. Lower fees, AI tools, and dedicated analytics.",
      monthlyPrice: 29,
      annualPrice: 23,
      fee: "2.5% per transaction",
      cta: "Start 14-day trial",
      featured: true,
      perks: [
        "Unlimited listings",
        "AI Growth Engine + demand signals",
        "Priority search placement",
        "Fast payouts (next day)",
        "Advanced analytics dashboard",
        "Email & chat support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      desc: "For established brands with high volume. Custom integrations and a dedicated account manager.",
      monthlyPrice: 79,
      annualPrice: 63,
      fee: "1.5% per transaction",
      cta: "Start 14-day trial",
      perks: [
        "Everything in Growth",
        "Branded storefront",
        "API access + webhooks",
        "Instant payouts",
        "Dedicated account manager",
        "Custom AI pricing rules",
        "Bulk import & export",
      ],
    },
  ];

  const compareGroups = [
    {
      title: "Listings & inventory",
      rows: [
        { feature: "Active listings",               vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Listing limit",                 vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Bulk import / CSV upload",      vals: [false, false, true ] as (boolean | "na")[] },
        { feature: "Product variants & bundles",    vals: [true,  true,  true ] as (boolean | "na")[] },
      ],
    },
    {
      title: "AI tools",
      rows: [
        { feature: "Basic AI search visibility",    vals: [true,  true,  true ] as (boolean | "na")[] },
        { feature: "AI Growth Engine",              vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Demand & trend signals",        vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "AI pricing suggestions",        vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Custom AI pricing rules",       vals: [false, false, true ] as (boolean | "na")[] },
      ],
    },
    {
      title: "Payments & payouts",
      rows: [
        { feature: "Transaction fee",               vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Payout speed",                  vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Instant payouts",               vals: [false, false, true ] as (boolean | "na")[] },
        { feature: "Multi-currency support",        vals: [true,  true,  true ] as (boolean | "na")[] },
      ],
    },
    {
      title: "Support & integrations",
      rows: [
        { feature: "Community support",             vals: [true,  true,  true ] as (boolean | "na")[] },
        { feature: "Email & live chat support",     vals: [false, true,  true ] as (boolean | "na")[] },
        { feature: "Dedicated account manager",     vals: [false, false, true ] as (boolean | "na")[] },
        { feature: "API access + webhooks",         vals: [false, false, true ] as (boolean | "na")[] },
        { feature: "Branded storefront URL",        vals: [false, false, true ] as (boolean | "na")[] },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    if (id === "starter") router.push("/sell");
    else router.push("/sell");
  };

  const logos = ["Mori Ceramics", "Lumen Studio", "Fenwick & Co.", "Bloom Atelier", "The Rug House", "Nori Home"];

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "50vh", background: "#070d0a",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        paddingTop: 64, paddingBottom: 72,
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.042) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-6%", top: "5%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.09) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-4%", bottom: "-10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,97,78,.25) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)",
            borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 26,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .45s .06s, transform .45s .06s",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)" }} />
            <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>Simple pricing</span>
          </div>

          <WordReveal
            text="Pricing that grows with you."
            className="t-display"
            style={{ color: "#fff", fontSize: "clamp(38px,5.5vw,78px)", lineHeight: 1.04, letterSpacing: "-2.5px", justifyContent: "center", marginBottom: 20 }}
          />

          <div style={{
            maxWidth: 480, margin: "0 auto 36px", color: "rgba(255,255,255,.45)", fontSize: 16.5, lineHeight: 1.72,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .55s .5s, transform .55s .5s",
          }}>
            Start free, no credit card needed. Upgrade when you&apos;re ready — cancel any time.
          </div>

          {/* Monthly / Annual toggle */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 0,
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 99, padding: 4,
            opacity: mounted ? 1 : 0, transition: "opacity .5s .7s",
          }}>
            {[{ label: "Monthly", val: false }, { label: "Annual", val: true }].map(o => (
              <button key={o.label} onClick={() => setAnnual(o.val)} style={{
                height: 38, padding: "0 22px", borderRadius: 99,
                background: annual === o.val ? "#fff" : "transparent",
                color: annual === o.val ? "var(--green-deep)" : "rgba(255,255,255,.55)",
                border: "none", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                cursor: "pointer", transition: "background .2s, color .2s",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {o.label}
                {o.val && (
                  <span style={{
                    background: "var(--yellow)", color: "var(--green-deep)",
                    borderRadius: 99, padding: "2px 8px", fontSize: 10.5, fontWeight: 800,
                    opacity: annual === o.val ? 1 : 0.7,
                  }}>Save 20%</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN CARDS ── */}
      <section style={{ background: "var(--surface-2)", padding: "72px 0 88px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <div className="pricing-cards">
            {plans.map((p, i) => (
              <PlanCard key={p.id} plan={p} annual={annual} delay={i * 80} onSelect={handleSelect} />
            ))}
          </div>

          {/* Enterprise nudge */}
          <FadeUp delay={200}>
            <div style={{
              marginTop: 24, padding: "20px 28px", borderRadius: 16,
              background: "var(--surface)", border: "1.5px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>
                  Enterprise — built for high-volume brands
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>Custom fee structure, SLA, white-label storefronts, and dedicated infrastructure.</div>
              </div>
              <button
                onClick={() => router.push("/contact")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 20px", borderRadius: 99, background: "var(--green-deep)", color: "#fff", border: "none", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, cursor: "pointer", flexShrink: 0, transition: "transform .14s, box-shadow .14s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 8px 24px rgba(0,59,47,.28)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "none"; }}
              >
                Talk to sales <I.arrowright size={15} />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TRUST LOGOS ── */}
      <section style={{ background: "var(--surface)", padding: "52px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <FadeUp>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ fontSize: 12.5, fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>
                Trusted by 8,400+ sellers including
              </div>
              <div className="pricing-logos" style={{ justifyContent: "center" }}>
                {logos.map((l, i) => (
                  <div key={i} style={{
                    height: 36, padding: "0 18px", borderRadius: 99,
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center",
                    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
                    color: "var(--text-secondary)",
                  }}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FEATURE COMPARISON ── */}
      <section style={{ background: "var(--surface)", padding: "88px 0 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 className="t-h2" style={{ fontSize: "clamp(24px,3.5vw,42px)", marginBottom: 10 }}>Compare every feature</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Choose the plan that fits where you are — upgrade any time.</p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div style={{ border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              {/* Header row */}
              <div className="pricing-compare-grid" style={{ background: "var(--green-deep)" }}>
                <div className="pricing-compare-feature" style={{ padding: "16px 18px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,.5)", letterSpacing: ".08em", textTransform: "uppercase" }}>Feature</div>
                {plans.map((p, i) => (
                  <div key={i} style={{ padding: "16px 18px", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,.1)" }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 14, color: p.featured ? "var(--yellow)" : "#fff" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 2 }}>{p.fee}</div>
                  </div>
                ))}
              </div>

              {/* Group rows */}
              {compareGroups.map((g, gi) => (
                <React.Fragment key={g.title}>
                  <div className="pricing-compare-grid" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
                    <div className="pricing-compare-feature" style={{ padding: "10px 18px", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 11.5, color: "var(--green)", letterSpacing: ".1em", textTransform: "uppercase" }}>{g.title}</div>
                    {[0, 1, 2].map(i => <div key={i} style={{ borderLeft: "1px solid var(--border)" }} />)}
                  </div>
                  {g.rows.map((r, ri) => (
                    <div key={ri} style={{ borderTop: "1px solid var(--border)" }}>
                      <CompareRow feature={r.feature} vals={r.vals} dark={ri % 2 === 1} />
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* Footer CTA row */}
              <div className="pricing-compare-grid" style={{ background: "var(--surface-2)", borderTop: "1.5px solid var(--border)" }}>
                <div className="pricing-compare-feature" style={{ padding: "20px 18px" }} />
                {plans.map((p, i) => (
                  <div key={i} style={{ padding: "20px 14px", display: "flex", justifyContent: "center", borderLeft: "1px solid var(--border)" }}>
                    <button
                      onClick={() => handleSelect(p.id)}
                      style={{
                        height: 40, padding: "0 20px", borderRadius: 99,
                        background: p.featured ? "var(--green)" : "transparent",
                        color: p.featured ? "#fff" : "var(--green)",
                        border: p.featured ? "none" : "1.5px solid var(--green)",
                        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
                        cursor: "pointer", transition: "background .15s",
                      }}
                    >
                      {p.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--surface-2)", padding: "88px 0 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 className="t-h2" style={{ fontSize: "clamp(24px,3.5vw,40px)", marginBottom: 10 }}>Common questions</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Still have questions? <a href="/contact" style={{ color: "var(--green)", fontWeight: 600 }}>Chat with us →</a></p>
            </div>
          </FadeUp>
          <div>
            {[
              { q: "Can I change my plan later?", a: "Yes. Upgrade or downgrade any time from your seller dashboard. Changes take effect at the start of the next billing cycle. There are no cancellation fees." },
              { q: "What counts as a 'transaction fee'?", a: "The fee applies to each completed order placed through Celeste. Refunded orders are fee-exempt. The fee is calculated on the net order value, excluding shipping." },
              { q: "Is there a free trial on paid plans?", a: "Yes — Growth and Pro both include a 14-day free trial with no card required. You'll be reminded 3 days before the trial ends." },
              { q: "Do annual plans auto-renew?", a: "Annual subscriptions renew automatically. You'll receive an email 30 days before renewal. Cancel any time before that date with no charge." },
              { q: "Can I have more than one store?", a: "Each plan covers one storefront. For multi-brand operations, contact our enterprise team — we offer volume discounts for multi-store sellers." },
            ].map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 55} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#070d0a", padding: "88px 0 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-4%", bottom: "-12%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,226,73,.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <FadeUp>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,226,73,.08)", border: "1px solid rgba(251,226,73,.16)", borderRadius: 99, padding: "5px 15px 5px 10px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)" }} />
              <span style={{ fontSize: 11.5, fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--yellow)", letterSpacing: ".08em", textTransform: "uppercase" }}>Start selling today</span>
            </div>
          </FadeUp>
          <WordReveal
            text="Open your shop in minutes."
            className="t-display"
            style={{ color: "#fff", fontSize: "clamp(32px,5vw,68px)", lineHeight: 1.04, letterSpacing: "-2px", justifyContent: "center", marginBottom: 16 }}
          />
          <FadeUp delay={260}>
            <p style={{ color: "rgba(255,255,255,.42)", fontSize: 16.5, maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.72 }}>
              No listing fees on Starter. Upgrade only when you need more.
            </p>
          </FadeUp>
          <FadeUp delay={380}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/sell")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 28px", borderRadius: 99, background: "var(--yellow)", color: "var(--green-deep)", border: "none", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 28px rgba(251,226,73,.32)", transition: "transform .14s, box-shadow .14s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 12px 36px rgba(251,226,73,.44)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "0 8px 28px rgba(251,226,73,.32)"; }}
              >
                <Spark size={15} /> Start for free
              </button>
              <button
                onClick={() => router.push("/contact")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 26px", borderRadius: 99, background: "transparent", color: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.15)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "border-color .15s, color .15s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,.32)"; b.style.color = "#fff"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,.15)"; b.style.color = "rgba(255,255,255,.7)"; }}
              >
                Talk to sales →
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}

/* ─── FAQ item (reused from contact page pattern) ─── */
function FaqItem({ q, a, delay = 0 }: { q: string; a: string; delay?: number }) {
  const [open, setOpen] = useState(false);
  const [ref, vis] = useInView(0.04);
  return (
    <div ref={ref} className="faq-item" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(16px)",
      transition: `opacity .5s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .5s cubic-bezier(.4,0,.2,1) ${delay}ms`,
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
