export type UserRole = "PATIENT" | "THERAPIST" | "ADMIN";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type SessionType = "VIDEO" | "IN_PERSON" | "CHAT";

export type JoinReason = "grounded" | "routine" | "reflect";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  streakDays: number;
}

export interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistInitials: string;
  slotStart: string;
  slotEnd: string;
  status: AppointmentStatus;
  sessionType: SessionType;
}

// --- Real backend API types (Appointment Service + User Service) ---
// See src/lib/appointments-api.ts for the endpoints these are fetched from.

export interface TherapistProfile {
  id: string;
  userId: string;
  userName: string | null;
  bio: string | null;
  timezone: string;
  languagePreference: string;
  specialisation: string | null;
  languages: string[];
  isAcceptingPatients: boolean;
  photoUrl: string | null;
}

// The Appointment Service's own appointment shape — distinct from the `Appointment`
// mock type above, which the dashboard pages use with denormalized therapist name/initials
// baked in. This one only carries therapistId (see TherapistProfile.userId to resolve a name).
export interface BookedAppointment {
  id: string;
  patientId: string;
  therapistId: string;
  slotStart: string;
  slotEnd: string;
  sessionType: SessionType;
  status: AppointmentStatus;
  cancellationReason: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  slotStart: string;
  slotEnd: string;
}

export interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  relateCount: number;
  postedAgo: string;
}
