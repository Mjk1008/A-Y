"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";

const FAQS = [
  {
    q: "چطور تحلیل شغلی‌ام شروع می‌شه؟",
    a: "بعد از ثبت‌نام، وارد صفحه پروفایل بشو و اطلاعاتت رو کامل کن. بعد از ذخیره، تحلیل هوش مصنوعی به صورت خودکار آماده می‌شه — معمولاً کمتر از ۳۰ ثانیه.",
  },
  {
    q: "تفاوت پلن رایگان و پرو چیه؟",
    a: "پلن رایگان یک تحلیل در هفته و ۳ ابزار پیشنهادی داره. پلن پرو ۵ تحلیل در هفته، مسیریاب AI (چت‌بات)، ۲۰ شغل مچ‌شده روزانه و مدل هوشمندتر داره. پلن مکس همه چیز رو نامحدود می‌کنه.",
  },
  {
    q: "مسیریاب AI چیه و چطور کار می‌کنه؟",
    a: "مسیریاب یه چت‌بات تخصصی‌ه که اطلاعات پروفایل تو رو می‌دونه. می‌تونی ازش بپرسی چطور مهارتی رو یاد بگیری، CV رو بهتر بنویسی یا برای مصاحبه آماده بشی. فقط در پلن پرو و مکس دسترس داری.",
  },
  {
    q: "آیا اطلاعاتم امنه؟",
    a: "بله. اطلاعات تو روی سرور ایمن ذخیره می‌شه و هرگز با اشخاص ثالث به اشتراک گذاشته نمی‌شه. می‌تونی هر زمان داده‌هات رو export کنی یا حسابت رو کامل حذف کنی.",
  },
  {
    q: "چطور اشتراکم رو لغو کنم؟",
    a: "از بخش تنظیمات → اشتراک، می‌تونی اشتراکت رو لغو کنی. بعد از لغو، دسترسی‌هات تا پایان دوره پرداختی‌شده ادامه داره.",
  },
  {
    q: "اگه ابزاری پیشنهادی مناسب نبود چیکار کنم؟",
    a: "می‌تونی پروفایلت رو آپدیت کنی تا تحلیل جدیدی دریافت کنی. همچنین از طریق پشتیبانی بهمون بگو تا بهبودش بدیم — فیدبکت برامون خیلی ارزشمنده.",
  },
  {
    q: "چطور داده‌هام رو دانلود کنم؟",
    a: "از تنظیمات → دانلود داده‌هام، یه فایل JSON از همه اطلاعاتت (پروفایل، تحلیل‌ها، تاریخچه) آماده می‌کنیم.",
  },
  {
    q: "پرداخت با چه روش‌هایی انجام می‌شه؟",
    a: "پرداخت از طریق درگاه زرین‌پال با تمام کارت‌های شبکه شتاب انجام می‌شه. پرداخت ارزی فعلاً پشتیبانی نمی‌شه.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition hover:bg-white/[0.02]"
      >
        <span className="text-sm font-medium leading-relaxed">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-ink-400">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      <BottomNav />
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-white/[0.06]"
        style={{ background: "rgba(2,3,6,0.85)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link href="/dashboard" className="rounded-lg p-1.5 text-ink-400 transition hover:text-ink-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">راهنما و سوالات متداول</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Intro */}
        <div className="text-center">
          <div className="mb-3 text-4xl">🤖</div>
          <h2 className="mb-1 text-lg font-black">چطور می‌تونیم کمک کنیم؟</h2>
          <p className="text-sm text-ink-500">جواب بیشتر سوالا اینجاست. اگه پیدا نکردی، پیام بده.</p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass overflow-hidden rounded-2xl">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Support contact */}
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-bold text-ink-300">هنوز سوال داری؟</h3>
          <div className="space-y-3">
            <a
              href="https://t.me/ay_support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.04]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                <MessageCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">تلگرام پشتیبانی</p>
                <p className="text-xs text-ink-500">@ay_support — پاسخ سریع</p>
              </div>
              <ExternalLink className="h-4 w-4 text-ink-600" />
            </a>

            <a
              href="mailto:support@ay.app"
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.04]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                <Mail className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">ایمیل</p>
                <p className="text-xs text-ink-500">support@ay.app — تا ۴۸ ساعت</p>
              </div>
              <ExternalLink className="h-4 w-4 text-ink-600" />
            </a>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-ink-700">نسخه ۱.۰.۰ · ساخته شده با ❤️ برای کارجوی ایرانی</p>
      </div>
    </div>
  );
}
