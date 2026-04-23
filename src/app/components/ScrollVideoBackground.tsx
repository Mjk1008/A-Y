"use client";

/**
 * ScrollVideoBackground — scroll-driven 3D video, tuned for
 * "frames-don't-switch, they-flow" feel.
 *
 * Core insight: two completely decoupled tracks —
 *   1) Transform spring  (on the wrapper div — GPU, always 60fps)
 *   2) Video seek lerp   (on the <video> element — bounded by decoder)
 *
 * Snappiness comes from the transform spring. It's stiff enough that
 * rotation starts the SAME FRAME scroll starts, and settles the same
 * frame scroll ends. The video seek is allowed to lag a few frames —
 * the decoder can't keep up with sub-frame seeks anyway, and idle
 * motion (breath + drift) masks that gap so the user never perceives
 * "frame switching".
 *
 * Tuning philosophy:
 *   - XFORM_STIFF high, DAMP tight  → no lag, no overshoot
 *   - VIDEO_LERP adapts: fast when scrolling, tight when idle
 *   - Seek epsilons are tight, but only while decoder isn't busy
 *   - Dense PREWARM grid so every seek hits a cached keyframe
 *   - Breath amplitudes dialed back to let scroll-driven motion lead
 */

import { useEffect, useRef } from "react";

/* ── Spring for 3D transform (controls "feel" of scroll) ──────────── */
const XFORM_STIFF       = 0.115;    /* snap-start, was 0.012 — huge diff */
const XFORM_DAMP        = 0.80;     /* clean stop, no jello              */

/* ── Video time tracking ──────────────────────────────────────────── */
const VIDEO_LERP_ACTIVE = 0.16;     /* during active scroll              */
const VIDEO_LERP_IDLE   = 0.32;     /* when scroll stops → snap to exact */
const SEEK_EPSILON_FAST = 0.055;    /* fast scroll: don't choke decoder  */
const SEEK_EPSILON_SLOW = 0.018;    /* slow/idle: near-exact frame       */

/* ── Idle motion (masks decoder gap) ──────────────────────────────── */
const BREATH_AMP_YAW    = 1.4;      /* deg — subtle                      */
const BREATH_AMP_PITCH  = 0.8;
const BREATH_FLOAT_Y    = 4.5;      /* px                                */
const DRIFT_AMP_X       = 2.2;
const DRIFT_AMP_Y       = 1.6;
const BREATH_SCALE      = 0.004;    /* ±0.4% scale pulse                 */

/* ── Scroll activity detection ────────────────────────────────────── */
const ACTIVE_SPEED_THRESH = 0.00025;  /* progress/ms — above this = active */
const IDLE_SETTLE_MS      = 160;      /* ms since last scroll = idle      */

/* ── Pre-warm: dense grid so seeks always hit cached keyframes ────── */
const PREWARM_POINTS = [
  0.05, 0.12, 0.2, 0.28, 0.36, 0.44,
  0.52, 0.6, 0.68, 0.76, 0.84, 0.92, 0.98,
];

interface VideoWithVFC extends HTMLVideoElement {
  requestVideoFrameCallback(cb: (now: number, meta: unknown) => void): number;
  cancelVideoFrameCallback(id: number): void;
}

