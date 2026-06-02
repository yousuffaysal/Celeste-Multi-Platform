"use client";
import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { I, Spark } from "./icons";
import { byId, shopOf, money } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

interface Props { onClose: () => void; }

export default function VisualSearchModal({ onClose }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [description, setDescription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStatus("loading");
    setMatches([]);
    setDescription("");

    // Convert to base64 for API
    const base64Reader = new FileReader();
    base64Reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      const mimeType = file.type;

      try {
        const res = await fetch("/api/visual-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setDescription(data.description ?? "");
        setAiResponse(data.response ?? "");
        setMatches(data.productIds ?? []);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };
    base64Reader.readAsDataURL(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setPreview(null); setStatus("idle"); setMatches([]); setDescription(""); setAiResponse("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,32,27,.55)", zIndex: 1000, backdropFilter: "blur(4px)" }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 1001, width: "min(94vw, 680px)", maxHeight: "88vh",
        background: "var(--surface)", borderRadius: 20,
        boxShadow: "var(--shadow-pop)", display: "flex", flexDirection: "column",
        animation: "fadeIn .2s ease both",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div className="row gap-8">
            <I.camera size={20} style={{ color: "var(--green)" }} />
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16 }}>Visual Search</div>
              <div className="t-detail" style={{ fontSize: 12 }}>Upload a photo — Celeste finds matching products</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 99, display: "grid", placeItems: "center", color: "var(--text-muted)" }}>
            <I.close size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="no-scrollbar" style={{ overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Drop zone */}
          {!preview ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--green)" : "var(--border)"}`,
                borderRadius: 14,
                padding: "44px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "var(--green-tint)" : "var(--surface-2)",
                transition: "all .15s",
              }}
            >
              <I.image size={40} style={{ color: "var(--green)", margin: "0 auto 14px" }} />
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>
                Drop an image here
              </div>
              <div className="t-detail">or click to browse · JPG, PNG, WEBP</div>
              <button className="btn btn-primary" style={{ marginTop: 18 }}>
                <I.camera size={16} /> Choose photo
              </button>
            </div>
          ) : (
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "16/7" }}>
              <img src={preview} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={reset} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.55)", color: "#fff", borderRadius: 99, width: 32, height: 32, display: "grid", placeItems: "center" }}>
                <I.close size={15} />
              </button>
              {status === "loading" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(1,97,78,.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <Spark size={32} style={{ color: "#FBE249" }} className="spark-anim" />
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "#fff", fontSize: 15 }}>Analysing image…</div>
                  <span className="dots-typing" style={{ display: "flex", gap: 4 }}><i style={{ background: "#fff" }} /><i style={{ background: "#fff" }} /><i style={{ background: "#fff" }} /></span>
                </div>
              )}
            </div>
          )}

          {/* AI smart response bubble */}
          {status === "done" && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Spark size={16} style={{ color: "#fff" }} />
              </div>
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px 14px 14px 14px", padding: "12px 16px", flex: 1 }}>
                {description && (
                  <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 6px", lineHeight: 1.5, fontStyle: "italic" }}>{description}</p>
                )}
                <p style={{ fontSize: 14.5, color: "var(--text-primary)", margin: 0, lineHeight: 1.6, fontFamily: "var(--font-ui)" }}>
                  {aiResponse || (matches.length > 0 ? "Here are the closest matches I found:" : "No close matches — try uploading a clearer product photo.")}
                </p>
              </div>
            </div>
          )}

          {/* Matched products */}
          {status === "done" && matches.length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>
                {matches.length} match{matches.length !== 1 ? "es" : ""} found
              </div>
              <div className="col gap-10">
                {matches.map(id => {
                  const p = byId(id);
                  if (!p) return null;
                  const shop = shopOf(p);
                  return (
                    <div key={id} className="card row gap-12 fade-in" style={{ padding: 12 }}>
                      {/* Thumbnail */}
                      <div onClick={() => { router.push(`/product/${p.id}`); onClose(); }}
                        style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flex: "0 0 auto", background: "var(--surface-2)", cursor: "pointer" }}>
                        <img src={`/images/products/${p.id}.png`} alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => { router.push(`/product/${p.id}`); onClose(); }}>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{shop.name}{shop.verified && " ✓"} · {p.cat}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--green)" }}>{money(p.price)}</span>
                          {p.old && <span style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "line-through" }}>{money(p.old)}</span>}
                          <span style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>⭐ {p.rating} ({p.reviews})</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="col gap-6" style={{ flexShrink: 0 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(p.id, 1)}>
                          <I.cart size={14} /> Add
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => { router.push(`/product/${p.id}`); onClose(); }}>
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Try another photo CTA — shown after AI responds (with or without matches) */}
          {status === "done" && (
            <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", color: "var(--text-secondary)" }} onClick={reset}>
              <I.refresh size={14} /> Try a different photo
            </button>
          )}

          {status === "error" && (
            <div style={{ textAlign: "center", padding: 24, color: "var(--error)" }}>
              <I.close size={28} style={{ margin: "0 auto 10px" }} />
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600 }}>Analysis failed</div>
              <div className="t-detail" style={{ marginTop: 4 }}>Please try again with a clearer photo</div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={reset}>Try again</button>
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
      </div>
    </>
  );
}
