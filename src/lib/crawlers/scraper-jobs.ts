/**
 * scraper-jobs.ts — HTML scraper for Iranian job boards
 *
 * Sources: Jobinja · Jobvision · IranTalent · eEstekhdam · Karboome
 * Strategy: fetch HTML → cheerio parse → normalize → return JobListing[]
 *
 * All scrapers are graceful — a 4xx/5xx or parse error returns []
 * so one broken source never blocks the others.
 */

import * as cheerio from "cheerio";

export interface JobListing {
  source:          string;
  title:           string;
  company:         string;
  location:        string;
  skills_required: string[];
  description:     string;
  url:             string;
  posted_at:       Date;
  is_remote:       boolean;
  salary_range?:   string;
}

/* ── shared fetch helper ──────────────────────────────────────────── */
async function getHtml(url: string, extraHeaders: Record<string, string> = {}): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8",
        ...extraHeaders,
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      console.warn(`[scraper-jobs] ${url} → HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`[scraper-jobs] fetch error ${url}:`, e);
    return null;
  }
}

function isRemote(text: string): boolean {
  return /ریموت|remote|دورکاری|telecommut/i.test(text);
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/* ══════════════════════════════════════════════════════════════════
   JOBINJA — jobinja.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeJobinja(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const url = `https://jobinja.ir/jobs?q=${encodeURIComponent(query)}&sort_by=published_at`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: JobListing[] = [];

  /* Jobinja job cards — multiple selector fallbacks */
  const cards = $(".c-jobListView__item, .job-item, [class*='jobList']").toArray();
  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title =
      cleanText($el.find(".c-jobListView__title a, h2 a, .job-title a, h3 a").first().text()) ||
      cleanText($el.find("a[class*='title']").first().text());

    const company =
      cleanText($el.find(".c-jobListView__companyName, .company-name, [class*='company']").first().text());

    const location =
      cleanText($el.find(".c-jobListView__location, .job-location, [class*='location']").first().text());

    const href =
      $el.find("a").first().attr("href") ?? "";
    const jobUrl = href.startsWith("http") ? href : `https://jobinja.ir${href}`;

    const dateText =
      cleanText($el.find("time, .c-jobListView__date, [class*='date'], [class*='time']").first().text());

    const tags: string[] = [];
    $el.find(".c-tag, .badge, [class*='tag'], [class*='skill']").each((_, t) => {
      const tag = cleanText($(t).text());
      if (tag) tags.push(tag);
    });

    if (!title) continue;

    results.push({
      source:          "jobinja",
      title,
      company:         company || "نامشخص",
      location:        location || "نامشخص",
      skills_required: tags,
      description:     cleanText($el.find("p, .c-jobListView__desc").first().text()),
      url:             jobUrl,
      posted_at:       parseRelativeDate(dateText),
      is_remote:       isRemote(`${title} ${location} ${tags.join(" ")}`),
    });
  }

  return dedup(results);
}

/* ══════════════════════════════════════════════════════════════════
   JOBVISION — jobvision.ir
══════════════════════════════════════════════════════════════════ */
export async function scrapeJobvision(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const url = `https://jobvision.ir/jobs?q=${encodeURIComponent(query)}`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: JobListing[] = [];

  const cards = $(".job-card, .job-item, [class*='jobCard'], [class*='job-list'] > li, article").toArray();
  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2, h3, [class*='title'], .job-title").first().text());
    const company  = cleanText($el.find("[class*='company'], .employer").first().text());
    const location = cleanText($el.find("[class*='location'], .city").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const jobUrl   = href.startsWith("http") ? href : `https://jobvision.ir${href}`;
    const dateText = cleanText($el.find("time, [class*='date'], [class*='ago']").first().text());

    const tags: string[] = [];
    $el.find("[class*='skill'], [class*='tag'], .badge").each((_, t) => {
      const tag = cleanText($(t).text());
      if (tag) tags.push(tag);
    });

    if (!title) continue;

    results.push({
      source:          "jobvision",
      title,
      company:         company || "نامشخص",
      location:        location || "نامشخص",
      skills_required: tags,
      description:     cleanText($el.find("p").first().text()),
      url:             jobUrl,
      posted_at:       parseRelativeDate(dateText),
      is_remote:       isRemote(`${title} ${location}`),
    });
  }

  return dedup(results);
}

/* ══════════════════════════════════════════════════════════════════
   IRANTALENT — irantalent.com
══════════════════════════════════════════════════════════════════ */
export async function scrapeIranTalent(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const url = `https://www.irantalent.com/job-seeker/jobs?query=${encodeURIComponent(query)}`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: JobListing[] = [];

  const cards = $("[class*='jobListItem'], [class*='job-item'], .job-card, article").toArray();
  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2, h3, [class*='title']").first().text());
    const company  = cleanText($el.find("[class*='company'], [class*='employer']").first().text());
    const location = cleanText($el.find("[class*='location'], [class*='city']").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const jobUrl   = href.startsWith("http") ? href : `https://www.irantalent.com${href}`;
    const dateText = cleanText($el.find("time, [class*='date']").first().text());

    if (!title) continue;

    results.push({
      source:          "irantalent",
      title,
      company:         company || "نامشخص",
      location:        location || "نامشخص",
      skills_required: [],
      description:     cleanText($el.find("p").first().text()),
      url:             jobUrl,
      posted_at:       parseRelativeDate(dateText),
      is_remote:       isRemote(`${title} ${location}`),
    });
  }

  return dedup(results);
}

