import { getRuntimeStatus } from "../../../../lib/runtime/status";
import { listTools } from "../../../../lib/runtime/tools";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ...getRuntimeStatus(), tools: listTools() }, { headers: { "Cache-Control": "no-store" } });
}
