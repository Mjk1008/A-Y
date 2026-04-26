import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, findOrCreateUser } from "@/lib/auth/otp";
import { createSession, attachSessionCookie } from "@/lib/auth/session";
import { pool } from "@/lib/db";

/** Rate limit: max 10 verify attempts per phone per 15 minutes */
const VERIFY_LIMIT  = 10;
const VERIFY_WINDOW = 15 * 60 * 1000;

/**
 * OTP_ENABLED=true  → requires { phone, code } — verifies code against DB
 * OTP_ENABLED unset → bypass mode: accepts { phone } with no code check (dev)
 */
const OTP_ENABLED = process.env.OTP_ENABLED === "true";

async function isVerifyRateLimited(phone: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - VERIFY_WINDOW);
  const res = await pool.query(
    `SELECT COUNT(*) FROM otp_codes
     WHERE phone=$1 AND created_at >= $2`,
    [phone, windowStart.toISOString()]
  ).catch(() => ({ rows: [{ count: "0" }] }));
  return parseInt(res.rows[0].count, 10) >= VERIFY_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = body;

    if (!phone) {
      return NextResponse.json({ error: "شماره الزامی است" }, { status: 400 });
    }

    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");

    if (!/^0?9\d{9}$/.test(normalized)) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }

    if (OTP_ENABLED) {
      // Production: require and verify the OTP code
      if (!code) {
        return NextResponse.json({ error: "کد تأیید الزامی است" }, { status: 400 });
      }

      if (await isVerifyRateLimited(normalized)) {
        return NextResponse.json(
          { error: "تعداد تلاش‌های ناموفق بیش از حد. بعداً تلاش کنید." },
          { status: 429 }
        );
      }

      const isValid = await verifyOTP(normalized, code);
      if (!isValid) {
        return NextResponse.json({ error: "کد وارد شده اشتباه یا منقضی است" }, { status: 401 });
      }
    }
    // If OTP_ENABLED is false, skip code verification entirely (dev bypass)

    let user = await findOrCreateUser(normalized);

    // Ensure admin phone always has max plan + is_admin flag
    const ADMIN_PHONE = process.env.ADMIN_PHONE || "09366291008";
    if (normalized === ADMIN_PHONE) {
      await pool.query(
        "UPDATE users SET plan_type='max', is_admin=true WHERE phone=$1",
        [normalized]
      );
      user = { ...user, plan_type: "max" };
    }

    const token = await createSession({ id: user.id, phone: user.phone, plan: user.plan_type });

    const profile = await pool.query(
      "SELECT id FROM profiles WHERE user_id=$1",
      [user.id]
    );
    const hasProfile = profile.rows.length > 0;

    return attachSessionCookie(
      NextResponse.json({ success: true, hasProfile }),
      token
    );
  } catch (e) {
    console.error("verify-otp error:", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
