"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, RefreshCw, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface MagazineItem { title: string; body: string; }
interface ToolOfDay   { name: string; why: string; }
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

/* ── gradient palettes for news cards ─────────────────────────── */
const CARD_PALETTES = [
  { bg: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)", accent: "#818cf8", glow: "rgba(129,140,248,0.25)", icon: "🤖" },
  { bg: "linear-gradient(135deg,#0c1a14 0%,#064e3b 100%)", accent: "#34d399", glow: "rgba(52,211,153,0.25)", icon: "⚡" },
  { bg: "linear-gradient(135deg,#1c0d0d 0%,#450a0a 100%)", accent: "#f87171", glow: "rgba(248,113,113,0.25)", icon: "🔥" },
  { bg: "linear-gradient(135deg,#0c1020 0%,#0e3a5a 100%)", accent: "#38bdf8", glow: "rgba(56,189,248,0.25)", icon: "🌐" },
  { bg: "linear-gradient(135deg,#1a0c20 0%,#4a044e 100%)", accent: "#d946ef", glow: "rgba(217,70,239,0.25)", icon: "✨" },
  { bg: "linear-gradient(135deg,#1a1200 0%,#451a03 100%)", accent: "#fb923c", glow: "rgba(251,146,60,0.25)", icon: "📡" },
  { bg: "linear-gradient(135deg,#0d1f1a 0%,#134e4a 100%)", accent: "#2dd4bf", glow: "rgba(45,212,191,0.25)", icon: "🧬" },
  { bg: "linear-gradient(135deg,#0f0a1e 0%,#2e1065 100%)", accent: "#a78bfa", glow: "rgba(167,139,250,0.25)", icon: "🚀" },
  { bg: "linear-gradient(135deg,#111827 0%,#1e3a5f 100%)", accent: "#60a5fa", glow: "rgba(96,165,250,0.25)", icon: "💡" },
  { bg: "linear-gradient(135deg,#130f0a 0%,#431407 100%)", accent: "#fbbf24", glow: "rgba(251,191,36,0.25)", icon: "🏆" },
];

function formatPersianDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", { weekday: "long", month: "long", day: "numeric" });
  } catch { return iso; }
}

