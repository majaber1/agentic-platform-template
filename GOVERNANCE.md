# Governance Standard

## Mandatory delivery flow

```text
Requirement
  -> Architecture Check
  -> Source-of-Truth Check
  -> Design
  -> Implementation
  -> Unit Tests
  -> Integration Tests
  -> Failure-Path Tests
  -> Real E2E
  -> Persistence Check
  -> Observability Check
  -> Evaluation
  -> Security Review
  -> Production Readiness Gate
```

## Definition of DONE
A feature is DONE only when all applicable gates pass:
- [ ] real UI/API access
- [ ] real backend behavior
- [ ] real persistence
- [ ] refresh/reload preserves expected state
- [ ] approved AI orchestration/model path
- [ ] real integration or explicitly scoped test fixture
- [ ] failure paths handled
- [ ] authorization enforced
- [ ] required audit/trace exists
- [ ] real end-to-end business journey demonstrated
- [ ] no hardcoded success
- [ ] documentation updated

## Architecture change control
Create an ADR before changing database foundations, orchestration, model gateway, tool boundaries, authentication, tenant model, persistence model, or deployment topology.
