"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type Grid = (number | null)[][];
const SIZE = 4;
const ACCENT = "#fcd34d";

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}
function addRandom(grid: Grid): Grid {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) empty.push([r, c]);
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map((row) => [...row]) as Grid;
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}
function init(): Grid {
  let g = emptyGrid(); g = addRandom(g); g = addRandom(g); return g;
}
function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const nums = row.filter(Boolean) as number[];
  let score = 0; const merged: number[] = []; let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2); score += nums[i] * 2; i += 2;
    } else { merged.push(nums[i]); i++; }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged.map((v) => v || null), score };
}
type Dir = "left" | "right" | "up" | "down";
function move(grid: Grid, dir: Dir): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map((row) => [...row]) as Grid;
  let totalScore = 0; let moved = false;
  const rotate = (g: Grid): Grid =>
    Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => g[SIZE - 1 - c][r])) as Grid;
  if (dir === "right") g = g.map((row) => [...row].reverse()) as Grid;
  if (dir === "up") g = rotate(rotate(rotate(g)));
  if (dir === "down") g = rotate(g);
  const next = g.map((row) => {
    const { row: newRow, score } = slideRow(row);
    totalScore += score;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  }) as Grid;
  let result = next;
  if (dir === "right") result = result.map((row) => [...row].reverse()) as Grid;
  if (dir === "up") result = rotate(result);
  if (dir === "down") result = rotate(rotate(rotate(result)));
  return { grid: result, score: totalScore, moved };
}
function hasWon(grid: Grid) { return grid.some((row) => row.some((v) => v === 2048)); }
function isGameOver(grid: Grid) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return false;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return false;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}
function getBest() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("2048-best") ?? "0", 10);
}

