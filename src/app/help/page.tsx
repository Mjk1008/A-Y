"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, Send, Mail, Clock } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";

const FAQS = [
  {
    q: "A-Y چطور کار می‌کنه؟",
    a: "شغل و مهارت‌هات رو می‌گیره، با مدل‌های زبانی تحلیل می‌کنه و دقیقاً می‌گه کدوم ابزار AI رو، با چه ترتیبی، توی چه زمانی یاد بگیری تا توی شغلت جا نمونی.",
  },
  {
    q: "تحلیل چند دقیقه طول می‌کشه؟",
    a: "معمولاً کمتر از ۳۰ ثانیه. بعد از ذخیره پروفایل، تحلیل به صورت خودکار آماده می‌شه و روی داشبورد نمایش داده می‌شه.",
  },
  {
    q: "آیا داده‌هام پیش شما امنه؟",
    a: "بله. اطلاعات تو روی سرور ایمن ذخیره می‌شه و هرگز با اشخاص ثالث به اشتراک گذاشته نمی‌شه. می‌تونی هر زمان داده‌هات رو export کنی یا حسابت رو کامل حذف کنی.",
  },
  {
    q: "چطور پلنم رو ارتقا بدم یا کنسل کنم؟",
    a: "از بخش اشتراک → مدیریت، می‌تونی ارتقا بدی یا کنسل کنی. بعد از کنسل، دسترسی‌هات تا پایان دوره پرداختی‌شده ادامه داره.",
  },
  {
    q: "چه ابزارهایی رو پوشش می‌دید؟",
    a: "بیش از ۲۰۰ ابزار AI — از ChatGPT و Claude تا ابزارهای تخصصی حوزه‌های مختلف مثل طراحی، کدنویسی، مارکتینگ، حقوق و مالی.",
  },
  {
    q: "بدون پرداخت چقدر می‌تونم استفاده کنم؟",
    a: "پلن رایگان شامل ۱ تحلیل در هفته، ۳ ابزار پیشنهادی و یک بار تولید نقشه راه می‌شه. برای دسترسی بیشتر، پلن پرو رو امتحان کن.",
  },
  {
    q: "فاکتور پرداخت رو از کجا بگیرم؟",
    a: "از بخش اشتراک → تاریخچه پرداخت‌ها، می‌تونی جزئیات هر تراکنش رو ببینی. برای فاکتور رسمی با ما تماس بگیر.",
  },
  {
    q: "برای تیم‌ها هم پلن دارید؟",
    a: "فعلاً پلن تیمی در دست توسعه‌ست. اگه سازمانت نیاز داره، با ما از طریق تلگرام یا ایمیل در تماس باش.",
  },
];

