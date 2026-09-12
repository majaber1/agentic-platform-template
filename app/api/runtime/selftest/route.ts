import { runAgent } from "../../../../lib/runtime/graph";
import { runPolicySelfTest } from "../../../../lib/runtime/policy";

export const dynamic = "force-dynamic";

export async function GET() {
  const local = await runAgent("platform status");
  const mcp = await runAgent("mcp status");
  const policy = runPolicySelfTest();
  const passed = local.status === "OK" && local.trace.includes("tool:platform_status") && local.output.includes("phase3-governed-actions") && mcp.status === "OK" && mcp.trace.includes("mcp:selftest") && mcp.output.includes("mcp_platform_status") && policy.passed;

  return Response.json({
    passed,
    test: "LangGraph local tool + MCP protocol + write-action policy gate",
    local: { requestId: local.requestId, status: local.status, trace: local.trace },
    mcp: { requestId: mcp.requestId, status: mcp.status, trace: mcp.trace },
    policy: { passed: policy.passed, deniedWithoutApproval: !policy.denied.allowed, acceptedWithBoundedApproval: policy.approved.allowed }
  }, { status: passed ? 200 : 500, headers: { "Cache-Control": "no-store" } });
}
