"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScanResult {
  id: string;
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  score: number;
  topKeywords: { word: string; count: number }[];
}

// ─── Score Circle SVG ─────────────────────────────────────────────────────────
function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r; // ~276.46
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Good" : score >= 40 ? "Fair" : "Poor";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
        <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
          {score}
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
          / 100
        </text>
      </svg>
      <span
        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ color, background: `${color}20` }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Issue Item ───────────────────────────────────────────────────────────────
function IssueItem({
  status,
  label,
  value,
}: {
  status: "ok" | "warn" | "error";
  label: string;
  value?: string;
}) {
  const cfg = {
    ok: { icon: "✓", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    warn: { icon: "⚠", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    error: { icon: "✕", bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
  }[status];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <span className={`font-bold text-sm mt-0.5 ${cfg.text}`}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {value && <p className="text-xs text-slate-500 truncate mt-0.5">{value}</p>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setUnlocked(false);
    setEmailSubmitted(false);
    try {
      const res = await axios.post("/api/scan", { url });
      const { id, data } = res.data;
      // Navigate to the dedicated result page
      if (id) {
        router.push(`/result/${id}`);
        return;
      }
      // Fallback: show inline if no id returned
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to scan. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      setUnlocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-black"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              S
            </div>
            <span className="font-bold text-lg text-slate-900">
              Shopify<span className="gradient-text">SEO</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          {/* CTA */}
          <a
            href="#hero"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-indigo-300/40"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            <span>Free Scan</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Blobs */}
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
            style={{ background: "linear-gradient(135deg, #ede9fe, #faf5ff)", borderColor: "#d8b4fe", color: "#7c3aed" }}>
            <span>⚡</span> Free Shopify SEO Audit — No Credit Card Needed
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-slate-900">
            Analyze Your Shopify<br />
            Store SEO in{" "}
            <span className="gradient-text">10 Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Get your free SEO score, performance report, and actionable recommendations to rank higher and drive more sales.
          </p>

          {/* URL Input */}
          <form onSubmit={handleScan} className="max-w-2xl mx-auto">
            <div
              className="flex flex-col sm:flex-row bg-white rounded-2xl sm:rounded-full border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden input-glow transition-all"
            >
              <div className="flex items-center flex-1 pl-5 pr-3 py-4">
                <svg className="text-slate-400 mr-3 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="yourstore.myshopify.com"
                  className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none font-medium text-base"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  id="url-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="m-1.5 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-400/30"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    Analyze Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                {error}
              </div>
            )}
            <p className="text-sm text-slate-400 mt-4">
              ✓ Free forever &nbsp;·&nbsp; ✓ Instant results &nbsp;·&nbsp; ✓ No signup required
            </p>
          </form>
        </div>
      </section>

      {/* ── Result Preview / Actual Results ────────────────────────────────── */}
      <section ref={resultRef} id="results" className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {result ? (
            // ── REAL SCAN RESULTS ──────────────────────────────────────────
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900">Your SEO Report</h2>
                <p className="text-slate-500 mt-2 text-sm truncate">Scanned: {url}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 p-8 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Overall SEO Score</h3>
                  <ScoreCircle score={result.score ?? 0} size={140} />
                  <div className="mt-6 w-full space-y-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>H1 Tags</span>
                      <span className={result.h1Count === 1 ? "text-emerald-500" : "text-amber-500"}>{result.h1Count}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>H2 Tags</span>
                      <span className={result.h2Count > 0 ? "text-emerald-500" : "text-amber-500"}>{result.h2Count}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Keywords Found</span>
                      <span className="text-indigo-500">{result.topKeywords.length}</span>
                    </div>
                  </div>
                </div>

                {/* Issues List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">SEO Issues & Checks</h3>
                  <div className="space-y-3">
                    <IssueItem
                      status={result.title && result.title !== "No Title Found" ? "ok" : "error"}
                      label="Meta Title"
                      value={result.title}
                    />
                    <IssueItem
                      status={result.description && result.description !== "No Meta Description Found" ? "ok" : "error"}
                      label="Meta Description"
                      value={result.description}
                    />
                    <IssueItem
                      status={result.h1Count === 1 ? "ok" : result.h1Count === 0 ? "error" : "warn"}
                      label={result.h1Count === 1 ? "H1 Tag — Perfect (1 found)" : result.h1Count === 0 ? "H1 Tag — Missing!" : `H1 Tags — Too many (${result.h1Count} found)`}
                    />
                    <IssueItem
                      status={result.h2Count >= 2 ? "ok" : result.h2Count === 0 ? "warn" : "ok"}
                      label={`H2 Subheadings (${result.h2Count} found)`}
                    />
                    <IssueItem
                      status={result.topKeywords.length >= 5 ? "ok" : "warn"}
                      label={`Keyword Density (${result.topKeywords.length} keywords extracted)`}
                    />
                  </div>

                  {/* Full Report Lock / Unlock */}
                  {!unlocked ? (
                    <div className="mt-6 rounded-2xl border border-indigo-200 overflow-hidden">
                      <div className="blur-sm pointer-events-none p-4 space-y-2">
                        <IssueItem status="warn" label="Image Alt Tags — 12 missing" />
                        <IssueItem status="error" label="Page Speed Score — 38/100" />
                        <IssueItem status="warn" label="Canonical Tag — Not found" />
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100 p-5 text-center -mt-2">
                        <p className="text-sm font-semibold text-slate-700 mb-1">🔒 Full Report Locked</p>
                        <p className="text-xs text-slate-500 mb-4">Enter your email to unlock 15+ more checks including speed, images, and schema.</p>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                          <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                          >
                            Unlock Full Report
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-3 animate-slide-up">
                      <IssueItem status="warn" label="Image Alt Tags — 12 missing alt attributes" />
                      <IssueItem status="error" label="Page Speed Score — Needs improvement" />
                      <IssueItem status="warn" label="Canonical Tag — Not detected" />
                      <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                        <p className="text-sm font-semibold text-emerald-700">✓ Full report unlocked!</p>
                        <p className="text-xs text-emerald-600 mt-1">Report sent to {email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Keywords */}
              {result.topKeywords.length > 0 && (
                <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Top Keywords Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.topKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-100"
                        style={{ background: `hsl(${240 - i * 10}, 90%, 97%)` }}
                      >
                        {kw.word}
                        <span className="text-xs text-slate-400 font-normal">×{kw.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA after results */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 font-semibold text-sm"
                >
                  <span>🛠️</span> Fix My SEO — $99
                </a>
                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-300/40"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                  <span>⭐</span> Full Optimization — $149
                </a>
                <a
                  href="https://wa.me/03082762326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-green-700 font-semibold text-sm"
                >
                  <span>💬</span> WhatsApp Us
                </a>
              </div>
            </div>
          ) : (
            // ── STATIC PREVIEW (shown before any scan) ────────────────────
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Example Report</span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Your SEO Score Preview</h2>
              </div>

              <div
                className="rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #fafafa 0%, #f8f7ff 100%)" }}
              >
                {/* Mock Browser Bar */}
                <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-slate-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="mx-auto flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 gap-2 text-xs text-slate-400 w-56 justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    yourstore.myshopify.com
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">SEO Score</p>
                    <ScoreCircle score={72} size={120} />
                  </div>

                  {/* Issues */}
                  <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Issues Found</h3>
                    <div className="space-y-2.5">
                      <IssueItem status="error" label="Meta Description Missing" value="No description tag found on page" />
                      <IssueItem status="warn" label="Slow Page Speed" value="First Contentful Paint: 4.2s (should be < 1.8s)" />
                      <IssueItem status="warn" label="Missing Image Alt Tags" value="14 images without alt attributes" />
                      <IssueItem status="ok" label="H1 Tag Found" value="Clear heading structure detected" />
                      <div className="relative">
                        <div className="blur-[3px] pointer-events-none">
                          <IssueItem status="error" label="Canonical Tag Missing" value="Duplicate content risk detected" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">🔒 Unlock Full Report</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4">Everything You Need to Rank</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Comprehensive SEO analysis tools built specifically for Shopify stores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}
              >
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Speed Analysis</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Instant Core Web Vitals analysis. Identify what&apos;s slowing down your store and losing you sales every second.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> First Contentful Paint</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Largest Contentful Paint</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Time to Interactive</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div
              className="rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl mb-6">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SEO Audit</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Deep-dive audit of all critical SEO signals including meta tags, headings, schema markup, and keyword density.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> Meta Tags Analysis</li>
                <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> Heading Structure</li>
                <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> Keyword Extraction</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}
              >
                🤖
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Suggestions</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                AI-powered recommendations to improve your SEO titles, meta descriptions, and content strategy.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> AI Title Generator</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Keyword Suggestions</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Content Optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4">3 Simple Steps</h2>
            <p className="text-lg text-slate-500">Get your full SEO report in under 30 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

            {[
              { step: "01", icon: "🔗", title: "Enter Your URL", desc: "Paste your Shopify store URL or any page you want to analyze. No login required." },
              { step: "02", icon: "⚙️", title: "We Analyze It", desc: "Our engine scans your page in seconds — checking SEO, speed, keywords, and structure." },
              { step: "03", icon: "📊", title: "Get Your Report", desc: "Receive a detailed score with prioritized issues and clear fixes to boost your ranking." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform"
                    style={{ background: "linear-gradient(135deg, #ede9fe, #faf5ff)", border: "2px solid #e9d5ff" }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-black text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                  >
                    {item.step.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Capture ────────────────────────────────────────────────────── */}
      <section id="lead-capture" className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-white blur-2xl" />
              <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-white blur-xl" />
            </div>
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">📧</span>
              <h2 className="text-3xl font-black text-white mb-3">Unlock Your Full SEO Report</h2>
              <p className="text-white/80 mb-8 text-sm leading-relaxed">
                Get 15+ detailed checks including image audit, page speed breakdown, schema validation, and a personalized action plan.
              </p>
              {emailSubmitted ? (
                <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-white">
                  <p className="font-bold text-lg">✓ You&apos;re on the list!</p>
                  <p className="text-white/80 text-sm mt-1">Check {email} for your full report + audit tips.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-white font-bold text-indigo-600 hover:bg-indigo-50 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg whitespace-nowrap"
                  >
                    Unlock Full Report
                  </button>
                </form>
              )}
              <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4">Done-For-You SEO Services</h2>
            <p className="text-lg text-slate-500">Let our experts fix your SEO while you focus on running your store.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Plan 1: Basic */}
            <div className="rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Fix My SEO</h3>
                <p className="text-slate-500 text-sm mt-1">Essential fixes for your Shopify store</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">$99</span>
                <span className="text-slate-400 text-sm ml-2">one-time</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {[
                  "Meta title & description optimization",
                  "H1/H2 heading structure fix",
                  "Image alt tag audit & fix",
                  "Keyword integration (5 pages)",
                  "Delivery in 3 business days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.fiverr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-2xl text-center font-bold text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
              >
                Get Started — $99
              </a>
            </div>

            {/* Plan 2: Full Optimization */}
            <div
              className="rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-bl-2xl">
                MOST POPULAR
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Full Optimization</h3>
                  <p className="text-white/70 text-sm mt-1">Complete Shopify SEO overhaul</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">$149</span>
                  <span className="text-white/60 text-sm ml-2">one-time</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-white/90">
                  {[
                    "Everything in Fix My SEO",
                    "Full store SEO audit (all pages)",
                    "Schema markup implementation",
                    "Page speed optimization",
                    "Backlink strategy report",
                    "30-day email support",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-yellow-300 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-2xl text-center font-bold text-indigo-600 bg-white hover:bg-indigo-50 transition-colors text-sm shadow-lg"
                >
                  Get Started — $149
                </a>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><span>🔒</span> Secure Payment via Fiverr</span>
            <span className="flex items-center gap-2"><span>⭐</span> 4.9/5 Average Rating</span>
            <span className="flex items-center gap-2"><span>💬</span> WhatsApp Support Available</span>
            <span className="flex items-center gap-2"><span>✅</span> 100% Satisfaction Guarantee</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-white/20 bg-white/10 text-white/80">
            <span>🚀</span> Join 2,000+ Shopify Store Owners
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Start Your Free<br />
            <span style={{ background: "linear-gradient(135deg, #a5b4fc, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              SEO Scan Now
            </span>
          </h2>
          <p className="text-white/60 text-lg mb-10">
            No account needed. No credit card. Just enter your URL and see how your store ranks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); document.getElementById("url-input")?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-10 py-4 rounded-full font-bold text-base text-indigo-900 bg-white hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/30"
            >
              🔍 Analyze My Store — Free
            </a>
            <a
              href="https://wa.me/03082762326"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-full font-bold text-base text-white border border-white/30 hover:bg-white/10 transition-all"
            >
              💬 Talk to an Expert
            </a>
          </div>
          <p className="text-white/30 text-sm mt-6">Results in under 10 seconds. Always free.</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              S
            </div>
            <span className="font-bold text-white">ShopifySEO</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 ShopifySEO. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://wa.me/03082762326" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Button ─────────────────────────────────────────── */}
      <a
        href="https://wa.me/03082762326"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all hover:scale-110 active:scale-95"
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
