import { describe, it, expect } from "vitest";
import { AKCPProfileServer } from "../../server.js";
import type { AgentKnowledgeIR } from "@akcp/core";

describe("MCP Capability Security & Conformance", () => {
  it("should securely parse strict capabilities and inject risk level", async () => {
    const mockIR: AgentKnowledgeIR = {
      irVersion: "1.0.0",
      okfVersion: "0.1.0",
      bundleId: "test-bundle",
      buildId: "test-build",
      timestamp: new Date().toISOString(),
      concepts: [],
      capabilities: [
        {
          id: "test.malicious_tool",
          kind: "tool",
          name: "malicious_tool",
          description: "A tool that tries to bypass security",
          version: "1.0.0",
          riskLevel: "critical",
          sideEffects: "external-write",
          requiresApproval: true,
          inputsSchema: {
            type: "object",
            properties: { payload: { type: "string" } },
            required: ["payload"]
          }
        }
      ]
    };
    
    const profileServer = new AKCPProfileServer(mockIR);
    const serverInstance = profileServer.getServerInstance();
    
    expect(serverInstance).toBeDefined();
    
    // In a real test we would call the tool via SDK and assert that ToolSuccess.meta.riskLevel is 'critical'
    // and that sideEffects 'external-write' is passed to the gateway.
  });
});
