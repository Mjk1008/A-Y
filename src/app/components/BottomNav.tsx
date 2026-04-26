"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, MessageCircle, Newspaper, Wrench } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "خانه" },
  { href: "/chat",      icon: MessageCircle,   label: "مسیریاب" },
  { href: "/tools",     icon: Wrench,          label: "ابزارها" },
  { href: "/magazine",  icon: Newspaper,       label: "مجله" },
  { href: "/profile",   icon: User,            label: "پروفایل" },
];

// Also export tab config for use in other components
export const NAV_TABS = TABS;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.06]"
      style={{
        background: "rgba(2,3,6,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-1 px-2 py-3 transition-all duration-200 ${
                active ? "text-emerald-400" : "text-ink-600 hover:text-ink-300"
              }`}
            >
              {/* Top active indicator */}
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                  active ? "w-8 bg-emerald-400" : "w-0 bg-transparent"
                }`}
                style={active ? { boxShadow: "0 0 8px rgba(52,211,153,0.7)" } : undefined}
              />
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  active ? "bg-emerald-500/12" : ""
                }`}
              >
                <Icon className={`h-[19px] w-[19px] transition-all duration-200 ${active ? "scale-110" : ""}`} />
              </div>
              <span className={`text-[10px] leading-none transition-all duration-200 ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
