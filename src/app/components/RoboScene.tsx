"use client";

/**
 * AmbientBG — minimal dark-green pixel scene with scroll-keyframe
 * motion. Deep back layer has faint line-art arrows; foreground has
 * a dense sprinkle of flat pixels + a handful of bright lead pixels
 * + thin 1-px trails. 5-stop per-element keyframe paths, cubic-in-out
 * tween between stops, reversible on scroll-up.
 *
 * Transition variety:
 *   • spatial sweep (all kinds)
 *   • fade in / fade out mid-scroll (pulse kind)
 *   • scale breathe 0 → peak → 0 (some dots)
 *   • arrows drift deep in the background, very low opacity
 */

import { useEffect, useMemo, useRef } from "react";
import { scrollState } from "./LenisProvider";

/* ─────────────────────── Types ─────────────────────── */
type Kind = "pixel" | "bright" | "blob" | "trail" | "pulse" | "flash";

type Key = {
  p: number;
  x: number;     /* vw  */
  y: number;     /* vh  */
  s: number;     /* scale */
  o: number;     /* opacity */
  r: number;     /* deg */
};

interface El {
  id: string;
  kind: Kind;
  size: number;          /* px for pixels/trails/arrows; vmin for blobs */
  keys: Key[];
  /* 3D depth — each element sits at a different Z in the scene so the
     scroll-driven CAMERA parallaxes them correctly. Range ≈ ±500 px. */
  z: number;
  /* Idle drift — additive sine motion that runs CONTINUOUSLY, even
     when the user isn't scrolling. Very slow frequencies so it reads
     as "super slow-motion" breathing of the whole field.             */
  drift: { ax: number; ay: number; sp: number; ph: number };
}

/* ═════════════ CAMERA KEYFRAMES ═════════════════════════════════════
   The CAMERA sweeps through the universe as the user scrolls — big
   angle changes at specific breakpoints, cubic-in-out tween between.
   Each pose: rotate X/Y/Z and translate Z (dolly). Fully reversible. */
type Cam = { p: number; rx: number; ry: number; rz: number; tz: number };
const CAM_KEYS: Cam[] = [
  { p: 0.00, rx:   0, ry:    0, rz:   0, tz:    0 },
  { p: 0.15, rx:  -8, ry:  -45, rz:   4, tz:  -40 },   /* sweep left, tilt up  */
  { p: 0.32, rx: -55, ry:   15, rz:  -6, tz: -180 },   /* overhead smash       */
  { p: 0.50, rx:  10, ry:   70, rz:   5, tz:  140 },   /* orbit right, push    */
  { p: 0.68, rx:  35, ry:   25, rz: -12, tz:   60 },   /* low angle, tilt      */
  { p: 0.85, rx:  -4, ry: -120, rz:   8, tz:  -80 },   /* big 120° swing back  */
  { p: 1.00, rx:  -6, ry:  -20, rz:   2, tz: -260 },   /* wide pull-back       */
];
function sampleCam(p: number): Cam {
  if (p <= CAM_KEYS[0].p) return CAM_KEYS[0];
  const last = CAM_KEYS[CAM_KEYS.length - 1];
  if (p >= last.p) return last;
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    const a = CAM_KEYS[i], b = CAM_KEYS[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = easeInOutLocal((p - a.p) / (b.p - a.p));
      return {
        p,
        rx: a.rx + (b.rx - a.rx) * t,
        ry: a.ry + (b.ry - a.ry) * t,
        rz: a.rz + (b.rz - a.rz) * t,
        tz: a.tz + (b.tz - a.tz) * t,
      };
    }
  }
  return CAM_KEYS[0];
}
const easeInOutLocal = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/* ───────── Seeded RNG ───────── */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ───────── Keyframe path ─────────
   Standard drifting path with wobble. Optional `pulse` flag makes the
   opacity oscillate in/out across the stops to add transition variety. */
