import { NextResponse } from "next/server";
import axios from "axios";
// @ts-ignore
import keywordExtractor from "keyword-extractor";
import { checkSeo } from "@/lib/seoChecker";
import { saveResult, generateId } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const validUrl = url.startsWith("http") ? url : `https://${url}`;

    // ── Fetch the page ────────────────────────────────────────────────────
    let html: string;
    try {
      const response = await axios.get(validUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        timeout: 15000,
        maxRedirects: 5,
      });
      html = response.data;
    } catch (fetchErr: any) {
      return NextResponse.json(
        {
          error:
            fetchErr.code === "ECONNABORTED"
              ? "The site took too long to respond (15s timeout). Try again."
              : `Could not reach "${validUrl}". Is it publicly accessible?`,
        },
        { status: 422 }
      );
    }

    // ── Run SEO checks ────────────────────────────────────────────────────
    const seo = checkSeo(html);

    // ── Extract keywords from visible body text ────────────────────────────
    const { load } = await import("cheerio");
    const $ = load(html);
    $("script, style, noscript, nav, footer, iframe, header").remove();
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    let topKeywords: { word: string; count: number }[] = [];
    if (bodyText) {
      const keywords: string[] = keywordExtractor.extract(bodyText, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false,
      });
      const freq: Record<string, number> = {};
      for (const kw of keywords) {
        if (kw.length > 3) freq[kw] = (freq[kw] || 0) + 1;
      }
      topKeywords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([word, count]) => ({ word, count }));
    }

    // ── Save to store & return ─────────────────────────────────────────────
    const id = generateId();

    const resultData = {
      id,
      url: validUrl,
      scannedAt: new Date().toISOString(),
      title: seo.title,
      description: seo.description,
      h1Count: seo.h1Count,
      h2Count: seo.h2Count,
      h3Count: seo.h3Count,
      imgCount: seo.imgCount,
      imgMissingAlt: seo.imgMissingAlt,
      hasCanonical: seo.hasCanonical,
      hasViewport: seo.hasViewport,
      topKeywords,
      issues: seo.issues,
      score: seo.score,
    };

    saveResult(resultData);

    return NextResponse.json({
      success: true,
      id,
      data: resultData,
    });
  } catch (error: any) {
    console.error("Scan error:", error.message);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
