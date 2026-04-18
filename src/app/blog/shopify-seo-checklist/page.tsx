import StaticLayout from "@/components/StaticLayout";

export default function ChecklistPage() {
  return (
    <StaticLayout title="Shopify SEO Checklist for Beginners">
      <p className="lead text-xl mb-8">Ready to rank your store but don't know where to start? This definitive checklist covers every essential step to get your Shopify store search-ready.</p>
      
      <h2>1. Technical SEO Foundation</h2>
      <p>Before you start writing content, ensure your store's technical foundation is solid. Shopify handles much of this for you, but there are critical areas you must check manually.</p>
      <ul>
        <li><strong>Verify with Google Search Console:</strong> This is the first step. It tells Google your site exists and lets you monitor your ranking progress.</li>
        <li><strong>Sitemap Submission:</strong> Locating your sitemap at yourdomain.com/sitemap.xml and submitting it to Search Console.</li>
        <li><strong>Fix 404 Errors:</strong> Use redirects for any broken links to preserve link equity.</li>
      </ul>

      <h2>2. Keyword Research for E-commerce</h2>
      <p>Keywords are the bridge between what users search for and your products. Don't guess—use data.</p>
      <ul>
        <li><strong>Identify Primary Keywords:</strong> These should be your main product categories.</li>
        <li><strong>Focus on Long-Tail Keywords:</strong> Competitive terms like "shoes" are hard. Terms like "handmade leather running shoes" are where the sales are.</li>
        <li><strong>Check Competitor Keywords:</strong> Use tools to see what keywords are driving traffic to your competitors.</li>
      </ul>

      <h2>3. On-Page Optimization</h2>
      <p>This is where you tell search engines exactly what each page is about.</p>
      <ul>
        <li><strong>Optimize Meta Titles:</strong> Keep them under 60 characters and include your primary keyword.</li>
        <li><strong>Write Compelling Meta Descriptions:</strong> These don't affect ranking directly but significantly impact click-through rate (CTR).</li>
        <li><strong>Use H1 Tags Correctly:</strong> Each page should have only one H1 tag, usually the product or category name.</li>
        <li><strong>Image Alt Tags:</strong> Don't leave them empty. Describe the image for search engines and accessibility.</li>
      </ul>

      <h2>4. Content Strategy</h2>
      <p>Google loves fresh, high-quality content. A blog is your secret weapon.</p>
      <p>Identify common questions your customers ask and turn them into detailed blog posts. This builds authority and captures traffic from informational searches.</p>

      <div className="mt-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
        <h3 className="text-xl font-bold mb-4">Want the PDF version?</h3>
        <p>Enter your email in our SEO analyzer on the homepage to get a downloadable version of this checklist plus a full technical audit of your store.</p>
      </div>
    </StaticLayout>
  );
}
