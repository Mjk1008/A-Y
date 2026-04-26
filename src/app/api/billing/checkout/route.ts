import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { zarinpalRequest } from "@/lib/zarinpal";
import { PLANS } from "@/app/config/plans";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { planId, billingCycle, promoCode } = await req.json();

  const plan = PLANS.find((p) => p.id === planId && p.id !== "free");
  if (!plan) return NextResponse.json({ error: "invalid plan" }, { status: 400 });

  // Determine amount
  let amountToman = plan.priceToman;
  let discountPct = 0;

  // Validate promo code if provided
  // Wrapped in try/catch: promo_codes table may not exist yet
  if (promoCode) {
    try {
      const promoRes = await query(
        `SELECT * FROM promo_codes
         WHERE code = $1 AND active = true
           AND (expires_at IS NULL OR expires_at > NOW())
           AND (max_uses IS NULL OR used_count < max_uses)
           AND (plan_type IS NULL OR plan_type = $2)`,
        [promoCode.toUpperCase(), planId]
      );
      if (promoRes.rows.length > 0) {
        discountPct = promoRes.rows[0].discount_pct;
        amountToman = Math.round(amountToman * (1 - discountPct / 100));
      }
    } catch {
      // promo_codes table not yet created — treat code as invalid (no discount)
    }
  }

  // Yearly billing
  if (billingCycle === "yearly" && planId === "pro") {
    // Pro doesn't have yearly, skip — only max has yearly
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_BASE_URL not configured" }, { status: 500 });
  }
  const callbackUrl = `${baseUrl}/api/billing/verify`;

  try {
    const { authority, gatewayUrl } = await zarinpalRequest({
      amountToman,
      description: `ای‌وای — پلن ${plan.displayName}`,
      callbackUrl,
      mobile: session.phone,
    });

    // Create pending invoice
    await query(
      `INSERT INTO invoices (user_id, plan_type, billing_cycle, amount_toman, status, payment_ref)
       VALUES ($1, $2, $3, $4, 'pending', $5)`,
      [session.id, planId, plan.billingCycle, amountToman, authority]
    );

    return NextResponse.json({ gatewayUrl, authority });
  } catch (err: any) {
    console.error("Zarinpal checkout error:", err);
    return NextResponse.json(
      { error: err.message || "payment initiation failed" },
      { status: 502 }
    );
  }
}
