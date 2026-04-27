/**
 * GET /api/cron/status
 * ─────────────────────
 * Public endpoint — no auth needed.
 * Returns last cron run info + current news freshness.
 * Used by the magazine page to show "آخرین آپدیت".
 */

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const revalidate = 60; // ISR: cache for 60s

export async function GET() {
  // Ensure table exists silently
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cron_job_logs (
      id          SERIAL PRIMARY KEY,
      job_type    VARCHAR(60)  NOT NULL,
      status      VARCHAR(20)  NOT NULL DEFAULT 'success',
      started_at  TIMESTAMPTZ  DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      duration_ms INTEGER,
      result      JSONB,
      error       TEXT
    );
    CREATE INDEX IF NOT EXISTS cron_logs_started_idx ON cron_job_logs (started_at DESC);
  `).catch(() => {});

  const [lastRunRes, newsCountRes, lastFetchedRes, todayDigestRes] = await Promise.all([
    // Last cron run
    pool.query(
      `SELECT job_type, status, started_at, finished_at, duration_ms, error
       FROM cron_job_logs
       ORDER BY started_at DESC
       LIMIT 1`,
    ).catch(() => ({ rows: [] })),

    // News items in last 48h
    pool.query(
      `SELECT COUNT(*) FROM ai_news_items
       WHERE published_at > NOW() - INTERVAL '48 hours'`,
    ).catch(() => ({ rows: [{ count: "0" }] })),

    // Most recent fetch timestamp
    pool.query(
      `SELECT MAX(fetched_at) AS last_fetched FROM ai_news_items`,
    ).catch(() => ({ rows: [{ last_fetched: null }] })),

    // Does today's digest exist?
    pool.query(
      `SELECT id FROM magazine_articles WHERE date = CURRENT_DATE`,
    ).catch(() => ({ rows: [] })),
  ]);

  return NextResponse.json({
    last_run:         lastRunRes.rows[0] ?? null,
    news_count_48h:   parseInt(newsCountRes.rows[0]?.count ?? "0"),
    last_fetched_at:  lastFetchedRes.rows[0]?.last_fetched ?? null,
    has_today_digest: todayDigestRes.rows.length > 0,
    schedule_label:   "هر شب ساعت ۷:۳۰",
  });
}
