/**
 * GET /api/accounts
 *
 * Query params:
 *   category  — filter by category (ChatGPT, Midjourney, Adobe…)
 *   source    — filter by source store
 *   available — "true" for available only (default true)
 *   limit     — max results (default 30, max 100)
 *   offset    — pagination (default 0)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category  = searchParams.get("category")  ?? "";
  const source    = searchParams.get("source")    ?? "";
  const available = searchParams.get("available") !== "false";   /* default: true */
  const limit     = Math.min(100, parseInt(searchParams.get("limit") ?? "30"));
  const offset    = parseInt(searchParams.get("offset") ?? "0");

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (available) {
    conditions.push("available = TRUE");
  }
  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS crawled_accounts (
      id SERIAL PRIMARY KEY, source TEXT, name TEXT, description TEXT,
      category TEXT, url TEXT UNIQUE, price_toman INTEGER DEFAULT 0,
      period TEXT, available BOOLEAN DEFAULT TRUE, thumbnail TEXT,
      crawled_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM crawled_accounts ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    /* Also return distinct categories for filter UI */
    const catResult = await pool.query(
      `SELECT DISTINCT category FROM crawled_accounts WHERE available = TRUE ORDER BY category`
    );

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, source, name, description, category, url,
              price_toman, period, available, thumbnail, crawled_at
       FROM crawled_accounts ${where}
       ORDER BY price_toman ASC, crawled_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json({
      total,
      limit,
      offset,
      categories: catResult.rows.map((r) => r.category),
      accounts: dataResult.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
