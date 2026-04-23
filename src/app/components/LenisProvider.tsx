"use client";

/**
 * LenisProvider — virtualized smooth-scroll for the whole page.
 *
 * WHY THIS EXISTS:
 * Browsers run scroll on the compositor thread. During MOMENTUM scroll
 * (after you release a trackpad / flick on touch) scroll events reach JS
 * at an irregular cadence — 20–30Hz, often with coalesced or duplicate
 * values for 2–3 consecutive rAF ticks and then a sudden jump. Any
 * scroll-driven animation that reads `window.scrollY` inside rAF will
 * therefore see a frozen value, then a step — visible as stutter exactly
 * at the "let go" moment.
 *
 * Lenis fixes this by OWNING the scroll position as a JS number, lerped
 * on the SAME rAF tick that our renderer runs on. One tick, one source
 * of truth, zero async gap. This is the stack every awwwards-tier site
 * uses today (Linear, Vercel, Resend, Framer, Studio Freight clients).
 *
 * Consumers subscribe by reading the module-level `scrollState` object,
 * which is updated synchronously by Lenis each tick.
 */

import { useEffect } from "react";
import Lenis from "lenis";

/* ── Shared state ────────────────────────────────────────────────────
   Plain object, mutated each tick. Consumers read via reference in
   their own rAF loops — no re-render traffic, no context overhead.    */
export const scrollState = {
  /* 0 → 1 progress through the document */
  progress: 0,
  /* signed pixel-velocity. Useful for motion-reactive effects later.  */
  velocity: 0,
  /* true once Lenis has emitted at least one scroll event — lets
     consumers know they can trust `progress`.                         */
  ready: false,
};

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      /* Core lerp — softer than default (0.1) so the page glides a bit
         more per tick. Combined with the slower multipliers below, the
         overall feel is "cinematic" — scroll translates to animation
         rather than raw document movement.                             */
      lerp: 0.1,

      /* Back to ~default distance per wheel notch — 0.6 made scroll feel
         stiff/resistive. 1.0 is native-feeling while still smoothed.   */
      wheelMultiplier: 1.0,

      /* Match wheel for touch responsiveness. */
      touchMultiplier: 1.0,

      /* Smooth wheel input (desktop). */
      smoothWheel: true,

      /* Lenis also samples touch into its lerp loop. Critical — without
         this, mobile momentum bypasses Lenis and we're back to square
         one. The multiplier controls inertia decay after release.     */
      syncTouch: true,
      touchInertiaMultiplier: 35,

      /* Allow the native gesture to still fire for anchor clicks etc. */
      autoResize: true,
    });

    /* Push every scroll event's progress into the shared state.
       Lenis emits `scroll` on every rAF tick it runs, so consumers
       always read a fresh value.                                       */
    lenis.on("scroll", (e: { scroll: number; limit: number; velocity: number; progress: number }) => {
      scrollState.progress = Number.isFinite(e.progress)
        ? e.progress
        : (e.limit > 0 ? e.scroll / e.limit : 0);
      scrollState.velocity = e.velocity ?? 0;
      scrollState.ready = true;
    });

    /* Single rAF loop that drives Lenis. Everything else in the app
       should run its own rAF that READS `scrollState` — we do not want
       multiple loops competing to drive Lenis.                         */
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    /* Expose for debugging — handy in DevTools console. */
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      scrollState.ready = false;
    };
  }, []);

  return null;
}