export default function ScrollVideoBackground() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video  = videoRef.current!;
    const canvas = canvasRef.current!;
    const wrap   = wrapRef.current!;
    const ctx    = canvas.getContext("2d", { alpha: false });
    if (!video || !canvas || !wrap || !ctx) return;

    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

    /* ── canvas sizing ─────────────────────────────── */
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth  * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
    }

    /* ── cover-fit draw ────────────────────────────── */
    function drawFrame() {
      if (video.readyState < 2 || !video.videoWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const vr = video.videoWidth / video.videoHeight;
      const cr = cw / ch;
      let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
      if (cr > vr) { sh = sw / cr; sy = (video.videoHeight - sh) / 2; }
      else         { sw = sh * cr; sx = (video.videoWidth  - sw) / 2; }
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      ctx!.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    /* ── state ─────────────────────────────────────── */
    let targetProgress = 0;
    let videoProgress  = 0;
    let xformPos       = 0;
    let xformVel       = 0;
    let lastScrollAt   = performance.now();
    let lastTargetTS   = performance.now();
    let scrollSpeed    = 0;        /* progress/ms, low-passed           */
    let isSeeking      = false;
    let pendingSeek    = 0;
    let rafId          = 0;
    let frameId        = -1;
    let startedAt      = performance.now();

    /* ── scroll handler ───────────────────────────── */
    function onScroll() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next = clamp(window.scrollY / max);
      const now  = performance.now();
      const dt   = Math.max(1, now - lastTargetTS);
      scrollSpeed = scrollSpeed * 0.78 + (Math.abs(next - targetProgress) / dt) * 0.22;
      targetProgress = next;
      lastTargetTS   = now;
      lastScrollAt   = now;
    }

    /* ── deduped seek ─────────────────────────────── */
    function seekTo(time: number) {
      pendingSeek = time;
      if (!isSeeking) {
        isSeeking = true;
        const v = video as HTMLVideoElement & { fastSeek?: (t: number) => void };
        if (typeof v.fastSeek === "function") v.fastSeek(time);
        else video.currentTime = time;
      }
    }

    video.addEventListener("seeked", () => {
      drawFrame();
      isSeeking = false;
      if (Math.abs(pendingSeek - video.currentTime) > SEEK_EPSILON_SLOW) {
        isSeeking = true;
        const v = video as HTMLVideoElement & { fastSeek?: (t: number) => void };
        if (typeof v.fastSeek === "function") v.fastSeek(pendingSeek);
        else video.currentTime = pendingSeek;
      }
    });

    function onVFC() {
      drawFrame();
      frameId = (video as VideoWithVFC).requestVideoFrameCallback(onVFC);
    }

    /* ── main tick: transforms update EVERY frame, video tries its best ── */
    function tick() {
      const now = performance.now();
      const t   = (now - startedAt) / 1000;
      const idle    = (now - lastScrollAt) > IDLE_SETTLE_MS;
      const active  = scrollSpeed > ACTIVE_SPEED_THRESH;

      /* ── 1. Video time tracking ─────────────────────── */
      /* Adaptive: during active scroll, loose + fast; during idle, tight  */
      const videoLerp = idle ? VIDEO_LERP_IDLE : VIDEO_LERP_ACTIVE;
      videoProgress = lerp(videoProgress, targetProgress, videoLerp);

      if (video.duration > 0) {
        const targetTime = videoProgress * video.duration;
        const eps = active ? SEEK_EPSILON_FAST : SEEK_EPSILON_SLOW;
        if (!isSeeking && Math.abs(targetTime - video.currentTime) > eps) {
          seekTo(targetTime);
        }
      }

      /* ── 2. 3D transform spring (snappy, per-frame) ─── */
      const force = (targetProgress - xformPos) * XFORM_STIFF;
      xformVel = xformVel * XFORM_DAMP + force;
      xformPos += xformVel;
      const p = clamp(xformPos);

      /* scroll-driven base transforms */
      const baseRotY  = lerp(-10,   10,   p);
      const baseRotX  = lerp(  5,   -5,   p);
      const baseScale = lerp(1.18, 1.06,  p);
      const baseTY    = lerp(  0,  -36,   p);

      /* always-on idle motion — subtle, never competes with scroll motion */
      /* fades out slightly during active scroll so direction feels crisp   */
      const idleDamp = active ? 0.45 : 1.0;
      const breathY  = Math.sin(t * 0.37)        * BREATH_AMP_YAW   * idleDamp;
      const breathX  = Math.cos(t * 0.29)        * BREATH_AMP_PITCH * idleDamp;
      const breathT  = Math.sin(t * 0.47)        * BREATH_FLOAT_Y   * idleDamp;
      const driftX   = Math.sin(t * 0.23 + 1.2)  * DRIFT_AMP_X      * idleDamp;
      const driftY   = Math.cos(t * 0.19 + 0.5)  * DRIFT_AMP_Y      * idleDamp;
      const scalePul = Math.sin(t * 0.31 + 2.1)  * BREATH_SCALE     * idleDamp;

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

    /* ── init: dense keyframe pre-warm ─────────────── */
    async function init() {
      resizeCanvas();
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      video.muted = true;
      video.playsInline = true;

      try { await video.play(); video.pause(); } catch {}

      if (video.duration > 0) {
        for (const p of PREWARM_POINTS) {
          video.currentTime = p * video.duration;
          await new Promise<void>((res) => {
            const h = () => { video.removeEventListener("seeked", h); res(); };
            video.addEventListener("seeked", h);
            setTimeout(res, 180);
          });
        }
        video.currentTime = 0;
        await new Promise<void>((res) => setTimeout(res, 50));
      }

      drawFrame();

      if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
        frameId = (video as VideoWithVFC).requestVideoFrameCallback(onVFC);
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => { resizeCanvas(); drawFrame(); });

      onScroll();
      startedAt = performance.now();
      tick();
    }

    if (video.readyState >= 2) init();
    else video.addEventListener("loadeddata", init, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (frameId !== -1 && "cancelVideoFrameCallback" in HTMLVideoElement.prototype) {
        (video as VideoWithVFC).cancelVideoFrameCallback(frameId);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <video
        ref={videoRef}
        preload="auto"
        muted
        playsInline
        className="absolute"
        style={{ width: 1, height: 1, opacity: 0 }}
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

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
            width: "100%",
            height: "100%",
            transform: "translateZ(0)",
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

      {/* center vignette — pulls UI forward */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 75% at 50% 50%, rgba(9,9,15,0.45) 0%, rgba(9,9,15,0.12) 55%, rgba(9,9,15,0) 90%)",
        }}
      />
    </div>
  );
}
