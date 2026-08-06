import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMoodInsights, fetchMoodReport, fetchMoodStreak, logMood } from "@/lib/mood-api";
import type { LogMoodRequest } from "@/types/domain";

export function useMoodInsights() {
  return useQuery({
    queryKey: ["mood", "insights"],
    queryFn: fetchMoodInsights,
  });
}

export function useMoodStreak() {
  return useQuery({
    queryKey: ["mood", "streak"],
    queryFn: fetchMoodStreak,
  });
}

// Therapist only. 404 means no mood data for this patient in the last 30 days -
// callers should treat that as an empty state, not an error banner.
export function useMoodReport(userId: string | null) {
  return useQuery({
    queryKey: ["mood", "report", userId],
    queryFn: () => fetchMoodReport(userId as string),
    enabled: !!userId,
    retry: false,
  });
}

export function useLogMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LogMoodRequest) => logMood(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}
