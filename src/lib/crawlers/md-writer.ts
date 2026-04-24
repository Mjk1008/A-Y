/**
 * md-writer.ts — write crawl results to Markdown files under data/
 *
 * These files serve as a human-readable snapshot + offline fallback.
 * The canonical data source for the app is the Postgres DB; .md files
 * are for debugging and manual review.
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { JobListing }     from "./scraper-jobs";
import type { CourseListing }  from "./scraper-courses";
import type { AccountListing } from "./scraper-accounts";

const DATA_DIR = join(process.cwd(), "data");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

/* ── format helpers ───────────────────────────────────────────────── */
function formatToman(n: number): string {
  if (!n) return "رایگان";
  return n.toLocaleString("fa-IR") + " تومان";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fa-IR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ══════════════════════════════════════════════════════════════════
   JOBS
══════════════════════════════════════════════════════════════════ */
export async function writeJobsMd(jobs: JobListing[]): Promise<void> {
  await ensureDataDir();

  const bySource: Record<string, JobListing[]> = {};
  for (const j of jobs) {
    (bySource[j.source] ??= []).push(j);
  }

  const lines: string[] = [
    `# موقعیت‌های شغلی AI`,
    ``,
    `> آخرین به‌روزرسانی: ${formatDate(new Date())}`,
    `> تعداد کل: **${jobs.length}** موقعیت از ${Object.keys(bySource).length} منبع`,
    ``,
  ];

  for (const [source, list] of Object.entries(bySource)) {
    lines.push(`## ${source} (${list.length} موقعیت)`);
    lines.push("");
    for (const j of list) {
      lines.push(`### ${j.title}`);
      lines.push(`- **شرکت:** ${j.company}`);
      lines.push(`- **محل:** ${j.location}${j.is_remote ? " 🌐 ریموت" : ""}`);
      if (j.salary_range) lines.push(`- **حقوق:** ${j.salary_range}`);
      if (j.skills_required.length)
        lines.push(`- **مهارت‌ها:** ${j.skills_required.join(", ")}`);
      lines.push(`- **تاریخ:** ${formatDate(j.posted_at)}`);
      lines.push(`- **لینک:** [مشاهده آگهی](${j.url})`);
      if (j.description) lines.push(``, j.description.slice(0, 200) + (j.description.length > 200 ? "…" : ""));
      lines.push("");
    }
  }

  await writeFile(join(DATA_DIR, "jobs.md"), lines.join("\n"), "utf-8");
}

/* ══════════════════════════════════════════════════════════════════
   COURSES
══════════════════════════════════════════════════════════════════ */
export async function writeCoursesMd(courses: CourseListing[]): Promise<void> {
  await ensureDataDir();

  const bySource: Record<string, CourseListing[]> = {};
  for (const c of courses) {
    (bySource[c.source] ??= []).push(c);
  }

  const lines: string[] = [
    `# دوره‌های آموزش AI`,
    ``,
    `> آخرین به‌روزرسانی: ${formatDate(new Date())}`,
    `> تعداد کل: **${courses.length}** دوره از ${Object.keys(bySource).length} پلتفرم`,
    ``,
  ];

  for (const [source, list] of Object.entries(bySource)) {
    lines.push(`## ${source} (${list.length} دوره)`);
    lines.push("");
    for (const c of list) {
      lines.push(`### ${c.title}`);
      lines.push(`- **مدرس:** ${c.instructor}`);
      lines.push(`- **قیمت:** ${formatToman(c.price_toman)}`);
      if (c.rating > 0) lines.push(`- **امتیاز:** ${c.rating}/۵ (${c.rating_count} نفر)`);
      if (c.duration_hours > 0) lines.push(`- **مدت:** ${c.duration_hours} ساعت`);
      lines.push(`- **سطح:** ${c.level}`);
      if (c.topics.length) lines.push(`- **موضوعات:** ${c.topics.join(", ")}`);
      lines.push(`- **لینک:** [مشاهده دوره](${c.url})`);
      if (c.description) lines.push(``, c.description.slice(0, 200) + (c.description.length > 200 ? "…" : ""));
      lines.push("");
    }
  }

  await writeFile(join(DATA_DIR, "courses.md"), lines.join("\n"), "utf-8");
}

/* ══════════════════════════════════════════════════════════════════
   ACCOUNTS
══════════════════════════════════════════════════════════════════ */
export async function writeAccountsMd(accounts: AccountListing[]): Promise<void> {
  await ensureDataDir();

  const byCategory: Record<string, AccountListing[]> = {};
  for (const a of accounts) {
    (byCategory[a.category] ??= []).push(a);
  }

  const lines: string[] = [
    `# اکانت‌های پریمیوم AI`,
    ``,
    `> آخرین به‌روزرسانی: ${formatDate(new Date())}`,
    `> تعداد کل: **${accounts.length}** محصول در ${Object.keys(byCategory).length} دسته`,
    ``,
  ];

  for (const [cat, list] of Object.entries(byCategory)) {
    lines.push(`## ${cat} (${list.length} محصول)`);
    lines.push("");
    for (const a of list) {
      const status = a.available ? "✅ موجود" : "❌ ناموجود";
      lines.push(`### ${a.name} — ${status}`);
      lines.push(`- **قیمت:** ${formatToman(a.price_toman)}`);
      lines.push(`- **دوره:** ${a.period}`);
      lines.push(`- **فروشگاه:** ${a.source}`);
      lines.push(`- **لینک:** [خرید](${a.url})`);
      if (a.description) lines.push(``, a.description.slice(0, 150) + (a.description.length > 150 ? "…" : ""));
      lines.push("");
    }
  }

  await writeFile(join(DATA_DIR, "accounts.md"), lines.join("\n"), "utf-8");
}
