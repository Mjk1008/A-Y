/**
 * GET /api/db-init?secret=CRON_SECRET
 *
 * One-time setup: creates all missing tables and seeds crawled_tools.
 * Call once after each fresh deployment.
 * Protected by CRON_SECRET env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { CURATED_TOOLS } from "@/lib/crawlers/tools";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Auth guard
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};

  // ── 1. crawled_tools ─────────────────────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crawled_tools (
        id                 SERIAL      PRIMARY KEY,
        name               TEXT        NOT NULL,
        tagline            TEXT,
        description        TEXT,
        url                TEXT,
        categories         TEXT[]      DEFAULT '{}',
        use_cases          TEXT[]      DEFAULT '{}',
        pricing_model      TEXT        DEFAULT 'freemium',
        difficulty         TEXT        DEFAULT 'intermediate',
        learning_time      TEXT,
        logo_url           TEXT,
        is_iran_accessible BOOLEAN     DEFAULT false,
        added_at           TIMESTAMPTZ DEFAULT NOW(),
        updated_at         TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_crawled_tools_name ON crawled_tools(name);
      CREATE INDEX IF NOT EXISTS idx_crawled_tools_categories ON crawled_tools USING GIN(categories);
      CREATE INDEX IF NOT EXISTS idx_crawled_tools_iran ON crawled_tools(is_iran_accessible);
    `);

    results.crawled_tools_table = "ok";
  } catch (e) {
    results.crawled_tools_table = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 2. seed crawled_tools with CURATED_TOOLS ─────────────────────
  try {
    let seeded = 0;
    for (const tool of CURATED_TOOLS) {
      await pool.query(`
        INSERT INTO crawled_tools
          (name, tagline, description, url, categories, use_cases,
           pricing_model, difficulty, learning_time, logo_url,
           is_iran_accessible, added_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (name) DO UPDATE SET
          tagline            = EXCLUDED.tagline,
          description        = EXCLUDED.description,
          url                = EXCLUDED.url,
          categories         = EXCLUDED.categories,
          use_cases          = EXCLUDED.use_cases,
          pricing_model      = EXCLUDED.pricing_model,
          difficulty         = EXCLUDED.difficulty,
          learning_time      = EXCLUDED.learning_time,
          logo_url           = EXCLUDED.logo_url,
          is_iran_accessible = EXCLUDED.is_iran_accessible,
          updated_at         = NOW()
      `, [
        tool.name,
        tool.tagline,
        tool.description,
        tool.url,
        tool.categories,
        tool.use_cases,
        tool.pricing_model,
        tool.difficulty,
        tool.learning_time,
        tool.logo_url ?? null,
        tool.is_iran_accessible,
        tool.added_at,
      ]);
      seeded++;
    }
    results.crawled_tools_seed = `seeded ${seeded} tools`;
  } catch (e) {
    results.crawled_tools_seed = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 3. shared_analyses ───────────────────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared_analyses (
        id           SERIAL      PRIMARY KEY,
        user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        analysis_id  UUID        NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
        token        TEXT        UNIQUE NOT NULL,
        view_count   INTEGER     DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_shared_analyses_token ON shared_analyses(token);
      CREATE INDEX IF NOT EXISTS idx_shared_analyses_user  ON shared_analyses(user_id);
    `);
    results.shared_analyses = "ok";
  } catch (e) {
    results.shared_analyses = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 4. referral_codes ─────────────────────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referral_codes (
        id           SERIAL      PRIMARY KEY,
        user_id      UUID        UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        code         TEXT        UNIQUE NOT NULL,
        used_count   INT         DEFAULT 0,
        reward_given INT         DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    results.referral_codes = "ok";
  } catch (e) {
    results.referral_codes = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 5. referral_uses ──────────────────────────────────────────────
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referral_uses (
        id          SERIAL      PRIMARY KEY,
        referrer_id UUID        REFERENCES users(id) ON DELETE CASCADE,
        referred_id UUID        REFERENCES users(id) ON DELETE CASCADE,
        used_at     TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    results.referral_uses = "ok";
  } catch (e) {
    results.referral_uses = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 6. skill_levels column on profiles ───────────────────────────
  try {
    await pool.query(`
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skill_levels JSONB
    `);
    results.profiles_skill_levels = "ok";
  } catch (e) {
    results.profiles_skill_levels = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // ── 7. nickname column on profiles ────────────────────────────────
  try {
    await pool.query(`
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nickname TEXT
    `);
    results.profiles_nickname = "ok";
  } catch (e) {
    results.profiles_nickname = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  const allOk = Object.values(results).every((v) => !v.startsWith("error"));

  return NextResponse.json({
    status: allOk ? "success" : "partial",
    results,
  });
}
