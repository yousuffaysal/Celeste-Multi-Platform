import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [shopRes, productsRes] = await Promise.all([
      db.query("SELECT * FROM shops WHERE id = $1", [id]),
      db.query(
        `SELECT p.*
         FROM products p WHERE p.shop_id = $1
         ORDER BY p.created_at ASC`,
        [id]
      ),
    ]);

    if (!shopRes.rows.length) return err("Shop not found", 404);
    const s = shopRes.rows[0];

    return ok({
      id:       s.id,
      name:     s.name,
      verified: s.verified,
      rating:   parseFloat(s.rating),
      sales:    s.sales_count,
      since:    s.since_year?.toString() ?? "",
      cat:      s.category,
      logo:     s.logo_url,
      desc:     s.description,
      products: productsRes.rows.map(p => ({
        id:      p.id,
        name:    p.name,
        price:   parseFloat(p.price),
        old:     p.old_price ? parseFloat(p.old_price) : undefined,
        rating:  parseFloat(p.rating),
        reviews: p.reviews_count,
        tag:     p.tag ?? undefined,
        cat:     p.category,
        ratio:   p.image_ratio,
      })),
    });
  } catch (e) {
    console.error("[GET /api/shops/[id]]", e);
    return err("Server error", 500);
  }
}
