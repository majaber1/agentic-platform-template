import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type ToolMode = "read" | "write";
export type ToolPolicy = { mode: ToolMode; requiresApproval: boolean };
export type ApprovalSubject = { requestId: string; toolName: string; args: unknown; expiresAt: number };

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonicalize(v)]));
  }
  return value;
}

function argsHash(args: unknown) {
  return createHash("sha256").update(JSON.stringify(canonicalize(args))).digest("hex");
}

function approvalPayload(subject: ApprovalSubject) {
  return `${subject.requestId}|${subject.toolName}|${argsHash(subject.args)}|${subject.expiresAt}`;
}

export function createApprovalToken(subject: ApprovalSubject, secret: string) {
  const signature = createHmac("sha256", secret).update(approvalPayload(subject)).digest("hex");
  return `v1:${subject.expiresAt}:${signature}`;
}

export function verifyApprovalToken(subject: Omit<ApprovalSubject, "expiresAt">, token: string | undefined, secret = process.env.APPROVAL_SIGNING_SECRET) {
  if (!secret || !token) return false;
  const parts = token.split(":");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now() || expiresAt > Date.now() + 10 * 60_000) return false;
  const expected = createApprovalToken({ ...subject, expiresAt }, secret);
  const expectedBuffer = Buffer.from(expected);
  const tokenBuffer = Buffer.from(token);
  return expectedBuffer.length === tokenBuffer.length && timingSafeEqual(expectedBuffer, tokenBuffer);
}

export function authorizeTool(policy: ToolPolicy, subject: Omit<ApprovalSubject, "expiresAt">, token?: string, secret?: string) {
  if (policy.mode === "read" && !policy.requiresApproval) return { allowed: true as const, reason: "read-only tool" };
  if (!policy.requiresApproval) return { allowed: true as const, reason: "policy does not require approval" };
  const allowed = verifyApprovalToken(subject, token, secret);
  return { allowed, reason: allowed ? "valid bounded approval" : "write action requires a valid bounded approval" };
}

export function runPolicySelfTest() {
  const requestId = "policy-selftest";
  const toolName = "synthetic_write_descriptor";
  const args = { recordId: "example", action: "update" };
  const secret = "selftest-only-secret";
  const expiresAt = Date.now() + 60_000;
  const read = authorizeTool({ mode: "read", requiresApproval: false }, { requestId, toolName: "read_status", args });
  const denied = authorizeTool({ mode: "write", requiresApproval: true }, { requestId, toolName, args }, undefined, secret);
  const token = createApprovalToken({ requestId, toolName, args, expiresAt }, secret);
  const approved = authorizeTool({ mode: "write", requiresApproval: true }, { requestId, toolName, args }, token, secret);
  return { passed: read.allowed && !denied.allowed && approved.allowed, read, denied, approved, note: "No write action is executed by this self-test; it verifies the enforcement gate only." };
}
