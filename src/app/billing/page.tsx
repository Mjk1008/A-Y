import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { PLANS } from "@/app/config/plans";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const plan = PLANS.find((p) => p.id === session.plan) || PLANS[0];

  // Subscription
  const subRes = await query(
    `SELECT * FROM subscriptions WHERE user_id=$1 AND status IN ('active','cancelled')
     ORDER BY created_at DESC LIMIT 1`,
    [session.id]
  );

  // Invoices
  const invRes = await query(
    `SELECT id, plan_type, billing_cycle, amount_toman, status, zarinpal_ref, paid_at, created_at
     FROM invoices WHERE user_id=$1 ORDER BY created_at DESC LIMIT 12`,
    [session.id]
  );

  // Usage this week/month
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [analysesRes, chatRes] = await Promise.all([
    query(
      `SELECT COUNT(*) FROM usage_logs WHERE user_id=$1 AND type='analysis' AND created_at>=$2`,
      [session.id, weekStart]
    ),
    query(
      `SELECT COUNT(*) FROM usage_logs WHERE user_id=$1 AND type='chat_message'
       AND created_at>=date_trunc('month',NOW())`,
      [session.id]
    ),
  ]);

  return (
    <BillingClient
      plan={plan}
      subscription={subRes.rows[0] || null}
      invoices={invRes.rows}
      usage={{
        analysesUsed: parseInt(analysesRes.rows[0].count, 10),
        chatUsed: parseInt(chatRes.rows[0].count, 10),
      }}
    />
  );
}
