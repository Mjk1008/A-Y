"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function DashboardClient() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-xl border border-ink-700 bg-ink-800/40 px-3 py-2 text-xs text-ink-400 transition hover:border-ink-600 hover:text-ink-200 active:scale-[0.98]"
      aria-label="خروج"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">خروج</span>
    </button>
  );
}
