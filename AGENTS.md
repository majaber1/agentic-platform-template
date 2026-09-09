# Agent Operating Rules

These rules apply to Codex, Claude Code, Cursor, and other coding agents.

## Before work
1. Read `ARCHITECTURE_BASELINE.md`, `GOVERNANCE.md`, `OPEN_SOURCE_POLICY.md`, and relevant ADRs.
2. Confirm the request fits the baseline.
3. Do not silently redesign the platform.

## During work
- Prefer the smallest coherent change.
- Reuse existing architecture before adding new systems.
- Use sub-agents only when they materially reduce risk or parallelize independent work.
- Avoid unnecessary tools and context expansion.
- Never replace a real integration with a mock and call it complete.
- Never hardcode a successful business outcome.

## AI rules
- All model access goes through approved gateway/orchestration paths.
- All tools have explicit scope.
- Keep the toolset narrow and relevant.
- Retrieve authoritative internal sources first where required.
- Preserve evidence references through the workflow.
- Prefer deterministic code over repeated LLM calls when appropriate.

## Verification
Run applicable lint/typecheck, unit, integration, failure-path, browser/API E2E, persistence, and architecture-compliance checks.

Do not claim DONE, production-ready, or 100% complete unless the applicable real acceptance gates passed.
