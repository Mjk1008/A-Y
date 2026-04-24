/**
 * GET /api/admin/export/invoices
 * Returns a CSV of all invoices. Protected: must be admin.
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
    SELECT i.id, u.phone, i.plan_type, i.billing_cycle, i.amount_toman,
           i.status, i.zarinpal_ref, i.promo_code, i.paid_at, i.created_at
    FROM invoices i JOIN users u ON u.id = i.user_id
    ORDER BY i.created_at DESC
  `);

  const header = ["id", "phone", "plan_type", "billing_cycle", "amount_toman", "status", "zarinpal_ref", "promo_code", "paid_at", "created_at"];
  const rows = res.rows.map((r) =>
    header.map((k) => JSON.stringify(r[k] ?? "")).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ay-invoices-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
