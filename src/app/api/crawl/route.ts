/**
 * POST /api/crawl       — trigger a full crawl (protected by CRAWL_SECRET)
 * GET  /api/crawl       — return last crawl stats from DB
 *
 * Designed to be called by a cron job (GitHub Actions, Liara cron, etc.)
 *
 * cron header: Authorization: Bearer $CRAWL_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { migrateCrawlTables } from "@/lib/crawlers/db-migrate";
import { scrapeAllJobs }     from "@/lib/crawlers/scraper-jobs";
import { scrapeAllCourses }  from "@/lib/crawlers/scraper-courses";
import { scrapeAllAccounts } from "@/lib/crawlers/scraper-accounts";
import { writeJobsMd, writeCoursesMd, writeAccountsMd } from "@/lib/crawlers/md-writer";

/* ── GET — crawl stats ────────────────────────────────────────────── */
export async function GET() {
  try {
    const [jobs, courses, accounts] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM crawled_jobs"),
      pool.query("SELECT COUNT(*) FROM crawled_courses"),
      pool.query("SELECT COUNT(*) FROM crawled_accounts"),
    ]);

    const [lastJob, lastCourse, lastAccount] = await Promise.all([
      pool.query("SELECT MAX(crawled_at) as last FROM crawled_jobs"),
      pool.query("SELECT MAX(crawled_at) as last FROM crawled_courses"),
      pool.query("SELECT MAX(crawled_at) as last FROM crawled_accounts"),
    ]);

    return NextResponse.json({
      jobs:     { total: parseInt(jobs.rows[0].count), last_crawl: lastJob.rows[0].last },
      courses:  { total: parseInt(courses.rows[0].count), last_crawl: lastCourse.rows[0].last },
      accounts: { total: parseInt(accounts.rows[0].count), last_crawl: lastAccount.rows[0].last },
    });
  } catch (e) {
    return NextResponse.json({ error: "DB not ready" }, { status: 503 });
  }
}

/* ── POST — trigger crawl ─────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* Auth check */
  const secret = process.env.CRAWL_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body    = await req.json().catch(() => ({}));
  const targets = (body.targets as string[] | undefined) ?? ["jobs", "courses", "accounts"];

  /* Ensure tables exist */
  try {
    await migrateCrawlTables();
  } catch (e) {
    return NextResponse.json({ error: "DB migration failed", detail: String(e) }, { status: 500 });
  }

  const report: Record<string, { count: number; errors: string[] }> = {};

  /* ── Jobs ─────────────────────────────────────────────────────── */
  if (targets.includes("jobs")) {
    const errors: string[] = [];
    try {
      const jobs = await scrapeAllJobs("هوش مصنوعی");

      /* Upsert by URL */
      let count = 0;
      for (const j of jobs) {
        try {
          await pool.query(`
            INSERT INTO crawled_jobs
              (source, title, company, location, skills, description, url, posted_at, is_remote)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (url) DO UPDATE SET
              title=EXCLUDED.title, company=EXCLUDED.company,
              crawled_at=NOW()
          `, [
            j.source, j.title, j.company, j.location,
            j.skills_required, j.description, j.url,
            j.posted_at, j.is_remote,
          ]);
          count++;
        } catch { /* skip individual conflict */ }
      }

      await writeJobsMd(jobs);
      report.jobs = { count, errors };
    } catch (e) {
      errors.push(String(e));
      report.jobs = { count: 0, errors };
    }
  }

  /* ── Courses ──────────────────────────────────────────────────── */
  if (targets.includes("courses")) {
    const errors: string[] = [];
    try {
      const courses = await scrapeAllCourses("هوش مصنوعی");

      let count = 0;
      for (const c of courses) {
        try {
          await pool.query(`
            INSERT INTO crawled_courses
              (source, title, instructor, platform, url, thumbnail, description,
               level, duration_hours, price_toman, rating, rating_count,
               topics, is_farsi, has_certificate)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
            ON CONFLICT (url) DO UPDATE SET
              title=EXCLUDED.title, price_toman=EXCLUDED.price_toman,
              rating=EXCLUDED.rating, crawled_at=NOW()
          `, [
            c.source, c.title, c.instructor, c.platform, c.url,
            c.thumbnail ?? null, c.description,
            c.level, c.duration_hours, c.price_toman,
            c.rating, c.rating_count,
            c.topics, c.is_farsi, c.has_certificate,
          ]);
          count++;
        } catch { /* skip */ }
      }

      await writeCoursesMd(courses);
      report.courses = { count, errors };
    } catch (e) {
      errors.push(String(e));
      report.courses = { count: 0, errors };
    }
  }

  /* ── Accounts ─────────────────────────────────────────────────── */
  if (targets.includes("accounts")) {
    const errors: string[] = [];
    try {
      const accounts = await scrapeAllAccounts();

      let count = 0;
      for (const a of accounts) {
        try {
          await pool.query(`
            INSERT INTO crawled_accounts
              (source, name, description, category, url, price_toman, period, available, thumbnail)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (url) DO UPDATE SET
              name=EXCLUDED.name, price_toman=EXCLUDED.price_toman,
              available=EXCLUDED.available, crawled_at=NOW()
          `, [
            a.source, a.name, a.description, a.category, a.url,
            a.price_toman, a.period, a.available, a.thumbnail ?? null,
          ]);
          count++;
        } catch { /* skip */ }
      }

      await writeAccountsMd(accounts);
      report.accounts = { count, errors };
    } catch (e) {
      errors.push(String(e));
      report.accounts = { count: 0, errors };
    }
  }

  return NextResponse.json({ ok: true, crawled_at: new Date().toISOString(), report });
}
