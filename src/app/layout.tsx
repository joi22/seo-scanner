import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopifySEO — Analyze Your Shopify Store SEO in 10 Seconds",
  description:
    "Free Shopify SEO analyzer tool. Get your SEO score, performance report, and actionable insights instantly. No credit card required.",
  keywords: "Shopify SEO, SEO analyzer, Shopify store audit, SEO score, page speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
