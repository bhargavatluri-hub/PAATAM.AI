import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/config/site";
import { knowledge } from "@/lib/chatbot/knowledge";
import { deliverLead, type Lead } from "@/lib/chatbot/leads";

/**
 * Website chatbot. Answers questions about Paatam from `lib/chatbot/knowledge.ts`
 * and hands interested visitors' details to the team (see `lib/chatbot/leads.ts`).
 *
 * Server-only environment variables:
 *   ANTHROPIC_API_KEY  Required. The widget is hidden when it is not set.
 *   LEAD_EMAIL         Inbox that receives leads (shared with the enquiry form).
 *   CHAT_MODEL         Optional. Defaults to claude-opus-5-5.
 *
 * The route is stateless: the browser sends the visible transcript with each
 * message, so it works on serverless instances that don't share memory.
 */

export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL?.trim() || "claude-opus-5-5";
const MAX_MESSAGE = 1500;
const MAX_HISTORY = 30;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 40 };

const SYSTEM = `You are the website assistant for ${siteConfig.name} (${siteConfig.url}). Visitors are mostly school principals, owners, academic coordinators and teachers in India, and sometimes parents.

Your two jobs:
1. Answer questions about Paatam accurately, using only the product knowledge below.
2. When a visitor is interested, collect their details and save them with the save_lead tool so the team can follow up.

Answering:
- Keep replies short and warm: 2-4 sentences, or a few short bullets for lists. Plain language. Use **bold** sparingly.
- Use only the product knowledge below. If something isn't covered (pricing, integrations, exact languages, certifications), don't guess or invent numbers, customers, accuracy figures or timelines. Say the team will share details, and offer to have them get in touch.
- Always keep the teacher-first framing: AI suggests, the teacher reviews and approves.
- Never ask for or accept student information (names, marks, answer sheets). If a visitor shares some, don't repeat it.
- Politely steer unrelated questions back to Paatam.

Collecting the lead:
- Good moments: the visitor asks about pricing, a demo, a pilot, onboarding, or says they want Paatam for their school.
- Ask naturally, one or two details at a time, never as a long form. Required: their name and a phone/WhatsApp number or email. Also try for: school name, role, city, approximate number of students, and what they're most interested in.
- If they decline to share something, accept it and keep helping.
- Read the phone number or email back once to confirm it before saving.
- As soon as you have a confirmed name plus phone or email, call save_lead once, with a one-line summary of what they asked about and want. Then tell them the Paatam team will reach out, and ask if there's anything else you can help with.
- Call save_lead only once per conversation, unless the visitor corrects their details.

<product_knowledge>
${knowledge}
</product_knowledge>`;

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "save_lead",
    description:
      "Save an interested visitor's contact details and send them to the Paatam team. Call once you have the visitor's name and a confirmed phone number or email.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["name", "summary"],
      properties: {
        name: { type: "string", description: "Visitor's full name" },
        phone: { type: "string", description: "Phone / WhatsApp number, with country code if given" },
        email: { type: "string", description: "Email address" },
        school: { type: "string", description: "School or institution name" },
        role: { type: "string", description: "e.g. Principal, Owner, Coordinator, Teacher, Parent" },
        city: { type: "string" },
        students: { type: "string", description: "Approximate number of students" },
        interest: { type: "string", description: "What they want: demo, pilot, pricing, a specific module" },
        preferred_time: { type: "string", description: "When they prefer to be contacted" },
        notes: { type: "string", description: "Anything else useful for the team" },
        summary: { type: "string", description: "One-line summary of the conversation and what the visitor wants" },
      },
    },
  },
];

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

type Turn = { role: "user" | "assistant"; text: string };

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

let client: Anthropic | undefined;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY?.trim()) return json({ error: "not_configured" }, 503);

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

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.text })),
    { role: "user", content: message },
  ];

  client ??= new Anthropic();
  try {
    for (let step = 0; step < 3; step++) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 4000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        tools: TOOLS,
        messages,
      });

      if (response.stop_reason === "refusal") {
        return json({ reply: "Sorry, I can't help with that. I'm happy to answer questions about Paatam.", leadSaved });
      }

      const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
        const reply = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return json({ reply: reply || "Sorry, could you rephrase that?", leadSaved });
      }

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const tu of toolUses) {
        results.push({ type: "tool_result", tool_use_id: tu.id, ...(await saveLead(tu, page)) });
        if (tu.name === "save_lead" && !results.at(-1)!.is_error) leadSaved = true;
      }
      messages.push({ role: "user", content: results });
    }
    return json({ reply: "Thank you! The Paatam team will be in touch shortly.", leadSaved });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.error("[chat] Claude rate limit", error.message);
    else if (error instanceof Anthropic.AuthenticationError) console.error("[chat] ANTHROPIC_API_KEY was rejected");
    else if (error instanceof Anthropic.APIError) console.error(`[chat] Claude API ${error.status}`, error.message);
    else console.error("[chat]", error);
    return json({ error: "unavailable" }, 502);
  }
}

async function saveLead(tu: Anthropic.Beta.BetaToolUseBlock, page: string) {
  if (tu.name !== "save_lead") return { content: `Unknown tool ${tu.name}`, is_error: true };
  const lead = cleanLead(tu.input);
  if (!lead) {
    return { content: "Not saved: need the visitor's name and a valid phone number or email. Ask for the missing detail.", is_error: true };
  }
  try {
    await deliverLead(lead, page);
    return { content: "Saved. The Paatam team has been notified and will reach out." };
  } catch (error) {
    console.error("[chat] lead delivery failed", error);
    return {
      content: "Saving failed on our side. Apologise, and ask the visitor to use the Contact page (/contact) so the team gets their details.",
      is_error: true,
    };
  }
}
