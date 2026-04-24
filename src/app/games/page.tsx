"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { SnakeGame } from "./Snake";
import { TwentyFortyEightGame } from "./TwentyFortyEight";
import { FlappyGame } from "./Flappy";
import { MemoryGame } from "./Memory";

const TABS = [
  { id: "snake", label: "مار", icon: "🐍", component: <SnakeGame /> },
  { id: "2048", label: "۲۰۴۸", icon: "🔢", component: <TwentyFortyEightGame /> },
  { id: "flappy", label: "فلپی", icon: "🐦", component: <FlappyGame /> },
  { id: "memory", label: "حافظه", icon: "🃏", component: <MemoryGame /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function GamesPage() {
  const [active, setActive] = useState<TabId>("snake");

  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{ background: "#020306", color: "#e5e7eb" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(2,3,6,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <ArrowRight size={16} />
          <span>داشبورد</span>
        </Link>

        <div className="flex items-center gap-2" style={{ color: "#34d399" }}>
          <Gamepad2 size={20} />
          <span className="font-bold text-base">بازی‌ها</span>
        </div>

        {/* spacer to center title */}
        <div className="w-20" />
      </header>

      {/* Tab switcher */}
      <div
        className="sticky top-[57px] z-20 flex items-center gap-2 px-4 py-3 border-b overflow-x-auto"
        style={{
          background: "rgba(2,3,6,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{
                background: isActive
                  ? "rgba(52,211,153,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid rgba(52,211,153,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: isActive ? "#34d399" : "rgba(255,255,255,0.5)",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Game area */}
      <main className="flex flex-col items-center px-4 py-8 gap-4">
        {/* Game title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{activeTab.icon}</span>
          <h1 className="text-xl font-bold" style={{ color: "#e5e7eb" }}>
            {activeTab.label}
          </h1>
        </div>

        {/* Game container */}
        <div
          className="w-full max-w-sm rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {activeTab.component}
        </div>

        {/* Footer hint */}
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          بازی‌ها رو انتخاب کن و شروع کن!
        </p>
      </main>
    </div>
  );
}
