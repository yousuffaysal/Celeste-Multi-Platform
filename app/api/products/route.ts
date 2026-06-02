import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q       = sp.get("q")?.trim() ?? "";
    const cat     = sp.get("cat") ?? "";
    const shop    = sp.get("shop") ?? "";
    const tag     = sp.get("tag") ?? "";
    const sort    = sp.get("sort") ?? "default";  // default | price_asc | price_desc | rating | newest
    const page    = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit   = Math.min(40, parseInt(sp.get("limit") ?? "24"));
    const offset  = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (q) {
      conditions.push(
        `to_tsvector('english', p.name || ' ' || COALESCE(p.category,'')) @@ plainto_tsquery('english', $${i++})`
      );
      params.push(q);
    }
    if (cat) { conditions.push(`LOWER(p.category) = LOWER($${i++})`); params.push(cat); }
    if (shop) { conditions.push(`p.shop_id = $${i++}`); params.push(shop); }
    if (tag)  { conditions.push(`p.tag = $${i++}`); params.push(tag); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderBy = {
      price_asc:  "p.price ASC",
      price_desc: "p.price DESC",
      rating:     "p.rating DESC",
      newest:     "p.created_at DESC",
      default:    "p.created_at ASC",
    }[sort] ?? "p.created_at ASC";

    const countSql = `SELECT COUNT(*)::INT AS total FROM products p ${where}`;
    const dataSql  = `
      SELECT p.*, s.name AS shop_name, s.verified AS shop_verified, s.logo_url AS shop_logo
      FROM products p
      JOIN shops s ON s.id = p.shop_id
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${i++} OFFSET $${i++}
    `;

    const [countRes, dataRes] = await Promise.all([
      db.query(countSql, params),
      db.query(dataSql, [...params, limit, offset]),
    ]);

    const total = countRes.rows[0].total;
    const items = dataRes.rows.map(row => ({
      id:         row.id,
      name:       row.name,
      price:      parseFloat(row.price),
      old:        row.old_price ? parseFloat(row.old_price) : undefined,
      rating:     parseFloat(row.rating),
      reviews:    row.reviews_count,
      tag:        row.tag ?? undefined,
      cat:        row.category,
      ratio:      row.image_ratio,
      ai:         row.ai_enabled,
      stock:      row.stock,
      shop: {
        id:       row.shop_id,
        name:     row.shop_name,
        verified: row.shop_verified,
        logo:     row.shop_logo,
      },
    }));

    return ok({ items, total, page, pageSize: limit });
  } catch (e) {
    console.error("[GET /api/products]", e);
    return err("Server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "vendor");
    if (auth instanceof Response) return auth;

    const { name, price, old_price, tag, category, image_ratio, shop_id, stock = 100 } = await req.json();
    if (!name || !price || !shop_id) return err("name, price, and shop_id required");

    const id = "p" + Date.now();
    const { rows } = await db.query(
      `INSERT INTO products (id, shop_id, name, price, old_price, tag, category, image_ratio, stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, shop_id, name, price, old_price ?? null, tag ?? null, category ?? null, image_ratio ?? "1/1", stock]
    );

    return ok(rows[0], 201);
  } catch (e) {
    console.error("[POST /api/products]", e);
    return err("Server error", 500);
  }
}
