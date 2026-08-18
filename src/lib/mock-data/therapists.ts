export type TherapistGender = "male" | "female";

export interface Therapist {
  id: string;
  name: string;
  title: string;
  sessions: string;
  rating: number;
  reviews: number;
  specialisations: string[];
  nearest: string;
  price60: number;
  price30: number;
  gender: TherapistGender;
  clientsChoice: boolean;
  availableToday: boolean;
  availableThisWeek: boolean;
  online: boolean;
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

export const THERAPISTS: Therapist[] = [
  {
    id: "1",
    name: "Dr. Aline Uwase",
    title: "Psychologist",
    sessions: "1000+",
    rating: 4.9,
    reviews: 253,
    specialisations: ["Anxiety Disorders", "Depression"],
    nearest: "Tuesday Aug 19 at 10:00 AM",
    price60: 60,
    price30: 45,
    gender: "female",
    clientsChoice: true,
    availableToday: true,
    availableThisWeek: true,
    online: true,
  },
  {
    id: "2",
    name: "Dr. Eric Mugisha",
    title: "Counselling Therapist",
    sessions: "250+",
    rating: 4.7,
    reviews: 127,
    specialisations: ["Mood Disorders", "Anxiety Disorders"],
    nearest: "Thursday Aug 21 at 09:00 AM",
    price60: 37,
    price30: 27,
    gender: "male",
    clientsChoice: false,
    availableToday: false,
    availableThisWeek: true,
    online: true,
  },
  {
    id: "3",
    name: "Dr. Patrick Habimana",
    title: "Psychologist",
    sessions: "1000+",
    rating: 4.83,
    reviews: 249,
    specialisations: ["Anxiety Disorders", "PTSD"],
    nearest: "Monday Aug 18 at 11:15 AM",
    price60: 54,
    price30: 38,
    gender: "male",
    clientsChoice: true,
    availableToday: true,
    availableThisWeek: true,
    online: false,
  },
  {
    id: "4",
    name: "Dr. Diane Ingabire",
    title: "Psychologist",
    sessions: "1000+",
    rating: 4.87,
    reviews: 718,
    specialisations: ["Addiction", "PTSD"],
    nearest: "Sunday Aug 17 at 01:10 PM",
    price60: 52,
    price30: 30,
    gender: "female",
    clientsChoice: true,
    availableToday: false,
    availableThisWeek: true,
    online: true,
  },
  {
    id: "5",
    name: "Dr. Olivier Nzeyimana",
    title: "Psychiatrist",
    sessions: "500+",
    rating: 4.6,
    reviews: 89,
    specialisations: ["Depression", "Stress"],
    nearest: "Wednesday Aug 20 at 02:00 PM",
    price60: 70,
    price30: 50,
    gender: "male",
    clientsChoice: false,
    availableToday: true,
    availableThisWeek: true,
    online: true,
  },
  {
    id: "6",
    name: "Dr. Keza Mukamana",
    title: "Clinical Psychologist",
    sessions: "750+",
    rating: 4.95,
    reviews: 312,
    specialisations: ["Couple therapy", "Mood Disorders"],
    nearest: "Tuesday Aug 19 at 04:30 PM",
    price60: 65,
    price30: 48,
    gender: "female",
    clientsChoice: true,
    availableToday: false,
    availableThisWeek: true,
    online: true,
  },
];

export function therapistInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function matchesSpecialisation(specialisations: string[], query: string | null | undefined) {
  if (!query || query === "Others") return true;
  const normalised = query.toLowerCase().replace(/s$/, "");
  return specialisations.some((item) => {
    const value = item.toLowerCase();
    return value.includes(normalised) || normalised.includes(value.replace(/s$/, ""));
  });
}

export function getTherapistById(id: string) {
  return THERAPISTS.find((therapist) => therapist.id === id);
}
