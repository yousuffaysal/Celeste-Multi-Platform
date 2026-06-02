import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setSessionCookie, ok, err } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return err("Email and password required");

    const { rows } = await db.query(
      "SELECT id, email, name, role, shop_id, password_hash FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user) return err("Invalid credentials", 401);

    const valid = await bcrypt.compare(password, user.password_hash ?? "");
    if (!valid) return err("Invalid credentials", 401);

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      shopId: user.shop_id ?? undefined,
    });

    const res = ok({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      shopId: user.shop_id ?? null,
    });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    console.error("[login]", e);
    return err("Server error", 500);
  }
}
