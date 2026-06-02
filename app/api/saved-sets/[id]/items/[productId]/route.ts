import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id, productId } = await params;

    const { rows: setRows } = await db.query(
      "SELECT id FROM saved_sets WHERE id = $1 AND user_id = $2",
      [id, auth.id]
    );
    if (!setRows.length) return err("Set not found", 404);

    await db.query(
      "DELETE FROM saved_set_items WHERE set_id = $1 AND product_id = $2",
      [id, productId]
    );
    return ok({ removed: productId });
  } catch (e) {
    console.error("[DELETE saved-sets/.../items/[productId]]", e);
    return err("Server error", 500);
  }
}
