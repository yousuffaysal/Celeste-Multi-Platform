/* Dashboard mock data */
import { SHOPS, PRODUCTS, REVIEWS, byId, byShop, shopOf, money } from "./data";
export { SHOPS, PRODUCTS, REVIEWS, byId, byShop, shopOf, money };

export interface Order {
  id: string; customer: string; vendor: string; items: number; total: number;
  status: string; date: string; ship: string;
}
export interface VendorRow {
  id: string; gmv: number; orders: number; rating: number; status: string; joined: string; flags: number;
}
export interface VendorApproval { name: string; cat: string; applied: string; products: number; aiScore: number; }
export interface CustomerRow {
  name: string; email: string; orders: number; spent: number; ltv: string; joined: string; seg: string;
}
export interface Payout { id: string; date: string; amount: number; status: string; }
export interface ModerationItem { product: string; vendor: string; reason: string; severity: string; conf: number; }
export interface SavedSet { name: string; items: string[]; total: number; shops: number; date: string; }
export interface Campaign { name: string; status: string; spend: number; roas: number; impr: string; aiManaged: boolean; }
export interface MyOrder {
  id: string; items: string[]; total: number; status: string; eta: string; step: number; vendor: string;
}
export interface TxnRow {
  brand: string; bg: string; fg?: string; title: string; date: string; amount: number; state: string;
}
export interface SpendCat { k: string; v: number; color: string; }
export interface Goal { name: string; saved: number; target: number; color: string; }

export const ORDERS: Order[] = [
  { id: "CL-284910", customer: "Alex Morgan",   vendor: "lumen",   items: 2, total: 233, status: "shipped",   date: "May 28", ship: "In transit" },
  { id: "CL-284902", customer: "Priya Shah",    vendor: "mori",    items: 1, total: 44,  status: "new",       date: "May 28", ship: "Awaiting" },
  { id: "CL-284887", customer: "Owen Klein",    vendor: "voss",    items: 1, total: 159, status: "packed",    date: "May 27", ship: "Ready" },
  { id: "CL-284861", customer: "Dana Reyes",    vendor: "fenwick", items: 3, total: 196, status: "delivered", date: "May 26", ship: "Delivered" },
  { id: "CL-284844", customer: "Marcus Tan",    vendor: "mori",    items: 2, total: 140, status: "new",       date: "May 26", ship: "Awaiting" },
  { id: "CL-284820", customer: "Lena Fischer",  vendor: "lumen",   items: 1, total: 98,  status: "shipped",   date: "May 25", ship: "In transit" },
  { id: "CL-284799", customer: "Sam Doyle",     vendor: "nota",    items: 4, total: 132, status: "delivered", date: "May 24", ship: "Delivered" },
  { id: "CL-284771", customer: "Ivy Cho",       vendor: "voss",    items: 1, total: 74,  status: "refund",    date: "May 23", ship: "Return" },
  { id: "CL-284750", customer: "Theo Banks",    vendor: "arbor",   items: 2, total: 116, status: "packed",    date: "May 23", ship: "Ready" },
  { id: "CL-284722", customer: "Nora West",     vendor: "thread",  items: 1, total: 89,  status: "new",       date: "May 22", ship: "Awaiting" },
];

