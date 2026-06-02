import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const { rows } = await db.query(
      "DELETE FROM saved_sets WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, auth.id]
    );
    if (!rows.length) return err("Not found", 404);
    return ok({ deleted: id });
  } catch (e) {
    console.error("[DELETE saved-sets/[id]]", e);
    return err("Server error", 500);
  }
}
