import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

const requiredDocs = [
  "README.md",
  "docs/architecture-spec.md",
  "docs/reference/agent-knowledge-ir.md",
  "docs/reference/akcp-yaml.md",
  "docs/reference/policy-cards.md",
  "docs/reference/conformance.md"
];

let hasMissingDocs = false;

for (const doc of requiredDocs) {
  const docPath = path.join(workspaceRoot, doc);
  if (!fs.existsSync(docPath)) {
    console.error(`\x1b[31mMissing required document:\x1b[0m ${doc}`);
    hasMissingDocs = true;
  }
}

if (hasMissingDocs) {
  console.error(`\n\x1b[31m[FAIL]\x1b[0m Required documentation files are missing.`);
  process.exit(1);
} else {
  console.log(`\x1b[32m[PASS]\x1b[0m Document structure check passed.`);
  process.exit(0);
}
