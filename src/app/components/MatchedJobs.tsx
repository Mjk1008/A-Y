"use client";

import { MapPin, ExternalLink, Clock, Search, Wifi, Bookmark, X } from "lucide-react";
import { SkeletonList } from "@/app/components/LoadingStates";
import { useEffect, useState, useCallback } from "react";
import { BottomSheet } from "@/app/components/BottomSheet";
import { ExternalLinkGuard } from "@/app/components/ExternalLinkGuard";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  url: string;
  posted_at: string;
  is_remote: boolean;
  source: string;
}

const SOURCES: Record<string, { label: string }> = {
  jobinja:    { label: "جاب‌اینجا" },
  jobvision:  { label: "جاب‌ویژن" },
  irantalent: { label: "ایران‌تلنت" },
  karboom:    { label: "کاربوم" },
};

const FILTERS = ["بالاترین تطابق", "دورکاری", "ارشد", "تهران"];

function calcMatchPct(jobSkills: string[], userSkills: string[]): number | null {
  if (!jobSkills.length || !userSkills.length) return null;
  const norm = (s: string) => s.toLowerCase().trim();
  const jSet = jobSkills.map(norm);
  const uSet = userSkills.map(norm);
  const matched = jSet.filter((js) => uSet.some((us) => us.includes(js) || js.includes(us))).length;
  return Math.min(99, Math.round((matched / jSet.length) * 100));
}

