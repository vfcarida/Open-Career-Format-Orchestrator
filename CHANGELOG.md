# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Google Gemma 4 local inference support via Ollama endpoints.
- Specialised OKF Zod schemas for all 7 career types.
- Dedicated `@ocf/mcp-profile-server` for read-only filesystem querying.
- Dedicated `@ocf/mcp-automation-server` for human-in-the-loop Playwright tasks.
- OpenTelemetry tracking NodeSDK for MCP tool executions and filesystem actions.
- Bundle migration utility `migrate-bundle.ts` supporting OCF Profile v1 transitions.

### Changed
- Converted `@ocf/mcp-server` package into a compatibility façade layer.
- Upgraded root `pnpm-workspace.yaml` with dependency catalogs.

### Security
- Expose Human-In-The-Loop gate controls to prevent unintended job applications.
