import nodemailer from "nodemailer";

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export async function sendContactEmails(m: {
  name: string;
  email: string;
  body: string;
}): Promise<{ notificationSent: boolean }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, SITE_NAME } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP not configured; skipping emails");
    return { notificationSent: false };
  }
  const port = Number(SMTP_PORT || 465);
  const t = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  const site = SITE_NAME || "Portfolio";
  const from = { name: site, address: SMTP_USER };

  const results = await Promise.allSettled([
    // 1) Notification to you
    t.sendMail({
      from,
      to: ADMIN_EMAIL || SMTP_USER,
      replyTo: { name: m.name, address: m.email },
      subject: `New contact message from ${m.name}`,
      text: `Name: ${m.name}\nEmail: ${m.email}\n\nMessage:\n${m.body}`,
      html: `<p><b>Name:</b> ${esc(m.name)}<br><b>Email:</b> ${esc(m.email)}</p><p style="white-space:pre-wrap">${esc(m.body)}</p>`,
    }),
    // 2) Auto-reply to the sender (does not echo their message, to prevent abuse)
    t.sendMail({
      from,
      to: m.email,
      subject: "I received your message",
      text: `Hi ${m.name},\n\nThanks for reaching out! I've received your message and will get back to you soon.\n\n— ${site}`,
      html: `
  <div style="margin:0;padding:0;background:linear-gradient(135deg, #f5a623 0%, #e68f32 50%, #c46a1a 100%);font-family:'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
            <tr>
              <td style="padding:32px 40px;border-bottom:3px solid #e68f32;">
                <h1 style="margin:0;font-size:22px;color:#1a1a1a;font-weight:600;">${esc(site)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 16px 0;font-size:16px;color:#333;line-height:1.6;">Hi ${esc(m.name)},</p>
                <p style="margin:0 0 16px 0;font-size:16px;color:#333;line-height:1.6;">Thanks for reaching out! I've received your message and will get back to you soon.</p>
                <p style="margin:0;font-size:16px;color:#333;line-height:1.6;">${esc(site)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px;background:#f8f4ef;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#888;text-align:center;">This is an automated reply. No need to respond to this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`,
    }),
  ]);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const error = result.reason as { code?: string; responseCode?: number };
      console.error(index === 0 ? "Admin notification email failed" : "Contact auto-reply failed", {
        code: error.code,
        responseCode: error.responseCode,
      });
    }
  });
  return { notificationSent: results[0].status === "fulfilled" };
}
