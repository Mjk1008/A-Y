"use client";

/**
 * VideoHero — hero content only.
 *
 * Layout: center-left (block sits on the physical left half of the
 * viewport, vertically centered). Text inside reads RTL naturally for
 * Persian.
 *
 * Parallax: as the page scrolls, the whole block translates up and
 * fades. We read Lenis's progress (via `scrollState`) each rAF rather
 * than listening to scroll events — same pattern as ScrollVideoBackground
 * so all motion on this page is driven from one clock.
 *
 * The actual video backdrop lives in <ScrollVideoBackground /> mounted
 * globally at the root, so it stays centered behind EVERY section as the
 * user scrolls — not just the hero.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { scrollState } from "./LenisProvider";

/* Parallax tuning — kept SUBTLE on purpose. The prompt asks for a
   "subtle parallax effect" and overdoing this turns hero reveals into
   theme-park rides.                                                    */
const PARALLAX_RANGE      = 0.35;  /* finish the effect by 35% scroll   */
const PARALLAX_TRANSLATE  = -110;  /* px — total upward movement         */
const PARALLAX_FADE       = 0.75;  /* final opacity                      */
const PARALLAX_SCALE      = 0.04;  /* subtle zoom-out as it leaves       */

export default function VideoHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const el = heroRef.current;
      if (el) {
        /* Normalize scroll progress to 0..1 across the parallax range.
           After PARALLAX_RANGE, the hero is fully parked off-screen.   */
        const raw = scrollState.ready ? scrollState.progress : 0;
        const p = Math.min(1, Math.max(0, raw / PARALLAX_RANGE));

        /* Smoothstep ease for organic motion (cubic in-out). */
        const e = p * p * (3 - 2 * p);

        const ty = e * PARALLAX_TRANSLATE;
        const scale = 1 - e * PARALLAX_SCALE;
        const opacity = 1 - e * (1 - PARALLAX_FADE);

        el.style.transform =
          `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="relative h-[100dvh]">
      {/* Extra vignette on the right side — darker gradient that pulls
          visual weight toward the left-sitting headline. This is the
          "dark gradient background" directive from the prompt.         */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(9,9,15,0.72) 0%, rgba(9,9,15,0.45) 28%, rgba(9,9,15,0.15) 60%, rgba(9,9,15,0) 100%)",
          zIndex: 1,
        }}
      />

      {/* Center-left layout.
          `marginLeft: 6vw` + `marginRight: auto` anchors the block to
          the physical LEFT of the viewport regardless of RTL.          */}
      <div className="relative flex h-full items-center" style={{ zIndex: 2 }}>
        <div
          ref={heroRef}
          className="w-full max-w-md text-start"
          style={{
            marginLeft: "clamp(1.5rem, 7vw, 6rem)",
            marginRight: "auto",
            paddingRight: "1.5rem",
            willChange: "transform, opacity",
          }}
        >
          {/* Luxury kicker — tiny uppercased badge above the mark. */}
          <div
            className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1"
            style={{ animationDelay: "0.05s", animationFillMode: "both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] uppercase tracking-[0.45em] text-emerald-200/80">
              private · bilingual · PWA
            </span>
          </div>

          {/* Brand mark */}
          <div
            className="animate-fade-up mb-10 flex items-center gap-3.5"
            style={{ animationDelay: "0.15s", animationFillMode: "both" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 to-transparent p-1 shadow-[0_0_24px_rgba(52,211,153,0.18)]">
              <Image
                src="/ay-logo.png"
                alt="A-Y"
                width={56}
                height={56}
                priority
                className="h-12 w-auto rounded-xl"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[11px] uppercase tracking-[0.45em] text-emerald-200/60">A · Y</span>
              <span className="mt-1.5 text-[13px] text-ink-300">ای‌وای</span>
            </div>
          </div>

          {/* Headline stack — luxury editorial scale. */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.38s", animationFillMode: "both" }}
          >
            <h1 className="text-[3.5rem] font-black leading-[1.0] tracking-[-0.02em] text-white sm:text-[4.5rem]">
              از AI نترس
            </h1>
            <h2 className="mt-1 text-[2.4rem] font-black leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">
              <span className="text-gradient-lux">ازش استفاده کن</span>
            </h2>
          </div>

          {/* Thin emerald underline — luxury detail under headline. */}
          <div
            className="animate-fade-up mt-6 h-px w-24 bg-gradient-to-r from-emerald-400/80 via-emerald-400/20 to-transparent"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          />

          {/* Empathetic body */}
          <div
            className="animate-fade-up mt-7"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <p className="max-w-sm text-[15px] leading-[1.85] text-ink-300">
              قرار نیست جایگزینت بشه —
              قراره <span className="text-ink-100">ابزار خودت</span> بشه.
              ما بهت نشون می‌دیم دقیقاً کدوم ابزارها برای
              <span className="mx-1 text-emerald-300">شغل خودت</span>
              کار می‌کنن و چطور امروز شروع کنی.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-up mt-9"
            style={{ animationDelay: "0.78s", animationFillMode: "both" }}
          >
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row">
              <Link href="/signup" className="btn-lux justify-center sm:min-w-[190px]">
                شروع رایگان
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="#how" className="btn-ghost-lux justify-center sm:min-w-[190px]">
                از کجا شروع کنم؟
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-ink-500">
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
