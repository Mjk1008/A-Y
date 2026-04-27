"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight, RefreshCw, Sparkles, ExternalLink,
  Clock, Zap, ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

/* ── Types ─────────────────────────────────────────────────────────── */
interface DigestItem    { title: string; body: string }
interface ToolOfDay     { name: string; why: string }
interface DigestContent { headline: string; intro: string; items: DigestItem[]; tool_of_day?: ToolOfDay }
interface NewsItem {
  id: number;
  source_key: string;
  source_name: string;
  title: string;
  url: string;
  published_at: string;
  summary: string | null;
  image_url: string | null;
}
interface MagazineData {
  date: string;
  title: string | null;
  content_json: DigestContent | null;
  fallback: boolean;
  news_items: NewsItem[];
}

/* ── Source config ─────────────────────────────────────────────────── */
const SOURCE_CONFIG: Record<string, { bg: string; color: string; gradient: string; label: string }> = {
  verge_ai:    { bg: "rgba(99,102,241,0.15)",  color: "#a5b4fc", gradient: "linear-gradient(135deg,#1e1b4b,#312e81)", label: "V"  },
  venturebeat: { bg: "rgba(52,211,153,0.12)",  color: "#34d399", gradient: "linear-gradient(135deg,#022c22,#064e3b)", label: "VB" },
  wired_ai:    { bg: "rgba(248,113,113,0.12)", color: "#fca5a5", gradient: "linear-gradient(135deg,#450a0a,#7f1d1d)", label: "W"  },
  mit_tech:    { bg: "rgba(251,191,36,0.12)",  color: "#fde68a", gradient: "linear-gradient(135deg,#451a03,#78350f)", label: "M"  },
  techcrunch:  { bg: "rgba(56,189,248,0.12)",  color: "#7dd3fc", gradient: "linear-gradient(135deg,#0c4a6e,#075985)", label: "TC" },
  ars_tech:    { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd", gradient: "linear-gradient(135deg,#2e1065,#4c1d95)", label: "AT" },
  zoomit:      { bg: "rgba(45,212,191,0.12)",  color: "#2dd4bf", gradient: "linear-gradient(135deg,#042f2e,#134e4a)", label: "Z"  },
  digiato:     { bg: "rgba(251,146,60,0.12)",  color: "#fdba74", gradient: "linear-gradient(135deg,#431407,#7c2d12)", label: "D"  },
};
function srcCfg(key: string) {
  return SOURCE_CONFIG[key] ?? { bg: "rgba(110,231,183,0.10)", color: "#6ee7b7", gradient: "linear-gradient(135deg,#022c22,#064e3b)", label: "AI" };
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function relativeTime(iso: string): string {
  try {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)    return "همین الان";
    if (diff < 3600)  return `${Math.floor(diff / 60)} دقیقه پیش`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
    return `${Math.floor(diff / 86400)} روز پیش`;
  } catch { return ""; }
}
function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("fa-IR", { weekday: "long", month: "long", day: "numeric" }); }
  catch { return iso; }
}

/* ── Image with fallback ───────────────────────────────────────────── */
function NewsImage({
  src, sourceKey, alt, width, height, borderRadius = 0,
}: {
  src: string | null;
  sourceKey: string;
  alt: string;
  width: string | number;
  height: number;
  borderRadius?: number;
}) {
  const [err, setErr] = useState(false);
  const cfg = srcCfg(sourceKey);
  const style: React.CSSProperties = { width, height, display: "block", borderRadius, flexShrink: 0 };

  if (!src || err) {
    return (
      <div style={{
        ...style, background: cfg.gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: Math.max(Math.round(height / 3.5), 11),
          fontWeight: 900, color: "rgba(255,255,255,0.22)", letterSpacing: -0.5, userSelect: "none",
        }}>
          {cfg.label}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{ ...style, objectFit: "cover" }}
      onError={() => setErr(true)}
    />
  );
}

