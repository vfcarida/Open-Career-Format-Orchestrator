import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/core',
  'packages/mcp-profile-server',
  'packages/mcp-automation-server',
  'packages/evals'
]);
