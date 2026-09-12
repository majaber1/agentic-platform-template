import { getRuntimeStatus } from "./status";
import { authorizeTool, type ToolMode } from "./policy";

export type ToolContext = { input: string; requestId: string; approvalToken?: string };
export type RegisteredTool = {
  name: string;
  description: string;
  mode: ToolMode;
  requiresApproval: boolean;
  execute: (context: ToolContext) => Promise<unknown>;
};

const platformStatus: RegisteredTool = {
  name: "platform_status",
  description: "Return the real configuration state of the agentic platform runtime.",
  mode: "read",
  requiresApproval: false,
  execute: async () => getRuntimeStatus()
};

export const toolRegistry = [platformStatus] as const;

export function getTool(name: string) {
  return toolRegistry.find((tool) => tool.name === name);
}

export function listTools() {
  return toolRegistry.map(({ name, description, mode, requiresApproval }) => ({ name, description, mode, requiresApproval }));
}

export async function executeTool(name: string, args: unknown, context: ToolContext) {
  const tool = getTool(name);
  if (!tool) return { status: "ERROR" as const, error: `Tool ${name} is not registered.` };
  const authorization = authorizeTool(
    { mode: tool.mode, requiresApproval: tool.requiresApproval },
    { requestId: context.requestId, toolName: tool.name, args },
    context.approvalToken
  );
  if (!authorization.allowed) return { status: "APPROVAL_REQUIRED" as const, error: authorization.reason };
  return { status: "OK" as const, result: await tool.execute(context) };
}
