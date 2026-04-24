import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [userRes, prefsRes] = await Promise.all([
    query(`SELECT phone, plan_type, created_at FROM users WHERE id=$1`, [session.id]),
    query(`SELECT * FROM notification_prefs WHERE user_id=$1`, [session.id]),
  ]);

  const user  = userRes.rows[0];
  const prefs = prefsRes.rows[0] || {
    weekly_digest: true, job_alerts: true, tool_updates: true,
    expiry_reminder: true, chat_reminders: false, marketing: false,
  };

  return <SettingsClient user={user} prefs={prefs} />;
}
