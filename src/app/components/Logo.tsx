/**
 * AY Logo — minimal, geometric, reusable.
 * Uses a unique gradient ID per instance to avoid SVG conflicts.
 */

import { useId } from "react";

interface LogoProps {
  /** Square size in px */
  size?: number;
  /** Show "ای‌وای" wordmark next to the mark */
  showWordmark?: boolean;
  /** Extra className on the wrapper */
  className?: string;
}

export function Logo({ size = 32, showWordmark = false, className = "" }: LogoProps) {
  const id = useId().replace(/:/g, "");
  const gId = `ay-g-${id}`;

  const s = size;
  const r = Math.round(s * 0.24); // border-radius ≈ 24% of size

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AY"
      >
        {/* Background */}
        <rect width="40" height="40" rx={r} fill={`url(#${gId})`} />

        {/* Letter A — geometric, clean crossbar */}
        <path
          d="M9 28 L14.5 12 L20 28"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="11"
          y1="23"
          x2="18"
          y2="23"
          stroke="rgba(255,255,255,0.70)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Letter Y — clean fork */}
        <path
          d="M22 12 L27.5 20 L33 12"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="27.5"
          y1="20"
          x2="27.5"
          y2="28"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id={gId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {showWordmark && (
        <span
          className="font-bold tracking-tight text-ink-100"
          style={{ fontSize: Math.round(s * 0.44) }}
        >
          ای‌وای
        </span>
      )}
    </span>
  );
}

/**
 * Static server-side version (no useId hook needed for server components).
 * Use this in Server Components / layout files.
 */
export function LogoStatic({ size = 32, showWordmark = false, className = "" }: LogoProps) {
  const s = size;
  const r = Math.round(s * 0.24);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AY"
      >
        <rect width="40" height="40" rx={r} fill="url(#ay-static-g)" />

        <path
          d="M9 28 L14.5 12 L20 28"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="11"
          y1="23"
          x2="18"
          y2="23"
          stroke="rgba(255,255,255,0.70)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 12 L27.5 20 L33 12"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="27.5"
          y1="20"
          x2="27.5"
          y2="28"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="ay-static-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {showWordmark && (
        <span
          className="font-bold tracking-tight text-ink-100"
          style={{ fontSize: Math.round(s * 0.44) }}
        >
          ای‌وای
        </span>
      )}
    </span>
  );
}
