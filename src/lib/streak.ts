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

/* Ensure table exists — idempotent, fast on subsequent calls */
async function ensureStreakTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_streaks (
      user_id           UUID PRIMARY KEY,
      current_streak    INT DEFAULT 0,
      best_streak       INT DEFAULT 0,
      last_activity_date DATE,
      total_days_active INT DEFAULT 0,
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  totalDaysActive: number;
}

export async function updateStreak(userId: string): Promise<StreakData> {
  try {
    await ensureStreakTable();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

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
    const lastDate: string | null = row.last_activity_date
      ? new Date(row.last_activity_date).toISOString().slice(0, 10)
      : null;

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
    await ensureStreakTable();
    const res = await pool.query(
      `SELECT current_streak, best_streak, last_activity_date, total_days_active
       FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    if (res.rows.length === 0) {
      return { currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 };
    }
    const row = res.rows[0];
    return {
      currentStreak: row.current_streak,
      bestStreak: row.best_streak,
      lastActivityDate: row.last_activity_date
        ? new Date(row.last_activity_date).toISOString().slice(0, 10)
        : null,
      totalDaysActive: row.total_days_active,
    };
  } catch (e) {
    console.error("getStreak error:", e);
    return { currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 };
  }
}
