"use client";

// Pixel Universe Scene — cinematic backdrop for A-Y
// Components: Aurora, Starfield, Horizon, PixelRobot, PixelGlyph, GrainLayer, Scene

import { useMemo } from "react";

// ── Grain overlay ────────────────────────────────────────────────────
export function GrainLayer({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='1'/></svg>")`,
        opacity,
        mixBlendMode: "overlay" as const,
        zIndex: 100,
      }}
    />
  );
}

// ── Aurora — emerald glows ────────────────────────────────────────────
export function Aurora({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 20% 30%, rgba(16,185,129,0.35), transparent 60%)`,
          opacity: intensity,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 45% at 85% 15%, rgba(52,211,153,0.22), transparent 55%)`,
          opacity: intensity,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 110%, rgba(4,120,87,0.30), transparent 55%)`,
          opacity: intensity,
        }}
      />
    </>
  );
}

// ── Starfield ────────────────────────────────────────────────────────
export function Starfield({ count = 40, seed = 1 }: { count?: number; seed?: number }) {
  const stars = useMemo<Array<{x:number;y:number;s:number;o:number;d:number}>>(() => {
    const r = (i: number) => {
      let x = Math.sin(i * 9301 + seed * 49297) * 233280;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      x: r(i * 3) * 100,
      y: r(i * 3 + 1) * 100,
      s: 1 + Math.floor(r(i * 3 + 2) * 3),
      o: 0.3 + r(i * 3 + 4) * 0.5,
      d: 2 + r(i * 3 + 5) * 4,
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((st, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            background: "#6ee7b7",
            opacity: st.o,
            boxShadow: `0 0 ${st.s * 2}px rgba(110,231,183,0.5)`,
            animation: `ay-twinkle ${st.d}s ease-in-out ${i * 0.11}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Horizon — perspective pixel grid ────────────────────────────────
