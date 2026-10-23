/**
 * Which AI model powers Radha (server-only env vars, read at request and build time):
 *   GEMINI_API_KEY     Google Gemini. Used whenever it is set.
 *   ANTHROPIC_API_KEY  Claude. Used when GEMINI_API_KEY is not set.
 * With neither set, the chat bubble is hidden and the API returns not_configured.
 */
export function chatProvider(): "gemini" | "claude" | null {
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "claude";
  return null;
}