export const ORDER_STATUS: Record<string, { label: string; tone: string }> = {
  new:       { label: "New",       tone: "warning" },
  packed:    { label: "Packed",    tone: "info" },
  shipped:   { label: "Shipped",   tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  refund:    { label: "Refund",    tone: "error" },
};

export const VENDOR_ROWS: VendorRow[] = [
  { id: "lumen",   gmv: 184200, orders: 1240, rating: 4.9, status: "active", joined: "Jan 2021", flags: 0 },
  { id: "voss",    gmv: 312000, orders: 2180, rating: 4.8, status: "active", joined: "Mar 2021", flags: 1 },
  { id: "fenwick", gmv: 142800, orders: 980,  rating: 4.8, status: "active", joined: "Nov 2020", flags: 0 },
  { id: "mori",    gmv: 64500,  orders: 410,  rating: 5.0, status: "active", joined: "Feb 2022", flags: 0 },
  { id: "nota",    gmv: 98200,  orders: 920,  rating: 4.7, status: "active", joined: "Aug 2019", flags: 0 },
  { id: "thread",  gmv: 22100,  orders: 220,  rating: 4.5, status: "review", joined: "Jan 2023", flags: 2 },
  { id: "arbor",   gmv: 57700,  orders: 570,  rating: 4.6, status: "active", joined: "Apr 2023", flags: 1 },
];

export const VENDOR_APPROVALS: VendorApproval[] = [
  { name: "Hearth & Hand Co.", cat: "Home & Living", applied: "2h ago", products: 18, aiScore: 92 },
  { name: "Tidal Skincare",    cat: "Beauty",        applied: "5h ago", products: 7,  aiScore: 78 },
  { name: "Forge Knife Works", cat: "Kitchen",       applied: "1d ago", products: 24, aiScore: 88 },
];

export const CUSTOMER_ROWS: CustomerRow[] = [
  { name: "Alex Morgan",  email: "alex@email.com",   orders: 24, spent: 3820, ltv: "High",   joined: "2022", seg: "Loyal" },
  { name: "Priya Shah",   email: "priya@email.com",  orders: 11, spent: 1240, ltv: "Medium", joined: "2023", seg: "Active" },
  { name: "Owen Klein",   email: "owen@email.com",   orders: 38, spent: 6190, ltv: "High",   joined: "2021", seg: "VIP" },
  { name: "Dana Reyes",   email: "dana@email.com",   orders: 6,  spent: 540,  ltv: "Low",    joined: "2024", seg: "New" },
  { name: "Marcus Tan",   email: "marcus@email.com", orders: 19, spent: 2880, ltv: "Medium", joined: "2022", seg: "Loyal" },
  { name: "Lena Fischer", email: "lena@email.com",   orders: 3,  spent: 210,  ltv: "Low",    joined: "2025", seg: "New" },
];

export const PAYOUTS: Payout[] = [
  { id: "PO-9921", date: "May 27", amount: 4820, status: "paid" },
  { id: "PO-9890", date: "May 20", amount: 3960, status: "paid" },
  { id: "PO-9851", date: "May 13", amount: 5210, status: "paid" },
  { id: "PO-9999", date: "Jun 3",  amount: 4180, status: "scheduled" },
];

export const MODERATION: ModerationItem[] = [
  { product: "Ultra-Bright LED Strip 50m",  vendor: "voss",   reason: "Possible inflated specs",  severity: "med",  conf: 74 },
  { product: "'Miracle' Plant Tonic 1L",    vendor: "arbor",  reason: "Unverified health claim",   severity: "high", conf: 91 },
  { product: "Designer-style Table Lamp",    vendor: "thread", reason: "Potential trademark term",  severity: "high", conf: 88 },
  { product: "Bulk Notebook Pack x20",       vendor: "nota",   reason: "Duplicate listing",         severity: "low",  conf: 62 },
];

export const SAVED_SETS: SavedSet[] = [
  { name: "Calm home office",          items: ["p12","p4","p2","p9"],  total: 348, shops: 3, date: "May 24" },
  { name: "Slow morning coffee corner",items: ["p3","p6","p20"],       total: 190, shops: 1, date: "May 18" },
  { name: "Cozy living room refresh",  items: ["p8","p22","p17"],      total: 366, shops: 2, date: "May 10" },
];

export const CAMPAIGNS: Campaign[] = [
  { name: "Spring lighting push", status: "active", spend: 120, roas: 4.2, impr: "48k", aiManaged: true },
  { name: "New-arrival boost",    status: "active", spend: 80,  roas: 3.6, impr: "31k", aiManaged: true },
  { name: "Clearance — rugs",     status: "paused", spend: 0,   roas: 2.1, impr: "12k", aiManaged: false },
];

export const MY_ORDERS: MyOrder[] = [
  { id: "CL-284910", items: ["p1","p5"],   total: 233, status: "shipped",   eta: "Jun 3",             step: 2, vendor: "Multiple shops" },
  { id: "CL-284799", items: ["p7"],        total: 18,  status: "delivered", eta: "Delivered May 26",  step: 3, vendor: "Nota Paper Co." },
  { id: "CL-284600", items: ["p11","p3"],  total: 118, status: "packed",    eta: "Jun 5",             step: 1, vendor: "Multiple shops" },
];
export const TRACK_STEPS = ["Ordered", "Packed", "Shipped", "Delivered"];

export const NOTIFS = {
  admin: [
    { icon: "alert",   text: "Fraud model flagged 3 orders for review", time: "12m", tone: "error" },
    { icon: "flag",    text: "2 vendors awaiting verification",          time: "1h",  tone: "warning" },
    { icon: "trendup", text: "GMV up 18% vs last week",                 time: "3h",  tone: "success" },
  ],
  vendor: [
    { icon: "inbox",  text: "2 new orders to fulfill",                    time: "20m", tone: "warning" },
    { icon: "wand",   text: "AI suggests restocking 'Pour-Over Set'",     time: "2h",  tone: "info" },
    { icon: "wallet", text: "Payout of $4,180 scheduled Jun 3",           time: "1d",  tone: "success" },
  ],
  customer: [
    { icon: "truck", text: "Order CL-284910 is on its way",             time: "1h",  tone: "info" },
    { icon: "wand",  text: "New AI picks based on your saved sets",     time: "4h",  tone: "info" },
    { icon: "tag",   text: "Price drop on an item in your wishlist",    time: "1d",  tone: "success" },
  ],
};

export const spark = (seed: number) =>
  Array.from({ length: 16 }, (_, i) => 40 + Math.sin(i / 2 + seed) * 18 + i * (1.6 + seed));

export const SERIES: Record<string, { labels: string[]; gmv: number[]; rev: number[] }> = {
  "7d":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], gmv: [312,358,330,412,468,540,498], rev: [28,32,30,37,42,49,45] },
  "30d": { labels: ["W1","W2","W3","W4","W5"],                  gmv: [1840,2010,1960,2280,2410],    rev: [164,180,176,205,214] },
  "90d": { labels: ["Mar","Apr","May"],                         gmv: [6240,6980,8120],              rev: [560,612,724] },
};

