/**
 * POST /api/chat
 * Streaming AI chat using Metis AI (OpenAI-compatible).
 * Supports two modes:
 *   - "career"  : مسیریاب — full profile/analysis context, career-focused rules
 *   - "free"    : آزاد    — minimal system prompt, unrestricted LLM
 *
 * Persists messages to chat_messages if a conversationId is provided.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";
import { updateStreak } from "@/lib/streak";
import { PLANS } from "@/app/config/plans";

export const runtime = "nodejs";
export const maxDuration = 60;

const METIS_BASE = process.env.METIS_BASE_URL || "https://api.metisai.ir/openai/v1";
const METIS_KEY  = process.env.METIS_API_KEY  || "";
const MODEL      = "gpt-4o-mini";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/* ──────────────────────────────────────────────────────────────────
   CAREER MODE SYSTEM PROMPT
   Non-sycophantic, asks clarifying questions, grounded in reality.
─────────────────────────────────────────────────────────────────── */
function buildCareerSystemPrompt(
  profile: Record<string, unknown>,
  analysis: Record<string, unknown> | null
): string {
  const nickname = (profile.nickname as string) || (profile.full_name as string) || "کاربر";
  const skills   = Array.isArray(profile.skills) ? (profile.skills as string[]).join("، ") : "";

  let ctx = `تو "مسیریاب" هستی — دستیار هوشمند AI در اپلیکیشن A-Y که به ${nickname} کمک می‌کنه مسیر شغلی‌اش رو بهتر بسازه.

اطلاعات کاربر:
- اسم: ${nickname}
- شغل: ${profile.job_title || "نامشخص"}
- صنعت: ${profile.industry || "نامشخص"}
- سال‌های تجربه: ${profile.years_experience || 0}
- مهارت‌ها: ${skills || "ذکر نشده"}
${profile.bio ? `- درباره: ${profile.bio}` : ""}`;

  if (analysis) {
    const r = analysis as {
      risk_level?: string;
      risk_explanation?: string;
      analysis_summary?: string;
      leverage_idea?: string;
      top_tools?: Array<{ name: string }>;
    };
    ctx += `\n
آخرین تحلیل AI:
- ریسک جایگزینی: ${r.risk_level === "low" ? "پایین" : r.risk_level === "medium" ? "متوسط" : "بالا"}
- توضیح ریسک: ${r.risk_explanation || ""}
- خلاصه تحلیل: ${r.analysis_summary || ""}
- ابزارهای پیشنهادی: ${(r.top_tools || []).map((t) => t.name).join("، ")}
- اهرم شخصی: ${r.leverage_idea || ""}`;
  }

  ctx += `\n
اصول رفتاری (غیرقابل نقض):
1. فارسی روان، صادق و بدون چرب‌زبانی — «عالیه!» یا «سوال خوبی پرسیدی» نگو
2. اگه اطلاعات کافی برای پاسخ دقیق نداری، حداکثر ۲ سوال کوتاه از کاربر بپرس
3. پاسخ‌ها باید قابل اجرا و مشخص باشن، نه کلی‌گویی
4. اگه نظر کاربر اشتباه یا غیرواقعی‌بود، صادقانه و محترمانه اصلاح کن — تأیید کورکورانه نکن
5. بر اساس واقعیت بازار کار ایران تحلیل کن
6. از اسم ${nickname} در مکالمه استفاده کن
7. اگه سوال خارج از حوزه مسیر شغلی و AI بود، بگو که در این حوزه تخصص داری و هدایت کن
8. پیشنهادات رو با مثال واقعی یا گام عملی همراه کن
9. وقتی کاربر یه تسک یا کار روزمره مشخص توصیف کرد، جواب حتماً این ۴ بخش رو داشته باشه:
   - **ابزار**: اسم یه ابزار AI مشخص که برای این تسک ایده‌آله، با یه جمله توضیح چرا
   - **پرامپت آماده**: یه prompt فارسی که همین الان می‌شه کپی کرد و paste کرد (داخل code block)
   - **نتیجه**: در چند دقیقه چه خروجی می‌گیره
   - **مثال خروجی**: یه نمونه کوچک از اینکه جواب چطور می‌شه (۲-۳ جمله)`;

  return ctx;
}

/* ──────────────────────────────────────────────────────────────────
   FREE MODE SYSTEM PROMPT (minimal)
─────────────────────────────────────────────────────────────────── */
const FREE_SYSTEM_PROMPT = `تو یک دستیار هوشمند هستی. فارسی روان، مستقیم و بدون تعریف بیجا پاسخ بده. به هر موضوعی که کاربر بخواد کمک کن.`;

/* ──────────────────────────────────────────────────────────────────
   MOCK STREAM (no API key)
─────────────────────────────────────────────────────────────────── */
async function* mockStream(userMessage: string): AsyncGenerator<string> {
  const chunks = [
    `سلام! من دستیار AI هستم. `,
    `متأسفانه کلید API متیس هنوز تنظیم نشده. `,
    `برای فعال‌سازی، METIS_API_KEY رو در .env.local تنظیم کن. `,
    `سؤالت: "${userMessage.slice(0, 60)}..."`,
  ];
  for (const chunk of chunks) {
    yield chunk;
    await new Promise((r) => setTimeout(r, 80));
  }
}

