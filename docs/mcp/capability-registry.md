# AKCP MCP Capability Registry Specification

The AKCP Control Plane leverages a structured Capability Registry to enforce safety, governance, and auditability for all tools, resources, and prompts exposed to agents.

## Schema Definition

Every capability registered in AKCP must adhere to the following schema:

```yaml
id: <string>               # Globally unique capability ID (e.g. customer-support.search_kb)
kind: <string>             # resource | tool | prompt
name: <string>             # Name exposed to the agent via MCP
description: <string>      # Description exposed to the agent via MCP
owner: <string>            # Maintainer of the capability
version: <string>          # Semantic version of the capability
riskLevel: <string>        # low | medium | high | critical
sideEffects: <string>      # none | local-write | external-read | external-write | external-submit
requiresApproval: <boolean># True if human-in-the-loop approval is mandated
readsPII: <boolean>        # True if the tool processes PII
writesPII: <boolean>       # True if the tool persists or transmits PII
inputsSchema: <object>     # JSON Schema for tool inputs (tools only)
outputsSchema: <object>    # JSON Schema for tool outputs (tools only)
policyRefs: <string[]>     # Array of policy IDs that govern this capability
```

## Compilation and Exposure

When compiling a domain (`akcp compile`), AKCP parses `capabilities.json` or `capabilities.yaml` and bundles them into the `AgentKnowledgeIR`.
The `mcp-profile-server` then reads these capabilities dynamically and configures the standard MCP `server.tool` and `server.resource` handlers, injecting the appropriate schemas into the MCP SDK.

## Example (JSON)

```json
{
  "id": "it-operations.execute_runbook",
  "name": "execute_runbook",
  "version": "1.0.0",
  "description": "Executes an automated runbook step for incident mitigation.",
  "kind": "tool",
  "riskLevel": "critical",
  "sideEffects": "external-write",
  "requiresApproval": true,
  "readsPII": false,
  "writesPII": false,
  "inputsSchema": {
    "type": "object",
    "properties": {
      "runbookId": { "type": "string" },
      "step": { "type": "string" }
    },
    "required": ["runbookId", "step"]
  }
}
```
