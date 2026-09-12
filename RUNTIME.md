# Core Runtime

## Phase 1 — LangGraph
Production-tested: real LangGraph graph, scoped local tool registry, truthful OpenAI-compatible gateway adapter, runtime APIs/UI, Promptfoo scaffold.

## Phase 2 — MCP Core
Production-tested: official MCP v2 client/server protocol path, MCP tool discovery/call, LangGraph MCP route, governed remote MCP registry and Streamable HTTP probe.

## Phase 3 — Governed Actions
Implemented:
- request IDs on executions
- read/write tool metadata
- central execution policy gate
- bounded HMAC approval verification for sensitive writes
- fail-closed behavior when approval infrastructure is absent
- policy self-test that proves deny-without-approval and accept-with-correct-bound approval without performing any write

### E2E endpoints
- `GET /api/runtime/selftest`
- `GET /api/mcp/selftest`
- `GET /api/policy/selftest`
- `GET /api/runtime/status`
- `POST /api/agent/run`

## Truthful boundaries
A real LLM is not active until `MODEL_GATEWAY_BASE_URL` and `DEFAULT_MODEL` are configured. External MCP connectors are not active until `MCP_SERVERS_JSON` is configured. Persistent memory and an external observability collector are not active yet. No fallback is presented as production persistence.
