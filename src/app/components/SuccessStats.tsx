"use client";

import Reveal from "./Reveal";

export default function SuccessStats() {
  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <figure className="glass-strong p-5">
            <div className="mb-3 text-[22px] leading-none text-brand-400">"</div>
            <blockquote className="text-[14px] leading-relaxed text-ink-100">
              فکر می‌کردم هوش مصنوعی قراره شغل من رو بگیره. A-Y بهم نشون داد
              دقیقاً کدوم ابزارها توی تسک‌های روزمره‌ام کمکم می‌کنن.
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
