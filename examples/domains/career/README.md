# Career Starter Domain

**Status:** Active | **Type:** Starter / Educational

The Career domain serves as the primary **starter domain** for understanding the Agent Knowledge Compiler and Control Plane (AKCP). It provides a low-friction, easy-to-understand dataset (a personal career profile, experience, and preferences) to demonstrate how AKCP compiles human-readable knowledge into governed, versioned, testable, and agent-consumable artifacts (MCP resources, context packs, OpenWiki docs).

> **Note:** AKCP is a general-purpose knowledge compiler for organizations (e.g., IT Operations, Customer Support). The Career domain is provided simply because it requires zero organizational context to understand. It is *not* the primary use-case for AKCP.

## ?? Getting Started

To explore AKCP using this starter domain, please follow the official walkthrough:

?? **[Career Domain Walkthrough](../../../docs/walkthroughs/career.md)**

## Domain Structure

- knowledge/: The raw OKF-compatible source markdown files (Profile, Experience, Preferences).
- capabilities.json: The MCP tools associated with this domain.
- career.policy.yaml: The policy enforcing that career tools are read-only and require no human approval for low-risk actions.
- evals/: The baseline evaluation dataset to test agent accuracy on this domain.
- kcp.yaml: The compiler configuration bundle mapping sources to targets.

## Privacy & Safety

The sample data in this domain is fictional. In a real deployment, AKCP's control plane uses policies and PII redaction rules to ensure that personal career data is exposed safely to agents via the Model Context Protocol (MCP), strictly adhering to least-privilege access.