function genPath(rand: () => number, stops = 5, pulse = false, canRotate = false): Key[] {
  const keys: Key[] = [];
  const sx = (rand() - 0.2) * 120 - 10;
  const sy = rand() * 100;
  const dir = rand() * Math.PI * 2;
  const span = 60 + rand() * 100;
  const rDrift = canRotate ? (rand() - 0.5) * 540 : 0;
  const rStart = canRotate ? (rand() - 0.5) * 180 : 0;
  /* Two layered sines for a richer path — low-freq body + high-freq
     jitter. With many stops this reads as a proper winding trail.    */
  const freqA = 1 + Math.floor(rand() * 3);    /* 1..3                */
  const freqB = 4 + Math.floor(rand() * 5);    /* 4..8                */
  const phaseA = rand() * 6.28;
  const phaseB = rand() * 6.28;
  const ampB = 4 + rand() * 8;

  for (let i = 0; i < stops; i++) {
    const t = i / (stops - 1);
    const baseX = sx + Math.cos(dir) * span * t;
    const baseY = sy + Math.sin(dir) * span * t;
    const wobbleX = Math.sin(t * Math.PI * 2 * freqA + phaseA) * 14
                  + Math.cos(t * Math.PI * 2 * freqB + phaseB) * ampB;
    const wobbleY = Math.cos(t * Math.PI * 2 * freqA + phaseA) * 12
                  + Math.sin(t * Math.PI * 2 * freqB + phaseB) * ampB;
    /* Opacity curve:
         normal: gentle random
         pulse : multi-cycle sin — many on/off transitions            */
    const op = pulse
      ? 0.1 + (0.8 * (0.5 - 0.5 * Math.cos(t * Math.PI * (4 + Math.floor(rand() * 6)))))
      : 0.35 + rand() * 0.55;
    keys.push({
      p: t,
      x: baseX + wobbleX,
      y: baseY + wobbleY + (rand() - 0.5) * 8,
      s: 0.7 + rand() * 0.9,
      o: op,
      r: rStart + rDrift * t,
    });
  }
  return keys;
}

/* Generate idle-drift params — small amplitudes, very slow speeds
   (0.015..0.06 rad/s → cycle period 100..400 s). Super slow.       */
function genDrift(rand: () => number, amp = 1): El["drift"] {
  return {
    ax: (1.2 + rand() * 2.4) * amp,     /* vw peak displacement      */
    ay: (0.9 + rand() * 1.8) * amp,     /* vh peak displacement      */
    sp: 0.25 + rand() * 0.65,           /* rad/s — cycle 10..25 s    */
    ph: rand() * 6.28,
  };
}

