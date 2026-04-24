/**
 * GET /api/jobs
 *
 * Query params:
 *   q        — search in title/company/skills (optional)
 *   source   — filter by source (optional)
 *   remote   — "true" for remote only (optional)
 *   days     — look back N days (default 7)
 *   limit    — max results (default 30, max 100)
 *   offset   — pagination (default 0)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q")      ?? "";
  const source = searchParams.get("source") ?? "";
  const remote = searchParams.get("remote") === "true";
  const days   = Math.min(30, parseInt(searchParams.get("days") ?? "7"));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "30"));
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const conditions: string[] = [
    `crawled_at >= NOW() - INTERVAL '${days} days'`,
  ];
  const values: unknown[] = [];

  if (q) {
    values.push(`%${q}%`);
    const n = values.length;
    conditions.push(
      `(title ILIKE $${n} OR company ILIKE $${n} OR description ILIKE $${n} ` +
      `OR $${n} = ANY(skills))`
    );
  }
  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }
  if (remote) {
    conditions.push("is_remote = TRUE");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    /* First make sure table exists */
    await pool.query(`CREATE TABLE IF NOT EXISTS crawled_jobs (
      id SERIAL PRIMARY KEY, source TEXT, title TEXT, company TEXT,
      location TEXT, skills TEXT[], description TEXT, url TEXT UNIQUE,
      posted_at TIMESTAMPTZ, is_remote BOOLEAN, crawled_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM crawled_jobs ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, source, title, company, location, skills, description,
              url, posted_at, is_remote, crawled_at
       FROM crawled_jobs ${where}
       ORDER BY posted_at DESC NULLS LAST
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json({
      total,
      limit,
      offset,
      jobs: dataResult.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
