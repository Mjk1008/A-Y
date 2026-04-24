import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });

    const adminRes = await pool.query("SELECT is_admin FROM users WHERE id=$1", [session.id]);
    if (!adminRes.rows[0]?.is_admin) {
      return NextResponse.json({ error: "دسترسی ممنوع" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") ?? "";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const rows = await pool.query(
      `SELECT u.id, u.phone, u.plan_type, u.is_admin, u.created_at,
              p.full_name, p.job_title
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE ($1 = '' OR u.phone ILIKE '%' || $1 || '%' OR p.full_name ILIKE '%' || $1 || '%')
       ORDER BY u.created_at DESC
       LIMIT $2`,
      [search, limit]
    );

    return NextResponse.json({ users: rows.rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

/** PATCH /api/admin/users — update plan or admin status */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });

    const adminRes = await pool.query("SELECT is_admin FROM users WHERE id=$1", [session.id]);
    if (!adminRes.rows[0]?.is_admin) {
      return NextResponse.json({ error: "دسترسی ممنوع" }, { status: 403 });
    }

    const { userId, plan, isAdmin } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId الزامی است" }, { status: 400 });

    const updates: string[] = [];
    const values: (string | boolean)[] = [];
    let idx = 1;

    if (plan !== undefined) {
      updates.push(`plan_type = $${idx++}`);
      values.push(plan);
    }
    if (isAdmin !== undefined) {
      updates.push(`is_admin = $${idx++}`);
      values.push(isAdmin);
    }

    if (updates.length === 0) return NextResponse.json({ error: "چیزی برای آپدیت نیست" }, { status: 400 });

    values.push(userId);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, phone, plan_type, is_admin`,
      values
    );

    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
