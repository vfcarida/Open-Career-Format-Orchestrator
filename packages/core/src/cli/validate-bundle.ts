#!/usr/bin/env tsx
/**
 * @module cli/validate-bundle
 * @description Command line utility to validate OKF bundle schemas.
 */

import path from 'node:path';
import { FileSystemAdapter } from '../infrastructure/file-system-adapter.js';
import { FrontmatterParser } from '../infrastructure/frontmatter-parser.js';
import { CareerFrontmatterSchema } from '../domain/schemas.js';

async function main() {
  const bundlePathEnv = process.argv[2] || process.env['OCF_BUNDLE_PATH'] || './.okf';
  const bundlePath = path.resolve(bundlePathEnv);

  console.log(`[OCF Validator] Scanning bundle at: ${bundlePath}`);

  const fsAdapter = new FileSystemAdapter();
  const fmParser = new FrontmatterParser();

  if (!(await fsAdapter.exists(bundlePath))) {
    console.error(`Error: Directory does not exist: ${bundlePath}`);
    process.exit(1);
  }

  const relativeFiles = await fsAdapter.listFiles(bundlePath);
  const RESERVED_FILENAMES = new Set(['index.md', 'log.md']);
  
  let validCount = 0;
  let invalidCount = 0;

  for (const relPath of relativeFiles) {
    if (!relPath.endsWith('.md') || RESERVED_FILENAMES.has(path.basename(relPath))) {
      continue;
    }

    const fullPath = path.join(bundlePath, relPath);
    const content = await fsAdapter.readFile(fullPath);

    try {
      const doc = fmParser.parse(content, fullPath, bundlePath);
      const validation = CareerFrontmatterSchema.safeParse(doc.frontmatter);

      if (validation.success) {
        console.log(`  ✓ [Valid] ${doc.conceptId} (${doc.frontmatter.type})`);
        validCount++;
      } else {
        console.error(`  ✗ [Invalid] ${doc.conceptId} (${doc.frontmatter.type || 'Unknown'}):`);
        console.error(`    Reason: ${validation.error.message}`);
        invalidCount++;
      }
    } catch (err: any) {
      console.error(`  ✗ [Error parsing] ${relPath}:`);
      console.error(`    Reason: ${err.message}`);
      invalidCount++;
    }
  }

  console.log(`\n[OCF Validator] Validation summary:`);
  console.log(`  Valid concepts: ${validCount}`);
  console.log(`  Invalid concepts: ${invalidCount}`);

  if (invalidCount > 0) {
    process.exit(1);
  } else {
    console.log(`[OCF Validator] All checked career records are strictly schema compliant!`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('[OCF Validator] Unhandled exception:', err);
  process.exit(1);
});
