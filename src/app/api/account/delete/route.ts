import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { confirm } = await req.json();
  if (confirm !== "DELETE") {
    return NextResponse.json({ error: "confirmation required" }, { status: 400 });
  }

  // Cascade deletes all related data via FK constraints
  await query(`DELETE FROM users WHERE id=$1`, [session.id]);

  const res = NextResponse.json({ ok: true });
  return clearSessionCookie(res);
}
