import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Users, CreditCard, BarChart3, TrendingUp,
  MessageSquare, Crown, Zap, Shield, Activity,
  ArrowLeft,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { verifyAdminPin } from "@/lib/auth/adminPin";
import { AdminManagement } from "./AdminManagement";
import { BottomNav } from "@/app/components/BottomNav";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Must be admin — check by session ID or fallback to phone
  const ADMIN_PHONE = "09366291008";
  const adminRes = await pool.query(
    "SELECT is_admin FROM users WHERE id=$1 OR phone=$2 LIMIT 1",
    [session.id, session.phone]
  );
  const isAdmin = adminRes.rows[0]?.is_admin === true || session.phone === ADMIN_PHONE;
  if (!isAdmin) redirect("/dashboard");

  // Must have verified the admin PIN
  const cookieStore = await cookies();
  const pinCookie = cookieStore.get("ay_admin_pin")?.value;
  const pinOk = await verifyAdminPin(pinCookie);
  if (!pinOk) redirect("/admin/pin");

  // ── Data ──────────────────────────────────────────────────────
  const [
    userStatsRes,
    planDistRes,
    revenueRes,
    usageRes,
    weeklySignupsRes,
    recentPaymentsRes,
  ] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*)                                                           AS total,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')   AS new_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS new_day,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')  AS new_month
      FROM users
    `),
    pool.query(`
      SELECT plan_type, COUNT(*) AS cnt FROM users GROUP BY plan_type ORDER BY cnt DESC
    `),
    pool.query(`
      SELECT
        COALESCE(SUM(amount_toman),0)                                                         AS total_toman,
        COALESCE(SUM(amount_toman) FILTER (WHERE paid_at >= date_trunc('month', NOW())),0)    AS month_toman,
        COUNT(*) FILTER (WHERE status='paid')                                                  AS paid_count
      FROM invoices
    `),
    pool.query(`
      SELECT type, COUNT(*) AS cnt
      FROM usage_logs WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY type
    `),
    // Signups per day for the last 7 days
    pool.query(`
      SELECT date_trunc('day', created_at)::date AS day, COUNT(*) AS cnt
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY 1 ORDER BY 1
    `),
    pool.query(`
      SELECT i.id, i.plan_type, i.amount_toman, i.status, i.paid_at, u.phone
      FROM invoices i JOIN users u ON u.id = i.user_id
      ORDER BY i.created_at DESC LIMIT 6
    `),
  ]);

  const s          = userStatsRes.rows[0];
  const planDist   = planDistRes.rows;
  const rev        = revenueRes.rows[0];
  const usage      = usageRes.rows;
  const weekSigns  = weeklySignupsRes.rows;
  const recentPays = recentPaymentsRes.rows;

  const total     = parseInt(s.total, 10);
  const newWeek   = parseInt(s.new_week, 10);
  const newDay    = parseInt(s.new_day, 10);
  const newMonth  = parseInt(s.new_month, 10);
  const chatWeek  = parseInt(usage.find((r: any) => r.type === "chat_message")?.cnt ?? "0", 10);
  const anlWeek   = parseInt(usage.find((r: any) => r.type === "analysis")?.cnt ?? "0", 10);
  const totalRev  = parseInt(rev.total_toman, 10);
  const monthRev  = parseInt(rev.month_toman, 10);

  // Plan counts
  const planCount = (pid: string) =>
    parseInt(planDist.find((r: any) => r.plan_type === pid)?.cnt ?? "0", 10);
  const freeCnt  = planCount("free");
  const proCnt   = planCount("pro");
  const maxCnt   = planCount("max");
  const paidTotal = proCnt + maxCnt;
  const paidPct   = total > 0 ? Math.round((paidTotal / total) * 100) : 0;

  // Weekly sparkline (max 7 bars)
  const sparkMax = Math.max(...weekSigns.map((r: any) => parseInt(r.cnt, 10)), 1);

  return (
    <div dir="rtl" style={{ minHeight: "100svh", background: "#020306", color: "#e8efea", paddingBottom: 96 }}>
      <BottomNav />

      {/* ── Header ───────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.90)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            <ArrowLeft size={18} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <Shield size={16} style={{ color: "#fcd34d" }} />
            <span style={{ fontWeight: 900, fontSize: 16 }}>پنل ادمین</span>
            <span style={{
              padding: "1px 7px", borderRadius: 20, fontSize: 9, fontWeight: 800,
              background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.30)",
              color: "#fcd34d", letterSpacing: "0.06em",
            }}>ADMIN</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {session.phone}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── KPI Row ──────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            {
              icon: Users, label: "کل کاربران",
              value: toPersian(total), accent: "#34d399",
              sub: `+${toPersian(newDay)} امروز · +${toPersian(newWeek)} هفته`,
            },
            {
              icon: Crown, label: "کاربران پولی",
              value: `${toPersian(paidTotal)} (${toPersian(paidPct)}٪)`,
              accent: "#fcd34d",
              sub: `پرو ${toPersian(proCnt)} · مکس ${toPersian(maxCnt)}`,
            },
            {
              icon: CreditCard, label: "درآمد این ماه",
              value: `${formatK(monthRev)}K`, accent: "#60a5fa",
              sub: `کل: ${formatK(totalRev)}K تومان`,
            },
            {
              icon: MessageSquare, label: "فعالیت این هفته",
              value: toPersian(chatWeek + anlWeek), accent: "#c4b5fd",
              sub: `چت ${toPersian(chatWeek)} · تحلیل ${toPersian(anlWeek)}`,
            },
          ].map(({ icon: Icon, label, value, accent, sub }) => (
            <div key={label} style={{
              borderRadius: 16, padding: "16px 14px",
              background: `linear-gradient(135deg, ${accent}0d 0%, transparent 100%)`,
              border: `1px solid ${accent}22`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Icon size={14} style={{ color: accent }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 20, color: accent, fontFamily: "monospace" }}>{value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Plan distribution + Weekly signups ───────────── */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>

          {/* Plan bars */}
          <div style={{ borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <BarChart3 size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>توزیع پلن‌ها</span>
            </div>
            {[
              { id: "max", label: "مکس", cnt: maxCnt, color: "#fcd34d", icon: <Crown size={11} /> },
              { id: "pro", label: "پرو", cnt: proCnt, color: "#34d399", icon: <Zap size={11} /> },
              { id: "free", label: "رایگان", cnt: freeCnt, color: "rgba(255,255,255,0.3)", icon: <Users size={11} /> },
            ].map(({ label, cnt, color, icon }) => {
              const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
              return (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color, fontWeight: 600 }}>
                      {icon} {label}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                      {toPersian(cnt)} ({toPersian(pct)}٪)
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: color, transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly sparkline */}
          <div style={{ borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <TrendingUp size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>ثبت‌نام ۷ روز اخیر</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
              {weekSigns.length === 0
                ? <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>داده‌ای نیست</div>
                : weekSigns.map((r: any, i: number) => {
                  const cnt = parseInt(r.cnt, 10);
                  const h = Math.max(4, Math.round((cnt / sparkMax) * 52));
                  const date = new Date(r.day).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{cnt}</div>
                      <div style={{ width: "100%", height: h, borderRadius: 3, background: "#34d399", opacity: 0.7 }} />
                      <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{date}</div>
                    </div>
                  );
                })
              }
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
              <span>این ماه: +{toPersian(newMonth)} کاربر</span>
              <span style={{ color: "#34d399" }}>+{toPersian(newWeek)} این هفته</span>
            </div>
          </div>
        </div>

        {/* ── Recent Payments ──────────────────────────────── */}
        {recentPays.length > 0 && (
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <CreditCard size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>آخرین پرداخت‌ها</span>
            </div>
            {recentPays.map((inv: any) => (
              <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: inv.status === "paid" ? "#34d399" : inv.status === "failed" ? "#ef4444" : "#fcd34d" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontFamily: "monospace", direction: "ltr" }}>{inv.phone}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                    {inv.plan_type === "pro" ? "پرو" : inv.plan_type === "max" ? "مکس" : inv.plan_type}
                    {inv.paid_at && ` · ${new Date(inv.paid_at).toLocaleDateString("fa-IR")}`}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: inv.status === "paid" ? "#34d399" : "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                  {parseInt(inv.amount_toman).toLocaleString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Activity indicator ───────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}>
          <Activity size={13} style={{ color: "#34d399" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            سیستم آنلاین · {total > 0 ? `${toPersian(total)} کاربر ثبت‌نام کرده` : "اولین کاربر منتظره"}
          </span>
          <div style={{ marginRight: "auto", width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
        </div>

        {/* ── User Management ──────────────────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Users size={14} style={{ color: "#fcd34d" }} />
            <span style={{ fontWeight: 800, fontSize: 15 }}>مدیریت کاربران</span>
          </div>
          <AdminManagement />
        </div>

      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────
function toPersian(n: number): string {
  return n.toLocaleString("fa-IR");
}
function formatK(n: number): string {
  if (n === 0) return "۰";
  return Math.round(n / 1000).toLocaleString("fa-IR");
}
