import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed disabled in production" }, { status: 403 });
  }

  // Simple auth header check
  const secret = req.headers.get("x-seed-secret");
  if (secret !== (process.env.SEED_SECRET ?? "celeste-seed")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // ── 1. Run schema ────────────────────────────────────────
    const schema = readFileSync(join(process.cwd(), "lib/schema.sql"), "utf8");
    await db.query(schema);

    // ── 2. Demo users ────────────────────────────────────────
    const hash = await bcrypt.hash("demo1234", 10);

    await db.query(`
      INSERT INTO users (email, password_hash, name, role, shop_id) VALUES
        ('admin@celeste.shop',    $1, 'Admin User',  'admin',    null),
        ('vendor@celeste.shop',   $1, 'Lumen Studio', 'vendor', 'lumen'),
        ('customer@celeste.shop', $1, 'Alex Morgan',  'customer', null)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [hash]);

    // Fetch vendor id
    const { rows: vendorRow } = await db.query(
      "SELECT id FROM users WHERE email = 'vendor@celeste.shop'"
    );
    const vendorId = vendorRow[0].id;

    // Fetch customer id
    const { rows: custRow } = await db.query(
      "SELECT id FROM users WHERE email = 'customer@celeste.shop'"
    );
    const customerId = custRow[0].id;

    // ── 3. Shops ─────────────────────────────────────────────
    const shops = [
      { id: "lumen",   name: "IKEA",          verified: true,  rating: 4.9, sales: 12000, since: 2021, cat: "Lighting & Decor",  logo: "https://icon.horse/icon/ikea.com",            vendor: vendorId },
      { id: "fenwick", name: "Herman Miller", verified: true,  rating: 4.8, sales: 8400,  since: 2020, cat: "Home & Office",     logo: "https://icon.horse/icon/hermanmiller.com",    vendor: null },
      { id: "mori",    name: "Le Creuset",    verified: true,  rating: 5.0, sales: 3100,  since: 2022, cat: "Kitchen & Dining",  logo: "https://www.google.com/s2/favicons?sz=128&domain=lecreuset.com", vendor: null },
      { id: "arbor",   name: "Patagonia",     verified: false, rating: 4.6, sales: 5700,  since: 2023, cat: "Outdoor & Garden",  logo: "https://icon.horse/icon/patagonia.com",       vendor: null },
      { id: "nota",    name: "Moleskine",     verified: true,  rating: 4.7, sales: 9200,  since: 2019, cat: "Stationery",        logo: "https://icon.horse/icon/moleskine.com",       vendor: null },
      { id: "voss",    name: "Sony",          verified: true,  rating: 4.8, sales: 15000, since: 2021, cat: "Electronics",       logo: "https://icon.horse/icon/sony.com",            vendor: null },
      { id: "thread",  name: "West Elm",      verified: false, rating: 4.5, sales: 2200,  since: 2023, cat: "Textiles",          logo: "https://icon.horse/icon/westelm.com",         vendor: null },
    ];

    for (const s of shops) {
      await db.query(`
        INSERT INTO shops (id, vendor_id, name, verified, rating, sales_count, category, logo_url, since_year)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, verified = EXCLUDED.verified, rating = EXCLUDED.rating,
          sales_count = EXCLUDED.sales_count, category = EXCLUDED.category,
          logo_url = EXCLUDED.logo_url, since_year = EXCLUDED.since_year
      `, [s.id, s.vendor, s.name, s.verified, s.rating, s.sales, s.cat, s.logo, s.since]);
    }

    // ── 4. Products ──────────────────────────────────────────
    const products = [
      { id: "p1",  shop: "lumen",   name: "Arc Floor Lamp, Matte Brass",       price: 189, old: 240, rating: 4.9, reviews: 412, tag: "deal", cat: "Lighting" },
      { id: "p2",  shop: "fenwick", name: "Linen Desk Organizer Tray",          price: 38,  old: null, rating: 4.7, reviews: 188, tag: null,   cat: "Office" },
      { id: "p3",  shop: "mori",    name: "Hand-thrown Stoneware Mug, Set of 2",price: 44,  old: null, rating: 5.0, reviews: 96,  tag: "new",  cat: "Kitchen" },
      { id: "p4",  shop: "fenwick", name: "Walnut Monitor Stand",               price: 79,  old: 95,  rating: 4.8, reviews: 233, tag: null,   cat: "Office" },
      { id: "p5",  shop: "voss",    name: "Wireless Over-Ear Headphones",       price: 159, old: null, rating: 4.8, reviews: 1820,tag: "deal", cat: "Audio" },
      { id: "p6",  shop: "mori",    name: "Ceramic Pour-Over Coffee Set",       price: 68,  old: null, rating: 4.9, reviews: 142, tag: null,   cat: "Kitchen" },
      { id: "p7",  shop: "nota",    name: "Paper Notebook, Dot Grid A5",        price: 18,  old: null, rating: 4.7, reviews: 540, tag: null,   cat: "Stationery" },
      { id: "p8",  shop: "lumen",   name: "Pendant Light, Smoked Glass",        price: 124, old: null, rating: 4.8, reviews: 211, tag: "new",  cat: "Lighting" },
      { id: "p9",  shop: "thread",  name: "Woven Throw Blanket, Sage",          price: 89,  old: 110, rating: 4.6, reviews: 178, tag: null,   cat: "Textiles" },
      { id: "p10", shop: "arbor",   name: "Solar Path Lights, Set of 6",        price: 52,  old: null, rating: 4.5, reviews: 320, tag: null,   cat: "Outdoor" },
      { id: "p11", shop: "voss",    name: "Compact Bluetooth Speaker",          price: 74,  old: null, rating: 4.7, reviews: 905, tag: null,   cat: "Audio" },
      { id: "p12", shop: "lumen",   name: "Brass Task Desk Lamp",               price: 98,  old: null, rating: 4.8, reviews: 267, tag: "deal", cat: "Lighting" },
      { id: "p13", shop: "fenwick", name: "Recycled Felt Laptop Sleeve",        price: 42,  old: null, rating: 4.6, reviews: 134, tag: null,   cat: "Office" },
      { id: "p14", shop: "mori",    name: "Glazed Dinner Plate, Set of 4",      price: 96,  old: null, rating: 4.9, reviews: 88,  tag: null,   cat: "Kitchen" },
      { id: "p15", shop: "nota",    name: "Leather Weekly Planner 2026",        price: 34,  old: null, rating: 4.8, reviews: 412, tag: "new",  cat: "Stationery" },
      { id: "p16", shop: "arbor",   name: "Cedar Planter Box, Large",           price: 64,  old: null, rating: 4.4, reviews: 96,  tag: null,   cat: "Outdoor" },
      { id: "p17", shop: "thread",  name: "Wool Area Rug, 5x7 Ochre",           price: 219, old: 280, rating: 4.7, reviews: 64,  tag: "deal", cat: "Textiles" },
      { id: "p18", shop: "voss",    name: "Studio Desk Microphone",             price: 119, old: null, rating: 4.6, reviews: 388, tag: null,   cat: "Audio" },
      { id: "p19", shop: "fenwick", name: "Minimalist Wall Clock, Oak",         price: 56,  old: null, rating: 4.7, reviews: 156, tag: null,   cat: "Decor" },
      { id: "p20", shop: "mori",    name: "Matte Black Cutlery, 16-pc",         price: 78,  old: null, rating: 4.8, reviews: 122, tag: null,   cat: "Kitchen" },
      { id: "p21", shop: "nota",    name: "Fountain Pen, Brushed Steel",        price: 62,  old: null, rating: 4.9, reviews: 240, tag: "new",  cat: "Stationery" },
      { id: "p22", shop: "lumen",   name: "Rattan Pendant Shade",               price: 88,  old: null, rating: 4.6, reviews: 98,  tag: null,   cat: "Lighting" },
      { id: "p23", shop: "thread",  name: "Cotton Bath Towel Set, Clay",        price: 58,  old: null, rating: 4.5, reviews: 210, tag: null,   cat: "Textiles" },
      { id: "p24", shop: "voss",    name: "USB-C Desk Charging Hub",            price: 49,  old: 65,  rating: 4.7, reviews: 670, tag: "deal", cat: "Electronics" },
    ];

    for (const p of products) {
      await db.query(`
        INSERT INTO products (id, shop_id, name, price, old_price, rating, reviews_count, tag, category)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, price = EXCLUDED.price, old_price = EXCLUDED.old_price,
          rating = EXCLUDED.rating, reviews_count = EXCLUDED.reviews_count,
          tag = EXCLUDED.tag, category = EXCLUDED.category
      `, [p.id, p.shop, p.name, p.price, p.old ?? null, p.rating, p.reviews, p.tag ?? null, p.cat]);
    }

    // ── 5. Reviews ───────────────────────────────────────────
    const reviews = [
      { pid: "p1",  name: "Dana R.",    rating: 5, text: "Beautiful quality and arrived faster than expected. The finish is exactly as pictured." },
      { pid: "p1",  name: "Marcus T.", rating: 5, text: "Second purchase from this shop. Consistent, well-packaged, and the AI summary was spot on." },
      { pid: "p1",  name: "Priya S.",  rating: 4, text: "Lovely piece, slightly smaller than I imagined but great value for the price." },
      { pid: "p5",  name: "Owen K.",   rating: 5, text: "Exactly what I was looking for. Cross-vendor compare made it easy to pick the best one." },
      { pid: "p5",  name: "Sam D.",    rating: 5, text: "Incredible sound quality for the price. Highly recommend." },
      { pid: "p7",  name: "Ivy C.",    rating: 4, text: "Nice notebook, paper quality is great. Dot grid is perfect for my notes." },
      { pid: "p3",  name: "Nora W.",   rating: 5, text: "These mugs are absolutely stunning. The craftsmanship is superb." },
      { pid: "p12", name: "Theo B.",   rating: 5, text: "Perfect desk lamp. The brass finish is premium and the light is warm and focused." },
    ];

    for (const r of reviews) {
      await db.query(`
        INSERT INTO reviews (product_id, user_id, reviewer_name, rating, body)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [r.pid, customerId, r.name, r.rating, r.text]);
    }

    // ── 6. Sample orders (for dashboard data) ────────────────
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();

    const sampleOrders = [
      { id: "CL-284910", user: customerId, status: "shipped",   total: 233, items: [{ pid: "p1", shop: "lumen",   qty: 1, price: 189 }, { pid: "p5", shop: "voss", qty: 1, price: 44 }],          date: daysAgo(4) },
      { id: "CL-284902", user: customerId, status: "new",       total: 44,  items: [{ pid: "p3", shop: "mori",    qty: 1, price: 44  }],                                                           date: daysAgo(4) },
      { id: "CL-284887", user: customerId, status: "packed",    total: 159, items: [{ pid: "p5", shop: "voss",    qty: 1, price: 159 }],                                                           date: daysAgo(5) },
      { id: "CL-284861", user: customerId, status: "delivered", total: 196, items: [{ pid: "p2", shop: "fenwick", qty: 1, price: 38  }, { pid: "p4", shop: "fenwick", qty: 1, price: 79 }, { pid: "p13", shop: "fenwick", qty: 2, price: 42 }], date: daysAgo(6) },
      { id: "CL-284844", user: customerId, status: "new",       total: 140, items: [{ pid: "p6", shop: "mori",    qty: 1, price: 68  }, { pid: "p14", shop: "mori",  qty: 1, price: 72 }],        date: daysAgo(6) },
      { id: "CL-284820", user: null,       status: "shipped",   total: 98,  items: [{ pid: "p12", shop: "lumen",  qty: 1, price: 98  }],                                                           date: daysAgo(7) },
      { id: "CL-284799", user: customerId, status: "delivered", total: 18,  items: [{ pid: "p7",  shop: "nota",   qty: 1, price: 18  }],                                                           date: daysAgo(8) },
      { id: "CL-284771", user: customerId, status: "refund",    total: 74,  items: [{ pid: "p11", shop: "voss",   qty: 1, price: 74  }],                                                           date: daysAgo(9) },
      { id: "CL-284750", user: null,       status: "packed",    total: 116, items: [{ pid: "p10", shop: "arbor",  qty: 1, price: 52  }, { pid: "p16", shop: "arbor",  qty: 1, price: 64 }],       date: daysAgo(9) },
      { id: "CL-284722", user: null,       status: "new",       total: 89,  items: [{ pid: "p9",  shop: "thread", qty: 1, price: 89  }],                                                           date: daysAgo(10) },
    ];

    for (const o of sampleOrders) {
      const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
      const tax      = parseFloat((subtotal * 0.07).toFixed(2));

      await db.query(`
        INSERT INTO orders (id, user_id, status, subtotal, tax, total, shipping_name, payment_last4, payment_brand, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,'Alex Morgan','4242','visa',$7)
        ON CONFLICT (id) DO NOTHING
      `, [o.id, o.user, o.status, subtotal, tax, o.total, o.date]);

      for (const item of o.items) {
        const { rows: pRows } = await db.query("SELECT name FROM products WHERE id = $1", [item.pid]);
        if (!pRows.length) continue;
        await db.query(`
          INSERT INTO order_items (order_id, product_id, shop_id, product_name, qty, price)
          VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT DO NOTHING
        `, [o.id, item.pid, item.shop, pRows[0].name, item.qty, item.price]);
      }
    }

    // ── 7. Saved sets ────────────────────────────────────────
    const savedSets = [
      { name: "Calm home office",          items: ["p12","p4","p2","p9"]  },
      { name: "Slow morning coffee corner", items: ["p3","p6","p20"]       },
      { name: "Cozy living room refresh",   items: ["p8","p22","p17"]      },
    ];

    for (const ss of savedSets) {
      const { rows: existing } = await db.query(
        "SELECT id FROM saved_sets WHERE user_id = $1 AND name = $2",
        [customerId, ss.name]
      );
      let setId: string;
      if (existing.length) {
        setId = existing[0].id;
      } else {
        const { rows: newSet } = await db.query(
          "INSERT INTO saved_sets (user_id, name) VALUES ($1,$2) RETURNING id",
          [customerId, ss.name]
        );
        setId = newSet[0].id;
      }
      for (const pid of ss.items) {
        await db.query(
          "INSERT INTO saved_set_items (set_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
          [setId, pid]
        );
      }
    }

    return NextResponse.json({
      ok: true,
      seeded: {
        users: 3,
        shops: shops.length,
        products: products.length,
        reviews: reviews.length,
        orders: sampleOrders.length,
        savedSets: savedSets.length,
      },
    });
  } catch (e) {
    console.error("[POST /api/seed]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
