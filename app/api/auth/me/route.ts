import { NextRequest } from "next/server";
import { getCurrentUser, ok, err } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return err("Not authenticated", 401);
  return ok(user);
}
