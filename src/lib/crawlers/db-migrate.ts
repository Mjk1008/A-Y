/**
 * db-migrate.ts — create crawl tables if they don't exist.
 * Called automatically by the /api/crawl route before each run.
 */

import pool from "../db";

export async function migrateCrawlTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS crawled_jobs (
      id           SERIAL PRIMARY KEY,
      source       TEXT NOT NULL,
      title        TEXT NOT NULL,
      company      TEXT,
      location     TEXT,
      skills       TEXT[],
      description  TEXT,
      url          TEXT UNIQUE,
      posted_at    TIMESTAMPTZ,
      is_remote    BOOLEAN DEFAULT FALSE,
      salary_range TEXT,
      crawled_at   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS crawled_courses (
      id              SERIAL PRIMARY KEY,
      source          TEXT NOT NULL,
      title           TEXT NOT NULL,
      instructor      TEXT,
      platform        TEXT,
      url             TEXT UNIQUE,
      thumbnail       TEXT,
      description     TEXT,
      level           TEXT,
      duration_hours  INTEGER DEFAULT 0,
      price_toman     INTEGER DEFAULT 0,
      rating          NUMERIC(3,1) DEFAULT 0,
      rating_count    INTEGER DEFAULT 0,
      topics          TEXT[],
      is_farsi        BOOLEAN DEFAULT TRUE,
      has_certificate BOOLEAN DEFAULT FALSE,
      crawled_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS crawled_accounts (
      id           SERIAL PRIMARY KEY,
      source       TEXT NOT NULL,
      name         TEXT NOT NULL,
      description  TEXT,
      category     TEXT,
      url          TEXT UNIQUE,
      price_toman  INTEGER DEFAULT 0,
      period       TEXT,
      available    BOOLEAN DEFAULT TRUE,
      thumbnail    TEXT,
      crawled_at   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS crawled_tools (
      id                 SERIAL PRIMARY KEY,
      name               TEXT UNIQUE NOT NULL,
      tagline            TEXT,
      description        TEXT,
      url                TEXT,
      categories         TEXT[],
      use_cases          TEXT[],
      pricing_model      TEXT,
      difficulty         TEXT,
      logo_url           TEXT,
      is_iran_accessible BOOLEAN DEFAULT FALSE,
      crawled_at         TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_streaks (
      user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      current_streak    INT DEFAULT 0,
      best_streak       INT DEFAULT 0,
      last_activity_date DATE,
      total_days_active INT DEFAULT 0,
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS shared_analyses (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
      analysis_id UUID,
      token       TEXT UNIQUE NOT NULL,
      view_count  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS referral_codes (
      id           SERIAL PRIMARY KEY,
      user_id      UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      code         TEXT UNIQUE NOT NULL,
      used_count   INT DEFAULT 0,
      reward_given INT DEFAULT 0,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS referral_uses (
      id          SERIAL PRIMARY KEY,
      referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
      referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
      used_at     TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS magazine_articles (
      id           SERIAL PRIMARY KEY,
      date         DATE UNIQUE NOT NULL,
      title        TEXT,
      content_json JSONB,
      generated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // W12: composite index for usage_logs quota queries (user_id + type + created_at)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_usage_logs_user_type_date
    ON usage_logs (user_id, type, created_at)
  `).catch(() => {}); // ignore if usage_logs doesn't exist yet
}
