"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, Crown, Zap, User, Shield, RefreshCw, Check, X } from "lucide-react";

type Plan = "free" | "pro" | "max";

interface AppUser {
  id: string;
  phone: string;
  plan_type: Plan;
  is_admin: boolean;
  created_at: string;
  full_name?: string;
  job_title?: string;
}

const PLAN_LABEL: Record<Plan, string> = { free: "رایگان", pro: "پرو", max: "مکس" };
const PLAN_COLOR: Record<Plan, string> = {
  free: "rgba(255,255,255,0.5)",
  pro: "#34d399",
  max: "#fcd34d",
};
const PLAN_BG: Record<Plan, string> = {
  free: "rgba(255,255,255,0.06)",
  pro: "rgba(52,211,153,0.12)",
  max: "rgba(252,211,77,0.12)",
};
const PLAN_ICON: Record<Plan, React.ReactNode> = {
  free: <User size={11} />,
  pro: <Zap size={11} />,
  max: <Crown size={11} />,
};

function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700,
      color: PLAN_COLOR[plan], background: PLAN_BG[plan],
      border: `1px solid ${PLAN_COLOR[plan]}44`,
    }}>
      {PLAN_ICON[plan]}
      {PLAN_LABEL[plan]}
    </span>
  );
}

export function AdminManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [addPhone, setAddPhone] = useState("");
  const [addPlan, setAddPlan] = useState<Plan>("free");
  const [addAdmin, setAddAdmin] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addMsg, setAddMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<Plan>("free");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(search)}&limit=50`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  async function addUser() {
    if (!addPhone.trim()) return;
    setAddLoading(true); setAddMsg(null);
    try {
      const res = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: addPhone.trim(), plan: addPlan, isAdmin: addAdmin }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddMsg({ type: "ok", text: `✓ کاربر ${addPhone} با پلن ${PLAN_LABEL[addPlan]} اضافه/آپدیت شد` });
        setAddPhone(""); setAddPlan("free"); setAddAdmin(false);
        fetchUsers();
      } else {
        setAddMsg({ type: "err", text: data.error || "خطا" });
      }
    } catch {
      setAddMsg({ type: "err", text: "خطای اتصال" });
    } finally {
      setAddLoading(false);
    }
  }

  async function updateUser(userId: string, plan?: Plan, isAdmin?: boolean) {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...(plan !== undefined ? { plan } : {}), ...(isAdmin !== undefined ? { isAdmin } : {}) }),
      });
      setUsers((prev) => prev.map((u) => u.id === userId ? {
        ...u,
        ...(plan !== undefined ? { plan_type: plan } : {}),
        ...(isAdmin !== undefined ? { is_admin: isAdmin } : {}),
      } : u));
      setEditingId(null);
    } catch { /* ignore */ }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Add User Card ── */}
      <div style={{
        borderRadius: 18, padding: 20,
        background: "linear-gradient(135deg, rgba(252,211,77,0.06) 0%, rgba(52,211,153,0.04) 100%)",
        border: "1px solid rgba(252,211,77,0.16)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <UserPlus size={16} style={{ color: "#fcd34d" }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: "#e8efea" }}>افزودن / آپدیت کاربر</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Phone input */}
          <input
            type="tel"
            placeholder="شماره موبایل (مثلاً ۰۹۳۶۶۲۹۱۰۰۸)"
            value={addPhone}
            onChange={(e) => setAddPhone(e.target.value)}
            dir="ltr"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
              color: "#e8efea", outline: "none", fontFamily: "monospace",
              boxSizing: "border-box",
            }}
          />

          {/* Plan selector */}
          <div style={{ display: "flex", gap: 6 }}>
            {(["free", "pro", "max"] as Plan[]).map((p) => (
              <button
                key={p}
                onClick={() => setAddPlan(p)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", border: `1px solid ${addPlan === p ? PLAN_COLOR[p] : "rgba(255,255,255,0.08)"}`,
                  background: addPlan === p ? PLAN_BG[p] : "rgba(255,255,255,0.03)",
                  color: addPlan === p ? PLAN_COLOR[p] : "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}
              >
                {PLAN_ICON[p]} {PLAN_LABEL[p]}
              </button>
            ))}
          </div>

          {/* Admin toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setAddAdmin(!addAdmin)}
              style={{
                width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                background: addAdmin ? "#fcd34d" : "rgba(255,255,255,0.10)",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 2, left: addAdmin ? 18 : 2,
                width: 16, height: 16, borderRadius: "50%",
                background: addAdmin ? "#0a0700" : "rgba(255,255,255,0.5)",
                transition: "left 0.2s",
              }} />
            </button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
              <Shield size={12} style={{ color: "#fcd34d" }} />
              دسترسی ادمین
            </span>
          </div>

          {/* Add button */}
          <button
            onClick={addUser}
            disabled={addLoading || !addPhone.trim()}
            style={{
              padding: "11px 0", borderRadius: 11, border: "none", cursor: "pointer",
              background: addPhone.trim() ? "#fcd34d" : "rgba(255,255,255,0.06)",
              color: addPhone.trim() ? "#0a0700" : "rgba(255,255,255,0.25)",
              fontWeight: 800, fontSize: 14,
              transition: "all 0.15s",
            }}
          >
            {addLoading ? "در حال ذخیره…" : "➕ اضافه / آپدیت کاربر"}
          </button>

          {/* Message */}
          {addMsg && (
            <div style={{
              padding: "8px 12px", borderRadius: 8, fontSize: 12,
              background: addMsg.type === "ok" ? "rgba(52,211,153,0.10)" : "rgba(239,68,68,0.10)",
              color: addMsg.type === "ok" ? "#34d399" : "#ef4444",
              border: `1px solid ${addMsg.type === "ok" ? "rgba(52,211,153,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
              {addMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* ── Users List ── */}
      <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Search header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <Search size={14} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="جستجو بر اساس شماره یا نام…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 13, color: "#e8efea",
            }}
          />
          <button onClick={fetchUsers} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
            <RefreshCw size={14} style={{ color: loading ? "#34d399" : undefined }} />
          </button>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {users.length} کاربر
          </span>
        </div>

        {/* User rows */}
        <div className="scroll-touch" data-lenis-prevent style={{ maxHeight: 420, overflowY: "auto" }}>
          {loading && users.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              در حال بارگذاری…
            </div>
          )}
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: u.is_admin ? "rgba(252,211,77,0.12)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${u.is_admin ? "rgba(252,211,77,0.3)" : "rgba(255,255,255,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: u.is_admin ? "#fcd34d" : "rgba(255,255,255,0.5)",
              }}>
                {u.is_admin ? <Shield size={14} /> : (u.full_name?.charAt(0) || u.phone.slice(-2))}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8efea", fontFamily: "monospace", direction: "ltr" }}>
                  {u.phone}
                </div>
                {u.full_name && (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{u.full_name}</div>
                )}
              </div>

              {/* Plan editor */}
              {editingId === u.id ? (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value as Plan)}
                    style={{
                      padding: "4px 6px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                      background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                      color: "#e8efea", cursor: "pointer",
                    }}
                  >
                    <option value="free">رایگان</option>
                    <option value="pro">پرو</option>
                    <option value="max">مکس</option>
                  </select>
                  <button onClick={() => updateUser(u.id, editPlan)} style={{ background: "none", border: "none", cursor: "pointer", color: "#34d399" }}>
                    <Check size={15} />
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(u.id); setEditPlan(u.plan_type); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <PlanBadge plan={u.plan_type} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
