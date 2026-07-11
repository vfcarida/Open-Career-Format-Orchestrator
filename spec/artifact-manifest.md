# Artifact Manifest Specification

> **Status:** DRAFT — v0.1.0-draft  
> **Spec Section:** MANIFEST-1

## 1. Introduction

The Artifact Manifest is a machine-readable file (`akcp-manifest.json`) generated alongside every compiled AKCP output. It provides a complete bill-of-materials for the compilation, enabling downstream tools to verify integrity, trace provenance, and understand the structure of the produced artifacts.

## 2. Schema

```json
{
  "schemaVersion": "akcp.artifact-manifest/v1",
  "buildId": "<uuid>",
  "createdAt": "<ISO-8601>",
  "source": {
    "root": "<absolute-path-or-uri>",
    "config": "akcp.yaml",
    "hash": "<sha256-hex>"
  },
  "compiler": {
    "name": "akcp",
    "version": "0.1.0"
  },
  "targets": [
    {
      "name": "mcp-resources",
      "status": "success",
      "outputs": [
        "dist/mcp-resources.json"
      ]
    }
  ],
  "diagnostics": [],
  "conformance": {
    "level": "Level 1: OKF-compatible",
    "checks": []
  }
}
```

### 2.1 Root Fields

| Field             | Type                 | Required    | Description                                     |
| ----------------- | -------------------- | ----------- | ----------------------------------------------- |
| `schemaVersion`   | string               | REQUIRED    | Schema version of the manifest itself (`akcp.artifact-manifest/v1`). |
| `buildId`         | string (UUID v4)     | REQUIRED    | Unique ID for this compilation run.             |
| `createdAt`       | string (ISO-8601)    | REQUIRED    | Timestamp of the compilation run.               |
| `source`          | object               | REQUIRED    | Source details (root path, config path, hash).  |
| `compiler`        | object               | REQUIRED    | Compiler name and version.                      |
| `targets`         | array                | REQUIRED    | List of target output records.                  |
| `diagnostics`     | array                | REQUIRED    | List of compilation warnings and errors.        |
| `conformance`     | object               | REQUIRED    | Conformance level and check details.            |

### 2.2 Target Fields

| Field       | Type                 | Required    | Description                            |
| ----------- | -------------------- | ----------- | -------------------------------------- |
| `name`      | string               | REQUIRED    | The target ID (e.g., `mcp-resources`). |
| `status`    | string               | REQUIRED    | `success`, `failed`, or `skipped`.     |
| `outputs`   | array of strings     | REQUIRED    | File paths produced by this target.    |

## 3. Usage

Downstream tools (CI pipelines, MCP servers, audit systems) MUST use the `source.hash` and output integrity properties to verify the integrity of a compiled bundle before loading it into production. The `conformance.level` SHOULD be asserted by downstream systems.
