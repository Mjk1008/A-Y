"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

export function ShareButton({ analysisId }: { analysisId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "copied">("idle");

  async function handleShare() {
    if (state === "loading") return;
    setState("loading");

    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });

      if (!res.ok) throw new Error("خطا");

      const data = await res.json();
      const url = `${window.location.origin}${data.url}`;

      if (navigator.share) {
        await navigator.share({
          title: "نتایج تحلیل مسیر شغلی من",
          text: "ریسک جایگزینی شغلم با AI رو بررسی کردم — تو هم چک کن:",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setState("copied");
        setTimeout(() => setState("idle"), 2500);
        return;
      }
      setState("idle");
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={state === "loading"}
      className="flex items-center gap-1.5 rounded-lg border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-semibold text-ink-400 transition hover:bg-white/[0.08] hover:text-ink-200 disabled:opacity-50"
    >
      {state === "loading" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : state === "copied" ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Share2 className="h-3 w-3" />
      )}
      {state === "copied" ? "کپی شد!" : "اشتراک"}
    </button>
  );
}
