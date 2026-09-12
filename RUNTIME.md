# Core Runtime

## Phase 1 — LangGraph
Implemented and production-tested:
- real LangGraph state graph
- scoped local tool registry
- truthful OpenAI-compatible model-gateway adapter
- runtime status + self-test APIs
- runtime console
- Promptfoo HTTP evaluation scaffold

## Phase 2 — MCP Core
Implemented:
- official MCP TypeScript SDK v2 client/server packages
- real in-memory MCP protocol E2E for deterministic self-test
- `mcp_platform_status` read-only MCP tool
- LangGraph MCP route
- approved remote MCP registry from `MCP_SERVERS_JSON`
- remote Streamable HTTP probe by configured server ID only
- no arbitrary request-supplied MCP URL

### Endpoints
- `GET /api/mcp/selftest`
- `GET /api/mcp/status`
- `GET /api/mcp/probe?server=<configured-id>`
- `GET /api/runtime/selftest`
- `POST /api/agent/run`

## Truthful boundaries
The template does not ship a fake LLM. Without `MODEL_GATEWAY_BASE_URL` and `DEFAULT_MODEL`, model requests return `NOT_CONFIGURED`.

External MCP servers are not Active unless they are explicitly supplied in `MCP_SERVERS_JSON`. Mem0, OpenLIT instrumentation, Browser Use, persistent business storage, authentication and write approvals remain governed later phases.
