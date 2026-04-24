"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown, Zap, Check, Loader2, Tag } from "lucide-react";

const PLANS = [
  {
    id: "pro",
    name: "پرو",
    price: 298_000,
    cycle: "monthly",
    cycleLabel: "ماهانه",
    features: ["۵ تحلیل در هفته", "مسیریاب AI نامحدود", "۲۰ شغل روزانه", "پشتیبانی سریع"],
    accent: "emerald",
    icon: Zap,
  },
  {
    id: "max",
    name: "مکس",
    price: 1_980_000,
    cycle: "yearly",
    cycleLabel: "سالانه",
    monthlyEq: 165_000,
    badge: "بهترین ارزش · ۴۴٪ تخفیف",
    features: ["تحلیل نامحدود", "شغل لحظه‌ای (realtime)", "مسیریاب ۶۰۰ پیام/ماه", "اولویت در پشتیبانی"],
    accent: "gold",
    icon: Crown,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultPlan = params.get("plan") || "pro";

  const [selected, setSelected] = useState(defaultPlan);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = PLANS.find((p) => p.id === selected) || PLANS[0];
  const finalPrice = Math.round(plan.price * (1 - discount / 100));

  async function applyPromo() {
    // Client-side optimistic check — real check happens server-side
    if (promo.toUpperCase() === "LAUNCH50") {
      setDiscount(50);
      setPromoApplied(true);
    } else {
      setError("کد تخفیف معتبر نیست");
    }
  }

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selected,
          billingCycle: plan.cycle,
          promoCode: promoApplied ? promo : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "خطا در ایجاد پرداخت"); setLoading(false); return; }
      // Redirect to Zarinpal gateway
      window.location.href = data.gatewayUrl;
    } catch {
      setError("خطای شبکه — دوباره تلاش کن");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#020306", color: "#e8efea" }}>
      <div className="sticky top-0 z-30 border-b border-white/[0.06]"
        style={{ background: "rgba(2,3,6,0.85)", backdropFilter: "blur(14px)" }}>
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link href="/billing" className="rounded-lg p-1.5 text-ink-400 transition hover:text-ink-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">انتخاب پلن</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* Plan selector */}
        {PLANS.map((p) => {
          const Icon = p.icon;
          const isSelected = selected === p.id;
          const isGold = p.accent === "gold";
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`glass w-full rounded-2xl p-5 text-right transition-all ${
                isSelected
                  ? isGold ? "border-yellow-400/40" : "border-emerald-400/40"
                  : "border-white/[0.06] opacity-70"
              }`}
            >
              {p.badge && (
                <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                  isGold ? "bg-yellow-500/15 text-yellow-300" : "bg-emerald-500/15 text-emerald-300"
                }`}>
                  {p.badge}
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isGold ? "text-yellow-400" : "text-emerald-400"}`} />
                    <span className={`text-lg font-black ${isGold ? "text-yellow-300" : "text-emerald-300"}`}>
                      {p.name}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black">{p.price.toLocaleString("fa-IR")}</span>
                    <span className="text-xs text-ink-500">تومان / {p.cycleLabel}</span>
                  </div>
                  {p.monthlyEq && (
                    <p className="text-[10px] text-ink-500">معادل {p.monthlyEq.toLocaleString("fa-IR")} تومان در ماه</p>
                  )}
                </div>
                <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected
                    ? isGold ? "border-yellow-400 bg-yellow-400" : "border-emerald-400 bg-emerald-400"
                    : "border-white/20"
                }`}>
                  {isSelected && <Check className="h-3 w-3 text-black" />}
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-ink-300">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-yellow-400" : "text-emerald-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}

        {/* Promo code */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-300 mb-3">
            <Tag className="h-4 w-4" /> کد تخفیف
          </div>
          {promoApplied ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
              <span className="font-mono text-sm text-emerald-300">{promo}</span>
              <span className="text-sm font-bold text-emerald-400">{discount}٪ تخفیف</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value.toUpperCase())}
                placeholder="کد تخفیف"
                className="input-field flex-1 font-mono uppercase"
                dir="ltr"
              />
              <button onClick={applyPromo} className="btn-ghost px-4 text-sm">اعمال</button>
            </div>
          )}
        </div>

        {/* Summary + pay */}
        <div className="glass rounded-2xl p-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-400">پلن {plan.name}</span>
              <span>{plan.price.toLocaleString("fa-IR")} تومان</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>تخفیف ({discount}٪)</span>
                <span>-{(plan.price - finalPrice).toLocaleString("fa-IR")} تومان</span>
              </div>
            )}
            <div className="border-t border-white/[0.06] pt-2 flex justify-between font-bold">
              <span>مبلغ نهایی</span>
              <span className="text-lg">{finalPrice.toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-lux mt-4 w-full justify-center"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
              پرداخت با زرین‌پال
              <ArrowLeft className="h-4 w-4" />
            </>}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-600">
            پرداخت امن از طریق درگاه زرین‌پال · قابل لغو در هر زمان
          </p>
        </div>
      </div>
    </div>
  );
}
