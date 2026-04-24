import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const res = await query(
    `SELECT id, plan_type, billing_cycle, amount_toman, status, zarinpal_ref, paid_at, created_at
     FROM invoices
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 24`,
    [session.id]
  );

  return NextResponse.json({ invoices: res.rows });
}
