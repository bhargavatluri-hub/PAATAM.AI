import Anthropic from "@anthropic-ai/sdk";
import { oidcFederationProvider } from "@anthropic-ai/sdk/lib/credentials/oidc-federation";
import { getVercelOidcToken } from "@vercel/oidc";
import { env, federation } from "./config";

/** Claude client for the chatbot, using federation or an API key as configured in config.ts. */
export function createClaudeClient() {
  const fed = federation();
  if (env("ANTHROPIC_API_KEY") || !fed) return new Anthropic();
  return new Anthropic({
    credentials: oidcFederationProvider({
      ...fed,
      // Reads the x-vercel-oidc-token header of the current request (VERCEL_OIDC_TOKEN locally).
      identityTokenProvider: () => getVercelOidcToken(),
      baseURL: env("ANTHROPIC_BASE_URL") ?? "https://api.anthropic.com",
      fetch: (...args) => fetch(...args),
    }),
  });
}
