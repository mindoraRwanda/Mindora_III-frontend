export type UserRole = "PATIENT" | "THERAPIST" | "ADMIN";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type SessionType = "VIDEO" | "AUDIO" | "CHAT";

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

export interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  relateCount: number;
  postedAgo: string;
}
