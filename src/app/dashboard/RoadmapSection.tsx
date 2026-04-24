"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";

interface RoadmapWeek {
  week: string;
  goals: string[];
}

interface Progress {
  week_num: number;
  day_num: number;
  task_key: string;
  completed: boolean;
}

interface Props {
  analysisId: string;
  roadmap: RoadmapWeek[];
  initialProgress: Progress[];
}

export function RoadmapSection({ analysisId, roadmap, initialProgress }: Props) {
  const [progress, setProgress] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    initialProgress.forEach((p) => {
      map.set(`${p.week_num}-${p.day_num}-${p.task_key}`, p.completed);
    });
    return map;
  });
  const [, startTransition] = useTransition();

  function key(weekIdx: number, goalIdx: number) {
    return `${weekIdx}-${goalIdx}-goal`;
  }

  function isCompleted(weekIdx: number, goalIdx: number) {
    return !!progress.get(key(weekIdx, goalIdx));
  }

  function toggle(weekIdx: number, goalIdx: number) {
    const k = key(weekIdx, goalIdx);
    const next = !progress.get(k);
    setProgress((prev) => new Map(prev).set(k, next));

    startTransition(async () => {
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          weekNum: weekIdx,
          dayNum: goalIdx,
          taskKey: "goal",
          completed: next,
        }),
      });
    });
  }

  // Calculate completion percentage per week
  function weekPct(weekIdx: number, total: number) {
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (isCompleted(weekIdx, i)) done++;
    }
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight">نقشه راه ۴ هفته‌ای</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-500">
          هر قدم که برداشتی، تیک بزن
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {roadmap.map((w, weekIdx) => {
          const pct = weekPct(weekIdx, w.goals.length);
          const allDone = pct === 100;
          return (
            <div
              key={weekIdx}
              className={`rounded-2xl border p-5 transition-colors ${
                allDone
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-white/[0.06] bg-white/[0.025]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      allDone
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-emerald-500/12 text-emerald-400"
                    }`}
                  >
                    {allDone ? <Check className="h-4 w-4" /> : weekIdx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-ink-200">{w.week}</h3>
                </div>
                <span className={`text-xs font-mono ${allDone ? "text-emerald-400" : "text-ink-600"}`}>
                  {pct.toLocaleString("fa-IR")}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-emerald-400" : "bg-emerald-500/50"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Goals */}
              <ul className="space-y-2">
                {w.goals.map((g, goalIdx) => {
                  const done = isCompleted(weekIdx, goalIdx);
                  return (
                    <li key={goalIdx}>
                      <button
                        onClick={() => toggle(weekIdx, goalIdx)}
                        className="flex w-full items-start gap-2.5 text-right"
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                            done
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-white/20 bg-white/5 hover:border-emerald-500/50"
                          }`}
                        >
                          {done && <Check className="h-2.5 w-2.5 text-white" />}
                        </span>
                        <span
                          className={`text-[13px] leading-relaxed transition-colors ${
                            done ? "text-ink-600 line-through" : "text-ink-300"
                          }`}
                        >
                          {g}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
