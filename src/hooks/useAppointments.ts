import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  fetchAvailability,
  fetchMyAppointments,
  rateAppointment,
} from "@/lib/appointments-api";
import type { AppointmentStatus, SessionType } from "@/types/domain";

export function useMyAppointments(status?: AppointmentStatus) {
  return useQuery({
    queryKey: ["appointments", "mine", status],
    queryFn: () => fetchMyAppointments({ status, limit: 50 }),
  });
}

export function useAvailability(therapistId: string | null) {
  return useQuery({
    queryKey: ["availability", therapistId],
    queryFn: () => fetchAvailability(therapistId as string),
    enabled: !!therapistId,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      therapistId: string;
      slotStart: string;
      slotEnd: string;
      sessionType: SessionType;
    }) => bookAppointment(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["availability", variables.therapistId] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
  });
}

export function useRateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => rateAppointment(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
  });
}
