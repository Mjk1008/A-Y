"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, Plus, RefreshCw, PanelRight,
  Trash2, X, MessageSquare, Zap,
} from "lucide-react";
import { ChatThinkingBubble } from "@/app/components/LoadingStates";

/* ─── Types ─── */
type Mode = "career" | "free";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface Conversation {
  id: string;
  mode: Mode;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count: number;
}

/* ─── Constants ─── */
const CAREER_SUGGESTIONS: string[] = [
  "ریسک جایگزینی شغلم با AI چقدره؟",
  "چه مهارت‌هایی باید یاد بگیرم؟",
  "چطور با AI بهره‌وریم رو بالا ببرم؟",
  "بهترین ابزار AI برای شغل من کدومه؟",
  "مسیر ارتقای شغلی‌ام چیه؟",
  "چطور CV‌ام رو بهتر کنم؟",
];

const FREE_SUGGESTIONS: string[] = [
  "یه ایمیل حرفه‌ای بنویس",
  "تفاوت React و Vue رو توضیح بده",
  "ایده‌های استارتاپ در ایران",
  "خلاصه این متن رو بنویس",
];

/* ─── CSS ─── */
const CHAT_CSS = `
@keyframes ay-typing {
  0%,60%,100%{transform:translateY(0);opacity:0.45}
  30%{transform:translateY(-5px);opacity:1}
}
@keyframes ay-caret {
  0%,100%{opacity:1}50%{opacity:0}
}
@keyframes ay-slide-in {
  from{transform:translateX(100%);opacity:0}
  to{transform:translateX(0);opacity:1}
}
@keyframes ay-spin {
  to{transform:rotate(360deg)}
}
.ay-spin { animation: ay-spin 1s linear infinite; }
`;

/* ─── Sub-components ─── */
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

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div style={{
      display: "flex", borderRadius: 10, overflow: "hidden",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
    }}>
      {(["career", "free"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            padding: "5px 12px", fontSize: 11.5, fontWeight: 700,
            fontFamily: "inherit", cursor: "pointer", border: "none",
            background: mode === m ? "rgba(16,185,129,0.22)" : "transparent",
            color: mode === m ? "#6ee7b7" : "rgba(232,239,234,0.5)",
            transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          {m === "career" ? <MessageSquare size={10} /> : <Zap size={10} />}
          {m === "career" ? "مسیریاب" : "آزاد"}
        </button>
      ))}
    </div>
  );
}

