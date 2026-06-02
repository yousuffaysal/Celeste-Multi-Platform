import React from "react";

interface PhProps {
  label?: string;
  green?: boolean;
  style?: React.CSSProperties;
  className?: string;
  radius?: string | number;
}

export default function Ph({ label, green, style, className = "", radius }: PhProps) {
  return (
    <div
      className={"ph " + (green ? "ph-green " : "") + className}
      data-label={label}
      style={{ borderRadius: radius, ...style }}
    />
  );
}
