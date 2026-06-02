import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim())
      return err("name, email, and message are required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return err("Invalid email address");

    await db.query(
      `INSERT INTO contact_submissions (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name.trim(), email.trim().toLowerCase(), subject?.trim() ?? null, message.trim()]
    );

    return ok({ submitted: true }, 201);
  } catch (e) {
    console.error("[POST /api/contact]", e);
    return err("Server error", 500);
  }
}
