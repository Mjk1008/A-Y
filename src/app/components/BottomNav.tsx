"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, CreditCard, Settings, MessageCircle } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "خانه" },
  { href: "/chat",      icon: MessageCircle,   label: "مسیریاب" },
  { href: "/profile",   icon: User,            label: "پروفایل" },
  { href: "/billing",   icon: CreditCard,      label: "اشتراک" },
  { href: "/settings",  icon: Settings,        label: "تنظیمات" },
];

// Also export tab config for use in other components
export const NAV_TABS = TABS;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.06]"
      style={{
        background: "rgba(2,3,6,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
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
              className={`relative flex flex-1 flex-col items-center gap-1 px-2 py-3 transition-colors ${
                active ? "text-emerald-400" : "text-ink-600 hover:text-ink-400"
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
