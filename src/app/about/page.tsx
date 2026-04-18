import StaticLayout from "@/components/StaticLayout";

export default function AboutPage() {
  return (
    <StaticLayout title="About Us">
      <p>At ShopifySEO, our mission is to make professional SEO optimization accessible to every Shopify store owner.</p>
      
      <h2>Our Story</h2>
      <p>We started as a small team of SEO experts who realized that most Shopify store owners handle their own marketing but lack the tools to see what Google sees. We built this analyzer to bridge that gap.</p>

      <h2>Our Expertise</h2>
      <p>With over 10 years of experience in e-commerce SEO, we understand the unique challenges of ranking a Shopify store. From liquid code optimizations to schema markup, we've seen it all.</p>

      <h2>Why Choose Us?</h2>
      <p>Unlike generic SEO tools, our analyzer is built specifically for the Shopify platform. We check for common Shopify-specific issues that others miss, such as app script bloat and duplicate product URL tags.</p>

      <div className="mt-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100 italic">
        "Our goal is to help 10,000 Shopify stores achieve their first $100k in organic sales."
      </div>
    </StaticLayout>
  );
}
