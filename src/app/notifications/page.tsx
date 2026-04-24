"use client";

import { Bell, Sparkles, TrendingUp, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface NotifItem {
  kind: "tool" | "job" | "chat" | "sys";
  title: string;
  sub: string;
  time: string;
  unread?: boolean;
}

interface NotifGroup {
  label: string;
  items: NotifItem[];
}

const GROUPS: NotifGroup[] = [
  {
    label: "امروز",
    items: [
      {
        kind: "tool",
        title: "ابزار جدید: Cursor",
        sub: "برای هفتهٔ ۴ مسیرت اضافه شد",
        time: "۲ ساعت پیش",
        unread: true,
      },
      {
        kind: "job",
        title: "یه شغل مناسب پیدا شد",
        sub: "طراح محصول ارشد · دیجی‌کالا · ۹۴٪ مطابقت",
        time: "۵ ساعت پیش",
        unread: true,
      },
    ],
  },
  {
    label: "دیروز",
    items: [
      {
        kind: "chat",
        title: "یادآوری مسیریاب",
        sub: "از کار امروزت بپرس — یه سوال بزن",
        time: "دیروز ۱۸:۳۰",
      },
      {
        kind: "sys",
        title: "نقشه‌ات به‌روز شد",
        sub: "هفتهٔ ۲ حالا شامل v0 هم می‌شه",
        time: "دیروز ۰۹:۰۰",
      },
    ],
  },
  {
    label: "این هفته",
    items: [
      {
        kind: "tool",
        title: "Claude رو امتحان کردی؟",
        sub: "پرامپت پژوهش کاربر رو باهاش تست کن",
        time: "سه‌شنبه",
      },
      {
        kind: "sys",
        title: "تحلیلت کامل شد",
        sub: "نقشهٔ ۴ هفته‌ات آماده‌ست",
        time: "دوشنبه",
      },
    ],
  },
];

const TONE_MAP = {
  tool: {
    bg: "rgba(16,185,129,0.12)",
    color: "#6ee7b7",
    Icon: Sparkles,
  },
  job: {
    bg: "rgba(139,92,246,0.12)",
    color: "#c4b5fd",
    Icon: TrendingUp,
  },
  chat: {
    bg: "rgba(234,179,8,0.12)",
    color: "#fde68a",
    Icon: MessageCircle,
  },
  sys: {
    bg: "rgba(255,255,255,0.05)",
    color: "#c9d8d0",
    Icon: Bell,
  },
};

export default function NotificationsPage() {
  const unreadCount = GROUPS.flatMap((g) => g.items).filter((i) => i.unread).length;

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
            href="/profile"
            className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
            style={{
              background: "rgba(31,46,40,0.6)",
              border: "1px solid rgba(110,231,183,0.14)",
            }}
          >
            <ArrowRight size={16} className="text-white" />
          </Link>
          <div className="flex-1 text-center">
            <span className="font-black text-[15px] tracking-tight">اعلان‌ها</span>
          </div>
          {unreadCount > 0 && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(52,211,153,0.15)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              {unreadCount} جدید
            </span>
          )}
          {unreadCount === 0 && <div className="w-9" />}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6">
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-7">
            {/* Group label */}
            <div
              className="text-[10px] font-bold tracking-[2px] uppercase mb-3"
              style={{ color: "rgba(110,231,183,0.6)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {group.label}
            </div>

            <div className="flex flex-col gap-2">
              {group.items.map((item, idx) => {
                const tone = TONE_MAP[item.kind];
                const Icon = tone.Icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl relative"
                    style={{
                      background: item.unread
                        ? "rgba(16,185,129,0.05)"
                        : "rgba(31,46,40,0.45)",
                      border: item.unread
                        ? "1px solid rgba(52,211,153,0.18)"
                        : "1px solid rgba(110,231,183,0.08)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Unread dot */}
                    {item.unread && (
                      <div
                        className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full"
                        style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-[10px] grid place-items-center flex-shrink-0"
                      style={{ background: tone.bg }}
                    >
                      <Icon size={16} style={{ color: tone.color }} strokeWidth={1.7} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[13px] font-bold leading-snug"
                        style={{ color: item.unread ? "#e8efea" : "rgba(232,239,234,0.85)" }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-[11.5px] mt-0.5 leading-relaxed"
                        style={{ color: "rgba(232,239,234,0.55)" }}
                      >
                        {item.sub}
                      </div>
                      <div
                        className="text-[10px] mt-1.5"
                        style={{
                          color: "rgba(232,239,234,0.35)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state footer */}
        <div
          className="text-center py-8 text-[11px]"
          style={{ color: "rgba(232,239,234,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          همهٔ اعلان‌ها نمایش داده شدن
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
