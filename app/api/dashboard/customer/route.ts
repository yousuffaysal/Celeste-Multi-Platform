import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const [ordersRes, savedSetsRes, spendRes] = await Promise.all([
      // User's orders with items
      db.query(`
        SELECT o.id, o.status, o.total, o.created_at,
               COUNT(oi.id)::INT                    AS item_count,
               STRING_AGG(DISTINCT s.name, ', ')    AS vendor
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN shops       s  ON s.id = oi.shop_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC LIMIT 10
      `, [auth.id]),
      // Saved sets
      db.query(`
        SELECT ss.id, ss.name, ss.created_at,
               COUNT(ssi.id)::INT                       AS item_count,
               COALESCE(SUM(p.price), 0)::FLOAT         AS total,
               COUNT(DISTINCT p.shop_id)::INT           AS shop_count
        FROM saved_sets ss
        LEFT JOIN saved_set_items ssi ON ssi.set_id = ss.id
        LEFT JOIN products        p   ON p.id = ssi.product_id
        WHERE ss.user_id = $1
        GROUP BY ss.id
        ORDER BY ss.created_at DESC LIMIT 5
      `, [auth.id]),
      // Spend by category (from completed orders)
      db.query(`
        SELECT p.category AS cat,
               SUM(oi.price * oi.qty)::FLOAT AS spent
        FROM order_items oi
        JOIN orders  o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.user_id = $1
        GROUP BY p.category
        ORDER BY spent DESC LIMIT 5
      `, [auth.id]),
    ]);

    const totalSpent = ordersRes.rows.reduce((s: number, r: { total: string }) => s + parseFloat(r.total), 0);

    return ok({
      stats: {
        orders:     ordersRes.rows.length,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        savedSets:  savedSetsRes.rows.length,
      },
      orders: ordersRes.rows.map(r => ({
        id:     r.id,
        status: r.status,
        total:  parseFloat(r.total),
        date:   r.created_at,
        items:  r.item_count,
        vendor: r.vendor,
      })),
      savedSets: savedSetsRes.rows.map(r => ({
        id:        r.id,
        name:      r.name,
        date:      r.created_at,
        itemCount: r.item_count,
        total:     r.total,
        shops:     r.shop_count,
      })),
      spendByCategory: spendRes.rows.map(r => ({
        cat:   r.cat ?? "Other",
        spent: r.spent,
      })),
    });
  } catch (e) {
    console.error("[GET /api/dashboard/customer]", e);
    return err("Server error", 500);
  }
}
