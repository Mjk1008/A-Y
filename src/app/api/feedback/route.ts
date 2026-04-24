import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { analysisId, context, rating, comment } = await req.json();

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "invalid rating" }, { status: 400 });
  }

  await query(
    `INSERT INTO feedback (user_id, analysis_id, context, rating, comment)
     VALUES ($1,$2,$3,$4,$5)`,
    [session.id, analysisId || null, context || "analysis", rating, comment || null]
  );

  return NextResponse.json({ ok: true });
}
