/**
 * POST /api/admin/migrate
 * One-time migration runner. Protected by ADMIN_SECRET.
 * Hit this once after deploy to apply pending migrations.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS chat_conversations (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         REFERENCES users(id) ON DELETE CASCADE,
  mode        VARCHAR(20)  DEFAULT 'career' CHECK (mode IN ('career', 'free')),
  title       VARCHAR(300),
  created_at  TIMESTAMPTZ  DEFAULT now(),
  updated_at  TIMESTAMPTZ  DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID         REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id         UUID         REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20)  NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT         NOT NULL,
  created_at      TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user
  ON chat_conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conv
  ON chat_messages(conversation_id, created_at ASC);
`;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    await pool.query(MIGRATION_SQL);
    return NextResponse.json({ ok: true, message: "Migration 004 applied successfully." });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
