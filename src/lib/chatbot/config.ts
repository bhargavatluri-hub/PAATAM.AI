/**
 * How the chatbot authenticates to the Claude API; the client itself is built in claude.ts.
 * Two options (server-only env vars):
 *
 * Workload identity federation (recommended on Vercel: no API key to store or rotate).
 * Vercel's OIDC token for each request is exchanged for a short-lived Claude token.
 *   ANTHROPIC_FEDERATION_RULE_ID   fdrl_... federation rule in the Claude Console
 *   ANTHROPIC_ORGANIZATION_ID      Anthropic organization UUID
 *   ANTHROPIC_SERVICE_ACCOUNT_ID   svac_... service account the token acts as
 *   ANTHROPIC_WORKSPACE_ID         Optional wrkspc_..., needed only if the rule spans several workspaces
 *
 * API key: ANTHROPIC_API_KEY. Takes precedence when set.
 */

export function env(name: string) {
  return process.env[name]?.trim() || undefined;
}

export function federation() {
  const federationRuleId = env("ANTHROPIC_FEDERATION_RULE_ID");
  const organizationId = env("ANTHROPIC_ORGANIZATION_ID");
  const serviceAccountId = env("ANTHROPIC_SERVICE_ACCOUNT_ID");
  if (!federationRuleId || !organizationId || !serviceAccountId) return undefined;
  return { federationRuleId, organizationId, serviceAccountId, workspaceId: env("ANTHROPIC_WORKSPACE_ID") };
}

/** Whether the chatbot has a way to reach Claude. The widget is hidden otherwise. */
export function chatConfigured() {
  return Boolean(env("ANTHROPIC_API_KEY") || federation());
}
