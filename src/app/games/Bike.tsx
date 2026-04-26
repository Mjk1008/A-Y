"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Canvas dimensions ────────────────────────────────────────────────────────
const CW = 320;
const CH = 400;
const GROUND_Y = CH - 70;   // top edge of grass
const BIKE_X   = 76;         // fixed x of bike
const BIKE_H   = 30;         // bike+rider height (for collision)
const BIKE_W   = 44;         // wheel-to-wheel span

// ─── Physics ─────────────────────────────────────────────────────────────────
const GRAVITY    = 0.55;
const JUMP_FORCE = -12;

// ─── Scroll speed ─────────────────────────────────────────────────────────────
const SPD_BASE = 3;
const SPD_MAX  = 7;
function spd(score: number) { return Math.min(SPD_MAX, SPD_BASE + score * 0.05); }

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "running" | "over";
interface Rock   { x: number; w: number; h: number; }
interface Flower { x: number; y: number; color: string; collected: boolean; }

const PETAL = ["#ff4081","#ff9800","#ffeb3b","#e91e63","#ab47bc","#00bcd4","#ff5722"];

function loadBest() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("bike-best") ?? "0", 10);
}
function saveBest(v: number) {
  if (typeof window !== "undefined") localStorage.setItem("bike-best", String(v));
}

