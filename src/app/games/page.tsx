"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SnakeGame } from "./Snake";
import { TwentyFortyEightGame } from "./TwentyFortyEight";
import { FlappyGame } from "./Flappy";
import { MemoryGame } from "./Memory";
import { BottomNav } from "@/app/components/BottomNav";

type GameId = "snake" | "2048" | "flappy" | "memory";

interface GameConfig {
  id: GameId;
  label: string;
  emoji: string;
  tag: string;
  tagline: string;
  playtime: string;
  bestScore: number;
  accent: string;
}

const GAMES: GameConfig[] = [
  {
    id: "snake",
    label: "مار",
    emoji: "🐍",
    tag: "کلاسیک",
    tagline: "غذا بخور، بزرگ شو، به دیوار نخور.",
    playtime: "۲ د",
    bestScore: 47,
    accent: "#34d399",
  },
  {
    id: "2048",
    label: "۲۰۴۸",
    emoji: "🔢",
    tag: "معمایی",
    tagline: "کاشی‌ها رو ترکیب کن تا به ۲۰۴۸ برسی.",
    playtime: "۵ د",
    bestScore: 4728,
    accent: "#fcd34d",
  },
  {
    id: "flappy",
    label: "فلپی",
    emoji: "🐦",
    tag: "واکنشی",
    tagline: "بال بزن، از لوله‌ها رد شو.",
    playtime: "۱ د",
    bestScore: 23,
    accent: "#60a5fa",
  },
  {
    id: "memory",
    label: "حافظه",
    emoji: "🃏",
    tag: "حافظه",
    tagline: "جفت‌های مثل هم رو پیدا کن.",
    playtime: "۳ د",
    bestScore: 42,
    accent: "#c4b5fd",
  },
];

function GameComponent({ id }: { id: GameId }) {
  if (id === "snake") return <SnakeGame />;
  if (id === "2048") return <TwentyFortyEightGame />;
  if (id === "flappy") return <FlappyGame />;
  return <MemoryGame />;
}

function GameCard({
  game,
  onPlay,
}: {
  game: GameConfig;
  onPlay: () => void;
}) {
  const { accent, emoji, tag, bestScore, label, playtime, tagline } = game;

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
        {/* Emoji */}
        <span
          style={{
            fontSize: 38,
            filter: `drop-shadow(0 0 10px ${accent}99)`,
            zIndex: 2,
            position: "relative",
          }}
        >
          {emoji}
        </span>

        {/* Corner pixel dots */}
        {[
          { top: 6, right: 6 },
          { top: 6, left: 6 },
          { bottom: 20, right: 6 },
          { bottom: 20, left: 6 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 2,
              height: 2,
              borderRadius: 0,
              background: accent,
              opacity: 0.6,
              ...pos,
            }}
          />
        ))}

        {/* Tag badge top-right */}
        <div
          style={{
            position: "absolute",
            top: 7,
            left: 7,
            background: `${accent}22`,
            border: `1px solid ${accent}55`,
            borderRadius: 20,
            padding: "2px 7px",
            fontFamily: "monospace",
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            zIndex: 3,
          }}
        >
          {tag}
        </div>

        {/* Best score badge */}
        <div
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontFamily: "monospace",
            fontSize: 9,
            color: accent,
            opacity: 0.9,
            zIndex: 3,
          }}
        >
          <span>👑</span>
          <span>{bestScore}</span>
        </div>

        {/* Horizon line */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
            zIndex: 2,
          }}
        />

        {/* Ground strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: `repeating-linear-gradient(90deg, ${accent}18 0px, ${accent}18 4px, transparent 4px, transparent 8px)`,
            zIndex: 2,
          }}
        />
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "12px 12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
        }}
      >
        {/* Title + playtime */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#e8efea" }}>{label}</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9.5,
              color: "rgba(232,239,234,0.45)",
            }}
          >
            {playtime}
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 10.5,
            color: "rgba(232,239,234,0.55)",
            lineHeight: 1.5,
            minHeight: 30,
            margin: 0,
          }}
        >
          {tagline}
        </p>

        {/* Play button */}
        <button
          style={{
            width: "100%",
            borderRadius: 11,
            background: accent,
            color: "#04110a",
            fontWeight: 800,
            fontSize: 12,
            border: "none",
            padding: "7px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            cursor: "pointer",
            marginTop: "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <span>▶</span>
          <span>شروع</span>
        </button>
      </div>
    </div>
  );
}

