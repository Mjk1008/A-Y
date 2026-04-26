import { NextRequest, NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/auth/otp";
import { createSession, attachSessionCookie } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");
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
