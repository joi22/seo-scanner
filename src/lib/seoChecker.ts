import * as cheerio from "cheerio";
import type { Issue } from "./store";

export interface SeoCheckResult {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  imgMissingAlt: number;
  hasCanonical: boolean;
  hasRobots: boolean;
  hasViewport: boolean;
  issues: Issue[];
  score: number;
}

/** Run all SEO checks on the raw HTML string */
export function checkSeo(html: string): SeoCheckResult {
  const $ = cheerio.load(html);
  const issues: Issue[] = [];
  let score = 0;
  const MAX_SCORE = 100;

  // ── Title ──────────────────────────────────────────────────────────────
  const title = $("title").text().trim();
  if (title) {
    if (title.length < 30 || title.length > 60) {
      issues.push({ type: "warn", label: "Title length not optimal", detail: `"${title}" (${title.length} chars — aim for 30–60)`, impact: "medium" });
      score += 15;
    } else {
      issues.push({ type: "ok", label: "Meta Title looks great", detail: title, impact: "high" });
      score += 25;
    }
  } else {
    issues.push({ type: "error", label: "Meta Title missing", detail: "No <title> tag found on this page", impact: "high" });
  }

  // ── Description ────────────────────────────────────────────────────────
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  if (description) {
    if (description.length < 50 || description.length > 160) {
      issues.push({ type: "warn", label: "Meta description length not optimal", detail: `${description.length} chars — aim for 50–160`, impact: "medium" });
      score += 15;
    } else {
      issues.push({ type: "ok", label: "Meta Description is set", detail: description, impact: "high" });
      score += 20;
    }
  } else {
    issues.push({ type: "error", label: "Meta Description missing", detail: "No description meta tag found — this hurts CTR in search results", impact: "high" });
  }

  // ── H1 ─────────────────────────────────────────────────────────────────
  const h1Count = $("h1").length;
  if (h1Count === 1) {
    issues.push({ type: "ok", label: "H1 heading found (1)", detail: $("h1").first().text().trim(), impact: "high" });
    score += 20;
  } else if (h1Count === 0) {
    issues.push({ type: "error", label: "H1 heading missing", detail: "Every page should have exactly one H1 tag", impact: "high" });
  } else {
    issues.push({ type: "warn", label: `Multiple H1 tags (${h1Count})`, detail: "Use only one H1 per page for best SEO", impact: "medium" });
    score += 10;
  }

  // ── H2 ─────────────────────────────────────────────────────────────────
  const h2Count = $("h2").length;
  if (h2Count >= 2) {
    issues.push({ type: "ok", label: `H2 subheadings found (${h2Count})`, detail: "Good heading hierarchy", impact: "low" });
    score += 10;
  } else if (h2Count === 1) {
    issues.push({ type: "ok", label: "H2 subheading found (1)", impact: "low" });
    score += 7;
  } else {
    issues.push({ type: "warn", label: "No H2 subheadings", detail: "Add H2 tags to create a clear content structure", impact: "low" });
  }

  // ── Images ─────────────────────────────────────────────────────────────
  const imgs = $("img");
  const imgCount = imgs.length;
  let imgMissingAlt = 0;

  imgs.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") imgMissingAlt++;
  });

  if (imgCount === 0) {
    issues.push({ type: "ok", label: "No images to check", impact: "low" });
    score += 5;
  } else if (imgMissingAlt === 0) {
    issues.push({ type: "ok", label: `All ${imgCount} images have alt text`, impact: "medium" });
    score += 10;
  } else {
    issues.push({
      type: imgMissingAlt > imgCount / 2 ? "error" : "warn",
      label: `${imgMissingAlt} of ${imgCount} images missing alt text`,
      detail: "Alt text is crucial for SEO and accessibility",
      impact: "medium",
    });
    score += Math.round(10 * (1 - imgMissingAlt / imgCount));
  }

  // ── Canonical ──────────────────────────────────────────────────────────
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  if (hasCanonical) {
    issues.push({ type: "ok", label: "Canonical tag found", impact: "medium" });
    score += 5;
  } else {
    issues.push({ type: "warn", label: "Canonical tag missing", detail: "Add <link rel='canonical'> to prevent duplicate content issues", impact: "medium" });
  }

  // ── Robots meta ────────────────────────────────────────────────────────
  const robotsMeta = $('meta[name="robots"]').attr("content") || "";
  const hasRobots = !!robotsMeta;
  if (hasRobots && robotsMeta.toLowerCase().includes("noindex")) {
    issues.push({ type: "error", label: "Page is noindex", detail: "This page is blocked from search engines!", impact: "high" });
    score = Math.max(0, score - 30);
  } else {
    issues.push({ type: "ok", label: "Page is indexable", impact: "high" });
    score += 5;
  }

  // ── Viewport ───────────────────────────────────────────────────────────
  const hasViewport = $('meta[name="viewport"]').length > 0;
  if (hasViewport) {
    issues.push({ type: "ok", label: "Viewport meta tag found (mobile friendly)", impact: "medium" });
    score += 5;
  } else {
    issues.push({ type: "warn", label: "Viewport meta tag missing", detail: "Required for mobile-friendly pages", impact: "medium" });
  }

  const h3Count = $("h3").length;

  return {
    title: title || "No Title Found",
    description: description || "No Meta Description Found",
    h1Count,
    h2Count,
    h3Count,
    imgCount,
    imgMissingAlt,
    hasCanonical,
    hasRobots,
    hasViewport,
    issues,
    score: Math.min(MAX_SCORE, Math.max(0, score)),
  };
}
