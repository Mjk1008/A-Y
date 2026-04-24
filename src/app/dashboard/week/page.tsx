"use client";

import { ArrowRight, Check, Share2 } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface DayTask {
  day: string;
  task: string;
  time: string;
  tool: string;
  done: boolean;
  active?: boolean;
}

const DAYS: DayTask[] = [
  { day: "شنبه", task: "نصب Claude و تست اولیه", time: "۳۰ دقیقه", tool: "Claude", done: true },
  { day: "یکشنبه", task: "نوشتن پرامپت پژوهش کاربر", time: "۴۵ دقیقه", tool: "Claude", done: true },
  { day: "دوشنبه", task: "تمرین: یه بریف واقعی بنویس", time: "۱ ساعت", tool: "Claude", done: false, active: true },
  { day: "سه‌شنبه", task: "آشنایی با v0", time: "۳۰ دقیقه", tool: "v0", done: false },
  { day: "چهارشنبه", task: "ساخت یه فرم ساده", time: "۴۵ دقیقه", tool: "v0", done: false },
  { day: "پنج‌شنبه", task: "بازبینی + یادداشت", time: "۳۰ دقیقه", tool: "—", done: false },
  { day: "جمعه", task: "استراحت و جمع‌بندی", time: "—", tool: "—", done: false },
];

const doneDays = DAYS.filter((d) => d.done).length;
const progressPct = Math.round((doneDays / DAYS.length) * 100);

export default function WeekDetailPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen pb-28"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.08), transparent 60%), #020306",
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
            href="/dashboard/analysis"
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
              هفتهٔ اول
            </span>
          </div>
          <button
            className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
            style={{
              background: "rgba(31,46,40,0.6)",
              border: "1px solid rgba(110,231,183,0.14)",
            }}
          >
            <Share2 size={15} className="text-white" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Week title */}
        <div className="mb-6">
          <div
            className="text-[10px] font-bold tracking-[2px] uppercase mb-1"
            style={{ color: "rgba(110,231,183,0.65)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            هفتهٔ ۱ از ۴
          </div>
          <h1
            className="text-[28px] font-black tracking-tight leading-tight mb-4"
          >
            پایه‌ریزی.
          </h1>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-2">
              <span style={{ color: "rgba(232,239,234,0.6)" }}>پیشرفت</span>
              <span
                className="font-bold"
                style={{ color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {doneDays} از {DAYS.length} روز
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(110,231,183,0.12)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                  boxShadow: "0 0 10px rgba(52,211,153,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Day tasks */}
        <div className="flex flex-col gap-2 mb-6">
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl"
              style={{
                background: day.active
                  ? "rgba(16,185,129,0.10)"
                  : "rgba(31,46,40,0.50)",
                border: `1px solid ${day.active ? "rgba(110,231,183,0.4)" : "rgba(110,231,183,0.08)"}`,
                backdropFilter: "blur(10px)",
                opacity: day.done ? 0.65 : 1,
              }}
            >
              {/* Checkbox */}
              <div
                className="w-[22px] h-[22px] rounded-[7px] flex-shrink-0 grid place-items-center"
                style={{
                  background: day.done ? "#34d399" : "transparent",
                  border: day.done
                    ? "none"
                    : `2px solid ${day.active ? "#34d399" : "rgba(110,231,183,0.3)"}`,
                }}
              >
                {day.done && <Check size={12} strokeWidth={3} style={{ color: "#04110a" }} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[12px] font-bold"
                    style={{ color: day.active ? "#6ee7b7" : "rgba(232,239,234,0.7)" }}
                  >
                    {day.day}
                  </span>
                  {day.tool !== "—" && (
                    <span
                      className="text-[10px]"
                      style={{
                        color: "rgba(232,239,234,0.4)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      · {day.tool}
                    </span>
                  )}
                </div>
                <div
                  className="text-[13px] mt-0.5"
                  style={{
                    color: day.done ? "rgba(232,239,234,0.5)" : "#e8efea",
                    textDecoration: day.done ? "line-through" : "none",
                  }}
                >
                  {day.task}
                </div>
              </div>

              {/* Time */}
              <span
                className="text-[10.5px] flex-shrink-0"
                style={{
                  color: "rgba(232,239,234,0.5)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {day.time}
              </span>
            </div>
          ))}
        </div>

        {/* Current task CTA */}
        <div
          className="p-4 rounded-2xl mb-4"
          style={{
            background: "linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.04))",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <div
            className="text-[10px] font-bold tracking-widest uppercase mb-2"
            style={{ color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace" }}
          >
            کار الان
          </div>
          <div className="font-bold text-[15px] mb-1">تمرین: یه بریف واقعی بنویس</div>
          <div className="text-[12px] mb-3" style={{ color: "rgba(232,239,234,0.6)" }}>
            یه پروژه‌ای که این هفته داری رو انتخاب کن و با Claude یه بریف کامل بنویس.
          </div>
          <Link
            href="/chat"
            className="h-10 px-5 rounded-xl text-[13px] font-bold inline-flex items-center"
            style={{
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#04110a",
              boxShadow: "0 4px 16px rgba(52,211,153,0.25)",
            }}
          >
            با Claude شروع کن
          </Link>
        </div>

        {/* Tools for this week */}
        <div
          className="text-[10px] font-bold tracking-[2px] uppercase mb-3"
          style={{ color: "rgba(110,231,183,0.6)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          ابزارهای این هفته
        </div>
        <div className="flex gap-2 mb-6">
          {["Claude", "v0"].map((tool) => (
            <Link
              key={tool}
              href="/tools"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold"
              style={{
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#6ee7b7",
              }}
            >
              {tool}
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
