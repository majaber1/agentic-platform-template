import { randomUUID } from "node:crypto";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { runMcpCoreSelfTest } from "../mcp/core";
import { callModel } from "./model-gateway";
import { executeTool } from "./tools";

const RuntimeState = Annotation.Root({
  requestId: Annotation<string>,
  message: Annotation<string>,
  approvalToken: Annotation<string>,
  route: Annotation<"tool" | "mcp" | "model">,
  toolName: Annotation<string>,
  output: Annotation<string>,
  status: Annotation<"OK" | "NOT_CONFIGURED" | "APPROVAL_REQUIRED" | "ERROR">,
  trace: Annotation<string[]>({ reducer: (left, right) => left.concat(right), default: () => [] })
});

function isMcpRequest(message: string) {
  const normalized = message.toLowerCase().trim();
  return ["mcp status", "mcp selftest", "mcp self-test", "حالة mcp", "اختبار mcp"].some((phrase) => normalized.includes(phrase));
}

function isStatusRequest(message: string) {
  const normalized = message.toLowerCase().trim();
  return ["platform status", "runtime status", "health", "status", "حالة المنصة", "حالة النظام", "الحالة"].some((phrase) => normalized.includes(phrase));
}

const graph = new StateGraph(RuntimeState)
  .addNode("classify", async (state) => {
    if (isMcpRequest(state.message)) return { route: "mcp" as const, toolName: "", trace: ["classify"] };
    if (isStatusRequest(state.message)) return { route: "tool" as const, toolName: "platform_status", trace: ["classify"] };
    return { route: "model" as const, toolName: "", trace: ["classify"] };
  })
  .addNode("tool", async (state) => {
    const execution = await executeTool(state.toolName, { input: state.message }, { input: state.message, requestId: state.requestId, approvalToken: state.approvalToken || undefined });
    if (execution.status !== "OK") return { status: execution.status, output: execution.error, trace: [`tool:${state.toolName}:${execution.status.toLowerCase()}`] };
    return { status: "OK" as const, output: JSON.stringify(execution.result, null, 2), trace: [`tool:${state.toolName}`] };
  })
  .addNode("mcp", async () => {
    const result = await runMcpCoreSelfTest();
    return { status: result.passed ? "OK" as const : "ERROR" as const, output: JSON.stringify(result, null, 2), trace: ["mcp:selftest"] };
  })
  .addNode("model", async (state) => {
    const result = await callModel(state.message);
    return { status: result.status, output: result.output, trace: [`model:${result.model ?? "not-configured"}`] };
  })
  .addEdge(START, "classify")
  .addConditionalEdges("classify", (state) => state.route, { tool: "tool", mcp: "mcp", model: "model" })
  .addEdge("tool", END)
  .addEdge("mcp", END)
  .addEdge("model", END)
  .compile();

export async function runAgent(message: string, options: { approvalToken?: string; requestId?: string } = {}) {
  return graph.invoke({ requestId: options.requestId || randomUUID(), message, approvalToken: options.approvalToken || "", route: "model", toolName: "", output: "", status: "OK", trace: [] });
}
