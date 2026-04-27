"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, RefreshCw, PanelRight,
  Trash2, X, MessageSquare, Zap, ArrowRight,
} from "lucide-react";
import { ChatThinkingBubble } from "@/app/components/LoadingStates";
import Link from "next/link";

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
const CAREER_SUGGESTIONS = [
  "ریسک جایگزینی شغلم با AI چقدره؟",
  "چه مهارت‌هایی باید یاد بگیرم؟",
  "بهترین ابزار AI برای شغل من کدومه؟",
  "مسیر ارتقای شغلی‌ام چیه؟",
];

const FREE_SUGGESTIONS = [
  "یه ایمیل حرفه‌ای بنویس",
  "ایده‌های استارتاپ در ایران",
  "تفاوت React و Vue رو توضیح بده",
  "خلاصه این متن رو بنویس",
];

/* ─── Global styles ─── */
const CHAT_CSS = `
  @keyframes _ay_typing {
    0%,60%,100%{transform:translateY(0);opacity:.4}
    30%{transform:translateY(-4px);opacity:1}
  }
  @keyframes _ay_caret {
    0%,100%{opacity:1}50%{opacity:0}
  }
  @keyframes _ay_slide {
    from{transform:translateX(24px);opacity:0}
    to{transform:translateX(0);opacity:1}
  }
  @keyframes _ay_spin {
    to{transform:rotate(360deg)}
  }
  @keyframes _ay_fadein {
    from{opacity:0;transform:translateY(5px)}
    to{opacity:1;transform:translateY(0)}
  }
  ._ay_spin { animation: _ay_spin 1s linear infinite; }
  ._ay_msg  { animation: _ay_fadein 0.16s ease both; }

  /* font smoothing */
  .ay-chat * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* AI bubble: justified RTL text */
  .ay-bubble-ai {
    text-align: justify;
    text-align-last: right;
    hyphens: auto;
    word-spacing: 0.02em;
    letter-spacing: 0.01em;
  }

  /* User bubble: right-aligned, no justify (usually short) */
  .ay-bubble-user {
    text-align: right;
    letter-spacing: 0.01em;
  }

  /* clean thin scrollbar + mobile touch scroll */
  .ay-scroll::-webkit-scrollbar { width: 2px; }
  .ay-scroll::-webkit-scrollbar-track { background: transparent; }
  .ay-scroll::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.12); border-radius: 2px; }
  .ay-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(110,231,183,0.12) transparent;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }
`;

/* ─── Minimal markdown renderer ─── */
function renderMarkdown(text: string): React.ReactNode {
  // Split into lines for list / heading handling
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    // Heading: ## or ###
    const h3 = line.match(/^###\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    if (h3 || h2) {
      const content = (h3 || h2)![1];
      nodes.push(
        <div key={li} style={{
          fontWeight: 800, fontSize: h2 ? 15 : 14,
          color: "#6ee7b7", marginTop: li > 0 ? 12 : 4, marginBottom: 2,
        }}>
          {inlineRender(content)}
        </div>
      );
      return;
    }

    // Bullet list
    const bullet = line.match(/^[-*]\s+(.+)/);
    if (bullet) {
      nodes.push(
        <div key={li} style={{ display: "flex", gap: 8, marginTop: 3 }}>
          <span style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }}>·</span>
          <span>{inlineRender(bullet[1])}</span>
        </div>
      );
      return;
    }

    // Numbered list
    const numbered = line.match(/^(\d+)\.\s+(.+)/);
    if (numbered) {
      nodes.push(
        <div key={li} style={{ display: "flex", gap: 8, marginTop: 3 }}>
          <span style={{ color: "#34d399", flexShrink: 0, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
            {numbered[1]}.
          </span>
          <span>{inlineRender(numbered[2])}</span>
        </div>
      );
      return;
    }

    // Blank line → paragraph break
    if (line.trim() === "") {
      if (li > 0 && li < lines.length - 1) {
        nodes.push(<div key={li} style={{ height: 6 }} />);
      }
      return;
    }

    // Normal line
    nodes.push(<div key={li}>{inlineRender(line)}</div>);
  });

  return <>{nodes}</>;
}

