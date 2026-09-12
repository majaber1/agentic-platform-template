import { runAgent } from "../../../../../lib/runtime/graph";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runAgent("platform status");
  const passed = result.status === "OK" && result.trace.includes("classify") && result.trace.includes("tool:platform_status") && result.output.includes("phase1-core-runtime");

  return Response.json({
    passed,
    test: "UI-independent LangGraph -> scoped tool registry E2E",
    status: result.status,
    trace: result.trace,
    output: result.output
  }, { status: passed ? 200 : 500, headers: { "Cache-Control": "no-store" } });
}