export function Horizon({ y = 62 }: { y?: number }) {
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
    >
      <defs>
        <linearGradient id="ay-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.0)" />
          <stop offset="30%" stopColor="rgba(16,185,129,0.18)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
        </linearGradient>
        <linearGradient id="ay-horizon-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(110,231,183,0)" />
          <stop offset="50%" stopColor="rgba(110,231,183,0.6)" />
          <stop offset="100%" stopColor="rgba(110,231,183,0)" />
        </linearGradient>
      </defs>
      <rect x="0" y={`${y}%`} width="400" height={`${100 - y}%`} fill="url(#ay-ground)" />
      <line x1="0" y1={`${y}%`} x2="400" y2={`${y}%`} stroke="url(#ay-horizon-line)" strokeWidth="1" />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={200 + i * 50}
          y1="100%"
          x2="200"
          y2={`${y}%`}
          stroke="rgba(110,231,183,0.12)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}
      {[0.1, 0.25, 0.45, 0.7].map((t, i) => (
        <line
          key={i}
          x1="0"
          y1={`${y + (100 - y) * t}%`}
          x2="400"
          y2={`${y + (100 - y) * t}%`}
          stroke="rgba(110,231,183,0.09)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

// ── PixelRobot ────────────────────────────────────────────────────────
export type RobotPose = "run" | "stand" | "sit" | "look-up" | "climb" | "wave";

export function PixelRobot({ pose = "stand", scale = 4, accent = "#34d399" }: {
  pose?: RobotPose;
  scale?: number;
  accent?: string;
}) {
  const body = "#cfe8dc";
  const bodyShade = "#8cb5a2";
  const dark = "#0a1a14";
  const foot = "#1a3a2c";
  const light = "#ffffff";

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges" />
  );

  let legL = [6, 17, 1, 3];
  let legR = [9, 17, 1, 3];
  let armL = [3, 10, 2, 5];
  let armR = [11, 10, 2, 5];
  let bob = 0;

  if (pose === "run") {
    legL = [5, 16, 2, 4]; legR = [10, 17, 2, 3];
    armL = [2, 9, 2, 4];  armR = [12, 11, 2, 4];
    bob = -0.4;
  }
  if (pose === "sit") {
    legL = [3, 16, 4, 2]; legR = [9, 16, 4, 2];
    armL = [3, 11, 2, 3]; armR = [11, 11, 2, 3];
  }
  if (pose === "look-up") { bob = -0.2; }
  if (pose === "climb") {
    legL = [5, 16, 2, 4]; legR = [10, 14, 2, 3];
    armL = [3, 7, 2, 4];  armR = [11, 11, 2, 4];
    bob = -0.6;
  }
  if (pose === "wave") {
    armL = [2, 9, 2, 4]; armR = [12, 5, 2, 5];
  }

  return (
    <svg
      width={16 * scale}
      height={22 * scale}
      viewBox="0 0 16 22"
      style={{ imageRendering: "pixelated", overflow: "visible" }}
    >
      <g transform={`translate(0, ${bob})`}>
        {px(7, 0, accent)}
        {px(7, 1, accent)}
        {px(5, 2, body, 6, 1)}
        {px(4, 3, body, 8, 1)}
        {px(4, 4, body, 8, 1)}
        {px(4, 5, body, 8, 1)}
        {px(4, 6, body, 8, 1)}
        {px(5, 7, bodyShade, 6, 1)}
        {px(3, 5, accent)}
        {px(12, 5, accent)}
        {px(6, 8, bodyShade, 4, 1)}
        {px(3, 9, body, 10, 7)}
        {px(3, 15, bodyShade, 10, 1)}
        {px(8, 9, bodyShade, 1, 6)}
        {px(7, 11, accent, 2, 2)}
        {px(7, 11, light, 1, 1)}
        {px(armL[0], armL[1], body, armL[2], armL[3])}
        {px(armR[0], armR[1], body, armR[2], armR[3])}
        {px(legL[0], legL[1], bodyShade, legL[2], legL[3])}
        {px(legR[0], legR[1], bodyShade, legR[2], legR[3])}
        {px(legL[0], legL[1] + legL[3] - 1, foot, legL[2] + 1, 1)}
        {px(legR[0] - 1, legR[1] + legR[3] - 1, foot, legR[2] + 1, 1)}
      </g>
    </svg>
  );
}

// ── PixelGlyph ────────────────────────────────────────────────────────
export type GlyphKind = "cube" | "diamond" | "orb" | "star" | "chip" | "ring";

export function PixelGlyph({ kind = "cube", size = 4, accent = "#34d399" }: {
  kind?: GlyphKind;
  size?: number;
  accent?: string;
}) {
  const body = "#cfe8dc";
  const gold = "#facc15";
  const dark = "#0a1a14";

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`g-${x}-${y}-${c}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges" />
  );

  const glyphs: Record<GlyphKind, React.ReactNode> = {
    cube: <>{px(2, 1, body, 4, 1)}{px(1, 2, body, 6, 1)}{px(1, 3, body, 6, 3)}{px(1, 6, body, 6, 1)}{px(2, 7, body, 4, 1)}{px(3, 3, accent, 2, 2)}</>,
    diamond: <>{px(3, 0, accent, 2, 1)}{px(2, 1, accent, 4, 1)}{px(1, 2, accent, 6, 1)}{px(0, 3, accent, 8, 2)}{px(1, 5, accent, 6, 1)}{px(2, 6, accent, 4, 1)}{px(3, 7, accent, 2, 1)}</>,
    orb: <>{px(2, 1, body, 4, 1)}{px(1, 2, body, 6, 4)}{px(2, 6, body, 4, 1)}{px(2, 3, accent, 2, 2)}</>,
    star: <>{px(3, 0, gold, 2, 1)}{px(3, 1, gold, 2, 1)}{px(0, 3, gold, 8, 2)}{px(3, 5, gold, 2, 1)}{px(3, 6, gold, 2, 2)}</>,
    chip: <>{px(0, 2, accent, 1, 1)}{px(2, 2, accent, 1, 1)}{px(5, 2, accent, 1, 1)}{px(7, 2, accent, 1, 1)}{px(1, 3, body, 6, 3)}{px(0, 4, accent, 1, 1)}{px(7, 4, accent, 1, 1)}{px(2, 4, dark, 4, 1)}{px(2, 5, dark, 4, 1)}{px(0, 5, accent, 1, 1)}{px(7, 5, accent, 1, 1)}{px(1, 6, body, 6, 1)}{px(2, 7, accent, 1, 1)}{px(5, 7, accent, 1, 1)}</>,
    ring: <>{px(2, 1, accent, 4, 1)}{px(1, 2, accent, 1, 1)}{px(6, 2, accent, 1, 1)}{px(1, 3, accent, 1, 3)}{px(6, 3, accent, 1, 3)}{px(1, 6, accent, 1, 1)}{px(6, 6, accent, 1, 1)}{px(2, 7, accent, 4, 1)}</>,
  };

  return (
    <svg
      width={8 * size}
      height={8 * size}
      viewBox="0 0 8 8"
      style={{ imageRendering: "pixelated", overflow: "visible" }}
    >
      {glyphs[kind] || glyphs.cube}
    </svg>
  );
}

// ── Scene — full backdrop per variant ────────────────────────────────
export type SceneVariant = "run" | "hero" | "stand" | "sit" | "climb" | "orbit" | "wave";

interface SceneConfig {
  pose: RobotPose;
  robotY: string;
  robotX: string;
}

const VARIANTS: Record<SceneVariant, SceneConfig> = {
  run:    { pose: "run",     robotY: "62%", robotX: "48%" },
  hero:   { pose: "look-up", robotY: "70%", robotX: "48%" },
  stand:  { pose: "stand",   robotY: "66%", robotX: "48%" },
  sit:    { pose: "sit",     robotY: "70%", robotX: "48%" },
  climb:  { pose: "climb",   robotY: "55%", robotX: "45%" },
  orbit:  { pose: "stand",   robotY: "66%", robotX: "48%" },
  wave:   { pose: "wave",    robotY: "66%", robotX: "48%" },
};

export function AYScene({
  variant = "run",
  intensity = 1,
  className = "",
}: {
  variant?: SceneVariant;
  intensity?: number;
  className?: string;
}) {
  const v = VARIANTS[variant] || VARIANTS.run;
  const glyphKinds: GlyphKind[] = ["cube", "chip", "diamond", "orb", "ring", "star"];

  const robotAnimation =
    variant === "run" ? "ay-run-bob 0.28s steps(2) infinite"
    : variant === "hero" ? "ay-breathe 3s ease-in-out infinite"
    : variant === "orbit" ? "ay-breathe 2s ease-in-out infinite"
    : "ay-breathe 4s ease-in-out infinite";

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 0%, #0e2018 0%, #05090a 55%, #020306 100%)",
      }}
    >
      <Aurora intensity={intensity} />
      <Starfield count={45} seed={variant.length} />
      <Horizon y={58} />

      {/* Floating glyphs — hero variant */}
      {variant === "hero" && (
        <>
          <div className="absolute" style={{ top: "18%", left: "15%", animation: "ay-float 7s ease-in-out infinite" }}>
            <PixelGlyph kind="cube" size={3} />
          </div>
          <div className="absolute" style={{ top: "12%", right: "18%", animation: "ay-float 8s ease-in-out 1s infinite" }}>
            <PixelGlyph kind="chip" size={3} />
          </div>
          <div className="absolute" style={{ top: "32%", left: "70%", animation: "ay-float 6s ease-in-out 2s infinite" }}>
            <PixelGlyph kind="diamond" size={2.5} />
          </div>
          <div className="absolute" style={{ top: "40%", left: "10%", animation: "ay-float 9s ease-in-out 0.5s infinite" }}>
            <PixelGlyph kind="ring" size={2.5} />
          </div>
        </>
      )}

      {/* Orbit variant — spinning ring of glyphs */}
      {variant === "orbit" && (
        <div
          className="absolute"
          style={{
            top: "30%",
            left: "50%",
            width: 240,
            height: 240,
            transform: "translate(-50%, 0)",
            animation: "ay-spin 18s linear infinite",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translate(110px) rotate(-${deg}deg)`,
              }}
            >
              <PixelGlyph kind={glyphKinds[i]} size={2.5} />
            </div>
          ))}
        </div>
      )}

      {/* Climb variant — pixel staircase */}
      {variant === "climb" && (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          className="absolute w-full"
          style={{ left: 0, right: 0, bottom: "20%", height: "60%", opacity: 0.85 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} opacity={1 - i * 0.14}>
              <rect
                x={160 - i * 6} y={300 - i * 40}
                width={80 + i * 12} height={8}
                fill="rgba(52,211,153,0.35)"
                shapeRendering="crispEdges"
              />
              <rect
                x={160 - i * 6} y={308 - i * 40}
                width={80 + i * 12} height={2}
                fill="rgba(110,231,183,0.8)"
                shapeRendering="crispEdges"
              />
            </g>
          ))}
        </svg>
      )}

      {/* Pixel robot */}
      <div
        className="absolute"
        style={{
          top: v.robotY,
          left: v.robotX,
          transform: "translate(-50%, -100%)",
          animation: robotAnimation,
          filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(16,185,129,0.4))",
        }}
      >
        <PixelRobot pose={v.pose} scale={3} />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: v.robotY,
          transform: "translate(-50%, -10%)",
          width: 80,
          height: 12,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
          filter: "blur(3px)",
        }}
      />

      <GrainLayer opacity={0.06} />
    </div>
  );
}
