import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function UpgradePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-xl text-center">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200">
          <ArrowRight className="h-4 w-4" />
          بازگشت به داشبورد
        </Link>
        <div className="card !border-brand-500/50 !bg-gradient-to-br !from-brand-500/10 !to-transparent">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-brand-400 animate-glow" />
          <h1 className="mb-2 text-3xl font-black">ارتقا به Pro</h1>
          <p className="mb-1 text-3xl font-black text-gradient">۱۹۹ هزار تومن</p>
          <p className="mb-8 text-sm text-ink-400">ماهانه • لغو در هر زمان</p>

          <ul className="mb-8 space-y-3 text-right text-sm">
            {[
              "۱۰+ ابزار پیشنهادی با مثال‌های تفصیلی",
              "تحلیل نامحدود با آپدیت پروفایل",
              "چت با مشاور AI اختصاصی",
              "نقشه راه تفصیلی ۴ هفته‌ای",
              "دسترسی به ابزارهای جدید با هر آپدیت",
              "پشتیبانی اولویت‌دار",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-brand-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-ink-600 bg-ink-900/50 p-4 text-sm text-ink-300">
            <p className="mb-2 font-medium text-ink-100">🚧 در حال راه‌اندازی درگاه پرداخت</p>
            <p>به زودی از طریق زرین‌پال و استرایپ می‌تونی اشتراک بگیری. فعلاً ایمیل خودت رو برای رزرو تخفیف ۵۰٪ لانچ ثبت کن:</p>
            <a
              href="mailto:hello@ay.app?subject=Pro Waitlist"
              className="btn-primary mt-4 w-full"
            >
              رزرو تخفیف لانچ
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
