import type { TherapistProfile } from "@/types/domain";
import type { Therapist } from "@/lib/mock-data/therapists";

export function toTherapistCard(profile: TherapistProfile): Therapist {
  const name = profile.userName?.trim() || "Mindora Therapist";
  const specialisations = (profile.specialisation || "General Counselling").split(/[,;/|]/).map((v) => v.trim()).filter(Boolean);
  return {
    id: profile.userId || profile.id,
    userId: profile.userId,
    name,
    title: "MINDORA Therapist",
    photo: profile.photoUrl || undefined,
    bio: profile.bio ? profile.bio.split(/\n\s*\n/).filter(Boolean) : [],
    languages: profile.languages || (profile.languagePreference ? [profile.languagePreference] : []),
    online: false,
    inPerson: false,
    specialisations,
    gender: "unspecified",
    clientsChoice: false,
    availableToday: false,
    availableThisWeek: false,
  };
}
