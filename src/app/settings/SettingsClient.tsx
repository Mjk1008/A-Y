"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Bell, Shield, Trash2, Download,
  ChevronLeft, User, CreditCard, HelpCircle, LogOut, Check
} from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";

interface Props {
  user: { phone: string; plan_type: string; created_at: string };
  prefs: Record<string, boolean>;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${on ? "bg-emerald-500" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="border-b border-white/[0.06] px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-500">{title}</h2>
      </div>
      <div className="divide-y divide-white/[0.04]">{children}</div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, sub, right }: {
  icon: any; label: string; sub?: string; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-4 w-4 text-ink-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-ink-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function NavRow({ icon: Icon, label, sub, href, danger }: {
  icon: any; label: string; sub?: string; href: string; danger?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.02]">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${danger ? "bg-red-500/10" : "bg-white/5"}`}>
        <Icon className={`h-4 w-4 ${danger ? "text-red-400" : "text-ink-400"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-red-400" : ""}`}>{label}</p>
        {sub && <p className="text-xs text-ink-500">{sub}</p>}
      </div>
      <ChevronLeft className="h-4 w-4 text-ink-600" />
    </Link>
  );
}

export default function SettingsClient({ user, prefs: initialPrefs }: Props) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(initialPrefs);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  async function updatePref(key: string, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    setSaving(true);
    await fetch("/api/notifications/prefs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: "DELETE" }),
    });
    router.push("/");
    router.refresh();
  }

  const PLAN_LABELS: Record<string, string> = { free: "رایگان", pro: "پرو", max: "مکس" };

  return (
    <div className="min-h-screen pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      <BottomNav />
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/[0.06]"
        style={{ background: "rgba(2,3,6,0.85)", backdropFilter: "blur(14px)" }}>
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded-lg p-1.5 text-ink-400 transition hover:text-ink-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base font-bold">تنظیمات</h1>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" /> ذخیره شد
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* Account info */}
        <Section title="حساب کاربری">
          <SettingRow
            icon={User}
            label="شماره موبایل"
            sub={user.phone}
            right={<span className="text-xs text-ink-600">قابل تغییر نیست</span>}
          />
          <SettingRow
            icon={CreditCard}
            label="پلن فعلی"
            sub={PLAN_LABELS[user.plan_type] || user.plan_type}
            right={
              <Link href="/billing" className="rounded-lg border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 transition hover:bg-emerald-500/10">
                مدیریت
              </Link>
            }
          />
          <SettingRow
            icon={Shield}
            label="عضو از"
            sub={new Date(user.created_at).toLocaleDateString("fa-IR")}
          />
        </Section>

        {/* Notifications */}
        <Section title="اعلان‌ها">
          {[
            { key: "weekly_digest",   label: "دیجست هفتگی",      sub: "خلاصه هفتگی بازار کار و ابزارها" },
            { key: "job_alerts",      label: "شغل‌های جدید",      sub: "وقتی شغل مناسب پیدا می‌شه" },
            { key: "tool_updates",    label: "ابزارهای جدید AI",  sub: "معرفی ابزارهای مرتبط با شغلت" },
            { key: "expiry_reminder", label: "یادآوری انقضا",    sub: "۷ روز قبل از پایان اشتراک" },
            { key: "chat_reminders",  label: "یادآوری مسیریاب",  sub: "اگه ۳ روز وارد نشی" },
          ].map(({ key, label, sub }) => (
            <SettingRow
              key={key}
              icon={Bell}
              label={label}
              sub={sub}
              right={
                <Toggle
                  on={!!prefs[key]}
                  onChange={(v) => updatePref(key, v)}
                />
              }
            />
          ))}
        </Section>

        {/* Links */}
        <Section title="دیگر">
          <NavRow icon={HelpCircle} label="راهنما و سوالات متداول" sub="جواب همه سوالا اینجاست" href="/help" />
          <NavRow icon={Download} label="دانلود داده‌هام" sub="خروجی JSON از همه اطلاعاتت" href="/api/account/export" />
          <NavRow icon={LogOut} label="خروج از حساب" href="#" />
        </Section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-ink-400 transition hover:text-ink-200"
        >
          خروج از حساب
        </button>

        {/* Danger zone */}
        <Section title="منطقه خطر">
          <div className="p-5">
            <p className="mb-3 text-sm text-ink-400">
              با حذف حساب، تمام اطلاعات، تحلیل‌ها و تاریخچه‌ات برای همیشه پاک می‌شه. این عمل برگشت‌ناپذیره.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> حذف حساب
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-300">
                  برای تأیید، <span className="font-mono">DELETE</span> رو تایپ کن:
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className="input-field font-mono"
                  dir="ltr"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE" || deleting}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40 transition hover:bg-red-500"
                  >
                    {deleting ? "در حال حذف..." : "حذف دائمی"}
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                    className="btn-ghost px-4 py-2 text-sm"
                  >
                    لغو
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
