import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div
            className="absolute inset-0 rounded-full opacity-20 animate-pulse"
            style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
          />
          <div className="relative w-full h-full rounded-full border-4 border-dashed border-indigo-200 flex items-center justify-center">
            <span
              className="text-5xl font-black"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, or the SEO report
          has expired. Reports are stored per session — run a new scan to get
          fresh results.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full font-bold text-white text-sm shadow-lg shadow-indigo-300/40 hover:opacity-90 transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            🔍 Run a Free SEO Scan
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full font-bold text-slate-600 border border-slate-200 text-sm hover:bg-slate-50 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
