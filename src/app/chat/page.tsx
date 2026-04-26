import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { ChatClient } from "./ChatClient";
import { BottomNav } from "@/app/components/BottomNav";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profileRes, analysisRes] = await Promise.all([
    pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]),
    pool
      .query(
        "SELECT result_json FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
        [session.id]
      )
      .catch(() => ({ rows: [] })),
  ]);

  const profile  = profileRes.rows[0] ?? null;
  const analysis = analysisRes.rows[0]?.result_json ?? null;

  if (!profile) redirect("/onboarding");

  const nickname = profile.nickname || profile.full_name?.split(" ")[0] || "کاربر";

  return (
    <>
      <BottomNav />
      <ChatClient
        nickname={nickname}
        jobTitle={profile.job_title || ""}
        industry={profile.industry || ""}
        hasAnalysis={!!analysis}
        plan={session.plan ?? "free"}
      />
    </>
  );
}
