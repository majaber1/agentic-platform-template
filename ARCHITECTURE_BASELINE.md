# Architecture Baseline

## Status
**APPROVED BASELINE** — foundational changes require an ADR before implementation.

## Product layers

### Experience
Own product UI. Default: Next.js + React. UI must expose real persistent state, never mock business data presented as real.

### Orchestration
LangGraph is the default stateful agent/workflow orchestrator. It owns routing, retries, approval gates, tool selection, and failure handling.

### Tools and integrations
MCP is the preferred integration boundary when practical. Every connector must declare purpose, allowed operations, owner, authentication, source-authority rank, failure behavior, and auditability. Browser Use is optional and should be used only when API/MCP access is unavailable or browser interaction is itself the workflow.

### Retrieval
Internal authoritative sources are preferred when the use case requires enterprise facts. Retrieval must preserve source, timestamp, entity identity, completeness, and freshness.

### Memory
Mem0 or an approved equivalent may hold durable agent context. Memory never replaces source-of-truth systems and raw conversation history must not be injected into every request.

### Model gateway
All model access passes through one approved gateway for routing, fallback, rate limits, usage accounting, policy, and provider isolation. Random direct model calls from UI/backend modules are prohibited.

### Inference
Prefer approved self-hosted/open models such as Qwen, DeepSeek, or Mistral, served by vLLM or an approved compatible runtime. External Claude/GPT APIs may be optional providers through the gateway only.

### Observability
OpenLIT or an approved equivalent records request traces, workflow steps, model usage, latency, tool calls, failures, and token/cost information where available.

### Evaluation
Promptfoo or an approved equivalent is mandatory for material AI behavior before production promotion.

## Non-negotiable constraints
- No hidden second AI path bypassing orchestration/gateway.
- No duplicate retrieval system without an architecture decision.
- No production dependency without owner, rationale, license review, and exit strategy.
- No mock-only feature completion.
- No architecture change hidden inside feature work.
