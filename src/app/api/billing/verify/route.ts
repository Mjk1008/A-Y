import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { zarinpalVerify } from "@/lib/zarinpal";
import { PLANS } from "@/app/config/plans";

// Zarinpal redirects here after payment: /api/billing/verify?Authority=...&Status=OK|NOK
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authority = searchParams.get("Authority") || "";
  const status = searchParams.get("Status");

  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  if (status !== "OK" || !authority) {
    return NextResponse.redirect(`${base}/billing/failed?reason=cancelled`);
  }

  // Find pending invoice by authority
  const invoiceRes = await query(
    `SELECT * FROM invoices WHERE payment_ref = $1 AND status = 'pending'`,
    [authority]
  );
  if (!invoiceRes.rows.length) {
    return NextResponse.redirect(`${base}/billing/failed?reason=not_found`);
  }

  const invoice = invoiceRes.rows[0];
  const plan = PLANS.find((p) => p.id === invoice.plan_type);
  if (!plan) {
    return NextResponse.redirect(`${base}/billing/failed?reason=invalid_plan`);
  }

  try {
    const { refId } = await zarinpalVerify({
      authority,
      amountToman: invoice.amount_toman,
    });

    // Calculate expiry
    const expiresAt = new Date();
    if (invoice.billing_cycle === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Update invoice to paid
    await query(
      `UPDATE invoices SET status='paid', zarinpal_ref=$1, paid_at=NOW() WHERE id=$2`,
      [refId, invoice.id]
    );

    // Deactivate any existing active subscriptions, then insert the new one
    // (avoids ON CONFLICT DO NOTHING which silently drops renewals)
    await query(
      `UPDATE subscriptions SET status='replaced' WHERE user_id=$1 AND status='active'`,
      [invoice.user_id]
    );
    await query(
      `INSERT INTO subscriptions
         (user_id, plan_type, status, expires_at, payment_ref, zarinpal_ref, amount_toman, billing_cycle)
       VALUES ($1, $2, 'active', $3, $4, $5, $6, $7)`,
      [invoice.user_id, invoice.plan_type, expiresAt, authority, refId,
       invoice.amount_toman, invoice.billing_cycle]
    );

    // Update user plan
    await query(
      `UPDATE users SET plan_type=$1 WHERE id=$2`,
      [invoice.plan_type, invoice.user_id]
    );

    // Increment promo code usage if applicable
    // (skipping for brevity — add when promo_code field populated in invoice)

    return NextResponse.redirect(
      `${base}/billing/success?ref=${refId}&plan=${invoice.plan_type}`
    );
  } catch (err: any) {
    console.error("Zarinpal verify error:", err);
    await query(
      `UPDATE invoices SET status='failed' WHERE payment_ref=$1`,
      [authority]
    );
    return NextResponse.redirect(`${base}/billing/failed?reason=verify_failed`);
  }
}
