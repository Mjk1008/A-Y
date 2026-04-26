"use client";

import { MascotArt } from "@/app/components/PixelMascot";

export function JobsMascotBanner({ matchCount }: { matchCount: number }) {
  return (
    <div
      dir="rtl"
      style={{
        margin: "16px 20px 4px",
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(110,231,183,0.22)",
        display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(110,231,183,0.3)",
        display: "grid", placeItems: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <MascotArt state="sparkle" frame={0} blink={false} scale={1.8} accent="#34d399" />
      </div>
      <div style={{ flex: 1, fontSize: 12, color: "rgba(232,239,234,0.8)", lineHeight: 1.55 }}>
        <strong style={{ color: "#6ee7b7" }}>{matchCount > 0 ? `${matchCount} شغل` : "شغل‌ها"}</strong>{" "}
        با پروفایلت مچ شدن — بر اساس مهارت، تجربه و شهر.
      </div>
    </div>
  );
}
