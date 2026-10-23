import { ApiError, GoogleGenAI, type Content, type FunctionDeclaration } from "@google/genai";
import { SAVE_LEAD, SYSTEM_PROMPT, type SaveLead, type Turn } from "./prompt";

/** Radha on Google Gemini. Uses GEMINI_API_KEY; GEMINI_MODEL overrides the model. */

const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";

const SAVE_LEAD_DECLARATION: FunctionDeclaration = {
  name: SAVE_LEAD.name,
  description: SAVE_LEAD.description,
  parametersJsonSchema: SAVE_LEAD.parameters,
};

let ai: GoogleGenAI | undefined;

export async function replyWithGemini(history: Turn[], message: string, saveLead: SaveLead): Promise<string> {
  ai ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY?.trim() });
  const contents: Content[] = [
    ...history.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.text }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  for (let step = 0; step < 3; step++) {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: [SAVE_LEAD_DECLARATION] }],
      },
    });

    const calls = response.functionCalls ?? [];
    const modelTurn = response.candidates?.[0]?.content;
    if (calls.length === 0 || !modelTurn) {
      const reply = response.text?.trim();
      if (!reply && response.promptFeedback?.blockReason) {
        return "Sorry, I can't help with that. I'm happy to answer questions about Paatam.";
      }
      return reply || "Sorry, could you rephrase that?";
    }

    // Send the model's turn back unchanged (it can carry thought signatures), then the results.
    contents.push(modelTurn);
    const parts = [];
    for (const call of calls) {
      const result =
        call.name === SAVE_LEAD.name ? await saveLead(call.args) : { ok: false, message: `Unknown tool ${call.name}` };
      parts.push({
        functionResponse: {
          id: call.id,
          name: call.name,
          response: result.ok ? { output: result.message } : { error: result.message },
        },
      });
    }
    contents.push({ role: "user", parts });
  }
  return "Thank you! The Paatam team will be in touch shortly.";
}

export function describeGeminiError(error: unknown) {
  if (error instanceof ApiError) return `Gemini API ${error.status}: ${error.message}`;
  return undefined;
}
