import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const { rows } = await db.query(`
      SELECT s.*,
             u.email                                    AS vendor_email,
             COUNT(DISTINCT p.id)::INT                  AS product_count,
             COALESCE(SUM(oi.price * oi.qty), 0)::FLOAT AS gmv,
             COUNT(DISTINCT o.id)::INT                  AS order_count
      FROM shops s
      LEFT JOIN users        u  ON u.id = s.vendor_id
      LEFT JOIN products     p  ON p.shop_id = s.id
      LEFT JOIN order_items  oi ON oi.shop_id = s.id
      LEFT JOIN orders       o  ON o.id = oi.order_id
      GROUP BY s.id, u.email
      ORDER BY gmv DESC
    `);

    return ok(rows.map(r => ({
      id:           r.id,
      name:         r.name,
      vendorEmail:  r.vendor_email ?? null,
      verified:     r.verified,
      rating:       parseFloat(r.rating),
      sales:        r.sales_count,
      cat:          r.category,
      logo:         r.logo_url,
      productCount: r.product_count,
      gmv:          r.gmv,
      orders:       r.order_count,
    })));
  } catch (e) {
    console.error("[GET /api/admin/vendors]", e);
    return err("Server error", 500);
  }
}
