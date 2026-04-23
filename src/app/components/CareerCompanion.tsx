"use client";

/**
 * CareerCompanion — "مسیریاب" : the Pro chatbot that remembers
 * your analysis and helps you plan the road ahead.
 * Free plan sees the preview but button is locked.
 */

import { Send, Lock, Sparkles, Compass, FileText } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function CareerCompanion() {
  return (
    <section className="relative overflow-hidden px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 mesh-violet opacity-60" />

      <div className="relative mx-auto max-w-md">
        <Reveal variant="up">
          <div className="mb-3 flex items-center gap-2">
            <span className="section-label">مسیریاب</span>
            <span className="pro-badge">
              <Sparkles className="h-3 w-3" />
              PRO
            </span>
          </div>
          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            یه همراه هوشمند
            <br />
            <span className="text-gradient-violet">که پروفایلت رو یادشه</span>
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-300">
            بعد از تحلیل پروفایل، یه چت‌بات اختصاصی بهت می‌دیم که همه‌ی
            تحلیل رو یادشه. هر وقت سوال داشتی —
            درباره مسیر شغلی، انتخاب ابزار، یا قدم بعدی —
            همراهت می‌مونه.
          </p>
        </Reveal>

        {/* Chat mock */}
        <Reveal variant="up" delay={150}>
          <div className="glass-strong mt-10 overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-brand-500">
                    <Compass className="h-4 w-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-850 bg-leaf-400" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-ink-50">مسیریاب</div>
                  <div className="text-[10px] text-ink-400">پروفایل شما رو یادشه</div>
                </div>
              </div>
              <div className="chip-brand">
                <FileText className="h-3 w-3" />
                تحلیل لود شد
              </div>
            </div>

            {/* body */}
            <div className="space-y-3 p-4">
              {/* user */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-500 px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-lg shadow-brand-500/10">
                  با توجه به پروفایل من، اگه بخوام تا ۶ ماه دیگه Senior بشم، روی چی تمرکز کنم؟
                </div>
              </div>

              {/* assistant */}
              <div className="flex justify-start">
                <div className="flex max-w-[92%] items-start gap-2">
                  <Image src="/ay-logo.png" alt="A-Y" width={22} height={22} className="mt-1 h-5 w-auto shrink-0" />
                  <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-ink-800/60 px-3.5 py-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-300">
                      <Sparkles className="h-3 w-3" />
                      بر اساس پروفایل تو
                    </div>
                    <div className="text-[12.5px] leading-relaxed text-ink-100">
                      بر اساس این‌که ۴ سال Next.js کار کردی و تیم‌ت الان به سمت AI
                      می‌ره، این سه مهارت برات leverage واقعی می‌سازن:
                    </div>
                    <ul className="mt-2.5 space-y-1.5 text-[12px] text-ink-200">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                        ساخت و fine-tune کردن agent با Claude SDK
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                        طراحی system prompt و context management
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                        یه پروژه‌ی open-source که tool use رو نشون بده
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-leaf-400/20 bg-leaf-500/10 px-2.5 py-2">
                      <Compass className="h-3 w-3 shrink-0 text-leaf-400" />
                      <span className="text-[11px] text-leaf-200">
                        می‌خوای یه رودمپ ۶ ماهه برات بسازم؟
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* input */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-900/60 px-3 py-2">
                <span className="flex-1 text-[11.5px] text-ink-500">از مسیریاب بپرس…</span>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500/20 text-accent-300">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Free-plan lock note */}
        <Reveal variant="up" delay={250}>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            <div className="text-[12px] leading-relaxed text-ink-200">
              <span className="font-semibold text-gold-300">فقط پرمیوم.</span>{" "}
              توی پلن رایگان این دکمه غیرفعاله — ولی بقیه‌ی تحلیل رایگان در اختیارته.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
