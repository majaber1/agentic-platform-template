# Universal Open-Source AI Platform Template

Reusable baseline for building AI-native products with a controlled, production-oriented architecture.

> **Purpose**
> Start every new AI project from the same governed foundation instead of rebuilding auth, orchestration, tool access, model routing, observability, and evaluation from scratch.

## Core Principles

1. **Architecture is a written baseline.**
   - No foundational change without an explicit ADR / architecture change decision.
2. **AI is not a chat widget.**
   - AI must execute real workflows, use real evidence, and persist real results.
3. **No fake completion.**
   - A feature is not DONE because unit tests pass or a mock succeeds.
   - DONE requires real user-visible, persistent end-to-end behavior.
4. **Least privilege for agents.**
   - Tool access is explicitly scoped.
   - Sensitive actions require approval gates where appropriate.
5. **Evidence before answer.**
   - Internal authoritative data is retrieved before public/general information when the use case requires it.
6. **Observability and evaluation are mandatory.**
   - Every important AI flow must be traceable and testable.
7. **Context efficiency.**
   - Avoid unnecessary tool calls, duplicated context, and excessive sub-agent fan-out.

## Baseline Stack

```text
                    Our Own UI
             Next.js / React / shadcn
                         |
                         v
                    LangGraph
               Agent Orchestration
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
         MCP         Composio      Browser Use
      Tool Layer      optional       optional
          |
          +-- Email
          +-- Teams / Graph
          +-- GitHub
          +-- AWS
          +-- PostgreSQL
          +-- Files
          +-- Internal APIs
          |
          v
                        Mem0
                   Agent Memory
                        |
                        v
                 Model Gateway
              Portkey or equivalent
                        |
            +-----------+-----------+
            |           |           |
            v           v           v
          Qwen       DeepSeek     Mistral
            \           |           /
             \          |          /
                    vLLM
              Self-hosted inference
                        |
             +----------+----------+
             |                     |
             v                     v
          OpenLIT               Promptfoo
       Observability            Evaluation
```

## Required Project Files

- `ARCHITECTURE_BASELINE.md`
- `GOVERNANCE.md`
- `AGENTS.md`
- `SOURCE_AUTHORITY.md`
- `EVALUATION.md`
- `SECURITY.md`
- `PRODUCTION_READINESS.md`
- `docs/adr/ADR-000-template.md`
- `PROJECT_START_PROMPT.md`
- `OPEN_SOURCE_POLICY.md`

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Health check: `/api/health`.

## Template Status

The repository includes a deployable reference UI plus governance and architecture scaffolding. The UI is intentionally zero-config. Individual products must still implement their real business domain, persistence, tools, workflows, tests, and deployment-specific integrations before claiming feature completion.
