import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { ProfileClient } from "./ProfileClient";
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
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Link>
        <ProfileClient initial={profile} />
      </div>
    </main>
  );
}
