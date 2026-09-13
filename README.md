# Agentic Platform Template

Reusable AI-agent platform template built with an **open-source-first, assemble-before-build** policy.

## Version tracks

- **v0.4 governed runtime** — preserved at `release/v0.4-governed-runtime`.
- **v0.5 open-source-first** — active work on `v0.5-open-source-first`.

v0.5 does not rebuild a platform from scratch. It adopts proven upstream components, pins exact versions, and adds our governance, security, integration and domain layers around them.

## v0.5 foundation

```text
Product UI / Domain App / Forge Console
                |
                v
        Forge platform foundation
  UI + LangGraph + MCP + Tools + RAG
  Memory + HITL + Auth/RBAC + Traces/Evals
                |
                v
        LiteLLM OSS model router
                |
          +-----+------+
          |            |
        Groq       OpenRouter
```

### Adopted upstream components

- **Forge** — platform foundation. Pinned to the exact commit in `upstream/UPSTREAM_COMPONENTS.lock.json`.
- **LiteLLM OSS core** — model-router foundation. Enterprise-licensed directories are explicitly excluded from our adopted surface.

The upstream source remains upstream. We do **not** copy large codebases into this repository unless an approved ADR requires a maintained fork.

## What we keep from our template

- architecture governance
- open-source admission policy
- source-authority rules
- security and approval rules
- business/domain packs
- production-readiness gates
- E2E evidence requirements

## What we stop rebuilding

Do not create custom chat UI, workflow canvas, agent framework, MCP framework, generic memory, generic RAG, tracing, evaluation dashboard, auth/RBAC, or model-router infrastructure while the adopted upstream component satisfies the requirement.

## Bootstrap v0.5

Windows:

```powershell
./scripts/bootstrap-v05.ps1
./scripts/run-v05.ps1
```

Linux/macOS:

```bash
./scripts/bootstrap-v05.sh
./scripts/run-v05.sh
```

The bootstrap checks out the **pinned Forge commit** under `vendor/forge` and never tracks that vendor checkout in this repository. The first local run uses Forge's offline `fake:echo` model so UI/runtime plumbing can be tested without provider keys.

## Model routing

Model providers are not hard-wired into agents. The target path is Forge → LiteLLM → Groq/OpenRouter. Provider keys and concrete model IDs are runtime configuration, never committed to Git.

See:

- `OPEN_SOURCE_FIRST.md`
- `docs/architecture/V0.5_ARCHITECTURE_BASELINE.md`
- `upstream/UPSTREAM_COMPONENTS.lock.json`
- `V05_STATUS.md`

## v0.4 production reference

The existing Vercel reference deployment remains a v0.4 reference until v0.5 passes its own runtime/UI acceptance gate. v0.5 is not considered production merely because its upstream components are mature.

## License

This template is MIT. Upstream components retain their own licenses and notices. Every adopted component must pass `OPEN_SOURCE_POLICY.md`; public source code alone is not sufficient.