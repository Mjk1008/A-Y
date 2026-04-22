import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODEL = "claude-sonnet-4-5";

export type ProfileInput = {
  full_name: string;
  age?: number;
  job_title: string;
  industry: string;
  years_experience: number;
  skills: string[];
  bio?: string;
  resume_text?: string;
  plan: "free" | "pro";
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

export async function analyzeProfile(p: ProfileInput): Promise<AnalysisResult> {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: p.plan === "pro" ? 4096 : 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(p) }],
  });

  const textBlock = msg.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No response");
  const raw = textBlock.text.trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  const json = raw.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(json) as AnalysisResult;
}
