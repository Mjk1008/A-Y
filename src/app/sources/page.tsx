"use client";

import { useState } from "react";
import { ArrowRight, Youtube, BookOpen, Mic, Globe, Star } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";

type ResourceType = "video" | "newsletter" | "podcast" | "blog";
type Lang = "fa" | "en";

interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  type: ResourceType;
  lang: Lang;
  free: boolean;
  stars: number; // 1-5
  tags: string[];
}

const RESOURCES: Resource[] = [
  /* ── Persian / فارسی ── */
  {
    id: 1,
    name: "دیوار AI",
    description: "کانال یوتیوب فارسی با بررسی ابزارها و آموزش‌های AI به زبان ساده",
    url: "https://youtube.com/@divarai",
    type: "video", lang: "fa", free: true, stars: 5,
    tags: ["آموزش", "ابزار AI"],
  },
  {
    id: 2,
    name: "خبرنامه هوش مصنوعی",
    description: "خلاصه هفتگی مهم‌ترین اخبار AI به فارسی — هر یکشنبه توی ایمیلت",
    url: "https://aiweekly.ir",
    type: "newsletter", lang: "fa", free: true, stars: 4,
    tags: ["خبر", "هفتگی"],
  },
  {
    id: 3,
    name: "پادکست چه خبر AI",
    description: "گفتگو با متخصصان ایرانی AI در مورد آینده کار و فناوری",
    url: "https://pod.cast/ai",
    type: "podcast", lang: "fa", free: true, stars: 4,
    tags: ["مصاحبه", "آینده کار"],
  },
  {
    id: 4,
    name: "ویرگول AI",
    description: "مقالات فارسی عمیق درباره ML، LLM، و ابزارهای AI از نویسندگان ایرانی",
    url: "https://virgool.io/tag/هوش-مصنوعی",
    type: "blog", lang: "fa", free: true, stars: 4,
    tags: ["مقاله", "فنی"],
  },
  /* ── English ── */
  {
    id: 5,
    name: "TLDR AI",
    description: "Daily 5-min digest of the most important AI news — no fluff",
    url: "https://tldr.tech/ai",
    type: "newsletter", lang: "en", free: true, stars: 5,
    tags: ["news", "daily"],
  },
  {
    id: 6,
    name: "Lex Fridman Podcast",
    description: "Long-form conversations with AI researchers & founders",
    url: "https://youtube.com/@lexfridman",
    type: "podcast", lang: "en", free: true, stars: 5,
    tags: ["research", "founders"],
  },
  {
    id: 7,
    name: "3Blue1Brown",
    description: "Visual explanations of neural networks and math behind AI",
    url: "https://youtube.com/@3blue1brown",
    type: "video", lang: "en", free: true, stars: 5,
    tags: ["visual", "math", "learning"],
  },
  {
    id: 8,
    name: "The Rundown AI",
    description: "Daily AI news in plain English — curated for professionals",
    url: "https://therundown.ai",
    type: "newsletter", lang: "en", free: true, stars: 5,
    tags: ["news", "daily"],
  },
  {
    id: 9,
    name: "Andrej Karpathy",
    description: "Former Tesla/OpenAI — deep dives into LLMs, neural nets from scratch",
    url: "https://youtube.com/@AndrejKarpathy",
    type: "video", lang: "en", free: true, stars: 5,
    tags: ["LLM", "technical", "learning"],
  },
  {
    id: 10,
    name: "Ben's Bites",
    description: "Daily news + tools + use cases — great for non-technical professionals",
    url: "https://bensbites.beehiiv.com",
    type: "newsletter", lang: "en", free: true, stars: 4,
    tags: ["news", "tools"],
  },
  {
    id: 11,
    name: "Huberman Lab (AI episode)",
    description: "Science of AI impacts on health, cognition, and work — occasional but deep",
    url: "https://youtube.com/@hubermanlab",
    type: "podcast", lang: "en", free: true, stars: 4,
    tags: ["science", "health", "cognition"],
  },
  {
    id: 12,
    name: "Simon Willison's Blog",
    description: "Hands-on practitioner writing on LLMs, agents, and AI tools",
    url: "https://simonwillison.net",
    type: "blog", lang: "en", free: true, stars: 5,
    tags: ["LLM", "agents", "technical"],
  },
];

