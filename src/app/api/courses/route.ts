/**
 * GET /api/courses
 *
 * Query params:
 *   q        — search in title/description/topics (optional)
 *   level    — beginner | intermediate | advanced (optional)
 *   free     — "true" for free only (optional)
 *   source   — filter by platform (optional)
 *   limit    — max results (default 20, max 50)
 *   offset   — pagination (default 0)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q")      ?? "";
  const level  = searchParams.get("level")  ?? "";
  const free   = searchParams.get("free")   === "true";
  const source = searchParams.get("source") ?? "";
  const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (q) {
    values.push(`%${q}%`);
    const n = values.length;
    conditions.push(`(title ILIKE $${n} OR description ILIKE $${n})`);
  }
  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }
  if (free) {
    conditions.push("price_toman = 0");
  }
  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS crawled_courses (
      id SERIAL PRIMARY KEY, source TEXT, title TEXT, instructor TEXT,
      platform TEXT, url TEXT UNIQUE, thumbnail TEXT, description TEXT,
      level TEXT, duration_hours INTEGER DEFAULT 0, price_toman INTEGER DEFAULT 0,
      rating NUMERIC(3,1) DEFAULT 0, rating_count INTEGER DEFAULT 0,
      topics TEXT[], is_farsi BOOLEAN DEFAULT TRUE,
      has_certificate BOOLEAN DEFAULT FALSE, crawled_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM crawled_courses ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, source, title, instructor, platform, url, thumbnail,
              description, level, duration_hours, price_toman,
              rating, rating_count, topics, is_farsi, has_certificate, crawled_at
       FROM crawled_courses ${where}
       ORDER BY rating DESC, rating_count DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json({
      total,
      limit,
      offset,
      courses: dataResult.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
