import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "celeste-dev-secret-change-in-production"
);
const COOKIE = "celeste_session";
const CART_COOKIE = "celeste_cart";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "customer" | "vendor" | "admin";
  shopId?: string;
}

export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    shopId: user.shopId ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as AuthUser["role"],
      shopId: (payload.shopId as string) ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(req?: NextRequest): Promise<AuthUser | null> {
  const token = req
    ? req.cookies.get(COOKIE)?.value
    : (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getCartSession(req: NextRequest): string | undefined {
  return req.cookies.get(CART_COOKIE)?.value;
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function setCartCookie(res: NextResponse, sessionId: string) {
  res.cookies.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/* ── Route guard helper ── */
export async function requireAuth(
  req: NextRequest,
  role?: AuthUser["role"]
): Promise<AuthUser | NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (role && user.role !== role && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
