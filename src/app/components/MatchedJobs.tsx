"use client";

/**
 * MatchedJobs — Pro feature preview.
 * Crawled daily from jobinja / jobvision / irantalent / karboom.
 * Matched to user profile (level × skills × industry).
 */

import { Briefcase, MapPin, ExternalLink, Sparkles, Clock } from "lucide-react";
import Reveal from "./Reveal";

interface Job {
  id: string;
  title: string;
  company: string;
  companyColor: string;   /* tailwind bg class for initial badge */
  companyInitial: string;
  location: string;
  type: string;
  salary?: string;
  matchPct: number;
  tags: string[];
  posted: string;
  source: "jobinja" | "jobvision" | "irantalent" | "karboom";
}

const SOURCES = {
  jobinja:    { label: "جاب‌اینجا",    color: "text-emerald-400" },
  jobvision:  { label: "جاب‌ویژن",    color: "text-sky-400" },
  irantalent: { label: "ایران‌تلنت",   color: "text-rose-400" },
  karboom:    { label: "کاربوم",      color: "text-amber-400" },
};

const JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer (AI Tools)",
    company: "دیجی‌کالا",
    companyColor: "bg-red-500/90",
    companyInitial: "D",
    location: "تهران",
    type: "تمام‌وقت · ترکیبی",
    salary: "۵۰ - ۷۰ میلیون",
    matchPct: 94,
    tags: ["Next.js", "AI integration", "TypeScript"],
    posted: "۲ روز پیش",
    source: "jobinja",
  },
  {
    id: "2",
    title: "AI Product Manager",
    company: "اسنپ",
    companyColor: "bg-pink-500/90",
    companyInitial: "S",
    location: "تهران",
    type: "تمام‌وقت · حضوری",
    salary: "۶۰ - ۸۵ میلیون",
    matchPct: 87,
    tags: ["LLM", "Product", "Strategy"],
    posted: "دیروز",
    source: "jobvision",
  },
  {
    id: "3",
    title: "Machine Learning Engineer",
    company: "کافه‌بازار",
    companyColor: "bg-green-600/90",
    companyInitial: "B",
    location: "تهران · دورکاری",
    type: "تمام‌وقت",
    salary: "۴۵ - ۶۵ میلیون",
    matchPct: 82,
    tags: ["Python", "PyTorch", "NLP"],
    posted: "امروز",
    source: "irantalent",
  },
];

export default function MatchedJobs() {
  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <div className="mb-3 flex items-center gap-2">
            <span className="section-label">شغل‌های مچ‌شده</span>
            <span className="pro-badge">
              <Sparkles className="h-3 w-3" />
              PRO
            </span>
          </div>
          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            شغل‌هایی که
            <br />
            <span className="text-gradient-violet">دقیقاً‌ به تو می‌خورن</span>
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-300">
            هر روز از
            {" "}<span className="text-emerald-400">جاب‌اینجا</span>،
            {" "}<span className="text-sky-400">جاب‌ویژن</span>،
            {" "}<span className="text-rose-400">ایران‌تلنت</span> و
            {" "}<span className="text-amber-400">کاربوم</span>{" "}
            کراول می‌کنیم — بعد با پروفایلت تطبیق می‌دیم. فقط پوزیشن‌های باز و مچ شده.
          </p>
        </Reveal>

        {/* Update badge */}
        <Reveal variant="up" delay={100}>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-850/60 px-4 py-3 backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-leaf-400/60" />
              <span className="relative h-2 w-2 rounded-full bg-leaf-400" />
            </div>
            <div className="flex-1 text-[12.5px] text-ink-200">
              آپدیت هر روز <span className="text-ink-400">·</span>{" "}
              <span className="pn text-leaf-400">۱,۲۴۷</span>{" "}
              <span className="text-ink-400">موقعیت فعال هوش مصنوعی</span>
            </div>
          </div>
        </Reveal>

        {/* Jobs list */}
        <div className="mt-6 space-y-3">
          {JOBS.map((job, i) => (
            <Reveal key={job.id} variant="up" delay={i * 90}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={300}>
          <p className="mt-6 text-center text-[11.5px] text-ink-500">
            این بخش بعد از تکمیل پروفایلت فعال می‌شه ·{" "}
            <span className="text-gold-400">نیاز به پلن پرمیوم</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function JobCard({ job }: { job: Job }) {
  const src = SOURCES[job.source];
  return (
    <article className="glass-violet relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400/40">
      {/* match % — top left */}
      <div className="absolute top-4 left-4 flex flex-col items-center">
        <div className="relative">
          <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke="url(#matchG)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(job.matchPct / 100) * 113.1} 113.1`}
            />
            <defs>
              <linearGradient id="matchG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="pn text-[11px] font-bold text-accent-300">{job.matchPct}%</span>
          </div>
        </div>
        <span className="mt-1 text-[9px] uppercase tracking-wider text-ink-500">مچ</span>
      </div>

      {/* Content */}
      <div className="pl-16">
        {/* header */}
        <div className="flex items-start gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${job.companyColor} text-sm font-bold text-white`}>
            {job.companyInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13.5px] font-bold text-ink-100">{job.title}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-300">
              <span>{job.company}</span>
              <span className="text-ink-600">·</span>
              <span className={`${src.color} text-[10px]`}>{src.label}</span>
            </div>
          </div>
        </div>

        {/* meta */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-400">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.type}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.posted}</span>
        </div>

        {/* salary */}
        {job.salary && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-leaf-500/10 px-2 py-0.5 text-[11px] font-semibold text-leaf-300">
            <span className="pn">{job.salary}</span>
            <span className="font-normal text-leaf-400/70">تومان</span>
          </div>
        )}

        {/* tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((t) => (
            <span key={t} className="rounded-md border border-white/[0.08] bg-ink-800/50 px-1.5 py-0.5 text-[10px] text-ink-300">
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent-400/30 bg-accent-500/10 py-2 text-[12px] font-semibold text-accent-300 transition hover:bg-accent-500/20">
          درخواست در {src.label}
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}
