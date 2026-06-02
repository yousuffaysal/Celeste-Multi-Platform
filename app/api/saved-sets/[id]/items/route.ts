import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const { productId } = await req.json();
    if (!productId) return err("productId required");

    // Verify ownership
    const { rows: setRows } = await db.query(
      "SELECT id FROM saved_sets WHERE id = $1 AND user_id = $2",
      [id, auth.id]
    );
    if (!setRows.length) return err("Set not found", 404);

    await db.query(
      "INSERT INTO saved_set_items (set_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [id, productId]
    );
    return ok({ added: productId }, 201);
  } catch (e) {
    console.error("[POST saved-sets/[id]/items]", e);
    return err("Server error", 500);
  }
}
