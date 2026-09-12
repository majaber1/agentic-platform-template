import { getMcpRegistryStatus } from "../mcp/registry";

export type ComponentState = "ACTIVE" | "CONFIGURED" | "NOT_CONFIGURED" | "SCAFFOLDED" | "PLANNED" | "OPTIONAL";

export function getRuntimeStatus() {
  const gatewayConfigured = Boolean(process.env.MODEL_GATEWAY_BASE_URL && process.env.DEFAULT_MODEL);
  const externalMcp = getMcpRegistryStatus().filter((server) => server.enabled);
  const approvalConfigured = Boolean(process.env.APPROVAL_SIGNING_SECRET);

  return {
    service: "agentic-platform-template",
    architecture: "baseline-v1",
    runtime: "phase3-governed-actions",
    components: [
      { name: "Own UI", state: "ACTIVE" as ComponentState, detail: "Next.js runtime dashboard" },
      { name: "LangGraph", state: "ACTIVE" as ComponentState, detail: "Stateful request routing" },
      { name: "Tool Registry", state: "ACTIVE" as ComponentState, detail: "Scoped local tool registry" },
      { name: "Action Policy", state: "ACTIVE" as ComponentState, detail: "Write tools fail closed behind bounded approvals" },
      { name: "Human Approval Integration", state: approvalConfigured ? "CONFIGURED" as ComponentState : "NOT_CONFIGURED" as ComponentState, detail: approvalConfigured ? "Approval signature verification enabled" : "No signing secret: approval-required writes remain denied" },
      { name: "MCP Core", state: "ACTIVE" as ComponentState, detail: "Official MCP v2 client/server protocol path" },
      { name: "External MCP Connectors", state: externalMcp.length ? "CONFIGURED" as ComponentState : "NOT_CONFIGURED" as ComponentState, detail: externalMcp.length ? `${externalMcp.length} enabled server(s)` : "Set approved entries in MCP_SERVERS_JSON" },
      { name: "Model Gateway", state: gatewayConfigured ? "CONFIGURED" as ComponentState : "NOT_CONFIGURED" as ComponentState, detail: gatewayConfigured ? `${process.env.DEFAULT_MODEL} via OpenAI-compatible endpoint` : "Set MODEL_GATEWAY_BASE_URL and DEFAULT_MODEL" },
      { name: "Persistent Memory", state: "PLANNED" as ComponentState, detail: "No fake memory fallback; durable provider not configured" },
      { name: "Observability", state: "SCAFFOLDED" as ComponentState, detail: "Trace envelope exists; external collector instrumentation is next" },
      { name: "Promptfoo", state: "SCAFFOLDED" as ComponentState, detail: "HTTP evaluation config included" },
      { name: "Browser Use", state: "OPTIONAL" as ComponentState, detail: "Not enabled by default" }
    ]
  };
}
