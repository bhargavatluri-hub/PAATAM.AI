import { normalise, validate } from "@/lib/contact";
import { emailSettings, sendAcknowledgement, sendTeamNotification, type Enquiry } from "@/lib/enquiry-email";

/**
 * Receives demo / partnership enquiries from the website form.
 *
 * Delivery is configured with environment variables (server-only); at least one is required:
 *   RESEND_API_KEY          Emails each enquiry to the team and sends the visitor an
 *                           acknowledgement (see src/lib/enquiry-email.ts).
 *   CONTACT_WEBHOOK_URL     HTTPS endpoint that receives a JSON POST for each enquiry
 *                           (e.g. a Google Sheet via Apps Script, an automation tool or a CRM).
 *   CONTACT_WEBHOOK_SECRET  Optional. Sent as `Authorization: Bearer <secret>`.
 *
 * The enquiry counts as delivered once the team has it (email or webhook). If nothing is
 * configured, or every channel fails, the form tells the visitor the enquiry was NOT sent —
 * it never reports a false success. The acknowledgement is best effort and never fails the request.
 */

const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

// Best-effort, per-instance rate limiting. On serverless platforms each instance
// keeps its own counter, so pair this with platform-level protection in production.
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "too_large" }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const data = normalise(parsed as Record<string, unknown>);

  // Honeypot filled: almost certainly a bot. Accept silently without forwarding.
  if (data.website) {
    return json({ ok: true }, 200);
  }

  const errors = validate(data);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, error: "validation", errors }, 422);
  }

  const email = emailSettings();
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!email && !webhookUrl) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const { website: _honeypot, ...enquiry } = data;
  void _honeypot;

  const [emailed, posted] = await Promise.all([
    email
      ? sendTeamNotification(enquiry, email).then(
          () => true,
          (error) => (console.error("[contact] Team email failed", error), false),
        )
      : false,
    webhookUrl ? postToWebhook(webhookUrl, enquiry) : false,
  ]);
  if (!emailed && !posted) {
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  if (email) {
    await sendAcknowledgement(enquiry, email).catch((error) => console.error("[contact] Acknowledgement failed", error));
  }

  return json({ ok: true }, 200);
}

async function postToWebhook(url: string, enquiry: Enquiry) {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
    if (secret) headers.Authorization = `Bearer ${secret}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ source: "paatam.ai website", submittedAt: new Date().toISOString(), ...enquiry }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[contact] Webhook responded with ${res.status}`);
    return res.ok;
  } catch (error) {
    console.error("[contact] Webhook request failed", error);
    return false;
  }
}
