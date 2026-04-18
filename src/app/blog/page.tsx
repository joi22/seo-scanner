import Link from "next/link";

const posts = [
  {
    slug: "shopify-seo-checklist",
    title: "Shopify SEO Checklist for Beginners",
    excerpt: "Everything you need to do to get your Shopify store ready for search engines. From basic settings to advanced tweaks.",
    date: "April 15, 2026",
    readTime: "8 min read"
  },
  {
    slug: "how-to-rank-shopify-store",
    title: "How to Rank Shopify Store on Google",
    excerpt: "A comprehensive guide on search engine optimization strategies specifically tailored for the Shopify platform.",
    date: "April 10, 2026",
    readTime: "12 min read"
  },
  {
    slug: "common-shopify-seo-mistakes",
    title: "Common Shopify SEO Mistakes",
    excerpt: "Are you making these 7 critical SEO errors? Learn what they are and how to fix them before they hurt your rankings.",
    date: "April 5, 2026",
    readTime: "10 min read"
  }
];

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-[140px] pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">SEO Education</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Master the art of search engine optimization with our expert guides and checklists.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
              <article className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-80" />
                   <div className="absolute inset-0 flex items-center justify-center text-4xl">📄</div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Article <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
