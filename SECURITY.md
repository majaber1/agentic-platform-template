# Security Baseline

## Agent security
- Least privilege by default.
- Prefer read-only tools before write-capable tools.
- Every registered tool declares read/write mode and approval requirement.
- Approval-required writes fail closed when approval infrastructure is absent.
- Approval tokens are bounded to request ID, exact tool name, exact arguments, and short expiry.
- Never persist raw credentials in prompts or configuration.
- Use secret references and approved secret management.

## Connector security
Document authentication, authorization, token storage, scopes, data residency, audit trail, retries, and timeouts for every integration.
Remote MCP URLs come from an operator-controlled registry, never directly from a user request.

## Browser automation
Prefer API, then MCP, then browser automation unless the business workflow specifically requires browser interaction.

See `GOVERNED_ACTIONS.md` for the write-action approval contract.
