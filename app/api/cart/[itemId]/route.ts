import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, getCartSession, ok, err } from "@/lib/auth";

async function ownsItem(req: NextRequest, itemId: string): Promise<boolean> {
  const user = await getCurrentUser(req);
  const session = getCartSession(req);

  const { rows } = await db.query(
    `SELECT id FROM cart_items WHERE id = $1
     AND (user_id = $2 OR session_id = $3)`,
    [itemId, user?.id ?? null, session ?? null]
  );
  return rows.length > 0;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    if (!await ownsItem(req, itemId)) return err("Not found", 404);

    const { qty } = await req.json();
    if (typeof qty !== "number" || qty < 0) return err("qty must be >= 0");

    if (qty === 0) {
      await db.query("DELETE FROM cart_items WHERE id = $1", [itemId]);
      return ok({ removed: true });
    }

    const { rows } = await db.query(
      "UPDATE cart_items SET qty = $1 WHERE id = $2 RETURNING *",
      [qty, itemId]
    );
    return ok(rows[0]);
  } catch (e) {
    console.error("[PATCH /api/cart/[itemId]]", e);
    return err("Server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    if (!await ownsItem(req, itemId)) return err("Not found", 404);
    await db.query("DELETE FROM cart_items WHERE id = $1", [itemId]);
    return ok({ removed: true });
  } catch (e) {
    console.error("[DELETE /api/cart/[itemId]]", e);
    return err("Server error", 500);
  }
}
