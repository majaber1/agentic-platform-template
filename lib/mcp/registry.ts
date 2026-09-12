export type McpServerConfig = {
  id: string;
  url: string;
  tokenEnv?: string;
  enabled: boolean;
};

function isAllowedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return true;
    return url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function getMcpRegistry(): McpServerConfig[] {
  const raw = process.env.MCP_SERVERS_JSON || "[]";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const seen = new Set<string>();
  return parsed.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Record<string, unknown>;
    const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
    const url = typeof candidate.url === "string" ? candidate.url.trim() : "";
    const enabled = candidate.enabled !== false;
    const tokenEnv = typeof candidate.tokenEnv === "string" ? candidate.tokenEnv.trim() : undefined;
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id) || seen.has(id) || !isAllowedUrl(url)) return [];
    seen.add(id);
    return [{ id, url, enabled, ...(tokenEnv ? { tokenEnv } : {}) }];
  });
}

export function getMcpServer(id: string) {
  return getMcpRegistry().find((server) => server.id === id && server.enabled);
}

export function getMcpRegistryStatus() {
  return getMcpRegistry().map((server) => {
    const url = new URL(server.url);
    return {
      id: server.id,
      endpoint: `${url.protocol}//${url.host}${url.pathname}`,
      enabled: server.enabled,
      authConfigured: Boolean(server.tokenEnv && process.env[server.tokenEnv])
    };
  });
}
