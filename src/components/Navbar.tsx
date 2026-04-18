import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-black"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            S
          </div>
          <span className="font-bold text-lg text-slate-900">
            Shopify<span className="text-indigo-600">SEO</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>

        {/* CTA */}
        <Link
          href="/#hero"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-indigo-300/40"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
        >
          <span>Free Scan</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </Link>
      </div>
    </nav>
  );
}