/* ── Hero Card ─────────────────────────────────────────────────────── */
function HeroCard({ item }: { item: NewsItem }) {
  const cfg = srcCfg(item.source_key);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block", textDecoration: "none", marginBottom: 10,
        borderRadius: 20, overflow: "hidden",
        background: "rgba(8,14,11,0.8)", border: "1px solid rgba(110,231,183,0.09)",
      }}
    >
      {/* Image zone */}
      <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
        <NewsImage src={item.image_url} sourceKey={item.source_key} alt={item.title} width="100%" height={200} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,3,6,0.93) 0%, rgba(2,3,6,0.35) 50%, transparent 100%)",
        }} />
        {/* Source + time badge */}
        <div style={{
          position: "absolute", bottom: 12, right: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
            background: cfg.bg, color: cfg.color, backdropFilter: "blur(8px)",
            border: `1px solid ${cfg.color}44`,
          }}>{item.source_name}</span>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 3 }}>
            <Clock size={9} />{relativeTime(item.published_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: "#e8efea", lineHeight: 1.5, marginBottom: item.summary ? 7 : 0, letterSpacing: -0.3 }}>
          {item.title}
        </div>
        {item.summary && (
          <div style={{ fontSize: 12, color: "rgba(232,239,234,0.44)", lineHeight: 1.65, overflow: "hidden", maxHeight: "3.3em" }}>
            {item.summary}
          </div>
        )}
        <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 5 }}>
          <ExternalLink size={11} color={cfg.color} />
          <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>بخوان</span>
        </div>
      </div>
    </a>
  );
}

/* ── Medium Card (2-column grid) ───────────────────────────────────── */
function MediumCard({ item }: { item: NewsItem }) {
  const cfg = srcCfg(item.source_key);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", flexDirection: "column", textDecoration: "none",
        borderRadius: 16, overflow: "hidden",
        background: "rgba(8,14,11,0.8)", border: "1px solid rgba(110,231,183,0.07)",
      }}
    >
      {/* Image */}
      <div style={{ height: 112, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <NewsImage src={item.image_url} sourceKey={item.source_key} alt={item.title} width="100%" height={112} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,3,6,0.65) 0%, transparent 55%)",
        }} />
      </div>
      {/* Content */}
      <div style={{ padding: "9px 10px 11px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{
          alignSelf: "flex-start", fontSize: 8.5, fontWeight: 800, padding: "1.5px 6px", borderRadius: 5,
          background: cfg.bg, color: cfg.color,
        }}>{item.source_name}</span>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#e8efea", lineHeight: 1.45, flex: 1,
          overflow: "hidden", maxHeight: "3.6em",
        }}>
          {item.title}
        </div>
        <div style={{ fontSize: 9.5, color: "rgba(232,239,234,0.28)", display: "flex", alignItems: "center", gap: 2 }}>
          <Clock size={8} />{relativeTime(item.published_at)}
        </div>
      </div>
    </a>
  );
}

/* ── List Card (thumbnail + text) ──────────────────────────────────── */
function ListCard({ item }: { item: NewsItem }) {
  const cfg = srcCfg(item.source_key);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", gap: 12, textDecoration: "none",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.042)",
        alignItems: "flex-start",
      }}
    >
      {/* Thumbnail (right side in RTL because first in DOM) */}
      <div style={{ borderRadius: 11, overflow: "hidden", flexShrink: 0 }}>
        <NewsImage src={item.image_url} sourceKey={item.source_key} alt={item.title} width={74} height={56} borderRadius={11} />
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, padding: "1.5px 6px", borderRadius: 5,
            background: cfg.bg, color: cfg.color, flexShrink: 0,
          }}>{item.source_name}</span>
          <span style={{ fontSize: 9.5, color: "rgba(232,239,234,0.27)", display: "flex", alignItems: "center", gap: 2 }}>
            <Clock size={8} />{relativeTime(item.published_at)}
          </span>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#e8efea", lineHeight: 1.45 }}>
          {item.title}
        </div>
      </div>
    </a>
  );
}

