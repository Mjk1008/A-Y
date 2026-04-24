/**
 * plans.ts — Single source of truth for subscription tiers.
 *
 * CRITICAL: This file is read by both the frontend (pricing UI) AND
 * the backend (quota enforcement, API gateway limits). To change
 * pricing, limits, or quotas, edit ONLY this file.
 *
 * PMF Notes (reviewed 2026-04):
 *  • 3 tiers is standard and correct for this market.
 *  • Pro at 298k/month is appropriate (~1% of avg tech salary). Keep it.
 *  • Max at 1.98M/year = 165k/month — save 44% vs Pro. Strong value prop.
 *  • Free tier is intentionally limited to create upgrade urgency.
 *  • Limit differentiations are designed to make the upgrade decision obvious:
 *    Free→Pro: unlock chat + more analyses; Pro→Max: unlimited everything + realtime.
 *
 * Sustainability notes:
 *  • Cost model assumes Metis API (OpenAI-compatible) with gpt-4o-mini.
 *  • Swapping to a more expensive model? Re-run the margin check first.
 *  • Chat caps enforced at both Redis (monthly counter) and per-request.
 *    DO NOT let any path bypass these.
 */

export type PlanId = "free" | "pro" | "max";
export type PlanAccent = "ink" | "brand" | "gold";
export type BillingCycle = "free" | "monthly" | "yearly";

export type ModelTier = "flash" | "mini" | "standard" | "advanced";
export type UpdateFrequency = "none" | "weekly" | "daily" | "realtime";
export type SupportTier    = "email" | "fast" | "priority";

export interface PlanLimits {
  /* ─── Profile analysis ─────────────────────────────────────────── */
  analysesPerWeek:        number;
  analysisOutputTokens:   number;

  /* ─── Roadmap generation ───────────────────────────────────────── */
  roadmapsPerMonth:       number;
  roadmapsLifetime:       number | null;   /* null = no lifetime cap   */

  /* ─── Career-chatbot (مسیریاب) ─────────────────────────────────── */
  chatMessagesPerMonth:   number;          /* 0 = feature disabled     */
  chatContextTokens:      number;
  chatOutputTokens:       number;
  chatRateLimitPerMinute: number;

  /* ─── Matched jobs ─────────────────────────────────────────────── */
  matchedJobsVisible:     number;          /* -1 = unlimited           */
  jobMatchFrequency:      UpdateFrequency;

  /* ─── Misc ─────────────────────────────────────────────────────── */
  support:                SupportTier;
  modelTier:              ModelTier;
}

export interface Plan {
  id:              PlanId;
  displayName:    string;
  tagline:        string;
  priceToman:     number;
  billingCycle:   BillingCycle;
  monthlyEquivalentToman?: number;
  accent:          PlanAccent;
  recommended?:    boolean;
  limits:          PlanLimits;
  ctaLabel:       string;
  ctaHref:        string;
  highlights:     string[];   /* 3 bullet features shown prominently in card */
}

/* ──────────────────────────────────────────────────────────────────── */
/*  PLAN DEFINITIONS                                                    */
/*  PMF reviewed 2026-04. Do not change prices without a margin check.  */
/* ──────────────────────────────────────────────────────────────────── */