/* ───────── Element factory ───────── */
function buildElements(): El[] {
  const rand = rng(7177);
  /* Build list without drift first; fill drift in a post-pass below
     so we don't have to repeat it 6 times.                           */
  const out: Omit<El, "drift">[] = [];

  /* 4 soft blobs — atmospheric depth. */
  for (let i = 0; i < 4; i++) {
    out.push({
      id: `blob-${i}`,
      kind: "blob",
      size: 55 + rand() * 45,
      keys: genPath(rand, 10).map((k) => ({ ...k, o: 0.22 + rand() * 0.22, s: 1 + rand() * 0.5 })),
    });
  }

  /* 110 flat pixels — 10..14 stops each for rich, twisty paths.       */
  for (let i = 0; i < 110; i++) {
    out.push({
      id: `px-${i}`,
      kind: "pixel",
      size: 2 + Math.floor(rand() * 3),
      keys: genPath(rand, 10 + Math.floor(rand() * 5)),
    });
  }

  /* 20 pulse pixels — 12..18 stops, opacity oscillates in/out.         */
  for (let i = 0; i < 20; i++) {
    out.push({
      id: `pl-${i}`,
      kind: "pulse",
      size: 2 + Math.floor(rand() * 3),
      keys: genPath(rand, 12 + Math.floor(rand() * 7), /*pulse*/ true),
    });
  }

  /* 16 bright lead pixels — 10..13 stops. */
  for (let i = 0; i < 16; i++) {
    out.push({
      id: `br-${i}`,
      kind: "bright",
      size: 4 + Math.floor(rand() * 3),
      keys: genPath(rand, 10 + Math.floor(rand() * 4)).map((k) => ({
        ...k, o: 0.55 + rand() * 0.4,
      })),
    });
  }

  /* 14 thin 1-px trails — 10..14 stops, rotate + drift.               */
  for (let i = 0; i < 14; i++) {
    out.push({
      id: `tr-${i}`,
      kind: "trail",
      size: 18 + Math.floor(rand() * 30),
      keys: genPath(rand, 10 + Math.floor(rand() * 5), false, true).map((k) => ({
        ...k, o: 0.25 + rand() * 0.4,
      })),
    });
  }

  /* 42 flash lines — thin 1-px emerald streaks that STROBE as the
     user scrolls. Varied length, travel-distance, stop-count, and
     per-flash brightness so the field feels organic (not a grid of
     identical strobes). Three intensity tiers: faint / medium / hot. */
  for (let i = 0; i < 42; i++) {
    /* Length: short accents vs long streaks. */
    const length = 10 + Math.floor(rand() * 140);   /* 10..150 px     */

    /* Travel distance across the viewport (how far the line drifts).  */
    const span = 20 + rand() * 110;                 /* short..long    */

    /* Stop count: 14..26 — many, many flashes across scroll.          */
    const stops = 14 + Math.floor(rand() * 13);

    /* Intensity tier — weighted so most are medium, few are faint/hot.*/
    const tier = rand();
    const peak =
      tier < 0.25 ? 0.18 + rand() * 0.18 :          /* faint           */
      tier < 0.80 ? 0.45 + rand() * 0.30 :          /* medium          */
                    0.85 + rand() * 0.15;           /* hot             */

    /* Phase: decide if flashes fall on odd or even stops, so not all
       lines flash simultaneously.                                     */
    const phaseOffset = Math.floor(rand() * 2);

    const sx = (rand() - 0.2) * 120 - 10;
    const sy = rand() * 100;
    const dir = rand() * Math.PI * 2;
    const rStart = (rand() - 0.5) * 180;
    const rDrift = (rand() - 0.5) * 240;

    const keys: Key[] = [];
    for (let s = 0; s < stops; s++) {
      const t = s / (stops - 1);
      const baseX = sx + Math.cos(dir) * span * t;
      const baseY = sy + Math.sin(dir) * span * t;
      const on = (s + phaseOffset) % 2 === 1;
      keys.push({
        p: t,
        x: baseX + (rand() - 0.5) * 8,
        y: baseY + (rand() - 0.5) * 12,
        s: 0.9 + rand() * 0.7,
        /* Per-stop jitter on the ON frames — no two flashes identical.*/
        o: on ? peak * (0.7 + rand() * 0.3) : 0,
        r: rStart + rDrift * t,
      });
    }
    out.push({
      id: `fl-${i}`,
      kind: "flash",
      size: length,
      keys,
    });
  }

  /* Fill drift + 3D depth in a second pass. Z depth is what makes the
     scroll-camera's rotation feel like real 3D parallax — without it
     everything is stuck on a flat plane and rotating just skews the
     whole image.                                                     */
  return out.map((el) => {
    const amp =
      el.kind === "blob"   ? 3.0 :
      el.kind === "flash"  ? 2.4 :
      el.kind === "trail"  ? 2.0 :
      el.kind === "bright" ? 1.6 :
                             1.2;
    /* Blobs stay far back so they don't whip around; pixels fill a
       wide z-range for strong parallax.                               */
    const z = el.kind === "blob"
      ? -300 - rand() * 200                           /* -300..-500   */
      : (rand() - 0.5) * 900;                         /* -450..+450   */
    return { ...el, z, drift: genDrift(rand, amp) };
  });
}

/* ───────── Ease + sampler ───────── */
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function sample(keys: Key[], p: number): Key {
  if (p <= keys[0].p) return keys[0];
  const last = keys[keys.length - 1];
  if (p >= last.p) return last;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = easeInOut((p - a.p) / (b.p - a.p));
      return {
        p,
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        s: a.s + (b.s - a.s) * t,
        o: a.o + (b.o - a.o) * t,
        r: a.r + (b.r - a.r) * t,
      };
    }
  }
  return keys[0];
}

