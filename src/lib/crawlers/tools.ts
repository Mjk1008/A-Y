/**
 * tools.ts — AI Tools database crawler & curator
 *
 * Keeps our internal AI tool list fresh by pulling from:
 *   - Product Hunt (product hunt API — new AI tools daily)
 *   - There's An AI For That (theresanaiforthat.com)
 *   - Toolify.ai public listings
 *   - Our own curated seed list (always available offline)
 *
 * Each tool is tagged with relevant job categories so the
 * recommendation engine can filter to profile-relevant tools.
 *
 * Run daily as a cron job.
 */

export interface AiTool {
  name:          string;
  tagline:       string;
  description:   string;
  url:           string;
  categories:    string[];   /* e.g. ["طراحی", "کدنویسی", "محتوا"] */
  use_cases:     string[];   /* specific job tasks it helps with */
  pricing_model: "free" | "freemium" | "paid" | "open_source";
  difficulty:    "beginner" | "intermediate" | "advanced";
  learning_time: string;     /* e.g. "۱ ساعت" */
  logo_url?:     string;
  is_iran_accessible: boolean;   /* false = needs VPN in Iran */
  added_at:      Date;
}

/* ─────────────────────────────────────────────────────────────────
   CURATED SEED LIST
   Always returned — no network required. Kept up-to-date manually.
───────────────────────────────────────────────────────────────── */
export const CURATED_TOOLS: AiTool[] = [
  {
    name: "ChatGPT",
    tagline: "دستیار هوشمند همه‌منظوره",
    description: "قوی‌ترین چت‌بات AI برای نوشتن، کدنویسی، تحقیق و تحلیل",
    url: "https://chat.openai.com",
    categories: ["محتوا", "کدنویسی", "تحقیق", "ترجمه", "ایمیل"],
    use_cases: ["نوشتن ایمیل حرفه‌ای", "خلاصه‌سازی گزارش", "دیباگ کد", "ترجمه متن"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۳۰ دقیقه",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Claude",
    tagline: "AI برای تحلیل عمیق و نوشتن دقیق",
    description: "بهترین AI برای تحلیل متن بلند، کدنویسی و محتوای حرفه‌ای",
    url: "https://claude.ai",
    categories: ["محتوا", "کدنویسی", "تحلیل", "ترجمه"],
    use_cases: ["تحلیل قرارداد", "نوشتن گزارش", "ریویو کد", "ترجمه تخصصی"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۳۰ دقیقه",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Midjourney",
    tagline: "تصویرسازی هوشمند با AI",
    description: "بهترین ابزار برای تولید تصویر خلاقانه و حرفه‌ای با هوش مصنوعی",
    url: "https://midjourney.com",
    categories: ["طراحی", "محتوا", "مارکتینگ"],
    use_cases: ["طراحی پست سوشال مدیا", "ایده‌پردازی بصری", "موکاپ برند", "تصویر مقاله"],
    pricing_model: "paid",
    difficulty: "intermediate",
    learning_time: "۲ ساعت",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Cursor",
    tagline: "کدنویسی سریع‌تر با AI",
    description: "ادیتور کد با هوش مصنوعی یکپارچه — کد می‌نویسه، اشکال پیدا می‌کنه، توضیح می‌ده",
    url: "https://cursor.sh",
    categories: ["کدنویسی", "توسعه نرم‌افزار"],
    use_cases: ["تکمیل خودکار کد", "رفع باگ", "ریفکتورینگ", "تولید تست"],
    pricing_model: "freemium",
    difficulty: "intermediate",
    learning_time: "۱ ساعت",
    is_iran_accessible: true,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Perplexity",
    tagline: "جستجوی هوشمند با منابع",
    description: "موتور جستجوی AI که جواب می‌ده و منبع هم می‌ده",
    url: "https://perplexity.ai",
    categories: ["تحقیق", "محتوا", "مدیریت"],
    use_cases: ["تحقیق سریع", "خلاصه اخبار", "بررسی رقبا", "یادگیری موضوع جدید"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۱۵ دقیقه",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Notion AI",
    tagline: "مدیریت محتوا با هوش مصنوعی",
    description: "Notion با AI — نوشتن، خلاصه‌سازی و سازماندهی داده",
    url: "https://notion.so/product/ai",
    categories: ["مدیریت", "محتوا", "تیم"],
    use_cases: ["نوشتن گزارش", "خلاصه جلسه", "ایده‌پردازی", "مستندسازی"],
    pricing_model: "paid",
    difficulty: "beginner",
    learning_time: "۳۰ دقیقه",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Otter.ai",
    tagline: "رونویسی خودکار جلسه",
    description: "جلسه ضبط کن، Otter متن می‌کنه، خلاصه می‌ده",
    url: "https://otter.ai",
    categories: ["مدیریت", "منابع انسانی", "فروش"],
    use_cases: ["رونویسی جلسه", "خلاصه مذاکره", "نکات اکشن", "آرشیو گفتگو"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۲۰ دقیقه",
    is_iran_accessible: true,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "Canva AI",
    tagline: "طراحی سریع با هوش مصنوعی",
    description: "طراحی حرفه‌ای بدون نیاز به دانش طراحی — با قابلیت‌های AI",
    url: "https://canva.com",
    categories: ["طراحی", "مارکتینگ", "محتوا"],
    use_cases: ["طراحی پست اینستاگرام", "ساخت پرزنتیشن", "طراحی بنر", "ویرایش عکس"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۱ ساعت",
    is_iran_accessible: true,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "ElevenLabs",
    tagline: "صداسازی هوشمند با AI",
    description: "تبدیل متن به صدا با کیفیت انسانی — پادکست، ویدیو، آموزش",
    url: "https://elevenlabs.io",
    categories: ["محتوا", "آموزش", "مارکتینگ"],
    use_cases: ["ساخت نریشن ویدیو", "پادکست", "آموزش صوتی", "وویس‌اور تبلیغات"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۳۰ دقیقه",
    is_iran_accessible: false,
    added_at: new Date("2024-01-01"),
  },
  {
    name: "v0 by Vercel",
    tagline: "طراحی UI با توصیف متنی",
    description: "رابط کاربری با متن توصیف کن — React کامپوننت آماده می‌ده",
    url: "https://v0.dev",
    categories: ["کدنویسی", "طراحی", "توسعه نرم‌افزار"],
    use_cases: ["ساخت سریع UI", "پروتوتایپ", "کامپوننت React", "طراحی فرم"],
    pricing_model: "freemium",
    difficulty: "intermediate",
    learning_time: "۴۵ دقیقه",
    is_iran_accessible: true,
    added_at: new Date("2024-06-01"),
  },
  {
    name: "Gamma",
    tagline: "پرزنتیشن حرفه‌ای با AI",
    description: "پرزنتیشن و داکیومنت با هوش مصنوعی — یه متن بده، اسلاید بگیر",
    url: "https://gamma.app",
    categories: ["مارکتینگ", "مدیریت", "فروش", "آموزش"],
    use_cases: ["ساخت پرزنتیشن", "گزارش سرمایه‌گذار", "پیشنهاد پروژه", "محتوای آموزشی"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۲۰ دقیقه",
    is_iran_accessible: true,
    added_at: new Date("2024-03-01"),
  },
  {
    name: "HeyGen",
    tagline: "ویدیو با آواتار AI",
    description: "ویدیوی حرفه‌ای بدون دوربین — آواتار AI با صدا و ظاهر واقعی",
    url: "https://heygen.com",
    categories: ["محتوا", "مارکتینگ", "آموزش"],
    use_cases: ["ویدیوی محصول", "آموزش آنلاین", "معرفی شرکت", "محتوای سوشال"],
    pricing_model: "freemium",
    difficulty: "beginner",
    learning_time: "۱ ساعت",
    is_iran_accessible: false,
    added_at: new Date("2024-04-01"),
  },
];

/* ─────────────────────────────────────────────────────────────────
   PRODUCT HUNT CRAWLER — top new AI tools
───────────────────────────────────────────────────────────────── */
export async function crawlProductHuntAiTools(daysBack = 7): Promise<Partial<AiTool>[]> {
  /* Product Hunt GraphQL API — requires PH_API_KEY env var */
  const apiKey = process.env.PH_API_KEY;
  if (!apiKey) {
    console.warn("[tools:producthunt] PH_API_KEY not set — skipping");
    return [];
  }

  const sinceDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const query = `{
    posts(order: VOTES, postedAfter: "${sinceDate}", topic: "artificial-intelligence") {
      edges {
        node {
          name
          tagline
          description
          url
          website
          thumbnail { url }
        }
      }
    }
  }`;

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    console.warn(`[tools:producthunt] HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  const posts: PHPost[] = data?.data?.posts?.edges?.map((e: { node: PHPost }) => e.node) ?? [];

  return posts.map((p) => ({
    name:          p.name,
    tagline:       p.tagline,
    description:   p.description ?? p.tagline,
    url:           p.website ?? p.url,
    logo_url:      p.thumbnail?.url,
    pricing_model: "freemium" as const,
    difficulty:    "intermediate" as const,
    learning_time: "۱ ساعت",
    is_iran_accessible: false,   /* assume blocked until verified */
    added_at:      new Date(),
    categories:    [],
    use_cases:     [],
  }));
}

type PHPost = {
  name: string;
  tagline: string;
  description?: string;
  url: string;
  website?: string;
  thumbnail?: { url: string };
};

/* ─────────────────────────────────────────────────────────────────
   FILTER tools relevant to a profile
───────────────────────────────────────────────────────────────── */
export function filterToolsForProfile(params: {
  job_title:   string;
  industry:    string;
  skills:      string[];
  plan:        "free" | "pro" | "max";
}): AiTool[] {
  const maxTools = params.plan === "free" ? 3 : params.plan === "pro" ? 8 : CURATED_TOOLS.length;

  const industryMap: Record<string, string[]> = {
    "توسعه نرم‌افزار":    ["کدنویسی", "توسعه نرم‌افزار"],
    "طراحی UI/UX":       ["طراحی", "کدنویسی"],
    "دیجیتال مارکتینگ":  ["مارکتینگ", "محتوا"],
    "محتوا و کپی‌رایتینگ": ["محتوا", "مارکتینگ"],
    "فروش":              ["فروش", "مارکتینگ"],
    "مدیریت پروژه":      ["مدیریت", "تیم"],
    "آموزش":             ["آموزش", "محتوا"],
    "منابع انسانی":       ["منابع انسانی", "مدیریت"],
    "داده و تحلیل":       ["تحقیق", "کدنویسی"],
  };

  const relevantCategories = industryMap[params.industry] ?? [];

  const scored = CURATED_TOOLS.map((tool) => {
    let score = 0;
    for (const cat of relevantCategories) {
      if (tool.categories.includes(cat)) score += 2;
    }
    for (const skill of params.skills) {
      if (tool.use_cases.some((u) => u.includes(skill))) score += 1;
    }
    return { tool, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTools)
    .map((s) => s.tool);
}
