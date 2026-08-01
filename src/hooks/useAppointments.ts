import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  fetchAvailability,
  fetchMyAppointments,
  fetchTherapistSchedule,
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

export function useTherapistSchedule(date?: string) {
  return useQuery({
    queryKey: ["appointments", "schedule", date],
    queryFn: () => fetchTherapistSchedule({ date, limit: 100 }),
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmAppointment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments", "schedule"] }),
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeAppointment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments", "schedule"] }),
  });
}