export const VENDOR_SERIES: Record<string, { labels: string[]; rev: number[] }> = {
  "7d":  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], rev: [480,620,550,700,660,920,840] },
  "30d": { labels: ["W1","W2","W3","W4"],                       rev: [3100,3600,3380,4820] },
  "90d": { labels: ["Mar","Apr","May"],                         rev: [11800,13600,18200] },
};

export const REV_SPLIT = [
  { Lighting: 21, Audio: 14, Home: 9 }, { Lighting: 24, Audio: 16, Home: 11 },
  { Lighting: 22, Audio: 15, Home: 10 }, { Lighting: 28, Audio: 19, Home: 13 },
  { Lighting: 31, Audio: 22, Home: 15 }, { Lighting: 38, Audio: 28, Home: 19 },
  { Lighting: 34, Audio: 25, Home: 17 },
];

export const VIZ = {
  emerald: "#06A36B",
  lime:    "#7FCB3F",
  gold:    "#F5C03A",
  coral:   "#F2724B",
  violet:  "#7B6EF0",
  slate:   "#C7D2CC",
};

export const GMV_CATS: SpendCat[] = [
  { k: "Lighting", v: 32, color: VIZ.gold },
  { k: "Audio",    v: 24, color: VIZ.emerald },
  { k: "Home",     v: 20, color: VIZ.coral },
  { k: "Kitchen",  v: 14, color: VIZ.violet },
  { k: "Other",    v: 10, color: VIZ.slate },
];

export const ORDER_HEAT = {
  rows: ["Lighting", "Audio", "Home", "Kitchen", "Paper"],
  cols: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  matrix: [
    [42,38,51,60,72,94,88], [30,28,34,40,48,66,58], [22,26,24,31,38,52,47],
    [14,16,18,20,27,34,30], [10,9,12,14,17,22,19],
  ],
};

export const TXN_ADMIN: TxnRow[] = [
  { brand: "VO", bg: VIZ.emerald, title: "Voss Audio · settlement",    date: "May 28", amount: 312000, state: "Completed" },
  { brand: "LU", bg: "#01614E",   title: "Lumen Co. · settlement",     date: "May 27", amount: 184200, state: "Completed" },
  { brand: "FE", bg: VIZ.coral,   title: "Refund · Ivy Cho",           date: "May 27", amount: -74,    state: "Declined" },
  { brand: "FW", bg: VIZ.violet,  title: "Fenwick · settlement",       date: "May 26", amount: 142800, state: "Completed" },
  { brand: "PF", bg: VIZ.gold, fg: "#1b2622", title: "Platform fees collected", date: "May 26", amount: 21400, state: "Completed" },
];

export const TXN_CUSTOMER: TxnRow[] = [
  { brand: "MO", bg: VIZ.coral,   title: "Mori Ceramics",          date: "May 28", amount: -44,  state: "Completed" },
  { brand: "LU", bg: VIZ.emerald, title: "Lumen Co.",              date: "May 26", amount: -98,  state: "Completed" },
  { brand: "CR", bg: VIZ.gold, fg: "#1b2622", title: "Celeste credit earned", date: "May 24", amount: 24, state: "Completed" },
  { brand: "NO", bg: VIZ.violet,  title: "Nota Paper Co.",         date: "May 24", amount: -18,  state: "Completed" },
  { brand: "VO", bg: "#01614E",   title: "Voss Audio · refund",    date: "May 22", amount: 74,   state: "Refunded" },
];

export const SPEND_CATS: SpendCat[] = [
  { k: "Home & Living", v: 34, color: VIZ.emerald },
  { k: "Lighting",      v: 22, color: VIZ.gold },
  { k: "Kitchen",       v: 18, color: VIZ.coral },
  { k: "Paper goods",   v: 14, color: VIZ.violet },
  { k: "Other",         v: 12, color: VIZ.slate },
];

export const GOALS: Goal[] = [
  { name: "Spring refresh", saved: 240, target: 400, color: VIZ.emerald },
  { name: "New desk setup", saved: 320, target: 800, color: VIZ.gold },
  { name: "Gift fund",      saved: 90,  target: 150, color: VIZ.coral },
];
