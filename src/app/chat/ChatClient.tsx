"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Plus, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const SUGGESTIONS: string[] = [
  "ریسک جایگزینی شغلم با AI چقدره؟",
  "چه مهارت‌هایی باید یاد بگیرم؟",
  "چطور با AI بهره‌وریم رو بالا ببرم؟",
  "بهترین ابزار AI برای شغل من کدومه؟",
  "مسیر ارتقای شغلی‌ام چیه؟",
  "چطور CV‌ام رو بهتر کنم؟",
];

/* ─── mascot avatar (simplified pixel art) ─── */
function MascotAvatar({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.31,
      background: "rgba(16,185,129,0.14)", border: "1px solid rgba(110,231,183,0.28)",
      display: "grid", placeItems: "center", flexShrink: 0, overflow: "hidden",
      boxShadow: "0 0 12px rgba(52,211,153,0.18)",
    }}>
      <span style={{ fontWeight: 900, fontSize: size * 0.42, color: "#6ee7b7", letterSpacing: -0.5 }}>A</span>
    </div>
  );
}

/* ─── typing dots ─── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7",
          animation: `ay-typing 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

const CHAT_CSS = `
@keyframes ay-typing {
  0%,60%,100%{transform:translateY(0);opacity:0.45}
  30%{transform:translateY(-5px);opacity:1}
}
@keyframes ay-caret {
  0%,100%{opacity:1}50%{opacity:0}
}
`;

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

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

        if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: accumulated, streaming: true } : m)
          );
        }

        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, streaming: false } : m)
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
    <>
      <style>{CHAT_CSS}</style>
      <div style={{
        display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
        paddingBottom: 64 /* BottomNav height */,
      }}>

        {/* ── Header ── */}
        <div style={{
          flexShrink: 0, position: "relative", zIndex: 10,
          padding: "18px 20px 14px",
          display: "flex", alignItems: "center", gap: 12,
          background: "linear-gradient(180deg, rgba(2,3,6,0.9) 0%, rgba(2,3,6,0.0) 100%)",
          borderBottom: "1px solid rgba(110,231,183,0.08)",
        }}>
          <MascotAvatar size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>مسیریاب · ای‌وای</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399", flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: 10.5, color: "rgba(110,231,183,0.7)" }}>
                {jobTitle ? `متخصص · ${jobTitle}` : "آنلاین · مسیر شغلی"}
              </span>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              style={{
                width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
                cursor: "pointer",
              }}
              title="مکالمه جدید"
            >
              <RefreshCw size={14} color="rgba(232,239,234,0.7)" />
            </button>
          )}
        </div>

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 20px" }}>
          {/* Empty state */}
          {isEmpty && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px 0" }}>
              <MascotAvatar size={64} />
              <h2 style={{ margin: "16px 0 8px", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>
                سلام {nickname}! 👋
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(232,239,234,0.6)", lineHeight: 1.7, maxWidth: 280 }}>
                هر سؤالی درباره{" "}
                <span style={{ color: "#6ee7b7" }}>مسیر شغلی</span>،{" "}
                <span style={{ color: "#6ee7b7" }}>ابزارهای AI</span> یا{" "}
                <span style={{ color: "#6ee7b7" }}>بهره‌وری</span> داری، بپرس.
              </p>

              {!hasAnalysis && (
                <div style={{
                  marginBottom: 20, padding: "10px 16px", borderRadius: 12,
                  background: "rgba(234,179,8,0.08)", border: "1px solid rgba(251,191,36,0.25)",
                  fontSize: 12, color: "#fcd34d", lineHeight: 1.6,
                }}>
                  💡 اول تحلیل مسیر شغلی رو انجام بده — پاسخ‌ها شخصی‌تر می‌شن
                </div>
              )}

              {/* Suggestion chips */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "8px 14px", borderRadius: 12,
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(110,231,183,0.16)",
                      fontSize: 12.5, color: "rgba(232,239,234,0.8)", cursor: "pointer",
                      fontFamily: "inherit", textAlign: "right", transition: "border-color 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date chip */}
          {messages.length > 0 && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{
                display: "inline-block", padding: "3px 10px", borderRadius: 999,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.1)",
                fontFamily: "monospace", fontSize: 10, color: "rgba(232,239,234,0.45)",
              }}>
                امروز
              </span>
            </div>
          )}

          {/* Message list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                gap: 8, alignItems: "flex-end",
              }}>
                {/* Avatar */}
                {msg.role === "assistant" && <MascotAvatar size={32} />}
                {msg.role === "user" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: "rgba(16,185,129,0.18)", border: "1px solid rgba(110,231,183,0.28)",
                    display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 900, color: "#6ee7b7",
                  }}>
                    {nickname.slice(0, 1)}
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  maxWidth: "78%", padding: "11px 14px",
                  fontSize: 13.5, lineHeight: 1.65, color: "#e8efea",
                  ...(msg.role === "user" ? {
                    background: "linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.14) 100%)",
                    border: "1px solid rgba(110,231,183,0.32)",
                    borderRadius: "16px 16px 4px 16px",
                  } : {
                    background: "linear-gradient(180deg, rgba(31,46,40,0.85) 0%, rgba(18,30,24,0.75) 100%)",
                    border: "1px solid rgba(110,231,183,0.14)",
                    borderRadius: "16px 16px 16px 4px",
                  }),
                }}>
                  {msg.content || (msg.streaming ? <TypingDots /> : null)}
                  {msg.streaming && msg.content && (
                    <span style={{
                      display: "inline-block", width: 2, height: 14,
                      background: "#34d399", verticalAlign: "middle",
                      marginInlineStart: 4,
                      animation: "ay-caret 1s steps(2) infinite",
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 12,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(248,113,113,0.3)",
              fontSize: 12, color: "#fca5a5",
            }}>{error}</div>
          )}

          <div ref={bottomRef} style={{ height: 4 }} />
        </div>

        {/* ── Composer ── */}
        <div style={{
          flexShrink: 0, padding: "8px 14px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
          borderTop: "1px solid rgba(110,231,183,0.08)",
        }}>
          <div style={{
            padding: 6, borderRadius: 20,
            background: "linear-gradient(180deg, rgba(31,46,40,0.9) 0%, rgba(18,30,24,0.85) 100%)",
            backdropFilter: "blur(18px) saturate(160%)",
            border: "1px solid rgba(110,231,183,0.24)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {/* + button */}
            <div style={{
              width: 40, height: 40, borderRadius: 14, flexShrink: 0,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
              display: "grid", placeItems: "center",
            }}>
              <Plus size={17} color="rgba(232,239,234,0.7)" />
            </div>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="بپرس…"
              rows={1}
              disabled={isStreaming}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                resize: "none", fontSize: 13.5, color: "#e8efea",
                fontFamily: "inherit", caretColor: "#34d399",
                minHeight: 40, maxHeight: 120,
                padding: "10px 6px",
              }}
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              style={{
                width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                border: "none", cursor: (!input.trim() || isStreaming) ? "not-allowed" : "pointer",
                display: "grid", placeItems: "center",
                boxShadow: "0 4px 16px rgba(52,211,153,0.35)",
                opacity: (!input.trim() || isStreaming) ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {isStreaming ? (
                <Loader2 size={16} color="#04110a" className="animate-spin" />
              ) : (
                <Send size={16} color="#04110a" strokeWidth={2.2} />
              )}
            </button>
          </div>
          <p style={{ marginTop: 6, textAlign: "center", fontSize: 10.5, color: "rgba(232,239,234,0.35)" }}>
            Enter برای ارسال · Shift+Enter برای خط جدید
          </p>
        </div>
      </div>
    </>
  );
}
