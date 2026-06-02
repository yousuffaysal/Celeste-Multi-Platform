import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, getCurrentUser, getCartSession, ok, err } from "@/lib/auth";

function genOrderId() {
  const n = Math.floor(Math.random() * 900_000) + 100_000;
  const s = Math.floor(Math.random() * 900) + 100;
  return `CLT-${n}-${s}`;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const sp     = req.nextUrl.searchParams;
    const page   = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit  = Math.min(20, parseInt(sp.get("limit") ?? "10"));
    const offset = (page - 1) * limit;

    const [countRes, dataRes] = await Promise.all([
      db.query("SELECT COUNT(*)::INT AS total FROM orders WHERE user_id = $1", [auth.id]),
      db.query(
        `SELECT o.id, o.status, o.total, o.created_at,
                COUNT(oi.id)::INT AS item_count,
                STRING_AGG(DISTINCT s.name, ', ') AS shops
         FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         JOIN shops s ON s.id = oi.shop_id
         WHERE o.user_id = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT $2 OFFSET $3`,
        [auth.id, limit, offset]
      ),
    ]);

    return ok({
      items: dataRes.rows.map(r => ({
        id:        r.id,
        status:    r.status,
        total:     parseFloat(r.total),
        date:      r.created_at,
        itemCount: r.item_count,
        shops:     r.shops,
      })),
      total:    countRes.rows[0].total,
      page,
      pageSize: limit,
    });
  } catch (e) {
    console.error("[GET /api/orders]", e);
    return err("Server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Both guests and logged-in users can place orders
    const user    = await getCurrentUser(req);
    const session = getCartSession(req);

    const {
      shipping_name, shipping_line1, shipping_line2,
      shipping_city, shipping_postcode, shipping_country = "United Kingdom",
      payment_last4, payment_brand = "visa",
    } = await req.json();

    // Fetch cart
    const cartWhere = user
      ? { clause: "user_id = $1", param: user.id }
      : { clause: "session_id = $1", param: session };

    if (!cartWhere.param) return err("No cart session", 400);

    const { rows: cartRows } = await db.query(
      `SELECT ci.qty, p.id AS pid, p.name, p.price, p.shop_id
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.${cartWhere.clause}`,
      [cartWhere.param]
    );

    if (!cartRows.length) return err("Cart is empty", 400);

    const subtotal = cartRows.reduce((s, r) => s + parseFloat(r.price) * r.qty, 0);
    const tax      = parseFloat((subtotal * 0.07).toFixed(2));
    const total    = parseFloat((subtotal + tax).toFixed(2));

    // Generate unique order id
    let orderId = genOrderId();
    let attempt = 0;
    while (attempt < 5) {
      const check = await db.query("SELECT id FROM orders WHERE id = $1", [orderId]);
      if (!check.rows.length) break;
      orderId = genOrderId();
      attempt++;
    }

    // Insert order + items in a transaction
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO orders
           (id, user_id, status, subtotal, tax, total,
            shipping_name, shipping_line1, shipping_line2,
            shipping_city, shipping_postcode, shipping_country,
            payment_last4, payment_brand)
         VALUES ($1,$2,'new',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          orderId, user?.id ?? null, subtotal, tax, total,
          shipping_name ?? null, shipping_line1 ?? null, shipping_line2 ?? null,
          shipping_city ?? null, shipping_postcode ?? null, shipping_country,
          payment_last4 ?? null, payment_brand,
        ]
      );

      for (const r of cartRows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, shop_id, product_name, qty, price)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderId, r.pid, r.shop_id, r.name, r.qty, r.price]
        );
      }

      // Clear cart
      await client.query(
        `DELETE FROM cart_items WHERE ${cartWhere.clause}`,
        [cartWhere.param]
      );

      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    return ok({ orderId, status: "new", total }, 201);
  } catch (e) {
    console.error("[POST /api/orders]", e);
    return err("Server error", 500);
  }
}
