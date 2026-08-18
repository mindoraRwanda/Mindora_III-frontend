import type { LucideIcon } from "lucide-react";
import {
  Annoyed,
  CalendarCheck,
  ClipboardList,
  Frown,
  LayoutGrid,
  Meh,
  RotateCw,
  Syringe,
  Users,
  UtensilsCrossed,
  Video,
} from "lucide-react";

export const HERO_TYPE_CARDS = [
  {
    id: "individual",
    title: "Individual",
    subtitle: "For myself",
    href: "/get-matched",
    className: "bg-[#7C3AED]",
  },
  {
    id: "couples",
    title: "Couples",
    subtitle: "For me and my partner",
    href: "/get-matched",
    className: "bg-[#0F766E]",
  },
  {
    id: "teen",
    title: "Teen",
    subtitle: "For my child",
    href: "/get-matched",
    className: "bg-[#D97706]",
  },
] as const;

export const SPECIALITIES: { label: string; icon: LucideIcon }[] = [
  { label: "Depression", icon: Frown },
  { label: "Mood disorder", icon: Meh },
  { label: "Anxiety disorder", icon: Annoyed },
  { label: "OCD", icon: RotateCw },
  { label: "Addiction", icon: Syringe },
  { label: "Eating disorder", icon: UtensilsCrossed },
  { label: "Couple therapy", icon: Users },
  { label: "Others", icon: LayoutGrid },
];

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Tell us what you need",
    description: "Answer a few gentle questions, or browse therapists and choose someone yourself.",
    icon: ClipboardList,
    image: "/images/landing/how-it-works-1.png",
  },
  {
    step: "2",
    title: "Book a time that fits",
    description:
      "Pick a slot that works for you. Video, audio, or chat — you decide how to connect.",
    icon: CalendarCheck,
    image: "/images/landing/how-it-works-2.png",
  },
  {
    step: "3",
    title: "Start the conversation",
    description: "Meet privately by camera, microphone, or messages — from wherever you feel safe.",
    icon: Video,
    image: "/images/landing/how-it-works-3.png",
  },
] as const;

export const TRUST_STATS = ["10,000+ Patients", "200+ Therapists", "50,000+ Sessions"] as const;

export const MATCH_REASONS = [
  { id: "depression", label: "Depression / Sadness / Low mood" },
  { id: "anxiety", label: "Anxiety / Social anxiety / Panic / OCD tendencies" },
  { id: "anger", label: "Anger issues" },
  { id: "relationships", label: "General relationship conflicts (family, friends, workplace)" },
  { id: "parenting", label: "Parenting difficulties" },
  { id: "growth", label: "Personal growth" },
  { id: "addiction", label: "Substance use / Addiction" },
  { id: "couple", label: "Couple problems" },
  { id: "sleep", label: "Sleep problems" },
  { id: "trauma", label: "Trauma / PTSD" },
  { id: "burnout", label: "Work stress / Burnout" },
  { id: "self", label: "Self-discovery" },
  { id: "child", label: "Child / Adolescent difficulties" },
  { id: "eating", label: "Eating problems / Eating disorders" },
] as const;

export const PUBLIC_NAV_LINKS = [
  { href: "/therapists", label: "Therapists" },
  { href: "/tests", label: "Tests" },
  { href: "/get-matched", label: "Find a Therapist" },
] as const;

export const FOOTER_LINKS = [
  { href: "/therapists", label: "Therapists" },
  { href: "/tests", label: "Tests" },
  { href: "/get-matched", label: "Find a Therapist" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
