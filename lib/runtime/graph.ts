import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { runMcpCoreSelfTest } from "../mcp/core";
import { callModel } from "./model-gateway";
import { getTool } from "./tools";

const RuntimeState = Annotation.Root({
  message: Annotation<string>,
  route: Annotation<"tool" | "mcp" | "model">,
  toolName: Annotation<string>,
  output: Annotation<string>,
  status: Annotation<"OK" | "NOT_CONFIGURED" | "ERROR">,
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
    const tool = getTool(state.toolName);
    if (!tool) return { status: "ERROR" as const, output: `Tool ${state.toolName} is not registered.`, trace: ["tool:not-found"] };
    const result = await tool.execute({ input: state.message });
    return { status: "OK" as const, output: JSON.stringify(result, null, 2), trace: [`tool:${tool.name}`] };
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

export async function runAgent(message: string) {
  return graph.invoke({ message, route: "model", toolName: "", output: "", status: "OK", trace: [] });
}
