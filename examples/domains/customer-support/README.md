# Customer Support Adapter

**Status:** Implemented

This flagship domain provides an AKCP environment tailored for **L1/L2 Customer Support Agents**. 

It demonstrates how AKCP compiles customer support data (FAQs, Macros, Ticket History) into a secure context pack, equipping an AI agent with domain-specific knowledge while enforcing strict operational guidelines and data privacy.

## Scenario

An AI Agent operates as an assistant to human agents or directly interacts with customers. To ensure safe operation, AKCP enforces:
1. **PII Redaction**: Any sensitive information in the source tickets (SSNs, phone numbers) is redacted upon compilation, ensuring the AI model does not ingest raw PII.
2. **Restricted Autonomy**: The `policy.ts` rules actively prevent the AI from resolving tickets autonomously or drafting replies containing accidental PII leaks.
3. **Bounded Capabilities**: The agent is restricted to read-only macros and the ability to *draft* a reply (via `capabilities.json`), requiring human-in-the-loop approval.

## Compilation

To build the `customer-support` bundle, run the AKCP CLI from the root:

```bash
pnpm akcp compile -c examples/domains/customer-support/akcp.yaml
```

### Outputs
- `dist/context-pack.json`: The compiled knowledge pack. Note how PII from `tickets/TKT-1029.md` is redacted.
- `dist/policy-bundle.json`: The compiled policies enforcing guardrails.
- `dist/mcp-resources.json`: Available MCP resources.
- `dist/mcp-tools.json`: Available MCP tools.
- `dist/akcp-manifest.json`: The provenance and conformance signature.
