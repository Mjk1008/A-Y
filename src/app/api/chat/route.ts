/**
 * POST /api/chat
 * Streaming AI chat (مسیریاب) using Metis AI (OpenAI-compatible).
 * Includes full user profile + latest analysis as system context.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

const METIS_BASE = process.env.METIS_BASE_URL || "https://api.metisai.ir/openai/v1";
const METIS_KEY  = process.env.METIS_API_KEY  || "";
const MODEL      = "gpt-4o-mini";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function buildSystemPrompt(profile: Record<string, unknown>, analysis: Record<string, unknown> | null): string {
  const nickname = (profile.nickname as string) || (profile.full_name as string) || "کاربر";
  const skills   = Array.isArray(profile.skills) ? (profile.skills as string[]).join("، ") : "";

  let ctx = `تو "مسیریاب" هستی — دستیار هوشمند AI که به ${nickname} کمک می‌کنه مسیر شغلی‌اش رو بسازه.

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
- خلاصه: ${r.analysis_summary || ""}
- ابزارهای پیشنهادی: ${(r.top_tools || []).map((t) => t.name).join("، ")}
- اهرم شخصی: ${r.leverage_idea || ""}`;
  }

  ctx += `\n
قوانین پاسخ:
1. همیشه فارسی روان و دوستانه پاسخ بده
2. پاسخ‌ها مختصر، مشخص و قابل اجرا
3. بر اساس واقعیت بازار کار ایران
4. از اسم ${nickname} در مکالمه استفاده کن تا صمیمی‌تر باشه
5. پیشنهادات رو با مثال واقعی همراه کن
6. اگه سؤال خارج از موضوع مسیر شغلی بود، مودبانه هدایت به موضوع کن`;

  return ctx;
}

// Mock response for when Metis key is not configured
async function* mockStream(userMessage: string): AsyncGenerator<string> {
  const responses = [
    `سلام! من مسیریاب AI هستم. متأسفانه کلید API متیس هنوز تنظیم نشده.`,
    ` برای فعال‌سازی کامل، METIS_API_KEY رو در .env.local تنظیم کن.`,
    ` سؤالت رو شنیدم: "${userMessage.slice(0, 50)}..."`,
  ];
  for (const chunk of responses) {
    yield chunk;
    await new Promise((r) => setTimeout(r, 100));
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "no messages" }, { status: 400 });
    }

    // Fetch profile + latest analysis
    const [profileRes, analysisRes] = await Promise.all([
      pool.query("SELECT * FROM profiles WHERE user_id=$1", [session.id]),
      pool.query(
        "SELECT result_json FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
        [session.id]
      ),
    ]);

    const profile  = profileRes.rows[0] ?? {};
    const analysis = analysisRes.rows[0]?.result_json ?? null;

    // Log usage (non-blocking)
    pool.query(
      `INSERT INTO usage_logs (user_id, type, metadata) VALUES ($1, 'chat_message', $2)`,
      [session.id, JSON.stringify({ messages_count: messages.length })]
    ).catch(() => {});

    // Build messages array with system prompt
    const fullMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(profile, analysis) },
      ...messages.slice(-20), // keep last 20 messages for context window
    ];

    // If Metis key not configured → mock stream
    if (!METIS_KEY || METIS_KEY === "mock") {
      const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content ?? "";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of mockStream(lastUserMsg)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // Real Metis streaming request
    const metisRes = await fetch(`${METIS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${METIS_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        max_tokens: 1024,
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

    // Parse SSE stream from Metis and forward plain text chunks
    const reader  = metisRes.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
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
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // ignore parse errors on individual SSE lines
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
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
