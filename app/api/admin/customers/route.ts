import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const sp     = req.nextUrl.searchParams;
    const page   = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit  = Math.min(50, parseInt(sp.get("limit") ?? "20"));
    const offset = (page - 1) * limit;

    const [countRes, dataRes] = await Promise.all([
      db.query("SELECT COUNT(*)::INT AS total FROM users WHERE role = 'customer'"),
      db.query(`
        SELECT u.id, u.name, u.email, u.created_at,
               COUNT(DISTINCT o.id)::INT             AS orders,
               COALESCE(SUM(o.total), 0)::FLOAT      AS spent
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        WHERE u.role = 'customer'
        GROUP BY u.id
        ORDER BY spent DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
    ]);

    return ok({
      items: dataRes.rows.map(r => ({
        id:      r.id,
        name:    r.name,
        email:   r.email,
        joined:  r.created_at,
        orders:  r.orders,
        spent:   r.spent,
        seg:     r.spent > 2000 ? "VIP" : r.spent > 500 ? "Loyal" : r.orders > 0 ? "Active" : "New",
      })),
      total:    countRes.rows[0].total,
      page,
      pageSize: limit,
    });
  } catch (e) {
    console.error("[GET /api/admin/customers]", e);
    return err("Server error", 500);
  }
}
