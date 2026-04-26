"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Pixel art rect primitive ──────────────────────────────────────────
function MPx({ x, y, w = 1, h = 1, c }: { x: number; y: number; w?: number; h?: number; c: string }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges" />;
}

type MascotState = "idle" | "wave" | "bounce" | "surprise" | "sparkle";

// ── Mascot SVG art — 24×24 pixel blob (from-behind) ──────────────────
function MascotArt({
  state = "idle",
  frame = 0,
  blink = false,
  scale = 6,
  accent = "#34d399",
}: {
  state?: MascotState;
  frame?: number;
  blink?: boolean;
  scale?: number;
  accent?: string;
}) {
  const body = "#cfe8dc";
  const bodyHi = "#e6f4ec";
  const bodySh = "#8cb5a2";
  const dark = "#0a1a14";
  const blush = "#fca5a5";

  let bobY = 0;
  let armTilt = 0;
  let scaleJump = 1;
  let sparkleOn = false;
  let heartBeat = 1;

  if (state === "idle") bobY = frame % 2 === 0 ? 0 : -0.5;
  if (state === "wave") armTilt = [0, -3, -5, -3, 0][frame % 5];
  if (state === "bounce") {
    const f = frame % 6;
    bobY = [0, -1.2, -2, -1.2, 0, 0.3][f];
    scaleJump = [1, 1.01, 1.02, 1.01, 1, 0.99][f];
  }
  if (state === "surprise") {
    bobY = frame % 2 === 0 ? -0.5 : -0.3;
    heartBeat = frame % 2 === 0 ? 1.2 : 1;
  }
  if (state === "sparkle") {
    sparkleOn = true;
    heartBeat = 1 + 0.15 * Math.sin(frame * 0.8);
  }

  return (
    <svg
      width={24 * scale}
      height={24 * scale}
      viewBox="0 0 24 24"
      style={{ imageRendering: "pixelated", overflow: "visible", display: "block" }}
    >
      <g
        transform={`translate(0, ${bobY}) scale(${scaleJump}) translate(${(1 - scaleJump) * 12}, ${(1 - scaleJump) * 12})`}
      >
        {/* Ears */}
        <MPx x={7} y={5} c={bodySh} />
        <MPx x={7} y={6} c={body} />
        <MPx x={16} y={5} c={bodySh} />
        <MPx x={16} y={6} c={body} />

        {/* Head + body */}
        <MPx x={9} y={5} w={6} c={body} />
        <MPx x={8} y={6} w={8} c={body} />
        <MPx x={7} y={7} w={10} c={body} />
        <MPx x={9} y={6} w={3} c={bodyHi} />

        <MPx x={6} y={8} w={12} c={body} />
        <MPx x={5} y={9} w={14} c={body} />
        <MPx x={5} y={10} w={14} c={body} />
        <MPx x={5} y={11} w={14} c={body} />
        <MPx x={5} y={12} w={14} c={body} />
        <MPx x={5} y={13} w={14} c={body} />
        <MPx x={6} y={14} w={12} c={body} />
        <MPx x={6} y={15} w={12} c={body} />
        <MPx x={7} y={16} w={10} c={bodySh} />

        {/* Side shading */}
        <MPx x={18} y={9} c={bodySh} />
        <MPx x={18} y={10} c={bodySh} />
        <MPx x={18} y={11} c={bodySh} />
        <MPx x={18} y={12} c={bodySh} />
        <MPx x={18} y={13} c={bodySh} />

        {/* Emerald heart on back */}
        <g
          transform={`translate(${11 + (1 - heartBeat)}, ${10 + (1 - heartBeat)}) scale(${heartBeat})`}
        >
          <MPx x={0} y={0} c={accent} />
          <MPx x={2} y={0} c={accent} />
          <MPx x={0} y={1} w={3} c={accent} />
          <MPx x={1} y={2} c={accent} />
        </g>

        {(state === "idle" || state === "sparkle" || state === "surprise") && (
          <circle cx={12.5} cy={11.5} r={2.5} fill="none" stroke={accent} strokeWidth={0.18} opacity={0.5} />
        )}

        {/* Feet */}
        <MPx x={9} y={17} c={dark} />
        <MPx x={14} y={17} c={dark} />

        {/* Blush */}
        {(state === "surprise" || state === "sparkle") && (
          <>
            <MPx x={5} y={11} c={blush} />
            <MPx x={18} y={11} c={blush} />
          </>
        )}

        {/* Wave arm */}
        {state === "wave" && (
          <g transform={`translate(19, ${9 + armTilt})`}>
            <MPx x={0} y={0} c={body} />
            <MPx x={0} y={1} c={body} />
            <MPx x={1} y={0} c={body} />
          </g>
        )}

        {/* Shadow */}
        <g opacity={0.55}>
          <MPx x={8} y={19} w={8} c="#030806" />
          <MPx x={9} y={20} w={6} c="#030806" />
        </g>
      </g>

      {/* Blink */}
      {blink && (
        <g>
          <MPx x={10} y={7} c={dark} />
          <MPx x={13} y={7} c={dark} />
        </g>
      )}

      {/* Sparkles */}
      {sparkleOn && (
        <g>
          {[0, 1, 2, 3].map((i) => {
            const ang = frame * 0.4 + i * Math.PI * 0.5;
            const cx = 12 + Math.cos(ang) * 9;
            const cy = 11 + Math.sin(ang) * 6;
            return (
              <g key={i}>
                <MPx x={cx} y={cy - 0.5} c={accent} />
                <MPx x={cx - 0.5} y={cy} c={accent} />
                <MPx x={cx + 0.5} y={cy} c={accent} />
                <MPx x={cx} y={cy + 0.5} c={accent} />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

// ── Chat bubble with typewriter ───────────────────────────────────────
function MascotBubble({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        bottom: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        padding: "9px 14px",
        background: "linear-gradient(180deg, rgba(31,46,40,0.96) 0%, rgba(18,30,24,0.92) 100%)",
        border: "1px solid rgba(110,231,183,0.30)",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.06)",
        fontFamily: "'Vazirmatn Variable', Vazirmatn, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.5,
        color: "#e8efea",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 60,
        maxWidth: 200,
      }}
    >
      {shown}
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: 12,
          background: "#34d399",
          marginInlineStart: 2,
          verticalAlign: "middle",
          animation: "ay-mascot-caret 1s steps(2) infinite",
        }}
      />
      {/* Tail */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(-45deg)",
          width: 10,
          height: 10,
          background: "rgba(31,46,40,0.96)",
          borderBottom: "1px solid rgba(110,231,183,0.30)",
          borderRight: "1px solid rgba(110,231,183,0.30)",
        }}
      />
    </div>
  );
}

const BUBBLE_MESSAGES: Record<MascotState, string[]> = {
  idle: [],
  wave: ["سلام! 👋", "حالت خوبه؟", "ای‌وایِ من!"],
  bounce: ["یه‌هو!", "بپر بپر!", "انرژی دارم!"],
  surprise: ["اِ واقعاً؟!", "جدی می‌گی؟!", "وای نه!"],
  sparkle: ["تو می‌درخشی ✨", "بهترینی! ⭐", "افرین بهت!"],
};

// ── PixelMascot — full interactive component ─────────────────────────
export function PixelMascot({ accent = "#34d399", scale = 4 }: { accent?: string; scale?: number }) {
  const [state, setState] = useState<MascotState>("idle");
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 10fps frame ticker
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);

  // Blink every ~3.5s when idle
  useEffect(() => {
    if (state !== "idle") return;
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3500);
    return () => clearInterval(id);
  }, [state]);

  // Return to idle after reaction
  useEffect(() => {
    if (state === "idle") return;
    const ms = state === "bounce" ? 900 : state === "surprise" ? 1100 : state === "wave" ? 1500 : 2200;
    const id = setTimeout(() => setState("idle"), ms);
    return () => clearTimeout(id);
  }, [state]);

  const handleClick = useCallback(() => {
    const cycle: MascotState[] = ["wave", "bounce", "surprise", "sparkle"];
    const cur = cycle.indexOf(state);
    const next = cycle[(cur + 1) % cycle.length];
    setState(next);

    const msgs = BUBBLE_MESSAGES[next];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    setBubble(msg);

    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 3500);
  }, [state]);

  return (
    <>
      <style>{`
        @keyframes ay-mascot-caret { 0%,60%{opacity:1} 61%,100%{opacity:0} }
      `}</style>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onClick={handleClick}
        aria-label="ای‌وای مسکات"
        role="button"
      >
        {bubble && <MascotBubble text={bubble} />}
        <MascotArt state={state} frame={frame} blink={blink} scale={scale} accent={accent} />
      </div>
    </>
  );
}

// ── FloatingMascot — fixed position, always visible ──────────────────
export function FloatingMascot() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: 16,
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      <PixelMascot scale={4} />
    </div>
  );
}

// ── MascotArtStatic — non-interactive, for use in loading screens ────
export { MascotArt };
