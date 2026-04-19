import { NextResponse } from "next/server";
import axios from "axios";
// @ts-ignore
import keywordExtractor from "keyword-extractor";
import { checkSeo } from "@/lib/seoChecker";
import { saveResult, generateId } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { url, competitorUrl } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const validUrl = url.startsWith("http") ? url : `https://${url}`;
    const validCompetitorUrl = competitorUrl ? (competitorUrl.startsWith("http") ? competitorUrl : `https://${competitorUrl}`) : null;

    // ── Fetch the page ────────────────────────────────────────────────────
    async function fetchHtml(targetUrl: string) {
      try {
        const response = await axios.get(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          timeout: 10000,
        });
        return response.data;
      } catch (e) {
        return null;
      }
    }

    const html = await fetchHtml(validUrl);
    if (!html) {
      return NextResponse.json({ error: `Could not reach "${validUrl}".` }, { status: 422 });
    }

    let competitorHtml = null;
    if (validCompetitorUrl) {
      competitorHtml = await fetchHtml(validCompetitorUrl);
    }

    // ── Run SEO checks ────────────────────────────────────────────────────
    const seo = checkSeo(html);
    const competitorSeo = competitorHtml ? checkSeo(competitorHtml) : null;

    // ── Extract keywords ─────────────────────────────────────────────────
    const { load } = await import("cheerio");
    function getKeywords(htmlString: string) {
      const $ = load(htmlString);
      $("script, style, noscript, nav, footer, iframe, header").remove();
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      if (!bodyText) return [];
      
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
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    }

    const topKeywords = getKeywords(html);
    const competitorKeywords = competitorHtml ? getKeywords(competitorHtml) : [];

    // ── Save to store & return ─────────────────────────────────────────────
    const id = generateId();

    const resultData = {
      id,
      url: validUrl,
      competitorUrl: validCompetitorUrl,
      scannedAt: new Date().toISOString(),
      ...seo,
      topKeywords,
      competitorData: competitorSeo ? {
        ...competitorSeo,
        topKeywords: competitorKeywords
      } : null,
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