/* ── Job Detail Sheet ──────────────────────────────────────────────── */
function JobDetailSheet({
  job, userSkills, onClose,
}: {
  job: Job;
  userSkills: string[];
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const src = SOURCES[job.source] ?? { label: job.source };
  const timeAgo = job.posted_at ? new Date(job.posted_at).toLocaleDateString("fa-IR") : "";
  const matchPct = calcMatchPct(job.skills ?? [], userSkills);

  return (
    <div dir="rtl" style={{ fontFamily: "'Vazirmatn', sans-serif", padding: "0 18px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
          {/* Company logo */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.1))",
            border: "1px solid rgba(110,231,183,0.3)",
            display: "grid", placeItems: "center",
            fontWeight: 900, fontSize: 22, color: "#6ee7b7",
          }}>
            {job.company?.charAt(0) ?? "؟"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1.4, color: "#e8efea" }}>{job.title}</div>
            <div style={{ fontSize: 12.5, color: "rgba(232,239,234,0.6)", marginTop: 3, fontWeight: 600 }}>
              {job.company}
              <span style={{ color: "rgba(232,239,234,0.28)", margin: "0 6px" }}>·</span>
              {src.label}
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="بستن"
          style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0, marginRight: 6,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
            display: "grid", placeItems: "center", cursor: "pointer",
          }}
        >
          <X size={14} color="rgba(232,239,234,0.6)" />
        </button>
      </div>

      {/* Match gauge */}
      {matchPct !== null && (
        <div style={{
          padding: "10px 14px", borderRadius: 12, marginBottom: 14,
          background: matchPct >= 85
            ? "rgba(52,211,153,0.08)"
            : matchPct >= 70
              ? "rgba(250,204,21,0.08)"
              : "rgba(139,92,246,0.08)",
          border: `1px solid ${matchPct >= 85 ? "rgba(52,211,153,0.25)" : matchPct >= 70 ? "rgba(250,204,21,0.25)" : "rgba(139,92,246,0.25)"}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <MatchGauge pct={matchPct} size={40} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#e8efea" }}>
              {matchPct >= 85 ? "تطابق بالا" : matchPct >= 70 ? "تطابق متوسط" : "تطابق پایه"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(232,239,234,0.45)", marginTop: 2 }}>
              بر اساس مهارت‌های پروفایل تو
            </div>
          </div>
        </div>
      )}

      {/* Meta */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14,
        padding: "10px 14px", borderRadius: 12,
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
      }}>
        {job.location && (
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(232,239,234,0.6)" }}>
            <MapPin size={12} color="rgba(110,231,183,0.6)" />
            {job.location}
          </span>
        )}
        {job.is_remote && (
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6ee7b7", fontWeight: 600 }}>
            <Wifi size={12} color="#6ee7b7" />
            دورکاری
          </span>
        )}
        {timeAgo && (
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(232,239,234,0.45)" }}>
            <Clock size={12} />
            {timeAgo}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(232,239,234,0.3)", letterSpacing: 2, marginBottom: 8 }}>مهارت‌های موردنیاز</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {job.skills.map((t) => {
              const norm = (s: string) => s.toLowerCase().trim();
              const isMatch = userSkills.some((us) => norm(us).includes(norm(t)) || norm(t).includes(norm(us)));
              return (
                <span key={t} style={{
                  padding: "4px 10px", borderRadius: 8,
                  background: isMatch ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isMatch ? "rgba(52,211,153,0.3)" : "rgba(110,231,183,0.12)"}`,
                  fontSize: 11.5, fontWeight: 600,
                  color: isMatch ? "#34d399" : "rgba(232,239,234,0.6)",
                }}>{t}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        {job.url && (
          <ExternalLinkGuard href={job.url} siteName={src.label} style={{ flex: 1, display: "block" }}>
            <div style={{
              width: "100%", padding: "13px 0", borderRadius: 14, textAlign: "center",
              background: "rgba(16,185,129,0.14)", border: "1px solid rgba(110,231,183,0.3)",
              fontSize: 13, fontWeight: 800, color: "#6ee7b7",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}>
              درخواست در {src.label}
              <ExternalLink size={13} />
            </div>
          </ExternalLinkGuard>
        )}
        <button
          onClick={() => setSaved(!saved)}
          style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: saved ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${saved ? "rgba(110,231,183,0.4)" : "rgba(110,231,183,0.12)"}`,
            cursor: "pointer", display: "grid", placeItems: "center",
          }}
        >
          <Bookmark size={16} color={saved ? "#6ee7b7" : "rgba(232,239,234,0.5)"} fill={saved ? "#6ee7b7" : "none"} />
        </button>
      </div>
    </div>
  );
}

export default function MatchedJobs({ limit = 3, userSkills = [] }: { limit?: number; userSkills?: string[] }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [remote, setRemote] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit) });
    if (search) params.set("q", search);
    if (remote) params.set("remote", "true");

    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, search, remote]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchJobs, search]);

  const handleFilterClick = (i: number) => {
    setActiveFilter(i);
    if (i === 1) setRemote(!remote);
    else if (i !== 1) setRemote(false);
  };

  return (
    <div style={{ padding: "16px 20px", maxWidth: 448, margin: "0 auto" }}>

      {/* Stats banner */}
      {!loading && jobs.length > 0 && (
        <div style={{
          padding: "12px 14px", borderRadius: 14, marginBottom: 14,
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(110,231,183,0.22)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: "rgba(16,185,129,0.18)", display: "grid", placeItems: "center",
          }}>
            <span style={{ fontSize: 16 }}>🎯</span>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: "rgba(232,239,234,0.8)", lineHeight: 1.55 }}>
            <strong style={{ color: "#6ee7b7" }}>{jobs.length} شغل</strong>
            {" "}پیدا شد — بر اساس مهارت، تجربه و شهر.
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{
        padding: "12px 14px", borderRadius: 14, marginBottom: 10,
        background: "rgba(31,46,40,0.55)", border: "1px solid rgba(110,231,183,0.16)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Search size={16} color="rgba(110,231,183,0.7)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در شغل‌ها…"
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 13, color: "#e8efea", fontFamily: "inherit", caretColor: "#34d399",
          }}
        />
      </div>

      {/* Filter chips — horizontal scroll */}
      <div className="h-scroll-free" style={{
        display: "flex", gap: 7, marginBottom: 14,
      }}>
        {FILTERS.map((f, i) => (
          <button
            key={i}
            onClick={() => handleFilterClick(i)}
            style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 999,
              background: activeFilter === i ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeFilter === i ? "rgba(110,231,183,0.4)" : "rgba(110,231,183,0.12)"}`,
              fontSize: 11.5, fontWeight: 700,
              color: activeFilter === i ? "#6ee7b7" : "rgba(232,239,234,0.7)",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {i === 0 && (
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: activeFilter === 0 ? "#6ee7b7" : "rgba(110,231,183,0.4)" }} />
            )}
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonList count={4} />
      ) : jobs.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jobs.map((job, idx) => (
            <JobCard
              key={job.id}
              job={job}
              rank={idx}
              userSkills={userSkills}
              onSelect={() => setSelectedJob(job)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          padding: "40px 20px", borderRadius: 16, textAlign: "center",
          background: "rgba(31,46,40,0.4)", border: "1px solid rgba(110,231,183,0.08)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
            {search || remote ? "نتیجه‌ای پیدا نشد" : "به زودی شغل‌ها اینجان"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(232,239,234,0.5)", lineHeight: 1.7 }}>
            {search || remote
              ? "فیلترها رو تغییر بده یا جستجو رو پاک کن"
              : "داریم شغل‌های مناسب مسیرت رو جمع‌آوری می‌کنیم."}
          </div>
        </div>
      )}

      {/* Job Detail Sheet */}
      <BottomSheet open={!!selectedJob} onClose={() => setSelectedJob(null)} maxHeight="90dvh">
        {selectedJob && (
          <JobDetailSheet job={selectedJob} userSkills={userSkills} onClose={() => setSelectedJob(null)} />
        )}
      </BottomSheet>
    </div>
  );
}