// Tile color palette — gold theme
function tileStyle(val: number | null): { bg: string; text: string; shadow?: string } {
  if (!val) return { bg: "rgba(255,255,255,0.04)", text: "transparent" };
  const map: Record<number, { bg: string; text: string; shadow?: string }> = {
    2:    { bg: "#2a2512", text: "#fef3c7" },
    4:    { bg: "#3b2f0a", text: "#fde68a" },
    8:    { bg: "#78350f", text: "#fff" },
    16:   { bg: "#92400e", text: "#fff" },
    32:   { bg: "#b45309", text: "#fff" },
    64:   { bg: "#d97706", text: "#fff" },
    128:  { bg: "#f59e0b", text: "#1c1000", shadow: "0 0 8px rgba(245,158,11,0.4)" },
    256:  { bg: "#fbbf24", text: "#1c1000", shadow: "0 0 10px rgba(251,191,36,0.45)" },
    512:  { bg: "#fcd34d", text: "#1c1000", shadow: "0 0 12px rgba(252,211,77,0.5)" },
    1024: { bg: "#fde68a", text: "#1c1000", shadow: "0 0 16px rgba(253,230,138,0.55)" },
    2048: { bg: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #fbbf24 100%)", text: "#0a0700", shadow: "0 0 24px rgba(252,211,77,0.7)" },
  };
  return map[val] ?? { bg: "#fcd34d", text: "#0a0700", shadow: "0 0 20px rgba(252,211,77,0.6)" };
}
function fontSize(val: number | null) {
  if (!val) return "1rem";
  if (val >= 1024) return "0.85rem";
  if (val >= 100) return "1.1rem";
  return "1.3rem";
}

export function TwentyFortyEightGame({ onGameOver }: { onGameOver?: (score: number) => void } = {}) {
  const [grid, setGrid] = useState<Grid>(init);
  const [score, setScore] = useState(0);
  const [best, setBestState] = useState(getBest);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [wonDismissed, setWonDismissed] = useState(false);
  const [popScore, setPopScore] = useState<number | null>(null);

  const gridRef = useRef<Grid>(grid);
  const scoreRef = useRef(score);
  const bestRef = useRef(best);
  const wonRef = useRef(won);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { bestRef.current = best; }, [best]);
  useEffect(() => { wonRef.current = won; }, [won]);

  useEffect(() => {
    if (over) {
      const t = setTimeout(() => onGameOver?.(score), 1800);
      return () => clearTimeout(t);
    }
  }, [over, score, onGameOver]);

  const handleDir = useCallback((dir: Dir) => {
    const { grid: next, score: gained, moved } = move(gridRef.current, dir);
    if (!moved) return;
    const withNew = addRandom(next);
    const newScore = scoreRef.current + gained;
    setGrid(withNew);
    setScore(newScore);
    if (gained > 0) {
      setPopScore(gained);
      setTimeout(() => setPopScore(null), 800);
    }
    if (newScore > bestRef.current) {
      setBestState(newScore);
      localStorage.setItem("2048-best", String(newScore));
    }
    if (!wonRef.current && hasWon(withNew)) setWon(true);
    if (isGameOver(withNew)) setOver(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (map[e.key]) { e.preventDefault(); handleDir(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDir]);

  const touchStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current.x = e.touches[0].clientX;
    touchStart.current.y = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) handleDir(dx > 0 ? "left" : "right");
    else handleDir(dy > 0 ? "down" : "up");
  };

  const restart = () => {
    setGrid(init()); setScore(0); setOver(false); setWon(false); setWonDismissed(false); setPopScore(null);
  };

  const TILE_SIZE = 64;
  const GAP = 8;
  const GRID_PAD = 10;
  const GRID_W = SIZE * TILE_SIZE + (SIZE - 1) * GAP + GRID_PAD * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, userSelect: "none", width: "100%" }}>
      {/* Score row */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: GRID_W, alignItems: "center" }}>
        <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 10, background: "rgba(252,211,77,0.07)", border: "1px solid rgba(252,211,77,0.15)" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>امتیاز</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT, fontFamily: "monospace" }}>{score}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 10, background: "rgba(252,211,77,0.05)", border: "1px solid rgba(252,211,77,0.10)" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>بهترین</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: "#fde68a", fontFamily: "monospace" }}>{best}</div>
        </div>
        <button
          onClick={restart}
          style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(252,211,77,0.10)", border: "1px solid rgba(252,211,77,0.20)", color: ACCENT, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >
          ریست
        </button>
      </div>

      {/* Score popup */}
      <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {popScore && (
          <span style={{ color: ACCENT, fontWeight: 900, fontSize: 16, fontFamily: "monospace", animation: "none", opacity: 0.9 }}>
            +{popScore}
          </span>
        )}
      </div>

      {/* Grid */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          padding: GRID_PAD,
          borderRadius: 18,
          background: "rgba(252,211,77,0.05)",
          border: "1px solid rgba(252,211,77,0.14)",
          boxShadow: "0 0 30px rgba(252,211,77,0.06)",
          touchAction: "none",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, ${TILE_SIZE}px)`,
            gap: GAP,
          }}
        >
          {grid.flat().map((val, i) => {
            const style = tileStyle(val);
            return (
              <div
                key={i}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  borderRadius: 10,
                  background: style.bg,
                  color: style.text,
                  boxShadow: style.shadow ?? "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: fontSize(val),
                  fontFamily: "monospace",
                  transition: "background 0.08s, box-shadow 0.08s",
                  letterSpacing: val && val >= 100 ? "-0.02em" : "0",
                }}
              >
                {val ?? ""}
              </div>
            );
          })}
        </div>

        {/* Game over overlay */}
        {(over || (won && !wonDismissed)) && (
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: 18,
              background: "rgba(2,3,6,0.90)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 14,
            }}
          >
            {won && !over && (
              <>
                <div style={{ fontSize: 32 }}>🏆</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT }}>به ۲۰۴۸ رسیدی!</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>امتیاز: <span style={{ color: ACCENT, fontWeight: 800 }}>{score}</span></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setWonDismissed(true)} style={{ padding: "9px 18px", borderRadius: 11, background: ACCENT, color: "#0a0700", fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer" }}>
                    ادامه بده
                  </button>
                  <button onClick={restart} style={{ padding: "9px 18px", borderRadius: 11, background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.25)", color: ACCENT, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    شروع مجدد
                  </button>
                </div>
              </>
            )}
            {over && (
              <>
                <div style={{ fontSize: 28 }}>😔</div>
                <div style={{ fontWeight: 900, fontSize: 19, color: "#ef4444" }}>جا تموم شد!</div>
                <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>امتیاز</div>
                    <div style={{ fontWeight: 900, fontSize: 24, color: ACCENT, fontFamily: "monospace" }}>{score}</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>بهترین</div>
                    <div style={{ fontWeight: 900, fontSize: 24, color: "#fde68a", fontFamily: "monospace" }}>{best}</div>
                  </div>
                </div>
                <button onClick={restart} style={{ marginTop: 4, padding: "10px 28px", borderRadius: 12, background: ACCENT, color: "#0a0700", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
                  دوباره بازی
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Swipe hint */}
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", display: "flex", gap: 8, alignItems: "center" }}>
        <span>← → ↑ ↓</span>
        <span>کیبورد یا swipe</span>
      </div>
    </div>
  );
}
