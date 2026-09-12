import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { callModel } from "./model-gateway";
import { getTool } from "./tools";

const RuntimeState = Annotation.Root({
  message: Annotation<string>,
  route: Annotation<"tool" | "model">,
  toolName: Annotation<string>,
  output: Annotation<string>,
  status: Annotation<"OK" | "NOT_CONFIGURED" | "ERROR">,
  trace: Annotation<string[]>({ reducer: (left, right) => left.concat(right), default: () => [] })
});

function shouldUseStatusTool(message: string) {
  const normalized = message.toLowerCase().trim();
  return ["platform status", "runtime status", "health", "status", "حالة المنصة", "حالة النظام", "الحالة"].some((phrase) => normalized.includes(phrase));
}

const graph = new StateGraph(RuntimeState)
  .addNode("classify", async (state) => ({
    route: shouldUseStatusTool(state.message) ? "tool" as const : "model" as const,
    toolName: shouldUseStatusTool(state.message) ? "platform_status" : "",
    trace: ["classify"]
  }))
  .addNode("tool", async (state) => {
    const tool = getTool(state.toolName);
    if (!tool) return { status: "ERROR" as const, output: `Tool ${state.toolName} is not registered.`, trace: ["tool:not-found"] };
    const result = await tool.execute({ input: state.message });
    return { status: "OK" as const, output: JSON.stringify(result, null, 2), trace: [`tool:${tool.name}`] };
  })
  .addNode("model", async (state) => {
    const result = await callModel(state.message);
    return { status: result.status, output: result.output, trace: [`model:${result.model ?? "not-configured"}`] };
  })
  .addEdge(START, "classify")
  .addConditionalEdges("classify", (state) => state.route, { tool: "tool", model: "model" })
  .addEdge("tool", END)
  .addEdge("model", END)
  .compile();

export async function runAgent(message: string) {
  return graph.invoke({ message, route: "model", toolName: "", output: "", status: "OK", trace: [] });
}
