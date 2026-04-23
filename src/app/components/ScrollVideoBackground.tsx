"use client";

/**
 * ScrollVideoBackground — scroll-locked 3D backdrop, frame-accurate.
 *
 * WHAT CHANGED (v5 — Lenis-driven):
 *  • Scroll source is now Lenis (`scrollState.progress`), not native
 *    `window.scrollY`. Native scroll on modern browsers runs on the
 *    compositor and delivers values to JS with an irregular cadence
 *    during MOMENTUM scroll — multiple rAF ticks can read the same
 *    stale scrollY and then jump. That's what made the "let go" moment
 *    feel awful while active scroll felt fine. Lenis owns the scroll
 *    position in JS, lerps it smoothly every rAF, and writes it to
 *    `scrollState` — same tick as our renderer. Zero async gap.
 *  • Removed the EMA on transform. Lenis already lerps; a second layer
 *    of smoothing was adding "rubbery" lag during momentum decay.
 *  • This matches the architecture used by Linear, Vercel, Resend,
 *    Framer, and essentially every awwwards-tier scroll-locked site
 *    in 2024–2026. Apple uses the same image-sequence render strategy,
 *    with native scroll — we use Lenis because our multi-section layout
 *    benefits from the extra momentum control on trackpads.
 *  • Image extraction pipeline (exact-seek, FRAME_COUNT=90, crossfade
 *    between adjacent frames) is retained.
 */

import { useEffect, useRef } from "react";
import { scrollState } from "./LenisProvider";

/* ── Config ───────────────────────────────────────────────────────── */
const FRAME_COUNT       = 90;       /* sampled frames — dense enough    */
const EXTRACT_MAX_WIDTH = 1600;     /* px — memory cap for bitmaps      */

/* NO smoothing on our side. Lenis is already delivering a smoothly
   lerped progress value every rAF tick — adding a spring or EMA here
   just layers latency on top and creates the "rubbery momentum" feel.
   Read Lenis's value, render it. That's it.                           */

/* Always-on idle motion (masks quantization + feels alive) */
const BREATH_AMP_YAW    = 1.4;      /* deg                              */
const BREATH_AMP_PITCH  = 0.8;
const BREATH_FLOAT_Y    = 4.5;      /* px                               */
const DRIFT_AMP_X       = 2.2;
const DRIFT_AMP_Y       = 1.6;
const BREATH_SCALE      = 0.004;

/* Scroll-driven transform range */
const ROT_Y_FROM = -10, ROT_Y_TO =  10;   /* deg */
const ROT_X_FROM =   5, ROT_X_TO =  -5;
const SCALE_FROM = 1.18, SCALE_TO = 1.06;
const TRANS_Y_FROM = 0,  TRANS_Y_TO = -36;

