export type AuditEventType = 
  | "policy-allow"
  | "policy-deny"
  | "approval-required"
  | "approval-created"
  | "approval-consumed"
  | "approval-expired"
  | "policy-error";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: number;
  agentId?: string;
  capabilityId?: string;
  payloadHash?: string;
  metadata?: Record<string, unknown>;
}

export interface IAuditLogService {
  logEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<string>;
  getEvents(limit?: number): Promise<AuditEvent[]>;
}

export class InMemoryAuditLogService implements IAuditLogService {
  private events: AuditEvent[] = [];

  async logEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<string> {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const fullEvent: AuditEvent = {
      ...event,
      id,
      timestamp: Date.now()
    };
    this.events.push(fullEvent);
    return id;
  }

  async getEvents(limit: number = 100): Promise<AuditEvent[]> {
    return this.events.slice(-limit);
  }
}
