import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

const VALID_STATUSES = ["new", "packed", "shipped", "delivered", "refund"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) return err("Invalid status");

    const { rows } = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, id]
    );
    if (!rows.length) return err("Order not found", 404);
    return ok(rows[0]);
  } catch (e) {
    console.error("[PATCH /api/admin/orders/[id]]", e);
    return err("Server error", 500);
  }
}
