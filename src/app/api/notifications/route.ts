/**
 * GET  /api/notifications  — get user's recent notifications
 * POST /api/notifications/mark-read  — mark notifications as read
 *
 * Notification types:
 *  - job_match:        شغل جدید مناسب تو اومد
 *  - new_tool:         ابزار AI جدید برای صنعتت
 *  - streak_reminder:  یادآور streak روزانه
 *  - magazine:         مجله امروز آماده‌ست
 *  - analysis_ready:   تحلیل جدید می‌تونی بگیری
 *
 * Notifications are generated lazily on GET and cached in DB.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/* ── Ensure table ─────────────────────────────────────────────────── */
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id         SERIAL PRIMARY KEY,
      user_id    UUID NOT NULL,
      type       TEXT NOT NULL,
      title      TEXT NOT NULL,
      body       TEXT,
      href       TEXT,
      read       BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});
}

/* ── GET: return notifications ────────────────────────────────────── */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await ensureTable();

  // Auto-generate notifications if we haven't today
  await autoGenerateNotifications(session.id).catch(() => {});

  const res = await pool.query(
    `SELECT id, type, title, body, href, read, created_at
     FROM notifications
     WHERE user_id=$1
     ORDER BY created_at DESC
     LIMIT 20`,
    [session.id]
  ).catch(() => ({ rows: [] }));

  const unreadCount = res.rows.filter((r: { read: boolean }) => !r.read).length;

  return NextResponse.json({
    notifications: res.rows,
    unreadCount,
  });
}

/* ── POST: mark read ──────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await ensureTable();

  const body = await req.json().catch(() => ({}));
  const ids: number[] = body.ids ?? [];

  if (ids.length === 0) {
    // Mark all read
    await pool.query(
      "UPDATE notifications SET read=TRUE WHERE user_id=$1",
      [session.id]
    );
  } else {
    await pool.query(
      "UPDATE notifications SET read=TRUE WHERE user_id=$1 AND id=ANY($2)",
      [session.id, ids]
    );
  }

  return NextResponse.json({ ok: true });
}

/* ── Auto-generate relevant notifications ─────────────────────────── */
async function autoGenerateNotifications(userId: string) {
  // Only generate once per day per user
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const existing = await pool.query(
    "SELECT id FROM notifications WHERE user_id=$1 AND created_at >= $2 LIMIT 1",
    [userId, today.toISOString()]
  ).catch(() => ({ rows: [] }));

  if (existing.rows.length > 0) return; // Already generated today

  // Get user context
  const [profileRes, streakRes, jobCountRes, magazineRes] = await Promise.all([
    pool.query("SELECT job_title, industry FROM profiles WHERE user_id=$1", [userId]).catch(() => ({ rows: [] })),
    pool.query("SELECT current_streak FROM user_streaks WHERE user_id=$1", [userId]).catch(() => ({ rows: [] })),
    pool.query("SELECT COUNT(*) FROM crawled_jobs WHERE crawled_at >= NOW() - INTERVAL '2 days'").catch(() => ({ rows: [{ count: "0" }] })),
    pool.query("SELECT title FROM magazine_articles WHERE date=CURRENT_DATE").catch(() => ({ rows: [] })),
  ]);

  const profile = profileRes.rows[0];
  const streak = streakRes.rows[0];
  const jobCount = parseInt(jobCountRes.rows[0]?.count ?? "0", 10);
  const magazine = magazineRes.rows[0];

  const notifications: Array<{ type: string; title: string; body: string; href: string }> = [];

  // Magazine notification
  if (magazine) {
    notifications.push({
      type: "magazine",
      title: "مجله AI امروز آماده‌ست 📰",
      body: magazine.title || "مهم‌ترین اخبار AI امروز رو بخون",
      href: "/magazine",
    });
  }

  // Job match notification
  if (jobCount > 0 && profile?.job_title) {
    notifications.push({
      type: "job_match",
      title: `${jobCount.toLocaleString("fa-IR")} شغل جدید مناسب تو`,
      body: `موقعیت‌های ${profile.job_title} رو ببین`,
      href: "/jobs",
    });
  }

  // Streak reminder
  if (streak?.current_streak > 1) {
    notifications.push({
      type: "streak_reminder",
      title: `🔥 ${streak.current_streak.toLocaleString("fa-IR")} روز streak داری!`,
      body: "امروز یه تسک بزن تا streak نشکنه",
      href: "/dashboard",
    });
  } else {
    notifications.push({
      type: "streak_reminder",
      title: "هنوز امروز فعال نشدی",
      body: "یه سوال بپرس یا تحلیل بگیر تا streak شروع بشه",
      href: "/chat",
    });
  }

  // Weekly analysis reminder (if has analysis older than 5 days)
  const analysisRes = await pool.query(
    "SELECT created_at FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  ).catch(() => ({ rows: [] }));

  if (analysisRes.rows.length > 0) {
    const daysSince = Math.floor((Date.now() - new Date(analysisRes.rows[0].created_at).getTime()) / 86400000);
    if (daysSince >= 5) {
      notifications.push({
        type: "analysis_ready",
        title: "وقت تحلیل مجدده 🤖",
        body: `${daysSince.toLocaleString("fa-IR")} روز از آخرین تحلیلت گذشته`,
        href: "/profile",
      });
    }
  }

  // Insert all
  for (const n of notifications) {
    await pool.query(
      "INSERT INTO notifications (user_id, type, title, body, href) VALUES ($1, $2, $3, $4, $5)",
      [userId, n.type, n.title, n.body, n.href]
    ).catch(() => {});
  }
}
