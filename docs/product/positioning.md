# Product Positioning

The Agent Knowledge Compiler and Control Plane (AKCP) sits at the intersection of authoring tools, knowledge formats, and agent runtimes.

## The Ecosystem

- **OpenWiki**: Authors and maintains agent-oriented documentation. It provides a natural editing experience for humans but lacks the rigorous governance and compilation required for enterprise autonomous agents.
- **OKF (Open Knowledge Format)**: Provides a portable representation for knowledge. It defines the structure (Markdown + YAML frontmatter) but relies on external tools to enforce and distribute it.
- **AKCP (Agent Knowledge Compiler and Control Plane)**: Compiles, validates, optimizes, governs, and distributes knowledge artifacts. It bridges the gap between raw unstructured knowledge and akcp context packs.
- **MCP (Model Context Protocol)**: Exposes those compiled artifacts and capabilities to agents dynamically, enforcing zero-trust policies and HITL governance defined by AKCP.
