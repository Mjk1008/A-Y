import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import {
  ArrowLeft, Users, CreditCard, BarChart3,
  TrendingUp, AlertCircle, Crown, Zap
} from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Check admin flag in DB
  const adminRes = await pool.query(
    "SELECT is_admin FROM users WHERE id=$1",
    [session.id]
  );
  const isAdmin = adminRes.rows[0]?.is_admin === true;
  if (!isAdmin) redirect("/dashboard");

  // ── Stats queries in parallel ──────────────────────────────────────
  const [
    userStatsRes,
    planDistRes,
    revenueRes,
    usageRes,
    recentUsersRes,
    recentPaymentsRes,
  ] = await Promise.all([
    // Total users, new this week, new this month
    pool.query(`
      SELECT
        COUNT(*)                                                        AS total,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS new_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS new_month
      FROM users
    `),
    // Plan distribution
    pool.query(`
      SELECT plan_type, COUNT(*) AS cnt
      FROM users GROUP BY plan_type ORDER BY cnt DESC
    `),
    // Revenue: total paid, this month
    pool.query(`
      SELECT
        COALESCE(SUM(amount_toman), 0)                                              AS total_toman,
        COALESCE(SUM(amount_toman) FILTER (WHERE paid_at >= date_trunc('month', NOW())), 0) AS month_toman,
        COUNT(*) FILTER (WHERE status='paid')                                        AS paid_count
      FROM invoices
    `),
    // Usage this week
    pool.query(`
      SELECT type, COUNT(*) AS cnt
      FROM usage_logs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY type
    `),
    // Recent 10 users
    pool.query(`
      SELECT u.id, u.phone, u.plan_type, u.is_admin, u.created_at,
             p.full_name, p.job_title
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY u.created_at DESC LIMIT 10
    `),
    // Recent 8 payments
    pool.query(`
      SELECT i.id, i.plan_type, i.billing_cycle, i.amount_toman,
             i.status, i.zarinpal_ref, i.paid_at,
             u.phone
      FROM invoices i JOIN users u ON u.id = i.user_id
      ORDER BY i.created_at DESC LIMIT 8
    `),
  ]);

  const userStats    = userStatsRes.rows[0];
  const planDist     = planDistRes.rows;
  const revenue      = revenueRes.rows[0];
  const usageStats   = usageRes.rows;
  const recentUsers  = recentUsersRes.rows;
  const recentPays   = recentPaymentsRes.rows;

  const analysesWeek = usageStats.find((r: any) => r.type === "analysis")?.cnt ?? 0;
  const chatWeek     = usageStats.find((r: any) => r.type === "chat_message")?.cnt ?? 0;

  const planLabel: Record<string, string> = { free: "رایگان", pro: "پرو", max: "مکس" };
  const planColor: Record<string, string> = {
    free: "text-ink-400",
    pro:  "text-emerald-400",
    max:  "text-yellow-400",
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      <BottomNav />
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-white/[0.06]"
        style={{ background: "rgba(2,3,6,0.85)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link href="/dashboard" className="rounded-lg p-1.5 text-ink-400 transition hover:text-ink-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">پنل ادمین</h1>
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
            ADMIN
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            icon={Users}
            label="کل کاربران"
            value={parseInt(userStats.total, 10).toLocaleString("fa-IR")}
            sub={`+${parseInt(userStats.new_week, 10).toLocaleString("fa-IR")} این هفته`}
          />
          <KpiCard
            icon={CreditCard}
            label="درآمد کل"
            value={`${Math.round(parseInt(revenue.total_toman, 10) / 1000).toLocaleString("fa-IR")}K`}
            sub="تومان"
          />
          <KpiCard
            icon={TrendingUp}
            label="درآمد این ماه"
            value={`${Math.round(parseInt(revenue.month_toman, 10) / 1000).toLocaleString("fa-IR")}K`}
            sub="تومان"
          />
          <KpiCard
            icon={BarChart3}
            label="تحلیل این هفته"
            value={parseInt(analysesWeek, 10).toLocaleString("fa-IR")}
            sub={`${parseInt(chatWeek, 10).toLocaleString("fa-IR")} پیام چت`}
          />
        </div>

        {/* ── Plan distribution ── */}
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Users className="h-4 w-4 text-ink-400" />
            توزیع پلن‌ها
          </h2>
          <div className="space-y-3">
            {["max", "pro", "free"].map((pid) => {
              const row = planDist.find((r: any) => r.plan_type === pid);
              const cnt = row ? parseInt(row.cnt, 10) : 0;
              const total = parseInt(userStats.total, 10) || 1;
              const pct = Math.round((cnt / total) * 100);
              return (
                <div key={pid} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${planColor[pid]}`}>
                      {pid === "max" && <Crown className="mr-1 inline h-3.5 w-3.5" />}
                      {pid === "pro" && <Zap className="mr-1 inline h-3.5 w-3.5" />}
                      {planLabel[pid]}
                    </span>
                    <span className="text-ink-400">
                      {cnt.toLocaleString("fa-IR")} کاربر ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${pid === "max" ? "bg-yellow-400" : pid === "pro" ? "bg-emerald-400" : "bg-white/20"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* ── Recent Users ── */}
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
              <Users className="h-4 w-4 text-ink-400" />
              <h2 className="text-sm font-bold">آخرین کاربران</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentUsers.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-ink-400">
                    {u.full_name ? u.full_name.charAt(0) : u.phone.slice(-2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {u.full_name || u.phone}
                      {u.is_admin && (
                        <span className="mr-1.5 rounded px-1 py-0.5 text-[9px] font-bold bg-yellow-500/15 text-yellow-400">
                          ADMIN
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-600 truncate">
                      {u.job_title || u.phone}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${planColor[u.plan_type] || "text-ink-400"}`}>
                    {planLabel[u.plan_type] || u.plan_type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Payments ── */}
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
              <CreditCard className="h-4 w-4 text-ink-400" />
              <h2 className="text-sm font-bold">آخرین پرداخت‌ها</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentPays.length === 0 && (
                <p className="px-5 py-6 text-center text-sm text-ink-600">هنوز پرداختی ثبت نشده</p>
              )}
              {recentPays.map((inv: any) => (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`h-2 w-2 shrink-0 rounded-full ${inv.status === "paid" ? "bg-emerald-400" : inv.status === "failed" ? "bg-red-400" : "bg-yellow-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{inv.phone}</p>
                    <p className="text-xs text-ink-600">
                      {planLabel[inv.plan_type] || inv.plan_type}
                      {inv.zarinpal_ref && (
                        <span className="mr-1 font-mono text-[10px] text-ink-700">#{inv.zarinpal_ref}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-bold">{parseInt(inv.amount_toman).toLocaleString("fa-IR")}</p>
                    <p className="text-[10px] text-ink-600">تومان</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <AlertCircle className="h-4 w-4 text-ink-400" />
            عملیات سریع
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-1 text-sm font-medium">تغییر پلن کاربر</p>
              <p className="mb-3 text-xs text-ink-500">
                از طریق API: <code className="rounded bg-white/5 px-1 font-mono text-[10px]">POST /api/admin/set-plan</code>
              </p>
              <p className="text-xs text-ink-600 font-mono">
                x-admin-secret: ADMIN_SECRET env
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-1 text-sm font-medium">خروجی داده</p>
              <p className="mb-3 text-xs text-ink-500">دانلود CSV از کاربران و پرداخت‌ها</p>
              <div className="flex gap-2">
                <a
                  href="/api/admin/export/users"
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-ink-300 transition hover:text-ink-100"
                >
                  کاربران
                </a>
                <a
                  href="/api/admin/export/invoices"
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-ink-300 transition hover:text-ink-100"
                >
                  فاکتورها
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-4 w-4 text-ink-400" />
      </div>
      <p className="text-xl font-black tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-400">{label}</p>
      {sub && <p className="mt-0.5 text-[10px] text-ink-600">{sub}</p>}
    </div>
  );
}
