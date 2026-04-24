"use client";

/**
 * A-Y Loading States — pixel-dark design system
 * Based on EyVay Loading States v1.0 design spec
 *
 * Exports:
 *  - ChatThinkingBubble   → chat AI thinking state
 *  - SkeletonCard         → single card skeleton
 *  - SkeletonList         → list of skeleton cards
 *  - SkeletonDashboard    → dashboard skeleton (hero + grid)
 *  - PageProgressBar      → top slim bar on route change
 *  - OfflineDetector      → network-lost overlay/banner
 *  - PixelDots            → 3-dot micro spinner (inline)
 *  - PixelSpinner         → rotating square micro spinner
 *  - LinearSweep          → horizontal sweep bar
 *  - PulseDot             → pulsing pixel dot (badge)
 *  - AnalysisLoading      → onboarding AI analysis full-screen
 *  - SuccessScreen        → analysis complete transition
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

// ── Color tokens ─────────────────────────────────────────────────────────
const C = {
  em300: "#6ee7b7",
  em400: "#34d399",
  em500: "#10b981",
  em700: "#047857",
  em900: "#064e3b",
  ink950: "#020306",
  ink900: "#05090a",
  text: "#e8efea",
  muted: "rgba(232,239,234,0.55)",
  dim: "rgba(232,239,234,0.35)",
  error: "#f87171",
};

// ── Shimmer helper ────────────────────────────────────────────────────────
const shimmerStyle = (delay = 0): React.CSSProperties => ({
  background: `linear-gradient(90deg, rgba(110,231,183,0.06) 0%, rgba(110,231,183,0.16) 50%, rgba(110,231,183,0.06) 100%)`,
  backgroundSize: "200% 100%",
  animation: `ay-shimmer 1.8s ease-in-out ${delay}s infinite`,
  borderRadius: 6,
});

// ── CSS injection (animations) ────────────────────────────────────────────
const STYLE = `
@keyframes ay-shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
@keyframes ay-dot { 0%,20%{opacity:.25;transform:translateY(0)} 50%{opacity:1;transform:translateY(-5px)} 80%,100%{opacity:.25;transform:translateY(0)} }
@keyframes ay-pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
@keyframes ay-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes ay-spin-pixel { 0%,24%{transform:rotate(0)} 25%,49%{transform:rotate(90deg)} 50%,74%{transform:rotate(180deg)} 75%,99%{transform:rotate(270deg)} 100%{transform:rotate(360deg)} }
@keyframes ay-sweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
@keyframes ay-fill { 0%{width:5%} 70%{width:85%} 100%{width:97%} }
@keyframes ay-progress-fill { 0%{width:0%} 70%{width:80%} 100%{width:95%} }
@keyframes ay-progress-done { 0%{width:95%} 100%{width:100%} }
@keyframes ay-orbit { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
@keyframes ay-breathe { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-3px) scale(1.02)} }
@keyframes ay-twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
@keyframes ay-slide-down { from{transform:translateY(-120%);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes ay-slide-up { from{transform:translateY(120%);opacity:0} to{transform:translateY(0);opacity:1} }
`;

function StyleInjector() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "ay-loading-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// 01 · ChatThinkingBubble
// Used in ChatClient when streaming=true and content=""
// ─────────────────────────────────────────────────────────────────────────
export function ChatThinkingBubble() {
  return (
    <>
      <StyleInjector />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Dots + label */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "14px 18px",
          background: "rgba(15,23,26,0.75)",
          border: `1px solid rgba(110,231,183,0.22)`,
          borderRadius: "16px 16px 16px 4px",
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 0.15, 0.3].map((d, k) => (
              <div key={k} style={{
                width: 7, height: 7,
                background: C.em300,
                animation: `ay-dot 1.2s ease-in-out ${d}s infinite`,
              }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "Vazirmatn" }}>
            دارم فکر می‌کنم…
          </span>
        </div>

        {/* Shimmer preview lines */}
        <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: 7 }}>
          {[80, 65, 50].map((w, k) => (
            <div key={k} style={{ height: 9, width: `${w}%`, ...shimmerStyle(k * 0.15) }} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 02 · SkeletonCard
// ─────────────────────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <>
      <StyleInjector />
      <div style={{
        padding: "16px",
        borderRadius: 14,
        background: "rgba(15,23,26,0.45)",
        border: "1px solid rgba(110,231,183,0.08)",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}>
        {/* Avatar */}
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, ...shimmerStyle(0) }} />
        {/* Content */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ height: 13, width: "65%", ...shimmerStyle(0.08), marginBottom: 8 }} />
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} style={{ height: 10, width: `${50 - i * 12}%`, ...shimmerStyle(0.15 + i * 0.08), marginBottom: i < lines - 1 ? 6 : 0 }} />
          ))}
        </div>
        {/* Right badge */}
        <div style={{ width: 36, height: 20, borderRadius: 6, flexShrink: 0, ...shimmerStyle(0.2) }} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 03 · SkeletonList
