import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
  other: {
    "google-adsense-account": "ca-pub-8517681264003887",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <meta name="google-adsense-account" content="ca-pub-8517681264003887"></meta>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8517681264003887"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
