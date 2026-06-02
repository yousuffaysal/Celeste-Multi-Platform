import { clearSessionCookie, ok } from "@/lib/auth";

export async function POST() {
  const res = ok({ loggedOut: true });
  clearSessionCookie(res);
  return res;
}
