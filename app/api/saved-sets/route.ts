import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { rows: sets } = await db.query(
      `SELECT ss.id, ss.name, ss.created_at,
              COUNT(ssi.id)::INT       AS item_count,
              COALESCE(SUM(p.price), 0)::FLOAT AS total,
              COUNT(DISTINCT p.shop_id)::INT   AS shop_count
       FROM saved_sets ss
       LEFT JOIN saved_set_items ssi ON ssi.set_id  = ss.id
       LEFT JOIN products        p   ON p.id        = ssi.product_id
       WHERE ss.user_id = $1
       GROUP BY ss.id
       ORDER BY ss.created_at DESC`,
      [auth.id]
    );

    // Fetch product ids for each set
    const setIds = sets.map(s => s.id);
    let itemsMap: Record<string, string[]> = {};

    if (setIds.length) {
      const { rows: items } = await db.query(
        `SELECT set_id, product_id FROM saved_set_items WHERE set_id = ANY($1)`,
        [setIds]
      );
      for (const r of items) {
        if (!itemsMap[r.set_id]) itemsMap[r.set_id] = [];
        itemsMap[r.set_id].push(r.product_id);
      }
    }

    return ok(sets.map(s => ({
      id:        s.id,
      name:      s.name,
      date:      s.created_at,
      items:     itemsMap[s.id] ?? [],
      itemCount: s.item_count,
      total:     s.total,
      shops:     s.shop_count,
    })));
  } catch (e) {
    console.error("[GET /api/saved-sets]", e);
    return err("Server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { name } = await req.json();
    if (!name?.trim()) return err("name required");

    const { rows } = await db.query(
      "INSERT INTO saved_sets (user_id, name) VALUES ($1,$2) RETURNING *",
      [auth.id, name.trim()]
    );
    return ok(rows[0], 201);
  } catch (e) {
    console.error("[POST /api/saved-sets]", e);
    return err("Server error", 500);
  }
}
