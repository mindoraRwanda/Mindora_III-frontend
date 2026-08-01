import { apiFetch } from "@/lib/api";
import type { ChatResponse, CrisisChatResponse } from "@/types/domain";

// POST /api/v1/ai/chat — patient only. Every message runs through a keyword-based crisis
// pre-filter (0-5). Level 5 bypasses the AI provider entirely and returns fixed helpline
// copy with sessionId always null.
export function sendChatMessage(body: {
  message: string;
  sessionId?: string | null;
}): Promise<ChatResponse | CrisisChatResponse> {
  return apiFetch("/api/v1/ai/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
