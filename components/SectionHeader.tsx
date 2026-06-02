import React from "react";
import { Spark, I } from "./icons";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  seeAll?: string;
  onSeeAll?: () => void;
  ai?: boolean;
}

export default function SectionHeader({ eyebrow, title, seeAll, onSeeAll, ai }: SectionHeaderProps) {
  return (
    <div className="sec-head">
      <div className="col gap-8">
        {eyebrow && (
          <span className="t-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {ai && <Spark size={13} />}{eyebrow}
          </span>
        )}
        <h2 className="t-h2">{title}</h2>
      </div>
      {seeAll && (
        <a className="seeall" onClick={onSeeAll} style={{ cursor: "pointer" }}>
          {seeAll} <I.arrowright size={15} />
        </a>
      )}
    </div>
  );
}
