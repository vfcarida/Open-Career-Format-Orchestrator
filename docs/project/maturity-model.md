# AKCP Project Maturity Model

The Agent Knowledge Compiler and Control Plane (AKCP) explicitly labels all commands, domains, compile targets, and features according to this project-wide maturity model. This ensures predictable usage and honest expectation-setting for the community.

## Maturity Levels

| Label | Definition | Criteria |
|---|---|---|
| **Stable** | Ready for production use. | Documented, entirely implemented, robust test coverage (unit + integration), CI-covered, supported with backward compatibility guarantees. |
| **Beta** | Implemented and largely functional. | Documented, tested, but the API/interface may still undergo minor changes before full stabilization. |
| **Experimental** | Available for preview but incomplete. | Not production-ready. May lack full tests, docs, or feature parity. APIs can break without notice. |
| **Planned** | On the roadmap. | Documented intent or design, but not yet implemented. Placeholders exist only in documentation (not as misleading CLI success states). |
| **Deprecated** | Supported temporarily but slated for removal. | Active migration path is provided. Will be removed in a future major version. |

## Standards Enforcement

1. **Explicit Erroring:** Commands that are placeholders or partially implemented must fail loudly (e.g., throwing a `NOT_IMPLEMENTED` error) rather than returning misleading success states.
2. **CLI Tagging:** Any command that is Experimental or Deprecated must explicitly indicate its status in the `--help` description (e.g., `[Experimental]`).
3. **CI Validation:** The repository runs CI checks (`forbidden-words.test.ts`) to ensure marketing phrases like "100% complete" do not contradict the actual test coverage.
