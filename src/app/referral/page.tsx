"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Gift, Copy, Check, Users } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface ReferralData {
  code: string;
  usedCount: number;
  rewardGiven: number;
  link: string;
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function copyLink() {
    if (!data) return;
    const url = `${window.location.origin}${data.link}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: show the link
    }
  }

  async function shareLink() {
    if (!data) return;
    const url = `${window.location.origin}${data.link}`;
    if (navigator.share) {
      await navigator.share({
        title: "بیا A-Y استفاده کن!",
        text: "یه ابزار هوشمند برای مسیر شغلیت — با لینک من ثبت‌نام کن:",
        url,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  const fullLink = data ? `${typeof window !== "undefined" ? window.location.origin : "https://ay.app"}${data.link}` : "";

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(139,92,246,0.08), transparent 55%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,92,246,0.12)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" aria-label="بازگشت" style={{
            width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0,
            background: "rgba(31,20,51,0.6)", border: "1px solid rgba(139,92,246,0.18)",
          }}>
            <ArrowRight size={16} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>دعوت دوستان</div>
            <div style={{ fontSize: 10, color: "rgba(196,181,253,0.6)", marginTop: 1 }}>
              به ازای هر دوست، ۷ روز Pro رایگان
            </div>
          </div>
          <Gift size={16} color="rgba(196,181,253,0.5)" />
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* Hero */}
        <div style={{
          textAlign: "center", marginBottom: 28,
          padding: "28px 20px",
          background: "linear-gradient(135deg, rgba(139,92,246,0.10), rgba(109,40,217,0.07))",
          border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 10px", letterSpacing: -0.3 }}>
            دوستت رو دعوت کن
          </h1>
          <p style={{ fontSize: 13.5, color: "rgba(232,239,234,0.6)", lineHeight: 1.7, margin: 0 }}>
            هر دوستی که با لینک تو ثبت‌نام کنه،<br />
            <strong style={{ color: "#c4b5fd" }}>تو ۷ روز Pro رایگان می‌گیری</strong>
          </p>
        </div>

        {loading ? (
          <div style={{
            height: 120, borderRadius: 18,
            background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.10)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ) : data ? (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{
                padding: "14px", borderRadius: 16,
                background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#c4b5fd" }}>
                  {data.usedCount.toLocaleString("fa-IR")}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 3 }}>
                  <Users size={10} style={{ display: "inline", marginLeft: 3 }} />
                  دعوت شده
                </div>
              </div>
              <div style={{
                padding: "14px", borderRadius: 16,
                background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.18)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#fde68a" }}>
                  {(data.rewardGiven * 7).toLocaleString("fa-IR")} روز
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 3 }}>
                  جایزه گرفتی
                </div>
              </div>
            </div>

            {/* Code display */}
            <div style={{
              padding: "14px 18px", borderRadius: 16, marginBottom: 12,
              background: "rgba(31,20,51,0.7)", border: "1px solid rgba(139,92,246,0.2)",
            }}>
              <div style={{ fontSize: 10.5, color: "rgba(196,181,253,0.55)", marginBottom: 6, fontWeight: 700 }}>
                کد دعوت اختصاصی تو
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: "#c4b5fd", letterSpacing: 2 }}>
                {data.code}
              </div>
            </div>

            {/* Link display + copy */}
            <div style={{
              padding: "12px 16px", borderRadius: 14, marginBottom: 14,
              background: "rgba(15,10,30,0.8)", border: "1px solid rgba(139,92,246,0.15)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: "rgba(232,239,234,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", direction: "ltr" }}>
                {fullLink}
              </div>
              <button
                onClick={copyLink}
                style={{
                  padding: "6px 12px", borderRadius: 9, flexShrink: 0,
                  background: copied ? "rgba(52,211,153,0.2)" : "rgba(139,92,246,0.2)",
                  border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(139,92,246,0.35)"}`,
                  color: copied ? "#34d399" : "#c4b5fd",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "کپی شد" : "کپی"}
              </button>
            </div>

            {/* Share button */}
            <button
              onClick={shareLink}
              style={{
                width: "100%", padding: "14px", borderRadius: 16,
                background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(109,40,217,0.2))",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "#c4b5fd", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Gift size={16} />
              اشتراک‌گذاری لینک دعوت
            </button>

            {/* How it works */}
            <div style={{
              marginTop: 20, padding: "16px 18px", borderRadius: 18,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 11, color: "rgba(232,239,234,0.4)", fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
                چطور کار می‌کنه؟
              </div>
              {[
                "لینک اختصاصیت رو برای دوستات بفرست",
                "دوستت با لینک تو ثبت‌نام می‌کنه",
                "تو ۷ روز Pro رایگان دریافت می‌کنی 🎉",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                    background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.28)",
                    display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 900, color: "#c4b5fd",
                  }}>
                    {(i + 1).toLocaleString("fa-IR")}
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(232,239,234,0.7)", lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 32, color: "rgba(232,239,234,0.4)" }}>
            ورود به حساب کاربری لازمه
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
