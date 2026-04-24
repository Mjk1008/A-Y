"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CW = 320;
const CH = 560;
const BIRD_X = 70;
const BIRD_R = 14;
const GRAVITY = 0.45;
const FLAP = -8;
const PIPE_W = 50;
const PIPE_GAP = 140;
const PIPE_SPEED = 2.5;
const PIPE_INTERVAL = 1600; // ms

interface Pipe {
  x: number;
  topH: number;
  passed: boolean;
}

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    bird: { y: CH / 2, vy: 0 },
    pipes: [] as Pipe[],
    score: 0,
    running: false,
    over: false,
    lastPipe: 0,
    lastTs: 0,
  });
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle");
  const rafRef = useRef<number | null>(null);

  const spawnPipe = (now: number): Pipe => ({
    x: CW + PIPE_W,
    topH: 60 + Math.random() * (CH - PIPE_GAP - 120),
    passed: false,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = state.current;

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, CH);
    sky.addColorStop(0, "#020c14");
    sky.addColorStop(1, "#041824");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // stars
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    // static seed-based stars
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 + 50) % CW);
      const sy = ((i * 97 + 30) % (CH * 0.7));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // pipes
    s.pipes.forEach((p) => {
      const gr1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      gr1.addColorStop(0, "#065f46");
      gr1.addColorStop(0.5, "#34d399");
      gr1.addColorStop(1, "#065f46");
      ctx.fillStyle = gr1;
      // top pipe
      ctx.beginPath();
      ctx.roundRect(p.x, 0, PIPE_W, p.topH, [0, 0, 8, 8]);
      ctx.fill();
      // top cap
      ctx.fillStyle = "#34d399";
      ctx.fillRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20);

      // bottom pipe
      const botY = p.topH + PIPE_GAP;
      ctx.fillStyle = gr1;
      ctx.beginPath();
      ctx.roundRect(p.x, botY, PIPE_W, CH - botY, [8, 8, 0, 0]);
      ctx.fill();
      // bottom cap
      ctx.fillStyle = "#34d399";
      ctx.fillRect(p.x - 4, botY, PIPE_W + 8, 20);
    });

    // ground
    ctx.fillStyle = "#065f46";
    ctx.fillRect(0, CH - 20, CW, 20);
    ctx.fillStyle = "#34d399";
    ctx.fillRect(0, CH - 20, CW, 3);

    // bird
    const bx = BIRD_X;
    const by = s.bird.y;
    const angle = Math.min(Math.max(s.bird.vy * 0.04, -0.5), 1.2);

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);

    // body
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_R, BIRD_R - 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // eye
    ctx.beginPath();
    ctx.arc(6, -4, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -4, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    // beak
    ctx.beginPath();
    ctx.moveTo(BIRD_R - 2, 0);
    ctx.lineTo(BIRD_R + 8, -2);
    ctx.lineTo(BIRD_R + 8, 2);
    ctx.closePath();
    ctx.fillStyle = "#f97316";
    ctx.fill();

    ctx.restore();

    // score
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 28px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(s.score), CW / 2, 50);
    ctx.textAlign = "left";
  }, []);

  const loop = useCallback(
    (ts: number) => {
      const s = state.current;
      if (!s.running) return;

      const dt = ts - (s.lastTs || ts);
      s.lastTs = ts;

      // bird physics
      s.bird.vy += GRAVITY;
      s.bird.y += s.bird.vy;

      // spawn pipes
      if (ts - s.lastPipe > PIPE_INTERVAL) {
        s.pipes.push(spawnPipe(ts));
        s.lastPipe = ts;
      }

      // move pipes
      s.pipes.forEach((p) => (p.x -= PIPE_SPEED));
      s.pipes = s.pipes.filter((p) => p.x + PIPE_W > 0);

      // score
      s.pipes.forEach((p) => {
        if (!p.passed && p.x + PIPE_W < BIRD_X) {
          p.passed = true;
          s.score++;
          setScore(s.score);
        }
      });

      // collisions
      const by = s.bird.y;
      const hitGround = by + BIRD_R > CH - 20;
      const hitCeiling = by - BIRD_R < 0;
      const hitPipe = s.pipes.some((p) => {
        const inX = BIRD_X + BIRD_R - 4 > p.x && BIRD_X - BIRD_R + 4 < p.x + PIPE_W;
        const inY = by - BIRD_R < p.topH || by + BIRD_R > p.topH + PIPE_GAP;
        return inX && inY;
      });

      if (hitGround || hitCeiling || hitPipe) {
        s.running = false;
        s.over = true;
        setPhase("over");
        draw();
        return;
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw]
  );

  const flap = useCallback(() => {
    const s = state.current;
    if (s.over) return;
    if (!s.running) {
      s.running = true;
      s.lastTs = 0;
      setPhase("running");
      rafRef.current = requestAnimationFrame(loop);
    }
    s.bird.vy = FLAP;
  }, [loop]);

  const restart = useCallback(() => {
    const s = state.current;
    s.bird = { y: CH / 2, vy: 0 };
    s.pipes = [];
    s.score = 0;
    s.running = false;
    s.over = false;
    s.lastPipe = 0;
    s.lastTs = 0;
    setScore(0);
    setPhase("idle");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    draw();
  }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => {
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Canvas */}
      <div
        className="relative"
        style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(52,211,153,0.2)" }}
      >
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ display: "block", maxWidth: "100%" }}
          onClick={flap}
        />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(2,3,6,0.7)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#34d399" }}>فلپی برد</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>برای شروع روی بازی کلیک کن</p>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(2,3,6,0.82)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>بازی تموم شد!</p>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>
              امتیاز: <span style={{ color: "#34d399", fontWeight: "bold" }}>{score}</span>
            </p>
            <button
              onClick={restart}
              className="px-6 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399" }}
            >
              شروع مجدد
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
