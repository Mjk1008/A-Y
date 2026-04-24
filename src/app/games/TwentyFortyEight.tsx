"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type Grid = (number | null)[][];

const SIZE = 4;

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
  let g = emptyGrid();
  g = addRandom(g);
  g = addRandom(g);
  return g;
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const nums = row.filter(Boolean) as number[];
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2);
      score += nums[i] * 2;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged.map((v) => v || null), score };
}

type Dir = "left" | "right" | "up" | "down";

function move(grid: Grid, dir: Dir): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map((row) => [...row]) as Grid;
  let totalScore = 0;
  let moved = false;

  const rotate = (g: Grid): Grid =>
    Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => g[SIZE - 1 - c][r])
    ) as Grid;

  // normalize: always slide left
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

function hasWon(grid: Grid) {
  return grid.some((row) => row.some((v) => v === 2048));
}

function isGameOver(grid: Grid) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return false;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return false;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2:    { bg: "#374151", text: "#e5e7eb" },
  4:    { bg: "#4b5563", text: "#f3f4f6" },
  8:    { bg: "#c2410c", text: "#fff" },
  16:   { bg: "#b45309", text: "#fff" },
  32:   { bg: "#dc2626", text: "#fff" },
  64:   { bg: "#b91c1c", text: "#fff" },
  128:  { bg: "#ca8a04", text: "#fff" },
  256:  { bg: "#a16207", text: "#fff" },
  512:  { bg: "#d97706", text: "#fff" },
  1024: { bg: "#059669", text: "#fff" },
  2048: { bg: "#34d399", text: "#022c22" },
};

function tileStyle(val: number | null) {
  if (!val) return { background: "rgba(255,255,255,0.04)", color: "transparent" };
  const c = TILE_COLORS[val] ?? { bg: "#34d399", text: "#022c22" };
  return { background: c.bg, color: c.text };
}

function fontSize(val: number | null) {
  if (!val) return "1rem";
  if (val >= 1000) return "1rem";
  if (val >= 100) return "1.2rem";
  return "1.4rem";
}

export function TwentyFortyEightGame() {
  const [grid, setGrid] = useState<Grid>(init);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("2048-best") ?? "0", 10);
  });
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [wonDismissed, setWonDismissed] = useState(false);

  // Refs so event handlers always read the latest state without re-registering
  const gridRef = useRef<Grid>(grid);
  const scoreRef = useRef<number>(score);
  const bestRef = useRef<number>(best);
  const wonRef = useRef<boolean>(won);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { bestRef.current = best; }, [best]);
  useEffect(() => { wonRef.current = won; }, [won]);

  const handleDir = useCallback((dir: Dir) => {
    const currentGrid = gridRef.current;
    const currentScore = scoreRef.current;
    const { grid: next, score: gained, moved } = move(currentGrid, dir);
    if (!moved) return;
    const withNew = addRandom(next);
    const newScore = currentScore + gained;
    setGrid(withNew);
    setScore(newScore);
    if (newScore > bestRef.current) {
      setBest(newScore);
      localStorage.setItem("2048-best", String(newScore));
    }
    if (!wonRef.current && hasWon(withNew)) setWon(true);
    if (isGameOver(withNew)) setOver(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      if (map[e.key]) {
        e.preventDefault();
        handleDir(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDir]);

  // Touch swipe
  const touchStart = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current.x = e.touches[0].clientX;
    touchStart.current.y = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      handleDir(dx > 0 ? "right" : "left");
    } else {
      handleDir(dy > 0 ? "down" : "up");
    }
  };

  const restart = () => {
    setGrid(init());
    setScore(0);
    setOver(false);
    setWon(false);
    setWonDismissed(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Scores */}
      <div className="flex gap-4">
        {[
          { label: "امتیاز", val: score },
          { label: "بهترین", val: best },
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
        className="relative p-2 rounded-2xl"
        style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)", touchAction: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gap: 8,
            width: 280,
          }}
        >
          {grid.flat().map((val, i) => (
            <div
              key={i}
              style={{
                ...tileStyle(val),
                width: 60,
                height: 60,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: fontSize(val),
                transition: "background 0.1s",
              }}
            >
              {val ?? ""}
            </div>
          ))}
        </div>

        {/* Overlays */}
        {(over || (won && !wonDismissed)) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ background: "rgba(2,3,6,0.88)" }}
          >
            {won && !over && (
              <p className="text-2xl font-bold" style={{ color: "#34d399" }}>برنده شدی! 🎉</p>
            )}
            {over && (
              <p className="text-xl font-bold" style={{ color: "#ef4444" }}>بازی تموم شد!</p>
            )}
            <p style={{ color: "rgba(255,255,255,0.6)" }}>
              امتیاز: <span style={{ color: "#34d399", fontWeight: "bold" }}>{score}</span>
            </p>
            {won && !over && (
              <button
                onClick={() => setWonDismissed(true)}
                className="px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                style={{ background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399" }}
              >
                ادامه بازی
              </button>
            )}
            <button
              onClick={restart}
              className="px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399" }}
            >
              شروع مجدد
            </button>
          </div>
        )}
      </div>

      <button
        onClick={restart}
        className="text-xs px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
        style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        شروع مجدد
      </button>
    </div>
  );
}
