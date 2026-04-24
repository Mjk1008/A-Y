/**
 * courses.ts — Iranian online course crawler
 *
 * Fetches AI-related courses from Iranian platforms and normalizes
 * them for the "دوره‌های منتخب" (Curated Courses) feature.
 *
 * Sources:
 *   - Maktabkhooneh (maktabkhooneh.org) — largest Persian tech edu platform
 *   - Faradars (faradars.org) — strong data science / AI content
 *   - Toplearn (toplearn.com) — bootcamp-style courses
 *   - Coursera/Udemy (filtered for Farsi subs or popular AI courses)
 *
 * Run weekly (AI course landscape changes slowly).
 */

export interface Course {
  id?:           string;
  source:        "maktabkhooneh" | "faradars" | "toplearn" | "coursera" | "udemy" | "other";
  title:         string;
  instructor:    string;
  platform:      string;
  url:           string;
  thumbnail?:    string;
  description:   string;
  level:         "beginner" | "intermediate" | "advanced";
  duration_hours: number;
  price_toman:   number;    /* 0 = free */
  rating:        number;    /* 0–5 */
  rating_count:  number;
  topics:        string[];  /* tags like ["Python", "ChatGPT", "Prompt Engineering"] */
  industry_fit:  string[];  /* which industries this is good for */
  is_farsi:      boolean;
  has_certificate: boolean;
  last_updated:  Date;
}

/* ─────────────────────────────────────────────────────────────────
   CURATED SEED — always available, hand-picked quality
───────────────────────────────────────────────────────────────── */
export const CURATED_COURSES: Course[] = [
  {
    source: "maktabkhooneh",
    title: "آموزش کامل ChatGPT و Prompt Engineering",
    instructor: "مکتب‌خونه",
    platform: "مکتب‌خونه",
    url: "https://maktabkhooneh.org/course/chatgpt",
    description: "آموزش کامل کار با ChatGPT از صفر — نوشتن پرامپت حرفه‌ای، استفاده در کار روزمره",
    level: "beginner",
    duration_hours: 6,
    price_toman: 0,
    rating: 4.6,
    rating_count: 2400,
    topics: ["ChatGPT", "Prompt Engineering", "هوش مصنوعی"],
    industry_fit: ["همه صنایع"],
    is_farsi: true,
    has_certificate: true,
    last_updated: new Date("2024-09-01"),
  },
  {
    source: "faradars",
    title: "یادگیری ماشین با Python — از صفر تا پیشرفته",
    instructor: "فرادرس",
    platform: "فرادرس",
    url: "https://faradars.org/courses/fvml9603",
    description: "یادگیری ماشین کامل با Python، scikit-learn، TensorFlow و پروژه‌های واقعی",
    level: "intermediate",
    duration_hours: 40,
    price_toman: 390_000,
    rating: 4.8,
    rating_count: 5600,
    topics: ["Machine Learning", "Python", "TensorFlow", "scikit-learn"],
    industry_fit: ["داده و تحلیل", "توسعه نرم‌افزار", "مهندسی"],
    is_farsi: true,
    has_certificate: true,
    last_updated: new Date("2024-06-01"),
  },
  {
    source: "maktabkhooneh",
    title: "هوش مصنوعی در دیجیتال مارکتینگ",
    instructor: "مکتب‌خونه",
    platform: "مکتب‌خونه",
    url: "https://maktabkhooneh.org/course/ai-marketing",
    description: "استفاده از AI در تولید محتوا، سئو، تبلیغات و تحلیل رقبا",
    level: "beginner",
    duration_hours: 8,
    price_toman: 0,
    rating: 4.5,
    rating_count: 1800,
    topics: ["AI Marketing", "ChatGPT", "Midjourney", "محتوا"],
    industry_fit: ["دیجیتال مارکتینگ", "محتوا و کپی‌رایتینگ", "فروش"],
    is_farsi: true,
    has_certificate: false,
    last_updated: new Date("2024-08-01"),
  },
  {
    source: "coursera",
    title: "AI For Everyone — Andrew Ng",
    instructor: "Andrew Ng",
    platform: "Coursera",
    url: "https://coursera.org/learn/ai-for-everyone",
    description: "دوره معروف اندرو انگ برای مدیران و غیرمتخصصان — بدون کد، فهم عمیق از AI",
    level: "beginner",
    duration_hours: 6,
    price_toman: 0,
    rating: 4.8,
    rating_count: 86000,
    topics: ["AI Strategy", "Machine Learning Basics", "Business AI"],
    industry_fit: ["مدیریت", "مدیریت پروژه", "منابع انسانی", "فروش"],
    is_farsi: false,
    has_certificate: true,
    last_updated: new Date("2024-01-01"),
  },
  {
    source: "toplearn",
    title: "آموزش Midjourney و DALL-E برای طراحان",
    instructor: "تاپ‌لرن",
    platform: "TopLearn",
    url: "https://toplearn.com/courses/midjourney",
    description: "تولید تصویر حرفه‌ای با AI برای طراحان گرافیک و UI",
    level: "beginner",
    duration_hours: 5,
    price_toman: 149_000,
    rating: 4.4,
    rating_count: 920,
    topics: ["Midjourney", "DALL-E", "Stable Diffusion", "طراحی AI"],
    industry_fit: ["طراحی UI/UX", "دیجیتال مارکتینگ", "محتوا و کپی‌رایتینگ"],
    is_farsi: true,
    has_certificate: true,
    last_updated: new Date("2024-07-01"),
  },
  {
    source: "faradars",
    title: "پردازش زبان طبیعی (NLP) با Python",
    instructor: "فرادرس",
    platform: "فرادرس",
    url: "https://faradars.org/courses/nlp-python",
    description: "NLP از NLTK تا Transformers و BERT — برای دولوپرهای پیشرفته",
    level: "advanced",
    duration_hours: 25,
    price_toman: 450_000,
    rating: 4.7,
    rating_count: 1200,
    topics: ["NLP", "Python", "BERT", "Transformers", "LLM"],
    industry_fit: ["توسعه نرم‌افزار", "داده و تحلیل"],
    is_farsi: true,
    has_certificate: true,
    last_updated: new Date("2024-05-01"),
  },
  {
    source: "maktabkhooneh",
    title: "استفاده از AI در حسابداری و مالی",
    instructor: "مکتب‌خونه",
    platform: "مکتب‌خونه",
    url: "https://maktabkhooneh.org/course/ai-finance",
    description: "اتوماسیون گزارش‌دهی مالی، تحلیل داده با Excel AI و ChatGPT برای حسابداران",
    level: "beginner",
    duration_hours: 4,
    price_toman: 0,
    rating: 4.3,
    rating_count: 650,
    topics: ["Excel AI", "ChatGPT", "حسابداری", "گزارش مالی"],
    industry_fit: ["حسابداری و مالی", "مدیریت"],
    is_farsi: true,
    has_certificate: false,
    last_updated: new Date("2024-10-01"),
  },
  {
    source: "udemy",
    title: "ChatGPT & AI Tools for Productivity — Complete Guide",
    instructor: "Various",
    platform: "Udemy",
    url: "https://udemy.com/course/chatgpt-ai-productivity",
    description: "۵۰+ ابزار AI برای افزایش بهره‌وری در کار — برای همه صنایع",
    level: "beginner",
    duration_hours: 12,
    price_toman: 0,   /* often on sale */
    rating: 4.5,
    rating_count: 32000,
    topics: ["ChatGPT", "AI Productivity", "Automation", "Notion AI"],
    industry_fit: ["همه صنایع"],
    is_farsi: false,
    has_certificate: true,
    last_updated: new Date("2024-09-01"),
  },
];

