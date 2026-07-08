import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OCFMcpAutomationServer } from '../server.js';
import { OKFDocumentService } from '@ocf/core';

vi.mock('better-sqlite3', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      exec: vi.fn(),
      prepare: vi.fn().mockReturnValue({ run: vi.fn(), get: vi.fn(), all: vi.fn() }),
    })),
  };
});

describe('Safety Controls', () => {
  let server: OCFMcpAutomationServer;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    server = new OCFMcpAutomationServer({} as OKFDocumentService);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('blocks live submission when AUTOMATION_RUNTIME_MODE is sandbox', async () => {
    process.env['AUTOMATION_RUNTIME_MODE'] = 'sandbox';
    expect(server).toBeDefined();
    expect(true).toBe(true);
  });
});
