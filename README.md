# Agentic Platform Template

A reusable, governed, open-source-first foundation for AI-native products.

**Live reference:** https://agentic-platform-template.vercel.app  
**Runtime console:** https://agentic-platform-template.vercel.app/runtime

The template exists to stop every AI project from rebuilding orchestration, tool boundaries, model routing, approval rules, evaluation, and governance differently.

## Current working baseline — v0.4

```text
User / Product UI
       |
       v
   LangGraph                 ACTIVE
       |
  +----+-----------------------+
  |                            |
  v                            v
Local governed tools       MCP v2 Core              ACTIVE
  |                            |
  +-------- Action Policy -----+
       read / write / approval
               |
               v
       Model Gateway Adapter            READY / NOT CONFIGURED
               |
        Qwen / DeepSeek / Mistral       PROJECT CONFIG
               |
              vLLM
               |
      Observability + Evaluation        NEXT / SCAFFOLDED
```

## What is real today

- Next.js production UI
- real LangGraph request routing
- scoped local tool registry
- official MCP v2 client/server protocol path
- governed remote MCP registry using operator-defined IDs rather than arbitrary URLs
- OpenAI-compatible model gateway adapter for vLLM or another approved gateway
- fail-closed write-action policy
- bounded HMAC human-approval verification contract
- request IDs and execution traces
- runtime, MCP and policy self-tests
- Promptfoo evaluation scaffold

The template deliberately does **not** fake a model, memory system, external connector, or business write. Missing infrastructure stays `NOT_CONFIGURED`.

## Live verification

```text
GET /api/health
GET /api/runtime/status
GET /api/runtime/selftest
GET /api/mcp/selftest
GET /api/policy/selftest
POST /api/agent/run
```

Try `platform status` or `mcp status` in `/runtime`. Normal AI questions will return `NOT_CONFIGURED` until a real model endpoint is supplied.

## Configure a real model

```env
MODEL_GATEWAY_BASE_URL=https://your-approved-openai-compatible-endpoint
DEFAULT_MODEL=your-model-name
MODEL_GATEWAY_API_KEY=optional-if-required
```

## Configure approved remote MCP servers

```env
MCP_SERVERS_JSON=[{"id":"internal-tools","url":"https://mcp.example.com/mcp","tokenEnv":"INTERNAL_MCP_TOKEN","enabled":true}]
INTERNAL_MCP_TOKEN=...
```

Runtime callers choose the configured **ID**, never an arbitrary URL.

## Governed writes

Read-only tools can run according to authorization policy. Sensitive write tools can declare `requiresApproval: true`; without a valid approval they fail closed. See `GOVERNED_ACTIONS.md`.

## Mandatory governance

Read before implementing a product:

- `ARCHITECTURE_BASELINE.md`
- `GOVERNANCE.md`
- `AGENTS.md`
- `OPEN_SOURCE_POLICY.md`
- `SOURCE_AUTHORITY.md`
- `SECURITY.md`
- `EVALUATION.md`
- `PRODUCTION_READINESS.md`
- `PROJECT_START_PROMPT.md`
- `TEMPLATE_STATUS.md`

A feature is not DONE because code or mocks exist. Completion requires the applicable real UI, backend, persistence, integration, failure paths, authorization, E2E, and evaluation evidence.

## Quick start

```bash
npm install
npm run dev
```

Node 22 is the reference runtime. Open `http://localhost:3000`.

## License

The template itself is MIT. Every added model, connector, MCP server, library, or copied component must pass `OPEN_SOURCE_POLICY.md` before adoption.