// ─────────────────────────────────────────────────────────────────────────
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      <StyleInjector />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} lines={i % 2 === 0 ? 2 : 1} />
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 04 · SkeletonDashboard
// ─────────────────────────────────────────────────────────────────────────
export function SkeletonDashboard() {
  return (
    <>
      <StyleInjector />
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Hero card */}
        <div style={{
          padding: "20px",
          borderRadius: 16,
          background: "rgba(15,23,26,0.5)",
          border: "1px solid rgba(110,231,183,0.1)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, ...shimmerStyle(0) }} />
            <div style={{ height: 20, width: 64, ...shimmerStyle(0.15), borderRadius: 6 }} />
          </div>
          <div style={{ height: 18, width: "70%", ...shimmerStyle(0.1), marginBottom: 10 }} />
          <div style={{ height: 11, width: "90%", ...shimmerStyle(0.2), marginBottom: 6 }} />
          <div style={{ height: 11, width: "55%", ...shimmerStyle(0.25) }} />
        </div>

        {/* 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[0, 0.1, 0.2, 0.3].map((d, i) => (
            <div key={i} style={{
              padding: "16px",
              borderRadius: 14,
              background: "rgba(15,23,26,0.4)",
              border: "1px solid rgba(110,231,183,0.07)",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, ...shimmerStyle(d), marginBottom: 10 }} />
              <div style={{ height: 12, width: "65%", ...shimmerStyle(d + 0.1), marginBottom: 7 }} />
              <div style={{ height: 10, width: "40%", ...shimmerStyle(d + 0.2) }} />
            </div>
          ))}
        </div>

        {/* List rows */}
        <SkeletonList count={3} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 05 · PageProgressBar
// Thin emerald bar at the very top on route change (client navigation)
// Add <PageProgressBar /> once in the root layout
// ─────────────────────────────────────────────────────────────────────────
export function PageProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    setProgress("loading");
    const done = setTimeout(() => setProgress("done"), 600);
    const idle = setTimeout(() => setProgress("idle"), 900);
    return () => { clearTimeout(done); clearTimeout(idle); };
  }, [pathname]);

  if (progress === "idle") return null;

  return (
    <>
      <StyleInjector />
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 2,
        zIndex: 9999,
        background: "rgba(110,231,183,0.1)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          background: `linear-gradient(90deg, ${C.em700}, ${C.em300}, ${C.em400})`,
          boxShadow: `0 0 8px ${C.em300}`,
          animation: progress === "loading"
            ? "ay-progress-fill 0.6s ease-out forwards"
            : "ay-progress-done 0.3s ease-out forwards",
        }} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 06 · OfflineDetector