export const PLANS: Plan[] = [
  {
    id: "free",
    displayName: "رایگان",
    tagline: "بدون ریسک — امتحان کن",
    priceToman: 0,
    billingCycle: "free",
    accent: "ink",
    highlights: [
      "۱ تحلیل در هفته",
      "۳ ابزار AI پیشنهادی",
      "نقشه راه ۱ بار",
    ],
    limits: {
      analysesPerWeek:        1,
      analysisOutputTokens:   2_000,
      roadmapsPerMonth:       0,
      roadmapsLifetime:       1,
      chatMessagesPerMonth:   0,
      chatContextTokens:      0,
      chatOutputTokens:       0,
      chatRateLimitPerMinute: 0,
      matchedJobsVisible:     3,
      jobMatchFrequency:      "weekly",
      support:                "email",
      modelTier:              "flash",
    },
    ctaLabel: "شروع رایگان",
    ctaHref:  "/signup",
  },

  {
    id: "pro",
    displayName: "پرو",
    tagline: "برای رشد جدی",
    priceToman: 298_000,
    billingCycle: "monthly",
    recommended: true,
    accent: "brand",
    highlights: [
      "۵ تحلیل در هفته",
      "مسیریاب AI (چت‌بات)",
      "۲۰ شغل مچ‌شده روزانه",
    ],
    limits: {
      analysesPerWeek:        5,
      analysisOutputTokens:   4_000,
      roadmapsPerMonth:       4,
      roadmapsLifetime:       null,
      chatMessagesPerMonth:   200,
      chatContextTokens:      32_000,
      chatOutputTokens:       1_500,
      chatRateLimitPerMinute: 10,
      matchedJobsVisible:     20,
      jobMatchFrequency:      "daily",
      support:                "fast",
      modelTier:              "mini",
    },
    ctaLabel: "شروع با پرو",
    ctaHref:  "/signup?plan=pro",
  },

  {
    id: "max",
    displayName: "مکس",
    tagline: "نامحدود — با تخفیف ۴۴٪",
    priceToman: 1_980_000,
    billingCycle: "yearly",
    /* 1,980,000 / 12 = 165,000 exact */
    monthlyEquivalentToman: 165_000,
    accent: "gold",
    highlights: [
      "تحلیل نامحدود",
      "شغل لحظه‌ای (realtime)",
      "اولویت در پشتیبانی",
    ],
    limits: {
      analysesPerWeek:        -1,        /* unlimited — display as "نامحدود" */
      analysisOutputTokens:   8_000,
      roadmapsPerMonth:       -1,        /* unlimited                        */
      roadmapsLifetime:       null,
      chatMessagesPerMonth:   600,
      chatContextTokens:      128_000,
      chatOutputTokens:       3_000,
      chatRateLimitPerMinute: 30,
      matchedJobsVisible:     -1,
      jobMatchFrequency:      "realtime",
      support:                "priority",
      modelTier:              "standard",
    },
    ctaLabel: "شروع با مکس",
    ctaHref:  "/signup?plan=max",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  DISPLAY HELPERS                                                     */
/* ──────────────────────────────────────────────────────────────────── */

const fa = (n: number) =>
  n.toLocaleString("fa-IR", { useGrouping: true });

export function formatPrice(plan: Plan): { amount: string; unit: string } {
  if (plan.priceToman === 0) return { amount: "رایگان", unit: "" };
  const thousands = Math.round(plan.priceToman / 1000);
  return { amount: fa(thousands), unit: "هزار تومان" };
}

export function formatMonthlyEquivalent(plan: Plan): string | null {
  if (!plan.monthlyEquivalentToman) return null;
  const thousands = Math.round(plan.monthlyEquivalentToman / 1000);
  return `معادل ${fa(thousands)} هزار تومان در ماه`;
}

export function describeLimit(key: keyof PlanLimits, p: Plan): string {
  const l = p.limits;
  switch (key) {
    case "analysesPerWeek":
      if (l.analysesPerWeek === -1) return "نامحدود";
      return `${fa(l.analysesPerWeek)} تا/هفته`;
    case "roadmapsPerMonth":
      if (l.roadmapsLifetime != null)
        return `${fa(l.roadmapsLifetime)} بار (کلاً)`;
      if (l.roadmapsPerMonth === -1) return "نامحدود";
      return `${fa(l.roadmapsPerMonth)} بار/ماه`;
    case "chatMessagesPerMonth":
      if (l.chatMessagesPerMonth === 0) return "—";
      return `${fa(l.chatMessagesPerMonth)} پیام/ماه`;
    case "matchedJobsVisible":
      if (l.matchedJobsVisible === -1) return "نامحدود";
      return `${fa(l.matchedJobsVisible)} مورد`;
    case "chatContextTokens":
      if (l.chatContextTokens === 0) return "—";
      return `${fa(l.chatContextTokens / 1000)}k توکن`;
    case "chatOutputTokens":
      if (l.chatOutputTokens === 0) return "—";
      return `${fa(l.chatOutputTokens / 1000)}k توکن`;
    case "support":
      return { email: "ایمیل", fast: "سریع", priority: "اولویت‌دار" }[l.support];
    case "jobMatchFrequency":
      return {
        none: "—",
        weekly: "هفتگی",
        daily: "روزانه",
        realtime: "لحظه‌ای ⚡",
      }[l.jobMatchFrequency];
    default:
      return "";
  }
}
