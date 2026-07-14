import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { DashboardMetadataTarget } from "../../targets/dashboard-metadata.js";
import type { AgentKnowledgeIR } from "../../ir/types.js";

describe("DashboardMetadataTarget", () => {
  const testDir = path.join(process.cwd(), "test-dist");
  const testFile = path.join(testDir, "dashboard-metadata.json");

  beforeEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it("should generate dashboard metadata from IR", async () => {
    const ir: AgentKnowledgeIR = {
      bundleId: "test-bundle",
      concepts: [
        { conceptId: "concept-1", type: "skill", data: {}, relations: [] },
        { conceptId: "concept-2", type: "experience", data: {}, relations: [] }
      ],
      capabilities: [
        { name: "test-tool", description: "test", inputSchema: { type: "object", properties: {} }, sideEffect: "none" }
      ],
      links: [],
      metadata: { createdAt: new Date().toISOString() }
    };

    const target = new DashboardMetadataTarget();
    const result = await target.compile(ir, { type: "dashboard-metadata", out: testFile });

    expect(result.targetType).toBe("dashboard-metadata");
    expect(result.outputPath).toBe(testFile);
    expect(fs.existsSync(testFile)).toBe(true);

    const data = JSON.parse(fs.readFileSync(testFile, "utf-8"));
    expect(data.bundleId).toBe("test-bundle");
    expect(data.conceptsCount).toBe(2);
    expect(data.capabilitiesCount).toBe(1);
    expect(data.health.status).toBe("healthy");
    expect(data.concepts.length).toBe(2);
    expect(data.capabilities.length).toBe(1);
  });
});
