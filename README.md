# 🌌 Open Career Format Orchestrator (OCF)

<p align="center">
  <img src="https://img.shields.io/badge/Spec-OKF%20v0.1-6366f1?style=for-the-badge" alt="OKF Spec Badge" />
  <img src="https://img.shields.io/badge/Protocol-MCP%20v1.0-06b6d4?style=for-the-badge" alt="MCP Protocol Badge" />
  <img src="https://img.shields.io/badge/Monorepo-pnpm-a855f7?style=for-the-badge" alt="Pnpm Monorepo Badge" />
  <img src="https://img.shields.io/badge/Tests-52%20Passed-emerald?style=for-the-badge" alt="Tests Badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License Badge" />
</p>

<p align="center">
  <strong>Transforming static professional history and job applications into a living, semantic, local-first knowledge graph.</strong>
</p>

---

## 🎯 Strategic Overview

Modern career hunting is fragmented, repetitive, and siloed in proprietary databases. The **Open Career Format Orchestrator (OCF)** resolves this by turning the candidate's trajectory into an interoperable semantic database. Built on top of Google Cloud's **Open Knowledge Format (OKF)** specification and Anthropic's **Model Context Protocol (MCP)**, OCF decouples career metadata from centralized platforms.

Every skill, certificate, preference, and job application is stored locally as human-readable Markdown with structured YAML frontmatter. The system operates as a unified monorepo divided into three specialized layers:
*   **The Engine (`@ocf/core`)**: Pure domain logic and filesystem adapters.
*   **The Brain (`@ocf/mcp-server`)**: Model Context Protocol transport layer connecting career context and browser automation tools to AI models.
*   **The Lens (`@ocf/dashboard`)**: A visual Single Page Application rendering interactive Kanban pipelines and connection graphs locally in the browser with absolute privacy.

---

## 📌 Table of Contents

