"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Shield, Clock } from "lucide-react";

/* ─── caret animation (injected once) ─── */
const CARET_CSS = `
@keyframes ay-caret {
  0%,100%{opacity:1}
  50%{opacity:0}
}
.ay-caret{animation:ay-caret 1s steps(2) infinite}
`;

/* ─── sub-components ─── */

function Logo() {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
      background: "linear-gradient(180deg, rgba(16,185,129,0.18), rgba(16,185,129,0.06))",
      border: "1px solid rgba(110,231,183,0.3)",
      display: "grid", placeItems: "center",
      boxShadow: "0 0 24px rgba(52,211,153,0.18)",
    }}>
      <span style={{
        fontWeight: 900, fontSize: 22, color: "#6ee7b7", letterSpacing: -0.5,
        fontFamily: "inherit",
      }}>A-Y</span>
    </div>
  );
}

/* ─── Phone step ─── */
function PhoneStep({
  phone, setPhone, loading, error, onSubmit,
}: {
  phone: string;
  setPhone: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      {/* heading */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          margin: "0 0 8px", fontWeight: 900, fontSize: 26,
          lineHeight: 1.1, letterSpacing: -0.8,
        }}>
          شمارهٔ موبایلت<br/>
          <span style={{ color: "#6ee7b7" }}>رو وارد کن.</span>
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(232,239,234,0.6)", lineHeight: 1.6 }}>
          کد تأیید رو با پیامک برات می‌فرستیم. فقط شماره‌های ایرانی.
        </p>
      </div>

      {/* phone input */}
      <div style={{ marginTop: 8 }}>
        <div style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: 1.5,
          color: "rgba(110,231,183,0.7)", textTransform: "uppercase", marginBottom: 8,
        }}>شمارهٔ موبایل</div>

        <div style={{
          display: "flex", alignItems: "center", gap: 10, direction: "ltr",
          padding: "14px 16px", borderRadius: 14,
          background: "rgba(31,46,40,0.55)",
          border: error ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(110,231,183,0.28)",
          backdropFilter: "blur(10px)",
          boxShadow: error ? "none" : "0 0 0 4px rgba(16,185,129,0.06)",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 15, color: "rgba(232,239,234,0.55)" }}>+98</span>
          <div style={{ width: 1, height: 22, background: "rgba(110,231,183,0.22)", flexShrink: 0 }}/>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="9xxxxxxxxx"
            maxLength={10}
            dir="ltr"
            required
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontWeight: 700, fontSize: 19, color: "#e8efea", letterSpacing: 0.4,
              fontFamily: "inherit", caretColor: "#34d399",
              padding: 0,
            }}
          />
        </div>

        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(232,239,234,0.45)" }}>
          مثل: ۹۱۲۳۴۵۶۷۸۹ — بدون صفر اول
        </div>
      </div>

      {/* error */}
      {error && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 12,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(248,113,113,0.3)",
          fontSize: 12, color: "#fca5a5",
        }}>{error}</div>
      )}

      {/* submit */}
      <div style={{ marginTop: 28 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", height: 52, borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
            background: "linear-gradient(180deg, #34d399, #10b981)",
            color: "#04110a", fontWeight: 800, fontSize: 15,
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(52,211,153,0.35)",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              ارسال کد تأیید
              <ArrowLeft size={16} />
            </>
          )}
        </button>
      </div>

      {/* privacy note */}
      <div style={{
        marginTop: 20, padding: 14, borderRadius: 14,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(110,231,183,0.08)",
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <Shield size={16} color="rgba(110,231,183,0.7)" strokeWidth={1.6} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 11.5, color: "rgba(232,239,234,0.6)", lineHeight: 1.7 }}>
          شمارهٔ تو فقط برای ورود استفاده می‌شه. هیچ‌وقت پیامک تبلیغاتی برات نمی‌فرستیم.
        </p>
      </div>

      {/* terms */}
      <p style={{ marginTop: 28, textAlign: "center", fontSize: 11, color: "rgba(232,239,234,0.45)" }}>
        با ادامه دادن،{" "}
        <Link href="/terms" style={{ color: "#6ee7b7" }}>قوانین</Link>
        {" "}و{" "}
        <Link href="/privacy" style={{ color: "#6ee7b7" }}>حریم خصوصی</Link>
        {" "}رو می‌پذیری.
      </p>
    </form>
  );
}

/* ─── OTP step ─── */
const RESEND_SECONDS = 90;

