import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] pb-16" style={{ background: "#020306", color: "#e8efea" }}>
      <header
        className="sticky top-0 z-40 border-b border-white/[0.06]"
        style={{
          background: "rgba(2,3,6,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3.5">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <h1 className="text-sm font-bold text-ink-100">قوانین استفاده</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-8">
        <p className="mb-6 text-[11.5px] text-ink-600">آخرین به‌روزرسانی: فروردین ۱۴۰۵</p>

        <div className="space-y-8 text-[14px] leading-relaxed text-ink-300">
          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۱. پذیرش شرایط</h2>
            <p>
              با ثبت‌نام و استفاده از سرویس A-Y، شما این شرایط را می‌پذیرید.
              اگر با این شرایط موافق نیستید، لطفاً از سرویس استفاده نکنید.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۲. استفاده مجاز</h2>
            <p>A-Y یک ابزار مشاوره شغلی هوش مصنوعی برای متخصصین ایرانی است. شما موافقت می‌کنید که:</p>
            <ul className="mt-2 space-y-1.5 pr-5 text-ink-400">
              <li>از سرویس تنها برای اهداف شخصی و قانونی استفاده کنید</li>
              <li>اطلاعات صحیح و به‌روز ارائه دهید</li>
              <li>از تلاش برای دور زدن محدودیت‌های سیستم خودداری کنید</li>
              <li>حساب خود را به اشتراک نگذارید</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۳. محدودیت‌های سرویس</h2>
            <p>
              تحلیل‌های A-Y بر اساس هوش مصنوعی هستند و جنبه مشاوره‌ای دارند.
              این تحلیل‌ها تضمینی برای نتایج شغلی خاص نمی‌دهند.
              A-Y مسئولیتی در قبال تصمیم‌های شغلی شما بر اساس این تحلیل‌ها ندارد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۴. اشتراک و پرداخت</h2>
            <ul className="space-y-1.5 pr-5 text-ink-400">
              <li>پلن‌های پولی به صورت ماهانه یا سالانه پردازش می‌شوند</li>
              <li>بعد از کنسل اشتراک، دسترسی تا پایان دوره پرداختی ادامه دارد</li>
              <li>استرداد وجه در صورت درخواست در ۷ روز اول امکان‌پذیر است</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۵. مالکیت معنوی</h2>
            <p>
              تمام محتوا، طراحی و کد A-Y متعلق به تیم A-Y است.
              تحلیل‌های تولیدشده برای شما متعلق به شماست.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۶. تغییرات شرایط</h2>
            <p>
              ممکن است این شرایط را به‌روز کنیم. تغییرات مهم از طریق ایمیل یا اعلان در اپ
              به اطلاع شما خواهند رسید. ادامه استفاده پس از اطلاع‌رسانی به معنای پذیرش شرایط جدید است.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۷. تماس</h2>
            <p>
              برای سوالات حقوقی یا پشتیبانی:{" "}
              <a href="mailto:support@a-y.app" className="text-emerald-400 hover:text-emerald-300">
                support@a-y.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
