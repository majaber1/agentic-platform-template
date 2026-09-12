import { getMcpRegistryStatus } from "../../../../lib/mcp/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ servers: getMcpRegistryStatus() }, { headers: { "Cache-Control": "no-store" } });
}
