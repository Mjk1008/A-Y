import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const res = await query(
    `SELECT * FROM notification_prefs WHERE user_id=$1`,
    [session.id]
  );

  const defaults = {
    weekly_digest: true, job_alerts: true, tool_updates: true,
    expiry_reminder: true, chat_reminders: false, marketing: false,
  };

  return NextResponse.json({ prefs: res.rows[0] || defaults });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const fields = ["weekly_digest","job_alerts","tool_updates","expiry_reminder","chat_reminders","marketing"];
  const prefs: Record<string, boolean> = {};
  for (const f of fields) {
    if (typeof body[f] === "boolean") prefs[f] = body[f];
  }

  await query(
    `INSERT INTO notification_prefs (user_id, ${Object.keys(prefs).join(",")}, updated_at)
     VALUES ($1, ${Object.keys(prefs).map((_,i)=>`$${i+2}`).join(",")}, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       ${Object.keys(prefs).map((k,i)=>`${k}=$${i+2}`).join(",")},
       updated_at=NOW()`,
    [session.id, ...Object.values(prefs)]
  );

  return NextResponse.json({ ok: true });
}
