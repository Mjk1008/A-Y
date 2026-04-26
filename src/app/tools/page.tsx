"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Crown, Zap, Search, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

interface Tool {
  id?: number;
  name: string;
  tagline?: string;
  description?: string;
  use?: string;
  url?: string;
  categories?: string[];
  use_cases?: string[];
  pricing_model?: string;
  difficulty?: string;
  logo_url?: string;
  is_iran_accessible?: boolean;
  // legacy fields for curated fallback
  tag?: string;
  level?: string;
  locked?: boolean;
  hero?: boolean;
  heroDesc?: string;
  tone?: string;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const PRICING_LABEL: Record<string, string> = {
  free: "رایگان",
  freemium: "رایگان + پولی",
  paid: "پولی",
  open_source: "متن‌باز",
};

const CATEGORIES = ["همه", "محتوا", "کدنویسی", "طراحی", "تحلیل", "مارکتینگ", "تحقیق", "ترجمه"];

function ToolInitial({ name, size = 40 }: { name: string; size?: number }) {
  const colors = [
    { bg: "rgba(16,185,129,0.18)", text: "#6ee7b7", border: "rgba(52,211,153,0.3)" },
    { bg: "rgba(250,204,21,0.14)", text: "#fde68a", border: "rgba(250,204,21,0.28)" },
    { bg: "rgba(139,92,246,0.14)", text: "#c4b5fd", border: "rgba(139,92,246,0.28)" },
    { bg: "rgba(6,182,212,0.14)", text: "#67e8f9", border: "rgba(6,182,212,0.28)" },
    { bg: "rgba(244,63,94,0.14)", text: "#fda4af", border: "rgba(244,63,94,0.28)" },
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const c = colors[idx];
  const letters = name.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: c.bg, border: `1px solid ${c.border}`,
        color: c.text, fontSize: size * 0.3, fontWeight: 900,
        display: "grid", placeItems: "center", flexShrink: 0,
      }}
    >
      {letters}
    </div>
  );
}

// Pill button style factory
function pill(active: boolean, colorActive = "rgba(52,211,153,0.18)", borderActive = "rgba(52,211,153,0.4)") {
  return {
    flexShrink: 0 as const, padding: "6px 13px", borderRadius: 20,
    fontSize: 11.5, fontWeight: 700, fontFamily: "inherit",
    cursor: "pointer" as const, border: "1px solid", transition: "all 0.15s",
    background: active ? colorActive : "rgba(31,46,40,0.4)",
    borderColor: active ? borderActive : "rgba(110,231,183,0.12)",
    color: active ? "#6ee7b7" : "rgba(232,239,234,0.5)",
  };
}

