import { NextRequest, NextResponse } from "next/server";
import { generateOTP, saveOTP, sendOTP } from "@/lib/auth/otp";
import { pool } from "@/lib/db";

/** Rate limit: max 5 sends per phone per 10 minutes */
const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;

/**
 * OTP_ENABLED=true  → generate code, save to DB, send SMS (production)
 * OTP_ENABLED unset → bypass mode: no SMS, single-step phone-only login (dev)
 */
const OTP_ENABLED = process.env.OTP_ENABLED === "true";

async function isRateLimited(phone: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
  const res = await pool.query(
    `SELECT COUNT(*) FROM otp_codes WHERE phone=$1 AND created_at >= $2`,
    [phone, windowStart.toISOString()]
  ).catch(() => ({ rows: [{ count: "0" }] }));
  return parseInt(res.rows[0].count, 10) >= RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }

    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");

    if (!OTP_ENABLED) {
      // Dev bypass: SMS disabled — login is single-step (phone only)
      return NextResponse.json({ success: true });
    }

    if (await isRateLimited(normalized)) {
      return NextResponse.json(
        { error: "تعداد درخواست بیش از حد مجاز است. ۱۰ دقیقه دیگر تلاش کنید." },
        { status: 429 }
      );
    }

    const code = generateOTP();
    await saveOTP(normalized, code);
    await sendOTP(normalized, code);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("send-otp error:", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
