export interface PendingApproval {
  token: string;
  toolName: string;
  payloadHash: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
  requesterIdentity?: string;
  status?: "PENDING" | "APPROVED" | "REVOKED";
}

export interface IApprovalStore {
  generateToken(
    toolName: string,
    payload: unknown,
    metadata?: Record<string, unknown>,
    requesterIdentity?: string,
    ttlMs?: number,
  ): string | Promise<string>;
  getPendingApprovals(): PendingApproval[] | Promise<PendingApproval[]>;
  getAuditLogs(limit?: number): any[] | Promise<any[]>;
  approveToken(
    token: string,
    actorIdentity?: string,
  ): boolean | Promise<boolean>;
  validateAndConsume(
    token: string,
    toolName: string,
    payload: unknown,
    actorIdentity?: string,
  ): boolean | Promise<boolean>;
  revokeToken(
    token: string,
    actorIdentity?: string,
  ): boolean | Promise<boolean>;
}
