import { NextRequest, NextResponse } from "next/server";
import { generateOTP, saveOTP, sendOTP } from "@/lib/auth/otp";

// Dev bypass: these numbers skip OTP entirely (send-otp returns success immediately)
const DEV_BYPASS_PHONES = ["09366291008", "09193726908"];

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }
    // normalize to 09xx
    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");

    // Dev bypass — skip OTP sending entirely
    if (DEV_BYPASS_PHONES.includes(normalized)) {
      return NextResponse.json({ success: true, dev: true });
    }

    const code = generateOTP();
    await saveOTP(normalized, code);
    await sendOTP(normalized, code);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
