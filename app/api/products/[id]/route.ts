import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { rows } = await db.query(
      `SELECT p.*,
              s.name AS shop_name, s.verified AS shop_verified,
              s.logo_url AS shop_logo, s.rating AS shop_rating,
              s.sales_count, s.category AS shop_category
       FROM products p
       JOIN shops s ON s.id = p.shop_id
       WHERE p.id = $1`,
      [id]
    );

    if (!rows.length) return err("Product not found", 404);
    const row = rows[0];

    const { rows: revRows } = await db.query(
      `SELECT reviewer_name, rating, body, created_at
       FROM reviews WHERE product_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [id]
    );

    return ok({
      id:      row.id,
      name:    row.name,
      price:   parseFloat(row.price),
      old:     row.old_price ? parseFloat(row.old_price) : undefined,
      rating:  parseFloat(row.rating),
      reviews: row.reviews_count,
      tag:     row.tag ?? undefined,
      cat:     row.category,
      ratio:   row.image_ratio,
      ai:      row.ai_enabled,
      stock:   row.stock,
      shop: {
        id:       row.shop_id,
        name:     row.shop_name,
        verified: row.shop_verified,
        logo:     row.shop_logo,
        rating:   parseFloat(row.shop_rating),
        sales:    row.sales_count,
        cat:      row.shop_category,
      },
      recentReviews: revRows.map(r => ({
        name:   r.reviewer_name,
        rating: r.rating,
        date:   r.created_at,
        text:   r.body,
      })),
    });
  } catch (e) {
    console.error("[GET /api/products/[id]]", e);
    return err("Server error", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req, "vendor");
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const allowed = ["name", "price", "old_price", "tag", "category", "stock", "ai_enabled"];
    const sets: string[] = [];
    const vals: unknown[] = [];
    let i = 1;

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = $${i++}`);
        vals.push(body[key]);
      }
    }
    if (!sets.length) return err("Nothing to update");
    vals.push(id);

    const { rows } = await db.query(
      `UPDATE products SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`,
      vals
    );
    if (!rows.length) return err("Product not found", 404);
    return ok(rows[0]);
  } catch (e) {
    console.error("[PATCH /api/products/[id]]", e);
    return err("Server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const { id } = await params;
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    return ok({ deleted: id });
  } catch (e) {
    console.error("[DELETE /api/products/[id]]", e);
    return err("Server error", 500);
  }
}
