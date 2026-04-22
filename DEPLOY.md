# راهنمای سریع دیپلوی A-Y

## ۱) Supabase setup

1. برو [supabase.com](https://supabase.com) → New Project
2. اسم پروژه: `a-y`
3. پسورد دیتابیس رو یه جایی امن ذخیره کن
4. Region: `Central EU (Frankfurt)` (سریع‌ترین برای ایران)
5. صبر کن پروژه آماده بشه (~۲ دقیقه)
6. برو به **SQL Editor** → New Query → محتوای کامل `supabase/schema.sql` رو paste و Run بزن
7. از **Settings → API** این‌ها رو کپی کن:
   - Project URL
   - anon public key
   - service_role key

## ۲) Anthropic API key

1. برو [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
2. $5 credit اولیه بگیر یا بیشتر charge کن
3. Key رو کپی کن

## ۳) GitHub

```bash
cd C:\Users\m.khorshidsavar\A-Y
git init
git add -A
git commit -m "initial commit: A-Y app"
git branch -M main
# ساخت repo در github.com، بعد:
git remote add origin https://github.com/USERNAME/a-y.git
git push -u origin main
```

## ۴) Vercel

1. [vercel.com/new](https://vercel.com/new)
2. Import repo `a-y`
3. **Environment Variables** اضافه کن:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | از سوپابیس کپی شده |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role |
| `ANTHROPIC_API_KEY` | sk-ant-... |

4. Deploy بزن

## ۵) URL برگشت Auth

بعد از دیپلوی، توی Supabase:

- **Authentication → URL Configuration**
  - Site URL: `https://your-app.vercel.app`
  - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## ۶) (اختیاری) Google OAuth

- **Authentication → Providers → Google** → فعال کن
- Client ID و Secret رو از Google Cloud Console بگیر
- Redirect URL همون `https://your-app.vercel.app/auth/callback`

## تمومه!

حالا این URL رو به دوستات بده:
- `https://your-app.vercel.app`

## تست اولیه

1. برو به URL لایو
2. Sign up با یه ایمیل جدید
3. فرم onboarding رو پر کن (بدون رزومه هم تست کن)
4. باید Claude تحلیل کنه و بره به داشبورد
5. دیتا رو در Supabase ببین:
   - `profiles` table → رکورد جدید
   - `analyses` table → تحلیل ذخیره شده

## عیب‌یابی رایج

**خطای analyze_error:** چک کن `ANTHROPIC_API_KEY` درسته و credit داری.

**لاگین نمی‌شه:** `Site URL` رو در Supabase درست تنظیم کن.

**آپلود رزومه کار نمی‌کنه:** bucket `resumes` در Supabase Storage ساخته شده؟ schema.sql باید این‌کارو کرده باشه.
