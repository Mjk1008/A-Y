import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import type { AnalysisResult } from "@/lib/claude";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Map,
  Wrench,
  ArrowLeft,
  AlertTriangle,
  User,
  Settings,
  CreditCard,
  ChevronLeft,
  Crown,
  Zap,
  Gamepad2,
  Shield,
  Flame,
} from "lucide-react";
import { DashboardClient } from "./DashboardClient";
import { BottomNav } from "@/app/components/BottomNav";
import { LogoStatic } from "@/app/components/Logo";
import { PLANS } from "@/app/config/plans";
import { getStreak } from "@/lib/streak";

const ADMIN_PHONE = "09366291008";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profileRes = await pool.query(
    "SELECT * FROM profiles WHERE user_id=$1",
    [session.id]
  );
  if (profileRes.rows.length === 0) redirect("/onboarding");

  const profile = profileRes.rows[0];
  const plan = session.plan ?? "free";
  const planDef = PLANS.find((p) => p.id === plan) ?? PLANS[0];
  const isPro = plan === "pro" || plan === "max";
  const isMax = plan === "max";

  // Check admin
  const adminRes = await pool.query(
    "SELECT is_admin FROM users WHERE id=$1 LIMIT 1",
    [session.id]
  ).catch(() => ({ rows: [] }));
  const isAdmin = adminRes.rows[0]?.is_admin === true || session.phone === ADMIN_PHONE;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [latestRes, analysesUsedRes, jobCountRes, courseCountRes, subRes, progressRes, streakData] =
    await Promise.all([
      pool.query(
        "SELECT id, result_json, created_at FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
        [session.id]
      ),
      pool
        .query(
          `SELECT COUNT(*) FROM usage_logs WHERE user_id=$1 AND type='analysis' AND created_at>=$2`,
          [session.id, weekStart]
        )
        .catch(() => ({ rows: [{ count: "0" }] })),
      pool
        .query(
          "SELECT COUNT(*) FROM crawled_jobs WHERE crawled_at >= NOW() - INTERVAL '7 days'"
        )
        .catch(() => ({ rows: [{ count: "0" }] })),
      pool
        .query("SELECT COUNT(*) FROM crawled_courses")
        .catch(() => ({ rows: [{ count: "0" }] })),
      pool
        .query(
          `SELECT * FROM subscriptions WHERE user_id=$1 AND status IN ('active','cancelled') ORDER BY created_at DESC LIMIT 1`,
          [session.id]
        )
        .catch(() => ({ rows: [] })),
      pool
        .query(
          `SELECT
            COUNT(*) FILTER (WHERE completed) AS done,
            COUNT(*) AS total
           FROM roadmap_progress WHERE user_id=$1`,
          [session.id]
        )
        .catch(() => ({ rows: [{ done: "0", total: "0" }] })),
      getStreak(session.id).catch(() => ({ currentStreak: 0, bestStreak: 0, lastActivityDate: null, totalDaysActive: 0 })),
    ]);

  const latest = latestRes.rows[0] ?? null;
  const analysesUsed = parseInt(analysesUsedRes.rows[0]?.count ?? "0", 10);
  const jobCount = parseInt(jobCountRes.rows[0]?.count ?? "0", 10);
  const courseCount = parseInt(courseCountRes.rows[0]?.count ?? "0", 10);
  const subscription = subRes.rows[0] ?? null;
  const progressDone = parseInt(progressRes.rows[0]?.done ?? "0", 10);
  const progressTotal = parseInt(progressRes.rows[0]?.total ?? "0", 10);

  let daysLeft: number | null = null;
  let isNearExpiry = false;
  if (subscription?.expires_at) {
    const diff = new Date(subscription.expires_at).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    isNearExpiry = daysLeft <= 7;
  }

  const r = latest?.result_json as AnalysisResult | null;
  // Use nickname if set, otherwise first name
  const firstName =
    (profile.nickname as string | null) ??
    profile.full_name?.split(" ")[0] ??
    "کاربر";

  return (
    <div className="min-h-[100dvh] pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      <DashboardHeader plan={plan} isPro={isPro} isMax={isMax} />
      <BottomNav />

      <main className="mx-auto max-w-md px-5 pt-6">
        {/* ── Admin Banner ── */}
        {isAdmin && (
          <Link
            href="/admin"
            className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3 transition hover:bg-amber-500/[0.12]"
          >
            <Shield className="h-4 w-4 shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="text-[12px] font-bold text-amber-300">پنل مدیریت</p>
              <p className="text-[10.5px] text-amber-400/60">آمار کاربران و مدیریت سیستم</p>
            </div>
            <ArrowLeft className="h-3.5 w-3.5 text-amber-400/60" />
          </Link>
        )}

        {/* ── Greeting ── */}
        <div className="mb-6">
          <p className="text-[11px] text-ink-600">
            {new Date().toLocaleDateString("fa-IR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-1 text-[1.65rem] font-black tracking-tight">
            سلام {firstName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-ink-400">
            {profile.job_title
              ? `${profile.job_title}${profile.industry ? ` · ${profile.industry}` : ""}`
              : "مسیر حرفه‌ای هوشمند تو"}
          </p>
        </div>

        {/* ── Streak Card ── */}
        {streakData.currentStreak > 0 && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-orange-500/25 bg-gradient-to-r from-orange-500/[0.10] to-amber-500/[0.06] px-4 py-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-2xl">
              🔥
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-black text-orange-300">
                  {streakData.currentStreak.toLocaleString("fa-IR")} روز
                </span>
                <span className="text-[11px] text-orange-400/70 font-medium">streak</span>
              </div>
              <p className="mt-0.5 text-[11px] text-orange-400/60 leading-snug">
                {streakData.bestStreak > streakData.currentStreak
                  ? `رکورد بهترین: ${streakData.bestStreak.toLocaleString("fa-IR")} روز`
                  : "رکورد شخصی — همینجوری ادامه بده!"}
              </p>
            </div>
            <Flame className="h-5 w-5 text-orange-400 shrink-0" />
          </div>
        )}

        {/* ── Expiry warning ── */}
        {isNearExpiry && daysLeft !== null && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/[0.08] px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-400" />
            <p className="flex-1 text-sm text-yellow-300">
              {daysLeft === 0
                ? "اشتراکت امروز تموم می‌شه!"
                : `${daysLeft.toLocaleString("fa-IR")} روز تا پایان اشتراک`}
            </p>
            <Link
              href="/billing/checkout"
              className="shrink-0 rounded-lg bg-yellow-500 px-2.5 py-1 text-xs font-bold text-black hover:bg-yellow-400 transition"
            >
              تمدید
            </Link>
          </div>
        )}

        {/* ── AI Insight strip ── */}
        {r ? (
          <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] to-transparent p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-[11px] font-semibold text-emerald-400">
                  آخرین تحلیل AI
                </p>
                <p className="text-[13px] leading-relaxed text-ink-200 line-clamp-2">
                  {r.analysis_summary}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/analysis"
              className="mt-3 flex items-center gap-1 text-[11.5px] font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              مشاهده تحلیل کامل
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center">
            <div className="mb-3 text-3xl">🤖</div>
            <p className="mb-1 font-bold text-ink-100">اولین تحلیلت رو شروع کن</p>
            <p className="mb-4 text-xs leading-relaxed text-ink-500">
              بگو چی هستی و چی بلدی — AI بهت می‌گه چطور قوی‌تر بشی
            </p>
            <Link href="/profile" className="btn-lux text-sm">
              شروع تحلیل
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ── Feature Grid ── */}
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            href="/dashboard/analysis"
            title="تحلیل مسیر شغلی"
            desc={
              r
                ? `ریسک جایگزینی: ${
                    r.risk_level === "low"
                      ? "پایین"
                      : r.risk_level === "medium"
                      ? "متوسط"
                      : "بالا"
                  }`
                : "هنوز تحلیل نداری"
            }
            iconBg="bg-emerald-500/20"
            icon={<Sparkles className="h-5 w-5 text-emerald-400" />}
            gradientFrom="from-emerald-500/20"
            borderColor="border-emerald-500/20"
            cta={r ? "مشاهده" : "شروع"}
            active={!!r}
          />

          <FeatureCard
            href="/chat"
            title="مسیریاب AI"
            desc={isPro ? "بپرس، جواب شخصی بگیر" : "۵ پیام در روز رایگان"}
            iconBg="bg-violet-500/20"
            icon={<MessageCircle className="h-5 w-5 text-violet-400" />}
            gradientFrom="from-violet-500/20"
            borderColor="border-violet-500/20"
            cta="گفتگو"
            badge={!isPro ? "رایگان" : undefined}
            active={true}
          />

          <FeatureCard
            href="/jobs"
            title="شغل‌های مچ‌شده"
            desc={
              jobCount > 0
                ? `${jobCount.toLocaleString("fa-IR")} موقعیت فعال`
                : "به زودی آپدیت می‌شه"
            }
            iconBg="bg-sky-500/20"
            icon={<Briefcase className="h-5 w-5 text-sky-400" />}
            gradientFrom="from-sky-500/20"
            borderColor="border-sky-500/20"
            cta="مشاهده"
            active={jobCount > 0}
          />

          <FeatureCard
            href="/courses"
            title="بهترین دوره‌ها"
            desc={
              courseCount > 0
                ? `${courseCount.toLocaleString("fa-IR")} دوره`
                : "به زودی"
            }
            iconBg="bg-orange-500/20"
            icon={<GraduationCap className="h-5 w-5 text-orange-400" />}
            gradientFrom="from-orange-500/20"
            borderColor="border-orange-500/20"
            cta="مشاهده"
            active={courseCount > 0}
          />

          <FeatureCard
            href="/dashboard/analysis#roadmap"
            title="رودمپ هفتگی"
            desc={
              progressTotal > 0
                ? `${progressDone.toLocaleString("fa-IR")} از ${progressTotal.toLocaleString(
                    "fa-IR"
                  )} تسک`
                : "بعد از اولین تحلیل"
            }
            iconBg="bg-yellow-500/20"
            icon={<Map className="h-5 w-5 text-yellow-400" />}
            gradientFrom="from-yellow-500/20"
            borderColor="border-yellow-500/20"
            cta="ادامه"
            active={progressTotal > 0}
          />

          <FeatureCard
            href="/dashboard/analysis#tools"
            title="ابزارهای AI"
            desc={
              r
                ? `${r.top_tools.length.toLocaleString("fa-IR")} ابزار پیشنهادی`
                : "بعد از اولین تحلیل"
            }
            iconBg="bg-pink-500/20"
            icon={<Wrench className="h-5 w-5 text-pink-400" />}
            gradientFrom="from-pink-500/20"
            borderColor="border-pink-500/20"
            cta="مشاهده"
            active={!!r}
          />
        </div>

        {/* ── Referral Card ── */}
        <div className="mt-3 flex items-center gap-4 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-l from-violet-500/[0.07] to-transparent p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">
            🎁
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink-100 text-sm">دعوت دوستت، ۷ روز Pro رایگان</h3>
            <p className="mt-0.5 text-[11.5px] text-ink-500 leading-relaxed">
              لینک اختصاصی خودت رو بگیر
            </p>
          </div>
          <Link
            href="/referral"
            className="shrink-0 rounded-lg border border-violet-500/30 bg-violet-500/15 px-3 py-1.5 text-[11.5px] font-bold text-violet-300 transition hover:bg-violet-500/25"
          >
            دریافت لینک
          </Link>
        </div>

        {/* ── بیکارم حال ندارم ── */}
        <Link
          href="/games"
          className="group mt-3 flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-l from-fuchsia-500/[0.08] to-transparent p-4 transition hover:-translate-y-0.5 hover:border-fuchsia-500/20"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-2xl">
            🎮
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-ink-100">بیکارم حال ندارم</h3>
            <p className="mt-0.5 text-[12px] text-ink-500 leading-relaxed">
              وقتی نه AI می‌تونه کمکت کنه نه بازار سنتی
            </p>
          </div>
          <Gamepad2 className="h-5 w-5 text-fuchsia-400 transition-transform group-hover:scale-110" />
        </Link>

        {/* ── Usage strip ── */}
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-500">استفاده این هفته</span>
            <Link
              href="/billing"
              className="text-[10.5px] text-ink-600 transition hover:text-ink-400"
            >
              مدیریت اشتراک ←
            </Link>
          </div>
          <UsageBar
            label="تحلیل"
            used={analysesUsed}
            limit={planDef.limits.analysesPerWeek}
          />
          {!isPro && (
            <p className="mt-2 text-[10.5px] text-ink-600">
              پلن رایگان ·{" "}
              <Link
                href="/billing/checkout"
                className="text-emerald-500 transition hover:text-emerald-400"
              >
                ارتقا به پرو
              </Link>{" "}
              برای ۵ تحلیل/هفته + مسیریاب AI
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────── */
function FeatureCard({
  href,
  title,
  desc,
  icon,
  iconBg,
  gradientFrom,
  borderColor,
  cta,
  badge,
  active,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  gradientFrom: string;
  borderColor: string;
  cta: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${gradientFrom} to-transparent p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]`}
    >
      {badge && (
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-ink-400">
          {badge}
        </span>
      )}

      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <h3 className="mb-1 text-[13px] font-bold leading-snug text-ink-100">
        {title}
      </h3>
      <p
        className={`mb-3 flex-1 text-[11.5px] leading-relaxed ${
          active ? "text-ink-400" : "text-ink-600"
        }`}
      >
        {desc}
      </p>

      <div className="flex items-center gap-1 text-[11.5px] font-semibold text-ink-400 transition-colors group-hover:text-ink-100">
        {cta}
        <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Usage Bar
───────────────────────────────────────────── */
function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const unlimited = limit === -1;
  const pct = unlimited
    ? 0
    : limit === 0
    ? 0
    : Math.min(100, Math.round((used / limit) * 100));
  const isNear = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-500">{label}</span>
        <span
          className={`font-mono text-[11px] ${
            isNear ? "text-yellow-400" : "text-ink-500"
          }`}
        >
          {unlimited
            ? "نامحدود"
            : `${used.toLocaleString("fa-IR")} / ${limit.toLocaleString("fa-IR")}`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {unlimited ? (
          <div className="h-full w-full animate-pulse rounded-full bg-emerald-500/30" />
        ) : (
          <div
            className={`h-full rounded-full transition-all ${
              isNear ? "bg-yellow-400" : "bg-emerald-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dashboard Header
───────────────────────────────────────────── */
function DashboardHeader({
  plan,
  isPro,
  isMax,
}: {
  plan: string;
  isPro: boolean;
  isMax: boolean;
}) {
  const planLabel = isMax ? "مکس" : isPro ? "پرو" : "رایگان";
  const planColor = isMax
    ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/20"
    : isPro
    ? "bg-emerald-500/12 text-emerald-300 border-emerald-500/20"
    : "bg-white/5 text-ink-400 border-white/[0.08]";

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06]"
      style={{
        background: "rgba(2,3,6,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3.5">
        <Link href="/dashboard">
          <LogoStatic size={32} showWordmark />
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${planColor}`}
          >
            {isMax && <Crown className="mr-1 inline h-3 w-3" />}
            {isPro && !isMax && <Zap className="mr-1 inline h-3 w-3" />}
            {planLabel}
          </span>

          <Link
            href="/billing"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-500 transition hover:text-ink-200"
            title="اشتراک"
          >
            <CreditCard className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-500 transition hover:text-ink-200"
            title="تنظیمات"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-ink-500 transition hover:text-ink-200"
            title="پروفایل"
          >
            <User className="h-3.5 w-3.5" />
          </Link>

          <DashboardClient />
        </div>
      </div>
    </header>
  );
}
