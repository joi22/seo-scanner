import { NextResponse } from "next/server";
import { generateSeoFix } from "@/services/aiService";

export async function POST(req: Request) {
  try {
    const { issueLabel, currentContent, context } = await req.json();

    if (!issueLabel) {
      return NextResponse.json({ error: "issueLabel is required" }, { status: 400 });
    }

    const aiFix = await generateSeoFix(issueLabel, currentContent, context);

    return NextResponse.json({
      success: true,
      data: aiFix
    });
  } catch (error: any) {
    console.error("AI Fix API Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate AI fix" },
      { status: 500 }
    );
  }
}
