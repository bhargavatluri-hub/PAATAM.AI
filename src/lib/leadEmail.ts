/**
 * Emails a lead (from the enquiry form or the chatbot) to LEAD_EMAIL through
 * Resend (resend.com), which is built for sending email from servers.
 *
 *   RESEND_API_KEY   Resend API key.
 *   LEAD_EMAIL       Inbox that receives leads.
 *   LEAD_EMAIL_FROM  Optional sender, e.g. "Paatam Website <leads@paatam.ai>", once that
 *                    domain is verified in Resend. Until then Resend's own test sender is
 *                    used, which can only deliver to the email address of the Resend account.
 */

const DEFAULT_FROM = "Paatam Website <onboarding@resend.dev>";

/** The inbox for leads, or undefined when email delivery isn't configured. CHAT_LEAD_EMAIL is the older name. */
export function leadInbox() {
  if (!process.env.RESEND_API_KEY?.trim()) return undefined;
  return process.env.LEAD_EMAIL?.trim() || process.env.CHAT_LEAD_EMAIL?.trim() || undefined;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function emailLead(subject: string, fields: Record<string, string | undefined>, replyTo?: string) {
  const to = leadInbox();
  if (!to) throw new Error("RESEND_API_KEY and LEAD_EMAIL must both be set");

  const rows = Object.entries(fields).filter((e): e is [string, string] => Boolean(e[1]));
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html =
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#55656b;vertical-align:top">${escapeHtml(label)}</td>` +
          `<td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
      )
      .join("") +
    `</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM?.trim() || DEFAULT_FROM,
      to: [to],
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; name?: string };
    throw new Error(`Resend ${res.status}: ${body.message ?? body.name ?? "unknown error"}`);
  }
}
