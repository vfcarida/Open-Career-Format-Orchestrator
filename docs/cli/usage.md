# AKCP CLI Usage Guide

The `akcp` CLI is the operational entry point for the Agent Knowledge Compiler and Control Plane. It transforms standard directories into governed, agent-readable Open Knowledge Format (OKF) bundles and exposes them securely via the Model Context Protocol (MCP).

## Core Commands

### `akcp init [directory]`

**Status:** Stable
Initializes a new context pack.

- **Syntax:** `akcp init [directory] [options]`
- **Flags:**
  - `-p, --profile <profile>`: Context profile (e.g., software-project, career). Defaults to `standard`.
- **Expected Output:** Bootstraps `.agent-context`, `index.md`, and `AGENTS.md`.
- **Example:** `akcp init ./my-project --profile software-project`

### `akcp doctor`

**Status:** Stable
Diagnose environment configuration and readiness.

- **Syntax:** `akcp doctor`
- **Expected Output:** Node version and workspace environment checks.
- **Example:** `akcp doctor`

### `akcp compile`

**Status:** Beta
Compiles Context Packs into an Agent Knowledge IR (AK-IR) and generates specified targets (e.g., manifest, graph, docs).

- **Syntax:** `akcp compile [options]`
- **Flags:**
  - `--bundle <directory>`: Directory containing `akcp.yaml` or `.okf` bundle. Defaults to `.`.
  - `--target <type>`: Specific target to compile (e.g., `all`, `ir-json`, `openwiki-docs`). Defaults to `all`.
  - `--provenance`: Enable full cryptographic provenance tracking.
- **Expected Output:** Compilation success message and path to `akcp-manifest.json`.
- **Example:** `akcp compile --bundle ./my-project/.agent-context`

### `akcp validate [directory]`

**Status:** Beta
Strict offline schema validation of an OKF/Context bundle.

- **Syntax:** `akcp validate [directory] [options]`
- **Flags:**
  - `-f, --format <format>`: Output format (`json` or `markdown`). Defaults to `markdown`.
  - `-p, --profile <profile>`: Profile to validate against. Defaults to `career`.
- **Expected Output:** Validation success or list of schema errors. Exit code `1` on failure.
- **Example:** `akcp validate ./my-project/.agent-context`

### `akcp serve:mcp [directory]`

**Status:** Experimental
Locally boots the MCP Profile Server for the targeted context bundle.

- **Syntax:** `akcp serve:mcp [directory] [options]`
- **Flags:**
  - `--ir <path>`: Path to compiled Knowledge IR json. Defaults to `dist/knowledge-ir.json`.
- **Expected Output:** Boots the MCP server via stdio transport.
- **Example:** `akcp serve:mcp ./my-project/.agent-context`

## Extended Commands

### Configuration & Policy

- **`akcp config validate` (Beta):** Validates the `akcp.yaml` configuration file. `akcp config validate -f akcp.yaml`
- **`akcp policy validate <file>` (Beta):** Validates a machine-readable PolicyCard YAML file.
- **`akcp policy explain <file>` (Beta):** Explains a PolicyCard in human-readable text.
- **`akcp plan` (Beta):** Generates an execution plan based on `akcp.yaml`.

### Analysis & Graph

- **`akcp scan [directory]` (Beta):** Analyzes repository and suggests context document structures. Use `--dry-run` to preview.
- **`akcp graph build` (Beta):** Builds the knowledge graph from the OKF bundle.
- **`akcp graph inspect` (Beta):** Inspects a concept in the knowledge graph. Requires `-c <concept_id>`.
- **`akcp graph impacted` (Beta):** Lists all downstream concepts impacted by a change to a concept. Requires `-c <concept_id>`.
- **`akcp context plan` (Beta):** Generates an economics context report for a given task and budget.
- **`akcp lifecycle report` (Beta):** Generates a lifecycle report detailing active, stale, and deprecated documents.

### Artifact & Provenance

- **`akcp inspect-artifact <manifest>` (Beta):** Inspects an AKCP compile manifest (`akcp-manifest.json`).
- **`akcp verify <manifest>` (Beta):** Verifies the cryptographic provenance and integrity of a compiled bundle.
- **`akcp diff [directory]` (Planned):** Show semantic context changes since the last build.

### Integration

- **`akcp import <source>` (Alpha):** Imports from external systems (e.g., `openwiki`) into a Context Pack. Use `--dry-run` to preview.
- **`akcp agents sync` (Beta):** Synchronizes the managed context block within agent instruction files (e.g., `AGENTS.md`).
- **`akcp reconcile` (Beta):** Reconciles desired state with the current environment. Dry-run by default. Use `--no-dry-run` to apply changes.
- **`akcp conformance run` (Beta):** Runs the AKCP conformance suite.

## Global Options

- **`--help`**: Displays help information for any command.
- **`--version`**: Displays the CLI version.
