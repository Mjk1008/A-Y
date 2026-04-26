/**
 * GET /api/jobs
 *
 * Query params:
 *   q        — search in title/company/skills (optional)
 *   source   — filter by source (optional)
 *   remote   — "true" for remote only (optional)
 *   days     — look back N days (default 7)
 *   limit    — max results (default 30, max 100)
 *   offset   — pagination (default 0)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ── Mock jobs (shown when crawler hasn't seeded data yet) ── */
const MOCK_JOBS = [
  { id:"m1", source:"jobinja", title:"کارشناس دیجیتال مارکتینگ", company:"دیجی‌کالا", location:"تهران", skills:["SEO","Google Ads","تولید محتوا","Analytics","ایمیل مارکتینگ"], url:"https://jobinja.ir", posted_at: new Date(Date.now()-1*864e5).toISOString(), is_remote:false },
  { id:"m2", source:"jobvision", title:"برنامه‌نویس فرانت‌اند (React)", company:"فناپ", location:"تهران", skills:["React","TypeScript","Next.js","Tailwind","REST API"], url:"https://jobvision.ir", posted_at: new Date(Date.now()-2*864e5).toISOString(), is_remote:true },
  { id:"m3", source:"irantalent", title:"مشاور فروش B2B", company:"تپسی", location:"تهران", skills:["مذاکره","CRM","فروش","Excel","ارتباط با مشتری"], url:"https://irantalent.com", posted_at: new Date(Date.now()-1*864e5).toISOString(), is_remote:false },
  { id:"m4", source:"karboom", title:"طراح UI/UX", company:"آپ", location:"تهران", skills:["Figma","طراحی رابط کاربری","Prototyping","تحقیق کاربری","Adobe XD"], url:"https://karboom.io", posted_at: new Date(Date.now()-3*864e5).toISOString(), is_remote:true },
  { id:"m5", source:"jobinja", title:"کارشناس تولید محتوا", company:"اسنپ", location:"تهران", skills:["نگارش","سئو","شبکه اجتماعی","ویرایش","WordPress"], url:"https://jobinja.ir", posted_at: new Date(Date.now()-2*864e5).toISOString(), is_remote:false },
  { id:"m6", source:"jobvision", title:"تحلیلگر داده", company:"زرین‌پال", location:"تهران", skills:["Python","SQL","Power BI","Excel","داده‌کاوی"], url:"https://jobvision.ir", posted_at: new Date(Date.now()-4*864e5).toISOString(), is_remote:true },
  { id:"m7", source:"irantalent", title:"مدیر محصول (Product Manager)", company:"ایرانسل", location:"تهران", skills:["مدیریت محصول","Agile","Jira","تحلیل رقبا","رودمپ محصول"], url:"https://irantalent.com", posted_at: new Date(Date.now()-1*864e5).toISOString(), is_remote:false },
  { id:"m8", source:"karboom", title:"برنامه‌نویس بک‌اند (Node.js)", company:"بالانس", location:"مشهد", skills:["Node.js","TypeScript","PostgreSQL","Docker","REST API"], url:"https://karboom.io", posted_at: new Date(Date.now()-5*864e5).toISOString(), is_remote:true },
  { id:"m9", source:"jobinja", title:"کارشناس منابع انسانی", company:"همراه اول", location:"تهران", skills:["استخدام","HRIS","ارزیابی عملکرد","آموزش","قانون کار"], url:"https://jobinja.ir", posted_at: new Date(Date.now()-3*864e5).toISOString(), is_remote:false },
  { id:"m10", source:"jobvision", title:"کارشناس ارشد حسابداری", company:"مپنا", location:"تهران", skills:["حسابداری","Excel","Sage","گزارش‌گیری مالی","مالیات"], url:"https://jobvision.ir", posted_at: new Date(Date.now()-2*864e5).toISOString(), is_remote:false },
  { id:"m11", source:"irantalent", title:"مهندس DevOps", company:"آریاتک", location:"تهران", skills:["Docker","Kubernetes","CI/CD","Linux","AWS"], url:"https://irantalent.com", posted_at: new Date(Date.now()-1*864e5).toISOString(), is_remote:true },
  { id:"m12", source:"karboom", title:"کارشناس روابط عمومی", company:"بانک ملت", location:"تهران", skills:["روابط رسانه‌ای","بیانیه مطبوعاتی","مدیریت بحران","شبکه اجتماعی","ارتباطات"], url:"https://karboom.io", posted_at: new Date(Date.now()-6*864e5).toISOString(), is_remote:false },
  { id:"m13", source:"jobinja", title:"کارشناس پشتیبانی مشتری", company:"اسنپ‌فود", location:"تهران", skills:["خدمات مشتری","CRM","Excel","مهارت ارتباطی","حل مشکل"], url:"https://jobinja.ir", posted_at: new Date(Date.now()-2*864e5).toISOString(), is_remote:true },
  { id:"m14", source:"jobvision", title:"طراح گرافیک ارشد", company:"ونک‌استودیو", location:"اصفهان", skills:["Photoshop","Illustrator","برندینگ","طراحی بسته‌بندی","Typography"], url:"https://jobvision.ir", posted_at: new Date(Date.now()-4*864e5).toISOString(), is_remote:true },
  { id:"m15", source:"karboom", title:"مهندس هوش مصنوعی", company:"آواتک", location:"تهران", skills:["Python","TensorFlow","یادگیری ماشین","NLP","PyTorch"], url:"https://karboom.io", posted_at: new Date(Date.now()-1*864e5).toISOString(), is_remote:false },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q")      ?? "";
  const source = searchParams.get("source") ?? "";
  const remote = searchParams.get("remote") === "true";
  const days   = Math.min(30, parseInt(searchParams.get("days") ?? "7"));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "30"));
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const conditions: string[] = [
    `crawled_at >= NOW() - INTERVAL '${days} days'`,
  ];
  const values: unknown[] = [];

  if (q) {
    values.push(`%${q}%`);
    const n = values.length;
    conditions.push(
      `(title ILIKE $${n} OR company ILIKE $${n} OR description ILIKE $${n} ` +
      `OR $${n} = ANY(skills))`
    );
  }
  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }
  if (remote) {
    conditions.push("is_remote = TRUE");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    /* First make sure table exists */
    await pool.query(`CREATE TABLE IF NOT EXISTS crawled_jobs (
      id SERIAL PRIMARY KEY, source TEXT, title TEXT, company TEXT,
      location TEXT, skills TEXT[], description TEXT, url TEXT UNIQUE,
      posted_at TIMESTAMPTZ, is_remote BOOLEAN, crawled_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    // Check total count (no date filter) for seed decision
    const totalAllTime = parseInt(
      (await pool.query("SELECT COUNT(*) FROM crawled_jobs")).rows[0].count
    );

    if (totalAllTime === 0) {
      // Seed curated jobs into DB so they're persistent and real
      for (const j of MOCK_JOBS) {
        await pool.query(
          `INSERT INTO crawled_jobs (source, title, company, location, skills, description, url, posted_at, is_remote, crawled_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
           ON CONFLICT (url) DO UPDATE SET crawled_at=NOW()`,
          [j.source, j.title, j.company, j.location, j.skills, "", j.url + "?seed=" + j.id, j.posted_at, j.is_remote]
        ).catch(() => {});
      }
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM crawled_jobs ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    if (total === 0 && totalAllTime === 0) {
      // DB seed failed entirely, return in-memory fallback
      let mock = MOCK_JOBS;
      if (q) mock = mock.filter(j => j.title.includes(q) || j.company.includes(q) || j.skills.some(s => s.includes(q)));
      if (remote) mock = mock.filter(j => j.is_remote);
      return NextResponse.json({ total: mock.length, limit, offset, jobs: mock.slice(offset, offset + limit) });
    }

    values.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT id, source, title, company, location, skills, description,
              url, posted_at, is_remote, crawled_at
       FROM crawled_jobs ${where}
       ORDER BY posted_at DESC NULLS LAST
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return NextResponse.json({
      total,
      limit,
      offset,
      jobs: dataResult.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
