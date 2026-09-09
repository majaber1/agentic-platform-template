export async function GET() {
  return Response.json({
    status: "ok",
    service: "agentic-platform-template",
    architecture: "baseline-v1",
  });
}
