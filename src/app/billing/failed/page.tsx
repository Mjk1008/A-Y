"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

const REASONS: Record<string, string> = {
  cancelled:    "پرداخت توسط شما لغو شد.",
  verify_failed: "تأیید پرداخت با خطا مواجه شد. اگر مبلغی کسر شده ظرف ۷۲ ساعت بازگشت داده می‌شه.",
  not_found:    "اطلاعات تراکنش پیدا نشد.",
  invalid_plan: "پلن انتخابی نامعتبره.",
};

function FailedContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "cancelled";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#020306", color: "#e8efea" }}>
      <div className="max-w-sm">
        <div className="mb-6 text-6xl">😕</div>
        <h1 className="mb-2 text-2xl font-black">پرداخت ناموفق</h1>
        <p className="mb-8 text-sm text-ink-400 leading-relaxed">
          {REASONS[reason] || "خطایی در پردازش پرداخت رخ داد."}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/billing/checkout" className="btn-lux w-full justify-center">
            <RefreshCw className="h-4 w-4" />
            دوباره تلاش کن
          </Link>
          <Link href="/billing" className="btn-ghost w-full justify-center text-sm">
            بازگشت به اشتراک
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-600">
          اگه مشکل ادامه داشت با پشتیبانی تماس بگیر
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center"
        style={{ background: "#020306" }} />
    }>
      <FailedContent />
    </Suspense>
  );
}
