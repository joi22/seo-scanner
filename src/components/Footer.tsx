import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-16 border-t border-slate-800 font-sans text-white/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 no-underline">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                S
              </div>
              <span className="font-bold text-white text-lg">ShopifySEO</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Empowering Shopify store owners with free, instant SEO analysis and expert optimization services.
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Tools</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">SEO Analyzer</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">SEO Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">SEO Checklist</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs tracking-wide">
          <p>© {new Date().getFullYear()} ShopifySEO. All rights reserved.</p>
          <p>Not affiliated with Shopify Inc. Shopify® is a registered trademark of Shopify Inc.</p>
        </div>
      </div>
    </footer>
  );
}
