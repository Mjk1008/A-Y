"use client";

/**
 * AIAccounts — affiliate store for AI tool subscriptions.
 * Checkout via ایرانی‌کارت / لایسنس مارکت / نامبرلند.
 */

import { Zap, Check, ShoppingCart, Shield } from "lucide-react";
import Reveal from "./Reveal";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  color: string;          /* bg gradient classes */
  textColor: string;      /* brand text color    */
  monogram: string;
  priceToman: string;
  features: string[];
  best: boolean;
}

const TOOLS: Tool[] = [
  {
    id: "claude",
    name: "Claude Pro",
    tagline: "هوش مصنوعی پیشرفته برای کار جدی",
    color: "from-orange-500/30 to-amber-600/20",
    textColor: "text-orange-300",
    monogram: "C",
    priceToman: "۳۲۰,۰۰۰",
    features: ["مکالمات نامحدود", "دسترسی به Opus", "آپلود فایل و PDF"],
    best: true,
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    tagline: "استاندارد صنعتی — همه چیز",
    color: "from-leaf-500/30 to-emerald-700/20",
    textColor: "text-leaf-300",
    monogram: "G",
    priceToman: "۳۰۰,۰۰۰",
    features: ["GPT-4o و o1", "تولید تصویر DALL·E", "Voice Mode"],
    best: false,
  },
  {
    id: "cursor",
    name: "Cursor Pro",
    tagline: "ویرایشگر کد با AI — دولوپر لازم",
    color: "from-brand-500/30 to-cyan-700/20",
    textColor: "text-brand-300",
    monogram: "⌘",
    priceToman: "۲۸۰,۰۰۰",
    features: ["Composer نامحدود", "Fast requests", "Codebase-aware"],
    best: false,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "بهترین تولیدکننده تصویر فعلی",
    color: "from-accent-500/30 to-violet-700/20",
    textColor: "text-accent-300",
    monogram: "M",
    priceToman: "۴۵۰,۰۰۰",
    features: ["۲۰۰ تصویر ماهانه", "v6.1 و Niji", "استایل سفارشی"],
    best: false,
  },
];

const PAYMENT_METHODS = [
  { label: "ایرانی‌کارت", color: "bg-red-500/15 border-red-500/30 text-red-300" },
  { label: "لایسنس مارکت", color: "bg-sky-500/15 border-sky-500/30 text-sky-300" },
  { label: "نامبرلند", color: "bg-amber-500/15 border-amber-500/30 text-amber-300" },
];

export default function AIAccounts() {
  return (
    <section className="relative overflow-hidden px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 mesh-gold opacity-60" />

      <div className="relative mx-auto max-w-md">
        <Reveal variant="up">
          <div className="mb-3 flex items-center gap-2">
            <span className="section-label">اکانت‌های AI</span>
            <Zap className="h-4 w-4 text-gold-400" />
          </div>
          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            بدون دردسر پرداخت بین‌المللی —
            <br />
            <span className="text-gradient-gold">با ریال بخر</span>
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-300">
            ما پیشنهاد می‌دیم کدوم اکانت‌ها با پروفایلت می‌خورن،
            بعد با یه کلیک از طریق پارتنرهامون می‌خری.
          </p>
        </Reveal>

        {/* Payment methods strip */}
        <Reveal variant="up" delay={100}>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-850/60 p-3 backdrop-blur-md">
            <Shield className="h-4 w-4 shrink-0 text-gold-400" />
            <span className="text-[11px] text-ink-400">پرداخت امن از:</span>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((p) => (
                <span key={p.label} className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${p.color}`}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Tools grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map((t, i) => (
            <Reveal key={t.id} variant="up" delay={i * 90}>
              <ToolCard tool={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article
      className={`glass group relative h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] ${
        tool.best ? "ring-1 ring-gold-500/30" : ""
      }`}
    >
      {tool.best && (
        <div className="absolute -top-px right-4 rounded-b-md bg-gradient-to-r from-gold-500 to-gold-400 px-2 py-0.5 text-[9px] font-bold text-ink-950">
          پیشنهاد ما
        </div>
      )}

      {/* Monogram tile */}
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-xl font-black ${tool.textColor}`}>
        {tool.monogram}
      </div>

      <h3 className="text-[15px] font-bold text-ink-100">{tool.name}</h3>
      <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-400">{tool.tagline}</p>

      <ul className="mt-3 space-y-1.5">
        {tool.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[12px] text-ink-300">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="pn text-xl font-black text-ink-50">{tool.priceToman}</span>
        <span className="text-[10.5px] text-ink-500">تومان / ماه</span>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold-400/30 bg-gold-500/10 py-2 text-[11.5px] font-semibold text-gold-300 transition hover:bg-gold-500/20">
        <ShoppingCart className="h-3 w-3" />
        خرید با ریال
      </button>
    </article>
  );
}
