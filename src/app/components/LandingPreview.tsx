"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, Shield, Wrench, ArrowLeft } from "lucide-react";

/* Hardcoded quick analysis for 10 common jobs */
interface JobPreview {
  label: string;
  risk: "low" | "medium" | "high";
  riskLabel: string;
  summary: string;
  tools: string[];
  tip: string;
}

const JOB_PREVIEWS: Record<string, JobPreview> = {
  designer: {
    label: "طراح گرافیک / UI-UX",
    risk: "medium",
    riskLabel: "متوسط ⚠️",
    summary: "AI ابزارهای طراحی رو democratize کرده — کارهای تکراری رو می‌گیره ولی نمی‌تونه جایگزین تفکر استراتژیک و UX research بشه.",
    tools: ["Figma AI", "Midjourney", "Adobe Firefly"],
    tip: "روی research و strategy تمرکز کن — اینجاها AI ضعیفه",
  },
  developer: {
    label: "توسعه‌دهنده نرم‌افزار",
    risk: "low",
    riskLabel: "پایین ✅",
    summary: "برنامه‌نویسان که از AI استفاده می‌کنن ۳-۵x سریع‌تر code می‌زنن. تقاضا بالاست — فقط باید با AI کار کنی نه علیهش.",
    tools: ["GitHub Copilot", "Cursor", "Claude"],
    tip: "یاد بگیر AI agent بنویسی — این مهارت کمیابه",
  },
  marketer: {
    label: "بازاریاب / مارکتینگ",
    risk: "medium",
    riskLabel: "متوسط ⚠️",
    summary: "Content creation خودکار شده ولی استراتژی، برندینگ، و ارتباط انسانی هنوز human-touch نیاز داره.",
    tools: ["ChatGPT", "Jasper", "Canva AI"],
    tip: "روی data analytics و استراتژی سرمایه‌گذاری کن",
  },
  teacher: {
    label: "معلم / آموزشگر",
    risk: "low",
    riskLabel: "پایین ✅",
    summary: "AI می‌تونه محتوا تولید کنه ولی نمی‌تونه الهام بده، موتیوت کنه، یا ارتباط عاطفی با دانش‌آموز بسازه.",
    tools: ["ChatGPT", "Khanmigo", "Gamma"],
    tip: "از AI برای personalization محتوا استفاده کن",
  },
  accountant: {
    label: "حسابدار / مالی",
    risk: "high",
    riskLabel: "بالا 🔴",
    summary: "کارهای روتین حسابداری به سرعت خودکار می‌شن. نیاز به transition به advisory و strategic finance داری.",
    tools: ["QuickBooks AI", "Notion AI", "Excel Copilot"],
    tip: "به سمت CFO-level thinking و مشاوره مالی برو",
  },
  writer: {
    label: "نویسنده / کپی‌رایتر",
    risk: "high",
    riskLabel: "بالا 🔴",
    summary: "AI writing tools مثل ChatGPT محتوای عمومی رو ارزان‌تر می‌کنن. تخصص و صدای منحصربه‌فرد key هستن.",
    tools: ["ChatGPT", "Claude", "Jasper"],
    tip: "روی niche expertise و personal voice تمرکز کن",
  },
  manager: {
    label: "مدیر / project manager",
    risk: "low",
    riskLabel: "پایین ✅",
    summary: "Management نیاز به human judgment، سیاست، و ارتباط interpersonal داره — AI می‌تونه کمک کنه ولی جایگزین نمیشه.",
    tools: ["Notion AI", "ClickUp AI", "Slack AI"],
    tip: "از AI برای automation وظایف تکراری استفاده کن",
  },
  salesperson: {
    label: "فروشنده / sales",
    risk: "medium",
    riskLabel: "متوسط ⚠️",
    summary: "AI می‌تونه lead generation و ایمیل‌های فروش رو خودکار کنه — ولی deal closing هنوز human connection نیاز داره.",
    tools: ["Salesforce Einstein", "HubSpot AI", "Clay"],
    tip: "روی consultative selling و relationship building سرمایه‌گذاری کن",
  },
  hr: {
    label: "منابع انسانی / HR",
    risk: "medium",
    riskLabel: "متوسط ⚠️",
    summary: "Screening و administrative کارها خودکار می‌شن ولی culture building، coaching، و conflict resolution human هستن.",
    tools: ["LinkedIn Recruiter AI", "Workday AI", "ChatGPT"],
    tip: "به People Analytics و Employee Experience تخصص پیدا کن",
  },
  doctor: {
    label: "پزشک / healthcare",
    risk: "low",
    riskLabel: "پایین ✅",
    summary: "AI در diagnostic assistance قوی‌تر می‌شه ولی empathy، اخلاق پزشکی، و تصمیم‌گیری کلینیکال human-centric هستن.",
    tools: ["AI diagnostic tools", "Epic AI", "Med-PaLM"],
    tip: "یاد بگیر AI findings رو interpret کنی — این مهارت ارزشمنده",
  },
};