/* ─── Sidebar ─── */
function ConversationSidebar({
  conversations,
  currentId,
  onSelect,
  onDelete,
  onNew,
  onClose,
  loading,
}: {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (c: Conversation) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }); }
    catch { return ""; }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 40, backdropFilter: "blur(2px)",
        }}
      />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 290,
        background: "linear-gradient(180deg, rgba(10,20,15,0.98) 0%, rgba(5,12,9,0.98) 100%)",
        border: "1px solid rgba(110,231,183,0.14)",
        borderRight: "none",
        zIndex: 50, display: "flex", flexDirection: "column",
        animation: "ay-slide-in 0.22s ease-out",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.7)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(110,231,183,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#e8efea" }}>تاریخچه مکالمات</span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.10)",
              cursor: "pointer",
            }}
          >
            <X size={14} color="rgba(232,239,234,0.6)" />
          </button>
        </div>

        {/* New conversation button */}
        <div style={{ padding: "10px 12px" }}>
          <button
            onClick={() => { onNew(); onClose(); }}
            style={{
              width: "100%", padding: "9px 14px", borderRadius: 10,
              background: "rgba(16,185,129,0.14)", border: "1px solid rgba(110,231,183,0.28)",
              fontSize: 12, fontWeight: 700, color: "#6ee7b7", cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Plus size={13} /> مکالمه جدید
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
              <Loader2 size={18} color="rgba(110,231,183,0.5)" className="ay-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "rgba(232,239,234,0.35)", fontSize: 12 }}>
              هنوز مکالمه‌ای نداری
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onSelect(conv); onClose(); }}
                style={{
                  padding: "10px 10px",
                  borderRadius: 10, cursor: "pointer", position: "relative",
                  background: currentId === conv.id ? "rgba(16,185,129,0.12)" : "transparent",
                  border: `1px solid ${currentId === conv.id ? "rgba(110,231,183,0.22)" : "transparent"}`,
                  marginBottom: 4, transition: "all 0.15s",
                  display: "flex", alignItems: "flex-start", gap: 8,
                }}
              >
                {/* Mode icon */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: conv.mode === "free" ? "rgba(139,92,246,0.15)" : "rgba(16,185,129,0.12)",
                  border: `1px solid ${conv.mode === "free" ? "rgba(139,92,246,0.3)" : "rgba(110,231,183,0.2)"}`,
                  display: "grid", placeItems: "center",
                }}>
                  {conv.mode === "free"
                    ? <Zap size={12} color="#a78bfa" />
                    : <MessageSquare size={12} color="#6ee7b7" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: "#e8efea",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {conv.title || (conv.mode === "free" ? "مکالمه آزاد" : "مشاور مسیر شغلی")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(232,239,234,0.4)", marginTop: 2 }}>
                    {formatDate(conv.updated_at)} · {conv.message_count} پیام
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "grid", placeItems: "center", opacity: 0.5,
                  }}
                >
                  <Trash2 size={11} color="rgba(248,113,113,0.8)" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export function ChatClient({
  nickname,
  jobTitle,
  hasAnalysis,
}: {
  nickname: string;
  jobTitle: string;
  industry: string;
  hasAnalysis: boolean;
}) {
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [isStreaming, setIsStreaming]        = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [mode, setMode]                     = useState<Mode>("career");
  const [showSidebar, setShowSidebar]       = useState(false);
  const [conversations, setConversations]   = useState<Conversation[]>([]);
  const [convLoading, setConvLoading]       = useState(false);
  const [currentConvId, setCurrentConvId]  = useState<string | null>(null);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Fetch conversation list ── */
  const fetchConversations = useCallback(async () => {
    setConvLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch { /* ignore */ }
    finally { setConvLoading(false); }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  /* ── Load conversation messages ── */
  const loadConversation = useCallback(async (conv: Conversation) => {
    try {
      const res  = await fetch(`/api/conversations/${conv.id}`);
      const data = await res.json();
      const msgs: Message[] = (data.messages ?? []).map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        streaming: false,
      }));
      setMessages(msgs);
      setCurrentConvId(conv.id);
      setMode(conv.mode);
    } catch { /* ignore */ }
  }, []);

  /* ── New conversation ── */
  const startNew = useCallback(() => {
    setMessages([]);
    setCurrentConvId(null);
    setError(null);
    setInput("");
  }, []);

  /* ── Delete conversation ── */
  const deleteConv = useCallback(async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConvId === id) startNew();
  }, [currentConvId, startNew]);

  /* ── Send message ── */
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    // Ensure we have a conversation ID before sending
    let convId = currentConvId;
    if (!convId) {
      try {
        // Create conversation, use first ~50 chars of message as title
        const res  = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            title: trimmed.slice(0, 50) + (trimmed.length > 50 ? "…" : ""),
          }),
        });
        const data = await res.json();
        convId = data.conversation?.id ?? null;
        if (convId) {
          setCurrentConvId(convId);
          // Add to local conversation list
          setConversations((prev) => [data.conversation, ...prev]);
        }
      } catch { /* proceed without persistence */ }
    }

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
        body: JSON.stringify({ messages: allMessages, mode, conversationId: convId }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);

      const reader     = res.body!.getReader();
      const decoder    = new TextDecoder();
      let accumulated  = "";

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

      // Refresh conversation list to update message_count + updated_at
      fetchConversations();

    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "خطا در ارسال پیام");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, mode, currentConvId, fetchConversations]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty       = messages.length === 0;
  const suggestions   = mode === "free" ? FREE_SUGGESTIONS : CAREER_SUGGESTIONS;

  return (
    <>
      <style>{CHAT_CSS}</style>

      {/* Sidebar */}
      {showSidebar && (
        <ConversationSidebar
          conversations={conversations}
          currentId={currentConvId}
          onSelect={loadConversation}
          onDelete={deleteConv}
          onNew={startNew}
          onClose={() => setShowSidebar(false)}
          loading={convLoading}
        />
      )}

      <div style={{
        display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
        paddingBottom: 64,
      }}>

        {/* ── Header ── */}
        <div style={{
          flexShrink: 0, position: "relative", zIndex: 10,
          padding: "14px 16px 12px",
          display: "flex", alignItems: "center", gap: 10,
          background: "linear-gradient(180deg, rgba(2,3,6,0.95) 0%, rgba(2,3,6,0.0) 100%)",
          borderBottom: "1px solid rgba(110,231,183,0.08)",
        }}>
          <MascotAvatar size={38} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: -0.2 }}>مسیریاب · ای‌وای</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399", flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(110,231,183,0.7)" }}>
                {jobTitle ? `متخصص · ${jobTitle}` : "آنلاین · مسیر شغلی"}
              </span>
            </div>
          </div>

          {/* Mode toggle */}
          <ModeToggle mode={mode} onChange={(m) => { setMode(m); if (!currentConvId) startNew(); }} />

          {/* New conversation */}
          {messages.length > 0 && (
            <button
              onClick={startNew}
              style={{
                width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
                cursor: "pointer",
              }}
              title="مکالمه جدید"
            >
              <RefreshCw size={13} color="rgba(232,239,234,0.7)" />
            </button>
          )}

          {/* History sidebar */}
          <button
            onClick={() => setShowSidebar(true)}
            style={{
              width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.12)",
              cursor: "pointer", position: "relative",
            }}
            title="تاریخچه"
          >
            <PanelRight size={14} color="rgba(232,239,234,0.7)" />
            {conversations.length > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4, width: 6, height: 6,
                borderRadius: "50%", background: "#34d399",
              }} />
            )}
          </button>
        </div>

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px" }}>

          {/* Empty state */}
          {isEmpty && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
              <MascotAvatar size={60} />
              <h2 style={{ margin: "14px 0 6px", fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>
                {mode === "free" ? "چه کمکی می‌تونم بکنم؟" : `سلام ${nickname}! 👋`}
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(232,239,234,0.6)", lineHeight: 1.7, maxWidth: 280 }}>
                {mode === "free"
                  ? "بدون هیچ محدودیتی باهام صحبت کن — کد، متن، سوال، هر چیزی."
                  : <>هر سؤالی درباره{" "}<span style={{ color: "#6ee7b7" }}>مسیر شغلی</span>،{" "}<span style={{ color: "#6ee7b7" }}>ابزارهای AI</span> یا{" "}<span style={{ color: "#6ee7b7" }}>بهره‌وری</span> داری، بپرس.</>}
              </p>

              {mode === "career" && !hasAnalysis && (
                <div style={{
                  marginBottom: 16, padding: "9px 14px", borderRadius: 10,
                  background: "rgba(234,179,8,0.08)", border: "1px solid rgba(251,191,36,0.22)",
                  fontSize: 11.5, color: "#fcd34d", lineHeight: 1.6,
                }}>
                  💡 اول تحلیل مسیر شغلی رو انجام بده — پاسخ‌ها شخصی‌تر می‌شن
                </div>
              )}

              {/* Mode indicator pill */}
              <div style={{
                marginBottom: 14, padding: "4px 12px", borderRadius: 999,
                background: mode === "free" ? "rgba(139,92,246,0.1)" : "rgba(16,185,129,0.08)",
                border: `1px solid ${mode === "free" ? "rgba(139,92,246,0.25)" : "rgba(110,231,183,0.18)"}`,
                fontSize: 11, color: mode === "free" ? "#a78bfa" : "#6ee7b7",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {mode === "free" ? <Zap size={10} /> : <MessageSquare size={10} />}
                {mode === "free" ? "حالت آزاد — بدون محدودیت موضوع" : "حالت مسیریاب — مشاور شغلی"}
              </div>

              {/* Suggestion chips */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7 }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "7px 13px", borderRadius: 11,
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(110,231,183,0.14)",
                      fontSize: 12, color: "rgba(232,239,234,0.75)", cursor: "pointer",
                      fontFamily: "inherit", textAlign: "right",
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
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <span style={{
                display: "inline-block", padding: "3px 10px", borderRadius: 999,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.08)",
                fontFamily: "monospace", fontSize: 10, color: "rgba(232,239,234,0.4)",
              }}>
                {mode === "free" ? "⚡ حالت آزاد" : "🎯 حالت مسیریاب"}
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
                {msg.role === "assistant" && <MascotAvatar size={30} />}
                {msg.role === "user" && (
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: "rgba(16,185,129,0.18)", border: "1px solid rgba(110,231,183,0.28)",
                    display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 900, color: "#6ee7b7",
                  }}>
                    {nickname.slice(0, 1)}
                  </div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "10px 13px",
                  fontSize: 13.5, lineHeight: 1.7, color: "#e8efea",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  ...(msg.role === "user" ? {
                    background: "linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.14) 100%)",
                    border: "1px solid rgba(110,231,183,0.32)",
                    borderRadius: "16px 16px 4px 16px",
                  } : {
                    background: "linear-gradient(180deg, rgba(31,46,40,0.85) 0%, rgba(18,30,24,0.75) 100%)",
                    border: "1px solid rgba(110,231,183,0.12)",
                    borderRadius: "16px 16px 16px 4px",
                  }),
                }}>
                  {msg.content || (msg.streaming ? <ChatThinkingBubble /> : null)}
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
          borderTop: "1px solid rgba(110,231,183,0.07)",
        }}>
          <div style={{
            padding: 6, borderRadius: 20,
            background: "linear-gradient(180deg, rgba(31,46,40,0.9) 0%, rgba(18,30,24,0.85) 100%)",
            backdropFilter: "blur(18px) saturate(160%)",
            border: `1px solid ${mode === "free" ? "rgba(139,92,246,0.28)" : "rgba(110,231,183,0.24)"}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, flexShrink: 0,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.10)",
              display: "grid", placeItems: "center",
            }}>
              {mode === "free"
                ? <Zap size={15} color="rgba(167,139,250,0.7)" />
                : <Plus size={16} color="rgba(232,239,234,0.7)" />}
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={mode === "free" ? "هر چیزی بپرس…" : "سوال شغلی‌ات رو بپرس…"}
              rows={1}
              disabled={isStreaming}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                resize: "none", fontSize: 13.5, color: "#e8efea",
                fontFamily: "inherit", caretColor: "#34d399",
                minHeight: 38, maxHeight: 120, padding: "9px 4px",
              }}
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: mode === "free"
                  ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)"
                  : "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                border: "none", cursor: (!input.trim() || isStreaming) ? "not-allowed" : "pointer",
                display: "grid", placeItems: "center",
                boxShadow: mode === "free" ? "0 4px 16px rgba(124,58,237,0.35)" : "0 4px 16px rgba(52,211,153,0.35)",
                opacity: (!input.trim() || isStreaming) ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {isStreaming
                ? <Loader2 size={15} color="#04110a" className="ay-spin" />
                : <Send size={15} color="#04110a" strokeWidth={2.2} />}
            </button>
          </div>
          <p style={{ marginTop: 5, textAlign: "center", fontSize: 10, color: "rgba(232,239,234,0.3)" }}>
            Enter برای ارسال · Shift+Enter برای خط جدید
          </p>
        </div>
      </div>
    </>
  );
}
