# Open Source First — Mandatory Build Policy

## Principle

**Reuse proven open source before writing custom platform code.**

The value of a consuming product must live primarily in its domain logic, workflows, data quality, source authority and user experience — not in reimplementing generic infrastructure that mature projects already provide.

## Mandatory reuse gate

Before adding any new component, service, UI primitive, connector, agent subsystem or platform capability:

1. Define the capability and acceptance criteria.
2. Search mature open-source candidates.
3. Check license and commercial-use implications.
4. Check activity, releases, issues, documentation and security posture.
5. Verify production fit and integration cost.
6. Prefer **use + configure + customize** over fork.
7. Fork only through an explicit ADR with an upstream-sync/exit plan.
8. Build custom only when no acceptable reusable component exists.

## Applies to UI too

This policy explicitly covers:

- chat interfaces
- dashboards
- workflow/canvas builders
- forms and component libraries
- auth/RBAC
- agent runtimes
- MCP clients/servers
- model routing
- memory
- RAG/knowledge
- observability/tracing
- evaluation
- scheduling/triggers
- generic connectors

A custom UI should represent product-specific workflows and brand. It should not duplicate a mature general-purpose component without a documented reason.

## Adoption modes

Preferred order:

1. **Use upstream unchanged** — configuration only.
2. **Use upstream + overlay** — themes, policies, adapters, domain packs.
3. **Small maintained patch** — only when upstream extension points are insufficient.
4. **Fork** — exceptional; ADR required.
5. **Custom build** — last resort.

## Upstream pinning

Every adopted platform component must be pinned in `upstream/UPSTREAM_COMPONENTS.lock.json` by immutable commit or release tag + resolved commit.

Updates are deliberate changes. Never auto-follow an upstream `main` branch in production.

## Current v0.5 decisions

### Forge — ADOPT

Use Forge for the platform foundation: Next.js console, LangGraph orchestration, visual agent/workflow builder, tools, MCP, knowledge/RAG, long-term memory, HITL, auth/RBAC, project isolation, tracing, evaluations, triggers and API/widget/MCP deployment surfaces.

Do not rebuild those layers locally unless an acceptance gap is demonstrated.

### LiteLLM OSS core — ADOPT AS MODEL ROUTER

Use the MIT-licensed core outside `enterprise/` as the provider-routing layer. The v0.5 routing target is Groq + OpenRouter behind a stable OpenAI-compatible boundary exposed to Forge.

Do not adopt files under LiteLLM's `enterprise/` directory without a separate license decision.

## No duplicate subsystems

For v0.5:

- Do not add Mem0 by default because Forge already provides long-term memory.
- Do not add a second generic workflow builder because Forge already uses React Flow.
- Do not add a separate generic tracing UI because Forge already traces runs and exports OpenTelemetry.
- Do not add another generic auth/RBAC layer inside Forge.
- Keep Promptfoo only if it adds an external regression/red-team gate not already covered by Forge evaluations.
- Add Browser Use only as an external tool/MCP capability when a real product workflow requires browser automation.

## Definition of Done amendment

A feature cannot be DONE unless its implementation record shows:

- reuse search performed
- selected upstream component or documented reason for custom build
- license review
- pinned version/commit
- real integration, not screenshot-only
- failure path
- authorization/security behavior where applicable
- persistent user-visible E2E when applicable
- upgrade/exit strategy
