/**
 * GET  /api/magazine?date=YYYY-MM-DD  — get article for a date (today if omitted)
 * POST /api/magazine/generate          — generate today's article (admin/cron only)
 *
 * Uses Metis AI (OpenAI-compatible) to generate daily Persian AI news digest.
 * Caches result in magazine_articles table by date.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

const METIS_BASE = process.env.METIS_BASE_URL || "https://api.metisai.ir/openai/v1";
const METIS_KEY  = process.env.METIS_API_KEY  || "";
const MODEL      = "gpt-4o-mini";

/* ── Ensure table exists ─────────────────────────────────────────── */
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS magazine_articles (
      id SERIAL PRIMARY KEY,
      date DATE UNIQUE,
      title TEXT,
      content_json JSONB,
      generated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});
}

/* ── GET: return article for a date ─────────────────────────────── */
export async function GET(req: NextRequest) {
  await ensureTable();

  const dateParam = req.nextUrl.searchParams.get("date");
  const targetDate = dateParam || new Date().toISOString().slice(0, 10);

  const res = await pool.query(
    "SELECT * FROM magazine_articles WHERE date=$1",
    [targetDate]
  ).catch(() => ({ rows: [] }));

  if (res.rows.length > 0) {
    return NextResponse.json(res.rows[0]);
  }

  // If no article for today, return a static fallback so page doesn't break
  return NextResponse.json({
    date: targetDate,
    title: "مجله AI امروز",
    content_json: null,
    fallback: true,
  });
}

/* ── POST: generate today's article ─────────────────────────────── */
export async function POST(req: NextRequest) {
  // Simple secret check
  const secret = process.env.CRAWL_SECRET || process.env.MAGAZINE_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    const bodySecret = (await req.json().catch(() => ({}))).secret;
    if (auth !== `Bearer ${secret}` && bodySecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await ensureTable();

  const today = new Date().toISOString().slice(0, 10);

  // Check if already generated today
  const existing = await pool.query(
    "SELECT id FROM magazine_articles WHERE date=$1",
    [today]
  ).catch(() => ({ rows: [] }));

  if (existing.rows.length > 0) {
    return NextResponse.json({ ok: true, exists: true, date: today });
  }

  if (!METIS_KEY || METIS_KEY === "mock") {
    // Save a mock article
    const mockContent = {
      headline: "هوش مصنوعی امروز چه کرد؟",
      intro: "از مدل‌های جدید تا کاربردهای جالب — مهم‌ترین اتفاقات AI در ۲۴ ساعت گذشته",
      items: [
        { title: "OpenAI مدل جدیدی معرفی کرد", body: "بر اساس گزارش‌های منتشرشده، OpenAI در حال آماده‌سازی مدل بزرگ‌تری است." },
        { title: "Google هم بیکار نبود", body: "Gemini آپدیت جدیدی دریافت کرد که سرعت پاسخ‌دهی را بهبود می‌دهد." },
        { title: "استارتاپ‌های AI در ایران", body: "چندین استارتاپ ایرانی در حال ساخت ابزارهای AI برای بازار فارسی هستند." },
        { title: "هوش مصنوعی در پزشکی", body: "یک تیم تحقیقاتی موفق شد با AI، تشخیص سرطان را دقیق‌تر کند." },
        { title: "ابزار هفته: Perplexity AI", body: "جستجوگر هوشمندی که جواب‌های دقیق با منبع می‌دهد." },
      ],
      tool_of_day: { name: "Perplexity AI", why: "جستجوی هوشمند با منبع — بهتر از گوگل برای سوالات عمیق" },
    };

    await pool.query(
      "INSERT INTO magazine_articles (date, title, content_json) VALUES ($1, $2, $3) ON CONFLICT (date) DO NOTHING",
      [today, mockContent.headline, JSON.stringify(mockContent)]
    );

    return NextResponse.json({ ok: true, mock: true, date: today, content: mockContent });
  }

  // Generate with Metis AI
  const prompt = `
امروز ${new Date().toLocaleDateString("fa-IR")} است.
تو سردبیر «مجله AI» هستی — یه نشریه روزانه فارسی که مهم‌ترین اتفاقات هوش مصنوعی ۲۴ ساعت گذشته رو با تون دوستانه و کمی FOMO-inducing پوشش می‌ده.

یه مقاله روزانه بنویس. دقیقاً این JSON رو return کن (بدون توضیح اضافه):
{
  "headline": "تیتر اصلی جذاب فارسی",
  "intro": "یه جمله کوتاه که کاربر رو hook کنه",
  "items": [
    { "title": "عنوان خبر ۱", "body": "متن خبر ۱ - ۲-۳ جمله فارسی" },
    { "title": "عنوان خبر ۲", "body": "متن خبر ۲" },
    { "title": "عنوان خبر ۳", "body": "متن خبر ۳" },
    { "title": "عنوان خبر ۴", "body": "متن خبر ۴" },
    { "title": "عنوان خبر ۵", "body": "متن خبر ۵" }
  ],
  "tool_of_day": {
    "name": "اسم ابزار AI روز",
    "why": "یه جمله کوتاه چرا این ابزار مهمه"
  }
}

محتوا باید:
- واقع‌بینانه و مرتبط با اتفاقات اخیر AI باشه
- تون: دوستانه، شفاف، کمی اورژانسی («اگه نخونی عقب می‌مونی»)
- فارسی روان، نه ترجمه ماشینی
- tool_of_day باید یه ابزار واقعی و کاربردی باشه
`.trim();

  try {
    const metisRes = await fetch(`${METIS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${METIS_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [
          { role: "system", content: "تو یه نویسنده مجله AI هستی. دقیقاً JSON بده بدون هیچ توضیح اضافه." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!metisRes.ok) throw new Error(`Metis error: ${metisRes.status}`);

    const data = await metisRes.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const content = JSON.parse(jsonMatch[0]);

    await pool.query(
      "INSERT INTO magazine_articles (date, title, content_json) VALUES ($1, $2, $3) ON CONFLICT (date) DO UPDATE SET title=EXCLUDED.title, content_json=EXCLUDED.content_json, generated_at=NOW()",
      [today, content.headline, JSON.stringify(content)]
    );

    return NextResponse.json({ ok: true, date: today, content });
  } catch (e) {
    return NextResponse.json({ error: "generation_failed", detail: String(e) }, { status: 500 });
  }
}