const RISK_COLORS = {
  low:    { text: "#34d399", bg: "rgba(52,211,153,0.12)",   border: "rgba(52,211,153,0.3)"  },
  medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.12)",   border: "rgba(251,191,36,0.3)"  },
  high:   { text: "#f87171", bg: "rgba(248,113,113,0.12)",  border: "rgba(248,113,113,0.3)" },
};

export function LandingPreview() {
  const [selected, setSelected] = useState<string>("");
  const [revealed, setRevealed] = useState(false);

  const preview = selected ? JOB_PREVIEWS[selected] : null;
  const riskColors = preview ? RISK_COLORS[preview.risk] : null;

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelected(e.target.value);
    setRevealed(false);
  }

  return (
    <section
      dir="rtl"
      style={{
        padding: "80px 16px",
        maxWidth: 540,
        margin: "0 auto",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Section title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(110,231,183,0.2)",
          borderRadius: 999, padding: "5px 14px", marginBottom: 14,
          fontSize: 11.5, color: "#6ee7b7", fontWeight: 700,
        }}>
          <Sparkles size={12} />
          آنالیز سریع — رایگان
        </div>
        <h2 style={{
          fontSize: 26, fontWeight: 900, color: "#e8efea",
          margin: "0 0 10px", letterSpacing: -0.5,
        }}>
          ریسک شغل تو چقدره؟
        </h2>
        <p style={{ fontSize: 13.5, color: "rgba(232,239,234,0.55)", lineHeight: 1.7, margin: 0 }}>
          شغلت رو انتخاب کن، یه پیش‌نمایش از تحلیل AI بگیر
        </p>
      </div>

      {/* Job selector */}
      <div style={{
        position: "relative", marginBottom: 16,
        background: "rgba(31,46,40,0.6)", border: "1px solid rgba(110,231,183,0.18)",
        borderRadius: 14, overflow: "hidden",
      }}>
        <select
          value={selected}
          onChange={handleSelect}
          style={{
            width: "100%", padding: "14px 16px",
            background: "none", border: "none", outline: "none",
            fontSize: 14, color: selected ? "#e8efea" : "rgba(232,239,234,0.45)",
            fontFamily: "inherit", appearance: "none", cursor: "pointer",
          }}
        >
          <option value="">شغل خودت رو انتخاب کن...</option>
          {Object.entries(JOB_PREVIEWS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          color="rgba(110,231,183,0.5)"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
      </div>

      {/* Reveal button */}
      {selected && !revealed && (
        <button
          onClick={() => setRevealed(true)}
          style={{
            width: "100%", padding: "13px", borderRadius: 14,
            background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.15))",
            border: "1px solid rgba(52,211,153,0.35)",
            color: "#34d399", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 16,
          }}
        >
          <Sparkles size={15} />
          ببین ریسک شغلت چقدره
        </button>
      )}

      {/* Result card */}
      {preview && revealed && riskColors && (
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(110,231,183,0.12)",
          background: "rgba(10,18,14,0.9)",
          marginBottom: 16,
          animation: "slideUp 0.3s ease-out",
        }}>
          <style>{`@keyframes slideUp{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

          {/* Risk header */}
          <div style={{
            padding: "14px 18px",
            background: riskColors.bg, borderBottom: `1px solid ${riskColors.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(232,239,234,0.5)", marginBottom: 3 }}>ریسک جایگزینی با AI</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: riskColors.text }}>{preview.riskLabel}</div>
            </div>
            <Shield size={24} color={riskColors.text} strokeWidth={1.5} />
          </div>

          {/* Summary */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(110,231,183,0.07)" }}>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(232,239,234,0.8)", margin: 0 }}>
              {preview.summary}
            </p>
          </div>

          {/* Tools */}
          <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(110,231,183,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Wrench size={11} color="rgba(110,231,183,0.5)" />
              <span style={{ fontSize: 10.5, color: "rgba(110,231,183,0.6)", fontWeight: 700 }}>ابزارهای AI مرتبط</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {preview.tools.map((t) => (
                <span key={t} style={{
                  padding: "4px 10px", borderRadius: 8,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(110,231,183,0.15)",
                  fontSize: 11.5, color: "#6ee7b7", fontWeight: 600,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{ padding: "12px 18px" }}>
            <div style={{ fontSize: 10.5, color: "rgba(250,204,21,0.6)", fontWeight: 700, marginBottom: 5 }}>💡 توصیه</div>
            <p style={{ fontSize: 12.5, color: "rgba(232,239,234,0.7)", lineHeight: 1.7, margin: 0 }}>
              {preview.tip}
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      {revealed && (
        <div style={{
          textAlign: "center",
          padding: "16px",
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(110,231,183,0.14)",
          borderRadius: 16,
          animation: "slideUp 0.3s ease-out 0.1s both",
        }}>
          <p style={{ fontSize: 12.5, color: "rgba(232,239,234,0.55)", marginBottom: 12, lineHeight: 1.6 }}>
            این فقط یه پیش‌نمایشه — تحلیل کامل شخصی‌سازه‌شده برای پروفایل دقیق تو
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "12px 24px", borderRadius: 14,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#04110a", fontSize: 14, fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(52,211,153,0.3)",
            }}
          >
            تحلیل کامل رایگان بگیر
            <ArrowLeft size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