function inlineRender(text: string): React.ReactNode {
  // Handle **bold**, *italic*, `code` inline
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "#e8efea" }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i} style={{ fontStyle: "italic", color: "rgba(232,239,234,0.85)" }}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} style={{
          background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.15)",
          borderRadius: 4, padding: "1px 5px", fontSize: "0.88em",
          fontFamily: "monospace", color: "#6ee7b7",
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/* ─── Small avatar ─── */
function AiDot() {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
      background: "rgba(16,185,129,0.12)", border: "1px solid rgba(110,231,183,0.22)",
      display: "grid", placeItems: "center",
    }}>
      <span style={{ fontSize: 11, fontWeight: 900, color: "#6ee7b7" }}>A</span>
    </div>
  );
}

/* ─── Typing indicator ─── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: "#34d399",
          animation: `_ay_typing 1.1s ease-in-out ${i * 0.14}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── Conversation sidebar ─── */
function ConversationSidebar({
  conversations, currentId, onSelect, onDelete, onNew, onClose, loading,
}: {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (c: Conversation) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }); }
    catch { return ""; }
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 280, zIndex: 50,
        background: "rgba(8,14,11,0.98)",
        borderLeft: "1px solid rgba(110,231,183,0.1)",
        display: "flex", flexDirection: "column",
        animation: "_ay_slide 0.2s ease",
        boxShadow: "-12px 0 40px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px",
          borderBottom: "1px solid rgba(110,231,183,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "rgba(232,239,234,0.8)" }}>مکالمات</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, display: "grid", placeItems: "center",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer",
          }}>
            <X size={13} color="rgba(232,239,234,0.5)" />
          </button>
        </div>

        {/* New btn */}
        <div style={{ padding: "10px 12px" }}>
          <button onClick={() => { onNew(); onClose(); }} style={{
            width: "100%", padding: "8px 12px", borderRadius: 9,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(110,231,183,0.2)",
            fontSize: 12, fontWeight: 700, color: "#6ee7b7",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            + مکالمه جدید
          </button>
        </div>

        {/* List */}
        <div className="ay-scroll" data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
              <Loader2 size={16} color="rgba(110,231,183,0.4)" className="_ay_spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "rgba(232,239,234,0.3)", fontSize: 12 }}>
              هنوز مکالمه‌ای نداری
            </div>
          ) : conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => { onSelect(conv); onClose(); }}
              style={{
                padding: "9px 10px", borderRadius: 9, cursor: "pointer", marginBottom: 3,
                background: currentId === conv.id ? "rgba(16,185,129,0.1)" : "transparent",
                border: `1px solid ${currentId === conv.id ? "rgba(110,231,183,0.18)" : "transparent"}`,
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.12s",
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: conv.mode === "free" ? "#a78bfa" : "#34d399",
                opacity: 0.7,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: "rgba(232,239,234,0.85)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {conv.title || (conv.mode === "free" ? "مکالمه آزاد" : "مشاور شغلی")}
                </div>
                <div style={{ fontSize: 10, color: "rgba(232,239,234,0.35)", marginTop: 2 }}>
                  {fmt(conv.updated_at)} · {conv.message_count} پیام
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                  background: "transparent", border: "none", cursor: "pointer",
                  display: "grid", placeItems: "center", opacity: 0.45,
                }}
              >
                <Trash2 size={10} color="#f87171" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export function ChatClient({
  nickname, jobTitle, hasAnalysis, plan = "free",
  initialGreeting, taskSuggestions,
}: {
  nickname: string;
  jobTitle: string;
  industry: string;
  hasAnalysis: boolean;
  plan?: string;
  initialGreeting?: string;
  taskSuggestions?: string[];
}) {
  const FREE_DAILY_LIMIT = 5;
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState("");
  const [isStreaming, setIsStreaming]      = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [mode, setMode]                   = useState<Mode>("career");
  const [showSidebar, setShowSidebar]     = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convLoading, setConvLoading]     = useState(false);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [dailyUsed, setDailyUsed]         = useState(0);
  const [limitReached, setLimitReached]   = useState(false);
  const [lastInput, setLastInput]         = useState("");

  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const abortRef     = useRef<AbortController | null>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const atBottomRef  = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  /* ── Usage fetch ── */
  useEffect(() => {
    if (plan !== "free") return;
    fetch("/api/usage?type=chat_today")
      .then(r => r.json())
      .then(d => {
        const used = d.chat_today ?? 0;
        setDailyUsed(used);
        if (used >= FREE_DAILY_LIMIT) setLimitReached(true);
      })
      .catch(() => {});
  }, [plan]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (atBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    atBottomRef.current = fromBottom < 80;
    setShowScrollBtn(fromBottom > 200);
  }

  function scrollToBottom() {
    atBottomRef.current = true;
    setShowScrollBtn(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  /* ── Conversations ── */
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

  const loadConversation = useCallback(async (conv: Conversation) => {
    try {
      const res  = await fetch(`/api/conversations/${conv.id}`);
      const data = await res.json();
      const msgs: Message[] = (data.messages ?? []).map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
        id: m.id, role: m.role, content: m.content, streaming: false,
      }));
      // Allow auto-scroll to bottom when messages set
      atBottomRef.current = true;
      setMessages(msgs);
      setCurrentConvId(conv.id);
      setMode(conv.mode);
      setShowScrollBtn(false);
    } catch { /* ignore */ }
  }, []);

  const startNew = useCallback(() => {
    setMessages([]);
    setCurrentConvId(null);
    setError(null);
    setInput("");
  }, []);

  const deleteConv = useCallback(async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConvId === id) startNew();
  }, [currentConvId, startNew]);

  /* ── Send ── */
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");
    setLastInput(trimmed);
    if (inputRef.current) inputRef.current.style.height = "auto";

    atBottomRef.current = true;
    const userMsg: Message     = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId          = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    let convId = currentConvId;
    if (!convId) {
      try {
        const res  = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, title: trimmed.slice(0, 50) + (trimmed.length > 50 ? "…" : "") }),
        });
        const data = await res.json();
        convId = data.conversation?.id ?? null;
        if (convId) {
          setCurrentConvId(convId);
          setConversations(prev => [data.conversation, ...prev]);
        }
      } catch { /* proceed */ }
    }

    const allMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
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

      if (!res.ok) throw new Error(`${res.status}`);

      const reader    = res.body!.getReader();
      const decoder   = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: accumulated, streaming: true } : m)
        );
      }

      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      );

      fetchConversations();
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "خطا در ارسال پیام";
      if (msg.includes("daily_limit") || msg.includes("429")) {
        setLimitReached(true);
        setDailyUsed(FREE_DAILY_LIMIT);
      }
      setError(msg);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
      if (plan === "free") setDailyUsed(prev => Math.min(prev + 1, FREE_DAILY_LIMIT));
    }
  }, [messages, isStreaming, mode, currentConvId, fetchConversations, plan]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty     = messages.length === 0;
  const suggestions = mode === "free" ? FREE_SUGGESTIONS : CAREER_SUGGESTIONS;
  const isBlocked   = limitReached && plan === "free";

  return (
    <>
      <style>{CHAT_CSS}</style>

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

      {/*
        Full-screen fixed layout — solves all scroll conflicts.
        Header (fixed height) + messages (flex-1 scroll) + composer (auto height).
      */}
      <div dir="rtl" className="ay-chat" style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#020306",
        color: "#e8efea",
        fontFamily: "'Vazirmatn', sans-serif",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>

        {/* ─────────── HEADER ─────────── */}
        <header style={{
          flexShrink: 0,
          display: "flex", alignItems: "center",
          padding: "0 16px",
          height: 56,
          borderBottom: "1px solid rgba(110,231,183,0.07)",
          background: "rgba(2,3,6,0.96)",
          backdropFilter: "blur(16px)",
          gap: 10,
        }}>
          {/* Back */}
          <Link href="/dashboard" style={{
            width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(110,231,183,0.09)",
            textDecoration: "none", flexShrink: 0,
          }}>
            <ArrowRight size={14} color="rgba(232,239,234,0.6)" />
          </Link>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: -0.2, color: "#e8efea" }}>
              مسیریاب · ای‌وای
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#34d399", boxShadow: "0 0 5px #34d399",
              }} />
              <span style={{ fontSize: 10, color: "rgba(110,231,183,0.55)" }}>
                {jobTitle ? jobTitle : "آنلاین"}
              </span>
            </div>
          </div>

          {/* Mode toggle — pill pair */}
          <div style={{
            display: "flex", borderRadius: 8, overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(110,231,183,0.09)",
          }}>
            {(["career", "free"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); if (!currentConvId) startNew(); }}
                style={{
                  padding: "5px 11px", fontSize: 11, fontWeight: 700,
                  border: "none", fontFamily: "inherit", cursor: "pointer",
                  background: mode === m
                    ? (m === "free" ? "rgba(139,92,246,0.2)" : "rgba(16,185,129,0.18)")
                    : "transparent",
                  color: mode === m
                    ? (m === "free" ? "#a78bfa" : "#6ee7b7")
                    : "rgba(232,239,234,0.4)",
                  transition: "all 0.12s",
                  display: "flex", alignItems: "center", gap: 3,
                }}
              >
                {m === "career" ? <MessageSquare size={9} /> : <Zap size={9} />}
                {m === "career" ? "شغلی" : "آزاد"}
              </button>
            ))}
          </div>

          {/* New chat */}
          {messages.length > 0 && (
            <button
              onClick={startNew}
              style={{
                width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(110,231,183,0.09)",
                cursor: "pointer", flexShrink: 0,
              }}
              title="مکالمه جدید"
            >
              <RefreshCw size={13} color="rgba(232,239,234,0.55)" />
            </button>
          )}

          {/* History */}
          <button
            onClick={() => setShowSidebar(true)}
            style={{
              width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(110,231,183,0.09)",
              cursor: "pointer", flexShrink: 0, position: "relative",
            }}
            title="تاریخچه"
          >
            <PanelRight size={13} color="rgba(232,239,234,0.55)" />
            {conversations.length > 0 && (
              <span style={{
                position: "absolute", top: 7, right: 7, width: 5, height: 5,
                borderRadius: "50%", background: "#34d399",
              }} />
            )}
          </button>
        </header>

        {/* ─────────── MESSAGES ─────────── */}
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="ay-scroll"
            data-lenis-prevent
            style={{
              height: "100%",
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: "24px 16px 16px",
            }}
          >
            <div style={{ maxWidth: 600, margin: "0 auto" }}>

              {/* ─── Empty state ─── */}
              {isEmpty && (
                <div style={{ paddingTop: 24 }}>

                  {/* ── Career mode: guided coaching greeting ── */}
                  {mode === "career" && initialGreeting ? (
                    <div style={{ maxWidth: 520, margin: "0 auto" }}>

                      {/* AI greeting bubble */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ paddingTop: 2, flexShrink: 0 }}>
                          <AiDot />
                        </div>
                        <div
                          className="ay-bubble-ai"
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: "5px 16px 16px 16px",
                            fontSize: 14, lineHeight: 1.85, color: "#e8efea",
                            background: "rgba(16,24,20,0.75)",
                            border: "1px solid rgba(110,231,183,0.1)",
                          }}
                        >
                          {renderMarkdown(initialGreeting)}
                        </div>
                      </div>

                      {/* Task chips */}
                      <div style={{ marginTop: 14, marginRight: 34, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 10.5, color: "rgba(110,231,183,0.4)", marginBottom: 2 }}>
                          مثلاً می‌تونی بگی:
                        </div>
                        {(taskSuggestions ?? suggestions).map((s) => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            style={{
                              padding: "9px 14px", borderRadius: 10, textAlign: "right",
                              background: "rgba(16,185,129,0.05)",
                              border: "1px solid rgba(110,231,183,0.12)",
                              fontSize: 13, color: "rgba(232,239,234,0.75)",
                              cursor: "pointer", fontFamily: "inherit",
                              transition: "border-color 0.12s, background 0.12s",
                              display: "flex", alignItems: "center", gap: 8,
                            }}
                          >
                            <span style={{ color: "rgba(110,231,183,0.4)", fontSize: 10 }}>↩</span>
                            {s}
                          </button>
                        ))}
                      </div>

                      {!hasAnalysis && (
                        <div style={{
                          marginTop: 20, marginRight: 34,
                          padding: "8px 14px", borderRadius: 9,
                          background: "rgba(234,179,8,0.07)", border: "1px solid rgba(251,191,36,0.18)",
                          fontSize: 11.5, color: "#fcd34d", lineHeight: 1.6,
                        }}>
                          💡 اگه تحلیل مسیر شغلی انجام بدی، مثال‌ها شخصی‌تر می‌شن
                        </div>
                      )}
                    </div>

                  ) : (
                    /* ── Free mode / fallback: classic centered empty state ── */
                    <div style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", textAlign: "center",
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 16,
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(110,231,183,0.2)",
                        display: "grid", placeItems: "center", marginBottom: 16,
                      }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: "#6ee7b7" }}>A</span>
                      </div>

                      <h2 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 18, color: "#e8efea", letterSpacing: -0.4 }}>
                        چه کمکی می‌تونم بکنم؟
                      </h2>
                      <p style={{ margin: "0 0 24px", fontSize: 13, lineHeight: 1.7, color: "rgba(232,239,234,0.5)", maxWidth: 260 }}>
                        هر سوال، متن یا کدی داری بپرس.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 340 }}>
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            style={{
                              padding: "9px 14px", borderRadius: 10, textAlign: "right",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(110,231,183,0.09)",
                              fontSize: 12.5, color: "rgba(232,239,234,0.7)",
                              cursor: "pointer", fontFamily: "inherit",
                              transition: "border-color 0.12s, background 0.12s",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Messages ─── */}
              {messages.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {messages.map((msg, i) => {
                    const isUser = msg.role === "user";
                    const prevSame = i > 0 && messages[i - 1].role === msg.role;
                    const showAvatar = !isUser && !prevSame;

                    return (
                      <div
                        key={msg.id}
                        className="_ay_msg"
                        style={{
                          display: "flex",
                          flexDirection: isUser ? "row-reverse" : "row",
                          alignItems: "flex-end",
                          gap: 8,
                          marginTop: prevSame ? 2 : 16,
                        }}
                      >
                        {/* AI avatar — only on first in group */}
                        {!isUser && (
                          <div style={{ width: 26, flexShrink: 0 }}>
                            {showAvatar ? <AiDot /> : null}
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={isUser ? "ay-bubble-user" : "ay-bubble-ai"}
                          style={{
                            maxWidth: isUser ? "72%" : "82%",
                            padding: isUser ? "9px 14px" : "11px 15px",
                            borderRadius: isUser
                              ? (prevSame ? "16px 5px 5px 16px" : "16px 16px 5px 16px")
                              : (prevSame ? "5px 16px 16px 5px" : "5px 16px 16px 16px"),
                            fontSize: 14,
                            lineHeight: 1.85,
                            color: "#e8efea",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            ...(isUser ? {
                              background: "rgba(16,185,129,0.15)",
                              border: "1px solid rgba(52,211,153,0.2)",
                            } : {
                              background: "rgba(16,24,20,0.75)",
                              border: "1px solid rgba(110,231,183,0.07)",
                            }),
                          }}
                        >
                          {msg.content
                            ? <>
                                {isUser
                                  ? msg.content
                                  : renderMarkdown(msg.content)}
                                {msg.streaming && (
                                  <span style={{
                                    display: "inline-block", width: 2, height: 13,
                                    background: "#34d399", verticalAlign: "middle",
                                    marginInlineStart: 3,
                                    animation: "_ay_caret 0.9s steps(2) infinite",
                                  }} />
                                )}
                              </>
                            : msg.streaming ? <ChatThinkingBubble /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  marginTop: 16, padding: "10px 14px", borderRadius: 10,
                  background: "rgba(239,68,68,0.07)", border: "1px solid rgba(248,113,113,0.22)",
                  fontSize: 12, color: "#fca5a5",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                }}>
                  <span>خطا در ارسال</span>
                  {lastInput && (
                    <button
                      onClick={() => { setError(null); sendMessage(lastInput); }}
                      style={{
                        flexShrink: 0, padding: "4px 10px", borderRadius: 7,
                        background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.28)",
                        color: "#fca5a5", fontSize: 11, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      تلاش مجدد
                    </button>
                  )}
                </div>
              )}

              <div ref={bottomRef} style={{ height: 8 }} />
            </div>
          </div>

          {/* Scroll-to-bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              style={{
                position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                padding: "6px 16px", borderRadius: 999, zIndex: 10,
                background: "rgba(18,26,22,0.95)", border: "1px solid rgba(110,231,183,0.3)",
                backdropFilter: "blur(12px)",
                fontSize: 11.5, color: "#6ee7b7", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              پیام جدید ↓
            </button>
          )}
        </div>

        {/* ─────────── COMPOSER ─────────── */}
        <div style={{
          flexShrink: 0,
          borderTop: "1px solid rgba(110,231,183,0.06)",
          background: "rgba(2,3,6,0.98)",
          backdropFilter: "blur(16px)",
          padding: "10px 14px 12px",
        }}>
          {/* Daily limit banner */}
          {isBlocked && (
            <div style={{
              marginBottom: 10, padding: "10px 14px", borderRadius: 12,
              background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.2)",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fde68a" }}>
                    سقف روزانه تموم شد
                  </div>
                  <div style={{ fontSize: 10.5, color: "rgba(253,230,138,0.5)", marginTop: 2 }}>
                    فردا ۵ پیام جدید — یا همین الان Pro بشو
                  </div>
                </div>
                <a href="/billing" style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                  background: "linear-gradient(135deg, #fde68a, #eab308)",
                  color: "#2a1d03", textDecoration: "none", flexShrink: 0,
                }}>
                  ارتقا
                </a>
              </div>
              <a href="/games" style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 10px", borderRadius: 8, textDecoration: "none",
                background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
              }}>
                <span style={{ fontSize: 14 }}>🐍</span>
                <span style={{ fontSize: 11, color: "#6ee7b7", fontWeight: 600 }}>
                  Snake بازی کن (امتیاز &gt; ۱۰) → +۱ پیام رایگان امروز
                </span>
              </a>
            </div>
          )}

          {/* Usage dots — free users not at limit */}
          {plan === "free" && !isBlocked && dailyUsed > 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 5, marginBottom: 8,
            }}>
              {Array.from({ length: FREE_DAILY_LIMIT }).map((_, i) => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: i < dailyUsed ? "rgba(52,211,153,0.55)" : "rgba(110,231,183,0.12)",
                  transition: "background 0.25s",
                }} />
              ))}
              <span style={{ fontSize: 10, color: "rgba(232,239,234,0.3)", marginRight: 2 }}>
                {dailyUsed}/{FREE_DAILY_LIMIT}
              </span>
            </div>
          )}

          {/* Input row */}
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            background: "rgba(18,26,22,0.8)",
            border: `1px solid ${isBlocked ? "rgba(250,204,21,0.15)" : "rgba(110,231,183,0.14)"}`,
            borderRadius: 16,
            padding: "6px 6px 6px 12px",
            opacity: isBlocked ? 0.55 : 1,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 130)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isBlocked
                  ? "سقف روزانه تموم شد"
                  : mode === "free" ? "هر چیزی بپرس…" : "سوال شغلی‌ات رو بپرس…"
              }
              rows={1}
              disabled={isBlocked}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                resize: "none", fontSize: 13.5, color: "#e8efea",
                fontFamily: "inherit", caretColor: "#34d399",
                minHeight: 36, maxHeight: 130,
                padding: "7px 0",
                cursor: isBlocked ? "not-allowed" : "text",
                lineHeight: 1.5,
                opacity: isStreaming ? 0.55 : 1,
              }}
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming || isBlocked}
              style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                border: "none", cursor: "pointer",
                background: mode === "free"
                  ? "linear-gradient(135deg, #a78bfa, #7c3aed)"
                  : "linear-gradient(135deg, #34d399, #10b981)",
                display: "grid", placeItems: "center",
                opacity: (!input.trim() || isStreaming || isBlocked) ? 0.35 : 1,
                transition: "opacity 0.15s",
                boxShadow: mode === "free"
                  ? "0 2px 12px rgba(124,58,237,0.3)"
                  : "0 2px 12px rgba(52,211,153,0.3)",
              }}
            >
              {isStreaming
                ? <Loader2 size={14} color="#fff" className="_ay_spin" />
                : <Send size={14} color="#fff" strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* ─────────── BOTTOM NAV SPACER ─────────── */}
        {/* BottomNav is fixed, this keeps composer above it */}
        <div style={{ height: 64, flexShrink: 0 }} />
      </div>
    </>
  );
}