/* ──────────────────────────────────────────────────────────────────
   PERSIST helper
─────────────────────────────────────────────────────────────────── */
async function persistMessages(
  conversationId: string,
  userId: string,
  userContent: string,
  assistantContent: string
) {
  try {
    await pool.query(
      `INSERT INTO chat_messages (conversation_id, user_id, role, content)
       VALUES ($1, $2, 'user', $3), ($1, $2, 'assistant', $4)`,
      [conversationId, userId, userContent, assistantContent]
    );
    // bump updated_at
    await pool.query(
      "UPDATE chat_conversations SET updated_at=now() WHERE id=$1",
      [conversationId]
    );
  } catch (e) {
    console.error("persist chat messages error:", e);
  }
}

/* ──────────────────────────────────────────────────────────────────
   LOG USAGE helper (called after successful response)
─────────────────────────────────────────────────────────────────── */
function logUsage(userId: string, mode: string, messagesCount: number) {
  pool.query(
    `INSERT INTO usage_logs (user_id, type, metadata) VALUES ($1, 'chat_message', $2)`,
    [userId, JSON.stringify({ mode, messages_count: messagesCount })]
  ).catch(() => {});
  updateStreak(userId).catch(() => {});
}

/* ──────────────────────────────────────────────────────────────────
   HANDLER
─────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const mode: "career" | "free"   = body.mode === "free" ? "free" : "career";
    const conversationId: string | null = body.conversationId ?? null;

    if (!messages.length) {
      return NextResponse.json({ error: "no messages" }, { status: 400 });
    }

    // ── Quota check ───────────────────────────────────────────────
    const planDef = PLANS.find((p) => p.id === session.plan) ?? PLANS[0];
    const monthlyLimit = planDef.limits.chatMessagesPerMonth;

    if (session.plan === "free") {
      // Free users: daily limit (5/day + snake game bonuses)
      const FREE_DAILY_CHAT_LIMIT = 5;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const [usageRes, snakeBonusRes] = await Promise.all([
        pool.query(
          `SELECT COUNT(*) FROM usage_logs
           WHERE user_id=$1 AND type='chat_message' AND created_at >= $2`,
          [session.id, today.toISOString()]
        ),
        pool.query(
          `SELECT COUNT(*) FROM usage_logs
           WHERE user_id=$1 AND type='game_reward'
             AND metadata->>'game' = 'snake'
             AND created_at >= $2`,
          [session.id, today.toISOString()]
        ).catch(() => ({ rows: [{ count: "0" }] })),
      ]);
      const usedToday      = parseInt(usageRes.rows[0].count ?? "0");
      const snakeBonus     = parseInt(snakeBonusRes.rows[0].count ?? "0");
      const effectiveLimit = FREE_DAILY_CHAT_LIMIT + snakeBonus;
      if (usedToday >= effectiveLimit) {
        return NextResponse.json(
          { error: "daily_limit", used: usedToday, limit: effectiveLimit, remaining: 0 },
          { status: 429 }
        );
      }
    } else if (monthlyLimit > 0) {
      // Pro/Max users: monthly limit (W4)
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const usageRes = await pool.query(
        `SELECT COUNT(*) FROM usage_logs
         WHERE user_id=$1 AND type='chat_message' AND created_at >= $2`,
        [session.id, monthStart.toISOString()]
      );
      const usedThisMonth = parseInt(usageRes.rows[0].count ?? "0");
      if (usedThisMonth >= monthlyLimit) {
        return NextResponse.json(
          { error: "monthly_limit", used: usedThisMonth, limit: monthlyLimit, remaining: 0 },
          { status: 429 }
        );
      }
    }

    // Last user message (for mock + persistence)
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content ?? "";

    // W2: plan-based max_tokens
    const maxTokens = planDef.limits.chatOutputTokens || 1500;

    let systemPrompt: string;

    if (mode === "career") {
      // Fetch profile + latest analysis
      const [profileRes, analysisRes] = await Promise.all([
        pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]),
        pool.query(
          "SELECT result_json FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
          [session.id]
        ).catch(() => ({ rows: [] })),
      ]);
      const profile  = profileRes.rows[0] ?? {};
      const analysis = analysisRes.rows[0]?.result_json ?? null;
      systemPrompt = buildCareerSystemPrompt(profile, analysis);
    } else {
      systemPrompt = FREE_SYSTEM_PROMPT;
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-30),
    ];

    // ── MOCK (no API key) ─────────────────────────────────────────
    if (!METIS_KEY || METIS_KEY === "mock") {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          let accumulated = "";
          for await (const chunk of mockStream(lastUserMsg)) {
            accumulated += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
          // W3: log usage AFTER successful response
          logUsage(session.id, mode, messages.length);
          if (conversationId) {
            await persistMessages(conversationId, session.id, lastUserMsg, accumulated);
          }
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // ── REAL METIS REQUEST ────────────────────────────────────────
    const metisRes = await fetch(`${METIS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${METIS_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        max_tokens: maxTokens,
        messages: fullMessages,
      }),
    });

    if (!metisRes.ok) {
      const err = await metisRes.text();
      console.error("Metis error:", err);
      return NextResponse.json(
        { error: `Metis API error: ${metisRes.status}` },
        { status: 502 }
      );
    }

    const reader  = metisRes.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let accumulated = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;
              if (!trimmed.startsWith("data: ")) continue;
              try {
                const json = JSON.parse(trimmed.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  accumulated += content;
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
          // W3: log usage AFTER streaming is fully done (not before)
          logUsage(session.id, mode, messages.length);
          if (conversationId && accumulated) {
            await persistMessages(conversationId, session.id, lastUserMsg, accumulated);
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
