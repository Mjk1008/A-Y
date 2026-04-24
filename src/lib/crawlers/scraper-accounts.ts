/**
 * scraper-accounts.ts — Premium account & license resellers
 *
 * Sources:
 *   LicenseMarkt (licensemarkt.ir)
 *   Iranicard     (iranicard.ir)
 *   ParsPremium   (parspremium.ir)
 *   Numberlandir  (numberland.ir)
 *
 * These sites sell subscription sharing / premium accounts for
 * ChatGPT, Midjourney, LinkedIn, Netflix, Adobe, etc.
 * We scrape product name + price + availability for the "اکانت" tab.
 */

import * as cheerio from "cheerio";

export interface AccountListing {
  source:      string;
  name:        string;
  description: string;
  category:    string;   /* e.g. "ChatGPT", "Midjourney", "Adobe" */
  url:         string;
  price_toman: number;
  period:      string;   /* "ماهانه", "سالانه", "یک‌بار", etc. */
  available:   boolean;
  thumbnail?:  string;
  crawled_at:  Date;
}

async function getHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8",
        "Referer": "https://google.com",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      console.warn(`[scraper-accounts] ${url} → HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`[scraper-accounts] fetch error ${url}:`, e);
    return null;
  }
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function parsePriceToman(s: string): number {
  if (!s || /رایگان|free/i.test(s)) return 0;
  /* strip non-digit (Persian + Latin) */
  const digits = s.replace(/[^۰-۹0-9]/g, "");
  const latin  = digits.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  return parseInt(latin, 10) || 0;
}

function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (/chatgpt|gpt|openai/i.test(t))        return "ChatGPT";
  if (/claude|anthropic/i.test(t))           return "Claude";
  if (/midjourney|mj/i.test(t))             return "Midjourney";
  if (/adobe|photoshop|illustrator/i.test(t)) return "Adobe";
  if (/linkedin/i.test(t))                  return "LinkedIn";
  if (/netflix/i.test(t))                   return "Netflix";
  if (/spotify/i.test(t))                   return "Spotify";
  if (/notion/i.test(t))                    return "Notion";
  if (/canva/i.test(t))                     return "Canva";
  if (/perplexity/i.test(t))                return "Perplexity";
  if (/cursor/i.test(t))                    return "Cursor";
  if (/gemini|bard/i.test(t))               return "Gemini";
  if (/grammarly/i.test(t))                 return "Grammarly";
  if (/github copilot|copilot/i.test(t))    return "Copilot";
  if (/vpn/i.test(t))                       return "VPN";
  return "سایر";
}

function detectPeriod(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  if (/سالانه|یک ساله|یکساله|annual|yearly|1 year/i.test(text)) return "سالانه";
  if (/ماهانه|ماهیانه|monthly|1 month|یک ماه/i.test(text))       return "ماهانه";
  if (/روزانه|daily|1 day/i.test(text))                           return "روزانه";
  if (/یک‌بار|یکبار|lifetime|دائمی/i.test(text))                  return "یک‌بار";
  return "نامشخص";
}

/* ══════════════════════════════════════════════════════════════════
   LICENSEMARKT — licensemarkt.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeLicenseMarkt(): Promise<AccountListing[]> {
  /* Scrape AI-related products page */
  const urls = [
    "https://licensemarkt.ir/product-category/هوش-مصنوعی/",
    "https://licensemarkt.ir/product-category/ai/",
    "https://licensemarkt.ir/",
  ];

  for (const url of urls) {
    const html = await getHtml(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const results: AccountListing[] = [];

    const cards = $(
      ".product, li.product, .woocommerce-LoopProduct, " +
      "[class*='product-item'], [class*='ProductCard']"
    ).toArray();

    for (const el of cards.slice(0, 50)) {
      const $el = $(el);

      const title    = cleanText($el.find("h2, h3, .woocommerce-loop-product__title, [class*='title']").first().text());
      const priceText = cleanText($el.find(".price, .amount, [class*='price']").first().text());
      const href     = $el.find("a").first().attr("href") ?? "";
      const thumbnail = $el.find("img").first().attr("src");
      const desc     = cleanText($el.find("p, [class*='desc']").first().text());
      const available = !$el.hasClass("outofstock") && !/ناموجود|تمام شد|out.of.stock/i.test(title + desc);

      if (!title) continue;

      results.push({
        source:      "licensemarkt",
        name:        title,
        description: desc,
        category:    detectCategory(title),
        url:         href.startsWith("http") ? href : `https://licensemarkt.ir${href}`,
        price_toman: parsePriceToman(priceText),
        period:      detectPeriod(title, desc),
        available,
        thumbnail:   thumbnail || undefined,
        crawled_at:  new Date(),
      });
    }

    if (results.length > 0) return results;
  }

  return [];
}

