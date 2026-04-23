/**
 * plans.ts — Single source of truth for subscription tiers.
 *
 * CRITICAL: This file is read by both the frontend (pricing UI) AND
 * the backend (quota enforcement, API gateway limits). To change
 * pricing, limits, or quotas, edit ONLY this file.
 *
 * Sustainability notes (see docs/economics.md for full model):
 *  • Current cost model assumes Metis API + a cheap model tier
 *    (GPT-4o-mini or Gemini 1.5 Flash) with prompt caching enabled.
 *  • Swapping to a more expensive model? Re-run the margin check before
 *    shipping — change `modelTier` below and the API gateway picks up
 *    the new routing automatically.
 *  • Chat message caps are enforced at both Redis (monthly counter) and
 *    per-request (context/output token caps in `chatContextTokens` /
 *    `chatOutputTokens`). DO NOT let any path bypass these.
 */

export type PlanId = "free" | "pro" | "max";
export type PlanAccent = "ink" | "brand" | "gold";
export type BillingCycle = "free" | "monthly" | "yearly";

/** Which upstream model tier a plan routes to.                          */
/* Mapped to real provider models inside the API gateway.                */
export type ModelTier = "flash" | "mini" | "standard" | "advanced";

export type UpdateFrequency = "none" | "weekly" | "daily" | "realtime";
export type SupportTier    = "email" | "fast" | "priority";

/** Hard limits enforced by backend — frontend just displays them.      */
export interface PlanLimits {
  /* ─── Profile analysis ─────────────────────────────────────────── */
  analysesPerWeek:        number;
  analysisOutputTokens:   number;   /* hard cap on output size         */

  /* ─── Roadmap generation ───────────────────────────────────────── */
  /* For free tier this is enforced as a lifetime total (see below).  */
  roadmapsPerMonth:       number;
  roadmapsLifetime:       number | null;   /* null = no lifetime cap   */

  /* ─── Career-chatbot (مسیریاب) ─────────────────────────────────── */
  chatMessagesPerMonth:   number;          /* 0 = feature disabled     */
  chatContextTokens:      number;          /* rolling window           */
  chatOutputTokens:       number;
  chatRateLimitPerMinute: number;

  /* ─── Matched jobs ─────────────────────────────────────────────── */
  /* -1 means unlimited in display; backend still page-sizes.         */
  matchedJobsVisible:     number;
  jobMatchFrequency:      UpdateFrequency;

  /* ─── Misc ─────────────────────────────────────────────────────── */
  support:                SupportTier;
  modelTier:              ModelTier;
}

export interface Plan {
  id:              PlanId;
  displayName:    string;    /* Persian                                 */
  tagline:        string;
  priceToman:     number;    /* raw number — formatted at render time   */
  billingCycle:   BillingCycle;
  /* For yearly plans: monthly-equivalent shown under the sticker price */
  monthlyEquivalentToman?: number;
  accent:          PlanAccent;
  recommended?:    boolean;
  limits:          PlanLimits;
  ctaLabel:       string;
  ctaHref:        string;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  PLAN DEFINITIONS                                                    */
/*  — Prices in raw tomans. Edit these to change tiers.                 */
/* ──────────────────────────────────────────────────────────────────── */

export const PLANS: Plan[] = [
  {
    id: "free",
    displayName: "رایگان",
    tagline: "شروع بدون ریسک",
    priceToman: 0,
    billingCycle: "free",
    accent: "ink",
    limits: {
      analysesPerWeek:        2,
      analysisOutputTokens:   2_500,
      roadmapsPerMonth:       0,
      roadmapsLifetime:       1,
      chatMessagesPerMonth:   0,
      chatContextTokens:      0,
      chatOutputTokens:       0,
      chatRateLimitPerMinute: 0,
      matchedJobsVisible:     5,
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
    tagline: "برای کسایی که جدی‌ان",
    priceToman: 198_000,
    billingCycle: "monthly",
    recommended: true,
    accent: "brand",
    limits: {
      analysesPerWeek:        5,
      analysisOutputTokens:   4_000,
      roadmapsPerMonth:       5,
      roadmapsLifetime:       null,
      chatMessagesPerMonth:   300,
      chatContextTokens:      32_000,
      chatOutputTokens:       1_500,
      chatRateLimitPerMinute: 10,
      matchedJobsVisible:     20,
      jobMatchFrequency:      "daily",
      support:                "fast",
      modelTier:              "mini",
    },
    ctaLabel: "انتخاب پرو",
    ctaHref:  "/signup?plan=pro",
  },

  {
    id: "max",
    displayName: "مکس",
    tagline: "همه‌چیز — با تعهد یک‌ساله",
    priceToman: 1_680_000,
    billingCycle: "yearly",
    monthlyEquivalentToman: 140_000,  /* = 1,680,000 / 12 */
    accent: "gold",
    limits: {
      analysesPerWeek:        10,
      analysisOutputTokens:   8_000,
      roadmapsPerMonth:       10,
      roadmapsLifetime:       null,
      chatMessagesPerMonth:   1_200,
      chatContextTokens:      128_000,
      chatOutputTokens:       3_000,
      chatRateLimitPerMinute: 20,
      matchedJobsVisible:     -1,
      jobMatchFrequency:      "daily",
      support:                "priority",
      modelTier:              "standard",
    },
    ctaLabel: "انتخاب مکس",
    ctaHref:  "/signup?plan=max",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  DISPLAY HELPERS                                                     */
/* ──────────────────────────────────────────────────────────────────── */

const fa = (n: number) =>
  n.toLocaleString("fa-IR", { useGrouping: true });

/** "۱۹۸ هزار تومان" / "۱,۶۸۰ هزار تومان" / "۰ تومان"                 */
export function formatPrice(plan: Plan): { amount: string; unit: string } {
  if (plan.priceToman === 0) return { amount: "۰", unit: "تومان" };
  const thousands = Math.round(plan.priceToman / 1000);
  return { amount: fa(thousands), unit: "هزار تومان" };
}

export function formatMonthlyEquivalent(plan: Plan): string | null {
  if (!plan.monthlyEquivalentToman) return null;
  const thousands = Math.round(plan.monthlyEquivalentToman / 1000);
  return `معادل ${fa(thousands)} هزار تومان ماهانه`;
}

/** Human-friendly one-liner for a limit — used in pricing UI.         */
export function describeLimit(key: keyof PlanLimits, p: Plan): string {
  const l = p.limits;
  switch (key) {
    case "analysesPerWeek":
      return `${fa(l.analysesPerWeek)} تا/هفته`;
    case "roadmapsPerMonth":
      if (l.roadmapsLifetime != null)
        return `${fa(l.roadmapsLifetime)} بار (کلاً)`;
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
      return { email: "ایمیل", fast: "سریع", priority: "اولویت" }[l.support];
    case "jobMatchFrequency":
      return {
        none: "—",
        weekly: "هفتگی",
        daily: "روزانه",
        realtime: "لحظه‌ای",
      }[l.jobMatchFrequency];
    default:
      return "";
  }
}
