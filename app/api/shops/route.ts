import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const sp    = req.nextUrl.searchParams;
    const cat   = sp.get("cat") ?? "";
    const limit = Math.min(50, parseInt(sp.get("limit") ?? "20"));

    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (cat) { conditions.push(`LOWER(s.category) = LOWER($${i++})`); params.push(cat); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await db.query(
      `SELECT s.*,
              COUNT(p.id)::INT AS product_count
       FROM shops s
       LEFT JOIN products p ON p.shop_id = s.id
       ${where}
       GROUP BY s.id
       ORDER BY s.rating DESC, s.sales_count DESC
       LIMIT $${i}`,
      [...params, limit]
    );

    return ok(rows.map(r => ({
      id:           r.id,
      name:         r.name,
      verified:     r.verified,
      rating:       parseFloat(r.rating),
      sales:        r.sales_count,
      since:        r.since_year?.toString() ?? "",
      cat:          r.category,
      logo:         r.logo_url,
      productCount: r.product_count,
    })));
  } catch (e) {
    console.error("[GET /api/shops]", e);
    return err("Server error", 500);
  }
}
