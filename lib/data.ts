export interface Shop {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  sales: string;
  since: string;
  cat: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  shop: string;
  price: number;
  old?: number;
  rating: number;
  reviews: number;
  ratio: string;
  tag?: string;
  cat: string;
  ai?: boolean;
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface Intent {
  title: string;
  count: number;
  label: string;
}

export const SHOPS: Record<string, Shop> = {
  lumen:   { id: "lumen",   name: "IKEA",             verified: true,  rating: 4.9, sales: "12k", since: "2021", cat: "Lighting & Decor", logo: "https://icon.horse/icon/ikea.com" },
  fenwick: { id: "fenwick", name: "Herman Miller",    verified: true,  rating: 4.8, sales: "8.4k", since: "2020", cat: "Home & Office", logo: "https://icon.horse/icon/hermanmiller.com" },
  mori:    { id: "mori",    name: "Le Creuset",       verified: true,  rating: 5.0, sales: "3.1k", since: "2022", cat: "Kitchen & Dining", logo: "https://www.google.com/s2/favicons?sz=128&domain=lecreuset.com" },
  arbor:   { id: "arbor",   name: "Patagonia",        verified: false, rating: 4.6, sales: "5.7k", since: "2023", cat: "Outdoor & Garden", logo: "https://icon.horse/icon/patagonia.com" },
  nota:    { id: "nota",    name: "Moleskine",        verified: true,  rating: 4.7, sales: "9.2k", since: "2019", cat: "Stationery", logo: "https://icon.horse/icon/moleskine.com" },
  voss:    { id: "voss",    name: "Sony",             verified: true,  rating: 4.8, sales: "15k",  since: "2021", cat: "Electronics", logo: "https://icon.horse/icon/sony.com" },
  thread:  { id: "thread",  name: "West Elm",         verified: false, rating: 4.5, sales: "2.2k", since: "2023", cat: "Textiles", logo: "https://icon.horse/icon/westelm.com" },
  muse:    { id: "muse",    name: "The Met Store",    verified: true,  rating: 4.9, sales: "11k",  since: "2018", cat: "Art", logo: "https://icon.horse/icon/metmuseum.org" },
};

export const CATEGORIES = [
  "Home & Living", "Electronics", "Kitchen", "Lighting", "Stationery",
  "Outdoor", "Textiles", "Audio", "Office", "Decor", "Art"
];

let PID = 0;
const p = (o: Omit<Product, "id" | "ratio" | "rating" | "reviews"> & { ratio?: string; rating?: number; reviews?: number }): Product => ({
  id: "p" + (++PID),
  rating: o.rating ?? 4.7,
  reviews: o.reviews ?? 120,
  ratio: o.ratio ?? "1/1",
  ...o,
});

export const PRODUCTS: Product[] = [
  p({ name: "Arc Floor Lamp, Matte Brass", shop: "lumen", price: 189, old: 240, rating: 4.9, reviews: 412, tag: "deal", cat: "Lighting" }),
  p({ name: "Linen Desk Organizer Tray", shop: "fenwick", price: 38, rating: 4.7, reviews: 188, cat: "Office" }),
  p({ name: "Hand-thrown Stoneware Mug, Set of 2", shop: "mori", price: 44, rating: 5.0, reviews: 96, tag: "new", cat: "Kitchen" }),
  p({ name: "Walnut Monitor Stand", shop: "fenwick", price: 79, old: 95, rating: 4.8, reviews: 233, cat: "Office" }),
  p({ name: "Wireless Over-Ear Headphones", shop: "voss", price: 159, rating: 4.8, reviews: 1820, tag: "deal", cat: "Audio" }),
  p({ name: "Ceramic Pour-Over Coffee Set", shop: "mori", price: 68, rating: 4.9, reviews: 142, cat: "Kitchen" }),
  p({ name: "Paper Notebook, Dot Grid A5", shop: "nota", price: 18, rating: 4.7, reviews: 540, cat: "Stationery" }),
  p({ name: "Pendant Light, Smoked Glass", shop: "lumen", price: 124, rating: 4.8, reviews: 211, tag: "new", cat: "Lighting" }),
  p({ name: "Woven Throw Blanket, Sage", shop: "thread", price: 89, old: 110, rating: 4.6, reviews: 178, cat: "Textiles" }),
  p({ name: "Solar Path Lights, Set of 6", shop: "arbor", price: 52, rating: 4.5, reviews: 320, cat: "Outdoor" }),
  p({ name: "Compact Bluetooth Speaker", shop: "voss", price: 74, rating: 4.7, reviews: 905, cat: "Audio" }),
  p({ name: "Brass Task Desk Lamp", shop: "lumen", price: 98, rating: 4.8, reviews: 267, tag: "deal", cat: "Lighting" }),
  p({ name: "Recycled Felt Laptop Sleeve", shop: "fenwick", price: 42, rating: 4.6, reviews: 134, cat: "Office" }),
  p({ name: "Glazed Dinner Plate, Set of 4", shop: "mori", price: 96, rating: 4.9, reviews: 88, cat: "Kitchen" }),
  p({ name: "Leather Weekly Planner 2026", shop: "nota", price: 34, rating: 4.8, reviews: 412, tag: "new", cat: "Stationery" }),
  p({ name: "Cedar Planter Box, Large", shop: "arbor", price: 64, rating: 4.4, reviews: 96, cat: "Outdoor" }),
  p({ name: "Wool Area Rug, 5x7 Ochre", shop: "thread", price: 219, old: 280, rating: 4.7, reviews: 64, tag: "deal", cat: "Textiles" }),
  p({ name: "Studio Desk Microphone", shop: "voss", price: 119, rating: 4.6, reviews: 388, cat: "Audio" }),
  p({ name: "Minimalist Wall Clock, Oak", shop: "fenwick", price: 56, rating: 4.7, reviews: 156, cat: "Decor" }),
  p({ name: "Matte Black Cutlery, 16-pc", shop: "mori", price: 78, rating: 4.8, reviews: 122, cat: "Kitchen" }),
  p({ name: "Fountain Pen, Brushed Steel", shop: "nota", price: 62, rating: 4.9, reviews: 240, tag: "new", cat: "Stationery" }),
  p({ name: "Rattan Pendant Shade", shop: "lumen", price: 88, rating: 4.6, reviews: 98, cat: "Lighting" }),
  p({ name: "Cotton Bath Towel Set, Clay", shop: "thread", price: 58, rating: 4.5, reviews: 210, cat: "Textiles" }),
  p({ name: "USB-C Desk Charging Hub", shop: "voss", price: 49, old: 65, rating: 4.7, reviews: 670, tag: "deal", cat: "Electronics" }),
  p({ name: "MacBook Pro M3 Max", shop: "voss", price: 3199, rating: 4.9, reviews: 1042, tag: "new", cat: "Electronics" }),
  p({ name: "Nexus Earbuds & Smartphone Bundle", shop: "voss", price: 1099, old: 1299, rating: 4.8, reviews: 520, tag: "deal", cat: "Electronics" }),
  p({ name: "Aurora Ultrawide Curved Monitor", shop: "voss", price: 899, rating: 4.7, reviews: 315, cat: "Electronics" }),
  p({ name: "Mona Lisa Framed Print", shop: "muse", price: 145, rating: 4.9, reviews: 89, cat: "Art" }),
  p({ name: "The Last Supper Canvas Art", shop: "muse", price: 180, rating: 4.8, reviews: 124, cat: "Art" }),
  p({ name: "Starry Night Gallery Frame", shop: "muse", price: 160, rating: 5.0, reviews: 210, tag: "new", cat: "Art" }),
];

export const byId = (id: string): Product | undefined => PRODUCTS.find(x => x.id === id);
export const byShop = (s: string): Product[] => PRODUCTS.filter(x => x.shop === s);
export const shopOf = (pr: Product): Shop => SHOPS[pr.shop];
export const money = (n: number): string => "$" + n.toLocaleString();

export const REVIEWS: Review[] = [
  { name: "Dana R.", rating: 5, date: "2 weeks ago", text: "Beautiful quality and arrived faster than expected. The finish is exactly as pictured." },
  { name: "Marcus T.", rating: 5, date: "1 month ago", text: "Second purchase from this shop. Consistent, well-packaged, and the AI summary was spot on." },
  { name: "Priya S.", rating: 4, date: "1 month ago", text: "Lovely piece, slightly smaller than I imagined but great value for the price." },
  { name: "Owen K.", rating: 5, date: "2 months ago", text: "Exactly what I was looking for. Cross-vendor compare made it easy to pick the best one." },
];

export const INTENTS: Intent[] = [
  { title: "Set up a calm home office", count: 48, label: "office setup" },
  { title: "Slow mornings & coffee", count: 31, label: "coffee ritual" },
  { title: "Warm up the living room", count: 62, label: "cozy living" },
  { title: "Small-space dining", count: 27, label: "compact dining" },
];
