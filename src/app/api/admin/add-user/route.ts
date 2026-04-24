import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });

    const adminRes = await pool.query("SELECT is_admin FROM users WHERE id=$1", [session.id]);
    if (!adminRes.rows[0]?.is_admin) {
      return NextResponse.json({ error: "دسترسی ممنوع" }, { status: 403 });
    }

    const { phone, plan = "free", isAdmin = false } = await req.json();
    if (!phone) return NextResponse.json({ error: "شماره الزامی است" }, { status: 400 });

    const normalized = phone.replace(/\s/g, "").replace(/^\+98/, "0").replace(/^98/, "0");
    if (!/^09\d{9}$/.test(normalized)) {
      return NextResponse.json({ error: "فرمت شماره اشتباه است" }, { status: 400 });
    }

    const validPlans = ["free", "pro", "max"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "پلن نامعتبر" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO users (phone, plan_type, is_admin, created_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (phone) DO UPDATE SET
         plan_type = EXCLUDED.plan_type,
         is_admin  = EXCLUDED.is_admin
       RETURNING id, phone, plan_type, is_admin, created_at`,
      [normalized, plan, isAdmin]
    );

    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
