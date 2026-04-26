"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MascotArt } from "@/app/components/PixelMascot";

const PLAN_NAMES: Record<string, string> = { pro: "پرو", max: "مکس" };

const CONFETTI_COLORS = ["#6ee7b7", "#fcd34d", "#a78bfa", "#22d3ee", "#fb923c"];

function SuccessContent() {
  const params = useSearchParams();
  const ref  = params.get("ref") || "";
  const plan = params.get("plan") || "pro";
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);

  const confetti = useMemo(() =>
    Array.from({ length: 16 }, (_, k) => ({
      left: 5 + (k * 6.2) % 90,
      top: 4 + (k * 13.7) % 52,
      col: CONFETTI_COLORS[k % 5],
      dur: 1.8 + (k % 4) * 0.45,
      delay: (k % 5) * 0.3,
      size: k % 3 === 0 ? 10 : 7,
    })), []);

  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      x: ((i * 137 + 23) % 100),
      y: ((i * 97 + 17) % 100),
      s: i % 5 === 0 ? 2 : 1,
      o: 0.2 + (i % 4) * 0.15,
      d: 2 + (i % 3),
    })), []);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(16,185,129,0.28) 0%, #020306 65%)",
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        textAlign: "center",
        fontFamily: "'Vazirmatn Variable', Vazirmatn, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Stars */}
      {stars.map((st, i) => (
        <div key={i} style={{
          position: "absolute", left: `${st.x}%`, top: `${st.y}%`,
          width: st.s, height: st.s, background: "#6ee7b7", opacity: st.o,
          boxShadow: `0 0 ${st.s * 2}px rgba(110,231,183,0.66)`,
          animation: `ay-twinkle ${st.d}s ease-in-out ${i * 0.15}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Confetti pixels */}
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: "absolute", left: `${c.left}%`, top: `${c.top}%`,
          width: c.size, height: c.size, background: c.col, opacity: 0.85,
          animation: `ay-float ${c.dur}s ease-in-out ${c.delay}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @keyframes ay-twinkle{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes ay-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes ay-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
      `}</style>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, maxWidth: 320, width: "100%" }}>
        {/* Mascot in sparkle state */}
        <div style={{ animation: "ay-breathe 2.4s ease-in-out infinite" }}>
          <MascotArt state="sparkle" frame={frame} blink={false} scale={5} accent="#34d399" />
        </div>

        {/* Mono status */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#6ee7b7", letterSpacing: 3, textTransform: "uppercase" }}>
          READY
        </div>

        <div>
          <h1 style={{ margin: "0 0 10px", fontSize: 30, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.15, color: "#e8efea" }}>
            پلن {PLAN_NAMES[plan] || plan} فعال شد!
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(232,239,234,0.65)", lineHeight: 1.7, maxWidth: 260 }}>
            اشتراکت با موفقیت ثبت شد. همه امکانات الان در دسترست هستن.
          </p>
        </div>

        {ref && (
          <div style={{
            padding: "8px 16px", borderRadius: 10,
            background: "rgba(31,46,40,0.55)",
            border: "1px solid rgba(110,231,183,0.18)",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,239,234,0.45)" }}>
              کد پیگیری: {ref}
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          <Link
            href="/dashboard"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              height: 52, borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#04110a", fontWeight: 800, fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(52,211,153,0.35)",
            }}
          >
            <span>رفتن به داشبورد</span>
            <ArrowLeft size={16} />
          </Link>
          <Link
            href="/billing"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 44, borderRadius: 12,
              border: "1px solid rgba(110,231,183,0.18)",
              background: "rgba(31,46,40,0.35)",
              color: "rgba(232,239,234,0.6)", fontSize: 13,
              textDecoration: "none",
            }}
          >
            مشاهده اشتراک
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", minHeight: "100svh", alignItems: "center", justifyContent: "center", background: "#020306" }} />
    }>
      <SuccessContent />
    </Suspense>
  );
}
