"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { scrollState } from "./LenisProvider";
import { AYScene } from "./AYScene";

const PARALLAX_RANGE     = 0.35;
const PARALLAX_TRANSLATE = -80;
const PARALLAX_FADE      = 0.7;

export default function VideoHero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const el = contentRef.current;
      if (el) {
        const raw = scrollState.ready ? scrollState.progress : 0;
        const p = Math.min(1, Math.max(0, raw / PARALLAX_RANGE));
        const e = p * p * (3 - 2 * p);
        const ty = e * PARALLAX_TRANSLATE;
        const opacity = 1 - e * (1 - PARALLAX_FADE);
        el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
        el.style.opacity = opacity.toFixed(3);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="relative h-[100dvh] overflow-hidden" style={{ background: "#020306" }}>
      {/* Pixel universe scene */}
      <AYScene variant="hero" intensity={1} />

      {/* Bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, #020306)",
          zIndex: 10,
        }}
      />

      {/* Hero content */}
      <div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 20 }}
      >
        <div
          ref={contentRef}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Kicker badge */}
          <div
            className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
            style={{
              animationDelay: "0.05s",
              animationFillMode: "both",
              background: "rgba(16,185,129,0.10)",
              borderColor: "rgba(110,231,183,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "#34d399", boxShadow: "0 0 10px #34d399" }}
            />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#6ee7b7" }}>
              نسخهٔ بتا · فقط برای متخصصان ایرانی
            </span>
          </div>

          {/* Headline */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <h1
              className="mb-5 font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: "clamp(3rem, 12vw, 4.5rem)", color: "#e8efea" }}
            >
              از AI نترس.
              <br />
              <span
                style={{
                  background: "linear-gradient(180deg, #6ee7b7 0%, #10b981 70%, #047857 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ازش استفاده کن.
              </span>
            </h1>
          </div>

          {/* Sub */}
          <div
            className="animate-fade-up mx-auto mb-8 max-w-sm"
            style={{ animationDelay: "0.38s", animationFillMode: "both" }}
          >
            <p className="text-[15px] leading-[1.75]" style={{ color: "rgba(232,239,234,0.72)" }}>
              شغلت رو بگو. ای‌وای دقیقاً می‌گه کدوم ابزارهای هوش مصنوعی رو
              یاد بگیری تا جایگزین نشی — با یه نقشهٔ چهار هفته‌ای.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-up mx-auto flex max-w-xs flex-col gap-3"
            style={{ animationDelay: "0.52s", animationFillMode: "both" }}
          >
            <Link
              href="/signup"
              className="btn-lux w-full justify-center"
            >
              شروع تحلیل رایگان
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="#how"
              className="btn-ghost-lux w-full justify-center text-sm"
            >
              ببین چطور کار می‌کنه
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="animate-fade-in absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ zIndex: 20, animationDelay: "1.3s", animationFillMode: "both" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(110,231,183,0.4)" }}>
          پایین
        </span>
        <ChevronDown className="h-4 w-4 animate-scroll-cue" style={{ color: "rgba(110,231,183,0.4)" }} />
      </div>
    </section>
  );
}
