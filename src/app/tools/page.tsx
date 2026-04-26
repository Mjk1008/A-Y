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

export default function ToolsPage() {
  const [tools, setTools]         = useState<Tool[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("همه");
  const [difficulty, setDiff]     = useState("");
  const [iranOnly, setIranOnly]   = useState(false);
  const [query, setQuery]         = useState("");   // debounced search

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
        minHeight: "100dvh", paddingBottom: 96,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(110,231,183,0.08)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{
            width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
            background: "rgba(31,46,40,0.6)", border: "1px solid rgba(110,231,183,0.14)",
          }}>
            <ArrowRight size={15} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>ابزارهای AI</div>
            <div style={{ fontSize: 10, color: "rgba(110,231,183,0.6)", marginTop: 1 }}>
              {total > 0 ? `${total} ابزار` : "در حال بارگذاری..."}
            </div>
          </div>
          <Zap size={16} color="rgba(110,231,183,0.5)" />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px" }}>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(31,46,40,0.55)", border: "1px solid rgba(110,231,183,0.12)",
          borderRadius: 14, padding: "10px 14px", marginBottom: 14,
        }}>
          <Search size={15} color="rgba(110,231,183,0.5)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجوی ابزار..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 13, color: "#e8efea", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12,
          scrollbarWidth: "none",
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, padding: "5px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 700,
                fontFamily: "inherit", cursor: "pointer", border: "1px solid",
                background: category === cat ? "rgba(52,211,153,0.18)" : "rgba(31,46,40,0.4)",
                borderColor: category === cat ? "rgba(52,211,153,0.4)" : "rgba(110,231,183,0.12)",
                color: category === cat ? "#6ee7b7" : "rgba(232,239,234,0.55)",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {/* Difficulty — pill buttons, no native select */}
          {[
            { val: "",             label: "همه سطح‌ها" },
            { val: "beginner",     label: "مبتدی" },
            { val: "intermediate", label: "متوسط" },
            { val: "advanced",     label: "پیشرفته" },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setDiff(val)}
              style={{
                flexShrink: 0, padding: "5px 11px", borderRadius: 20,
                fontSize: 11, fontWeight: 700, fontFamily: "inherit",
                cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                background: difficulty === val ? "rgba(52,211,153,0.18)" : "rgba(31,46,40,0.4)",
                borderColor: difficulty === val ? "rgba(52,211,153,0.4)" : "rgba(110,231,183,0.12)",
                color: difficulty === val ? "#6ee7b7" : "rgba(232,239,234,0.5)",
              }}
            >
              {label}
            </button>
          ))}

          {/* Iran accessible toggle */}
          <button
            onClick={() => setIranOnly(!iranOnly)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              fontFamily: "inherit", cursor: "pointer", border: "1px solid",
              background: iranOnly ? "rgba(16,185,129,0.18)" : "rgba(31,46,40,0.4)",
              borderColor: iranOnly ? "rgba(52,211,153,0.4)" : "rgba(110,231,183,0.12)",
              color: iranOnly ? "#6ee7b7" : "rgba(232,239,234,0.5)",
              transition: "all 0.15s",
            }}
          >
            <Globe size={11} />
            بدون VPN
          </button>
        </div>

        {/* Tools list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                height: 72, borderRadius: 16,
                background: "rgba(31,46,40,0.3)", border: "1px solid rgba(110,231,183,0.06)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(232,239,234,0.4)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 13 }}>ابزاری پیدا نشد</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tools.map((tool, i) => {
              const diff = DIFFICULTY_LABEL[tool.difficulty || ""] || tool.level || "";
              const price = PRICING_LABEL[tool.pricing_model || ""] || "";
              const isFree = tool.pricing_model === "free" || tool.pricing_model === "freemium";

              return (
                <a
                  key={tool.id || i}
                  href={tool.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 16, textDecoration: "none",
                    background: "rgba(31,46,40,0.55)", border: "1px solid rgba(110,231,183,0.10)",
                    transition: "border-color 0.15s",
                  }}
                >
                  <ToolInitial name={tool.name} size={44} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "#e8efea" }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(232,239,234,0.55)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tool.tagline || tool.use || (tool.use_cases || []).join("، ")}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    {diff && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8,
                        background: "rgba(110,231,183,0.1)", color: "rgba(110,231,183,0.8)",
                      }}>
                        {diff}
                      </span>
                    )}
                    {isFree && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8,
                        background: "rgba(16,185,129,0.15)", color: "#34d399",
                      }}>
                        {price}
                      </span>
                    )}
                    {tool.is_iran_accessible && (
                      <Globe size={11} color="rgba(52,211,153,0.6)" />
                    )}
                    {!tool.is_iran_accessible && (
                      <Lock size={11} color="rgba(250,204,21,0.5)" strokeWidth={1.8} />
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Upgrade CTA */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", borderRadius: 16, marginTop: 16,
          background: "linear-gradient(180deg, rgba(42,29,3,0.55), rgba(18,12,1,0.5))",
          border: "1px solid rgba(250,204,21,0.22)",
        }}>
          <Crown size={20} color="#fde68a" strokeWidth={1.8} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>با Pro، همه ابزارها</div>
            <div style={{ fontSize: 11, color: "rgba(232,239,234,0.5)", marginTop: 2 }}>
              + هر هفته ابزار جدید اضافه میشه
            </div>
          </div>
          <Link href="/billing" style={{
            padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: "linear-gradient(180deg, #fde68a, #eab308)", color: "#2a1d03",
            textDecoration: "none",
          }}>
            ارتقا
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
