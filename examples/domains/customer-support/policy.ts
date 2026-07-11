export default {
  id: "customer-support-policy-v1",
  name: "Customer Support Agent Guardrails",
  rules: [
    {
      id: "CS-001",
      description: "Agents cannot resolve or close tickets autonomously.",
      condition: (context: any) => {
        // Enforce that any MCP capability call for 'resolve_ticket' is blocked
        if (context.toolCall && context.toolCall.name === "resolve_ticket") {
          return false;
        }
        return true;
      },
      severity: "block"
    },
    {
      id: "CS-002",
      description: "All drafted replies must pass PII inspection.",
      condition: (context: any) => {
        if (context.toolCall && context.toolCall.name === "draft_reply") {
          const msg = context.toolCall.arguments?.message || "";
          // Simple mock check: reject if there's a 9 digit string like an SSN
          if (/\b\d{3}[-]?\d{2}[-]?\d{4}\b/.test(msg)) {
            return false;
          }
        }
        return true;
      },
      severity: "block"
    }
  ]
};