function MatchGauge({ pct, size = 44 }: { pct: number; size?: number }) {
  const r = size * 0.41;
  const circ = 2 * Math.PI * r;
  const color = pct >= 85 ? "#34d399" : pct >= 70 ? "#fcd34d" : "#c4b5fd";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.09} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={size * 0.09} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "monospace", fontSize: size * 0.25, fontWeight: 800, color,
      }}>
        {pct}
      </div>
    </div>
  );
}

function JobCard({
  job, rank, userSkills, onSelect,
}: {
  job: Job; rank: number; userSkills: string[]; onSelect: () => void;
}) {
  const src = SOURCES[job.source] ?? { label: job.source };
  const timeAgo = job.posted_at ? new Date(job.posted_at).toLocaleDateString("fa-IR") : "";
  const matchPct = calcMatchPct(job.skills ?? [], userSkills);

  return (
    <article
      onClick={onSelect}
      style={{
        padding: 14, borderRadius: 16, cursor: "pointer",
        background: "linear-gradient(180deg, rgba(31,46,40,0.6) 0%, rgba(18,30,24,0.5) 100%)",
        border: "1px solid rgba(110,231,183,0.14)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Company logo */}
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.1))",
          border: "1px solid rgba(110,231,183,0.3)",
          display: "grid", placeItems: "center",
          fontWeight: 900, fontSize: 18, color: "#6ee7b7",
        }}>
          {job.company?.charAt(0) ?? "؟"}
        </div>

        {/* Title + company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.4, color: "#e8efea" }}>{job.title}</div>
          <div style={{
            fontSize: 11.5, color: "rgba(232,239,234,0.6)", marginTop: 3,
            display: "flex", gap: 6, alignItems: "center",
          }}>
            <span style={{ color: "#e8efea", fontWeight: 700 }}>{job.company}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(232,239,234,0.3)" }} />
            <span>{src.label}</span>
          </div>
        </div>

        {/* Match gauge — only shown when real data available */}
        {matchPct !== null && <MatchGauge pct={matchPct} />}
      </div>

      {/* Meta row */}
      <div style={{
        marginTop: 12, paddingTop: 12,
        borderTop: "1px solid rgba(110,231,183,0.08)",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {job.location && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(232,239,234,0.55)" }}>
            <MapPin size={11} color="rgba(110,231,183,0.6)" />
            {job.location}
          </span>
        )}
        {job.is_remote && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6ee7b7", fontWeight: 600 }}>
            <Wifi size={11} color="#6ee7b7" />
            دورکاری
          </span>
        )}
        {timeAgo && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(232,239,234,0.45)" }}>
            <Clock size={11} />
            {timeAgo}
          </span>
        )}
        {/* Tap hint */}
        <span style={{ marginRight: "auto", fontSize: 10, color: "rgba(110,231,183,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
          جزئیات ←
        </span>
      </div>

      {/* Skills preview */}
      {job.skills?.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {job.skills.slice(0, 4).map((t) => (
            <span key={t} style={{
              padding: "3px 8px", borderRadius: 6,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(110,231,183,0.14)",
              fontSize: 10.5, color: "rgba(232,239,234,0.65)", fontWeight: 600,
            }}>{t}</span>
          ))}
          {job.skills.length > 4 && (
            <span style={{
              padding: "3px 8px", borderRadius: 6,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(110,231,183,0.07)",
              fontSize: 10.5, color: "rgba(232,239,234,0.3)", fontWeight: 600,
            }}>+{job.skills.length - 4}</span>
          )}
        </div>
      )}
    </article>
  );
}
