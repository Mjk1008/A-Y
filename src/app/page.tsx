import Link from "next/link";
import {
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
  X,
} from "lucide-react";
import LandingHero from "./components/LandingHero";
import Reveal from "./components/Reveal";
import { MascotArt } from "./components/PixelMascot";
import { LandingPreview } from "./components/LandingPreview";
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
    <main className="relative" style={{ background: "#020306" }}>
      <Nav />
      <LandingHero />
      <StatTicker />
      <LandingPreview />
      <Problem />
      <Journey />
      <SocialProof />
      <WhatYouGet />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="fixed top-3 left-1/2 z-50 -translate-x-1/2">
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{
          height: 48,
          borderRadius: 999,
          background: "rgba(5,9,10,0.55)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          border: "1px solid rgba(110,231,183,0.14)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg text-[11px] font-black"
            style={{
              width: 24, height: 24,
              background: "linear-gradient(135deg, #34d399, #047857)",
              color: "#04110a",
              boxShadow: "0 0 16px rgba(16,185,129,0.6)",
            }}
          >
            AY
          </div>
          <span className="text-[14px] font-extrabold tracking-tight" style={{ color: "#e8efea" }}>ای‌وای</span>
        </Link>
        <div className="h-4 w-px" style={{ background: "rgba(110,231,183,0.18)" }} />
        <Link href="#how" className="text-[12px] font-medium transition hover:opacity-100" style={{ color: "rgba(232,239,234,0.7)" }}>
          مسیر
        </Link>
        <Link href="#pricing" className="text-[12px] font-medium transition hover:opacity-100" style={{ color: "rgba(232,239,234,0.7)" }}>
          قیمت
        </Link>
        <Link href="/login" className="text-[12px] font-medium transition hover:opacity-100" style={{ color: "rgba(232,239,234,0.7)" }}>
          ورود
        </Link>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════
   STAT TICKER
═══════════════════════════════════════════════════════ */
function StatTicker() {
  const stats = [
    "۸۵٪ مشاغل تا ۲۰۳۰ تغییر می‌کنن",
    "هر هفته ۱۲+ ابزار جدید AI منتشر می‌شه",
    "۶۶٪ کارفرماها مهارت AI می‌خوان",
    "کسایی که AI بلدن ۲× سریع‌تر کار می‌کنن",
    "۴۴٪ از کارهای روزانه قابل خودکارسازیه",
    "بهترین وقت برای یادگیری: همین الانه",
  ];
  const dup = [...stats, ...stats];
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900/15 py-4 backdrop-blur-sm">
      <div className="relative" style={{ zIndex: 0 }} dir="ltr">
        <div className="marquee-track">
          {dup.map((s, i) => (
            <div key={i} dir="rtl" className="flex items-center gap-3 whitespace-nowrap text-[12.5px] text-ink-100">
              <TrendingUp className="h-3 w-3 shrink-0 text-leaf-300" />
              <span>{s}</span>
              <span className="text-leaf-500/35">◆</span>
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(11,11,20,0.8) 0%, transparent 12%, transparent 88%, rgba(11,11,20,0.8) 100%)",
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
      head: "دنیا داره عوض می‌شه",
      bullets: [
        "هر روز ابزار جدیدی میاد — نمی‌دونی کدوم رو یاد بگیری",
        "رقیبات دارن سریع‌تر کار می‌کنن",
        "کارفرماها «آشنا با AI» می‌خوان ولی معلوم نیست یعنی چی",
      ],
    },
    {
      num: "۰۲",
      head: "گم می‌شی — طبیعیه",
      bullets: [
        "ChatGPT، Claude، Gemini، Midjourney، Cursor، Perplexity…",
        "هر کدوم برای یه کار خاص ساخته شدن",
        "وقت نداری ۵۰ ابزار رو تست کنی تا بفهمی کدوم به دردت می‌خوره",
      ],
    },
    {
      num: "۰۳",
      head: "ما مسیرتو روشن می‌کنیم",
      bullets: [
        "پروفایلت رو می‌خونیم — شغل، مهارت، تجربه",
        "دقیقاً می‌گیم کدوم ابزارها برای کار خودت مفیدن",
        "با مثال واقعی از وظایف روزمره‌ات",
      ],
    },
  ];

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">چرا الان</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            از AI نترس —
            <br />
            <span className="text-ink-400">فقط باید بدونی کجا نگاه کنی</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => (
            <Reveal key={item.num} variant="up" delay={i * 90}>
              <article className="glass p-6">
                <header className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-base font-bold text-ink-50">{item.head}</h3>
                  <span className="font-mono text-xs text-brand-300/80">{item.num}</span>
                </header>
                <ul className="space-y-2.5">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink-200">
                      <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-leaf-400" />
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
const JOURNEY_STEPS = [
  { n: "۰۱", title: "معرفی کن", desc: "شغل، صنعت، تجربه، چند تا مهارت. فقط ۳۰ ثانیه.", state: "wave" as const, meta: "~۳۰ ثانیه" },
  { n: "۰۲", title: "تحلیل می‌شه", desc: "موتور ما ابزارهای AI مرتبط با شغلت رو فیلتر می‌کنه.", state: "sparkle" as const, meta: "~۴۵ ثانیه" },
  { n: "۰۳", title: "شروع کن", desc: "یه نقشه‌راه ۴ هفته‌ای، دوره‌های فارسی، شغل‌های پیشنهادی.", state: "bounce" as const, meta: "آماده!" },
];

function Journey() {
  return (
    <section id="how" className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">چطور کار می‌کنه</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            سه قدم تا نقشهٔ
            <br />
            <span className="text-gradient-lux">مسیر شخصی</span>
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {JOURNEY_STEPS.map((s, i) => (
            <Reveal key={s.n} variant="slide-left" delay={i * 120}>
              <div
                style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  padding: 16,
                  background: "linear-gradient(180deg, rgba(31,46,40,0.5) 0%, rgba(18,30,24,0.4) 100%)",
                  border: "1px solid rgba(110,231,183,0.12)",
                  borderRadius: 18,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(110,231,183,0.22)",
                  display: "grid", placeItems: "center",
                  overflow: "hidden",
                }}>
                  <MascotArt state={s.state} frame={i * 2} blink={false} scale={2} accent="#34d399" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span className="font-mono text-[11px] font-bold" style={{ color: "rgba(110,231,183,0.7)" }}>{s.n}</span>
                    <span className="text-[15px] font-extrabold text-ink-50">{s.title}</span>
                    <span className="text-[11px] text-ink-500 mr-auto">{s.meta}</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-ink-300">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SOCIAL PROOF
═══════════════════════════════════════════════════════ */
function SocialProof() {
  return (
    <section className="relative px-5 pb-16">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <div
            style={{
              padding: 20, borderRadius: 20,
              background: "linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(18,30,24,0.5) 100%)",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
              <div style={{
                padding: "4px 10px", borderRadius: 999,
                background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.35)",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.5,
                color: "#fcd34d", fontWeight: 700,
              }}>
                ۱۲٫۴ هزار کاربر فعال
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#fcd34d", fontWeight: 700 }}>★ ۴٫۸</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#e8efea" }} dir="rtl">
              «توی یه هفته از صفر با Claude بریف نوشتم، با v0 لندینگ ساختم. ای‌وای منو از{" "}
              <strong style={{ color: "#fcd34d" }}>ترس AI</strong> دراورد.»
            </p>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }} dir="rtl">
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                display: "grid", placeItems: "center",
                fontWeight: 900, fontSize: 13, color: "#451a03",
              }}>ن</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: "#e8efea" }}>نگار رفیعی</div>
                <div style={{ fontSize: 10.5, color: "rgba(232,239,234,0.5)" }}>طراح محصول · اسنپ</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   WHAT YOU GET
═══════════════════════════════════════════════════════ */
function WhatYouGet() {
  const cards = [
    { icon: Brain,         t: "تحلیل شخصی",       d: "مخصوص شغل، صنعت و مهارت‌های دقیق خودت." },
    { icon: Route,         t: "نقشه راه ۴ هفته‌ای", d: "هفته به هفته می‌دونی دقیقاً چیکار کنی." },
    { icon: Compass,       t: "مسیریاب (چت‌بات)",   d: "سوال بپرس — پروفایلت رو می‌شناسه." },
    { icon: Briefcase,     t: "شغل‌های مناسب",       d: "پوزیشن‌هایی که با پروفایلت مچ می‌خورن." },
    { icon: GraduationCap, t: "دوره‌های منتخب",     d: "بهترین دوره‌های ایرانی بر اساس سطح خودت." },
    { icon: Shield,        t: "صادقانه و عملی",     d: "بدون وعده‌های توخالی. فقط راهکار واقعی." },
  ];

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">داخل اپ</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            یه اپ —
            <br />
            <span className="text-gradient">همه‌چیزی که برای رشد لازم داری</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {cards.map((c, i) => (
            <Reveal key={c.t} variant="up" delay={i * 60}>
              <article className="glass h-full p-4 transition-transform duration-500 hover:-translate-y-0.5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-leaf-500/25 bg-leaf-500/8">
                  <c.icon className="h-[16px] w-[16px] text-leaf-300" />
                </div>
                <h3 className="mb-1 text-[13px] font-bold text-ink-50">{c.t}</h3>
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
   PRICING
═══════════════════════════════════════════════════════ */

const MATRIX_ROWS: {
  label: string;
  field: Parameters<typeof describeLimit>[0];
}[] = [
  { label: "تحلیل هفتگی",      field: "analysesPerWeek"      },
  { label: "نقشه راه",          field: "roadmapsPerMonth"     },
  { label: "شغل‌های مچ",         field: "matchedJobsVisible"   },
  { label: "آپدیت شغل",         field: "jobMatchFrequency"    },
  { label: "مسیریاب AI",        field: "chatMessagesPerMonth" },
  { label: "پشتیبانی",          field: "support"              },
];

function Pricing() {
  const freePlan = PLANS.find((p) => p.id === "free")!;
  const proPlan  = PLANS.find((p) => p.id === "pro")!;
  const maxPlan  = PLANS.find((p) => p.id === "max")!;

  return (
    <section id="pricing" className="relative px-5 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="up">
          <span className="section-label">پلن‌ها</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink-50">
            به اندازه هدفت —
            <br />
            <span className="text-gradient">هر وقت خواستی تغییر بده</span>
          </h2>
          <p className="mt-4 text-[13.5px] leading-relaxed text-ink-400">
            رایگان شروع کن. هر وقت آماده شدی ارتقا بده. هیچ قراردادی نیست.
          </p>
        </Reveal>

        {/* Plan cards */}
        <div className="mt-10 space-y-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} variant="up" delay={i * 90}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        {/* Comparison matrix */}
        <Reveal variant="up" delay={300}>
          <div className="glass mt-6 overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <span className="text-[10.5px] uppercase tracking-[0.3em] text-ink-500">
                مقایسه کامل
              </span>
            </div>

            <div
              className="grid items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 text-[11px] font-semibold"
              style={{ gridTemplateColumns: "1.4fr 0.7fr 0.9fr 1.1fr" }}
            >
              <span className="text-ink-500">ویژگی</span>
              <span className="text-center text-ink-400">رایگان</span>
              <span className="text-center text-brand-300">پرو</span>
              <span className="text-center text-gold-300">مکس</span>
            </div>

            {MATRIX_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid items-center gap-2 px-4 py-2.5 text-[12px] ${
                  i !== MATRIX_ROWS.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
                style={{ gridTemplateColumns: "1.4fr 0.7fr 0.9fr 1.1fr" }}
              >
                <span className="text-ink-300">{row.label}</span>
                <MatrixCell value={describeLimit(row.field, freePlan)} tone="ink"   />
                <MatrixCell value={describeLimit(row.field, proPlan)}  tone="brand" />
                <MatrixCell value={describeLimit(row.field, maxPlan)}  tone="gold"  />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="up" delay={400}>
          <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-600">
            قیمت‌ها به تومان · پلن ماهانه هر زمان قابل لغو · پلن سالانه ۴۴٪ ارزان‌تر
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const accent = {
    ink: {
      border:   "border-white/[0.07]",
      title:    "text-ink-300",
      bg:       "",
      price:    "text-ink-50",
      chip:     "bg-ink-700/50 text-ink-300 border-white/[0.06]",
      button:   "btn-ghost",
      check:    "text-ink-500",
      highlight: "text-ink-200",
    },
    brand: {
      border:   "border-brand-500/30",
      title:    "text-brand-300",
      bg:       "linear-gradient(160deg, rgba(6,182,212,0.09) 0%, rgba(21,21,31,0.5) 70%)",
      price:    "text-ink-50",
      chip:     "bg-brand-500/12 text-brand-200 border-brand-500/20",
      button:   "btn-primary",
      check:    "text-brand-300",
      highlight: "text-ink-100",
    },
    gold: {
      border:   "border-gold-500/30",
      title:    "text-gold-300",
      bg:       "linear-gradient(160deg, rgba(245,158,11,0.09) 0%, rgba(21,21,31,0.5) 70%)",
      price:    "text-ink-50",
      chip:     "bg-gold-500/12 text-gold-200 border-gold-500/25",
      button:   "btn-gold",
      check:    "text-gold-300",
      highlight: "text-ink-100",
    },
  }[plan.accent as PlanAccent];

  const { amount, unit } = formatPrice(plan);
  const monthlyEquiv = formatMonthlyEquivalent(plan);
  const isYearly = plan.billingCycle === "yearly";
  const isMonthly = plan.billingCycle === "monthly";

  return (
    <article
      className={`glass relative overflow-hidden p-6 ${accent.border}`}
      style={accent.bg ? { background: accent.bg } : undefined}
    >
      {plan.recommended && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-1 text-[10px] font-bold text-white shadow-lg shadow-brand-500/25">
          پیشنهاد ما
        </div>
      )}
      {plan.accent === "gold" && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 text-gold-300">
          <Crown className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">بهترین ارزش</span>
        </div>
      )}

      <header className={plan.accent === "gold" ? "mt-3" : ""}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${accent.title}`}>
            {plan.displayName}
          </span>
          {isYearly && (
            <span className="rounded-md bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-bold text-gold-300">
              سالانه · ۴۴٪ تخفیف
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5">
          {plan.priceToman === 0 ? (
            <span className={`text-3xl font-black ${accent.price}`}>رایگان</span>
          ) : (
            <>
              <span className={`pn text-4xl font-black ${accent.price}`}>{amount}</span>
              <span className="text-[11px] text-ink-500">{unit}</span>
              {isMonthly && <span className="text-[11px] text-ink-600">/ ماه</span>}
              {isYearly && <span className="text-[11px] text-ink-600">/ سال</span>}
            </>
          )}
        </div>
        {monthlyEquiv && (
          <p className="pn mt-1 text-[10.5px] text-ink-500">{monthlyEquiv}</p>
        )}
        <p className="mt-1 text-[12px] text-ink-500">{plan.tagline}</p>
      </header>

      {/* Highlights — 3 key features */}
      <ul className="mt-5 space-y-2.5">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2.5 text-[13px]">
            <Check className={`h-3.5 w-3.5 shrink-0 ${accent.check}`} />
            <span className={accent.highlight}>{h}</span>
          </li>
        ))}
        {plan.id === "free" && (
          <li className="flex items-center gap-2.5 text-[13px]">
            <X className="h-3.5 w-3.5 shrink-0 text-ink-700" />
            <span className="text-ink-600 line-through">مسیریاب AI</span>
          </li>
        )}
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
      ? "text-ink-500"
      : tone === "brand"
      ? "text-brand-200"
      : "text-gold-200";

  if (isDash) {
    return <span className="block text-center text-ink-700">—</span>;
  }
  return (
    <span className={`block text-center text-[11.5px] font-medium ${toneCls}`}>
      {value}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section
      className="relative px-5 py-16"
      style={{ borderTop: "1px solid rgba(110,231,183,0.08)" }}
    >
      <div className="mx-auto max-w-md text-center">
        <Reveal variant="scale">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <MascotArt state="sparkle" frame={0} blink={false} scale={3} accent="#34d399" />
          </div>
          <h2 className="text-4xl font-black leading-[1.05] tracking-tighter text-ink-50">
            آماده‌ای شروع کنی؟
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-[13px] leading-relaxed text-ink-400">
            تحلیل اولیه‌ات رایگانه — ۳ دقیقه وقت می‌بره.
          </p>
          <Link href="/signup" className="btn-lux mt-6 inline-flex">
            شروع کن — رایگان
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] text-ink-600">
            بدون نیاز به کارت اعتباری · هر وقت خواستی لغو کن
          </p>
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
    <footer className="relative border-t border-white/[0.05] bg-ink-950/30 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-lg text-[13px] font-black"
            style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #34d399, #047857)",
              color: "#04110a",
              boxShadow: "0 0 18px rgba(16,185,129,0.5)",
            }}
          >
            AY
          </div>
          <div>
            <div className="text-[14px] font-extrabold" style={{ color: "#e8efea" }}>ای‌وای</div>
            <div className="font-mono text-[10px] tracking-[0.1em]" style={{ color: "rgba(110,231,183,0.6)" }}>A-Y / v۰.۹</div>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-[11px] text-ink-600">
          <Link href="/login" className="transition hover:text-ink-400">ورود</Link>
          <span>·</span>
          <Link href="#pricing" className="transition hover:text-ink-400">پلن‌ها</Link>
          <span>·</span>
          <Link href="#how" className="transition hover:text-ink-400">چطور کار می‌کنه</Link>
        </div>
        <p className="text-[11px] text-ink-700">
          ساخته‌شده برای کسایی که نمی‌خوان عقب بمونن · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
