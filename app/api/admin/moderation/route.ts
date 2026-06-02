import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

// In a real system this would be ML model output stored in a moderation_queue table.
// For now we surface low-stock + new products as a plausible queue.
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, "admin");
    if (auth instanceof Response) return auth;

    const { rows } = await db.query(`
      SELECT p.id, p.name AS product, s.name AS vendor, p.category,
             p.stock, p.created_at,
             CASE WHEN p.stock < 10 THEN 'low-stock'
                  WHEN p.created_at > NOW() - INTERVAL '7 days' THEN 'new-listing'
                  ELSE 'review' END AS reason
      FROM products p
      JOIN shops s ON s.id = p.shop_id
      ORDER BY p.created_at DESC LIMIT 10
    `);

    return ok(rows.map(r => ({
      id:       r.id,
      product:  r.product,
      vendor:   r.vendor,
      reason:   r.reason === "low-stock" ? "Stock critically low" :
                r.reason === "new-listing" ? "New listing review" : "Periodic review",
      severity: r.reason === "low-stock" ? "high" : "med",
      conf:     Math.floor(65 + Math.random() * 30),
    })));
  } catch (e) {
    console.error("[GET /api/admin/moderation]", e);
    return err("Server error", 500);
  }
}
