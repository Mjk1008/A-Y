/**
 * scraper-courses.ts — HTML scraper for Iranian online course platforms
 *
 * Sources: Maktabkhooneh · Limu · Faradars
 */

import * as cheerio from "cheerio";

export interface CourseListing {
  source:          string;
  title:           string;
  instructor:      string;
  platform:        string;
  url:             string;
  thumbnail?:      string;
  description:     string;
  level:           "beginner" | "intermediate" | "advanced" | "unknown";
  duration_hours:  number;
  price_toman:     number;   /* 0 = free */
  rating:          number;
  rating_count:    number;
  topics:          string[];
  is_farsi:        boolean;
  has_certificate: boolean;
  crawled_at:      Date;
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
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      console.warn(`[scraper-courses] ${url} → HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`[scraper-courses] fetch error:`, e);
    return null;
  }
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function parsePriceToman(s: string): number {
  if (!s || /رایگان|free|0/i.test(s)) return 0;
  const digits = s.replace(/[^۰-۹0-9]/g, "");
  /* Persian digits → Latin */
  const latin = digits.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const num = parseInt(latin, 10);
  /* If it looks like tomans already (>= 1000), return as-is */
  return isNaN(num) ? 0 : num;
}

function parseRating(s: string): number {
  const m = s.match(/([\d.]+)/);
  return m ? Math.min(5, parseFloat(m[1])) : 0;
}

function mapLevel(s: string): CourseListing["level"] {
  if (/مقدماتی|مبتدی|beginner|ابتدا/i.test(s)) return "beginner";
  if (/پیشرفته|حرفه|advanced/i.test(s))         return "advanced";
  if (/متوسط|intermediate/i.test(s))            return "intermediate";
  return "unknown";
}

/* ══════════════════════════════════════════════════════════════════
   MAKTABKHOONEH — maktabkhooneh.org
══════════════════════════════════════════════════════════════════ */
export async function scrapeMaktabkhooneh(query = "هوش مصنوعی"): Promise<CourseListing[]> {
  const url = `https://maktabkhooneh.org/search/?q=${encodeURIComponent(query)}&ordering=-updated_at`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: CourseListing[] = [];

  const cards = $(
    ".course-card, [class*='courseCard'], [class*='course-item'], " +
    "[class*='CourseCard'], .card.course, article"
  ).toArray();

  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title =
      cleanText($el.find("h2, h3, [class*='title'], [class*='name']").first().text());
    const instructor =
      cleanText($el.find("[class*='teacher'], [class*='instructor'], [class*='author']").first().text());
    const priceText =
      cleanText($el.find("[class*='price'], .price").first().text());
    const ratingText =
      cleanText($el.find("[class*='rating'], [class*='rate'], .star").first().text());
    const levelText =
      cleanText($el.find("[class*='level'], [class*='grade']").first().text());
    const href =
      $el.find("a").first().attr("href") ?? "";
    const courseUrl =
      href.startsWith("http") ? href : `https://maktabkhooneh.org${href}`;
    const thumbnail =
      $el.find("img").first().attr("src") ?? $el.find("img").first().attr("data-src");
    const desc =
      cleanText($el.find("p, [class*='desc'], [class*='excerpt']").first().text());
    const studentText =
      cleanText($el.find("[class*='student'], [class*='enrolled']").first().text());
    const studentCount = parseInt(studentText.replace(/\D/g, "") || "0") || 0;

    const topics: string[] = [];
    $el.find("[class*='tag'], [class*='category'], .badge").each((_, t) => {
      const tag = cleanText($(t).text());
      if (tag) topics.push(tag);
    });

    if (!title) continue;

    results.push({
      source:          "maktabkhooneh",
      title,
      instructor:      instructor || "مکتب‌خونه",
      platform:        "مکتب‌خونه",
      url:             courseUrl,
      thumbnail:       thumbnail || undefined,
      description:     desc,
      level:           mapLevel(levelText),
      duration_hours:  0,  /* needs detail page for exact duration */
      price_toman:     parsePriceToman(priceText),
      rating:          parseRating(ratingText),
      rating_count:    studentCount,
      topics,
      is_farsi:        true,
      has_certificate: /گواهی|certificate/i.test(html.slice(0, 100)),
      crawled_at:      new Date(),
    });
  }

  return results;
}

