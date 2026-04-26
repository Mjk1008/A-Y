"use client";

import { useState } from "react";
import { Check, Loader2, Target, Flame } from "lucide-react";

interface TodayTaskProps {
  task: string;
  weekNum: number;
  dayNum: number;
  analysisId: string;
  weekLabel: string;
  weekIndex: number;   // 0-based index (for display: "هفته X از ۴")
  totalWeeks: number;
  alreadyDone: boolean;
}

export function TodayTask({
  task, weekNum, dayNum, analysisId, weekLabel, weekIndex, totalWeeks, alreadyDone,
}: TodayTaskProps) {
  const [done, setDone] = useState(alreadyDone);
  const [loading, setLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  async function markDone() {
    if (done || loading) return;
    setLoading(true);
    try {
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          weekNum,
          dayNum,
          taskKey: "goal",
          completed: true,
        }),
      });
      // Also ping streak
      await fetch("/api/chat", { method: "HEAD" }).catch(() => {});
      setDone(true);
      setJustCompleted(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const weekProgress = Math.round(((weekIndex + 1) / totalWeeks) * 100);

  return (
    <div
      dir="rtl"
      style={{
        borderRadius: 20, overflow: "hidden",
        border: done
          ? "1px solid rgba(52,211,153,0.25)"
          : "1px solid rgba(250,204,21,0.22)",
        background: done
          ? "rgba(16,185,129,0.06)"
          : "linear-gradient(135deg, rgba(42,29,3,0.4), rgba(18,12,1,0.3))",
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${done ? "rgba(52,211,153,0.12)" : "rgba(250,204,21,0.12)"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Target size={12} color={done ? "#34d399" : "#fbbf24"} />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: done ? "rgba(52,211,153,0.7)" : "rgba(251,191,36,0.7)" }}>
            تسک امروز · {weekLabel}
          </span>
        </div>
        <span style={{ fontSize: 9.5, color: "rgba(232,239,234,0.35)", fontFamily: "monospace" }}>
          هفته {(weekIndex + 1).toLocaleString("fa-IR")} از {totalWeeks.toLocaleString("fa-IR")}
        </span>
      </div>

      {/* Task */}
      <div style={{ padding: "12px 14px 10px" }}>
        <p style={{
          fontSize: 13.5, lineHeight: 1.75, margin: 0,
          color: done ? "rgba(232,239,234,0.5)" : "rgba(232,239,234,0.88)",
          textDecoration: done ? "line-through" : "none",
        }}>
          {task}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", margin: "0 14px" }}>
        <div style={{
          height: "100%", width: `${weekProgress}%`,
          background: done ? "#34d399" : "#fbbf24",
          borderRadius: 2, transition: "width 0.5s",
        }} />
      </div>

      {/* Action */}
      <div style={{ padding: "10px 14px" }}>
        {justCompleted ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={14} color="#f97316" />
            <span style={{ fontSize: 12.5, color: "#fb923c", fontWeight: 700 }}>
              عالی! streak بروز شد 🔥
            </span>
          </div>
        ) : done ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Check size={13} color="#34d399" />
            <span style={{ fontSize: 12, color: "rgba(52,211,153,0.7)" }}>انجام شد</span>
          </div>
        ) : (
          <button
            onClick={markDone}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 10,
              background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.32)",
              color: "#fde68a", fontSize: 12.5, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
              : <Check size={12} />}
            {loading ? "در حال ثبت..." : "انجام دادم ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