/* ══════════════════════════════════════════════════════════════════
   IRANICARD — iranicard.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeIranicard(): Promise<AccountListing[]> {
  const urls = [
    "https://iranicard.ir/product-category/هوش-مصنوعی/",
    "https://iranicard.ir/product-category/ai/",
    "https://iranicard.ir/products/",
    "https://iranicard.ir/",
  ];

  for (const url of urls) {
    const html = await getHtml(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const results: AccountListing[] = [];

    const cards = $(
      ".product, li.product, [class*='product'], [class*='card'], article"
    ).toArray();

    for (const el of cards.slice(0, 50)) {
      const $el = $(el);
      const title    = cleanText($el.find("h2, h3, [class*='title'], [class*='name']").first().text());
      const priceText = cleanText($el.find(".price, .amount, [class*='price']").first().text());
      const href     = $el.find("a").first().attr("href") ?? "";
      const thumbnail = $el.find("img").first().attr("src");
      const desc     = cleanText($el.find("p, [class*='desc']").first().text());
      const available = !/ناموجود|تمام شد|out.of.stock/i.test(title + desc);

      if (!title) continue;

      results.push({
        source:      "iranicard",
        name:        title,
        description: desc,
        category:    detectCategory(title),
        url:         href.startsWith("http") ? href : `https://iranicard.ir${href}`,
        price_toman: parsePriceToman(priceText),
        period:      detectPeriod(title, desc),
        available,
        thumbnail:   thumbnail || undefined,
        crawled_at:  new Date(),
      });
    }

    if (results.length > 0) return results;
  }

  return [];
}

/* ══════════════════════════════════════════════════════════════════
   PARSPREMIUM — parspremium.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeParsPremium(): Promise<AccountListing[]> {
  const urls = [
    "https://parspremium.ir/product-category/هوش-مصنوعی/",
    "https://parspremium.ir/products/",
    "https://parspremium.ir/",
  ];

  for (const url of urls) {
    const html = await getHtml(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const results: AccountListing[] = [];

    const cards = $(
      ".product, li.product, [class*='product-item'], " +
      "[class*='ProductCard'], [class*='shop-item']"
    ).toArray();

    for (const el of cards.slice(0, 50)) {
      const $el = $(el);
      const title    = cleanText($el.find("h2, h3, [class*='title']").first().text());
      const priceText = cleanText($el.find(".price, .amount, [class*='price']").first().text());
      const href     = $el.find("a").first().attr("href") ?? "";
      const thumbnail = $el.find("img").first().attr("src");
      const desc     = cleanText($el.find("p, [class*='desc']").first().text());
      const available = !$el.hasClass("outofstock") && !/ناموجود/i.test(title + desc);

      if (!title) continue;

      results.push({
        source:      "parspremium",
        name:        title,
        description: desc,
        category:    detectCategory(title),
        url:         href.startsWith("http") ? href : `https://parspremium.ir${href}`,
        price_toman: parsePriceToman(priceText),
        period:      detectPeriod(title, desc),
        available,
        thumbnail:   thumbnail || undefined,
        crawled_at:  new Date(),
      });
    }

    if (results.length > 0) return results;
  }

  return [];
}

/* ══════════════════════════════════════════════════════════════════
   NUMBERLAND — numberland.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeNumberland(): Promise<AccountListing[]> {
  const urls = [
    "https://numberland.ir/product-category/اکانت-هوش-مصنوعی/",
    "https://numberland.ir/product-category/ai/",
    "https://numberland.ir/",
  ];

  for (const url of urls) {
    const html = await getHtml(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const results: AccountListing[] = [];

    const cards = $(
      ".product, li.product, .woocommerce-LoopProduct, [class*='product']"
    ).toArray();

    for (const el of cards.slice(0, 50)) {
      const $el = $(el);
      const title    = cleanText($el.find("h2, h3, .woocommerce-loop-product__title, [class*='title']").first().text());
      const priceText = cleanText($el.find(".price, .amount, [class*='price']").first().text());
      const href     = $el.find("a").first().attr("href") ?? "";
      const thumbnail = $el.find("img").first().attr("src");
      const desc     = cleanText($el.find("p, [class*='desc']").first().text());
      const available = !$el.hasClass("outofstock") && !/ناموجود/i.test(title + desc);

      if (!title) continue;

      results.push({
        source:      "numberland",
        name:        title,
        description: desc,
        category:    detectCategory(title),
        url:         href.startsWith("http") ? href : `https://numberland.ir${href}`,
        price_toman: parsePriceToman(priceText),
        period:      detectPeriod(title, desc),
        available,
        thumbnail:   thumbnail || undefined,
        crawled_at:  new Date(),
      });
    }

    if (results.length > 0) return results;
  }

  return [];
}

/* ══════════════════════════════════════════════════════════════════
   AGGREGATE
══════════════════════════════════════════════════════════════════ */
export async function scrapeAllAccounts(): Promise<AccountListing[]> {
  const [lm, ic, pp, nb] = await Promise.allSettled([
    scrapeLicenseMarkt(),
    scrapeIranicard(),
    scrapeParsPremium(),
    scrapeNumberland(),
  ]);

  const all: AccountListing[] = [];
  for (const r of [lm, ic, pp, nb]) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  /* Dedup by URL */
  const seen = new Set<string>();
  return all.filter((a) => {
    if (!a.url || seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}
