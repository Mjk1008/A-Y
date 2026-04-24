"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 20;
const COLS = 16;
const ROWS = 16;
const W = CELL * COLS;
const H = CELL * ROWS;
const TICK = 120;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };

function rand(max: number) {
  return Math.floor(Math.random() * max);
}

function newFood(snake: Pt[]): Pt {
  let pt: Pt;
  do {
    pt = { x: rand(COLS), y: rand(ROWS) };
  } while (snake.some((s) => s.x === pt.x && s.y === pt.y));
  return pt;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const stateRef = useRef({
    snake: [{ x: 8, y: 8 }],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 11, y: 8 },
    score: 0,
    running: false,
    over: false,
  });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, W, H);

    // grid dots
    ctx.fillStyle = "rgba(52,211,153,0.07)";
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // food
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake
    s.snake.forEach((seg, i) => {
      const alpha = i === 0 ? 1 : 0.6 + 0.4 * (1 - i / s.snake.length);
      ctx.fillStyle = i === 0 ? "#34d399" : `rgba(52,211,153,${alpha})`;
      if (i === 0) {
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 10;
      }
      const r = i === 0 ? CELL / 2 - 1 : CELL / 2 - 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, r);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  const tick = useCallback((ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;

    if (ts - lastTickRef.current >= TICK) {
      lastTickRef.current = ts;
      s.dir = s.nextDir;

      const head = s.snake[0];
      let nx = head.x;
      let ny = head.y;
      if (s.dir === "UP") ny--;
      if (s.dir === "DOWN") ny++;
      if (s.dir === "LEFT") nx--;
      if (s.dir === "RIGHT") nx++;

      // wall collision
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        s.running = false;
        s.over = true;
        setOver(true);
        draw();
        return;
      }
      // self collision
      if (s.snake.some((seg) => seg.x === nx && seg.y === ny)) {
        s.running = false;
        s.over = true;
        setOver(true);
        draw();
        return;
      }

      const newHead = { x: nx, y: ny };
      const ate = nx === s.food.x && ny === s.food.y;
      s.snake = [newHead, ...s.snake];
      if (!ate) s.snake.pop();
      else {
        s.food = newFood(s.snake);
        s.score++;
        setScore(s.score);
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 8, y: 8 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = newFood(s.snake);
    s.score = 0;
    s.running = true;
    s.over = false;
    setScore(0);
    setOver(false);
    setStarted(true);
    lastTickRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const setDir = useCallback((d: Dir) => {
    const s = stateRef.current;
    if (!s.running) return;
    const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opp[d] !== s.dir) s.nextDir = d;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
      };
      if (map[e.key]) {
        e.preventDefault();
        setDir(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir]);

  useEffect(() => {
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current.x = e.touches[0].clientX;
    touchStartRef.current.y = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDir(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      setDir(dy > 0 ? "DOWN" : "UP");
    }
  }, [setDir]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Score */}
      <div className="flex items-center gap-3 text-sm" style={{ color: "#34d399" }}>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>امتیاز</span>
        <span className="text-xl font-bold">{score}</span>
      </div>

      {/* Canvas wrapper */}
      <div className="relative" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(52,211,153,0.2)" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: "block", touchAction: "none" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />

        {/* Overlay */}
        {(!started || over) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: "rgba(2,3,6,0.85)" }}
          >
            {over && (
              <p className="text-lg font-bold" style={{ color: "#ef4444" }}>
                بازی تموم شد!
              </p>
            )}
            {over && (
              <p style={{ color: "rgba(255,255,255,0.6)" }}>
                امتیاز: <span style={{ color: "#34d399", fontWeight: "bold" }}>{score}</span>
              </p>
            )}
            <button
              onClick={start}
              className="px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: "rgba(52,211,153,0.15)",
                border: "1px solid #34d399",
                color: "#34d399",
              }}
            >
              {over ? "شروع مجدد" : "شروع بازی"}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