/* ─────────────────────────────────────────────────────────────────
   MAKTABKHOONEH CRAWLER
───────────────────────────────────────────────────────────────── */
export async function crawlMaktabkhooneh(topic = "هوش مصنوعی"): Promise<Partial<Course>[]> {
  const url = `https://maktabkhooneh.org/api/v1/courses/?search=${encodeURIComponent(topic)}&ordering=-students&page_size=20`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "AY-CourseFinder/1.0" },
    next: { revalidate: 86400 },   /* 24h cache */
  });

  if (!res.ok) {
    console.warn(`[courses:maktabkhooneh] HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  const courses: MKCourse[] = data?.results ?? data?.courses ?? [];

  return courses.map((c) => ({
    source:          "maktabkhooneh" as const,
    title:           c.title ?? c.name ?? "",
    instructor:      c.teacher?.full_name ?? c.instructor ?? "مکتب‌خونه",
    platform:        "مکتب‌خونه",
    url:             `https://maktabkhooneh.org${c.slug ? `/course/${c.slug}` : ""}`,
    thumbnail:       c.image ?? c.thumbnail,
    description:     c.short_description ?? c.description ?? "",
    level:           mapLevel(c.level),
    duration_hours:  Math.round((c.duration_seconds ?? 0) / 3600),
    price_toman:     c.price ?? 0,
    rating:          c.rate ?? c.rating ?? 4.0,
    rating_count:    c.students_count ?? c.enrolled ?? 0,
    topics:          c.tags?.map((t: { name?: string } | string) => typeof t === "string" ? t : t?.name ?? "") ?? [],
    is_farsi:        true,
    has_certificate: c.has_certificate ?? false,
    last_updated:    new Date(c.updated_at ?? Date.now()),
  }));
}

/* ─────────────────────────────────────────────────────────────────
   FILTER courses relevant to a profile
───────────────────────────────────────────────────────────────── */
export function filterCoursesForProfile(params: {
  industry:          string;
  years_experience:  number;
  plan:              "free" | "pro" | "max";
}): Course[] {
  const level: Course["level"] =
    params.years_experience < 2
      ? "beginner"
      : params.years_experience < 6
      ? "intermediate"
      : "advanced";

  const maxCourses = params.plan === "free" ? 2 : params.plan === "pro" ? 5 : 10;

  return CURATED_COURSES
    .filter((c) =>
      c.industry_fit.includes(params.industry) ||
      c.industry_fit.includes("همه صنایع")
    )
    .sort((a, b) => {
      /* Prefer matching level, then by rating */
      const aLevelMatch = a.level === level ? 1 : 0;
      const bLevelMatch = b.level === level ? 1 : 0;
      if (aLevelMatch !== bLevelMatch) return bLevelMatch - aLevelMatch;
      return b.rating - a.rating;
    })
    .slice(0, maxCourses);
}

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
type MKCourse = {
  title?: string;
  name?: string;
  teacher?: { full_name?: string };
  instructor?: string;
  slug?: string;
  image?: string;
  thumbnail?: string;
  short_description?: string;
  description?: string;
  level?: string | number;
  duration_seconds?: number;
  price?: number;
  rate?: number;
  rating?: number;
  students_count?: number;
  enrolled?: number;
  tags?: Array<string | { name?: string }>;
  has_certificate?: boolean;
  updated_at?: string;
};

function mapLevel(raw: string | number | undefined): Course["level"] {
  const s = String(raw ?? "").toLowerCase();
  if (s.includes("مقدمات") || s.includes("beginner") || s === "1") return "beginner";
  if (s.includes("پیشرفته") || s.includes("advanced") || s === "3") return "advanced";
  return "intermediate";
}
