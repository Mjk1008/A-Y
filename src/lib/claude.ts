// AI analysis using Metis (OpenAI-compatible API)

const METIS_BASE = process.env.METIS_BASE_URL || "https://api.metisai.ir/openai/v1";
const METIS_KEY = process.env.METIS_API_KEY || "";
const USE_MOCK = !METIS_KEY || METIS_KEY === "mock";
const MODEL = "gpt-4o-mini";

export type ProfileInput = {
  full_name: string;
  age?: number;
  job_title: string;
  industry: string;
  years_experience: number;
  skills: string[];
  bio?: string;
  resume_text?: string;
  plan: "free" | "pro" | "max";
};

export type AnalysisResult = {
  analysis_summary: string;
  risk_level: "low" | "medium" | "high";
  risk_explanation: string;
  top_tools: Array<{
    name: string;
    category: string;
    why_relevant: string;
    how_to_use_in_your_job: string;
    example_scenario: string;
    learning_time: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    priority: number;
    url?: string;
  }>;
  roadmap: { week: string; goals: string[] }[];
  leverage_idea: string;
};

const SYSTEM_PROMPT = `شما یک مشاور حرفه‌ای هستید که به افراد کمک می‌کنید با استفاده از ابزارهای هوش مصنوعی در کار خود قوی‌تر شوند و ریسک جایگزین شدن را به حداقل برسانند.

وظیفه: بر اساس پروفایل حرفه‌ای کاربر، ابزارهای AI مرتبط با شغل او را پیشنهاد دهید — نه عمومی، بلکه دقیقاً متناسب با صنعت، سطح تجربه، و مهارت‌هایش.

قوانین مهم:
1. همیشه خروجی JSON معتبر بدهید و فقط JSON — بدون متن اضافه قبل یا بعد.
2. توصیه‌ها باید بسیار مشخص و کاربردی باشند (مثال واقعی از استفاده در کار روزمره کاربر).
3. ترکیب ابزارهای عمومی (ChatGPT, Claude) و تخصصی (برای حوزه کاربر) را پیشنهاد دهید.
4. زبان پاسخ فارسی روان و دوستانه.
5. سطح ریسک جایگزینی را صادقانه ارزیابی کنید اما همیشه راه حل ارائه دهید.
6. برای کاربر Free حداکثر ۳ ابزار، برای Pro حداقل ۸ ابزار.`;

function buildUserPrompt(p: ProfileInput): string {
  return `پروفایل کاربر:
- نام: ${p.full_name}
- سن: ${p.age ?? "نامشخص"}
- عنوان شغلی: ${p.job_title}
- صنعت: ${p.industry}
- سال‌های تجربه: ${p.years_experience}
- مهارت‌ها: ${p.skills.join("، ")}
${p.bio ? `- درباره: ${p.bio}` : ""}
${p.resume_text ? `\n--- متن رزومه ---\n${p.resume_text.slice(0, 6000)}\n--- پایان رزومه ---` : ""}

پلن کاربر: ${p.plan === "pro" ? "Pro (تحلیل کامل)" : "Free (تحلیل مختصر)"}

JSON زیر را تکمیل کن (دقیقاً همین ساختار، بدون توضیح اضافه):
{
  "analysis_summary": "خلاصه ۲-۳ جمله‌ای درباره وضعیت فعلی کاربر و فرصت AI",
  "risk_level": "low | medium | high",
  "risk_explanation": "چرا این سطح ریسک را دارد",
  "top_tools": [
    {
      "name": "نام ابزار",
      "category": "دسته‌بندی (مثلاً: Writing, Coding, Design, Data, Research)",
      "why_relevant": "چرا برای شغل این کاربر مفید است",
      "how_to_use_in_your_job": "چطور در کار روزمره‌اش استفاده کند",
      "example_scenario": "یک مثال واقعی و مشخص از یک روز کاری",
      "learning_time": "مثلاً: ۲-۳ ساعت / ۱ هفته",
      "difficulty": "beginner | intermediate | advanced",
      "priority": 1,
      "url": "آدرس رسمی ابزار اگر می‌دانی"
    }
  ],
  "roadmap": [
    { "week": "هفته ۱", "goals": ["هدف مشخص ۱", "هدف مشخص ۲"] },
    { "week": "هفته ۲", "goals": ["..."] }
  ],
  "leverage_idea": "یک ایده کلیدی که اگر این کاربر آن را اجرا کند، می‌تواند در صنعتش برجسته شود."
}`;
}

