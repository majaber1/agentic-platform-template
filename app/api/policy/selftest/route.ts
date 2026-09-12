import { runPolicySelfTest } from "../../../../lib/runtime/policy";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = runPolicySelfTest();
  return Response.json({ test: "write-tool approval enforcement", ...result }, { status: result.passed ? 200 : 500, headers: { "Cache-Control": "no-store" } });
}