function OTPStep({
  phone, loading, error, onSubmit, onChangePhone,
}: {
  phone: string;
  loading: boolean;
  error: string;
  onSubmit: (code: string) => void;
  onChangePhone: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown
  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleDigit = (i: number, val: string) => {
    const ch = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "") ) {
      onSubmit(next.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i] === "" && i > 0) {
        const next = [...digits];
        next[i - 1] = "";
        setDigits(next);
        refs.current[i - 1]?.focus();
      } else {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowRight" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const next = [...digits];
    paste.split("").forEach((ch, idx) => { if (idx < 6) next[idx] = ch; });
    setDigits(next);
    const focusIdx = Math.min(paste.length, 5);
    refs.current[focusIdx]?.focus();
    if (next.every((d) => d !== "")) onSubmit(next.join(""));
  };

  const maskedPhone = phone.length >= 7
    ? `+98 ${phone.slice(0, 3)} *** ${phone.slice(-4)}`
    : `+98 ${phone}`;

  return (
    <div>
      {/* heading */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 8px", fontWeight: 900, fontSize: 26, lineHeight: 1.1, letterSpacing: -0.8 }}>
          کد رو چک کن.
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(232,239,234,0.6)", lineHeight: 1.6 }}>
          پیامک به{" "}
          <span style={{ color: "#6ee7b7", fontFamily: "monospace", direction: "ltr", display: "inline-block" }}>
            {maskedPhone}
          </span>
          {" "}رفت.
        </p>
      </div>

      {/* 6-box OTP */}
      <div style={{ display: "flex", gap: 9, direction: "ltr", justifyContent: "center", marginTop: 32 }}>
        {digits.map((d, i) => {
          const filled = d !== "";
          const focused = focusedIdx === i;
          return (
            <div key={i} style={{ position: "relative" }}>
              <div style={{
                width: 50, height: 62, borderRadius: 14,
                background: filled ? "rgba(16,185,129,0.10)" : "rgba(31,46,40,0.6)",
                border: `1px solid ${focused ? "rgba(110,231,183,0.6)" : filled ? "rgba(110,231,183,0.32)" : "rgba(110,231,183,0.12)"}`,
                boxShadow: focused ? "0 0 0 4px rgba(16,185,129,0.12), 0 0 16px rgba(52,211,153,0.3)" : "none",
                display: "grid", placeItems: "center",
                pointerEvents: "none",
              }}>
                <span style={{ fontWeight: 900, fontSize: 26, color: filled ? "#e8efea" : "rgba(110,231,183,0.3)" }}>
                  {d}
                </span>
              </div>
              <input
                ref={(el) => { refs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={() => setFocusedIdx(i)}
                onBlur={() => setFocusedIdx(-1)}
                onPaste={i === 0 ? handlePaste : undefined}
                style={{
                  position: "absolute", inset: 0,
                  opacity: 0, cursor: "text",
                  width: "100%", height: "100%",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* timer */}
      <div style={{
        marginTop: 24, padding: "12px 16px", borderRadius: 12,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(110,231,183,0.10)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} color="rgba(110,231,183,0.7)" />
          <span style={{ fontSize: 12.5, color: "rgba(232,239,234,0.6)" }}>
            {canResend ? "می‌تونی دوباره بفرستی" : "ارسال مجدد در"}
          </span>
        </div>
        {canResend ? (
          <button
            type="button"
            onClick={() => { setSeconds(RESEND_SECONDS); setCanResend(false); setDigits(["","","","","",""]); refs.current[0]?.focus(); }}
            style={{ fontFamily: "monospace", fontSize: 13, color: "#6ee7b7", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
          >
            ارسال
          </button>
        ) : (
          <span style={{ fontFamily: "monospace", fontSize: 14, color: "#6ee7b7", fontWeight: 700 }}>
            {formatTime(seconds)}
          </span>
        )}
      </div>

      {/* error */}
      {error && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 12,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(248,113,113,0.3)",
          fontSize: 12, color: "#fca5a5",
        }}>{error}</div>
      )}

      {/* submit */}
      <div style={{ marginTop: 22 }}>
        <button
          type="button"
          disabled={loading || digits.some((d) => d === "")}
          onClick={() => onSubmit(digits.join(""))}
          style={{
            width: "100%", height: 52, borderRadius: 14, border: "none",
            cursor: (loading || digits.some((d) => d === "")) ? "not-allowed" : "pointer",
            background: "linear-gradient(180deg, #34d399, #10b981)",
            color: "#04110a", fontWeight: 800, fontSize: 15,
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(52,211,153,0.35)",
            opacity: (loading || digits.some((d) => d === "")) ? 0.5 : 1,
          }}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "تأیید و ورود"}
        </button>
      </div>

      {/* change phone */}
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 16, fontSize: 12.5 }}>
        <span style={{ color: "rgba(232,239,234,0.55)" }}>کد نرسید؟</span>
        <button
          type="button"
          onClick={onChangePhone}
          style={{ color: "#6ee7b7", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}
        >
          تغییر شماره
        </button>
      </div>
    </div>
  );
}

/* ─── main page ─── */
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fullPhone = phone.startsWith("0") ? phone : "0" + phone;
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: fullPhone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    // Dev bypass: auto-verify with empty code
    if (data.dev) {
      const vRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: "" }),
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

  async function verifyOTP(code: string) {
    setLoading(true);
    setError("");
    const fullPhone = phone.startsWith("0") ? phone : "0" + phone;
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: fullPhone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.refresh();
    router.push(data.hasProfile ? "/dashboard" : "/onboarding");
  }

  return (
    <>
      <style>{CARET_CSS}</style>
      <div style={{
        minHeight: "100dvh",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306",
        color: "#e8efea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Logo />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 999,
              background: "rgba(16,185,129,0.10)", border: "1px solid rgba(110,231,183,0.2)",
              fontSize: 11, fontWeight: 700, color: "#6ee7b7", letterSpacing: 0.5,
            }}>
              ورود به ای‌وای
            </div>
          </div>

          {/* back button (OTP step only) */}
          {step === "otp" && (
            <div style={{ marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => { setStep("phone"); setError(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  width: 38, height: 38, borderRadius: 11,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
                  cursor: "pointer", justifyContent: "center",
                }}
              >
                <ArrowLeft size={16} color="#e8efea" />
              </button>
            </div>
          )}

          {step === "phone" ? (
            <PhoneStep
              phone={phone}
              setPhone={setPhone}
              loading={loading}
              error={error}
              onSubmit={sendOTP}
            />
          ) : (
            <OTPStep
              phone={phone}
              loading={loading}
              error={error}
              onSubmit={verifyOTP}
              onChangePhone={() => { setStep("phone"); setError(""); }}
            />
          )}
        </div>
      </div>
    </>
  );
}
