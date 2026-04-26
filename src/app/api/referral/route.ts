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

  // Grant reward to referrer: 7 days Pro (via subscriptions table extension)
  // For simplicity, log it as a usage bonus event
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
