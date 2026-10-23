import { describeClaudeError, replyWithClaude } from "@/lib/chatbot/claude";
import { chatProvider } from "@/lib/chatbot/config";
import { describeGeminiError, replyWithGemini } from "@/lib/chatbot/gemini";
import { deliverLead, type Lead } from "@/lib/chatbot/leads";
import type { SaveLead, Turn } from "@/lib/chatbot/prompt";

/**
 * Website chatbot (Radha). Answers questions about Paatam from `lib/chatbot/knowledge.ts`
 * and hands interested visitors' details to the team (see `lib/chatbot/leads.ts`).
 *
 * Server-only environment variables:
 *   GEMINI_API_KEY or ANTHROPIC_API_KEY  Which model answers (see lib/chatbot/config.ts).
 *                                        The widget is hidden when neither is set.
 *   LEAD_EMAIL                           Inbox that receives leads (shared with the enquiry form).
 *
 * The route is stateless: the browser sends the visible transcript with each
 * message, so it works on serverless instances that don't share memory.
 */

export const maxDuration = 60;

const MAX_MESSAGE = 1500;
const MAX_HISTORY = 30;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 40 };

const hits = new Map<string, number[]>();
function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function readHistory(input: unknown): Turn[] | null {
  if (!Array.isArray(input)) return [];
  const turns: Turn[] = [];
  for (const t of input.slice(-MAX_HISTORY)) {
    if (!t || (t.role !== "user" && t.role !== "assistant") || typeof t.text !== "string") return null;
    const text = t.text.trim().slice(0, MAX_MESSAGE * 2);
    if (text) turns.push({ role: t.role, text });
  }
  // The API needs alternating turns that start with the user.
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.filter((t, i) => i === 0 || t.role !== turns[i - 1].role);
}

function cleanLead(input: unknown): Lead | null {
  if (!input || typeof input !== "object") return null;
  const lead: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === "string" && v.trim()) lead[k] = v.trim().slice(0, 500);
  }
  const phoneOk = (lead.phone?.replace(/\D/g, "").length ?? 0) >= 10;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email ?? "");
  if (!lead.name || (!phoneOk && !emailOk)) return null;
  return { ...lead, name: lead.name, summary: lead.summary || "-" } as Lead;
}

export async function POST(request: Request) {
  const provider = chatProvider();
  if (!provider) return json({ error: "not_configured" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  const raw = await request.text();
  if (raw.length > 100_000) return json({ error: "too_large" }, 413);
  let body: { message?: unknown; history?: unknown; leadSaved?: unknown; page?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "empty" }, 400);
  if (message.length > MAX_MESSAGE) return json({ error: "too_long" }, 400);
  const history = readHistory(body.history);
  if (!history) return json({ error: "invalid_history" }, 400);
  if (history.at(-1)?.role === "user") history.pop();
  const page = typeof body.page === "string" ? body.page.slice(0, 300) : "";
  let leadSaved = body.leadSaved === true;

  const saveLead: SaveLead = async (input) => {
    const lead = cleanLead(input);
    if (!lead) {
      return { ok: false, message: "Not saved: need the visitor's name and a valid phone number or email. Ask for the missing detail." };
    }
    try {
      await deliverLead(lead, page);
      leadSaved = true;
      return { ok: true, message: "Saved. The Paatam team has been notified and will reach out." };
    } catch (error) {
      console.error("[chat] lead delivery failed", error);
      return {
        ok: false,
        message: "Saving failed on our side. Apologise, and ask the visitor to use the Contact page (/contact) so the team gets their details.",
      };
    }
  };

  try {
    const reply =
      provider === "gemini"
        ? await replyWithGemini(history, message, saveLead)
        : await replyWithClaude(history, message, saveLead);
    return json({ reply, leadSaved });
  } catch (error) {
    console.error(`[chat] ${describeGeminiError(error) ?? describeClaudeError(error) ?? "request failed"}`, error);
    return json({ error: "unavailable" }, 502);
  }
}
