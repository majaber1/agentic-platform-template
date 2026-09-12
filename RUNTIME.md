# Phase 1 Core Runtime

## Implemented

- Real LangGraph state graph for request routing.
- Scoped local tool registry.
- `platform_status` read-only tool backed by real runtime configuration.
- OpenAI-compatible model gateway adapter suitable for vLLM/Qwen.
- `/api/runtime/status` configuration/status endpoint.
- `/api/agent/run` runtime execution endpoint.
- `/runtime` user-visible console.
- Promptfoo HTTP evaluation scaffold.

## Truthful boundaries

The template does **not** ship a fake LLM. If `MODEL_GATEWAY_BASE_URL` and `DEFAULT_MODEL` are absent, model-dependent requests return `NOT_CONFIGURED` / HTTP 503.

MCP remote transport, Mem0, OpenLIT instrumentation, Browser Use, persistence and authentication remain separate governed phases.

## Configure a real model

Point the deployment at an OpenAI-compatible endpoint, for example a self-hosted vLLM service:

```env
MODEL_GATEWAY_BASE_URL=https://your-vllm-or-gateway.example
DEFAULT_MODEL=your-approved-model
MODEL_GATEWAY_API_KEY=optional-if-required
```

The runtime will call `/v1/chat/completions` through this single gateway path.
