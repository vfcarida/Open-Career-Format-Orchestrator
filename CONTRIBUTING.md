# Contributing to Open Career Format Orchestrator (OCF)

Thank you for your interest in contributing to OCF! This project follows **Spec-Driven Development (SDD)** principles and strict OSS governance standards.

## 🛠️ Development Principles

1.  **Spec-Anchored Evolution**: Every architectural shift or feature change must start as a technical specification draft under `docs/specs/` or an Architecture Decision Record (ADR) under `docs/adrs/`.
2.  **Strict Typing & Validation**: All new OKF concept models must be validated using corresponding Zod schemas under `@ocf/core/src/domain/schemas.ts`.
3.  **Convention & Commit Style**:
    *   Commit messages must strictly follow the **Conventional Commits** format (e.g. `feat: add project schemas`, `fix: handle directory picker error`).
    *   Do not credit or reference AI, agent assistants, or LLMs in your commit messages.

## 🚀 How to Contribute

1.  Fork the repository and clone it locally.
2.  Install dependencies: `npx pnpm install --ignore-scripts`
3.  Implement changes inside separate branch.
4.  Run check validations:
    *   Linting: `pnpm run lint`
    *   Typecheck: `pnpm run typecheck`
    *   Tests: `pnpm run test`
    *   Build: `pnpm run build`
5.  Submit a Pull Request targeting `main`. Ensure the PR description matches the template guidelines.

## 📦 Monorepo Structure

*   `packages/core`: Engine models, parsing logic, and schema validations.
*   `packages/dashboard`: React frontend for user interaction.
*   `packages/mcp-profile-server`: Read/write MCP tool handlers.
*   `packages/mcp-automation-server`: Stateful browser submission processes.
*   `packages/mcp-server`: Façade compatibility interface.
