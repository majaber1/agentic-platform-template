# v0.5 Status

Version: **0.5.0-open-source-first**
Branch: `v0.5-open-source-first`
Production status: **NOT DEPLOYED / NOT CLAIMED READY**

## Completed in this version

- v0.4 preserved at `release/v0.4-governed-runtime`.
- Forge selected as the platform foundation and pinned to immutable commit `048fdc658527b0dd60babbb65ee5729e3af1a79d`.
- Forge MIT license verified before adoption.
- LiteLLM OSS core selected as model router and pinned to release `v1.100.1` / commit `1dba17b10ded12ad0021edb453ba2c54e4637928`.
- LiteLLM license boundary recorded: MIT outside `enterprise/`; enterprise code is not part of the adopted surface.
- Groq and OpenRouter wildcard routes configured through LiteLLM.
- Windows and Linux/macOS bootstrap scripts added for reproducible upstream checkouts.
- Windows and Linux/macOS local Forge run scripts added.
- Windows and Linux/macOS LiteLLM router run scripts added.
- Vendor checkouts and local secret files are excluded from Git.
- v0.5 architecture freezes reuse-first rules and removes default duplication of memory/workflow/observability subsystems.

## Not yet claimed as PASS

These require a real runtime on a machine with Docker and, where applicable, provider keys:

1. Forge Docker stack boot from the pinned commit.
2. Forge console login and project creation.
3. Offline `fake:echo` agent run.
4. Workflow save/reopen persistence.
5. MCP list/call E2E.
6. HITL pause/resume E2E.
7. LiteLLM container health.
8. Real Groq route.
9. Real OpenRouter route.
10. Forge -> LiteLLM routed model call.
11. Trace/tool/model evidence for the routed call.

Until these pass, v0.5 is an **implementation candidate**, not production-ready.

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

## Provider keys

Real keys belong only in local `.env.router` or a production secret store:

- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `LITELLM_MASTER_KEY`

No provider model ID is hardcoded into architecture. Concrete models are selected at runtime and may change without changing the platform baseline.
