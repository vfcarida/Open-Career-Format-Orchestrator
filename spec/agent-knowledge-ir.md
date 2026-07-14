# Agent Knowledge Internal Representation (AK-IR)

AK-IR is the central normalized data model used by the AKCP compiler pipeline. It is not intended to be a human-authored format. Producers author OKF (Markdown + YAML) or OpenWiki, and AKCP compiles them into AK-IR before generating targets.

## Purpose
- **Decoupling**: Separates raw source parsing from target generation.
- **Enrichment**: Provides a layer to attach budget (token counts), policy decisions, and provenance without modifying original source files.
- **Portability**: Provides a standardized TypeScript interface (`AgentKnowledgeIR`) that compiler plugins can rely on.

## Core Schema (`AgentKnowledgeIR`)

```typescript
export interface AgentKnowledgeIR {
  irVersion: string;
  okfVersion: string;
  bundleId: string;
  buildId: string;
  timestamp: string;
  
  // The normalized documents
  concepts: IRConcept[];
  
  // Extracted relationships
  links?: IRLink[];
  
  // MCP capability registry
  capabilities?: Capability[];
  
  // High-level bundle policies
  policies?: IRPolicies;
  
  // Output targets
  targets?: string[];
  
  // Fast-path incremental compilation
  sourceHashes?: Record<string, string>;
}
```

## Neutrality
AK-IR is strictly domain-neutral. It defines `frontmatter: Record<string, any>` for concepts. It does not enforce schema rules like `Skill` or `Experience`—those rules belong to the Conformance checks or specific domains. Any unknown OKF key is passed directly into the AK-IR.
