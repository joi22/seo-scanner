import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AIFixResult {
  reasoning: string;
  suggestions: string[];
  priority: "High" | "Medium" | "Low";
  impact: string;
}

export async function generateSeoFix(issueLabel: string, currentContent: string, context: string): Promise<AIFixResult> {
  const prompt = `
    Role: Senior Shopify SEO Expert.
    Task: Provide an actionable AI fix for a specific SEO issue.
    
    Issue: ${issueLabel}
    Current Content: "${currentContent}"
    Store Context: ${context}
    
    Instructions:
    1. Explain why this issue impacts Shopify store rankings in simple terms.
    2. Suggest 3 high-quality, conversion-optimized variations to fix it.
    3. Assign a Priority (High, Medium, Low) and explain the estimated SEO Impact.
    
    Return the response in JSON format exactly like this:
    {
      "reasoning": "string explaining the issue",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
      "priority": "High/Medium/Low",
      "impact": "string describing the impact score improvement"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON if model wraps it in markdown blocks
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      reasoning: "We couldn't generate an AI fix at this moment.",
      suggestions: ["Try manual optimization based on SEO best practices."],
      priority: "Medium",
      impact: "N/A"
    };
  }
}

export async function analyzeCompetitor(storeUrl: string, competitorUrl: string, storeData: any, competitorData: any) {
  const prompt = `
    Role: Senior E-commerce Strategist.
    Task: Competitive SEO Gap Analysis.
    
    Store A (User): ${storeUrl}
    Store B (Competitor): ${competitorUrl}
    
    Data A: ${JSON.stringify(storeData)}
    Data B: ${JSON.stringify(competitorData)}
    
    Instructions:
    Return a JSON object with:
    1. "keywordGaps": List of 3-5 keyword clusters Store B ranks for that A is missing.
    2. "contentDifferentiators": Why B might be ranking higher (semantic depth, structure).
    3. "actionableSteps": 3 specific things Store A can do to beat Store B.
    
    Return JSON format:
    {
      "keywordGaps": [],
      "contentDifferentiators": [],
      "actionableSteps": []
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Competitor Analysis Error:", error);
    return null;
  }
}