1. [Features](#-features)
2. [Architecture & Monorepo Structure](#-architecture--monorepo-structure)
3. [Prerequisites & Setup](#-prerequisites--setup)
4. [Quick Start](#-quick-start)
5. [Claude Desktop Integration](#-claude-desktop-integration)
6. [OKF Career Types Rationale](#-okf-career-types-rationale)
7. [Playwright Session Strategy](#-playwright-session-strategy)
8. [License](#-license)

---

## ✨ Features

*   **Semantic Interoperability**: Adheres strictly to the **OKF v0.1 spec** for progressive disclosure and machine readability.
*   **Model Context Protocol (MCP) native**: Directly connects candidate records to LLM clients (e.g. Claude, Cursor) as tools.
*   **Automated Job Funnel**: Orchestrates headless browsers (Playwright) to fill out applications and registers submissions into `.okf/applications/` and `log.md`.
*   **D3.js Force Connection Graph**: Automatically maps relationships between registered skills and companies where they were utilized.
*   **Privacy-by-Design**: Operates entirely local-first. Zero tracking, zero remote database servers, absolute data sovereignty.

---

## 🏗️ Architecture & Monorepo Structure

```
├── packages/
│   ├── core/           # Layer 1: Core domain models, repository, parser, services & tests
│   ├── mcp-server/     # Layer 2: MCP server registering tools and Playwright automation
│   └── dashboard/      # Layer 3: React Dashboard SPA + D3.js Graph + Tailwind CSS v4
├── sample-data/
│   └── .okf/           # Dummy local candidate career bundle dataset
├── package.json        # Workspace configuration
└── tsconfig.base.json  # Shared TypeScript root references
```

---

## ⚙️ Prerequisites & Setup

### Prerequisites
*   **Node.js**: `>= 20.0`
*   **pnpm**: `>= 9.0` (Run `npx pnpm` if not globally installed)

### Setup
Install workspace dependencies (build scripts are bypassed for security):
```bash
npx pnpm install --ignore-scripts
```

### Build Packages
Build all subprojects using TypeScript project references:
```bash
npx pnpm --filter @ocf/core build
npx pnpm --filter @ocf/mcp-server build
npx pnpm --filter @ocf/dashboard build
```

### Run Tests
Execute the Vitest test suites (all 52 tests green):
```bash
npx pnpm test
```

---

## 🚀 Quick Start

### 1. Run the MCP Server
To boot the stdio server connecting to an AI client:
```bash
# Set custom bundle root directory path (defaults to ./.okf)
export OCF_BUNDLE_PATH="./sample-data/.okf"

# Start in development mode (using tsx)
pnpm --filter @ocf/mcp-server dev
```

### 2. Run the React Dashboard
To open the visualization suite:
```bash
pnpm --filter @ocf/dashboard dev
```
Open `http://localhost:5173/` in your browser, click **Select .okf Directory**, and point the file dialog to `sample-data/.okf/` (or your own catalog folder).

---

## 🔌 Claude Desktop Integration

To register OCF as a server in **Claude Desktop**, add the following entry to your `claude_desktop_config.json`:

### macOS / Linux
`~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "open-career-format-orchestrator": {
      "command": "node",
      "args": [
        "/absolute/path/to/Open-Career-Format-Orchestrator/packages/mcp-server/dist/index.js"
      ],
      "env": {
        "OCF_BUNDLE_PATH": "/absolute/path/to/your/career-bundle/.okf"
      }
    }
  }
}
```

### Windows
`%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "open-career-format-orchestrator": {
      "command": "node",
      "args": [
        "C:\\absolute\\path\\to\\Open-Career-Format-Orchestrator\\packages\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "OCF_BUNDLE_PATH": "C:\\absolute\\path\\to\\your\\career-bundle\\.okf"
      }
    }
  }
}
```

Once loaded, Claude gains access to 3 core semantic tools:
1.  `read_career_context`: Feeds skills, experiences, and applications into context.
2.  `tailor_resume`: Re-evaluates CV fields against a target vacancy description.
3.  `orchestrate_application`: Automates application submission on platforms.

---

## 🧠 OKF Career Types Rationale

Following the **Open Knowledge Format (OKF)** paradigm, professional metadata is structured as distinct collections. Each record has a required `type` field in its frontmatter, prompting clean semantic boundaries:

| Concept Type | Folder Path | Purpose | Key Metadata Fields |
| :--- | :--- | :--- | :--- |
| **`Skill`** | `skills/*.md` | Models technical and core competencies | `level`, `yearsOfExperience`, `category` |
| **`Experience`** | `experiences/*.md` | Models professional roles and job history | `company`, `role`, `startDate`, `endDate`, `current` |
| **`Education`** | `education/*.md` | Models academic credentials and studies | `institution`, `degree`, `field`, `location` |
| **`Preference`** | `preferences/*.md` | Models target search parameters and limits | `locations`, `remote`, `salaryRange`, `roles` |
| **`Application`** | `applications/*.md` | Tracks candidates' pipeline funnel | `platform`, `status`, `appliedAt`, `url` |
| **`Certificate`** | `certificates/*.md` | Tracks verified certifications | `issuer`, `dateObtained`, `credentialId`, `url` |
| **`Project`** | `projects/*.md` | Models portfolio items and contributions | `url`, `technologies`, `startDate` |

### The Methodology Behind the Architecture
*   **Progressive Disclosure**: Placing documents in separate categorical directories allows AI models to parse only what is requested (e.g., loading only `skills` and `preferences`), optimizing context window usage.
*   **Human-in-the-Loop**: The YAML metadata remains strictly structured for parsers, while the body section is raw markdown, making it simple for developers and candidates to edit.

---

## 🛡️ Playwright Session Strategy

Modern job search sites (LinkedIn, Gupy, Indeed) apply aggressive anti-scraping and CAPTCHA limits during login sequences. To prevent candidate accounts from being flagged and ensure seamless form automation, OCF implements a **cookie-persistency and profile strategy**:

### 1. Persistent User Profile (`userDataDir`)
OCF does not store plain text passwords. Instead, it utilizes chromium's persistent context capability:
```typescript
const context = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});
```
This launches a browser context holding local storage, cached profiles, and session cookies. The candidate logs in manually once, and subsequent orchestrator runs proceed authenticated.

### 2. Sandbox Injection
For headless servers running on remote CLI agents, cookies can be exported as a JSON array and injected directly at runtime before accessing platforms:
```typescript
await context.addCookies(sessionCookiesList);
```
This circumvents username/password inputs entirely, preserving absolute credential safety.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute as desired.
