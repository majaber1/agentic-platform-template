import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { getMcpServer } from "./registry";

export async function probeRemoteMcpServer(id: string) {
  const config = getMcpServer(id);
  if (!config) return { status: "NOT_CONFIGURED" as const, id, tools: [], error: "MCP server ID is not enabled in MCP_SERVERS_JSON." };

  const token = config.tokenEnv ? process.env[config.tokenEnv] : undefined;
  const client = new Client(
    { name: "agentic-platform-template", version: "0.3.0" },
    { versionNegotiation: { mode: "auto" } }
  );
  const transport = new StreamableHTTPClientTransport(new URL(config.url), {
    requestInit: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    await client.connect(transport, { signal: controller.signal });
    const result = await client.listTools(undefined, { signal: controller.signal });
    return {
      status: "OK" as const,
      id,
      protocolEra: client.getProtocolEra(),
      tools: result.tools.map((tool) => ({ name: tool.name, description: tool.description }))
    };
  } catch (error) {
    return {
      status: "ERROR" as const,
      id,
      tools: [],
      error: error instanceof Error ? error.message : "Unknown MCP connection error"
    };
  } finally {
    clearTimeout(timeout);
    await client.close().catch(() => undefined);
  }
}
