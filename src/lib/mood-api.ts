import { apiFetch } from "@/lib/api";
import type { LogMoodRequest, MoodInsightsResponse, MoodStreak } from "@/types/domain";

interface MoodEntry extends LogMoodRequest {
  id: string;
  recordedAt: string;
}

interface MoodHistoryResponse {
  entries: MoodEntry[];
  total: number;
  page: number;
  limit: number;
}

// Therapist-only patient mood summary — no raw journal notes.
interface MoodReport {
  userId: string;
  avgMoodScore: number;
  entryCount: number;
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `?${query}` : "";
}

// POST /api/v1/mood/log — patient only. Max 10 logs/day (429).
export function logMood(body: LogMoodRequest): Promise<MoodEntry> {
  return apiFetch("/api/v1/mood/log", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// GET /api/v1/mood/history — patient only, paginated.
export function fetchMoodHistory(params: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<MoodHistoryResponse> {
  return apiFetch(`/api/v1/mood/history${toQueryString(params)}`);
}

// GET /api/v1/mood/insights — patient only. Redis-cached for 1 hour server-side.
export function fetchMoodInsights(): Promise<MoodInsightsResponse> {
  return apiFetch("/api/v1/mood/insights");
}

// GET /api/v1/mood/streak — patient only.
export function fetchMoodStreak(): Promise<MoodStreak> {
  return apiFetch("/api/v1/mood/streak");
}

// GET /api/v1/mood/report/:userId — therapist only. 404 if no data in last 30 days.
export function fetchMoodReport(userId: string): Promise<MoodReport> {
  return apiFetch(`/api/v1/mood/report/${userId}`);
}
