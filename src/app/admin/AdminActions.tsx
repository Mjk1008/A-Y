"use client";

import { useState } from "react";
import { RefreshCw, Newspaper, Database, CheckCircle, AlertCircle, Loader2, type LucideIcon } from "lucide-react";

type ActionState = "idle" | "loading" | "done" | "error";

function ActionButton({
  label,
  icon: Icon,
  desc,
  accent,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  desc: string;
  accent: string;
  onClick: () => Promise<string>;
}) {
  const [state, setState] = useState<ActionState>("idle");
  const [result, setResult] = useState<string>("");

  async function handleClick() {
    if (state === "loading") return;
    setState("loading");
    try {
      const msg = await onClick();
      setResult(msg);
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    } catch (e) {
      setResult(String(e));
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  const stateIcon =
    state === "loading" ? <Loader2 size={13} color={accent} style={{ animation: "spin 1s linear infinite" }} /> :
    state === "done"    ? <CheckCircle size={13} color="#34d399" /> :
    state === "error"   ? <AlertCircle size={13} color="#f87171" /> :
    <Icon size={13} color={accent} />;

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 14,
        background: `${accent}0d`,
        border: `1px solid ${accent}22`,
        cursor: state === "loading" ? "not-allowed" : "pointer",
        textAlign: "right",
        display: "flex", alignItems: "center", gap: 12,
        transition: "all 0.2s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: "grid", placeItems: "center",
      }}>
        {stateIcon}
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#e8efea" }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 2 }}>
          {state === "done" ? result || "✓ انجام شد" :
           state === "error" ? result || "خطا" :
           state === "loading" ? "در حال اجرا..." : desc}
        </div>
      </div>
    </button>
  );
}

export function AdminActions({ crawlSecret }: { crawlSecret?: string }) {
  async function runCrawler(): Promise<string> {
    const res = await fetch("/api/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(crawlSecret ? { Authorization: `Bearer ${crawlSecret}` } : {}),
      },
      body: JSON.stringify({ targets: ["jobs", "courses", "accounts", "tools"] }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "خطا");
    const parts = Object.entries(data.report || {}).map(([k, v]: [string, any]) => `${k}: ${v.count}`);
    return parts.join(" · ") || "انجام شد";
  }

  async function generateMagazine(): Promise<string> {
    const res = await fetch("/api/magazine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: crawlSecret }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "خطا");
    if (data.exists) return "مجله امروز قبلاً ساخته شده";
    return `مجله تولید شد: ${data.content?.headline?.slice(0, 40) || "✓"}`;
  }

  async function migrateDB(): Promise<string> {
    const res = await fetch("/api/crawl", {
      method: "GET",
    });
    const data = await res.json();
    return `jobs: ${data.jobs?.total ?? 0} · courses: ${data.courses?.total ?? 0} · tools: ${data.tools?.total ?? 0}`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ActionButton
        label="اجرای Crawler"
        icon={RefreshCw}
        desc="جمع‌آوری شغل، دوره، ابزار از سایت‌ها"
        accent="#34d399"
        onClick={runCrawler}
      />
      <ActionButton
        label="تولید مجله امروز"
        icon={Newspaper}
        desc="ساخت مجله روزانه AI با هوش مصنوعی"
        accent="#a5b4fc"
        onClick={generateMagazine}
      />
      <ActionButton
        label="آمار DB"
        icon={Database}
        desc="تعداد رکوردهای جدول‌های crawl"
        accent="#fbbf24"
        onClick={migrateDB}
      />
    </div>
  );
}
