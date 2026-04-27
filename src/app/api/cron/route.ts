/**
 * GET /api/cron
 * ─────────────
 * Scheduled daily job — called by Liara cron (see liara.json).
 * Runs the full news pipeline:
 *   1. Crawl RSS feeds  → ai_news_items
 *   2. Generate digest  → magazine_articles
 *   3. Log result       → cron_job_logs
 *
 * Auth: Authorization: Bearer $CRON_SECRET
 *
 * Liara env vars required:
 *   CRON_SECRET  — shared secret set in Liara dashboard + liara.json command
 *   DATABASE_URL — already set for the app
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ── Ensure cron_job_logs table ─────────────────────────────────── */
async function ensureCronTable() {
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
}

/* ── Auth ───────────────────────────────────────────────────────── */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || process.env.CRAWL_SECRET || "";
  if (!secret) return false;                          // must have a secret
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

/* ── Internal fetcher — calls the app's own API endpoints ───────── */
async function callInternal(
  path: string,
  method: "GET" | "POST",
  secret: string,
): Promise<{ ok: boolean; data: unknown }> {
  // On Liara the cron command runs inside the same container,
  // so we can hit localhost directly without going through the internet.
  const base = process.env.INTERNAL_URL || "http://localhost:3000";
  const url  = `${base}${path}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      // Give each step up to 90 s (crawl can be slow)
      signal: AbortSignal.timeout(90_000),
    });
    const data = await res.json().catch(() => ({ status: res.status }));
    return { ok: res.ok, data };
  } catch (e) {
    return { ok: false, data: { error: String(e) } };
  }
}

/* ── Main job ───────────────────────────────────────────────────── */
async function runJob(secret: string): Promise<{
  crawl: unknown;
  digest: unknown;
  duration_ms: number;
}> {
  const t0 = Date.now();

  // Step 1 — crawl AI news from RSS feeds
  const crawlResult = await callInternal("/api/magazine/crawl", "POST", secret);

  // Step 2 — (re)generate today's AI digest
  const digestResult = await callInternal("/api/magazine", "POST", secret);

  return {
    crawl:  crawlResult.data,
    digest: digestResult.data,
    duration_ms: Date.now() - t0,
  };
}

/* ── GET handler ────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.CRON_SECRET || process.env.CRAWL_SECRET || "";
  await ensureCronTable();

  const startedAt = new Date();

  try {
    const result = await runJob(secret);

    await pool.query(
      `INSERT INTO cron_job_logs
         (job_type, status, started_at, finished_at, duration_ms, result)
       VALUES ('daily_news', 'success', $1, NOW(), $2, $3)`,
      [startedAt.toISOString(), result.duration_ms, JSON.stringify(result)],
    ).catch(() => {});

    return NextResponse.json({
      ok: true,
      ran_at: startedAt.toISOString(),
      duration_ms: result.duration_ms,
      crawl:  result.crawl,
      digest: result.digest,
    });
  } catch (e) {
    const errMsg = String(e);
    await pool.query(
      `INSERT INTO cron_job_logs
         (job_type, status, started_at, finished_at, error)
       VALUES ('daily_news', 'error', $1, NOW(), $2)`,
      [startedAt.toISOString(), errMsg],
    ).catch(() => {});

    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

/* ── POST handler — same as GET, for flexibility ────────────────── */
export const POST = GET;
