export function getBookNowHref(therapistId: string, isAuthenticated: boolean) {
  const intended = `/appointments/book/${therapistId}`;
  if (isAuthenticated) return intended;
  return `/signup?returnUrl=${encodeURIComponent(intended)}`;
}

// Booking routes are keyed by the therapist's userId (what Appointment
// Service books against), not TherapistProfile.id.
export function findBookableTherapist<T extends { userId: string }>(
  therapists: T[] | undefined,
  userId: string
): T | undefined {
  return therapists?.find((therapist) => therapist.userId === userId);
}

export function safeReturnUrl(value: string | null | undefined, fallback = "/today") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
