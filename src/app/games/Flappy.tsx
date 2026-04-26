"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CW = 300;
const CH = 480;
const BIRD_X = 65;
const BIRD_R = 13;
const GRAVITY = 0.38;
const FLAP = -7.8;
const PIPE_W = 48;
const PIPE_GAP = 152;
const PIPE_SPEED = 2.2;
const PIPE_INTERVAL = 1700;
const ACCENT = "#60a5fa";

interface Pipe { x: number; topH: number; passed: boolean; }

function getBest() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("flappy-best") ?? "0", 10);
}
function setBest(v: number) {
  if (typeof window !== "undefined") localStorage.setItem("flappy-best", String(v));
}

// Static star positions (deterministic)
const STARS = Array.from({ length: 50 }, (_, i) => ({
  x: (i * 137 + 23) % CW,
  y: (i * 97 + 17) % (CH * 0.75),
  r: i % 3 === 0 ? 1.5 : 1,
  a: 0.15 + (i % 5) * 0.08,
}));

export function FlappyGame({ onGameOver }: { onGameOver?: (score: number) => void } = {}) {
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
  const [best, setBestState] = useState(getBest);
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle");
  const rafRef = useRef<number | null>(null);
  const flapFlash = useRef(0);

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
    const s = state.current;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CH);
    sky.addColorStop(0, "#020814");
    sky.addColorStop(0.6, "#03102a");
    sky.addColorStop(1, "#030a1c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // Stars
    STARS.forEach(({ x, y, r, a }) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Flap flash
    if (flapFlash.current > 0) {
      ctx.fillStyle = `rgba(96,165,250,${flapFlash.current * 0.015})`;
      ctx.fillRect(0, 0, CW, CH);
      flapFlash.current--;
    }

    // Pipes
    s.pipes.forEach((p) => {
      // Pipe body gradient
      const gr = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      gr.addColorStop(0, "#1e3a5f");
      gr.addColorStop(0.3, "#2563eb");
      gr.addColorStop(0.7, "#1d4ed8");
      gr.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = gr;

      // Top pipe
      ctx.beginPath();
      ctx.roundRect(p.x, 0, PIPE_W, p.topH - 14, [0, 0, 4, 4]);
      ctx.fill();

      // Top cap
      const capGr = ctx.createLinearGradient(p.x - 5, 0, p.x + PIPE_W + 5, 0);
      capGr.addColorStop(0, "#1e3a5f");
      capGr.addColorStop(0.5, "#60a5fa");
      capGr.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = capGr;
      ctx.beginPath();
      ctx.roundRect(p.x - 5, p.topH - 14, PIPE_W + 10, 14, [0, 0, 6, 6]);
      ctx.fill();
      // cap shine
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(p.x - 2, p.topH - 13, PIPE_W / 2, 3);

      // Bottom pipe
      const botY = p.topH + PIPE_GAP;
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.roundRect(p.x, botY + 14, PIPE_W, CH - botY - 14, [4, 4, 0, 0]);
      ctx.fill();

      // Bottom cap
      ctx.fillStyle = capGr;
      ctx.beginPath();
      ctx.roundRect(p.x - 5, botY, PIPE_W + 10, 14, [6, 6, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(p.x - 2, botY + 2, PIPE_W / 2, 3);

      // Gap glow
      const gapGr = ctx.createRadialGradient(p.x + PIPE_W / 2, p.topH + PIPE_GAP / 2, 0, p.x + PIPE_W / 2, p.topH + PIPE_GAP / 2, PIPE_GAP / 2);
      gapGr.addColorStop(0, "rgba(96,165,250,0.04)");
      gapGr.addColorStop(1, "transparent");
      ctx.fillStyle = gapGr;
      ctx.fillRect(p.x, p.topH, PIPE_W, PIPE_GAP);
    });

    // Ground
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, CH - 18, CW, 18);
    ctx.fillStyle = ACCENT;
    ctx.fillRect(0, CH - 18, CW, 2);
    // ground pattern
    for (let i = 0; i < CW; i += 12) {
      ctx.fillStyle = "rgba(96,165,250,0.08)";
      ctx.fillRect(i, CH - 16, 6, 14);
    }

    // Bird
    const by = s.bird.y;
    const angle = Math.min(Math.max(s.bird.vy * 0.045, -0.5), 1.1);
    ctx.save();
    ctx.translate(BIRD_X, by);
    ctx.rotate(angle);

    // Body glow
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 12;

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_R + 1, BIRD_R - 1, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wing
    ctx.beginPath();
    ctx.ellipse(-4, 2, 7, 4, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();

    // Belly
    ctx.beginPath();
    ctx.ellipse(2, 3, 6, 4, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#fde68a";
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(6, -4, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -4, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#111827";
    ctx.fill();
    // Eye shine
    ctx.beginPath();
    ctx.arc(7.5, -5, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(BIRD_R, -1);
    ctx.lineTo(BIRD_R + 9, -3);
    ctx.lineTo(BIRD_R + 9, 3);
    ctx.closePath();
    ctx.fillStyle = "#f97316";
    ctx.fill();
    // Beak line
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(BIRD_R + 1, 0);
    ctx.lineTo(BIRD_R + 8, 0);
    ctx.stroke();

    ctx.restore();

    // Score on canvas (large, centered)
    if (s.running || s.score > 0) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 32px system-ui";
      ctx.fillText(String(s.score), CW / 2, 52);
      ctx.textAlign = "left";
    }
  }, []);

  const loop = useCallback((ts: number) => {
    const s = state.current;
    if (!s.running) return;
    s.lastTs = s.lastTs || ts;
    s.bird.vy += GRAVITY;
    s.bird.y += s.bird.vy;

    if (ts - s.lastPipe > PIPE_INTERVAL) {
      s.pipes.push({ x: CW + PIPE_W, topH: 60 + Math.random() * (CH - PIPE_GAP - 100), passed: false });
      s.lastPipe = ts;
    }
    s.pipes.forEach((p) => { p.x -= PIPE_SPEED; });
    s.pipes = s.pipes.filter((p) => p.x + PIPE_W > 0);

    s.pipes.forEach((p) => {
      if (!p.passed && p.x + PIPE_W < BIRD_X) {
        p.passed = true; s.score++;
        setScore(s.score);
        if (s.score > getBest()) { setBest(s.score); setBestState(s.score); }
      }
    });

    const hitGround = s.bird.y + BIRD_R > CH - 18;
    const hitCeiling = s.bird.y - BIRD_R < 0;
    const hitPipe = s.pipes.some((p) => {
      const inX = BIRD_X + BIRD_R - 5 > p.x && BIRD_X - BIRD_R + 5 < p.x + PIPE_W;
      const inY = s.bird.y - BIRD_R < p.topH || s.bird.y + BIRD_R > p.topH + PIPE_GAP;
      return inX && inY;
    });

    if (hitGround || hitCeiling || hitPipe) {
      s.running = false; s.over = true;
      setPhase("over"); draw(); return;
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const flap = useCallback(() => {
    const s = state.current;
    if (s.over) return;
    if (!s.running) {
      s.running = true; s.lastTs = 0; s.lastPipe = 0;
      setPhase("running");
      rafRef.current = requestAnimationFrame(loop);
    }
    s.bird.vy = FLAP;
    flapFlash.current = 5;
  }, [loop]);

  const restart = useCallback(() => {
    const s = state.current;
    s.bird = { y: CH / 2, vy: 0 };
    s.pipes = []; s.score = 0; s.running = false; s.over = false;
    s.lastPipe = 0; s.lastTs = 0;
    setScore(0); setPhase("idle");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    draw();
  }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => {
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, userSelect: "none", width: "100%" }}>
      {/* Score bar — above canvas */}
      {phase !== "idle" && (
        <div style={{ display: "flex", gap: 8, maxWidth: CW, width: "100%" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>امتیاز</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: ACCENT, fontFamily: "monospace" }}>{score}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.10)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>بهترین</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#93c5fd", fontFamily: "monospace" }}>{best}</div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(96,165,250,0.18)", boxShadow: "0 0 24px rgba(96,165,250,0.07)", cursor: "pointer" }}
        onClick={flap}
      >
        <canvas ref={canvasRef} width={CW} height={CH} style={{ display: "block", touchAction: "none", maxWidth: "100%", height: "auto" }} />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(2,3,6,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 40 }}>🐦</div>
            <div style={{ fontWeight: 900, fontSize: 22, color: ACCENT }}>فلپی برد</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.8 }}>
              از بین لوله‌ها رد شو<br/>
              <span style={{ opacity: 0.65 }}>برای پرواز روی صفحه ضربه بزن</span>
            </div>
            {best > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#93c5fd" }}>
                <span>👑</span>
                <span>رکورد: <b>{best}</b></span>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); flap(); }}
              style={{ padding: "11px 32px", borderRadius: 12, background: ACCENT, color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              پرواز کن! 🚀
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(2,3,6,0.90)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 30 }}>💥</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#ef4444" }}>برخورد!</div>
            <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>امتیاز</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: ACCENT, fontFamily: "monospace" }}>{score}</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>بهترین</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#93c5fd", fontFamily: "monospace" }}>{best}</div>
              </div>
            </div>
            {score > 0 && score >= best && (
              <div style={{ fontSize: 12, color: "#fcd34d", fontWeight: 700 }}>🏆 رکورد جدید!</div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); restart(); }}
              style={{ marginTop: 8, padding: "10px 30px", borderRadius: 12, background: ACCENT, color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              دوباره بازی
            </button>
          </div>
        )}

        {/* Running: tap hint at bottom */}
        {phase === "running" && (
          <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: 9, color: "rgba(96,165,250,0.4)", fontFamily: "monospace" }}>ضربه بزن / Space</span>
          </div>
        )}
      </div>
    </div>
  );
}
