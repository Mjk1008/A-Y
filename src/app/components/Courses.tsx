"use client";

/**
 * Courses — affiliate showcase of the best Iranian courses on AI.
 * Crawled from مکتب‌خونه / لیمو / کوئرا / فرانش / ...
 */

import { PlayCircle, Star, Clock, ExternalLink, GraduationCap } from "lucide-react";
import Reveal from "./Reveal";

interface Course {
  id: string;
  title: string;
  platform: "maktabkhooneh" | "limoo" | "quera" | "faradars";
  instructor: string;
  duration: string;
  rating: number;
  students: string;
  price: string;
  level: "مبتدی" | "متوسط" | "پیشرفته";
  thumbColor: string;   /* fake thumbnail background */
}

const PLATFORMS = {
  maktabkhooneh: { label: "مکتب‌خونه", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25" },
  limoo:         { label: "لیمو",       color: "text-leaf-400",   bg: "bg-leaf-500/10 border-leaf-500/25" },
  quera:         { label: "کوئرا",      color: "text-brand-300",  bg: "bg-brand-500/10 border-brand-500/25" },
  faradars:      { label: "فرادرس",     color: "text-accent-300", bg: "bg-accent-500/10 border-accent-500/25" },
};

const COURSES: Course[] = [
  {
    id: "1",
    title: "پرامپت‌نویسی حرفه‌ای با ChatGPT و Claude",
    platform: "maktabkhooneh",
    instructor: "دکتر امیر خادم",
    duration: "۸ ساعت",
    rating: 4.8,
    students: "۳,۲۰۰",
    price: "۱۹۰,۰۰۰",
    level: "مبتدی",
    thumbColor: "from-orange-500/40 to-amber-600/30",
  },
  {
    id: "2",
    title: "Cursor + Claude Code برای توسعه‌دهنده‌ها",
    platform: "quera",
    instructor: "سینا قاسمی",
    duration: "۱۲ ساعت",
    rating: 4.9,
    students: "۱,۸۴۰",
    price: "۴۵۰,۰۰۰",
    level: "متوسط",
    thumbColor: "from-brand-500/40 to-brand-700/30",
  },
  {
    id: "3",
    title: "مدل‌های زبانی بزرگ از صفر (LLMs)",
    platform: "faradars",
    instructor: "دکتر مهدی ناصری",
    duration: "۲۲ ساعت",
    rating: 4.7,
    students: "۹۶۰",
    price: "۶۲۰,۰۰۰",
    level: "پیشرفته",
    thumbColor: "from-accent-500/40 to-violet-700/30",
  },
];

export default function Courses() {
  return (
    <section className="relative overflow-hidden px-5 py-24">
      {/* mesh backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mesh-violet opacity-60" />

      <div className="relative mx-auto max-w-md">
        <Reveal variant="up">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="section-label">دوره‌ها</span>
            <GraduationCap className="h-4 w-4 text-leaf-400" />
          </div>
          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            بهترین دوره‌های ایرانی —
            <br />
            <span className="text-gradient">چیده‌شده برای سطح تو</span>
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-300">
            دیگه لازم نیست گم بشی توی صدها دوره. بر اساس سطح و هدفت، ۳ تا دوره‌ی برتر رو
            از <span className="text-orange-400">مکتب‌خونه</span>،
            {" "}<span className="text-leaf-400">لیمو</span>،
            {" "}<span className="text-brand-300">کوئرا</span> و
            {" "}<span className="text-accent-300">فرادرس</span>{" "}
            بهت پیشنهاد می‌دیم.
          </p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {COURSES.map((c, i) => (
            <Reveal key={c.id} variant="up" delay={i * 100}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={300}>
          <p className="mt-5 text-center text-[11px] text-ink-500">
            خرید از طریق لینک‌های ما — قیمت برات تغییر نمی‌کنه ولی ما یه کمیسیون کوچیک می‌گیریم
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const p = PLATFORMS[course.platform];
  return (
    <article className="glass group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]">
      <div className="flex gap-3 p-3">
        {/* fake thumbnail */}
        <div className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${course.thumbColor}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <PlayCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          {/* level stripe */}
          <div className="absolute bottom-1 left-1 right-1 rounded-md bg-ink-950/70 px-1.5 py-0.5 text-center text-[9px] font-semibold text-ink-100 backdrop-blur-sm">
            {course.level}
          </div>
        </div>

        {/* content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink-100">
              {course.title}
            </h3>
            <span className={`shrink-0 rounded-md border ${p.bg} px-1.5 py-0.5 text-[9px] font-semibold ${p.color}`}>
              {p.label}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-ink-400">{course.instructor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-ink-400">
            <span className="flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 fill-gold-400 text-gold-400" />
              <span className="pn text-ink-200">{course.rating.toFixed(1)}</span>
              <span className="pn text-ink-500">({course.students})</span>
            </span>
            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> <span className="pn">{course.duration}</span></span>
          </div>
        </div>
      </div>

      {/* footer bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] bg-ink-850/40 px-4 py-2.5">
        <div>
          <span className="pn text-[14px] font-bold text-leaf-300">{course.price}</span>
          <span className="mr-1 text-[10.5px] text-ink-500">تومان</span>
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-leaf-400/30 bg-leaf-500/10 px-3 py-1.5 text-[11.5px] font-semibold text-leaf-300 transition hover:bg-leaf-500/20">
          شروع دوره
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}
