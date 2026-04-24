import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const analysisId = new URL(req.url).searchParams.get("analysisId");

  const res = await query(
    `SELECT week_num, day_num, task_key, completed, completed_at
     FROM roadmap_progress
     WHERE user_id=$1 ${analysisId ? "AND analysis_id=$2" : ""}`,
    analysisId ? [session.id, analysisId] : [session.id]
  );

  return NextResponse.json({ progress: res.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { analysisId, weekNum, dayNum, taskKey, completed } = await req.json();

  await query(
    `INSERT INTO roadmap_progress (user_id, analysis_id, week_num, day_num, task_key, completed, completed_at)
     VALUES ($1,$2,$3,$4,$5,$6, $7)
     ON CONFLICT (user_id, analysis_id, week_num, day_num, task_key)
     DO UPDATE SET completed=$6, completed_at=$7`,
    [session.id, analysisId, weekNum, dayNum, taskKey, completed,
     completed ? new Date() : null]
  );

  return NextResponse.json({ ok: true });
}
