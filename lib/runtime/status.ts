export type ComponentState = "ACTIVE" | "CONFIGURED" | "NOT_CONFIGURED" | "SCAFFOLDED" | "PLANNED" | "OPTIONAL";

export function getRuntimeStatus() {
  const gatewayConfigured = Boolean(process.env.MODEL_GATEWAY_BASE_URL && process.env.DEFAULT_MODEL);

  return {
    service: "agentic-platform-template",
    architecture: "baseline-v1",
    runtime: "phase1-core-runtime",
    components: [
      { name: "Own UI", state: "ACTIVE" as ComponentState, detail: "Next.js runtime dashboard" },
      { name: "LangGraph", state: "ACTIVE" as ComponentState, detail: "Stateful request routing" },
      { name: "Tool Registry", state: "ACTIVE" as ComponentState, detail: "Scoped local tool registry" },
      { name: "MCP Transport", state: "PLANNED" as ComponentState, detail: "Remote MCP connectors are not enabled yet" },
      { name: "Model Gateway", state: gatewayConfigured ? "CONFIGURED" as ComponentState : "NOT_CONFIGURED" as ComponentState, detail: gatewayConfigured ? `${process.env.DEFAULT_MODEL} via OpenAI-compatible endpoint` : "Set MODEL_GATEWAY_BASE_URL and DEFAULT_MODEL" },
      { name: "Mem0", state: "PLANNED" as ComponentState, detail: "Memory is not active in Phase 1" },
      { name: "OpenLIT", state: "SCAFFOLDED" as ComponentState, detail: "Observability policy exists; runtime instrumentation is next" },
      { name: "Promptfoo", state: "SCAFFOLDED" as ComponentState, detail: "HTTP evaluation config included" },
      { name: "Browser Use", state: "OPTIONAL" as ComponentState, detail: "Not enabled by default" }
    ]
  };
}