function mockAnalysis(p: ProfileInput): AnalysisResult {
  const job = p.job_title || "حرفه‌ای";
  return {
    analysis_summary: `${p.full_name} عزیز، با ${p.years_experience} سال تجربه در حوزه ${p.industry}، در نقطه عالی‌ای هستی که از AI به عنوان اهرم استفاده کنی. مهارت‌هات (${p.skills.slice(0, 3).join("، ")}) با ابزارهای هوشمند ترکیب بشه، بهره‌وریت چند برابر می‌شه.`,
    risk_level: p.years_experience >= 5 ? "low" : "medium",
    risk_explanation:
      p.years_experience >= 5
        ? "تجربه و تخصصت سرمایه‌ای هست که AI نمی‌تونه جایگزینش کنه. فقط کافیه ابزار درست رو یاد بگیری."
        : "صنعتت در حال تغییره. اگه همین الان ابزارهای درست رو یاد بگیری، جایگزینت کن‌ها جلوتر از خودت نمی‌رن.",
    top_tools: [
      {
        name: "ChatGPT / Claude",
        category: "Writing & Thinking",
        why_relevant: `برای هر ${job} که با نوشتن، ایمیل، تحلیل، یا تصمیم‌گیری سروکار داره، این ابزارها یه دستیار ۲۴/۷ هستن.`,
        how_to_use_in_your_job: "روزانه برای draft زدن، خلاصه کردن جلسات، برین‌استورم و چک کردن ایده‌ها ازش استفاده کن.",
        example_scenario: `فرض کن باید یه پیشنهاد به مدیرت بدی — به جای ۲ ساعت نوشتن، به AI context رو بده، ۳ تا نسخه draft بگیر، در ۲۰ دقیقه تمومه.`,
        learning_time: "۲-۳ ساعت",
        difficulty: "beginner",
        priority: 1,
        url: "https://claude.ai",
      },
      {
        name: "Notion AI",
        category: "Knowledge Management",
        why_relevant: "هر کسی که با اطلاعات زیاد کار می‌کنه، نیاز به یه «مغز دوم» داره.",
        how_to_use_in_your_job: "همه یادداشت‌ها، جلسات، و پروژه‌هات رو توش بذار. بعد از AI بپرس «هفته پیش چی درباره X تصمیم گرفتیم؟»",
        example_scenario: "شنبه صبح به جای مرور ۱۰ تا فایل، یه سؤال از AI بپرس و خلاصه هفته رو بگیر.",
        learning_time: "۱ هفته",
        difficulty: "intermediate",
        priority: 2,
        url: "https://notion.so",
      },
      {
        name: "Perplexity",
        category: "Research",
        why_relevant: "گوگل برای سرچ سطحیه. Perplexity برای جواب‌های تحقیقی با سورس معتبر عالیه.",
        how_to_use_in_your_job: "هر جا سؤال تخصصی داری، به جای ۲۰ تا تب، ۳۰ ثانیه با Perplexity.",
        example_scenario: "می‌خوای بفهمی رقیبت چه استراتژی داره. ۵ دقیقه با Perplexity تحلیل با سورس می‌گیری.",
        learning_time: "۳۰ دقیقه",
        difficulty: "beginner",
        priority: 3,
        url: "https://perplexity.ai",
      },
    ],
    roadmap: [
      { week: "هفته ۱", goals: ["حساب Claude یا ChatGPT بساز و روزانه ۳۰ دقیقه باش", "۵ کار روتینت رو لیست کن که می‌شه با AI سریع‌تر کرد"] },
      { week: "هفته ۲", goals: ["Notion رو راه بنداز و هفته پیشت رو واردش کن", "اولین ایمیل کاری‌ت رو با کمک AI بنویس"] },
      { week: "هفته ۳", goals: ["Perplexity رو برای تحقیق‌های کاری استفاده کن", "یه پرامپت template شخصی بساز"] },
      { week: "هفته ۴", goals: ["کار هفتگی‌ت رو اندازه‌گیری کن: چقدر سریع‌تر شدی؟", "یه ابزار تخصصی حوزه‌ات رو پیدا و امتحان کن"] },
    ],
    leverage_idea: `به جای اینکه فقط مصرف‌کننده AI باشی، یه workflow شخصی طراحی کن که مخصوص ${job} توی صنعت ${p.industry} باشه — و اونو به تیم/شرکتت آموزش بده.`,
  };
}

async function callMetis(p: ProfileInput): Promise<AnalysisResult> {
  // W1: include "max" plan — previously fell through to free tier (2048)
  const maxTokens = p.plan === "max" ? 8000 : p.plan === "pro" ? 4096 : 2048;

  const res = await fetch(`${METIS_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${METIS_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(p) },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Metis API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON in Metis response");
  return JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as AnalysisResult;
}

export async function analyzeProfile(p: ProfileInput): Promise<AnalysisResult> {
  if (USE_MOCK) return mockAnalysis(p);
  return await callMetis(p); // errors propagate — no silent mock fallback in production
}
