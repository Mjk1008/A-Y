import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-sm font-bold text-ink-100">سیاست حریم خصوصی</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-8">
        <p className="mb-6 text-[11.5px] text-ink-600">آخرین به‌روزرسانی: فروردین ۱۴۰۵</p>

        <div className="space-y-8 text-[14px] leading-relaxed text-ink-300">
          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
            <p>برای ارائه خدمات A-Y، اطلاعات زیر را جمع‌آوری می‌کنیم:</p>
            <ul className="mt-2 space-y-1.5 pr-5 text-ink-400">
              <li>شماره تلفن (برای احراز هویت با OTP)</li>
              <li>اطلاعات حرفه‌ای: شغل، صنعت، مهارت‌ها، سابقه کاری</li>
              <li>اطلاعات اختیاری: نام مستعار، سن، رزومه</li>
              <li>داده‌های استفاده: تعداد تحلیل‌ها، تاریخچه چت، پیشرفت نقشه راه</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۲. نحوه استفاده از اطلاعات</h2>
            <p>اطلاعات شما صرفاً برای موارد زیر استفاده می‌شود:</p>
            <ul className="mt-2 space-y-1.5 pr-5 text-ink-400">
              <li>ارائه تحلیل شغلی شخصی‌سازی‌شده با هوش مصنوعی</li>
              <li>تولید نقشه راه و پیشنهاد ابزارهای مرتبط</li>
              <li>نمایش آگهی‌های شغلی متناسب با مهارت‌ها</li>
              <li>بهبود کیفیت خدمات و تجربه کاربری</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۳. اشتراک‌گذاری اطلاعات</h2>
            <p>
              اطلاعات شخصی شما با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.
              داده‌های ناشناس و تجمیعی ممکن است برای بهبود خدمات استفاده شوند.
              مدل‌های هوش مصنوعی ما از طریق API های امن فراخوانی می‌شوند و اطلاعات شما برای آموزش مدل‌ها استفاده نمی‌شود.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۴. امنیت داده‌ها</h2>
            <p>
              اطلاعات شما با رمزنگاری در پایگاه داده امن ذخیره می‌شود.
              ارتباطات از طریق HTTPS رمزنگاری‌شده انجام می‌شود.
              دسترسی به داده‌ها محدود به اعضای تیم ضروری است.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۵. حقوق شما</h2>
            <p>شما حق دارید:</p>
            <ul className="mt-2 space-y-1.5 pr-5 text-ink-400">
              <li>به داده‌های خود دسترسی داشته و آن‌ها را ویرایش کنید</li>
              <li>درخواست حذف کامل حساب و داده‌ها را بدهید</li>
              <li>از استفاده اطلاعات برای تحلیل‌های تجمیعی خارج شوید</li>
            </ul>
            <p className="mt-3">
              برای اعمال این حقوق با ما از طریق{" "}
              <a href="mailto:support@a-y.app" className="text-emerald-400 hover:text-emerald-300">
                support@a-y.app
              </a>{" "}
              در تماس باشید.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-ink-100">۶. تماس</h2>
            <p>
              برای هرگونه سوال درباره حریم خصوصی:{" "}
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
