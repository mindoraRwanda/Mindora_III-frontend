import { apiFetch } from "@/lib/api";
import type {
  AdminUserRecord,
  AuditLogEntry,
  PlatformAnalytics,
  SystemAlert,
} from "@/types/domain";

interface UserListResponse {
  users: AdminUserRecord[];
  total: number;
  page: number;
  limit: number;
}

interface SuspendReactivateResponse {
  message: string;
  userId: string;
  auditLogId: string;
}

// Community Service isn't deployed in V1, so this proxies to something that's always down —
// callers should expect a 503 in the current environment.
interface ModerationReport {
  id: string;
  postId: string;
  reason: string;
  createdAt: string;
}

interface ModerationQueueResponse {
  reports: ModerationReport[];
  total: number;
  page: number;
  limit: number;
}

interface AlertListResponse {
  alerts: SystemAlert[];
  total: number;
  page: number;
  limit: number;
}

interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `?${query}` : "";
}

// GET /api/v1/admin/users — proxies through User Service to Auth Service.
export function fetchUsers(params: {
  role?: "PATIENT" | "THERAPIST" | "ADMIN";
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<UserListResponse> {
  return apiFetch(`/api/v1/admin/users${toQueryString(params)}`);
}

// PUT /api/v1/admin/users/:id/suspend — blocks the account immediately, revokes refresh tokens.
export function suspendUser(id: string, reason: string): Promise<SuspendReactivateResponse> {
  return apiFetch(`/api/v1/admin/users/${id}/suspend`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
}

// PUT /api/v1/admin/users/:id/reactivate
export function reactivateUser(id: string, reason: string): Promise<SuspendReactivateResponse> {
  return apiFetch(`/api/v1/admin/users/${id}/reactivate`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
}

// GET /api/v1/admin/moderation/queue — proxies live to Community Service (not deployed in V1).
export function fetchModerationQueue(params: {
  page?: number;
  limit?: number;
}): Promise<ModerationQueueResponse> {
  return apiFetch(`/api/v1/admin/moderation/queue${toQueryString(params)}`);
}

// PUT /api/v1/admin/moderation/:id/resolve
export function resolveModerationReport(
  id: string,
  body: { decision: "REMOVED" | "DISMISSED"; reason: string }
): Promise<void> {
  return apiFetch(`/api/v1/admin/moderation/${id}/resolve`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// POST /api/v1/admin/moderation/decrypt/:postId — always audit-logged.
export function decryptPostAuthor(postId: string): Promise<{ userId: string }> {
  return apiFetch(`/api/v1/admin/moderation/decrypt/${postId}`, { method: "POST" });
}

// GET /api/v1/admin/analytics — aggregated in parallel from every service; any field may be
// null if that specific service was unreachable. Always 200.
export function fetchAnalytics(): Promise<PlatformAnalytics> {
  return apiFetch("/api/v1/admin/analytics");
}

// GET /api/v1/admin/audit-log — read-only, immutable.
export function fetchAuditLog(params: {
  adminId?: string;
  actionType?: string;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLogResponse> {
  return apiFetch(`/api/v1/admin/audit-log${toQueryString(params)}`);
}

// GET /api/v1/admin/alerts — unresolved AI_CRISIS / MOOD_CONCERN alerts, newest first.
export function fetchAlerts(params: { page?: number; limit?: number }): Promise<AlertListResponse> {
  return apiFetch(`/api/v1/admin/alerts${toQueryString(params)}`);
}

// PUT /api/v1/admin/alerts/:id/resolve — always a manual admin action.
export function resolveAlert(id: string): Promise<void> {
  return apiFetch(`/api/v1/admin/alerts/${id}/resolve`, { method: "PUT" });
}
