"use client";

import React, { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url.slice(0, 40); }
}

interface Props {
  href: string;
  /** Display name shown in the popup (defaults to extracted domain) */
  siteName?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wraps any external link with a "you're leaving the app" confirmation popup.
 * Usage: replace <a href={url} target="_blank"> with <ExternalLinkGuard href={url}>
 */
export function ExternalLinkGuard({ href, siteName, children, className, style }: Props) {
  const [open, setOpen] = useState(false);
  const domain = siteName || getDomain(href);

  function go() {
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      {/* Trigger — rendered as a button so it's accessible */}
      <button
        onClick={() => setOpen(true)}
        className={className}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "inherit", ...style }}
      >
        {children}
      </button>

      {open && (
        <>
          <style>{`
            @keyframes ay-guard-up {
              from { transform: translateY(16px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes ay-guard-fade {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>

          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 400,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "ay-guard-fade 0.18s ease-out",
            }}
          />

          {/* Popup card */}
          <div
            dir="rtl"
            style={{
              position: "fixed",
              left: 16, right: 16,
              bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
              zIndex: 401,
              background: "rgba(10,16,13,0.98)",
              border: "1px solid rgba(110,231,183,0.14)",
              borderRadius: 22,
              padding: "20px 18px 18px",
              animation: "ay-guard-up 0.22s cubic-bezier(0.32,0.72,0,1)",
              fontFamily: "'Vazirmatn', sans-serif",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="بستن"
              style={{
                position: "absolute", top: 14, left: 14,
                width: 30, height: 30, borderRadius: 9,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid", placeItems: "center",
                cursor: "pointer",
              }}
            >
              <X size={14} color="rgba(232,239,234,0.6)" />
            </button>

            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 15, marginBottom: 14,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.22)",
              display: "grid", placeItems: "center",
            }}>
              <ArrowUpRight size={22} color="#fca5a5" />
            </div>

            {/* Text */}
            <div style={{ fontSize: 15.5, fontWeight: 800, color: "#e8efea", marginBottom: 7 }}>
              خروج از برنامه
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(232,239,234,0.5)", lineHeight: 1.75, marginBottom: 20 }}>
              رفتن به{" "}
              <span style={{ color: "#e8efea", fontWeight: 700 }}>{domain}</span>{" "}
              تو رو از برنامه خارج می‌کنه. ادامه می‌دی؟
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  fontSize: 13, fontWeight: 700,
                  color: "rgba(232,239,234,0.55)",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                بمون
              </button>
              <button
                onClick={go}
                style={{
                  flex: 2, padding: "12px 0", borderRadius: 14,
                  background: "rgba(248,113,113,0.14)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  fontSize: 13, fontWeight: 700, color: "#fca5a5",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                <ArrowUpRight size={14} />
                برو به {domain}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
