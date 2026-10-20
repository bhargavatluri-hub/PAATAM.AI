/**
 * Enquiry emails, sent through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * Server-only: imported by the /api/contact route.
 *
 *   RESEND_API_KEY  Required to send email. The sending domain must be verified in Resend.
 *   ENQUIRY_FROM    Optional sender, default "Paatam.ai <enquiries@paatam.in>".
 *   ENQUIRY_TO      Optional comma-separated team inboxes, default `business.emails`.
 */
import { addressLines, business, formatIndianNumber, siteConfig } from "@/config/site";
import { interests, type ContactPayload } from "./contact";

export type Enquiry = Omit<ContactPayload, "website">;

const DEFAULT_FROM = "Paatam.ai <enquiries@paatam.in>";

export function emailSettings() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ENQUIRY_FROM?.trim() || DEFAULT_FROM;
  const to = (process.env.ENQUIRY_TO?.trim() ? process.env.ENQUIRY_TO.split(",") : business.emails)
    .map((e) => e.trim())
    .filter(Boolean);
  return apiKey && to.length ? { apiKey, from, to } : null;
}

/** Whether enquiries can reach the team at all (email or webhook). Read on the server only. */
export function deliveryConfigured() {
  return Boolean(emailSettings() || process.env.CONTACT_WEBHOOK_URL?.trim());
}

type Message = { to: string[]; replyTo: string[]; subject: string; html: string; text: string };

async function send(apiKey: string, from: string, message: Message) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Resend responded with ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

/** Notifies the team. Throws if the email could not be handed to Resend. */
export async function sendTeamNotification(enquiry: Enquiry, settings: NonNullable<ReturnType<typeof emailSettings>>) {
  const interest = interestLabel(enquiry.interest);
  const rows: [string, string][] = [
    ["Interested in", interest],
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone || "Not given"],
    ["School", enquiry.school],
    ["Role", enquiry.role],
    ["City or town", enquiry.city],
    ["Message", enquiry.message || "No message"],
  ];
  const submitted = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  await send(settings.apiKey, settings.from, {
    to: settings.to,
    replyTo: [enquiry.email],
    subject: oneLine(`New enquiry (${interest}): ${enquiry.school}, ${enquiry.city}`),
    text: [
      `New website enquiry, ${submitted} IST`,
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      `Reply to this email to answer ${enquiry.name} directly.`,
    ].join("\n"),
    html: layout(`
      <h1 style="margin:0 0 4px;font-size:20px;color:#12242b">New website enquiry</h1>
      <p style="margin:0 0 20px;color:#5b6b70;font-size:14px">${esc(submitted)} IST · Reply to this email to answer ${esc(enquiry.name)} directly.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:10px 12px 10px 0;border-top:1px solid #e6e1d6;color:#5b6b70;vertical-align:top;white-space:nowrap">${esc(k)}</td>
              <td style="padding:10px 0;border-top:1px solid #e6e1d6;color:#12242b;white-space:pre-wrap">${esc(v)}</td>
            </tr>`,
          )
          .join("")}
      </table>`),
  });
}

/** Confirms receipt to the person who enquired. Replies go to the team. */
export async function sendAcknowledgement(enquiry: Enquiry, settings: NonNullable<ReturnType<typeof emailSettings>>) {
  const firstName = enquiry.name.split(/\s+/)[0];
  const interest = interestLabel(enquiry.interest).toLowerCase();
  const contactLines = [
    business.phone && `Phone: ${business.phone}`,
    business.whatsapp && `WhatsApp: ${formatIndianNumber(business.whatsapp)}`,
    settings.to.length && `Email: ${settings.to.join(", ")}`,
  ].filter(Boolean) as string[];
  const signature = [business.legalName || siteConfig.name, ...addressLines()];

  await send(settings.apiKey, settings.from, {
    to: [enquiry.email],
    replyTo: settings.to,
    subject: "We’ve received your enquiry · Paatam.ai",
    text: [
      `Dear ${firstName},`,
      "",
      `Thank you for your interest in Paatam. We’ve received your enquiry about ${interest} for ${enquiry.school}.`,
      "Someone from our team will get back to you within two working days. If you have anything to add, just reply to this email.",
      "",
      ...contactLines,
      "",
      "Warm regards,",
      "The Paatam team",
      "",
      ...signature,
    ].join("\n"),
    html: layout(`
      <p style="margin:0 0 16px">Dear ${esc(firstName)},</p>
      <p style="margin:0 0 16px">Thank you for your interest in Paatam. We’ve received your enquiry about <strong>${esc(interest)}</strong> for <strong>${esc(enquiry.school)}</strong>.</p>
      <p style="margin:0 0 24px">Someone from our team will get back to you within two working days. If you have anything to add, just reply to this email.</p>
      ${contactLines.length ? `<p style="margin:0 0 24px;padding:16px;background:#f7f4ec;border-radius:10px;font-size:14px;line-height:1.7">${contactLines.map(esc).join("<br>")}</p>` : ""}
      <p style="margin:0">Warm regards,<br><strong>The Paatam team</strong></p>
      <p style="margin:24px 0 0;color:#5b6b70;font-size:12px;line-height:1.6">${signature.map(esc).join("<br>")}</p>`),
  });
}

function interestLabel(value: Enquiry["interest"]) {
  return interests.find((i) => i.value === value)?.label ?? "An enquiry";
}

function layout(body: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f7f4ec;font-family:Arial,Helvetica,sans-serif;color:#12242b;font-size:16px;line-height:1.55">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;padding:32px 28px;border:1px solid #e6e1d6">
    <p style="margin:0 0 24px;font-size:22px;font-weight:bold;color:#0e5a5f;letter-spacing:-0.5px">paatam<span style="color:#f0a53a">.ai</span></p>
    ${body}
  </div>
  <p style="max-width:560px;margin:16px auto 0;text-align:center;color:#8a979b;font-size:12px">${esc(siteConfig.tagline)}</p>
</body></html>`;
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}
