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
      className="inline-flex items-center gap-1 rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-200 transition hover:bg-ink-700"
      aria-label="خروج"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">خروج</span>
    </button>
  );
}
