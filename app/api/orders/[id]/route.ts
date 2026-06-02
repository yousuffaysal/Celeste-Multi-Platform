import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;

    const { rows: oRows } = await db.query(
      `SELECT * FROM orders WHERE id = $1
       AND (user_id = $2 OR $3 = 'admin')`,
      [id, auth.id, auth.role]
    );
    if (!oRows.length) return err("Order not found", 404);
    const o = oRows[0];

    const { rows: items } = await db.query(
      `SELECT oi.*, s.name AS shop_name
       FROM order_items oi
       JOIN shops s ON s.id = oi.shop_id
       WHERE oi.order_id = $1`,
      [id]
    );

    return ok({
      id:      o.id,
      status:  o.status,
      subtotal: parseFloat(o.subtotal),
      tax:     parseFloat(o.tax),
      total:   parseFloat(o.total),
      date:    o.created_at,
      shipping: {
        name:     o.shipping_name,
        line1:    o.shipping_line1,
        line2:    o.shipping_line2,
        city:     o.shipping_city,
        postcode: o.shipping_postcode,
        country:  o.shipping_country,
      },
      payment: {
        last4: o.payment_last4,
        brand: o.payment_brand,
      },
      items: items.map(i => ({
        id:          i.id,
        productId:   i.product_id,
        shopId:      i.shop_id,
        shopName:    i.shop_name,
        productName: i.product_name,
        qty:         i.qty,
        price:       parseFloat(i.price),
      })),
    });
  } catch (e) {
    console.error("[GET /api/orders/[id]]", e);
    return err("Server error", 500);
  }
}
