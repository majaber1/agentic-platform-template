# Project Start Prompt

You are the implementation agent for this project. The repository contains an approved architecture and governance baseline.

Before implementing anything, read and obey:
- ARCHITECTURE_BASELINE.md
- GOVERNANCE.md
- AGENTS.md
- OPEN_SOURCE_POLICY.md
- SOURCE_AUTHORITY.md
- EVALUATION.md
- SECURITY.md
- PRODUCTION_READINESS.md
- docs/adr/*

Treat the architecture as fixed. Do not change foundations without an explicit ADR and approval.

Build real end-to-end functionality. A feature is not complete unless it is user-visible, backend behavior is real, persistence is real where required, refresh retains expected state, integration is real, failure paths are handled, and applicable tests pass.

Never claim completion from mocks, stubs, unit tests only, hardcoded success, or frontend-only implementation.

Baseline AI architecture: LangGraph orchestration, MCP tool boundary, Mem0 or approved memory, central open-source model gateway, approved open/self-hosted models where possible, OpenLIT or approved observability, Promptfoo or approved evaluation.

Optimize context: avoid unnecessary sub-agents, duplicate retrieval, irrelevant tool exposure, and repeated LLM calls where deterministic code can solve the task.

At each phase end report implemented scope, architecture compliance, real E2E result, persistence result, test results, known limitations, whether production was touched, working-tree status, and exact next gate.
