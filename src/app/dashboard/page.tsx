import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import type { AnalysisResult } from "@/lib/claude";
import {
  Sparkles, Target, Zap, TrendingUp, Shield, ArrowLeft,
  ExternalLink, Clock, BarChart3, LogOut, Lightbulb, Award,
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
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="card max-w-md text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-brand-400" />
          <h2 className="mb-2 text-xl font-bold">هنوز تحلیلی نداریم</h2>
          <p className="mb-6 text-sm text-ink-300">بریم پروفایلت رو کامل کنیم.</p>
          <Link href="/onboarding" className="btn-primary">شروع تحلیل</Link>
        </div>
      </main>
    );
  }

  const r = latest.result_json;
  const isPro = session.plan === "pro";

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-ink-700/60 bg-ink-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-black text-ink-900">
              AY
            </div>
            <span className="font-bold">A-Y</span>
          </Link>
          <div className="flex items-center gap-3">
            {!isPro && (
              <Link href="/upgrade" className="btn-primary text-sm !py-2 !px-4">
                <Sparkles className="h-4 w-4 ml-1" />
                ارتقا به Pro
              </Link>
            )}
            <DashboardClient />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-2 text-sm text-ink-400">سلام</div>
        <h1 className="mb-8 text-3xl font-black">{profile.full_name} 👋</h1>

        <section className="mb-10 card !bg-gradient-to-br !from-brand-500/10 !via-ink-800/50 !to-ink-800/50">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-bold">خلاصه تحلیل</h2>
          </div>
          <p className="mb-6 text-base leading-relaxed text-ink-100">{r.analysis_summary}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-ink-600/60 bg-ink-900/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-brand-400" />
                <span className="font-medium">سطح ریسک جایگزینی</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={r.risk_level} />
              </div>
              <p className="mt-3 text-sm text-ink-300 leading-relaxed">{r.risk_explanation}</p>
            </div>
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-brand-400" />
                <span className="font-medium">ایده اهرم شخصی</span>
              </div>
              <p className="text-sm text-ink-200 leading-relaxed">{r.leverage_idea}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">ابزارهای پیشنهادی برای {profile.job_title}</h2>
              <p className="mt-1 text-sm text-ink-400">
                بر اساس پروفایل و تجربه تو، این ابزارها بیشترین اهرم رو برات می‌سازن.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {r.top_tools.map((tool, i) => (
              <article key={i} className="card group">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/20 text-xs font-bold text-brand-400">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-bold">{tool.name}</h3>
                    </div>
                    <span className="chip">{tool.category}</span>
                  </div>
                  <DifficultyBadge d={tool.difficulty} />
                </div>

                <div className="mb-4 space-y-3 text-sm">
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-brand-400">
                      <Target className="h-3.5 w-3.5" />
                      چرا برای تو؟
                    </div>
                    <p className="text-ink-200 leading-relaxed">{tool.why_relevant}</p>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-brand-400">
                      <Zap className="h-3.5 w-3.5" />
                      چطور در کارت استفاده کن
                    </div>
                    <p className="text-ink-200 leading-relaxed">{tool.how_to_use_in_your_job}</p>
                  </div>
                  <div className="rounded-lg bg-ink-900/50 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      مثال واقعی
                    </div>
                    <p className="text-ink-200 leading-relaxed italic">{tool.example_scenario}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-ink-700 pt-3 text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    زمان یادگیری: {tool.learning_time}
                  </span>
                  {tool.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-brand-400 hover:underline">
                      باز کردن
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {r.roadmap && r.roadmap.length > 0 && (
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">نقشه راه ۴ هفته‌ای</h2>
              <p className="mt-1 text-sm text-ink-400">
                قدم به قدم، بدون اینکه گم بشی.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {r.roadmap.map((w, i) => (
                <div key={i} className="card">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-black text-ink-900">
                      {i + 1}
                    </div>
                    <h3 className="font-bold">{w.week}</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-ink-200">
                    {w.goals.map((g, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-brand-400">←</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isPro && (
          <section className="card !border-brand-500/50 !bg-gradient-to-br !from-brand-500/15 !to-transparent text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-400" />
            <h2 className="mb-2 text-xl font-bold">می‌خوای تحلیل عمیق‌تر؟</h2>
            <p className="mx-auto mb-6 max-w-xl text-sm text-ink-300">
              Pro بشو و ۱۰+ ابزار با مثال‌های تفصیلی، تحلیل نامحدود، و چت با مشاور AI اختصاصی رو باز کن.
            </p>
            <Link href="/upgrade" className="btn-primary">
              ارتقا به Pro
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </section>
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link href="/profile" className="btn-ghost text-sm">
            <BarChart3 className="h-4 w-4 ml-1" />
            ویرایش پروفایل و تحلیل مجدد
          </Link>
        </div>
      </div>
    </main>
  );
}

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: { label: "پایین", cls: "bg-green-500/20 text-green-400 border-green-500/30" },
    medium: { label: "متوسط", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    high: { label: "بالا", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const m = map[level] ?? map.medium;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold ${m.cls}`}>
      <TrendingUp className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
}

function DifficultyBadge({ d }: { d: "beginner" | "intermediate" | "advanced" }) {
  const map = {
    beginner: { label: "مبتدی", cls: "text-green-400 bg-green-500/10" },
    intermediate: { label: "متوسط", cls: "text-yellow-400 bg-yellow-500/10" },
    advanced: { label: "پیشرفته", cls: "text-red-400 bg-red-500/10" },
  };
  const m = map[d] ?? map.intermediate;
  return <span className={`rounded-md px-2 py-1 text-xs font-medium ${m.cls}`}>{m.label}</span>;
}
