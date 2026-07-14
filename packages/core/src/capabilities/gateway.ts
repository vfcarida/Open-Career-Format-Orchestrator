import type { CapabilityRequest } from "./request.js";
import type { PolicyCard } from "../policy/types.js";
import { evaluatePolicy } from "../policy/evaluate.js";
import type { IApprovalStore } from "./approval-store.js";

export class MCPGatewayError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly data?: any,
  ) {
    super(message);
    this.name = "MCPGatewayError";
  }
}

import type { IAuditLogService } from "../infrastructure/audit-log.js";
import crypto from "crypto";

export interface GatewayConfig {
  policies: Record<string, PolicyCard>; // Map of agentId -> PolicyCard
  defaultPolicy?: PolicyCard;
  approvalStore?: IApprovalStore;
  auditLogService?: IAuditLogService;
}

export class MCPGateway {
  constructor(private config: GatewayConfig) {}

  public async execute<T>(
    request: CapabilityRequest,
    executor: () => Promise<T>,
  ): Promise<T> {
    const policy = this.resolvePolicy(request.agentId);
    const requestId = crypto.randomUUID();
    const payloadHash = crypto.createHash('sha256').update(JSON.stringify(request.payload || {})).digest('hex');

    if (!policy) {
      if (this.config.auditLogService) {
        await this.config.auditLogService.logEvent({ type: "policy-error", agentId: request.agentId, capabilityId: request.toolName });
      }
      throw new MCPGatewayError(
        `Unauthorized: No valid policy found for agent '${request.agentId || "anonymous"}'.`,
        "UNAUTHORIZED_AGENT",
      );
    }

    // Evaluate Policy
    const evalResult = evaluatePolicy(policy, {
      toolName: request.toolName,
      sideEffect: request.sideEffect,
    });

    if (!evalResult.allowed) {
      if (this.config.auditLogService) {
        await this.config.auditLogService.logEvent({ type: "policy-deny", agentId: request.agentId, capabilityId: request.toolName, payloadHash, metadata: { reason: evalResult.reason } });
      }
      throw new MCPGatewayError(
        `[LLM06: Excessive Agency] Policy Violation: ${evalResult.reason}`,
        "POLICY_VIOLATION",
      );
    }

    if (this.config.auditLogService) {
      await this.config.auditLogService.logEvent({ type: "policy-allow", agentId: request.agentId, capabilityId: request.toolName, payloadHash });
    }

    // Evaluate HITL requirement
    if (evalResult.requirements?.approvalRequired) {
      if (!this.config.approvalStore) {
        throw new MCPGatewayError(
          `[LLM06: Excessive Agency] Policy Violation: Tool requires approval, but no ApprovalStore is configured.`,
          "POLICY_VIOLATION",
        );
      }

      const payloadObj = (request.payload as Record<string, unknown>) || {};
      const token = payloadObj._approvalToken as string | undefined;
      
      // Clean up token from payload so it doesn't affect hash verification
      const cleanPayload = { ...payloadObj };
      delete cleanPayload._approvalToken;
      const cleanPayloadHash = crypto.createHash('sha256').update(JSON.stringify(cleanPayload)).digest('hex');

      if (!token) {
        if (this.config.auditLogService) {
          await this.config.auditLogService.logEvent({ type: "approval-required", agentId: request.agentId, capabilityId: request.toolName, payloadHash: cleanPayloadHash });
        }
        // No token provided, generate one and throw APPROVAL_REQUIRED
        const generatedToken = await this.config.approvalStore.generateToken(
          requestId,
          request.toolName,
          cleanPayloadHash,
          "high", // default risk level
          request.sideEffect,
          request.agentId || "anonymous",
          { payload: cleanPayload },
        );
        if (this.config.auditLogService) {
          await this.config.auditLogService.logEvent({ type: "approval-created", agentId: request.agentId, capabilityId: request.toolName, payloadHash: cleanPayloadHash, metadata: { token: generatedToken } });
        }
        throw new MCPGatewayError(
          `Approval Required. The execution of '${request.toolName}' has been paused and requires human authorization. Provide this token to the user: ${generatedToken}`,
          "APPROVAL_REQUIRED",
          { approvalToken: generatedToken },
        );
      }

      // Token provided, validate it
      const isValid = await this.config.approvalStore.validateAndConsume(
        token,
        request.toolName,
        cleanPayloadHash,
        request.agentId,
      );
      if (!isValid) {
        if (this.config.auditLogService) {
          await this.config.auditLogService.logEvent({ type: "approval-expired", agentId: request.agentId, capabilityId: request.toolName, payloadHash: cleanPayloadHash });
        }
        throw new MCPGatewayError(
          `[LLM06: Excessive Agency] Policy Violation: Invalid, expired, or tampered approval token: ${token}`,
          "POLICY_VIOLATION",
        );
      }
      
      if (this.config.auditLogService) {
        await this.config.auditLogService.logEvent({ type: "approval-consumed", agentId: request.agentId, capabilityId: request.toolName, payloadHash: cleanPayloadHash });
      }

      // Ensure execution continues with the cleaned payload
      request.payload = cleanPayload;
    }

    try {
      const result = await executor();

      // Post-execution sanitization
      if (evalResult.requirements?.piiHandling === "redact") {
        return this.sanitizeOutput(result);
      }

      if (evalResult.requirements?.piiHandling === "deny") {
        if (this.containsPII(result)) {
          throw new MCPGatewayError(
            `[LLM06: Sensitive Information] Policy Violation: PII detected in output for tool '${request.toolName}' while policy dictates 'deny'.`,
            "POLICY_VIOLATION",
          );
        }
      }

      return result;
    } catch (err: any) {
      if (err instanceof MCPGatewayError) throw err;
      throw new MCPGatewayError(
        `Execution Failed: ${err.message}`,
        "EXECUTION_ERROR",
      );
    }
  }

  private resolvePolicy(agentId?: string): PolicyCard | undefined {
    if (agentId && this.config.policies[agentId]) {
      return this.config.policies[agentId];
    }
    return this.config.defaultPolicy;
  }

  private sanitizeOutput<T>(output: T): T {
    const str = JSON.stringify(output);
    // Extremely basic redaction for emails/SSNs as an example
    const redacted = str
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]")
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[REDACTED_EMAIL]",
      );
    return JSON.parse(redacted) as T;
  }

  private containsPII(output: any): boolean {
    const str = JSON.stringify(output);
    const hasSSN = /\b\d{3}-\d{2}-\d{4}\b/.test(str);
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(
      str,
    );
    return hasSSN || hasEmail;
  }
}