function StatsStrip({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        borderRadius: 14,
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {stats.map(({ label, value }, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            padding: "10px 6px",
            borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <div style={{ fontSize: 9, color: "rgba(232,239,234,0.45)", marginBottom: 3 }}>
            {label}
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#e8efea" }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

export default function GamesPage() {
  const [view, setView] = useState<"hub" | "playing">("hub");
  const [activeGame, setActiveGame] = useState<GameId>("snake");

  const activeConfig = GAMES.find((g) => g.id === activeGame)!;

  function enterGame(id: GameId) {
    setActiveGame(id);
    setView("playing");
  }

  if (view === "hub") {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100svh",
          background: "#020306",
          color: "#e8efea",
          paddingBottom: 96,
        }}
      >
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(2,3,6,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
            }}
          >
            <ArrowRight size={16} />
            <span>داشبورد</span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#34d399",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            <span>⚡</span>
            <span>بازی‌ها</span>
          </div>

          <div style={{ width: 80 }} />
        </header>

        <div style={{ padding: "24px 16px 0" }}>
          {/* Hero text */}
          <h1
            style={{
              fontWeight: 900,
              fontSize: 26,
              margin: 0,
              lineHeight: 1.3,
              color: "#e8efea",
            }}
          >
            ذهنت رو استراحت بده.
          </h1>
          <p
            style={{
              fontSize: 12,
              opacity: 0.55,
              margin: "6px 0 20px",
              lineHeight: 1.6,
            }}
          >
            چهار بازی کوتاه و خوش‌مزه برای خستگی‌های کوچیک.
          </p>

          {/* Stats strip */}
          <StatsStrip
            stats={[
              { label: "کل بازی‌ها", value: "۴۳۵" },
              { label: "بهترین سری", value: "۷" },
              { label: "این هفته", value: "۱۸" },
            ]}
          />

          {/* Game cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >
            {GAMES.map((game) => (
              <GameCard key={game.id} game={game} onPlay={() => enterGame(game.id)} />
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Playing view
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: "#020306",
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 96,
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(2,3,6,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <button
            onClick={() => setView("hub")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <ArrowRight size={16} />
            <span>بازی‌ها</span>
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
              fontSize: 15,
              color: activeConfig.accent,
            }}
          >
            <span>{activeConfig.emoji}</span>
            <span>{activeConfig.label}</span>
          </div>

          <div style={{ width: 80 }} />
        </div>

        {/* Score strip */}
        <div style={{ padding: "0 16px 10px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderRadius: 12,
              overflow: "hidden",
              background: `${activeConfig.accent}0d`,
              border: `1px solid ${activeConfig.accent}30`,
            }}
          >
            {[
              { label: "امتیاز", value: "۰" },
              { label: "بهترین", value: String(activeConfig.bestScore) },
              { label: "سری", value: "۰" },
            ].map(({ label, value }, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  borderRight: i < 2 ? `1px solid ${activeConfig.accent}22` : "none",
                }}
              >
                <div style={{ fontSize: 8.5, color: "rgba(232,239,234,0.40)", marginBottom: 2 }}>
                  {label}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    color: activeConfig.accent,
                    fontFamily: "monospace",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 16px 12px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {GAMES.map((game) => {
            const isActive = game.id === activeGame;
            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: isActive
                    ? `1px solid ${game.accent}55`
                    : "1px solid rgba(255,255,255,0.06)",
                  background: isActive
                    ? `${game.accent}1a`
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? game.accent : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <span>{game.emoji}</span>
                <span>{game.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Game component */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <GameComponent id={activeGame} />
      </main>

      <BottomNav />
    </div>
  );
}
