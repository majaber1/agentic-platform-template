# Security Baseline

## Agent security
- Least privilege by default.
- Prefer read-only tools before write-capable tools.
- Sensitive writes require explicit approval when business risk warrants it.
- Never persist raw credentials in prompts or configuration.
- Use secret references and approved secret management.

## Connector security
Document authentication, authorization, token storage, scopes, data residency, audit trail, retries, and timeouts for every integration.

## Browser automation
Prefer API, then MCP, then browser automation unless the business workflow specifically requires browser interaction.
