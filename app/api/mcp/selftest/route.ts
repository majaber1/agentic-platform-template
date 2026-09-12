import { runMcpCoreSelfTest } from "../../../../lib/mcp/core";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runMcpCoreSelfTest();
  return Response.json(
    { test: "real MCP Client -> MCP Server -> registered tool", ...result },
    { status: result.passed ? 200 : 500, headers: { "Cache-Control": "no-store" } }
  );
}