/* ───────── Component ───────── */
export default function RoboScene() {
  const elements = useMemo(buildElements, []);
  const refs = useRef<Map<string, HTMLDivElement>>(new Map());
  const camRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const t0 = performance.now();

    /* Tick runs EVERY frame — scroll drives (a) the per-element
       keyframe pose and (b) the scene-wide CAMERA pose. An additive
       per-element sine drift keeps the field floating in super slow
       motion even when the user isn't scrolling.                     */
    const tick = () => {
      const tSec = (performance.now() - t0) / 1000;
      const raw = scrollState.ready ? scrollState.progress : 0;
      const p   = Math.min(1, Math.max(0, raw));

      /* Camera pose — applied to the world wrapper, not individual
         elements. Rotating the camera layer rotates every element
         together, creating the "new angle on the universe" effect.  */
      const cam = camRef.current;
      if (cam) {
        const c = sampleCam(p);
        cam.style.transform =
          `translate3d(0, 0, ${c.tz.toFixed(2)}px) ` +
          `rotateX(${c.rx.toFixed(2)}deg) ` +
          `rotateY(${c.ry.toFixed(2)}deg) ` +
          `rotateZ(${c.rz.toFixed(2)}deg)`;
      }

      for (const el of elements) {
        const node = refs.current.get(el.id);
        if (!node) continue;
        const k = sample(el.keys, p);

        /* Idle slow-motion drift — sin/cos with per-element phase + spd. */
        const d = el.drift;
        const dx = Math.sin(tSec * d.sp + d.ph) * d.ax;
        const dy = Math.cos(tSec * d.sp * 0.85 + d.ph * 1.3) * d.ay;

        const rot = k.r !== 0 ? ` rotate(${k.r.toFixed(2)}deg)` : "";
        /* Each element carries its own Z — the camera rotation applied
           one level up in .robo-world will parallax them properly.    */
        node.style.transform =
          `translate3d(${(k.x + dx).toFixed(2)}vw, ${(k.y + dy).toFixed(2)}vh, ${el.z.toFixed(1)}px) ` +
          `translate(-50%, -50%)${rot} ` +
          `scale(${k.s.toFixed(3)})`;
        node.style.opacity = k.o.toFixed(3);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [elements]);

  return (
    <div
      aria-hidden
      className="ambient-bg fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Deep green-black base. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 80% at 50% 45%, #0a1913 0%, #050c08 55%, #02040a 100%)",
        }}
      />

      {/* CAMERA layer — one transform wraps the whole universe so a
          single scroll-driven pose rotates every element together. */}
      <div ref={camRef} className="amb-camera">
        {elements.map((el) => {
          const sizePx   = `${el.size}px`;
          const sizeVmin = `${el.size}vmin`;
          let w: string, h: string;
          switch (el.kind) {
            case "blob":   w = sizeVmin; h = sizeVmin; break;
            case "trail":  w = sizePx;   h = "1px";    break;
            case "flash":  w = sizePx;   h = "1px";    break;
            case "bright":
            case "pulse":
            case "pixel":  w = sizePx;   h = sizePx;   break;
          }
          return (
            <div
              key={el.id}
              ref={(node) => {
                if (node) refs.current.set(el.id, node);
                else refs.current.delete(el.id);
              }}
              className={`amb-el amb-${el.kind}`}
              style={{ width: w, height: h }}
            />
          );
        })}
      </div>

      {/* Cinematic vignette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,4,6,0.5) 0%, rgba(2,4,6,0) 18%, rgba(2,4,6,0) 80%, rgba(2,4,6,0.65) 100%)",
        }}
      />

      <style>{`
        /* 3D SCENE — perspective + preserve-3d so the camera layer's
           rotateX/Y/Z actually parallaxes elements at different Zs.  */
        .ambient-bg {
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }
        .amb-camera {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .amb-el {
          position: absolute;
          top: 0; left: 0;
          will-change: transform, opacity;
          transform-origin: center center;
          transform-style: preserve-3d;
          image-rendering: pixelated;
        }
        .amb-pixel  { background: #2e6b48; }
        .amb-pulse  { background: #3f8a5d; }
        .amb-bright {
          background: #6ee7b7;
          box-shadow: 0 0 4px rgba(110, 231, 183, 0.55);
        }
        .amb-trail {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(110, 231, 183, 0.55) 50%,
            transparent 100%);
        }
        /* Strobing flash line — flat 1-px emerald, no glow. Element's
           own opacity (driven by scroll keyframes) creates the flash.  */
        .amb-flash {
          background: rgba(167, 243, 208, 0.95);
        }
        .amb-blob {
          mix-blend-mode: screen;
          background: radial-gradient(circle at 50% 50%,
            rgba(34, 197, 130, 0.20) 0%,
            rgba(16, 120, 78, 0.09) 42%,
            transparent 72%);
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