/* ══════════════════════════════════════════════════════════════════
   E-ESTEKHDAM — e-estekhdam.com
══════════════════════════════════════════════════════════════════ */
export async function scrapeEEstekhdam(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const url = `https://www.e-estekhdam.com/شغل/?s=${encodeURIComponent(query)}`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: JobListing[] = [];

  const cards = $(".job-box, .job_listing, article.type-job_listing, [class*='job']").toArray();
  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2 a, h3 a, .job-title, a[class*='title']").first().text());
    const company  = cleanText($el.find(".company, [class*='company'], [class*='employer']").first().text());
    const location = cleanText($el.find(".location, [class*='location'], [class*='city']").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const jobUrl   = href.startsWith("http") ? href : `https://www.e-estekhdam.com${href}`;
    const dateText = cleanText($el.find("time, .date, [class*='date']").first().text());

    if (!title) continue;

    results.push({
      source:          "e-estekhdam",
      title,
      company:         company || "نامشخص",
      location:        location || "نامشخص",
      skills_required: [],
      description:     cleanText($el.find("p").first().text()),
      url:             jobUrl,
      posted_at:       parseRelativeDate(dateText),
      is_remote:       isRemote(`${title} ${location}`),
    });
  }

  return dedup(results);
}

/* ══════════════════════════════════════════════════════════════════
   KARBOOME — karboome.com
══════════════════════════════════════════════════════════════════ */
export async function scrapeKarboome(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const url = `https://karboome.com/jobs?q=${encodeURIComponent(query)}`;
  const html = await getHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results: JobListing[] = [];

  const cards = $("[class*='JobCard'], [class*='job-card'], article, [class*='jobItem']").toArray();
  for (const el of cards.slice(0, 30)) {
    const $el = $(el);

    const title    = cleanText($el.find("h2, h3, [class*='title']").first().text());
    const company  = cleanText($el.find("[class*='company'], [class*='employer']").first().text());
    const location = cleanText($el.find("[class*='location'], [class*='city']").first().text());
    const href     = $el.find("a").first().attr("href") ?? "";
    const jobUrl   = href.startsWith("http") ? href : `https://karboome.com${href}`;
    const dateText = cleanText($el.find("time, [class*='date']").first().text());

    const tags: string[] = [];
    $el.find("[class*='skill'], [class*='tag']").each((_, t) => {
      const tag = cleanText($(t).text());
      if (tag) tags.push(tag);
    });

    if (!title) continue;

    results.push({
      source:          "karboome",
      title,
      company:         company || "نامشخص",
      location:        location || "نامشخص",
      skills_required: tags,
      description:     cleanText($el.find("p").first().text()),
      url:             jobUrl,
      posted_at:       parseRelativeDate(dateText),
      is_remote:       isRemote(`${title} ${location}`),
    });
  }

  return dedup(results);
}

/* ══════════════════════════════════════════════════════════════════
   AGGREGATE — run all 5 scrapers
══════════════════════════════════════════════════════════════════ */
export async function scrapeAllJobs(query = "هوش مصنوعی"): Promise<JobListing[]> {
  const queries = [query, "AI", "machine learning", "یادگیری ماشین", "ChatGPT"];
  const mainQuery = queries[0];

  const [jobinja, jobvision, irantalent, estekhdam, karboome] = await Promise.allSettled([
    scrapeJobinja(mainQuery),
    scrapeJobvision(mainQuery),
    scrapeIranTalent(mainQuery),
    scrapeEEstekhdam(mainQuery),
    scrapeKarboome(mainQuery),
  ]);

  const all: JobListing[] = [];
  for (const r of [jobinja, jobvision, irantalent, estekhdam, karboome]) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  /* Filter last 48 hours */
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recent = all.filter((j) => j.posted_at >= cutoff);

  /* If very few (scrapers might not parse dates well), return all */
  return dedup(recent.length >= 5 ? recent : all).slice(0, 100);
}

/* ── helpers ─────────────────────────────────────────────────────── */
function dedup(jobs: JobListing[]): JobListing[] {
  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = j.url || `${j.title}::${j.company}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Parse Persian/English relative date strings.
 * "دیروز" → yesterday, "امروز" → today, "X روز پیش" → X days ago,
 * "X ساعت پیش" → X hours ago. Falls back to now.
 */
function parseRelativeDate(s: string): Date {
  if (!s) return new Date();
  const now = Date.now();
  if (/امروز|today/i.test(s))  return new Date(now);
  if (/دیروز|yesterday/i.test(s)) return new Date(now - 86400000);

  const hoursMatch = s.match(/(\d+)\s*(ساعت|hour)/);
  if (hoursMatch) return new Date(now - parseInt(hoursMatch[1]) * 3600000);

  const daysMatch = s.match(/(\d+)\s*(روز|day)/);
  if (daysMatch)  return new Date(now - parseInt(daysMatch[1]) * 86400000);

  const weeksMatch = s.match(/(\d+)\s*(هفته|week)/);
  if (weeksMatch) return new Date(now - parseInt(weeksMatch[1]) * 7 * 86400000);

  /* Try ISO / Gregorian date string directly */
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;

  return new Date(); /* fallback: now */
}
