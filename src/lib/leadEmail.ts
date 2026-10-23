import { siteConfig } from "@/config/site";

/**
 * Emails a lead (from the enquiry form or the chatbot) to LEAD_EMAIL, through
 * FormSubmit (formsubmit.co). No email account is needed: the first lead sends
 * a one-time activation email to that inbox, and leads arrive once it's clicked.
 * Swap this for your own email provider once you have a business account.
 */

/** The inbox for leads, or undefined when none is configured. CHAT_LEAD_EMAIL is the older name. */
export function leadInbox() {
  return process.env.LEAD_EMAIL?.trim() || process.env.CHAT_LEAD_EMAIL?.trim() || undefined;
}

export async function emailLead(subject: string, fields: Record<string, string | undefined>, replyTo?: string) {
  const to = leadInbox();
  if (!to) throw new Error("LEAD_EMAIL is not set");

  const rows = Object.fromEntries(Object.entries(fields).filter((e): e is [string, string] => Boolean(e[1])));
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // FormSubmit ties activation to the sending site, so always present the canonical URL.
      Origin: siteConfig.url,
      Referer: `${siteConfig.url}/`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...(replyTo ? { _replyto: replyTo } : {}),
      ...rows,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!res.ok || String(body.success) !== "true") {
    throw new Error(`FormSubmit ${res.status}: ${body.message ?? "unknown error"}`);
  }
}
