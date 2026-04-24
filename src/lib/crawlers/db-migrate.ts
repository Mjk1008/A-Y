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
  `);
}
