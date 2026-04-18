"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ─── AdSense Component ────────────────────────────────────────────────────────
function AdSenseBlock({ slot }: { slot: string }) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only push if the script is loaded and the element hasn't been initialized
    if (typeof window !== "undefined" && adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-6 overflow-hidden flex justify-center min-h-[100px] items-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client="ca-pub-8517681264003887"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

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
  const circ = 2 * Math.PI * r; 
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
      if (id) {
        router.push(`/result/${id}`);
        return;
      }
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
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-[68px]">
      
      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
            style={{ background: "linear-gradient(135deg, #ede9fe, #faf5ff)", borderColor: "#d8b4fe", color: "#7c3aed" }}>
            <span>⚡</span> Free Shopify SEO Analyzer Tool
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8 text-slate-900">
            Improve Your Store Ranking with <span className="text-indigo-600">Free Analysis</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-4 font-medium">
            If you own a Shopify store, optimizing your SEO is essential to rank higher on Google and drive more organic traffic.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed text-center">
            <p>
              Our free Shopify SEO Analyzer tool helps you quickly evaluate your store’s SEO performance, identify issues, and discover actionable improvements. 
              Whether you&apos;re a beginner or an experienced store owner, this tool provides valuable insights to boost your visibility and increase sales.
            </p>
          </div>
        </div>
      </section>

      {/* AD PLACEMENT 1 */}
      <AdSenseBlock slot="9446465008" />

      {/* Tool Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100">
            <form onSubmit={handleScan} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row bg-slate-50 rounded-2xl sm:rounded-full border border-slate-200 p-2 transition-all focus-within:ring-4 focus-within:ring-indigo-100">
                <div className="flex items-center flex-1 px-4 py-3">
                  <svg className="text-slate-400 mr-3 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="yourstore.myshopify.com"
                    className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none font-medium text-base"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    id="url-input"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="px-8 py-4 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-400/30"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Scanning...
                    </span>
                  ) : (
                    <>Analyze Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg></>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium animate-shake">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">How to Use the Shopify SEO Analyzer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { step: "1", title: "Enter URL", text: "Enter your Shopify store URL in the input box above." },
              { step: "2", title: "Analyze", text: "Click the “Analyze” button to start the scan." },
              { step: "3", title: "Wait", text: "Wait a few seconds while we scan your entire store structure." },
              { step: "4", title: "Review", text: "Review your detailed SEO score and actionable recommendations." }
            ].map((s) => (
              <div key={s.step} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-slate-500 italic">
            The tool will analyze key SEO factors such as meta tags, page speed, headings, and overall structure.
          </p>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section ref={resultRef} className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="animate-slide-up bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-200">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-slate-900">Your SEO Report</h2>
                <p className="text-slate-500 mt-2 text-sm truncate">Scanned: {url}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Overall SEO Score</h3>
                  <ScoreCircle score={result.score ?? 0} size={140} />
                </div>

                {/* Issues List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">SEO Issues & Checks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {!unlocked && (
                    <div className="mt-8 p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 text-center relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-lg font-bold text-slate-900 mb-2">🔒 Unlock 15+ More Checks</p>
                        <p className="text-slate-600 mb-6 text-sm">Enter your email to unlock technical speed analysis, image audit, and schema validation.</p>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                          <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 px-5 py-3 rounded-2xl border border-indigo-200 outline-none focus:ring-4 focus:ring-indigo-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <button type="submit" className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">
                            Unlock Now
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Understanding Your Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Understanding Your SEO Results</h2>
          <div className="prose prose-slate max-w-none text-lg text-slate-600">
            <p className="mb-6 font-medium">
              After analyzing your store, you’ll receive a detailed report highlighting strengths and weaknesses. 
              Our engine evaluates your store against Google&apos;s latest ranking algorithms specifically for e-commerce.
            </p>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              {[
                { label: "Meta titles and descriptions", icon: "📝" },
                { label: "Heading structure (H1, H2, etc.)", icon: "🏗️" },
                { label: "Image alt tag optimization", icon: "🖼️" },
                { label: "Page speed performance", icon: "⚡" },
                { label: "Mobile responsiveness", icon: "📱" },
                { label: "Schema markup validation", icon: "🔍" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 text-slate-700 font-semibold">
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
            <p className="mt-8 font-medium">
              Use these insights to improve your store step by step and achieve better rankings. 
              Small changes in your heading structure or meta data can lead to significant jumps in your search position.
            </p>
          </div>
        </div>
      </section>

      {/* Shopify SEO Guide Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">Shopify SEO Best Practices</h2>
          <div className="space-y-12">
            {[
              { num: "01", title: "Optimize Product Titles", text: "Use clear, keyword-rich titles that match what users are searching for. Avoid fluff and put important keywords first." },
              { num: "02", title: "Write Unique Descriptions", text: "Avoid duplicate content. Write detailed and engaging product descriptions that solve customer problems." },
              { num: "03", title: "Improve Site Speed", text: "Fast-loading websites rank better and provide a better user experience. Compress images and limit heavy apps." },
              { num: "04", title: "Use Proper Heading Structure", text: "Ensure each page has one H1 and well-organized subheadings. This helps search engines understand your content hierarchy." },
              { num: "05", title: "Optimize Images", text: "Compress images and use descriptive ALT tags. Google Images can be a huge source of traffic for Shopify stores." },
              { num: "06", title: "Build Backlinks", text: "Get links from reputable websites to increase your domain authority. Guest posting and collaborations are key." }
            ].map((tip) => (
              <div key={tip.num} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="text-6xl font-black text-white/10 shrink-0">{tip.num}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-indigo-400">{tip.title}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
            <p className="text-xl text-white/80 font-medium">
              By consistently applying these techniques, your Shopify store can achieve long-term SEO success and consistent organic traffic.
            </p>
          </div>
        </div>
      </section>

      {/* AD PLACEMENT 2 */}
      <AdSenseBlock slot="9446465008" />

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Is this Shopify SEO analyzer free?", a: "Yes, our tool is completely free to use. We offer a basic scan for everyone and a full report for those who want deeper insights." },
              { q: "Do I need technical knowledge?", a: "No, the tool is designed for beginners. We translate complex SEO metrics into easy-to-understand recommendations with clear action steps." },
              { q: "How often should I check my SEO?", a: "We recommend analyzing your store at least once a month. Search algorithms and your content change, so consistent monitoring is key." },
              { q: "Can this tool improve my rankings?", a: "The tool provides the roadmap (recommendations), but applying those changes is what will actually improve your rankings." }
            ].map((faq, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0">Q</span>
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed md:pl-12">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-16 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-2">Ready to rank your store?</h2>
            <p className="text-indigo-100 text-lg">Join 5,000+ merchants using our free analysis tools.</p>
          </div>
          <button 
            onClick={() => { document.getElementById("url-input")?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="px-10 py-4 rounded-full bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl whitespace-nowrap"
          >
            Start Free Scan
          </button>
        </div>
      </section>

    </div>
  );
}
