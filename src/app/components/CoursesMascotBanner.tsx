"use client";

import { MascotArt } from "@/app/components/PixelMascot";

export function CoursesMascotBanner() {
  return (
    <div
      dir="rtl"
      style={{
        margin: "16px 20px 4px",
        padding: 14,
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(18,30,24,0.6) 100%)",
        border: "1px solid rgba(110,231,183,0.28)",
        display: "flex", gap: 12, alignItems: "center",
      }}
    >
      <div style={{
        width: 58, height: 58, borderRadius: 14,
        background: "rgba(16,185,129,0.22)",
        border: "1px solid rgba(110,231,183,0.4)",
        display: "grid", placeItems: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <MascotArt state="bounce" frame={2} blink={false} scale={2.2} accent="#34d399" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: 1.2, color: "#6ee7b7",
          textTransform: "uppercase", fontWeight: 700,
        }}>
          یاد بگیر به فارسی
        </div>
        <div style={{
          fontWeight: 800, fontSize: 14, marginTop: 3,
          color: "#e8efea",
        }}>
          ۴۸ دورهٔ تخصصی، از Claude تا Cursor
        </div>
        <div style={{ fontSize: 11, color: "rgba(232,239,234,0.55)", marginTop: 2 }}>
          هر دوره زیر ۳ ساعت · به‌روز هر هفته
        </div>
      </div>
    </div>
  );
}
