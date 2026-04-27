/**
 * POST /api/magazine/crawl
 * Fetches AI news from RSS feeds, saves to ai_news_items table.
 * Protected by CRAWL_SECRET or authenticated session.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/* ── Sources ─────────────────────────────────────────────────────── */
const AI_SOURCES = [
  { key: "verge_ai",    name: "The Verge",      url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", aiOnly: true  },
  { key: "venturebeat", name: "VentureBeat",    url: "https://venturebeat.com/category/ai/feed/",                         aiOnly: true  },
  { key: "wired_ai",   name: "Wired",           url: "https://www.wired.com/feed/tag/artificial-intelligence/rss",        aiOnly: true  },
  { key: "techcrunch", name: "TechCrunch",      url: "https://techcrunch.com/feed/",                                      aiOnly: false },
  { key: "ars_tech",   name: "Ars Technica",    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",          aiOnly: false },
  { key: "mit_tech",   name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/",                            aiOnly: false },
  { key: "zoomit",     name: "زومیت",           url: "https://www.zoomit.ir/feed/",                                       aiOnly: false },
  { key: "digiato",    name: "دیجیاتو",         url: "https://digiato.com/feed/",                                         aiOnly: false },
];

const AI_KEYWORDS = [
  "ai", "artificial intelligence", "machine learning", "gpt", "llm",
  "openai", "anthropic", "claude", "gemini", "chatgpt", "mistral",
  "neural", "deep learning", "robot", "automation", "agi", "deepmind",
  "midjourney", "stable diffusion", "hugging face", "nvidia", "llama",
  "copilot", "sora", "dall-e", "runway", "perplexity",
  "هوش مصنوعی", "یادگیری ماشین", "ربات", "اتوماسیون",
];

/* ── XML helpers ─────────────────────────────────────────────────── */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}
function extractCDATA(s: string): string {
  const m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1] : s;
}
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function cleanText(raw: string): string {
  return decodeEntities(stripTags(extractCDATA(raw))).trim();
}
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  return xml.match(re)?.[1] ?? "";
}
function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, "i");
  return xml.match(re)?.[1] ?? "";
}

/* ── Image extraction — tries multiple strategies ────────────────── */
function extractImage(raw: string): string {
  // 1. media:content with url (most reliable)
  const mediaContent =
    raw.match(/<media:content[^>]+url="(https?[^"]+)"/i)?.[1] ||
    raw.match(/<media:content[^>]+url='(https?[^']+)'/i)?.[1];
  if (mediaContent) return mediaContent;

  // 2. media:thumbnail
  const mediaThumbnail =
    raw.match(/<media:thumbnail[^>]+url="(https?[^"]+)"/i)?.[1] ||
    raw.match(/<media:thumbnail[^>]+url='(https?[^']+)'/i)?.[1];
  if (mediaThumbnail) return mediaThumbnail;

  // 3. enclosure (image type only)
  const enclosureMatch = raw.match(/<enclosure([^>]+)>/i)?.[1] ?? "";
  if (enclosureMatch && /type="image/i.test(enclosureMatch)) {
    const encUrl = enclosureMatch.match(/url="(https?[^"]+)"/i)?.[1];
    if (encUrl) return encUrl;
  }

  // 4. First <img src="..."> inside CDATA description/content
  const cdataBlock = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)?.[1] ?? "";
  const imgInCdata =
    cdataBlock.match(/<img[^>]+src="(https?[^"]+)"/i)?.[1] ||
    cdataBlock.match(/<img[^>]+src='(https?[^']+)'/i)?.[1];
  if (imgInCdata) return imgInCdata;

  // 5. First https img anywhere in the item raw text (last resort)
  const anyImg = raw.match(/<img[^>]+src="(https?[^"]+)"/i)?.[1];
  if (anyImg) return anyImg;

  return "";
}

interface RawItem {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  image: string;
}

