#!/usr/bin/env tsx
/**
 * Seed the Celeste database.
 * Usage: npx tsx scripts/seed.ts
 *
 * Reads DATABASE_URL from .env.local automatically.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Load .env.local
try {
  const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* .env.local may not exist */ }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log("⏳ Running schema...");
    const schema = readFileSync(join(process.cwd(), "lib/schema.sql"), "utf8");
    await client.query(schema);
    console.log("✅ Schema ready");

    // Demo users
    console.log("⏳ Seeding users...");
    const hash = await bcrypt.hash("demo1234", 10);
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, shop_id) VALUES
        ('admin@celeste.shop',    $1, 'Admin User',   'admin',    null),
        ('vendor@celeste.shop',   $1, 'Lumen Studio', 'vendor',   'lumen'),
        ('customer@celeste.shop', $1, 'Alex Morgan',  'customer', null)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [hash]);
    console.log("✅ Users seeded");

    const { rows: [vendor] }   = await client.query("SELECT id FROM users WHERE email = 'vendor@celeste.shop'");
    const { rows: [customer] } = await client.query("SELECT id FROM users WHERE email = 'customer@celeste.shop'");

    // Shops
    console.log("⏳ Seeding shops...");
    const shops = [
      ["lumen",   vendor.id, "IKEA",          true,  4.9, 12000, 2021, "Lighting & Decor",  "https://icon.horse/icon/ikea.com"],
      ["fenwick", null,      "Herman Miller", true,  4.8,  8400, 2020, "Home & Office",     "https://icon.horse/icon/hermanmiller.com"],
      ["mori",    null,      "Le Creuset",    true,  5.0,  3100, 2022, "Kitchen & Dining",  "https://www.google.com/s2/favicons?sz=128&domain=lecreuset.com"],
      ["arbor",   null,      "Patagonia",     false, 4.6,  5700, 2023, "Outdoor & Garden",  "https://icon.horse/icon/patagonia.com"],
      ["nota",    null,      "Moleskine",     true,  4.7,  9200, 2019, "Stationery",        "https://icon.horse/icon/moleskine.com"],
      ["voss",    null,      "Sony",          true,  4.8, 15000, 2021, "Electronics",       "https://icon.horse/icon/sony.com"],
      ["thread",  null,      "West Elm",      false, 4.5,  2200, 2023, "Textiles",          "https://icon.horse/icon/westelm.com"],
    ];
    for (const s of shops) {
      await client.query(`
        INSERT INTO shops (id, vendor_id, name, verified, rating, sales_count, since_year, category, logo_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, rating=EXCLUDED.rating,
          sales_count=EXCLUDED.sales_count, logo_url=EXCLUDED.logo_url
      `, s);
    }
    console.log("✅ Shops seeded");

    // Products
    console.log("⏳ Seeding products...");
    const products: [string, string, string, number, number|null, number, number, string|null, string][] = [
      ["p1",  "lumen",   "Arc Floor Lamp, Matte Brass",        189, 240,  4.9, 412,  "deal", "Lighting"],
      ["p2",  "fenwick", "Linen Desk Organizer Tray",           38,  null, 4.7, 188,  null,   "Office"],
      ["p3",  "mori",    "Hand-thrown Stoneware Mug, Set of 2", 44,  null, 5.0, 96,   "new",  "Kitchen"],
      ["p4",  "fenwick", "Walnut Monitor Stand",                79,  95,   4.8, 233,  null,   "Office"],
      ["p5",  "voss",    "Wireless Over-Ear Headphones",        159, null, 4.8, 1820, "deal", "Audio"],
      ["p6",  "mori",    "Ceramic Pour-Over Coffee Set",        68,  null, 4.9, 142,  null,   "Kitchen"],
      ["p7",  "nota",    "Paper Notebook, Dot Grid A5",         18,  null, 4.7, 540,  null,   "Stationery"],
      ["p8",  "lumen",   "Pendant Light, Smoked Glass",         124, null, 4.8, 211,  "new",  "Lighting"],
      ["p9",  "thread",  "Woven Throw Blanket, Sage",           89,  110,  4.6, 178,  null,   "Textiles"],
      ["p10", "arbor",   "Solar Path Lights, Set of 6",         52,  null, 4.5, 320,  null,   "Outdoor"],
      ["p11", "voss",    "Compact Bluetooth Speaker",           74,  null, 4.7, 905,  null,   "Audio"],
      ["p12", "lumen",   "Brass Task Desk Lamp",                98,  null, 4.8, 267,  "deal", "Lighting"],
      ["p13", "fenwick", "Recycled Felt Laptop Sleeve",         42,  null, 4.6, 134,  null,   "Office"],
      ["p14", "mori",    "Glazed Dinner Plate, Set of 4",       96,  null, 4.9, 88,   null,   "Kitchen"],
      ["p15", "nota",    "Leather Weekly Planner 2026",         34,  null, 4.8, 412,  "new",  "Stationery"],
      ["p16", "arbor",   "Cedar Planter Box, Large",            64,  null, 4.4, 96,   null,   "Outdoor"],
      ["p17", "thread",  "Wool Area Rug, 5x7 Ochre",            219, 280,  4.7, 64,   "deal", "Textiles"],
      ["p18", "voss",    "Studio Desk Microphone",              119, null, 4.6, 388,  null,   "Audio"],
      ["p19", "fenwick", "Minimalist Wall Clock, Oak",          56,  null, 4.7, 156,  null,   "Decor"],
      ["p20", "mori",    "Matte Black Cutlery, 16-pc",          78,  null, 4.8, 122,  null,   "Kitchen"],
      ["p21", "nota",    "Fountain Pen, Brushed Steel",         62,  null, 4.9, 240,  "new",  "Stationery"],
      ["p22", "lumen",   "Rattan Pendant Shade",                88,  null, 4.6, 98,   null,   "Lighting"],
      ["p23", "thread",  "Cotton Bath Towel Set, Clay",         58,  null, 4.5, 210,  null,   "Textiles"],
      ["p24", "voss",    "USB-C Desk Charging Hub",             49,  65,   4.7, 670,  "deal", "Electronics"],
    ];
    for (const p of products) {
      await client.query(`
        INSERT INTO products (id, shop_id, name, price, old_price, rating, reviews_count, tag, category)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET
          name=EXCLUDED.name, price=EXCLUDED.price, old_price=EXCLUDED.old_price,
          rating=EXCLUDED.rating, reviews_count=EXCLUDED.reviews_count,
          tag=EXCLUDED.tag, category=EXCLUDED.category
      `, p);
    }
    console.log("✅ Products seeded");

    // Reviews
    console.log("⏳ Seeding reviews...");
    const reviews = [
      ["p1",  customer.id, "Dana R.",   5, "Beautiful quality and arrived faster than expected."],
      ["p1",  customer.id, "Marcus T.", 5, "Second purchase. Consistent, well-packaged, and the AI summary was spot on."],
      ["p1",  customer.id, "Priya S.",  4, "Lovely piece, slightly smaller than I imagined but great value."],
      ["p5",  customer.id, "Owen K.",   5, "Exactly what I was looking for. Cross-vendor compare made it easy."],
      ["p5",  customer.id, "Sam D.",    5, "Incredible sound quality for the price."],
      ["p7",  customer.id, "Ivy C.",    4, "Nice notebook, paper quality is great. Dot grid is perfect."],
      ["p3",  customer.id, "Nora W.",   5, "These mugs are absolutely stunning. The craftsmanship is superb."],
      ["p12", customer.id, "Theo B.",   5, "Perfect desk lamp. The brass finish is premium and the light is warm."],
    ];
    for (const r of reviews) {
      await client.query(`
        INSERT INTO reviews (product_id, user_id, reviewer_name, rating, body)
        VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING
      `, r);
    }
    console.log("✅ Reviews seeded");

    // Sample orders
    console.log("⏳ Seeding orders...");
    const now = new Date();
    const ago = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();

    const orders = [
      { id: "CL-284910", uid: customer.id, status: "shipped",   total: 233, date: ago(4),  items: [{ p: "p1", shop: "lumen",   q: 1, price: 189 }, { p: "p5", shop: "voss", q: 1, price: 44 }] },
      { id: "CL-284902", uid: customer.id, status: "new",       total: 44,  date: ago(4),  items: [{ p: "p3", shop: "mori",    q: 1, price: 44  }] },
      { id: "CL-284887", uid: customer.id, status: "packed",    total: 159, date: ago(5),  items: [{ p: "p5", shop: "voss",    q: 1, price: 159 }] },
      { id: "CL-284861", uid: customer.id, status: "delivered", total: 196, date: ago(6),  items: [{ p: "p2", shop: "fenwick", q: 1, price: 38  }, { p: "p4", shop: "fenwick", q: 1, price: 79 }, { p: "p13", shop: "fenwick", q: 2, price: 42 }] },
      { id: "CL-284844", uid: customer.id, status: "new",       total: 140, date: ago(6),  items: [{ p: "p6", shop: "mori",    q: 1, price: 68  }, { p: "p14", shop: "mori",  q: 1, price: 72 }] },
      { id: "CL-284820", uid: null,        status: "shipped",   total: 98,  date: ago(7),  items: [{ p: "p12", shop: "lumen",  q: 1, price: 98  }] },
      { id: "CL-284799", uid: customer.id, status: "delivered", total: 18,  date: ago(8),  items: [{ p: "p7",  shop: "nota",   q: 1, price: 18  }] },
      { id: "CL-284771", uid: customer.id, status: "refund",    total: 74,  date: ago(9),  items: [{ p: "p11", shop: "voss",   q: 1, price: 74  }] },
      { id: "CL-284750", uid: null,        status: "packed",    total: 116, date: ago(9),  items: [{ p: "p10", shop: "arbor",  q: 1, price: 52  }, { p: "p16", shop: "arbor",  q: 1, price: 64 }] },
      { id: "CL-284722", uid: null,        status: "new",       total: 89,  date: ago(10), items: [{ p: "p9",  shop: "thread", q: 1, price: 89  }] },
    ];

    for (const o of orders) {
      const subtotal = o.items.reduce((s, i) => s + i.price * i.q, 0);
      const tax      = parseFloat((subtotal * 0.07).toFixed(2));
      await client.query(`
        INSERT INTO orders (id, user_id, status, subtotal, tax, total, shipping_name, payment_last4, payment_brand, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,'Alex Morgan','4242','visa',$7)
        ON CONFLICT (id) DO NOTHING
      `, [o.id, o.uid, o.status, subtotal, tax, o.total, o.date]);

      for (const item of o.items) {
        const { rows } = await client.query("SELECT name FROM products WHERE id = $1", [item.p]);
        if (!rows.length) continue;
        await client.query(`
          INSERT INTO order_items (order_id, product_id, shop_id, product_name, qty, price)
          VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING
        `, [o.id, item.p, item.shop, rows[0].name, item.q, item.price]);
      }
    }
    console.log("✅ Orders seeded");

    // Saved sets
    console.log("⏳ Seeding saved sets...");
    const sets = [
      { name: "Calm home office",           items: ["p12","p4","p2","p9"] },
      { name: "Slow morning coffee corner",  items: ["p3","p6","p20"]     },
      { name: "Cozy living room refresh",    items: ["p8","p22","p17"]    },
    ];
    for (const ss of sets) {
      const { rows: ex } = await client.query(
        "SELECT id FROM saved_sets WHERE user_id=$1 AND name=$2",
        [customer.id, ss.name]
      );
      let setId: string;
      if (ex.length) {
        setId = ex[0].id;
      } else {
        const { rows: ins } = await client.query(
          "INSERT INTO saved_sets (user_id,name) VALUES ($1,$2) RETURNING id",
          [customer.id, ss.name]
        );
        setId = ins[0].id;
      }
      for (const pid of ss.items) {
        await client.query(
          "INSERT INTO saved_set_items (set_id,product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
          [setId, pid]
        );
      }
    }
    console.log("✅ Saved sets seeded");

    console.log(`
🎉 Seed complete!

Demo accounts (password: demo1234):
  admin@celeste.shop    → Admin dashboard
  vendor@celeste.shop   → Vendor dashboard (Lumen/IKEA shop)
  customer@celeste.shop → Customer dashboard (Alex Morgan)
`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
