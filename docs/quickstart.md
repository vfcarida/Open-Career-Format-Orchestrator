# Quickstart

Welcome to the Agent Knowledge Compiler and Control Plane (AKCP). This quickstart will help you compile and serve your first context pack in under 5 minutes.

## Prerequisites

- Node.js >= 20.0
- corepack enabled (`corepack enable`)

## 1. Local workspace flow (Recommended)

Since AKCP is not yet published to npm, you must run it directly from source via a local clone.

```bash
# Clone the repository
git clone https://github.com/vfcarida/Agent-Knowledge-Compiler-and-Control-Plane.git akcp
cd akcp

# Setup the environment
pnpm install --frozen-lockfile
pnpm build

# Validate your environment
pnpm akcp doctor
```

## 2. Compile and Serve

AKCP ships with sample data to help you get started.

```bash
# Validate the sample OKF bundle
pnpm akcp validate sample-data/.okf

# Compile the bundle into an Agent Knowledge IR
pnpm akcp compile --bundle sample-data/.okf

# Serve the compiled context to agents via MCP
pnpm akcp serve:mcp sample-data/.okf
```

## Published Package (Planned)

_AKCP is not published to npm yet. Use the local workspace flow above._

## Next Steps

- Read the full [CLI Usage Guide](cli/usage.md).
- Explore the [Example Domains](../examples/domains/).
