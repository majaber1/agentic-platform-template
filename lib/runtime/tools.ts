import { getRuntimeStatus } from "./status";

export type ToolContext = { input: string };
export type RegisteredTool = {
  name: string;
  description: string;
  mode: "read" | "write";
  execute: (context: ToolContext) => Promise<unknown>;
};

const platformStatus: RegisteredTool = {
  name: "platform_status",
  description: "Return the real configuration state of the agentic platform runtime.",
  mode: "read",
  execute: async () => getRuntimeStatus()
};

export const toolRegistry = [platformStatus] as const;

export function getTool(name: string) {
  return toolRegistry.find((tool) => tool.name === name);
}

export function listTools() {
  return toolRegistry.map(({ name, description, mode }) => ({ name, description, mode }));
}
