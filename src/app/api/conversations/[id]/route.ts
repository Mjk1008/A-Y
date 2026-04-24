/**
 * GET    /api/conversations/[id]  — get conversation with its messages
 * DELETE /api/conversations/[id]  — delete a conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;

  try {
    const [convRes, msgRes] = await Promise.all([
      pool.query(
        "SELECT * FROM chat_conversations WHERE id=$1 AND user_id=$2",
        [id, session.id]
      ),
      pool.query(
        "SELECT id, role, content, created_at FROM chat_messages WHERE conversation_id=$1 ORDER BY created_at ASC",
        [id]
      ),
    ]);

    if (!convRes.rows[0]) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({
      conversation: convRes.rows[0],
      messages: msgRes.rows,
    });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;

  try {
    const res = await pool.query(
      "DELETE FROM chat_conversations WHERE id=$1 AND user_id=$2 RETURNING id",
      [id, session.id]
    );
    if (!res.rows[0]) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
