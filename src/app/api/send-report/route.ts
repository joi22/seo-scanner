import { NextResponse } from "next/server";
import { sendSeoReportEmail } from "@/services/emailService";

export async function POST(req: Request) {
  try {
    const { email, reportUrl, storeName } = await req.json();

    if (!email || !reportUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { success, error } = await sendSeoReportEmail(email, reportUrl, storeName || "your store");

    if (!success) {
      return NextResponse.json({ error: error || "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Email API Route Error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
