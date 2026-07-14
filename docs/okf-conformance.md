# OKF Conformance in AKCP

AKCP is designed to ingest and process OKF (Open Knowledge Format) v0.1 documents. OKF acts as the minimal portable knowledge source format for the ecosystem.

## Core Compliance Rules

1. **Markdown First**: All OKF source files must remain human-readable Markdown.
2. **YAML Frontmatter**: All OKF source files must contain YAML frontmatter, delimited by `---`.
3. **Required Fields**: The `type` field is strictly required in the frontmatter of every OKF document.
4. **Unknown Key Preservation**: The orchestrator parser (`FrontmatterParser`) must preserve unknown keys. If a tool or producer adds a custom field `my_custom_field: true`, AKCP will retain it during normalization into AK-IR and output it in supported targets (like OpenWiki).
5. **Unknown Type Leniency**: AKCP defines specific profiles (e.g., `Career`, `SoftwareProject`). However, if an OKF document declares an unknown `type` (e.g., `type: Experimental`), AKCP will not reject the document. It will process it generically and assign it the base `Document` handling logic.
6. **No Destructive Overrides**: AKCP-specific metadata (like budget estimates or hashes) are maintained in the AK-IR layer and artifact manifests. AKCP must not inject proprietary, non-standard fields back into original OKF source bundles that would break generic OKF consumers.
