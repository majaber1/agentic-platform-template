import { runAgent } from "../../../../lib/runtime/graph";

export const dynamic = "force-dynamic";

export async function GET() {
  const local = await runAgent("platform status");
  const mcp = await runAgent("mcp status");
  const passed = local.status === "OK" && local.trace.includes("tool:platform_status") && local.output.includes("phase2-mcp-core") && mcp.status === "OK" && mcp.trace.includes("mcp:selftest") && mcp.output.includes("mcp_platform_status");

  return Response.json({
    passed,
    test: "LangGraph -> local tool AND LangGraph -> MCP protocol tool",
    local: { status: local.status, trace: local.trace },
    mcp: { status: mcp.status, trace: mcp.trace }
  }, { status: passed ? 200 : 500, headers: { "Cache-Control": "no-store" } });
}
