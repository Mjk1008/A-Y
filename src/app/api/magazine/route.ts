/**
 * GET  /api/magazine          — returns today's digest + last 48h news items
 * POST /api/magazine          — (re)generate today's digest
 *                               Auth: CRAWL_SECRET header OR authenticated session
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

const METIS_BASE = process.env.METIS_BASE_URL || "https://api.metisai.ir/openai/v1";
const METIS_KEY  = process.env.METIS_API_KEY  || "";
const MODEL      = "gpt-4o-mini";

/* ── GET: digest + news items ────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const dateParam  = req.nextUrl.searchParams.get("date");
  const targetDate = dateParam || new Date().toISOString().slice(0, 10);

  const [digestRes, newsRes, lastFetchedRes] = await Promise.all([
    pool.query("SELECT * FROM magazine_articles WHERE date=$1", [targetDate])
      .catch(() => ({ rows: [] })),
    pool.query(
      `SELECT id, source_key, source_name, title, url, published_at, summary, image_url
       FROM ai_news_items
       WHERE published_at > NOW() - INTERVAL '48 hours'
       ORDER BY published_at DESC
       LIMIT 40`
    ).catch(() => ({ rows: [] })),
    pool.query(
      `SELECT MAX(fetched_at) AS last_fetched FROM ai_news_items`
    ).catch(() => ({ rows: [{ last_fetched: null }] })),
  ]);

  const digest = digestRes.rows[0] ?? null;
  const newsItems = newsRes.rows ?? [];
  const lastFetchedAt = lastFetchedRes.rows[0]?.last_fetched ?? null;

  // Return both — even if digest doesn't exist yet, news items show immediately
  return NextResponse.json({
    date: targetDate,
    title: digest?.title ?? null,
    content_json: digest?.content_json ?? null,
    fallback: !digest,
    news_items: newsItems,
    last_fetched_at: lastFetchedAt,
  });
}

/* ── Auth helper ─────────────────────────────────────────────────── */
async function checkAuth(req: NextRequest): Promise<boolean> {
  const secret = process.env.CRAWL_SECRET || process.env.MAGAZINE_SECRET;
  const authHeader = req.headers.get("authorization") ?? "";
  if (secret && authHeader === `Bearer ${secret}`) return true;
  const session = await getSession();
  return !!session;
}

/* ── AI digest generation ────────────────────────────────────────── */
async function generateDigest(newsItems: { title: string; source_name: string; published_at: string }[]): Promise<object> {
  const today = new Date().toLocaleDateString("fa-IR");

  let newsContext = "";
  if (newsItems.length > 0) {
    newsContext = "\n\nاخبار واقعی ۴۸ ساعت اخیر که از منابع معتبر جمع‌آوری شده:\n";
    newsItems.slice(0, 15).forEach((item, i) => {
      newsContext += `${i + 1}. [${item.source_name}] ${item.title}\n`;
    });
    newsContext += "\nبر اساس همین اخبار واقعی بالا محتوا بنویس — اطلاعات رو از خودت اضافه نکن.";
  }

  const prompt = `امروز ${today} است. تو سردبیر «مجله AI» هستی — یه نشریه روزانه فارسی که مهم‌ترین اتفاقات هوش مصنوعی ۴۸ ساعت گذشته رو با تون دوستانه پوشش می‌ده.${newsContext}

دقیقاً این JSON رو return کن (بدون هیچ توضیح اضافه):
{
  "headline": "تیتر اصلی جذاب فارسی (حداکثر ۱۰ کلمه)",
  "intro": "یه جمله کوتاه که کاربر رو hook کنه",
  "items": [
    { "title": "عنوان فارسی خبر", "body": "۲-۳ جمله فارسی روان" }
  ],
  "tool_of_day": {
    "name": "اسم ابزار AI روز",
    "why": "یه جمله کوتاه چرا این ابزار امروز مهمه"
  }
}

قوانین:
- حداقل ۵ آیتم در items
- عناوین و متن کاملاً فارسی
- تون: دوستانه، شفاف، کمی اورژانسی
- فقط JSON، بدون هیچ توضیح اضافه`.trim();

  // Mock if no API key
  if (!METIS_KEY || METIS_KEY === "mock") {
    return {
      headline: newsItems.length > 0
        ? `${newsItems[0].title.slice(0, 40)}...`
        : "مهم‌ترین اخبار AI امروز",
      intro: "جدیدترین تحولات هوش مصنوعی در ۴۸ ساعت گذشته",
      items: newsItems.slice(0, 5).map((n) => ({
        title: n.title.slice(0, 60),
        body: `گزارش از ${n.source_name}`,
      })),
      tool_of_day: { name: "Claude AI", why: "دستیار هوشمند برای هر کاری" },
    };
  }

  const res = await fetch(`${METIS_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${METIS_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      messages: [
        { role: "system", content: "تو یه نویسنده مجله AI هستی. دقیقاً JSON بده بدون هیچ توضیح اضافه." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Metis error: ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  return JSON.parse(jsonMatch[0]);
}

/* ── POST: generate digest ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const forceRegen = req.nextUrl.searchParams.get("force") === "1";

  // Check if already generated today
  if (!forceRegen) {
    const existing = await pool.query(
      "SELECT id FROM magazine_articles WHERE date=$1", [today]
    ).catch(() => ({ rows: [] }));
    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: true, exists: true, date: today });
    }
  }

  // Fetch recent news items from crawler
  const newsRes = await pool.query(
    `SELECT title, source_name, published_at
     FROM ai_news_items
     WHERE published_at > NOW() - INTERVAL '48 hours'
     ORDER BY published_at DESC
     LIMIT 20`
  ).catch(() => ({ rows: [] }));

  const newsItems = newsRes.rows;

  try {
    const content = await generateDigest(newsItems);
    const headline = (content as { headline?: string }).headline ?? "مجله AI امروز";

    await pool.query(
      `INSERT INTO magazine_articles (date, title, content_json)
       VALUES ($1, $2, $3)
       ON CONFLICT (date) DO UPDATE
         SET title=EXCLUDED.title, content_json=EXCLUDED.content_json, generated_at=NOW()`,
      [today, headline, JSON.stringify(content)]
    );

    return NextResponse.json({ ok: true, date: today, content });
  } catch (e) {
    return NextResponse.json({ error: "generation_failed", detail: String(e) }, { status: 500 });
  }
}
