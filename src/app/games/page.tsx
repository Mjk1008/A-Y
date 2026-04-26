"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { SnakeGame } from "./Snake";
import { TwentyFortyEightGame } from "./TwentyFortyEight";
import { FlappyGame } from "./Flappy";
import { MemoryGame } from "./Memory";
import { BikeGame } from "./Bike";
import { BottomNav } from "@/app/components/BottomNav";
import { MascotArt } from "@/app/components/PixelMascot";

type GameId = "snake" | "2048" | "flappy" | "memory" | "bike";
type View = "hub" | "intro" | "playing" | "result" | "leaderboard";

interface GameConfig {
  id: GameId;
  label: string;
  emoji: string;
  tag: string;
  tagline: string;
  playtime: string;
  accent: string;
  storageKey: string;
  howTo: string[];
  difficulty: 1 | 2 | 3;
}

// Bike game is exclusive — conditionally added after features fetch
const BIKE_GAME: GameConfig = {
  id: "bike",
  label: "دوچرخه",
  emoji: "🚲",
  tag: "ویژه",
  tagline: "از سنگ‌ها رد شو، گل‌ها جمع کن.",
  playtime: "نامحدود",
  accent: "#34d399",
  storageKey: "bike-best",
  howTo: ["tap / space / ↑ برای پرش", "از سنگ‌های سر راهت رد شو", "گل‌های رنگارنگ جمع کن (+۲ امتیاز هر کدوم)"],
  difficulty: 2,
};

const GAMES: GameConfig[] = [
  {
    id: "snake",
    label: "مار",
    emoji: "🐍",
    tag: "کلاسیک",
    tagline: "غذا بخور، بزرگ شو، به دیوار نخور.",
    playtime: "۲ دقیقه",
    accent: "#34d399",
    storageKey: "snake-best",
    howTo: ["فلش یا swipe برای تغییر جهت", "غذا بخور تا بزرگ بشی", "به دیوار یا خودت نخور"],
    difficulty: 2,
  },
  {
    id: "2048",
    label: "۲۰۴۸",
    emoji: "🔢",
    tag: "معمایی",
    tagline: "کاشی‌ها رو ترکیب کن تا به ۲۰۴۸ برسی.",
    playtime: "۵ دقیقه",
    accent: "#fcd34d",
    storageKey: "2048-best",
    howTo: ["فلش یا swipe برای حرکت کاشی‌ها", "کاشی‌های مشابه با هم ادغام می‌شن", "به عدد ۲۰۴۸ برس"],
    difficulty: 2,
  },
  {
    id: "flappy",
    label: "فلپی",
    emoji: "🐦",
    tag: "واکنشی",
    tagline: "بال بزن، از لوله‌ها رد شو.",
    playtime: "۱ دقیقه",
    accent: "#60a5fa",
    storageKey: "flappy-best",
    howTo: ["ضربه بزن یا space/کلیک کن تا بال بزنه", "از لوله‌ها رد شو", "به لوله و زمین نخور"],
    difficulty: 3,
  },
  {
    id: "memory",
    label: "حافظه",
    emoji: "🃏",
    tag: "حافظه",
    tagline: "جفت‌های مثل هم رو پیدا کن.",
    playtime: "۳ دقیقه",
    accent: "#c4b5fd",
    storageKey: "memory-best",
    howTo: ["روی کارت کلیک کن تا برگرده", "جفت‌های مشابه رو پیدا کن", "با کمترین حرکت همه رو جور کن"],
    difficulty: 1,
  },
];

function getBest(key: string): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(key) ?? "0", 10);
}
function setBest(key: string, v: number) {
  if (typeof window !== "undefined") localStorage.setItem(key, String(v));
}

// ─────────────────────────── GameComponent ───────────────────────────
function GameComponent({ id, onGameOver }: { id: GameId; onGameOver: (score: number) => void }) {
  if (id === "snake")  return <SnakeGame onGameOver={onGameOver} />;
  if (id === "2048")   return <TwentyFortyEightGame onGameOver={onGameOver} />;
  if (id === "flappy") return <FlappyGame onGameOver={onGameOver} />;
  if (id === "bike")   return <BikeGame onGameOver={onGameOver} />;
  return <MemoryGame onGameOver={onGameOver} />;
}

