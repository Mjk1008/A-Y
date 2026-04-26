/**
 * GET  /api/referral — get or create user's referral code
 * POST /api/referral — apply a referral code (called during signup)
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/* ── Ensure tables exist ─────────────────────────────────────────── */
async function ensureReferralTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS referral_codes (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE,
      code TEXT UNIQUE,
      used_count INT DEFAULT 0,
      reward_given INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});
  await pool.query(`
    CREATE TABLE IF NOT EXISTS referral_uses (
      id SERIAL PRIMARY KEY,
      referrer_id UUID,
      referred_id UUID,
      used_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});
}

/* ── GET: get (or generate) referral code ────────────────────────── */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await ensureReferralTables();

  // Check if user already has a code
  const existing = await pool.query(
    "SELECT code, used_count, reward_given FROM referral_codes WHERE user_id=$1",
    [session.id]
  );

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    return NextResponse.json({
      code: row.code,
      usedCount: row.used_count,
      rewardGiven: row.reward_given,
      link: `/signup?ref=${row.code}`,
    });
  }

  // Generate new code: AY- + 6 chars from user_id + 2 random
  const uid = session.id.replace(/-/g, "").slice(0, 4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const code = `AY-${uid}${rand}`;

  await pool.query(
    "INSERT INTO referral_codes (user_id, code) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING",
    [session.id, code]
  );

  return NextResponse.json({
    code,
    usedCount: 0,
    rewardGiven: 0,
    link: `/signup?ref=${code}`,
  });
}

/* ── POST: apply referral code ───────────────────────────────────── */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code: string | undefined = body.code;
  if (!code) return NextResponse.json({ error: "no code" }, { status: 400 });

  await ensureReferralTables();

  // Find referrer
  const referrer = await pool.query(
    "SELECT user_id FROM referral_codes WHERE code=$1",
    [code]
  );

  if (referrer.rows.length === 0) {
    return NextResponse.json({ error: "invalid_code" }, { status: 404 });
  }

  const referrerId = referrer.rows[0].user_id;

  // Can't refer yourself
  if (referrerId === session.id) {
    return NextResponse.json({ error: "self_referral" }, { status: 400 });
  }

  // Check if this user already used a referral
  const alreadyUsed = await pool.query(
    "SELECT id FROM referral_uses WHERE referred_id=$1",
    [session.id]
  );
  if (alreadyUsed.rows.length > 0) {
    return NextResponse.json({ error: "already_referred" }, { status: 409 });
  }

  // Record the use
  await pool.query(
    "INSERT INTO referral_uses (referrer_id, referred_id) VALUES ($1, $2)",
    [referrerId, session.id]
  );

  // Increment referrer's used_count
  await pool.query(
    "UPDATE referral_codes SET used_count = used_count + 1 WHERE user_id=$1",
    [referrerId]
  );

  // Grant reward: actually extend referrer's Pro subscription by 7 days
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  try {
    const subRes = await pool.query(
      `SELECT id, expires_at, status FROM subscriptions
       WHERE user_id=$1 AND status='active'
       ORDER BY created_at DESC LIMIT 1`,
      [referrerId]
    );

    if (subRes.rows.length > 0) {
      // Extend the active subscription
      const currentExpiry = new Date(subRes.rows[0].expires_at ?? Date.now());
      const base    = currentExpiry.getTime() > Date.now() ? currentExpiry.getTime() : Date.now();
      const newExpiry = new Date(base + SEVEN_DAYS_MS);
      await pool.query(
        "UPDATE subscriptions SET expires_at=$1 WHERE id=$2",
        [newExpiry.toISOString(), subRes.rows[0].id]
      );
    } else {
      // Create a new 7-day Pro subscription for the referrer
      await pool.query(
        `INSERT INTO subscriptions
           (user_id, plan_type, status, started_at, expires_at, amount_toman, billing_cycle)
         VALUES ($1, 'pro', 'active', NOW(), $2, 0, 'monthly')`,
        [referrerId, new Date(Date.now() + SEVEN_DAYS_MS).toISOString()]
      );
    }

    // Also update users.plan_type so the middleware session refresh picks it up within 2 min
    await pool.query(
      "UPDATE users SET plan_type='pro' WHERE id=$1 AND plan_type='free'",
      [referrerId]
    ).catch(() => {});

  } catch (e) {
    console.error("referral subscription extend error:", e);
    // Don't fail the whole request — still record the referral
  }

  // Log the reward event
  await pool.query(
    `INSERT INTO usage_logs (user_id, type, metadata)
     VALUES ($1, 'referral_reward', $2)`,
    [referrerId, JSON.stringify({ referred_user: session.id, reward: "7_days_pro" })]
  ).catch(() => {});

  await pool.query(
    "UPDATE referral_codes SET reward_given = reward_given + 1 WHERE user_id=$1",
    [referrerId]
  );

  return NextResponse.json({ ok: true, referrerId });
}
