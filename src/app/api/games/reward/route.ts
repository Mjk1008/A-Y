/**
 * POST /api/games/reward
 * Grant a reward when user achieves a score milestone in a game.
 *
 * Anti-cheat: max 1 reward per game per day per user.
 * Rewards are stored as usage_log entries.
 *
 * Reward types:
 *   snake   score > 10  → +1 free chat message (grant by NOT counting it)
 *   2048    score > 512 → +1 analysis (grant by logging bonus)
 *   flappy  score > 5   → +1 streak day bonus
 *   memory  all pairs   → +1 analysis bonus
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

type GameId = "snake" | "2048" | "flappy" | "memory";

const REWARD_THRESHOLDS: Record<GameId, number> = {
  snake: 10,
  "2048": 512,
  flappy: 5,
  memory: 1, // any positive score = completed
};

const REWARD_LABELS: Record<GameId, string> = {
  snake:  "+۱ پیام چت رایگان",
  "2048": "+۱ تحلیل اضافه",
  flappy: "+۱ روز streak bonus",
  memory: "+۱ تحلیل اضافه",
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const game: GameId = body.game;
  const score: number = parseInt(body.score ?? "0", 10);

  if (!game || !Object.keys(REWARD_THRESHOLDS).includes(game)) {
    return NextResponse.json({ error: "invalid_game" }, { status: 400 });
  }

  const threshold = REWARD_THRESHOLDS[game];
  if (score < threshold) {
    return NextResponse.json({
      earned: false,
      needed: threshold,
      current: score,
      message: `نیاز به امتیاز ${threshold} — الان ${score} داری`,
    });
  }

  // Anti-cheat: check if already rewarded today for this game
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const alreadyRewarded = await pool.query(
    `SELECT id FROM usage_logs
     WHERE user_id=$1 AND type='game_reward'
       AND metadata->>'game' = $2
       AND created_at >= $3`,
    [session.id, game, today.toISOString()]
  ).catch(() => ({ rows: [] }));

  if (alreadyRewarded.rows.length > 0) {
    return NextResponse.json({
      earned: false,
      alreadyClaimed: true,
      message: "امروز قبلاً جایزه گرفتی — فردا دوباره بیا!",
    });
  }

  // Grant reward
  await pool.query(
    `INSERT INTO usage_logs (user_id, type, metadata)
     VALUES ($1, 'game_reward', $2)`,
    [session.id, JSON.stringify({ game, score, reward: REWARD_LABELS[game] })]
  );

  return NextResponse.json({
    earned: true,
    reward: REWARD_LABELS[game],
    game,
    score,
    message: `🎉 ${REWARD_LABELS[game]}`,
  });
}
