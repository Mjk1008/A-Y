import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import pool from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";
import MatchedJobs from "@/app/components/MatchedJobs";
import { JobsMascotBanner } from "@/app/components/JobsMascotBanner";

export default async function JobsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profileRes, countRes] = await Promise.all([
    pool.query("SELECT skills FROM profiles WHERE user_id=$1", [session.id]),
    pool.query("SELECT COUNT(*) FROM crawled_jobs WHERE crawled_at >= NOW() - INTERVAL '7 days'").catch(() => ({ rows: [{ count: "0" }] })),
  ]);
  const userSkills: string[] = profileRes.rows[0]?.skills ?? [];
  const jobCount = parseInt(countRes.rows[0]?.count ?? "0", 10);

  return (
    <div className="min-h-[100dvh] pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      {/* Header first for screen reader order */}
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
            aria-label="بازگشت"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-ink-100">شغل‌های مچ‌شده</h1>
            <p className="text-[10.5px] text-ink-600">آپدیت روزانه از منابع ایرانی</p>
          </div>
        </div>
      </header>

      <BottomNav />
      <JobsMascotBanner matchCount={jobCount} />
      <MatchedJobs limit={20} userSkills={userSkills} />
    </div>
  );
}
