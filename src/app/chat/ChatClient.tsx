"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Send, Loader2, Bot, User, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const SUGGESTIONS: Record<string, string[]> = {
  default: [
    "ریسک جایگزینی شغلم با AI چقدره؟",
    "چه مهارت‌هایی باید یاد بگیرم؟",
    "چطور با AI بهره‌وریم رو بالا ببرم؟",
    "بهترین ابزار AI برای شغل من کدومه؟",
    "مسیر ارتقای شغلی‌ام چیه؟",
    "چطور CV‌ام رو بهتر کنم؟",
  ],
};

export function ChatClient({
  nickname,
  jobTitle,
  industry,
  hasAnalysis,
}: {
  nickname: string;
  jobTitle: string;
  industry: string;
  hasAnalysis: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const abortRef  = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput("");

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: trimmed },
      ];

      try {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`خطای سرور: ${res.status}`);
        }

        const reader  = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: accumulated, streaming: true }
                : m
            )
          );
        }

        // Mark streaming done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "خطا در ارسال پیام");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden pb-16">
      {/* Header */}
      <header
        className="z-10 shrink-0 border-b border-white/[0.06]"
        style={{
          background: "rgba(2,3,6,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
            <Bot className="h-4 w-4 text-violet-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink-100">مسیریاب AI</p>
            <p className="truncate text-[10.5px] text-ink-600">
              {jobTitle ? `متخصص برای ${jobTitle} در ${industry}` : "دستیار مسیر شغلی"}
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] text-ink-600 transition hover:text-ink-400"
              title="مکالمه جدید"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {/* Empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
                <Bot className="h-7 w-7 text-violet-400" />
              </div>
              <h2 className="mb-1 text-lg font-bold">
                سلام {nickname}! 👋
              </h2>
              <p className="mb-2 text-sm leading-relaxed text-ink-400">
                من مسیریاب AI هستم. هر سؤالی درباره{" "}
                <span className="text-ink-200">مسیر شغلی</span>،{" "}
                <span className="text-ink-200">ابزارهای AI</span> یا{" "}
                <span className="text-ink-200">بهره‌وری</span> داری، بپرس.
              </p>
              {!hasAnalysis && (
                <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.06] px-4 py-2.5 text-sm text-yellow-300">
                  💡 اول تحلیل مسیر شغلی رو انجام بده — پاسخ‌ها شخصی‌تر می‌شن
                </div>
              )}

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.default.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[12.5px] text-ink-300 transition hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-ink-100 text-right"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages list */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-emerald-500/20"
                      : "bg-violet-500/20"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-violet-400" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-emerald-500/15 text-ink-100"
                      : "rounded-tl-sm border border-white/[0.06] bg-white/[0.03] text-ink-100"
                  }`}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1.5 text-ink-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      در حال تایپ...
                    </span>
                  )}
                  {msg.streaming && msg.content && (
                    <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-violet-400 align-middle" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {/* Input area */}
      <div
        className="shrink-0 border-t border-white/[0.06]"
        style={{
          background: "rgba(2,3,6,0.95)",
          backdropFilter: "blur(14px)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="بپرس..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[14px] text-ink-100 placeholder-ink-600 outline-none transition focus:border-violet-500/40 focus:ring-0"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={isStreaming}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/80 text-white transition hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10.5px] text-ink-700">
            Enter برای ارسال · Shift+Enter برای خط جدید
          </p>
        </div>
      </div>
    </div>
  );
}
