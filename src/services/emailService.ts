import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendSeoReportEmail(to: string, reportUrl: string, storeName: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL || "reports@yourdomain.com",
    subject: `SEO Audit Report for ${storeName}`,
    text: `Your SEO audit report is ready. View it here: ${reportUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #4f46e5;">Your AI SEO Analysis is Ready! 🚀</h2>
        <p>We've completed the deep audit for <strong>${storeName}</strong>.</p>
        <p>You can view your full roadmap, AI-generated fixes, and competitor insights by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${reportUrl}" style="background-color: #4f46e5; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Full SEO Report
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Note: This report link is temporary. We recommend saving it or taking action on the suggestions soon.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} AI Shopify SEO Fixer. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}
