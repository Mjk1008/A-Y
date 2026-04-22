import Link from "next/link";
import { Sparkles, Target, Zap, TrendingUp, Shield, ArrowLeft, Check } from "lucide-react";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Features />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-black text-ink-900">
            AY
          </div>
          <span className="text-lg font-bold tracking-tight">A-Y</span>
          <span className="text-sm text-ink-400">ای‌وای</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-200 hover:text-brand-400">
            ورود
          </Link>
          <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">
            شروع رایگان
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-400 animate-fade-up">
          <Sparkles className="h-4 w-4" />
          <span>ابزار شخصی‌سازی‌شده برای هر شغل</span>
        </div>
        <h1 className="mb-6 text-4xl font-black leading-[1.15] sm:text-6xl lg:text-7xl animate-fade-up">
          ازینکه AI جایت را بگیرد نترس.
          <br />
          <span className="text-gradient">خودت استاد AI شو.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-ink-200 leading-relaxed sm:text-xl animate-fade-up">
          A-Y پروفایل حرفه‌ای تو رو می‌خوند و دقیقاً بهت می‌گه
          <span className="text-brand-400"> کدوم ابزارهای AI </span>
          برای شغلت بهترین هستن و
          <span className="text-brand-400"> چطور توی کارت </span>
          ازشون استفاده کنی. آدم‌هایی که از AI قوی استفاده می‌کنن، جایگزین نمی‌شن — رهبری می‌کنن.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up">
          <Link href="/signup" className="btn-primary group">
            تحلیل رایگان من
            <ArrowLeft className="mr-2 h-4 w-4 transition group-hover:-translate-x-1" />
          </Link>
          <Link href="#how" className="btn-ghost">
            ببین چطور کار می‌کنه
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-ink-400">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-400" />
            بدون نیاز به کارت اعتباری
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-400" />
            تحلیل در کمتر از ۱ دقیقه
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-400" />
            فارسی و انگلیسی
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-ink-700/60 bg-ink-900/40 py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-ink-400">
          موتور تحلیل مبتنی بر <span className="text-brand-400 font-semibold">Claude 4.5</span> از Anthropic
        </p>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          ترس از AI، واقعیه. ولی راه حلش نشستن نیست.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-ink-300">
          هر شغلی که بشه با AI اتوماتیک کرد، می‌شه. سؤال اینه: تو می‌خوای جایگزین بشی، یا اهرم بسازی؟
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-bold">مشکل</h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              ۸۵٪ شغل‌ها طی ۵ سال آینده با AI تغییر می‌کنن. اگه الان شروع نکنی، عقب می‌مونی.
            </p>
          </div>
          <div className="card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-bold">خطر</h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              ابزارها زیادن، وقت کمه. نمی‌دونی از کجا شروع کنی یا کدوم برای کارِ تو مفیده.
            </p>
          </div>
          <div className="card !border-brand-500/40 !bg-brand-500/5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-bold text-brand-400">راه حل A-Y</h3>
            <p className="text-sm text-ink-200 leading-relaxed">
              پروفایلت رو می‌دی، ما ابزارهای دقیق برای شغلت + نقشه راه یادگیری شخصی‌سازی‌شده می‌دیم.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "۱", t: "پروفایلت رو بساز", d: "شغل، سن، مهارت‌ها و تجربه‌ات. رزومه هم می‌تونی آپلود کنی." },
    { n: "۲", t: "AI تحلیلت می‌کنه", d: "موتور ما Claude 4.5 پروفایلت رو می‌خونه و ریسک‌ها و فرصت‌هاتو پیدا می‌کنه." },
    { n: "۳", t: "ابزارها + نقشه راه", d: "لیست دقیق ابزارها + مثال واقعی استفاده در شغلت + برنامه یادگیری هفتگی." },
  ];
  return (
    <section id="how" className="border-t border-ink-700/60 bg-ink-900/30 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
          چطور کار می‌کنه؟
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xl font-black text-ink-900">
                {s.n}
              </div>
              <h3 className="mb-2 text-lg font-bold">{s.t}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Target, t: "تحلیل مخصوص شغل تو", d: "توصیه‌ها عمومی نیستن. دقیقاً بر اساس عنوان شغلی، صنعت، و مهارت‌های تو." },
    { icon: Sparkles, t: "مثال‌های واقعی", d: "نه فقط «از ChatGPT استفاده کن» — بلکه «برای تسک X اینجوری ازش استفاده کن»." },
    { icon: TrendingUp, t: "نقشه راه یادگیری", d: "هفته به هفته می‌دونی چی یاد بگیری. بدون گم شدن در دریای دوره‌ها." },
    { icon: Shield, t: "تحلیل ریسک", d: "صادقانه بهت می‌گیم چقدر شغلت در معرض جایگزینی است — و چطور از اون فراری بشی." },
    { icon: Zap, t: "ایده اهرم شخصی", d: "یک ایده کلیدی که اگه اجراش کنی، توی صنعتت برجسته می‌شی." },
    { icon: Check, t: "آپدیت ماهانه (Pro)", d: "پروفایلت رو عوض کن، تحلیل جدید با ابزارهای تازه. بازار سریع عوض می‌شه، تو هم باش." },
  ];
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">چه چیزی می‌گیری؟</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-ink-300">
          نه یه لیست خشک ابزار. یه نقشه راه شخصی که سرراست بگه چی کار کنی.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="card">
              <f.icon className="mb-4 h-6 w-6 text-brand-400" />
              <h3 className="mb-2 font-bold">{f.t}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900/30 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">قیمت‌گذاری ساده</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-ink-300">
          رایگان شروع کن. اگه دوست داشتی، Pro شو.
        </p>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="mb-2 text-2xl font-bold">Free</h3>
            <p className="mb-6 text-3xl font-black">۰ تومن</p>
            <ul className="mb-8 space-y-3 text-sm text-ink-200">
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> پروفایل کامل</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> آپلود رزومه PDF</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> ۳ ابزار پیشنهادی</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> تحلیل ریسک</li>
              <li className="flex gap-2 text-ink-500"><span className="w-5">•</span> ۱ تحلیل در ماه</li>
            </ul>
            <Link href="/signup" className="btn-ghost w-full">شروع رایگان</Link>
          </div>
          <div className="card !border-brand-500/60 !bg-gradient-to-br !from-brand-500/10 !to-transparent relative">
            <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-l from-brand-500 to-brand-400 px-3 py-1 text-xs font-bold text-ink-900">
              پیشنهاد می‌شه
            </div>
            <h3 className="mb-2 text-2xl font-bold">Pro</h3>
            <p className="mb-1 text-3xl font-black">۱۹۹ هزار تومن</p>
            <p className="mb-6 text-sm text-ink-400">ماهانه • لغو در هر زمان</p>
            <ul className="mb-8 space-y-3 text-sm text-ink-200">
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> هرچی در Free هست</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> ۱۰+ ابزار با مثال‌های دقیق</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> نقشه راه ۴ هفته‌ای</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> تحلیل نامحدود</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> چت با مشاور AI اختصاصی</li>
              <li className="flex gap-2"><Check className="h-5 w-5 text-brand-400" /> پشتیبانی اولویت‌دار</li>
            </ul>
            <Link href="/signup?plan=pro" className="btn-primary w-full">
              ارتقا به Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-3xl border border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-transparent p-12 text-center">
        <h2 className="mb-4 text-3xl font-black sm:text-4xl">
          همین امشب شروع کن.
        </h2>
        <p className="mb-8 text-lg text-ink-200">
          در کمتر از ۱ دقیقه، یه نقشه راه دقیق داری که فردا صبح می‌تونی اجرا کنی.
        </p>
        <Link href="/signup" className="btn-primary">
          تحلیل رایگان من
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-700/60 px-6 py-10 text-center text-sm text-ink-400">
      <p>© {new Date().getFullYear()} A-Y • ای‌وای — ساخته شده با ❤️ برای کسایی که نمی‌خوان جایگزین بشن</p>
    </footer>
  );
}