export default function ToolsPage() {
  const [tools, setTools]         = useState<Tool[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("همه");
  const [difficulty, setDiff]     = useState("");
  const [iranOnly, setIranOnly]   = useState(false);
  const [query, setQuery]         = useState("");   // debounced search

  const hasActiveFilter = category !== "همه" || difficulty !== "" || iranOnly || search !== "";

  function clearFilters() {
    setSearch(""); setCategory("همه"); setDiff(""); setIranOnly(false); setQuery("");
  }

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (query)      params.set("q", query);
    if (category !== "همه") params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    if (iranOnly)   params.set("iran", "true");

    fetch(`/api/tools?${params}`)
      .then(r => r.json())
      .then(d => { setTools(d.tools || []); setTotal(d.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, category, difficulty, iranOnly]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      <style>{`@keyframes shimmer{0%{opacity:.4}50%{opacity:.8}100%{opacity:.4}}`}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.92)", backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(110,231,183,0.08)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" aria-label="بازگشت" style={{
            width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center",
            background: "rgba(31,46,40,0.6)", border: "1px solid rgba(110,231,183,0.14)",
            flexShrink: 0,
          }}>
            <ArrowRight size={16} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>ابزارهای AI</div>
            <div style={{ fontSize: 11, color: "rgba(110,231,183,0.55)", marginTop: 1 }}>
              {loading ? "در حال بارگذاری..." : total > 0 ? `${total.toLocaleString("fa-IR")} ابزار` : "ابزاری پیدا نشد"}
            </div>
          </div>
          <Zap size={16} color="rgba(110,231,183,0.5)" />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 0" }}>

        {/* ── Search ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(31,46,40,0.55)", border: "1px solid rgba(110,231,183,0.12)",
          borderRadius: 14, padding: "11px 14px", marginBottom: 14,
          transition: "border-color 0.2s",
        }}>
          <Search size={15} color="rgba(110,231,183,0.5)" style={{ flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجوی ابزار..."
            autoComplete="off"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 13.5, color: "#e8efea", fontFamily: "inherit",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="پاک کردن جستجو"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(232,239,234,0.35)", padding: 0, lineHeight: 1,
                fontSize: 16, display: "flex", alignItems: "center",
              }}
            >×</button>
          )}
        </div>

        {/* ── Category tabs ───────────────────────────────────────── */}
        <div className="h-scroll-free" style={{
          display: "flex", gap: 6, paddingBottom: 4, marginBottom: 12,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={pill(category === cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Filters row ──────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 7, marginBottom: hasActiveFilter ? 10 : 16, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { val: "",             label: "همه سطح‌ها" },
            { val: "beginner",     label: "مبتدی" },
            { val: "intermediate", label: "متوسط" },
            { val: "advanced",     label: "پیشرفته" },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setDiff(val)} style={pill(difficulty === val)}>
              {label}
            </button>
          ))}

          <button
            onClick={() => setIranOnly(!iranOnly)}
            style={{ ...pill(iranOnly), display: "flex", alignItems: "center", gap: 5 }}
          >
            <Globe size={11} />
            بدون VPN
          </button>
        </div>

        {/* ── Active filters indicator + clear ─────────────────────── */}
        {hasActiveFilter && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 14, padding: "6px 12px", borderRadius: 10,
            background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)",
          }}>
            <span style={{ fontSize: 11, color: "rgba(110,231,183,0.7)" }}>
              {loading ? "در حال فیلتر..." : `${total} نتیجه`}
            </span>
            <button
              onClick={clearFilters}
              style={{
                fontSize: 11, fontWeight: 700, color: "rgba(110,231,183,0.6)",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                padding: "2px 0",
              }}
            >
              پاک کردن فیلترها ×
            </button>
          </div>
        )}

        {/* ── Tools list ──────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                height: 72, borderRadius: 16,
                background: "rgba(31,46,40,0.3)", border: "1px solid rgba(110,231,183,0.06)",
                animation: `shimmer ${1 + i * 0.15}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 20px",
            borderRadius: 20, border: "1px dashed rgba(110,231,183,0.1)",
            background: "rgba(31,46,40,0.2)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,239,234,0.7)", marginBottom: 6 }}>
              {hasActiveFilter ? "ابزاری با این فیلترها پیدا نشد" : "هنوز ابزاری ثبت نشده"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(232,239,234,0.35)", lineHeight: 1.6 }}>
              {hasActiveFilter ? "فیلترها را کم کن یا پاک کن" : "به زودی ابزارها اضافه می‌شن"}
            </div>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                style={{
                  marginTop: 16, padding: "8px 18px", borderRadius: 10,
                  background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                  color: "#6ee7b7", fontSize: 12.5, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tools.map((tool, i) => {
              const diff = DIFFICULTY_LABEL[tool.difficulty || ""] || tool.level || "";
              const price = PRICING_LABEL[tool.pricing_model || ""] || "";
              const isFree = tool.pricing_model === "free" || tool.pricing_model === "freemium";
              const canAccess = tool.is_iran_accessible;

              return (
                <a
                  key={tool.id || i}
                  href={tool.url || "#"}
                  target={tool.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 14px", borderRadius: 16, textDecoration: "none",
                    background: "rgba(31,46,40,0.5)", border: "1px solid rgba(110,231,183,0.09)",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(110,231,183,0.22)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(31,46,40,0.7)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(110,231,183,0.09)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(31,46,40,0.5)"; }}
                >
                  <ToolInitial name={tool.name} size={44} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "#e8efea" }}>
                      {tool.name}
                    </div>
                    <div style={{
                      fontSize: 11.5, color: "rgba(232,239,234,0.5)", marginTop: 2,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {tool.tagline || tool.use || (tool.use_cases || []).join("، ")}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                    {diff && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                        background: "rgba(110,231,183,0.08)", color: "rgba(110,231,183,0.75)",
                        border: "1px solid rgba(110,231,183,0.12)",
                      }}>
                        {diff}
                      </span>
                    )}
                    {isFree && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                        background: "rgba(16,185,129,0.12)", color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}>
                        {price}
                      </span>
                    )}
                    <span
                      title={canAccess ? "بدون VPN" : "نیاز به VPN"}
                      style={{ lineHeight: 1, display: "flex" }}
                    >
                      {canAccess
                        ? <Globe size={12} color="rgba(52,211,153,0.55)" />
                        : <Lock size={12} color="rgba(250,204,21,0.4)" strokeWidth={1.8} />}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* ── Upgrade CTA (only shown when results exist) ─────────── */}
        {!loading && tools.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 16, marginTop: 16,
            background: "linear-gradient(160deg, rgba(42,29,3,0.6), rgba(18,12,1,0.5))",
            border: "1px solid rgba(250,204,21,0.2)",
          }}>
            <Crown size={20} color="#fde68a" strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>با Pro، تحلیل شخصی ابزارها</div>
              <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 2 }}>
                کدوم ابزار برای شغل دقیق تو مناسبه؟
              </div>
            </div>
            <Link href="/billing" style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
              background: "linear-gradient(180deg, #fde68a, #eab308)", color: "#2a1d03",
              textDecoration: "none", flexShrink: 0,
              boxShadow: "0 4px 12px rgba(234,179,8,0.25)",
            }}>
              ارتقا
            </Link>
          </div>
        )}

      </div>

      <div style={{ height: 16 }} />
      <BottomNav />
    </div>
  );
}
