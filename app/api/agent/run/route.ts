import { runAgent } from "../../../../lib/runtime/graph";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const message = typeof (body as { message?: unknown })?.message === "string" ? (body as { message: string }).message.trim() : "";
  if (!message) return Response.json({ error: "message is required." }, { status: 400 });
  if (message.length > 8000) return Response.json({ error: "message exceeds 8000 characters." }, { status: 413 });

  const result = await runAgent(message);
  const httpStatus = result.status === "NOT_CONFIGURED" ? 503 : result.status === "ERROR" ? 502 : 200;

  return Response.json({
    status: result.status,
    output: result.output,
    trace: result.trace,
    architecture: "LangGraph -> scoped tool registry or model gateway"
  }, { status: httpStatus, headers: { "Cache-Control": "no-store" } });
}
