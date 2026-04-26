"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PixelMascot } from "@/app/components/PixelMascot";

function MiniScene() {
  const stars = [[8, 12], [85, 8], [18, 22], [72, 18], [35, 9], [55, 32], [92, 28]];
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse 70% 45% at 50% 20%, rgba(16,185,129,0.22), transparent 60%),
                   radial-gradient(ellipse 60% 40% at 85% 10%, rgba(52,211,153,0.14), transparent 55%),
                   #020306`,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: "68%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(110,231,183,0.5), transparent)",
      }} />
      <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="none">
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
          <line key={i}
            x1={200 + i * 50} y1="800"
            x2="200" y2={800 * 0.68}
            stroke="rgba(110,231,183,0.10)" strokeWidth="1" strokeDasharray="2 4" />
        ))}
      </svg>
      {stars.map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute", left: `${x}%`, top: `${y}%`,
          width: 2, height: 2, background: "#6ee7b7",
          boxShadow: "0 0 4px #6ee7b7", opacity: 0.7,
          animation: `ay-twinkle ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
}

export default function LandingHero() {
  return (
    <section
      dir="rtl"
      style={{ minHeight: "100dvh", overflow: "hidden", position: "relative" }}
    >
      <style>{`@keyframes ay-twinkle{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
      <MiniScene />

      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
        background: "linear-gradient(to bottom, transparent, #020306)",
        zIndex: 10, pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 20,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "100px 24px 0",
        textAlign: "center",
        fontFamily: "'Vazirmatn Variable', Vazirmatn, sans-serif",
        color: "#e8efea",
      }}>
        {/* Kicker */}
        <div style={{
          padding: "5px 12px", borderRadius: 999,
          background: "rgba(16,185,129,0.14)", border: "1px solid rgba(110,231,183,0.3)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: 2, color: "#6ee7b7",
          textTransform: "uppercase", fontWeight: 700,
          marginBottom: 24,
        }}>
          راهنمای هوش مصنوعی شغلی
        </div>

        {/* Mascot */}
        <PixelMascot scale={8} accent="#34d399" />

        {/* Ground pixels */}
        <div style={{
          width: "100%", maxWidth: 320, height: 12, marginTop: 4,
          background: "repeating-linear-gradient(90deg, rgba(52,211,153,0.35) 0 6px, transparent 6px 14px)",
          opacity: 0.4,
        }} />

        {/* Headline */}
        <h1 style={{
          margin: "20px 0 0", fontWeight: 900, fontSize: 38,
          lineHeight: 1.05, letterSpacing: -1.2,
        }}>
          از <span style={{ color: "#6ee7b7" }}>AI</span> نترس،
          <br />
          ازش{" "}
          <span style={{
            background: "linear-gradient(120deg, #6ee7b7 0%, #34d399 50%, #fcd34d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            استفاده کن.
          </span>
        </h1>

        <p style={{
          margin: "14px 0 0", fontSize: 14,
          color: "rgba(232,239,234,0.65)", lineHeight: 1.7, maxWidth: 300,
        }}>
          یک دستیار پیکسلی و مهربون که می‌گه کدوم ابزار AI رو{" "}
          <strong style={{ color: "#e8efea" }}>برای شغل خودت</strong> یاد بگیری — قدم به قدم.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: 10, width: "100%", maxWidth: 320,
          marginTop: 28,
        }}>
          <Link href="/signup" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #34d399, #10b981)",
            color: "#04110a", fontWeight: 800, fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(52,211,153,0.35)",
          }}>
            <span>شروع رایگان</span>
            <ArrowLeft size={16} />
          </Link>
          <Link href="#how" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            paddingInline: 18, height: 52, borderRadius: 14,
            border: "1px solid rgba(110,231,183,0.25)",
            background: "rgba(16,185,129,0.06)",
            color: "#6ee7b7", fontWeight: 700, fontSize: 13,
            textDecoration: "none",
          }}>
            ببین چطور
          </Link>
        </div>

        {/* Trust row */}
        <div style={{
          marginTop: 24, marginBottom: 80,
          display: "flex", alignItems: "center", gap: 12,
          opacity: 0.65,
        }}>
          <div style={{ display: "flex" }}>
            {(["ع", "س", "م", "ن"] as const).map((c, i) => (
              <div key={i} style={{
                marginInlineStart: i ? -8 : 0,
                width: 28, height: 28, borderRadius: "50%",
                background: [
                  "linear-gradient(135deg, #10b981, #047857)",
                  "linear-gradient(135deg, #eab308, #ca8a04)",
                  "linear-gradient(135deg, #0891b2, #155e75)",
                  "linear-gradient(135deg, #8b5cf6, #5b21b6)",
                ][i],
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#04110a",
              }}>
                {c}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "rgba(232,239,234,0.7)" }}>
            +۲٬۴۰۰ متخصص ایرانی
          </span>
        </div>
      </div>
    </section>
  );
}
