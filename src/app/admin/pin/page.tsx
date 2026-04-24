"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Delete } from "lucide-react";

const PIN_LENGTH = 4;
const KEYS = [
  ["۱", "1"], ["۲", "2"], ["۳", "3"],
  ["۴", "4"], ["۵", "5"], ["۶", "6"],
  ["۷", "7"], ["۸", "8"], ["۹", "9"],
  ["", ""], ["۰", "0"], ["⌫", "del"],
];

export default function AdminPinPage() {
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  async function submit(digits: string[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: digits.join("") }),
      });
      if (res.ok) {
        router.replace("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "پین اشتباه است");
        setShake(true);
        setTimeout(() => { setShake(false); setPin([]); }, 600);
      }
    } catch {
      setError("خطای اتصال");
    } finally {
      setLoading(false);
    }
  }

  function press(key: string) {
    if (loading) return;
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      setError("");
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const next = [...pin, key];
    setPin(next);
    if (next.length === PIN_LENGTH) submit(next);
  }

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      if (e.key === "Backspace") press("del");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100svh",
        background: "#020306",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

        {/* Icon + title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(252,211,77,0.10)",
            border: "1px solid rgba(252,211,77,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={28} style={{ color: "#fcd34d" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#e8efea" }}>پنل ادمین</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>پین ۴ رقمی خود را وارد کنید</div>
          </div>
        </div>

        {/* PIN dots */}
        <div
          style={{
            display: "flex", gap: 14,
            animation: shake ? "shake 0.5s ease" : "none",
          }}
        >
          <style>{`
            @keyframes shake {
              0%,100% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-6px); }
              80% { transform: translateX(6px); }
            }
          `}</style>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <div
                key={i}
                style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: filled ? "#fcd34d" : "transparent",
                  border: `2px solid ${filled ? "#fcd34d" : "rgba(255,255,255,0.2)"}`,
                  transition: "all 0.15s",
                  boxShadow: filled ? "0 0 8px rgba(252,211,77,0.5)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{ fontSize: 12, color: "#ef4444", textAlign: "center" }}>{error}</div>
        )}

        {/* Keypad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 10 }}>
          {KEYS.map(([label, val], i) => {
            if (!val) return <div key={i} />;
            const isDel = val === "del";
            return (
              <button
                key={i}
                onClick={() => press(val)}
                disabled={loading}
                style={{
                  width: 72, height: 72, borderRadius: 18,
                  background: isDel ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isDel ? "rgba(239,68,68,0.20)" : "rgba(255,255,255,0.08)"}`,
                  color: isDel ? "#ef4444" : "#e8efea",
                  fontSize: isDel ? 20 : 24, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  WebkitTapHighlightColor: "transparent",
                  transition: "background 0.1s, transform 0.1s",
                  transform: "scale(1)",
                }}
                onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)"; }}
                onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {isDel ? <Delete size={20} /> : label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>در حال بررسی…</div>
        )}
      </div>
    </div>
  );
}
