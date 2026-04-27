"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Gift, Copy, Check, Users, Share2, AlertCircle, RefreshCw } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/referral");
      const json = await res.json();
      if (!res.ok || json.error) {
        if (res.status === 401) {
          setError("auth");
        } else {
          setError(json.error || "unknown");
        }
      } else {
        setData(json);
      }
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://ay.app";
  const fullLink = data ? `${origin}${data.link}` : "";

  async function copyLink() {
    if (!fullLink) return;
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silent
    }
  }

  async function shareLink() {
    if (!fullLink) return;
    if (navigator.share) {
      await navigator.share({
        title: "بیا A-Y رو امتحان کن!",
        text: `یه ابزار هوشمند برای مسیر شغلیت — مجانی شروع کن:\n${fullLink}`,
        url: fullLink,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(139,92,246,0.09), transparent 55%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      <style>{`@keyframes pulse-soft{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>

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
          textAlign: "center", marginBottom: 24,
          padding: "28px 20px 24px",
          background: "linear-gradient(135deg, rgba(139,92,246,0.10), rgba(109,40,217,0.06))",
          border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24,
        }}>
          <div style={{ fontSize: 52, marginBottom: 14, lineHeight: 1 }}>🎁</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 10px", letterSpacing: -0.3 }}>
            دوستت رو دعوت کن
          </h1>
          <p style={{ fontSize: 13.5, color: "rgba(232,239,234,0.6)", lineHeight: 1.75, margin: 0 }}>
            هر دوستی که با لینک تو ثبت‌نام کنه،<br />
            <strong style={{ color: "#c4b5fd" }}>تو ۷ روز Pro رایگان می‌گیری 🎉</strong>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[100, 80, 140].map((h, i) => (
              <div key={i} style={{
                height: h, borderRadius: 16,
                background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.08)",
                animation: "pulse-soft 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Auth error */}
        {!loading && error === "auth" && (
          <div style={{
            padding: "20px", borderRadius: 18, textAlign: "center",
            background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)",
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔐</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>ورود لازمه</div>
            <div style={{ fontSize: 12, color: "rgba(232,239,234,0.45)", marginBottom: 16 }}>
              برای دیدن لینک دعوتت باید وارد حسابت بشی
            </div>
            <Link href="/login" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 12,
              background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)",
              color: "#c4b5fd", fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              ورود به حساب
            </Link>
          </div>
        )}

        {/* Network / unknown error */}
        {!loading && error && error !== "auth" && (
          <div style={{
            padding: "20px", borderRadius: 18, textAlign: "center",
            background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.18)",
          }}>
            <AlertCircle size={28} color="#f87171" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>مشکلی پیش اومد</div>
            <div style={{ fontSize: 12, color: "rgba(232,239,234,0.45)", marginBottom: 16 }}>
              {error === "network" ? "خطای شبکه — اینترنتت رو چک کن" : "خطا در بارگذاری اطلاعات"}
            </div>
            <button
              onClick={load}
              style={{
                padding: "9px 20px", borderRadius: 10,
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                color: "#f87171", fontSize: 12.5, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              <RefreshCw size={12} />
              دوباره امتحان
            </button>
          </div>
        )}

        {/* Success state */}
        {!loading && !error && data && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{
                padding: "16px 14px", borderRadius: 16,
                background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#c4b5fd", lineHeight: 1.1 }}>
                  {data.usedCount.toLocaleString("fa-IR")}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <Users size={10} />
                  دعوت شده
                </div>
              </div>
              <div style={{
                padding: "16px 14px", borderRadius: 16,
                background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#fde68a", lineHeight: 1.1 }}>
                  {(data.rewardGiven * 7).toLocaleString("fa-IR")}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 5 }}>
                  روز Pro گرفتی
                </div>
              </div>
            </div>

            {/* Code display */}
            <div style={{
              padding: "14px 18px", borderRadius: 16, marginBottom: 10,
              background: "rgba(31,20,51,0.8)", border: "1px solid rgba(139,92,246,0.22)",
            }}>
              <div style={{ fontSize: 10, color: "rgba(196,181,253,0.5)", marginBottom: 6, fontWeight: 700, letterSpacing: 1.5 }}>
                کد دعوت اختصاصی تو
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: "#c4b5fd", letterSpacing: 3 }}>
                {data.code}
              </div>
            </div>

            {/* Link display + copy */}
            <div style={{
              padding: "11px 14px", borderRadius: 13, marginBottom: 12,
              background: "rgba(10,6,20,0.9)", border: "1px solid rgba(139,92,246,0.15)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                flex: 1, minWidth: 0, fontSize: 11, color: "rgba(232,239,234,0.4)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                direction: "ltr", fontFamily: "monospace",
              }}>
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
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.15s",
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "کپی شد!" : "کپی"}
              </button>
            </div>

            {/* Share CTA */}
            <button
              onClick={shareLink}
              style={{
                width: "100%", padding: "15px", borderRadius: 16, marginBottom: 20,
                background: "linear-gradient(135deg, rgba(139,92,246,0.28), rgba(109,40,217,0.18))",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "#c4b5fd", fontSize: 15, fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
              }}
            >
              <Share2 size={16} />
              اشتراک‌گذاری لینک دعوت
            </button>

            {/* How it works */}
            <div style={{
              padding: "16px 18px", borderRadius: 18,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                fontSize: 10, color: "rgba(232,239,234,0.35)", fontWeight: 800,
                marginBottom: 14, letterSpacing: 2,
              }}>
                چطور کار می‌کنه؟
              </div>
              {[
                { icon: "📤", text: "لینک اختصاصیت رو برای دوستات بفرست" },
                { icon: "👤", text: "دوستت با لینک تو ثبت‌نام می‌کنه" },
                { icon: "🎉", text: "بلافاصله ۷ روز Pro رایگان دریافت می‌کنی" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)",
                    display: "grid", placeItems: "center", fontSize: 15,
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1, paddingTop: 6, fontSize: 13, color: "rgba(232,239,234,0.7)", lineHeight: 1.55 }}>
                    {step.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reward explainer */}
            {data.usedCount > 0 && (
              <div style={{
                marginTop: 14, padding: "12px 16px", borderRadius: 14,
                background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <div style={{ fontSize: 12, color: "rgba(253,230,138,0.75)", lineHeight: 1.55 }}>
                  تو تا الان <strong style={{ color: "#fde68a" }}>{data.rewardGiven * 7} روز</strong> Pro رایگان از طریق دعوت گرفتی!
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