const TYPE_CONFIG: Record<ResourceType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  video:      { label: "ویدئو",     icon: <Youtube size={13} />,   color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  newsletter: { label: "خبرنامه",   icon: <BookOpen size={13} />,  color: "#a5b4fc", bg: "rgba(165,180,252,0.12)" },
  podcast:    { label: "پادکست",    icon: <Mic size={13} />,       color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  blog:       { label: "مقاله",     icon: <Globe size={13} />,     color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
};

const TYPE_TABS = [
  { key: "all", label: "همه" },
  { key: "video", label: "ویدئو" },
  { key: "newsletter", label: "خبرنامه" },
  { key: "podcast", label: "پادکست" },
  { key: "blog", label: "مقاله" },
];

export default function SourcesPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | ResourceType>("all");
  const [langFilter, setLangFilter] = useState<"all" | Lang>("all");

  const filtered = RESOURCES.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (langFilter !== "all" && r.lang !== langFilter) return false;
    return true;
  });

  // Sort by stars desc
  filtered.sort((a, b) => b.stars - a.stars);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh", paddingBottom: 100,
        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(6,182,212,0.06), transparent 55%), #020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(2,3,6,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(6,182,212,0.10)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{
            width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
            background: "rgba(6,30,37,0.6)", border: "1px solid rgba(6,182,212,0.18)",
          }}>
            <ArrowRight size={15} color="#e8efea" />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>منابع یادگیری AI</div>
            <div style={{ fontSize: 10, color: "rgba(103,232,249,0.6)", marginTop: 1 }}>
              {RESOURCES.length} منبع کیوریت‌شده
            </div>
          </div>
          <Star size={16} color="rgba(103,232,249,0.5)" />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px" }}>

        {/* Type filter tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 10, scrollbarWidth: "none" }}>
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key as "all" | ResourceType)}
              style={{
                flexShrink: 0, padding: "5px 12px", borderRadius: 20,
                fontSize: 11.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                border: "1px solid",
                background: typeFilter === tab.key ? "rgba(6,182,212,0.18)" : "rgba(6,30,37,0.4)",
                borderColor: typeFilter === tab.key ? "rgba(6,182,212,0.4)" : "rgba(6,182,212,0.12)",
                color: typeFilter === tab.key ? "#67e8f9" : "rgba(232,239,234,0.5)",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lang filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[{ k: "all", l: "همه زبان‌ها" }, { k: "fa", l: "🇮🇷 فارسی" }, { k: "en", l: "🌐 English" }].map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setLangFilter(k as "all" | Lang)}
              style={{
                padding: "5px 12px", borderRadius: 20,
                fontSize: 11.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                border: "1px solid",
                background: langFilter === k ? "rgba(6,182,212,0.15)" : "rgba(6,30,37,0.4)",
                borderColor: langFilter === k ? "rgba(6,182,212,0.35)" : "rgba(6,182,212,0.12)",
                color: langFilter === k ? "#67e8f9" : "rgba(232,239,234,0.5)",
                transition: "all 0.15s",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Resources list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {filtered.map((r) => {
            const tc = TYPE_CONFIG[r.type];
            return (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "13px 14px", borderRadius: 16, textDecoration: "none",
                  background: "rgba(6,30,37,0.55)", border: "1px solid rgba(6,182,212,0.09)",
                  transition: "border-color 0.15s",
                }}
              >
                {/* Type icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: tc.bg, border: `1px solid ${tc.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: tc.color,
                }}>
                  {tc.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#e8efea" }}>{r.name}</span>
                    {r.lang === "fa" && (
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 6, background: "rgba(52,211,153,0.12)", color: "#34d399", fontWeight: 700 }}>FA</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,239,234,0.52)", lineHeight: 1.6, marginBottom: 5 }}>
                    {r.description}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 7,
                      background: tc.bg, color: tc.color,
                    }}>
                      {tc.label}
                    </span>
                    {r.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, padding: "2px 6px", borderRadius: 6,
                        background: "rgba(255,255,255,0.05)", color: "rgba(232,239,234,0.35)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ fontSize: 9, color: i < r.stars ? "#fbbf24" : "rgba(255,255,255,0.12)" }}>★</span>
                    ))}
                  </div>
                  {r.free && (
                    <span style={{ fontSize: 9, color: "rgba(52,211,153,0.7)", fontWeight: 700 }}>رایگان</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
