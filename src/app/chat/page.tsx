import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { ChatClient } from "./ChatClient";
import { BottomNav } from "@/app/components/BottomNav";

function getJobTaskSuggestions(jobTitle: string, industry: string): string[] {
  const t = (jobTitle + " " + industry).toLowerCase();

  if (/product|محصول|pm\b/.test(t))
    return [
      "هر هفته باید PRD یا spec document بنویسم",
      "جلسات stakeholder زیاد دارم که باید خلاصه بشن",
      "باید بین backlog ها اولویت‌بندی کنم",
    ];
  if (/develop|توسعه|engineer|مهندس|frontend|backend|fullstack/.test(t))
    return [
      "هر روز باید code review انجام بدم",
      "نوشتن داکیومنت فنی برام وقت‌بر هست",
      "باید bug report و تیکت بنویسم",
    ];
  if (/design|طراح|ux|ui/.test(t))
    return [
      "باید برای هر پروژه brief و handoff بنویسم",
      "ایمیل feedback به کلاینت وقت می‌گیره",
      "باید user research رو تحلیل و گزارش کنم",
    ];
  if (/market|مارکتینگ|content|محتوا|copy/.test(t))
    return [
      "هر هفته باید محتوای زیاد تولید کنم",
      "گزارش کمپین و تحلیل داده دارم",
      "باید ایمیل مارکتینگ بنویسم",
    ];
  if (/sales|فروش/.test(t))
    return [
      "باید ایمیل outreach به لیدها بنویسم",
      "proposal به مشتری‌ها می‌فرستم",
      "بعد جلسه باید meeting summary بنویسم",
    ];
  if (/hr|منابع انسانی|people|talent/.test(t))
    return [
      "باید job description بنویسم",
      "interview feedback رو داکیومنت می‌کنم",
      "پالیسی و آیین‌نامه می‌نویسم",
    ];
  if (/manager|مدیر|lead|سرپرست/.test(t))
    return [
      "هر هفته باید گزارش پیشرفت بدم",
      "جلسات زیاد دارم که باید خلاصه بشن",
      "باید ایمیل‌های تیمی زیادی بنویسم",
    ];
  if (/data|داده|analys|analyst/.test(t))
    return [
      "باید گزارش‌های داده رو به زبان ساده بنویسم",
      "هر هفته داشبورد آپدیت می‌کنم",
      "ایمیل به تیم درباره یافته‌های داده می‌زنم",
    ];
  return [
    "یه کار تکراری دارم که هر هفته وقتم رو می‌گیره",
    "باید ایمیل‌های کاری زیادی بنویسم",
    "گزارش‌نویسی دارم که خسته‌کننده‌ست",
  ];
}

function buildInitialGreeting(nickname: string, topToolName: string | null): string {
  const toolLine = topToolName
    ? `\n\nبر اساس تحلیل مسیرت، **${topToolName}** یکی از ابزارهاییه که می‌تونه کارت رو متحول کنه.`
    : "";
  return `سلام ${nickname}! می‌خوام یه راهنمایی خیلی دقیق بهت بدم — نه کلی‌گو.${toolLine}\n\nبهم بگو **یه کار تکراری که هر هفته یا هر روز انجام می‌دی** — مثلاً گزارش نوشتن، جلسه خلاصه کردن، ایمیل زدن. هرچی دقیق‌تر بگی، یه مثال واقعی می‌زنم که همین الان بشه ازش استفاده کرد.`;
}

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profileRes, analysisRes] = await Promise.all([
    pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]),
    pool
      .query(
        "SELECT result_json FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
        [session.id]
      )
      .catch(() => ({ rows: [] })),
  ]);

  const profile  = profileRes.rows[0] ?? null;
  const analysis = analysisRes.rows[0]?.result_json ?? null;

  if (!profile) redirect("/onboarding");

  const nickname     = profile.nickname || profile.full_name?.split(" ")[0] || "کاربر";
  const topToolName  = (analysis?.top_tools?.[0]?.name as string | null) ?? null;
  const taskSuggestions = getJobTaskSuggestions(profile.job_title || "", profile.industry || "");
  const initialGreeting = buildInitialGreeting(nickname, topToolName);

  return (
    <>
      <BottomNav />
      <ChatClient
        nickname={nickname}
        jobTitle={profile.job_title || ""}
        industry={profile.industry || ""}
        hasAnalysis={!!analysis}
        plan={session.plan ?? "free"}
        initialGreeting={initialGreeting}
        taskSuggestions={taskSuggestions}
      />
    </>
  );
}
