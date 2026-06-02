import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, ok, err } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sp    = req.nextUrl.searchParams;
    const page  = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(20, parseInt(sp.get("limit") ?? "10"));
    const offset = (page - 1) * limit;

    const [countRes, dataRes] = await Promise.all([
      db.query("SELECT COUNT(*)::INT AS total FROM reviews WHERE product_id = $1", [id]),
      db.query(
        `SELECT id, reviewer_name, rating, body, created_at
         FROM reviews WHERE product_id = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [id, limit, offset]
      ),
    ]);

    return ok({
      items: dataRes.rows.map(r => ({
        id:     r.id,
        name:   r.reviewer_name,
        rating: r.rating,
        date:   r.created_at,
        text:   r.body,
      })),
      total:    countRes.rows[0].total,
      page,
      pageSize: limit,
    });
  } catch (e) {
    console.error("[GET reviews]", e);
    return err("Server error", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    const { rating, text, reviewer_name } = await req.json();

    if (!rating || rating < 1 || rating > 5) return err("rating must be 1–5");
    const name = user?.name ?? reviewer_name ?? "Anonymous";

    await db.query(
      `INSERT INTO reviews (product_id, user_id, reviewer_name, rating, body)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, user?.id ?? null, name, rating, text ?? null]
    );

    // Recalculate product rating
    await db.query(
      `UPDATE products SET
         rating        = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews WHERE product_id = $1),
         reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [id]
    );

    return ok({ submitted: true }, 201);
  } catch (e) {
    console.error("[POST reviews]", e);
    return err("Server error", 500);
  }
}
