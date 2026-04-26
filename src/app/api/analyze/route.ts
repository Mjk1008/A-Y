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

    // O3: fetch profile + resume in parallel
    const [profileRes, resumeRes] = await Promise.all([
      pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]),
      pool.query(
        "SELECT parsed_text FROM resumes WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
        [session.id]
      ),
    ]);

    if (profileRes.rows.length === 0)
      return NextResponse.json({ error: "no_profile" }, { status: 400 });

    const profile = profileRes.rows[0];
    const resume  = resumeRes.rows[0] ?? null;

    // ── Quota check ────────────────────────────────────────────────────
    // 2048 and memory game rewards each add +1 to the weekly analysis limit
    const planDef = PLANS.find((p) => p.id === session.plan) ?? PLANS[0];
    const weeklyLimit = planDef.limits.analysesPerWeek;

    if (weeklyLimit !== -1) {
      // W5: week starts on Monday (not Sunday)
      const weekStart = new Date();
      const day = weekStart.getDay(); // 0=Sun, 1=Mon...
      const diffToMonday = day === 0 ? -6 : 1 - day;
      weekStart.setDate(weekStart.getDate() + diffToMonday);
      weekStart.setHours(0, 0, 0, 0);

      const [usageRes, gameBonusRes] = await Promise.all([
        pool.query(
          `SELECT COUNT(*) FROM usage_logs
           WHERE user_id=$1 AND type='analysis' AND created_at >= $2`,
          [session.id, weekStart]
        ),
        pool.query(
          `SELECT COUNT(*) FROM usage_logs
           WHERE user_id=$1 AND type='game_reward'
             AND metadata->>'game' IN ('2048', 'memory')
             AND created_at >= $2`,
          [session.id, weekStart]
        ).catch(() => ({ rows: [{ count: "0" }] })),
      ]);
      const used            = parseInt(usageRes.rows[0].count, 10);
      const gameBonus       = parseInt(gameBonusRes.rows[0].count ?? "0");
      const effectiveLimit  = weeklyLimit + gameBonus;

      if (used >= effectiveLimit) {
        return NextResponse.json({
          error: "quota_exceeded",
          used,
          limit: effectiveLimit,
          upgrade_url: "/billing/checkout",
        }, { status: 429 });
      }
    }

    // W1/O6: cast includes "max" (previously "max" fell back to "free" token limit)
    const planCast = (["free", "pro", "max"].includes(session.plan)
      ? session.plan
      : "free") as "free" | "pro" | "max";

    const input: ProfileInput = {
      full_name: profile.full_name,
      age: profile.age ?? undefined,
      job_title: profile.job_title,
      industry: profile.industry,
      years_experience: profile.years_experience,
      skills: profile.skills ?? [],
      bio: profile.bio ?? undefined,
      resume_text: resume?.parsed_text ?? undefined,
      plan: planCast,
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
