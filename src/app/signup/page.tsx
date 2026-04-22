"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user && !data.session) {
      setMessage("ایمیل تأیید برات ارسال شد. چک کن.");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-black text-ink-900">
            AY
          </div>
          <span className="font-bold">A-Y</span>
        </Link>
        <div className="card">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <h1 className="text-2xl font-bold">ساخت حساب رایگان</h1>
          </div>
          <p className="mb-6 text-sm text-ink-300">
            ۱ دقیقه وقت می‌بره. کارت اعتباری نمی‌خواد.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="مثلاً علی احمدی"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">ایمیل</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">رمز عبور</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="حداقل ۶ کاراکتر"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-3 text-sm text-brand-300">
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ساخت حساب"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-600" />
            <span className="text-xs text-ink-400">یا</span>
            <div className="h-px flex-1 bg-ink-600" />
          </div>

          <button onClick={handleGoogle} className="btn-ghost w-full">
            ادامه با گوگل
          </button>

          <p className="mt-6 text-center text-sm text-ink-400">
            قبلاً حساب داری؟{" "}
            <Link href="/login" className="text-brand-400 hover:underline">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
