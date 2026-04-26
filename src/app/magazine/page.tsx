"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Zap, RefreshCw, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface MagazineItem {
  title: string;
  body: string;
}

interface ToolOfDay {
  name: string;
  why: string;
}

interface ArticleContent {
  headline: string;
  intro: string;
  items: MagazineItem[];
  tool_of_day: ToolOfDay;
}

interface Article {
  date: string;
  title: string;
  content_json: ArticleContent | null;
  fallback?: boolean;
}

// Persian date formatting
function formatPersianDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function MagazinePage() {
  const [article, setArticle]     = useState<Article | null>(null);
  const [loading, setLoading]     = useState(true);
  const [generating, setGenerating] = useState(false);

  async function fetchArticle() {
    setLoading(true);
    try {
      const res = await fetch("/api/magazine");
      const data = await res.json();
      setArticle(data);
    } catch {
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }

  async function generateArticle() {
    setGenerating(true);
    try {
      await fetch("/api/magazine", { method: "POST" });
      await fetchArticle();
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    fetchArticle();
  }, []);

  const content = article?.content_json;

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.08), transparent 55%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{
            width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
            background: "rgba(31,31,51,0.6)", border: "1px solid rgba(99,102,241,0.18)",
          }}>
            <ArrowRight size={15} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>مجله روزانه AI</div>
            <div style={{ fontSize: 10, color: "rgba(165,180,252,0.6)", marginTop: 1 }}>
              {article?.date ? formatPersianDate(article.date) : "در حال بارگذاری..."}
            </div>
          </div>
          <BookOpen size={16} color="rgba(165,180,252,0.5)" />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px" }}>

        {loading ? (
          /* Skeleton */
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: i === 1 ? 120 : 80, borderRadius: 18,
                background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.08)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : !content && article?.fallback ? (
          /* No article yet — offer to generate */
          <div style={{
            textAlign: "center", padding: "48px 20px",
            background: "rgba(99,102,241,0.05)", borderRadius: 24,
            border: "1px solid rgba(99,102,241,0.12)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📰</div>
            <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 8px" }}>
              مجله امروز هنوز آماده نشده
            </h2>
            <p style={{ fontSize: 13, color: "rgba(232,239,234,0.5)", lineHeight: 1.7, marginBottom: 20 }}>
              هر روز یه مجله جدید از مهم‌ترین اخبار AI آماده می‌کنیم
            </p>
            <button
              onClick={generateArticle}
              disabled={generating}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 14,
                background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
                color: "#a5b4fc", fontSize: 13.5, fontWeight: 700,
                cursor: generating ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? "در حال ساخت..." : "بساز مجله امروز رو"}
            </button>
          </div>
        ) : content ? (
          <>
            {/* Headline */}
            <div style={{
              marginBottom: 20, padding: "20px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
              border: "1px solid rgba(99,102,241,0.22)",
              borderRadius: 20,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 8, padding: "3px 10px", marginBottom: 10,
                fontSize: 10, color: "#a5b4fc", fontWeight: 700,
              }}>
                <Zap size={10} />
                امروز در AI دنیا
              </div>
              <h1 style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.5, margin: "0 0 8px", letterSpacing: -0.3 }}>
                {content.headline}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(232,239,234,0.6)", lineHeight: 1.7, margin: 0 }}>
                {content.intro}
              </p>
            </div>

            {/* News items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {(content.items || []).map((item, i) => (
                <div key={i} style={{
                  padding: "14px 16px", borderRadius: 16,
                  background: "rgba(15,15,30,0.7)", border: "1px solid rgba(99,102,241,0.10)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                    background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.28)",
                    display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 900, color: "#a5b4fc",
                  }}>
                    {(i + 1).toLocaleString("fa-IR")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4, lineHeight: 1.4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "rgba(232,239,234,0.55)", lineHeight: 1.75 }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tool of the day */}
            {content.tool_of_day && (
              <div style={{
                padding: "16px 18px", borderRadius: 18,
                background: "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(234,179,8,0.05))",
                border: "1px solid rgba(250,204,21,0.22)",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)",
                  display: "grid", placeItems: "center", fontSize: 22,
                }}>
                  🛠️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, color: "rgba(253,230,138,0.6)", fontWeight: 700, marginBottom: 3 }}>
                    ابزار روز
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: "#fde68a" }}>
                    {content.tool_of_day.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(253,230,138,0.7)", marginTop: 3, lineHeight: 1.5 }}>
                    {content.tool_of_day.why}
                  </div>
                </div>
              </div>
            )}

            {/* CTA for analysis */}
            <div style={{
              marginTop: 20, padding: "14px 16px", borderRadius: 16,
              background: "rgba(16,185,129,0.07)", border: "1px solid rgba(110,231,183,0.15)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>ببین چه ابزاری به شغلت کمک می‌کنه</div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 2 }}>
                  تحلیل مسیر شغلی — رایگان
                </div>
              </div>
              <Link href="/dashboard" style={{
                padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.3)",
                color: "#34d399", textDecoration: "none", flexShrink: 0,
              }}>
                داشبورد
              </Link>
            </div>
          </>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
}
