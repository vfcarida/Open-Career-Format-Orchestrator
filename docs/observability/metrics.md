# AKCP Metrics Dictionary

The following metrics are exposed via the `@akcp/core` OpenTelemetry Meter:

## Counters

- `akcp_mcp_tool_calls_total`: Total number of MCP tool calls executed.
- `akcp_mcp_tool_failures_total`: Total number of MCP tool calls that resulted in errors.
- `akcp_okf_parse_failures_total`: Total number of YAML/Markdown OKF parse failures.
- `akcp_bundle_validation_failures_total`: Total number of OKF bundle validation errors.
- `akcp_bundle_migrations_total`: Total number of OKF bundle migration processes triggered.
- `akcp_automation_previews_total`: Total number of automation job previews requested.
- `akcp_automation_attempts_total`: Total number of Playwright automation workflows triggered.
- `akcp_automation_approval_required_total`: Total number of job submissions requiring explicit human approval.
- `akcp_automation_submission_blocked_total`: Total number of job submissions blocked by policy or HITL.
- `akcp_automation_submission_success_total`: Total number of successful job submissions registered in bundle.

## Histograms

- `akcp_mcp_tool_duration_ms`: Duration of MCP tool executions in milliseconds.
