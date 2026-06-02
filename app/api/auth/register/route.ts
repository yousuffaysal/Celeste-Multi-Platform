import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setSessionCookie, ok, err } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = "customer" } = await req.json();

    if (!name || !email || !password)
      return err("name, email, and password are required");
    if (password.length < 6)
      return err("Password must be at least 6 characters");
    if (!["customer", "vendor"].includes(role))
      return err("Invalid role");

    const exists = await db.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if (exists.rows.length) return err("Email already in use", 409);

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role`,
      [email.toLowerCase(), hash, name.trim(), role]
    );
    const user = rows[0];

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = ok({ id: user.id, email: user.email, name: user.name, role: user.role }, 201);
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    console.error("[register]", e);
    return err("Server error", 500);
  }
}
