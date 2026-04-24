import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

// GET — current subscription state
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const res = await query(
    `SELECT s.*, u.plan_type
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     WHERE s.user_id = $1 AND s.status = 'active'
     ORDER BY s.created_at DESC
     LIMIT 1`,
    [session.id]
  );

  const sub = res.rows[0] || null;
  return NextResponse.json({ subscription: sub });
}

// DELETE — cancel subscription (at end of period)
export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await query(
    `UPDATE subscriptions
     SET status='cancelled', cancelled_at=NOW()
     WHERE user_id=$1 AND status='active'`,
    [session.id]
  );

  return NextResponse.json({ success: true, message: "اشتراک در پایان دوره لغو می‌شه" });
}
