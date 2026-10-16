import type { PublicTherapistProfile } from "@/types/domain";

// What the public therapist pages render. Built only from User Service's
// public directory (see public-therapists-api.ts) - no ratings, prices or
// availability, since no backend service exposes those for therapists.
export interface Therapist {
  // The therapist's userId: what the profile route, booking route and
  // Appointment Service all key on.
  id: string;
  name: string;
  photo?: string;
  bio: string[];
  languages: string[];
  specialisations: string[];
}

export const SPECIALISATION_OPTIONS = [
  "Depression",
  "Anxiety",
  "OCD",
  "PTSD",
  "Trauma",
  "Stress",
  "Addiction",
  "Couple therapy",
  "Mood disorder",
  "Eating disorder",
] as const;

// TherapistProfile.specialisation is one free-text column; therapists list
// several approaches in it separated by commas or semicolons.
function splitSpecialisation(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function toTherapist(profile: PublicTherapistProfile): Therapist {
  return {
    id: profile.userId,
    name: profile.userName?.trim() || "Mindora therapist",
    photo: profile.photoUrl ?? undefined,
    bio: splitParagraphs(profile.bio),
    languages: profile.languages ?? [],
    specialisations: splitSpecialisation(profile.specialisation),
  };
}

export function therapistInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Same semantics as GET /therapists' specialisation filter (case-insensitive
// substring), loosened to also match singular/plural forms of the fixed
// options above against free-text values.
export function matchesSpecialisation(specialisations: string[], query: string | null | undefined) {
  if (!query || query === "Others") return true;
  const normalised = query.toLowerCase().replace(/s$/, "");
  return specialisations.some((item) => {
    const value = item.toLowerCase();
    return value.includes(normalised) || normalised.includes(value.replace(/s$/, ""));
  });
}
