"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Upload, Check, X, Sparkles } from "lucide-react";

const INDUSTRIES = [
  "توسعه نرم‌افزار", "طراحی UI/UX", "دیجیتال مارکتینگ", "محتوا و کپی‌رایتینگ",
  "فروش", "پشتیبانی مشتری", "منابع انسانی", "حسابداری و مالی",
  "مدیریت پروژه", "داده و تحلیل", "آموزش", "حقوق", "پزشکی", "روزنامه‌نگاری",
  "مدیریت", "مهندسی", "ترجمه", "عکاسی و فیلم", "سایر",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    job_title: "",
    industry: "",
    years_experience: "",
    skills: [] as string[],
    skillInput: "",
    bio: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function addSkill() {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s], skillInput: "" }));
    }
  }
  function removeSkill(s: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));
  }

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      let resumeParsedText: string | undefined;
      if (resumeFile) {
        const fd = new FormData();
        fd.append("file", resumeFile);
        const parseRes = await fetch("/api/parse-resume", { method: "POST", body: fd });
        if (parseRes.ok) {
          const j = await parseRes.json();
          resumeParsedText = j.text;
        }
      }

      const profileRes = await fetch("/api/profile", {
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
          resume_parsed_text: resumeParsedText ?? null,
        }),
      });
      if (!profileRes.ok) {
        const j = await profileRes.json().catch(() => ({}));
        throw new Error(j.error || "خطا در ذخیره پروفایل");
      }

      const analyzeRes = await fetch("/api/analyze", { method: "POST" });
      if (!analyzeRes.ok) {
        const j = await analyzeRes.json().catch(() => ({}));
        throw new Error(j.error || "خطا در تحلیل");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطای نامشخص";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const canNext1 = form.full_name && form.age && form.job_title && form.industry;
  const canNext2 = form.years_experience && form.skills.length >= 2;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-black text-ink-900">
              AY
            </div>
            <span className="font-bold">A-Y</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <span>مرحله</span>
            <span className="font-bold text-brand-400">{step}</span>
            <span>/</span>
            <span>۳</span>
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition ${
                i <= step ? "bg-gradient-to-l from-brand-400 to-brand-600" : "bg-ink-600"
              }`}
            />
          ))}
        </div>

        <div className="card">
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="mb-1 text-2xl font-bold">تعریف کن خودتو</h2>
                <p className="text-sm text-ink-300">
                  این اطلاعات پایه به ما کمک می‌کنه تحلیل دقیق‌تری بدیم.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">نام و نام خانوادگی</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input-field"
                  placeholder="مثلاً علی احمدی"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">سن</label>
                  <input
                    type="number"
                    min={15}
                    max={80}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="input-field"
                    placeholder="28"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">سال‌های تجربه</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={form.years_experience}
                    onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                    className="input-field"
                    placeholder="5"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">عنوان شغلی دقیق</label>
                <input
                  value={form.job_title}
                  onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                  className="input-field"
                  placeholder="مثلاً توسعه‌دهنده Frontend یا مدیر محصول"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">صنعت</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="input-field"
                >
                  <option value="">انتخاب کن...</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="mb-1 text-2xl font-bold">مهارت‌هات چیه؟</h2>
                <p className="text-sm text-ink-300">
                  حداقل ۲ مهارت وارد کن. هرچی دقیق‌تر، تحلیل بهتر.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  مهارت‌ها <span className="text-ink-500">({form.skills.length})</span>
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
                    placeholder="مثلاً React، مدیریت تیم، SQL"
                  />
                  <button onClick={addSkill} className="btn-ghost !px-4">افزودن</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span key={s} className="chip">
                        {s}
                        <button onClick={() => removeSkill(s)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  یه خط درباره خودت <span className="text-ink-500">(اختیاری)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="مثلاً: تمرکزم روی بهبود تجربه کاربری در محصولات فینتک است"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="mb-1 text-2xl font-bold">رزومه‌ات رو آپلود کن</h2>
                <p className="text-sm text-ink-300">
                  اختیاری. اگه آپلود کنی، تحلیل خیلی دقیق‌تر می‌شه.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-600 bg-ink-800/50 p-10 transition hover:border-brand-500/60 hover:bg-ink-800">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                {resumeFile ? (
                  <>
                    <Check className="mb-2 h-8 w-8 text-brand-400" />
                    <p className="font-medium">{resumeFile.name}</p>
                    <p className="text-xs text-ink-400">برای تغییر کلیک کن</p>
                  </>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-ink-400" />
                    <p className="font-medium">کلیک کن یا فایل رو اینجا بنداز</p>
                    <p className="text-xs text-ink-400">PDF، Word یا TXT • حداکثر ۵MB</p>
                  </>
                )}
              </label>

              <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-5 w-5 text-brand-400" />
                  <div>
                    <p className="text-sm font-medium">آماده تحلیل!</p>
                    <p className="text-xs text-ink-300">
                      هوش مصنوعی پروفایلت رو می‌خونه و تا ۳۰ ثانیه دیگه نتایج رو می‌بینی.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn-ghost">
                <ArrowRight className="h-4 w-4 ml-1" />
                قبلی
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                className="btn-primary"
              >
                بعدی
                <ArrowLeft className="h-4 w-4 mr-1" />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin ml-2" />
                    در حال تحلیل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 ml-2" />
                    شروع تحلیل
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
