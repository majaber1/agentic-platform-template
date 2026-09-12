# v0.5 Status

Version: **0.5.0-open-source-first**
Branch: `v0.5-open-source-first`
Production status: **NOT DEPLOYED / NOT CLAIMED PRODUCTION READY**

## Frozen upstream foundation

- v0.4 is preserved at `release/v0.4-governed-runtime` and remains the `main`/production baseline until v0.5 merge is explicitly approved.
- Forge is the agent-platform foundation, pinned to commit `048fdc658527b0dd60babbb65ee5729e3af1a79d` (MIT).
- LiteLLM OSS core is the model router, pinned to `v1.100.1` / commit `1dba17b10ded12ad0021edb453ba2c54e4637928`.
- GitHub MCP Server is the first accepted external MCP connector, pinned to `v1.12.1` / commit `7d13a7ad6f2a17f351a6d77ce280c85ae1821f4d` and container digest `sha256:0ba840c46a237879c8300e7fddb0b6347f20e029ccb9cbe2ce4a943daa1ff560`.
- Open Source First remains mandatory: reuse and customize proven components before writing replacements.

## Acceptance results

### Forge foundation — PASS

GitHub Actions run `34720079559` completed successfully.

- Pinned Forge SHA + MIT license verification — PASS.
- Backend high-value suite — **71/71 PASS** (auth, MCP, HITL coverage, project-run coverage).
- Frontend tests — **4/4 PASS**.
- Next.js production build — PASS.
- Forge API `/readyz` — PASS (`db`, `checkpointer`, `vector_store`).
- Authenticated API login — PASS.
- Project creation + reopen/persistence — PASS.
- Live `fake:echo` workflow execution — PASS.
- Same-thread continuation — PASS.
- Workflow save/reopen — PASS.
- Browser login + owner dashboard smoke — PASS.

### LiteLLM router — PASS for router/runtime, live providers pending

GitHub Actions run `34720079544` completed successfully.

- Pinned LiteLLM `v1.100.1` container boot — PASS.
- Router health/liveness — PASS.
- Groq wildcard route loaded — PASS.
- OpenRouter wildcard route loaded — PASS.

This does **not** claim a paid/live provider request. No authorized Groq/OpenRouter provider keys were available in the acceptance environment.

### Official GitHub MCP — PASS for real read-only data access

GitHub Actions run `34722075068` completed successfully.

- Official `github/github-mcp-server` `v1.12.1` image/digest verification — PASS.
- Forge stdio command bounded to `docker` — PASS.
- GitHub MCP launched with native `--read-only` mode — PASS.
- Tool surface bounded to exactly `get_file_contents`, `pull_request_read`, and `get_me` — PASS.
- Write tools absent from discovery — PASS.
- Real `get_file_contents` call through the Forge MCP adapter — PASS.
- Real repository evidence returned from `majaber1/agentic-platform-template` / `README.md` on `v0.5-open-source-first` — PASS.
- Forge agent workflow compiled and ran with the GitHub MCP client attached through the native `mcp_servers` path — PASS.
- Acceptance credential file was temporary, mode `0600`, excluded from artifacts, and deleted at job end — PASS.

Important integration finding: the pinned Forge stdio connection currently passes `command + args` but does not expose an MCP subprocess `env` field. For CI acceptance, the credential is injected into the nested official GitHub MCP container through a protected temporary Docker `--env-file`, without storing the token in Git or connector configuration. Production credential handling for stdio must remain external/secret-managed, or the remote GitHub MCP + Forge Auth Provider path should be selected and separately accepted.

## Known blocker carried forward — no re-analysis required

- **Groq credential:** Saudi Business already uses a working `GROQ_API_KEY`; reuse of the same account/key for `agentic-platform-template` is the selected path. The secret value has **not yet been copied** into this repository's approved secret store.
- **Owner action:** add the existing Saudi Business Groq key as `GROQ_API_KEY` for this project when available. Do not put the value in Git, logs, PR comments, or chat.
- **Status:** OPEN / DEFERRED BY OWNER. This is a credential-wiring blocker only; it is not an architecture or implementation blocker.
- When the secret is added, resume directly at: **Forge -> LiteLLM -> Groq live inference -> autonomous GitHub MCP tool selection -> final traced answer**.

## Still blocked / not yet claimed as PASS

1. Real Groq inference through LiteLLM — **deferred until the existing Saudi Business Groq secret is wired here**.
2. Real OpenRouter inference through LiteLLM.
3. Forge -> LiteLLM -> live provider response E2E.
4. Live model autonomously selecting and invoking the GitHub MCP tool.
5. Combined trace proving model call + MCP tool call + final answer in one live agent run.
6. Live user-visible HITL pause -> approve/reject -> resume E2E (upstream HITL tests pass, but this runtime gate has not yet been exercised as a full user flow).
7. Provider failure/fallback E2E (for example Groq unavailable -> OpenRouter route).
8. Production deployment/promotion of v0.5.

The `fake:*` model proves the Forge agent runtime and native MCP attachment path, but it does not prove autonomous tool selection. A real tool-capable model is required for that gate.

## Current readiness decision

- **Open-source foundation:** PASS.
- **Forge runtime:** PASS.
- **LiteLLM routing runtime:** PASS.
- **Official GitHub MCP real read-only connector:** PASS.
- **Live provider / autonomous agent-tool loop:** BLOCKED by missing authorized provider credentials, not failed.
- **Production merge/deploy:** HOLD until the remaining live-provider and user-visible HITL gates are evidenced or explicitly waived by an architecture/release decision.

## Current stabilization phase

While the provider credential is deferred, v0.5 work continues on items that do not require it:

1. dependency reproducibility / pinning evidence;
2. failure-path gates for unavailable/invalid provider and unavailable MCP;
3. HITL runtime acceptance using deterministic/offline paths where possible;
4. freeze-readiness checklist and clean-diff verification.

## Local test sequence

Windows:

```powershell
./scripts/bootstrap-v05.ps1
./scripts/run-v05.ps1
./scripts/run-router-v05.ps1
```

Linux/macOS:

```bash
./scripts/bootstrap-v05.sh
./scripts/run-v05.sh
./scripts/run-router-v05.sh
```

Then validate Forge at `http://localhost:3000`, Forge API at `http://localhost:8000/docs`, and LiteLLM at `http://localhost:4000`.

## Provider secrets

Real provider secrets belong only in an approved local secret file or production secret store, never in Git or chat:

- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `LITELLM_MASTER_KEY`

No provider model ID is part of the architecture baseline. Concrete models remain runtime configuration and can change without changing the platform architecture.
