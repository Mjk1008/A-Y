"use client";

/**
 * VideoHero — hero content only.
 * The actual video backdrop lives in <ScrollVideoBackground /> mounted
 * globally at the root so it stays centered behind EVERY section as the
 * user scrolls — not just on the hero.
 */

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function VideoHero() {
  return (
    <section className="relative h-[100dvh]">
      <div className="relative flex h-full items-center justify-center">
        <div className="mx-auto w-full max-w-lg px-6 text-center">

          {/* Brand mark */}
          <div
            className="animate-fade-up mb-10 flex flex-col items-center gap-3"
            style={{ animationDelay: "0.15s", animationFillMode: "both" }}
          >
            <Image
              src="/ay-logo.png"
              alt="A-Y"
              width={56}
              height={56}
              priority
              className="h-14 w-auto drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            />
            <div className="flex flex-col items-center leading-none">
              <span className="text-[11px] uppercase tracking-[0.45em] text-ink-500">A · Y</span>
              <span className="mt-1.5 text-[13px] text-ink-300">ای‌وای</span>
            </div>
          </div>

          {/* Headline stack */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.38s", animationFillMode: "both" }}
          >
            <h1 className="text-[3.75rem] font-black leading-[1.02] tracking-tighter text-white sm:text-[4.75rem]">
              از AI نترس
            </h1>
            <h2 className="mt-2 text-[2.5rem] font-black leading-[1.05] tracking-tight sm:text-[3.5rem]">
              <span className="text-gradient">ازش استفاده کن</span>
            </h2>
          </div>

          {/* Empathetic body */}
          <div
            className="animate-fade-up mt-8"
            style={{ animationDelay: "0.58s", animationFillMode: "both" }}
          >
            <p className="mx-auto max-w-sm text-[15px] leading-[1.85] text-ink-300">
              قرار نیست جایگزینت بشه —
              قراره <span className="text-ink-100">ابزار خودت</span> بشه.
              ما بهت نشون می‌دیم دقیقاً کدوم ابزارها برای
              <span className="mx-1 text-brand-400">شغل خودت</span>
              کار می‌کنن و چطور امروز شروع کنی.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-up mt-9"
            style={{ animationDelay: "0.76s", animationFillMode: "both" }}
          >
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:justify-center">
              <Link href="/signup" className="btn-primary justify-center sm:min-w-[180px]">
                شروع رایگان
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="#how" className="btn-ghost justify-center sm:min-w-[180px]">
                از کجا شروع کنم؟
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] text-ink-500">
              <span>بدون کارت اعتباری</span>
              <span className="h-3 w-px bg-ink-700" />
              <span>زیر ۱ دقیقه</span>
              <span className="h-3 w-px bg-ink-700" />
              <span>فارسی و انگلیسی</span>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 20, animationDelay: "1.2s", animationFillMode: "both" }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-600">
          اسکرول
        </span>
        <ChevronDown className="h-4 w-4 animate-scroll-cue text-ink-600" />
      </div>
    </section>
  );
}
