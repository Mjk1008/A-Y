"use client";

/**
 * Reveal — IntersectionObserver-based scroll reveal.
 * Adds `is-visible` class when the element enters the viewport.
 * Pairs with utility classes in globals.css (.reveal / .reveal-up / .reveal-scale).
 */

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

type Variant = "up" | "scale" | "fade" | "slide-right" | "slide-left";

interface Props {
  as?: "div" | "section" | "article" | "li";
  variant?: Variant;
  delay?: number;      /* ms */
  threshold?: number;  /* 0-1 */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  threshold = 0.15,
  once = true,
  className = "",
  style,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove("is-visible");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      // @ts-expect-error — polymorphic ref works fine at runtime
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
