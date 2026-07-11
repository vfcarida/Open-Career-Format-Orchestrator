import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const workspaceRoot = "C:/Users/vinicius/Documents/GeminiCode/Open-Career-Format-Orchestrator";

const FORBIDDEN_REGEX = "(Open Career Format|OCF|Open-Career-Format|Agent-ready|Agent-ready Knowledge|Reference Architecture|ContextOps|open-career|agent-ready|@ocf|ocf-|ocf_|OPEN_CAREER|OPENCAREER)";

const result = spawnSync(
  "git",
  [
    "grep",
    "-E",
    "-l",
    FORBIDDEN_REGEX,
    "--",
    ":(exclude)quality/identity-allowlist.txt",
    ":(exclude)scripts/check-identity.mjs",
    ":(exclude)scratch"
  ],
  { cwd: workspaceRoot, encoding: "utf-8" }
);

if (result.error) {
  console.error("Failed to run git grep:", result.error);
  process.exit(1);
}

const files = result.stdout.split("\n").filter(Boolean);

const replacements = [
  { search: /OCF-profile-compatible/g, replace: "AKCP-profile-compatible" },
  { search: /OCF/g, replace: "AKCP" },
  { search: /Open Career Format/g, replace: "Agent Knowledge Compiler and Control Plane" },
  { search: /Open-Career-Format/gi, replace: "Agent-Knowledge-Compiler-and-Control-Plane" },
  { search: /Agent-ready Knowledge Reference Architecture/gi, replace: "Agent Knowledge Compiler and Control Plane" },
  { search: /Reference Architecture/gi, replace: "Agent Knowledge Compiler and Control Plane" },
  { search: /ContextOps/gi, replace: "AKCP" },
  { search: /open-career-format/gi, replace: "akcp" },
  { search: /open-career/gi, replace: "akcp" },
  { search: /agent-ready/gi, replace: "akcp" },
  { search: /@ocf/gi, replace: "@akcp" },
  { search: /ocf-/gi, replace: "akcp-" },
  { search: /ocf_/gi, replace: "akcp_" },
  { search: /OPEN_CAREER/gi, replace: "AKCP" },
  { search: /OPENCAREER/gi, replace: "AKCP" }
];

for (const file of files) {
  const filePath = path.join(workspaceRoot, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");
    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Patched ${file}`);
  }
}
