import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowLeft,
  Check,
  Brain,
  Shield,
  Route,
  TrendingUp,
  Compass,
  Briefcase,
  GraduationCap,
  Crown,
} from "lucide-react";
import VideoHero from "./components/VideoHero";
import Reveal from "./components/Reveal";
import RoboScene from "./components/RoboScene";
import {
  PLANS,
  type Plan,
  type PlanAccent,
  formatPrice,
  formatMonthlyEquivalent,
  describeLimit,
} from "./config/plans";

export default function Home() {
  return (
    <>
      {/* Global HTML/CSS ambient scene — dark emerald-black space with
          pixel drift, flash lines, and scroll-driven camera parallax.
          Position: fixed, so it stays centered behind every section. */}
      <RoboScene />

      <main className="relative" style={{ zIndex: 10 }}>
        <Nav />
        <VideoHero />
        <StatTicker />
        <Problem />
        <Journey />
        <WhatYouGet />
        <Pricing />
        <FinalCta />
        <Footer />
      </main>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   NAV — floating glass pill
═══════════════════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2">
      <div className="glass-strong flex items-center justify-between gap-3 px-3 py-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative inline-flex overflow-hidden rounded-xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 to-transparent p-0.5">
            <Image
              src="/ay-logo.png"
              alt="A-Y"
              width={30}
              height={30}
              className="h-6 w-auto rounded-lg"
              priority
            />
          </span>
          <span className="text-[11px] uppercase tracking-[0.35em] text-ink-300">A · Y</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-xs text-ink-300 transition hover:text-ink-50"
          >
            ورود
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_4px_16px_-4px_rgba(6,182,212,0.55)] transition hover:bg-brand-400"
          >
            شروع رایگان
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════
   STAT TICKER — infinite marquee of FOMO stats
═══════════════════════════════════════════════════════ */
function StatTicker() {
  const stats = [
    "۸۵٪ مشاغل تا ۲۰۳۰ با AI تغییر می‌کنن",
    "۳۰۰ میلیون موقعیت شغلی در معرض اتوماسیون",
    "۴۴٪ از کارهای روزانه قابل خودکارسازیه",
    "۶۶٪ کارفرماها دنبال مهارت AI هستن",
    "۲.۶ تریلیون دلار ارزش اقتصادی AI تا ۲۰۳۰",
    "۲× سریع‌تر: میانگین کسایی که AI بلدن",
  ];
  const dup = [...stats, ...stats];
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900/15 py-5 backdrop-blur-sm">
      <div className="relative" style={{ zIndex: 0 }} dir="ltr">
        <div className="marquee-track">
          {dup.map((s, i) => (
            <div key={i} dir="rtl" className="flex items-center gap-3 whitespace-nowrap text-[13px] text-ink-100">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-brand-300" />
              <span>{s}</span>
              <span className="text-brand-500/40">◆</span>
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(11,11,20,0.75) 0%, transparent 12%, transparent 88%, rgba(11,11,20,0.75) 100%)",
          zIndex: 1,
        }}
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   PROBLEM
═══════════════════════════════════════════════════════ */
function Problem() {
  const items = [
    {
      num: "۰۱",
      head: "موج داره میاد",
      bullets: [
        "هر روز یه ابزار جدید میاد بیرون",
        "رقیبات دارن سریع‌تر یاد می‌گیرن",
        "کارفرماها دنبال «آشنا با AI» هستن",
      ],
    },
    {
      num: "۰۲",
      head: "گیج‌کننده‌ست — می‌دونیم",
      bullets: [
        "ChatGPT، Claude، Gemini، Midjourney، Cursor…",
        "هر کدوم برای یه کار خاص خوبن",
        "وقت نداری همه رو تست کنی",
      ],
    },
    {
      num: "۰۳",
      head: "ما مسیرت رو روشن می‌کنیم",
      bullets: [
        "فقط ابزارهایی که به درد کار خودت می‌خورن",
        "با مثال واقعی از تسک‌های روزمره‌ات",
        "بدون حرف کلی — قدم‌به‌قدم",
      ],
    },
  ];

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">چرا الان</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            ترس از AI واقعیه
            <br />
            <span className="text-ink-400">ولی راه‌حلش نشستن نیست</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => (
            <Reveal key={item.num} variant="up" delay={i * 90}>
              <article className="glass p-6">
                <header className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-lg font-bold text-ink-50">{item.head}</h3>
                  <span className="pn font-mono text-xs text-brand-300/80">{item.num}</span>
                </header>
                <ul className="space-y-2.5">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-200">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   JOURNEY — 3-step path
═══════════════════════════════════════════════════════ */
function Journey() {
  const steps = [
    {
      n: "۱",
      icon: Brain,
      t: "خودتو معرفی کن",
      d: "شغل، مهارت و سطحت رو بگو. رزومه هم می‌تونی آپلود کنی.",
      meta: "۳۰ ثانیه",
    },
    {
      n: "۲",
      icon: Sparkles,
      t: "تحلیل هوشمند",
      d: "پروفایلت رو می‌خونیم، ریسک‌ها و فرصت‌های دقیق کارت رو می‌گیم.",
      meta: "۴۵ ثانیه",
    },
    {
      n: "۳",
      icon: Route,
      t: "نقشه راه شخصی",
      d: "لیست ابزارها + مثال واقعی + برنامه هفتگی. امشب شروع کن.",
      meta: "آماده",
    },
  ];

  return (
    <section id="how" className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">مسیرت</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            سه قدم —
            <br />
            <span className="text-gradient">بعدش می‌دونی چیکار کنی</span>
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute right-[22px] top-4 bottom-4 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(34,211,238,0.5) 0%, rgba(167,139,250,0.35) 50%, rgba(52,211,153,0) 100%)",
            }}
          />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} variant="slide-left" delay={i * 140}>
                <div className="relative pr-16">
                  <div className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-brand-500/15 animate-pulse-soft" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-500/50 bg-ink-900/80 backdrop-blur">
                      <s.icon className="h-[18px] w-[18px] text-brand-300" />
                    </div>
                  </div>

                  <div className="glass p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-300">
                        قدم {s.n}
                      </span>
                      <span className="text-[11px] text-ink-400">{s.meta}</span>
                    </div>
                    <h3 className="mb-1.5 text-base font-bold text-ink-50">{s.t}</h3>
                    <p className="text-[13.5px] leading-relaxed text-ink-300">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   WHAT YOU GET — 6 quick capability tiles
═══════════════════════════════════════════════════════ */
function WhatYouGet() {
  const cards = [
    { icon: Brain,         t: "تحلیل شخصی",      d: "مخصوص شغل و مهارت‌های خودت." },
    { icon: Route,         t: "رودمپ یادگیری",   d: "هفته‌ به هفته می‌دونی چی کار کنی." },
    { icon: Compass,       t: "مسیریاب",          d: "چت‌باتی که پروفایلت رو یادشه." },
    { icon: Briefcase,     t: "شغل‌های مچ",        d: "پوزیشن‌های مناسب پروفایلت." },
    { icon: GraduationCap, t: "دوره‌های منتخب",   d: "بهترین دوره‌های ایرانی بر اساس سطحت." },
    { icon: Shield,        t: "صاف و صادق",       d: "بدون وعده‌ی توخالی. فقط راهکار عملی." },
  ];

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">داخل اپ</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            یه اپ —
            <br />
            <span className="text-gradient">همه‌چیزی که لازم داری</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {cards.map((c, i) => (
            <Reveal key={c.t} variant="up" delay={i * 60}>
              <article className="glass h-full p-4 transition-transform duration-500 hover:-translate-y-0.5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10">
                  <c.icon className="h-[16px] w-[16px] text-brand-300" />
                </div>
                <h3 className="mb-1 text-[13.5px] font-bold text-ink-50">{c.t}</h3>
                <p className="text-[12px] leading-relaxed text-ink-300">{c.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   PRICING — data driven from `config/plans.ts`
   To change prices/limits: edit ONLY that config file.
═══════════════════════════════════════════════════════ */

/* Matrix rows: which feature of each plan to render, with a display label. */
const MATRIX_ROWS: {
  label: string;
  /* key into PlanLimits — or a tuple of keys to combine */
  field: Parameters<typeof describeLimit>[0];
}[] = [
  { label: "تحلیل هفتگی",      field: "analysesPerWeek"      },
  { label: "رودمپ یادگیری",     field: "roadmapsPerMonth"     },
  { label: "شغل‌های مچ",         field: "matchedJobsVisible"   },
  { label: "آپدیت شغل",         field: "jobMatchFrequency"    },
  { label: "مسیریاب (چت‌بات)",  field: "chatMessagesPerMonth" },
  { label: "حافظه چت",          field: "chatContextTokens"    },
  { label: "طول پاسخ چت",       field: "chatOutputTokens"     },
  { label: "پشتیبانی",          field: "support"              },
];

function Pricing() {
  const freePlan = PLANS.find((p) => p.id === "free")!;
  const proPlan  = PLANS.find((p) => p.id === "pro")!;
  const maxPlan  = PLANS.find((p) => p.id === "max")!;

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">پلن‌ها</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            سه پلن —
            <br />
            <span className="text-gradient">به اندازه‌ی هدفت</span>
          </h2>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink-300">
            رایگان شروع کن. هر وقت خواستی ارتقا بده. هر وقت خواستی لغو کن.
          </p>
        </Reveal>

        {/* 3 plan cards — stacked */}
        <div className="mt-10 space-y-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} variant="up" delay={i * 90}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        {/* Comparison matrix — all values derived from plans.ts */}
        <Reveal variant="up" delay={300}>
          <div className="glass mt-6 overflow-hidden p-0">
            <div className="border-b border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-ink-400">
              مقایسه دقیق
            </div>

            <div
              className="grid items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 text-[11px] font-semibold"
              style={{ gridTemplateColumns: "1.3fr 0.8fr 1fr 1.1fr" }}
            >
              <span className="text-ink-400">ویژگی</span>
              <span className="text-center text-ink-300">رایگان</span>
              <span className="text-center text-brand-300">پرو</span>
              <span className="text-center text-gold-300">مکس</span>
            </div>

            {MATRIX_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid items-center gap-2 px-4 py-2.5 text-[12px] ${
                  i !== MATRIX_ROWS.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
                style={{ gridTemplateColumns: "1.3fr 0.8fr 1fr 1.1fr" }}
              >
                <span className="text-ink-200">{row.label}</span>
                <MatrixCell value={describeLimit(row.field, freePlan)} tone="ink"   />
                <MatrixCell value={describeLimit(row.field, proPlan)}  tone="brand" />
                <MatrixCell value={describeLimit(row.field, maxPlan)}  tone="gold"  />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="up" delay={400}>
          <div className="mt-5 space-y-1.5 text-center text-[11px] leading-relaxed text-ink-500">
            <p>قیمت‌ها به تومان · پلن ماهانه هر زمان قابل لغو · پلن سالانه با ~۲۹٪ تخفیف</p>
            <p className="text-ink-600">
              سقف‌های پیام و توکن برای پایداری سرویس‌ند. نیاز بیشتر داشتی؟ بگو، باهم حلش می‌کنیم.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const accent = {
    ink: {
      border:   "border-white/[0.08]",
      title:    "text-ink-200",
      bg:       "",
      price:    "text-ink-50",
      chip:     "bg-ink-700/40 text-ink-300 border-white/[0.05]",
      button:   "btn-ghost",
      check:    "text-ink-400",
    },
    brand: {
      border:   "border-brand-500/30",
      title:    "text-brand-300",
      bg:       "linear-gradient(180deg, rgba(6,182,212,0.10) 0%, rgba(21,21,31,0.55) 80%)",
      price:    "text-ink-50",
      chip:     "bg-brand-500/12 text-brand-200 border-brand-500/25",
      button:   "btn-primary",
      check:    "text-brand-300",
    },
    gold: {
      border:   "border-gold-500/35",
      title:    "text-gold-300",
      bg:       "linear-gradient(180deg, rgba(245,158,11,0.10) 0%, rgba(21,21,31,0.55) 80%)",
      price:    "text-ink-50",
      chip:     "bg-gold-500/12 text-gold-200 border-gold-500/30",
      button:   "btn-gold",
      check:    "text-gold-300",
    },
  }[plan.accent as PlanAccent];

  const { amount, unit } = formatPrice(plan);
  const monthlyEquiv = formatMonthlyEquivalent(plan);
  const isYearly = plan.billingCycle === "yearly";
  const isMonthly = plan.billingCycle === "monthly";

  /* Feature rows rendered from the limits object so it stays in sync. */
  const featureRows: { label: string; value: string | false }[] = [
    { label: "تحلیل پروفایل",     value: describeLimit("analysesPerWeek",      plan) },
    { label: "رودمپ یادگیری",      value: describeLimit("roadmapsPerMonth",     plan) },
    { label: "شغل‌های مچ",           value: describeLimit("matchedJobsVisible",   plan) },
    {
      label: "مسیریاب (چت‌بات)",
      value: plan.limits.chatMessagesPerMonth === 0
        ? false
        : describeLimit("chatMessagesPerMonth", plan),
    },
    { label: "پشتیبانی",            value: describeLimit("support",              plan) },
  ];

  return (
    <article
      className={`glass relative overflow-hidden p-6 ${accent.border}`}
      style={accent.bg ? { background: accent.bg } : undefined}
    >
      {plan.recommended && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-brand-500/30">
          پیشنهاد ما
        </div>
      )}
      {plan.accent === "gold" && (
        <div className="absolute left-4 top-4 flex items-center gap-1 text-gold-300">
          <Crown className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">برترین</span>
        </div>
      )}

      <header className={plan.accent === "gold" ? "mt-2" : ""}>
        <div className="flex items-center gap-2">
          <div className={`text-xs font-semibold uppercase tracking-wider ${accent.title}`}>
            {plan.displayName}
          </div>
          {isYearly && (
            <span className="rounded-md bg-gold-500/20 px-1.5 py-0.5 text-[9.5px] font-bold text-gold-300">
              سالانه
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`pn text-4xl font-black ${accent.price}`}>{amount}</span>
          <span className="text-[11px] text-ink-400">{unit}</span>
          {isMonthly && <span className="text-[11px] text-ink-500">/ ماهانه</span>}
        </div>
        {monthlyEquiv && (
          <div className="pn mt-1 text-[10.5px] text-ink-400">{monthlyEquiv}</div>
        )}
        <p className="mt-1 text-[11.5px] text-ink-400">{plan.tagline}</p>
      </header>

      <ul className="mt-5 space-y-2.5 text-[13px]">
        {featureRows.map((f) => (
          <li key={f.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink-200">
              {f.value === false ? (
                <LockTiny />
              ) : (
                <Check className={`h-3.5 w-3.5 shrink-0 ${accent.check}`} />
              )}
              <span className={f.value === false ? "text-ink-500 line-through decoration-ink-700" : ""}>
                {f.label}
              </span>
            </span>
            {typeof f.value === "string" && f.value !== "—" && (
              <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${accent.chip}`}>
                {f.value}
              </span>
            )}
          </li>
        ))}
      </ul>

      <Link href={plan.ctaHref} className={`${accent.button} mt-6 w-full justify-center`}>
        {plan.ctaLabel}
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </article>
  );
}

function MatrixCell({
  value,
  tone,
}: {
  value: string;
  tone: "ink" | "brand" | "gold";
}) {
  const isDash = value === "—";
  const toneCls =
    tone === "ink"
      ? "text-ink-400"
      : tone === "brand"
      ? "text-brand-200"
      : "text-gold-200";

  if (isDash) {
    return <span className="text-center text-ink-600">—</span>;
  }
  return (
    <span className={`text-center text-[11.5px] font-semibold ${toneCls}`}>
      {value}
    </span>
  );
}

function LockTiny() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="h-3.5 w-3.5 shrink-0 text-ink-600">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section className="relative px-5 py-28">
      <div className="mx-auto max-w-md text-center">
        <Reveal variant="scale">
          <h2 className="text-5xl font-black leading-[1.05] tracking-tighter text-ink-50 sm:text-6xl">
            همین امشب
            <br />
            <span className="text-gradient">شروع کن</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xs text-[14px] leading-relaxed text-ink-300">
            کمتر از ۱ دقیقه. یه نقشه راه دقیق. از فردا صبح یه چیزی می‌دونی
            که بقیه هنوز نمی‌دونن.
          </p>
          <Link href="/signup" className="btn-primary mt-8 inline-flex">
            تحلیل رایگان من
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950/30 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative inline-flex overflow-hidden rounded-xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 to-transparent p-0.5">
            <Image src="/ay-logo.png" alt="A-Y" width={28} height={28} className="h-6 w-auto rounded-lg" />
          </span>
          <span className="text-[11px] uppercase tracking-[0.35em] text-ink-300">A · Y</span>
        </Link>
        <p className="text-[11px] text-ink-400">
          {new Date().getFullYear()} — برای کسایی ساخته شده که نمی‌خوان عقب بمونن
        </p>
      </div>
    </footer>
  );
}