// Shows a bottom banner when the device goes offline
// Add <OfflineDetector /> once in the root layout
// ─────────────────────────────────────────────────────────────────────────
export function OfflineDetector() {
  const [offline, setOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => { setOffline(false); setRetryCount(0); setCountdown(5); };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => { window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);

  useEffect(() => {
    if (!offline) return;
    if (countdown <= 0) { setRetryCount((r) => r + 1); setCountdown(5); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [offline, countdown]);

  if (!offline) return null;

  return (
    <>
      <StyleInjector />
      <div
        dir="rtl"
        style={{
          position: "fixed",
          bottom: 80,
          left: 12, right: 12,
          zIndex: 9998,
          background: "rgba(5,9,10,0.97)",
          border: "1px solid rgba(248,113,113,0.35)",
          borderRadius: 16,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          animation: "ay-slide-up 0.3s ease-out",
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
        {/* Sleeping mascot mini */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(248,113,113,0.12)",
          border: "1px solid rgba(248,113,113,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          😴
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.error, marginBottom: 2 }}>
            اینترنت قطعه
          </div>
          <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.5 }}>
            پیشرفتت ذخیره شده · تلاش مجدد در {countdown} ثانیه
          </div>
        </div>

        {/* Retry indicator */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: `2px solid rgba(248,113,113,0.4)`,
          borderTopColor: C.error,
          animation: "ay-orbit 1.2s linear infinite",
          flexShrink: 0,
        }} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 07 · Micro spinners — inline utilities
// ─────────────────────────────────────────────────────────────────────────

/** 3 bouncing pixel dots — use in buttons, chat, small areas */
export function PixelDots({
  color = C.em300,
  size = 6,
  gap = 4,
}: {
  color?: string;
  size?: number;
  gap?: number;
}) {
  return (
    <>
      <StyleInjector />
      <span style={{ display: "inline-flex", gap, alignItems: "center" }}>
        {[0, 0.15, 0.3].map((d, k) => (
          <span key={k} style={{
            display: "inline-block",
            width: size, height: size,
            background: color,
            animation: `ay-dot 1.2s ease-in-out ${d}s infinite`,
          }} />
        ))}
      </span>
    </>
  );
}

/** Rotating 4-corner pixel spinner */
export function PixelSpinner({ size = 20, color = C.em300 }: { size?: number; color?: string }) {
  const d = Math.round(size * 0.18);
  const center = Math.round(size / 2 - d / 2);
  return (
    <>
      <StyleInjector />
      <span style={{ display: "inline-block", width: size, height: size, position: "relative", animation: `ay-spin-pixel 1.2s steps(4) infinite`, transformOrigin: "center", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 0, left: center, width: d, height: d, background: color }} />
        <span style={{ position: "absolute", top: center, right: 0, width: d, height: d, background: color, opacity: 0.7 }} />
        <span style={{ position: "absolute", bottom: 0, left: center, width: d, height: d, background: color, opacity: 0.45 }} />
        <span style={{ position: "absolute", top: center, left: 0, width: d, height: d, background: color, opacity: 0.2 }} />
      </span>
    </>
  );
}

/** Horizontal sweep bar — use inside containers */
export function LinearSweep({ color = C.em300, height = 2 }: { color?: string; height?: number }) {
  return (
    <>
      <StyleInjector />
      <div style={{ width: "100%", height, background: `rgba(110,231,183,0.12)`, borderRadius: height, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: "35%",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: "ay-sweep 1.6s ease-in-out infinite",
        }} />
      </div>
    </>
  );
}

/** Pulsing dot badge */
export function PulseDot({ color = C.em300, size = 8 }: { color?: string; size?: number }) {
  return (
    <>
      <StyleInjector />
      <span style={{
        display: "inline-block",
        width: size, height: size,
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: "ay-pulse 1.2s ease-in-out infinite",
        flexShrink: 0,
      }} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 08 · AnalysisLoading
// Full-screen analysis loader — replaces the simple step-list in onboarding
// ─────────────────────────────────────────────────────────────────────────
const ANALYSIS_LINES = [
  "دارم شغلت رو می‌خونم…",
  "مهارت‌هات رو دسته‌بندی می‌کنم…",
  "با ۲.۳ میلیون داده مقایسه می‌کنم…",
  "ریسک AI رو حساب می‌کنم…",
  "مسیر رشد پیشنهادی می‌سازم…",
];

export function AnalysisLoading({ step = 0 }: { step?: number }) {
  const [lineIdx, setLineIdx] = useState(step < ANALYSIS_LINES.length ? step : 0);
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      x: ((i * 137 + 23) % 100),
      y: ((i * 97 + 17) % 100),
      s: i % 5 === 0 ? 2 : 1,
      o: 0.2 + (i % 4) * 0.15,
      d: 2 + (i % 3),
      delay: (i % 4) * 0.8,
    })), []);

  useEffect(() => {
    const t = setInterval(() => setLineIdx((v) => (v + 1) % ANALYSIS_LINES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <StyleInjector />
      <div
        dir="rtl"
        style={{
          position: "fixed", inset: 0, zIndex: 9990,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,0.22) 0%, #020306 65%)`,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 0,
          fontFamily: "Vazirmatn, sans-serif",
          color: C.text,
          overflow: "hidden",
        }}
      >
        {/* Stars */}
        {stars.map((st, i) => (
          <div key={i} style={{
            position: "absolute", left: `${st.x}%`, top: `${st.y}%`,
            width: st.s, height: st.s, background: C.em300, opacity: st.o,
            boxShadow: `0 0 ${st.s * 2}px ${C.em300}66`,
            animation: `ay-twinkle ${st.d}s ease-in-out ${st.delay}s infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Mono status */}
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.em300, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>
          AI · ANALYZING
        </div>

        {/* Orbit + mascot */}
        <div style={{ position: "relative", width: 220, height: 220, marginBottom: 40 }}>
          {/* Orbit rings */}
          <div style={{ position: "absolute", inset: 35, border: `1px dashed rgba(110,231,183,0.3)`, borderRadius: "50%", animation: "ay-orbit 10s linear infinite" }} />
          <div style={{ position: "absolute", inset: 8, border: `1px solid rgba(110,231,183,0.12)`, borderRadius: "50%", animation: "ay-orbit 16s linear infinite reverse" }} />

          {/* Orbiting glyphs */}
          {[C.em300, "#fcd34d", "#a78bfa", "#22d3ee", "#fb923c"].map((col, k) => (
            <div key={k} style={{
              position: "absolute", inset: 0,
              animation: `ay-orbit ${8 + k * 1.5}s linear infinite`,
              transform: `rotate(${k * 72}deg)`,
            }}>
              <div style={{
                position: "absolute", top: -5, left: "50%",
                transform: "translateX(-50%)",
                width: 10, height: 10, background: col,
                boxShadow: `0 0 10px ${col}`,
              }} />
            </div>
          ))}

          {/* Center robot emoji */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "ay-breathe 2.4s ease-in-out infinite",
          }}>
            <div style={{ fontSize: 52, lineHeight: 1 }}>🤖</div>
          </div>
        </div>

        {/* Cycling text */}
        <div style={{ position: "relative", height: 52, width: 280, textAlign: "center", marginBottom: 28 }}>
          {ANALYSIS_LINES.map((line, k) => (
            <div key={k} style={{
              position: "absolute", left: 0, right: 0,
              fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.5,
              opacity: k === lineIdx ? 1 : 0,
              transform: k === lineIdx ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.45s ease",
            }}>
              {line}
            </div>
          ))}
        </div>

        {/* Step indicators */}
        <div style={{ width: 240, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.muted, direction: "ltr" }}>
              STEP {lineIdx + 1}/5
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.muted, direction: "ltr" }}>
              ~{(5 - lineIdx) * 4}s LEFT
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: k <= lineIdx ? C.em300 : "rgba(110,231,183,0.12)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>

        {/* Hint */}
        <div style={{ textAlign: "center", fontSize: 11, color: C.dim, lineHeight: 1.7 }}>
          این تحلیل معمولاً ۲۰ ثانیه طول می‌کشه.
          <br />
          <span style={{ color: C.muted }}>می‌تونی مرورگر رو ببندی — کار ادامه داره.</span>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 09 · SuccessScreen
// Shown after analysis completes — before redirect
// ─────────────────────────────────────────────────────────────────────────
export function SuccessScreen({ onContinue }: { onContinue?: () => void }) {
  const confetti = useMemo(() =>
    Array.from({ length: 14 }, (_, k) => ({
      left: 8 + (k * 6.5) % 84,
      top: 5 + (k * 13.7) % 55,
      col: [C.em300, "#fcd34d", "#a78bfa", "#22d3ee", "#fb923c"][k % 5],
      dur: 1.8 + (k % 4) * 0.5,
      delay: (k % 5) * 0.35,
    })), []);

  return (
    <>
      <StyleInjector />
      <div
        dir="rtl"
        style={{
          position: "fixed", inset: 0, zIndex: 9990,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.35) 0%, #020306 65%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 32, textAlign: "center", gap: 24,
          fontFamily: "Vazirmatn, sans-serif", color: C.text,
          overflow: "hidden",
        }}
      >
        {/* Confetti pixels */}
        {confetti.map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: `${c.left}%`, top: `${c.top}%`,
            width: 7, height: 7, background: c.col, opacity: 0.85,
            animation: `ay-float ${c.dur}s ease-in-out ${c.delay}s infinite`,
          }} />
        ))}

        {/* Check mark */}
        <div style={{
          width: 88, height: 88, borderRadius: 24,
          background: C.em300, display: "grid", placeItems: "center",
          boxShadow: `0 0 0 6px rgba(52,211,153,0.18), 0 0 40px ${C.em500}`,
          animation: "ay-breathe 2s ease-in-out infinite",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path d="M 6 12 L 10 16 L 18 8" stroke={C.ink950} strokeWidth="4" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>

        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.em300, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
            READY
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: C.text, margin: "0 0 8px", letterSpacing: -0.6, lineHeight: 1.15 }}>
            نقشه‌ت آماده‌ست.
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.7, maxWidth: 240 }}>
            مسیر شغلی‌ات رو ساختم — بریم ببینیم.
          </p>
        </div>

        {onContinue && (
          <button
            onClick={onContinue}
            style={{
              background: C.em300, color: C.ink950,
              border: "none", padding: "16px 36px",
              fontSize: 15, fontWeight: 800, borderRadius: 12,
              fontFamily: "Vazirmatn, sans-serif", cursor: "pointer",
              boxShadow: `0 6px 24px rgba(16,185,129,0.5)`,
            }}
          >
            بریم ببینیم ←
          </button>
        )}
      </div>
    </>
  );
}
