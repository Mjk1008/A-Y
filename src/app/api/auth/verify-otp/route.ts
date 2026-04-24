import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, findOrCreateUser } from "@/lib/auth/otp";
import { createSession, attachSessionCookie } from "@/lib/auth/session";
import { pool } from "@/lib/db";

// Dev bypass: these numbers always pass OTP with any code (or empty)
const DEV_BYPASS_PHONES = ["09366291008", "09193726908"];

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");

    const isBypass = DEV_BYPASS_PHONES.includes(normalized);
    if (!isBypass) {
      const valid = await verifyOTP(normalized, code);
      if (!valid) {
        return NextResponse.json({ error: "کد اشتباه یا منقضی شده" }, { status: 400 });
      }
    }
    let user = await findOrCreateUser(normalized);
    // Ensure admin phone always has max plan + is_admin
    if (normalized === "09366291008") {
      await pool.query(
        "UPDATE users SET plan_type='max', is_admin=true WHERE phone=$1",
        [normalized]
      );
      user = { ...user, plan_type: "max" };
    }
    const token = await createSession({ id: user.id, phone: user.phone, plan: user.plan_type });

    const profile = await pool.query("SELECT id FROM profiles WHERE user_id=$1", [user.id]);
    const hasProfile = profile.rows.length > 0;

    /* Attach cookie directly on the response so Set-Cookie header
       is guaranteed to be included — not via cookies() from next/headers. */
    return attachSessionCookie(
      NextResponse.json({ success: true, hasProfile }),
      token
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
