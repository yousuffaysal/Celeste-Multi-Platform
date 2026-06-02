"use client";
import React, { useState } from "react";
import { I } from "./icons";
import AIChip from "./AIChip";
import Stars from "./Stars";
import Ph from "./Ph";
import { Product, shopOf, money } from "@/lib/data";

interface ProductCardProps {
  p: Product & { ai?: boolean };
  onOpen?: (p: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ p, onOpen }: ProductCardProps) {
  const [wish, setWish] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shop = shopOf(p);

  return (
    <div className="pcard fade-in" onClick={() => onOpen && onOpen(p)}>
      <div className="pcard-imgwrap">
        {!imgError ? (
          <img
            src={`/images/products/${p.id}.png`}
            alt={p.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Ph label={"product · " + p.cat.toLowerCase()} />
        )}
        <div className="pcard-tags">
          {p.tag === "deal" && <span className="badge badge-deal"><I.tag size={11}/> Deal</span>}
          {p.tag === "new" && <span className="badge badge-new">New</span>}
          {p.ai && <AIChip label="AI pick" />}
        </div>
        <button
          className={"wishlist" + (wish ? " on" : "")}
          onClick={(e) => { e.stopPropagation(); setWish(!wish); }}
        >
          <I.heart fill={wish ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-shop">
          {shop.name}{shop.verified && <I.check size={12} style={{ color: "var(--green)" }} />}
        </div>
        <div className="pcard-title">{p.name}</div>
        <div className="pcard-rating">
          <Stars value={p.rating} size={13} /> {p.rating} <span className="dim">({p.reviews})</span>
        </div>
        <div style={{ marginTop: 2 }}>
          <span className="pcard-price">{money(p.price)}</span>
          {p.old && <span className="pcard-old">{money(p.old)}</span>}
        </div>
      </div>
    </div>
  );
}
