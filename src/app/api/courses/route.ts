/**
 * GET /api/courses
 *
 * Query params:
 *   q        — search in title/description/topics (optional)
 *   level    — beginner | intermediate | advanced (optional)
 *   free     — "true" for free only (optional)
 *   source   — filter by platform (optional)
 *   limit    — max results (default 20, max 50)
 *   offset   — pagination (default 0)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ── Mock courses (shown when crawler hasn't seeded data yet) ── */
const MOCK_COURSES = [
  { id:"c1", source:"maktabkhooneh", title:"هوش مصنوعی برای همه — از صفر تا کاربرد", instructor:"دکتر علی رضایی", platform:"مکتب‌خونه", url:"https://maktabkhooneh.org", thumbnail:"", description:"یاد بگیر چطور از ابزارهای AI در کار روزمره‌ات استفاده کنی بدون نیاز به کدنویسی.", level:"beginner", duration_hours:8, price_toman:0, rating:4.7, rating_count:1240, topics:["ChatGPT","هوش مصنوعی","بهره‌وری","ابزارهای AI"], is_farsi:true, has_certificate:true },
  { id:"c2", source:"quera", title:"Python برای تحلیل داده", instructor:"سارا احمدی", platform:"کوئرا", url:"https://quera.org", thumbnail:"", description:"با پایتون، Pandas و Matplotlib داده‌هایت رو تحلیل کن و نمودار بکش.", level:"intermediate", duration_hours:24, price_toman:890000, rating:4.8, rating_count:876, topics:["Python","Pandas","داده‌کاوی","Matplotlib","Jupyter"], is_farsi:true, has_certificate:true },
  { id:"c3", source:"faranesh", title:"دیجیتال مارکتینگ حرفه‌ای", instructor:"محمد کریمی", platform:"فرانش", url:"https://faranesh.com", thumbnail:"", description:"از SEO و تبلیغات کلیکی تا ایمیل مارکتینگ و شبکه‌های اجتماعی.", level:"beginner", duration_hours:18, price_toman:650000, rating:4.6, rating_count:2100, topics:["SEO","Google Ads","ایمیل مارکتینگ","شبکه اجتماعی","Analytics"], is_farsi:true, has_certificate:true },
  { id:"c4", source:"maktabkhooneh", title:"طراحی UI/UX با Figma", instructor:"نگار محمودی", platform:"مکتب‌خونه", url:"https://maktabkhooneh.org", thumbnail:"", description:"از wireframe تا prototype — طراحی رابط کاربری با Figma رو از صفر یاد بگیر.", level:"beginner", duration_hours:14, price_toman:0, rating:4.5, rating_count:930, topics:["Figma","UI Design","UX","Prototyping","طراحی"], is_farsi:true, has_certificate:false },
  { id:"c5", source:"quera", title:"React و Next.js — ساخت اپ‌های مدرن", instructor:"امیر حسینی", platform:"کوئرا", url:"https://quera.org", thumbnail:"", description:"با React 18 و Next.js 14 یه اپلیکیشن کامل بساز.", level:"intermediate", duration_hours:32, price_toman:1200000, rating:4.9, rating_count:560, topics:["React","Next.js","TypeScript","Tailwind","فرانت‌اند"], is_farsi:true, has_certificate:true },
  { id:"c6", source:"faranesh", title:"مدیریت پروژه چابک (Agile & Scrum)", instructor:"زهرا صادقی", platform:"فرانش", url:"https://faranesh.com", thumbnail:"", description:"اصول Agile، Scrum و Kanban رو یاد بگیر و تیمت رو بهتر مدیریت کن.", level:"beginner", duration_hours:10, price_toman:480000, rating:4.4, rating_count:1540, topics:["Agile","Scrum","Kanban","مدیریت پروژه","Jira"], is_farsi:true, has_certificate:true },
  { id:"c7", source:"maktabkhooneh", title:"اکسل پیشرفته برای تحلیل‌گران", instructor:"رضا قاسمی", platform:"مکتب‌خونه", url:"https://maktabkhooneh.org", thumbnail:"", description:"Power Query، Pivot Table، ماکرو و داشبورد سازی با Excel.", level:"intermediate", duration_hours:16, price_toman:0, rating:4.6, rating_count:3200, topics:["Excel","Power Query","Pivot Table","داده","تحلیل"], is_farsi:true, has_certificate:false },
  { id:"c8", source:"quera", title:"یادگیری ماشین با Python — مقدماتی تا پیشرفته", instructor:"دکتر مریم نجفی", platform:"کوئرا", url:"https://quera.org", thumbnail:"", description:"الگوریتم‌های ML، scikit-learn، و پیاده‌سازی مدل‌های واقعی.", level:"advanced", duration_hours:48, price_toman:1800000, rating:4.8, rating_count:340, topics:["Machine Learning","Python","scikit-learn","یادگیری ماشین","آمار"], is_farsi:true, has_certificate:true },
  { id:"c9", source:"faranesh", title:"مهارت‌های ارتباطی و مذاکره", instructor:"پدرام کمالی", platform:"فرانش", url:"https://faranesh.com", thumbnail:"", description:"فن بیان، مذاکره حرفه‌ای، و ارتباط مؤثر در محیط کار.", level:"beginner", duration_hours:6, price_toman:320000, rating:4.3, rating_count:2800, topics:["ارتباطات","مذاکره","فن بیان","کار تیمی","رهبری"], is_farsi:true, has_certificate:false },
  { id:"c10", source:"maktabkhooneh", title:"SQL و پایگاه داده از صفر", instructor:"حامد ملکی", platform:"مکتب‌خونه", url:"https://maktabkhooneh.org", thumbnail:"", description:"MySQL، PostgreSQL و طراحی دیتابیس برای توسعه‌دهندگان و تحلیل‌گران.", level:"beginner", duration_hours:20, price_toman:0, rating:4.7, rating_count:1890, topics:["SQL","PostgreSQL","MySQL","پایگاه داده","Query"], is_farsi:true, has_certificate:true },
  { id:"c11", source:"quera", title:"حسابداری مالی با نرم‌افزار", instructor:"فاطمه نوری", platform:"کوئرا", url:"https://quera.org", thumbnail:"", description:"حسابداری عملی با Sage و نرم‌افزارهای ایرانی، گزارش‌گیری و تراز.", level:"beginner", duration_hours:12, price_toman:550000, rating:4.2, rating_count:760, topics:["حسابداری","Sage","گزارش مالی","تراز","مالیات"], is_farsi:true, has_certificate:true },
  { id:"c12", source:"faranesh", title:"تولید محتوای حرفه‌ای با هوش مصنوعی", instructor:"شیرین موسوی", platform:"فرانش", url:"https://faranesh.com", thumbnail:"", description:"ChatGPT، Midjourney و Canva AI رو برای تولید محتوای سریع و باکیفیت یاد بگیر.", level:"beginner", duration_hours:7, price_toman:0, rating:4.5, rating_count:4100, topics:["ChatGPT","Midjourney","تولید محتوا","AI","Canva"], is_farsi:true, has_certificate:false },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q")      ?? "";
  const level  = searchParams.get("level")  ?? "";
  const free   = searchParams.get("free")   === "true";
  const source = searchParams.get("source") ?? "";
  const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (q) {
    values.push(`%${q}%`);
    const n = values.length;
    conditions.push(`(title ILIKE $${n} OR description ILIKE $${n})`);
  }
  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }
  if (free) {
    conditions.push("price_toman = 0");
  }
  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS crawled_courses (
      id SERIAL PRIMARY KEY, source TEXT, title TEXT, instructor TEXT,
      platform TEXT, url TEXT UNIQUE, thumbnail TEXT, description TEXT,
      level TEXT, duration_hours INTEGER DEFAULT 0, price_toman INTEGER DEFAULT 0,
      rating NUMERIC(3,1) DEFAULT 0, rating_count INTEGER DEFAULT 0,
      topics TEXT[], is_farsi BOOLEAN DEFAULT TRUE,
      has_certificate BOOLEAN DEFAULT FALSE, crawled_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM crawled_courses ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    if (total === 0) {
      // Crawler not connected yet — return mock data with filtering applied
      let mock = MOCK_COURSES;
      if (q) mock = mock.filter(c => c.title.includes(q) || c.description.includes(q) || c.topics.some(t => t.includes(q)));
      if (level) mock = mock.filter(c => c.level === level);
      if (free) mock = mock.filter(c => c.price_toman === 0);
      if (source) mock = mock.filter(c => c.source === source);
      mock = mock.sort((a, b) => b.rating - a.rating || b.rating_count - a.rating_count);
      return NextResponse.json({ total: mock.length, limit, offset, courses: mock.slice(offset, offset + limit) });
    }

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, source, title, instructor, platform, url, thumbnail,
              description, level, duration_hours, price_toman,
              rating, rating_count, topics, is_farsi, has_certificate, crawled_at
       FROM crawled_courses ${where}
       ORDER BY rating DESC, rating_count DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json({
      total,
      limit,
      offset,
      courses: dataResult.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
