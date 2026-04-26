"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  created_at: string;
}

const TYPE_EMOJI: Record<string, string> = {
  magazine: "📰",
  job_match: "💼",
  streak_reminder: "🔥",
  analysis_ready: "🤖",
  new_tool: "🛠️",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  /* ── Fetch notifications ──────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Mark all as read ─────────────────────────────────── */
  const markAllRead = useCallback(async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [] }), // empty = all
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, [unreadCount]);

  /* ── On open: fetch + mark read ──────────────────────── */
  const handleOpen = useCallback(async () => {
    setOpen(true);
    await fetchNotifications();
    // small delay so user sees unread badge first, then mark read
    setTimeout(() => markAllRead(), 800);
  }, [fetchNotifications, markAllRead]);

  /* ── Fetch count on mount (lightweight) ──────────────── */
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Close on outside click ──────────────────────────── */
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  /* ── Close on Escape ─────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        ref={bellRef}
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="اعلان‌ها"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 12,
          border: open
            ? "1px solid rgba(250,204,21,0.35)"
            : "1px solid rgba(255,255,255,0.08)",
          background: open
            ? "rgba(250,204,21,0.10)"
            : "rgba(255,255,255,0.03)",
          color: open ? "#fde68a" : "rgba(232,239,234,0.45)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: "#ef4444",
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              border: "1.5px solid #020306",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "۹+" : unreadCount.toLocaleString("fa-IR")}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          dir="rtl"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 300,
            maxHeight: 400,
            overflowY: "auto",
            background: "rgba(12,14,20,0.97)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(232,239,234,0.85)" }}>
              اعلان‌ها
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 6,
                border: "none",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(232,239,234,0.4)",
                cursor: "pointer",
              }}
            >
              <X size={11} />
            </button>
          </div>

          {/* List */}
          {loading && notifications.length === 0 ? (
            <div style={{ padding: "24px 14px", textAlign: "center", fontSize: 12, color: "rgba(232,239,234,0.3)" }}>
              در حال بارگذاری...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "28px 14px", textAlign: "center" }}>
              <Bell size={24} color="rgba(232,239,234,0.15)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 12, color: "rgba(232,239,234,0.3)", margin: 0 }}>
                اعلانی نداری
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}

          {/* Footer — mark all read */}
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              style={{
                width: "100%",
                padding: "9px 14px",
                background: "none",
                border: "none",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(232,239,234,0.35)",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                fontFamily: "inherit",
              }}
            >
              <Check size={11} />
              همه را خوانده شد
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification: n,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const emoji = TYPE_EMOJI[n.type] ?? "🔔";
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: n.read ? "transparent" : "rgba(250,204,21,0.04)",
        transition: "background 0.15s",
        cursor: n.href ? "pointer" : "default",
      }}
    >
      {/* Emoji icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: n.read ? 500 : 700,
            color: n.read ? "rgba(232,239,234,0.55)" : "rgba(232,239,234,0.88)",
            lineHeight: 1.4,
          }}
        >
          {n.title}
        </p>
        {n.body && (
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 10.5,
              color: "rgba(232,239,234,0.32)",
              lineHeight: 1.4,
            }}
          >
            {n.body}
          </p>
        )}
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            background: "#fbbf24",
            flexShrink: 0,
            marginTop: 5,
          }}
        />
      )}
    </div>
  );

  if (n.href) {
    return (
      <Link href={n.href} onClick={onClose} style={{ display: "block", textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return <div>{inner}</div>;
}
