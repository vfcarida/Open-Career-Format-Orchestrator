# 🌌 Agent-ready Knowledge Reference Architecture

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License Badge" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D%2020.0-emerald?style=for-the-badge" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Spec-OCF%20Profile%20v1.0-6366f1?style=for-the-badge" alt="OCF Spec Badge" />
  <img src="https://img.shields.io/badge/Protocol-MCP%20v1.0-06b6d4?style=for-the-badge" alt="MCP Protocol Badge" />
  <img src="https://img.shields.io/badge/Monorepo-pnpm-a855f7?style=for-the-badge" alt="Pnpm Monorepo Badge" />
  <img src="https://img.shields.io/badge/Tests-56%20Passed-22c55e?style=for-the-badge" alt="Tests Badge" />
</p>

<p align="center">
  <strong>An enterprise-grade reference architecture for building agent-ready organizational knowledge bases using Open Knowledge Format (OKF) and Model Context Protocol (MCP).</strong>
</p>

---

## 📌 Table of Contents

1. [What This Is](#1-what-this-is)
2. [What This Is Not](#2-what-this-is-not)
3. [Current Maturity Status](#3-current-maturity-status)
4. [Target Architecture](#4-target-architecture)
5. [Architecture Decision Map](#5-architecture-decision-map)
6. [OKF Profile Status](#6-okf-profile-status)
7. [MCP Server Status](#7-mcp-server-status)
8. [Automation Safety Status](#8-automation-safety-status)
9. [Security Model](#9-security-model)
10. [Observability Model](#10-observability-model)
11. [Evals Model](#11-evals-model)
12. [Quickstart](#12-quickstart)
13. [Development](#13-development)
14. [Roadmap](#14-roadmap)
15. [Contributing](#15-contributing)

---

## 1. What This Is

* A reference architecture demonstrating how to combine **OKF** (static, typed Markdown) with **MCP** (dynamic agent protocol).
* A demonstration of **Human-in-the-Loop (HITL)** safety boundaries with strict TTL tokens.
* A privacy-by-design approach to personal/enterprise knowledge graphs mapped to the **NIST AI Risk Management Framework**.

## 2. What This Is Not

* A production-ready "job application bot." The browser automation components are strictly for reference and default to sandbox environments.
* An attempt to evade or bypass ATS (Applicant Tracking System) protections.
* A black-box system where LLMs have unchecked autonomy.

---

## 3. Current Maturity Status

| Component | Status | Evidence | Limitation | Next Milestone |
|---|---|---|---|---|
| **OCF Core** | Stable | Tests + schemas | Strict folder structure required | Dynamic folder routing |
| **MCP Profile Server** | Stable | `ToolSuccess<T>` JSON contracts | Read-only | Add advanced search |
| **MCP Automation Server** | Beta | HITL SQLite Approval Store | Needs stronger adversarial tests | Policy hardening |
| **Dashboard** | Alpha | Basic UI exists | Needs complete flows | Bundle health UI |
| **Evals** | Beta | CLEAR metrics harness | Needs regression thresholds | CI integration |

---

## 4. Target Architecture

```text
User / AI Host
  -> MCP Clients (e.g. Claude Desktop)
    -> MCP Profile Server (Port 1)
      -> OCF Core
        -> OKF Bundle (.okf)
    -> MCP Automation Server (Port 2)
      -> Policy Engine
      -> Approval Store (SQLite)
      -> Audit Log
      -> Browser Sandbox / Fixtures
Dashboard
  -> BFF / local API
  -> Bundle health & Validation
Evals
  -> datasets & scenarios
CI/CD
  -> lint / typecheck / contract tests / security scans
```

## 5. Architecture Decision Map
- **ADR-001**: OCF Profile Over OKF (Using strict Markdown with YAML Frontmatter).
- **ADR-002**: Split MCP Servers (Profile Server for Read, Automation Server for Write/External Actions).
- **ADR-003**: SQLite-backed HITL Approval Store with payload hashing and single-use tokens.
- **ADR-004**: Browser Automation defaults to Mock Fixtures.
- **ADR-005**: All MCP Tools return strict JSON `ToolSuccess<T>` or `ToolFailure` structures.

## 6. OKF Profile Status
The Career Profile is strictly typed via `zod`. Types: `Skill`, `Experience`, `Education`, `Certificate`, `Project`, `Preference`, `Application`. All unknown tags are preserved.

## 7. MCP Server Status
All tools output highly structured `ToolSuccess<T>` wrappers with standard `meta` fields (request ID, version, latency).

## 8. Automation Safety Status
Live automation is **DISABLED** by default. `AUTOMATION_RUNTIME_MODE` must be explicitly set to `explicit-authorized-live`. Single-use approval tokens tied to payload hashes are enforced.

## 9. Security Model
We follow the OWASP LLM Top 10 and map to the **NIST AI RMF**. See `docs/security/threat-model.md`.

## 10. Observability Model
All Core and Server operations are instrumented using `@opentelemetry/api`. Spans include `request.id` and `tool.duration_ms`.

## 11. Evals Model
We evaluate agent behavior across CLEAR dimensions: **C**ost, **L**atency, **E**fficacy, **A**ssurance, **R**eliability. See `@ocf/evals`.

---

## 12. Quickstart

### Installation
```bash
git clone https://github.com/vfcarida/agent-ready-knowledge-reference-architecture.git
cd agent-ready-knowledge-reference-architecture
npx pnpm install --frozen-lockfile
npx pnpm build
```

### Validation
```bash
npx pnpm validate:bundle --bundle sample-data/.okf --format json
```

### Claude Desktop Integration
Add the following to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ocf-profile-server": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\repo\\packages\\mcp-profile-server\\dist\\index.js"]
    },
    "ocf-automation-server": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\repo\\packages\\mcp-automation-server\\dist\\index.js"],
      "env": { "AUTOMATION_RUNTIME_MODE": "sandbox" }
    }
  }
}
```

---

## 13. Development
Use the defined CI scripts:
```bash
npx pnpm lint
npx pnpm typecheck
npx pnpm test:contract
```

## 14. Roadmap
- **Short-term**: Dashboard health metrics.
- **Mid-term**: CI/CD Regression gates for Evals.
- **Long-term**: Agentic Capability Registry.

## 15. Contributing
See `CONTRIBUTING.md`. We use **Spec-Driven Development (SDD)**. No AI-credited commits.

---
*Licensed under MIT.*
