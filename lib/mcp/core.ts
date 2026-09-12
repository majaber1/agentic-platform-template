import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { McpServer } from "@modelcontextprotocol/server";
import { getRuntimeStatus } from "../runtime/status";

function extractText(content: unknown) {
  if (!Array.isArray(content)) return "";
  return content
    .filter((block): block is { type: "text"; text: string } => Boolean(block && typeof block === "object" && (block as { type?: unknown }).type === "text" && typeof (block as { text?: unknown }).text === "string"))
    .map((block) => block.text)
    .join("\n");
}

export async function runMcpCoreSelfTest() {
  const server = new McpServer({ name: "agentic-platform-template", version: "0.4.0" });
  server.registerTool(
    "mcp_platform_status",
    {
      description: "Return the current agentic platform runtime status through the MCP protocol.",
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true }
    },
    async () => ({
      content: [{ type: "text" as const, text: JSON.stringify(getRuntimeStatus()) }]
    })
  );

  const client = new Client({ name: "agentic-platform-selftest", version: "0.4.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const listed = await client.listTools();
    const result = await client.callTool({ name: "mcp_platform_status", arguments: {} });
    const text = extractText(result.content);
    let payload: { service?: string; architecture?: string; components?: { name?: string; state?: string }[] } = {};
    try { payload = JSON.parse(text); } catch { payload = {}; }
    const mcpActive = payload.components?.some((component) => component.name === "MCP Core" && component.state === "ACTIVE") ?? false;
    const passed = listed.tools.some((tool) => tool.name === "mcp_platform_status") && payload.service === "agentic-platform-template" && payload.architecture === "baseline-v1" && mcpActive;

    return {
      passed,
      protocolEra: client.getProtocolEra?.() ?? "legacy/in-memory",
      tools: listed.tools.map((tool) => ({ name: tool.name, description: tool.description })),
      resultText: text
    };
  } finally {
    await client.close();
    await server.close();
  }
}
