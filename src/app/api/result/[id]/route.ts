import { NextResponse } from "next/server";
import { getResult } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = getResult(id);

  if (!result) {
    return NextResponse.json(
      { error: "Result not found. Please scan again." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: result });
}
