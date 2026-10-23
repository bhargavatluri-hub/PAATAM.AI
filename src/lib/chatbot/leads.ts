import { emailLead, leadInbox } from "@/lib/leadEmail";

/**
 * Delivers a lead captured by the website chatbot.
 *
 *   LEAD_EMAIL           Inbox that receives each lead (see lib/leadEmail.ts).
 *   CONTACT_WEBHOOK_URL  Optional. If set (same endpoint as the contact form), each lead is
 *                        also POSTed there as JSON with source "paatam.ai chatbot".
 *
 * Every lead is also written to the server log, so nothing is lost if delivery fails.
 */

export type Lead = {
  name: string;
  phone?: string;
  email?: string;
  school?: string;
  role?: string;
  city?: string;
  students?: string;
  interest?: string;
  preferred_time?: string;
  notes?: string;
  summary: string;
};

const LABELS: [keyof Lead, string][] = [
  ["name", "Name"],
  ["role", "Role"],
  ["school", "School"],
  ["city", "City"],
  ["phone", "Phone / WhatsApp"],
  ["email", "Email"],
  ["students", "Students"],
  ["interest", "Interested in"],
  ["preferred_time", "Best time to contact"],
  ["notes", "Notes"],
  ["summary", "Conversation summary"],
];

export async function deliverLead(lead: Lead, page: string) {
  const submittedAt = new Date().toISOString();
  console.log("[chat-lead]", JSON.stringify({ submittedAt, page, ...lead }));

  const jobs: Promise<string>[] = [];
  if (leadInbox()) jobs.push(sendEmail(lead, page));
  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) jobs.push(sendWebhook(webhook, lead, page, submittedAt));
  if (jobs.length === 0) throw new Error("No lead destination configured (set LEAD_EMAIL)");

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("[chat-lead] delivery failed", f.reason));
  if (failures.length === results.length) throw new Error("Lead delivery failed");
}

async function sendEmail(lead: Lead, page: string) {
  const fields: Record<string, string | undefined> = {};
  for (const [key, label] of LABELS) fields[label] = lead[key];
  fields.Page = page || "-";
  await emailLead(`New website chat lead: ${lead.name}${lead.school ? `, ${lead.school}` : ""}`, fields, lead.email);
  return "email";
}

async function sendWebhook(url: string, lead: Lead, page: string, submittedAt: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
  if (secret) headers.Authorization = `Bearer ${secret}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ source: "paatam.ai chatbot", submittedAt, page, ...lead }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);
  return "webhook";
}