// ─────────────────────────────────────────────────────────────────────────────
export function BikeGame({ onGameOver }: { onGameOver?: (score: number) => void } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const st = useRef({
    bikeY   : GROUND_Y - BIKE_H,
    bikeVY  : 0,
    grounded: true,
    rocks   : [] as Rock[],
    flowers : [] as Flower[],
    hillX   : 0,
    scrollX : 0,
    wheelA  : 0,
    frame   : 0,
    score   : 0,
    running : false,
    over    : false,
  });

  const [score, setScore]     = useState(0);
  const [best, setBest]       = useState(loadBest);
  const [phase, setPhase]     = useState<Phase>("idle");
  const rafRef                = useRef<number | null>(null);

  // ── Notify parent on game over ──────────────────────────────────────────
  useEffect(() => {
    if (phase === "over") {
      const t = setTimeout(() => onGameOver?.(st.current.score), 1800);
      return () => clearTimeout(t);
    }
  }, [phase, onGameOver]);

  // ── Draw functions ────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = st.current;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, "#5bb8f5");
    sky.addColorStop(1, "#b8e4b8");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, CH);

    // Sun
    ctx.save();
    ctx.shadowColor = "#fff9c4"; ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffee58";
    ctx.beginPath(); ctx.arc(44, 46, 20, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();

    // Small clouds
    const cx1 = ((s.hillX * 0.2) % (CW + 80)) - 40;
    const cx2 = ((s.hillX * 0.15 + 160) % (CW + 80)) - 40;
    for (const [cxBase, cyBase] of [[cx1, 55], [cx2, 80]]) {
      ctx.save(); ctx.globalAlpha = 0.7; ctx.fillStyle = "#fff";
      for (const [dx, dy, r] of [[0,0,18],[22,4,14],[-16,4,13],[10,-6,12]]) {
        ctx.beginPath(); ctx.arc(cxBase + dx, cyBase + dy, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    // Far hills
    ctx.fillStyle = "#a5d6a7";
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y);
    for (let x = 0; x <= CW; x += 4) {
      const y = GROUND_Y - 55 - Math.sin((x + s.hillX * 0.25) * 0.018) * 38 - Math.sin((x + s.hillX * 0.25) * 0.051) * 18;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(CW, GROUND_Y); ctx.closePath(); ctx.fill();

    // Near hills
    ctx.fillStyle = "#66bb6a";
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y);
    for (let x = 0; x <= CW; x += 4) {
      const y = GROUND_Y - 26 - Math.sin((x + s.hillX * 0.55) * 0.028) * 22 - Math.sin((x + s.hillX * 0.55) * 0.07) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(CW, GROUND_Y); ctx.closePath(); ctx.fill();

    // Ground surface strip
    ctx.fillStyle = "#8bc34a";
    ctx.fillRect(0, GROUND_Y - 6, CW, 10);
    ctx.fillStyle = "#558b2f";
    ctx.fillRect(0, GROUND_Y + 4, CW, CH - GROUND_Y - 4);

    // Ground dashes
    ctx.strokeStyle = "#4caf50"; ctx.lineWidth = 1.5;
    const dashGap = 28;
    const dashOff = (s.scrollX % dashGap);
    for (let x = -dashGap + dashOff; x < CW + dashGap; x += dashGap) {
      ctx.save(); ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.moveTo(x, GROUND_Y + 10); ctx.lineTo(x, GROUND_Y + 18); ctx.stroke();
      ctx.restore();
    }

    // ── Flowers (drawn behind rocks and bike) ─────────────────────────────
    for (const f of s.flowers) {
      if (f.collected) continue;
      const fx = f.x + 8; const fy = f.y + 8;
      // Stem
      ctx.strokeStyle = "#388e3c"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(fx, fy + 6); ctx.lineTo(fx, fy + 16); ctx.stroke();
      // Petals
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a) * 5, fy + Math.sin(a) * 5, 4, 2.5, a, 0, Math.PI * 2);
        ctx.fill();
      }
      // Centre
      ctx.fillStyle = "#fff176";
      ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    // ── Rocks ────────────────────────────────────────────────────────────
    for (const r of s.rocks) {
      const ry = GROUND_Y - r.h;
      ctx.fillStyle = "#78909c"; ctx.strokeStyle = "#546e7a"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(r.x + r.w * 0.08, ry + r.h);
      ctx.lineTo(r.x,              ry + r.h * 0.55);
      ctx.lineTo(r.x + r.w * 0.28, ry);
      ctx.lineTo(r.x + r.w * 0.65, ry + r.h * 0.08);
      ctx.lineTo(r.x + r.w,        ry + r.h * 0.48);
      ctx.lineTo(r.x + r.w * 0.9,  ry + r.h);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.ellipse(r.x + r.w * 0.33, ry + r.h * 0.28, r.w * 0.14, r.h * 0.09, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Bike + rider ─────────────────────────────────────────────────────
    const bx = BIKE_X;
    const by = s.bikeY;
    const wa = s.wheelA;
    const wR = 13;
    const w1x = bx + 8;  const w2x = bx + 38;
    const wy  = by + BIKE_H;   // wheel centres y

    ctx.save();
    ctx.shadowColor = "#34d399"; ctx.shadowBlur = 10;

    // Wheels
    for (const wx of [w1x, w2x]) {
      ctx.save(); ctx.translate(wx, wy); ctx.rotate(wa);
      ctx.strokeStyle = "#1a3a28"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, wR, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#34d399"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * (wR - 2), Math.sin(a) * (wR - 2));
        ctx.stroke();
      }
      ctx.fillStyle = "#34d399";
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.shadowBlur = 0;

    // Frame
    ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    // Main triangle
    ctx.beginPath(); ctx.moveTo(w1x, wy); ctx.lineTo(bx + 22, by + 6); ctx.lineTo(w2x, wy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w1x, wy); ctx.lineTo(bx + 13, by + 6); ctx.stroke();
    // Seat tube
    ctx.beginPath(); ctx.moveTo(bx + 17, by + 6); ctx.lineTo(bx + 19, by - 2); ctx.stroke();
    // Seat
    ctx.strokeStyle = "#145230"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx + 13, by - 2); ctx.lineTo(bx + 26, by - 2); ctx.stroke();
    // Fork + handlebar post
    ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(bx + 26, by + 6); ctx.lineTo(bx + 29, by - 5); ctx.stroke();
    ctx.strokeStyle = "#145230"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx + 24, by - 5); ctx.lineTo(bx + 36, by - 5); ctx.stroke();

    // ── ماتیلدا — موی کوتاه bob ──────────────────────────────────────
    const hx = bx + 30; const hy = by - 19;

    // ── موی bob: قهوه‌ای تیره، فقط تا فک، دور سر گرده ──
    ctx.fillStyle = "#2c1a0e";
    // توده اصلی مو (دورتادور سر تا فک)
    ctx.beginPath();
    ctx.moveTo(hx - 7, hy - 3);
    ctx.quadraticCurveTo(hx - 5, hy - 9, hx + 2, hy - 9);
    ctx.lineTo(hx + 7,  hy - 6);
    ctx.lineTo(hx + 7,  hy + 5);   // جلوی مو (سمت راست)
    ctx.quadraticCurveTo(hx + 5, hy + 8, hx + 1, hy + 8);  // خط مستقیم پایین bob
    ctx.lineTo(hx - 6,  hy + 8);
    ctx.quadraticCurveTo(hx - 9, hy + 6, hx - 8, hy + 2);
    ctx.closePath(); ctx.fill();

    // ── چتری (پیشانی رو می‌پوشونه) ──
    ctx.beginPath();
    ctx.moveTo(hx - 5, hy - 9);
    ctx.lineTo(hx + 7, hy - 8);
    ctx.lineTo(hx + 6, hy - 4);
    ctx.quadraticCurveTo(hx + 1, hy - 2, hx - 4, hy - 3);
    ctx.closePath(); ctx.fill();

    // ── صورت (پوست) ──
    ctx.fillStyle = "#ffcd94";
    ctx.beginPath(); ctx.arc(hx, hy, 6.2, 0, Math.PI * 2); ctx.fill();

    // چتری دوباره روی صورت (جلوی موها جلوتر از پوسته)
    ctx.fillStyle = "#2c1a0e";
    ctx.beginPath();
    ctx.moveTo(hx - 4, hy - 8);
    ctx.lineTo(hx + 6, hy - 7);
    ctx.lineTo(hx + 5, hy - 3.5);
    ctx.quadraticCurveTo(hx, hy - 1.5, hx - 3, hy - 2.5);
    ctx.closePath(); ctx.fill();

    // ── چشم‌ها (پایین چتری، خیره نگاه می‌کنه) ──
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath(); ctx.arc(hx + 1.5, hy + 0.5, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 4.2, hy + 0.5, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(hx + 2,   hy,  0.45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 4.7, hy,  0.45, 0, Math.PI * 2); ctx.fill();

    // لپ کمی گلی
    ctx.fillStyle = "rgba(255,100,90,0.2)";
    ctx.beginPath(); ctx.ellipse(hx + 4, hy + 2.5, 2.2, 1.3, 0, 0, Math.PI * 2); ctx.fill();

    // ── بدن: ژاکت سبز تیره (مثل ماتیلدا) ──
    ctx.strokeStyle = "#2e7d32"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(bx + 19, by - 2); ctx.lineTo(bx + 28, by - 15); ctx.stroke();
    // دست
    ctx.strokeStyle = "#ffcd94"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx + 27, by - 14); ctx.lineTo(bx + 34, by - 6); ctx.stroke();
    // پا (شلوار جین آبی)
    ctx.strokeStyle = "#1565c0"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(bx + 19, by - 2); ctx.lineTo(bx + 12, by + 7); ctx.lineTo(w1x + 3, wy); ctx.stroke();

    ctx.restore();

    // ── Idle / Game-over overlays handled in JSX ──────────────────────────
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = st.current;
    if (!s.running) return;

    const v = spd(s.score);
    s.frame++;
    s.scrollX += v;
    s.hillX   += v;
    s.wheelA  += v * 0.14;

    // Physics
    s.bikeVY += GRAVITY;
    s.bikeY  += s.bikeVY;
    if (s.bikeY >= GROUND_Y - BIKE_H) {
      s.bikeY = GROUND_Y - BIKE_H; s.bikeVY = 0; s.grounded = true;
    }

    // Spawn rocks
    const rockInterval = Math.max(55, 110 - s.score * 1.5);
    if (s.frame % Math.round(rockInterval) === 0) {
      s.rocks.push({
        x: CW + 10,
        w: 20 + Math.random() * 14,
        h: 22 + Math.random() * 12,
      });
    }

    // Spawn flowers (offset from rocks)
    const flowerInterval = Math.max(40, 80 - s.score);
    if (s.frame % Math.round(flowerInterval) === 38) {
      s.flowers.push({
        x: CW + 10,
        y: GROUND_Y - BIKE_H - 28 - Math.random() * 20,
        color: PETAL[Math.floor(Math.random() * PETAL.length)],
        collected: false,
      });
    }

    // Move items
    for (const r of s.rocks)   r.x -= v;
    for (const f of s.flowers) f.x -= v;
    s.rocks   = s.rocks.filter(r => r.x > -60);
    s.flowers = s.flowers.filter(f => f.x > -40);

    // Flower collection (box overlap)
    const bikeTop = s.bikeY + 4; const bikeBot = s.bikeY + BIKE_H - 4;
    const bikeL   = BIKE_X + 6;  const bikeR   = BIKE_X + BIKE_W - 6;
    for (const f of s.flowers) {
      if (!f.collected && bikeL < f.x + 16 && bikeR > f.x && bikeTop < f.y + 20 && bikeBot > f.y) {
        f.collected = true;
        s.score += 2;
        setScore(s.score);
      }
    }

    // Rock collision (tight hitbox)
    for (const r of s.rocks) {
      const ry = GROUND_Y - r.h;
      if (bikeL + 4 < r.x + r.w - 4 &&
          bikeR - 4 > r.x + 4 &&
          bikeBot   > ry + 4) {
        s.running = false; s.over = true;
        if (s.score > loadBest()) { saveBest(s.score); setBest(s.score); }
        setPhase("over");
        draw();
        return;
      }
    }

    // Time-based score
    if (s.frame % 40 === 0) { s.score++; setScore(s.score); }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // ── Jump ─────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    const s = st.current;
    if (!s.running) return;
    if (s.grounded) { s.bikeVY = JUMP_FORCE; s.grounded = false; }
  }, []);

  // ── Start / restart ────────────────────────────────────────────────────
  const start = useCallback(() => {
    const s = st.current;
    s.bikeY = GROUND_Y - BIKE_H; s.bikeVY = 0; s.grounded = true;
    s.rocks = []; s.flowers = [];
    s.score = 0; s.frame = 0; s.scrollX = 0; s.hillX = 0; s.wheelA = 0;
    s.running = true; s.over = false;
    setScore(0); setPhase("running");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Key controls ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault(); jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  // ── Initial draw + cleanup ─────────────────────────────────────────────
  useEffect(() => {
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, userSelect: "none", width: "100%" }}>
      {/* Score bar */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: CW }}>
        {[
          { label: "امتیاز", val: score, color: "#34d399" },
          { label: "بهترین", val: best,  color: "#6ee7b7" },
          { label: "سرعت",  val: phase === "running" ? `${Math.round(spd(score) / SPD_MAX * 100)}%` : "--", color: "rgba(52,211,153,0.65)" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2, fontFamily: "monospace" }}>{label}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color, fontFamily: "monospace" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "2px solid rgba(52,211,153,0.3)", boxShadow: "0 0 28px rgba(52,211,153,0.1)", touchAction: "none" }}
        onPointerDown={() => { if (phase === "running") jump(); }}
      >
        <canvas
          ref={canvasRef}
          width={CW} height={CH}
          style={{ display: "block", touchAction: "none", maxWidth: "100%", height: "auto" }}
        />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,18,10,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 42 }}>🚲</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#34d399" }}>دوچرخه‌سواری</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.8 }}>
              از سنگ‌ها رد شو<br/>
              <span style={{ color: "#ff9800" }}>🌸 گل‌ها</span> جمع کن (+۲ امتیاز)<br/>
              <span style={{ opacity: 0.55, fontSize: 11 }}>tap / space / ↑ برای پرش</span>
            </div>
            <button
              onClick={start}
              style={{ padding: "10px 28px", borderRadius: 12, background: "#34d399", color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              شروع بازی
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(2,8,4,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {/* AY لوگو */}
            <div style={{
              fontWeight: 900,
              fontSize: 80,
              color: "#34d399",
              fontFamily: "monospace",
              lineHeight: 1,
              letterSpacing: "-4px",
              textShadow: "0 0 32px rgba(52,211,153,0.55), 0 0 64px rgba(52,211,153,0.2)",
            }}>AY</div>
            {/* باختی */}
            <div style={{ fontWeight: 900, fontSize: 26, color: "#ef4444", letterSpacing: "0.06em", marginBottom: 4 }}>
              باختی 😅
            </div>

            {/* امتیازها */}
            <div style={{ display: "flex", gap: 18, marginTop: 6, padding: "10px 20px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", fontFamily: "monospace", marginBottom: 2 }}>امتیاز</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#34d399", fontFamily: "monospace" }}>{score}</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", fontFamily: "monospace", marginBottom: 2 }}>بهترین</div>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#6ee7b7", fontFamily: "monospace" }}>{best}</div>
              </div>
            </div>

            {score >= best && score > 0 && (
              <div style={{ fontSize: 11, color: "#fcd34d", fontWeight: 700 }}>🏆 رکورد جدید!</div>
            )}

            <button
              onClick={start}
              style={{ marginTop: 10, padding: "10px 32px", borderRadius: 12, background: "#34d399", color: "#04110a", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              دوباره بازی
            </button>
          </div>
        )}
      </div>

      {/* Jump button */}
      {phase === "running" && (
        <button
          onPointerDown={(e) => { e.preventDefault(); jump(); }}
          style={{
            width: "100%", maxWidth: CW, height: 48, borderRadius: 12,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            WebkitTapHighlightColor: "transparent", touchAction: "none",
          }}
        >
          <span>⬆</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>پرش</span>
        </button>
      )}

      {phase !== "running" && phase !== "idle" && (
        <button
          onClick={start}
          style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}
        >
          شروع مجدد
        </button>
      )}
    </div>
  );
}
