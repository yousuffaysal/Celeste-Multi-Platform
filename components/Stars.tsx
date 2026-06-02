import React from "react";
import { I } from "./icons";

interface StarsProps { value?: number; size?: number; }

export default function Stars({ value = 5, size = 14 }: StarsProps) {
  return (
    <span className="stars" style={{ "--s": size } as React.CSSProperties}>
      {[0,1,2,3,4].map(i => (
        <I.star key={i} size={size} style={{ color: i < Math.round(value) ? "var(--yellow)" : "#E3E6E4" }} />
      ))}
    </span>
  );
}
