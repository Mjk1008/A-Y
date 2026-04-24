"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AYScene } from "@/app/components/AYScene";

const PLAN_NAMES: Record<string, string> = { pro: "پرو", max: "مکس" };

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const ref  = params.get("ref") || "";
  const plan = params.get("plan") || "pro";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ background: "#020306", color: "#e8efea" }}>
      <AYScene variant="wave" intensity={1.2} />

      <div className="relative z-10 max-w-sm">
        {/* Gold glow */}
        <div className="pointer-events-none absolute -inset-20 rounded-full"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(250,204,21,0.18), transparent 70%)" }} />

        <div className="relative mb-6 text-6xl">🎉</div>

        <h1 className="mb-2 text-3xl font-black tracking-tight">
          پلن {PLAN_NAMES[plan] || plan} فعال شد!
        </h1>
        <p className="mb-2 text-ink-300">
          اشتراکت با موفقیت ثبت شد. همه امکانات الان در دسترست هستن.
        </p>

        {ref && (
          <div className="mb-6 inline-block rounded-lg border border-white/[0.08] bg-white/5 px-3 py-1.5">
            <span className="font-mono text-xs text-ink-500">کد پیگیری: {ref}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="btn-lux w-full justify-center">
            رفتن به داشبورد
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href="/billing" className="btn-ghost w-full justify-center text-sm">
            مشاهده اشتراک
          </Link>
        </div>
      </div>
    </div>
  );
}
