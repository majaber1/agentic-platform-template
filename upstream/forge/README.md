# Forge Upstream Integration

Forge is the v0.5 platform foundation. It is **not copied into this repository**.

Pinned upstream:

- Repository: `https://github.com/nihalashetty/Forge`
- Commit: `048fdc658527b0dd60babbb65ee5729e3af1a79d`
- License: MIT
- Local checkout: `vendor/forge` (gitignored)

Use `scripts/bootstrap-v05.*` to reproduce the exact checkout.

## Why Forge

The pinned upstream already provides the generic platform capabilities we would otherwise have to maintain ourselves: Next.js console, FastAPI engine, LangGraph, visual agents/workflows, MCP both ways, tools, knowledge/RAG, long-term memory, HITL, auth/RBAC, secrets, triggers, tracing, evaluations, audit/versioning and deploy surfaces.

Our code should extend business/domain behavior around Forge rather than reimplement those capabilities.

## Important current limitation

Forge's upstream README explicitly states that its one-click connector library/marketplace is not yet fully implemented. v0.5 therefore uses existing maintained MCP servers or Forge REST/GraphQL tools for integrations instead of building another generic connector framework.

## Model router connection target

The v0.5 target is:

```text
Forge agent node
  model: openai:<router-model-name>
  model_params.base_url: http://host.docker.internal:4000/v1
        |
        v
LiteLLM
        |
   Groq / OpenRouter
```

This path is architecturally selected but is not marked PASS until a real routed call is verified with provider keys and trace evidence.
