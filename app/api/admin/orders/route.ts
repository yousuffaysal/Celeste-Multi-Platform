import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const sp     = req.nextUrl.searchParams;
    const status = sp.get("status") ?? "";
    const page   = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit  = Math.min(50, parseInt(sp.get("limit") ?? "20"));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;
    if (status) { conditions.push(`o.status = $${i++}`); params.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRes, dataRes] = await Promise.all([
      db.query(`SELECT COUNT(*)::INT AS total FROM orders o ${where}`, params),
      db.query(`
        SELECT o.id, o.status, o.total, o.created_at,
               COALESCE(u.name, 'Guest')          AS customer,
               COALESCE(u.email, '')               AS customer_email,
               COUNT(oi.id)::INT                   AS items,
               STRING_AGG(DISTINCT s.name, ', ')   AS vendor
        FROM orders o
        LEFT JOIN users       u  ON u.id  = o.user_id
        JOIN  order_items oi ON oi.order_id = o.id
        JOIN  shops       s  ON s.id  = oi.shop_id
        ${where}
        GROUP BY o.id, u.name, u.email
        ORDER BY o.created_at DESC
        LIMIT $${i++} OFFSET $${i++}
      `, [...params, limit, offset]),
    ]);

    return ok({
      items: dataRes.rows.map(r => ({
        id:            r.id,
        status:        r.status,
        total:         parseFloat(r.total),
        date:          r.created_at,
        customer:      r.customer,
        customerEmail: r.customer_email,
        items:         r.items,
        vendor:        r.vendor,
      })),
      total:    countRes.rows[0].total,
      page,
      pageSize: limit,
    });
  } catch (e) {
    console.error("[GET /api/admin/orders]", e);
    return err("Server error", 500);
  }
}