function FAQItem({ q, a, defaultOpen = false }: { q: string; a?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      borderRadius: 14, marginBottom: 8, overflow: "hidden",
      background: "rgba(31,46,40,0.55)",
      border: `1px solid ${open ? "rgba(110,231,183,0.22)" : "rgba(110,231,183,0.10)"}`,
      transition: "border-color 0.2s",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          background: "none", border: "none", cursor: "pointer", textAlign: "right",
          direction: "rtl",
        }}
      >
        <div style={{
          flex: 1, fontWeight: open ? 800 : 600, fontSize: 13.5,
          color: open ? "#6ee7b7" : "#e8efea", lineHeight: 1.4,
          fontFamily: "inherit",
        }}>{q}</div>
        <div style={{
          width: 24, height: 24, borderRadius: 7, flexShrink: 0,
          background: open ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)",
          display: "grid", placeItems: "center",
          transition: "background 0.2s",
        }}>
          {open ? (
            <ChevronDown size={12} color="#6ee7b7" strokeWidth={2.2} />
          ) : (
            <Plus size={12} color="rgba(232,239,234,0.55)" strokeWidth={2.2} />
          )}
        </div>
      </button>
      {open && a && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(110,231,183,0.08)" }}>
          <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "rgba(232,239,234,0.7)", lineHeight: 1.8 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(
    (f) => !search || f.q.includes(search) || (f.a && f.a.includes(search))
  );

  return (
    <div style={{
      minHeight: "100dvh", paddingBottom: 110,
      background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306",
      color: "#e8efea",
    }}>
      <BottomNav />

      {/* top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        padding: "22px 20px 12px",
        background: "linear-gradient(180deg, rgba(2,3,6,0.92) 0%, rgba(2,3,6,0.0) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>راهنما</div>
      </div>

      <div style={{ padding: "12px 20px", maxWidth: 448, margin: "0 auto" }}>

        {/* search */}
        <div style={{
          padding: "12px 14px", borderRadius: 14, marginBottom: 18,
          background: "rgba(31,46,40,0.55)", border: "1px solid rgba(110,231,183,0.16)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Search size={16} color="rgba(110,231,183,0.7)" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو در سؤال‌های متداول…"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 13, color: "#e8efea", fontFamily: "inherit",
              caretColor: "#34d399",
            }}
          />
        </div>

        {/* section label */}
        <div style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: 2,
          color: "rgba(110,231,183,0.7)", textTransform: "uppercase", marginBottom: 8,
        }}>
          سؤال‌های متداول · {filtered.length}
        </div>

        {/* FAQ list */}
        {filtered.length > 0 ? (
          filtered.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} defaultOpen={i === 0 && !search} />
          ))
        ) : (
          <div style={{
            padding: "32px 16px", borderRadius: 14, textAlign: "center",
            background: "rgba(31,46,40,0.4)", border: "1px solid rgba(110,231,183,0.08)",
            fontSize: 13, color: "rgba(232,239,234,0.5)",
          }}>
            نتیجه‌ای پیدا نشد. سؤالت رو از طریق پشتیبانی بپرس.
          </div>
        )}

        {/* contact section */}
        <h3 style={{ margin: "24px 0 12px", fontWeight: 800, fontSize: 16 }}>هنوز سؤال داری؟</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {/* Telegram */}
          <a
            href="https://t.me/ay_support"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: 16, borderRadius: 16, textAlign: "center",
              background: "linear-gradient(180deg, rgba(56,189,248,0.10), rgba(56,189,248,0.02))",
              border: "1px solid rgba(56,189,248,0.28)",
              textDecoration: "none", display: "block",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, margin: "0 auto 10px",
              background: "rgba(56,189,248,0.18)", display: "grid", placeItems: "center",
            }}>
              <Send size={20} color="#67e8f9" strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#67e8f9" }}>تلگرام</div>
            <div style={{ fontFamily: "monospace", fontSize: 10.5, color: "rgba(232,239,234,0.55)", marginTop: 4 }}>@ay_support</div>
            <div style={{
              marginTop: 10, padding: "8px 0", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(56,189,248,0.18)",
              fontSize: 12, fontWeight: 700, color: "rgba(232,239,234,0.7)",
            }}>پیام بده</div>
          </a>

          {/* Email */}
          <a
            href="mailto:hi@a-y.app"
            style={{
              padding: 16, borderRadius: 16, textAlign: "center",
              background: "linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.02))",
              border: "1px solid rgba(110,231,183,0.28)",
              textDecoration: "none", display: "block",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, margin: "0 auto 10px",
              background: "rgba(16,185,129,0.18)", display: "grid", placeItems: "center",
            }}>
              <Mail size={20} color="#6ee7b7" strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#6ee7b7" }}>ایمیل</div>
            <div style={{ fontFamily: "monospace", fontSize: 10.5, color: "rgba(232,239,234,0.55)", marginTop: 4 }}>hi@a-y.app</div>
            <div style={{
              marginTop: 10, padding: "8px 0", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.18)",
              fontSize: 12, fontWeight: 700, color: "rgba(232,239,234,0.7)",
            }}>بفرست</div>
          </a>
        </div>

        {/* hours */}
        <div style={{
          padding: 14, borderRadius: 14, marginBottom: 8,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(110,231,183,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Clock size={14} color="rgba(110,231,183,0.7)" />
          <span style={{ flex: 1, fontSize: 11.5, color: "rgba(232,239,234,0.6)" }}>
            ساعت پاسخ‌گویی: شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر
          </span>
        </div>

      </div>
    </div>
  );
}
