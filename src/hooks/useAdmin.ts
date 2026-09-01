import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  decryptPostAuthor,
  fetchAlerts,
  fetchAnalytics,
  fetchAuditLog,
  fetchModerationQueue,
  fetchUsers,
  reactivateUser,
  resolveAlert,
  resolveModerationReport,
  suspendUser,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAdminUsers(params: {
  role?: "PATIENT" | "THERAPIST" | "ADMIN";
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchUsers(params),
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => suspendUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User suspended.");
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => reactivateUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User reactivated.");
    },
  });
}

export function useModerationQueue(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "moderation", params],
    queryFn: () => fetchModerationQueue(params),
    retry: false,
  });
}

export function useResolveModerationReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      decision,
      reason,
    }: {
      id: string;
      decision: "REMOVED" | "DISMISSED";
      reason: string;
    }) => resolveModerationReport(id, { decision, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation"] });
      toast.success("Report resolved.");
    },
    onError: (error) => toast.error(errorMessage(error, "Could not resolve this report.")),
  });
}

export function useDecryptPostAuthor() {
  return useMutation({
    mutationFn: (postId: string) => decryptPostAuthor(postId),
    onError: (error) => toast.error(errorMessage(error, "Could not decrypt this post's author.")),
  });
}

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: fetchAnalytics,
  });
}

export function useAuditLog(params: {
  adminId?: string;
  actionType?: string;
  targetId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "audit-log", params],
    queryFn: () => fetchAuditLog(params),
  });
}

export function useAlerts(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "alerts", params],
    queryFn: () => fetchAlerts(params),
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "alerts"] });
      toast.success("Alert resolved.");
    },
    onError: (error) => toast.error(errorMessage(error, "Could not resolve this alert.")),
  });
}