/* ── CAROUSEL ──────────────────────────────────────────────────── */
function NewsCarousel({ items }: { items: MagazineItem[] }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(idx: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setActive(clamped);
    trackRef.current?.children[clamped]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  /* touch/swipe support */
  const touchStart = useRef(0);
  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(active + (dx > 0 ? 1 : -1));
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Track */}
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
          scrollbarWidth: "none", paddingBottom: 4,
        }}
      >
        {items.map((item, i) => {
          const p = CARD_PALETTES[i % CARD_PALETTES.length];
          const isActive = i === active;
          return (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: "calc(100% - 40px)",
                scrollSnapAlign: "center",
                borderRadius: 22,
                background: p.bg,
                border: `1px solid ${isActive ? p.accent + "55" : "rgba(255,255,255,0.06)"}`,
                boxShadow: isActive ? `0 0 28px ${p.glow}` : "none",
                cursor: "pointer",
                overflow: "hidden",
                transition: "box-shadow 0.3s, border-color 0.3s",
              }}
            >
              {/* Card image area */}
              <div style={{
                height: 130,
                background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${p.glow}, transparent 70%), ${p.bg}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                {/* Grid lines (tech aesthetic) */}
                <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
                  <defs>
                    <pattern id={`grid-${i}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke={p.accent} strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${i})`} />
                </svg>
                {/* Glowing orb */}
                <div style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: `radial-gradient(circle, ${p.accent}40, ${p.accent}10)`,
                  border: `1px solid ${p.accent}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32,
                  boxShadow: `0 0 32px ${p.glow}`,
                  position: "relative", zIndex: 1,
                }}>
                  {p.icon}
                </div>
                {/* Number badge */}
                <div style={{
                  position: "absolute", top: 12, right: 14,
                  background: `${p.accent}22`, border: `1px solid ${p.accent}44`,
                  borderRadius: 8, padding: "3px 9px",
                  fontSize: 10, fontWeight: 900, color: p.accent,
                  fontFamily: "monospace",
                }}>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
              </div>

              {/* Card text */}
              <div style={{ padding: "14px 16px 18px" }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 800, lineHeight: 1.5,
                  color: "#e8efea", marginBottom: 8,
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: 12, color: "rgba(232,239,234,0.55)", lineHeight: 1.75,
                }}>
                  {item.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 14 }}>
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          style={{
            width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", cursor: active === 0 ? "not-allowed" : "pointer",
            display: "grid", placeItems: "center", opacity: active === 0 ? 0.3 : 1,
          }}
        >
          <ChevronRight size={14} color="#e8efea" />
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? 18 : 6,
                height: 6, borderRadius: 3,
                background: i === active
                  ? CARD_PALETTES[active % CARD_PALETTES.length].accent
                  : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1}
          style={{
            width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", cursor: active === items.length - 1 ? "not-allowed" : "pointer",
            display: "grid", placeItems: "center", opacity: active === items.length - 1 ? 0.3 : 1,
          }}
        >
          <ChevronLeft size={14} color="#e8efea" />
        </button>
      </div>
    </div>
  );
}

/* ── VINTAGE EMPTY STATE ────────────────────────────────────────── */
function VintageEmpty({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  return (
    <div style={{
      margin: "8px 0 24px",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid rgba(180,140,60,0.25)",
      background: "linear-gradient(160deg, rgba(30,24,10,0.95) 0%, rgba(18,14,4,0.98) 100%)",
    }}>
      {/* Masthead strip */}
      <div style={{
        background: "rgba(180,140,60,0.12)",
        borderBottom: "2px solid rgba(180,140,60,0.3)",
        padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "serif", fontSize: 11, color: "rgba(180,140,60,0.5)",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          EDITION · ۱۴۰۵
        </div>
        <div style={{ width: 40, height: 1, background: "rgba(180,140,60,0.35)" }} />
        <div style={{ fontSize: 10, color: "rgba(180,140,60,0.5)", fontFamily: "monospace" }}>
          Vol. I
        </div>
      </div>

      {/* Big newspaper name */}
      <div style={{ textAlign: "center", padding: "24px 20px 10px" }}>
        <div style={{
          fontFamily: "serif",
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: -1,
          color: "rgba(220,180,80,0.85)",
          textShadow: "0 2px 12px rgba(180,140,60,0.3)",
          lineHeight: 1,
          marginBottom: 6,
        }}>
          The A·Y Times
        </div>
        <div style={{
          height: 1, background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.4), transparent)",
          margin: "8px auto 10px",
        }} />
        <div style={{
          fontFamily: "serif", fontSize: 11, color: "rgba(180,140,60,0.45)",
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          «همه اخبار لایق چاپند»
        </div>
      </div>

      {/* Fake columns */}
      <div style={{ display: "flex", gap: 12, padding: "16px 18px", borderTop: "1px solid rgba(180,140,60,0.12)" }}>
        {[1, 2, 3].map(col => (
          <div key={col} style={{ flex: 1 }}>
            <div style={{ height: 7, background: "rgba(180,140,60,0.15)", borderRadius: 2, marginBottom: 6 }} />
            <div style={{ height: 5, background: "rgba(180,140,60,0.10)", borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 5, background: "rgba(180,140,60,0.10)", borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 5, background: "rgba(180,140,60,0.08)", borderRadius: 2, marginBottom: 5, width: "75%" }} />
            {col === 2 && (
              <div style={{
                marginTop: 10, height: 40,
                background: "rgba(180,140,60,0.07)",
                border: "1px solid rgba(180,140,60,0.12)",
                borderRadius: 4,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* BREAKING placeholder */}
      <div style={{
        margin: "0 18px 18px",
        padding: "10px 14px",
        background: "rgba(180,140,60,0.08)",
        border: "1px dashed rgba(180,140,60,0.25)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontSize: 8, letterSpacing: 3, color: "rgba(180,140,60,0.5)",
            fontFamily: "monospace", marginBottom: 4,
          }}>
            ★ BREAKING ★
          </div>
          <div style={{ fontSize: 12, color: "rgba(220,180,80,0.55)", fontFamily: "serif" }}>
            مجله امروز هنوز به چاپ نرسیده...
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={generating}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10,
            background: generating ? "rgba(180,140,60,0.08)" : "rgba(180,140,60,0.18)",
            border: "1px solid rgba(180,140,60,0.35)",
            color: "rgba(220,180,80,0.9)", fontSize: 11.5, fontWeight: 700,
            cursor: generating ? "not-allowed" : "pointer",
            fontFamily: "inherit", flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {generating
            ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />
            : <Sparkles size={12} />}
          {generating ? "در حال چاپ..." : "چاپ کن"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function MagazinePage() {
  const [article, setArticle]       = useState<Article | null>(null);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);

  async function fetchArticle() {
    setLoading(true);
    try {
      const res = await fetch("/api/magazine");
      setArticle(await res.json());
    } catch { setArticle(null); }
    finally  { setLoading(false); }
  }

  async function generateArticle() {
    setGenerating(true);
    try {
      await fetch("/api/magazine", { method: "POST" });
      await fetchArticle();
    } finally { setGenerating(false); }
  }

  useEffect(() => { fetchArticle(); }, []);

  const content = article?.content_json;
  const hasContent = !!content;

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: hasContent
          ? "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.10), transparent 55%), #020306"
          : "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(120,90,20,0.12), transparent 55%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
        transition: "background 0.6s",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: hasContent ? "rgba(2,3,6,0.92)" : "rgba(6,4,1,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: hasContent
          ? "1px solid rgba(99,102,241,0.12)"
          : "1px solid rgba(180,140,60,0.15)",
        transition: "background 0.5s, border-color 0.5s",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{
            width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
            background: hasContent ? "rgba(31,31,51,0.6)" : "rgba(30,22,4,0.6)",
            border: hasContent ? "1px solid rgba(99,102,241,0.18)" : "1px solid rgba(180,140,60,0.2)",
          }}>
            <ArrowRight size={15} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {hasContent ? "مجله روزانه AI" : "The A·Y Times"}
            </div>
            <div style={{ fontSize: 10, color: hasContent ? "rgba(165,180,252,0.6)" : "rgba(180,140,60,0.5)", marginTop: 1 }}>
              {loading ? "در حال بارگذاری..." : article?.date ? formatPersianDate(article.date) : "نسخه جدید در راه است"}
            </div>
          </div>
          {hasContent ? (
            <div style={{
              fontSize: 9, letterSpacing: 2, fontFamily: "monospace",
              color: "rgba(165,180,252,0.4)", border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 6, padding: "2px 7px",
            }}>LIVE</div>
          ) : (
            <div style={{
              fontSize: 9, letterSpacing: 2, fontFamily: "serif",
              color: "rgba(180,140,60,0.45)", border: "1px solid rgba(180,140,60,0.18)",
              borderRadius: 4, padding: "2px 7px",
            }}>PRESS</div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px" }}>

        {/* ── Loading ────────────────────────────────────────── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[140, 80, 80, 80].map((h, i) => (
              <div key={i} style={{
                height: h, borderRadius: 18,
                background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.07)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* ── NO CONTENT — vintage ──────────────────────────── */}
        {!loading && !hasContent && (
          <VintageEmpty onGenerate={generateArticle} generating={generating} />
        )}

        {/* ── HAS CONTENT — modern tech ─────────────────────── */}
        {!loading && hasContent && content && (
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>

            {/* Headline card */}
            <div style={{
              marginBottom: 22, padding: "20px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.13), rgba(139,92,246,0.08))",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 22,
              boxShadow: "0 0 40px rgba(99,102,241,0.08)",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 12,
                background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 8, padding: "3px 10px",
                fontSize: 9.5, color: "#a5b4fc", fontWeight: 700, letterSpacing: 1.5,
              }}>
                ⚡ امروز در AI دنیا
              </div>
              <h1 style={{
                fontSize: 20, fontWeight: 900, lineHeight: 1.5,
                margin: "0 0 10px", letterSpacing: -0.3,
              }}>
                {content.headline}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(232,239,234,0.6)", lineHeight: 1.75, margin: 0 }}>
                {content.intro}
              </p>
            </div>

            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 10, color: "rgba(165,180,252,0.45)", fontWeight: 700, letterSpacing: 2 }}>
                ۱۰ خبر برتر
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Carousel */}
            <NewsCarousel items={content.items || []} />

            {/* Tool of the day */}
            {content.tool_of_day && (
              <div style={{
                padding: "18px", borderRadius: 20, marginBottom: 16,
                background: "linear-gradient(135deg, rgba(250,204,21,0.10), rgba(234,179,8,0.05))",
                border: "1px solid rgba(250,204,21,0.25)",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 15, flexShrink: 0,
                  background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)",
                  display: "grid", placeItems: "center", fontSize: 24,
                  boxShadow: "0 0 20px rgba(250,204,21,0.15)",
                }}>🛠️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9.5, color: "rgba(253,230,138,0.55)", fontWeight: 700, letterSpacing: 2, marginBottom: 3 }}>
                    ابزار روز
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 15.5, color: "#fde68a", marginBottom: 4 }}>
                    {content.tool_of_day.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(253,230,138,0.65)", lineHeight: 1.5 }}>
                    {content.tool_of_day.why}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{
              padding: "14px 16px", borderRadius: 16,
              background: "rgba(16,185,129,0.07)", border: "1px solid rgba(110,231,183,0.15)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>ببین چه ابزاری به شغلت کمک می‌کنه</div>
                <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 2 }}>تحلیل مسیر شغلی — رایگان</div>
              </div>
              <Link href="/dashboard" style={{
                padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.3)",
                color: "#34d399", textDecoration: "none", flexShrink: 0,
              }}>داشبورد</Link>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
