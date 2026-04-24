"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ACCENT = "#c4b5fd";
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
    id: i, emoji, flipped: false, matched: false,
  }));
}

type Card = ReturnType<typeof createCards>[number];

function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) { ref.current = setInterval(() => setElapsed((e) => e + 1), 1000); }
    else { if (ref.current) clearInterval(ref.current); }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  return elapsed;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function getStars(moves: number): number {
  if (moves <= 12) return 3;
  if (moves <= 18) return 2;
  return 1;
}

export function MemoryGame({ onGameOver }: { onGameOver?: (score: number) => void } = {}) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [flashIds, setFlashIds] = useState<Set<number>>(new Set());

  const elapsed = useTimer(started && !won);

  useEffect(() => {
    if (won) {
      const finalScore = Math.max(100, 1000 - moves * 15 - elapsed * 3);
      const t = setTimeout(() => onGameOver?.(finalScore), 1800);
      return () => clearTimeout(t);
    }
  }, [won, moves, elapsed, onGameOver]);

  const restart = () => {
    setCards(createCards());
    setFlipped([]); setMoves(0); setLocked(false);
    setWon(false); setStarted(false);
    setMatchedIds(new Set()); setFlashIds(new Set());
  };

  const flip = useCallback((id: number) => {
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
        // Match!
        setTimeout(() => {
          // Flash matched cards
          setFlashIds(new Set([a.id, b.id]));
          setTimeout(() => setFlashIds(new Set()), 600);

          setCards((prev) => {
            const updated = prev.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
            );
            if (updated.every((c) => c.matched)) setWon(true);
            return updated;
          });
          setMatchedIds((prev) => new Set([...prev, a.id, b.id]));
          setFlipped([]);
          setLocked(false);
        }, 350);
      } else {
        // Mismatch
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
  }, [cards, flipped, locked, started]);

  const totalPairs = EMOJIS.length;
  const foundPairs = matchedIds.size / 2;
  const stars = won ? getStars(moves) : 0;

  const CARD_SIZE = 62;
  const GAP = 8;
  const GRID_PAD = 10;
  const GRID_W = 4 * CARD_SIZE + 3 * GAP + GRID_PAD * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, userSelect: "none", width: "100%" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: GRID_W }}>
        {[
          { label: "حرکت", val: moves, accent: ACCENT },
          { label: "جفت", val: `${foundPairs}/${totalPairs}`, accent: "#a78bfa" },
          { label: "زمان", val: fmt(elapsed), accent: "rgba(196,181,253,0.7)" },
        ].map(({ label, val, accent }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.12)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{label}</div>
            <div style={{ fontWeight: 900, fontSize: 15, color: accent, fontFamily: "monospace" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: GRID_W, height: 4, borderRadius: 2, background: "rgba(196,181,253,0.10)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${ACCENT}, #a78bfa)`, width: `${(foundPairs / totalPairs) * 100}%`, transition: "width 0.3s ease" }} />
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(4, ${CARD_SIZE}px)`,
          gap: GAP,
          padding: GRID_PAD,
          borderRadius: 18,
          background: "rgba(196,181,253,0.04)",
          border: "1px solid rgba(196,181,253,0.10)",
          boxShadow: "0 0 24px rgba(196,181,253,0.05)",
        }}
      >
        {cards.map((card) => {
          const isVisible = card.flipped || card.matched;
          const isFlashing = flashIds.has(card.id);
          return (
            <div
              key={card.id}
              onClick={() => flip(card.id)}
              style={{ width: CARD_SIZE, height: CARD_SIZE, cursor: card.matched ? "default" : "pointer", perspective: 700 }}
            >
              <div
                style={{
                  width: "100%", height: "100%",
                  position: "relative", transformStyle: "preserve-3d",
                  transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Card back */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 10,
                    background: "rgba(196,181,253,0.08)",
                    border: "1px solid rgba(196,181,253,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Decorative pattern on card back */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, opacity: 0.4 }}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: i === 4 ? ACCENT : "rgba(196,181,253,0.5)" }} />
                    ))}
                  </div>
                </div>

                {/* Card front */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 10,
                    background: card.matched
                      ? (isFlashing ? "rgba(196,181,253,0.30)" : "rgba(196,181,253,0.16)")
                      : "rgba(196,181,253,0.08)",
                    border: `1px solid ${card.matched
                      ? (isFlashing ? "rgba(196,181,253,0.6)" : "rgba(196,181,253,0.38)")
                      : "rgba(196,181,253,0.22)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28,
                    transition: "background 0.2s, border-color 0.2s",
                    boxShadow: card.matched ? "0 0 10px rgba(196,181,253,0.20)" : "none",
                  }}
                >
                  {card.emoji}
                  {/* Matched star sparkle */}
                  {card.matched && (
                    <div style={{ position: "absolute", top: 4, right: 4, fontSize: 8, opacity: 0.7 }}>✦</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Win panel */}
      {won && (
        <div
          style={{
            width: "100%", maxWidth: GRID_W,
            borderRadius: 18, padding: "20px 16px",
            background: "rgba(196,181,253,0.08)",
            border: "1px solid rgba(196,181,253,0.25)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}
        >
          <div style={{ fontSize: 28 }}>
            {stars === 3 ? "🌟🌟🌟" : stars === 2 ? "⭐⭐" : "⭐"}
          </div>
          <div style={{ fontWeight: 900, fontSize: 18, color: ACCENT }}>آفرین! برنده شدی!</div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>حرکت</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: ACCENT, fontFamily: "monospace" }}>{moves}</div>
            </div>
            <div style={{ width: 1, background: "rgba(196,181,253,0.15)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>زمان</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "#a78bfa", fontFamily: "monospace" }}>{fmt(elapsed)}</div>
            </div>
          </div>
          <button
            onClick={restart}
            style={{ padding: "10px 28px", borderRadius: 12, background: ACCENT, color: "#1a0040", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            دوباره بازی 🃏
          </button>
        </div>
      )}

      {/* Restart button */}
      {!won && (
        <button
          onClick={restart}
          style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 14px", cursor: "pointer" }}
        >
          شروع مجدد
        </button>
      )}
    </div>
  );
}
