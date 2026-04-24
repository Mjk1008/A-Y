import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-me-in-production"
);

export const PIN_COOKIE = "ay_admin_pin";

export const PIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/",
};

export async function signAdminPin(adminId: string): Promise<string> {
  return new SignJWT({ adminId, pinVerified: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyAdminPin(pinCookie: string | undefined): Promise<boolean> {
  if (!pinCookie) return false;
  try {
    await jwtVerify(pinCookie, SECRET);
    return true;
  } catch {
    return false;
  }
}
