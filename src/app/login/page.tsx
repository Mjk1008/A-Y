"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setStep("otp");
  }

  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(data.hasProfile ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ای‌وای</h1>
          <p className="text-gray-400 text-sm">
            {step === "phone" ? "شماره موبایلت رو وارد کن" : `کد ارسال‌شده به ${phone} رو وارد کن`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOTP} className="space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="09xxxxxxxxx"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-center text-lg tracking-widest border border-gray-700 focus:border-cyan-500 outline-none"
              dir="ltr"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "دریافت کد"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="کد ۶ رقمی"
              maxLength={6}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-center text-2xl tracking-widest border border-gray-700 focus:border-cyan-500 outline-none"
              dir="ltr"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "در حال تأیید..." : "ورود"}
            </button>
            <button type="button" onClick={() => setStep("phone")} className="w-full text-gray-500 text-sm">
              تغییر شماره
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
