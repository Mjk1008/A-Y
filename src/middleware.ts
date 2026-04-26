import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-me-in-production"
);

const COOKIE = "ay_session";

/** Verify JWT and return payload, or null if invalid/expired */
async function getPayload(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; phone: string; plan: string; iat?: number };
  } catch {
    return null;
  }
}

/** Re-issue a fresh 1-hour token, fetching current plan from DB */
async function refreshToken(payload: { id: string; phone: string; plan: string }, origin: string) {
  let plan = payload.plan;
  // Only attempt plan refresh if INTERNAL_SECRET is properly configured
  const internalSecret = process.env.INTERNAL_SECRET;
  if (internalSecret) {
    try {
      const res = await fetch(
        `${origin}/api/auth/internal/plan?id=${payload.id}`,
        { headers: { "x-internal-secret": internalSecret } }
      );
      if (res.ok) {
        const data = await res.json() as { plan: string };
        plan = data.plan;
      }
    } catch { /* keep existing plan on failure */ }
  }
  return new SignJWT({ id: payload.id, phone: payload.phone, plan })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Guest-only pages: redirect logged-in users ─────────────────
  // If already authenticated, send straight to the app
  const guestOnly = pathname === "/" || pathname === "/login" ||
                    pathname === "/signup" || pathname === "/upgrade";
  if (guestOnly) {
    const payload = await getPayload(req);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // ── 2. Always-public paths ─────────────────────────────────────────
  const isPublicApi = pathname.startsWith("/api/auth/");
  const isNextInternal = pathname.startsWith("/_next/") || pathname.startsWith("/favicon");
  const isPaymentCallback = pathname === "/billing/success" || pathname === "/billing/failed";

  if (isPublicApi || isNextInternal || isPaymentCallback) {
    return NextResponse.next();
  }

  // ── 3. Protected routes: require valid session ─────────────────────
  const payload = await getPayload(req);
  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(COOKIE);
    return res;
  }

  // ── 4. Sliding session: refresh every 2 min to pick up plan changes ─
  const issuedAt = (payload.iat ?? 0) * 1000;
  const ageMs = Date.now() - issuedAt;
  const TWO_MIN = 2 * 60 * 1000;

  if (ageMs > TWO_MIN) {
    const newToken = await refreshToken(payload, req.nextUrl.origin);
    const res = NextResponse.next();
    res.cookies.set(COOKIE, newToken, SESSION_COOKIE_OPTIONS);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - public files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)",
  ],
};
