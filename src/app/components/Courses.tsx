"use client";

import { PlayCircle, Star, Clock, ExternalLink, Search } from "lucide-react";
import { SkeletonList } from "@/app/components/LoadingStates";
import { useEffect, useState, useCallback, useRef } from "react";

interface Course {
  id: string;
  title: string;
  platform: string;
  instructor: string;
  duration_hours: number;
  rating: number;
  rating_count: number;
  price_toman: number;
  level: string;
  url: string;
  topics: string[];
}

const PLATFORMS: Record<string, { label: string; color: string; bg: string }> = {
  maktabkhooneh: { label: "مکتب‌خونه", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25" },
  limoo:         { label: "لیمو",       color: "text-leaf-400",   bg: "bg-leaf-500/10 border-leaf-500/25" },
  quera:         { label: "کوئرا",      color: "text-brand-300",  bg: "bg-brand-500/10 border-brand-500/25" },
  faradars:      { label: "فرادرس",     color: "text-accent-300", bg: "bg-accent-500/10 border-accent-500/25" },
};

const THUMB_COLORS: Record<string, string> = {
  maktabkhooneh: "from-orange-500/40 to-amber-600/30",
  limoo:         "from-leaf-500/40 to-green-700/30",
  quera:         "from-brand-500/40 to-brand-700/30",
  faradars:      "from-accent-500/40 to-violet-700/30",
};

const LEVELS = [
  { key: "", label: "همه سطوح" },
  { key: "beginner", label: "مبتدی" },
  { key: "intermediate", label: "متوسط" },
  { key: "advanced", label: "پیشرفته" },
];

export default function Courses({ limit = 3 }: { limit?: number }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fix: blur search input when user scrolls — prevents iOS keyboard re-appearing on scroll
  useEffect(() => {
    const blurOnScroll = () => {
      if (document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    };
    window.addEventListener("scroll", blurOnScroll, { passive: true });
    window.addEventListener("touchmove", blurOnScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", blurOnScroll);
      window.removeEventListener("touchmove", blurOnScroll);
    };
  }, []);

  const fetchCourses = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit) });
    if (search) params.set("q", search);
    if (level) params.set("level", level);
    if (freeOnly) params.set("free", "true");

    fetch(`/api/courses?${params}`)
      .then((r) => r.json())
      .then((d) => setCourses(d.courses ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, search, level, freeOnly]);

  useEffect(() => {
    const t = setTimeout(fetchCourses, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchCourses, search]);

  return (
    <div className="px-5 py-8">
      <div className="mx-auto max-w-md">
        {/* Search + Filters */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
            <input
              ref={searchRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") searchRef.current?.blur(); }}
              placeholder="جستجو در دوره‌ها..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pr-9 pl-4 text-sm text-ink-100 placeholder-ink-600 outline-none transition focus:border-white/[0.12]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="رایگان"
              active={freeOnly}
              onClick={() => setFreeOnly(!freeOnly)}
            />
            {LEVELS.filter((l) => l.key).map((l) => (
              <FilterChip
                key={l.key}
                label={l.label}
                active={level === l.key}
                onClick={() => setLevel(level === l.key ? "" : l.key)}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonList count={4} />
        ) : courses.length > 0 ? (
          <div className="space-y-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
            <div className="mb-4 text-4xl">📚</div>
            <p className="mb-1 font-bold text-ink-200">
              {search || level || freeOnly ? "نتیجه‌ای پیدا نشد" : "دوره‌ها در راهه"}
            </p>
            <p className="text-sm text-ink-500 leading-relaxed">
              {search || level || freeOnly
                ? "فیلترها رو تغییر بده یا جستجو رو پاک کن"
                : "داریم بهترین دوره‌های ایرانی رو جمع‌آوری می‌کنیم."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1 text-[11.5px] font-medium transition ${
        active
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "border-white/[0.06] bg-white/[0.02] text-ink-500 hover:border-white/[0.10] hover:text-ink-300"
      }`}
    >
      {label}
    </button>
  );
}

function CourseCard({ course }: { course: Course }) {
  const p = PLATFORMS[course.platform] ?? { label: course.platform, color: "text-ink-400", bg: "bg-white/5 border-white/10" };
  const thumb = THUMB_COLORS[course.platform] ?? "from-ink-700/40 to-ink-800/30";
  const price =
    course.price_toman === 0
      ? "رایگان"
      : `${Math.round(course.price_toman / 1000).toLocaleString("fa-IR")}K`;

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-0 transition hover:-translate-y-0.5 hover:border-white/[0.10]">
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${thumb}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <PlayCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          {course.level && (
            <div className="absolute bottom-1 left-1 right-1 rounded-md bg-ink-950/70 px-1.5 py-0.5 text-center text-[9px] font-semibold text-ink-100 backdrop-blur-sm">
              {course.level}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink-100">
              {course.title}
            </h3>
            <span className={`shrink-0 rounded-md border ${p.bg} px-1.5 py-0.5 text-[9px] font-semibold ${p.color}`}>
              {p.label}
            </span>
          </div>
          {course.instructor && (
            <p className="mt-1 text-[11px] text-ink-400">{course.instructor}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-ink-400">
            {course.rating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                <span className="pn text-ink-200">{Number(course.rating).toFixed(1)}</span>
                {course.rating_count > 0 && (
                  <span className="pn text-ink-600">({course.rating_count.toLocaleString("fa-IR")})</span>
                )}
              </span>
            )}
            {course.duration_hours > 0 && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                <span className="pn">{course.duration_hours.toLocaleString("fa-IR")} ساعت</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] bg-ink-900/30 px-4 py-2.5">
        <div>
          <span className={`pn text-[14px] font-bold ${price === "رایگان" ? "text-emerald-400" : "text-ink-100"}`}>
            {price}
          </span>
          {course.price_toman > 0 && (
            <span className="mr-1 text-[10.5px] text-ink-500">تومان</span>
          )}
        </div>
        {course.url && (
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-emerald-400/25 bg-emerald-500/8 px-3 py-1.5 text-[11.5px] font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
          >
            شروع دوره
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}
