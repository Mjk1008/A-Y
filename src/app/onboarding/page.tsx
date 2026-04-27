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
import { Logo } from "@/app/components/Logo";
import { AnalysisLoading, SuccessScreen } from "@/app/components/LoadingStates";

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

const STEP_LABELS = ["اطلاعات شغلی", "مهارت‌ها", "رزومه"];
const LOADING_STEPS = [
  "در حال ذخیره پروفایل...",
  "در حال خواندن رزومه...",
  "هوش مصنوعی داره تحلیل می‌کنه...",
  "نقشهٔ مسیر در حال ساخته شدن...",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // step 0 = nickname screen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analyzeView, setAnalyzeView] = useState<"form" | "loading" | "success" | "error">("form");
  const [loadingStep, setLoadingStep] = useState(0);
  const [form, setForm] = useState({
    nickname: "",
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
    setAnalyzeView("loading");
    setLoadingStep(0);

    try {
      let resumeParsedText: string | undefined;
      if (resumeFile) {
        setLoadingStep(1);
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

      setLoadingStep(resumeFile ? 2 : 1);
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: form.nickname || null,
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

      setLoadingStep(3);
      const analyzeRes = await fetch("/api/analyze", { method: "POST" });
      if (!analyzeRes.ok) {
        const j = await analyzeRes.json().catch(() => ({}));
        throw new Error(j.error || "خطا در تحلیل");
      }

      setAnalyzeView("success");
      // auto-redirect after 2.5s if user doesn't click
      setTimeout(() => {
        router.push("/dashboard/analysis");
        router.refresh();
      }, 2500);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطای نامشخص";
      setError(msg);
      setAnalyzeView("error");
    } finally {
      setLoading(false);
    }
  }

  const canNext1 =
    form.job_title && form.industry && form.years_experience;
  const canNext2 = form.skills.length >= 2;

  // ── Loader screen ──────────────────────────────────────────────────
  if (analyzeView === "loading") {
    return <AnalysisLoading step={loadingStep} />;
  }

  // ── Success screen ─────────────────────────────────────────────────
  if (analyzeView === "success") {
    return (
      <SuccessScreen
        onContinue={() => {
          router.push("/dashboard/analysis");
          router.refresh();
        }}
      />
    );
  }

  // ── Error screen ──────────────────────────────────────────────────
  if (analyzeView === "error") {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
        style={{ background: "#020306", color: "#e8efea" }}
        dir="rtl"
      >
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(239,68,68,0.06), transparent 60%)",
          }}
        />

        {/* Error icon */}
        <div
          style={{
            width: 80, height: 80, borderRadius: 24, marginBottom: 24,
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
          }}
        >
          ⚠️
        </div>

        <h2 className="mb-2 text-2xl font-black tracking-tight">مشکلی پیش اومد</h2>
        <p className="mb-2 text-sm text-ink-400 max-w-xs leading-relaxed">
          {error || "خطا در تحلیل. لطفاً دوباره امتحان کن."}
        </p>
        <p className="mb-8 text-xs text-ink-700">اطلاعاتت ذخیره شده — فقط تحلیل باید دوباره اجرا بشه</p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={() => {
              setAnalyzeView("form");
              setError(null);
              submit();
            }}
            className="btn-primary justify-center"
          >
            <Loader2 className="h-4 w-4" />
            دوباره امتحان کن
          </button>
          <button
            type="button"
            onClick={() => {
              setAnalyzeView("form");
              setError(null);
              setLoading(false);
            }}
            className="btn-ghost justify-center"
          >
            برگشت به فرم
          </button>
        </div>

        <p className="mt-8 text-[11px] text-ink-700">
          اگه مشکل ادامه داشت،{" "}
          <a href="mailto:support@a-y.app" className="text-emerald-500 underline">
            پشتیبانی
          </a>{" "}
          رو خبر کن
        </p>
      </div>
    );
  }

  // ── Step 0: Welcome / Nickname ──────────────────────────────────────
  if (step === 0) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
        style={{ background: "#020306", color: "#e8efea" }}
      >
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(52,211,153,0.08), transparent 70%)",
          }}
        />

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-4xl">
          👋
        </div>
        <h1 className="mb-2 text-3xl font-black tracking-tight">
          خوش اومدی به ای‌وای!
        </h1>
        <p className="mb-2 text-sm leading-relaxed text-ink-400">
          اینجا هوش مصنوعی کمکت می‌کنه مسیر حرفه‌ای‌ات رو بسازی.
        </p>
        <p className="mb-8 text-base font-semibold text-ink-200">
          اول بگو — <span className="text-emerald-400">چی صدات کنم؟</span>
        </p>

        <div className="w-full max-w-xs">
          <input
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && form.nickname.trim()) setStep(1);
            }}
            className="input-field w-full text-center text-lg"
            placeholder="مثلاً علی، ساره، محمد..."
            autoFocus
          />

          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={!form.nickname.trim()}
            className="btn-lux mt-4 w-full justify-center"
          >
            بریم!
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-[11px] text-ink-700">
          ۲-۳ دقیقه وقت می‌بره · بعدش تحلیل هوشمند آماده‌ست
        </p>
      </div>
    );
  }

  // ── Steps 1–3: Main wizard ──────────────────────────────────────────
  return (
    <div
      className="flex min-h-[100dvh] flex-col"
      style={{ background: "#020306", color: "#e8efea" }}
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(6,182,212,0.04), transparent 60%)",
        }}
      />

      {/* Top bar */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/dashboard">
            <Logo size={32} showWordmark />
          </Link>

          <span className="text-xs text-ink-500">
            سلام{" "}
            <span className="font-bold text-emerald-400">{form.nickname}</span>
            {" "}·{" "}
            مرحله <span className="font-bold text-ink-200">{step}</span> از ۳
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-px w-full bg-white/[0.04]">
        <div
          className="h-px bg-emerald-500 transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="border-b border-white/[0.06] px-6 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 text-xs transition ${
                i + 1 === step
                  ? "font-medium text-ink-100"
                  : i + 1 < step
                  ? "text-emerald-400"
                  : "text-ink-600"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  i + 1 < step
                    ? "bg-emerald-500 text-white"
                    : i + 1 === step
                    ? "border border-emerald-500/60 text-emerald-400"
                    : "border border-white/[0.08] text-ink-600"
                }`}
              >
                {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {/* Always visible on all screen sizes */}
              <span className={`text-[11px] ${i + 1 === step ? "font-semibold" : ""}`}>{label}</span>
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
                  {form.nickname ? `${form.nickname}، ` : ""}شغلت چیه؟
                </h2>
                <p className="text-sm text-ink-400">
                  همین چند تا اطلاعات کافیه برای تحلیل دقیق.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-400">
                  عنوان شغلی
                </label>
                <input
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثلاً توسعه‌دهنده Frontend یا مدیر محصول"
                  autoComplete="organization-title"
                  autoFocus
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
                  autoComplete="off"
                >
                  <option value="">انتخاب کن...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
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
                  placeholder="مثلاً ۵"
                  dir="ltr"
                  autoComplete="off"
                  inputMode="numeric"
                />
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
                    autoFocus
                    autoComplete="off"
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

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 transition hover:border-emerald-500/30 hover:bg-white/[0.03]">
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
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                      <Check className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="font-medium text-ink-100">{resumeFile.name}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      برای تغییر کلیک کن
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
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

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium">
                    آماده تحلیل برای {form.nickname}
                  </p>
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
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-ghost"
            >
              <ArrowRight className="h-4 w-4" />
              قبلی
            </button>

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
