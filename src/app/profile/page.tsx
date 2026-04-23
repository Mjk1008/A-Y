import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { ProfileClient } from "./ProfileClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profileRes = await pool.query(
    "SELECT * FROM profiles WHERE user_id=$1",
    [session.id]
  );
  if (profileRes.rows.length === 0) redirect("/onboarding");

  const profile = profileRes.rows[0];

  return (
    <div className="min-h-[100dvh] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-300"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به داشبورد
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">ویرایش پروفایل</h1>
          <p className="mt-1 text-sm text-ink-400">
            بعد از ویرایش، برای نتیجه تازه «تحلیل مجدد» بزن.
          </p>
        </div>

        <ProfileClient initial={profile} />
      </div>
    </div>
  );
}
