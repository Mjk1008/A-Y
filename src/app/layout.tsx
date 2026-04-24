import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";

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
          href="https://cdn.fontcdn.ir/Font/Persian/Peyda/Peyda.css"
        />
      </head>
      <body className="min-h-screen" style={{ fontFamily: "'Peyda', 'Vazirmatn', system-ui, sans-serif", background: "#020306", color: "#e8efea" }}>
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
