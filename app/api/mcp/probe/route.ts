import { probeRemoteMcpServer } from "../../../../lib/mcp/remote-client";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("server")?.trim() || "";
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) return Response.json({ error: "A valid configured server ID is required." }, { status: 400 });
  const result = await probeRemoteMcpServer(id);
  const status = result.status === "OK" ? 200 : result.status === "NOT_CONFIGURED" ? 404 : 502;
  return Response.json(result, { status, headers: { "Cache-Control": "no-store" } });
}
