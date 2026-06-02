import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "vendor");
    if (auth instanceof Response) return auth;

    if (!auth.shopId) return err("No shop associated with this account", 403);
    const shopId = auth.shopId;

    const [
      statsRes, ordersRes, seriesRes, productsRes, payoutsRes,
    ] = await Promise.all([
      // Revenue + order stats
      db.query(`
        SELECT
          COALESCE(SUM(oi.price * oi.qty), 0)::FLOAT AS gmv,
          COUNT(DISTINCT o.id)::INT                  AS total_orders,
          COUNT(DISTINCT o.id) FILTER (WHERE o.status IN ('new','packed'))::INT AS pending,
          COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'shipped')::INT        AS shipped,
          COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'delivered')::INT      AS delivered
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.shop_id = $1
      `, [shopId]),
      // Recent orders for this vendor
      db.query(`
        SELECT o.id, o.status, o.created_at,
               COALESCE(u.name, 'Guest')  AS customer,
               COUNT(oi.id)::INT          AS items,
               SUM(oi.price * oi.qty)::FLOAT AS vendor_total
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN users u ON u.id = o.user_id
        WHERE oi.shop_id = $1
        GROUP BY o.id, u.name
        ORDER BY o.created_at DESC LIMIT 10
      `, [shopId]),
      // 7-day revenue series
      db.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('day', o.created_at), 'Dy') AS label,
          COALESCE(SUM(oi.price * oi.qty), 0)::FLOAT     AS rev
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.shop_id = $1
          AND o.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', o.created_at), label
        ORDER BY DATE_TRUNC('day', o.created_at)
      `, [shopId]),
      // Products
      db.query(
        "SELECT * FROM products WHERE shop_id = $1 ORDER BY created_at",
        [shopId]
      ),
      // Simulated payouts (last 4)
      db.query(`
        SELECT
          'PO-' || EXTRACT(EPOCH FROM DATE_TRUNC('week', o.created_at))::INT AS id,
          TO_CHAR(DATE_TRUNC('week', o.created_at), 'Mon DD') AS date,
          SUM(oi.price * oi.qty)::FLOAT                       AS amount,
          CASE WHEN DATE_TRUNC('week', o.created_at) < DATE_TRUNC('week', NOW())
               THEN 'paid' ELSE 'scheduled' END               AS status
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.shop_id = $1
        GROUP BY DATE_TRUNC('week', o.created_at)
        ORDER BY DATE_TRUNC('week', o.created_at) DESC LIMIT 4
      `, [shopId]),
    ]);

    const s = statsRes.rows[0];

    return ok({
      shopId,
      gmv:      s.gmv,
      revenue:  parseFloat((s.gmv * 0.91).toFixed(2)),
      orders: {
        total:     s.total_orders,
        pending:   s.pending,
        shipped:   s.shipped,
        delivered: s.delivered,
      },
      recentOrders: ordersRes.rows.map(r => ({
        id:       r.id,
        status:   r.status,
        customer: r.customer,
        items:    r.items,
        total:    r.vendor_total,
        date:     r.created_at,
      })),
      series: seriesRes.rows,
      products: productsRes.rows.map(p => ({
        id:      p.id,
        name:    p.name,
        price:   parseFloat(p.price),
        stock:   p.stock,
        rating:  parseFloat(p.rating),
        reviews: p.reviews_count,
        tag:     p.tag,
        cat:     p.category,
      })),
      payouts: payoutsRes.rows,
    });
  } catch (e) {
    console.error("[GET /api/dashboard/vendor]", e);
    return err("Server error", 500);
  }
}
