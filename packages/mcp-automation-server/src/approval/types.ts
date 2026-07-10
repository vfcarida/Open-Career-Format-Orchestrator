export interface ApprovalPayload {
  toolName: string;
  payloadHash: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
}

export interface PendingApproval {
  token: string;
  toolName: string;
  payloadHash: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
  requesterIdentity?: string;
}

export interface AuditLog {
  id?: number | string;
  timestamp: number;
  action: string;
  toolName: string;
  payloadHash: string;
  metadata?: Record<string, unknown>;
  actorIdentity?: string;
}

export interface IApprovalStore {
  generateToken(toolName: string, payload: unknown, metadata?: Record<string, unknown>, requesterIdentity?: string, ttlMs?: number): string | Promise<string>;
  getPendingApprovals(): PendingApproval[] | Promise<PendingApproval[]>;
  getAuditLogs(limit?: number): AuditLog[] | Promise<AuditLog[]>;
  validateAndConsume(token: string, toolName: string, payload: unknown, actorIdentity?: string): boolean | Promise<boolean>;
  revokeToken(token: string, actorIdentity?: string): boolean | Promise<boolean>;
}
