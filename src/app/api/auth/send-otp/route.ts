import { NextRequest, NextResponse } from "next/server";
import { generateOTP, saveOTP, sendOTP } from "@/lib/auth/otp";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }
    // normalize to 09xx
    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");
    const code = generateOTP();
    await saveOTP(normalized, code);
    await sendOTP(normalized, code);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
