import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { ApiError } from "@/lib/api";
import type { AppointmentStatus, SessionType } from "@/types/domain";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

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
      toast.success("Appointment booked.");
    },
    // No onError toast here - BookingDialog already shows this inline, including
    // the distinct 409 "slot just taken" case, which a generic toast would flatten.
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      toast.success("Appointment cancelled.");
    },
  });
}

export function useRateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => rateAppointment(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      toast.success("Rating submitted.");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "schedule"] });
      toast.success("Appointment confirmed.");
    },
    onError: (error) => toast.error(errorMessage(error, "Could not confirm this appointment.")),
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "schedule"] });
      toast.success("Appointment marked complete.");
    },
    onError: (error) => toast.error(errorMessage(error, "Could not complete this appointment.")),
  });
}
