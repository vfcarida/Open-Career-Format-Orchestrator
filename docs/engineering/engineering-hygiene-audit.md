# Engineering Hygiene Audit

## 1. Initial Diagnostic Overview

**System Versions:**

- `Node.js`: v24.16.0
- `Corepack`: 0.35.0
- `pnpm`: 11.11.0

**Command Results:**

- `pnpm install --frozen-lockfile`: Passed. 496ms.
- `pnpm build`: Passed.
- `pnpm test -- --run`: Passed. (127/127 tests successful).

## 2. YAMLs and Configs Status

- `pnpm-workspace.yaml` lacks explicit configuration for some critical dependencies (like `@modelcontextprotocol/sdk`). The `allowBuilds` configuration is malformed (`better-sqlite3: set this to true or false`).
- GitHub Actions workflows are present but need permissions tightening, robust dependencies management, and readable formatting.

## 3. Compiled Artifacts in `src/`

Detected the following build outputs polluting the `src/` directory in `packages/mcp-automation-server/src`:

- `policy/autonomy-policy.js`, `.js.map`, `.d.ts`, `.d.ts.map`
- `capabilities.js`, `.js.map`, `.d.ts`, `.d.ts.map`

## 4. Supply Chain and Dependencies

- **Version Mismatch**: `@modelcontextprotocol/sdk` is using `^1.29.0` in the dashboard, but `^1.0.1` in `mcp-automation-server` and `mcp-profile-server`.
- Need to align dependencies in `pnpm-workspace.yaml` via catalogs for `typescript`, `vitest`, `zod`, `prettier`, `@modelcontextprotocol/sdk`.

## 5. Security & CI Workflows

- The CI pipeline needs YAML validation and formatter checks.
- Workflow scopes (permissions) need to be reduced to `contents: read` at the top level where appropriate.
- Secrets handling and release workflow steps need a review for safest defaults.
