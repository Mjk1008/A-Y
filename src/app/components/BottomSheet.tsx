"use client";

import React, { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}

/**
 * Reusable mobile-native bottom sheet.
 * Slides up from the bottom, blocks body scroll, closes on backdrop tap.
 */
export function BottomSheet({ open, onClose, children, maxHeight = "90dvh" }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes ay-sheet-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes ay-sheet-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.68)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          animation: "ay-sheet-fade 0.2s ease-out",
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 201,
          background: "#0c1410",
          border: "1px solid rgba(110,231,183,0.13)",
          borderBottom: "none",
          borderRadius: "22px 22px 0 0",
          maxHeight,
          overflowY: "auto",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
          animation: "ay-sheet-in 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div style={{ textAlign: "center", paddingTop: 14, paddingBottom: 8, flexShrink: 0 }}>
          <div style={{
            width: 38, height: 4,
            background: "rgba(110,231,183,0.2)",
            borderRadius: 2, display: "inline-block",
          }} />
        </div>

        {children}
      </div>
    </>
  );
}