// ─────────────────────────── GameCard ───────────────────────────
function GameCard({ game, onPlay }: { game: GameConfig; onPlay: () => void }) {
  const { accent, emoji, tag, label, playtime, tagline, storageKey } = game;
  const bestScore = getBest(storageKey);

  return (
    <div
      style={{
        height: 220,
        borderRadius: 18,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${accent}12 0%, rgba(18,30,24,0.6) 100%)`,
        border: `1px solid ${accent}33`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
      onClick={onPlay}
    >
      {/* Preview area */}
      <div
        style={{
          height: 100,
          position: "relative",
          background: `linear-gradient(180deg, ${accent}22 0%, rgba(2,3,6,0.9) 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 38, filter: `drop-shadow(0 0 10px ${accent}99)`, zIndex: 2, position: "relative" }}>
          {emoji}
        </span>
        {[{ top: 6, right: 6 }, { top: 6, left: 6 }, { bottom: 20, right: 6 }, { bottom: 20, left: 6 }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", width: 2, height: 2, borderRadius: 0, background: accent, opacity: 0.6, ...pos }} />
        ))}
        <div style={{ position: "absolute", top: 7, left: 7, background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 20, padding: "2px 7px", fontFamily: "monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: accent, zIndex: 3 }}>
          {tag}
        </div>
        {bestScore > 0 && (
          <div style={{ position: "absolute", top: 7, right: 7, display: "flex", alignItems: "center", gap: 3, fontFamily: "monospace", fontSize: 9, color: accent, opacity: 0.9, zIndex: 3 }}>
            <span>👑</span>
            <span>{bestScore}</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`, zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, background: `repeating-linear-gradient(90deg, ${accent}18 0px, ${accent}18 4px, transparent 4px, transparent 8px)`, zIndex: 2 }} />
      </div>

      {/* Card body */}
      <div style={{ padding: "12px 12px 10px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#e8efea" }}>{label}</span>
          <span style={{ fontFamily: "monospace", fontSize: 9.5, color: "rgba(232,239,234,0.45)" }}>{playtime}</span>
        </div>
        <p style={{ fontSize: 10.5, color: "rgba(232,239,234,0.55)", lineHeight: 1.5, minHeight: 30, margin: 0 }}>{tagline}</p>
        <button
          style={{ width: "100%", borderRadius: 11, background: accent, color: "#04110a", fontWeight: 800, fontSize: 12, border: "none", padding: "7px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, cursor: "pointer", marginTop: "auto" }}
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
        >
          <span>▶</span>
          <span>شروع</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────── StatsStrip ───────────────────────────
function StatsStrip({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {stats.map(({ label, value }, i) => (
        <div key={i} style={{ textAlign: "center", padding: "10px 6px", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
          <div style={{ fontSize: 9, color: "rgba(232,239,234,0.45)", marginBottom: 3 }}>{label}</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#e8efea" }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────── GameIntro ───────────────────────────
function GameIntro({ game, onStart, onBack }: { game: GameConfig; onStart: () => void; onBack: () => void }) {
  const { accent, emoji, label, tagline, howTo, difficulty, playtime } = game;

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${accent}18, transparent 60%), #020306`,
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(2,3,6,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowRight size={16} />
          <span>بازی‌ها</span>
        </button>
        <span style={{ fontWeight: 700, fontSize: 14, color: accent }}>{label}</span>
        <div style={{ width: 72 }} />
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: 28 }}>
        {/* Game emoji hero */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 96, height: 96, borderRadius: 28,
              background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
              border: `2px solid ${accent}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 52,
              boxShadow: `0 0 40px ${accent}33`,
            }}
          >
            {emoji}
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#e8efea" }}>{label}</h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(232,239,234,0.55)", lineHeight: 1.5 }}>{tagline}</p>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: `${accent}12`, border: `1px solid ${accent}30` }}>
            <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>⏱ {playtime}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 10, color: "rgba(232,239,234,0.5)" }}>سختی:</span>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3].map((d) => (
                <div key={d} style={{ width: 6, height: 6, borderRadius: 2, background: d <= difficulty ? accent : "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
          </div>
          {getBest(game.storageKey) > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, background: `${accent}12`, border: `1px solid ${accent}30` }}>
              <span style={{ fontSize: 11, color: accent, fontFamily: "monospace" }}>👑 {getBest(game.storageKey)}</span>
            </div>
          )}
        </div>

        {/* How to play */}
        <div style={{ width: "100%", maxWidth: 340, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(232,239,234,0.4)", marginBottom: 12, fontFamily: "monospace" }}>
            چطور بازی کنیم
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {howTo.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${accent}18`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: accent, fontFamily: "monospace" }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 12.5, color: "rgba(232,239,234,0.75)", lineHeight: 1.4 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            width: "100%", maxWidth: 340, height: 54, borderRadius: 16, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            color: "#04110a", fontWeight: 900, fontSize: 17,
            boxShadow: `0 8px 32px ${accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <span>▶</span>
          <span>شروع بازی</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────── RewardOverlay ───────────────────────────
function RewardOverlay({ rewardData, accent, onDismiss }: {
  rewardData: RewardData;
  accent: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // slight delay so the overlay animates in after result screen mounts
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(2,3,6,0.82)",
        backdropFilter: "blur(10px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* confetti dots */}
      {["🎊","✨","🎉","⭐","💫","🎁","✨","🌟"].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + (i * 11) % 80}%`,
          top: `${8 + (i * 13) % 40}%`,
          fontSize: 18 + (i % 3) * 6,
          opacity: 0.7,
          animation: `ay-float-${i % 3} ${2 + i * 0.3}s ease-in-out ${i * 0.15}s infinite`,
          pointerEvents: "none",
        }}>{s}</div>
      ))}

      <style>{`
        @keyframes ay-float-0{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-12px) rotate(5deg)}}
        @keyframes ay-float-1{0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-8px) rotate(-3deg)}}
        @keyframes ay-float-2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(8deg)}}
        @keyframes ay-reward-pop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative", zIndex: 2,
          background: "linear-gradient(160deg, rgba(42,28,2,0.97), rgba(20,13,1,0.97))",
          border: "1.5px solid rgba(250,204,21,0.5)",
          borderRadius: 28,
          padding: "36px 28px 28px",
          maxWidth: 320, width: "100%",
          textAlign: "center",
          boxShadow: "0 0 80px rgba(250,204,21,0.25), 0 24px 60px rgba(0,0,0,0.6)",
          animation: "ay-reward-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {/* Big reward emoji */}
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 16, filter: "drop-shadow(0 0 24px rgba(250,204,21,0.8))" }}>
          🎁
        </div>

        {/* Title */}
        <div style={{ fontWeight: 900, fontSize: 22, color: "#fde68a", marginBottom: 8 }}>
          جایزه گرفتی!
        </div>

        {/* Reward text */}
        <div style={{
          fontSize: 18, fontWeight: 800, color: "#e8efea",
          marginBottom: 6,
          background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)",
          borderRadius: 14, padding: "10px 16px",
          display: "inline-block",
        }}>
          {rewardData.reward}
        </div>

        <div style={{ fontSize: 12, color: "rgba(253,230,138,0.55)", marginTop: 10, lineHeight: 1.5 }}>
          این جایزه به حساب استفاده‌ات اضافه شد
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          style={{
            marginTop: 20, width: "100%", height: 48, borderRadius: 14,
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #fde68a, #eab308)",
            color: "#2a1d03", fontWeight: 900, fontSize: 15,
            fontFamily: "'Vazirmatn', sans-serif",
          }}
        >
          خیلی ممنون! 🙌
        </button>
      </div>

      {/* tap-outside hint */}
      <div style={{ marginTop: 16, fontSize: 11, color: "rgba(232,239,234,0.25)", position: "relative", zIndex: 2 }}>
        ضربه بزن تا ببندی
      </div>
    </div>
  );
}

// ─────────────────────────── GameResult ───────────────────────────
const REWARD_THRESHOLDS_LABEL: Record<string, number> = {
  snake: 10, "2048": 512, flappy: 5, memory: 1, bike: 15,
};

function GameResult({
  game, score, isNewRecord, rewardData, rewardLoading, onPlayAgain, onLeaderboard, onHub,
}: {
  game: GameConfig; score: number; isNewRecord: boolean;
  rewardData: RewardData | null;
  rewardLoading: boolean;
  onPlayAgain: () => void; onLeaderboard: () => void; onHub: () => void;
}) {
  const { accent, emoji, label } = game;
  const isWin = score > 0;
  const [showOverlay, setShowOverlay] = useState(false);

  // Show overlay as soon as we know reward was earned
  useEffect(() => {
    if (rewardData?.earned) {
      setShowOverlay(true);
    }
  }, [rewardData?.earned]);

  const threshold = REWARD_THRESHOLDS_LABEL[game.id] ?? 0;
  const gapToReward = Math.max(0, threshold - score);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${accent}20, transparent 60%), #020306`,
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Reward overlay — appears on top when earned */}
      {showOverlay && rewardData?.earned && (
        <RewardOverlay
          rewardData={rewardData}
          accent={accent}
          onDismiss={() => setShowOverlay(false)}
        />
      )}

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(2,3,6,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onHub} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowRight size={16} />
          <span>بازی‌ها</span>
        </button>
        <span style={{ fontWeight: 700, fontSize: 14, color: accent }}>{label}</span>
        <div style={{ width: 72 }} />
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: 24 }}>
        {/* Result emoji */}
        <div style={{ fontSize: 72, lineHeight: 1, filter: `drop-shadow(0 0 20px ${accent}66)` }}>
          {isWin ? "🏆" : emoji}
        </div>

        {/* Result title */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: isWin ? accent : "rgba(232,239,234,0.6)" }}>
            {isWin ? "آفرین! بازی تموم شد" : "بازی تموم شد"}
          </h2>
          {isNewRecord && (
            <div style={{
              marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 20,
              background: `${accent}20`, border: `1px solid ${accent}55`,
              color: accent, fontWeight: 700, fontSize: 12,
            }}>
              <span>⭐</span>
              <span>رکورد جدید!</span>
            </div>
          )}
        </div>

        {/* Score card */}
        <div style={{
          width: "100%", maxWidth: 280,
          background: `linear-gradient(180deg, ${accent}10, ${accent}04)`,
          border: `1px solid ${accent}30`,
          borderRadius: 20, padding: "24px 20px", textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>
            امتیاز این دور
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: accent, fontFamily: "monospace", lineHeight: 1 }}>
            {score.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "rgba(232,239,234,0.35)", marginTop: 10, fontFamily: "monospace" }}>
            بهترین: {getBest(game.storageKey).toLocaleString()}
          </div>
        </div>

        {/* Reward status strip */}
        {rewardLoading && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 12, color: "rgba(232,239,234,0.4)",
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              border: "2px solid rgba(232,239,234,0.2)",
              borderTopColor: accent,
              animation: "spin 0.8s linear infinite",
            }} />
            <span>بررسی جایزه...</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {!rewardLoading && rewardData && !rewardData.earned && !rewardData.alreadyClaimed && gapToReward > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 12,
            background: `${accent}08`, border: `1px solid ${accent}20`,
            fontSize: 12, color: `${accent}99`,
          }}>
            <span>🎯</span>
            <span>{gapToReward} امتیاز تا جایزه بعدی</span>
          </div>
        )}

        {!rewardLoading && rewardData?.alreadyClaimed && (
          <div style={{
            padding: "10px 16px", borderRadius: 12,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 11.5, color: "rgba(232,239,234,0.38)", textAlign: "center",
          }}>
            {rewardData.message}
          </div>
        )}

        {/* earned — small inline badge (overlay already shown) */}
        {!rewardLoading && rewardData?.earned && !showOverlay && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 12,
            background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)",
            fontSize: 12, color: "#fde68a", cursor: "pointer",
          }} onClick={() => setShowOverlay(true)}>
            <span>🎁</span>
            <span>{rewardData.reward} — جایزه‌ات رو ببین!</span>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
          <button
            onClick={onPlayAgain}
            style={{
              height: 50, borderRadius: 14, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
              color: "#04110a", fontWeight: 800, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <RotateCcw size={16} />
            <span>دوباره بازی کن</span>
          </button>

          <button
            onClick={onLeaderboard}
            style={{
              height: 46, borderRadius: 14, border: `1px solid ${accent}30`, cursor: "pointer",
              background: `${accent}10`,
              color: accent, fontWeight: 700, fontSize: 13,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Trophy size={15} />
            <span>لیدربورد</span>
          </button>

          <button
            onClick={onHub}
            style={{
              height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
              background: "transparent", color: "rgba(232,239,234,0.4)", fontSize: 12,
            }}
          >
            بازگشت به بازی‌ها
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── GameLeaderboard ───────────────────────────
const MOCK_LEADERBOARD: Record<GameId, { name: string; score: number; flag: string }[]> = {
  bike: [
    { name: "ali_rider", score: 248, flag: "🇮🇷" },
    { name: "sara_m",    score: 191, flag: "🇮🇷" },
    { name: "kia_bike",  score: 162, flag: "🇮🇷" },
    { name: "nima99",    score: 134, flag: "🇮🇷" },
    { name: "tara_f",    score: 98,  flag: "🇮🇷" },
  ],
  snake: [
    { name: "علی_م", score: 312, flag: "🇮🇷" },
    { name: "sara99", score: 287, flag: "🇮🇷" },
    { name: "kia_dev", score: 251, flag: "🇮🇷" },
    { name: "roya_f", score: 198, flag: "🇮🇷" },
    { name: "mehdi22", score: 145, flag: "🇮🇷" },
  ],
  "2048": [
    { name: "mina_ai", score: 18432, flag: "🇮🇷" },
    { name: "hasan_p", score: 14256, flag: "🇮🇷" },
    { name: "lila99", score: 12048, flag: "🇮🇷" },
    { name: "aryan_k", score: 9728, flag: "🇮🇷" },
    { name: "dina_x", score: 8192, flag: "🇮🇷" },
  ],
  flappy: [
    { name: "behnam_r", score: 89, flag: "🇮🇷" },
    { name: "zara_m", score: 72, flag: "🇮🇷" },
    { name: "nima_dev", score: 61, flag: "🇮🇷" },
    { name: "fati99", score: 44, flag: "🇮🇷" },
    { name: "sina_ai", score: 38, flag: "🇮🇷" },
  ],
  memory: [
    { name: "layla_m", score: 980, flag: "🇮🇷" },
    { name: "amin_k", score: 942, flag: "🇮🇷" },
    { name: "nadia_r", score: 911, flag: "🇮🇷" },
    { name: "cyrus_p", score: 876, flag: "🇮🇷" },
    { name: "tara_99", score: 840, flag: "🇮🇷" },
  ],
};

function GameLeaderboard({
  game, userScore, onBack, onPlayAgain,
}: {
  game: GameConfig; userScore: number; onBack: () => void; onPlayAgain: () => void;
}) {
  const { accent, label, storageKey } = game;
  const rows = MOCK_LEADERBOARD[game.id];
  const personalBest = getBest(storageKey);
  const userRank = rows.filter((r) => r.score > personalBest).length + 1;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: "#020306",
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Vazirmatn', sans-serif",
        paddingBottom: 96,
      }}
    >
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(2,3,6,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowRight size={16} />
          <span>نتیجه</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 14 }}>
          <Trophy size={15} style={{ color: accent }} />
          <span style={{ color: accent }}>لیدربورد</span>
        </div>
        <div style={{ width: 72 }} />
      </header>

      <div style={{ padding: "20px 16px 0" }}>
        {/* Game name */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: "rgba(232,239,234,0.4)", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
            {label} · هفته جاری
          </span>
        </div>

        {/* Top 3 podium */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          {[rows[1], rows[0], rows[2]].map((row, i) => {
            const heights = [80, 100, 70];
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: i === 1 ? 1.2 : 1 }}>
                <span style={{ fontSize: i === 1 ? 28 : 22 }}>{medals[actualRank - 1]}</span>
                <div style={{ fontSize: 10.5, color: "rgba(232,239,234,0.7)", fontWeight: 600, textAlign: "center" }}>{row.name}</div>
                <div
                  style={{
                    width: "100%", height: heights[i], borderRadius: "10px 10px 0 0",
                    background: i === 1 ? `linear-gradient(180deg, ${accent}44, ${accent}20)` : `rgba(255,255,255,0.05)`,
                    border: i === 1 ? `1px solid ${accent}44` : "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "monospace", fontWeight: 800, fontSize: i === 1 ? 14 : 12,
                    color: i === 1 ? accent : "rgba(232,239,234,0.6)",
                  }}
                >
                  {row.score.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ width: 22, textAlign: "center", fontSize: i < 3 ? 16 : 12, color: i < 3 ? "auto" : "rgba(232,239,234,0.35)", fontFamily: "monospace", fontWeight: 700 }}>
                {i < 3 ? medals[i] : `${i + 1}`}
              </span>
              <span style={{ fontSize: 14 }}>{row.flag}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "rgba(232,239,234,0.85)" }}>{row.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: i === 0 ? accent : "rgba(232,239,234,0.7)" }}>{row.score.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Your rank */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
          borderRadius: 14,
          background: `${accent}0f`, border: `1px solid ${accent}30`,
          marginBottom: 20,
        }}>
          <span style={{ width: 22, textAlign: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: accent }}>#{userRank}</span>
          <span style={{ fontSize: 14 }}>🇮🇷</span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#e8efea" }}>تو</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: accent }}>{personalBest.toLocaleString()}</span>
            {userScore > personalBest && (
              <span style={{ fontSize: 9, fontWeight: 700, color: accent, background: `${accent}20`, border: `1px solid ${accent}40`, borderRadius: 8, padding: "2px 6px" }}>جدید</span>
            )}
          </div>
        </div>

        {/* Play again */}
        <button
          onClick={onPlayAgain}
          style={{
            width: "100%", height: 50, borderRadius: 14, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            color: "#04110a", fontWeight: 800, fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <RotateCcw size={16} />
          <span>دوباره بازی کن</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

// ─────────────────────────── Pixel sparkle backdrop ───────────────────────────
const SPARKLE_POSITIONS = [[10, 18], [88, 12], [18, 78], [82, 72], [50, 8], [92, 40], [6, 44], [60, 86]];

function PixelBackdrop({ accent }: { accent: string }) {
  return (
    <>
      {SPARKLE_POSITIONS.map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute", left: `${x}%`, top: `${y}%`,
          width: 2, height: 2, background: accent, boxShadow: `0 0 6px ${accent}`,
          opacity: 0.55, pointerEvents: "none",
          animation: `ay-twinkle ${2 + (i * 0.3) % 2}s ease-in-out ${(i * 0.2) % 1.5}s infinite`,
        }} />
      ))}
      <style>{`@keyframes ay-twinkle{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </>
  );
}

// ─────────────────────────── Animated mascot wrapper ───────────────────────────
function HubMascot() {
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return <MascotArt state="idle" frame={frame} blink={blink} scale={3} accent="#34d399" />;
}

// ─────────────────────────── Main Page ───────────────────────────
interface RewardData {
  earned: boolean;
  reward?: string;
  message?: string;
  alreadyClaimed?: boolean;
}

export default function GamesPage() {
  const [view, setView] = useState<View>("hub");
  const [activeGame, setActiveGame] = useState<GameId>("snake");
  const [lastScore, setLastScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [playKey, setPlayKey] = useState(0); // force remount to restart game
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [hasBikeGame, setHasBikeGame] = useState(false);

  // Fetch user-specific features (bike game is exclusive to one user)
  useEffect(() => {
    fetch("/api/user/features")
      .then(r => r.json())
      .then(d => setHasBikeGame(d.features?.bikeGame === true))
      .catch(() => {});
  }, []);

  const allGames = hasBikeGame ? [...GAMES, BIKE_GAME] : GAMES;
  const activeConfig = allGames.find((g) => g.id === activeGame) ?? GAMES[0];

  function goToIntro(id: GameId) {
    setActiveGame(id);
    setView("intro");
    setRewardData(null);
    setRewardLoading(false);
  }

  function startGame() {
    setPlayKey((k) => k + 1);
    setView("playing");
    setRewardData(null);
    setRewardLoading(false);
  }

  const handleGameOver = useCallback(async (score: number) => {
    const prevBest = getBest(activeConfig.storageKey);
    const newRecord = score > prevBest;
    if (newRecord) setBest(activeConfig.storageKey, score);
    setLastScore(score);
    setIsNewRecord(newRecord);
    setRewardLoading(true);
    setRewardData(null);
    setView("result");

    // Try to claim reward
    try {
      const res = await fetch("/api/games/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: activeConfig.id, score }),
      });
      if (res.ok) {
        const data = await res.json();
        setRewardData(data);
      }
    } catch {
      // ignore — reward is a bonus, not critical
    } finally {
      setRewardLoading(false);
    }
  }, [activeConfig.storageKey, activeConfig.id]);

  // ── Hub ──
  if (view === "hub") {
    return (
      <div dir="rtl" style={{ minHeight: "100svh", background: "#020306", color: "#e8efea", paddingBottom: 96, fontFamily: "'Vazirmatn', sans-serif", position: "relative", overflow: "hidden" }}>
        <PixelBackdrop accent="#34d399" />
        <header style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(2,3,6,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            <ArrowRight size={16} />
            <span>داشبورد</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34d399", fontWeight: 700, fontSize: 15 }}>
            <span>⚡</span>
            <span>بازی‌ها</span>
          </div>
          <div style={{ width: 80 }} />
        </header>

        <div style={{ padding: "24px 16px 0", position: "relative", zIndex: 5 }}>
          {/* Mascot + headline row */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16 }}>
            <div style={{ flexShrink: 0 }}>
              <HubMascot />
            </div>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0, lineHeight: 1.2, color: "#e8efea" }}>ذهنت رو استراحت بده.</h1>
              <p style={{ fontSize: 12, opacity: 0.55, margin: "5px 0 0", lineHeight: 1.6 }}>چهار بازی کوتاه برای خستگی‌های کوچیک.</p>
            </div>
          </div>
          <StatsStrip stats={[{ label: "کل بازی‌ها", value: "۴۳۵" }, { label: "تعداد بازی‌ها", value: hasBikeGame ? "۵" : "۴" }, { label: "این هفته", value: "۱۸" }]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {allGames.map((game) => (
              <GameCard key={game.id} game={game} onPlay={() => goToIntro(game.id)} />
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // ── Intro ──
  if (view === "intro") {
    return <GameIntro game={activeConfig} onStart={startGame} onBack={() => setView("hub")} />;
  }

  // ── Playing ──
  if (view === "playing") {
    return (
      <div dir="rtl" style={{ height: "100dvh", background: "#020306", color: "#e8efea", display: "flex", flexDirection: "column", fontFamily: "'Vazirmatn', sans-serif" }}>
        <header style={{ flexShrink: 0, zIndex: 30, background: "rgba(2,3,6,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <button onClick={() => setView("intro")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <ArrowRight size={16} />
              <span>بازی‌ها</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15, color: activeConfig.accent }}>
              <span>{activeConfig.emoji}</span>
              <span>{activeConfig.label}</span>
            </div>
            <div style={{ width: 80 }} />
          </div>

          {/* Tab row */}
          <div className="h-scroll-free" style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px 10px" }}>
            {allGames.map((game) => {
              const isActive = game.id === activeGame;
              return (
                <button
                  key={game.id}
                  onClick={() => { setActiveGame(game.id); setPlayKey((k) => k + 1); }}
                  style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: isActive ? `1px solid ${game.accent}55` : "1px solid rgba(255,255,255,0.06)",
                    background: isActive ? `${game.accent}1a` : "rgba(255,255,255,0.03)",
                    color: isActive ? game.accent : "rgba(255,255,255,0.45)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <span>{game.emoji}</span>
                  <span>{game.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Game area — scrollable if game taller than remaining space */}
        <main
          className="scroll-touch"
          data-lenis-prevent
          style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 16px", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
          <GameComponent key={playKey} id={activeGame} onGameOver={handleGameOver} />
        </main>

        <BottomNav />
      </div>
    );
  }

  // ── Result ──
  if (view === "result") {
    return (
      <GameResult
        game={activeConfig}
        score={lastScore}
        isNewRecord={isNewRecord}
        rewardData={rewardData}
        rewardLoading={rewardLoading}
        onPlayAgain={startGame}
        onLeaderboard={() => setView("leaderboard")}
        onHub={() => setView("hub")}
      />
    );
  }

  // ── Leaderboard ──
  return (
    <GameLeaderboard
      game={activeConfig}
      userScore={lastScore}
      onBack={() => setView("result")}
      onPlayAgain={startGame}
    />
  );
}
