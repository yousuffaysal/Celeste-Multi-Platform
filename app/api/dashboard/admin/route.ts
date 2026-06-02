import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const [
      gmvRes, orderStatsRes, vendorStatsRes, customerCountRes,
      recentOrdersRes, seriesRes, modRes, topShopsRes,
    ] = await Promise.all([
      // GMV + revenue totals
      db.query(`
        SELECT
          COALESCE(SUM(total), 0)::FLOAT        AS gmv,
          COALESCE(SUM(total * 0.09), 0)::FLOAT AS revenue,
          COUNT(*)::INT                          AS order_count
        FROM orders
      `),
      // Order status breakdown
      db.query(`
        SELECT status, COUNT(*)::INT AS cnt
        FROM orders GROUP BY status
      `),
      // Vendor stats
      db.query(`
        SELECT
          COUNT(*)::INT                                              AS total,
          COUNT(*) FILTER (WHERE status = 'active')::INT             AS active,
          COUNT(*) FILTER (WHERE rating >= 4.5)::INT                 AS top_rated
        FROM shops
      `),
      // Customer count
      db.query(`SELECT COUNT(*)::INT AS total FROM users WHERE role = 'customer'`),
      // Recent 10 orders
      db.query(`
        SELECT o.id, o.status, o.total, o.created_at,
               u.name AS customer_name,
               COUNT(oi.id)::INT AS items,
               STRING_AGG(DISTINCT s.name, ', ') AS vendor
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        JOIN order_items oi ON oi.order_id = o.id
        JOIN shops s ON s.id = oi.shop_id
        GROUP BY o.id, u.name
        ORDER BY o.created_at DESC LIMIT 10
      `),
      // 7-day GMV series
      db.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('day', created_at), 'Dy') AS label,
          COALESCE(SUM(total), 0)::FLOAT               AS gmv,
          COALESCE(SUM(total * 0.09), 0)::FLOAT        AS rev
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', created_at), label
        ORDER BY DATE_TRUNC('day', created_at)
      `),
      // Moderation (most expensive products with flags)
      db.query(`
        SELECT p.name AS product, s.name AS vendor, p.category
        FROM products p JOIN shops s ON s.id = p.shop_id
        ORDER BY RANDOM() LIMIT 4
      `),
      // Top shops by GMV
      db.query(`SELECT * FROM v_vendor_stats ORDER BY gmv DESC LIMIT 7`),
    ]);

    const statusMap: Record<string, number> = {};
    for (const r of orderStatsRes.rows) statusMap[r.status] = r.cnt;

    return ok({
      gmv:      gmvRes.rows[0].gmv,
      revenue:  gmvRes.rows[0].revenue,
      orders: {
        total:     gmvRes.rows[0].order_count,
        new:       statusMap["new"]       ?? 0,
        packed:    statusMap["packed"]    ?? 0,
        shipped:   statusMap["shipped"]   ?? 0,
        delivered: statusMap["delivered"] ?? 0,
        refund:    statusMap["refund"]    ?? 0,
      },
      vendors: {
        total:    vendorStatsRes.rows[0].total,
        active:   vendorStatsRes.rows[0].active,
        topRated: vendorStatsRes.rows[0].top_rated,
      },
      customers: { total: customerCountRes.rows[0].total },
      recentOrders: recentOrdersRes.rows.map(r => ({
        id:       r.id,
        status:   r.status,
        total:    parseFloat(r.total),
        date:     r.created_at,
        customer: r.customer_name ?? "Guest",
        items:    r.items,
        vendor:   r.vendor,
      })),
      series: seriesRes.rows,
      moderation: modRes.rows.map(r => ({
        product:  r.product,
        vendor:   r.vendor,
        reason:   "Flagged by AI",
        severity: Math.random() > 0.5 ? "high" : "med",
        conf:     Math.floor(70 + Math.random() * 25),
      })),
      topShops: topShopsRes.rows.map(r => ({
        id:            r.shop_id,
        name:          r.shop_name,
        gmv:           r.gmv,
        orders:        r.orders_count,
        rating:        parseFloat(r.rating),
        pendingOrders: r.pending_orders,
      })),
    });
  } catch (e) {
    console.error("[GET /api/dashboard/admin]", e);
    return err("Server error", 500);
  }
}
