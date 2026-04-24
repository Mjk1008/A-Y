/**
 * jobs.ts — Job listing crawler
 *
 * Fetches job postings from Iranian job boards and normalizes them
 * into a standard format for the job-matching feature.
 *
 * Targets:
 *   - Jobinja (jobinja.ir) — largest Iranian job board
 *   - Jobvision (jobvision.ir) — tech-focused
 *   - IranTalent (irantalent.com) — senior roles
 *   - LinkedIn (search.linkedin.com) — international
 *
 * Run as a cron: node -r ts-node/register src/lib/crawlers/jobs.ts
 * Or schedule via: vercel cron / GitHub Actions / your infra.
 *
 * Output: writes to `job_listings` table in Postgres.
 */

export interface JobListing {
  id?:            string;
  source:         "jobinja" | "jobvision" | "irantalent" | "linkedin" | "other";
  title:          string;
  company:        string;
  location:       string;       /* e.g. "تهران" | "ریموت" */
  industry:       string;
  skills_required: string[];
  description:    string;
  url:            string;
  posted_at:      Date;
  is_remote:      boolean;
  salary_min?:    number;       /* in Toman */
  salary_max?:    number;
}

/* ─────────────────────────────────────────────────────────────────
   JOBINJA CRAWLER
   Uses their public search API (no auth required for basic search).
───────────────────────────────────────────────────────────────── */
export async function crawlJobinja(query: string, page = 1): Promise<JobListing[]> {
  const url = `https://jobinja.ir/api/jobs/search?q=${encodeURIComponent(query)}&page=${page}&per_page=20`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "AY-JobMatcher/1.0 (+https://ay.app)",
    },
    next: { revalidate: 3600 },   /* Next.js ISR cache for 1 hour */
  });

  if (!res.ok) {
    console.warn(`[jobs:jobinja] HTTP ${res.status} for query "${query}"`);
    return [];
  }

  const data = await res.json();
  const jobs: JobItem[] = data?.data?.jobs ?? data?.jobs ?? [];

  return jobs.map((j) => ({
    source:          "jobinja" as const,
    title:           j.title ?? "",
    company:         j.company?.name ?? j.company_name ?? "",
    location:        j.city ?? j.location ?? "نامشخص",
    industry:        j.category ?? j.industry ?? "",
    skills_required: parseSkills(j.tags ?? j.skills ?? []),
    description:     j.description ?? j.summary ?? "",
    url:             `https://jobinja.ir${j.slug ? `/jobs/${j.slug}` : ""}`,
    posted_at:       new Date(j.published_at ?? j.created_at ?? Date.now()),
    is_remote:       detectRemote(j),
    salary_min:      j.salary_min ?? undefined,
    salary_max:      j.salary_max ?? undefined,
  }));
}

/* ─────────────────────────────────────────────────────────────────
   JOBVISION CRAWLER
───────────────────────────────────────────────────────────────── */
export async function crawlJobvision(query: string): Promise<JobListing[]> {
  const url = `https://jobvision.ir/api/v2/jobs?q=${encodeURIComponent(query)}&limit=20`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "AY-JobMatcher/1.0",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.warn(`[jobs:jobvision] HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  const jobs: JobItem[] = data?.items ?? data?.data ?? [];

  return jobs.map((j) => ({
    source:          "jobvision" as const,
    title:           j.title ?? "",
    company:         j.company?.name ?? j.company_name ?? "",
    location:        j.location ?? j.city ?? "نامشخص",
    industry:        j.field ?? j.category ?? "",
    skills_required: parseSkills(j.skills ?? j.tags ?? []),
    description:     j.description ?? "",
    url:             j.url ?? j.link ?? "",
    posted_at:       new Date(j.created_at ?? j.published_at ?? Date.now()),
    is_remote:       detectRemote(j),
  }));
}

/* ─────────────────────────────────────────────────────────────────
   AGGREGATE — run all crawlers for a profile's skills/industry
───────────────────────────────────────────────────────────────── */
export async function fetchJobsForProfile(params: {
  job_title: string;
  industry:  string;
  skills:    string[];
}): Promise<JobListing[]> {
  const query = `${params.job_title} ${params.skills.slice(0, 3).join(" ")}`.trim();

  const [jobinjaResults, jobvisionResults] = await Promise.allSettled([
    crawlJobinja(query),
    crawlJobvision(query),
  ]);

  const all: JobListing[] = [];

  if (jobinjaResults.status === "fulfilled") all.push(...jobinjaResults.value);
  if (jobvisionResults.status === "fulfilled") all.push(...jobvisionResults.value);

  /* Deduplicate by URL */
  const seen = new Set<string>();
  return all.filter((j) => {
    if (!j.url || seen.has(j.url)) return false;
    seen.add(j.url);
    return true;
  });
}

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
type JobItem = Record<string, unknown> & {
  title?: string;
  company?: { name?: string };
  company_name?: string;
  city?: string;
  location?: string;
  category?: string;
  industry?: string;
  field?: string;
  tags?: unknown[];
  skills?: unknown[];
  description?: string;
  summary?: string;
  slug?: string;
  url?: string;
  link?: string;
  published_at?: string;
  created_at?: string;
  salary_min?: number;
  salary_max?: number;
  work_type?: string;
};

function parseSkills(raw: unknown[]): string[] {
  return raw
    .map((s) => (typeof s === "string" ? s : (s as { name?: string })?.name ?? ""))
    .filter(Boolean)
    .slice(0, 10);
}

function detectRemote(j: JobItem): boolean {
  const text = `${j.title ?? ""} ${j.location ?? ""} ${j.work_type ?? ""}`.toLowerCase();
  return text.includes("ریموت") || text.includes("remote") || text.includes("دورکاری");
}
