# OpenWiki Interoperability

AKCP does not compete with OpenWiki. Instead, AKCP positions OpenWiki as a primary **documentation target** and an optional **import source**.

## OpenWiki as a Target (`openwiki-docs`)

When compiled with the `openwiki` target, AKCP exports the AK-IR (Agent Knowledge Internal Representation) into an OpenWiki-compatible directory. 

### Characteristics of the Export:
1. **Markdown Preservation**: The output remains plain Markdown.
2. **YAML Frontmatter Preservation**: The original OKF frontmatter is emitted at the top of the OpenWiki Markdown files. This ensures metadata is available for OpenWiki processors.
3. **Index Generation**: An `index.md` file is generated mapping the available concepts.
4. **Metadata Manifest**: A `.akcp/openwiki-metadata.json` file is generated containing:
   - Generation time
   - Source hashes
   - Target type
5. **CI-Friendly Updates**: Because the output is deterministic and uses source hashes, updating the OpenWiki target in CI/CD environments produces a minimal diff.

## OpenWiki as a Source

The `OpenWikiConnector` allows AKCP to ingest existing OpenWiki directories as knowledge sources.
1. AKCP reads the markdown files.
2. If YAML frontmatter exists, it is parsed via the OKF `FrontmatterParser`.
3. If no `type` exists, the concept is assigned a generic `type: Document`.
4. It is then normalized into AK-IR, governed by policies, and compiled into the requested targets.
