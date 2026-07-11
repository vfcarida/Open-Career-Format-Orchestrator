import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const cliPath = path.resolve(__dirname, "../../dist/index.js");
const workspaceRoot = path.resolve(__dirname, "../../../..");

describe("CLI Smoke Tests", () => {
  // Ensure the CLI is built before running these tests
  if (!fs.existsSync(cliPath)) {
    console.warn(`[WARN] CLI binary not found at ${cliPath}. Skipping smoke tests.`);
    return;
  }

  const runCli = (args: string) => {
    return execSync(`node ${cliPath} ${args}`, { encoding: "utf-8", stdio: "pipe", cwd: workspaceRoot });
  };

  const runCliError = (args: string) => {
    try {
      execSync(`node ${cliPath} ${args}`, { encoding: "utf-8", stdio: "pipe", cwd: workspaceRoot });
      throw new Error("Expected command to fail");
    } catch (e: any) {
      return e.stderr || e.stdout;
    }
  };

  it("should output help for akcp --help", () => {
    const output = runCli("--help");
    expect(output).toContain("Agent Knowledge Compiler and Control Plane CLI");
    expect(output).toContain("init [options] [directory]");
    expect(output).toContain("validate [options] [directory]");
    expect(output).toContain("compile [options]");
    expect(output).toContain("inspect [options]");
    expect(output).toContain("serve");
    expect(output).toContain("evals");
    expect(output).toContain("conformance");
    expect(output).toContain("docs");
  });

  it("should output help for validate command", () => {
    const output = runCli("validate --help");
    expect(output).toContain("--bundle <directory>");
  });

  it("should output help for compile command", () => {
    const output = runCli("compile --help");
    expect(output).toContain("--config <path>");
  });

  it("should output help for inspect command", () => {
    const output = runCli("inspect --help");
    expect(output).toContain("--artifact <path>");
  });

  it("should fail validation with invalid directory", () => {
    const output = runCliError("validate --bundle does-not-exist");
    expect(output).toContain("Directory not found");
  });

  it("should fail compilation if config is missing", () => {
    const output = runCliError("compile --config does-not-exist");
    expect(output).toContain("Configuration file not found");
  });

  it("should throw error for unsupported targets", () => {
    const tmpFile = path.join(os.tmpdir(), "akcp-test-invalid.yaml");
    fs.writeFileSync(tmpFile, "compile:\n  sources:\n    - path: .\n  targets:\n    - type: invalid-target");
    const output = runCliError(`compile --config ${tmpFile}`);
    expect(output).toContain("Configuration validation failed");
    expect(output).toContain("Invalid enum value");
  });
});