function parseItems(feedXml: string): RawItem[] {
  const items: RawItem[] = [];
  const re = /<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(feedXml)) !== null) {
    const raw = m[1] || m[2];

    const title = cleanText(extractTag(raw, "title"));

    let link = cleanText(extractTag(raw, "link"));
    if (!link || link.includes("<") || link.length < 8) {
      link = extractAttr(raw, "link", "href");
    }
    link = link.replace(/\s+/g, "").trim();

    const dateRaw =
      extractTag(raw, "pubDate") ||
      extractTag(raw, "published") ||
      extractTag(raw, "updated") ||
      extractTag(raw, "dc:date");
    const pubDate = cleanText(dateRaw);

    const descRaw =
      extractTag(raw, "description") ||
      extractTag(raw, "summary") ||
      extractTag(raw, "content:encoded") ||
      extractTag(raw, "content");
    const summary = cleanText(descRaw).slice(0, 600);

    // Full item raw + description raw both tried for image
    const image = extractImage(raw + descRaw);

    if (title && link && link.startsWith("http")) {
      items.push({ title, link, pubDate, summary, image });
    }
  }
  return items;
}

function isAIRelated(title: string, summary: string): boolean {
  const text = (title + " " + summary).toLowerCase();
  return AI_KEYWORDS.some((kw) => text.includes(kw));
}

function parseDate(s: string): Date {
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch { return new Date(); }
}

/* ── Ensure table ────────────────────────────────────────────────── */
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_news_items (
      id           SERIAL PRIMARY KEY,
      source_key   VARCHAR(60)  NOT NULL,
      source_name  VARCHAR(120) NOT NULL,
      title        TEXT         NOT NULL,
      url          TEXT         NOT NULL UNIQUE,
      published_at TIMESTAMPTZ,
      summary      TEXT,
      image_url    TEXT,
      fetched_at   TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS ai_news_published_idx ON ai_news_items (published_at DESC);
  `).catch(() => {});
}

/* ── Fetch one feed ──────────────────────────────────────────────── */
async function fetchFeed(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const tid  = setTimeout(() => ctrl.abort(), 10000);
    const res  = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AY-NewsBot/1.0; +https://a-y.app)" },
      cache: "no-store",
    });
    clearTimeout(tid);
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

/* ── Crawl all sources ───────────────────────────────────────────── */
async function crawlAll() {
  await ensureTable();

  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
  let saved = 0, skipped = 0;
  const okSources: string[] = [];

  for (const src of AI_SOURCES) {
    const xml = await fetchFeed(src.url);
    if (!xml) continue;

    const rawItems = parseItems(xml);
    let srcSaved = 0;

    for (const item of rawItems) {
      const pubDate = parseDate(item.pubDate);
      if (pubDate < since48h) continue;
      if (!src.aiOnly && !isAIRelated(item.title, item.summary)) continue;

      try {
        await pool.query(
          `INSERT INTO ai_news_items
             (source_key, source_name, title, url, published_at, summary, image_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (url) DO UPDATE
             SET image_url = COALESCE(EXCLUDED.image_url, ai_news_items.image_url)`,
          [
            src.key, src.name, item.title, item.link,
            pubDate.toISOString(),
            item.summary || null,
            item.image   || null,
          ]
        );
        srcSaved++;
        saved++;
      } catch { skipped++; }
    }

    if (srcSaved > 0) okSources.push(src.name);
  }

  // Prune older than 7 days
  await pool.query(
    `DELETE FROM ai_news_items WHERE fetched_at < NOW() - INTERVAL '7 days'`
  ).catch(() => {});

  return { saved, skipped, sources: okSources };
}

/* ── Auth helper ─────────────────────────────────────────────────── */
async function checkAuth(req: NextRequest): Promise<boolean> {
  const secret = process.env.CRAWL_SECRET || process.env.MAGAZINE_SECRET;
  const header = req.headers.get("authorization") ?? "";
  if (secret && header === `Bearer ${secret}`) return true;
  return !!(await getSession());
}

/* ── Routes ──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await crawlAll();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await pool.query(
    `SELECT source_name, COUNT(*) as cnt,
            SUM(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) as with_image,
            MAX(published_at) as latest
     FROM ai_news_items GROUP BY source_name ORDER BY latest DESC`
  ).catch(() => ({ rows: [] }));

  const total = await pool.query(
    `SELECT COUNT(*) FROM ai_news_items
     WHERE published_at > NOW() - INTERVAL '48 hours'`
  ).catch(() => ({ rows: [{ count: 0 }] }));

  return NextResponse.json({
    sources: stats.rows,
    items_48h: parseInt(total.rows[0]?.count ?? "0"),
  });
}
