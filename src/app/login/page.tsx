"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/app/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    // Dev bypass: auto-verify with empty code
    if (data.dev) {
      const vRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: "" }),
      });
      const vData = await vRes.json();
      if (vRes.ok) {
        router.refresh();
        router.push(vData.hasProfile ? "/dashboard" : "/onboarding");
        return;
      }
    }
    setStep("otp");
  }

  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    /* refresh() clears Next.js router cache so the server re-reads
       the cookie on the next navigation — prevents stale auth state. */
    router.refresh();
    router.push(data.hasProfile ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(6,182,212,0.06), transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-10 inline-block">
          <Logo size={34} showWordmark />
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-1.5 text-2xl font-black tracking-tight">
            {step === "phone" ? "خوش اومدی" : "کد تأیید"}
          </h1>
          <p className="text-sm text-ink-400">
            {step === "phone"
              ? "برای ورود یا ثبت‌نام، شماره موبایلت رو وارد کن"
              : `کد ارسال‌شده به ${phone} رو وارد کن`}
          </p>
        </div>

        {/* Form */}
        {step === "phone" ? (
          <form onSubmit={sendOTP} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-400">
                شماره موبایل
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
                className="input-field text-center text-lg tracking-widest"
                dir="ltr"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  دریافت کد
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-400">
                کد ۶ رقمی
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="— — — — — —"
                maxLength={6}
                className="input-field text-center text-2xl tracking-[0.5em]"
                dir="ltr"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  ورود
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError("");
                setCode("");
              }}
              className="w-full py-2 text-xs text-ink-500 transition hover:text-ink-300"
            >
              تغییر شماره
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="mt-8 border-t border-ink-700/40 pt-6 text-center text-xs text-ink-600">
          با ورود، با{" "}
          <span className="text-ink-400">شرایط استفاده</span> موافقم
        </div>
      </div>
    </div>
  );
}
