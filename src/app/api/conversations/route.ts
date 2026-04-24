/**
 * GET  /api/conversations  — list user's conversations (newest first)
 * POST /api/conversations  — create a new conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const res = await pool.query(
      `SELECT
         c.id, c.mode, c.title, c.created_at, c.updated_at,
         COUNT(m.id)::int AS message_count,
         MAX(m.content) FILTER (WHERE m.role = 'user') AS last_user_message
       FROM chat_conversations c
       LEFT JOIN chat_messages m ON m.conversation_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.updated_at DESC
       LIMIT 50`,
      [session.id]
    );
    return NextResponse.json({ conversations: res.rows });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode === "free" ? "free" : "career";
    const title = typeof body.title === "string" ? body.title.slice(0, 280) : null;

    const res = await pool.query(
      `INSERT INTO chat_conversations (user_id, mode, title)
       VALUES ($1, $2, $3)
       RETURNING id, mode, title, created_at, updated_at`,
      [session.id, mode, title]
    );
    return NextResponse.json({ conversation: res.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
