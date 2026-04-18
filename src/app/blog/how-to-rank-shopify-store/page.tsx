import StaticLayout from "@/components/StaticLayout";

export default function HowToRankPage() {
  return (
    <StaticLayout title="How to Rank Shopify Store on Google">
      <p className="lead text-xl mb-8">Ranking a Shopify store requires a specific strategy that differs from traditional search engine optimization. Here's how to dominate the search results.</p>
      
      <h2>Step 1: Build Authority with Backlinks</h2>
      <p>Backlinks are votes of confidence from other websites. The more high-quality links you have, the higher Google will rank you.</p>
      <p>Focus on getting links from industry blogs, news sites, and partners. Avoid low-quality directory links as they can actually hurt your store's reputation.</p>

      <h2>Step 2: Master the Collection Pages</h2>
      <p>Most Shopify traffic goes to collection pages. These are your "big money" pages.</p>
      <ul>
        <li><strong>Add Descriptive Content:</strong> Don't just show products. Add 200-300 words of helpful content at the bottom of each collection page.</li>
        <li><strong>Optimize Page Architecture:</strong> Ensure your collection hierarchy is logical and easy for robots to crawl.</li>
      </ul>

      <h2>Step 3: User Experience (UX) and Speed</h2>
      <p>Google considers "Core Web Vitals" as a ranking factor. A slow store will never reach page one.</p>
      <p>Minimize the use of heavy Shopify apps, compress all images using WebP format, and choose a lightweight theme optimized for speed.</p>

      <h2>Step 4: Schema Markup</h2>
      <p>Schema tells Google exactly what a product is, its price, and its availability. This enables "Rich Snippets" like star ratings in search results, which can double your click-through rate.</p>

      <div className="mt-12 p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
        <h3 className="text-2xl font-bold mb-4">Need Expert Help?</h3>
        <p className="mb-6 opacity-80">Our team specialized in ranking Shopify stores from scratch. We handle the technical side so you can focus on sales.</p>
        <a href="/contact" className="inline-block px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
          Book a Free Strategy Call
        </a>
      </div>
    </StaticLayout>
  );
}
