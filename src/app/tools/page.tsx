"use client";

import { ArrowRight, Lock, Crown, ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface Tool {
  name: string;
  tag: string;
  tone: "gold" | "emerald" | "cyan" | "violet" | "rose";
  use: string;
  level: string;
  locked: boolean;
  hero?: boolean;
  heroDesc?: string;
}

const TOOLS: Tool[] = [
  {
    name: "Cursor",
    tag: "کر",
    tone: "gold",
    use: "بررسی کد با توسعه‌دهنده‌ها",
    level: "متوسط",
    locked: false,
    hero: true,
    heroDesc:
      "کد PRها رو باز کن و با توسعه‌دهنده‌ها زبون مشترک پیدا کن. ۶ ساعت تمرین کافیه.",
  },
  {
    name: "Claude",
    tag: "کل",
    tone: "emerald",
    use: "نوشتن بریف و پژوهش ثانویه",
    level: "مبتدی",
    locked: false,
  },
  {
    name: "v0",
    tag: "ویز",
    tone: "cyan",
    use: "تبدیل وایرفریم به کد React",
    level: "متوسط",
    locked: false,
  },
  {
    name: "Figma AI",
    tag: "فی",
    tone: "violet",
    use: "auto-layout و بازسازی پترن",
    level: "مبتدی",
    locked: true,
  },
  {
    name: "Midjourney",
    tag: "ام",
    tone: "rose",
    use: "مودبُرد و ایده‌پردازی تصویری",
    level: "پیشرفته",
    locked: true,
  },
];

const TONE_COLORS = {
  gold: { bg: "rgba(250,204,21,0.14)", text: "#fde68a", border: "rgba(250,204,21,0.28)" },
  emerald: { bg: "rgba(16,185,129,0.14)", text: "#6ee7b7", border: "rgba(52,211,153,0.28)" },
  cyan: { bg: "rgba(6,182,212,0.14)", text: "#67e8f9", border: "rgba(6,182,212,0.28)" },
  violet: { bg: "rgba(139,92,246,0.14)", text: "#c4b5fd", border: "rgba(139,92,246,0.28)" },
  rose: { bg: "rgba(244,63,94,0.14)", text: "#fda4af", border: "rgba(244,63,94,0.28)" },
};

function ToolGlyph({ tag, tone, size = 40 }: { tag: string; tone: Tool["tone"]; size?: number }) {
  const c = TONE_COLORS[tone];
  return (
    <div
      className="flex-shrink-0 grid place-items-center rounded-xl font-black"
      style={{
        width: size,
        height: size,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: size * 0.32,
        borderRadius: size * 0.26,
      }}
    >
      {tag}
    </div>
  );
}

export default function ToolsPage() {
  const hero = TOOLS.find((t) => t.hero)!;
  const rest = TOOLS.filter((t) => !t.hero);

  return (
    <div
      dir="rtl"
      className="min-h-screen pb-28"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: "rgba(2,3,6,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(110,231,183,0.08)",
        }}
      >
        <div className="mx-auto max-w-lg px-5 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
            style={{
              background: "rgba(31,46,40,0.6)",
              border: "1px solid rgba(110,231,183,0.14)",
            }}
          >
            <ArrowRight size={16} className="text-white" />
          </Link>
          <div className="flex-1 flex justify-center">
            <span
              className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#6ee7b7",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              ابزارهای AI من
            </span>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Hero tool */}
        <div
          className="relative overflow-hidden rounded-2xl p-4 mb-4"
          style={{
            background: "linear-gradient(180deg, rgba(42,29,3,0.75) 0%, rgba(18,12,1,0.6) 100%)",
            border: "1px solid rgba(250,204,21,0.28)",
          }}
        >
          {/* Gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(250,204,21,0.18), transparent 60%)",
            }}
          />

          <div className="relative flex items-center gap-3 mb-3">
            <ToolGlyph tag={hero.tag} tone={hero.tone} size={52} />
            <div className="flex-1">
              <div
                className="text-[10px] font-bold tracking-[2px] uppercase"
                style={{ color: "#fde68a", fontFamily: "'JetBrains Mono', monospace" }}
              >
                ابزار اول هفته
              </div>
              <div
                className="font-black text-[22px] mt-0.5 leading-none"
                style={{ color: "#fde68a" }}
              >
                {hero.name}
              </div>
            </div>
          </div>

          <p className="relative text-[12.5px] leading-relaxed mb-3" style={{ color: "rgba(232,239,234,0.78)" }}>
            {hero.heroDesc}
          </p>

          <button
            className="h-9 px-5 rounded-xl text-[13px] font-bold"
            style={{
              background: "linear-gradient(180deg, #fde68a, #eab308)",
              color: "#2a1d03",
            }}
          >
            شروع کن
          </button>
        </div>

        {/* Tool list */}
        <div className="flex flex-col gap-2 mb-4">
          {rest.map((tool, i) => {
            const c = TONE_COLORS[tool.tone];
            return (
              <div
                key={i}
                className="relative flex items-center gap-3 p-3 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(31,46,40,0.55)",
                  border: "1px solid rgba(110,231,183,0.10)",
                  backdropFilter: "blur(10px)",
                  opacity: tool.locked ? 1 : 1,
                }}
              >
                <ToolGlyph tag={tool.tag} tone={tool.tone} size={40} />
                <div className="flex-1 min-w-0" style={{ opacity: tool.locked ? 0.4 : 1 }}>
                  <div className="font-bold text-[13.5px]">{tool.name}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: "rgba(232,239,234,0.6)" }}>
                    {tool.use}
                  </div>
                </div>

                {!tool.locked && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {tool.level}
                  </span>
                )}
                {tool.locked && (
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(270deg, rgba(5,9,10,0.85) 0%, transparent 50%)",
                      }}
                    />
                    <Lock size={16} style={{ color: "rgba(250,204,21,0.7)" }} strokeWidth={1.8} />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl mb-4"
          style={{
            background: "linear-gradient(180deg, rgba(42,29,3,0.55), rgba(18,12,1,0.5))",
            border: "1px solid rgba(250,204,21,0.25)",
          }}
        >
          <Crown size={22} style={{ color: "#fde68a" }} strokeWidth={1.8} />
          <div className="flex-1">
            <div className="font-bold text-[13px]">با پرو، همه ابزارها باز می‌شن</div>
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(232,239,234,0.55)" }}>
              + هر هفته ۳ ابزار تازه
            </div>
          </div>
          <Link
            href="/billing"
            className="h-8 px-4 rounded-xl text-[12px] font-bold flex items-center"
            style={{
              background: "linear-gradient(180deg, #fde68a, #eab308)",
              color: "#2a1d03",
            }}
          >
            ارتقا
          </Link>
        </div>

        {/* Footer kicker */}
        <div className="flex items-center gap-2 py-4" style={{ color: "rgba(110,231,183,0.5)" }}>
          <Zap size={12} />
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            هر هفته ابزار جدید اضافه می‌شه
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
