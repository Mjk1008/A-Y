"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, X, Check, Zap } from "lucide-react";
import { AnalysisLoading, SuccessScreen } from "@/app/components/LoadingStates";

type Profile = {
  full_name: string;
  age: number | null;
  job_title: string;
  industry: string;
  years_experience: number;
  skills: string[];
  bio: string | null;
};

export function ProfileClient({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: initial.full_name,
    age: initial.age?.toString() ?? "",
    job_title: initial.job_title,
    industry: initial.industry,
    years_experience: initial.years_experience?.toString() ?? "0",
    skills: initial.skills ?? [],
    skillInput: "",
    bio: initial.bio ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeView, setAnalyzeView] = useState<"form" | "loading" | "success">("form");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  function addSkill() {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s], skillInput: "" }));
    }
  }

  async function save() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          age: form.age ? parseInt(form.age) : null,
          job_title: form.job_title,
          industry: form.industry,
          years_experience: parseInt(form.years_experience || "0"),
          skills: form.skills,
          bio: form.bio || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "خطا در ذخیره");
      }
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  async function reanalyze() {
    setAnalyzing(true);
    setAnalyzeView("loading");
    setError(null);
    setQuotaExceeded(false);
    try {
      const saveRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          age: form.age ? parseInt(form.age) : null,
          job_title: form.job_title,
          industry: form.industry,
          years_experience: parseInt(form.years_experience || "0"),
          skills: form.skills,
          bio: form.bio || null,
        }),
      });
      if (!saveRes.ok) throw new Error("خطا در ذخیره پروفایل");

      const r = await fetch("/api/analyze", { method: "POST" });
      if (r.status === 429) {
        setAnalyzeView("form");
        setQuotaExceeded(true);
        return;
      }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "خطا در تحلیل");
      }
      setAnalyzeView("success");
      setTimeout(() => {
        router.push("/dashboard/analysis");
        router.refresh();
      }, 2500);
    } catch (e: unknown) {
      setAnalyzeView("form");
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setAnalyzing(false);
    }
  }

  if (analyzeView === "loading") return <AnalysisLoading />;
  if (analyzeView === "success") {
    return (
      <SuccessScreen onContinue={() => { router.push("/dashboard/analysis"); router.refresh(); }} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Fields */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-400">نام</label>
        <input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-400">سن</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="input-field"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-400">
            سال‌های تجربه
          </label>
          <input
            type="number"
            value={form.years_experience}
            onChange={(e) =>
              setForm({ ...form, years_experience: e.target.value })
            }
            className="input-field"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-400">
          عنوان شغلی
        </label>
        <input
          value={form.job_title}
          onChange={(e) => setForm({ ...form, job_title: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-400">صنعت</label>
        <input
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-400">
          <span>مهارت‌ها</span>
          <span className="text-ink-600">{form.skills.length} مورد</span>
        </label>
        <div className="flex gap-2">
          <input
            value={form.skillInput}
            onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            className="input-field flex-1"
            placeholder="بنویس و Enter بزن"
          />
          <button type="button" onClick={addSkill} className="btn-ghost !px-4">
            افزودن
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <span key={s} className="chip gap-1.5">
                {s}
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      skills: f.skills.filter((x) => x !== s),
                    }))
                  }
                  className="opacity-60 transition hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-400">
          درباره خودت
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="input-field min-h-[100px] resize-none"
        />
      </div>

      {/* Quota exceeded — upgrade paywall */}
      {quotaExceeded && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            <p className="font-bold text-emerald-300">سقف تحلیل هفتگی رو رسیدی</p>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-ink-400">
            پلن رایگان ۱ تحلیل در هفته داره. با ارتقا به پرو، ۵ تحلیل در هفته،
            مسیریاب AI و ۲۰ شغل روزانه داری.
          </p>
          <Link
            href="/billing/checkout"
            className="btn-lux w-full justify-center text-sm"
          >
            ارتقا به پرو — ۲۹۸٬۰۰۰ تومان/ماه
            <Zap className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setQuotaExceeded(false)}
            className="mt-2 w-full py-2 text-xs text-ink-600 transition hover:text-ink-400"
          >
            بعداً
          </button>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          <Check className="h-4 w-4" />
          ذخیره شد
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-ink-700/40 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={loading || analyzing}
            className="btn-ghost"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
          </button>

          <button
            type="button"
            onClick={reanalyze}
            disabled={loading || analyzing}
            className="btn-primary"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال تحلیل...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                ذخیره و تحلیل مجدد
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
