"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Spark, I } from "@/components/icons";
import AIChip from "@/components/AIChip";
import Ph from "@/components/Ph";
import { SHOPS, PRODUCTS, byId, money } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

function Stepper({ step }: { step: number }) {
  const labels = ["Cart", "Shipping", "Payment", "Done"];
  return (
    <div className="row gap-8" style={{ justifyContent: "center" }}>
      {labels.map((l, i) => {
        const n = i + 1;
        const on = step >= n;
        return (
          <React.Fragment key={l}>
            <div className="row gap-8">
              <span style={{ width: 28, height: 28, borderRadius: 99, background: on ? "var(--green)" : "var(--surface-2)", color: on ? "#fff" : "var(--text-muted)", display: "grid", placeItems: "center", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13 }}>
                {step > n ? <I.check size={15} /> : n}
              </span>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13.5, color: on ? "var(--text-primary)" : "var(--text-muted)" }} className="hide-mobile">{l}</span>
            </div>
            {i < 3 && <div style={{ width: 36, height: 2, background: step > n ? "var(--green)" : "var(--border)" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Row({ k, v, big, accent }: { k: string; v: string; big?: boolean; accent?: boolean }) {
  return (
    <div className="row" style={{ justifyContent: "space-between" }}>
      <span style={{ fontSize: big ? 17 : 14, fontFamily: "var(--font-ui)", fontWeight: big ? 700 : 400, color: big ? "var(--text-primary)" : "var(--text-secondary)" }}>{k}</span>
      <span style={{ fontSize: big ? 22 : 14.5, fontFamily: big ? "var(--font-display)" : "var(--font-ui)", fontWeight: big ? 600 : 500, color: big ? "var(--green)" : accent ? "var(--success)" : "var(--text-primary)" }}>{v}</span>
    </div>
  );
}

function Field({ label, ph, full, type = "text", value }: { label: string; ph: string; full?: boolean; type?: string; value?: string }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <label className="field-label">{label}</label>
      <input className="input" placeholder={ph} type={type} defaultValue={value} />
    </div>
  );
}

function ShippingForm() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="t-h3" style={{ marginBottom: 18 }}>Shipping address</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Full name" ph="Alex Morgan" value="Alex Morgan" />
        <Field label="Phone" ph="(555) 012-3456" />
        <Field label="Address" ph="123 Linden Ave" full />
        <Field label="City" ph="Portland" />
        <Field label="State / ZIP" ph="OR · 97201" />
      </div>
      <div className="col gap-12" style={{ marginTop: 22 }}>
        <b style={{ fontFamily: "var(--font-ui)", fontSize: 14 }}>Delivery speed</b>
        {[["Standard", "Free · Jun 3–5", true], ["Express", "$9 · Jun 1–2", false]].map(([t, d, on]) => (
          <label key={String(t)} className="card row gap-12" style={{ padding: 14, cursor: "pointer", borderColor: on ? "var(--green)" : "var(--border)" }}>
            <input type="radio" name="ship" defaultChecked={Boolean(on)} style={{ accentColor: "var(--green)", width: 16, height: 16 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>{String(t)}</div>
              <div className="t-detail">{String(d)}</div>
            </div>
            {on && <span className="badge badge-verified">Recommended</span>}
          </label>
        ))}
      </div>
    </div>
  );
}

function PaymentForm({ total }: { total: number }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="t-h3" style={{ marginBottom: 18 }}>Payment</h3>
      <div className="row gap-8" style={{ marginBottom: 18, flexWrap: "wrap" }}>
        {["Card", "PayPal", "Apple Pay", "Celeste Pay"].map((m, i) => (
          <button key={m} className={"chip" + (i === 0 ? " active" : "")}>
            {m === "Celeste Pay" && <Spark size={12} />}{m}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Card number" ph="4242 4242 4242 4242" full />
        <Field label="Expiry" ph="06 / 28" />
        <Field label="CVC" ph="123" />
        <Field label="Name on card" ph="Alex Morgan" full />
      </div>
      <label className="row gap-8" style={{ marginTop: 16, fontSize: 13.5, color: "var(--text-secondary)", cursor: "pointer" }}>
        <input type="checkbox" defaultChecked style={{ accentColor: "var(--green)", width: 15, height: 15 }} /> Save this card securely for next time
      </label>
      <div style={{ background: "var(--green-tint)", borderRadius: 12, padding: 14, marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
        <I.shield size={20} style={{ color: "var(--green)", flex: "0 0 auto" }} />
        <span style={{ fontSize: 13.5, color: "var(--green-deep)" }}>Your payment is encrypted and protected by Celeste Buyer Protection on all vendors.</span>
      </div>
    </div>
  );
}

function OrderConfirmed({ total }: { total: number }) {
  const router = useRouter();
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }} className="fade-in">
      <div style={{ width: 88, height: 88, borderRadius: 99, background: "var(--green)", display: "grid", placeItems: "center", margin: "0 auto", boxShadow: "0 12px 30px rgba(1,97,78,.3)" }}>
        <I.check size={44} style={{ color: "#fff" }} />
      </div>
      <h2 className="t-h2" style={{ marginTop: 24 }}>Order confirmed</h2>
      <p className="muted" style={{ marginTop: 8 }}>Thank you! We&apos;ve placed your order across all vendors. A receipt is on its way.</p>
      <div className="card" style={{ maxWidth: 420, margin: "28px auto 0", padding: 20, textAlign: "left" }}>
        <Row k="Order number" v="#CL-284910" />
        <hr className="divider" style={{ margin: "12px 0" }} />
        <Row k="Total paid" v={money(total + 8)} big />
        <div className="row gap-8" style={{ marginTop: 14, color: "var(--green)" }}>
          <I.truck size={17} />
          <span className="t-detail" style={{ color: "var(--green)" }}>Estimated arrival: Jun 3–5</span>
        </div>
      </div>
      <div className="row gap-12" style={{ justifyContent: "center", marginTop: 24 }}>
        <button className="btn btn-primary btn-lg" onClick={() => router.push("/")}>Continue shopping</button>
        <button className="btn btn-secondary btn-lg">Track order</button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { cart, setQty, addToCart } = useCart();
  const [step, setStep] = useState(1);

  const items = cart.map(c => ({ ...c, p: byId(c.id) })).filter(x => x.p);
  const groups: Record<string, typeof items> = {};
  items.forEach(x => { (groups[x.p!.shop] = groups[x.p!.shop] || []).push(x); });

  const subtotal = items.reduce((s, x) => s + (x.p!.price * x.qty), 0);
  const shipping = subtotal > 75 ? 0 : 6;
  const total = subtotal + shipping;
  const count = items.reduce((s, x) => s + x.qty, 0);

  if (items.length === 0 && step < 4) {
    return (
      <div className="container" style={{ padding: "90px 0", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 99, background: "var(--green-tint)", display: "grid", placeItems: "center", margin: "0 auto" }}>
          <I.cart size={34} style={{ color: "var(--green)" }} />
        </div>
        <h2 className="t-h2" style={{ marginTop: 20 }}>Your cart is empty</h2>
        <p className="muted" style={{ marginTop: 8 }}>Let the assistant build a set, or browse our shops.</p>
        <div className="row gap-12" style={{ justifyContent: "center", marginTop: 22 }}>
          <button className="btn btn-primary btn-lg" onClick={() => router.push("/assistant")}>
            <Spark size={17} /> Ask the assistant
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => router.push("/search")}>Browse products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: 28 }}>
      <Stepper step={step} />

      {step === 4 ? <OrderConfirmed total={total} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 28, marginTop: 28 }} className="cart-grid">
          <div className="col gap-20">
            {step === 1 && (
              <>
                <div style={{ background: "var(--green-tint)", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                  <Spark size={18} style={{ color: "var(--green)", flex: "0 0 auto" }} />
                  <span style={{ fontSize: 14, color: "var(--green-deep)" }}>
                    <b style={{ fontFamily: "var(--font-ui)" }}>One cart, {Object.keys(groups).length} shops.</b> Celeste combines delivery so you check out once.
                  </span>
                </div>

                {Object.entries(groups).map(([sid, rows]) => (
                  <div key={sid} className="card" style={{ overflow: "hidden" }}>
                    <div className="row gap-8" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                      <I.store size={17} style={{ color: "var(--green)" }} />
                      <b style={{ fontFamily: "var(--font-ui)", fontSize: 14.5 }}>{SHOPS[sid].name}</b>
                      {SHOPS[sid].verified && <I.check size={14} style={{ color: "var(--green)" }} />}
                      <span className="t-detail" style={{ marginLeft: "auto" }}>{SHOPS[sid].rating} ★ · ships in 2 days</span>
                    </div>
                    {rows.map(({ p, qty }) => p && (
                      <div key={p.id} className="row" style={{ padding: 16, gap: 16, borderTop: "1px solid var(--border)" }}>
                        <Ph label="" style={{ width: 92, height: 92, borderRadius: 12, flex: "0 0 auto", cursor: "pointer" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div onClick={() => router.push(`/product/${p.id}`)} style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15.5, cursor: "pointer" }}>{p.name}</div>
                          <div className="t-detail" style={{ marginTop: 2 }}>Matte Brass · In stock</div>
                          <div className="row gap-12" style={{ marginTop: 12 }}>
                            <div className="row" style={{ border: "1px solid var(--border)", borderRadius: 10, height: 38 }}>
                              <button onClick={() => setQty(p.id, qty - 1)} style={{ width: 36, height: 38, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}><I.minus size={14} /></button>
                              <span style={{ width: 26, textAlign: "center", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14 }}>{qty}</span>
                              <button onClick={() => setQty(p.id, qty + 1)} style={{ width: 36, height: 38, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}><I.plus size={14} /></button>
                            </div>
                            <button onClick={() => setQty(p.id, 0)} className="t-detail" style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Remove</button>
                            <button className="t-detail row gap-4" style={{ color: "var(--green)", cursor: "pointer" }}><I.heart size={14} /> Save</button>
                          </div>
                        </div>
                        <div className="col" style={{ alignItems: "flex-end" }}>
                          <span className="pcard-price" style={{ fontSize: 17 }}>{money(p.price * qty)}</span>
                          {qty > 1 && <span className="t-detail">{money(p.price)} each</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="card" style={{ padding: 18 }}>
                  <div className="row gap-8" style={{ marginBottom: 14 }}>
                    <AIChip label="AI suggests" />
                    <span className="t-detail">frequently added with your set</span>
                  </div>
                  <div className="hscroll">
                    {PRODUCTS.filter(p => !cart.find(c => c.id === p.id)).slice(0, 6).map(p => (
                      <div key={p.id} className="row gap-12" style={{ width: 250, border: "1px solid var(--border)", borderRadius: 12, padding: 10 }}>
                        <Ph label="" style={{ width: 50, height: 50, borderRadius: 8, flex: "0 0 auto" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                          <div className="pcard-price" style={{ fontSize: 13 }}>{money(p.price)}</div>
                        </div>
                        <button onClick={() => addToCart(p.id, 1)} className="btn btn-secondary btn-sm" style={{ flex: "0 0 auto" }}>
                          <I.plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && <ShippingForm />}
            {step === 3 && <PaymentForm total={total} />}
          </div>

          {/* summary rail */}
          <aside>
            <div className="card" style={{ padding: 22, position: "sticky", top: 120 }}>
              <b style={{ fontFamily: "var(--font-ui)", fontSize: 16 }}>Order summary</b>
              <div className="col gap-12" style={{ marginTop: 16 }}>
                <Row k={`Subtotal (${count} items)`} v={money(subtotal)} />
                <Row k="Delivery" v={shipping === 0 ? "Free" : money(shipping)} accent={shipping === 0} />
                <Row k="Est. tax" v={money(Math.round(subtotal * 0.07))} />
              </div>
              {shipping === 0 && (
                <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "8px 12px", marginTop: 12, fontSize: 12.5, color: "var(--green)", fontFamily: "var(--font-ui)", fontWeight: 500 }}>
                  <I.check size={13} style={{ verticalAlign: -2 }} /> You unlocked free delivery
                </div>
              )}
              <hr className="divider" style={{ margin: "16px 0" }} />
              <Row k="Total" v={money(total + Math.round(subtotal * 0.07))} big />
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }}
                onClick={() => step === 3 ? router.push("/order-confirmed") : setStep(step + 1)}>
                {step === 1 ? "Proceed to checkout" : step === 2 ? "Continue to payment" : "Place order"} <I.arrowright size={17} />
              </button>
              {step > 1 && (
                <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => setStep(step - 1)}>Back</button>
              )}
              <div className="row gap-8" style={{ justifyContent: "center", marginTop: 14, color: "var(--text-muted)" }}>
                <I.lock size={14} />
                <span className="t-detail" style={{ fontSize: 12 }}>Secure checkout · Buyer protection</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
