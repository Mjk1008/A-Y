/**
 * DELETE /api/conversations/reset — delete ALL conversations for the user
 * Used by the "reset context" button in Settings.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const res = await pool.query(
      "DELETE FROM chat_conversations WHERE user_id=$1 RETURNING id",
      [session.id]
    );
    return NextResponse.json({ deleted: res.rowCount ?? 0 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
