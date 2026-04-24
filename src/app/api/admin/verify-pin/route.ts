import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { PIN_COOKIE, PIN_COOKIE_OPTIONS, signAdminPin } from "@/lib/auth/adminPin";

const ADMIN_PIN = "1224";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });

    const res = await pool.query("SELECT is_admin FROM users WHERE id=$1", [session.id]);
    if (!res.rows[0]?.is_admin) {
      return NextResponse.json({ error: "دسترسی ممنوع" }, { status: 403 });
    }

    const { pin } = await req.json();
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "پین اشتباه است" }, { status: 400 });
    }

    const token = await signAdminPin(session.id);
    const response = NextResponse.json({ success: true });
    response.cookies.set(PIN_COOKIE, token, PIN_COOKIE_OPTIONS);
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
