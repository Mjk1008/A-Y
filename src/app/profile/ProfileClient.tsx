"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Sparkles, X } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("unauth");
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: form.full_name,
            age: form.age ? parseInt(form.age) : null,
            job_title: form.job_title,
            industry: form.industry,
            years_experience: parseInt(form.years_experience || "0"),
            skills: form.skills,
            bio: form.bio || null,
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  async function reanalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      await save();
      const r = await fetch("/api/analyze", { method: "POST" });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "analyze_failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="card">
      <h1 className="mb-2 text-2xl font-bold">ویرایش پروفایل</h1>
      <p className="mb-6 text-sm text-ink-300">بعد از ویرایش، برای نتیجه تازه «تحلیل مجدد» بزن.</p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">نام</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">سن</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">سال تجربه</label>
            <input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className="input-field" dir="ltr" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">عنوان شغلی</label>
          <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">صنعت</label>
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">مهارت‌ها</label>
          <div className="flex gap-2">
            <input
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              className="input-field flex-1"
              placeholder="بنویس و Enter بزن"
            />
            <button onClick={addSkill} className="btn-ghost !px-4">افزودن</button>
          </div>
          {form.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                  <button onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">درباره</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field min-h-[100px]" />
        </div>

        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {success && <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">ذخیره شد ✓</div>}

        <div className="flex items-center gap-3 pt-4">
          <button onClick={save} disabled={loading || analyzing} className="btn-ghost">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
          </button>
          <button onClick={reanalyze} disabled={loading || analyzing} className="btn-primary">
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                تحلیل مجدد...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 ml-2" />
                ذخیره و تحلیل مجدد
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
