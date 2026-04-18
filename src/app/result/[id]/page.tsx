"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ─── AdSense Component ────────────────────────────────────────────────────────
function AdSenseMainBlock() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 px-6 overflow-hidden flex justify-center min-h-[100px] items-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client="ca-pub-8517681264003887"
        data-ad-slot="9446465008"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans pt-[68px]">

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
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
            SEO Audit for{" "}
            <span className="text-indigo-600">{domain}</span>
          </h1>
          <p className="text-slate-500 text-lg">
            We scanned{" "}
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">
              {data.url}
            </a>{" "}
            and found {errorCount} critical issue{errorCount !== 1 ? "s" : ""} and {warnCount} warning{warnCount !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* ── Top Row: Score + Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* Score Card */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8 flex flex-col items-center justify-center">
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

        {/* ── Ad Content Layer for AdSense ── */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Why SEO Matters for Your Shopify Store</h3>
          <p className="text-slate-600 leading-relaxed">
            Search Engine Optimization is the most cost-effective way to grow your brand. Unlike paid ads, organic traffic continues to flow even after you stop investing.
            This detailed report identifies technical hurdles that might be preventing your store from reaching its full potential.
          </p>
        </div>

        {/* ── Main AdSense Block ────────────────────────────────────────────── */}
        <AdSenseMainBlock />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Issues List ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Visible Issues */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8">
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
                        <div className="text-center bg-white/95 border border-indigo-200 rounded-[2rem] p-8 shadow-2xl w-full max-w-md mx-4">
                          <span className="text-3xl mb-4 block">🔒</span>
                          <p className="text-lg font-bold text-slate-800 mb-2">
                            {lockedIssues.length} Technical Checks Locked
                          </p>
                          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Join 5,000+ store owners who get detailed insights into speed, image optimization, and mobile readiness.
                          </p>
                          <form onSubmit={handleUnlock} className="space-y-3">
                            <input
                              type="email"
                              placeholder="Enter your email"
                              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              suppressHydrationWarning
                            />
                            <button
                              type="submit"
                              suppressHydrationWarning
                              className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                            >
                              Unlock Full Report Now
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
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-xl">💡</span> Primary Recommendations
              </h2>
              <div className="space-y-5">
                {data.issues.filter(i => i.type !== "ok").slice(0, 4).map((issue, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{issue.label}</p>
                      {issue.detail && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{issue.detail}</p>}
                    </div>
                  </div>
                ))}
                {data.issues.filter(i => i.type !== "ok").length === 0 && (
                  <p className="text-sm text-emerald-600 font-medium p-4 bg-emerald-50 rounded-2xl border border-emerald-100">🎉 Excellent! Your store follows all major Shopify SEO best practices.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Page Info */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-6">
              <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">Technical Metadata</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Page Title</p>
                  <p className="text-sm text-slate-800 font-bold leading-snug">{data.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Meta Description</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{data.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-50">
                  {[
                    { label: "H1", value: data.h1Count },
                    { label: "H2", value: data.h2Count },
                    { label: "H3", value: data.h3Count },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                      <p className="text-xl font-black text-indigo-700">{value}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keywords */}
            {data.topKeywords.length > 0 && (
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-6">
                <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">Keyword Analysis</h3>
                <div className="flex flex-wrap gap-2">
                  {data.topKeywords.slice(0, 10).map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl transition-all hover:scale-105"
                      style={{
                        background: `hsl(${250 - i * 5}, 90%, 97%)`,
                        color: `hsl(${250 - i * 5}, 70%, 40%)`,
                        border: `1px solid hsl(${250 - i * 5}, 70%, 90%)`,
                      }}
                    >
                      {kw.word}
                      <span className="opacity-40 font-black">×{kw.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services CTA */}
            <div
              className="rounded-[2rem] p-8 relative overflow-hidden text-white shadow-2xl shadow-indigo-200"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <p className="text-2xl font-black mb-3 leading-tight text-white">Need a Hand? 🛠️</p>
                <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">
                  Don&apos;t spend hours trying to fix these. Let our Shopify SEO experts handle the technical side for you.
                </p>
                <div className="space-y-3">
                  <a
                    href="https://www.fiverr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-4 rounded-2xl bg-white text-indigo-600 text-sm font-black text-center hover:bg-slate-50 transition-all shadow-xl"
                  >
                    Fix My SEO Issues — $99
                  </a>
                  <a
                    href="https://wa.me/03082762326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-all"
                  >
                    <span>💬</span> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="mt-16 text-center py-20 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-black/30" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-8 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 px-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Rank Higher. Sell More.
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              We&apos;ve helped over 2,000 Shopify stores achieve search engine success. Are you ready to be next?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="https://www.fiverr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 rounded-full font-black text-indigo-900 bg-white hover:bg-indigo-50 text-base shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                🔍 Full Store Optimization — $149
              </a>
              <Link
                href="/"
                className="px-10 py-5 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 text-base transition-all"
              >
                Scan Another URL
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating WhatsApp (Hidden for results if redundant with CTA) ── */}
    </div>
  );
}

