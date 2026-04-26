import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/vazirmatn";
import LenisProvider from "./components/LenisProvider";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { PageProgressBar, OfflineDetector } from "@/app/components/LoadingStates";
import { FloatingMascot } from "@/app/components/PixelMascot";

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
      <head />
      <body className="min-h-screen" style={{ fontFamily: "'Vazirmatn Variable', 'Vazirmatn', system-ui, sans-serif", background: "#020306", color: "#e8efea" }}>
        <PageProgressBar />
        <OfflineDetector />
        <LenisProvider />
        <ThemeProvider>
          {children}
          <FloatingMascot />
        </ThemeProvider>
      </body>
    </html>
  );
}