/* ══════════════════════════════════════════════════════════════════
   LIMU — limu.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeLimu(query = "هوش مصنوعی"): Promise<CourseListing[]> {
  const url = `https://limu.ir/courses/?s=${encodeURIComponent(query)}`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: CourseListing[] = [];

  const cards = $(
    ".course-card, [class*='course'], .product, article.product, " +
    "[class*='CourseItem'], .woocommerce-LoopProduct"
  ).toArray();

  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2, h3, .woocommerce-loop-product__title, [class*='title']").first().text());
    const priceText = cleanText($el.find(".price, [class*='price'], .amount").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const courseUrl = href.startsWith("http") ? href : `https://limu.ir${href}`;
    const thumbnail = $el.find("img").first().attr("src") ?? $el.find("img").first().attr("data-src");
    const ratingText = cleanText($el.find(".star-rating, [class*='rating']").first().text());
    const desc     = cleanText($el.find("p, [class*='desc']").first().text());

    if (!title) continue;

    results.push({
      source:          "limu",
      title,
      instructor:      "لیمو",
      platform:        "لیمو",
      url:             courseUrl,
      thumbnail:       thumbnail || undefined,
      description:     desc,
      level:           "unknown",
      duration_hours:  0,
      price_toman:     parsePriceToman(priceText),
      rating:          parseRating(ratingText),
      rating_count:    0,
      topics:          [],
      is_farsi:        true,
      has_certificate: false,
      crawled_at:      new Date(),
    });
  }

  return results;
}

/* ══════════════════════════════════════════════════════════════════
   FARADARS — faradars.org
══════════════════════════════════════════════════════════════════ */
export async function scraperFaradars(query = "هوش مصنوعی"): Promise<CourseListing[]> {
  const url = `https://faradars.org/courses/search/?q=${encodeURIComponent(query)}&order=newest`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: CourseListing[] = [];

  const cards = $(
    "[class*='course-card'], [class*='CourseCard'], .course-box, " +
    "[class*='course_item'], article.course, .fv-course-item"
  ).toArray();

  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2, h3, [class*='title']").first().text());
    const instructor = cleanText($el.find("[class*='teacher'], [class*='instructor']").first().text());
    const priceText = cleanText($el.find("[class*='price'], .price").first().text());
    const ratingText = cleanText($el.find("[class*='rating'], [class*='star']").first().text());
    const levelText = cleanText($el.find("[class*='level'], [class*='grade']").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const courseUrl = href.startsWith("http") ? href : `https://faradars.org${href}`;
    const thumbnail = $el.find("img").first().attr("src") ?? $el.find("img").first().attr("data-src");
    const durationText = cleanText($el.find("[class*='duration'], [class*='time']").first().text());
    const durationHrs  = parseDurationHours(durationText);

    const topics: string[] = [];
    $el.find("[class*='tag'], [class*='category'], .badge").each((_, t) => {
      const tag = cleanText($(t).text());
      if (tag) topics.push(tag);
    });

    if (!title) continue;

    results.push({
      source:          "faradars",
      title,
      instructor:      instructor || "فرادرس",
      platform:        "فرادرس",
      url:             courseUrl,
      thumbnail:       thumbnail || undefined,
      description:     cleanText($el.find("p, [class*='desc']").first().text()),
      level:           mapLevel(levelText),
      duration_hours:  durationHrs,
      price_toman:     parsePriceToman(priceText),
      rating:          parseRating(ratingText),
      rating_count:    0,
      topics,
      is_farsi:        true,
      has_certificate: true,  /* Faradars always has certificate */
      crawled_at:      new Date(),
    });
  }

  return results;
}

/* ══════════════════════════════════════════════════════════════════
   AGGREGATE
══════════════════════════════════════════════════════════════════ */
export async function scrapeAllCourses(query = "هوش مصنوعی"): Promise<CourseListing[]> {
  const [mk, limu, faradars] = await Promise.allSettled([
    scrapeMaktabkhooneh(query),
    scrapeLimu(query),
    scraperFaradars(query),
  ]);

  const all: CourseListing[] = [];
  for (const r of [mk, limu, faradars]) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  /* Dedup by URL */
  const seen = new Set<string>();
  return all.filter((c) => {
    if (!c.url || seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });
}

/* ── helpers ─────────────────────────────────────────────────────── */
function parseDurationHours(s: string): number {
  if (!s) return 0;
  const hoursMatch = s.match(/(\d+)\s*(ساعت|h)/i);
  const minsMatch  = s.match(/(\d+)\s*(دقیقه|min)/i);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const mins  = minsMatch  ? parseInt(minsMatch[1]) / 60 : 0;
  return Math.round(hours + mins);
}
