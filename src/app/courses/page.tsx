import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";
import Courses from "@/app/components/Courses";

export default async function CoursesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-[100dvh] pb-28" style={{ background: "#020306", color: "#e8efea" }}>
      <BottomNav />

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.06]"
        style={{
          background: "rgba(2,3,6,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3.5">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-400 transition hover:text-ink-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-ink-100">بهترین دوره‌ها</h1>
            <p className="text-[10.5px] text-ink-600">
              از مکتب‌خونه، کوئرا، لیمو و فرادرس
            </p>
          </div>
        </div>
      </header>

      <Courses limit={20} />
    </div>
  );
}
