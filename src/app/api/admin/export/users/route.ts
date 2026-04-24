/**
 * GET /api/admin/export/users
 * Returns a CSV of all users. Protected: must be admin.
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const adminRes = await pool.query("SELECT is_admin FROM users WHERE id=$1", [session.id]);
  if (!adminRes.rows[0]?.is_admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const res = await pool.query(`
    SELECT u.id, u.phone, u.plan_type, u.is_admin, u.created_at,
           p.full_name, p.job_title, p.industry
    FROM users u LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.created_at DESC
  `);

  const header = ["id", "phone", "plan_type", "is_admin", "created_at", "full_name", "job_title", "industry"];
  const rows = res.rows.map((r) =>
    header.map((k) => JSON.stringify(r[k] ?? "")).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ay-users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
