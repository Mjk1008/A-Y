import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import type { AnalysisResult } from "@/lib/claude";
import {
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Shield,
  ExternalLink,
  Clock,
  Lightbulb,
  Award,
  AlertTriangle,
  ArrowRight,
  Share2,
} from "lucide-react";
import { RoadmapSection } from "../RoadmapSection";
import { BottomNav } from "@/app/components/BottomNav";
import { ShareButton } from "./ShareButton";

export default async function AnalysisPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [latestRes, progressRes] = await Promise.all([
    pool.query(
      "SELECT * FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
      [session.id]
    ),
    pool
      .query(
        `SELECT week_num, day_num, task_key, completed
         FROM roadmap_progress WHERE user_id=$1 ORDER BY week_num, day_num`,
        [session.id]
      )
      .catch(() => ({ rows: [] })),
  ]);

  const latest = latestRes.rows[0] ?? null;
  if (!latest) redirect("/profile");

  const r = latest.result_json as AnalysisResult;
  const roadmapProgress = progressRes.rows ?? [];
  const plan = session.plan ?? "free";
  const isFree = plan === "free";

  return (
    <div className="min-h-[100dvh] pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      {/* Header first in DOM for screen readers */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.06]"
        style={{
          background: "rgba(2,3,6,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3.5">
          <Link
            href="/dashboard"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-ink-100">تحلیل مسیر شغلی</h1>
            <p className="text-[10.5px] text-ink-600">
              {new Date(latest.created_at).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mr-auto flex items-center gap-2">
            <ShareButton analysisId={latest.id} />
            <Link
              href="/profile"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11.5px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              تحلیل مجدد
            </Link>
          </div>
        </div>
      </header>

      <BottomNav />
      <main className="mx-auto max-w-md px-5 pt-6">
        {/* ── Summary ── */}
        <section className="mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-ink-300">خلاصه تحلیل</h2>
          </div>
          <p className="mb-5 text-[14px] leading-relaxed text-ink-100">
            {r.analysis_summary}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
              <div className="mb-2.5 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-ink-500" />
                <span className="text-xs font-medium text-ink-500">
                  ریسک جایگزینی
                </span>
              </div>
              <RiskBadge level={r.risk_level} />
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-400">
                {r.risk_explanation}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
              <div className="mb-2.5 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  اهرم شخصی
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-ink-200">
                {r.leverage_idea}
              </p>
            </div>
          </div>
        </section>

        {/* ── Tools ── */}
        <section id="tools" className="mb-5 scroll-mt-20">
          <div className="mb-3">
            <h2 className="text-base font-bold tracking-tight">ابزارهای پیشنهادی</h2>
            <p className="mt-0.5 text-[12px] text-ink-500">
              بر اساس شغل و مهارت‌های تو
            </p>
          </div>
          <div className="space-y-3">
            {r.top_tools.map((tool, i) => (
              <article
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-white/[0.10]"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/[0.12] text-[10px] font-bold text-emerald-400">
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-ink-100">{tool.name}</h3>
                    </div>
                    <span className="chip text-[11px]">{tool.category}</span>
                  </div>
                  <DifficultyBadge d={tool.difficulty} />
                </div>

                <div className="space-y-2.5 text-[13px]">
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] text-ink-500">
                      <Target className="h-3 w-3" />
                      چرا برای تو؟
                    </div>
                    <p className="leading-relaxed text-ink-300">
                      {tool.why_relevant}
                    </p>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] text-ink-500">
                      <Zap className="h-3 w-3" />
                      چطور استفاده کن
                    </div>
                    <p className="leading-relaxed text-ink-300">
                      {tool.how_to_use_in_your_job}
                    </p>
                  </div>
                  <div className="rounded-lg bg-black/20 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[10.5px] text-ink-600">
                      <Sparkles className="h-2.5 w-2.5" />
                      مثال واقعی
                    </div>
                    <p className="text-[12px] italic leading-relaxed text-ink-400">
                      {tool.example_scenario}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11.5px] text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {tool.learning_time}
                  </span>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 transition hover:text-emerald-300"
                    >
                      باز کن
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Upsell — Free users only ── */}
        {isFree && (
          <section className="mb-5 overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.10] to-transparent p-5">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">پرو</span>
            </div>
            <h3 className="mb-1 text-[15px] font-black text-ink-50">
              تحلیل عمیق‌تر — ۸ ابزار بیشتر
            </h3>
            <p className="mb-4 text-[12.5px] leading-relaxed text-ink-400">
              با پلن پرو، ۸+ ابزار شخصی‌سازی‌شده، نقشه راه ماهانه، و ۲۰۰ پیام مسیریاب AI در ماه دریافت می‌کنی.
            </p>
            <Link
              href="/billing/checkout"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-emerald-400"
            >
              <Zap className="h-3.5 w-3.5" />
              ارتقا به پرو — ۲۹۸ هزار تومان/ماه
            </Link>
          </section>
        )}

        {/* ── Roadmap ── */}
        {r.roadmap && r.roadmap.length > 0 && (
          <div id="roadmap" className="scroll-mt-20">
            <RoadmapSection
              analysisId={latest.id}
              roadmap={r.roadmap}
              initialProgress={roadmapProgress}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: {
      label: "پایین",
      cls: "bg-green-500/10 text-green-400 border-green-500/15",
      icon: TrendingUp,
    },
    medium: {
      label: "متوسط",
      cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/15",
      icon: AlertTriangle,
    },
    high: {
      label: "بالا",
      cls: "bg-red-500/10 text-red-400 border-red-500/15",
      icon: AlertTriangle,
    },
  };
  const m = map[level] ?? map.medium;
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${m.cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
}

function DifficultyBadge({
  d,
}: {
  d: "beginner" | "intermediate" | "advanced";
}) {
  const map = {
    beginner: {
      label: "مبتدی",
      cls: "text-green-400 bg-green-500/[0.08] border-green-500/12",
    },
    intermediate: {
      label: "متوسط",
      cls: "text-yellow-400 bg-yellow-500/[0.08] border-yellow-500/12",
    },
    advanced: {
      label: "پیشرفته",
      cls: "text-red-400 bg-red-500/[0.08] border-red-500/12",
    },
  };
  const m = map[d] ?? map.intermediate;
  return (
    <span
      className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10.5px] font-medium ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
