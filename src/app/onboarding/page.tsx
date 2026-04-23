"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  Check,
  X,
  Sparkles,
} from "lucide-react";

const INDUSTRIES = [
  "توسعه نرم‌افزار",
  "طراحی UI/UX",
  "دیجیتال مارکتینگ",
  "محتوا و کپی‌رایتینگ",
  "فروش",
  "پشتیبانی مشتری",
  "منابع انسانی",
  "حسابداری و مالی",
  "مدیریت پروژه",
  "داده و تحلیل",
  "آموزش",
  "حقوق",
  "پزشکی",
  "روزنامه‌نگاری",
  "مدیریت",
  "مهندسی",
  "ترجمه",
  "عکاسی و فیلم",
  "سایر",
];

const STEP_LABELS = ["اطلاعات پایه", "مهارت‌ها", "رزومه"];

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
        const parseRes = await fetch("/api/parse-resume", {
          method: "POST",
          body: fd,
        });
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

  const canNext1 =
    form.full_name && form.age && form.job_title && form.industry;
  const canNext2 = form.years_experience && form.skills.length >= 2;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Background accent */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(6,182,212,0.05), transparent 60%)",
        }}
      />

      {/* Top bar */}
      <header className="border-b border-ink-700/40 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-black text-white">
              AY
            </div>
            <span className="text-sm font-bold tracking-tight">ای‌وای</span>
          </Link>

          <span className="text-xs text-ink-500">
            مرحله{" "}
            <span className="font-bold text-ink-200">{step}</span>{" "}
            از ۳
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-px w-full bg-ink-700/40">
        <div
          className="h-px bg-brand-500 transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="border-b border-ink-700/40 px-6 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 text-xs transition ${
                i + 1 === step
                  ? "text-ink-100 font-medium"
                  : i + 1 < step
                  ? "text-brand-400"
                  : "text-ink-600"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  i + 1 < step
                    ? "bg-brand-500 text-white"
                    : i + 1 === step
                    ? "border border-brand-500/60 text-brand-400"
                    : "border border-ink-700 text-ink-600"
                }`}
              >
                {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="animate-fade-up space-y-6">
              <div>
                <h2 className="mb-1 text-2xl font-black tracking-tight">
                  تعریف کن خودتو
                </h2>
                <p className="text-sm text-ink-400">
                  این اطلاعات پایه به ما کمک می‌کنه تحلیل دقیق‌تری بدیم.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-400">
                  نام و نام خانوادگی
                </label>
                <input
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثلاً علی رضایی"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-400">
                    سن
                  </label>
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
                  <label className="mb-1.5 block text-xs font-medium text-ink-400">
                    سال‌های تجربه
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={form.years_experience}
                    onChange={(e) =>
                      setForm({ ...form, years_experience: e.target.value })
                    }
                    className="input-field"
                    placeholder="5"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-400">
                  عنوان شغلی دقیق
                </label>
                <input
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثلاً توسعه‌دهنده Frontend یا مدیر محصول"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-400">
                  صنعت
                </label>
                <select
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">انتخاب کن...</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="animate-fade-up space-y-6">
              <div>
                <h2 className="mb-1 text-2xl font-black tracking-tight">
                  مهارت‌هات چیه؟
                </h2>
                <p className="text-sm text-ink-400">
                  حداقل ۲ مهارت وارد کن. هرچی دقیق‌تر، تحلیل بهتر.
                </p>
              </div>

              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-400">
                  <span>مهارت‌ها</span>
                  <span className="text-ink-600">{form.skills.length} مورد</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={form.skillInput}
                    onChange={(e) =>
                      setForm({ ...form, skillInput: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="input-field flex-1"
                    placeholder="مثلاً React، مدیریت تیم، SQL"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-ghost !px-4"
                  >
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
                          onClick={() => removeSkill(s)}
                          className="opacity-60 hover:opacity-100 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-ink-400">
                  یه خط درباره خودت
                  <span className="text-ink-600">(اختیاری)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="مثلاً: تمرکزم روی بهبود تجربه کاربری در محصولات فینتک است"
                />
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="animate-fade-up space-y-6">
              <div>
                <h2 className="mb-1 text-2xl font-black tracking-tight">
                  رزومه‌ات رو آپلود کن
                </h2>
                <p className="text-sm text-ink-400">
                  اختیاری — اگه آپلود کنی، تحلیل خیلی دقیق‌تر می‌شه.
                </p>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 bg-ink-800/20 p-12 transition hover:border-brand-500/40 hover:bg-ink-800/30">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) =>
                    setResumeFile(e.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
                {resumeFile ? (
                  <>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10">
                      <Check className="h-5 w-5 text-brand-400" />
                    </div>
                    <p className="font-medium text-ink-100">{resumeFile.name}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      برای تغییر کلیک کن
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-ink-700 bg-ink-800/40">
                      <Upload className="h-5 w-5 text-ink-500" />
                    </div>
                    <p className="font-medium text-ink-300">
                      کلیک کن یا فایل رو اینجا بنداز
                    </p>
                    <p className="mt-1 text-xs text-ink-600">
                      PDF، Word یا TXT — حداکثر ۵MB
                    </p>
                  </>
                )}
              </label>

              {/* Ready indicator */}
              <div className="flex items-center gap-3 rounded-xl border border-ink-700/40 bg-ink-800/20 px-4 py-3">
                <Sparkles className="h-4 w-4 shrink-0 text-brand-400" />
                <div>
                  <p className="text-sm font-medium">آماده تحلیل</p>
                  <p className="text-xs text-ink-500">
                    هوش مصنوعی پروفایلت رو می‌خونه — نتیجه تا ۳۰ ثانیه دیگه.
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-ghost"
              >
                <ArrowRight className="h-4 w-4" />
                قبلی
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canNext1) || (step === 2 && !canNext2)
                }
                className="btn-primary"
              >
                بعدی
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="btn-primary min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال تحلیل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    شروع تحلیل
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
