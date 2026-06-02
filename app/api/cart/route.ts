import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getCurrentUser, getCartSession, setCartCookie, ok, err } from "@/lib/auth";

/* Return (userId, sessionId, isNew) — one of the two will be non-null */
async function getCartOwner(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (user) return { userId: user.id, sessionId: null, isNew: false };
  const existing = getCartSession(req);
  if (existing) return { userId: null, sessionId: existing, isNew: false };
  return { userId: null, sessionId: randomUUID(), isNew: true };
}

function cartWhere(userId: string | null, sessionId: string | null) {
  return userId
    ? { clause: "user_id = $1", param: userId }
    : { clause: "session_id = $1", param: sessionId! };
}

async function fetchCart(userId: string | null, sessionId: string | null) {
  const { clause, param } = cartWhere(userId, sessionId);
  const { rows } = await db.query(
    `SELECT ci.id, ci.qty,
            p.id AS pid, p.name, p.price, p.old_price, p.image_ratio, p.tag,
            s.id AS shop_id, s.name AS shop_name, s.logo_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     JOIN shops    s ON s.id = p.shop_id
     WHERE ci.${clause}
     ORDER BY ci.added_at`,
    [param]
  );

  const items = rows.map(r => ({
    id:  r.id,
    qty: r.qty,
    product: {
      id:    r.pid,
      name:  r.name,
      price: parseFloat(r.price),
      old:   r.old_price ? parseFloat(r.old_price) : undefined,
      ratio: r.image_ratio,
      tag:   r.tag ?? undefined,
      shop:  { id: r.shop_id, name: r.shop_name, logo: r.logo_url },
    },
  }));
  const subtotal = parseFloat(
    items.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)
  );
  return { items, subtotal };
}

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionId, isNew } = await getCartOwner(req);
    const cart = await fetchCart(userId, sessionId);
    const res = ok(cart);
    if (isNew && sessionId) setCartCookie(res, sessionId);
    return res;
  } catch (e) {
    console.error("[GET /api/cart]", e);
    return err("Server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, isNew } = await getCartOwner(req);
    const { productId, qty = 1 } = await req.json();

    if (!productId) return err("productId required");
    if (qty < 1)   return err("qty must be >= 1");

    const productExists = await db.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (!productExists.rows.length) return err("Product not found", 404);

    const { clause, param } = cartWhere(userId, sessionId);

    // Upsert: increment qty if item already exists
    const existing = await db.query(
      `SELECT id, qty FROM cart_items WHERE ${clause} AND product_id = $2`,
      [param, productId]
    );

    if (existing.rows.length) {
      await db.query(
        "UPDATE cart_items SET qty = qty + $1 WHERE id = $2",
        [qty, existing.rows[0].id]
      );
    } else {
      const insertCol = userId ? "user_id" : "session_id";
      await db.query(
        `INSERT INTO cart_items (${insertCol}, product_id, qty) VALUES ($1,$2,$3)`,
        [param, productId, qty]
      );
    }

    const cart = await fetchCart(userId, sessionId);
    const res = ok(cart, 201);
    if (isNew && sessionId) setCartCookie(res, sessionId);
    return res;
  } catch (e) {
    console.error("[POST /api/cart]", e);
    return err("Server error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, sessionId } = await getCartOwner(req);
    const { clause, param } = cartWhere(userId, sessionId);
    await db.query(`DELETE FROM cart_items WHERE ${clause}`, [param]);
    return ok({ cleared: true });
  } catch (e) {
    console.error("[DELETE /api/cart]", e);
    return err("Server error", 500);
  }
}
