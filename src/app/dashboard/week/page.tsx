import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import type { AnalysisResult } from "@/lib/claude";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";

const WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

export default async function WeekDetailPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [latestRes, progressRes] = await Promise.all([
    pool.query(
      "SELECT id, result_json FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
      [session.id]
    ),
    pool
      .query(
        `SELECT week_num, day_num, task_key, completed
         FROM roadmap_progress WHERE user_id=$1`,
        [session.id]
      )
      .catch(() => ({ rows: [] })),
  ]);

  const latest = latestRes.rows[0] ?? null;
  if (!latest) redirect("/dashboard/analysis");

  const r = latest.result_json as AnalysisResult;
  const roadmap = r.roadmap ?? [];
  if (roadmap.length === 0) redirect("/dashboard/analysis#roadmap");

  const progressRows = progressRes.rows as Array<{
    week_num: number; day_num: number; task_key: string; completed: boolean;
  }>;
  const completedSet = new Set(
    progressRows.filter((p) => p.completed).map((p) => `${p.week_num}-${p.day_num}-goal`)
  );

  // Find current week = first week with any incomplete goal
  let currentWeekIdx = 0;
  for (let wi = 0; wi < roadmap.length; wi++) {
    const hasIncomplete = roadmap[wi].goals.some(
      (_, gi) => !completedSet.has(`${wi}-${gi}-goal`)
    );
    if (hasIncomplete) { currentWeekIdx = wi; break; }
    if (wi === roadmap.length - 1) currentWeekIdx = wi;
  }

  const currentWeek = roadmap[currentWeekIdx];
  const goals = currentWeek.goals;

  // Build day entries: distribute goals across weekdays
  const days = WEEKDAYS.map((dayName, i) => {
    const goal = goals[i] ?? null;
    const isDone = goal ? completedSet.has(`${currentWeekIdx}-${i}-goal`) : false;
    const isReview = i === 5;
    const isRest = i === 6;
    return {
      day: dayName,
      task: isRest ? "استراحت و جمع‌بندی" : isReview ? "بازبینی هفته" : goal ?? null,
      done: isDone,
      active: !isDone && !isRest && !isReview && goal !== null && i === goals.findIndex((_, gi) => !completedSet.has(`${currentWeekIdx}-${gi}-goal`)),
      isPlaceholder: isRest || isReview || !goal,
    };
  });

  const doneCount = days.filter((d) => d.done).length;
  const progressPct = Math.round((doneCount / days.length) * 100);

  // Pick representative tool from top_tools for this week
  const weekTool = r.top_tools?.[currentWeekIdx]?.name ?? r.top_tools?.[0]?.name ?? "AI";

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] pb-28"
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
        <div className="mx-auto max-w-lg px-5 py-3.5 flex items-center gap-3">
          <Link
            href="/dashboard/analysis#roadmap"
            className="h-11 w-11 rounded-xl grid place-items-center flex-shrink-0"
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
              هفتهٔ {(currentWeekIdx + 1).toLocaleString("fa-IR")} از {roadmap.length.toLocaleString("fa-IR")}
            </span>
          </div>
          <div className="h-11 w-11 flex-shrink-0" />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Week title */}
        <div className="mb-6">
          <div
            className="text-[10px] font-bold tracking-[2px] uppercase mb-1"
            style={{ color: "rgba(110,231,183,0.65)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            هفتهٔ {currentWeekIdx + 1} از {roadmap.length}
          </div>
          <h1 className="text-[24px] font-black tracking-tight leading-tight mb-1">
            {currentWeek.week}
          </h1>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-2">
              <span style={{ color: "rgba(232,239,234,0.6)" }}>پیشرفت</span>
              <span
                className="font-bold"
                style={{ color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {doneCount.toLocaleString("fa-IR")} از {days.length.toLocaleString("fa-IR")} روز
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
          {days.map((day, i) => (
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

              <div className="flex-1 min-w-0">
                <span
                  className="text-[12px] font-bold"
                  style={{ color: day.active ? "#6ee7b7" : "rgba(232,239,234,0.7)" }}
                >
                  {day.day}
                </span>
                <div
                  className="text-[13px] mt-0.5 leading-snug"
                  style={{
                    color: day.done ? "rgba(232,239,234,0.5)" : day.isPlaceholder ? "rgba(232,239,234,0.4)" : "#e8efea",
                    textDecoration: day.done ? "line-through" : "none",
                  }}
                >
                  {day.task ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current task CTA */}
        {goals.length > 0 && (
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
              هدف این هفته
            </div>
            <div className="font-bold text-[15px] mb-1 leading-snug">{goals[0]}</div>
            <div className="text-[12px] mb-3" style={{ color: "rgba(232,239,234,0.6)" }}>
              برای راهنمایی بیشتر از مسیریاب AI کمک بگیر.
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
              با مسیریاب شروع کن
            </Link>
          </div>
        )}

        {/* Weekly tool */}
        {weekTool && (
          <>
            <div
              className="text-[10px] font-bold tracking-[2px] uppercase mb-3"
              style={{ color: "rgba(110,231,183,0.6)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              ابزار پیشنهادی این هفته
            </div>
            <div className="flex gap-2 mb-6">
              <Link
                href="/tools"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold"
                style={{
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  color: "#6ee7b7",
                }}
              >
                {weekTool}
              </Link>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
