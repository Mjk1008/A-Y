"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const EMOJIS = ["🤖", "🎯", "🚀", "💡", "⚡", "🎮", "🌟", "💎"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards() {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

type Card = ReturnType<typeof createCards>[number];

function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  return elapsed;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const elapsed = useTimer(started && !won);

  const restart = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setStarted(false);
  };

  const flip = useCallback(
    (id: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.matched || card.flipped) return;

      if (!started) setStarted(true);

      const newFlipped = [...flipped, id];
      const newCards = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
      setCards(newCards);
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);

        const [a, b] = newFlipped.map((fid) => newCards.find((c) => c.id === fid)!);
        if (a.emoji === b.emoji) {
          // match
          setTimeout(() => {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
              );
              if (updated.every((c) => c.matched)) setWon(true);
              return updated;
            });
            setFlipped([]);
            setLocked(false);
          }, 400);
        } else {
          // mismatch — flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
              )
            );
            setFlipped([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [cards, flipped, locked, started]
  );

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Stats */}
      <div className="flex gap-4">
        {[
          { label: "حرکت", val: moves },
          { label: "زمان", val: fmt(elapsed) },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="px-4 py-2 rounded-xl text-center min-w-[80px]"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}
          >
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
            <div className="text-lg font-bold" style={{ color: "#34d399" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          padding: 12,
          borderRadius: 16,
          background: "rgba(52,211,153,0.03)",
          border: "1px solid rgba(52,211,153,0.12)",
        }}
      >
        {cards.map((card) => {
          const isVisible = card.flipped || card.matched;
          return (
            <div
              key={card.id}
              onClick={() => flip(card.id)}
              style={{
                width: 64,
                height: 64,
                cursor: card.matched ? "default" : "pointer",
                perspective: 600,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.35s ease",
                }}
              >
                {/* Back (hidden) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    borderRadius: 10,
                    background: card.matched
                      ? "rgba(52,211,153,0.15)"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${card.matched ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  ✦
                </div>
                {/* Front (emoji) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 10,
                    background: card.matched
                      ? "rgba(52,211,153,0.18)"
                      : "rgba(52,211,153,0.08)",
                    border: `1px solid ${card.matched ? "rgba(52,211,153,0.5)" : "rgba(52,211,153,0.25)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  {card.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Win overlay (below grid, not absolute so grid stays visible) */}
      {won && (
        <div
          className="flex flex-col items-center gap-3 p-6 rounded-2xl"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#34d399" }}>آفرین! برنده شدی 🎉</p>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            {moves} حرکت در {fmt(elapsed)}
          </p>
          <button
            onClick={restart}
            className="px-6 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            style={{ background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399" }}
          >
            دوباره بازی کن
          </button>
        </div>
      )}

      {!won && (
        <button
          onClick={restart}
          className="text-xs px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
          style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          شروع مجدد
        </button>
      )}
    </div>
  );
}
