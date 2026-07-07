/**
 * @module index
 * @description Entrypoint for the MCP Profile Server.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'node:path';
import {
  FileSystemAdapter,
  FrontmatterParser,
  OKFFileRepository,
  IndexService,
  LogService,
  OKFDocumentService,
  startTelemetry,
} from '@ocf/core';
import { OCFMcpProfileServer } from './server.js';

async function main() {
  try {
    // Start telemetry NodeSDK
    startTelemetry();

    const bundleRootEnv = process.env['OCF_BUNDLE_PATH'] || './.okf';
    const bundleRoot = path.resolve(bundleRootEnv);

    console.error(`[OCF Profile Server] Initializing bundle at: ${bundleRoot}`);

    const fsAdapter = new FileSystemAdapter();
    const fmParser = new FrontmatterParser();

    await fsAdapter.mkdir(bundleRoot);
    const repo = new OKFFileRepository(fsAdapter, fmParser, bundleRoot);
    const indexService = new IndexService(fsAdapter, fmParser, bundleRoot);
    const logService = new LogService(fsAdapter, path.join(bundleRoot, 'log.md'));
    const docService = new OKFDocumentService(repo, indexService, logService, bundleRoot);

    const mcpProfileServer = new OCFMcpProfileServer(docService);
    const serverInstance = mcpProfileServer.getServerInstance();

    const transport = new StdioServerTransport();
    await serverInstance.connect(transport);

    console.error('[OCF Profile Server] Successfully connected via stdio transport.');
  } catch (error) {
    console.error('[OCF Profile Server] Fatal startup error:', error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[OCF Profile Server] Unhandled rejection:', err);
  process.exit(1);
});
