import Anthropic from "@anthropic-ai/sdk";
import { SAVE_LEAD, SYSTEM_PROMPT, type SaveLead, type Turn } from "./prompt";

/** Radha on Claude. Uses ANTHROPIC_API_KEY; CHAT_MODEL overrides the model. */

const MODEL = process.env.CHAT_MODEL?.trim() || "claude-opus-5-5";

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: SAVE_LEAD.name,
    description: SAVE_LEAD.description,
    strict: true,
    input_schema: SAVE_LEAD.parameters,
  },
];

let client: Anthropic | undefined;

export async function replyWithClaude(history: Turn[], message: string, saveLead: SaveLead): Promise<string> {
  client ??= new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.text })),
    { role: "user", content: message },
  ];

  for (let step = 0; step < 3; step++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return "Sorry, I can't help with that. I'm happy to answer questions about Paatam.";
    }

    const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      const reply = response.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return reply || "Sorry, could you rephrase that?";
    }

    messages.push({ role: "assistant", content: response.content });
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      const result =
        tu.name === SAVE_LEAD.name ? await saveLead(tu.input) : { ok: false, message: `Unknown tool ${tu.name}` };
      results.push({ type: "tool_result", tool_use_id: tu.id, content: result.message, is_error: !result.ok });
    }
    messages.push({ role: "user", content: results });
  }
  return "Thank you! The Paatam team will be in touch shortly.";
}

export function describeClaudeError(error: unknown) {
  if (error instanceof Anthropic.RateLimitError) return `Claude rate limit: ${error.message}`;
  if (error instanceof Anthropic.AuthenticationError) return "ANTHROPIC_API_KEY was rejected";
  if (error instanceof Anthropic.APIError) return `Claude API ${error.status}: ${error.message}`;
  return undefined;
}
