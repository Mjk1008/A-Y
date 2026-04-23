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
  ArrowLeft,
  ExternalLink,
  Clock,
  BarChart3,
  Lightbulb,
  Award,
  AlertTriangle,
} from "lucide-react";
import { DashboardClient } from "./DashboardClient";

type Analysis = {
  id: string;
  result_json: AnalysisResult;
  created_at: string;
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profileRes = await pool.query(
    "SELECT * FROM profiles WHERE user_id=$1",
    [session.id]
  );
  if (profileRes.rows.length === 0) redirect("/onboarding");

  const profile = profileRes.rows[0];

  const latestRes = await pool.query(
    "SELECT * FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
    [session.id]
  );
  const latest: Analysis | null = latestRes.rows[0] ?? null;

  if (!latest) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-6">
        <div className="card max-w-md w-full text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-brand-400" />
          <h2 className="mb-2 text-lg font-bold">هنوز تحلیلی نداریم</h2>
          <p className="mb-6 text-sm text-ink-400">
            بریم پروفایلت رو کامل کنیم.
          </p>
          <Link href="/onboarding" className="btn-primary">
            شروع تحلیل
          </Link>
        </div>
      </div>
    );
  }

  const r = latest.result_json;
  const isPro = session.plan === "pro";

  return (
    <div className="min-h-[100dvh] pb-20">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-ink-700/40 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-black text-white">
              AY
            </div>
            <span className="text-sm font-bold tracking-tight">ای‌وای</span>
          </Link>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link
                href="/upgrade"
                className="hidden items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/8 px-4 py-2 text-xs font-medium text-brand-400 transition hover:border-brand-500/50 sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                ارتقا به Pro
              </Link>
            )}
            <DashboardClient />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-10">
        {/* ── Greeting ── */}
        <div className="mb-10">
          <p className="mb-1 text-xs text-ink-500">سلام،</p>
          <h1 className="text-3xl font-black tracking-tight">
            {profile.full_name}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {profile.job_title} — {profile.industry}
          </p>
        </div>

        {/* ── Summary card ── */}
        <section className="mb-8 rounded-2xl border border-ink-700/60 bg-ink-800/30 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-ink-300">خلاصه تحلیل</h2>
          </div>

          <p className="mb-6 text-base leading-relaxed text-ink-100">
            {r.analysis_summary}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Risk */}
            <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-ink-400" />
                <span className="text-xs font-medium text-ink-400">
                  سطح ریسک جایگزینی
                </span>
              </div>
              <RiskBadge level={r.risk_level} />
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                {r.risk_explanation}
              </p>
            </div>

            {/* Leverage */}
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-medium text-brand-400">
                  ایده اهرم شخصی
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-200">
                {r.leverage_idea}
              </p>
            </div>
          </div>
        </section>

        {/* ── Tools ── */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight">
              ابزارهای پیشنهادی
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              بر اساس شغل {profile.job_title} و مهارت‌های تو
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {r.top_tools.map((tool, i) => (
              <article
                key={i}
                className="rounded-2xl border border-ink-700/60 bg-ink-800/30 p-5 transition hover:border-ink-600/80"
              >
                {/* Tool header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-500/15 text-[11px] font-bold text-brand-400">
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-ink-100">{tool.name}</h3>
                    </div>
                    <span className="chip">{tool.category}</span>
                  </div>
                  <DifficultyBadge d={tool.difficulty} />
                </div>

                {/* Tool details */}
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-500">
                      <Target className="h-3 w-3" />
                      چرا برای تو؟
                    </div>
                    <p className="leading-relaxed text-ink-300">
                      {tool.why_relevant}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-500">
                      <Zap className="h-3 w-3" />
                      چطور در کارت استفاده کن
                    </div>
                    <p className="leading-relaxed text-ink-300">
                      {tool.how_to_use_in_your_job}
                    </p>
                  </div>

                  <div className="rounded-lg bg-ink-900/60 p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-ink-600">
                      <Sparkles className="h-3 w-3" />
                      مثال واقعی
                    </div>
                    <p className="text-xs leading-relaxed text-ink-400 italic">
                      {tool.example_scenario}
                    </p>
                  </div>
                </div>

                {/* Tool footer */}
                <div className="mt-4 flex items-center justify-between border-t border-ink-700/40 pt-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {tool.learning_time}
                  </span>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-brand-400 transition hover:text-brand-300"
                    >
                      باز کردن
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Roadmap ── */}
        {r.roadmap && r.roadmap.length > 0 && (
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight">
                نقشه راه ۴ هفته‌ای
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                قدم به قدم، بدون اینکه گم بشی.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {r.roadmap.map((w, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-ink-700/60 bg-ink-800/30 p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-sm font-bold text-brand-400">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-ink-200">{w.week}</h3>
                  </div>
                  <ul className="space-y-2">
                    {w.goals.map((g, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500/60" />
                        <span className="leading-relaxed text-ink-300">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Pro upsell ── */}
        {!isPro && (
          <section className="mb-8 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="mb-1.5 text-lg font-bold">
                  می‌خوای تحلیل عمیق‌تر؟
                </h2>
                <p className="text-sm leading-relaxed text-ink-400">
                  Pro بشو و ۱۰+ ابزار با مثال‌های تفصیلی، تحلیل نامحدود، و چت
                  با مشاور AI اختصاصی رو باز کن.
                </p>
              </div>
              <Link href="/upgrade" className="btn-primary shrink-0">
                ارتقا به Pro
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* ── Edit profile ── */}
        <div className="flex justify-center">
          <Link href="/profile" className="btn-ghost text-sm">
            <BarChart3 className="h-4 w-4" />
            ویرایش پروفایل و تحلیل مجدد
          </Link>
        </div>
      </main>
    </div>
  );
}

/* ── Helpers ── */

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: {
      label: "پایین",
      cls: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: TrendingUp,
    },
    medium: {
      label: "متوسط",
      cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: AlertTriangle,
    },
    high: {
      label: "بالا",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
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
    beginner: { label: "مبتدی", cls: "text-green-400 bg-green-500/8 border-green-500/15" },
    intermediate: {
      label: "متوسط",
      cls: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
    },
    advanced: { label: "پیشرفته", cls: "text-red-400 bg-red-500/8 border-red-500/15" },
  };
  const m = map[d] ?? map.intermediate;
  return (
    <span
      className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-medium ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
