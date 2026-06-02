import React from "react";

interface IconProps {
  d?: string;
  paths?: React.ReactNode;
  size?: number;
  fill?: string;
  stroke?: string;
  sw?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Icon = ({ d, paths, size = 20, fill = "none", stroke = "currentColor", sw = 1.5, style, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    {d && <path d={d} />}
    {paths}
  </svg>
);

interface SparkProps {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  fill?: string;
}

export const Spark = ({ size = 16, style, className, fill = "currentColor" }: SparkProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
    <path d="M12 2c.5 4.2 2.3 6 6.5 6.5C14.3 9 12.5 10.8 12 15c-.5-4.2-2.3-6-6.5-6.5C9.7 8 11.5 6.2 12 2Z" fill={fill}/>
    <path d="M18.5 14c.25 2 1.1 2.85 3.1 3.1-2 .25-2.85 1.1-3.1 3.1-.25-2-1.1-2.85-3.1-3.1 2-.25 2.85-1.1 3.1-3.1Z" fill={fill} opacity={0.7}/>
  </svg>
);

type IconFn = (p?: Partial<IconProps>) => React.ReactElement;

export const I: Record<string, IconFn> = {
  search:    (p) => <Icon {...p} paths={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>} />,
  camera:    (p) => <Icon {...p} paths={<><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.2-2h7.6L17 7h2.5A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z"/><circle cx="12" cy="12.5" r="3.2"/></>} />,
  cart:      (p) => <Icon {...p} paths={<><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.2L20 7H5.2"/></>} />,
  heart:     (p) => <Icon {...p} paths={<path d="M12 20s-7-4.6-9.3-9C1.2 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.8 3.5 3.3 6.5C19 15.4 12 20 12 20Z"/>} />,
  user:      (p) => <Icon {...p} paths={<><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.6-3.5 3.4-5.5 7-5.5s6.4 2 7 5.5"/></>} />,
  globe:     (p) => <Icon {...p} paths={<><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.4 2.2 14.6 0 17M12 3.5c-2.2 2.4-2.2 14.6 0 17"/></>} />,
  chevdown:  (p) => <Icon {...p} paths={<path d="m6 9 6 6 6-6"/>} />,
  chevright: (p) => <Icon {...p} paths={<path d="m9 6 6 6-6 6"/>} />,
  chevleft:  (p) => <Icon {...p} paths={<path d="m15 6-6 6 6 6"/>} />,
  arrowright:(p) => <Icon {...p} paths={<><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></>} />,
  star:      (p) => <Icon {...p} fill="currentColor" stroke="none" paths={<path d="M12 3.5l2.4 5 5.4.7-4 3.7 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.7 5.4-.7z"/>} />,
  menu:      (p) => <Icon {...p} paths={<><path d="M3 6h18M3 12h18M3 18h18"/></>} />,
  close:     (p) => <Icon {...p} paths={<path d="M6 6l12 12M18 6 6 18"/>} />,
  filter:    (p) => <Icon {...p} paths={<path d="M3 5h18M6 12h12M10 19h4"/>} />,
  check:     (p) => <Icon {...p} paths={<path d="m4 12 5 5L20 6"/>} />,
  shield:    (p) => <Icon {...p} paths={<><path d="M12 3l7 2.5v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5v-6z"/><path d="m9 12 2 2 4-4"/></>} />,
  truck:     (p) => <Icon {...p} paths={<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></>} />,
  refresh:   (p) => <Icon {...p} paths={<><path d="M20 11A8 8 0 0 0 6 6l-2 2M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 5v3h3M20 19v-3h-3"/></>} />,
  tag:       (p) => <Icon {...p} paths={<><path d="M3 12V4h8l9 9-7 7z"/><circle cx="7.5" cy="7.5" r="1.3"/></>} />,
  flame:     (p) => <Icon {...p} paths={<path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.2.4-2 1-2.8C9 9.5 11 7 12 3Z"/>} />,
  send:      (p) => <Icon {...p} paths={<path d="M4 12 20 4l-6 16-3-7z"/>} />,
  plus:      (p) => <Icon {...p} paths={<path d="M12 5v14M5 12h14"/>} />,
  minus:     (p) => <Icon {...p} paths={<path d="M5 12h14"/>} />,
  mic:       (p) => <Icon {...p} paths={<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>} />,
  bolt:      (p) => <Icon {...p} fill="currentColor" stroke="none" paths={<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>} />,
  store:     (p) => <Icon {...p} paths={<><path d="M4 9h16v10H4zM4 9l1.5-5h13L20 9"/><path d="M9 19v-5h6v5"/></>} />,
  chart:     (p) => <Icon {...p} paths={<><path d="M4 4v16h16"/><path d="M8 14l3-4 3 3 4-6"/></>} />,
  bell:      (p) => <Icon {...p} paths={<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></>} />,
  image:     (p) => <Icon {...p} paths={<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-5 4 4 3-2 4 3"/></>} />,
  sliders:   (p) => <Icon {...p} paths={<><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>} />,
  wand:      (p) => <Icon {...p} paths={<><path d="m5 19 9-9M14 6l1.5-1.5M19 11l1.5-1.5M9 5l.7-1.4L11 3l-1.3-.6L9 1l-.7 1.4L7 3l1.3.6z"/></>} />,
  package:   (p) => <Icon {...p} paths={<><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/></>} />,
  compare:   (p) => <Icon {...p} paths={<><path d="M12 3v18M7 7 3 11l4 4M17 7l4 4-4 4"/></>} />,
  play:      (p) => <Icon {...p} fill="currentColor" stroke="none" paths={<path d="M7 5v14l11-7z"/>} />,
  lock:      (p) => <Icon {...p} paths={<><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>} />,
  // Dashboard icons
  grid:      (p) => <Icon {...p} paths={<><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>} />,
  wallet:    (p) => <Icon {...p} paths={<><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 9h18M16 13h2"/></>} />,
  users:     (p) => <Icon {...p} paths={<><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.5-3 2.9-4.6 5.5-4.6S14 16 14.5 19"/><path d="M16 5.2A3 3 0 0 1 16 11M21 19c-.3-2-1.4-3.3-3-4"/></>} />,
  settings:  (p) => <Icon {...p} paths={<><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"/></>} />,
  logout:    (p) => <Icon {...p} paths={<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4M6 12h11"/></>} />,
  flag:      (p) => <Icon {...p} paths={<><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></>} />,
  download:  (p) => <Icon {...p} paths={<><path d="M12 3v12M8 11l4 4 4-4M5 20h14"/></>} />,
  eye:       (p) => <Icon {...p} paths={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="2.8"/></>} />,
  clock:     (p) => <Icon {...p} paths={<><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>} />,
  trendup:   (p) => <Icon {...p} paths={<><path d="M3 17l6-6 4 4 8-8"/><path d="M16 7h5v5"/></>} />,
  trenddn:   (p) => <Icon {...p} paths={<><path d="M3 7l6 6 4-4 8 8"/><path d="M16 17h5v-5"/></>} />,
  alert:     (p) => <Icon {...p} paths={<><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4M12 17.2v.1"/></>} />,
  card:      (p) => <Icon {...p} paths={<><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></>} />,
  pin:       (p) => <Icon {...p} paths={<><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></>} />,
  edit:      (p) => <Icon {...p} paths={<><path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2V20Z"/><path d="M14 7l3 3"/></>} />,
  trash:     (p) => <Icon {...p} paths={<><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></>} />,
  more:      (p) => <Icon {...p} paths={<><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>} />,
  cal:       (p) => <Icon {...p} paths={<><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></>} />,
  box:       (p) => <Icon {...p} paths={<><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/></>} />,
  inbox:     (p) => <Icon {...p} paths={<><path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5a3 3 0 0 0 6 0h5"/></>} />,
  heartset:  (p) => <Icon {...p} paths={<><path d="M12 20s-7-4.6-9.3-9C1.2 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.8 3.5 3.3 6.5C19 15.4 12 20 12 20Z"/></>} />,
  chat:      (p) => <Icon {...p} paths={<><path d="M4 5h16v11H9l-4 3.5V16H4z"/><path d="M8.5 10.5h7M8.5 13h4"/></>} />,
  shieldcheck:(p) => <Icon {...p} paths={<><path d="M12 3l7 2.5v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5v-6z"/><path d="m9 12 2 2 4-4"/></>} />,
  rocket:    (p) => <Icon {...p} paths={<><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 13l2 2M14.5 4.5C18 4 20 6 19.5 9.5c-.4 2.7-3 6-7.5 9l-2.5-2.5C12.5 9.5 11.8 5 14.5 4.5Z"/><circle cx="15" cy="9" r="1.3"/></>} />,
  topup:     (p) => <Icon {...p} paths={<><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></>} />,
  history:   (p) => <Icon {...p} paths={<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4M12 8v4l3 2"/></>} />,
  target:    (p) => <Icon {...p} paths={<><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></>} />,
  layers:    (p) => <Icon {...p} paths={<><path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/></>} />,
  activity:  (p) => <Icon {...p} paths={<path d="M3 12h4l3-8 4 16 3-8h4"/>} />,
  percent:   (p) => <Icon {...p} paths={<><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></>} />,
  gift:      (p) => <Icon {...p} paths={<><rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11"/><path d="M12 9C9 9 7 8 7 6.2A2.2 2.2 0 0 1 12 6a2.2 2.2 0 0 1 5 .2C17 8 15 9 12 9Z"/></>} />,
  repeat:    (p) => <Icon {...p} paths={<><path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11V9.5a3.5 3.5 0 0 1 3.5-3.5h13M7 21.5 3.5 18 7 14.5"/><path d="M20.5 13v1.5a3.5 3.5 0 0 1-3.5 3.5H4"/></>} />,
  coins:     (p) => <Icon {...p} paths={<><ellipse cx="9" cy="7" rx="5.5" ry="3"/><path d="M3.5 7v5c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3V7"/><path d="M9 12c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3"/><path d="M14.5 9c3 0 5.5-1.3 5.5-3"/></>} />,
  scan:      (p) => <Icon {...p} paths={<><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M4 12h16"/></>} />,
  filter2:   (p) => <Icon {...p} paths={<path d="M3 5h18l-7 8v6l-4-2v-4z"/>} />,
  google:    (p) => (
    <svg width={p?.size||18} height={p?.size||18} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.1-1.7H12v3.4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z"/>
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/>
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"/>
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.6 9.4 5.9 12 5.9z"/>
    </svg>
  ),
};

interface CelesteMarkProps { size?: number; color?: string; }
export const CelesteMark = ({ size = 30, color = "var(--green)" }: CelesteMarkProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="2.2"/>
    <path d="M16 7c.7 4.6 2.7 6.6 7.3 7.3C18.7 15 16.7 17 16 21.6c-.7-4.6-2.7-6.6-7.3-7.3C13.3 13.6 15.3 11.6 16 7Z" fill={color}/>
  </svg>
);

interface CelesteProps { size?: number; color?: string; mark?: boolean; }
export const Celeste = ({ size = 26, color = "var(--green)", mark = true }: CelesteProps) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
    {mark && (
      <span style={{ width: size * 1.6, height: size * 1.6, overflow: "hidden", borderRadius: 5, flex: "0 0 auto", display: "grid", placeItems: "center" }}>
        <img 
          src="https://ik.imagekit.io/2lax2ytm2/Screenshot%202026-05-30%20at%203.58.44%E2%80%AFPM.png" 
          alt="Logo" 
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.25)" }} 
        />
      </span>
    )}
    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: size, letterSpacing: "-0.5px", color, lineHeight: 1 }}>Celeste</span>
  </span>
);
