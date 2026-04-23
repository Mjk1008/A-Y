import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A-Y | ای‌وای — استاد AI شو، نه قربانی",
  description:
    "A-Y به تو کمک می‌کنه بر اساس شغل و مهارت‌هات، بهترین ابزارهای AI رو یاد بگیری و توی کارت اهرم بسازی — تا هیچ‌وقت جایگزین نشی.",
  openGraph: {
    title: "A-Y — استاد AI شو",
    description: "ابزار شخصی‌سازی‌شده AI برای هر شغل",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
      </head>
      <body className="min-h-screen" style={{ fontFamily: "'Vazirmatn', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
