"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { MascotArt } from "@/app/components/PixelMascot";

const REASONS: Record<string, string> = {
  cancelled:     "پرداخت توسط شما لغو شد.",
  verify_failed: "تأیید پرداخت با خطا مواجه شد. اگر مبلغی کسر شده ظرف ۷۲ ساعت برمی‌گرده.",
  not_found:     "اطلاعات تراکنش پیدا نشد.",
  invalid_plan:  "پلن انتخابی نامعتبره.",
};

function FailedContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "cancelled";
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: ((i * 137 + 23) % 100),
      y: ((i * 97 + 17) % 100),
      s: 1,
      o: 0.15 + (i % 4) * 0.1,
      d: 2 + (i % 3),
    })), []);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(248,113,113,0.12) 0%, #020306 65%)",
        color: "#e8efea",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        textAlign: "center",
        fontFamily: "'Vazirmatn Variable', Vazirmatn, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {stars.map((st, i) => (
        <div key={i} style={{
          position: "absolute", left: `${st.x}%`, top: `${st.y}%`,
          width: st.s, height: st.s, background: "#6ee7b7", opacity: st.o,
          animation: `ay-twinkle ${st.d}s ease-in-out ${i * 0.15}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @keyframes ay-twinkle{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes ay-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
      `}</style>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: 300, width: "100%" }}>
        {/* Mascot in surprise state */}
        <div style={{ animation: "ay-shake 0.5s ease-in-out" }}>
          <MascotArt state="surprise" frame={frame} blink={false} scale={5} accent="#f87171" />
        </div>

        {/* Error pixel */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "rgba(248,113,113,0.12)",
          border: "1px solid rgba(248,113,113,0.35)",
          display: "grid", placeItems: "center",
          boxShadow: "0 0 24px rgba(248,113,113,0.18)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M 6 18 L 18 6 M 6 6 L 18 18" stroke="#f87171" strokeWidth="3" strokeLinecap="square" />
          </svg>
        </div>

        <div>
          <h1 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, letterSpacing: -0.5, color: "#e8efea" }}>
            پرداخت ناموفق
          </h1>
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(232,239,234,0.6)", lineHeight: 1.7, maxWidth: 260 }}>
            {REASONS[reason] || "خطایی در پردازش پرداخت رخ داد."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          <Link
            href="/billing/checkout"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#04110a", fontWeight: 800, fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(52,211,153,0.25)",
            }}
          >
            <RefreshCw size={16} />
            <span>دوباره تلاش کن</span>
          </Link>
          <Link
            href="/billing"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 44, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "rgba(232,239,234,0.45)", fontSize: 13,
              textDecoration: "none",
            }}
          >
            بازگشت به اشتراک
          </Link>
        </div>

        <p style={{ fontSize: 11, color: "rgba(232,239,234,0.3)", margin: 0 }}>
          اگه مشکل ادامه داشت با پشتیبانی تماس بگیر
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", minHeight: "100svh", alignItems: "center", justifyContent: "center", background: "#020306" }} />
    }>
      <FailedContent />
    </Suspense>
  );
}
