"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Crown, Zap, CheckCircle, XCircle, Clock, AlertTriangle, Receipt, CreditCard } from "lucide-react";
import type { Plan } from "@/app/config/plans";
import { BottomNav } from "@/app/components/BottomNav";

interface Props {
  plan: Plan;
  subscription: any;
  invoices: any[];
  usage: { analysesUsed: number; chatUsed: number };
}

const PLAN_LABELS: Record<string, string> = { free: "رایگان", pro: "پرو", max: "مکس" };
const STATUS_LABELS: Record<string, string> = {
  paid: "پرداخت شده", pending: "در انتظار", failed: "ناموفق", refunded: "بازگشت وجه"
};
const STATUS_COLORS: Record<string, string> = {
  paid: "text-emerald-400", pending: "text-yellow-400",
  failed: "text-red-400", refunded: "text-blue-400"
};

function UsageBar({ label, used, limit, color = "emerald" }: {
  label: string; used: number; limit: number; color?: string;
}) {
  const unlimited = limit === -1 || limit === 0;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isNear = pct >= 80;
  const barColor = isNear ? "bg-yellow-400" : color === "emerald" ? "bg-emerald-400" : "bg-blue-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-300">{label}</span>
        <span className={`font-mono text-xs ${isNear ? "text-yellow-400" : "text-ink-400"}`}>
          {unlimited ? "—" : `${used.toLocaleString("fa-IR")} از ${limit === -1 ? "نامحدود" : limit.toLocaleString("fa-IR")}`}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      {unlimited && (
        <div className="h-1.5 w-full rounded-full bg-emerald-500/20">
          <div className="h-full w-full rounded-full bg-emerald-500/40 animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function BillingClient({ plan, subscription, invoices, usage }: Props) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const isMax   = plan.id === "max";
  const isPro   = plan.id === "pro";
  const isFree  = plan.id === "free";

  // Days until expiry
  let daysLeft: number | null = null;
  let isNearExpiry = false;
  if (subscription?.expires_at) {
    const diff = new Date(subscription.expires_at).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    isNearExpiry = daysLeft <= 7;
  }

  async function handleCancel() {
    if (!confirm("مطمئنی؟ اشتراک در پایان دوره لغو می‌شه.")) return;
    setCancelling(true);
    await fetch("/api/billing/subscription", { method: "DELETE" });
    setCancelling(false);
    setCancelled(true);
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      {/* Header first in DOM for screen reader order */}
      <div className="sticky top-0 z-30 border-b border-white/[0.06]"
        style={{ background: "rgba(2,3,6,0.85)", backdropFilter: "blur(14px)" }}>
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            aria-label="بازگشت"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold">اشتراک و پرداخت‌ها</h1>
        </div>
      </div>

      <BottomNav />

      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* Expiry warning */}
        {isNearExpiry && daysLeft !== null && (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-300">
                {daysLeft === 0 ? "اشتراکت امروز تموم می‌شه!" : `${daysLeft.toLocaleString("fa-IR")} روز تا پایان اشتراک`}
              </p>
              <p className="mt-0.5 text-xs text-yellow-400/70">برای ادامه دسترسی اشتراکت رو تمدید کن</p>
            </div>
            <Link href="/billing/checkout" className="mr-auto shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-black">
              تمدید
            </Link>
          </div>
        )}

        {/* Current plan card */}
        <div className={`glass relative overflow-hidden rounded-2xl p-5 ${isMax ? "glass-gold border-yellow-500/30" : isPro ? "glass-leaf border-emerald-500/30" : ""}`}>
          {isMax && (
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(250,204,21,0.12), transparent 60%)" }} />
          )}
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {isMax && <Crown className="h-4 w-4 text-yellow-400" />}
                {isPro && <Zap className="h-4 w-4 text-emerald-400" />}
                <span className={`text-lg font-black ${isMax ? "text-yellow-300" : isPro ? "text-emerald-300" : "text-ink-200"}`}>
                  پلن {plan.displayName}
                </span>
              </div>
              {subscription?.expires_at && (
                <p className="mt-1 text-xs text-ink-500">
                  <Clock className="mr-1 inline h-3 w-3" />
                  تا {new Date(subscription.expires_at).toLocaleDateString("fa-IR")}
                </p>
              )}
              {subscription?.status === "cancelled" && (
                <p className="mt-1 text-xs text-red-400">لغو شده — در پایان دوره منقضی می‌شه</p>
              )}
            </div>
            {isFree ? (
              <Link href="/billing/checkout" className="btn-lux text-sm">ارتقا</Link>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">فعال</span>
            )}
          </div>

          {/* Usage bars */}
          <div className="relative mt-5 space-y-4">
            <UsageBar
              label="تحلیل این هفته"
              used={usage.analysesUsed}
              limit={plan.limits.analysesPerWeek}
            />
            <UsageBar
              label="پیام مسیریاب این ماه"
              used={usage.chatUsed}
              limit={plan.limits.chatMessagesPerMonth}
              color="blue"
            />
          </div>

          {/* Actions */}
          {!isFree && (
            <div className="relative mt-5 flex gap-2 border-t border-white/[0.06] pt-4">
              <Link href="/billing/checkout" className="btn-ghost flex-1 justify-center text-sm py-2">
                تغییر پلن
              </Link>
              {subscription?.status === "active" && !cancelled && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  {cancelling ? "در حال لغو..." : "لغو اشتراک"}
                </button>
              )}
              {cancelled && (
                <span className="text-xs text-red-400">لغو شد — تا پایان دوره فعاله</span>
              )}
            </div>
          )}
        </div>

        {/* Upgrade CTA for free users */}
        {isFree && (
          <div className="glass rounded-2xl p-5 text-center">
            <p className="mb-3 text-sm text-ink-300">با پلن پرو، دسترسی کامل داری</p>
            <Link href="/billing/checkout" className="btn-lux justify-center">
              ارتقا به پرو — ۲۹۸٬۰۰۰ تومان/ماه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Invoice history */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
            <Receipt className="h-4 w-4 text-ink-400" />
            <h2 className="text-sm font-bold">تاریخچه پرداخت‌ها</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-500">
              هنوز پرداختی ثبت نشده
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    {inv.status === "paid"
                      ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                      : inv.status === "failed"
                      ? <XCircle className="h-4 w-4 text-red-400" />
                      : <Clock className="h-4 w-4 text-yellow-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">پلن {PLAN_LABELS[inv.plan_type] || inv.plan_type}</p>
                    <p className="text-xs text-ink-500">
                      {inv.paid_at
                        ? new Date(inv.paid_at).toLocaleDateString("fa-IR")
                        : new Date(inv.created_at).toLocaleDateString("fa-IR")}
                      {inv.zarinpal_ref && (
                        <span className="mr-2 font-mono text-[10px] text-ink-600">#{inv.zarinpal_ref}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{(inv.amount_toman).toLocaleString("fa-IR")}</p>
                    <p className="text-[10px] text-ink-500">تومان</p>
                  </div>
                  <span className={`text-xs font-medium ${STATUS_COLORS[inv.status] || "text-ink-400"}`}>
                    {STATUS_LABELS[inv.status] || inv.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment methods placeholder */}
        <div className="glass flex items-center gap-3 rounded-2xl p-4 opacity-50">
          <CreditCard className="h-4 w-4 text-ink-400" />
          <div>
            <p className="text-sm font-medium">درگاه پرداخت</p>
            <p className="text-xs text-ink-500">زرین‌پال — کارت‌های شبکه شتاب</p>
          </div>
        </div>
      </div>
    </div>
  );
}
