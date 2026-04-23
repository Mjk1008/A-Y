"use client";

/**
 * ChatCarousel — swipeable chat-UI mockups showing the "leverage idea"
 * output for different personas. Each card mimics a real conversation
 * inside the A-Y app.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Send } from "lucide-react";

interface Conv {
  persona: string;     /* role/title                          */
  avatar: string;      /* emoji or letter                     */
  userMsg: string;     /* what they ask                       */
  assistantTitle: string;
  assistantBody: string;
  tags: string[];      /* tools/keywords under the answer     */
}

const CONVERSATIONS: Conv[] = [
  {
    persona: "توسعه‌دهنده فرانت‌اند",
    avatar: "👩‍💻",
    userMsg: "تیم من Next.js کار می‌کنه. چطور می‌تونم با AI سریع‌تر deliver کنم؟",
    assistantTitle: "یه کامپوننت‌ساز داخلی با Cursor بساز",
    assistantBody:
      "با Cursor و Claude، یه template شخصی درست کن که روی استایل‌گاید تیمت سوار باشه. بگو «کارت محصول با ویژگی X بساز» — خروجی استاندارد می‌گیری. میانگین سرعت delivery تیمت ۳ برابر می‌شه.",
    tags: ["Cursor", "Claude", "کامپوننت ویزارد"],
  },
  {
    persona: "مارکتر محتوا",
    avatar: "✍️",
    userMsg: "من هفته‌ای ۵ تا پست لینکدین می‌خوام. از کجا شروع کنم؟",
    assistantTitle: "یه خط تولید محتوا با Claude + Notion بزن",
    assistantBody:
      "یه template توی Notion بساز با ۳ ستون: ایده، درفت، فاینال. Claude رو مجبور کن با صدای برندت بنویسه (۵ نمونه از نوشته‌های قبلیت بهش بده). می‌تونی از ۲۰ دقیقه در هفته، ۱۰ پست با کیفیت بیرون بکشی.",
    tags: ["Claude", "Notion AI", "Voice-match"],
  },
  {
    persona: "مدیر محصول",
    avatar: "🎯",
    userMsg: "من وقت ندارم همه‌ی feedbackهای کاربرارو بخونم. چیکار کنم؟",
    assistantTitle: "خلاصه‌ساز هوشمند feedback هفتگی راه بنداز",
    assistantBody:
      "feedbackها رو از Intercom / تیکت‌ها بکش، با Claude هر هفته ۳ تا theme و ۵ تا quote استخراج کن. داخل جلسه‌ی روز دوشنبه‌ی تیم پرزنت کن. تصمیم‌هاتو ۲ برابر سریع‌تر می‌گیری.",
    tags: ["Claude", "Intercom API", "Weekly digest"],
  },
  {
    persona: "دیزاینر UI",
    avatar: "🎨",
    userMsg: "Figma + AI رو چطور ترکیب کنم که mockup سریع‌تر بیاد؟",
    assistantTitle: "با Galileo و Magician روی prompt library تیم کار کن",
    assistantBody:
      "یه دیتابیس از prompt‌های موفق نگه دار (مثلاً «لندینگ SaaS دارک با تم سبز»). داخل Figma با Magician شروع کن، با Midjourney برای hero-image کمک بگیر. ۴۰٪ زمان mockup اولیه کم می‌شه.",
    tags: ["Figma Magician", "Galileo AI", "Prompt library"],
  },
];

export default function ChatCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  function scrollTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
      setIdx(i);
    }
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    setIdx(closest);
  }

  return (
    <div className="mt-10">
      {/* track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="h-scroll flex gap-4 px-5 pb-6"
        dir="rtl"
      >
        {CONVERSATIONS.map((c, i) => (
          <ChatCard key={i} conv={c} active={i === idx} />
        ))}
        {/* end spacer to allow last card to snap-center */}
        <div className="shrink-0" style={{ width: "calc(50vw - 190px)" }} />
      </div>

      {/* indicators */}
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 px-5">
        {CONVERSATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`نمایش نمونه ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-8 bg-brand-400" : "w-1.5 bg-ink-700 hover:bg-ink-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Single card ─────────────────────────────────── */
function ChatCard({ conv, active }: { conv: Conv; active: boolean }) {
  return (
    <article
      className={`snap-center shrink-0 w-[340px] sm:w-[380px] transition-all duration-500 ${
        active ? "scale-100 opacity-100" : "scale-[0.97] opacity-70"
      }`}
    >
      <div className="glass-strong overflow-hidden">
        {/* chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 text-base">
              {conv.avatar}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-ink-200">{conv.persona}</div>
              <div className="text-[10px] text-ink-500">گفت‌وگو با A-Y</div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-ink-800/60 px-2 py-0.5 text-[9px] text-ink-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            آنلاین
          </div>
        </div>

        {/* body */}
        <div className="space-y-3 p-4">
          {/* user bubble */}
          <div className="flex justify-end">
            <div
              className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-500 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white shadow-lg shadow-brand-500/10"
            >
              {conv.userMsg}
            </div>
          </div>

          {/* assistant bubble */}
          <div className="flex justify-start">
            <div className="flex max-w-[90%] items-start gap-2">
              <Image
                src="/ay-logo.png"
                alt="A-Y"
                width={22}
                height={22}
                className="mt-1 h-5 w-auto shrink-0"
              />
              <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-ink-800/60 px-3.5 py-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-400">
                  <Sparkles className="h-3 w-3" />
                  ایده‌ی اهرم
                </div>
                <div className="mb-2 text-[13px] font-bold leading-snug text-ink-100">
                  {conv.assistantTitle}
                </div>
                <div className="text-[12px] leading-relaxed text-ink-300">
                  {conv.assistantBody}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {conv.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-[10px] text-brand-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* input mock */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-900/60 px-3 py-2">
            <span className="flex-1 text-[11.5px] text-ink-500">یه سوال دیگه بپرس…</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
