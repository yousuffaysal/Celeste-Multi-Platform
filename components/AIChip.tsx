import React from "react";
import { Spark } from "./icons";

interface AIChipProps { label?: string; style?: React.CSSProperties; }

export default function AIChip({ label = "AI", style }: AIChipProps) {
  return (
    <span className="ai-chip" style={style}>
      <Spark size={12} /> {label}
    </span>
  );
}
