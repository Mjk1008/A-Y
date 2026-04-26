/**
 * POST /api/share  — create a share token for an analysis
 * GET  /api/share?token=...  — get public analysis data (no auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/* ── POST: create share link ─────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const analysisId: string | undefined = body.analysisId;

  // If no analysisId, use the latest analysis for this user
  let aid = analysisId;
  if (!aid) {
    const res = await pool.query(
      "SELECT id FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
      [session.id]
    );
    aid = res.rows[0]?.id;
  }

  if (!aid) {
    return NextResponse.json({ error: "no_analysis" }, { status: 400 });
  }

  // Verify ownership
  const ownership = await pool.query(
    "SELECT id FROM analyses WHERE id=$1 AND user_id=$2",
    [aid, session.id]
  );
  if (ownership.rows.length === 0) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Check if a token already exists for this analysis
  const existing = await pool.query(
    "SELECT token FROM shared_analyses WHERE analysis_id=$1",
    [aid]
  ).catch(() => ({ rows: [] }));

  if (existing.rows.length > 0) {
    return NextResponse.json({
      token: existing.rows[0].token,
      url: `/share/${existing.rows[0].token}`,
    });
  }

  // Create new share token
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shared_analyses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      analysis_id UUID,
      token TEXT UNIQUE,
      view_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});

  const token = generateToken();
  await pool.query(
    `INSERT INTO shared_analyses (user_id, analysis_id, token)
     VALUES ($1, $2, $3)`,
    [session.id, aid, token]
  );

  return NextResponse.json({ token, url: `/share/${token}` });
}

/* ── GET: public read ─────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const res = await pool.query(`
    SELECT
      sa.token, sa.view_count, sa.created_at,
      a.result_json,
      p.job_title, p.industry, p.nickname, p.full_name
    FROM shared_analyses sa
    JOIN analyses a ON a.id = sa.analysis_id
    JOIN profiles p ON p.user_id = sa.user_id
    WHERE sa.token = $1
  `, [token]).catch(() => ({ rows: [] }));

  if (res.rows.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const row = res.rows[0];

  // Bump view count (non-blocking)
  pool.query(
    "UPDATE shared_analyses SET view_count = view_count + 1 WHERE token=$1",
    [token]
  ).catch(() => {});

  const r = row.result_json as {
    risk_level?: string;
    risk_explanation?: string;
    analysis_summary?: string;
    leverage_idea?: string;
    top_tools?: Array<{ name: string; why?: string }>;
  };

  return NextResponse.json({
    token: row.token,
    views: row.view_count,
    createdAt: row.created_at,
    jobTitle: row.job_title,
    industry: row.industry,
    name: row.nickname || row.full_name?.split(" ")[0] || null,
    riskLevel: r?.risk_level,
    riskExplanation: r?.risk_explanation,
    analysisSummary: r?.analysis_summary,
    leverageIdea: r?.leverage_idea,
    topTools: (r?.top_tools || []).slice(0, 3),
  });
}

function generateToken(): string {
  // AY- prefix + 8 random chars
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "AY";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}