/* ── Digest Card ───────────────────────────────────────────────────── */
function DigestCard({ content, onRefresh, refreshing }: {
  content: DigestContent; onRefresh: () => void; refreshing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section style={{ marginBottom: 20 }}>
      <div style={{
        borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
        border: "1px solid rgba(99,102,241,0.2)", marginBottom: 12,
      }}>
        <div style={{ padding: "16px 16px 14px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 10,
            background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.28)",
            borderRadius: 7, padding: "3px 10px",
            fontSize: 9.5, color: "#a5b4fc", fontWeight: 800, letterSpacing: 1.5,
          }}>⚡ دیجست روزانه AI</div>
          <h2 style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.55, margin: "0 0 7px", letterSpacing: -0.2 }}>
            {content.headline}
          </h2>
          <p style={{ fontSize: 12.5, color: "rgba(232,239,234,0.5)", lineHeight: 1.7, margin: 0 }}>
            {content.intro}
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)" }}>
          {(expanded ? content.items : content.items.slice(0, 3)).map((item, i) => (
            <div key={i} style={{
              padding: "10px 16px",
              borderBottom: i < content.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{
                flexShrink: 0, marginTop: 3, width: 17, height: 17, borderRadius: 5,
                background: "rgba(99,102,241,0.14)", border: "1px solid rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 900, color: "#a5b4fc",
              }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#e8efea", lineHeight: 1.45, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 11.5, color: "rgba(232,239,234,0.48)", lineHeight: 1.65 }}>{item.body}</div>
              </div>
            </div>
          ))}
          {content.items.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} style={{
              width: "100%", padding: "9px 16px",
              background: "rgba(99,102,241,0.06)", border: "none",
              fontSize: 11.5, color: "#a5b4fc", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              {expanded ? "کمتر نشون بده" : `${content.items.length - 3} خبر دیگه`}
              <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
          )}
        </div>
      </div>

      {content.tool_of_day && (
        <div style={{
          padding: "12px 14px", borderRadius: 14, marginBottom: 12,
          background: "linear-gradient(135deg, rgba(250,204,21,0.09), rgba(234,179,8,0.04))",
          border: "1px solid rgba(250,204,21,0.2)",
          display: "flex", gap: 12, alignItems: "center",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "rgba(250,204,21,0.13)", border: "1px solid rgba(250,204,21,0.25)",
            display: "grid", placeItems: "center", fontSize: 18,
          }}>🛠️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: "rgba(253,230,138,0.45)", fontWeight: 800, letterSpacing: 2, marginBottom: 2 }}>ابزار روز</div>
            <div style={{ fontWeight: 900, fontSize: 14, color: "#fde68a", marginBottom: 2 }}>{content.tool_of_day.name}</div>
            <div style={{ fontSize: 11.5, color: "rgba(253,230,138,0.55)", lineHeight: 1.5 }}>{content.tool_of_day.why}</div>
          </div>
        </div>
      )}

      <button onClick={onRefresh} disabled={refreshing} style={{
        display: "flex", alignItems: "center", gap: 5,
        fontSize: 11, color: "rgba(165,180,252,0.45)", background: "none", border: "none",
        cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: refreshing ? 0.5 : 1,
      }}>
        <RefreshCw size={10} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
        {refreshing ? "در حال بروزرسانی..." : "بروزرسانی دیجست"}
      </button>
    </section>
  );
}

