"use client";

import { Briefcase, MapPin, ExternalLink, Clock, Loader2, Search, Wifi } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  url: string;
  posted_at: string;
  is_remote: boolean;
  source: string;
}

const SOURCES: Record<string, { label: string; color: string }> = {
  jobinja:    { label: "جاب‌اینجا",  color: "text-emerald-400" },
  jobvision:  { label: "جاب‌ویژن",   color: "text-sky-400" },
  irantalent: { label: "ایران‌تلنت", color: "text-rose-400" },
  karboom:    { label: "کاربوم",     color: "text-amber-400" },
};

export default function MatchedJobs({ limit = 3 }: { limit?: number }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [remote, setRemote] = useState(false);
  const [source, setSource] = useState("");

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit) });
    if (search) params.set("q", search);
    if (remote) params.set("remote", "true");
    if (source) params.set("source", source);

    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, search, remote, source]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchJobs, search]);

  return (
    <div className="px-5 py-8">
      <div className="mx-auto max-w-md">
        {/* Search + Filters */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در شغل‌ها..."
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pr-9 pl-4 text-sm text-ink-100 placeholder-ink-600 outline-none transition focus:border-white/[0.12]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="دورکاری"
              active={remote}
              onClick={() => setRemote(!remote)}
            />
            {Object.entries(SOURCES).map(([key, val]) => (
              <FilterChip
                key={key}
                label={val.label}
                active={source === key}
                onClick={() => setSource(source === key ? "" : key)}
                color={val.color}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-ink-600" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="mb-1 font-bold text-ink-200">
              {search || remote || source ? "نتیجه‌ای پیدا نشد" : "به زودی شغل‌ها اینجان"}
            </p>
            <p className="text-sm text-ink-500 leading-relaxed">
              {search || remote || source
                ? "فیلترها رو تغییر بده یا جستجو رو پاک کن"
                : "داریم شغل‌های مناسب مسیرت رو جمع‌آوری می‌کنیم."}
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
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
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
      <span className={active && color ? color : undefined}>{label}</span>
    </button>
  );
}

function JobCard({ job }: { job: Job }) {
  const src = SOURCES[job.source] ?? { label: job.source, color: "text-ink-400" };
  const timeAgo = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString("fa-IR")
    : "";

  return (
    <article className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.10]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-bold text-ink-300">
          {job.company?.charAt(0) ?? "؟"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13.5px] font-bold text-ink-100">{job.title}</h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-400">
            <span>{job.company}</span>
            <span className="text-ink-700">·</span>
            <span className={`text-[10px] ${src.color}`}>{src.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
        )}
        {job.is_remote && (
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-500">دورکاری</span>
          </span>
        )}
        {timeAgo && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo}
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/[0.06] bg-ink-800/50 px-1.5 py-0.5 text-[10px] text-ink-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-500/8 py-2 text-[12px] font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
        >
          درخواست در {src.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </article>
  );
}
