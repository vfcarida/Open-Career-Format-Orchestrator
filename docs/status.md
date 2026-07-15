# Maturity and Feature Status

AKCP uses strict, evidence-based maturity levels. We do not claim production readiness without executable evidence (tests, documentation, and working examples).

> For the full maturity model definition with criteria and enforcement standards, see [docs/project/maturity-model.md](project/maturity-model.md).

## Maturity Definitions

| Level | Definition |
|---|---|
| **Stable** | Documented, tested, CI-validated, examples exist, no known critical gaps. Ready for production. |
| **Beta** | Mostly working and tested, API may change, limitations are documented. Ready for non-critical environments. |
| **Experimental** | Available for preview but incomplete. Not production-ready. APIs can break without notice. |
| **Planned** | Not implemented; docs may describe intent only. No placeholder success states in CLI. |
| **Deprecated** | Supported temporarily with a migration path. Will be removed in a future major version. |

## Current Feature Inventory

| Feature | Status | Evidence | Limitation | Next milestone |
|---|---|---|---|---|
| AKCP CLI compile | Beta | Unit tests, examples | No npm release yet | Global CLI distribution |
| AK-IR Normalization | Beta | Schema tests | Edge cases | Expand AST testing |
| MCP Profile Server | Beta | Contract/Security tests | Local-only | Add auth flows |
| MCP Automation Server | Experimental | Safety tests | Missing dashboard | Build dashboard integration |
| Dashboard UI | Experimental | Package scaffolded | No React UI | Build MVP |
| Career flagship | Stable | Walkthrough | Limited tool scope | Broaden use cases |
| IT Ops flagship | Beta | Docs, structure | Mocked infrastructure | Complete implementations |
| Customer Support | Experimental | Design doc | Experimental | Begin integration |
| AKCP Legacy CLI (`akcp`) | Deprecated | `check:identity` | Legacy usage | Remove in v1.0 |