/* ── Empty state ───────────────────────────────────────────────────── */
function EmptyState({ onCrawl, crawling, onGenerate, generating }: {
  onCrawl: () => void; crawling: boolean;
  onGenerate: () => void; generating: boolean;
}) {
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      border: "1px solid rgba(180,140,60,0.25)",
      background: "linear-gradient(160deg, rgba(30,24,10,0.95) 0%, rgba(18,14,4,0.98) 100%)",
      marginBottom: 24,
    }}>
      <div style={{
        background: "rgba(180,140,60,0.1)", borderBottom: "2px solid rgba(180,140,60,0.3)",
        padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "serif", fontSize: 10, color: "rgba(180,140,60,0.5)", letterSpacing: 3 }}>A·Y TIMES · ۱۴۰۵</div>
        <div style={{ fontSize: 9, color: "rgba(180,140,60,0.4)", fontFamily: "monospace" }}>Vol. I</div>
      </div>
      <div style={{ textAlign: "center", padding: "28px 24px 10px" }}>
        <div style={{ fontFamily: "serif", fontSize: 32, fontWeight: 900, color: "rgba(220,180,80,0.8)", lineHeight: 1, marginBottom: 8 }}>
          The A·Y Times
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(180,140,60,0.4),transparent)", margin: "8px auto 10px" }} />
        <div style={{ fontSize: 11, color: "rgba(180,140,60,0.4)", fontFamily: "serif", letterSpacing: 2 }}>
          «هنوز به چاپ نرسیده»
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "18px", borderTop: "1px solid rgba(180,140,60,0.1)" }}>
        <button onClick={onCrawl} disabled={crawling} style={{
          flex: 1, padding: "10px", borderRadius: 11,
          background: "rgba(180,140,60,0.14)", border: "1px solid rgba(180,140,60,0.3)",
          color: "rgba(220,180,80,0.9)", fontSize: 12, fontWeight: 700,
          cursor: crawling ? "not-allowed" : "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <RefreshCw size={12} style={{ animation: crawling ? "spin 1s linear infinite" : "none" }} />
          {crawling ? "در حال جمع‌آوری..." : "جمع‌آوری اخبار"}
        </button>
        <button onClick={onGenerate} disabled={generating} style={{
          flex: 1, padding: "10px", borderRadius: 11,
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
          color: "#a5b4fc", fontSize: 12, fontWeight: 700,
          cursor: generating ? "not-allowed" : "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Sparkles size={12} style={{ animation: generating ? "spin 1s linear infinite" : "none" }} />
          {generating ? "در حال نوشتن..." : "ساخت دیجست AI"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function MagazinePage() {
  const [data, setData]             = useState<MagazineData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [crawling, setCrawling]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter]         = useState<string>("all");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/magazine");
      setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  async function doCrawl() {
    setCrawling(true);
    try { await fetch("/api/magazine/crawl", { method: "POST" }); await load(); }
    finally { setCrawling(false); }
  }

  async function doGenerate() {
    setGenerating(true);
    try { await fetch("/api/magazine?force=1", { method: "POST" }); await load(); }
    finally { setGenerating(false); }
  }

  async function doRefresh() {
    setCrawling(true); setGenerating(true);
    try {
      await fetch("/api/magazine/crawl", { method: "POST" });
      await fetch("/api/magazine?force=1", { method: "POST" });
      await load();
    } finally { setCrawling(false); setGenerating(false); }
  }

  useEffect(() => { load(); }, []);

  const newsItems = data?.news_items ?? [];
  const digest    = data?.content_json ?? null;
  const hasNews   = newsItems.length > 0;

  const sources  = Array.from(new Set(newsItems.map((n) => n.source_key)));
  const filtered = filter === "all" ? newsItems : newsItems.filter((n) => n.source_key === filter);

  // Magazine layout tiers
  const [hero, ...rest] = filtered;
  const medium = rest.slice(0, 2);
  const list   = rest.slice(2);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.08), transparent 55%), #020306",
        color: "#e8efea", fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes shimmer { 0%,100% { opacity:.35; } 50% { opacity:.6; } }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(99,102,241,0.09)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" aria-label="بازگشت" style={{
            width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0,
            background: "rgba(31,31,51,0.55)", border: "1px solid rgba(99,102,241,0.16)",
          }}>
            <ArrowRight size={16} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>مجله AI</div>
            <div style={{ fontSize: 10, color: "rgba(165,180,252,0.5)", marginTop: 1 }}>
              {loading
                ? "در حال بارگذاری..."
                : data?.date
                  ? formatDate(data.date) + (hasNews ? ` · ${newsItems.length} خبر` : "")
                  : "اخبار ۴۸ ساعت اخیر"}
            </div>
          </div>
          <button
            onClick={doRefresh}
            disabled={crawling || generating}
            title="بروزرسانی کامل"
            style={{
              width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center",
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)",
              cursor: (crawling || generating) ? "not-allowed" : "pointer",
              opacity: (crawling || generating) ? 0.5 : 1,
            }}
          >
            <RefreshCw size={14} color="#a5b4fc"
              style={{ animation: (crawling || generating) ? "spin 1s linear infinite" : "none" }} />
          </button>
          <div style={{
            fontSize: 8.5, letterSpacing: 2, color: "rgba(165,180,252,0.4)",
            border: "1px solid rgba(99,102,241,0.15)", borderRadius: 5, padding: "2px 7px",
          }}>
            {hasNews ? "LIVE" : "PRESS"}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px", animation: "fadeUp 0.3s ease-out" }}>

        {/* ── Loading skeletons ──────────────────────────────────────── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Hero skeleton */}
            <div style={{
              height: 290, borderRadius: 20,
              background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.07)",
              animation: "shimmer 1.4s ease-in-out infinite",
            }} />
            {/* Medium grid skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[160, 160].map((h, i) => (
                <div key={i} style={{
                  height: h, borderRadius: 16,
                  background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.07)",
                  animation: "shimmer 1.4s ease-in-out infinite",
                }} />
              ))}
            </div>
            {/* List skeletons */}
            {[72, 72, 72].map((h, i) => (
              <div key={i} style={{
                height: h, borderRadius: 14,
                background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.06)",
                animation: "shimmer 1.4s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* ── No data at all ────────────────────────────────────────── */}
        {!loading && !hasNews && !digest && (
          <EmptyState onCrawl={doCrawl} crawling={crawling} onGenerate={doGenerate} generating={generating} />
        )}

        {/* ── AI Digest ─────────────────────────────────────────────── */}
        {!loading && digest && (
          <DigestCard content={digest} onRefresh={doRefresh} refreshing={generating || crawling} />
        )}

        {/* ── News Section ───────────────────────────────────────────── */}
        {!loading && hasNews && (
          <section>
            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 10, color: "rgba(165,180,252,0.4)", fontWeight: 800, letterSpacing: 2 }}>آخرین اخبار AI</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Source filter tabs */}
            {sources.length > 1 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
                {(["all", ...sources] as string[]).map((key) => {
                  const isActive = filter === key;
                  const cfg = key === "all" ? { bg: "rgba(99,102,241,0.18)", color: "#a5b4fc" } : srcCfg(key);
                  const label = key === "all"
                    ? "همه"
                    : newsItems.find((n) => n.source_key === key)?.source_name ?? key;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      style={{
                        flexShrink: 0, padding: "5px 11px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                        border: "1px solid",
                        background: isActive ? cfg.bg : "rgba(8,14,11,0.5)",
                        borderColor: isActive ? cfg.color + "55" : "rgba(110,231,183,0.08)",
                        color: isActive ? cfg.color : "rgba(232,239,234,0.4)",
                        transition: "all 0.12s",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Count */}
            <div style={{ fontSize: 10.5, color: "rgba(232,239,234,0.25)", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={9} color="rgba(99,102,241,0.5)" />
              {filtered.length} خبر در ۴۸ ساعت اخیر
            </div>

            {/* Hero card */}
            {hero && <HeroCard item={hero} />}

            {/* 2-col medium grid */}
            {medium.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {medium.map((item) => <MediumCard key={item.id} item={item} />)}
              </div>
            )}

            {/* List items */}
            {list.length > 0 && (
              <div>
                {list.map((item) => <ListCard key={item.id} item={item} />)}
              </div>
            )}

            {/* Empty after filter */}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0", fontSize: 12.5, color: "rgba(232,239,234,0.3)" }}>
                خبری از این منبع پیدا نشد
              </div>
            )}

            {/* Generate digest CTA */}
            {!digest && (
              <div style={{
                marginTop: 20, padding: "14px 16px", borderRadius: 16,
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>دیجست AI هنوز ساخته نشده</div>
                  <div style={{ fontSize: 11, color: "rgba(232,239,234,0.4)", marginTop: 2 }}>AI اخبار رو خلاصه می‌کنه</div>
                </div>
                <button onClick={doGenerate} disabled={generating} style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)",
                  color: "#a5b4fc", cursor: generating ? "not-allowed" : "pointer",
                  fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                }}>
                  <Sparkles size={12} style={{ animation: generating ? "spin 1s linear infinite" : "none" }} />
                  {generating ? "در حال ساخت..." : "بساز"}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── Has digest but no news ─────────────────────────────────── */}
        {!loading && !hasNews && digest && (
          <div style={{
            padding: "14px 16px", borderRadius: 14,
            background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(110,231,183,0.12)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          }}>
            <div style={{ fontSize: 12, color: "rgba(232,239,234,0.4)" }}>اخبار زنده هنوز جمع‌آوری نشده</div>
            <button onClick={doCrawl} disabled={crawling} style={{
              padding: "6px 12px", borderRadius: 9, fontSize: 11.5, fontWeight: 700,
              background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
              color: "#34d399", cursor: crawling ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
            }}>
              <RefreshCw size={11} style={{ animation: crawling ? "spin 1s linear infinite" : "none" }} />
              {crawling ? "در حال جمع‌آوری..." : "جمع‌آوری اخبار"}
            </button>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
