/**
 * /share/[token] — Public share page for AI analysis results
 * No login required. Shown when user shares their analysis link.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface ShareData {
  token: string;
  views: number;
  createdAt: string;
  jobTitle: string | null;
  industry: string | null;
  name: string | null;
  riskLevel: "low" | "medium" | "high" | null;
  riskExplanation: string | null;
  analysisSummary: string | null;
  leverageIdea: string | null;
  topTools: Array<{ name: string; why?: string }>;
}

async function getShareData(token: string): Promise<ShareData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/share?token=${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const data = await getShareData(token);
  if (!data) return { title: "نتایج تحلیل | A-Y" };
  const name = data.name ? `${data.name}` : "";
  const job = data.jobTitle || "متخصص";
  return {
    title: `تحلیل AI ${name ? `برای ${name}` : ""} | A-Y`,
    description: `تحلیل مسیر شغلی ${job}${data.industry ? ` در ${data.industry}` : ""} — ریسک هوش مصنوعی و ابزارهای پیشنهادی`,
  };
}

const RISK_CONFIG = {
  low: { label: "پایین ✅", color: "#34d399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.25)" },
  medium: { label: "متوسط ⚠️", color: "#fbbf24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.25)" },
  high: { label: "بالا 🔴", color: "#f87171", bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.25)" },
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getShareData(token);
  if (!data) notFound();

  const risk = data.riskLevel ? RISK_CONFIG[data.riskLevel] : null;
  const createdDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.07), transparent 60%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 64px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(16,185,129,0.12)", border: "1px solid rgba(110,231,183,0.2)",
          borderRadius: 12, padding: "6px 14px", marginBottom: 16,
          fontSize: 12, color: "#6ee7b7", fontWeight: 700,
        }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          تحلیل AI مسیر شغلی
        </div>
        {data.name && (
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: -0.5 }}>
            {data.name}
          </h1>
        )}
        {(data.jobTitle || data.industry) && (
          <p style={{ fontSize: 13, color: "rgba(232,239,234,0.55)", margin: 0 }}>
            {[data.jobTitle, data.industry].filter(Boolean).join(" · ")}
          </p>
        )}
        {createdDate && (
          <p style={{ fontSize: 11, color: "rgba(232,239,234,0.3)", marginTop: 4 }}>
            {createdDate}
          </p>
        )}
      </div>

      {/* Main card */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "rgba(16,22,18,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(110,231,183,0.12)",
        borderRadius: 24, overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>

        {/* Risk level */}
        {risk && (
          <div style={{
            padding: "16px 20px",
            background: risk.bg,
            borderBottom: `1px solid ${risk.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(232,239,234,0.5)", marginBottom: 3 }}>ریسک جایگزینی با AI</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: risk.color }}>{risk.label}</div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${risk.color}22`, border: `1px solid ${risk.color}44`,
              display: "grid", placeItems: "center",
              fontSize: 22,
            }}>
              {data.riskLevel === "low" ? "🛡️" : data.riskLevel === "medium" ? "⚡" : "🔥"}
            </div>
          </div>
        )}

        {/* Summary */}
        {data.analysisSummary && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(110,231,183,0.07)" }}>
            <div style={{ fontSize: 11, color: "rgba(110,231,183,0.5)", marginBottom: 6, fontWeight: 700 }}>
              خلاصه تحلیل
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(232,239,234,0.8)", margin: 0 }}>
              {data.analysisSummary}
            </p>
          </div>
        )}

        {/* Top tools */}
        {data.topTools.length > 0 && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(110,231,183,0.07)" }}>
            <div style={{ fontSize: 11, color: "rgba(110,231,183,0.5)", marginBottom: 10, fontWeight: 700 }}>
              ابزارهای AI پیشنهادی
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.topTools.map((tool, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 12,
                  background: "rgba(16,185,129,0.07)", border: "1px solid rgba(110,231,183,0.10)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)",
                    display: "grid", placeItems: "center",
                    fontSize: 12, fontWeight: 900, color: "#34d399",
                  }}>
                    {tool.name.slice(0, 1)}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{tool.name}</div>
                    {tool.why && (
                      <div style={{ fontSize: 10.5, color: "rgba(232,239,234,0.45)", marginTop: 1 }}>{tool.why}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leverage idea */}
        {data.leverageIdea && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(110,231,183,0.07)" }}>
            <div style={{ fontSize: 11, color: "rgba(250,204,21,0.6)", marginBottom: 6, fontWeight: 700 }}>
              💡 اهرم شخصی
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(232,239,234,0.75)", margin: 0 }}>
              {data.leverageIdea}
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{
          padding: "20px",
          textAlign: "center",
          background: "rgba(16,185,129,0.05)",
        }}>
          <p style={{ fontSize: 12.5, color: "rgba(232,239,234,0.5)", marginBottom: 12, lineHeight: 1.6 }}>
            تحلیل شغل خودت رو هم بگیر — رایگانه
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 28px", borderRadius: 14,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#04110a", fontSize: 14, fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(52,211,153,0.3)",
            }}
          >
            تحلیل مسیر شغلی من ←
          </Link>
          <div style={{ marginTop: 10, fontSize: 10.5, color: "rgba(232,239,234,0.3)" }}>
            {data.views.toLocaleString("fa-IR")} نفر این تحلیل رو دیدن
          </div>
        </div>
      </div>

      {/* A-Y Brand footer */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "rgba(232,239,234,0.3)",
        }}>
          <span style={{ fontWeight: 900, color: "rgba(110,231,183,0.4)" }}>A-Y</span>
          — دستیار هوشمند مسیر شغلی
        </div>
      </div>
    </div>
  );
}
