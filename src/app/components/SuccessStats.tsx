"use client";

/**
 * SuccessStats — social proof. Live(ish) stats + testimonial.
 * Numbers are seeded placeholders — wire to DB when ready.
 */

import { Users, Briefcase, Award, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { icon: Users,      val: "۱,۲۸۴", label: "کاربر فعال", color: "text-brand-300",  bg: "from-brand-500/15 to-transparent" },
  { icon: Briefcase,  val: "۳۴۷",   label: "شغل گرفتن",   color: "text-accent-300", bg: "from-accent-500/15 to-transparent" },
  { icon: Award,      val: "۸۹۲",   label: "دوره کامل",   color: "text-leaf-300",   bg: "from-leaf-500/15 to-transparent" },
  { icon: TrendingUp, val: "+۳۴٪",  label: "میانگین رشد",  color: "text-gold-300",   bg: "from-gold-500/15 to-transparent" },
];

export default function SuccessStats() {
  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">اعداد واقعی</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            خیلی‌ها رسیدن —
            <br />
            <span className="text-gradient">نوبت توئه</span>
          </h2>
        </Reveal>

        {/* Stats grid */}
        <div className="mt-10 grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} variant="up" delay={i * 80}>
              <div className={`glass relative overflow-hidden p-4`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.bg}`} />
                <div className="relative">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <div className={`pn mt-2 text-3xl font-black ${s.color}`}>{s.val}</div>
                  <div className="mt-0.5 text-[11px] text-ink-400">{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Testimonial */}
        <Reveal variant="up" delay={300}>
          <figure className="glass-strong mt-6 p-5">
            <div className="mb-3 text-[22px] leading-none text-brand-400">“</div>
            <blockquote className="text-[14px] leading-relaxed text-ink-100">
              فکر می‌کردم هوش مصنوعی قراره شغل من رو بگیره. A-Y بهم نشون داد
              دقیقاً کدوم ابزارها توی تسک‌های روزمره‌ام کمکم می‌کنن.
              الان ۲ ماهه توی کارم دو برابر سریع‌ترم.
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-brand-500 text-sm font-bold text-white">
                س
              </div>
              <div>
                <div className="text-[12.5px] font-semibold text-ink-100">سارا محمدی</div>
                <div className="text-[10.5px] text-ink-400">Product Designer · فیدیبو</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
