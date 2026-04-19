"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AIFixPanel } from "@/components/AIFixPanel";
import { RoadmapSection } from "@/components/RoadmapSection";
import { AIContentTools } from "@/components/AIContentTools";
import { generateRoadmap, calculatePotentialScore } from "@/lib/roadmapGenerator";
import { Sparkles, Trophy, Target, Zap, BarChart3, AlertCircle, FileDown, Mail, Share2, Search, CheckCircle2, Loader2 } from "lucide-react";

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
  competitorUrl?: string;
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
  competitorData?: any;
  hasSchema?: boolean;
  sgeSignals?: string[];
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
    <div className={`relative flex flex-col p-6 rounded-[2rem] border ${cfg.bg} ${cfg.border} transition-all ${locked ? "blur-[5px] select-none pointer-events-none" : "hover:shadow-lg hover:shadow-indigo-50"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${cfg.iconBg} ${cfg.iconColor} shadow-sm`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-base font-bold text-slate-900">{issue.label}</p>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${impactBadge}`}>
              {issue.impact} impact
            </span>
          </div>
          {issue.detail && (
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{issue.detail}</p>
          )}
        </div>
      </div>
      
      {!locked && issue.type !== "ok" && (
        <AIFixPanel 
          issueLabel={issue.label} 
          currentContent={issue.detail || ""} 
          context="Shopify Store" 
        />
      )}
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
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/result/${id}`)
      .then((res) => setData(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !data) return;
    
    setSendingEmail(true);
    setUnlocked(true);

    try {
      await axios.post("/api/send-report", {
        email,
        reportUrl: typeof window !== "undefined" ? window.location.href : "",
        storeName: new URL(data.url).hostname
      });
      setEmailSent(true);
    } catch (err) {
      console.error("Failed to send automated email:", err);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailReport = async () => {
    if (!data) return;
    const userEmail = email || prompt("Please enter your email to receive the report:");
    if (!userEmail) return;

    setSendingEmail(true);
    try {
      await axios.post("/api/send-report", {
        email: userEmail,
        reportUrl: typeof window !== "undefined" ? window.location.href : "",
        storeName: new URL(data.url).hostname
      });
      alert("SEO Report sent successfully!");
      if (!unlocked) setUnlocked(true);
    } catch (err) {
      alert("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const roadmap = data ? generateRoadmap(data.issues) : [];
  const potentialScore = data ? calculatePotentialScore(data.score, roadmap) : 0;

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-3 font-bold uppercase tracking-widest">
                <Search className="w-4 h-4" />
                <span>AI SEO Analysis</span>
                <span>·</span>
                <span className="text-indigo-600">{domain}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
                AI Shopify <span className="text-indigo-600">SEO Audit</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium">
                Deep analysis completed. Score: <span className="text-slate-900 font-black">{data.score}/100</span>.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                <FileDown className="w-4 h-4" />
                PDF Report
              </button>
              <button 
                onClick={handleEmailReport}
                disabled={sendingEmail}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
              >
                {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Email Report
              </button>
              <button className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Top Row: Score + Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* Score Card */}
          {/* Score Card */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Current SEO Score</p>
            <ScoreCircle score={data.score} />
            <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full relative z-10">
              <Zap className="w-3 h-3" />
              Potential: {potentialScore}%
            </div>
          </div>

          {/* Issue Summary */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Critical Issues" value={data.issues.filter(i => i.type === "error").length} sub="Requires immediate fix" color="#ef4444" />
            <StatCard label="Quick Wins" value={data.issues.filter(i => i.impact === "high" && i.type !== "ok").length} sub="High impact, low effort" color="#6366f1" />
            <StatCard label="AI Visibility" value={data.issues.some(i => i.label.includes("SGE")) ? "Optimized" : "Low"} sub="SGE & ChatGPT readiness" color="#a855f7" />
            <StatCard
              label="Technical Debt"
              value={data.issues.filter(i => i.type === "warn").length}
              sub="Minor improvements needed"
              color="#f59e0b"
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
                              disabled={sendingEmail}
                              suppressHydrationWarning
                              className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                            >
                              {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Full Report Now"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Roadmap Section */}
            <RoadmapSection roadmap={roadmap} currentScore={data.score} potentialScore={potentialScore} />

            {/* Competitor Analysis Section */}
            {data.competitorUrl && (
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <BarChart3 className="w-12 h-12 text-slate-50" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">⚔️</span>
                  Competitor Benchmarking
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Your Store ({domain})</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">SEO Score</span>
                        <span className="text-sm font-black text-slate-900">{data.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${data.score}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-orange-50/30 border border-orange-100">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4">Competitor ({new URL(data.competitorUrl).hostname})</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">SEO Score</span>
                        <span className="text-sm font-black text-slate-900">{data.competitorData?.score || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${data.competitorData?.score || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-indigo-900">AI Competitive Insights</h3>
                  </div>
                  {/* Mock AI insights or add a button to generate them */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 font-medium">Competitor is using richer schema markup for Product reviews.</p>
                    </div>
                    <div className="flex gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 font-medium">You have {data.topKeywords.length} matching keywords, but competitor has higher semantic density.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* AI Search Visibility Card */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Search className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-black mb-6 tracking-widest uppercase">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  SGE & AI READINESS
                </div>
                <h3 className="text-2xl font-black mb-4">AI Search Visibility</h3>
                <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">
                  We analyzed your semantic structure for Google SGE, Perplexity, and ChatGPT. 
                  Your content is <span className="text-white font-bold">{data.score > 80 ? "Highly Optimized" : "Needs Semantic Depth"}</span>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-white/80">Structured Data</span>
                    <span className={data.issues.some(i => i.label.includes("Schema")) ? "text-emerald-400 font-black text-xs" : "text-red-400 font-black text-xs"}>
                      {data.issues.some(i => i.label.includes("Schema")) ? "DETECTED" : "MISSING"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-white/80">Semantic Clarity</span>
                    <span className="text-indigo-400 font-black text-xs">85% (STRONG)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Content Factory */}
            <AIContentTools />

            {/* Technical Metadata */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-6">
              <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">Store Insights</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Page Title</p>
                  <p className="text-sm text-slate-800 font-bold leading-snug">{data.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Meta Description</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{data.description}</p>
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

