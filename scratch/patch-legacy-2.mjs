import fs from "fs";
import path from "path";

const workspaceRoot = "C:/Users/vinicius/Documents/GeminiCode/Open-Career-Format-Orchestrator";

const filesToPatch = [
  "docs/rfcs/RFC-001-ocf-profile-v1.md",
  "docs/rfcs/RFC-002-enterprise-domain-adapters.md",
  "docs/security/automation-safety.md",
  "docs/security/mcp-security.md",
  "docs/security/threat-model.md",
  "docs/specs/compatibility-levels.md",
  "packages/mcp-automation-server/src/errors.ts",
  "packages/mcp-profile-server/src/errors.ts",
  "packages/test-fixtures/bundles/valid-profile-v1/projects/index.md",
  "packages/test-fixtures/bundles/valid-profile-v1/projects/open-career-format.md",
  "sample-data/.okf/projects/index.md",
  "sample-data/.okf/projects/open-career-format.md"
];

const replacements = [
  { search: /OCF-profile-compatible/g, replace: "AKCP-profile-compatible" },
  { search: /OCF/g, replace: "AKCP" },
  { search: /Open-Career-Format-Orchestrator/g, replace: "Agent-Knowledge-Compiler-and-Control-Plane" },
  { search: /open-career-format/g, replace: "agent-knowledge-compiler" },
  { search: /open-career/g, replace: "akcp" }
];

for (const file of filesToPatch) {
  const filePath = path.join(workspaceRoot, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");
    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Patched ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
}
