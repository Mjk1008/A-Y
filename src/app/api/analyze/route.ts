import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { analyzeProfile, type ProfileInput } from "@/lib/claude";
import { PLANS } from "@/app/config/plans";
import { updateStreak } from "@/lib/streak";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const profileRes = await pool.query(
      "SELECT * FROM profiles WHERE user_id=$1",
      [session.id]
    );
    if (profileRes.rows.length === 0)
      return NextResponse.json({ error: "no_profile" }, { status: 400 });

    const profile = profileRes.rows[0];

    // ── Quota check ────────────────────────────────────────────────────
    const planDef = PLANS.find((p) => p.id === session.plan) ?? PLANS[0];
    const weeklyLimit = planDef.limits.analysesPerWeek;

    if (weeklyLimit !== -1) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const usageRes = await pool.query(
        `SELECT COUNT(*) FROM usage_logs
         WHERE user_id=$1 AND type='analysis' AND created_at >= $2`,
        [session.id, weekStart]
      );
      const used = parseInt(usageRes.rows[0].count, 10);

      if (used >= weeklyLimit) {
        return NextResponse.json({
          error: "quota_exceeded",
          used,
          limit: weeklyLimit,
          upgrade_url: "/billing/checkout",
        }, { status: 429 });
      }
    }

    const resumeRes = await pool.query(
      "SELECT parsed_text FROM resumes WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
      [session.id]
    );
    const resume = resumeRes.rows[0] ?? null;

    const input: ProfileInput = {
      full_name: profile.full_name,
      age: profile.age ?? undefined,
      job_title: profile.job_title,
      industry: profile.industry,
      years_experience: profile.years_experience,
      skills: profile.skills ?? [],
      bio: profile.bio ?? undefined,
      resume_text: resume?.parsed_text ?? undefined,
      plan: (session.plan as "free" | "pro") ?? "free",
    };

    const result = await analyzeProfile(input);

    const saved = await pool.query(
      "INSERT INTO analyses (user_id, profile_snapshot, result_json) VALUES ($1, $2, $3) RETURNING id",
      [session.id, JSON.stringify(input), JSON.stringify(result)]
    );

    // ── Log usage + update streak ─────────────────────────────────────
    await pool.query(
      `INSERT INTO usage_logs (user_id, type, metadata) VALUES ($1, 'analysis', $2)`,
      [session.id, JSON.stringify({ analysis_id: saved.rows[0].id, plan: session.plan })]
    );
    updateStreak(session.id).catch(() => {});

    return NextResponse.json({ id: saved.rows[0].id, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "analyze_error";
    console.error("analyze error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
