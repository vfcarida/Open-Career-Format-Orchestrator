# Contributing to OCF Reference Architecture

We welcome contributions! This project uses **Spec-Driven Development (SDD)** and expects all changes to be documented in the architecture prior to implementation.

## 1. Governance and Scope
The goal is to maintain a concrete, testable Enterprise Architecture Blueprint.
- Do not introduce abstractions unless they solve a demonstrated limitation.
- Ensure any added features come with corresponding unit, integration, or contract tests.

## 2. Commit Guidelines
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Ex: `feat: add types`, `fix: update parser`.
- **CRITICAL**: Never credit or reference AI, agent, LLM, prompt, or code assistants in commit messages.

## 3. Pull Request Process
1. Ensure your code passes all local checks: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
2. Ensure you have not bypassed the Automation Server's `sandbox` mode in your CI tests.
3. Your PR must not degrade CLEAR eval metrics (Cost, Latency, Efficacy, Assurance, Reliability).
