"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 20;
const COLS = 15;
const ROWS = 15;
const W = CELL * COLS;
const H = CELL * ROWS;
const TICK_BASE = 130;
const TICK_MIN = 60;
const ACCENT = "#34d399";

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };

function rand(max: number) { return Math.floor(Math.random() * max); }
function newFood(snake: Pt[]): Pt {
  let pt: Pt;
  do { pt = { x: rand(COLS), y: rand(ROWS) }; }
  while (snake.some((s) => s.x === pt.x && s.y === pt.y));
  return pt;
}
function getBest(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("snake-best") ?? "0", 10);
}
function setBest(v: number) {
  if (typeof window !== "undefined") localStorage.setItem("snake-best", String(v));
}

export function SnakeGame({ onGameOver }: { onGameOver?: (score: number) => void } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({
    snake: [{ x: 7, y: 7 }] as Pt[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 11, y: 7 } as Pt,
    score: 0,
    running: false,
    over: false,
  });
  const [score, setScore] = useState(0);
  const [best, setBestState] = useState(getBest);
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle");
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const flashRef = useRef(0); // food-eat flash frame count

  useEffect(() => {
    if (phase === "over") {
      const t = setTimeout(() => onGameOver?.(score), 1800);
      return () => clearTimeout(t);
    }
  }, [phase, score, onGameOver]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = "#060d09";
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const gx = x * CELL + CELL / 2;
        const gy = y * CELL + CELL / 2;
        ctx.fillStyle = "rgba(52,211,153,0.06)";
        ctx.fillRect(gx - 1, gy - 1, 2, 2);
      }
    }

    // Flash overlay on eat
    if (flashRef.current > 0) {
      ctx.fillStyle = `rgba(52,211,153,${flashRef.current * 0.025})`;
      ctx.fillRect(0, 0, W, H);
      flashRef.current--;
    }

    // Food — pulsing apple pixel art
    const fx = s.food.x * CELL;
    const fy = s.food.y * CELL;
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(fx + 3, fy + 3, CELL - 6, CELL - 6, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
    // highlight
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(fx + 5, fy + 5, 3, 3);

    // Snake — head glows, body fades
    s.snake.forEach((seg, i) => {
      const isHead = i === 0;
      const progress = 1 - i / s.snake.length;
      const alpha = isHead ? 1 : 0.35 + 0.65 * progress;

      if (isHead) {
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 16;
      }
      ctx.fillStyle = isHead
        ? ACCENT
        : `rgba(52,211,153,${alpha.toFixed(2)})`;

      const r = isHead ? 5 : 3;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, r);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Head eyes
      if (isHead) {
        ctx.fillStyle = "#060d09";
        const ex = s.dir === "LEFT" ? -3 : s.dir === "RIGHT" ? 3 : 0;
        const ey = s.dir === "UP" ? -3 : s.dir === "DOWN" ? 3 : 0;
        ctx.beginPath();
        ctx.arc(seg.x * CELL + CELL / 2 + ex - 2, seg.y * CELL + CELL / 2 + ey - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(seg.x * CELL + CELL / 2 + ex + 2, seg.y * CELL + CELL / 2 + ey + 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, []);

  const tick = useCallback((ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    const tickInterval = Math.max(TICK_MIN, TICK_BASE - s.score * 3);

    if (ts - lastTickRef.current >= tickInterval) {
      lastTickRef.current = ts;
      s.dir = s.nextDir;
      const head = s.snake[0];
      let nx = head.x, ny = head.y;
      if (s.dir === "UP") ny--;
      if (s.dir === "DOWN") ny++;
      if (s.dir === "LEFT") nx--;
      if (s.dir === "RIGHT") nx++;

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS ||
        s.snake.some((seg) => seg.x === nx && seg.y === ny)) {
        s.running = false;
        s.over = true;
        setPhase("over");
        draw();
        return;
      }

      const ate = nx === s.food.x && ny === s.food.y;
      s.snake = [{ x: nx, y: ny }, ...s.snake];
      if (!ate) {
        s.snake.pop();
      } else {
        s.food = newFood(s.snake);
        s.score++;
        flashRef.current = 6;
        setScore(s.score);
        if (s.score > getBest()) {
          setBest(s.score);
          setBestState(s.score);
        }
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 7, y: 7 }];
    s.dir = "RIGHT"; s.nextDir = "RIGHT";
    s.food = newFood(s.snake);
    s.score = 0; s.running = true; s.over = false;
    setScore(0); setPhase("running");
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
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      if (map[e.key]) { e.preventDefault(); setDir(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir]);

  useEffect(() => {
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current.x = e.touches[0].clientX;
    touchRef.current.y = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? "RIGHT" : "LEFT");
    else setDir(dy > 0 ? "DOWN" : "UP");
  };

  const DPad = () => (
    <div dir="ltr" style={{ display: "grid", gridTemplateColumns: "48px 48px 48px", gridTemplateRows: "48px 48px 48px", gap: 4, userSelect: "none" }}>
      {/* UP */}
      <div />
      <DPadBtn onPress={() => setDir("UP")} label="↑" />
      <div />
      {/* LEFT CENTER RIGHT */}
      <DPadBtn onPress={() => setDir("LEFT")} label="←" />
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(52,211,153,0.3)", display: "block" }} />
      </div>
      <DPadBtn onPress={() => setDir("RIGHT")} label="→" />
      {/* DOWN */}
      <div />
      <DPadBtn onPress={() => setDir("DOWN")} label="↓" />
      <div />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, userSelect: "none", width: "100%" }}>
      {/* Score bar */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: W }}>
        {[
          { label: "امتیاز", val: score, accent: ACCENT },
          { label: "بهترین", val: best, accent: "#6ee7b7" },
          { label: "سرعت", val: phase === "running" ? `${Math.round((TICK_BASE - Math.max(TICK_MIN, TICK_BASE - score * 3)) / TICK_BASE * 100 + 50)}%` : "--", accent: "rgba(52,211,153,0.6)" },
        ].map(({ label, val, accent }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2, fontFamily: "monospace" }}>{label}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: accent, fontFamily: "monospace" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={canvasWrapperRef}
        style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(52,211,153,0.18)", boxShadow: "0 0 24px rgba(52,211,153,0.08)", touchAction: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", touchAction: "none", maxWidth: "100%", height: "auto" }} />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(2,3,6,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 36 }}>🐍</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT }}>مار</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.7 }}>
              غذا بخور، بزرگ شو، به دیوار نخور<br/>
              <span style={{ opacity: 0.6 }}>از D-Pad یا کیبورد کنترل کن</span>
            </div>
            <button onClick={start} style={{ padding: "10px 28px", borderRadius: 12, background: ACCENT, color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
              شروع بازی
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(2,3,6,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>💀</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#ef4444" }}>بازی تموم شد</div>
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>امتیاز</div>
                <div style={{ fontWeight: 900, fontSize: 26, color: ACCENT, fontFamily: "monospace" }}>{score}</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>بهترین</div>
                <div style={{ fontWeight: 900, fontSize: 26, color: "#6ee7b7", fontFamily: "monospace" }}>{best}</div>
              </div>
            </div>
            {score >= best && score > 0 && (
              <div style={{ fontSize: 11, color: "#fcd34d", fontWeight: 700 }}>🏆 رکورد جدید!</div>
            )}
            <button onClick={start} style={{ marginTop: 8, padding: "10px 28px", borderRadius: 12, background: ACCENT, color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
              دوباره بازی
            </button>
          </div>
        )}
      </div>

      {/* D-Pad */}
      {phase === "running" && <DPad />}

      {/* Restart when idle/over — subtle */}
      {phase !== "running" && phase !== "idle" && (
        <button onClick={start} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}>
          شروع مجدد
        </button>
      )}
    </div>
  );
}

function DPadBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      style={{
        width: 48, height: 48, borderRadius: 12,
        background: "rgba(52,211,153,0.10)",
        border: "1px solid rgba(52,211,153,0.22)",
        color: "#34d399", fontSize: 18, fontWeight: 700,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
      }}
    >
      {label}
    </button>
  );
}
