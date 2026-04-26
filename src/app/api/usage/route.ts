import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { PLANS } from "@/app/config/plans";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Quick daily chat count (used by chat composer)
  const type = req.nextUrl.searchParams.get("type");
  if (type === "chat_today") {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const res = await query(
      `SELECT COUNT(*) FROM usage_logs WHERE user_id=$1 AND type='chat_message' AND created_at >= $2`,
      [session.id, today.toISOString()]
    );
    return NextResponse.json({ chat_today: parseInt(res.rows[0].count, 10) });
  }

  const plan = PLANS.find((p) => p.id === session.plan) || PLANS[0];

  // Analyses this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [analysesRes, chatRes, roadmapRes, subRes] = await Promise.all([
    query(
      `SELECT COUNT(*) FROM usage_logs
       WHERE user_id=$1 AND type='analysis' AND created_at >= $2`,
      [session.id, weekStart]
    ),
    query(
      `SELECT COUNT(*) FROM usage_logs
       WHERE user_id=$1 AND type='chat_message'
         AND created_at >= date_trunc('month', NOW())`,
      [session.id]
    ),
    query(
      `SELECT COUNT(*) FROM usage_logs
       WHERE user_id=$1 AND type='roadmap'
         AND created_at >= date_trunc('month', NOW())`,
      [session.id]
    ),
    query(
      `SELECT expires_at, status, cancelled_at FROM subscriptions
       WHERE user_id=$1 AND status IN ('active','cancelled')
       ORDER BY created_at DESC LIMIT 1`,
      [session.id]
    ),
  ]);

  const analysesUsed   = parseInt(analysesRes.rows[0].count, 10);
  const chatUsed       = parseInt(chatRes.rows[0].count, 10);
  const roadmapsUsed   = parseInt(roadmapRes.rows[0].count, 10);
  const subscription   = subRes.rows[0] || null;

  const limits = plan.limits;

  return NextResponse.json({
    plan: session.plan,
    subscription,
    usage: {
      analyses: {
        used: analysesUsed,
        limit: limits.analysesPerWeek,
        period: "weekly",
      },
      chat: {
        used: chatUsed,
        limit: limits.chatMessagesPerMonth,
        period: "monthly",
      },
      roadmaps: {
        used: roadmapsUsed,
        limit: limits.roadmapsPerMonth,
        period: "monthly",
      },
    },
  });
}

// POST — log a usage event
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { type, metadata } = await req.json();
  const allowed = ["analysis","chat_message","roadmap","job_view","course_view"];
  if (!allowed.includes(type)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  await query(
    `INSERT INTO usage_logs (user_id, type, metadata) VALUES ($1, $2, $3)`,
    [session.id, type, JSON.stringify(metadata || {})]
  );

  return NextResponse.json({ ok: true });
}
