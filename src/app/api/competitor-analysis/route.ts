import { NextResponse } from "next/server";
import { analyzeCompetitor } from "@/services/aiService";

export async function POST(req: Request) {
  try {
    const { storeUrl, competitorUrl, storeData, competitorData } = await req.json();

    if (!competitorUrl) {
      return NextResponse.json({ error: "competitorUrl is required" }, { status: 400 });
    }

    const analysis = await analyzeCompetitor(storeUrl, competitorUrl, storeData, competitorData);

    return NextResponse.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    console.error("Competitor Analysis API Error:", error.message);
    return NextResponse.json(
      { error: "Failed to perform competitor analysis" },
      { status: 500 }
    );
  }
}
