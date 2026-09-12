# Governed Actions and Human Approval

## Default policy

- Read-only tools may execute without human approval when authorization permits.
- Write tools that declare `requiresApproval: true` fail closed.
- If `APPROVAL_SIGNING_SECRET` is absent, approval-required writes cannot execute.
- An approval is bound to request ID, exact tool name, exact canonicalized arguments, and a short expiry.
- Reusing an approval for different arguments or another tool fails verification.

## Token format

`v1:<expiresAtEpochMs>:<HMAC-SHA256>`

The HMAC covers:

`requestId | toolName | sha256(canonicalArgs) | expiresAt`

## Integration rule

The template intentionally exposes **no public endpoint that signs approvals**. A project must issue approvals only from an authenticated, authorized human-review backend. The runtime only verifies them.

## Production requirement

Before registering a real write tool, the project must add:
1. authenticated user identity
2. authorization/role check
3. human review UX where required
4. audit/persistence target
5. tool-specific E2E and failure tests