export default function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap   = wrapRef.current!;
    /* alpha:true so the crossfade composite (drawing frame B with
       globalAlpha on top of frame A) blends cleanly. Performance cost
       vs alpha:false is negligible for a single full-canvas blit.     */
    const ctx    = canvas.getContext("2d", { alpha: true });
    if (!canvas || !wrap || !ctx) return;

    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

    /* ── Mutable state ────────────────────────────────────────── */
    const frames: ImageBitmap[] = [];

    /* Last-drawn state — used to skip redundant blits. We quantize the
       fractional crossfade to 0.1% steps so slow momentum still
       triggers enough redraws to look continuous.                    */
    let lastIdx0  = -1;
    let lastFracQ = -1;

    let rafId      = 0;
    let killed     = false;
    let startedAt  = performance.now();

    /* ── Canvas sizing ────────────────────────────────────────── */
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth  * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        lastIdx0 = -1; lastFracQ = -1;   /* force redraw                */
      }
    }

    /* ── Cover-fit draw of one bitmap (respects globalAlpha) ──── */
    function drawBitmap(bmp: ImageBitmap) {
      const cw = canvas.width, ch = canvas.height;
      const br = bmp.width / bmp.height;
      const cr = cw / ch;
      let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
      if (cr > br) { sh = sw / cr; sy = (bmp.height - sh) / 2; }
      else         { sw = sh * cr; sx = (bmp.width  - sw) / 2; }
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      ctx!.drawImage(bmp, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    /* ── Crossfade draw: blend frames[i0] and frames[i1] by `frac`  */
    function drawCrossfade(i0: number, i1: number, frac: number) {
      const cw = canvas.width, ch = canvas.height;
      /* Solid base — full opacity frame A */
      ctx!.globalAlpha = 1;
      ctx!.clearRect(0, 0, cw, ch);
      drawBitmap(frames[i0]);
      /* Blend frame B on top. If i0 === i1, skip. */
      if (i1 !== i0 && frac > 0.001) {
        ctx!.globalAlpha = frac;
        drawBitmap(frames[i1]);
        ctx!.globalAlpha = 1;
      }
    }

    /* ── Progressive frame extraction ─────────────────────────── */
    async function extractFrames(): Promise<void> {
      const video = document.createElement("video");
      video.src = "/bg.mp4";
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      (video as HTMLVideoElement & { crossOrigin?: string }).crossOrigin = "anonymous";

      await new Promise<void>((res, rej) => {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          res();
        };
        video.addEventListener("loadedmetadata", onLoaded);
        video.addEventListener("error", () => rej(new Error("video load error")), { once: true });
      });

      /* Warm up decoder */
      try { await video.play(); video.pause(); } catch { /* autoplay blocked — fine */ }

      const scale    = Math.min(1, EXTRACT_MAX_WIDTH / video.videoWidth);
      const scratchW = Math.max(1, Math.floor(video.videoWidth  * scale));
      const scratchH = Math.max(1, Math.floor(video.videoHeight * scale));
      const scratch  = document.createElement("canvas");
      scratch.width  = scratchW;
      scratch.height = scratchH;
      const sctx = scratch.getContext("2d", { alpha: false })!;

      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) throw new Error("bad video duration");

      /* Sample LINEARLY across duration. EXACT seek (currentTime) — not
         fastSeek — so each sample lands on its intended moment, not the
         nearest keyframe. This is what kills the "clustered late" feel. */
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (killed) return;
        const t = (i / (FRAME_COUNT - 1)) * duration * 0.999;

        await new Promise<void>((res) => {
          const h = () => { video.removeEventListener("seeked", h); res(); };
          video.addEventListener("seeked", h);
          /* safety timeout — don't freeze the pipeline on a bad seek   */
          setTimeout(() => { video.removeEventListener("seeked", h); res(); }, 800);
          try { video.currentTime = t; } catch { res(); }
        });

        if (killed) return;

        /* One more rAF so the decoder paints the newly-seeked frame
           before we read it. Critical for some browsers (Safari).     */
        await new Promise<void>((res) => requestAnimationFrame(() => res()));

        sctx.drawImage(video, 0, 0, scratchW, scratchH);
        const bmp = await createImageBitmap(scratch);
        frames.push(bmp);

        /* Paint first frame ASAP so user isn't staring at black. */
        if (i === 0) {
          ctx!.globalAlpha = 1;
          drawBitmap(bmp);
        }
      }

      /* Release the video — we don't need it any more */
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    /* ── Main tick — reads Lenis's pre-smoothed progress ────── */
    function tick() {
      /* 1. Read Lenis's current progress. If Lenis hasn't booted yet
            (first paint), fall back to raw scrollY so we still render
            something sensible rather than waiting for the first tick. */
      let p: number;
      if (scrollState.ready) {
        p = clamp(scrollState.progress);
      } else {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        p = clamp(window.scrollY / max);
      }

      /* Same progress drives both the 3D transform and the frame
         crossfade. One source of truth = no drift, no phase mismatch. */
      const pX = p;
      const pV = p;

      /* 2. Crossfade between two frames straddling pV */
      if (frames.length > 0) {
        const maxAvail = frames.length - 1;
        const exact    = pV * (FRAME_COUNT - 1);
        const floor    = Math.floor(exact);
        const i0       = Math.min(floor, maxAvail);
        const i1       = Math.min(i0 + 1, maxAvail);
        const frac     = exact - floor;
        const fracQ    = Math.round(frac * 1000);   /* 0.1% steps       */

        if (i0 !== lastIdx0 || fracQ !== lastFracQ) {
          drawCrossfade(i0, i1, frac);
          lastIdx0  = i0;
          lastFracQ = fracQ;
        }
      }

      /* 3. Scroll-driven 3D base */
      const baseRotY  = lerp(ROT_Y_FROM,  ROT_Y_TO,  pX);
      const baseRotX  = lerp(ROT_X_FROM,  ROT_X_TO,  pX);
      const baseScale = lerp(SCALE_FROM,  SCALE_TO,  pX);
      const baseTY    = lerp(TRANS_Y_FROM, TRANS_Y_TO, pX);

      /* 4. Idle motion — always on, non-aligned frequencies */
      const t = (performance.now() - startedAt) / 1000;
      const breathY  = Math.sin(t * 0.37)        * BREATH_AMP_YAW;
      const breathX  = Math.cos(t * 0.29)        * BREATH_AMP_PITCH;
      const breathT  = Math.sin(t * 0.47)        * BREATH_FLOAT_Y;
      const driftX   = Math.sin(t * 0.23 + 1.2)  * DRIFT_AMP_X;
      const driftY   = Math.cos(t * 0.19 + 0.5)  * DRIFT_AMP_Y;
      const scalePul = Math.sin(t * 0.31 + 2.1)  * BREATH_SCALE;

      const rotY  = baseRotY  + breathY;
      const rotX  = baseRotX  + breathX;
      const scale = baseScale + scalePul;
      const tY    = baseTY    + breathT + driftY;
      const tX    = driftX;

      wrap.style.transform =
        `perspective(1400px) ` +
        `rotateY(${rotY.toFixed(3)}deg) ` +
        `rotateX(${rotX.toFixed(3)}deg) ` +
        `scale(${scale.toFixed(4)}) ` +
        `translate3d(${tX.toFixed(2)}px, ${tY.toFixed(2)}px, 0)`;

      rafId = requestAnimationFrame(tick);
    }

    /* ── Boot ──────────────────────────────────────────────────── */
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    startedAt = performance.now();
    rafId = requestAnimationFrame(tick);

    extractFrames().catch((err) => {
      console.warn("[ScrollVideoBackground] frame extraction failed:", err);
    });

    /* ── Cleanup ───────────────────────────────────────────────── */
    return () => {
      killed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      for (const bmp of frames) {
        try { bmp.close(); } catch { /* older Safari lacks close() */ }
      }
      frames.length = 0;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <div
        ref={wrapRef}
        className="absolute inset-0"
        style={{
          transformOrigin: "50% 50%",
          willChange: "transform",
          transform:
            "perspective(1400px) rotateY(-10deg) rotateX(5deg) scale(1.18) translate3d(0,0,0)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width:  "100%",
            height: "100%",
            transform: "translateZ(0)",
            backgroundColor: "#0b0b14",
          }}
        />
      </div>

      {/* ambient cyan glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, rgba(6,182,212,0.10), transparent 70%)",
        }}
      />

      {/* subtle violet wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.08), transparent 70%)",
        }}
      />

      {/* Center vignette — pulls UI forward.
          Stronger center darkening lets white headline text sit crisply
          without blowing out the mid-brightness video frames.          */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(9,9,15,0.55) 0%, rgba(9,9,15,0.18) 55%, rgba(9,9,15,0) 90%)",
        }}
      />

      {/* Dark gradient backdrop — top-to-bottom falloff for cinematic
          weight. Lives behind the video's visual center but above the
          canvas so it actually composites over bright frames.          */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,9,15,0.35) 0%, rgba(9,9,15,0) 22%, rgba(9,9,15,0) 78%, rgba(9,9,15,0.55) 100%)",
        }}
      />
    </div>
  );
}
