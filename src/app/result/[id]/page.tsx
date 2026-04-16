"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Issue {
  type: "ok" | "warn" | "error";
  label: string;
  detail?: string;
  impact: "high" | "medium" | "low";
}

interface ScanData {
  id: string;
  url: string;
  scannedAt: string;
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  imgMissingAlt: number;
  hasCanonical: boolean;
  hasViewport: boolean;
  topKeywords: { word: string; count: number }[];
  issues: Issue[];
  score: number;
}

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const grade =
    score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
  const label =
    score >= 70 ? "Good" : score >= 40 ? "Needs Work" : "Poor";

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 120 120">
        {/* Track */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
        />
        {/* Score number */}
        <text
          x="60" y="53"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill="#0f172a"
          fontFamily="var(--font-sans)"
        >
          {score}
        </text>
        <text
          x="60" y="68"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#94a3b8"
          fontFamily="var(--font-sans)"
        >
          / 100
        </text>
        {/* Grade */}
        <text
          x="60" y="85"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill={color}
          fontFamily="var(--font-sans)"
        >
          Grade {grade}
        </text>
      </svg>
      <span
        className="mt-1 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
        style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Issue Row ────────────────────────────────────────────────────────────────
function IssueRow({ issue, locked }: { issue: Issue; locked?: boolean }) {
  const cfg = {
    ok: { icon: "✓", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100", bg: "bg-emerald-50/50" },
    warn: { icon: "⚠", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100", bg: "bg-amber-50/50" },
    error: { icon: "✕", iconBg: "bg-red-100", iconColor: "text-red-600", border: "border-red-100", bg: "bg-red-50/50" },
  }[issue.type];

  const impactBadge = {
    high: "bg-red-100 text-red-600",
    medium: "bg-amber-100 text-amber-600",
    low: "bg-slate-100 text-slate-500",
  }[issue.impact];

  return (
    <div className={`relative flex items-start gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} transition-all ${locked ? "blur-[3px] select-none pointer-events-none" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${cfg.iconBg} ${cfg.iconColor}`}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800">{issue.label}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${impactBadge}`}>
            {issue.impact} impact
          </span>
        </div>
        {issue.detail && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{issue.detail}</p>
        )}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#6366f1" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [data, setData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/result/${id}`)
      .then((res) => setData(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const okCount = data?.issues.filter((i) => i.type === "ok").length ?? 0;
  const warnCount = data?.issues.filter((i) => i.type === "warn").length ?? 0;
  const errorCount = data?.issues.filter((i) => i.type === "error").length ?? 0;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setUnlocked(true); setEmailSent(true); }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your SEO report…</p>
        </div>
      </div>
    );
  }

  // ── Not Found ──────────────────────────────────────────────────────────────
  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Report Not Found</h1>
          <p className="text-slate-500 mb-8">
            This report may have expired (results are stored for the session). Run a new scan to generate a fresh report.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            ← Run a New Scan
          </Link>
        </div>
      </div>
    );
  }

  const domain = (() => { try { return new URL(data.url).hostname; } catch { return data.url; } })();
  const scannedDate = new Date(data.scannedAt).toLocaleString();

  // Issues split: show first 5 always, rest locked behind email
  const visibleIssues = data.issues.slice(0, 5);
  const lockedIssues = data.issues.slice(5);

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              S
            </div>
            <span className="font-bold text-slate-900">
              Shopify<span className="gradient-text">SEO</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              ← Scan another URL
            </Link>
            <a
              href="https://www.fiverr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              Get Expert Help
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <span>🔍 SEO Report</span>
            <span>·</span>
            <span className="text-slate-600 font-medium">{domain}</span>
            <span>·</span>
            <span>{scannedDate}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            SEO Audit for{" "}
            <span className="gradient-text">{domain}</span>
          </h1>
          <p className="text-slate-500">
            We scanned{" "}
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
              {data.url}
            </a>{" "}
            and found {errorCount} critical issue{errorCount !== 1 ? "s" : ""} and {warnCount} warning{warnCount !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* ── Top Row: Score + Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* Score Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Score</p>
            <ScoreCircle score={data.score} />
          </div>

          {/* Issue Summary */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Passed" value={okCount} sub="checks passed" color="#22c55e" />
            <StatCard label="Warnings" value={warnCount} sub="items to improve" color="#f59e0b" />
            <StatCard label="Errors" value={errorCount} sub="critical issues" color="#ef4444" />
            <StatCard
              label="Images w/o Alt"
              value={data.imgMissingAlt}
              sub={`of ${data.imgCount} total images`}
              color={data.imgMissingAlt > 0 ? "#f59e0b" : "#22c55e"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Issues List ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Visible Issues */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">✓</span>
                SEO Checks ({data.issues.length} total)
              </h2>
              <div className="space-y-3">
                {visibleIssues.map((issue, i) => (
                  <IssueRow key={i} issue={issue} />
                ))}
              </div>

              {/* Locked section */}
              {lockedIssues.length > 0 && (
                <div className="mt-4">
                  {unlocked ? (
                    <div className="space-y-3 animate-fade-in">
                      {lockedIssues.map((issue, i) => (
                        <IssueRow key={i} issue={issue} />
                      ))}
                      <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                        <p className="text-sm font-semibold text-emerald-700">
                          ✓ Full report unlocked — sent to {email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-3">
                      {/* Blurred preview */}
                      <div className="space-y-3 pointer-events-none">
                        {lockedIssues.slice(0, 2).map((issue, i) => (
                          <IssueRow key={i} issue={issue} locked />
                        ))}
                      </div>

                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white/95 border border-indigo-200 rounded-2xl p-5 shadow-lg w-full max-w-sm mx-4">
                          <span className="text-2xl mb-2 block">🔒</span>
                          <p className="text-sm font-bold text-slate-800 mb-1">
                            {lockedIssues.length} more checks locked
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            Enter your email to unlock the full report
                          </p>
                          <form onSubmit={handleUnlock} className="space-y-2">
                            <input
                              type="email"
                              placeholder="your@email.com"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                            <button
                              type="submit"
                              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                            >
                              Unlock Full Report →
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommendations Box */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="text-xl">💡</span> Top Recommendations
              </h2>
              <div className="space-y-4">
                {data.issues.filter(i => i.type !== "ok").slice(0, 4).map((issue, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{issue.label}</p>
                      {issue.detail && <p className="text-xs text-slate-500 mt-0.5">{issue.detail}</p>}
                    </div>
                  </div>
                ))}
                {data.issues.filter(i => i.type !== "ok").length === 0 && (
                  <p className="text-sm text-emerald-600 font-medium">🎉 Great job! No critical issues found.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Page Info */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Page Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title</p>
                  <p className="text-sm text-slate-700 font-medium leading-snug">{data.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{data.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  {[
                    { label: "H1", value: data.h1Count },
                    { label: "H2", value: data.h2Count },
                    { label: "H3", value: data.h3Count },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-slate-50">
                      <p className="text-2xl font-black text-slate-800">{value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keywords */}
            {data.topKeywords.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Top Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {data.topKeywords.slice(0, 10).map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        background: `hsl(${260 - i * 8}, 85%, 96%)`,
                        color: `hsl(${260 - i * 8}, 60%, 45%)`,
                        border: `1px solid hsl(${260 - i * 8}, 60%, 88%)`,
                      }}
                    >
                      {kw.word}
                      <span className="opacity-60">×{kw.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services CTA */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <p className="text-lg font-black mb-2">Need a Fix? 🛠️</p>
                <p className="text-white/80 text-xs mb-5 leading-relaxed">
                  Let our Shopify SEO experts fix all these issues for you — fast.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://www.fiverr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-white text-indigo-600 text-sm font-bold text-center hover:bg-indigo-50 transition-all"
                  >
                    Fix My SEO — $99
                  </a>
                  <a
                    href="https://www.fiverr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold text-center hover:bg-white/30 transition-all"
                  >
                    Full Optimization — $149
                  </a>
                  <a
                    href="https://wa.me/03082762326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-white/20 text-white/80 text-xs font-semibold hover:bg-white/10 transition-all"
                  >
                    <span>💬</span> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Share This Report</h3>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-slate-50 outline-none"
                />
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="mt-12 text-center py-16 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-8 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Want These Issues Fixed?
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
              Our SEO experts will fix every issue on this report and boost your Shopify store rankings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.fiverr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full font-bold text-indigo-700 bg-white hover:bg-indigo-50 text-sm shadow-xl transition-all hover:scale-[1.02]"
              >
                🛠️ Fix My SEO — from $99
              </a>
              <Link
                href="/"
                className="px-8 py-3.5 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 text-sm transition-all"
              >
                🔍 Scan Another Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating WhatsApp ─────────────────────────────────────────────── */}
      <a
        href="https://wa.me/03082762326"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all hover:scale-110"
        title="Chat on WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.118 1.515 5.847L.057 23.884a.5.5 0 0 0 .61.61l6.037-1.458A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 0 1-5.074-1.383l-.364-.216-3.767.91.927-3.766-.236-.374A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </a>
    </div>
  );
}
