# A-Y (ای‌وای)

> استاد AI شو، نه قربانی

A-Y یه اپ هوشمنده که به آدم‌ها کمک می‌کنه با توجه به شغل و مهارت‌هاشون، بهترین ابزارهای AI رو یاد بگیرن و توی کارشون اهرم بسازن.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + RTL Persian design
- **Supabase** — Auth + PostgreSQL + Storage
- **Claude API** (claude-sonnet-4-5) — شخصی‌سازی تحلیل + prompt caching
- **Vercel** — deployment

## Setup

### 1) Clone + install

```bash
npm install
```

### 2) Supabase project

1. برو به [supabase.com](https://supabase.com) و یه پروژه جدید بساز (free tier کافیه).
2. توی SQL Editor، محتوای `supabase/schema.sql` رو اجرا کن.
3. از Project Settings → API این سه مقدار رو کپی کن:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 3) Anthropic API key

از [console.anthropic.com](https://console.anthropic.com) یه API key بساز و توی `ANTHROPIC_API_KEY` بذار.

### 4) `.env.local`

فایل `.env.local.example` رو به `.env.local` کپی کن و مقادیر رو پر کن:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
```

### 5) Dev

```bash
npm run dev
```

باز کن `http://localhost:3000`.

## Deploy to Vercel

1. این repo رو به GitHub push کن.
2. برو به [vercel.com/new](https://vercel.com/new) و repo رو import کن.
3. توی Environment Variables همون ۴ متغیر بالا رو اضافه کن.
4. Deploy!

### Supabase: اضافه کردن URL پروداکشن

بعد از دیپلوی، توی Supabase → Authentication → URL Configuration:

- **Site URL:** `https://your-domain.vercel.app`
- **Redirect URLs:** `https://your-domain.vercel.app/auth/callback`

## ساختار پروژه

```
src/
  app/
    page.tsx              → لندینگ
    signup/login          → احراز هویت
    auth/callback         → OAuth redirect
    onboarding            → فرم ۳ مرحله‌ای پروفایل
    dashboard             → نتایج تحلیل AI
    profile               → ویرایش + تحلیل مجدد
    upgrade               → پیج Pro
    api/
      analyze             → Claude API call
      parse-resume        → استخراج متن از PDF/TXT
  lib/
    supabase/             → client, server, middleware
    claude.ts             → Anthropic SDK + prompt
    utils.ts
  middleware.ts           → Auth guard
supabase/schema.sql       → DB schema + RLS
```

## فیچرها

### Free
- فرم پروفایل کامل
- آپلود رزومه PDF
- ۳ ابزار پیشنهادی
- نقشه راه پایه
- تحلیل ماهی یک بار

### Pro (به زودی با درگاه پرداخت)
- ۱۰+ ابزار با مثال‌های دقیق
- تحلیل نامحدود
- چت با مشاور AI
- نقشه راه تفصیلی
- پشتیبانی اولویت‌دار

## Roadmap

- [ ] درگاه پرداخت (زرین‌پال + استرایپ)
- [ ] چت زنده با Claude برای Pro users
- [ ] ارسال هفتگی ابزارهای جدید از طریق ایمیل
- [ ] دیتابیس مرکزی ابزارها + رتبه‌بندی community
- [ ] پروفایل عمومی / share link
- [ ] ورژن انگلیسی

## License

MIT
