import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET environment variable must be set in production");
  }
  console.warn("⚠️  JWT_SECRET not set — using insecure default (development only)");
}
const SECRET = new TextEncoder().encode(_jwtSecret || "change-me-in-production");

export type SessionUser = { id: string; phone: string; plan: string };

export const SESSION_COOKIE = "ay_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly:  true,
  secure:    process.env.NODE_ENV === "production",
  sameSite:  "lax" as const,
  maxAge:    60 * 60,   /* 1 hour — sliding window refreshed in middleware */
  path:      "/",
};

export async function createSession(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Attach the session cookie to any NextResponse.
 * Use this in Route Handlers (API routes) — it guarantees the
 * Set-Cookie header is sent on the HTTP response.
 */
export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}

/**
 * Clear the session cookie on a NextResponse.
 */
export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  return res;
}

/* Legacy helpers kept for Server Actions / server components that use
   next/headers directly. Route Handlers should use attachSessionCookie. */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
