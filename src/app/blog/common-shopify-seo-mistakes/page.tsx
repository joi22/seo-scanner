import StaticLayout from "@/components/StaticLayout";

export default function MistakesPage() {
  return (
    <StaticLayout title="Common Shopify SEO Mistakes">
      <p className="lead text-xl mb-8">Avoiding mistakes is just as important as doing the right things. Are you killing your rankings with these common Shopify SEO errors?</p>
      
      <h2>Mistake #1: Keeping Default Product Descriptions</h2>
      <p>Many dropshippers copy descriptions directly from AliExpress. This creates "Duplicate Content" issues. Google will rarely rank a page that has the exact same text as a thousand other sites.</p>

      <h2>Mistake #2: Forgetting the Meta Description</h2>
      <p>While not a direct ranking factor, meta descriptions are your "ad copy" in search results. Leaving them blank means Google will pull random text from your site, often resulting in lower click-through rates.</p>

      <h2>Mistake #3: Poor Internal Linking</h2>
      <p>Link your blog posts to your products and your products to related collections. This helps Google discover your pages and distributes "link juice" throughout your store.</p>

      <h2>Mistake #4: Hidden Heading Tags</h2>
      <p>Some Shopify themes hide H1 tags or use multiple H1 tags for design purposes. This confuses search engines. Ensure each page has exactly one H1 tag that matches the primary keyword.</p>

      <h2 className="text-red-600 font-bold">Mistake #5: Excessive App Use</h2>
      <p>Every app you install adds a new script to your theme, slowing it down. Audit your apps and remove anything that isn't absolutely essential for your business.</p>

      <div className="mt-12 p-8 bg-amber-50 border border-amber-200 rounded-3xl italic">
        "SEO is a marathon, not a sprint. Avoiding these common mistakes early on will save you months of frustration later."
      </div>
    </StaticLayout>
  );
}
