import { apiFetch } from "@/lib/api";
import type {
  AppointmentStatus,
  AvailabilitySlot,
  BookedAppointment,
  SessionType,
  TherapistProfile,
} from "@/types/domain";

interface TherapistListResponse {
  therapists: TherapistProfile[];
  total: number;
  page: number;
  limit: number;
}

interface AppointmentListResponse {
  appointments: BookedAppointment[];
  total: number;
  page: number;
  limit: number;
}

interface AvailabilityResponse {
  therapistId: string;
  slots: AvailabilitySlot[];
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== "all") qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `?${query}` : "";
}

// GET /api/v1/users/therapists — User Service. Only returns isAcceptingPatients: true.
export function fetchTherapists(params: {
  page?: number;
  limit?: number;
  specialisation?: string;
  language?: string;
}): Promise<TherapistListResponse> {
  return apiFetch(`/api/v1/users/therapists${toQueryString(params)}`);
}

// GET /api/v1/appointments/availability/:therapistId — Appointment Service.
// therapistId here is TherapistProfile.userId, not TherapistProfile.id.
export function fetchAvailability(
  therapistId: string,
  params: { from?: string; to?: string } = {}
): Promise<AvailabilityResponse> {
  return apiFetch(`/api/v1/appointments/availability/${therapistId}${toQueryString(params)}`);
}

// GET /api/v1/appointments/mine — Appointment Service, authenticated patient's own appointments.
export function fetchMyAppointments(params: {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
}): Promise<AppointmentListResponse> {
  return apiFetch(`/api/v1/appointments/mine${toQueryString(params)}`);
}

// POST /api/v1/appointments — creates a PENDING appointment. 409 if the slot was just taken.
export function bookAppointment(body: {
  therapistId: string;
  slotStart: string;
  slotEnd: string;
  sessionType: SessionType;
}): Promise<BookedAppointment> {
  return apiFetch("/api/v1/appointments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// PUT /api/v1/appointments/:id/cancel
export function cancelAppointment(
  id: string,
  cancellationReason: string
): Promise<BookedAppointment> {
  return apiFetch(`/api/v1/appointments/${id}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ cancellationReason }),
  });
}

// POST /api/v1/appointments/:id/rate — 422 if the appointment isn't COMPLETED yet.
export function rateAppointment(id: string, rating: number): Promise<BookedAppointment> {
  return apiFetch(`/api/v1/appointments/${id}/rate`, {
    method: "POST",
    body: JSON.stringify({ rating }),
  });
}

// GET /api/v1/appointments/schedule — therapist only. Appointments for the authenticated
// therapist, ordered by slotStart.
export function fetchTherapistSchedule(params: {
  date?: string;
  page?: number;
  limit?: number;
}): Promise<AppointmentListResponse> {
  return apiFetch(`/api/v1/appointments/schedule${toQueryString(params)}`);
}

// PUT /api/v1/appointments/:id/confirm — therapist only. PENDING -> CONFIRMED.
export function confirmAppointment(id: string): Promise<BookedAppointment> {
  return apiFetch(`/api/v1/appointments/${id}/confirm`, { method: "PUT" });
}

// PUT /api/v1/appointments/:id/complete — therapist only.
export function completeAppointment(id: string): Promise<BookedAppointment> {
  return apiFetch(`/api/v1/appointments/${id}/complete`, { method: "PUT" });
}
