# Template Status

Current baseline: **v0.4 — Phase 3 Governed Runtime**

## Production-tested and active

| Capability | Status | Evidence |
|---|---|---|
| Next.js reference UI | ACTIVE | Production page loads |
| LangGraph routing | ACTIVE | Runtime self-test |
| Scoped local tool registry | ACTIVE | `platform_status` E2E |
| MCP v2 core | ACTIVE | real Client → Server → tools/list → tools/call |
| Governed remote MCP registry | ACTIVE | registry/probe implementation; connectors remain unconfigured until env supplied |
| Write-action policy gate | ACTIVE | deny-without-approval / accept-valid-bounded-approval self-test |
| Request execution envelope | ACTIVE | request ID + timestamp + trace returned by runtime API |
| Model gateway adapter | READY, NOT CONFIGURED | requires real OpenAI-compatible/vLLM endpoint |
| Promptfoo | SCAFFOLDED | evaluation config present |

## Intentionally not claimed as active

- Real Qwen/DeepSeek/Mistral inference: requires a configured endpoint.
- External MCP connectors: require approved `MCP_SERVERS_JSON` entries and credentials.
- Persistent memory: no durable Mem0/database provider is configured.
- External observability collector: instrumentation/collector is not configured.
- Browser automation: optional and not enabled by default.
- Authentication/tenant model: must be selected by the consuming product.
- Real business write tools: belong to the consuming product and require persistence + authorization + E2E.

## Live checks

- `/api/health`
- `/api/runtime/status`
- `/api/runtime/selftest`
- `/api/mcp/selftest`
- `/api/policy/selftest`
- `/runtime`

A consuming project should copy/fork the template, freeze its own architecture baseline, then implement domain-specific business services and tools without changing foundations silently.
