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

// Opt-out model — all three channels default to true.
export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface UpdateProfileRequest {
  userName?: string;
  bio?: string;
  timezone?: string;
  languagePreference?: string;
}

export interface UserPreferencesResponse {
  fcmToken: string | null;
  email: string | null;
  phoneNumber: null; // not currently collected, per the spec
  userName: string | null;
  notificationPreferences: NotificationPreferences;
}

export interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  relateCount: number;
  postedAgo: string;
}

// --- Real backend API types (Mood Tracking Service) ---
// See src/lib/mood-api.ts. Response shapes for everything but LogMoodRequest aren't
// schema'd in the service's OpenAPI spec (prose descriptions only) — treat these as
// best-effort until verified against a running backend.

export interface LogMoodRequest {
  moodScore: number;
  emotions?: string[];
  sleepHours?: number;
  stressLevel?: number;
  energyLevel?: number;
  journalNote?: string;
  triggers?: string[];
}

// Verified against the live API — field is `streak`, not `currentStreak`.
export interface MoodStreak {
  streak: number;
  lastCheckedIn: string | null;
}

// One 7-day TimescaleDB time_bucket, per the /insights description.
export interface WeeklyMoodBucket {
  bucketStart: string;
  avgMood: number;
  avgSleep: number;
  avgStress: number;
  avgEnergy: number;
}

export interface MoodInsightsResponse {
  buckets: WeeklyMoodBucket[];
  trend: "improving" | "stable" | "declining";
}

// --- Real backend API types (AI Integration Service) ---

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  crisisLevel?: number;
}

export interface ChatResponse {
  response: string;
  crisisLevel: number;
  sessionId: string | null;
}

// crisisLevel is always 5 and sessionId always null — the AI provider is bypassed entirely.
export interface CrisisChatResponse {
  response: string;
  crisisLevel: 5;
  sessionId: null;
}

// --- Real backend API types (Admin Service) ---

export interface AdminUserRecord {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  actionType: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  eventType: "AI_CRISIS" | "MOOD_CONCERN";
  severity: "HIGH" | "MEDIUM" | "LOW";
  payload: Record<string, unknown>;
  resolved: boolean;
  createdAt: string;
}

// Every field is null (never 0) if that specific dependent service was unreachable —
// the endpoint always returns 200, per the /analytics description.
export interface PlatformAnalytics {
  totalUsers: number | null;
  activeUsersLast30Days: number | null;
  totalAppointments: number | null;
  completedAppointments: number | null;
  totalMoodEntries: number | null;
  avgMoodScorePlatform: number | null;
  totalCommunityPosts: number | null;
  totalAiInteractions: number | null;
  totalCrisisEvents: number | null;
}

// --- Real backend API types (Messaging Service) ---
// Schemas only — the service's OpenAPI spec has no documented REST paths (Socket.io only,
// see src/lib/messaging-socket.ts). Best-effort based on the described event payloads.

export interface PresenceStatus {
  userId: string;
  online: boolean;
  lastSeen: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
  readBy?: string | null;
}

export interface ConversationParticipant {
  userId: string;
  userName: string | null;
}

export interface Conversation {
  _id: string;
  participants: string[];
}

export interface ConversationSummary {
  _id: string;
  participant: ConversationParticipant | null;
  unreadCount: number;
  updatedAt: string;
}
