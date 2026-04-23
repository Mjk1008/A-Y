import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, findOrCreateUser } from "@/lib/auth/otp";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");
    const valid = await verifyOTP(normalized, code);
    if (!valid) {
      return NextResponse.json({ error: "کد اشتباه یا منقضی شده" }, { status: 400 });
    }
    const user = await findOrCreateUser(normalized);
    const token = await createSession({ id: user.id, phone: user.phone, plan: user.plan_type });
    await setSessionCookie(token);

    // check if profile exists
    const profile = await pool.query("SELECT id FROM profiles WHERE user_id=$1", [user.id]);
    const hasProfile = profile.rows.length > 0;

    return NextResponse.json({ success: true, hasProfile });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
