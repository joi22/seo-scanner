import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
// @ts-ignore
import keywordExtractor from 'keyword-extractor';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const validUrl = url.startsWith('http') ? url : `https://${url}`;

    // Simple get request using axios
    const response = await axios.get(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('title').text() || 'No Title Found';
    const description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content') || 
                        'No Meta Description Found';
    
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;

    // Get visible text for keywords analyzing
    $('script, style, noscript, nav, footer, iframe').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    
    let topKeywords: {word: string, count: number}[] = [];
    
    if (text) {
      const keywords = keywordExtractor.extract(text, {
          language: "english",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: false
      });

      const keywordFreq: Record<string, number> = {};
      keywords.forEach((kw: string) => {
          if (kw.length > 3) {
              keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
          }
      });

      topKeywords = Object.entries(keywordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    }

    return NextResponse.json({
      success: true,
      data: {
        title,
        description,
        h1Count,
        h2Count,
        h3Count,
        topKeywords
      }
    });

  } catch (error: any) {
    console.error('Scan Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to scan URL. Make sure it is valid and publicly accessible.' }, { status: 500 });
  }
}
