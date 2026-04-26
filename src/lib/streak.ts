/**
 * streak.ts — Streak tracking logic
 *
 * Updates user_streaks table on each qualifying activity.
 * Call updateStreak(userId) after: chat message, analysis, roadmap task completion.
 *
 * Rules:
 *  - If last_activity_date = yesterday → current_streak++
 *  - If last_activity_date = today → no-op (already counted)
 *  - If last_activity_date is older → reset to 1
 *  - Always update best_streak if current > best
 */

import { pool } from "@/lib/db";

// W8: table creation removed — user_streaks is managed in lib/crawlers/db-migrate.ts

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  totalDaysActive: number;
}

/** Returns "YYYY-MM-DD" in UTC — safe regardless of server timezone */
function utcDateStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
function utcYesterdayStr(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
/** Parse a DATE value from pg (may come back as Date object or string) → "YYYY-MM-DD" UTC */
function pgDateToStr(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return null;
}

export async function updateStreak(userId: string): Promise<StreakData> {
  try {
    const todayStr = utcDateStr();
    const yesterdayStr = utcYesterdayStr();

    // Get current streak data
    const res = await pool.query(
      `SELECT current_streak, best_streak, last_activity_date, total_days_active
       FROM user_streaks WHERE user_id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      // First ever activity — create row
      await pool.query(
        `INSERT INTO user_streaks
           (user_id, current_streak, best_streak, last_activity_date, total_days_active)
         VALUES ($1, 1, 1, $2, 1)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, todayStr]
      );
      return { currentStreak: 1, bestStreak: 1, lastActivityDate: todayStr, totalDaysActive: 1 };
    }

    const row = res.rows[0];
    const lastDate: string | null = pgDateToStr(row.last_activity_date);

    // Already counted today — just return current data
    if (lastDate === todayStr) {
      return {
        currentStreak: row.current_streak,
        bestStreak: row.best_streak,
        lastActivityDate: lastDate,
        totalDaysActive: row.total_days_active,
      };
    }

    let newStreak: number;
    if (lastDate === yesterdayStr) {
      // Consecutive day
      newStreak = row.current_streak + 1;
    } else {
      // Gap — reset
      newStreak = 1;
    }

    const newBest = Math.max(newStreak, row.best_streak);
    const newTotal = (row.total_days_active || 0) + 1;

    await pool.query(
      `UPDATE user_streaks
       SET current_streak=$1, best_streak=$2, last_activity_date=$3, total_days_active=$4, updated_at=NOW()
       WHERE user_id=$5`,
      [newStreak, newBest, todayStr, newTotal, userId]
    );

    return {
      currentStreak: newStreak,
      bestStreak: newBest,
      lastActivityDate: todayStr,
      totalDaysActive: newTotal,
    };
  } catch (e) {
    console.error("updateStreak error:", e);
    return { currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 };
  }
}

export async function getStreak(userId: string): Promise<StreakData> {
  try {
    const res = await pool.query(
      `SELECT current_streak, best_streak, last_activity_date, total_days_active
       FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    if (res.rows.length === 0) {
      return { currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 };
    }
    const row = res.rows[0];
    const lastDate = pgDateToStr(row.last_activity_date);
    const todayStr = utcDateStr();
    const yesterdayStr = utcYesterdayStr();

    // If last activity was before yesterday, streak has decayed — show 0 for display
    // (the DB is updated to 1 the next time the user actually does something)
    const isActive = lastDate === todayStr || lastDate === yesterdayStr;
    const currentStreak = isActive ? row.current_streak : 0;

    return {
      currentStreak,
      bestStreak: row.best_streak,
      lastActivityDate: lastDate,
      totalDaysActive: row.total_days_active,
    };
  } catch (e) {
    console.error("getStreak error:", e);
    return { currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 };
  }
}
